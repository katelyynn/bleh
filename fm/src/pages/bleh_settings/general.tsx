/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { html, render } from 'lighterhtml';
import {
	page_loading,
	register_skip_to,
	render_setting_page,
} from './bleh_settings';
import { api_key, auth, page, root } from '@/build/page';
import { create_badge, load_badges } from '@/components/shared/badge';
import { dialog } from '@/components/dialog/dialog';
import { lang_info, tl, trans } from '@/build/trans';
import { setting } from '@/components/settings/settings';
import { DateTime } from 'luxon';
import { version } from '@/main';
import { sponsor_list } from '@/build/sponsor';
import { update_branding_type } from '@/components/page/navigation';
import tippy from 'tippy.js';
import { update_check } from '@/components/page/style';
import { notify } from '@/components/dialog/notify';
import { sponsor, sponsor_manage, sponsors } from '@/components/sponsor';
import { convert_lang_to_country, flag } from '@/components/shared/flag';
import { start_update } from '@/components/page/style';
import { bool } from '@/build/tools';
import { keys } from '@/components/settings/storage';
import { new_indicator } from '@/components/shared/indicator';
import { discord } from '@/build/page';
import { icon, icons } from '@/components/shared/icon';
import { news } from '@/components/news';
import { SubText } from '@/components/text/sub.tsx';
import { SettingGroup } from '@/components/settings/group.tsx';
import { SeeMore, SeeMoreGroup } from '@/components/text/see_more.tsx';
import { badge } from '@/types/badge.ts';
import { SettingAction } from '@/components/settings/provider/action.tsx';
import { SettingInfo } from '@/components/settings/provider/info.tsx';
import { PanelHead } from '@/components/text/head.tsx';
import { SettingRadio } from '@/components/settings/provider/radio.tsx';

