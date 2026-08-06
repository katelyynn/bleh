/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import {
	load_activities,
	subscribe_to_events,
} from '@/components/shared/activity';
import { settings } from '@/build/config';
import { log } from '@/build/log';
import {
	api_url,
	auth,
	bleh_url,
	discord,
	minis_url,
	mualani_url,
	page,
	root,
	setup_url,
	shout_parse_queue,
	sponsor_url,
	urls,
} from '@/build/page';
import { stored_season } from '@/build/seasonal';
import { lang, lookup_lang, tl, trans, translation_stats } from '@/build/trans';
import { dialog, load_dialogs } from '@/components/dialog/dialog';
import {
	correct_artist,
	correct_generic_artist,
	correct_generic_combo,
	correct_generic_combo_no_artist,
	correct_item_by_artist,
	lotus,
} from '@/components/music/lotus';
import { music_grids } from '@/components/music/music_grid';
import { nag_bar } from '@/components/dialog/nag_bar';
import { load_notifications, notify } from '@/components/dialog/notify';
import { patch_titles } from '@/components/music/track.js';
import { load_settings, Settings, useSettings } from '@/config';
import { theme_version, version } from '@/main';
import { append_nav } from '@/components/page/navigation';
import { bleh_albums } from '@/pages/album';
import { bleh_artists } from '@/pages/artist';
import { bleh_settings } from '@/pages/bleh_settings/bleh_settings.js';
import { bleh_setup } from '@/pages/bleh_setup';
import { bleh_error } from '@/pages/error';
import { bleh_events } from '@/pages/event';
import { bleh_gallery, bleh_gallery_upload_check } from '@/pages/music/gallery';
import {
	bleh_glacier_library,
	bleh_glacier_library_bulk_edit,
} from '@/pages/profile/glacier.js';
import { bleh_home, bleh_home_legacy } from '@/pages/home';
import { bleh_inbox } from '@/pages/inbox';
import { bleh_profiles, checkup_friend_cache } from '@/pages/profile/profile';
import { bleh_search } from '@/pages/home/search';
import { bleh_tags, bleh_tags_large } from '@/pages/tag';
import { bleh_tracks } from '@/pages/track';
import { patch_wiki } from '@/pages/music/wiki';
import { start_rain } from '@/components/page/rain';
import { set_season, update_season_nav } from '@/components/seasonal';
import {
	parse_shout_queue,
	patch_shouts,
	shout_header,
	shout_messages,
} from '@/components/shared/shout';
import { ff } from '@/components/settings/sku';
import { bleh_sponsor_page, sponsors } from '@/components/sponsor';
import {
	append_style,
	remove_lastfm_styles,
	update_check,
} from '@/components/page/style';
import { bleh_radio } from '@/components/radio/radio';
import { bleh_api } from '@/pages/home/api';
import { bleh_users } from '@/components/shared/users';
import { html, render } from 'lighterhtml';
import { bleh_footer } from '@/components/page/footer';
import { register_rabbit } from '@/components/dialog/rabbit';
import { dialog_extender } from '@/components/dialog/dialog_extender.js';
import { bleh_auth } from '@/pages/home/auth';
import { bleh_labs } from '@/pages/profile/labs';
import { bleh_minis } from '@/pages/home/minis.js';
import { mualani } from '@/pages/home/mualani';
import { load_status } from '@/components/dialog/status.js';
import { load_dismissed } from '@/components/dialog/dismissed';
import { oracle_data } from '@/components/music/oracle';
import { dynamic_theming } from '@/components/settings/dynamic_theming';
import { prepare_music } from '@/components/music/music';
import { page_menu } from '@/components/menu.js';
import { seasonal_colour_switch } from '@/components/settings/settings';
import florence from '@tealmiku/florence';
import { hideAll } from 'tippy.js';
import { notices } from '@/components/dialog/notices';
import { tag_page } from '@/components/music/tags';
import { clear_popup_queue } from '@/components/dialog/popup';
import { verified } from './components/shared/badge';
import { see_more } from './components/page/see_more';
import { icon, icons } from './components/shared/icon';
import { avatar } from './components/shared/avatar';
import { clean_storage } from './components/settings/storage';
import { register_auth } from './components/profile/auth';
import { notify_if_new_update } from './components/page/update';
import { bleh_now } from './pages/now/now';
import { applyCSP } from '@/csp.ts';

