/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { settings } from '@/build/config';
import { album_track_corrections, artist_corrections } from '@/build/music';
import {
	auth,
	oracle_albums,
	oracle_artists,
	oracle_tracks,
	page,
	root,
} from '@/build/page';
import { copy, set_storage, time } from '@/build/tools';
import { get_trans_key, lang_info, tl, trans } from '@/build/trans';
import { dialog, dialog_rm } from '@/components/dialog/dialog';
import { markdown } from '@/components/markdown/markdown';
import { notify } from '@/components/dialog/notify';
import { load_settings } from '../../config.ts';
import { version } from '@/main';
import { update_page, useSettings } from '@/page';
import { ff } from '@/components/settings/sku.ts';
import { html, render } from 'lighterhtml';
import {
	compile_settings,
	save_setting,
	setting,
} from '@/components/settings/settings';
import { share } from '@/components/dialog/share';
import tippy from 'tippy.js';
import {
	checkup_friend_cache,
	load_profile_cache_externally,
} from '../profile/profile';
import {
	select,
	select_prepare_convert_from_setting,
	select_prepare_list,
} from '@/components/settings/select';
import { manage_oracle_data, oracle_data } from '@/components/music/oracle';
import { render_activity } from '@/components/shared/activity';
import { DateTime } from 'luxon';
import { sponsor, sponsor_manage, sponsors } from '@/components/sponsor';
import { version as florence_version } from '@tealmiku/florence';
import { queue_popup } from '@/components/dialog/popup';
import { visual } from '@/pages/bleh_settings/visual';
import { general } from '@/pages/bleh_settings/general.tsx';
import { seasonal } from './seasonal';
import { settings_search } from './search.js';
import { icon, icons } from '@/components/shared/icon.js';
import { chartlist_bar } from '@/components/music/bar.js';
import { avatar } from '@/components/shared/avatar.js';
import { convert_lang_to_country, flag } from '@/components/shared/flag.js';
import { lotus_modal } from '@/components/music/lotus.js';
import { new_indicator } from '@/components/shared/indicator.js';
import {
	interface_page,
	rabbit_keybinds,
} from '@/pages/bleh_settings/interface.tsx';
import { playback } from '@/pages/bleh_settings/playback.tsx';
import { profile } from '@/pages/bleh_settings/profile.tsx';
import { accessibility } from '@/pages/bleh_settings/accessibility.tsx';

