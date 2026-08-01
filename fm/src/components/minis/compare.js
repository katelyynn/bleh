//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

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

export function compare({ host, sidebar } = {}) {
	if (!host || !sidebar) return;

	let pages;
	let timeframe;
	let type;

	let submit;
	let body;

	if (page.name == auth.name) {
		page.name = '';
		page.avatar = '';
		page.requested.profile = '';
	}

	let current_year = new Date().getFullYear();
	let previous_year = current_year - 1;

	const default_type = page.requested.type || 'albums';
	const default_timeframe = page.requested.timeframe ||
		'date_preset=LAST_90_DAYS';

	let user;
	render(
		host,
		html`
			<div class="compare-header">
				<div class="compare-users">
					<div class="compare-user">
						<div class="avatar">
							<img
								src="${avatar(auth.avatar, 'avatar170s')}"
								alt="${tl(trans.your_avatar)}"
							/>
						</div>
						<strong>${auth.name}</strong>
					</div>
					<div class="bleh-icon"></div>
					<div class="compare-user focus" ref=${(el) => (user = el)}>
			            ${render_user(page.name, page.avatar, user, true)}
			        </div>
				</div>
				<div class="compare-selection">
			        ${pages = select({
				values: [
					{
						text: tl(trans.page_count),
					},
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
				],
				initial: '3',
			})}
			        ${type = select({
				values: [
					{
						text: tl(trans.item_type),
					},
					{
						value: 'artists',
						text: html`<div
                                        class="bleh-icon"
                                        style="--icon: var(--icon-16-artist)"
                                    />
                                    ${tl(trans.artists)}`,
					},
					{
						value: 'albums',
						text: html`<div
                                        class="bleh-icon"
                                        style="--icon: var(--icon-16-album)"
                                    />
                                    ${tl(trans.albums)}`,
					},
					{
						value: 'tracks',
						text: html`<div
                                        class="bleh-icon"
                                        style="--icon: var(--icon-16-track)"
                                    />
                                    ${tl(trans.tracks)}`,
					},
				],
				initial: default_type,
			})}
			        ${timeframe = select({
				values: [
					{
						text: tl(trans.timeframe),
					},
					{
						value: 'date_preset=LAST_7_DAYS',
						text: tl(trans.last_count_days).replace(
							'{c}',
							'7',
						),
					},
					{
						value: 'date_preset=LAST_30_DAYS',
						text: tl(trans.last_count_days).replace(
							'{c}',
							'30',
						),
					},
					{
						value: 'date_preset=LAST_90_DAYS',
						text: tl(trans.last_count_days).replace(
							'{c}',
							'90',
						),
					},
					{
						value: 'date_preset=LAST_180_DAYS',
						text: tl(trans.last_count_days).replace(
							'{c}',
							'180',
						),
					},
					{
						value: 'date_preset=LAST_365_DAYS',
						text: tl(trans.last_count_days).replace(
							'{c}',
							'365',
						),
					},
					{
						value: 'date_preset=ALL',
						text: tl(trans.all_time),
					},
					{
						value: `from=${current_year}-01-01&rangetype=year`,
						text: current_year,
					},
					{
						value: `from=${previous_year}-01-01&rangetype=year`,
						text: previous_year,
					},
				],
				initial: default_timeframe,
			})}
			        <button
			            class="btn icon primary compare"
			            ref=${(el) => (submit = el)}
			            onclick=${() => begin_comparing()}
			        >
			            ${tl(trans.compare)}
			        </button>
			    </div>
			</div>
			<div
				class="compare-body"
				data-filled="false"
				ref=${(el) => (body = el)}
			>
				<div class="placeholder-block">
					<div class="placeholder-head">(๑>◡<๑)</div>
					<div class="placeholder-summary">${tl(
						trans.choose_a_timeframe_above,
					)}</div>
				</div>
			</div>
		`,
	);

	let setting_group;
	let input;
	render(
		sidebar,
		html`
			<h2>${tl(trans.settings)}</h2>
			<div class="setting-group" ref=${(el) => (setting_group = el)}>
			    <div class="setting v" data-type="text">
			        <div class="heading">
			            <h5>${tl(trans.compare_with)}</h5>
			        </div>
			        <div class="input-container content-form">
			            <input
			                type="text"
			                class="input"
			                ref=${(el) => (inputter = el)}
			                placeholder=${tl(trans.enter_a_profile)}
			                value=${page.requested.profile}
			                onchange=${(e) => {
				page.requested.profile = e.target.value;
				page.name = page.requested.profile;

				page.avatar = '';
				if (page.name == auth.name) {
					page.avatar = auth.avatar;
				}

				render(
					user,
					html`
						${render_user(
							page.name,
							page.avatar,
							user,
							true,
						)}
					`,
				);
			}}
			            />
			            ${() => {
				let btn = html.node`
                            <button class="btn chibi icon colourful" data-type="starred_friend" data-starred=${
					settings.starred_friend != ''
				} onclick=${() => {
					if (settings.starred_friend == '') return;

					inputter.value = settings.starred_friend;
					inputter.dispatchEvent(new Event('change'));
				}}>${tl(trans.starred_friend.name)}</button>
                        `;

				tippy(btn, {
					content: tl(trans.starred_friend.name),
				});

				return btn;
			}}
			        </div>
			    </div>
			    ${ff('inverse_compare')
				? html.node`
                        ${setting({ id: 'inverse_compare' })}
                    `
				: ''}
			</div>
		`,
	);
	let compare_settings = setting_group.querySelectorAll(':scope > .setting');

	function begin_comparing(bypass = false) {
		if (page.name == '') return;

		if (parseInt(pages.value) > 3 && !bypass) {
			let warn = notify({
				id: 'compare_warning',
				title: tl(trans.are_you_sure),
				body: tl(trans.this_will_require_loading_count_pages).replace(
					'{c}',
					parseInt(pages.value) * 2,
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

		pages.querySelector('button').disabled = true;
		type.querySelector('button').disabled = true;
		timeframe.querySelector('button').disabled = true;
		compare_settings.forEach((option) => {
			option.setAttribute('disabled', true);
		});
		submit.disabled = true;

		page.state.compare = {
			you: [],
			other: [],
			shared: [],
		};
		get_grid(auth.name, 1, parseInt(pages.value), page.name);
	}

	function get_grid(user, current_page, page_count, next_user = null) {
		render(
			body,
			html`
				<div class="loading-data-container">
					<div class="loading-data-text">
				        ${tl(trans.gathering_plays_for_user_pages)
					.replace('{u}', user)
					.replace('{current_page}', current_page)
					.replace('{pages}', page_count)}
				    </div>
				</div>
			`,
		);

		fetch(
			`${root}user/${user}/library/${type.value}?format=list&${timeframe.value}&page=${current_page}&ajax=1`,
		)
			.then(function (response) {
				console.log('returned', response, response.text);

				return response.text();
			})
			.then(function (dom) {
				let doc = new DOMParser().parseFromString(dom, 'text/html');
				console.log('DOC', doc);

				let next_button = doc.querySelector('.pagination-next');

				try {
					let tracks = doc.querySelectorAll('.chartlist-row');
					tracks.forEach((track) => {
						let item = {};

						item.avatar = track.querySelector(
							'.chartlist-image img',
						);
						if (item.avatar) {
							item.avatar = item.avatar.getAttribute('src');
						}

						item.name = track.querySelector('.chartlist-name a')
							.textContent.trim();
						if (type.value != 'artists') {
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
					pages.querySelector('button').disabled = false;
					type.querySelector('button').disabled = false;
					timeframe.querySelector('button').disabled = false;
					compare_settings.forEach((option) => {
						option.setAttribute('disabled', false);
					});
					submit.disabled = false;

					continue_comparing();
				}
			});
	}

	function continue_comparing() {
		log('gathered initial values', 'compare', 'info', page.state.compare);

		page.state.compare.you.forEach((your_item) => {
			let other_item;
			if (type.value == 'albums') {
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

			if (other_item) {
				page.state.compare.shared.push({
					avatar: your_item.avatar,
					name: your_item.name,
					sister: your_item.sister ? your_item.sister : '',
					plays: {
						you: your_item.plays,
						other: other_item.plays,
						shared: your_item.plays + other_item.plays,
					},
				});
			}
		});

		page.state.compare.shared.sort(
			(a, b) => b.plays.shared - a.plays.shared,
		);

		log('gathered shared values', 'compare', 'info', page.state.compare);

		body.innerHTML = '';

		if (page.state.compare.shared.length == 0) {
			render(
				body,
				html`
					<div class="loading-data-container">
						<div class="loading-data-text failed">
					        ${tl(trans.nothing_in_common)}
					    </div>
					</div>
				`,
			);

			return;
		}

		if (type.value != 'tracks') {
			let grid = document.createElement('ol');
			grid.classList.add(
				'grid-items',
				'grid-items--numbered',
				'compare-grid',
			);

			page.state.compare.shared.forEach((data) => {
				let template;
				if (type.value == 'artists') template = sanitise(data.name);
				else {
					template = `${sanitise(data.sister)}/${
						sanitise(data.name)
					}`;
				}

				grid.appendChild(html.node`
                    <li class="compare-item grid-items-item">
                        <div class="grid-items-cover-image js-link-block link-block">
                            <div class="grid-items-cover-image-image ${
					data.avatar.endsWith(
							'/c6f59c1e5e7240a4c0d427abd71f3dbb.jpg',
						) ||
						data.avatar.endsWith(
							'/2a96cbd8b46e442fc41c2b86b821562f.jpg',
						)
						? 'grid-items-cover-default'
						: ''
				}">
                                <img src="${
					data.avatar.replace('/avatar70s/', '/avatar300s/').replace(
						'/64s/',
						'/avatar300s/',
					)
				}" alt="${data.name}" loading="lazy">
                            </div>
                            <div class="grid-items-item-details">
                                <p class="grid-items-item-main-text">
                                    <a class="link-block-target" href="${root}music/${redirect()}${template}" title="${data.name}">
                                        ${data.name}
                                    </a>
                                </p>
                                ${
					type.value == 'albums'
						? html.node`
                                <p class="grid-items-item-aux-text">
                                    <a class="grid-items-item-aux-block" href="${root}music/${redirect()}${data.sister}">
                                        ${data.sister}
                                    </a>
                                </p>
                                `
						: ''
				}
                                <p class="grid-items-item-aux-text">
                                    <a class="grid-item-plays with-avatar icon-mask" href="${root}user/${auth.name}/library/music/${redirect()}${template}?${timeframe.value}" target="_blank">
                                        <span class="avatar grid-item-avatar">
                                            <img src="${auth.avatar}" alt="${
					tl(trans.your_avatar)
				}">
                                        </span>
                                        ${data.plays.you.toLocaleString(lang)}
                                    </a>
                                    <a class="grid-item-plays with-avatar icon-mask" href="${root}user/${page.name}/library/music/${redirect()}${template}?${timeframe.value}" target="_blank">
                                        <span class="avatar grid-item-avatar">
                                            <img src="${page.avatar}" alt="${
					tl(trans.avatar_for_user).replace('{u}', page.name)
				}">
                                        </span>
                                        ${data.plays.other.toLocaleString(lang)}
                                    </a>
                                </p>
                            </div>
                            <a class="js-link-block-cover-link link-block-cover-link" href="${root}music/${redirect()}${template}" tabindex="-1" aria-hidden="true"></a>
                        </div>
                    </li>
                `);
			});

			render(body, grid);

			music_grids(grid);
		} else {
			let table = document.createElement('table');
			table.classList.add(
				'chartlist',
				'chartlist--with-index',
				'chartlist--with-index--length-2',
				'chartlist--with-image',
				'chartlist--with-artist',
				'chartlist--with-bar',
				'compare-chartlist',
			);

			let tbody = document.createElement('tbody');
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
                                <a class="chartlist-count-bar-link" href="${root}user/${auth.name}/library/music/${redirect()}${template}?${timeframe.value}" target="_blank">
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
                                <a class="chartlist-count-bar-link" href="${root}user/${page.name}/library/music/${redirect()}${template}?${timeframe.value}" target="_blank">
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

			body.appendChild(table);

			patch_titles(body);
		}
	}
}