export function general() {
	if (auth.pro == null) {
		setTimeout(() => {
			render_setting_page('general');
		}, 10);
		page_loading();
		return;
	}

	register_skip_to([]);

	let badge_count = 0;

	const badges = load_badges(auth.name);
	if (badges) badge_count = badges.length;
	//if (auth.pro) badge_count++;

	const auth_key = localStorage.getItem('bleh_auth');
	const auth_valid = localStorage.getItem('bleh_auth_valid') || undefined;

	page.structure.main!.replaceChildren(
		<>
			<section class='bleh--panel'>
				<div class={['section-intro', 'less']}>
					<SubText>{tl(trans.current_version)}</SubText>
					<h1 class='setting-head'>
						<i>{version.brand}</i>{' '}
						<i class='highlight'>{version.build}</i>
					</h1>
				</div>
				<SettingGroup>
					{update_setting()}
				</SettingGroup>
				<div class={['section-intro', 'less']}>
					<SubText>{tl(trans.issues_updating)}</SubText>
					<SeeMoreGroup>
						<SeeMore
							href='https://github.com/katelyynn/bleh/issues/new/choose'
							external
						>
							{tl(trans.report_issue)}
						</SeeMore>
						<SeeMore
							href={`https://discord.gg/${discord}`}
							external
						>
							{tl(trans.join_discord)}
						</SeeMore>
					</SeeMoreGroup>
				</div>
			</section>
			<section class='bleh--panel'>
				<PanelHead icon={icons.user}>
					{tl(trans.profile)}
				</PanelHead>
				<SettingGroup>
					{auth.name
						? (
							<div class='setting' data-type='info'>
								<div class='avatar-container'>
									<div class='avatar-inner'>
										<img
											src={auth.avatar!}
											alt={auth.name}
										/>
									</div>
								</div>
								<div class='heading'>
									<h5>@{auth.name}</h5>
								</div>
								<div class='info'>
									<p>
										{tl(trans.profile_and_badges, {
											c: badge_count.toString(),
										})}
									</p>
									{(badge_count > 0 && badges)
										? (
											<SeeMore
												onClick={() => {
													badge_prompt(badges);
												}}
											>
												{tl(trans.view)}
											</SeeMore>
										)
										: ''}
								</div>
							</div>
						)
						: ''}
					<SettingInfo name={tl(trans.current_version)}>
						<p>{sponsor_list.version}</p>
						<SeeMore
							className='sponsor-related'
							icon={icons.update}
							iconPlacement='left'
							onClick={() => {
								sponsors(true, () => {
									render_setting_page('general');
								});
							}}
						>
							{tl(trans.update_check)}
						</SeeMore>
					</SettingInfo>
					{auth.sponsor
						? (
							<SettingAction
								name={tl(trans.you_are_a_sponsor)}
								body={tl(trans.sponsor_get_badge)}
							>
								<button
									type='button'
									class='btn primary icon sponsor colourful'
									data-type='sponsor'
									onClick={sponsor_manage}
								>
									{tl(trans.manage_sponsor)}
								</button>
							</SettingAction>
						)
						: (
							<SettingAction
								name={tl(trans.news_sponsor_cta)}
								body={tl(trans.sponsor_get_badge)}
							>
								<button
									type='button'
									class='btn primary icon sponsor colourful'
									data-type='sponsor'
									onClick={() => sponsor()}
								>
									{tl(trans.sponsor)}
								</button>
							</SettingAction>
						)}
				</SettingGroup>
			</section>
			<section class='bleh--panel'>
				<PanelHead icon={icons.extension}>
					API
				</PanelHead>
				<SettingGroup>
					<SettingAction
						id='setting_api'
						name={tl(trans.api.name)}
						body={tl(trans.api.body)}
					>
						<a
							class={[
								'btn',
								'icon',
								(auth_key && bool(auth_valid)) && 'primary',
							]}
							data-type='plus'
							href={`${root}api/auth?api_key=${api_key}&cb=${root}bleh/api`}
						>
							{tl(trans.connect)}
						</a>
					</SettingAction>
					<SettingInfo name={tl(trans.api_status)}>
						{(auth_key && bool(auth_valid))
							? <p>{tl(trans.connected)}</p>
							: <p>{tl(trans.not_connected)}</p>}
					</SettingInfo>
				</SettingGroup>
			</section>
			<section class='bleh--panel'>
				<PanelHead icon={icons.bleh_settings}>
					{tl(trans.branding)}
				</PanelHead>
				<SettingGroup>
					<SettingRadio bind='branding_type' />
				</SettingGroup>
			</section>
		</>,
	);

	// early return but without the ide knowing
	if (!setting.dbdfbdf) return;

	render(
		page.structure.main,
		html`
			<section class="bleh--panel">
			    <div class="section-intro less">
			        <div class="sub-text">${tl(trans.current_version)}</div>
			        <h1 class="setting-head"><i>${version
				.brand}</i> <i class="highlight">${version.build}</i></h1>
			    </div>
			    <div class="setting-group">
			        ${update_setting()}
			    </div>
			    <div class="section-intro less">
			        <p class="sub-text">${tl(trans.issues_updating)}</p>
			        <div class="see-more-row">
			            <a class="see-more" href="https://github.com/katelyynn/bleh/issues/new/choose" target="_blank">${tl(
				trans.report_issue,
			)}</a>
			            <a class="see-more" href="https://discord.gg/${discord}" target="_blank">${tl(
				trans.join_discord,
			)}</a>
			        </div>
			    </div>
			</section>
			<section class="bleh--panel">
			    <h4>${tl(trans.profile)}</h4>
			    <div class="setting-group">
			        ${auth.name
				? html.node`
                    <div class="setting" data-type="info">
                        <div class="avatar-container">
                            <div class="avatar-inner">
                                <img src=${auth.avatar} alt=${auth.name} />
                            </div>
                        </div>
                        <div class="heading">
                            <h5>@${auth.name}</h5>
                        </div>
                        <div class="info">
                            <p>${
					tl(trans.profile_and_badges, { c: badge_count.toString() })
				}</p>
                            ${
					badge_count > 0
						? html.node`
                                <button class="see-more" onclick=${() => {
							dialog({
								id: 'badges',
								title: auth.name,
								body: html.node`
                                            <div class="generic-table-list badge-list">
                                                ${
									badges
										? badges.map((badge) => {
											return html.node`
                                                        <div class="generic-table-list-entry badge-list-entry">
                                                            <div class="name">
                                                                ${
												create_badge(
													badge,
													false,
													true,
													true,
												)
											}
                                                            </div>
                                                            <div class="text">
                                                                ${badge.reason}
                                                            </div>
                                                        </div>
                                                    `;
										})
										: ''
								}
                                            </div>
                                        `,
							});
						}}>${tl(trans.view)}</button>
                            `
						: ''
				}
                        </div>
                    </div>
                `
				: ''}
			        ${auth.sponsor
				? html.node`
                    <div class="setting" data-type="action">
                        <div class="heading">
                            <h5>${tl(trans.you_are_a_sponsor)}</h5>
                            <p>${tl(trans.sponsor_get_badge)}</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="btn primary icon sponsor colourful" data-type="sponsor" onclick=${() =>
					sponsor_manage()}>
                                ${tl(trans.manage_sponsor)}
                            </button>
                        </div>
                    </div>
                `
				: html.node`
                    <div class="setting" data-type="action">
                        <div class="heading">
                            <h5>${tl(trans.news_sponsor_cta)}</h5>
                            <p>${tl(trans.sponsor_get_badge)}</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="btn primary icon sponsor colourful" data-type="sponsor" onclick=${() =>
					sponsor()}>
                                ${tl(trans.sponsor)}
                            </button>
                        </div>
                    </div>
                `}
			        <div class="setting" data-type="info">
			            <div class="heading">
			                <h5>${tl(trans.current_version)}</h5>
			            </div>
			            <div class="info">
			                <p>${sponsor_list.version}</p>
			                <button class="see-more update-check sponsor-related left-icon" onclick=${() =>
				sponsors(true, () => {
					render_setting_page('general');
				})}>
			                    ${tl(trans.update_check)}
			                </button>
			            </div>
			        </div>
			    </div>
			    <div class="setting-group">
			        <div class="setting" data-type="action" id="setting_api">
			            <div class="heading">
			                <h5>${tl(trans.api.name)}</h5>
			                <p>${tl(trans.api.body)}</p>
			            </div>
			            <div class="toggle-wrap">
			                <a class="btn ${auth_key && auth_valid == 'true'
				? ''
				: 'primary'} icon" data-type="plus" href="${root}api/auth?api_key=${api_key}&cb=${root}bleh/api">
			                    ${tl(trans.connect)}
			                </a>
			            </div>
			        </div>
			        <div class="setting" data-type="info">
			            <div class="heading">
			                <h5>${tl(trans.api_status)}</h5>
			            </div>
			            <div class="info">
			                ${auth_key && auth_valid == 'true'
				? html.node`
                            <p>${tl(trans.connected)}</p>
                        `
				: html.node`
                            <p>${tl(trans.not_connected)}</p>
                        `}
			            </div>
			        </div>
			    </div>
			</section>
			${!page.mobile
				? html.node`
            <section class="bleh--panel">
                <h4>${tl(trans.branding)}</h4>
                <div class="setting-group">
                    ${
					setting({ id: 'branding_type', func: update_branding_type })
				}
                </div>
            </section>
        `
				: ''}
			<section class="bleh--panel">
			    <h4>${tl(trans.language)}</h4>
			    <div class="setting-group">
			        <div class="languages">
			            ${Object.entries(lang_info).sort(([, a], [, b]) =>
				b.percent - a.percent
			).map(([key, language]) => {
				let date;

				const row = html.node`
                            <div class="language-row">
                                ${
					flag(
						(convert_lang_to_country[key] || key).toUpperCase(),
						'language-row-flag',
					)
				}
                                <div class="language-row-content">
                                    <strong class="language-row-name">${language.name}${
					language.new ? new_indicator() : ''
				}</strong>
                                    <p class="language-row-by">${{
					html: tl(trans.by_user, {
						u: language.by.map((user) =>
							`<a href="${root}user/${user}">${user}</a>`
						).join(', '),
					}),
				}}</p>
                                </div>
                                <div class="language-row-sub">
                                    ${
					language.percent
						? () => {
							const elem = html.node`
                                            <p class="language-row-percent percent colourful" style="--hue-over: ${
								language.percent * 1.2
							}; --sat-over: 1.4; --lit-over: 0.9;" data-percent=${language.percent}>
                                                ${language.percent}%
                                            </p>
                                        `;

							tippy(elem, {
								content: `${
									tl(trans.amount_translated, {
										c: language.translated,
									})
								}, ${
									tl(trans.missing_translated, {
										c: language.missing,
									})
								}`,
							});

							return elem;
						}
						: ''
				}
                                    <p class="language-row-time" ref=${(el) =>
					date = el}>${
					language.last_updated != 'latest'
						? DateTime.fromISO(language.last_updated).toRelative({
							style: 'short',
						})
						: language.last_updated
				}</p>
                                </div>
                                <div class="language-row-progress colourful" style="--hue-over: ${
					language.percent * 1.2
				}; --sat-over: 1.4; --lit-over: 0.9; width: ${language.percent}%" data-percent=${language.percent} />
                            </div>
                        `;

				if (language.last_updated != 'latest') {
					tippy(date, {
						content: DateTime.fromISO(language.last_updated)
							.toLocaleString(DateTime.DATE_MED),
					});
				}

				return row;
			})}
			        </div>
			    </div>
			    <div class="setting-group">
			        <div class="setting" data-type="action">
			            <div class="heading">
			                <h5>${tl(trans.submit_language.name)}</h5>
			                <p>${tl(trans.submit_language.body)}</p>
			            </div>
			            <div class="toggle-wrap">
			                <a class="see-more" href="https://github.com/katelyynn/bleh/wiki/Translations" target="_blank">
			                    ${tl(trans.help_contribute)}
			                </a>
			            </div>
			        </div>
			        ${setting({ id: 'translator' })}
			    </div>
			</section>
		`,
	);
}