export function bleh_settings() {
	page.name = auth.name;
	page.subpage = '';

	update_page();

	// remove error stuff cus we control this page
	page.structure.row.removeChild(page.structure.row.firstElementChild);
	page.structure.row.removeChild(page.structure.row.firstElementChild);

	let params = new URLSearchParams(document.location.search);
	page.requested.tab = params.get('tab');
	page.requested.setting = params.get('setting');

	let path = window.location.pathname.split('/');
	let tab = path[path.length - 1];

	if (tab == 'bleh') tab = null;

	if (page.requested.tab && !tab) tab = page.requested.tab;

	const tabs = {
		general: {
			name: tl(trans.general),
			icon: 'general',
			settings: [
				'branding_type',
				'translator',
			],
		},
		visual: {
			name: tl(trans.visual),
			icon: 'visual',
			settings: [
				'theme',
				'theme_day',
				'theme_night',
				'solarium',
				'hue',
				'sat',
				'lit',
				'hue_from_album',
				'hue_from_track',
				'hue_from_artist',
				'colourful_tracks',
				'colourful_tracks_all',
				'sat_bg',
				'noise',
				'font',
				'font_weight',
				'font_weight_medium',
				'font_weight_bold',
				'font_emoji',
				'gloss',
				'grid_glow',
				'avatar_radius',
				'rain',
			],
		},
		interface: {
			name: tl(trans.interface),
			icon: 'layout',
			settings: [
				'track_layout',
				'expand_tracks',
				'track_album_name_location',
				'colourful_counts',
				'music_links',
				'default_avatar_action',
				'simulate_scroll',
				'gendered_tags',
				'shout_markdown',
				'rabbit',
			],
		},
		profile: {
			name: tl(trans.profile),
			icon: 'user',
			settings: [
				'friends',
				'starred_friend',
				'navigation_items',
				'navigation_language',
				'profile_header_own',
				'profile_header_others',
				'profile_avi_background',
				'bio_markdown',
				'show_your_progress',
				'activities',
			],
		},
		playback: {
			name: tl(trans.playback),
			icon: 'album',
			settings: [
				'corrections',
				'prefer_no_redirect',
				'travis',
				'format_guest_features',
				'show_guest_features',
				'show_remaster_tags',
				'romanise_jp',
				'romanise_ko',
				'glacier_library_graphs',
				'oracle_beta',
				'tracklist_source',
			],
		},
		seasonal: {
			name: tl(trans.seasonal.name),
			settings: [
				'seasonal',
				'seasonal_particles',
				'seasonal_particles_fps',
				'seasonal_overlays',
			],
		},
		accessibility: {
			name: tl(trans.accessibility),
			settings: [
				'reduced_motion',
				'underline_links',
				'display_name_styles',
				'accessible_name_colours',
			],
		},
		fill: {
			type: 'fill',
		},
		translate: {
			name: tl(trans.translate),
			icon: 'language',
			hide: !settings.translator,
		},
		performance: {
			name: tl(trans.troubleshooting),
			icon: 'advanced',
			settings: [
				'dev',
				'branch',
			],
		},
		sku: {
			name: tl(trans.flags),
			password: settings.hu_tao,
		},
	};

	// go wild
	let nav = html.node`
        <div class="toolbar">
            <nav class="navlist secondary-nav navlist--more redesigned-navigation bleh-settings-navigation">
                <ul class="navlist-items">
                    ${
		Object.entries(tabs).map(([id, tab]) => {
			if (tab.hide_if) return html.node``;

			if (tab.type && tab.type == 'fill') {
				return html.node`
                                <div class="fill" />
                            `;
			}

			return html.node`
                            <li class="navlist-item secondary-nav-item">
                                <a class="secondary-nav-item-link bleh--nav" data-bleh-page=${id} data-type=${tab.icon} data-password=${tab.password} data-should-hide=${tab.hide} data-hide=${
				tab != id
			} onclick=${() => change_settings_page(id)}>
                                    ${tab.label ? tab.label : tab.name}
                                </a>
                            </li>
                        `;
		})
	}
                </ul>
            </nav>
        </div>
    `;

	render(
		page.structure.side,
		html`
			${settings_search(tabs)}
			<div class="cta first priority sponsor colourful">
			    ${auth.sponsor
				? html.node`
                <strong>${tl(trans.you_are_a_sponsor)}</strong>
                <a class="see-more" onclick=${() => sponsor_manage()}>${
					tl(trans.manage_sponsor)
				}</a>
            `
				: html.node`
                <strong>${tl(trans.news_sponsor_cta)}</strong>
                <a class="see-more" onclick=${() => sponsor()}>${
					tl(trans.sponsor)
				}</a>
            `}
			</div>
			<section class="side-actions">
			    <button class="btn side-action icon-mask" data-type="import" onclick=${() =>
				import_settings()}>
			        ${tl(trans.import)}
			    </button>
			    <button class="btn side-action icon-mask" data-type="export" onclick=${() =>
				export_settings()}>
			        ${tl(trans.export)}
			    </button>
			    <button class="btn side-action icon-mask" data-type="reset" onclick=${() =>
				reset_settings()}>
			        ${tl(trans.reset)}
			    </button>
			</section>
			${ff('skip_to_setting')
				? html.node`
            <div class="bleh--panel">
                <h4>${tl(trans.skip_to)}</h4>
                <div class="skip-to-list"></div>
            </div>
        `
				: ''}
			<div class="bleh--panel">
			    <p class="card-tip">
			        ${version.brand} ${version.build} ‘${version.sku}’
			    </p>
			    <p class="card-tip">
			        florence ${florence_version}
			    </p>
			    <p class="card-tip">
			        ${DateTime.fromISO(version.built_on).toLocaleString(
				DateTime.DATETIME_MED,
			)}
			    </p>
			</div>
		`,
	);

	page.structure.row.insertBefore(nav, page.structure.content);

	if (!tab) change_settings_page('general');
	else change_settings_page(tab);

	if (page.requested.setting) {
		setTimeout(() => {
			scroll_to_setting(page.requested.setting);
		}, 100);
	}

	const profile_tab = nav.querySelector('[data-bleh-page="profile"]');
	if (profile_tab) {
		setTimeout(() => {
			queue_popup('close_friends', profile_tab);
		}, 0);
	}
}

export function page_loading() {
	render(
		page.structure.main,
		html`
			<div class="bleh--panel">
				<div class="loading-data-container">
					<div class="loading-data-text">${tl(trans.loading)}</div>
				</div>
			</div>
		`,
	);
}

export function page_error(e) {
	render(
		page.structure.main,
		html`
			<div class="bleh--panel">
				<div class="loading-data-container">
					<div class="alert alert-error">${e && e.message
						? e.message
						: e}</div>
				</div>
			</div>
		`,
	);
}

