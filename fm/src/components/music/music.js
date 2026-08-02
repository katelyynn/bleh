//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { html, render } from 'lighterhtml';
import { settings } from '@/build/config';
import { log } from '@/build/log';
import { auth, page, root } from '@/build/page';
import { clean_number, romanise, sanitise, sanitise_text } from '@/build/tools';
import { lang, tl, trans } from '@/build/trans';
import { ff } from '@/components/settings/sku';
import { parse_scrobbles_as_rank } from '@/components/music/colourful_counts';
import {
	correct_artist,
	correct_generic_artist,
	correct_item_by_artist,
	create_correction,
	name_includes,
	smart_title,
} from '@/components/music/lotus';
import { register_menu } from '@/components/menu';
import { other_listener } from '@/components/profile/profile_shortcut';
import { submit_scrobble } from '@/components/music/scrobble';
import tippy from 'tippy.js';
import {
	load_profile_cache_externally,
	open_starred_friend_window,
} from '@/pages/profile/profile';
import { oracle_credits } from '@/components/music/oracle';
import { setting } from '@/components/settings/settings';
import { patch_user_list_item } from '@/components/shared/users';
import { join_the_conversation } from '../shared/shout';
import { music_summary } from './summary';
import { icon, icons } from '../shared/icon';
import { keys } from '../settings/storage';
import { is_sponsor } from '../sponsor';
import { beta_indicator } from '../shared/indicator';

unsafeWindow._other_listener = function (id) {
	other_listener(id);
};