export function bleh() {
	florence({
		page,
		on_head_load: () => {
			Object.assign(useSettings, new Settings());

			append_style();
			favi();
			page.state.previous_title = document.title;
			document.title = '...';

			applyCSP();
		},
		on_body_load: () => {
			clean_storage();
			favi();

			load_settings();

			const logo = document.querySelector('.masthead-logo a');
			if (!logo) {
				handle_error_500();
				return;
			}

			page.state.colour_preview = html.node`
                <div class="colour-preview" />
            `;
			document.body.appendChild(page.state.colour_preview);

			register_auth();

			dynamic_theming();
			solarium();

			translation_stats();

			page_menu();

			verified();

			// messaging
			load_dialogs();
			register_rabbit();

			notices();

			remove_lastfm_styles();

			theme_version.state = getComputedStyle(document.body)
				.getPropertyValue('--version-build')
				.replaceAll("'", '')
				.replaceAll('"', ''); // remove quotations

			update_check(false, null);

			load_notifications();
			load_status();

			checkup_friend_cache();

			detect_mobile();
			page.platform = detect_platform();

			// load seasonal data
			start_rain();

			load_activities();
			notify_if_new_update();

			lotus();
			oracle_data();
			sponsors();
		},
		on_mutation: main_flow,
		on_page_change: load_page,
		on_subpage_change: () => {
			//useSettings.rebuild();
			//load_settings();

			if (page.state.settings_reload) {
				page.state.settings_reload = false;
			}

			if (page.structure.indicator) page_indicator();

			hideAll();
		},
		on_error: handle_error,
		on_dedicated_page: (type) => {
			if (type == 'now') {
				if (page.state.notified_now) return;

				page.state.notified_now = true;

				load_notifications();

				notify({
					id: 'now',
					title: tl(trans.now_notice.name),
					body: tl(trans.now_notice.body),
					type: 'info',
					persist: true,
				});
			}
		},
	});
}

function solarium() {
	document.body.appendChild(html.node`
        <svg style="position:absolute; width:0; height:0">
            <filter id="solarium" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
                <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.001 0.005"
                    numOctaves="1"
                    seed="17"
                    result="turbulence"
                />
                <feGaussianBlur in="turbulence" stdDeviation="10" result="softMap" />
                <feFlood flood-color="white" result="flood" />
                <feComposite in="flood" in2="SourceAlpha" operator="in" result="circleBase" />
                <feMorphology in="circleBase" operator="erode" radius="0" result="innerCircle" />
                <feGaussianBlur in="innerCircle" stdDeviation="150" result="radialFade" />
                <feComponentTransfer in="radialFade" result="edgeMask">
                    <feFuncR type="table" tableValues="0 1" />
                    <feFuncG type="table" tableValues="0 1" />
                    <feFuncB type="table" tableValues="0 1" />
                </feComponentTransfer>
                <feBlend in="softMap" in2="edgeMask" mode="multiply" result="edgeDistortion" />
                <feDisplacementMap
                    in="SourceGraphic"
                    in2="edgeDistortion"
                    scale="200"
                    xChannelSelector="R"
                    yChannelSelector="G"
                />
            </filter>
        </svg>
    `);
}

function handle_error(e = null) {
	document.body.classList.add('florence-loaded');

	dialog({
		id: 'error',
		title: 'An error has occurred',
		body: html.node`
            <div class="error-inner">
                <div class="error-top">
                    ${icon({ name: icons.error })}
                    <div class="error-top-info">
                        <h1 class="error-head">oops.. something broke</h1>
                        <p class="error-body">An error prevented ${version.brand} from finishing loading</p>
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
                <p class="error-summary">It would be helpful if you could report this bug, including the error message above and any steps you took.</p>
            </div>
            <div class="modal-footer">
                <div class="fill"></div>
                <a class="see-more" href="https://github.com/katelyynn/bleh/issues/new/choose" target="_blank">
                    Report bug now
                </a>
                <a class="see-more" href="https://discord.gg/${discord}" target="_blank">
                    Join Discord
                </a>
                <div class="fill"></div>
            </div>
        `,
		type: 'error',
	});

	if (e != null) {
		log('fatal failure', 'load');
		console.error(
			'\n\n%cBLEH ERROR',
			'font-size: 30px; color: aqua; text-shadow: 0 0 20px white',
			e,
			'BLEH ERROR ABOVE\n^\n^\n^\n^\n^\n^\n^',
		);
	}

	log('current page', 'page', 'info', page);
}