export async function render_setting_page(page_id) {
	page_loading();

	try {
		if (page_id == 'general') {
			general();
		} else if (page_id == 'visual') {
			visual();
		} else if (page_id == 'seasonal') {
			seasonal();
		} else if (page_id == 'playback') {
			playback();
		} else if (page_id == 'profile') {
			profile();
		} else if (page_id == 'interface') {
			interface_page();
		} else if (page_id == 'accessibility') {
			accessibility();
		}
	} catch (e) {
		page_error(e);
	}

	if (page_id == 'performance') {
		register_skip_to([]);

		if (settings.hu_tao != 'develop') {
			dialog({
				id: 'development_only',
				body: html.node`
                    <div class="modal-vertical-inner error-inner">
                        <div class="bleh-icon" style="--icon: var(--icon-16-warning)"></div>
                        <h1>${tl(trans.intended_for_development.name)}</h1>
                        <p>${tl(trans.intended_for_development.body)}</p>
                    </div>
                `,
				theme: 'error',
			});
		}

		render(
			page.structure.main,
			html`
				<section class="bleh--panel">
					<div class="alert alert-danger">
				        ${tl(trans.beware_notice)}
				    </div>
					<div class="setting-group">
				        ${setting({ id: 'dev' })}
				    </div>
					<div class="setting-group">
				        ${setting({ id: 'developer' })}
				        ${setting({ id: 'developer_setting_names' })}
				    </div>
					<div class="sep"></div>
					<button class="see-more" onclick=${() => {
						if (settings.hu_tao == 'develop') {
							change_settings_page('sku');
						} else {
							dialog({
								id: 'hu_tao',
								title: tl(trans.development),
								body: html.node`
                                    ${
									setting({
										id: 'hu_tao',
										text: false,
										focus: true,
									})
								}
                                `,
							});
						}
					}}>
				        ${tl(trans.manage_feature_flags)}
				    </button>
					<button class="see-more" onclick=${() => {
						save_setting('popups_seen', []);
					}}>
				        Forget which popups have been seen
				    </button>
				</section>
			`,
		);
	} else if (page_id == 'sku') {
		register_skip_to([]);

		const grouped = Object.entries(version.feature_flags)
			.sort((a, b) => b[1].date.localeCompare(a[1].date))
			.reduce((groups, entry) => {
				const date = entry[1].date;
				let key = date.slice(0, 7);

				if (key.startsWith('2099')) key = '2099';

				if (!groups[key]) groups[key] = [];

				groups[key].push(entry);

				return groups;
			}, {});

		render(
			page.structure.main,
			html`
				<div class="bleh--panel">
				    <div class="panel-intro">
				        <div class="sub-text">
				            ${version.build}.${version.sku}
				        </div>
				        <h1>☆⌒(>w<)</h1>
				    </div>
				    <div class="sep" />
				    <h4>${tl(trans.manage_feature_flags)}</h4>
				    <div class="alert alert-danger">
				        ${tl(trans.beware_notice)}
				    </div>
				        ${Object.entries(grouped).map(([month, flags]) => {
					let label = new Date(`${month}-01`).toLocaleString(
						undefined,
						{
							month: 'long',
							year: 'numeric',
						},
					);
					if (month.startsWith('2099')) label = tl(trans.general);

					console.error(month, label, flags);

					return html.node`
                            <h4>${label}</h4>
                            <div class="setting-group">
                                ${
						flags.map(([flag, details]) => {
							let value = ff(flag);

							let checkbox;
							let state;

							return html.node`
                                        <div class="setting" data-type="toggle" onclick=${() => {
								let current = checkbox.checked;

								checkbox.checked = !current;
								state.setAttribute('aria-checked', !current);

								settings.feature_flags[flag] = !current;
								document.body.setAttribute(
									`data-ff--${flag}`,
									(!current).toString(),
								);
								compile_settings();
							}}>
                                            <div class="heading">
                                                <h5>${details.name}</h5>
                                                ${
								details.notice
									? html.node`<p>${{
										html: details.notice,
									}}</p>`
									: ''
							}
                                                <div class="info-row">
                                                    <div class="new-badge flag-${details.default}">${details.default}</div><p class="date">${details.date}</p><p>${flag}</p>
                                                </div>
                                            </div>
                                            <div class="toggle-wrap">
                                                <input type="checkbox" ref=${(
								el,
							) => (checkbox =
								el)} value=${value} checked=${value} />
                                                <button class="btn toggle colourful" aria-checked=${value} ref=${(
								el,
							) => (state = el)}>
                                                    <div class="dot" />
                                                </button>
                                            </div>
                                        </div>
                                    `;
						})
					}
                            </div>
                        `;
				})}
				</div>
			`,
		);
	} else if (page_id == 'translate') {
		let translation_view_container;

		render(
			page.structure.main,
			html`
				<section class="bleh--panel">
				    ${select({
					values: select_prepare_convert_from_setting(lang_info),
					initial: settings.translator_view,
					func: translation_view,
					title_func: (val) =>
						html.node`
                        <span class="language-header">
                            ${
							flag(
								(convert_lang_to_country[val.value] ||
									val.value).toUpperCase(),
							)
						}
                            <p>${val.text}</p>
                        </span>
                    `,
					hide: true,
				})}
				    <div class="translation-view" ref=${(el) =>
					translation_view_container = el} />
				</section>
			`,
		);

		function translation_view(lang) {
			const language = lang_info[lang];

			render(
				translation_view_container,
				html`
					<div class="language-sub">
					    <div class="language-info colourful translated"><span class="bleh-icon" />${tl(
						trans.amount_translated,
						{ c: language.translated },
					)} (${language.percent}%)</div>
					    ${() => {
						const btn = html.node`
                            <div class="language-info colourful missing" onclick=${() => {
							copy(
								language.missing_keys.map((key) =>
									`${key}: ${get_trans_key(key).en}`
								).join('\n'),
							);
						}}><span class="bleh-icon" />${
							tl(trans.missing_translated, {
								c: language.missing,
							})
						}</div>
                        `;

						tippy(btn, {
							content: tl(trans.click_to_copy),
						});

						return btn;
					}}
					</div>
					<table class="responsive-table">
						<thead>
							<tr>
								<th style="width: 35%">${tl(
									trans.translation_key,
								)}</th>
								<th>${tl(trans.original)}</th>
							</tr>
						</thead>
						<tbody>
					        ${language.missing_keys.map((key) => {
						const row = html.node`
                                <tr>
                                    <td style="width: 35%"><code>${key}</code></td>
                                    <td>${get_trans_key(key).en}</td>
                                </tr>
                            `;

						return row;
					})}
					    </tbody>
					</table>
				`,
			);
		}

		translation_view(settings.translator_view);
	}
}

