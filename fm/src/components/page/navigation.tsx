/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { settings } from '@/build/config';
import { auth, discord, page, root } from '@/build/page';
import { stored_season } from '@/build/seasonal';
import { lang, lang_info, lastfm_languages, tl, trans } from '@/build/trans';
import { create_badge, load_badges } from '@/components/shared/badge';
import { version } from '@/main';
import { ff } from '@/components/settings/sku';
import { html, render } from 'lighterhtml';
import { news } from '@/components/news';
import { useSettings } from '@/page.ts';
import { save_setting, setting } from '@/components/settings/settings';
import { prompt_for_update } from '@/components/page/style';
import { log } from '@/build/log.ts';
import {
	correct_artist,
	correct_item_by_artist,
	name_includes,
	smart_artists,
	smart_title,
} from '@/components/music/lotus';
import { bleh_notification_list } from '@/components/inbox/notifications';
import tippy, { Instance } from 'tippy.js';
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
import { Icon, icon, icons } from '../shared/icon';
import { avatar } from '../shared/avatar';
import { convert_lang_to_country, Flag, flag } from '../shared/flag';
import { keys } from '../settings/storage';
import { notify } from '../dialog/notify';
import { new_indicator } from '../shared/indicator';
import { createRef, ReactElement, RefObject } from 'jsx-dom';
import { toggle_theme } from '@/config.ts';
import { dark_themes, getThemes, light_themes, theme } from '@/build/theme.ts';
import {
	Button,
	ButtonCombo,
	ButtonComboSeparator,
} from '@/components/button/button.tsx';
import { menu_tooltip, Tooltip } from '@/components/shared/tooltips.tsx';
import { MenuContents } from '@/components/menu/menu.tsx';
import {
	NavWindow,
	NavWindowContents,
	NavWindowHeader,
} from '@/components/menu/nav_window.tsx';
import { Tabbed } from '@/components/tab/tabbed.tsx';
import { PanelHead } from '@/components/text/head.tsx';

export function update_branding_type(state = settings.branding_type) {
	if (state == 'bleh') {
		page.state.home_link.replaceChildren(
			<div class={['home-logo', 'bleh-logo']}>
				{version.brand}
			</div>,
		);
	} else if (state == 'lastfm') {
		page.state.home_link.replaceChildren(
			<div class={['home-logo', 'lastfm-logo']}>
				{'Last.fm'}
			</div>,
		);
	}
}