export function handle_error_500() {
	document.body.classList.add('bleh-loaded');
	log('halted as root is inaccessible', 'load');
}

function main_flow() {
	try {
		lookup_lang();

		if (page.state.error) return;

		if (page.type == 'artist' || page.type == 'album') {
			bleh_gallery();
			bleh_gallery_upload_check();
		}

		if (
			page.type == 'user' ||
			page.type == 'search' ||
			page.type == 'tag' ||
			page.type == 'events'
		) {
			music_grids();
		}

		if (
			page.type == 'user' ||
			page.type == 'artist' ||
			page.type == 'album' ||
			page.type == 'track' ||
			page.type == 'events' ||
			page.type == 'festival' ||
			page.type == 'tag'
		) {
			patch_shouts();

			if (shout_parse_queue.length > 0) parse_shout_queue();
		}

		if (
			page.type == 'user' &&
			page.subpage.startsWith('library') &&
			page.subpage != 'library_overview' &&
			!page.subpage.startsWith('library_artist_') &&
			!page.subpage.startsWith('library_album_') &&
			!page.subpage.startsWith('library_track_')
		) {
			bleh_glacier_library();
		}

		// bulk edit check
		if (
			(auth.pro &&
				page.type == 'user' &&
				page.name == auth.name &&
				page.subpage == 'library_artist_overview') ||
			page.subpage == 'library_album_overview' ||
			page.subpage == 'library_track_overview'
		) {
			bleh_glacier_library_bulk_edit();
		}

		if (
			page.type == 'user' ||
			page.type == 'artist' ||
			page.type == 'album' ||
			page.type == 'events' ||
			page.type == 'festival' ||
			page.type == 'tag' ||
			page.type == 'overview' ||
			page.type == 'bookmarks'
		) {
			patch_titles();
		}

		if (page.type == 'overview' && page.subpage == 'music') {
			correct_generic_combo('music-releases-item');
			correct_generic_artist('music-more-artists-item');
		}

		if (useSettings.get('corrections')) {
			correct_generic_combo('resource-list--release-list-item');
			correct_generic_combo('similar-albums-item');
			correct_generic_combo('track-similar-tracks-item');
			correct_generic_combo('similar-items-sidebar-item');

			if (page.type == 'bookmarks' || page.type == 'releases') {
				correct_generic_artist('music-bookmarks-artists-item');
				correct_generic_combo('music-bookmarks-albums-item');
			}
		}

		if (page.type == 'overview' && page.subpage == 'music') {
			let items = page.structure.main.querySelectorAll(
				'.music-featured-item:not(.music-featured-tag, [data-passed="true"])',
			);
			items.forEach((item) => {
				item.setAttribute('data-passed', 'true');

				const bg = item.querySelector(
					'.music-featured-item-background',
				);
				if (!bg) return;

				let style = bg.style.getPropertyValue('background-image');
				if (!style) style = bg.style.getPropertyValue('background');
				let cover_substr = style.indexOf('url');
				let cover = style.substring(cover_substr);

				bg.style.setProperty('background', cover);
			});
		}

		if (['artist', 'album', 'track'].includes(page.type)) {
			if (page.subpage == 'tags_overview') {
				tag_page();
			}
		}

		shout_messages();

		subscribe_to_events();

		dialog_extender();

		see_more();

		if (
			['artist', 'album', 'track', 'user', 'tag', 'events'].includes(
				page.type,
			)
		) {
			if (
				!['user', 'tag'].includes(page.type) &&
				page.subpage.startsWith('shoutbox')
			) {
				shout_header(
					page.structure.main.querySelector('.section-controls'),
				);
			} else if (page.subpage == 'overview' || page.subpage == 'image') {
				shout_header(page.structure.main.querySelector('.shoutbox'));
			}
		}
	} catch (e) {
		handle_error(e);
	}
}

export function is_url(url: string) {
	return window.location.pathname.startsWith(`${root}${url}`);
}

