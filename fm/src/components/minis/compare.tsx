/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { html, render } from 'lighterhtml';
import { log } from '@/build/log';
import { auth, page, root } from '@/build/page';
import { clean_number, sanitise } from '@/build/tools';
import { lang, tl, trans } from '@/build/trans';
import { music_grids } from '@/components/music/music_grid';
import { notify, notify_rm } from '@/components/dialog/notify';
import { select } from '@/components/settings/select';
import { patch_titles } from '@/components/music/track';
import { render_user } from '@/pages/home/minis.js';
import { settings } from '@/build/config';
import { redirect } from '@/components/music/music';
import tippy from 'tippy.js';
import { ff } from '@/components/settings/sku';
import { setting } from '@/components/settings/settings';
import { avatar } from '../shared/avatar';
import { useSettings } from '@/page.ts';
import { createRef } from 'jsx-dom';
import { CompareBody, CompareHeader } from '@/components/minis/main.tsx';
import {
	CompareSelection,
	CompareUser,
	CompareUsers,
} from '@/components/minis/user.tsx';
import { Icon, icons } from '@/components/shared/icon.tsx';
import { Select } from '@/components/select/select.tsx';
import { IconLabel } from '@/components/text/text.tsx';
import { HybridTimeframePicker } from '@/components/date/timeframe.tsx';
import { Button } from '@/components/button/button.tsx';
import { Placeholder } from '@/components/loading/placeholder.tsx';
import { PanelHead } from '@/components/text/head.tsx';
import { SettingGroup } from '@/components/settings/group.tsx';
import { SettingStub } from '@/components/settings/provider/stub.tsx';
import { UserSelect } from '@/components/select/user.tsx';
import { SettingSwitch } from '@/components/settings/provider/switch.tsx';
import { LoadingData } from '@/components/loading/loading.tsx';
import { SettingsFooter } from '@/components/form/footer.tsx';
import { header_colour } from '@/components/page/colour.ts';