export async function show_your_scrobbles() {
	const katsune = ff('katsune');
	show_numbers_on_side(page.type);

	// commonly nsbm pages are stripped of all social interaction and only have three tabs,
	// this is a simple way to detect it
	// quick test page: https://www.last.fm/music/Haftbefehl
	//
	// WARN: as of 2026-02-12, last.fm reworked shoutbox previews and this check no longer works
	// it has been switched off for now

	//const page_is_blocked = !page.structure.main.querySelector('#shoutbox');

	let col_main = page.structure.container.querySelector(
		'.top-overview-panel',
	);
	if (!col_main) col_main = document.body.querySelector('.col-main');

	if (page.type == 'track') {
		const new_panel = document.createElement('div');
		new_panel.classList.add('track-info-panel');
		new_panel.innerHTML = col_main.innerHTML;

		page.structure.main.insertBefore(
			new_panel,
			page.structure.main.firstElementChild,
		);

		col_main.style.setProperty('display', 'none');
		// make last-child
		page.structure.row.appendChild(col_main);

		console.info(col_main, new_panel);

		// now redirect later code
		col_main = new_panel;
	}

	const page_is_blocked = page.restricted;

	const summary = page.structure.main.querySelector('.music-summary');
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

		page.structure.container.insertBefore(tabs, page.structure.row);
		page.structure.tabs = tabs;
	}

	const main = summary?.querySelector('.summary-aside');

	// create container
	let listen_container = document.createElement('div');
	listen_container.classList.add('listen-container');

	const no_auth_callout = page.structure.main.querySelector(
		'.catalogue-callout',
	);
	if (no_auth_callout) no_auth_callout.remove();

	// page url
	let page_url = window.location.pathname;
	let page_url_split = page_url.split('/');
	let page_url_length = page_url_split.length - 1;

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

	// you
	let your_listens = {
		name: auth.name,
		listens: 0,
		link: scrobble_page,
		avi: auth.avatar,
		katsune: katsune,
	};
	// check to see if you have scrobbles
	let scrobble_button = col_main.querySelector(
		'.personal-stats-item--scrobbles .hidden-xs a',
	);
	if (scrobble_button) {
		your_listens.listens = clean_number(scrobble_button.textContent.trim());
	}
	// create child for u
	create_listen_item(listen_container, your_listens, page.type);

	// profile shortcut :3
	if (settings.starred_friend != '') {
		const cache = await load_profile_cache_externally(
			settings.starred_friend,
		);

		let shortcut_listens = {
			name: settings.starred_friend,
			listens: -1,
			link: scrobble_page,
			avi: cache.avatar,
			katsune: katsune,
		};
		// create child for them
		const listen_item = create_listen_item(
			listen_container,
			shortcut_listens,
		);

		fetch(
			`${root}user/${shortcut_listens.name}/library/music/${redirect()}${scrobble_page}`,
		)
			.then(function (response) {
				console.log('returned', response, response.text);

				return response.text();
			})
			.then(function (dom) {
				const doc = new DOMParser().parseFromString(dom, 'text/html');

				let first_metadata_item = doc.querySelector(
					'.metadata-item .metadata-display',
				);

				let listens = 0;

				// sometimes this fails even thou they do have plays, this is just a last.fm bug
				// i dont feel comfortable displaying 0 here as it may not be true
				// but i guess i should?
				if (first_metadata_item) {
					listens = clean_number(
						first_metadata_item.textContent.trim(),
					);
				}

				let p = listen_item.querySelector('.listen-item-text');
				listen_item.setAttribute('data-listens', listens);

				p.textContent = tl(trans.count_plays, {
					c: listens.toLocaleString(lang),
				});

				// colourful counts
				if (settings.colourful_counts && page.type == 'artist') {
					let parsed_scrobble_as_rank = parse_scrobbles_as_rank(
						listens,
					);

					listen_item.setAttribute(
						'data-bleh--scrobble-milestone',
						parsed_scrobble_as_rank.milestone,
					);
					p.style.setProperty(
						'--hue-over',
						parsed_scrobble_as_rank.hue,
					);
					p.style.setProperty(
						'--sat-over',
						parsed_scrobble_as_rank.sat,
					);
					p.style.setProperty(
						'--lit-over',
						parsed_scrobble_as_rank.lit,
					);
				}
			});
	}

	main?.appendChild(listen_container);

	// other user
	listen_container?.appendChild(html.node`
        <button class="btn listen-item" data-listens="-3" onclick=${() =>
		other_listener(scrobble_page)}>
            ${icon({ name: icons.plus, identifier: 'listen-item' })}
            <div class="listen-item-info">
                <h3 class="listen-item-name not-profile">${
		tl(trans.other_user)
	}</h3>
            </div>
        </button>
    `);

	// other listeners
	if (page.type == 'artist') {
		//
		let other_container = col_main.querySelector(
			'.personal-stats-item--listeners',
		);
		if (other_container) {
			let avatars = other_container.querySelectorAll(
				'.personal-stats-listener-avatar img',
			);
			let count = other_container.querySelector(
				'.header-metadata-display a',
			);

			let other_listeners = {
				name: 'others',
				listens: -2,
				link: scrobble_page,
				avi: avatars,
				count: count != null
					? clean_number(count.textContent.trim())
					: 5,
				katsune: katsune,
			};
			// create child for them
			create_listen_item(listen_container, other_listeners, page.type);
		}
	}

	// interactables on the right
	let interact_container = document.createElement('section');
	interact_container.classList.add('side-actions');

	let text = document.body
		.querySelector('.header-new-title')
		.textContent.replaceAll(' ', '+')
		.replaceAll('&', '%26');

	let artist = document.body.querySelector('.header-new-crumb');
	if (artist != undefined) {
		text = `${text}+${
			artist.textContent.replaceAll(' ', '+').replaceAll('&', '%26')
		}`;
	}

	// temp probably
	let header_actions = document.body.querySelector('.header-new-actions');

	interact_container.innerHTML = header_actions.innerHTML;

	let buttons = interact_container.querySelectorAll('button');
	buttons.forEach((button) => {
		button.classList.add('btn', 'side-action', 'icon-mask');

		if (button.classList[0] == 'header-new-more-button') {
			interact_container.removeChild(button.parentElement);
		}

		if (button.classList[1] == 'header-new-love-button') {
			button.setAttribute('data-type', 'love');
			button.textContent = tl(trans.love_track);
		} else if (button.classList[1] == 'header-new-bookmark-button') {
			button.setAttribute('data-type', 'bookmark');
			button.textContent = tl(trans.bookmark_item, {
				v: tl(trans[`${page.type}_lower`]),
			});
		}
	});
	let links = interact_container.querySelectorAll('a');
	links.forEach((button) => {
		button.classList.add('btn', 'side-action', 'icon-mask');
	});

	// obsession
	let obsession_form = header_actions.querySelector(
		'form[action$="obsessions"]',
	);
	if (obsession_form) {
		let obsession_btn = obsession_form.querySelector('button');
		obsession_btn.classList = 'btn side-action icon-mask';
		obsession_btn.setAttribute('data-type', 'obsession');
		obsession_btn.textContent = tl(trans.set_obsession);

		interact_container.appendChild(obsession_form);
	}

	// move it above the scrobble button
	const play_btn = interact_container.querySelector('.header-new-playlink');
	if (play_btn) interact_container.appendChild(play_btn);

	if (ff('submit_scrobble')) {
		const can_api = localStorage.getItem('bleh_auth') &&
			localStorage.getItem('bleh_auth_valid') === 'true';

		const source_album = page.structure.main.querySelector(
			'.source-album-name',
		);
		const source_album_artist = page.structure.main.querySelector(
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

		const scrobble_btn = html.node`
            <button class="btn side-action icon-mask" data-type="add" onclick=${() =>
			submit_scrobble(props)}>
                ${
			tl(trans.scrobble_value, { v: tl(trans[`${page.type}_lower`]) })
		}
            </button>
        `;

		if (!can_api) {
			tippy(scrobble_btn, {
				content: tl(trans.requires_api_in_settings),
			});
		}

		interact_container.appendChild(scrobble_btn);
	}

	if (
		ff('credits') &&
		ff('oracle') &&
		settings.oracle_beta &&
		page.type == 'track'
	) {
		interact_container.appendChild(html.node`
            <button class="btn side-action icon-mask" data-type="credits" onclick=${() =>
			oracle_credits()}>
                ${tl(trans.view_credits)}
                ${beta_indicator()}
            </button>
        `);
	}

	// search similar!
	/*let search_btn = document.createElement('a');
    search_btn.classList.add('btn', 'side-action', 'search-similar-btn');
    search_btn.textContent = trans_legacy.en.music.search_variations.name;
    search_btn.href = `${root}search/${page.type}s?q=${text}`;
    search_btn.target = '_blank';

    tippy(search_btn, {
        content: trans_legacy.en.music.search_variations.tooltip
    });

    interact_container.appendChild(search_btn);*/

	if (auth.name) {
		if (!page.mobile) {
			page.structure.side.insertBefore(
				interact_container,
				page.structure.side.firstElementChild,
			);
		} else {
			page.structure.main.insertBefore(
				interact_container,
				page.structure.main.firstElementChild,
			);
		}
	}

	// new playlist
	const new_playlist = page.structure.side.querySelector(':scope > form');
	if (new_playlist) {
		let header = new_playlist.querySelector('h3');
		header.remove();

		let playlist_button = new_playlist.querySelector('button');
		playlist_button.classList = 'btn side-action icon-mask';
		playlist_button.setAttribute('data-type', 'playlist');
		playlist_button.textContent = tl(trans.create_playlist);

		interact_container.appendChild(new_playlist);
	}

	const metadata = col_main.querySelector('.metadata-column');
	if (metadata) {
		metadata.classList.remove('hidden-xs');

		let groups = [];

		let headers = metadata.querySelectorAll(
			'.catalogue-metadata-heading:not(.visible-xs)',
		);
		headers.forEach((item, index) => {
			groups[index] = {
				header: item,
			};
		});
		let values = metadata.querySelectorAll(
			'.catalogue-metadata-description:not(.visible-xs)',
		);
		values.forEach((item, index) => {
			if (!groups[index]) return;

			groups[index].value = item;
		});

		render(
			metadata,
			html`
				${groups.map(
					(group) =>
						html.node`
                <div class="metadata-group">
                    ${group.header}
                    ${group.value}
                </div>
            `,
				)}
			`,
		);
	}

	if (page_is_blocked) {
		page.structure.main.insertBefore(
			html.node`
            <section class="cta blocked-cta">
                <strong>${tl(trans.blocked_page)}</strong>
            </section>
        `,
			page.structure.main.firstElementChild,
		);

		return;
	}

	let play_on;
	let play_links;

	let link_container;
	const link_group = html.node`
        <div class="metadata-row">
            <div class="metadata-group">
                <div class="sub-text music-small-header">
                    ${tl(trans.find_on)}
                    <a class="wiki-edit-small icon" href="${root}bleh/interface?setting=music_links">
                        ${tl(trans.edit_links)}
                    </a>
                </div>
                <div class="music-links" ref=${(el) => (link_container = el)} />
            </div>
        </div>
    `;

	if (page.type == 'track') {
		play_on = page.structure.side.querySelector(
			'.play-this-track-playlinks',
		);
		play_on.parentElement.remove();

		play_links = play_on.querySelectorAll('li');

		play_links.forEach((item) => {
			const link = item.querySelector(
				'.play-this-track-playlink:not(.visible-xs)',
			);

			link.classList.remove('play-this-track-playlink');
			link.classList.add('btn', 'music-link', 'colourful', 'icon');

			const replace = item.querySelector('.replace-playlink');

			if (link.classList.contains('play-this-track-playlink--youtube')) {
				link.textContent = 'YouTube';

				if (!settings.music_links.includes('youtube')) return;
			} else if (
				link.classList.contains('play-this-track-playlink--spotify')
			) {
				link.textContent = 'Spotify';

				if (!settings.music_links.includes('spotify')) return;
			} else if (
				link.classList.contains('play-this-track-playlink--itunes')
			) {
				link.textContent = 'Apple';

				if (!settings.music_links.includes('itunes')) return;
			}

			if (replace) {
				replace.classList.add('dropdown-menu-clickable-item');
				item.removeChild(replace);

				let menu = tippy(link, {
					theme: 'context-menu',
					content: replace,
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

				register_menu(link, menu);
			}

			link_container.appendChild(item);
		});

		if (
			['genius', 'tidal', 'deezer', 'qobuz'].some((service) =>
				settings.music_links.includes(service)
			)
		) {
			link_container.appendChild(html.node`
                ${
				settings.music_links.includes('genius')
					? html.node`
                    <a class="btn music-link play-this-track-playlink--genius colourful icon" href="https://genius.com/search?q=${
						sanitise(page.sister)
					}+${sanitise(page.name)}" target="_blank">
                        Genius
                    </a>
                `
					: ''
			}
                ${
				settings.music_links.includes('tidal')
					? html.node`
                    <a class="btn music-link play-this-track-playlink--tidal colourful icon" href="https://listen.tidal.com/search?q=${
						sanitise(page.sister, ' ')
					} ${sanitise(page.name, ' ')}" target="_blank">
                        Tidal
                    </a>
                `
					: ''
			}
                ${
				settings.music_links.includes('deezer')
					? html.node`
                    <a class="btn music-link play-this-track-playlink--deezer colourful icon" href="https://www.deezer.com/search/${
						sanitise(page.sister, ' ')
					} ${sanitise(page.name, ' ')}" target="_blank">
                        Deezer
                    </a>
                `
					: ''
			}
                ${
				settings.music_links.includes('qobuz')
					? html.node`
                    <a class="btn music-link play-this-track-playlink--qobuz colourful icon" href="https://www.qobuz.com/gb-en/search/tracks/${
						sanitise(page.name, ' ')
					}?ssf[s]=main_catalog&ssf[f][an]=${
						sanitise(page.sister, ' ')
					}" target="_blank">
                        Qobuz
                    </a>
                `
					: ''
			}
            `);
		}
	} else {
		if (page.type == 'album') {
			render(
				link_container,
				html`
					${settings.music_links.includes('spotify')
						? html.node`
                            <a
                                class="btn music-link play-this-track-playlink--spotify colourful icon"
                                href="https://open.spotify.com/search/${
							sanitise(
								page.sister,
								' ',
							)
						} ${sanitise(page.name, ' ')}"
                                target="_blank"
                            >
                                Spotify
                            </a>
                    `
						: ''}
					${settings.music_links.includes('itunes')
						? html.node`
                            <a
                                class="btn music-link play-this-track-playlink--itunes colourful icon"
                                href="https://music.apple.com/gb/search?term=${
							sanitise(
								page.sister,
								' ',
							)
						} ${sanitise(page.name, ' ')}"
                                target="_blank"
                            >
                                Apple
                            </a>
                    `
						: ''}
					${settings.music_links.includes('youtube')
						? html.node`
                            <a
                                class="btn music-link play-this-track-playlink--youtube-music colourful icon"
                                href="https://music.youtube.com/search?q=${
							sanitise(
								page.sister,
							)
						}+${sanitise(page.name)}"
                                target="_blank"
                            >
                                YouTube
                            </a>
                    `
						: ''}
					${settings.music_links.includes('tidal')
						? html.node`
                            <a
                                class="btn music-link play-this-track-playlink--tidal colourful icon"
                                href="https://listen.tidal.com/search?q=${
							sanitise(
								page.sister,
								' ',
							)
						} ${sanitise(page.name, ' ')}"
                                target="_blank"
                            >
                                Tidal
                            </a>
                    `
						: ''}
					${settings.music_links.includes('deezer')
						? html.node`
                            <a
                                class="btn music-link play-this-track-playlink--deezer colourful icon"
                                href="https://www.deezer.com/search/${
							sanitise(
								page.sister,
								' ',
							)
						} ${sanitise(page.name, ' ')}"
                                target="_blank"
                            >
                                Deezer
                            </a>
                    `
						: ''}
					${settings.music_links.includes('discogs')
						? html.node`
                            <a
                                class="btn music-link play-this-track-playlink--discogs colourful icon"
                                href="https://www.discogs.com/search?q=${
							sanitise(
								page.sister,
							)
						}+${sanitise(page.name)}&type=all"
                                target="_blank"
                            >
                                Discogs
                            </a>
                    `
						: ''}
					${settings.music_links.includes('qobuz')
						? html.node`
                            <a
                                class="btn music-link play-this-track-playlink--qobuz colourful icon"
                                href="https://www.qobuz.com/gb-en/search/albums/${
							sanitise(page.name, ' ')
						}?ssf[s]=main_catalog&ssf[f][an]=${
							sanitise(page.sister, ' ')
						}"
                                target="_blank"
                            >
                                Qobuz
                            </a>
                    `
						: ''}
					${settings.music_links.includes('aoty')
						? html.node`
                            <a
                                class="btn music-link play-this-track-playlink--aoty colourful icon"
                                href="https://www.albumoftheyear.org/search/?q=${
							sanitise(
								page.sister,
							)
						}+${sanitise(page.name)}"
                                target="_blank"
                            >
                                AOTY
                            </a>
                    `
						: ''}
					${settings.music_links.includes('rym')
						? html.node`
                            <a
                                class="btn music-link play-this-track-playlink--rym colourful icon"
                                href="https://rateyourmusic.com/search?searchterm=${
							sanitise(
								page.sister,
								' ',
							)
						} ${sanitise(page.name, ' ')}"
                                target="_blank"
                            >
                                RYM
                            </a>
                    `
						: ''}
					${settings.music_links.includes('genius')
						? html.node`
                            <a
                                class="btn music-link play-this-track-playlink--genius colourful icon"
                                href="https://genius.com/search?q=${
							sanitise(
								page.sister,
							)
						}+${sanitise(page.name)}"
                                target="_blank"
                            >
                                Genius
                            </a>
                    `
						: ''}
				`,
			);
		} else {
			render(
				link_container,
				html`
					${settings.music_links.includes('spotify')
						? html.node`
                            <a
                                class="btn music-link play-this-track-playlink--spotify colourful icon"
                                href="https://open.spotify.com/search/${
							sanitise(
								page.name,
								' ',
							)
						}"
                                target="_blank"
                            >
                                Spotify
                            </a>
                    `
						: ''}
					${settings.music_links.includes('itunes')
						? html.node`
                            <a
                                class="btn music-link play-this-track-playlink--itunes colourful icon"
                                href="https://music.apple.com/gb/search?term=${
							sanitise(
								page.name,
								' ',
							)
						}"
                                target="_blank"
                            >
                                Apple
                            </a>
                    `
						: ''}
					${settings.music_links.includes('youtube')
						? html.node`
                            <a
                                class="btn music-link play-this-track-playlink--youtube-music colourful icon"
                                href="https://music.youtube.com/search?q=${
							sanitise(
								page.name,
							)
						}"
                                target="_blank"
                            >
                                YouTube
                            </a>
                    `
						: ''}
					${settings.music_links.includes('tidal')
						? html.node`
                            <a
                                class="btn music-link play-this-track-playlink--tidal colourful icon"
                                href="https://listen.tidal.com/search?q=${
							sanitise(
								page.name,
								' ',
							)
						}"
                                target="_blank"
                            >
                                Tidal
                            </a>
                    `
						: ''}
					${settings.music_links.includes('deezer')
						? html.node`
                            <a
                                class="btn music-link play-this-track-playlink--deezer colourful icon"
                                href="https://www.deezer.com/search/${
							sanitise(
								page.name,
								' ',
							)
						}"
                                target="_blank"
                            >
                                Deezer
                            </a>
                    `
						: ''}
					${settings.music_links.includes('discogs')
						? html.node`
                            <a
                                class="btn music-link play-this-track-playlink--discogs colourful icon"
                                href="https://www.discogs.com/search?q=${
							sanitise(
								page.name,
							)
						}&type=artist"
                                target="_blank"
                            >
                                Discogs
                            </a>
                    `
						: ''}
					${settings.music_links.includes('qobuz')
						? html.node`
                            <a
                                class="btn music-link play-this-track-playlink--qobuz colourful icon"
                                href="https://www.qobuz.com/gb-en/search/artists/${
							sanitise(
								page.name,
								' ',
							)
						}"
                                target="_blank"
                            >
                                Qobuz
                            </a>
                    `
						: ''}
					${settings.music_links.includes('aoty')
						? html.node`
                            <a
                                class="btn music-link play-this-track-playlink--aoty colourful icon"
                                href="https://www.albumoftheyear.org/search/?q=${
							sanitise(
								page.name,
							)
						}"
                                target="_blank"
                            >
                                AOTY
                            </a>
                    `
						: ''}
					${settings.music_links.includes('rym')
						? html.node`
                            <a
                                class="btn music-link play-this-track-playlink--rym colourful icon"
                                href="https://rateyourmusic.com/search?searchterm=${
							sanitise(
								page.name,
								' ',
							)
						}"
                                target="_blank"
                            >
                                RYM
                            </a>
                    `
						: ''}
					${settings.music_links.includes('genius')
						? html.node`
                            <a
                                class="btn music-link play-this-track-playlink--genius colourful icon"
                                href="https://genius.com/search?q=${
							sanitise(
								page.name,
							)
						}"
                                target="_blank"
                            >
                                Genius
                            </a>
                    `
						: ''}
				`,
			);

			let externals = page.structure.side.querySelector(
				'.resource-external-links',
			);
			if (externals) {
				page.structure.side.removeChild(externals.parentElement);
				let externals_links = externals.querySelectorAll(
					'.resource-external-link',
				);
				externals_links.forEach((link) => {
					link.classList.add(
						'btn',
						'music-link',
						'colourful',
						'icon',
					);

					let type = link.classList[1];

					if (type == 'resource-external-link--homepage') {
						link.textContent = tl(trans.website);
					} else if (type == 'resource-external-link--twitter') {
						link.textContent = 'Twitter';

						if (!settings.music_links.includes('twitter')) return;
					} else if (type == 'resource-external-link--facebook') {
						link.textContent = 'Facebook';

						if (!settings.music_links.includes('facebook')) return;
					} else if (type == 'resource-external-link--instagram') {
						if (!settings.music_links.includes('instagram')) return;
					} else if (type == 'resource-external-link--soundcloud') {
						if (!settings.music_links.includes('soundcloud')) {
							return;
						}
					}

					link_container.appendChild(link);
				});
			}
		}
	}

	if (link_container.childNodes.length > 0) col_main.appendChild(link_group);

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

		const add = tags.querySelector('.tags-add');
		if (add) {
			tippy(add, {
				content: tl(trans.add),
			});
		}

		const all = tags.querySelector('.tags-view-all');
		if (all) {
			tippy(all, {
				content: tl(trans.view_all),
			});
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
	if (!settings.corrections) return;

	page.structure.side.appendChild(html.node`
        <section class="lotus cta colourful">
            <label class="cta-label">
                ${icon({ name: icons.lotus })}
                <strong>${tl(trans.lotus_cta[page.corrected])}</strong>
            </label>
            ${
		ff('refreshed_lotus')
			? html.node`
                <button class="see-more" onclick=${() =>
				create_correction(
					page.type,
					page.name,
					page.sister,
					page.corrected,
				)}>${tl(trans.suggest_correction)}</button>
            `
			: html.node`
                <a class="see-more" href="https://github.com/katelyynn/lotus/issues/new/choose" target="_blank">${
				tl(trans.suggest_correction)
			}</a>
            `
	}
        </section>
    `);
}

