/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { html, render } from 'lighterhtml';
import { settings } from '@/build/config';
import { log } from '@/build/log';
import { auth, page } from '@/build/page';
import { clean_number, romanise, sanitise_text } from '@/build/tools';
import { tl, trans } from '@/build/trans';
import { ff } from '@/components/settings/sku';
import {
	correct_artist,
	correct_generic_artist,
	correct_item_by_artist,
	create_correction,
	name_includes,
	smart_title,
} from '@/components/music/lotus';
import { other_listener } from '@/components/profile/profile_shortcut';
import { submit_scrobble } from '@/components/music/scrobble';
import { oracle_credits } from '@/components/music/oracle';
import { setting } from '@/components/settings/settings';
import { patch_user_list_item } from '@/components/shared/users';
import { join_the_conversation } from '../shared/shout';
import { music_summary } from './summary';
import { icons } from '../shared/icon';
import { BetaIndicator } from '../shared/indicator';
import { useSettings } from '@/page.ts';
import { hover_tooltip, Tooltip } from '@/components/shared/tooltips.tsx';
import { SeeMore } from '@/components/text/see_more.tsx';
import { ReactNode } from 'jsx-dom';
import { Listen, ListenBoard } from '@/components/music/listen.tsx';
import { SideAction, SideActions } from '@/components/button/side.tsx';
import { Cta } from '@/components/cta/cta.tsx';
import { create_music_links } from '@/components/music/link_types.tsx';