export function register_skip_to(
	// TODO: wtf is this for, an empty [] is always passed for list in all usages of this function
	list = null,
) {
	if (!ff('skip_to_setting')) return;

	if (list == null) return;

	let panel = page.structure.side.querySelector('.skip-to-list');
	panel.innerHTML = '';

	list.forEach((item) => {
		let button = document.createElement('button');
		button.classList.add('skip-to-item');
		button.setAttribute('onclick', `_scroll_to_setting('${item.id}')`);
		button.textContent = item.name;

		if (item.type != null) button.setAttribute('data-type', item.type);

		panel.appendChild(button);
	});
}

export function scroll_to_setting(id) {
	const setting = page.structure.main.querySelector(`#setting_${id}`);
	if (!setting) return;

	setting.scrollIntoView({
		behavior: 'smooth',
		block: 'center',
	});

	setTimeout(() => {
		setting.classList.add('setting-highlight');
	}, 200);
}

unsafeWindow._change_settings_page = function (page, setting = null) {
	change_settings_page(page, setting);
};

export function change_settings_page(page_id, setting = null) {
	if (page_id == page.state.settings_page) return;

	window.history.pushState(page_id, '', `${root}bleh/${page_id}`);
	page.state.settings_page = page_id;

	page.structure.main.innerHTML = '';

	let btns = page.structure.container.querySelectorAll('.bleh--nav');
	btns.forEach((btn) => {
		const id = btn.getAttribute('data-bleh-page');

		btn.setAttribute('data-hide', page_id != id);

		btn.classList.toggle('secondary-nav-item-link--active', page_id == id);
	});

	try {
		render_setting_page(page_id);
	} catch (e) {
		render(
			page.structure.main,
			html`
				<div class="bleh--panel">
					<div class="loading-data-container">
						<div class="loading-data-text failed">
				            ${tl(trans.value_failed_to_load, {
					v: tl(trans.settings),
				})}
				        </div>
						<pre class="error-info colourful">
				            ${e
					? html
						.node`<span class="error-type">${e.name}</span>: ${e.message}`
					: ''}
				        </pre>
					</div>
				</div>
			`,
		);
	}

	if (setting != null) {
		let setting_container = page.structure.main.querySelector(
			`.setting[data-id="${setting}"]`,
		);

		if (setting_container != null) {
			let y = setting_container.getBoundingClientRect().top +
				window.scrollY -
				300;
			window.scroll({
				top: y,
				behavior: 'smooth',
			});
		}
	}
}