function load_page(main_content = null) {
	if (page.state.activity_preview_timer) {
		clearInterval(page.state.activity_preview_timer);
	}

	page.state.settings_page = '';
	page.state.on_tour = false;

	page.restricted = false;

	if (main_content) {
		const blacklist_level = Number(
			main_content.getAttribute('data-page-resource-blacklist-level') ||
				'0',
		);
		page.restricted = blacklist_level == 1;
	}

	hideAll({ duration: 0 });
	clear_popup_queue();

	if (main_content) {
		auth.pro = !!main_content.querySelector(
			':scope > .masthead > .masthead-pro-wrap',
		);
	}

	page.structure.notifications.setAttribute('data-auth-open', 'false');

	register_auth();
	lookup_lang();

	detect_mobile();
	page.platform = detect_platform();

	set_season();

	bleh_footer();

	remove_lastfm_styles();

	const masthead = document.body.querySelector('.masthead');
	const loading_indicator = document.body.querySelector(
		':scope > #initial-tealium-data',
	);

	new IntersectionObserver(([entry]) => {
		masthead.classList.toggle('scrolled', !entry.isIntersecting);
	}).observe(loading_indicator);

	prepare_music();

	if (is_url(urls.setup)) {
		bleh_setup();
	} else if (is_url(urls.sponsor)) {
		bleh_sponsor_page();
	} else if (is_url(urls.api)) {
		bleh_auth();
	} else if (is_url(urls.mualani)) {
		mualani();
	} else if (is_url(urls.now)) {
		bleh_now();
	} else if (is_url(urls.minis)) {
		page.type = 'minis';
		bleh_home();
		bleh_minis();
	} else if (is_url(urls.settings)) {
		page.type = 'bleh_settings';
		bleh_home();
		bleh_settings();
	} else if (is_url(urls.explore_charts) || is_url(urls.geo_charts)) {
		page.type = 'charts';
		bleh_home();
	} else {
		bleh_error();

		if (page.state.error) {
			append_nav();
			page_title();
			return;
		}

		if (
			page.type == 'user' ||
			page.type == 'artist' ||
			page.type == 'album' ||
			page.type == 'track'
		) {
			nag_bar();
		}

		if (
			useSettings.get('corrections') ||
			useSettings.get('format_guest_features')
		) {
			if (page.type == 'artist') {
				correct_generic_combo_no_artist('artist-top-albums-item');
			} else if (page.type == 'track') {
				correct_generic_combo('source-album-details');
			}
		}

		if (page.type == 'user') bleh_profiles();
		else if (page.type == 'artist') bleh_artists();
		else if (page.type == 'album') bleh_albums();
		else if (page.type == 'track') bleh_tracks();
		else if (page.type == 'events' || page.type == 'festival') {
			bleh_events();
		} else if (page.type == 'tag') bleh_tags();
		else if (page.type == 'search') bleh_search();
		else if (page.type == 'inbox') bleh_inbox();
		else if (page.type == 'home') bleh_home_legacy();
		else if (
			page.type == 'overview' ||
			page.type == 'recommended' ||
			page.type == 'releases' ||
			page.type == 'bookmarks' ||
			page.type == 'charts' ||
			page.type == 'settings'
		) {
			bleh_home();
		} else if (page.type == 'api') bleh_api();
		else if (page.type == 'labs') bleh_labs();

		if (
			['user', 'events'].includes(page.type) &&
			[
				'following',
				'followers',
				'neighbours',
				'event_attendance_going',
				'event_attendance_interested',
			].includes(page.subpage)
		) {
			bleh_users();
		}

		if (
			(page.type == 'artist' ||
				page.type == 'album' ||
				page.type == 'track' ||
				page.type == 'tag') &&
			page.subpage == 'overview'
		) {
			patch_wiki();
		}

		if (
			(page.type == 'user' ||
				page.type == 'tag' ||
				page.type == 'events') &&
			(page.subpage == 'overview' || page.subpage == 'event_overview')
		) {
			bleh_radio();
		}

		if (
			(page.type == 'artist' ||
				page.type == 'album' ||
				page.type == 'track') &&
			page.subpage == 'tags_overview'
		) {
			bleh_tags_large();
		}

		if (page.subpage == 'images_overview') {
			let sort_button = page.structure.main.querySelector(
				'.dropdown-menu-clickable-button',
			);
			let sort_menu = page.structure.main.querySelector(
				'.dropdown-menu-clickable',
			);

			if (sort_button && sort_menu) {
				page.structure.main.insertBefore(
					html.node`
                    <div class="dropdown-top-wrap">
                        ${sort_button}
                        ${sort_menu}
                    </div>
                `,
					page.structure.main.firstElementChild,
				);
			}
		}

		if (page.subpage == 'image') {
			const images = page.structure.row.querySelectorAll(
				'.gallery-image',
			);
			images.forEach((image) => {
				const star = image.querySelector(
					'.gallery-image-preferred-container',
				);
				if (!star) return;

				render(
					star,
					html`
						<div class="bleh-icon" />
						${tl(trans.starred)}
					`,
				);
			});
		}
	}

	seasonal_colour_switch();

	append_nav();
	update_season_nav();

	page_title();

	setTimeout(() => {
		if (page.structure.row) {
			const rect = page.structure.row.getBoundingClientRect();
			const y = rect.top + window.scrollY;

			if (page.structure.rain) {
				page.structure.rain.style.setProperty('--y', `${y}px`);
			}
		}
	}, 10);

	setTimeout(() => {
		load_dismissed();
	}, 1000);
}