function update_setting() {
	let update_btn;
	let pause_btn;

	const update_required = bool(
		localStorage.getItem(keys.update_required) || 'false',
	);
	const last_checked = localStorage.getItem(keys.update_checked_date) || null;
	const version_to_install = localStorage.getItem(keys.update_to_version) ||
		null;

	const cont = html.node`
        <div class="setting" data-type="action" />
    `;

	if (!update_required) {
		render(
			cont,
			html`
				<div class="setting-v2-icon update-center-icon">
				    <div class="update-container">
				        <div class="bleh-icon" data-type="update" />
				    </div>
				    ${last_checked
					? html.node`
                <div class="check-circle colourful">
                    <div class="bleh-icon" data-type="check-thick" />
                </div>
                `
					: ''}
				</div>
				<div class="heading">
				    ${last_checked
					? html.node`
                    <h5>${tl(trans.you_are_up_to_date)}</h5>
                    <p class="last-checked">${
						tl(trans.last_checked_date).replace(
							'{d}',
							DateTime.fromJSDate(new Date(last_checked))
								.toRelative(),
						)
					}</p>
                `
					: html.node`
                    <h5>${tl(trans.missing_updates)}</h5>
                    <p class="last-checked">${tl(trans.never_checked)}</p>
                `}
				</div>
				<div class="toggle-wrap">
					<button class="btn icon" data-type="update" ref=${(
						el,
					) => (update_btn = el)}
						onclick=${() =>
							update_check(true, update_btn, (success, error) => {
								if (!success) {
									update_check_failed(error);
									return;
								}

								notify({
									id: 'update',
									title: tl(trans.updates),
									body: tl(trans.checked_for_updates),
									icon: 'icon-16-update',
								});
								render_setting_page('general');
							})}>${tl(trans.check)}</button>
					<button class="btn primary icon" data-type="news" onclick=${() =>
						news()}>
				        ${tl(trans.news)}
				    </button>
				</div>
			`,
		);
	} else {
		render(
			cont,
			html`
				<div class="setting-v2-icon update-center-icon">
					<div class="update-container spin">
						<div class="bleh-icon" data-type="spinner" />
					</div>
				</div>
				<div class="heading">
				    <h5>${tl(trans.update_available_to_install)}</h5>
				    ${last_checked
					? html.node`
                    <p class="last-checked">${
						tl(trans.last_checked_date, {
							d: DateTime.fromJSDate(new Date(last_checked))
								.toRelative(),
						})
					}</p>
                `
					: html.node`
                    <p class="last-checked">${tl(trans.never_checked)}</p>
                `}
				</div>
				<div class="toggle-wrap">
					<div class="button-group">
						<button class="btn icon" data-type="update" ref=${(
							el,
						) => (update_btn = el)}
							onclick=${() =>
								update_check(
									true,
									update_btn,
									(success, error) => {
										if (!success) {
											update_check_failed(error);
											return;
										}

										notify({
											id: 'update',
											title: tl(trans.updates),
											body: tl(trans.checked_for_updates),
											icon: 'icon-16-update',
										});
										render_setting_page('general');
									},
								)}>${tl(trans.check)}</button>
						<button class="btn primary icon" data-type="update" ref=${(
							el,
						) => (update_btn = el)}
							onclick=${() => start_update()}>${tl(
								trans.install_now,
							)}</button>
					</div>
				</div>
			`,
		);
	}

	return html.node`
        ${cont}
        <div class="setting" data-type="info">
            <div class="heading">
                <h5>${tl(trans.updating_to_version)}</h5>
            </div>
            <div class="info">
                <p>${version_to_install}</p>
            </div>
        </div>
    `;
}