export function load_skus() {
	const local = useSettings.get('feature_flags');

	for (const flag in version.feature_flags) {
		let current_state = version.feature_flags[flag].default;

		if (local[flag] != null) {
			current_state = local[flag];
		}

		document.body.setAttribute(
			`data-ff--${flag}`,
			current_state,
		);
	}
}

unsafeWindow._update_flag_toggle = function (flag, container) {
	update_flag_toggle(flag, container);
};
function update_flag_toggle(flag, container) {
	let button = container.querySelector('.toggle');
	if (!button) return;

	let current_state = ff(flag);

	button.setAttribute('aria-checked', !current_state);
	settings.feature_flags[flag] = !current_state;
	document.body.setAttribute(
		`data-ff--${flag}`,
		`${!current_state}`,
	);

	// save to settings
	compile_settings();
}

function init_profile_notes() {
	let profile_notes_table = page.structure.main.querySelector(
		'.profile-notes',
	);
	if (!profile_notes_table) return;

	let profile_notes =
		JSON.parse(localStorage.getItem('bleh_profile_notes')) || {};

	if (Object.keys(profile_notes).length == 0) return;

	profile_notes_table.classList =
		'generic-table-list user-vertical-list take-space profile-notes';
	profile_notes_table.innerHTML = '';

	for (let user in profile_notes) {
		profile_notes_table.appendChild(html.node`
            <div class="generic-table-list-entry user-vertical-list-item" id="profile-note-row--${user}">
                <div class="name">
                    <a class="mention" href="${root}user/${user}">@${user}</a>
                </div>
                <div class="text preview">
                    <p id="profile-note-row-preview--${user}">${
			profile_notes[user]
		}</p>
                </div>
                <div class="actions">
                    ${() => {
			const btn = html.node`
                            <button class="btn icon chibi list-action" data-type="edit" onclick=${() =>
				edit_profile_note(user)}>
                                ${tl(trans.edit)}
                            </button>
                        `;

			tippy(btn, {
				content: btn.textContent,
			});

			return btn;
		}}
                    ${() => {
			const btn = html.node`
                            <button class="btn icon chibi danger-subtle list-action" data-type="delete" onclick=${() =>
				delete_profile_note(user)}>
                                ${tl(trans.delete)}
                            </button>
                        `;

			tippy(btn, {
				content: btn.textContent,
			});

			return btn;
		}}
                </div>
            </div>
        `);
	}
}

function delete_profile_note(user) {
	let profile_notes =
		JSON.parse(localStorage.getItem('bleh_profile_notes')) || {};
	delete profile_notes[username];
	document
		.getElementById(`profile-note-row--${username}`)
		.style.setProperty('display', 'none');

	set_storage('bleh_profile_notes', JSON.stringify(profile_notes));
}

function edit_profile_note(user) {
	let profile_notes =
		JSON.parse(localStorage.getItem('bleh_profile_notes')) || {};

	let modal = dialog({
		id: 'edit_profile_note',
		title: tl(trans.edit_profile_note),
		body: html.node`
            <textarea class="modal-text" id="bleh--profile-note" placeholder=${
			tl(trans.anything_you_can_imagine)
		}>${profile_notes[user]}</textarea>
            <div class="modal-footer">
                <button class="see-more cancel left-icon" onclick=${() =>
			dialog_rm({ id: 'edit_profile_note' })}>
                    ${tl(trans.cancel)}
                </button>
                <div class="fill"></div>
                <button class="btn primary save" onclick=${() =>
			save_profile_note_in_window(modal, user)}>
                    ${tl(trans.save)}
                </button>
            </div>
        `,
	});
}

function save_profile_note_in_window(modal, user) {
	let profile_notes =
		JSON.parse(localStorage.getItem('bleh_profile_notes')) || {};
	let value_to_save = modal
		.querySelector('#bleh--profile-note')
		.value.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
	profile_notes[user] = value_to_save;

	document.getElementById(`profile-note-row-preview--${user}`).textContent =
		value_to_save;

	set_storage('bleh_profile_notes', JSON.stringify(profile_notes));
	dialog_rm({ id: 'edit_profile_note' });
}

