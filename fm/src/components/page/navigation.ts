/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { settings } from '@/build/config';
import { auth, discord, page, root } from '@/build/page';
import { stored_season } from '@/build/seasonal';
import { lang, lang_info, tl, trans } from '@/build/trans';
import { create_badge, load_badges } from '@/components/shared/badge';
import { version } from '@/main';
import { ff } from '@/components/settings/sku';
import { html, render } from 'lighterhtml';
import { news } from '@/components/news';
import { useSettings } from '@/page.ts';
import { save_setting, setting } from '@/components/settings/settings';
import { prompt_for_update } from '@/components/page/style';
import { log } from '@/build/log.js';
import {
	correct_artist,
	correct_item_by_artist,
	name_includes,
	smart_artists,
	smart_title,
} from '@/components/music/lotus';
import { bleh_notification_list } from '@/components/inbox/notifications';
import tippy from 'tippy.js';
import {
	load_profile_cache_externally,
	open_starred_friend_window,
} from '@/pages/profile/profile';
import { is_sponsor, sponsor } from '@/components/sponsor';
import { generic_link_menu, register_menu } from '@/components/menu';
import { bool, copy, get_language_name, romanise } from '@/build/tools';
import { submit_scrobble } from '@/components/music/scrobble';
import { match } from '@/components/settings/dynamic_theming';
import { DateTime } from 'luxon';
import { input } from '@/components/settings/input';
import { bleh_message_list } from '@/components/inbox/messages';
import { queue_popup } from '@/components/dialog/popup';
import { icon, icons } from '../shared/icon';
import { avatar } from '../shared/avatar';
import { convert_lang_to_country, flag } from '../shared/flag';
import { keys } from '../settings/storage';
import { notify } from '../dialog/notify';
import { new_indicator } from '../shared/indicator';

export function update_branding_type(state = settings.branding_type) {
	if (state == 'bleh') {
		render(
			page.state.home_link,
			html`
				<div class="home-logo bleh-logo" data-refresh=${ff(
					'logo',
				)}>${version.brand}</div>
			`,
		);
	} else if (state == 'lastfm') {
		render(
			page.state.home_link,
			html`
				<div class="home-logo lastfm-logo">Last.fm</div>
			`,
		);
	}
}