export async function show_your_scrobbles() {
	show_numbers_on_side(page.type);

	// commonly nsbm pages are stripped of all social interaction and only have three tabs,
	// this is a simple way to detect it
	// quick test page: https://www.last.fm/music/Haftbefehl
	//
	// WARN: as of 2026-02-12, last.fm reworked shoutbox previews and this check no longer works
	// it has been switched off for now

	//const page_is_blocked = !page.structure.main.querySelector('#shoutbox');

	let col_main = page.structure.container!.querySelector(
		'.top-overview-panel',
	) as HTMLDivElement;
	if (!col_main) {
		col_main = document.body.querySelector('.col-main') as HTMLDivElement;
	}

	if (page.type == 'track') {
		const new_panel = document.createElement('div');
		new_panel.classList.add('track-info-panel');
		new_panel.innerHTML = col_main.innerHTML;

		page.structure.main!.insertBefore(
			new_panel,
			page.structure.main!.firstElementChild,
		);

		col_main.style.setProperty('display', 'none');
		// make last-child
		page.structure.row!.appendChild(col_main);

		console.info(col_main, new_panel);

		// now redirect later code
		col_main = new_panel;
	}

	const page_is_blocked = page.restricted;

	const summary = page.structure.main!.querySelector(
		'.music-summary',
	) as HTMLDivElement;
	const summary_info = summary?.querySelector('.summary-content');

	summary_info?.appendChild(col_main);

	log(
		`${page_is_blocked ? 'page is blocked' : 'page is not blocked'}`,
		'music',
	);

	join_the_conversation(page_is_blocked);

	if (page.subpage == 'overview') {
		const tabs = document.createElement('nav');
		tabs.classList.add(
			'navlist',
			'secondary-nav',
			'navlist--more',
			'redesigned-navigation',
		);

		if (page.type == 'artist') {
			tabs.appendChild(html.node`
                <ul class="navlist-items">
                    <li class="navlist-item secondary-nav-item secondary-nav-item--overview">
                        <a class="secondary-nav-item-link secondary-nav-item-link--active" href="${window.location.pathname}">
                            ${tl(trans.home)}
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--tracks">
                        <a class="secondary-nav-item-link" href="${window.location.pathname}/+tracks">
                            ${tl(trans.tracks)}
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--albums">
                        <a class="secondary-nav-item-link" href="${window.location.pathname}/+albums">
                            ${tl(trans.albums)}
                        </a>
                    </li>
                    ${
				!page_is_blocked
					? html.node`
                    <li class="navlist-item secondary-nav-item secondary-nav-item--images">
                        <a class="secondary-nav-item-link" href="${window.location.pathname}/+images">
                            ${tl(trans.photos)}
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--similar">
                        <a class="secondary-nav-item-link" href="${window.location.pathname}/+similar">
                            ${tl(trans.similar_artists)}
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--wiki">
                        <a class="secondary-nav-item-link" href="${window.location.pathname}/+wiki">
                            ${tl(trans.biography)}
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--listeners">
                        <a class="secondary-nav-item-link" href="${window.location.pathname}/+listeners">
                            ${tl(trans.listeners)}
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--shoutbox">
                        <a class="secondary-nav-item-link" href="${window.location.pathname}/+shoutbox">
                            ${tl(trans.shouts)}
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--events">
                        <a class="secondary-nav-item-link" href="${window.location.pathname}/+events">
                            ${tl(trans.events)}
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--tags">
                        <a class="secondary-nav-item-link" href="${window.location.pathname}/+tags">
                            ${tl(trans.tags)}
                        </a>
                    </li>
                    `
					: ''
			}
                </ul>
            `);
		} else if (page.type == 'album') {
			tabs.appendChild(html.node`
                <ul class="navlist-items">
                    <li class="navlist-item secondary-nav-item secondary-nav-item--overview">
                        <a class="secondary-nav-item-link secondary-nav-item-link--active" href="${window.location.pathname}">
                            ${tl(trans.home)}
                        </a>
                    </li>
                    ${
				!page_is_blocked
					? html.node`
                    <li class="navlist-item secondary-nav-item secondary-nav-item--wiki">
                        <a class="secondary-nav-item-link" href="${window.location.pathname}/+wiki">
                            ${tl(trans.wiki)}
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--images">
                        <a class="secondary-nav-item-link" href="${window.location.pathname}/+images">
                            ${tl(trans.artwork)}
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--shoutbox">
                        <a class="secondary-nav-item-link" href="${window.location.pathname}/+shoutbox">
                            ${tl(trans.shouts)}
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--tags">
                        <a class="secondary-nav-item-link" href="${window.location.pathname}/+tags">
                            ${tl(trans.tags)}
                        </a>
                    </li>
                    `
					: ''
			}
                </ul>
            `);
		} else if (page.type == 'track') {
			tabs.appendChild(html.node`
                <ul class="navlist-items">
                    <li class="navlist-item secondary-nav-item secondary-nav-item--overview">
                        <a class="secondary-nav-item-link secondary-nav-item-link--active" href="${window.location.pathname}">
                            ${tl(trans.home)}
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--albums">
                        <a class="secondary-nav-item-link" href="${window.location.pathname}/+albums">
                            ${tl(trans.albums)}
                        </a>
                    </li>
                    ${
				!page_is_blocked
					? html.node`
                    <li class="navlist-item secondary-nav-item secondary-nav-item--wiki">
                        <a class="secondary-nav-item-link" href="${window.location.pathname}/+wiki">
                            ${tl(trans.wiki)}
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--shoutbox">
                        <a class="secondary-nav-item-link" href="${window.location.pathname}/+shoutbox">
                            ${tl(trans.shouts)}
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--tags">
                        <a class="secondary-nav-item-link" href="${window.location.pathname}/+tags">
                            ${tl(trans.tags)}
                        </a>
                    </li>
                    `
					: ''
			}
                </ul>
            `);
		}

		page.structure.container!.insertBefore(tabs, page.structure.row!);
		page.structure.tabs = tabs;
	}

	const main = summary.querySelector('.summary-aside')!;

	// create container

	const no_auth_callout = page.structure.main!.querySelector(
		'.catalogue-callout',
	);
	no_auth_callout?.remove();

	// page url
	const page_url = window.location.pathname;
	const page_url_split = page_url.split('/');
	const page_url_length = page_url_split.length - 1;

	// artist
	let scrobble_page = page_url_split[page_url_length];
	if (page.type == 'album') {
		scrobble_page = page_url_split[page_url_length - 1] +
			'/' +
			page_url_split[page_url_length];
	} else if (page.type == 'track') {
		scrobble_page = page_url_split[page_url_length - 2] +
			'/_/' +
			page_url_split[page_url_length];
	}

	const other_container = col_main!.querySelector(
		'.personal-stats-item--listeners',
	);
	let other_count = undefined;
	if (other_container) {
		/*const avatars = other_container.querySelectorAll(
			'.personal-stats-listener-avatar img',
		);*/
		const count = other_container.querySelector(
			'.header-metadata-display a',
		);

		if (count != undefined) {
			other_count = clean_number(count.textContent.trim());
		}
	}

	let your_plays = 0;

	const scrobble_button = col_main!.querySelector(
		'.personal-stats-item--scrobbles .hidden-xs a',
	);
	if (scrobble_button) {
		your_plays = clean_number(scrobble_button.textContent.trim());
	}

	const starred = useSettings.get('starred_friend') as string;
	const friends = (useSettings.get('friends') as string[]).filter((
		friend,
	) => friend != starred);

	const is_artist = page.type == 'artist';

	console.error(starred, friends);

	main.insertBefore(
		<ListenBoard
			url={scrobble_page}
			others={other_count}
			extra={friends.length}
			expanded={friends.length <= 1}
		>
			<Listen
				name={auth.name!}
				plays={your_plays}
				url={scrobble_page}
				artist={is_artist}
			/>
			{starred && (
				<Listen name={starred} url={scrobble_page} artist={is_artist} />
			)}
			{friends.length > 0 && (
				<>
					{friends.map((friend, i) => (
						<Listen
							name={friend}
							index={i + 1}
							url={scrobble_page}
							artist={is_artist}
							waitForHover
						/>
					))}
				</>
			)}
		</ListenBoard>,
		main?.firstElementChild,
	);

	// interactables on the right
	const side_actions = <SideActions />;

	const header_actions = document.body.querySelector(
		'.header-new-actions',
	) as HTMLDivElement;

	Array.from(header_actions.children).forEach((form) => {
		const item = form.querySelector('a, button');
		if (!item) return;

		item.classList.add('btn', 'side-action', 'icon-mask');
		const classes = item.classList;

		if (classes[0] == 'header-new-more-button') return;

		if (classes[1] == 'header-new-love-button') {
			item.setAttribute('data-type', 'love');
			item.textContent = tl(trans.love_track) as string;
		} else if (classes[1] == 'header-new-bookmark-button') {
			item.setAttribute('data-type', 'bookmark');
			item.textContent = tl(trans.bookmark_item, {
				v: tl(trans[`${page.type}_lower`]),
			}) as string;
		}

		side_actions.appendChild(form);
	});

	// obsession
	const obsession_form = header_actions!.querySelector(
		'form[action$="obsessions"]',
	);
	if (obsession_form) {
		const obsession_btn = obsession_form.querySelector(
			'button',
		) as HTMLButtonElement;
		obsession_btn.classList = 'btn side-action icon-mask';
		obsession_btn.setAttribute('data-type', 'obsession');
		obsession_btn.textContent = tl(trans.set_obsession) as string;

		side_actions.appendChild(obsession_form);
	}

	// move it above the scrobble button
	const play_btn = side_actions.querySelector('.header-new-playlink');
	if (play_btn) side_actions.appendChild(play_btn);

	if (ff('submit_scrobble')) {
		const can_api = localStorage.getItem('bleh_auth') &&
				localStorage.getItem('bleh_auth_valid') === 'true' || false;

		const source_album = page.structure.main!.querySelector(
			'.source-album-name',
		);
		const source_album_artist = page.structure.main!.querySelector(
			'.source-album-artist',
		);

		let props = {
			can_api,
		};

		if (page.type == 'track') {
			props = {
				...props,
				pre_track: page.name,
				pre_artist: page.sister,
				pre_album: source_album ? source_album.textContent : null,
				pre_album_artist: source_album_artist
					? source_album_artist.textContent
					: page.sister,
			};
		} else if (page.type == 'album') {
			props = {
				...props,
				pre_album: page.name,
				pre_artist: page.sister,
				pre_album_artist: page.sister,
			};
		} else if (page.type == 'artist') {
			props = {
				...props,
				pre_artist: page.name,
				pre_album_artist: page.name,
			};
		}

		const scrobble_btn = (
			<SideAction
				type='add'
				onClick={() => submit_scrobble(props)}
			>
				{tl(trans.scrobble_value, {
					v: tl(trans[`${page.type}_lower`]),
				})}
			</SideAction>
		);

		if (!can_api) {
			hover_tooltip(
				scrobble_btn,
				<Tooltip>{tl(trans.requires_api_in_settings)}</Tooltip>,
			);
		}

		side_actions.appendChild(scrobble_btn);
	}

	if (
		ff('credits') &&
		ff('oracle') &&
		settings.oracle_beta &&
		page.type == 'track'
	) {
		side_actions.appendChild(
			<SideAction type='credits' onClick={oracle_credits}>
				{tl(trans.view_credits)}
				<BetaIndicator />
			</SideAction>,
		);
	}

	if (auth.name) {
		if (!page.mobile) {
			page.structure.side!.insertBefore(
				side_actions,
				page.structure.side!.firstElementChild,
			);
		} else {
			page.structure.main!.insertBefore(
				side_actions,
				page.structure.main!.firstElementChild,
			);
		}
	}

	// new playlist
	const new_playlist = page.structure.side!.querySelector(':scope > form');
	if (new_playlist) {
		const head = new_playlist.querySelector('h3');
		head?.remove();

		const playlist_button = new_playlist.querySelector('button')!;
		playlist_button.classList = 'btn side-action icon-mask';
		playlist_button.setAttribute('data-type', 'playlist');
		playlist_button.textContent = tl(trans.create_playlist) as string;

		side_actions.appendChild(new_playlist);
	}

	const metadata = col_main.querySelector('.metadata-column');
	if (metadata) {
		metadata.classList.remove('hidden-xs');

		const groups: { header: Element; value?: Element }[] = [];

		const headers = metadata.querySelectorAll(
			'.catalogue-metadata-heading:not(.visible-xs)',
		);
		headers.forEach((item, index) => {
			groups[index] = {
				header: item,
			};
		});

		const values = metadata.querySelectorAll(
			'.catalogue-metadata-description:not(.visible-xs)',
		);
		values.forEach((item, index) => {
			if (!groups[index]) return;

			groups[index].value = item;
		});

		metadata.replaceChildren(
			<>
				{groups.map((group) => (
					<div class='metadata-group'>
						{group.header as ReactNode}
						{group.value as ReactNode}
					</div>
				))}
			</>,
		);
	}

	if (page_is_blocked) {
		page.structure.main!.insertBefore(
			<Cta className='blocked-cta' label={tl(trans.blocked_page)} />,
			page.structure.main!.firstElementChild,
		);

		return;
	}

	const link_group = create_music_links(col_main);

	const tags = col_main.querySelector('.catalogue-tags');
	if (tags) {
		link_group.appendChild(html.node`
            <div class="metadata-group">
                <div class="sub-text music-small-header">
                    ${tl(trans.tags)}
                </div>
                ${tags}
            </div>
        `);

		const add = tags.querySelector('.tags-add') as HTMLAnchorElement;
		if (add) {
			hover_tooltip(
				add,
				<Tooltip>{tl(trans.add)}</Tooltip>,
			);
		}

		const all = tags.querySelector('.tags-view-all') as HTMLAnchorElement;
		if (all) {
			hover_tooltip(
				all,
				<Tooltip>{tl(trans.view_all)}</Tooltip>,
			);
		}
	}

	// no album info
	const no_info = col_main.querySelector(
		':scope > .section-with-separator:not(.buffer-standard, .masonry-left, .section-with-separator--xs-only)',
	);
	if (no_info) {
		console.info('no info', no_info.classList);
		no_info.classList = 'loading-data-container';

		render(
			no_info,
			html`
				<div class="loading-data-text info">
				    ${tl(
					page.type == 'album'
						? trans.missing_album_info
						: trans.missing_artist_info,
				)}
				</div>
			`,
		);

		const extra = no_info.nextElementSibling;
		if (extra?.classList.contains('section-with-separator')) {
			extra.remove();
		}
	}

	// lotus
	if (!useSettings.get('corrections')) return;

	page.structure.side!.appendChild(
		<Cta label={tl(trans.lotus_cta[page.corrected])} icon={icons.lotus}>
			{ff('refreshed_lotus')
				? (
					<SeeMore
						onClick={() => {
							create_correction(
								page.type,
								page.name,
								page.sister,
								page.corrected,
							);
						}}
					>
						{tl(trans.suggest_correction)}
					</SeeMore>
				)
				: (
					<SeeMore
						href='https://github.com/katelyynn/lotus/issues/new/choose'
						external
					>
						{tl(trans.suggest_correction)}
					</SeeMore>
				)}
		</Cta>,
	);
}