function create_listen_item(
	parent,
	{ name, listens, link, avi, count = 0, button = false, katsune = false },
	header_type,
) {
	if (!name) return;

	log(
		`creating listen item of ${name}, ${count}, ${listens}`,
		'artist',
		'info',
		{ avi: avi, link: link },
	);

	let listen_item;

	if (button) listen_item = html.node`<button />`;
	else listen_item = html.node`<a />`;

	listen_item.classList.add('btn', 'listen-item');
	listen_item.setAttribute(
		'href',
		`${root}user/${name}/library/music/${redirect()}${link}`,
	);
	listen_item.setAttribute('data-listens', listens);

	let p;

	if (listens > -1) {
		const cache = JSON.parse(
			localStorage.getItem(keys.profile_cache) || '{}',
		);
		const entry = cache[name];
		const valid = is_sponsor(name);

		// your listens
		let listen_name;

		render(
			listen_item,
			html`
				<img class="view-item-avatar" src=${avi} alt=${name} />
				<div class="listen-item-info">
					<h3 class="listen-item-name" ref=${(el) =>
						listen_name = el} />
					<p class="colourful listen-item-text icon-mask" ref=${(
						el,
					) => (p = el)}>
				        ${tl(trans.count_plays, {
					c: listens.toLocaleString(lang),
				})}
				    </p>
				</div>
			`,
		);

		if (entry.username && valid) {
			listen_name.classList.add('username-combo');
			render(
				listen_name,
				html`
					<span class="username-custom">${entry.username}</span>
					<span class="username-original">
					    <span class="at">@</span>${name}
					</span>
				`,
			);
		} else {
			render(
				listen_name,
				html`
					<span class="at">@</span>${name}
				`,
			);
		}

		let menu = tippy(listen_item, {
			theme: 'context-menu',
			content: html.node`
                <a class="dropdown-menu-clickable-item" href="${root}user/${name}" data-menu-item="view_profile">
                    ${tl(trans.profile)}
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

		register_menu(listen_item, menu);
	} else if (listens > -2) {
		const cache = JSON.parse(
			localStorage.getItem(keys.profile_cache) || '{}',
		);
		const entry = cache[name];
		const valid = is_sponsor(name);

		// loading listens
		let listen_name;

		render(
			listen_item,
			html`
				<img class="view-item-avatar" src=${avi} alt=${name} />
				<div class="listen-badge star colourful">
					<div class="bleh-icon" />
				</div>
				<div class="listen-item-info">
					<h3 class="listen-item-name" ref=${(el) =>
						listen_name = el} />
					<p class="colourful listen-item-text icon-mask" ref=${(
						el,
					) => (p = el)}>
				        ${tl(trans.count_plays, { c: ' ' })}
				    </p>
				</div>
			`,
		);

		if (entry.username && valid) {
			listen_name.classList.add('username-combo');
			render(
				listen_name,
				html`
					<span class="username-custom">${entry.username}</span>
					<span class="username-original">
					    <span class="at">@</span>${name}
					</span>
				`,
			);
		} else {
			render(
				listen_name,
				html`
					<span class="at">@</span>${name}
				`,
			);
		}

		let menu = tippy(listen_item, {
			theme: 'context-menu',
			content: html.node`
                <a class="dropdown-menu-clickable-item" href="${root}user/${name}" data-menu-item="view_profile">
                    ${tl(trans.profile)}
                </a>
                <div class="sep"></div>
                <button class="dropdown-menu-clickable-item" onclick=${() =>
				open_starred_friend_window()} data-menu-item="settings">
                    ${tl(trans.settings)}
                </button>
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

		register_menu(listen_item, menu);
	} else if (listens == -3) {
		listen_item.classList.add('listen-item-other');

		listen_item.removeAttribute('href');
		listen_item.setAttribute('onclick', `_other_listener('${link}')`);

		tippy(listen_item, {
			content: tl(trans.view_others_library),
		});
	} else {
		// other listeners by clicking this link (artist)
		render(
			listen_item,
			html`
				${avi[0]
					? html.node`<img class="view-item-avatar" src=${
						avi[0].getAttribute('src')
					} alt="">`
					: ''}
				${avi[1]
					? html.node`<img class="view-item-avatar" src=${
						avi[1].getAttribute('src')
					} alt="">`
					: ''}
				${avi[2]
					? html.node`<img class="view-item-avatar" src=${
						avi[2].getAttribute('src')
					} alt="">`
					: ''}
				<div class="listen-item-info">
				    <h3 class="listen-item-name">${tl(trans.following)}</h3>
				    <p class="colourful listen-item-text icon-mask" ref=${(
					el,
				) => (p = el)}>
				        ${tl(trans.others_count).replace('{c}', count)}
				    </p>
				</div>
			`,
		);
		listen_item.setAttribute(
			'href',
			`${window.location.pathname}/+listeners/you-know`,
		);
	}

	// colourful counts
	if (settings.colourful_counts && listens > -1 && header_type == 'artist') {
		let parsed_scrobble_as_rank = parse_scrobbles_as_rank(listens);

		listen_item.setAttribute(
			'data-bleh--scrobble-milestone',
			parsed_scrobble_as_rank.milestone,
		);
		p.style.setProperty('--hue-over', parsed_scrobble_as_rank.hue);
		p.style.setProperty('--sat-over', parsed_scrobble_as_rank.sat);
		p.style.setProperty('--lit-over', parsed_scrobble_as_rank.lit);
	}

	if (katsune) listen_item.classList.add('icon');

	parent.appendChild(listen_item);

	return listen_item;
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
		if (settings.format_guest_features) {
			const formatted = name_includes(
				track_link.textContent.trim(),
				page.sister,
			);

			track_link.classList.add('smart-title');
			render(
				track_link,
				smart_title(formatted.song_title, formatted.song_tags),
			);
		} else if (settings.corrections) {
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
		genius: {
			name: 'Genius',
			icon: '',
			host: 'genius.com',
		},
		website: {
			name: tl(trans.website),
			icon: 'link',
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
		uni: 'UnifrakturCook',
		lilita: 'Lilita One',
		single: 'Single Day',
		cherry: 'Cherry Bomb One',
		balsamiq: 'Balsamiq Sans',
		crimson: 'Crimson Text',
		rokkitt: 'Rokkitt',
		code: 'Google Sans Code',
		zpix: 'Zpix',
		mask: 'Expose',
		rakkas: 'Rakkas',
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