function page_title() {
	let template = tl(trans.page_templates.type);
	if (!page.state.error) {
		if (
			(page.type == 'user' ||
				page.type == 'artist' ||
				page.type == 'events' ||
				page.type == 'tag') &&
			page.subpage != 'home' &&
			!(page.subpage.startsWith('playlists_') &&
				page.subpage.endsWith('_overview'))
		) {
			template = tl(trans.page_templates.name_type);
		} else if (page.type == 'album' || page.type == 'track') {
			template = tl(trans.page_templates.name_sister_type);
		}
	}

	let name = page.name;
	let sister = page.sister;

	if (page.type == 'album' || page.type == 'track') {
		name = correct_item_by_artist(name, sister);
		sister = correct_artist(sister);
	} else if (page.type == 'artist') {
		name = correct_artist(name);
	}

	let title;
	if (
		page.subpage != 'overview' &&
		page.subpage != 'event_overview' &&
		page.subpage != 'home' &&
		(page.type == 'user' ||
			page.type == 'artist' ||
			page.type == 'album' ||
			page.type == 'track' ||
			page.type == 'events' ||
			page.type == 'tag')
	) {
		title = tl(trans[page.subpage]);
	}

	if (page.type == 'settings' || page.type == 'bleh_settings') {
		title = tl(trans.settings);
	} else if (page.type == 'bleh_setup') title = tl(trans.bleh_setup);
	else if (page.type == 'bleh_sponsor') title = tl(trans.sponsor);
	else if (page.type == 'search') title = tl(trans.search);
	else if (page.type == 'overview' || page.type == 'home') {
		title = tl(trans.home);
	} else if (page.type == 'recommended') title = tl(trans.recommendations);
	else if (page.type == 'releases') title = tl(trans.releases);
	else if (page.type == 'events' && page.subpage == 'home') {
		title = tl(trans.events);
	} else if (page.type == 'bookmarks') title = tl(trans.bookmarks);
	else if (page.type == 'charts') title = tl(trans.charts);
	else if (page.type == 'labs') title = tl(trans.labs.name);
	else if (page.type == 'minis') title = tl(trans.minis);

	if (page.type == 'inbox') {
		if (page.subpage == 'notifications') {
			title = tl(trans.notifications);
		} else title = tl(trans.messages);
	}

	if (page.subpage.replace('event_', '').startsWith('shoutbox')) {
		title = tl(trans.shouts);
	} else if (page.subpage.startsWith('library')) title = tl(trans.library);
	else if (page.subpage == 'obsessions_overview') {
		title = tl(trans.obsessions);
	} else if (page.subpage == 'obsessions_obsession') {
		title = tl(trans.obsession);
	} else if (page.subpage.startsWith('tags')) title = tl(trans.tags);
	else if (page.subpage.startsWith('listening-report')) {
		title = tl(trans.reports);
	} else if (page.subpage.startsWith('event_attendance')) {
		title = tl(trans.attendance);
	} else if (page.subpage == 'event_lineup') title = tl(trans.lineup);
	else if (
		page.subpage == 'playlists_playlists' ||
		(page.subpage.startsWith('playlists_') &&
			page.subpage.endsWith('_overview'))
	) {
		title = tl(trans.playlists);
	} else if (page.subpage == 'auth') title = tl(trans.connect_app);
	else if (page.subpage.startsWith('image') && page.type == 'artist') {
		title = tl(trans.photos);
	} else if (page.subpage.startsWith('image') && page.type == 'album') {
		title = tl(trans.artwork);
	} else if (page.subpage.startsWith('listeners')) {
		title = tl(trans.listeners);
	} else if (page.subpage == 'similar') title = tl(trans.similar_artists);
	else if (page.subpage.startsWith('wiki')) title = tl(trans.wiki);
	else if (page.subpage == 'lyrics') title = tl(trans.lyrics);

	if (page.subpage == 'overview' || page.subpage == 'event_overview') {
		if (page.type == 'user') title = tl(trans.profile);
		else if (page.type == 'artist') title = tl(trans.artist);
		else if (page.type == 'album') title = tl(trans.album);
		else if (page.type == 'track') title = tl(trans.track);
		else if (page.type == 'events') title = tl(trans.event);
		else if (page.type == 'tag') title = tl(trans.tag);
	}

	if (page.state.error) title = tl(trans.error);

	template = template
		.replace('{page}', title)
		.replace('{name}', name)
		.replace('{sister}', sister)
		.replace('{build}', version.build)
		.replace('{sku}', version.sku);

	if (settings.branding_type == 'bleh') {
		template = template.replace('{brand}', version.brand);
	} else if (settings.branding_type == 'lastfm') {
		template = template.replace(
			'{brand}',
			`Last.fm (${version.brand})`,
		);
	}

	document.title = template;

	if (page.structure.indicator) page_indicator();
}

