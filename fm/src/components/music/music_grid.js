/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { settings } from '@/build/config';
import { page, root } from '@/build/page';
import { copy, int_from_string, lazy, romanise } from '@/build/tools';
import { lang, tl, trans } from '@/build/trans';
import { bleh_glacier_insights } from '@/pages/profile/glacier';
import { parse_scrobbles_as_rank } from '@/components/music/colourful_counts';
import {
	correct_artist,
	correct_item_by_artist,
	name_includes,
	smart_artists,
	smart_title,
} from '@/components/music/lotus';
import { html, render } from 'lighterhtml';
import { register_menu } from '@/components/menu';
import tippy from 'tippy.js';
import { expand_avatar } from '@/components/shared/avatar';
import { save_hoshino_artwork } from '@/components/music/hoshino';
import { header_colour } from '../page/colour';

export function music_grids(search = page.structure.main, use_colour = true) {
	if (!search) return;

	const insights = {
		artist: {
			display: false,
			values: [],
			labels: [],
			highest: {
				value: 0,
				label: '',
				link: '',
				img: '',
			},
		},
		album: {
			display: false,
			values: [],
			labels: [],
			highest: {
				value: 0,
				label: '',
				link: '',
				img: '',
			},
		},
		track: {
			display: false,
			values: [],
			labels: [],
			highest: {
				value: 0,
				label: '',
				link: '',
				img: '',
			},
		},
	};

	const grids = search.querySelectorAll(
		'.grid-items-item:not([data-bleh-music-grids])',
	);
	grids.forEach((grid, index) => {
		const is_loading =
			grid.querySelector('.grid-items-empty-inner') != null;
		if (is_loading) return;

		grid.style.setProperty('--delay', index * 0.04 + 's');

		grid.setAttribute('data-bleh-music-grids', 'true');

		const is_obsession = grid.classList.contains('obsessions-item');
		const is_comparison = grid.classList.contains('compare-item');

		let is_album;
		if (page.type == 'search') {
			// search, tag pages
			is_album = grid.querySelector('.stat-name') == null;
		} else {
			// profiles
			is_album = grid.querySelector('.grid-items-item-aux-block') != null;
		}

		const cover = grid.querySelector('.grid-items-cover-image');
		const image_wrap = cover.querySelector('.grid-items-cover-image-image');
		const image = image_wrap.querySelector('img');

		if (grid.classList.contains('grid-items-item--big')) {
			image.src = image.src.replace('/avatar300s/', '/500x500/');
		}

		if (
			image &&
			!image_wrap.classList.contains('grid-items-cover-default') &&
			use_colour
		) {
			grid.classList.add('colourful');

			const grid_colour = html.node`
                <div class="grid-item-colour-bg" />
            `;
			image_wrap.appendChild(grid_colour);

			image.setAttribute('crossorigin', 'anonymous');

			lazy(grid, () => {
				console.info('scrolled', grid, 'into view');

				header_colour(image, false, [grid]);
				cover.classList.add('colourful');
				grid.classList.add('grid-items-item-has-colour');
			});
		} else {
			grid.classList.add('generic-cover');
		}

		let plays_elem;
		if (page.type == 'search') {
			if (!is_album) {
				const aux_text = grid.querySelector(
					'.grid-items-item-aux-text',
				);
				const stat_name = aux_text.querySelector('.stat-name');

				aux_text.removeChild(stat_name);

				plays_elem = aux_text;
			}
		} else if (page.type == 'tag') {
			const aux_text = grid.querySelector('.grid-items-item-aux-text');
			const stat_name = aux_text.querySelector('.stat-name');
			if (!stat_name) return;

			aux_text.removeChild(stat_name);

			plays_elem = aux_text;

			if (is_album) {
				const artist = grid.querySelector('.grid-items-item-aux-block');

				aux_text.removeChild(artist);

				plays_elem = document.createElement('a');
				plays_elem.textContent = aux_text.textContent;

				aux_text.textContent = '';

				aux_text.appendChild(artist);
				aux_text.appendChild(plays_elem);
			}
		} else {
			plays_elem = grid.querySelector(
				'.grid-items-item-aux-text a:last-child',
			);
		}

		if (
			plays_elem &&
			!is_obsession &&
			!is_comparison
		) {
			const plays = int_from_string(plays_elem.textContent.trim());
			plays_elem.classList.add('grid-item-plays', 'icon-mask');
			if (is_album) {
				plays_elem.textContent = plays.toLocaleString(lang);
			} else {
				plays_elem.textContent = tl(trans.count_plays, {
					c: plays.toLocaleString(lang),
				});
			}

			if (!is_album) {
				insights.artist.display = true;
				insights.artist.values.push(plays);

				if (plays > insights.artist.highest.value) {
					insights.artist.highest.value = plays;
				}
			} else {
				insights.album.display = true;
				insights.album.values.push(plays);

				if (plays > insights.album.highest.value) {
					insights.album.highest.value = plays;
				}
			}

			if (page.type == 'search' || page.type == 'tag') {
				plays_elem.classList.add('grid-item-listeners');
			}

			if (!is_album && settings.colourful_counts && page.type == 'user') {
				if (
					!plays_elem.getAttribute('href').includes('?from=') &&
					(!plays_elem
						.getAttribute('href')
						.includes('?date_preset=') ||
						plays_elem
							.getAttribute('href')
							.endsWith('?date_preset=ALL') ||
						plays_elem
							.getAttribute('href')
							.endsWith('?date_preset=null'))
				) {
					const parsed_scrobble_as_rank = parse_scrobbles_as_rank(
						plays,
					);

					plays_elem.classList.add('colourful');

					if (parsed_scrobble_as_rank.contrast) {
						plays_elem.classList.add('plays-contrast');
					}

					plays_elem.setAttribute(
						'data-bleh--scrobble-milestone',
						parsed_scrobble_as_rank.milestone,
					);
					plays_elem.style.setProperty(
						'--hue-over',
						parsed_scrobble_as_rank.hue,
					);
					plays_elem.style.setProperty(
						'--sat-over',
						parsed_scrobble_as_rank.sat,
					);
					plays_elem.style.setProperty(
						'--lit-over',
						parsed_scrobble_as_rank.lit,
					);
				}
			}
		}

		const details = grid.querySelector('.grid-items-item-details');

		if (details) {
			const links = details.querySelectorAll('a');
			links.forEach((link) => {
				link.classList.add('grid-item-text');
			});
		}

		const name = grid.querySelector('.grid-items-item-main-text > a');
		if (!name) return;

		let artist;

		if (!is_album) {
			name.textContent = romanise(
				correct_artist(name.textContent.trim()),
			);
			insights.artist.labels.push(name.textContent);
		} else {
			artist = grid.querySelector('.grid-items-item-aux-block');
			if (!artist) {
				artist = grid.querySelector('.grid-items-item-aux-text');
			}
			if (!artist) return;

			save_hoshino_artwork(
				image.src.replace('/500x500/', '/avatar300s/'),
				name.textContent.trim(),
				artist.textContent.trim(),
			);

			if (useSettings.get('format_guest_features')) {
				const name_elem = name;
				const artist_elem = artist;

				const song_title = name_elem.getAttribute('title');

				const formatted = name_includes(
					song_title,
					artist_elem.textContent.trim(),
				);

				name_elem.classList.add('smart-title');
				render(
					name_elem,
					smart_title(formatted.song_title, formatted.song_tags),
				);

				artist_elem.replaceWith(html.node`
                    <span class="grid-items-item-aux-block grid-item-text grid-item-artist-no-link smart-artist">
                        ${
					smart_artists(formatted.song_artist, formatted.song_guests)
				}
                    </span>
                `);

				insights.album.labels.push(formatted.corrected_title);
			} else {
				artist.textContent = romanise(
					correct_artist(artist.textContent.trim()),
				);

				name.textContent = romanise(
					correct_item_by_artist(
						name.textContent.trim(),
						artist.textContent.trim(),
					),
				);
			}
		}

		name.removeAttribute('title');

		const menu = tippy(grid, {
			theme: 'context-menu',
			content: html.node`
                ${
				!is_obsession
					? html.node`
                    ${
						!is_album
							? html.node`
                    <div class="button-combo">
                        ${() => {
								return html.node`
                                <a class="dropdown-menu-clickable-item" data-type="artist" href=${
									name.getAttribute('href')
								}>
                                    ${tl(trans.artist)}
                                </a>
                            `;
							}}
                        <div class="button-combo-sep"/>
                        ${() => {
								let button = html.node`
                                <a class="dropdown-menu-clickable-item chibi" data-type="continue" href="${root}user/${page.name}/library${
									name.getAttribute('href')
								}">
                                    ${tl(trans.explore_in_library)}
                                </a>
                            `;

								tippy(button, {
									content: tl(trans.explore_in_library),
									delay: [500, 0],
									appendTo: document.body,
								});

								return button;
							}}
                    </div>
                    `
							: html.node`
                    <div class="button-combo">
                        ${() => {
								return html.node`
                                <a class="dropdown-menu-clickable-item" data-type="album" href=${
									name.getAttribute('href')
								}>
                                    ${tl(trans.album)}
                                </a>
                            `;
							}}
                        <div class="button-combo-sep"/>
                        ${() => {
								let button = html.node`
                                <a class="dropdown-menu-clickable-item chibi" data-type="continue" href="${root}user/${page.name}/library${
									name.getAttribute('href')
								}">
                                    ${tl(trans.explore_in_library)}
                                </a>
                            `;

								tippy(button, {
									content: tl(trans.explore_in_library),
									delay: [500, 0],
									appendTo: document.body,
								});

								return button;
							}}
                    </div>
                    <div class="button-combo">
                        ${() => {
								return html.node`
                                <a class="dropdown-menu-clickable-item" data-type="artist" href=${
									artist.getAttribute('href')
								}>
                                    ${tl(trans.artist)}
                                </a>
                            `;
							}}
                        <div class="button-combo-sep"/>
                        ${() => {
								let button = html.node`
                                <a class="dropdown-menu-clickable-item chibi" data-type="continue" href="${root}user/${page.name}/library${
									artist.getAttribute('href')
								}">
                                    ${tl(trans.explore_in_library)}
                                </a>
                            `;

								tippy(button, {
									content: tl(trans.explore_in_library),
									delay: [500, 0],
									appendTo: document.body,
								});

								return button;
							}}
                    </div>
                    `
					}
                    <a class="dropdown-menu-clickable-item" data-type="gallery" href="${
						name.getAttribute('href')
					}/+images">
                        ${is_album ? tl(trans.artwork) : tl(trans.photos)}
                    </a>
                    <a class="dropdown-menu-clickable-item" data-type="wiki" href="${
						name.getAttribute('href')
					}/+wiki">
                        ${is_album ? tl(trans.wiki) : tl(trans.biography)}
                    </a>
                    ${
						!is_album
							? html.node`
                    <a class="dropdown-menu-clickable-item" data-type="listeners" href="${
								name.getAttribute('href')
							}/+listeners/you-know">
                        ${tl(trans.listeners)}
                    </a>
                    `
							: ''
					}
                    <a class="dropdown-menu-clickable-item" data-type="shouts" href="${
						name.getAttribute('href')
					}/+shoutbox">
                        ${tl(trans.shouts)}
                    </a>
                    <a class="dropdown-menu-clickable-item" data-type="tags" href="${
						name.getAttribute('href')
					}/+tags">
                        ${tl(trans.tags)}
                    </a>
                    <div class="sep" />
                `
					: ''
			}
                <button class="dropdown-menu-clickable-item" data-type="expand" onclick=${() => {
				expand_avatar(
					image.src
						.replace('/avatar300s/', '/ar0/')
						.replace('/500x500/', 'ar0'),
				);
			}}>
                    ${tl(trans.expand)}
                </button>
                <button class="dropdown-menu-clickable-item" data-type="link" onclick=${() => {
				copy(name.href);
			}}>
                    ${tl(trans.copy_link)}
                </button>
            `,
			placement: 'right-start',
			trigger: 'manual',
			interactive: true,
			interactiveBorder: 10,
			offset: [0, 0],
			appendTo: document.body,

			onCreate(instance) {
				instance.popper.addEventListener('click', (event) => {
					instance.hide();
				});
			},
		});

		register_menu(grid, menu);
	});

	if (page.subpage.startsWith('library')) bleh_glacier_insights(insights);
}
