/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { html, render } from 'lighterhtml';
import { settings } from '@/build/config';
import { log } from '@/build/log.ts';
import { auth, page, root } from '@/build/page';
import {
	copy,
	return_artist_from_track,
	romanise,
	sanitise,
} from '@/build/tools';
import { bleh_glacier_insights } from '@/pages/profile/glacier.js';
import { patch_artist_ranks_in_list_view } from '@/components/music/colourful_counts';
import {
	correct_artist,
	correct_item_by_artist,
	name_includes,
	smart_artists,
	smart_title,
} from '@/components/music/lotus';
import { register_menu } from '@/components/menu';
import { tl, trans } from '@/build/trans';
import { notify } from '@/components/dialog/notify';
import { redirect } from '@/components/music/music';
import tippy from 'tippy.js';
import { hoshino } from '@/components/music/hoshino';
import { submit_scrobble } from '@/components/music/scrobble';
import { header_colour } from '../page/colour';
import { symbol } from '@/main';
import { useSettings } from '@/page.ts';
import { count_bar } from '@/components/track/bar.tsx';
import {
	context_menu_tooltip,
	hover_tooltip,
	menu_tooltip,
	Tooltip,
} from '@/components/shared/tooltips.tsx';
import { Button, ButtonCombo } from '@/components/button/button.tsx';
import { Icon, icons } from '@/components/shared/icon.tsx';
import { MenuContents } from '@/components/menu/menu.tsx';
import { TrackMenuPreview } from '@/components/track/preview.tsx';
import { GenericUsername } from '@/components/user/name.tsx';
import { Token } from '@/components/form/token.tsx';