export function compare({ host, sidebar } = {}) {
	if (!host || !sidebar) return;

	const pages = createRef();
	const timeframe = createRef();
	const type = createRef();

	const submit = createRef();
	const body = createRef();

	if (page.name == auth.name) {
		page.name = '';
		page.avatar = '';
		page.requested.profile = '';
	}

	const current_year = new Date().getFullYear();
	const previous_year = current_year - 1;

	const default_type = page.requested.type || 'albums';
	const default_timeframe = page.requested.timeframe ||
		'date_preset=LAST_90_DAYS';

	const user = createRef();

	const candidate = useSettings.get('starred_friend') as string ||
		(useSettings.get('friends') as string[])[0];

	if (!page.requested.profile && candidate) {
		page.name = candidate;
		page.requested.profile = candidate;
	}

	host.replaceChildren(
		<>
			<CompareBody ref={body} data-filled='false'>
				<Placeholder face='(๑>◡<๑)'>
					{tl(trans.choose_a_timeframe)}
				</Placeholder>
			</CompareBody>
		</>,
	);

	const group = createRef();

	sidebar.replaceChildren(
		<>
			<PanelHead icon={icons.settings}>
				{tl(trans.settings)}
			</PanelHead>
			<div class='inner-preview'>
				<CompareUsers ref={user}>
					<CompareUser name={auth.name!} avatarOnly />
					<Icon />
					<CompareUser
						name={page.name || ''}
						replacePage
					/>
				</CompareUsers>
			</div>
			<SettingGroup ref={group} gap>
				<SettingStub name={tl(trans.compare_with)} type='select'>
					<UserSelect
						showAuth={false}
						inSettings
						value={page.requested.profile || ''}
						onChange={(v) => {
							page.requested.profile = v;
							page.name = v;

							page.avatar = '';

							user.current.replaceChildren(
								<>
									<CompareUser name={auth.name!} avatarOnly />
									<Icon />
									<CompareUser name={v} replacePage />
								</>,
							);
						}}
					/>
				</SettingStub>
				<SettingStub name={tl(trans.page_count)} type='select'>
					<Select
						inSettings
						value='3'
						values={[
							{
								value: '1',
								text: '50 (1x)',
							},
							{
								value: '2',
								text: '100 (2x)',
							},
							{
								value: '3',
								text: '150 (3x)',
							},
							{
								value: '4',
								text: '200 (4x)',
							},
							{
								value: '5',
								text: '250 (5x)',
							},
							{
								value: '6',
								text: '300 (6x)',
							},
						]}
						ref={pages}
					/>
				</SettingStub>
				<SettingStub name={tl(trans.item_type)} type='select'>
					<Select
						inSettings
						value={default_type}
						values={[
							{
								text: tl(trans.item_type),
							},
							{
								value: 'artists',
								text: () => (
									<IconLabel icon={icons.artist}>
										{tl(trans.artists)}
									</IconLabel>
								),
							},
							{
								value: 'albums',
								text: () => (
									<IconLabel icon={icons.album}>
										{tl(trans.albums)}
									</IconLabel>
								),
							},
							{
								value: 'tracks',
								text: () => (
									<IconLabel icon={icons.track}>
										{tl(trans.tracks)}
									</IconLabel>
								),
							},
						]}
						ref={type}
					/>
				</SettingStub>
				<SettingStub name={tl(trans.timeframe)} type='select'>
					<HybridTimeframePicker
						inSettings
						value={default_timeframe}
						ref={timeframe}
					/>
				</SettingStub>
				{ff('inverse_compare') && (
					<SettingSwitch bind='inverse_compare' />
				)}
			</SettingGroup>
			<SettingsFooter gap>
				<Button primary ref={submit} onClick={begin_comparing}>
					<Icon name={icons.compare} />
					{tl(trans.compare)}
				</Button>
			</SettingsFooter>
		</>,
	);

	function begin_comparing(bypass = false) {
		if (page.name == '') return;

		if (parseInt(pages.current.value) > 3 && !bypass) {
			const warn = notify({
				id: 'compare_warning',
				title: tl(trans.are_you_sure),
				body: tl(trans.this_will_require_loading_count_pages).replace(
					'{c}',
					parseInt(pages.current.value) * 2,
				),
				type: 'warning',
				actions: [
					{
						type: 'check',
						action: () => {
							notify_rm(warn);
							begin_comparing(true);
						},
						text: tl(trans.continue),
					},
				],
				persist: true,
			});
			return;
		}

		if (!auth.name) {
			notify({
				id: 'compare_failed',
				title: tl(trans.name_failed).replace(
					'{name}',
					tl(trans.compare),
				),
				body: tl(trans.you_need_to_be_logged_in),
				type: 'error',
			});
			return;
		}

		group.current.disabled = true;
		submit.current.loading = true;

		page.state.compare = {
			you: [],
			other: [],
			shared: [],
		};
		get_grid(auth.name, 1, parseInt(pages.current.value), page.name);
	}

	function get_grid(user, current_page, page_count, next_user = null) {
		body.current.replaceChildren(
			<LoadingData>
				{tl(trans.gathering_plays_for_user_pages, {
					u: user,
					current_page,
					pages: page_count,
				})}
			</LoadingData>,
		);

		fetch(
			`${root}user/${user}/library/${type.current.value}?format=list&${timeframe.current.value}&page=${current_page}&ajax=1`,
		)
			.then(function (response) {
				console.log('returned', response, response.text);

				return response.text();
			})
			.then(function (dom) {
				const doc = new DOMParser().parseFromString(dom, 'text/html');
				console.log('DOC', doc);

				const next_button = doc.querySelector('.pagination-next');

				try {
					const tracks = doc.querySelectorAll('.chartlist-row');
					tracks.forEach((track) => {
						const item = {};

						item.avatar = track.querySelector(
							'.chartlist-image img',
						);
						if (item.avatar) {
							item.avatar = item.avatar.getAttribute('src');
						}

						item.name = track.querySelector('.chartlist-name a')
							.textContent.trim();
						if (type.current.value != 'artists') {
							item.sister = track.querySelector(
								'.chartlist-artist a',
							).textContent.trim();
						}
						item.plays = clean_number(
							track.querySelector('.chartlist-count-bar-slug')
								.getAttribute('data-stat-value'),
						);

						if (next_user) page.state.compare.you.push(item);
						else page.state.compare.other.push(item);
					});
				} catch (e) {
					notify({
						id: 'compare',
						title: tl(trans.failed),
						body: tl(trans.there_was_a_network_error),
						type: 'error',
					});
					console.error(e);
				}

				if (next_button && current_page < page_count) {
					get_grid(user, current_page + 1, page_count, next_user);
				} else if (next_user) {
					get_grid(next_user, 1, page_count);
				} else {
					group.current.disabled = false;
					submit.current.loading = false;

					continue_comparing();
				}
			});
	}

	function continue_comparing() {
		log('gathered initial values', 'compare', 'info', page.state.compare);

		const inverse = useSettings.get('inverse_compare') as boolean;

		page.state.compare.you.forEach((your_item) => {
			let other_item;
			if (type.current.value == 'albums') {
				other_item = page.state.compare.other.find(
					(other) =>
						your_item.name === other.name &&
						your_item.sister === other.sister,
				);
			} else {
				other_item = page.state.compare.other.find(
					(other) => your_item.name === other.name,
				);
			}

			if ((other_item && !inverse) || (!other_item && inverse)) {
				page.state.compare.shared.push({
					avatar: your_item.avatar,
					name: your_item.name,
					sister: your_item.sister ? your_item.sister : '',
					plays: {
						you: your_item.plays,
						other: other_item?.plays || 0,
						shared: your_item.plays + (other_item?.plays || 0),
					},
				});
			}
		});

		if (inverse) {
			page.state.compare.other.forEach((your_item) => {
				let other_item;
				if (type.current.value == 'albums') {
					other_item = page.state.compare.you.find(
						(other) =>
							your_item.name === other.name &&
							your_item.sister === other.sister,
					);
				} else {
					other_item = page.state.compare.you.find(
						(other) => your_item.name === other.name,
					);
				}

				if (!other_item) {
					page.state.compare.shared.push({
						avatar: your_item.avatar,
						name: your_item.name,
						sister: your_item.sister ? your_item.sister : '',
						plays: {
							you: other_item?.plays || 0,
							other: your_item.plays,
							shared: your_item.plays + (other_item?.plays || 0),
						},
					});
				}
			});
		}

		page.state.compare.shared.sort(
			(a, b) => b.plays.shared - a.plays.shared,
		);

		log('gathered shared values', 'compare', 'info', page.state.compare);

		body.current.innerHTML = '';

		if (page.state.compare.shared.length == 0) {
			body.current.replaceChildren(
				<LoadingData type='failed'>
					{tl(trans.nothing_in_common)}
				</LoadingData>,
			);

			return;
		}

		if (type.current.value != 'tracks') {
			const grid = document.createElement('ol');
			grid.classList.add(
				'grid-items',
				'grid-items--numbered',
				'compare-grid',
			);

			page.state.compare.shared.forEach((data) => {
				let template;
				if (type.current.value == 'artists') {
					template = sanitise(data.name);
				} else {
					template = `${sanitise(data.sister)}/${
						sanitise(data.name)
					}`;
				}

				grid.appendChild(
					<li class={['grid-items-item', 'compare-item']}>
						<div
							class={[
								'grid-items-cover-image',
								'js-link-block',
								'link-block',
							]}
						>
							<div
								class={[
									'grid-items-cover-image-image',
									(data.avatar.endsWith(
										'/c6f59c1e5e7240a4c0d427abd71f3dbb.jpg',
									) ||
										data.avatar.endsWith(
											'/2a96cbd8b46e442fc41c2b86b821562f.jpg',
										)) && 'grid-items-cover-default',
								]}
							>
								<img
									src={avatar(data.avatar, 'avatar300s')}
									alt={data.name}
									loading='lazy'
								/>
							</div>
							<div class='grid-items-item-details'>
								<p class='grid-items-item-main-text'>
									<a
										class='link-block-target'
										href={`${root}music/${redirect()}${template}`}
										title={data.name}
									>
										{data.name}
									</a>
								</p>
								{type.current.value == 'albums' && (
									<p class='grid-items-item-aux-text'>
										<a
											class='grid-items-item-aux-block'
											href={`${root}music/${redirect()}${data.sister}`}
											title={data.sister}
										>
											{data.sister}
										</a>
									</p>
								)}
								<ComparisonBars
									you={{
										avatar: auth.avatar!,
										plays: data.plays.you,
										link:
											`${root}user/${auth.name}/library/music/${redirect()}${template}?${timeframe.current.value}`,
									}}
									other={{
										avatar: page.avatar!,
										plays: data.plays.other,
										link:
											`${root}user/${page.name}/library/music/${redirect()}${template}?${timeframe.current.value}`,
									}}
									shared={data.plays.shared}
								/>
							</div>
						</div>
					</li>,
				);
			});

			body.current.replaceChildren(grid);

			music_grids(grid);
		} else {
			const table = document.createElement('table');
			table.classList.add(
				'chartlist',
				'chartlist--with-index',
				'chartlist--with-index--length-2',
				'chartlist--with-image',
				'chartlist--with-artist',
				'chartlist--with-bar',
				'compare-chartlist',
			);

			const tbody = document.createElement('tbody');
			table.appendChild(tbody);

			let max = 0;
			page.state.compare.shared.forEach((item) => {
				if (item.plays.you > max) max = item.plays.you;
				if (item.plays.other > max) max = item.plays.other;
			});

			page.state.compare.shared.forEach((data, index) => {
				let template = `${sanitise(data.sister)}/_/${
					sanitise(data.name)
				}`;

				tbody.appendChild(html.node`
                    <tr class="chartlist-row chartlist-row--with-artist compare-item">
                        <td class="chartlist-index">${index + 1}</td>
                        <td class="chartlist-image">
                            <a class="cover-art" href="${root}music/${redirect()}${template}">
                                <img src="${data.avatar}" alt="${data.name}" loading="lazy">
                            </a>
                        </td>
                        <td class="chartlist-name">
                            <a href="${root}music/${redirect()}${template}" title="${data.name}">
                                ${data.name}
                            </a>
                        </td>
                        <td class="chartlist-artist">
                            <a href="${root}music/${redirect()}${data.sister}" title="${data.sister}">
                                ${data.sister}
                            </a>
                        </td>
                        <td class="chartlist-bar with-multiple">
                            <span class="chartlist-count-bar">
                                <a class="chartlist-count-bar-link" href="${root}user/${auth.name}/library/music/${redirect()}${template}?${timeframe.current.value}" target="_blank">
                                    <span class="chartlist-count-bar-slug" data-max-stat-value="${max}" data-stat-value="${data.plays.you}" style="width: ${
					(data.plays.you / max) * 100
				}%;"></span>
                                    <span class="chartlist-count-bar-value">${data.plays.you}</span>
                                </a>
                                <span class="avatar">
                                    <img src="${auth.avatar}" alt="${
					tl(trans.your_avatar)
				}">
                                </span>
                            </span>
                            <span class="chartlist-count-bar">
                                <a class="chartlist-count-bar-link" href="${root}user/${page.name}/library/music/${redirect()}${template}?${timeframe.current.value}" target="_blank">
                                    <span class="chartlist-count-bar-slug" data-max-stat-value="${max}" data-stat-value="${data.plays.other}" style="width: ${
					(data.plays.other / max) * 100
				}%;"></span>
                                    <span class="chartlist-count-bar-value">${data.plays.other}</span>
                                </a>
                                <span class="avatar">
                                    <img src="${page.avatar}" alt="${
					tl(trans.avatar_for_user).replace('{u}', page.name)
				}">
                                </span>
                            </span>
                        </td>
                    </tr>
                `);
			});

			body.current.appendChild(table);

			patch_titles(body.current);
		}
	}
}