function detect_mobile() {
	if (window.innerWidth <= 980) {
		page.mobile = true;

		document.head.appendChild(html.node`
            <meta name="theme-color" content="#000000" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <link rel="manifest" href="https://github.com/katelyynn/bleh/raw/uwu/fm/app.webmanifest" />
        `);

		let icon = document.head.querySelector('[rel="apple-touch-icon"]');
		icon.setAttribute(
			'href',
			'https://github.com/katelyynn/bleh/raw/uwu/fm/app.png',
		);
	} else {
		page.mobile = false;
	}
}

function detect_platform() {
	const platform = navigator.userAgentData?.platform || navigator.platform ||
		'';
	const ua = navigator.userAgent || '';
	if (/^Win/i.test(platform)) {
		return 'win32';
	} else if (/^Mac/i.test(platform)) {
		return 'darwin';
	} else if (/iP(hone|ad|od)/i.test(ua)) {
		return 'ios';
	} else if (/Android/i.test(ua)) {
		return 'android';
	} else if (/^Linux/i.test(platform) || /Linux/i.test(ua)) {
		return 'linux';
	} else {
		return 'other';
	}
}

function page_indicator() {
	render(
		page.structure.indicator,
		html`
			<div class="page-indicator-elem bleh">
				<strong class="page-indicator-sub page-indicator-head">ver</strong>
				<span class="page-indicator-sub">${version.brand}</span>
				<span class="page-indicator-sub">${version.build}</span>
				<span class="page-indicator-sub">${version.sku}</span>
			</div>
			<div class="page-indicator-elem page">
				<strong class="page-indicator-sub page-indicator-head">auth</strong>
				<span class="page-indicator-sub">${auth.name}</span>
				<span class="page-indicator-sub">${lang}</span>
			</div>
			<div class="page-indicator-elem page">
				<strong class="page-indicator-sub page-indicator-head"
					onclick=${() => console.info(page)}>page</strong>
				<span class="page-indicator-sub">${page.type}</span>
				<span class="page-indicator-sub">${page.subpage}</span>
			</div>
			<div class="page-indicator-elem page">
				<strong class="page-indicator-sub page-indicator-head"></strong>
				<span class="page-indicator-sub">${page.name || '?'}</span>
				<span class="page-indicator-sub">${page.sister || '?'}</span>
			</div>
			<div class="page-indicator-elem page">
				<strong class="page-indicator-sub page-indicator-head">season</strong>
				<span class="page-indicator-sub">${stored_season.id}</span>
				<span class="page-indicator-sub">${stored_season.year}</span>
				<span class="page-indicator-sub">${stored_season.offset}</span>
			</div>
			<div class="page-indicator-elem page">
				<strong class="page-indicator-sub page-indicator-head">solarium</strong>
				<span class="page-indicator-sub">${settings.solarium}</span>
			</div>
		`,
	);
}

export function update_page() {
	page.structure.container.setAttribute('data-page-type', page.type);
	page.structure.container.setAttribute('data-page-subpage', page.subpage);
	page.structure.container.setAttribute('data-beret', ff('beret'));
	page.structure.container.setAttribute('data-short', ff('short'));
	page.structure.container.setAttribute('data-lacrimosa', ff('lacrimosa'));

	page.structure.row?.setAttribute('data-lacrimosa', ff('lacrimosa'));
}