export function append_nav() {
	if (settings.developer && !page.structure.indicator) {
		const page_indicator = document.createElement('div');
		page_indicator.classList.add('page-indicator');
		document.documentElement.appendChild(page_indicator);

		page.structure.indicator = page_indicator;
	}

	if (!page.structure.loader) {
		const loader = html.node`
            <div class="loader">
                <div class="loader-bar">
                    <div class="loader-bar-fill" />
                </div>
            </div>
        `;
		document.body.appendChild(loader);
		page.structure.loader = loader;
	}

	if (!page.structure.style_warning) {
		const style_warning = html.node`
            <div class="style-warning" style="position: fixed; top: 0; left: 0; right: 0; padding: 20px; background: #fff; z-index: 1000000000; display: flex; justify-content: center; align-items: center; gap: 30px">
                <strong>${tl(trans.style_warning)}</strong>
                <button class="btn-primary" onclick=${() => {
			save_setting('branch', 'uwu');
			save_setting('dev', false);
			window.location.reload();
		}}>${tl(trans.re_enable_style_loading)}</button>
                <button class="btn-primary" onclick=${() => {
			open(`https://github.com/katelyynn/bleh/raw/uwu/fm/bleh.user.js`);
		}}>${tl(trans.check_for_updates)}</button>
            </div>
        `;
		document.body.appendChild(style_warning);
		page.structure.style_warning = style_warning;
	}

	const update_required = bool(
		localStorage.getItem(keys.update_required) || 'false',
	);

	page.state.quick_access_items = {
		home: {
			name: tl(trans.home),
			icon: icons.home,
			url: `${root}music`,
		},
		reports: {
			name: tl(trans.reports),
			icon: icons.listening_report,
			url: `${root}user/${auth.name}/listening-report`,
		},
		library: {
			name: tl(trans.library),
			icon: icons.library,
			url: `${root}user/${auth.name}/library`,
		},
		shouts: {
			name: tl(trans.shouts),
			icon: icons.shoutbox,
			url: `${root}user/${auth.name}/shoutbox`,
		},
		obsessions: {
			name: tl(trans.obsessions),
			icon: icons.obsessions,
			url: `${root}user/${auth.name}/obsessions`,
		},
		bookmarks: {
			name: tl(trans.bookmarks),
			icon: icons.bookmark,
			url: `${root}music/+bookmarks`,
		},
		friends: {
			name: tl(trans.friends),
			icon: icons.friends,
			url: `${root}user/${auth.name}/friends`,
		},
		notifications: {
			name: tl(trans.notifications),
			icon: icons.notifications,
			url: `${root}inbox/notifications`,
		},
		messages: {
			name: tl(trans.messages),
			icon: icons.messages,
			url: `${root}inbox`,
		},
		collage: {
			name: tl(trans.collage),
			icon: icons.collage,
			url: `${root}bleh/minis/collage`,
		},
		compare: {
			name: tl(trans.compare),
			icon: icons.compare,
			url: `${root}bleh/minis/compare`,
		},
		scrobble: {
			name: tl(trans.scrobble),
			icon: icons.plus,
			action: () => submit_scrobble(),
		},
	};

	const masthead = document.body.querySelector('.masthead');
	if (!masthead) return;
	const inner = masthead.querySelector('.masthead-inner-wrap');

	const masthead_logo = inner.querySelector('.masthead-logo');

	let home_link;
	let home_link_container;

	render(
		masthead_logo,
		html`
			<a class="hidden-link" style="display: none !important" href="/">Last.fm</a>
			<a class="btn navigation-item home-link" href="${root}music"
				ref=${(el) => home_link = el}>
				<span class="home-logo-container" ref=${(el) =>
					home_link_container = el} />
			</a>
			<nav class="navlist navlist--more masthead-nav masthead-nav-top">
				<ul class="navlist-items">
					<a class="btn masthead-nav-control icon" data-type="charts"
						href="${root}charts">
			            ${tl(trans.charts)}
			            ${ff('aihara') ? new_indicator() : ''}
			        </a>
					<a class="btn masthead-nav-control icon" data-type="minis"
						href="${root}bleh/minis">
			            ${tl(trans.minis)}
			        </a>
					<span class="navlist-search" ref=${(el) =>
						page.state.search = el} />
				</ul>
			</nav>
		`,
	);

	page.state.home_link = home_link_container;

	update_branding_type();

	if (update_required) {
		home_link.onclick = (e) => {
			e.preventDefault();
			prompt_for_update();
		};

		home_link.appendChild(html.node`
            <span class="home-version">
                <div class="update-container">
                    <div class="bleh-icon" style="--icon: var(--icon-16-update)" />
                </div>
            </span>
        `);

		tippy(home_link, {
			content: tl(trans.update_available_to_install),
		});
	} else {
		home_link.onclick = null;
	}

	const last_checked = localStorage.getItem(keys.update_checked_date) || null;

	const link_menu = tippy(home_link, {
		theme: 'context-menu',
		content: html.node`
            ${
			setting({
				id: 'branding_type',
				func: update_branding_type,
				in_menu: true,
			})
		}
            <a class="dropdown-menu-clickable-item" data-type="update" href="${root}bleh/general">
                ${
			last_checked
				? tl(trans.last_checked_date, {
					d: DateTime.fromJSDate(new Date(last_checked)).toRelative(),
				})
				: tl(trans.never_checked)
		}
            </a>
        `,
		placement: 'right-start',
		trigger: 'manual',
		interactive: true,
		interactiveBorder: 10,
		offset: [0, 0],
		appendTo: document.body,

		onShow(instance) {
			instance.popper.addEventListener('click', (event) => {
				instance.hide();
			});
		},
	});

	register_menu(home_link, link_menu);

	const navs = inner.querySelector('.masthead-nav-wrap');

	const search = inner.querySelector('.masthead-search-form');
	const form = search.querySelector('.masthead-search-field');
	form.placeholder = tl(trans.search);

	const submit = search.querySelector('.masthead-search-submit');
	submit.classList.add('btn', 'chibi', 'icon-mask');
	submit.setAttribute('data-type', 'search');

	render(
		page.state.search,
		html`
			<span class="navlist-search-container">
			    ${search}
			</span>
		`,
	);

	// 2025-04-14
	const new_auth = masthead.querySelector('.auth-dropdown-menu');

	const links = masthead.querySelector(
		'.masthead-nav:not(.masthead-nav-top) .navlist-items',
	);
	render(links, html``);

	const auth_link = masthead.querySelector(
		'.masthead-nav-wrap > .site-auth .auth-link',
	);
	if (!auth_link) {
		render(
			links,
			html`
				${() => {
					const elem = html.node`
                        <li class="masthead-nav-item">
                            <a class="btn masthead-nav-control chibi" href="${root}bleh" data-label="bleh_no_auth">
                                ${tl(trans.bleh_settings)}
                            </a>
                        </li>
                    `;

					tippy(elem, {
						content: tl(trans.bleh_settings),
					});

					return elem;
				}}
			`,
		);

		masthead.appendChild(html.node`
            <div class="mobile-controls">
                <a class="btn mobile-control icon" data-type="register" href="${root}join">
                    ${tl(trans.sign_up)}
                </a>
                <a class="btn mobile-control icon" aria-checked=${
			page.type == 'settings' || page.type == 'bleh_settings'
		} data-menu-item="settings" href="${root}bleh">
                    ${tl(trans.settings)}
                </a>
                <a class="btn mobile-control icon" data-type="login" href="${root}login">
                    ${tl(trans.log_in)}
                </a>
            </div>
        `);

		return;
	}

	if (auth_link.hasAttribute('data-bleh')) return;
	auth_link.setAttribute('data-bleh', 'true');

	auth_link.classList.add('icon-r');

	const name = html.node`
        <p class="auth-link-name">${auth.name}</p>
    `;
	auth_link.appendChild(name);

	queue_popup('navigation_menu', auth_link);

	load_profile_cache_externally(auth.name).then((cache) => {
		if (cache.username) name.textContent = cache.username;
	});

	const badges = load_badges(auth.name, true);

	if (badges) {
		auth_link.appendChild(create_badge(badges, false, false, true));
	} else if (auth.pro) {
		auth_link.appendChild(html.node`
            <span class="label user-status-subscriber auth-badge">${
			tl(trans.badges['user-status-subscriber'].name)
		}</span>
        `);
	}

	/*let quick_switcher = html.node`
        <li class="masthead-nav-item">
            <button class="masthead-nav-control" data-type="cmd" onclick=${() => page.state.rabbit()}>
                ${tl(trans.quick_switcher)}
            </button>
        </li>
    `;

    tippy(quick_switcher, {
        content: tl(trans.quick_switcher)
    });

    links.appendChild(quick_switcher);*/

	const more_button = html.node`
        <button class="btn masthead-nav-control chibi icon" data-type="more">
            ${tl(trans.more)}
        </button>
    `;

	tippy(more_button, {
		content: more_button.textContent,
	});

	const more_menu = tippy(more_button, {
		content: html.node`
            <a class="dropdown-menu-clickable-item colourful" data-type="discord" href="https://discord.gg/${discord}" target="_blank">
                ${tl(trans.join_discord)}
            </a>
            <button class="dropdown-menu-clickable-item sponsor colourful" data-type="sponsor" onclick=${() =>
			sponsor()}>
                ${tl(trans.sponsor)}
            </button>
            <a class="dropdown-menu-clickable-item lotus colourful" href="https://github.com/katelyynn/lotus/issues/new/choose" target="_blank">
                ${tl(trans.suggest_correction)}
            </a>
            <div class="sep" />
            <a class="dropdown-menu-clickable-item" data-type="update" href="${root}bleh/general">
                ${tl(trans.updates)}
            </a>
            <button class="dropdown-menu-clickable-item" data-menu-item="news" onclick=${() =>
			news()}>
                ${tl(trans.news)}
            </button>
            <a class="dropdown-menu-clickable-item issues" href="https://github.com/katelyynn/bleh/issues" target="_blank">
                ${tl(trans.report_issue)}
            </a>
        `,
		theme: 'menu',
		placement: 'top',
		interactive: true,
		interactiveBorder: 10,
		trigger: 'click',
		appendTo: document.body,

		onShow(instance) {
			instance.popper.addEventListener('click', (event) => {
				instance.hide();
			});
		},
	});

	links.appendChild(more_button);

	const state = page.state.seasons;
	console.info('season', state);

	// configure bleh
	const bleh_container = html.node`
        <a class="btn masthead-nav-control icon chibi" href="${root}bleh" data-label="bleh" data-season="none">
            ${tl(trans.bleh_settings)}
        </a>
    `;
	if (!state.current) {
		tippy(bleh_container, {
			content: tl(trans.bleh_settings),
		});
	} else {
		page.header.season_tooltip = tippy(bleh_container, {
			theme: 'seasonal-swatch',
			content: html.node`
                <span class="season-colour-name colourful" data-season=${stored_season.id}>${
				tl(trans.seasonal.listing[state.current.id])
			}</span>
                <span class="season-exclusive">${
				tl(trans.seasonal.notice)
			}</span>
            `,
		});
	}
	links.appendChild(bleh_container);

	page.header.season = bleh_container;

	// music
	if (auth.pro) {
		const music = html.node`
            <button class="btn masthead-nav-control icon chibi" data-type="now-playing">
                ${tl(trans.music)}
            </button>
        `;

		let status_container;

		tippy(music, {
			content: tl(trans.music),
		});

		tippy(music, {
			content: html.node`
                <div class="window-header">
                    ${
				icon({ name: icons.now_playing, identifier: 'window_header' })
			}
                    <div class="window-title">${tl(trans.music)}</div>
                </div>
                <div class="window-content music-status" ref=${(el) =>
				status_container = el}>
                    <div class="loading-data-container">
                        <div class="loading-data-text">${
				tl(trans.loading)
			}</div>
                    </div>
                </div>
            `,
			theme: 'nav-window',
			placement: 'top',
			interactive: true,
			interactiveBorder: 10,
			trigger: 'click',
			appendTo: document.body,

			onShow(instance) {
				if (page.now.name) render_status_container(page.now);

				live_status().then((status) => render_status_container(status));
			},
		});

		function render_status_container(status: music_status) {
			if (!status) return;

			render(
				status_container,
				html`
					<div class="status">
						<div class="status-image">
							<img src=${status.avatar} alt=${status.album}>
						</div>
						<div class="status-info">
							<strong class="status-text status-title">${status
								.name}</strong>
							<p class="status-text status-artist">${status
								.artist}</p>
							<p class="status-text status-album">${status
								.album}</p>
						</div>
					</div>
					<div class="status-time">
					    ${status.active
						? html.node`
                        <p class="status-text status-time-text chartlist-now-scrobbling">
                            ${tl(trans.scrobbling_now)}
                        </p>
                    `
						: html.node`
                        <p class="status-text status-time-text inactive">
                            ${tl(trans.recent_scrobble)}
                        </p>
                    `}
					</div>
				`,
			);
		}

		links.appendChild(music);
	}

	const notif_count = Number(
		new_auth.querySelector(
			'[data-analytics-label="notifications"] + .auth-avatar-notification-count-badge',
		)?.textContent || '0',
	);
	const messages_count = Number(
		new_auth.querySelector(
			'[data-analytics-label="inbox"] + .auth-avatar-notification-count-badge',
		)?.textContent || '0',
	);

	const count = notif_count + messages_count;

	if (settings.hybrid_inbox) {
		const inbox = html.node`
            <a class="btn masthead-nav-control icon chibi inbox-item" data-type="inbox" href="${root}inbox/notifications">
                <div class="counter" data-count=${count}>${count}</div>
            </a>
        `;

		tippy(inbox, {
			theme: 'stack',
			content: html.node`
                <strong>${tl(trans.inbox)}</strong>
                <div class="inbox-info">
                    <div class="inbox-info-item">
                        ${
				icon({ name: icons.notifications, identifier: 'inbox-tooltip' })
			}
                        ${notif_count}
                    </div>
                    <div class="inbox-sep" />
                    <div class="inbox-info-item">
                        ${
				icon({ name: icons.messages, identifier: 'inbox-tooltip' })
			}
                        ${messages_count}
                    </div>
                </div>
            `,
		});

		inbox.addEventListener('click', (e) => {
			const cmd = e.getModifierState('Control') ||
				e.getModifierState('Meta');
			const new_tab = e.button === 1 || cmd;

			// only allow clicking link if new tab action
			if (!new_tab) e.preventDefault();
		});

		tippy(inbox, {
			content: html.node`
                <div class="window-header">
                    ${icon({ name: icons.inbox, identifier: 'window_header' })}
                    <div class="window-title">${tl(trans.inbox)}</div>
                </div>
                ${setting({ id: 'inbox_view', func: render_inbox })}
                <div class="window-content" />
            `,
			theme: 'nav-window',
			placement: 'top',
			interactive: true,
			interactiveBorder: 10,
			trigger: 'click',
			appendTo: document.body,

			onShow(instance) {
				page.state.inbox_content = instance.popper.querySelector(
					'.window-content',
				);
				page.state.notifications_content = page.state.inbox_content;
				page.state.messages_content = page.state.inbox_content;

				render_inbox();
			},
		});

		links.appendChild(inbox);

		queue_popup('inbox', inbox);
	} else {
		const notifications = html.node`
            <a class="btn masthead-nav-control icon chibi inbox-item" data-type="notifications" href="${root}inbox/notifications">
                <div class="counter" data-count=${notif_count}>${notif_count}</div>
            </a>
        `;

		notifications.addEventListener('click', (e) => {
			const cmd = e.getModifierState('Control') ||
				e.getModifierState('Meta');
			const new_tab = e.button === 1 || cmd;

			// only allow clicking link if new tab action
			if (!new_tab) e.preventDefault();
		});

		tippy(notifications, {
			content: tl(trans.notifications),
		});

		tippy(notifications, {
			content: html.node`
                <div class="window-header">
                    ${
				icon({ name: icons.notifications, identifier: 'window_header' })
			}
                    <div class="window-title">${tl(trans.notifications)}</div>
                </div>
                <div class="window-content" />
            `,
			theme: 'nav-window',
			placement: 'top',
			interactive: true,
			interactiveBorder: 10,
			trigger: 'click',
			appendTo: document.body,

			onShow(instance) {
				page.state.notifications_content = instance.popper
					.querySelector('.window-content');

				render(
					page.state.notifications_content,
					html`
						<div class="mini-notifications content-loading">
							<div class="loading-data-container">
								<div class="loading-data-text">
						            ${tl(trans.loading)}
						        </div>
							</div>
						</div>
					`,
				);

				if (page.notifications.list) {
					render_notifications(page.notifications.list, true);
				}

				fetch_notifications().then((notifications) =>
					render_notifications(notifications, true)
				);
			},
		});

		links.appendChild(notifications);

		//

		const messages = html.node`
            <a class="btn masthead-nav-control icon chibi inbox-item" data-type="messages" href="${root}inbox">
                <div class="counter" data-count=${messages_count}>${messages_count}</div>
            </a>
        `;

		messages.addEventListener('click', (e) => {
			const cmd = e.getModifierState('Control') ||
				e.getModifierState('Meta');
			const new_tab = e.button === 1 || cmd;

			// only allow clicking link if new tab action
			if (!new_tab) e.preventDefault();
		});

		tippy(messages, {
			content: tl(trans.messages),
		});

		tippy(messages, {
			content: html.node`
                <div class="window-header">
                    ${
				icon({ name: icons.messages, identifier: 'window_header' })
			}
                    <div class="window-title">${tl(trans.messages)}</div>
                </div>
                <div class="window-content" />
            `,
			theme: 'nav-window',
			placement: 'top',
			interactive: true,
			interactiveBorder: 10,
			trigger: 'click',
			appendTo: document.body,

			onShow(instance) {
				page.state.messages_content = instance.popper.querySelector(
					'.window-content',
				);

				render(
					page.state.messages_content,
					html`
						<div class="mini-notifications content-loading">
							<div class="loading-data-container">
								<div class="loading-data-text">
						            ${tl(trans.loading)}
						        </div>
							</div>
						</div>
					`,
				);

				if (page.messages.list) {
					render_messages(page.messages.list, true);
				}

				fetch_messages().then((messages) =>
					render_messages(messages, true)
				);
			},
		});

		links.appendChild(messages);
	}

	function render_notifications(notifications, bypass = false) {
		if (settings.inbox_view != 'notifications' && !bypass) return;

		bleh_notification_list(notifications, true);

		render(
			page.state.notifications_content,
			html`
				<div class="mini-notifications">
				    ${notifications}
				    <p class="more-link">
				        <a class="see-more" href="${root}inbox/notifications">${tl(
					trans.read_more,
				)}</a>
				    </p>
				</div>
			`,
		);
	}

	function render_messages(messages, bypass = false) {
		if (settings.inbox_view != 'messages' && !bypass) return;

		bleh_message_list(messages, true);

		render(
			page.state.messages_content,
			html`
				<div class="mini-notifications">
				    ${messages}
				    <p class="more-link">
				        <a class="see-more" href="${root}inbox">${tl(
					trans.read_more,
				)}</a>
				    </p>
				</div>
			`,
		);
	}

	function render_inbox() {
		const view = settings.inbox_view;

		const content = page.state.inbox_content;

		log(`rendering view ${view}`, 'navigation', 'info', { content });
		if (!content) return;

		render(
			content,
			html`
				<div class="mini-notifications content-loading">
					<div class="loading-data-container">
						<div class="loading-data-text">
				            ${tl(trans.loading)}
				        </div>
					</div>
				</div>
			`,
		);

		if (view == 'notifications') {
			if (page.notifications.list) {
				render_notifications(page.notifications.list);
			}

			fetch_notifications().then((notifications) =>
				render_notifications(notifications)
			);
		} else {
			if (page.messages.list) render_messages(page.messages.list);

			fetch_messages().then((messages) => render_messages(messages));
		}
	}

	queue_popup('search', search);

	// language
	const language_options = document.querySelectorAll('.footer-language-form');

	const language_menu = html.node`
        <div class="language-menu">
            <button class="dropdown-menu-clickable-item v2" aria-selected="true">
                <div class="auth-dropdown-item-row">
                    <span class="auth-dropdown-item-left">
                        ${
		flag(
			(convert_lang_to_country[lang] || lang).toUpperCase(),
			'small-flag',
		)
	}
                        ${get_language_name(lang)}
                    </span>
                    ${
		lang in lang_info
			? html.node`
                            <span class="auth-dropdown-item-right">
                                <div class="bleh-icon checkmark" />
                            </span>
                        `
			: ''
	}
                </div>
            </button>
            <div class="sep"></div>
        </div>
    `;

	language_options.forEach((language_option) => {
		const button = language_option.querySelector('button');

		if (!button) {
			log(
				'random last.fm error where this button is non existent',
				'language',
				'error',
				{
					language_options,
					language_option,
					raw: language_option.innerHTML,
					raw_options: language_options,
				},
			);
			return;
		}

		const key = button.getAttribute('name');

		button.classList.remove('mimic-link');
		button.classList.add(
			'dropdown-menu-clickable-item',
			'v2',
			'flex-button',
		);

		render(
			button,
			html`
				<div class="auth-dropdown-item-row">
				    <span class="auth-dropdown-item-left">
				        ${flag(
					(convert_lang_to_country[key] || key).toUpperCase(),
					'small-flag',
				)}
				        ${get_language_name(key)}
				    </span>
				    ${key in lang_info
					? html.node`
                            <span class="auth-dropdown-item-right">
                                <div class="bleh-icon checkmark" />
                            </span>
                        `
					: ''}
				</div>
			`,
		);

		language_menu.appendChild(language_option);
	});

	const themes = [
		{
			id: 'adaptive',
			name: tl(trans.auto),
			hide: !ff('adaptive_theme'),
			new_release: true,
		},
		{
			id: 'glass',
			type: 'light',
			name: tl(trans.glass),
			hide: !ff('glass'),
			new_release: true,
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
	];

	// auth menu
	const token = new_auth
		.querySelector('[name="csrfmiddlewaretoken"]')
		.getAttribute('value');
	page.token = token;

	let auth_menu = tippy(auth_link, {
		theme: 'auth-menu-v2',
		placement: 'top',
		interactive: true,
		interactiveBorder: 10,
		trigger: 'click',
		appendTo: document.body,

		onShow: (instance) => {
			if (!auth.avatar) {
				notify({
					id: 'auth_broken',
					title: 'Could not open navigation menu',
					body: 'Authorisation status is invalid',
				});

				instance.hide();
				return;
			}

			page.structure.notifications.setAttribute('data-auth-open', 'true');

			const update_required =
				localStorage.getItem('bleh_update_required') || 'false';

			let page_2;
			let side;

			const current = settings.navigation_items;

			let length = current.length;
			if (length < 2) length = 2;

			const show_language = settings.navigation_language == true ? 1 : 0;
			const gap = 1;

			// user defined + themes + language + minis + settings
			const height = (length + 3 + show_language) * (28 + gap) - gap;

			// you cant change your theme when viewing
			// a listening report or on a page with theme settings
			const themes_disabled =
				page.subpage.startsWith('listening-report') ||
				page.state.settings_page == 'visual';

			let auth_header;
			let auth_bg;

			instance.setContent(html.node`
                ${
				update_required == 'true'
					? html.node`
                <div class="update-available-banner" onclick=${() => {
						prompt_for_update();
					}}>
                    <div class="update-container">
                        ${icon({ name: icons.update })}
                    </div>
                    <span>${tl(trans.update_available_to_install)}</span>
                </div>
                `
					: ''
			}
                <div class="auth-menu-v2" style="--page-height: ${height}px">
                    <div class="side primary" onclick=${() => {
				instance.hide();
			}}>
                        <div class="auth-bg-container" ref=${(el) =>
				auth_bg = el}>
                            ${
				!auth.avatar.endsWith('818148bf682d429dc215c1705eb27b98.png')
					? html.node`
                            <div class="bg" style="background-image: url(${
						avatar(auth.avatar, 'avatar170s')
					})" />
                            `
					: ''
			}
                        </div>
                        <div class="auth-menu-header" ref=${(el) =>
				auth_header = el}>
                            <div class="avatar">
                                <img src=${
				avatar(auth.avatar, 'avatar170s')
			} alt=${auth.name} />
                            </div>
                            <div class="name"><span class="at">@</span>${auth.name}</div>
                            ${
				badges
					? html.node`
                                <div class="badges">
                                    ${create_badge(badges, false, true)}
                                </div>
                            `
					: auth.pro
					? html.node`
                                <div class="badges">
                                    ${() => {
						const elem = html.node`
                                            <span class="label user-status-subscriber no-hover expand small">
                                                ${
							tl(trans.badges['user-status-subscriber'].name)
						}
                                            </span>
                                        `;

						tippy(elem, {
							theme: 'badge',
							placement: 'bottom',
							content: html.node`
                                                <div class="badge-name colourful user-status-subscriber">${
								tl(trans.badges['user-status-subscriber'].name)
							}</div>
                                                <div class="badge-reason">${
								tl(
									trans.badges['user-status-subscriber']
										.reason,
								)
							}</div>
                                            `,
						});

						return elem;
					}}
                                </div>
                            `
					: ''
			}
                            <a class="link-block-cover-link" href="${root}user/${auth.name}" onclick=${() => {
				instance.hide();
			}} />
                        </div>
                        <div class="floating button-group">
                            ${() => {
				let button = html.node`
                                    <a class="dropdown-menu-clickable-item chibi" data-type="edit_mini" href="${root}settings" onclick=${() => {
					instance.hide();
				}}>
                                        ${tl(trans.edit_profile)}
                                    </a>
                                `;

				tippy(button, {
					content: button.textContent,
				});

				return button;
			}}
                            ${
				useSettings.get('starred_friend') != ''
					? () => {
						let button = html.node`
                                    <a class="dropdown-menu-clickable-item chibi colourful" data-type="starred_friend" data-starred="true" href="${root}user/${
							useSettings.get('starred_friend')
						}" onclick=${() => {
							instance.hide();
						}}>${useSettings.get('starred_friend')}</a>
                                `;

						tippy(button, {
							content: useSettings.get('starred_friend'),
						});

						return button;
					}
					: () => {
						let button = html.node`
                                    <button class="dropdown-menu-clickable-item chibi" data-type="starred_friend" data-is-shortcut="false" onclick=${() =>
							open_starred_friend_window()}>${
							tl(trans.starred_friend.name)
						}</button>
                                `;

						tippy(button, {
							content: tl(
								trans.starred_friend.name,
							),
						});

						return button;
					}
			}
                        </div>
                    </div>
                    <div class="side" ref=${(el) => (side = el)} data-page="1">
                        <div class="side-page" data-page="1">
                            ${
				current.map((val) => {
					let elem;

					const formal = page.state.quick_access_items[val];

					if (formal.url) {
						elem = html.node`<a href=${formal.url} onclick=${() => {
							instance.hide();
						}} />`;
					} else {
						elem = html.node`<button onclick=${() => {
							formal.action();
							instance.hide();
						}} />`;
					}

					elem.classList = 'dropdown-menu-clickable-item';
					elem.setAttribute('data-type', formal.icon);
					elem.textContent = formal.name;

					let count = 0;

					if (val == 'notifications') count = notif_count;
					else if (val == 'messages') count = messages_count;

					if (count) {
						render(
							elem,
							html`
								<div class="auth-dropdown-item-row">
									<span class="auth-dropdown-item-left">
								        ${formal.name}
								    </span>
									<span class="auth-dropdown-item-right">
								        ${count}
								    </span>
								</div>
							`,
						);
					}

					if (val == 'friends') {
						elem = html.node`
                                        <div class="button-combo">
                                            <a class="dropdown-menu-clickable-item" data-type=${formal.icon} href=${formal.url} onclick=${() => {
							instance.hide();
						}}>
                                                ${formal.name}
                                            </a>
                                            <div class="button-combo-sep" />
                                            <button class="dropdown-menu-clickable-item chibi" data-type="continue" onclick=${() => {
							const cache = JSON.parse(
								localStorage.getItem(keys.profile_cache) ||
									'{}',
							);
							const friends = settings.friends.filter((
								friend: string,
							) => friend != useSettings.get('starred_friend'));

							render(page_2, html``); // fix crash
							render(
								page_2,
								html`
									<button class="dropdown-menu-clickable-item" data-type="back" onclick=${() => {
										side.setAttribute('data-page', '1');
									}}>
									    ${tl(trans.back)}
									</button>
									${useSettings.get('starred_friend')
										? () => {
											const friend = settings
												.starred_friend as string;
											const valid = is_sponsor(friend);

											return html.node`
                                                            <a class="dropdown-menu-clickable-item" data-type="profile" href="${root}user/${friend}">
                                                                ${
												cache[friend]?.username && valid
													? html.node`
                                                                    <span class="username-combo">
                                                                        <span class="username-custom">${
														cache[friend].username
													}</span>
                                                                        <span class="username-original">
                                                                            <span class="at">@</span>${friend}
                                                                        </span>
                                                                    </span>
                                                                `
													: html.node`
                                                                    <span><span class="at">@</span>${friend}</span>
                                                                `
											}
                                                                <span class="star-icon colourful">
                                                                    <span class="bleh-icon" />
                                                                </span>
                                                            </a>
                                                        `;
										}
										: ''}
									${friends.map((friend: string) => {
										const valid = is_sponsor(friend);

										return html.node`
                                                            <a class="dropdown-menu-clickable-item" data-type="profile" href="${root}user/${friend}">
                                                                ${
											cache[friend]?.username && valid
												? html.node`
                                                                    <span class="username-combo">
                                                                        <span class="username-custom">${
													cache[friend].username
												}</span>
                                                                        <span class="username-original">
                                                                            <span class="at">@</span>${friend}
                                                                        </span>
                                                                    </span>
                                                                `
												: html.node`
                                                                    <span><span class="at">@</span>${friend}</span>
                                                                `
										}
                                                            </a>
                                                        `;
									})}
									<div class="sep" />
									<button class="dropdown-menu-clickable-item" data-type="edit" onclick=${() => {
										open_starred_friend_window();
										instance.hide();
									}}>
									    ${tl(trans.edit_close_friends)}
									</button>
								`,
							);
							side.setAttribute('data-page', '2');
						}}>
                                                ${tl(trans.more)}
                                            </button>
                                        </div>
                                    `;
					}

					const simple_menu = tippy(elem, {
						theme: 'context-menu',
						content: html.node`
                                        <a class="dropdown-menu-clickable-item" data-type="quick_access" href="${root}bleh/profile?setting=navigation_items">
                                            ${tl(trans.edit_quick_access)}
                                        </a>
                                    `,
						placement: 'right-start',
						trigger: 'manual',
						interactive: true,
						interactiveBorder: 10,
						offset: [0, 0],
						appendTo: document.body,

						onShow(instance) {
							instance.popper.addEventListener(
								'click',
								(event) => {
									instance.hide();
								},
							);
						},
					});

					register_menu(elem, simple_menu);

					return elem;
				})
			}
                            <div class="button-combo">
                                <button class="dropdown-menu-clickable-item" data-menu-item="themes" disabled=${themes_disabled}>
                                    ${tl(trans.themes.name)}
                                </button>
                                <div class="button-combo-sep" />
                                <button class="dropdown-menu-clickable-item chibi" data-type="continue" disabled=${themes_disabled} onclick=${() => {
				let buttons = [];

				render(page_2, html``); // fix crash
				render(
					page_2,
					html`
						<button class="dropdown-menu-clickable-item" data-type="back" onclick=${() => {
							side.setAttribute('data-page', '1');
						}}>
						    ${tl(trans.back)}
						</button>
						${themes.map((theme) => {
							if (theme.hide) {
								return html.node``;
							}

							if (!theme.formal) {
								theme.formal = theme.id;
							}

							const btn = html.node`
                                                <button class="dropdown-menu-clickable-item theme-item-in-menu" aria-selected=${
								!settings.theme_schedule
									? settings.theme == theme.id
									: theme.id == 'adaptive'
							} data-bleh-theme=${theme.id} data-type="theme_${theme.formal}" onclick="${() => {
								if (theme.id != 'adaptive') {
									save_setting('theme_schedule', false);
									save_setting('theme', theme.id);
								} else {
									save_setting('theme_schedule', true);
									match();
								}

								buttons.forEach(
									(button) => {
										const type = button.getAttribute(
											'data-bleh-theme',
										);

										if (
											!settings.theme_schedule
										) {
											button.setAttribute(
												'aria-selected',
												settings.theme ==
													type,
											);
										} else if (
											type ==
												'adaptive'
										) {
											button.setAttribute(
												'aria-selected',
												true,
											);
										} else {
											button.setAttribute(
												'aria-selected',
												false,
											);
										}
									},
								);
							}}">
                                                    ${theme.name}
                                                </button>
                                            `;

							buttons.push(btn);
							return btn;
						})}
					`,
				);
				side.setAttribute('data-page', '2');
			}}>
                                    ${tl(trans.more)}
                                </button>
                            </div>
                            ${
				show_language
					? html.node`
                            <div class="button-combo">
                                <button class="dropdown-menu-clickable-item" data-menu-item="language" onclick=${() => {
						render(
							page_2,
							html`
								<button
								    class="dropdown-menu-clickable-item"
								    data-type="back"
								    onclick=${() => {
									side.setAttribute(
										'data-page',
										'1',
									);
								}}
								>
								    ${tl(trans.back)}
								</button>
								${language_menu}
							`,
						);
						side.setAttribute('data-page', '2');
					}}>
                                    ${tl(trans.language)}
                                </button>
                                <div class="button-combo-sep" />
                                <button class="dropdown-menu-clickable-item chibi" data-type="continue" onclick=${() => {
						render(
							page_2,
							html`
								<button
								    class="dropdown-menu-clickable-item"
								    data-type="back"
								    onclick=${() => {
									side.setAttribute(
										'data-page',
										'1',
									);
								}}
								>
								    ${tl(trans.back)}
								</button>
								${language_menu}
							`,
						);
						side.setAttribute('data-page', '2');
					}}>
                                    ${tl(trans.more)}
                                </button>
                            </div>
                            `
					: ''
			}
                            <div class="button-combo">
                                <a class="dropdown-menu-clickable-item" data-type="mini" href="${root}bleh/minis" onclick=${() => {
				instance.hide();
			}}>
                                    ${tl(trans.minis)}
                                </a>
                                <div class="button-combo-sep" />
                                ${() => {
				const button = html.node`
                                        <button class="dropdown-menu-clickable-item chibi" data-menu-item="news" onclick=${() => {
					news();
					instance.hide();
				}}>
                                            ${tl(trans.news)}
                                        </button>
                                    `;

				tippy(button, {
					content: button.textContent,
				});

				return button;
			}}
                            </div>
                            <div class="button-combo">
                                <a class="dropdown-menu-clickable-item accented-menu-item" data-menu-item="bleh" href="${root}bleh" onclick=${() => {
				instance.hide();
			}}>
                                    ${tl(trans.settings)}
                                </a>
                                <div class="button-combo-sep" />
                                ${() => {
				let button;
				let form = html.node`
                                        <form class="chibi">
                                            <input type="hidden" name="csrfmiddlewaretoken" value="${token}">
                                            <a class="dropdown-menu-clickable-item chibi colourful" ref=${(
					el,
				) => (button =
					el)} data-menu-item="logout" href="${root}logout" onclick=${() => {
					instance.hide();
				}}>
                                                ${tl(trans.logout)}
                                            </a>
                                        </form>
                                    `;

				tippy(button, {
					content: button.textContent,
				});

				return form;
			}}

                            </div>
                        </div>
                        <div class="side-page" data-page="2" ref=${(
				el,
			) => (page_2 = el)} />
                    </div>
                </div>
            `);

			load_profile_cache_externally(auth.name).then((cache) => {
				render(
					auth_bg,
					html`
						${cache.banner
							? html.node`
                    <div class="bg" style="background-image: url(${cache.banner})" />
                    `
							: !auth.avatar.endsWith(
									'818148bf682d429dc215c1705eb27b98.png',
								)
							? html.node`
                    <div class="bg" style="background-image: url(${
								avatar(auth.avatar, 'avatar170s')
							})" />
                    `
							: ''}
					`,
				);
				render(
					auth_header,
					html`
						<div class="avatar">
						    <img src=${avatar(
							auth.avatar,
							'avatar170s',
						)} alt=${auth.name} />
						</div>
						<div class="name">${cache.username
							? cache.username
							: html
								.node`<span class="at">@</span>${auth.name}`}</div>
						${badges
							? html.node`
                        <div class="badges">
                            ${create_badge(badges, false, true, true)}
                        </div>
                    `
							: auth.pro
							? html.node`
                        <div class="badges">
                            ${() => {
								const elem = html.node`
                                    <span class="label user-status-subscriber no-hover expand small">
                                        ${
									tl(
										trans.badges['user-status-subscriber']
											.name,
									)
								}
                                    </span>
                                `;

								tippy(elem, {
									theme: 'badge',
									placement: 'bottom',
									content: html.node`
                                        <div class="badge-name colourful user-status-subscriber">${
										tl(
											trans
												.badges[
													'user-status-subscriber'
												].name,
										)
									}</div>
                                        <div class="badge-reason">${
										tl(
											trans
												.badges[
													'user-status-subscriber'
												].reason,
										)
									}</div>
                                    `,
								});

								return elem;
							}}
                        </div>
                    `
							: ''}
						<a class="link-block-cover-link" href="${root}user/${auth
							.name}" />
					`,
				);
			});
		},

		onHide(instance) {
			page.structure.notifications.setAttribute(
				'data-auth-open',
				'false',
			);
		},
	});

	const auth_drop_menu = tippy(auth_link, {
		theme: 'context-menu',
		content: html.node`
            <a class="dropdown-menu-clickable-item" data-type="quick_access" href="${root}bleh/profile?setting=navigation_items">
                ${tl(trans.edit_quick_access)}
            </a>
            <button class="dropdown-menu-clickable-item" data-type="copy" onclick=${() =>
			copy(auth.name)}>
                ${tl(trans.copy_username)}
            </button>
            <div class="sep" />
            ${
			generic_link_menu(
				`${root}user/${auth.name}`,
				`https://www.last.fm${root}user/${auth.name}`,
			)
		}
        `,
		placement: 'right-start',
		trigger: 'manual',
		interactive: true,
		interactiveBorder: 10,
		offset: [0, 0],
		appendTo: document.body,

		onShow(instance) {
			instance.popper.addEventListener('click', (event) => {
				instance.hide();
			});
		},
	});

	register_menu(auth_link, auth_drop_menu);

	const container = new_auth.parentElement;
	container.parentElement.removeChild(container);
	auth_link.removeAttribute('aria-controls');
	auth_link.removeAttribute('data-disclose-hover');
	auth_link.removeAttribute('data-disclose-hover--allow-enter-open');

	auth_link.addEventListener('click', (e) => {
		const cmd = e.getModifierState('Control') || e.getModifierState('Meta');
		const new_tab = e.button === 1 || cmd;

		// only allow clicking link if new tab action
		if (!new_tab) e.preventDefault();
	});

	// mobile
	masthead.appendChild(html.node`
        <div class="mobile-controls">
            ${() => {
		const btn = html.node`
                    <a class="btn mobile-control icon" aria-checked=${
			page.type == 'inbox'
		} data-type="inbox">
                        ${tl(trans.inbox)}
                        ${
			count > 0
				? html.node`<div class="notification-count-badge"></div>`
				: ''
		}
                    </a>
                `;

		tippy(btn, {
			theme: 'mobile',
			content: html.node`
                        <div class="window-header">
                            <div class="bleh-icon" data-type="inbox" style="--icon: var(--mask)" />
                            <div class="window-title">${tl(trans.inbox)}</div>
                        </div>
                        ${setting({ id: 'inbox_view', func: render_inbox })}
                        <div class="window-content" />
                    `,
			placement: 'top',
			interactive: true,
			interactiveBorder: 10,
			trigger: 'click',
			appendTo: document.body,

			onShow(instance) {
				console.info(
					'navigation instance',
					instance,
					instance.popper,
				);
				page.state.inbox_content = instance.popper.querySelector(
					'.window-content',
				);

				render_inbox();
			},
		});

		return btn;
	}}
            ${() => {
		const btn = html.node`
                    <a class="btn mobile-control icon" aria-checked=${
			page.type == 'user' && page.name == auth.name
		} data-menu-item="profile_mobile">
                        <span class="avatar">
                            <img src=${auth.avatar} alt=${auth.name}>
                        </span>
                        ${auth.name}
                        ${
			update_required === 'true'
				? html.node`<div class="notification-count-badge"></div>`
				: ''
		}
                    </a>
                `;

		tippy(btn, {
			theme: 'mobile',
			content: html.node`
                        <div class="window-menu-items">
                            <a class="btn window-menu-item icon-r window-menu-item-big" href="${root}user/${auth.name}">
                                <span class="avatar window-menu-avatar">
                                    <img src=${
				avatar(auth.avatar, 'avatar170s')
			} alt=${auth.name}>
                                </span>
                                ${auth.name}
                            </a>
                            ${
				useSettings.get('starred_friend') != ''
					? html.node`
                                <a class="btn window-menu-item icon-r colourful" data-type="starred_friend" data-starred="true" href="${root}user/${
						useSettings.get('starred_friend')
					}">
                                    ${icon({ name: 'inherit' })}
                                    ${useSettings.get('starred_friend')}
                                </a>
                            `
					: ''
			}
                            <button class="btn window-menu-item icon-r" onclick=${() => {
				news();
			}}>
                                ${icon({ name: icons.news })}
                                ${tl(trans.news)}
                            </button>
                            ${
				settings.navigation_items.map((val) => {
					let elem;

					const formal = page.state.quick_access_items[val];

					if (formal.url) {
						elem = html.node`<a href=${formal.url} />`;
					} else {
						elem = html.node`<button onclick=${formal.action} />`;
					}

					elem.classList = 'btn window-menu-item icon-r';

					render(
						elem,
						html`
							${icon({ name: formal.icon })}
							${formal.name}
						`,
					);

					let count = 0;

					if (val == 'notifications') count = notif_count;
					else if (val == 'messages') count = messages_count;

					if (count) {
						render(
							elem,
							html`
								${icon({ name: formal.icon })}
								<div class="auth-dropdown-item-row">
								    <span
								        class="auth-dropdown-item-left"
								    >
								        ${formal.name}
								    </span>
								    <span
								        class="auth-dropdown-item-right"
								    >
								        ${count}
								    </span>
								</div>
							`,
						);
					}

					return elem;
				})
			}
                            <a class="btn window-menu-item icon-r" aria-checked=${
				page.type == 'bleh_settings'
			} href="${root}bleh">
                                ${icon({ name: icons.bleh_settings })}
                                ${version.brand}
                            </a>
                            <a class="btn window-menu-item icon-r" aria-checked=${
				page.type == 'settings'
			} href="${root}settings">
                                ${icon({ name: icons.settings })}
                                ${tl(trans.settings)}
                            </a>
                            <form>
                                <input type="hidden" name="csrfmiddlewaretoken" value="${token}">
                                <a class="btn window-menu-item icon-r colourful" ref=${(
				el,
			) => (button = el)} data-menu-item="logout" href="${root}logout">
                                    ${icon({ name: icons.logout })}
                                    ${tl(trans.logout)}
                                </a>
                            </form>
                        </div>
                    `,
			placement: 'top',
			interactive: true,
			interactiveBorder: 10,
			trigger: 'click',
			appendTo: document.body,
		});

		return btn;
	}}
            ${() => {
		const btn = html.node`
                    <a class="btn mobile-control icon" aria-checked=${
			page.type == 'search'
		} data-menu-item="search">
                        ${tl(trans.search)}
                    </a>
                `;

		let search_input;

		tippy(btn, {
			theme: 'mobile',
			content: html.node`
                        <div class="window-header">
                            <div class="bleh-icon" data-type="search" style="--icon: var(--mask)" />
                            <div class="window-title">${tl(trans.search)}</div>
                        </div>
                        ${() => {
				const form = html.node`
                                <form action="${root}search" method="get">
                                    ${(search_input = input({
					name: 'q',
					func: () => {
						form.submit();
					},
				}))}
                                </form>
                            `;

				return form;
			}}
                    `,
			placement: 'top',
			interactive: true,
			interactiveBorder: 10,
			trigger: 'click',
			appendTo: document.body,

			onShow() {
				search_input.focus();
			},
		});

		return btn;
	}}
        </div>
    `);
}

interface music_status {
	next_fetch: Date;
	name: Element;
	artist: Element;
	album: Element;
	avatar: string;
	active: boolean;
}

export async function live_status() {
	if (page.now.next_fetch && Date.now() < page.now.next_fetch) {
		return page.now;
	}

	try {
		const res = await fetch(`${root}user/${auth.name}/partial/now`);
		if (!res.ok) {
			log('failed to fetch', 'live', 'error', { res });
			return;
		}

		const dom = await res.text();
		const parser = new DOMParser();
		const doc = parser.parseFromString(dom, 'text/html');

		const intro = doc.querySelector('.user-now-intro');

		let active = true;
		if (
			intro.textContent.trim() ===
				tl(trans.last_scrobbled_replace).replace('{u}', auth.name)
		) {
			active = false;
		}

		const track = doc.querySelector('.user-now-track a');
		const links = doc.querySelectorAll('.user-now-artist-and-album a');

		let artist = links[0];
		const album = links[1];
		const avatar = doc.querySelector('.cover-art img')?.src;

		// keep them in the same tab
		track.removeAttribute('target');
		artist.removeAttribute('target');
		album.removeAttribute('target');

		let next = new Date();
		next.setMinutes(next.getMinutes() + 1);

		if (useSettings.get('format_guest_features')) {
			album.textContent = romanise(
				correct_item_by_artist(album.textContent, artist.textContent),
			);

			const formatted = name_includes(
				track.textContent,
				artist.textContent,
			);

			track.classList.add('smart-title');
			render(
				track,
				smart_title(formatted.song_title, formatted.song_tags),
			);
			artist = html.node`<span class="artist">${
				smart_artists(formatted.song_artist, formatted.song_guests)
			}</span>`;
		} else if (useSettings.get('corrections')) {
			album.textContent = romanise(
				correct_item_by_artist(album.textContent, artist.textContent),
			);
			track.textContent = romanise(
				correct_item_by_artist(track.textContent, artist.textContent),
			);
			artist.textContent = romanise(correct_artist(artist.textContent));
		}

		page.now = {
			next_fetch: next,
			name: track,
			artist,
			album,
			avatar,
			active,
		} as music_status;

		return page.now;
	} catch (error) {
		log('exception during fetch', 'live', 'error', { error: error });
	}
}

export async function fetch_notifications() {
	if (
		page.notifications.next_fetch &&
		Date.now() < page.notifications.next_fetch
	) {
		return page.notifications.list;
	}

	try {
		const res = await fetch(`${root}inbox/notifications`);
		if (!res.ok) {
			log('failed to fetch', 'live', 'error', { res });
			return;
		}

		const dom = await res.text();
		const parser = new DOMParser();
		const doc = parser.parseFromString(dom, 'text/html');

		const list = doc.querySelector('.inbox-notifications');

		const next = new Date();
		next.setMinutes(next.getMinutes() + 2);

		page.notifications.next_fetch = next;

		if (list) {
			page.notifications.list = list;

			return list;
		}
	} catch (error) {
		log('exception during fetch', 'live', 'error', { error: error });
	}
}

export async function fetch_messages() {
	if (page.messages.next_fetch && Date.now() < page.messages.next_fetch) {
		return page.messages.list;
	}

	try {
		const res = await fetch(`${root}inbox`);
		if (!res.ok) {
			log('failed to fetch', 'live', 'error', { res });
			return;
		}

		const dom = await res.text();
		const parser = new DOMParser();
		const doc = parser.parseFromString(dom, 'text/html');

		const list = doc.querySelector('.inbox-table tbody');

		const next = new Date();
		next.setMinutes(next.getMinutes() + 2);

		page.messages.next_fetch = next;

		if (list) {
			page.messages.list = list;

			return list;
		}
	} catch (error) {
		log('exception during fetch', 'live', 'error', { error: error });
	}
}