interface ComparisonBarsProps {
	you: { avatar: string; plays: number; link: string };
	other: { avatar: string; plays: number; link: string };
	shared: number;
}

export function ComparisonBars({
	you,
	other,
	shared,
}: ComparisonBarsProps) {
	return (
		<div class='comparison-bar'>
			<div
				class='comparison-bar-wrap'
				style={{ width: `${(you.plays / shared) * 100}%` }}
			>
				<div class={['comparison-bar-avatar', 'avatar']}>
					<img src={you.avatar} />
				</div>
				<ComparisonBar
					avatar={you.avatar}
					plays={you.plays}
					link={you.link}
				/>
			</div>
			<div
				class='comparison-bar-wrap'
				style={{ width: `${(other.plays / shared) * 100}%` }}
			>
				<ComparisonBar
					avatar={other.avatar}
					plays={other.plays}
					link={other.link}
					flip
				/>
				<div class={['comparison-bar-avatar', 'avatar']}>
					<img src={other.avatar} />
				</div>
			</div>
		</div>
	);
}

interface ComparisonBarProps {
	avatar: string;
	plays: number;
	flip?: boolean;
	link: string;
}

function ComparisonBar({
	avatar,
	plays,
	flip,
	link,
}: ComparisonBarProps) {
	const value = createRef();

	const elem = (
		<a class='comparison-bars' href={link}>
			<span
				class={[
					'comparison-bar-value',
					'colourful',
					flip && 'comparison-bar-value-flip',
				]}
				ref={value}
			>
				{plays.toLocaleString(lang)}
			</span>
			<span
				class={[
					'comparison-bar-fill',
					'colourful',
					'comparison-bar-you',
					flip && 'comparison-bar-fill-flip',
				]}
			/>
		</a>
	);

	header_colour(<img src={avatar} /> as HTMLImageElement, false, [
		elem,
		value.current,
	]);

	return elem;
}