function update_check_failed(e) {
	notify({
		id: 'update',
		title: tl(trans.updates),
		body: tl(trans.failed_to_check_for_updates),
		icon: 'icon-16-update',
		type: 'error',
	});

	dialog({
		id: 'error',
		title: tl(trans.failed_to_check_for_updates),
		body: html.node`
            <div class="error-inner">
                <div class="error-top">
                    ${icon({ name: icons.error })}
                    <div class="error-top-info">
                        <h1 class="error-head">${
			tl(trans.failed_to_check_for_updates)
		}</h1>
                        <p class="error-body">Either the update files could not be found or there was an error in parsing them.</p>
                    </div>
                </div>
                <pre class="error-info colourful">${
			e
				? html
					.node`<span class="error-type">${e.name}</span>: ${e.message}`
				: ''
		}${
			e.stack
				? html.node`<br><span class="error-stack">${e.stack}</span>`
				: ''
		}<br>on: ${page.type}/${page.subpage}<br>    ${window.location.pathname}<br>    ${version.build} (${version.sku})</pre>
            </div>
            <div class="modal-footer">
                <div class="fill"></div>
                <a class="see-more" href=${version.url} target="_blank">
                    Try update manually
                </a>
                <a class="see-more" href="https://discord.gg/${discord}" target="_blank">
                    Join Discord
                </a>
                <div class="fill"></div>
            </div>
        `,
		type: 'error',
	});
}

function badge_prompt(badges: badge[]) {
	dialog({
		id: 'badges',
		title: auth.name!,
		body: (
			<div class='generic-table-list badge-list'>
				{badges.map((badge: badge) => (
					<div class='generic-table-list-entry badge-list-entry'>
						<div class='name'>
							{create_badge(
								badge,
								false,
								true,
								true,
							)}
						</div>
						<div class='text'>
							{badge.reason}
						</div>
					</div>
				))}
			</div>
		),
	});
}