export function prepare_corrections_page() {
	let corrections_table_artist = document.getElementById(
		'corrections-artist',
	);

	for (let artist in artist_corrections) {
		if (artist == 'version') continue;

		corrections_table_artist.appendChild(html.node`
        <div class="correction-row">
                <div class="primary-name pre-transition">
                    <h5>${artist}</h5>
                </div>
                <div class="arrow-divider icon-mask"></div>
                <div class="primary-name post-transition">
                    <h5>${artist_corrections[artist]}</h5>
                </div>
        </div>`);
	}

	//

	let corrections_table_albums_tracks = document.getElementById(
		'corrections-albums_tracks',
	);

	for (let artist in album_track_corrections) {
		if (artist == 'version') continue;

		corrections_table_albums_tracks.appendChild(html.node`
            <div class="artist-row">
                <h5>${artist}</h5>
            </div>
        `);

		for (let media in album_track_corrections[artist]) {
			corrections_table_albums_tracks.appendChild(html.node`
                <div class="correction-row">
                    <div class="primary-name pre-transition">
                        <h5>${media}</h5>
                    </div>
                    <div class="arrow-divider icon-mask"></div>
                    <div class="primary-name post-transition">
                        <h5>${album_track_corrections[artist][media]}</h5>
                    </div>
                </div>
            `);
		}
	}
}

function import_settings() {
	let text;

	const modal = dialog({
		id: 'import_settings',
		title: tl(trans.import_settings),
		body: html.node`
            <p class="big-modal-alert alert-danger">${
			tl(trans.import_notice)
		}</p>
            <br>
            <textarea class="modal-text" ref=${(el) => (text = el)} />
            <div class="modal-footer">
                <button class="see-more cancel left-icon" onclick=${() => {
			dialog_rm({ id: 'import_settings' });
		}}>
                    ${tl(trans.cancel)}
                </button>
                <div class="fill"></div>
                <button class="btn primary download" onclick=${() => {
			try {
				const parsed = JSON.parse(text.value);

				// safe to continue
				set_storage('bleh', text.value);
				Object.assign(settings, parsed);
				useSettings.rebuild();
				load_settings();

				dialog_rm({
					id: 'import_settings',
				});
			} catch (e) {
				// halt
				dialog({
					id: 'import_failed',
					title: tl(trans.import_failed),
					body: html.node`
                                <p class="big-modal-alert alert-error">${
						tl(trans.import_failed.notice)
					}</p>
                                <div class="modal-footer">
                                    <div class="fill"></div>
                                    <button class="btn primary done" onclick=${() =>
						dialog_rm({ id: 'import_failed' })}>
                                        ${tl(trans.done)}
                                    </button>
                                </div>
                            `,
				});
				console.error(e);
			} finally {
			}
		}}>
                    ${tl(trans.import)}
                </button>
            </div>
        `,
	});
}

// export settings
function export_settings() {
	share(JSON.stringify(compile_settings()));
}

// reset settings
function reset_settings() {
	dialog({
		id: 'reset_settings',
		title: tl(trans.reset_settings),
		body: html.node`
            <div class="big-modal-alert alert-error">
                <strong>${tl(trans.reset_notice)}</strong>
                <a class="see-more" onclick=${() => export_settings()}>${
			tl(trans.make_a_backup)
		}</a>
            </div>
            <div class="modal-footer">
                <button class="see-more cancel left-icon" onclick=${() =>
			dialog_rm({ id: 'reset_settings' })}>
                    ${tl(trans.cancel)}
                </button>
                <div class="fill"></div>
                <button class="btn primary icon" data-type="reset" onclick=${() =>
			confirm_reset()}>
                    ${tl(trans.reset)}
                </button>
            </div>
        `,
	});
}

function confirm_reset() {
	for (const member in settings) delete settings[member];
	set_storage('bleh', JSON.stringify(settings));

	useSettings.rebuild();
	load_settings();

	dialog_rm({
		id: 'reset_settings',
	});
}