export function append_nav() {
	if (settings.developer && !page.structure.indicator) {
		const page_indicator = <div class='page-indicator' />;
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
		const style_warning = (
			<div
				class='style-warning'
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					padding: '20px',
					background: '#fff',
					zIndex: 100000000,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					gap: '30px',
				}}
			>
				<strong>{tl(trans.style_warning)}</strong>
				<button
					type='button'
					class='btn-primary'
					onClick={() => {
						useSettings.set('branch', 'uwu');
						useSettings.set('dev', false);
						window.location.reload();
					}}
				>
					{tl(trans.re_enable_style_loading)}
				</button>
				<button
					type='button'
					class='btn-primary'
					onClick={() => {
						open(
							`https://github.com/katelyynn/bleh/raw/uwu/fm/bleh.user.js`,
						);
					}}
				>
					{tl(trans.check_for_updates)}
				</button>
			</div>
		);
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
		events: {
			name: tl(trans.events),
			icon: icons.events,
			url: `${root}user/${auth.name}/events`,
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

	const home_link = createRef();
	const home_link_logo = createRef();

	const search_wrap = createRef();

	masthead_logo.replaceChildren(
		<>
			<a class='hidden-link'>
				Last.fm
			</a>
			<a
				class={['btn', 'navigation-item', 'home-link']}
				href={`${root}music`}
				ref={home_link}
			>
				<span class='home-logo-container' ref={home_link_logo} />
			</a>
			<nav
				class={[
					'navlist',
					'navlist--more',
					'masthead-nav',
					'masthead-nav-top',
				]}
			>
				<ul class='navlist-items'>
					<a
						class={['btn', 'masthead-nav-control', 'icon']}
						data-type='charts'
						href={`${root}charts`}
					>
						{tl(trans.charts)}
						{ff('aihara') && new_indicator()}
					</a>
					<a
						class={['btn', 'masthead-nav-control', 'icon']}
						data-type='minis'
						href={`${root}bleh/minis`}
					>
						{tl(trans.minis)}
					</a>
					<span class='navlist-search' ref={search_wrap} />
				</ul>
			</nav>
		</>,
	);

	page.state.home_link = home_link_logo.current;

	update_branding_type();

	const handle_update = (e: Event) => {
		e.preventDefault();
		prompt_for_update();
	};

	if (update_required) {
		home_link.current.addEventListener('onclick', handle_update);

		home_link.current.appendChild(
			<span class='home-version'>
				<div class='update-container'>
					<Icon name={icons.update} />
				</div>
			</span>,
		);

		tippy(home_link.current, {
			content: tl(trans.update_available_to_install),
		});
	} else {
		home_link.current.removeEventListener('onclick', handle_update);
	}

	const last_checked = localStorage.getItem(keys.update_checked_date) || null;

	const link_menu = tippy(home_link.current, {
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

	register_menu(home_link.current, link_menu);

	const navs = inner.querySelector('.masthead-nav-wrap');

	const search = inner.querySelector('.masthead-search-form');
	const form = search.querySelector('.masthead-search-field');
	form.placeholder = tl(trans.search);

	const submit = search.querySelector('.masthead-search-submit');
	submit.classList.add('btn', 'chibi', 'icon-mask');
	submit.setAttribute('data-type', 'search');

	search_wrap.current.replaceChildren(
		<span class='navlist-search-container'>
			{search}
		</span>,
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

	const more_button = (
		<Button chibi className='masthead-nav-control' tooltip={tl(trans.more)}>
			<Icon name={icons.more} />
			{tl(trans.more)}
		</Button>
	);

	menu_tooltip(
		more_button,
		<MenuContents>
			<Button
				menu
				colourful
				accented
				href={`https://discord.gg/${discord}`}
				external
				data-type='discord'
			>
				<Icon />
				{tl(trans.join_discord)}
			</Button>
			<Button
				menu
				colourful
				accented
				className='sponsor-related'
				onClick={() => sponsor()}
			>
				<Icon name={icons.sponsor} />
				{tl(trans.sponsor)}
			</Button>
			<Button
				menu
				colourful
				accented
				href='https://github.com/katelyynn/lotus/issues/new/choose'
				external
				data-type='lotus'
			>
				<Icon name={icons.lotus} />
				{tl(trans.suggest_correction)}
			</Button>
			<div class='sep' />
			<Button menu href={`${root}bleh/general`}>
				<Icon name={icons.update} />
				{tl(trans.updates)}
			</Button>
			<Button menu onClick={() => news()}>
				<Icon name={icons.news} />
				{tl(trans.news)}
			</Button>
			<Button
				menu
				href='https://github.com/katelyynn/bleh/issues'
				external
			>
				<Icon name={icons.issue} />
				{tl(trans.report_issue)}
			</Button>
		</MenuContents>,
	);

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
		const music = (
			<Button
				chibi
				className='masthead-nav-control'
				tooltip={tl(trans.music)}
			>
				<Icon name={icons.now_playing} />
				{tl(trans.music)}
			</Button>
		);

		const status_container = createRef();

		menu_tooltip(
			music,
			<NavWindow>
				<NavWindowHeader
					icon={icons.now_playing}
					name={tl(trans.music)}
				/>
				<NavWindowContents
					className='music-status'
					ref={status_container}
				>
					<div class='loading-data-container'>
						<div class='loading-data-text'>{tl(trans.loading)}</div>
					</div>
				</NavWindowContents>
			</NavWindow>,
			{
				onShow: () => {
					if (page.now.name) render_status_container(page.now);

					live_status().then((status) =>
						render_status_container(status)
					);
				},
			},
		);

		function render_status_container(status: music_status) {
			if (!status) return;

			render(
				status_container.current,
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

		const tabbed = createRef();
		const pages = {
			notifications: {
				icon: icons.notifications,
				label: tl(trans.notifications),
				content: () => {
					return <></>;
				},
			},
			messages: {
				icon: icons.messages,
				label: tl(trans.messages),
				content: () => {
					return <></>;
				},
			},
		};

		menu_tooltip(
			inbox,
			<NavWindow>
				<NavWindowContents>
					<Tabbed
						header={
							<PanelHead small icon={icons.inbox} margin={false}>
								{tl(trans.inbox)}
							</PanelHead>
						}
						chibi
						ref={tabbed}
						page={useSettings.get('inbox_view') as string}
						pages={pages}
					/>
				</NavWindowContents>
			</NavWindow>,
			{
				onShow: () => {
					pages.notifications.content = () => {
						useSettings.set(
							'inbox_view',
							'notifications',
						);

						const elem = <div class='inbox-content' />;
						page.state.inbox_content = elem;
						page.state.notifications_content = elem;
						page.state.messages_content = elem;

						render_inbox();
						return elem;
					};
					pages.messages.content = () => {
						useSettings.set('inbox_view', 'messages');

						const elem = <div class='inbox-content' />;
						page.state.inbox_content = elem;
						page.state.notifications_content = elem;
						page.state.messages_content = elem;

						render_inbox();
						return elem;
					};

					tabbed.current.update();
				},
			},
		);

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
		const view = useSettings.get('inbox_view');

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

	// auth menu
	const token = new_auth
		.querySelector('[name="csrfmiddlewaretoken"]')
		.getAttribute('value');
	page.token = token;

	const auth_header = createRef();
	const auth_bg = createRef();
	const side = createRef();
	const next_side = createRef();

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

			const current = useSettings.get('navigation_items');

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

			instance.setContent(
				<>
					{bool(update_required) && (
						<div
							class='update-available-banner'
							onClick={prompt_for_update}
						>
							<div class='update-container'>
								<Icon name={icons.update} />
							</div>
							<span>{tl(trans.update_available_to_install)}</span>
						</div>
					)}
					<div
						class='auth-menu-v2'
						style={{ '--page-height': `${height}px` }}
					>
						<div
							class={['side', 'primary']}
							onClick={() => {
								instance.hide();
							}}
						>
							<div class='auth-bg-container' ref={auth_bg}>
								{!auth.avatar.endsWith(
									'818148bf682d429dc215c1705eb27b98.png',
								) && (
									<div
										class='bg'
										style={{
											backgroundImage: `url(${
												avatar(
													auth.avatar,
													'avatar170s',
												)
											})`,
										}}
									/>
								)}
							</div>
							<div class='auth-menu-header'>
								<div class='avatar'>
									<img
										src={avatar(auth.avatar, 'avatar170s')}
										alt={auth.name!}
									/>
								</div>
								<div class='name' ref={auth_header}>
									<span class='at'>@</span>
									{auth.name!}
								</div>
								{badges
									? (
										<div class='badges'>
											{create_badge(
												badges,
												false,
												true,
												true,
											)}
										</div>
									)
									: auth.pro && (
										<div class='badges'>
											{create_badge(
												{
													type:
														'user-status-subscriber',
													inbuilt: true,
												},
												false,
												true,
												true,
											)}
										</div>
									)}
								<a
									class='link-block-cover-link'
									href={`${root}user/${auth.name}`}
									onClick={() => {
										instance.hide();
									}}
								/>
							</div>
							<div class={['floating', 'button-group']}>
								<Button
									menu
									chibi
									href={`${root}settings`}
									onClick={() => {
										instance.hide();
									}}
									tooltip={tl(trans.edit_profile)}
								>
									<Icon name={icons.edit} />
									{tl(trans.edit_profile)}
								</Button>
								{useSettings.get('starred_friend') != ''
									? (
										<Button
											menu
											chibi
											colourful
											accented
											className='starred-friend'
											href={`${root}user/${
												useSettings.get(
													'starred_friend',
												)
											}`}
											onClick={() => {
												instance.hide();
											}}
											tooltip={useSettings.get(
												'starred_friend',
											) as string}
											data-starred='true'
										>
											<Icon
												name={icons.starred_friend}
											/>
											{useSettings.get(
												'starred_friend',
											) as string}
										</Button>
									)
									: (
										<Button
											menu
											chibi
											onClick={() => {
												open_starred_friend_window();
												instance.hide();
											}}
											tooltip={tl(
												trans.starred_friend.name,
											)}
											data-starred='false'
										>
											<Icon name={icons.plus} />
											{tl(trans.starred_friend.name)}
										</Button>
									)}
							</div>
						</div>
						<div class='side' data-page='1' ref={side}>
							<NavigationPage1
								instance={instance}
								side={side}
								next={next_side}
								notif_count={notif_count}
								messages_count={messages_count}
								token={token!}
							/>
							<div
								class='side-page'
								data-page='2'
								ref={next_side}
							/>
						</div>
					</div>
				</>,
			);

			load_profile_cache_externally(auth.name).then((cache) => {
				if (cache.banner) {
					auth_bg.current.replaceChildren(
						<div
							class='bg'
							style={{ backgroundImage: `url(${cache.banner})` }}
						/>,
					);
				}

				if (cache.username) {
					auth_header.current.textContent = cache.username;
				}
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

interface NavigationPage1Props {
	instance: Instance;
	side: RefObject<ReactElement>;
	next: RefObject<ReactElement>;
	notif_count: number;
	messages_count: number;
	token: string;
}

function NavigationPage1({
	instance,
	side,
	next,
	notif_count,
	messages_count,
	token,
}: NavigationPage1Props) {
	const wrap = (
		<div class='side-page' data-page={1}>
			{useSettings.get('navigation_items').map((val: string) => {
				let elem;

				const formal = page.state.quick_access_items[val];

				if (val == 'friends') {
					elem = (
						<ButtonCombo>
							<Button
								menu
								href={formal.url}
								onClick={() => instance.hide()}
							>
								<Icon name={formal.icon} />
								{formal.name}
							</Button>
							<ButtonComboSeparator />
							<Button
								menu
								chibi
								onClick={() => {
									next.current!.replaceChildren(
										<NavigationFriends
											instance={instance}
											side={side}
										/>,
									);
									side.current!.setAttribute(
										'data-page',
										'2',
									);
								}}
								tooltip={tl(trans.more)}
							>
								<Icon name={icons.continue} />
								{tl(trans.more)}
							</Button>
						</ButtonCombo>
					);

					return elem;
				}

				if (formal.url) {
					elem = (
						<Button
							menu
							href={formal.url}
							onClick={() => instance.hide()}
						>
							<Icon name={formal.icon} />
							{formal.name}
						</Button>
					);
				} else {
					elem = (
						<Button
							menu
							onClick={() => {
								formal.action();
								instance.hide();
							}}
						>
							<Icon name={formal.icon} />
							{formal.name}
						</Button>
					);
				}

				let count = 0;

				if (val == 'notifications') {
					count = notif_count;
				} else if (val == 'messages') {
					count = messages_count;
				}

				if (count > 0) {
					elem.replaceChildren(
						<div class='auth-dropdown-item-row'>
							<span class='auth-dropdown-item-left'>
								{formal.name}
							</span>
							<span class='auth-dropdown-item-right'>
								{count}
							</span>
						</div>,
					);
				}

				return elem;
			})}
			<ButtonCombo>
				<Button
					menu
					onClick={() => toggle_theme()}
				>
					<Icon name={icons.theme} />
					{tl(trans.themes.name)}
				</Button>
				<ButtonComboSeparator />
				<Button
					menu
					chibi
					onClick={() => {
						next.current!.replaceChildren(
							<NavigationThemes
								side={side}
							/>,
						);
						side.current!.setAttribute('data-page', '2');
					}}
					tooltip={tl(trans.more)}
				>
					<Icon name={icons.continue} />
					{tl(trans.more)}
				</Button>
			</ButtonCombo>
			{useSettings.get('navigation_language') && (
				<ButtonCombo>
					<Button
						menu
						onClick={() => {
							next.current!.replaceChildren(
								<NavigationLanguages
									instance={instance}
									side={side}
								/>,
							);
							side.current!.setAttribute('data-page', '2');
						}}
					>
						<Icon name={icons.language} />
						{tl(trans.language)}
					</Button>
					<ButtonComboSeparator />
					<Button
						menu
						chibi
						onClick={() => {
							next.current!.replaceChildren(
								<NavigationLanguages
									instance={instance}
									side={side}
								/>,
							);
							side.current!.setAttribute('data-page', '2');
						}}
						tooltip={tl(trans.more)}
					>
						<Icon name={icons.continue} />
						{tl(trans.more)}
					</Button>
				</ButtonCombo>
			)}
			<ButtonCombo>
				<Button
					menu
					href={`${root}bleh/minis`}
					onClick={() => instance.hide()}
				>
					<Icon name={icons.minis} />
					{tl(trans.minis)}
				</Button>
				<ButtonComboSeparator />
				<Button
					menu
					chibi
					onClick={() => {
						news();
						instance.hide();
					}}
					tooltip={tl(trans.news)}
				>
					<Icon name={icons.news} />
					{tl(trans.news)}
				</Button>
			</ButtonCombo>
			<ButtonCombo>
				<Button
					menu
					colourful
					accented
					href={`${root}bleh`}
					onClick={() => instance.hide()}
				>
					<Icon name={icons.bleh_settings} />
					{tl(trans.settings)}
				</Button>
				<ButtonComboSeparator />
				<form class='chibi'>
					<input
						type='hidden'
						name='csrfmiddlewaretoken'
						value={token}
					/>
					<Button
						className='logout'
						href={`${root}logout`}
						colourful
						menu
						accented
						chibi
						onClick={() => instance.hide()}
						tooltip={tl(trans.logout)}
					>
						<Icon name={icons.logout} />
						{tl(trans.logout)}
					</Button>
				</form>
			</ButtonCombo>
		</div>
	);

	const simple_menu = tippy(wrap, {
		theme: 'context-menu',
		content: (
			<a
				class='dropdown-menu-clickable-item'
				data-type='quick_access'
				href={`${root}bleh/profile?setting=navigation_items`}
			>
				{tl(trans.edit_quick_access)}
			</a>
		),
		placement: 'right-start',
		trigger: 'manual',
		interactive: true,
		interactiveBorder: 10,
		offset: [0, 0],
		appendTo: document.body,

		onShow(instance: Instance) {
			instance.popper.addEventListener('click', () => {
				instance.hide();
			});
		},
	});

	register_menu(wrap, simple_menu);

	return wrap;
}

interface NavigationFriendsProps {
	instance: Instance;
	side: RefObject<ReactElement>;
}

function NavigationFriends({
	instance,
	side,
}: NavigationFriendsProps) {
	const starred = useSettings.get('starred_friend');
	const friends = useSettings.get('friends').filter((
		friend: string,
	) => friend != starred);

	return (
		<>
			<Button
				menu
				onClick={() => {
					side.current!.setAttribute('data-page', '1');
				}}
			>
				<Icon name={icons.arrow_left} />
				{tl(trans.back)}
			</Button>
			{starred && (
				<NavigationFriend
					name={starred as string}
					starred
					instance={instance}
				/>
			)}
			{friends.map((friend: string, i: number) => (
				<NavigationFriend name={friend} key={i} instance={instance} />
			))}
			<div class='sep' />
			<Button
				menu
				onClick={() => {
					open_starred_friend_window();
					instance.hide();
				}}
			>
				<Icon name={icons.edit} />
				{tl(trans.edit_close_friends)}
			</Button>
		</>
	);
}

interface NavigationFriendProps {
	instance: Instance;
	name: string;
	starred?: boolean;
}

function NavigationFriend({
	instance,
	name,
	starred,
}: NavigationFriendProps) {
	const valid = is_sponsor(name);

	const elem = (
		<a
			href={`${root}user/${name}`}
			class={['dropdown-menu-clickable-item', 'v2']}
			onClick={() => {
				instance.hide();
			}}
		>
			<Icon name={icons.user} />
			<span>
				<span class='at'>@</span>
				{name}
			</span>
			{starred && (
				<span class={['star-icon', 'colourful']}>
					<Icon />
				</span>
			)}
		</a>
	);

	load_profile_cache_externally(name).then((cache) => {
		elem.replaceChildren(
			<>
				<Icon name={icons.user} />
				{(cache.username && valid)
					? (
						<span class='username-combo'>
							<span class='username-custom'>
								{cache.username}
							</span>
							<span class='username-original'>
								<span class='at'>@</span>
								{name}
							</span>
						</span>
					)
					: (
						<span>
							<span class='at'>@</span>
							{name}
						</span>
					)}
				{starred && (
					<span class={['star-icon', 'colourful']}>
						<Icon name={icons.star} />
					</span>
				)}
			</>,
		);
	});

	return elem;
}

interface NavigationThemesProps {
	side: RefObject<ReactElement>;
}

function NavigationThemes({
	side,
}: NavigationThemesProps) {
	const uuid = crypto.randomUUID();

	useSettings.on('theme', (val) => {
		update(val as string);
	});

	const buttons: NavigationThemeElement[] = [];

	const full_theme_list = getThemes();

	const wrap = (
		<>
			<Button
				menu
				onClick={() => {
					side.current!.setAttribute('data-page', '1');
				}}
			>
				<Icon name={icons.arrow_left} />
				{tl(trans.back)}
			</Button>
			{light_themes.map((id) => {
				const theme = full_theme_list[id];
				if (!theme) return;

				return (
					<NavigationTheme
						id={id}
						item={theme}
						list={buttons}
						onChange={update}
						uuid={uuid}
					/>
				);
			})}
			{dark_themes.map((id) => {
				const theme = full_theme_list[id];
				if (!theme) return;

				return (
					<NavigationTheme
						id={id}
						item={theme}
						list={buttons}
						onChange={update}
						uuid={uuid}
					/>
				);
			})}
		</>
	);

	function update(theme?: string) {
		if (!theme) theme = useSettings.get('theme') as string;

		buttons.forEach((elem) => {
			elem.active = elem.id == theme;
		});
	}

	update();

	return wrap;
}

interface NavigationThemeProps {
	id: string;
	item: theme;
	list: ReactElement[];
	onChange: (id: string) => void;
	uuid: string;
}

type NavigationThemeElement = HTMLButtonElement & {
	id: string;
	active: boolean;
};

function NavigationTheme({
	id,
	item,
	list,
	onChange,
	uuid,
}: NavigationThemeProps) {
	let active = false;

	const elem = (
		<button
			type='button'
			class={['dropdown-menu-clickable-item', 'v2', 'flex-button']}
			onClick={() => {
				useSettings.set('theme_schedule', false, uuid);
				useSettings.set('theme', id, uuid);
				onChange(id);
			}}
		>
			<Icon name={item.icon} />
			{tl(item.name)}
		</button>
	) as NavigationThemeElement;

	list.push(elem);

	Object.defineProperty(elem, 'id', {
		get() {
			return id;
		},
	});

	Object.defineProperty(elem, 'active', {
		set(val: boolean) {
			active = val;
			update();
		},
	});

	function update() {
		elem.setAttribute('aria-selected', String(active));
	}

	return elem;
}

interface NavigationLanguagesProps {
	instance: Instance;
	side: RefObject<ReactElement>;
}

function NavigationLanguages({
	instance,
	side,
}: NavigationLanguagesProps) {
	const languages = lastfm_languages.filter((l) => l != lang);

	return (
		<>
			<button
				type='button'
				class='dropdown-menu-clickable-item'
				data-type='back'
				onClick={() => {
					side.current!.setAttribute('data-page', '1');
				}}
			>
				{tl(trans.back)}
			</button>
			<NavigationLanguage
				code={lang}
				active
				onChange={() => {
					instance.hide();
				}}
			/>
			<div class='sep' />
			{languages.map((code, i) => (
				<NavigationLanguage
					code={code}
					key={i}
					onChange={() => {
						if (code == 'fae') {
							useSettings.set('language', 'fae');
							window.location.reload();
						}

						instance.hide();
					}}
				/>
			))}
		</>
	);
}

interface NavigationLanguageProps {
	code: string;
	onChange: () => void;
	active?: boolean;
}

function NavigationLanguage({
	code,
	onChange,
	active,
}: NavigationLanguageProps) {
	const button = (
		<button
			name={code}
			type='submit'
			class={['dropdown-menu-clickable-item', 'v2', 'flex-button']}
			onClick={onChange}
			aria-selected={active}
		>
			<div class='auth-dropdown-item-row'>
				<span class='auth-dropdown-item-left'>
					<Flag
						code={(convert_lang_to_country[code] || code)
							.toUpperCase()}
						className='small-flag'
					/>
					{get_language_name(code)}
				</span>
				{code in lang_info && (
					<span class='auth-dropdown-item-right'>
						<div class='bleh-icon checkmark' />
					</span>
				)}
			</div>
		</button>
	);

	if (active || code == 'fae') return button;

	const form = createRef();

	// TODO: maybe just use the default elements again?
	// this is really jank
	return (
		<form
			action='/i18n/setlang/'
			method='post'
			ref={form}
			onSubmit={async (e) => {
				e.preventDefault();

				useSettings.set('language', 'unset');

				const data = new FormData(form.current);

				await fetch(form.current.action, {
					method: 'POST',
					body: data,
				}).then((res) => {
					window.location.href = res.url;
				});
			}}
		>
			<input type='hidden' name='language' value={code} />
			{button}
		</form>
	);
}