function show_numbers_on_side(header_type) {
	let metadata = document.body.querySelectorAll('.header-metadata-tnew-item');

	let listeners = {};
	let scrobbles = {};
	let metascore = {};

	metadata.forEach((item, index) => {
		let text = item
			.querySelector('.header-metadata-tnew-title')
			.textContent.trim();
		let value = item.querySelector('.header-metadata-tnew-display abbr');

		if (index == 0) {
			listeners.text = text;
			listeners.value = clean_number(value.getAttribute('title'));
			listeners.abbr = value.textContent.trim();
		} else if (index == 1) {
			scrobbles.text = text;
			scrobbles.value = clean_number(value.getAttribute('title'));
			scrobbles.abbr = value.textContent.trim();
		} else if (index == 2) {
			let link = item.querySelector('a');
			if (!link) return;

			metascore.text = text;
			metascore.abbr = value.textContent.trim();
			metascore.link = link.getAttribute('href');
		}
	});

	page.structure.side.classList.remove('hidden-xs');

	music_summary(listeners, scrobbles, metascore);

	// get panel
	let panel = page.structure.side.querySelector(
		'section.section-with-separator:has(.listener-trend)',
	);

	if (panel) panel.remove();

	// is there album artwork?
	if (page.type == 'album') {
		let album_artwork = document.body.querySelector(
			'.artwork-and-metadata-row',
		);

		if (album_artwork) {
			page.structure.side.insertBefore(
				album_artwork,
				page.structure.side.firstElementChild,
			);
		}
	}

	let masonry = page.structure.row.querySelector(
		':scope > .col-sidebar.masonry-right',
	);
	if (masonry) {
		// make last-child
		page.structure.row.appendChild(masonry);
	}

	if (page.type == 'album' || page.type == 'artist') {
		let upper = document.body.querySelector('.col-main');
		upper.classList.add('upper-overview-to-hide');
		// make last-child
		page.structure.row.appendChild(upper);

		let new_upper = document.createElement('div');
		new_upper.classList.add('top-overview-panel');
		new_upper.setAttribute('data-page-type', page.type);
		new_upper.innerHTML = upper.innerHTML;

		page.structure.main.insertBefore(
			new_upper,
			page.structure.main.firstElementChild,
		);
	}

	// is there a video?
	if (page.type == 'track') {
		let video_col = document.body.querySelector(
			'.track-overview-video-column.col-sidebar',
		);

		if (!video_col) {
			video_unavailable(video_col);
			return;
		}

		video_col.classList.remove('col-sidebar');
		page.structure.side.insertBefore(
			video_col,
			page.structure.side.firstElementChild,
		);

		let video = video_col.querySelector('.video-preview');

		if (!video) {
			video_unavailable(video_col);
			return;
		}

		video_col.classList.remove('col-sidebar');
		page.structure.side.insertBefore(
			video_col,
			page.structure.side.firstElementChild,
		);

		let playlink = video.querySelector('.video-preview-playlink a');
		let replace = video_col.querySelector('.video-preview-replace a');

		video.appendChild(html.node`
            <a class="link-block-cover-link" href=${playlink.href} target="_blank" />
        `);

		playlink.classList = 'see-more';
		replace.classList = 'see-more add left-icon';

		video.after(html.node`
            <div class="video-actions sub-text">
                ${replace}
                ${playlink}
            </div>
        `);

		playlink.textContent = tl(trans.watch_video);
		playlink.removeAttribute('title');

		replace.textContent = tl(trans.replace);
	}
}