export function patch_titles(search = page.structure.main) {
	if (page.subpage == 'tags_overview') return;

	if (!search) {
		log(
			'tracks could not be searched as search was undefined',
			'tracks',
			'log',
			{ search },
		);
		return;
	}

	const tracklists = search.querySelectorAll(
		'.chartlist:not(.chartlist__placeholder)',
	);

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

	const track_layout = useSettings.get('track_layout');
	const album_name_location = useSettings.get('track_album_name_location');
	const season = page.state.seasons.current?.id || 'none';

	tracklists.forEach((tracklist) => {
		if (!tracklist) return;

		log('found, checking', 'tracks', 'log', { tracklist, search });

		// used to ensure this hasnt been run thru
		if (
			tracklist.querySelector(
				'tbody > .chartlist-row:first-child > .kate-placeholder',
			)
		) {
			return;
		}

		log('new!', 'tracks', 'info', { tracklist });

		const wide = tracklist.classList.contains(
			'chartlist--wide-artist-column',
		);

		const tracks = tracklist.querySelectorAll(
			':scope > tbody > :is(.chartlist-row:not(.chartlist__placeholder-row), .chartlist-row--interlist-ad)',
		);

		tracks.forEach((track, index) => {
			smart_track(track, index);
		});

		function smart_track(track, index) {
			if (!track) return;

			if (track.getAttribute('data-track-type')) return;

			// ads slowly move up the tree until eventually causing a crash
			if (track.classList[0] == 'chartlist-row--interlist-ad') {
				track.parentElement.removeChild(track);
				return;
			}

			track.style.setProperty('--delay', index * 0.04 + 's');
			track.setAttribute('data-album-name-location', album_name_location);

			if (track[symbol]) {
				log('returning as track has patched data', 'tracks');
				return;
			}
			track[symbol] = true;

			const track_title = track.querySelector(
				'.chartlist-name a:not(.offset-section-anchor)',
			);
			if (!track_title) return;

			if (track_title.hasAttribute('title')) {
				track_title.setAttribute(
					'data-name',
					track_title.getAttribute('title'),
				);
				track.setAttribute(
					'data-name',
					track_title.getAttribute('title'),
				);
				track_title.removeAttribute('title');
			}

			let track_info = track.querySelector(':scope > .track-info');
			if (!track_info) {
				track_info = (
					<div
						class='track-info'
						data-has-bar={String(
							tracklist.classList.contains('chartlist--with-bar'),
						)}
					>
						{track_title.parentElement}
					</div>
				);
				track.appendChild(track_info);
			}
			track_info.setAttribute('data-track-layout', track_layout);
			track_info.setAttribute(
				'data-album-name-location',
				album_name_location,
			);
			track.setAttribute(
				'data-has-bar',
				tracklist.classList.contains('chartlist--with-bar'),
			);

			// for albums and tracks 'avatar' is replaced with 'cover-art'
			// we can use this to detect if the item is either a user or an artist
			let is_user = track.querySelector('.chartlist-image .avatar');
			let is_artist = false;

			// now lets check if we have a user or an artist
			if (is_user) {
				const link = track_title.getAttribute('href');
				if (link.startsWith(`${root}music/`)) {
					// this is an artist
					is_user = false;
					is_artist = true;
				}
			}

			const track_type = track.querySelector(':scope > .chartlist-type');
			if (
				track_type &&
				track_type.classList[1] == 'chartlist-type--artist'
			) {
				is_user = false;
				is_artist = true;
			}

			log(
				`is user: ${is_user}, is artist: ${is_artist}`,
				'tracks',
				'log',
			);

			if (is_user) {
				track.setAttribute('data-track-type', 'user');

				if (settings.colourful_counts) {
					patch_artist_ranks_in_list_view(track);
				}

				track_title.replaceChildren(
					<GenericUsername>
						{track_title.textContent}
					</GenericUsername>,
				);

				log('finished user stuff, returning', 'tracks', 'log');
				return;
			}

			if (is_artist) {
				track.classList.remove('chartlist-row--with-artist');
				track.setAttribute('data-track-type', 'artist');

				if (useSettings.get('corrections')) {
					track_title.textContent = correct_artist(
						track_title.getAttribute('data-name'),
					);
				}

				const bar = track.querySelector('.chartlist-count-bar-slug');
				if (bar) {
					if (settings.colourful_counts) {
						patch_artist_ranks_in_list_view(track);
					}

					insights.artist.display = true;

					const value = parseInt(bar.getAttribute('data-stat-value'));
					insights.artist.values.push(value);

					if (value > insights.artist.highest.value) {
						insights.artist.highest.value = value;
					}

					log(
						`pushed insight artist label of ${track_title.textContent}`,
						'glacier library',
						'log',
					);
					insights.artist.labels.push(track_title.textContent);

					log('finished artist stuff, returning', 'tracks', 'log');
				}

				return;
			}

			const is_album = track.hasAttribute('data-album-row');
			if (is_album) track.classList.add('bleh--is-album');

			const track_artist = return_artist_from_track(
				track_title.getAttribute('href'),
				is_album,
			);
			log(
				`returned ${track_artist} from url ${
					track_title.getAttribute('href')
				}`,
				'track',
			);
			// when focused on a track in a library, an artist field is redundant
			if (!wide) track.classList.add('chartlist-row--with-artist');

			const bar = track.querySelector('.chartlist-count-bar-slug');
			if (bar) {
				const value = parseInt(bar.getAttribute('data-stat-value'));

				if (is_album) {
					insights.album.display = true;
					insights.album.values.push(value);

					if (value > insights.album.highest.value) {
						insights.album.highest.value = value;
					}
				} else {
					insights.track.display = true;
					insights.track.values.push(value);

					if (value > insights.track.highest.value) {
						insights.track.highest.value = value;
					}
				}
			}

			const is_active = track.classList.contains(
				'chartlist-row--now-scrobbling',
			);
			const has_bar = track.querySelector(':scope > .chartlist-bar');

			if (has_bar) {
				const bar = has_bar.querySelector(
					':scope > .chartlist-count-bar',
				);

				count_bar(bar);
			}

			// menu
			const track_legacy_menu = track.querySelector(
				'.chartlist-more-menu',
			);

			const track_timestamp = track.querySelector(
				'.chartlist-timestamp span',
			);
			let track_timestamp_contents;
			if (track_timestamp && !is_active) {
				track_timestamp_contents = track_timestamp.getAttribute(
					'title',
				);

				if (!track_timestamp_contents) {
					track_timestamp_contents = track_timestamp.getAttribute(
						'data-title',
					);
				}

				if (track_timestamp_contents) {
					track_timestamp.removeAttribute('title');
					track_timestamp.setAttribute(
						'data-title',
						track_timestamp_contents,
					);

					hover_tooltip(
						track_timestamp,
						<Tooltip>{track_timestamp_contents}</Tooltip>,
					);
				}
			}

			const album = track.querySelector('.chartlist-album a');
			if (!is_album && album) {
				album.textContent = correct_item_by_artist(
					album.textContent,
					track_artist,
				);
			}

			const album_link = track.querySelector('.chartlist-image a');

			const show_album_text =
				(is_active || settings.expand_tracks == 'always') &&
				settings.expand_tracks != 'never' &&
				useSettings.get('track_layout') == 'column';
			track.setAttribute('data-show-album-text', show_album_text);

			const image_wrap = track.querySelector('.chartlist-image');
			let link;
			let image;
			let alt;
			let album_artist;
			if (image_wrap) {
				link = image_wrap.querySelector('.cover-art');
				image = link.querySelector('img');

				if (link.href) {
					album_artist = return_artist_from_track(link.href, true);
				}

				alt = romanise(
					correct_item_by_artist(
						image.getAttribute('alt'),
						track_artist,
					),
				);

				hover_tooltip(
					image_wrap,
					<Tooltip>{alt}</Tooltip>,
				);

				if (!is_album && has_bar) {
					hoshino(
						image,
						track_title.getAttribute('data-name'),
						track_artist,
						link,
					);
				}
			}

			let song_artist_element = track.querySelector('.chartlist-artist');
			if (song_artist_element) {
				track_info.appendChild(song_artist_element);
			}

			if (useSettings.get('format_guest_features')) {
				const formatted = name_includes(
					track_title.getAttribute('data-name'),
					track_artist,
					track_title.getAttribute('data-inherit-artists'),
				);
				console.log('formatted', formatted);

				track_title.setAttribute(
					'data-name',
					formatted.corrected_title,
				);

				// parse tags into text
				render(
					track_title,
					smart_title(formatted.song_title, formatted.song_tags),
				);

				if (!song_artist_element && !is_user) {
					song_artist_element = document.createElement('td');
					song_artist_element.classList.add('chartlist-artist');
					track_info.appendChild(song_artist_element);
				}

				if (
					song_artist_element.textContent
							.replaceAll('+', ' ')
							.trim() === track_artist ||
					song_artist_element.textContent.trim() === ''
				) {
					log(
						'artist either matches or is blank, replacing',
						'tracks',
						'log',
					);
					// replaces with corrected artist if applicable
					render(
						song_artist_element,
						smart_artists(
							formatted.song_artist,
							formatted.song_guests,
						),
					);
				}

				if (track.getAttribute('data-disambig') == 'explicit') {
					song_artist_element.insertBefore(
						html.node`
                        <span class="track-explicit icon">${
							tl(trans.explicit)
						}</span>
                    `,
						song_artist_element.firstChild,
					);
				}

				if (track_legacy_menu) {
					track.preview = (
						<TrackMenuPreview
							image={image?.src}
							name={formatted.song_title}
							artist={song_artist_element.querySelector('a')
								?.textContent}
							tags={formatted.song_tags}
							album={(image && album_link)
								? correct_item_by_artist(
									image.getAttribute('alt'),
									track_artist,
								)
								: album
								? album.textContent
								: undefined}
							timestamp={track_timestamp_contents}
						/>
					);
				}
			} else if (useSettings.get('corrections')) {
				const song_artist_element = track.querySelector(
					'.chartlist-artist a',
				);
				if (song_artist_element) {
					const corrected_title = romanise(
						correct_item_by_artist(
							track_title.textContent,
							song_artist_element.textContent,
						),
					);
					track_title.textContent = corrected_title;
					track_title.setAttribute('data-name', corrected_title);

					const corrected_artist = romanise(
						correct_artist(song_artist_element.textContent),
					);
					song_artist_element.textContent = corrected_artist;
					song_artist_element.setAttribute('title', corrected_artist);
				} else {
					const corrected_title = correct_item_by_artist(
						track_title.textContent,
						track_artist,
					);
					track_title.textContent = corrected_title;
					track_title.setAttribute('data-name', corrected_title);
				}
			}

			// due to the library refreshing and destroying the html references
			// we need to remove the previous more button
			const previous = track.querySelectorAll(
				':scope > .more-button-wrapper',
			);
			previous.forEach((elem) => {
				elem.remove();
			});

			if (track_legacy_menu) {
				let menu;

				const user = ['user', 'overview'].includes(page.type)
					? page.name
					: auth.name;

				// then we need to decide for ourselves whether u can delete or obsess
				// since we cant rely on the elements existing anymore
				const is_own_profile = user == auth.name;
				const can_edit = is_own_profile && !is_active &&
					(!is_album ? !has_bar : true) && auth.pro &&
					['user', 'overview'].includes(page.type);
				const can_delete = is_own_profile && !is_active && !has_bar &&
					!is_album && ['user', 'overview'].includes(page.type);

				const can_copy_scrobble = !is_album && !has_bar && !is_active &&
					['user', 'overview'].includes(page.type);

				const timestamp =
					parseInt(track.getAttribute('data-timestamp')) ||
					Math.floor(
						new Date(
							track_timestamp_contents?.replace(
								/^[A-Za-z]+\s+/,
								'',
							).replace(',', '').trim(),
						).getTime() / 1000,
					);

				const more_button = (
					<Button
						chibi
						className='track-more-button'
						tooltip={tl(trans.more)}
					>
						<Icon name={icons.more} />
						{tl(trans.more)}
					</Button>
				);

				/*const more_button = html.node`
                    <button class="btn track-more-button icon chibi" data-type="more" onclick=${() => {
					log('requested track in-built', 'menu', 'info', {
						menu,
					});
					menu.setProps({
						placement: 'bottom',
						offset: [],
						getReferenceClientRect: null,
					});

					if (menu.state.isShown) {
						menu.hide();
					} else {
						menu.show();
					}
				}}>
                        ${tl(trans.more)}
                    </button>
                `;

				hover_tooltip(
					more_button,
					<Tooltip>{tl(trans.more)}</Tooltip>,
					);*/

				track.appendChild(
					<td class='more-button-wrapper'>
						{more_button}
					</td>,
				);

				setTimeout(() => {
					const edit_button = track_legacy_menu.querySelector(
						'[data-analytics-action="EditScrobbleOpen"]:not([href$="login?next=/pro"])',
					);
					const bulk_edit_button = track_legacy_menu.querySelector(
						'[data-analytics-action="BulkEditScrobblesOpen"]',
					);
					const delete_button = track_legacy_menu.querySelector(
						'.more-item--delete',
					);

					if (edit_button) {
						log('has edit button', 'track', 'info', {
							edit_button,
						});
						const form = edit_button.parentElement;

						page.token = form.querySelector(
							'[name="csrfmiddlewaretoken"]',
						)?.value;
						track.setAttribute(
							'data-action',
							form.getAttribute('action'),
						);

						if (!is_album) {
							const album_name = form.querySelector(
								'[name="album_name"]',
							);
							const album_artist_name = form.querySelector(
								'[name="album_artist_name"]',
							);

							track.setAttribute(
								'data-artist-name',
								correct_artist(
									form.querySelector('[name="artist_name"]')
										?.value,
								),
							);
							track.setAttribute(
								'data-track-name',
								correct_item_by_artist(
									form.querySelector('[name="track_name"]')
										?.value,
									form.querySelector('[name="artist_name"]')
										?.value,
								),
							);
							if (album_name) {
								track.setAttribute(
									'data-album-name',
									correct_item_by_artist(
										album_name?.value,
										form.querySelector(
											'[name="artist_name"]',
										)?.value,
									),
								);
							}
							if (album_artist_name) {
								track.setAttribute(
									'data-album-artist-name',
									correct_artist(album_artist_name?.value),
								);
							}
							track.setAttribute(
								'data-timestamp',
								form.querySelector('[name="timestamp"]')?.value,
							);
						} else {
							track.setAttribute(
								'data-album-name',
								correct_item_by_artist(
									form.querySelector('[name="album_name"]')
										?.value,
									form.querySelector(
										'[name="album_artist_name"]',
									)?.value,
								),
							);
							track.setAttribute(
								'data-album-artist-name',
								correct_artist(
									form.querySelector(
										'[name="album_artist_name"]',
									)?.value,
								),
							);
							track.setAttribute(
								'data-album-name-original',
								correct_item_by_artist(
									form.querySelector(
										'[name="album_name_original"]',
									)?.value,
									form.querySelector(
										'[name="album_artist_name_original"]',
									)?.value,
								),
							);
							track.setAttribute(
								'data-album-artist-name-original',
								correct_artist(
									form.querySelector(
										'[name="album_artist_name_original"]',
									)?.value,
								),
							);
							track.setAttribute(
								'data-album-image',
								form.querySelector('[name="album_image"]')
									?.value,
							);
							track.setAttribute(
								'data-count',
								form.querySelector('[name="count"]')?.value,
							);
						}
					} else if (delete_button) {
						log('has delete button', 'track', 'info', {
							delete_button,
						});
						let form = delete_button.parentElement;

						page.token = form.querySelector(
							'[name="csrfmiddlewaretoken"]',
						)?.value;
						track.setAttribute(
							'data-artist-name',
							correct_artist(
								form.querySelector('[name="artist_name"]')
									?.value,
							),
						);
						track.setAttribute(
							'data-track-name',
							correct_item_by_artist(
								form.querySelector('[name="track_name"]')
									?.value,
								form.querySelector('[name="artist_name"]')
									?.value,
							),
						);
						track.setAttribute(
							'data-timestamp',
							form.querySelector('[name="timestamp"]')?.value,
						);
					}

					console.info('more button', bulk_edit_button);

					const album_name = sanitise(
						image
							? correct_item_by_artist(
								image.getAttribute('alt'),
								track_artist,
							)
							: album
							? album.textContent
							: '',
					);

					const menu_contents = (
						<MenuContents>
							{track.preview}
							{can_edit && (
								<ButtonCombo>
									{is_album
										? (
											<form
												style={{ margin: '0' }}
												method='post'
												action={track.getAttribute(
													'data-action',
												)}
												data-edit-scrobble
											>
												<Token value={page.token} />
												<input
													type='hidden'
													name='album_name'
													value={track.getAttribute(
														'data-album-name',
													)}
												/>
												<input
													type='hidden'
													name='album_artist_name'
													value={track.getAttribute(
														'data-album-artist-name',
													)}
												/>
												<input
													type='hidden'
													name='album_image'
													value={track.getAttribute(
														'data-album-image',
													)}
												/>
												<input
													type='hidden'
													name='album_name_original'
													value={track.getAttribute(
														'data-album-name-original',
													)}
												/>
												<input
													type='hidden'
													name='album_artist_name_original'
													value={track.getAttribute(
														'data-artist-name-original',
													)}
												/>
												<input
													type='hidden'
													name='count'
													value={track.getAttribute(
														'data-count',
													)}
												/>
												<Button
													type='submit'
													menu
													onClick={close_menus}
												>
													<Icon name={icons.edit} />
													{tl(trans.edit)}
												</Button>
											</form>
										)
										: (
											<form
												style={{ margin: '0' }}
												method='post'
												action={track.getAttribute(
													'data-action',
												)}
												data-edit-scrobble
											>
												<Token value={page.token} />
												<input
													type='hidden'
													name='artist_name'
													value={track.getAttribute(
														'data-artist-name',
													)}
												/>
												<input
													type='hidden'
													name='track_name'
													value={track.getAttribute(
														'data-track-name',
													)}
												/>
												<input
													type='hidden'
													name='album_name'
													value={track.getAttribute(
														'data-album-name',
													)}
												/>
												<input
													type='hidden'
													name='album_artist_name'
													value={track.getAttribute(
														'data-artist-name',
													)}
												/>
												<input
													type='hidden'
													name='timestamp'
													value={track.getAttribute(
														'data-timestamp',
													)}
												/>
												<Button
													type='submit'
													menu
													onClick={close_menus}
												>
													<Icon name={icons.edit} />
													{tl(trans.edit)}
												</Button>
											</form>
										)}
								</ButtonCombo>
							)}
						</MenuContents>
					);

					const menu = menu_tooltip(more_button, menu_contents);
					const ctx_menu = context_menu_tooltip(track, menu_contents);

					function close_menus() {
						if (menu.is_mounted) menu.hide();
						if (ctx_menu.is_mounted) ctx_menu.hide();
					}

					/*menu = tippy(more_button, {
						theme: 'context-menu',
						content: html.node`
                            ${track.preview}
                            ${
							can_edit
								? html.node`
                                <div class="button-combo">
                                    ${() => {
									if (is_album) {
										return html.node`
                                                <form style="margin: 0" method="POST" action=${
											track.getAttribute('data-action')
										} data-edit-scrobble="">
                                                    <input type="hidden" name="csrfmiddlewaretoken" value=${page.token}>
                                                    <input type="hidden" name="album_name" value=${
											track.getAttribute(
												'data-album-name',
											)
										}>
                                                    <input type="hidden" name="album_artist_name" value=${
											track.getAttribute(
												'data-album-artist-name',
											)
										}>
                                                    <input type="hidden" name="album_image" value=${
											track.getAttribute(
												'data-album-image',
											)
										}>
                                                    <input type="hidden" name="album_name_original" value=${
											track.getAttribute(
												'data-album-name-original',
											)
										}>
                                                    <input type="hidden" name="album_artist_name_original" value=${
											track.getAttribute(
												'data-album-artist-name-original',
											)
										}>
                                                    <input type="hidden" name="count" value=${
											track.getAttribute('data-count')
										}>
                                                    <button class="dropdown-menu-clickable-item" data-type="edit">
                                                        ${tl(trans.edit)}
                                                    </button>
                                                </form>
                                            `;
									}

									return html.node`
                                            <form style="margin: 0" method="POST" action=${
										track.getAttribute('data-action')
									} data-edit-scrobble="">
                                                <input type="hidden" name="csrfmiddlewaretoken" value=${page.token}>
                                                <input type="hidden" name="artist_name" value=${
										track.getAttribute('data-artist-name')
									}>
                                                <input type="hidden" name="track_name" value=${
										track.getAttribute('data-track-name')
									}>
                                                <input type="hidden" name="album_name" value=${
										track.getAttribute('data-album-name')
									}>
                                                <input type="hidden" name="album_artist_name" value=${
										track.getAttribute(
											'data-album-artist-name',
										)
									}>
                                                <input type="hidden" name="timestamp" value=${
										track.getAttribute('data-timestamp')
									}>
                                                <button class="dropdown-menu-clickable-item" data-type="edit">
                                                    ${tl(trans.edit)}
                                                </button>
                                            </form>
                                        `;
								}}
                                    ${
									bulk_edit_button
										? html.node`
                                        <div class="button-combo-sep" />
                                        ${() => {
											let button = track_legacy_menu
												.querySelector(
													'[data-analytics-action="BulkEditScrobblesOpen"]',
												).cloneNode();
											button.classList =
												'dropdown-menu-clickable-item chibi';
											button.textContent = tl(
												trans.bulk_edit,
											);
											button.setAttribute(
												'data-type',
												'bulk-edit',
											);

											tippy(button, {
												content: tl(trans.bulk_edit),
											});

											return button;
										}}
                                    `
										: ''
								}
                                </div>
                                ${
									can_copy_scrobble
										? html.node`
                                    <button class="dropdown-menu-clickable-item" data-type="copy_scrobble" onclick=${() => {
											submit_scrobble({
												pre_track: track_title
													.getAttribute('data-name'),
												pre_artist: track_artist,
												pre_album: alt,
												pre_album_artist: album_artist,
												pre_timestamp: timestamp,
											});
										}}>
                                        ${tl(trans.copy)}
                                    </button>
                                `
										: ''
								}
                                <div class="sep" />
                            `
								: can_copy_scrobble
								? html.node`
                                <button class="dropdown-menu-clickable-item" data-type="copy_scrobble" onclick=${() => {
									submit_scrobble({
										pre_track: track_title.getAttribute(
											'data-name',
										),
										pre_artist: track_artist,
										pre_album: alt,
										pre_album_artist: album_artist,
										pre_timestamp: timestamp,
									});
								}}>
                                    ${tl(trans.copy)}
                                </button>
                                <div class="sep" />
                            `
								: bulk_edit_button
								? html.node`
                                ${() => {
									const button = track_legacy_menu
										.querySelector(
											'[data-analytics-action="BulkEditScrobblesOpen"]',
										);
									button.textContent = tl(
										trans.bulk_edit,
									);
									button.setAttribute(
										'data-type',
										'bulk-edit',
									);

									return button;
								}}
                                <div class="sep" />
                            `
								: ''
						}
                            ${() => {
							const container = track.querySelector(
								'.chartlist-play',
							);
							if (!container) return;

							const button = container.querySelector(
								'.chartlist-play-button',
							);
							if (!button) return;

							button.classList.add(
								'dropdown-menu-clickable-item',
							);
							button.classList.remove('chartlist-play-button');
							button.textContent = tl(trans.play);
							button.setAttribute('data-type', 'play');

							track.removeChild(container);

							return button;
						}}
                            ${
							!is_album
								? html.node`
                            <div class="button-combo">
                                ${() => {
									return html.node`
                                        <a class="dropdown-menu-clickable-item" data-type="track" href=${
										track_title.getAttribute('href')
									}>
                                            ${tl(trans.track)}
                                        </a>
                                    `;
								}}
                                <div class="button-combo-sep"/>
                                ${() => {
									const button = html.node`
                                        <a class="dropdown-menu-clickable-item chibi" data-type="continue" href="${root}user/${user}/library${
										track_title.getAttribute('href')
									}">
                                            ${tl(trans.explore_in_library)}
                                        </a>
                                    `;

									tippy(button, {
										content: tl(trans.explore_in_library),
										delay: [500, 0],
									});

									return button;
								}}
                            </div>
                            `
								: ''
						}
                            ${
							album_name && album_link
								? html.node`
                            <div class="button-combo">
                                ${() => {
									return html.node`
                                        <a class="dropdown-menu-clickable-item" data-type="album" href=${
										album_link.getAttribute('href')
									}>
                                            ${tl(trans.album)}
                                        </a>
                                    `;
								}}
                                <div class="button-combo-sep"/>
                                ${() => {
									let button = html.node`
                                        <a class="dropdown-menu-clickable-item chibi" data-type="continue" href="${root}user/${user}/library${
										album_link.getAttribute('href')
									}">
                                            ${tl(trans.explore_in_library)}
                                        </a>
                                    `;

									tippy(button, {
										content: tl(trans.explore_in_library),
										delay: [500, 0],
									});

									return button;
								}}
                            </div>
                            `
								: is_album
								? html.node`
                            <div class="button-combo">
                                ${() => {
									return html.node`
                                        <a class="dropdown-menu-clickable-item" data-type="album" href=${
										track_title.getAttribute('href')
									}>
                                            ${tl(trans.album)}
                                        </a>
                                    `;
								}}
                                <div class="button-combo-sep"/>
                                ${() => {
									const button = html.node`
                                        <a class="dropdown-menu-clickable-item chibi" data-type="continue" href="${root}user/${user}/library${
										track_title.getAttribute('href')
									})}">
                                            ${tl(trans.explore_in_library)}
                                        </a>
                                    `;

									tippy(button, {
										content: tl(trans.explore_in_library),
										delay: [500, 0],
									});

									return button;
								}}
                            </div>
                            `
								: ''
						}
                            <div class="button-combo">
                                ${() => {
							return html.node`
                                        <a class="dropdown-menu-clickable-item" data-type="artist" href="${root}music/${redirect()}${
								sanitise(track_artist)
							}">
                                            ${tl(trans.artist)}
                                        </a>
                                    `;
						}}
                                <div class="button-combo-sep"/>
                                ${() => {
							const button = html.node`
                                        <a class="dropdown-menu-clickable-item chibi" data-type="continue" href="${root}user/${user}/library/music/${redirect()}${
								sanitise(track_artist)
							}">
                                            ${tl(trans.explore_in_library)}
                                        </a>
                                    `;

							tippy(button, {
								content: tl(trans.explore_in_library),
								delay: [500, 0],
							});

							return button;
						}}
                            </div>
                            ${() => {
							if (!is_own_profile || is_album) return;

							let name = track.getAttribute('data-track-name');
							let artist = track.getAttribute('data-artist-name');

							if (!name) {
								// now playing
								name = track_title.getAttribute('data-name');
								artist = track_artist;
							}

							return html.node`
                                    <form style="margin: 0" method="POST" action="${root}user/${auth.name}/obsessions" data-submit-to-modal="">
                                        <input type="hidden" name="csrfmiddlewaretoken" value=${page.token}>
                                        <input type="hidden" name="name" value=${name}>
                                        <input type="hidden" name="artist_name" value=${artist}>
                                        <button class="dropdown-menu-clickable-item" data-type="obsession">
                                            ${tl(trans.obsess)}
                                        </button>
                                    </form>
                                `;
						}}
                            <button class="dropdown-menu-clickable-item" data-type="link" onclick=${() => {
							copy(track_title.href);
						}}>
                                ${tl(trans.copy_link)}
                            </button>
                            ${() => {
							if (!is_own_profile || !can_delete) return;

							const button = html.node`
                                    <button class="dropdown-menu-clickable-item more-item--delete colourful" data-type="delete">
                                        ${tl(trans.delete)}
                                    </button>
                                `;

							let form;

							return html.node`
                                    <div class="sep" />
                                    <form ref=${(
								el,
							) => (form =
								el)} style="margin: 0" method="POST" action="${root}user/${auth.name}/library/delete" onsubmit=${async (
								e,
							) => {
								e.preventDefault();

								const url =
									`${root}user/${auth.name}/library/delete`;
								const form_data = new FormData(form);

								console.info(form_data);

								try {
									track.setAttribute(
										'data-ajax-form-state',
										'deleted',
									);

									await fetch(url, {
										method: 'POST',
										body: form_data,
									}).then((res) => {
										if (!res.ok) {
											log(
												'failed to delete',
												'form',
												'error',
												{ res: res },
											);
											track.removeAttribute(
												'data-ajax-form-state',
											);
											return;
										}

										log(
											'received response',
											'form',
											'info',
											{ res: res },
										);

										notify({
											id: 'delete',
											title: tl(trans.deleted),
											body: track_title.getAttribute(
												'data-name',
											),
											icon: 'icon-16-trash',
											type: 'error',
										});
									});
								} catch (e) {
									console.error(e);
									track.removeAttribute(
										'data-ajax-form-state',
									);
								}
							}}>
                                        <input type="hidden" name="csrfmiddlewaretoken" value=${page.token}>
                                        <input type="hidden" name="artist_name" value=${
								track.getAttribute('data-artist-name')
							}>
                                        <input type="hidden" name="track_name" value=${
								track.getAttribute('data-track-name')
							}>
                                        <input type="hidden" name="timestamp" value=${
								track.getAttribute('data-timestamp')
							}>
                                        ${button}
                                    </form>
                                `;
						}}
                        `,
						placement: 'right-start',
						trigger: 'manual',
						interactive: true,
						interactiveBorder: 10,
						offset: [0, 0],
						hideOnClick: false,
						appendTo: document.body,

						onCreate(instance) {
							instance.popper.addEventListener('click', () => {
								instance.hide();
							});
						},

						onClickOutside(instance) {
							instance.hide();
						},
					});

					register_menu(track, menu);*/
				}, 100);
			}

			if (is_album) {
				log(
					`pushed insight album label of ${
						track_title.getAttribute('data-name')
					}`,
					'glacier library',
					'log',
				);
				insights.album.labels.push(
					track_title.getAttribute('data-name'),
				);
			} else {
				log(
					`pushed insight track label of ${
						track_title.getAttribute('data-name')
					}`,
					'glacier library',
					'log',
				);
				insights.track.labels.push(
					track_title.getAttribute('data-name'),
				);
			}

			const loved = track.querySelector('.chartlist-loved');
			if (loved) {
				loved.classList.add('colourful');
				loved.setAttribute('data-season', season);

				const love = loved.querySelector('.chartlist-love-button');

				love.classList.add('btn', 'icon-mask');

				hover_tooltip(
					love,
					<Tooltip>{tl(trans.love_track)}</Tooltip>,
				);
			}

			const album_text = track.querySelector(
				'.chartlist-album.custom-album-text',
			);

			if (image_wrap) {
				if (!is_album && show_album_text && !has_bar && !album_text) {
					track_info.appendChild(
						<td class={['chartlist-album', 'custom-album-text']}>
							<a href={link.getAttribute('href')}>{alt}</a>
						</td>,
					);
				}

				if (
					!settings.colourful_tracks &&
					!settings.colourful_tracks_all
				) {
					return;
				}

				if (!settings.colourful_tracks_all && !is_active) return;

				image.setAttribute('crossorigin', 'anonymous');
				try {
					image.onload = async () => {
						const { hue, sat, lit } = await header_colour(image);

						const to_colour = track.querySelectorAll(
							'.chartlist-count-bar, .chartlist-loved',
						);

						track.classList.add('colourful');

						if (is_active) {
							track.style.setProperty('--hue-over', hue);
							track.style.setProperty('--sat-over', sat);
							track.style.setProperty('--lit-over', lit);
						} else {to_colour.forEach((elem) => {
								elem.classList.add('colourful');
								elem.style.setProperty('--hue-over', hue);
								elem.style.setProperty('--sat-over', sat);
								elem.style.setProperty('--lit-over', lit);
							});}
					};
				} catch (e) {}
			}
		}
	});

	if (page.subpage.startsWith('library')) bleh_glacier_insights(insights);
}

interface TrackStarProps {
	active?: boolean;
}

export function TrackStar({
	active,
}: TrackStarProps) {
	const elem = (
		<div class={['track-star', active && 'track-star-active']}>
			<Icon name={active ? icons.star_fill : icons.star} />
			{active && tl(trans.track_in_top_listeners)}
		</div>
	);

	if (active) {
		hover_tooltip(
			elem,
			<Tooltip>{tl(trans.track_in_top_listeners)}</Tooltip>,
		);
	}

	return elem;
}