export async function register_background(url: string | null, origin = null) {
	if (url && url.endsWith('c6f59c1e5e7240a4c0d427abd71f3dbb.jpg')) url = '';

	register_banner(url, origin);

	log(`requested register of ${url} from ${origin}`, 'background', 'log');
	let background = page.structure.background;

	if (!background) {
		background = html.node`
            <div class="bleh-background katsune-bleh-background" />
        `;

		document.body.appendChild(background);
		page.structure.background = background;
	} else {
		const previous_url = background.getAttribute('data-url');
		if (previous_url && previous_url == url) {
			log('skipped as url is identical', 'background', 'log');
			background_props();
			return;
		}

		background.classList.remove('ready');
	}

	background_props();

	function background_props() {
		background.setAttribute('data-url', url);
		background.setAttribute('data-page-type', page.type);
		background.setAttribute('data-page-subpage', page.subpage);
		background.setAttribute('data-background-origin', origin);
	}

	if (url) {
		url = avatar(url, 'avatar300s');

		const img = html.node`
            <img src=${url} crossorigin="anonymous" />
        ` as HTMLImageElement;

		await img.decode();

		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		const scale = 300;

		canvas.width = scale;
		canvas.height = scale;

		ctx.imageSmoothingEnabled = true;
		ctx.imageSmoothingQuality = 'high';
		ctx.filter = 'blur(4px)';
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

		url = canvas.toDataURL();
	}

	background.classList.add('ready');

	/*
    if (settings.static_banners) {
        try {
            url = await convert_gif_to_png(url);
        } catch(e) {
            log('could not convert banner image to static', 'banner', 'error', {e});
        }
    }
    */

	render(background, html``);
	if (url) {
		render(
			background,
			html`
				<div class="page-background-image">
					<div class="page-background-image-inner"
						style="background-image: url(${url})" />
				</div>
			`,
		);
	}

	if (page.type == 'user') {
		if (page.name == auth.name) {
			background.setAttribute('data-page-user-is-self', 'true');
		} else {
			background.setAttribute('data-page-user-is-self', 'false');
		}
	}

	log(`registered ${url} from ${origin}`, 'background');

	return background;
}

export function register_banner(url: string | null, origin = null) {
	let background = page.structure.banner;

	if (!background) {
		background = html.node`
            <div class="page-banner" />
        `;
		document.body.appendChild(background);
		page.structure.banner = background;
	} else {
		const previous_url = background.getAttribute('data-url');
		if (previous_url && previous_url == url) {
			log('skipped as url is identical', 'background', 'log');
			banner_props();
			return;
		}
	}

	banner_props();

	function banner_props() {
		background.setAttribute('data-url', url);
		background.setAttribute('data-page-type', page.type);
		background.setAttribute('data-page-subpage', page.subpage);
		background.setAttribute('data-background-origin', origin);
	}

	let inner: HTMLSpanElement;

	render(background, html``);
	render(
		background,
		html`
			<span class="background-inner" ref=${(el) => inner = el} />
		`,
	);

	if (url) {
		inner.style.setProperty('background-image', `url(${url})`);
	}

	if (page.type == 'user') {
		if (page.name == auth.name) {
			background.setAttribute('data-page-user-is-self', 'true');
		} else {
			background.setAttribute('data-page-user-is-self', 'false');
		}
	}

	return background;
}

function favi() {
	if (settings.branding_type && settings.branding_type != 'bleh') return;

	let light =
		'data:image/png;base64,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';
	let dark =
		'data:image/png;base64,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';

	let favicon = document.querySelector('link[rel="icon"]');
	if (!favicon) return;

	favicon.href = window.matchMedia('(prefers-color-scheme: dark)').matches
		? dark
		: light;

	window
		.matchMedia('(prefers-color-scheme: dark)')
		.addEventListener('change', function () {
			favicon.href =
				window.matchMedia('(prefers-color-scheme: dark)').matches
					? dark
					: light;
		});
}

export function is_same_page() {
	if (!page.previous || !page.previous.type || !page.previous.name) {
		return false;
	}

	return page.previous.type == page.type &&
		page.previous.name.toLowerCase() == page.name.toLowerCase();
}