function video_unavailable(video_col = null) {
	let cta = page.structure.side.querySelector('.video-preview-upload-cta');
	if (cta) return;

	if (video_col) page.structure.side.removeChild(video_col);

	page.structure.side.insertBefore(
		html.node`
        <section class="video-placeholder">
            <div class="bleh-icon" style="--icon: var(--icon-16-video-broken)"></div>
            ${tl(trans.video_removed)}
        </section>
    `,
		page.structure.side.firstElementChild,
	);
}

export function bleh_music_page_charts() {
}

export function bleh_top_listeners() {
	if (!ff('unify_top_listeners')) return;

	const panel = page.structure.main.querySelector(
		':scope > .buffer-standard',
	);

	panel.insertBefore(
		setting({
			id: 'list_view',
			func: (val) => {
				user_list.setAttribute('data-list-view', val);
			},
		}),
		panel.firstElementChild,
	);

	const legacy_top_listeners_container = panel.querySelector(
		'.top-listeners',
	);
	const legacy_top_listeners = legacy_top_listeners_container
		.querySelectorAll('.top-listeners-item');

	const user_list = html.node`
        <ul class="user-list top-listeners-list" data-list-view=${settings.list_view} />
    `;

	legacy_top_listeners.forEach((listener, index) => {
		user_list.appendChild(convert_top_listener(listener, index));
	});

	legacy_top_listeners_container.replaceWith(user_list);
}