function activity_preview() {
	let preview = page.structure.main.querySelector('.activity-preview');
	if (!preview) return;

	let random_types = [
		'love',
		'love',
		'love',
		'unlove',
		'bookmark',
		'unbookmark',
		'obsess',
		'image_upload',
		'shout',
		'shout',
		'wiki',
	];
	let random_involved = [
		{
			name: 'Espresso',
			type: 'track',
			sister: 'Sabrina Carpenter',
		},
		{
			name: 'Busy Woman',
			type: 'track',
			sister: 'Sabrina Carpenter',
		},
		{
			name: 'I might say something stupid',
			type: 'track',
			sister: 'Charli xcx',
		},
		{
			name: 'Seigfried',
			type: 'track',
			sister: 'Frank Ocean',
		},
		{
			name: 'OLYMPIAN',
			type: 'track',
			sister: 'Playboi Carti',
		},
		{
			name: 'GODSTAINED',
			type: 'track',
			sister: 'Quadeca',
		},
		{
			name: 'hypochondriac',
			type: 'album',
			sister: 'brakence',
		},
		{
			name: 'my anti-aircraft friend',
			type: 'album',
			sister: 'julie',
		},
		{
			name: 'In Utero',
			type: 'album',
			sister: 'Nirvana',
		},
		{
			name: 'channel ORANGE',
			type: 'album',
			sister: 'Frank Ocean',
		},
		{
			name: 'Future',
			type: 'artist',
		},
		{
			name: 'Billie Eilish',
			type: 'artist',
		},
		{
			name: 'Swirlies',
			type: 'artist',
		},
		{
			name: 'Lucy Bedroque',
			type: 'artist',
		},
		{
			name: 'underscores',
			type: 'artist',
		},
		{
			name: 'Bladee',
			type: 'artist',
		},
		{
			name: 'Charli xcx',
			type: 'artist',
		},
		{
			name: 'Dawn FM',
			type: 'album',
			sister: 'The Weeknd',
		},
		{
			name: 'Random Access Memories',
			type: 'album',
			sister: 'Daft Punk',
		},
		{
			name: "how i'm feeling now",
			type: 'album',
			sister: 'Charli xcx',
		},
		{
			name: 'Revengeseekerz',
			type: 'album',
			sister: 'Jane Remover',
		},
		{
			name: 'Around The Fur',
			type: 'album',
			sister: 'Deftones',
		},
		{
			name: 'Exmilitary',
			type: 'album',
			sister: 'Death Grips',
		},
		{
			name: 'OFFLINE!',
			type: 'album',
			sister: 'JPEGMAFIA',
		},
		{
			name: 'TRUST! - OFFLINE',
			type: 'track',
			sister: 'JPEGMAFIA',
		},
		{
			name: 'Hotline Bling',
			type: 'track',
			sister: 'Drake',
		},
		{
			name: 'All Eyez On Me',
			type: 'track',
			sister: '2Pac',
		},
		{
			name: 'DOGTOOTH',
			type: 'track',
			sister: 'Tyler, The Creator',
		},
		{
			name: 'so american',
			type: 'track',
			sister: 'Olivia Rodrigo',
		},
		{
			name: 'I KNOW ?',
			type: 'track',
			sister: 'Travis Scott',
		},
		{
			name: 'Apple Pie',
			type: 'track',
			sister: 'Travis Scott',
		},
		{
			name: '34+35',
			type: 'track',
			sister: 'Ariana Grande',
		},
		{
			name: 'New Again',
			type: 'track',
			sister: 'Kanye West',
		},
		{
			name: 'Radio Friendly Unit Shifter',
			type: 'track',
			sister: 'Nirvana',
		},
		{
			name: 'Empty Out Your Pockets',
			type: 'track',
			sister: 'Juice WRLD',
		},
		{
			name: 'Party By Myself',
			type: 'track',
			sister: 'Juice WRLD',
		},
		{
			name: 'Death Race For Love',
			type: 'album',
			sister: 'Juice WRLD',
		},
		{
			name: 'Timeless',
			type: 'track',
			sister: 'The Weeknd',
		},
		{
			name: 'SKITZO',
			type: 'track',
			sister: 'The Weeknd',
		},
		{
			name: 'OPM BABI',
			type: 'track',
			sister: 'Playboi Carti',
		},
	];

	make_random_activity(preview, random_types, random_involved);
	make_random_activity(preview, random_types, random_involved);
	make_random_activity(preview, random_types, random_involved);

	page.state.activity_preview_timer = setInterval(function () {
		if (!preview) {
			clearInterval(page.state.activity_preview_timer);
			return;
		}

		make_random_activity(preview, random_types, random_involved);
	}, 2300);
}

function make_random_activity(preview, random_types, random_involved) {
	activity_preview_new(preview, {
		type: random_types[Math.floor(Math.random() * random_types.length)],
		date: new Date(),
		involved: [
			structuredClone(random_involved)[
				Math.floor(Math.random() * random_involved.length)
			],
		],
	});
}

function activity_preview_new(parent, activity) {
	parent.insertBefore(render_activity(activity), parent.firstElementChild);

	if (parent.childElementCount > 3) {
		parent.removeChild(parent.lastElementChild);
	}
}