export function convert_top_listener(listener, index, key = 'top-listeners') {
	let position = index + 1;
	if (
		page.requested.page != null &&
		page.requested.page != '1' &&
		key == 'top-listeners'
	) {
		position += (parseInt(page.requested.page) - 1) * 30;
	}

	let avatar = listener.querySelector(`.${key}-item-image`);
	let name_wrap = listener.querySelector(`.${key}-item-name a`);
	let name = name_wrap.textContent;

	let track_wrap = listener.querySelector(`.${key}-track`);

	let follow = listener.querySelector('.class');

	let name_link;
	let user_list_avatar;
	let about_me;
	const new_listener = html.node`
        <li class="user-list-item listener-list-item" data-position=${position}>
            <div class="user-list-inner-wrap">
                <span class="listener-list-position">
                    ${position}
                </span>
                <h4 class="user-list-name">
                    <a class="user-list-link link-block-target" href=${
		name_wrap.getAttribute('href')
	} ref=${(el) => (name_link = el)}>
                        ${name}
                    </a>
                </h4>
                <span class="avatar user-list-avatar" ref=${(
		el,
	) => (user_list_avatar = el)}>
                    ${{ html: avatar.innerHTML }}
                </span>
                ${follow}
                ${
		track_wrap
			? html.node`
                <div class="user-list-description">
                    <p class="user-list-about-me has-featured-track" ref=${(
				el,
			) => (about_me = el)}>
                        ${{ html: track_wrap.innerHTML }}
                    </p>
                </div>
                `
			: ''
	}
            </div>
        </li>
    `;

	if (track_wrap) {
		let track_link = about_me.querySelector('a');

		track_link.classList.add('top-track');
		if (useSettings.get('format_guest_features')) {
			const formatted = name_includes(
				track_link.textContent.trim(),
				page.sister,
			);

			track_link.classList.add('smart-title');
			render(
				track_link,
				smart_title(formatted.song_title, formatted.song_tags),
			);
		} else if (useSettings.get('corrections')) {
			track_link.textContent = romanise(
				correct_item_by_artist(
					track_link.textContent.trim(),
					page.sister,
				),
			);
		}
	}

	patch_user_list_item(new_listener, index);

	return new_listener;
}