export function theme_bubbles(func = null) {
	const theme_preview = () =>
		html.node`
        <div class="preview-inner">
            <div class="preview-image" style="background-image: url(${
			avatar(auth.avatar, 'avatar70s')
		})" />
            <div class="preview-card">
                <div class="preview-card-main">
                    <div class="preview-header">Aa</div>
                    <div class="preview-text"></div>
                    <div class="preview-text row-2"></div>
                    <div class="preview-text row-3"></div>
                    <div class="preview-buttons">
                        <div class="preview-button preview-button-primary"></div>
                        <div class="preview-button"></div>
                        <div class="preview-button preview-track"></div>
                    </div>
                </div>
                <div class="preview-card-side">

                </div>
            </div>
        </div>
    `;

	const themes = [
		{
			id: 'adaptive',
			name: tl(trans.auto),
			hide: !ff('adaptive_theme'),
		},
		{
			id: 'glass',
			type: 'light',
			name: tl(trans.glass),
			hide: !ff('glass'),
			new_release: true,
		},
		{
			type: 'sep',
			hide: !ff('adaptive_theme'),
		},
		{
			id: 'light',
			type: 'light',
			name: tl(trans.themes.light),
		},
		{
			id: 'ink',
			type: 'light',
			name: tl(trans.themes.ink),
		},
		{
			type: 'sep',
		},
		{
			id: 'dark',
			formal: 'ash',
			type: 'dark',
			name: tl(trans.themes.dark),
		},
		{
			id: 'darker',
			formal: 'dark',
			type: 'darker',
			name: tl(trans.themes.darker),
		},
		{
			id: 'oled',
			formal: 'void',
			type: 'oled',
			name: tl(trans.themes.oled),
		},
		{
			type: 'sep',
		},
		{
			id: 'rose_pine',
			type: 'rose_pine',
			name: tl(trans.themes.rose_pine),
		},
	];

	let buttons = [];

	const bubbles = html.node`
        <div class="theme-bubbles">
            ${
		themes.map((theme) => {
			if (theme.hide) return html.node``;

			if (theme.type == 'sep') {
				return html.node`
                        <div class="sep theme-bubble-sep" />
                    `;
			}

			if (!theme.formal) theme.formal = theme.id;

			const bubble = html.node`
                    <button class="btn theme-bubble" data-theme-id=${theme.id} onclick=${() =>
				update_theme_bubble(theme.id)}>
                        <div class="bubble">
                            ${
				theme.id == 'adaptive'
					? html.node`
                                <div class="inner theme-preview" data-bleh--theme=${settings.theme_day} data-bleh--theme_type=${
						['light', 'ink'].includes(settings.theme_day)
							? 'light'
							: 'dark'
					}>
                                    ${theme_preview()}
                                </div>
                                <div class="inner theme-preview" data-bleh--theme=${settings.theme_night} data-bleh--theme_type=${
						['light', 'ink'].includes(settings.theme_night)
							? 'light'
							: 'dark'
					}>
                                    ${theme_preview()}
                                </div>
                            `
					: html.node`
                                <div class="inner theme-preview" data-bleh--theme=${theme.id} data-bleh--theme_type=${theme.type}>
                                    ${theme_preview()}
                                </div>
                            `
			}
                        </div>
                        <strong>
                            <span class="theme-name">
                                ${
				icon({ name: icons[`theme_${theme.id}`], identifier: 'theme' })
			}
                                ${theme.name}
                            </span>
                            ${theme.new_release ? new_indicator() : ''}
                        </strong>
                    </button>
                `;

			buttons.push(bubble);

			return bubble;
		})
	}
        </div>
    `;

	bubbles.re_render = () => {
		const adaptive = buttons.find(
			(button) => button.getAttribute('data-theme-id') == 'adaptive',
		);

		const bubble = adaptive.querySelector(':scope > .bubble');

		render(
			bubble,
			html`
				<div class="inner theme-preview" data-bleh--theme=${settings
					.theme_day}
					data-bleh--theme_type=${['light', 'ink'].includes(
							settings.theme_day,
						)
						? 'light'
						: 'dark'}>
				    ${theme_preview()}
				</div>
				<div class="inner theme-preview" data-bleh--theme=${settings
					.theme_night}
					data-bleh--theme_type=${['light', 'ink'].includes(
							settings.theme_night,
						)
						? 'light'
						: 'dark'}>
				    ${theme_preview()}
				</div>
			`,
		);
	};

	update_theme_bubble();

	return bubbles;

	function update_theme_bubble(theme = null) {
		if (theme) {
			if (theme != 'adaptive') {
				save_setting('theme_schedule', false);
				save_setting('theme', theme);
			} else {
				save_setting('theme_schedule', true);
			}

			if (func) func(theme);
		}

		buttons.forEach((button) => {
			const type = button.getAttribute('data-theme-id');

			if (!settings.theme_schedule) {
				button.setAttribute('aria-selected', settings.theme == type);
			} else if (type == 'adaptive') {
				button.setAttribute('aria-selected', true);
			} else {
				button.setAttribute('aria-selected', false);
			}
		});
	}
}