// allows controlling auto +noredirect
export function redirect() {
	if (settings.prefer_no_redirect) return '+noredirect/';
	else return '';
}

export function prepare_music() {
	page.state.music_links = {
		spotify: {
			name: 'Spotify',
			icon: '',
			host: 'spotify.com',
		},
		itunes: {
			name: 'Apple',
			icon: '',
			host: 'music.apple.com',
		},
		youtube: {
			name: 'YouTube',
			icon: '',
			host: 'youtube.com',
		},
		tidal: {
			name: 'Tidal',
			icon: '',
			host: 'tidal.com',
		},
		deezer: {
			name: 'Deezer',
			icon: '',
			host: 'deezer.com',
		},
		discogs: {
			name: 'Discogs',
			icon: '',
			host: 'discogs.com',
		},
		qobuz: {
			name: 'Qobuz',
			icon: '',
			host: 'qobuz.com',
		},
		aoty: {
			name: 'AOTY',
			icon: '',
			host: 'albumoftheyear.org',
		},
		rym: {
			name: 'RYM',
			icon: '',
			host: 'rateyourmusic.com',
		},
		record_club: {
			name: 'Record Club',
			icon: '',
			host: 'record.club',
		},
		genius: {
			name: 'Genius',
			icon: '',
			host: 'genius.com',
		},
		website: {
			name: tl(trans.website),
			icon: icons.link,
		},
		twitter: {
			name: 'Twitter',
			icon: '',
			host: 'twitter.com',
		},
		facebook: {
			name: 'Facebook',
			icon: '',
			host: 'facebook.com',
		},
		soundcloud: {
			name: 'SoundCloud',
			icon: '',
			host: 'soundcloud.com',
		},
		instagram: {
			name: 'Instagram',
			icon: '',
			host: 'instagram.com',
		},
		search: {
			name: tl(trans.search),
			icon: icons.search,
		},
	};

	page.state.tracklist_sources = [
		{
			value: 'oracle',
			text: 'oracle',
		},
		{
			value: 'own',
			text: tl(trans.own_plays),
		},
		{
			value: 'lastfm',
			text: 'Last.fm',
		},
	];

	page.state.fonts = {
		none: '',
		single: 'Single Day',
		cherry: 'Cherry Bomb One',
		darum: 'Darumadrop One',
		balsamiq: 'Balsamiq Sans',
		sister: 'Love Ya Like A Sister',
		lilita: 'Lilita One',
		code: 'Google Sans Code',
		rakkas: 'Rakkas',
		crimson: 'Crimson Text',
		rokkitt: 'Rokkitt',
		inst: 'Instrument Serif',
		uni: 'UnifrakturCook',
		zpix: 'Zpix',
		mask: 'Expose',
	};
}

export function similar_items() {
	const artists = page.structure.main.querySelector(
		'.catalogue-overview-similar-artists',
	)?.parentElement;

	if (artists) {
		artists.classList = 'artists-like';
		const controls = artists.querySelector('.section-controls');
		const station = controls.querySelector('.stationlink');

		station.classList = 'left-icon blend-v2-btn play-radio';

		controls.replaceWith(html.node`
            <div class="top-container">
                <h2>${{
			html: tl(trans.more_like_name, {
				n: page.type == 'artist'
					? `<i>${
						sanitise_text(romanise(correct_artist(page.name)))
					}<i>`
					: `<i>${
						sanitise_text(romanise(correct_artist(page.sister)))
					}<i>`,
			}),
		}}</h2>
                <div class="view-buttons blend blend-v2">
                    ${station}
                </div>
            </div>
        `);

		correct_generic_artist('catalogue-overview-similar-artists-item');
	}

	const albums = page.structure.main.querySelector('.similar-albums')
		?.parentElement;

	if (albums) {
		albums.classList = 'albums-like';
		const head = albums.querySelector('h3');
		render(
			head,
			html`
				${{
					html: tl(trans.more_like_name, {
						n: `<i>${
							romanise(
								correct_item_by_artist(page.name, page.sister),
							)
						}</i>`,
					}),
				}}
			`,
		);
	}

	const tracks = page.structure.main.querySelector('.track-similar-tracks')
		?.parentElement;

	if (tracks) {
		tracks.classList = 'tracks-like';
		const head = tracks.querySelector('h3');
		render(
			head,
			html`
				${{
					html: tl(trans.more_like_name, {
						n: `<i>${
							romanise(
								correct_item_by_artist(page.name, page.sister),
							)
						}</i>`,
					}),
				}}
			`,
		);
	}

	if (!artists && !tracks && !albums) return;

	page.structure.main.appendChild(html.node`
        <section class="music-like">
            ${albums}
            ${tracks}
            ${artists}
        </section>
    `);
}
