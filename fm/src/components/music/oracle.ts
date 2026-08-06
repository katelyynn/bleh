/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { html, render } from 'lighterhtml';
import { log } from '@/build/log';
import {
	auth,
	oracle_albums,
	oracle_artists,
	oracle_tracks,
	page,
	root,
} from '@/build/page';
import {
	clean_number,
	pad2,
	parse_object,
	romanise,
	sanitise,
	sanitise_text,
	set_storage,
} from '@/build/tools';
import { ff } from '@/components/settings/sku';
import {
	correct_artist,
	correct_item_by_artist,
	name_includes,
	smart_artists,
	smart_title,
} from '@/components/music/lotus';
import { lang, tl, trans } from '@/build/trans';
import { clean_title, fix_title } from '@/build/music';
import { version } from '../../main';
import { settings } from '@/build/config';
import { dialog, dialog_rm } from '@/components/dialog/dialog';
import tippy from 'tippy.js';
import {
	load_hoshino_artwork,
	save_hoshino_artwork,
} from '@/components/music/hoshino';
import { create_avatar } from '@/pages/track';
import { DateTime } from 'luxon';
import { select } from '@/components/settings/select';
import { save_setting, setting } from '@/components/settings/settings';
import { input } from '@/components/settings/input';
import { icon, icons } from '../shared/icon';
import { redirect } from './music';
import { flag, flag_candidates } from '../shared/flag';
import { age } from '../shared/age';
import { notify } from '../dialog/notify';
import { status } from '../dialog/status';

export function oracle_process() {
	log('beginning', 'oracle');

	page.state.oracle_debug = {};

	if (
		!page.state.oracle_temp || !page.state.oracle_temp.id ||
		!page.state.oracle_temp.page
	) {
		page.state.oracle_temp = {};
	} else {
		if (page.type == 'album' || page.type == 'track') {
			if (
				page.name != page.state.oracle_temp.page.name ||
				page.sister != page.state.oracle_temp.page.sister ||
				page.type != page.state.oracle_temp.page.type
			) {
				page.state.oracle_temp = {};
			}
		} else if (page.type == 'artist') {
			if (
				page.name != page.state.oracle_temp.page.name ||
				page.type != page.state.oracle_temp.page.type
			) {
				page.state.oracle_temp = {};
			}
		}
	}

	if (ff('oracle_album_reordering') && page.type == 'track') {
	}

	//if (!ff('oracle_connect') || page.type == 'artist' || (!['overview', 'albums'].includes(page.subpage) && page.type == 'album')) return;
	if (!ff('oracle_connect')) return;

	let tries = 3;
	const item = page.name.toLowerCase();
	const artist = page.sister.toLowerCase();
	let artist_data;

	let artist_template = `artist:"${page.sister}"`;

	const info_panel = page.structure.main.firstElementChild;
	const meta_and_wiki = info_panel!.querySelector('.metadata-and-wiki-row');
	let metadata = meta_and_wiki?.querySelector('.metadata-column');

	const mb_delay = 1600;

	const split = window.location.pathname.split('/');

	let oracle_cache = JSON.parse(localStorage.getItem('bleh_oracle_cache')) ||
		{};

	const now = Date.now();

	for (const artist in oracle_cache) {
		for (const item in oracle_cache[artist]) {
			const entry = oracle_cache[artist][item];

			if (!entry.track?.expire || now > entry.track.expire) {
				log('track cache expired', 'oracle', 'info', {
					artist,
					item,
					entry,
					expire: entry.track?.expire,
					now,
				});
				delete oracle_cache[artist][item];
			}
		}

		if (Object.keys(oracle_cache[artist]).length == 0) {
			delete oracle_cache[artist];
			log('deleted artist as empty', 'oracle', 'info', { artist });
		}
	}

	set_storage('bleh_oracle_cache', JSON.stringify(oracle_cache));

	log('cleaned cache', 'oracle', 'info', { oracle_cache });

	if (!oracle_cache[artist]) oracle_cache[artist] = {};

	let cache = oracle_cache[artist][item] || {
		album: {},
		track: {},
	};

	log('loaded cache', 'oracle', 'info', { oracle_cache, cache });

	function oracle_save_cache(type: string, bump = true) {
		if (bump) {
			const day = 24 * 60 * 60 * 1000;

			cache[type].expire = Date.now() + day * 2;
			cache[type].date = Date.now();
		}

		oracle_cache[artist][item] = {
			...oracle_cache[artist][item],
			...cache,
		};

		log('saved to cache', 'oracle', 'info', { oracle_cache, cache });
		set_storage('bleh_oracle_cache', JSON.stringify(oracle_cache));
	}

	page.structure.side!.appendChild(html.node`
        <section class="oracle cta colourful">
            <label class="cta-label">
                ${icon({ name: icons.oracle })}
                <strong>${tl(trans.oracle_notice)}</strong>
            </label>
            <div class="cta-actions">
                <button class="see-more left-icon oracle-button" data-type="debug" onclick=${() =>
		oracle_debug()}>
                    ${tl(trans.debug)}
                </button>
                <a class="see-more oracle-button" href="https://github.com/katelyynn/bleh/issues/new/choose" target="_blank">
                    ${tl(trans.send_feedback)}
                </a>
            </div>
        </section>
    `);

	const header = page.structure.container.querySelector('.page-header');
	let releases_panel;

	let tracklist_panel;
	let tracklist_oracle;
	let tracklist_own;
	let tracklist_own_loaded = false;
	let tracklist_lfm;

	let label_panel;

	if (page.type == 'track' && page.subpage == 'overview') {
		releases_panel = html.node`
            <section class="oracle-releases">
                <h3 class="text-18">${tl(trans.albums)}</h3>
                <div class="source-albums">
                    <div class="source-album oracle-loading">
                        <div class="source-album-art">
                            <span class="cover-art oracle-loading">
                                <img class="empty">
                            </span>
                        </div>
                        <div class="source-album-details" data-kate-processed="true">
                            <h4 class="source-album-name placeholder-text">Album name</h4>
                            <p class="source-album-artist placeholder-text">Artist name</p>
                            <p class="source-album-stats oracle-stats placeholder-text">5 listens</p>
                        </div>
                    </div>
                    <div class="source-album oracle-loading">
                        <div class="source-album-art">
                            <span class="cover-art oracle-loading">
                                <img class="empty">
                            </span>
                        </div>
                        <div class="source-album-details" data-kate-processed="true">
                            <h4 class="source-album-name placeholder-text">Album name</h4>
                            <p class="source-album-artist placeholder-text">Artist name</p>
                            <p class="source-album-stats oracle-stats placeholder-text">5 listens</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
		info_panel.after(releases_panel);
	} else if (page.type == 'track' && page.subpage == 'albums') {
		const no_data = page.structure.main.querySelector('.no-data-message');
		if (no_data) no_data.remove();

		const explainer = page.structure.main.querySelector(':scope > p');
		if (explainer) explainer.remove();

		releases_panel = html.node`
            <section class="oracle-releases-full">
                <h3 class="text-18">${tl(trans.albums)}</h3>
                <div class="resource-list--release-list">
                    <div class="resource-list--release-list-item-wrap">
                        <div class="resource-list--release-list-item oracle-loading">
                            <h3 class="resource-list--release-list-item-name oracle-loading" />
                            <p class="resource-list--release-list-item-artist oracle-loading" />
                            <p class="resource-list--release-list-item-aux-text resource-list--release-list-item-listeners oracle-stats oracle-loading" />
                            <p class="resource-list--release-list-item-aux-text oracle-loading" />
                            <div class="media-item">
                                <span class="resource-list--release-list-item-image cover-art oracle-loading">
                                    <img class="empty">
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
		page.structure.main.appendChild(releases_panel);
	} else if (page.type == 'album' && page.subpage == 'overview') {
		if (metadata) metadata.remove();

		metadata = html.node`
            <div class="metadata-column">
                <div class="metadata-group">
                    <dt class="catalogue-metadata-heading">${
			tl(trans.length)
		}</dt>
                    <dd class="catalogue-metadata-description placeholder-text">?? ????, ??:??</dd>
                </div>
                <div class="metadata-group">
                    <dt class="catalogue-metadata-heading">${
			tl(trans.released)
		}</dt>
                    <dd class="catalogue-metadata-description placeholder-text">? ??? ????</dd>
                </div>
            </div>
        `;
		meta_and_wiki?.appendChild(metadata);

		let tracklist_view_panel;
		tracklist_panel = html.node`
            <section class="oracle-tracks">
                <div class="top-container">
                    <h2>${tl(trans.tracklist)}<span class="new-badge beta">${
			tl(trans.beta)
		}</span></h2>
                    <div class="accompany view-buttons blend blend-v2">
                        ${
			select({
				values: page.state.tracklist_sources,
				initial: settings.tracklist_source,
				func: (val: string) => {
					save_setting('tracklist_source', val);
					tracklist_view_panel.setAttribute('data-view', val);

					if (!tracklist_own_loaded) source_own_tracklist();
				},
				blend: true,
			})
		}
                    </div>
                    <div class="view-buttons blend blend-v2">
                        <p class="blend-text">${
			tl(trans.are_these_results_accurate)
		}</p>
                        <button class="left-icon blend-v2-btn mark-incorrect" data-type="dislike" onclick=${() => {
			report_incorrect();
		}}>
                            ${tl(trans.report_incorrect)}
                        </button>
                        ${() => {
			const btn = html.node`
                                <button class="left-icon blend-v2-btn" data-type="settings">
                                    ${tl(trans.settings)}
                                </button>
                            `;

			tippy(btn, {
				theme: 'window',
				content: html.node`
                                    <div class="dialog-settings">
                                        <div class="setting-group blend">
                                            ${
					setting({ id: 'format_guest_features' })
				}
                                            ${
					setting({ id: 'show_guest_features' })
				}
                                            ${
					setting({ id: 'count_bar_right' })
				}
                                        </div>
                                    </div>
                                `,
				placement: 'bottom',
				interactive: true,
				interactiveBorder: 10,
				trigger: 'click',
			});

			return btn;
		}}
                    </div>
                </div>
                <div class="oracle-tracklist-view" data-view=${settings.tracklist_source} ref=${(
			el,
		) => tracklist_view_panel = el}>
                    <div class="oracle-tracklist" ref=${(el) =>
			tracklist_oracle = el} data-type="oracle">
                        <table class="chartlist chartlist--with-index chartlist--with-index--length-1 chartlist--with-artist chartlist--with-more chartlist--with-duration chartlist--with-bar">
                            <tbody>
                                ${Array.from({ length: 14 }, track_placeholder)}
                            </tbody>
                        </table>
                    </div>
                    <div class="oracle-tracklist" ref=${(el) =>
			tracklist_own = el} data-type="own">
                        <table class="chartlist chartlist--with-index chartlist--with-index--length-1 chartlist--with-artist chartlist--with-more chartlist--with-duration chartlist--with-bar">
                            <tbody>
                                ${Array.from({ length: 14 }, track_placeholder)}
                            </tbody>
                        </table>
                    </div>
                    <div class="oracle-tracklist" ref=${(el) =>
			tracklist_lfm = el} data-type="lfm" />
                </div>
            </section>
        `;
		info_panel.after(tracklist_panel);

		label_panel = html.node`
            <div class="card-tip copyright">
                © <span class="placeholder-text">Label</span>
            </div>
        `;
		info_panel.appendChild(label_panel);

		function source_own_tracklist() {
			fetch(
				`${root}user/${auth.name}/library/music/${page.sister}/${page.name}`,
			)
				.then((res) => {
					if (!res.ok) {
						log('error fetching own plays', 'oracle', 'error', {
							res,
						});
						throw new Error();
					}

					return res.text();
				})
				.then((dom) => {
					const doc = new DOMParser().parseFromString(
						dom,
						'text/html',
					);

					const tracklist = doc.querySelector(
						'#top-tracks-section [v-else=""] .chartlist',
					);

					if (!tracklist) return;

					tracklist.classList.remove('chartlist--with-image');

					render(
						tracklist_own,
						html`
							${tracklist}
						`,
					);

					tracklist_own_loaded = true;
				});
		}
	} else if (page.type == 'artist' && page.subpage == 'overview') {
		if (metadata) metadata.remove();

		metadata = html.node`
            <div class="metadata-column">
                <div class="metadata-group">
                    <dt class="catalogue-metadata-heading">${
			tl(trans.origin)
		}</dt>
                    <dd class="catalogue-metadata-description placeholder-text">????</dd>
                </div>
                <div class="metadata-group">
                    <dt class="catalogue-metadata-heading">${
			tl(trans.born)
		}</dt>
                    <dd class="catalogue-metadata-description placeholder-text">? ??? ????</dd>
                </div>
            </div>
        `;
		meta_and_wiki?.appendChild(metadata);

		label_panel = html.node`
            <div class="card-tip copyright">
                © <span class="placeholder-text">?????</span>
            </div>
        `;
		info_panel.appendChild(label_panel);
	}

	function track_placeholder() {
		return html.node`
            <tr class="chartlist-row chartlist__placeholder-row">
                <td class="chartlist-image chartlist__placeholder-image" />
                <td class="chartlist-name chartlist__placeholder-name">
                    <div class="chartlist__placeholder-loading" />
                </td>
            </tr>
        `;
	}

	const albums_and_lyrics_row = page.structure.main.querySelector(
		'.album-and-lyrics-row',
	);
	if (albums_and_lyrics_row) {
		albums_and_lyrics_row.classList.add('oracle-hidden');
	}

	const old_tracklist = page.structure.main.querySelector('#tracklist');
	if (old_tracklist) {
		const buffer = old_tracklist.querySelector('.buffer-standard');

		if (buffer) {
			buffer.classList.remove('buffer-standard');
			tracklist_lfm.appendChild(buffer);

			const more = buffer.querySelectorAll('.more-items');
			more.forEach((item) => {
				item.classList.add('more-tracklist-items');
			});
		}

		old_tracklist.remove();
	}

	function oracle_aliases(artist, desired, desired_id) {
		log('alias request', 'oracle', 'log', {
			artist,
			desired,
			desired_id,
		});

		if (!desired_id) return artist.name;

		if (
			artist.name.toLowerCase() == desired.toLowerCase() ||
			(artist_data.type == 'id' &&
				artist.artist.id == artist_data.name) ||
			(artist.id == desired_id)
		) {
			return desired;
		}

		return artist.name;
	}

	oracle_obtain_artist();

	function oracle_obtain_artist() {
		if (page.type == 'artist') {
			if (oracle_artists.hasOwnProperty(item)) {
				const local = oracle_artists[item];

				log(
					'skipping artist search for id (oracle database)',
					'oracle',
					'info',
					{ local },
				);

				oracle_artist_fetch({
					id: local,
				});
				return;
			} else if (oracle_cache[item]?.id) {
				const local = oracle_cache[item];

				log(
					'skipping artist search for id (local cache)',
					'oracle',
					'info',
					{ local },
				);
				oracle_artist_fetch({
					id: local.id,
				});

				return;
			}

			oracle_get_artist();

			return;
		}

		if (oracle_artists.hasOwnProperty(artist)) {
			artist_data = {
				type: 'id',
				name: oracle_artists[artist],
			};
			artist_template = `arid:"${oracle_artists[artist]}"`;
			oracle_connect();
			return;
		}

		artist_data = {
			type: 'name',
			name: page.sister,
		};
		oracle_connect();
	}

	function oracle_get_artist() {
		if (tries < 1) return;
		tries--;

		let top_track = page.state.top_track;
		let url;

		let type = 'artist';

		if (top_track) {
			url = `https://musicbrainz.org/ws/2/recording?query=${
				encodeURIComponent(
					`recording:"${
						clean_title(top_track)
					}" AND artist:"${page.name}" AND status:Official`,
				)
			}`;
			type = 'recording';
		} else {
			url = `https://musicbrainz.org/ws/2/artist?query=${
				encodeURIComponent(page.name)
			}`;
		}

		if (
			page.state.oracle_temp.page &&
			(page.name == page.state.oracle_temp.page.name &&
				page.type == page.state.oracle_temp.page.type)
		) {
			log('using temporary storage', 'oracle', 'info', {
				temp: page.state.oracle_temp,
			});
			oracle_artist(page.state.oracle_temp);

			return;
		}

		log(
			`using url ${encodeURI(url)} with ${tries} tries available`,
			'oracle',
		);

		GM_xmlhttpRequest({
			method: 'GET',
			url,
			headers: {
				'User-Agent':
					`bleh/${version.build} <https://github.com/katelyynn/bleh>`,
				Accept: 'application/json',
			},
			onload: function (response) {
				if (response.status < 200 || response.status >= 300) {
					log('error fetching artist data', 'oracle', 'error', {
						response,
					});

					oracle_error(response);

					return;
				}

				let data;
				try {
					data = JSON.parse(response.responseText);
				} catch (e) {
					log('failed to parse', 'oracle', 'error', { e });
					return;
				}

				log('received artist data', 'oracle', 'info', { data });

				if (type == 'artist') {
					const artists = data.artists;
					if (!artists[0]) {
						log('no data to use, ending', 'oracle');

						oracle_error('No useable data was found');

						return;
					}

					setTimeout(() => {
						oracle_artist_fetch(artists[0]);
					}, mb_delay);
				} else if (type == 'recording') {
					const recordings = data.recordings;
					if (!recordings[0]) {
						log('no data to use, ending', 'oracle');

						oracle_error('No useable data was found');

						return;
					}

					const id = recordings[0]['artist-credit'][0].artist.id;

					setTimeout(() => {
						oracle_artist_fetch({
							id,
						});
					}, mb_delay);
				}
			},
			onerror: function (err) {
				console.error('oracle', err);

				setTimeout(() => {
					oracle_get_artist();
				}, mb_delay);
			},
		});
	}

	function oracle_connect() {
		if (tries < 1) return;
		tries--;

		let url;

		page.state.oracle_debug.artist = artist_data;
		log('using artist data', 'oracle', 'info', { artist_data });

		if (page.type == 'track') {
			url =
				`https://musicbrainz.org/ws/2/recording?inc=release-events&query=${
					encodeURIComponent(
						`recording:"${
							clean_title(page.name)
						}" AND ${artist_template} AND status:Official`,
					)
				}`;
		} else if (page.type == 'album') {
			url = `https://musicbrainz.org/ws/2/release?query=${
				encodeURIComponent(
					`release:"${
						clean_title(page.name)
					}" AND ${artist_template}`,
				)
			}`;
		}

		if (page.type == 'album') {
			if (
				page.state.oracle_temp.page &&
				(page.name == page.state.oracle_temp.page.name &&
					page.sister == page.state.oracle_temp.page.sister &&
					page.type == page.state.oracle_temp.page.type)
			) {
				log('using temporary storage', 'oracle', 'info', {
					temp: page.state.oracle_temp,
				});
				oracle_album(page.state.oracle_temp);

				return;
			} else if (oracle_albums[artist]?.[item]) {
				const local = oracle_albums[artist]?.[item];
				tries = 3;

				log(
					'skipping album search for id (oracle database)',
					'oracle',
					'info',
					{ local },
				);
				page.state.oracle_debug.release_id = local.id;
				oracle_album_fetch({
					id: local.id,
				});

				return;
			} else if (oracle_cache[artist]?.[item]?.album?.id) {
				const local = oracle_cache[artist]?.[item]?.album;
				tries = 3;

				log(
					'skipping album search for id (local cache)',
					'oracle',
					'info',
					{ local },
				);
				page.state.oracle_debug.release_id = local.id;
				oracle_album_fetch({
					id: local.id,
				});

				return;
			}
		} else if (page.type == 'track') {
			if (
				page.state.oracle_temp.page &&
				(page.name == page.state.oracle_temp.page.name &&
					page.sister == page.state.oracle_temp.page.sister &&
					page.type == page.state.oracle_temp.page.type)
			) {
				log('using temporary storage', 'oracle', 'info', {
					temp: page.state.oracle_temp,
				});
				oracle_track_releases(page.state.oracle_temp);

				return;
			} else {
				const local = oracle_cache[artist]?.[item]?.track;

				if (local?.fetch) {
					delete local.fetch;
					log('deleted legacy track fetch data', 'oracle');
					oracle_save_cache('track', false);
				}

				if (local?.recording) {
					delete local.recording;
					log('deleted legacy track recording data', 'oracle');
					oracle_save_cache('track', false);
				}

				if (local?.id) {
					log(
						'skipping track search (local cache)',
						'oracle',
						'info',
						{
							local,
						},
					);

					oracle_track_fetch({
						id: local.id,
					});
					return;
				}
			}
		}

		log(
			`using url ${encodeURI(url)} with ${tries} tries available`,
			'oracle',
		);

		GM_xmlhttpRequest({
			method: 'GET',
			url,
			headers: {
				'User-Agent':
					`bleh/${version.build} <https://github.com/katelyynn/bleh>`,
				Accept: 'application/json',
			},
			onload: function (response) {
				if (response.status < 200 || response.status >= 300) {
					log('error fetching connect data', 'oracle', 'error', {
						response,
					});

					oracle_error(response);

					return;
				}

				let data;
				try {
					data = JSON.parse(response.responseText);
				} catch (e) {
					log('failed to parse', 'oracle', 'error', { e });
					oracle_error(e);
					return;
				}

				log('received connect data', 'oracle', 'info', { data });
				page.state.oracle = data;

				oracle(data);
			},
			onerror: function (err) {
				console.error('oracle', err);

				setTimeout(() => {
					oracle_connect();
				}, mb_delay);
			},
		});
	}

	function oracle(data) {
		if (page.type == 'track') {
			oracle_track_releases_process(data);
		} else if (page.type == 'album') {
			tries = 3;

			const release = oracle_pick_release(data);

			if (!release) {
				log('no data to use, ending', 'oracle', 'info', {
					data,
					release,
				});

				oracle_error('No useable data was found');

				//cache.album.fetch = data;
				//oracle_save_cache('album');

				return;
			}

			page.state.oracle_debug.release_id = release.id;
			log('picked release, proceeding', 'oracle', 'info', {
				data,
				release,
			});

			setTimeout(() => {
				oracle_album_fetch(release);
			}, mb_delay);
		}
	}

	function oracle_track_fetch(data) {
		if (tries < 1) return;
		tries--;

		const url =
			`https://musicbrainz.org/ws/2/recording/${data.id}?inc=artist-credits+url-rels+annotation+work-level-rels+artist-rels+work-rels+releases+release-groups`;

		log(
			`using url ${encodeURI(url)} with ${tries} tries available`,
			'oracle',
		);

		GM_xmlhttpRequest({
			method: 'GET',
			url,
			headers: {
				'User-Agent':
					`bleh/${version.build} <https://github.com/katelyynn/bleh>`,
				Accept: 'application/json',
			},
			onload: function (response) {
				if (response.status < 200 || response.status >= 300) {
					log('error fetching connect data', 'oracle', 'error', {
						response,
					});

					oracle_error(response);

					return;
				}

				let data;
				try {
					data = JSON.parse(response.responseText);
				} catch (e) {
					log('failed to parse', 'oracle', 'error', { e });

					oracle_error(e);

					return;
				}

				log('received connect track data', 'oracle', 'info', { data });
				page.state.oracle = data;

				page.state.oracle_temp = {
					page: {
						name: page.name,
						sister: page.sister,
						type: page.type,
					},
					...data,
				};
				log('saved temp', 'oracle', 'info', {
					temp: page.state.oracle_temp,
				});

				oracle_track_releases(data);
			},
			onerror: function (err) {
				console.error('oracle', err);

				setTimeout(() => {
					oracle_track_fetch(data);
				}, mb_delay);
			},
		});
	}

	function get_earliest_date(recording) {
		const dates = [];

		for (const release of recording.releases) {
			if (release['first-release-date']) {
				dates.push(new Date(release['first-release-date']));
			} else if (release.date) {
				dates.push(new Date(release.date));
			}
		}

		if (dates.length == 0) return null;

		return new Date(Math.min(...dates));
	}

	function pick_best(candidates) {
		return candidates
			.map((recording) => ({
				recording,
				date: get_earliest_date(recording),
			}))
			.sort((a, b) => {
				if (!a.date && !b.date) return 0;
				if (!a.date) return 1;
				if (!b.date) return -1;
				return a.date - b.date;
			})[0]?.recording || null;
	}

	function oracle_pick_recording(data) {
		if (!data || !data.recordings) return null;

		const filtered = data.recordings.filter((recording) => {
			if (!recording.releases || recording.releases.length == 0) {
				return false;
			}

			if (recording.video) return false;

			return recording.releases.some((release) => {
				const artists = release['artist-credit'] || [];
				const various = artists.some(
					(artist) => artist.name == 'Various Artists',
				);
				const official = release.status == 'Official';
				const compilation = release['release-group']['secondary-types']
					?.includes('Compilation');

				return !various && official && !compilation;
			});
		});

		if (filtered.length == 0) return null;

		log('following options to choose from', 'oracle', 'info', { filtered });

		const try_pick = (filter) => {
			const matches = filtered.filter(filter);
			if (matches.length == 0) return null;

			return pick_best(matches);
		};

		return (
			try_pick((recording) =>
				recording.disambiguation?.toLowerCase() == 'explicit'
			) ||
			try_pick((recording) => !recording.disambiguation) ||
			try_pick((recording) =>
				recording.disambiguation?.toLowerCase().includes('explicit')
			) ||
			try_pick((recording) =>
				recording.disambiguation?.toLowerCase() == 'clean'
			) ||
			try_pick((recording) => {
				const disambig = recording.disambiguation?.toLowerCase() || '';
				return !disambig.includes('english') &&
					!disambig.endsWith('mv') && !recording.video;
			}) ||
			try_pick((recording) =>
				recording.disambiguation?.toLowerCase().endsWith('mv')
			) ||
			pick_best(filtered)
		);
	}

	function oracle_pick_release(data) {
		if (!data || !data.releases) return null;

		const filtered = data.releases.filter((release) => {
			const artists = release['artist-credit'] || [];
			const various = artists.some(
				(artist) => artist.name == 'Various Artists',
			);
			const official = release.status == 'Official';
			const fake = release.title?.toLowerCase().includes('(spotify)');

			return !various && official && !fake;
		});

		const similarity = (title) => {
			const name = page.name.toLowerCase();

			if (title == name) return 1;

			const longer = title.length > name.length ? title : name;
			const shorter = title.length > name.length ? name : title;

			const same =
				[...shorter].filter((character, index) =>
					longer[index] == character
				).length;
			return same / longer.length;
		};

		filtered.sort((a, b) => {
			const rank = (release) => {
				const type = release['release-group']?.['primary-type']
					?.toLowerCase();
				const digital = release.media?.[0]?.format == 'Digital Media';
				const similar = similarity(release.title.toLowerCase());

				let base = 0;
				if (type == 'album') base = 3;
				else if (type == 'ep') base = 2;
				else if (type == 'single') base = 1;
				else base = 0.5;

				if (digital) base += 0.2;

				const weight = 2 * similar;
				const rank = base + weight;

				// boost priority for digital media
				log(`ranked as ${rank}`, 'oracle', 'info', { release });
				return rank;
			};

			const a_rank = rank(a);
			const b_rank = rank(b);

			if (a_rank != b_rank) return b_rank - a_rank;

			// parse dates
			const parse_date = (release) => {
				if (!release.date) return null;
				const date = new Date(release.date);
				return isNaN(date) ? null : date;
			};

			const a_date = parse_date(a);
			const b_date = parse_date(b);

			// earliest date first
			if (a_date && b_date) {
				const diff = a_date - b_date;
				if (diff != 0) return diff;
			} else if (a_date && !b_date) return -1;
			else if (!a_date && b_date) return 1;

			// if same date or no date, prefer digital
			const a_media = a.media?.[0]?.format == 'Digital Media';
			const b_media = b.media?.[0]?.format == 'Digital Media';

			if (a_media && !b_media) return -1;
			if (!a_media && b_media) return 1;

			// then prefer higher track count
			const a_tracks = a['track-count'] || 0;
			const b_tracks = b['track-count'] || 0;

			return b_tracks - a_tracks;
		});

		if (filtered.length == 0) return null;

		log('filtered releases before picking', 'oracle', 'info', { filtered });

		// prefer explicit
		let best = filtered.find(
			(release) => release.disambiguation?.toLowerCase() == 'explicit',
		);
		if (best) return best;

		// then streaming/bandcamp
		best = filtered.find(
			(release) =>
				['streaming', 'bandcamp'].some((term) =>
					release.disambiguation?.toLowerCase().includes(term)
				),
		);
		if (best) return best;

		// check if there's one without any disambiguation
		// before going for a clean release
		best = filtered.find((release) => !release.disambiguation);
		if (best) return best;

		// then clean
		best = filtered.find(
			(release) => release.disambiguation?.toLowerCase() == 'clean',
		);
		if (best) return best;

		// then hi-res
		// for taylor
		best = filtered.find(
			(release) => release.disambiguation?.toLowerCase() == 'hi-res',
		);
		if (best) return best;

		// then dolby atmos
		best = filtered.find(
			(release) =>
				release.disambiguation?.toLowerCase() == 'dolby atmos mix',
		);
		if (best) return best;

		// try anything explicit
		best = filtered.find((release) =>
			release.disambiguation?.toLowerCase().includes('explicit')
		);
		if (best) return best;

		// try anything clean
		best = filtered.find((release) =>
			release.disambiguation?.toLowerCase().includes('clean')
		);
		if (best) return best;

		// avoid anything referencing english
		// usually an english translation of
		// e.g. a japanese album
		// also avoid music videos
		best = filtered.find((release) => {
			const disambiguation = release.disambiguation?.toLowerCase() || '';
			return (
				!disambiguation.includes('english') &&
				!disambiguation.endsWith('mv')
			);
		});
		if (best) return best;

		// otherwise any
		return filtered[0];
	}

	function oracle_album_fetch(data) {
		if (tries < 1) return;
		tries--;

		const url =
			`https://musicbrainz.org/ws/2/release/${data.id}?inc=recordings+labels+artist-credits+url-rels+annotation+release-groups`;

		log(
			`using url ${encodeURI(url)} with ${tries} tries available`,
			'oracle',
		);

		GM_xmlhttpRequest({
			method: 'GET',
			url,
			headers: {
				'User-Agent':
					`bleh/${version.build} <https://github.com/katelyynn/bleh>`,
				Accept: 'application/json',
			},
			onload: function (response) {
				if (response.status < 200 || response.status >= 300) {
					log('error fetching connect data', 'oracle', 'error', {
						response,
					});

					oracle_error(response);

					return;
				}

				let data;
				try {
					data = JSON.parse(response.responseText);
				} catch (e) {
					log('failed to parse', 'oracle', 'error', { e });

					oracle_error(e);

					return;
				}

				log('received connect album data', 'oracle', 'info', { data });
				page.state.oracle = data;

				cache.album = {
					id: data.id,
				};
				oracle_save_cache('album');

				page.state.oracle_temp = {
					page: {
						name: page.name,
						sister: page.sister,
						type: page.type,
					},
					...data,
				};
				log('saved temp', 'oracle', 'info', {
					temp: page.state.oracle_temp,
				});

				oracle_album(data);
			},
			onerror: function (err) {
				console.error('oracle', err);

				setTimeout(() => {
					oracle_album_fetch(data);
				}, mb_delay);
			},
		});
	}

	function oracle_album(data) {
		if (data.offset != null) {
			log('detected no results', 'oracle');

			render(
				tracklist_oracle,
				html`
					<div class="loading-data-container">
						<div class="loading-data-text failed">
					        ${tl(trans.nothing_matches_your_search)}
					    </div>
					</div>
				`,
			);

			return;
		}

		const types = {
			album: tl(trans.album),
			single: tl(trans.single),
			ep: 'EP',
			other: tl(trans.other),
		};

		let type = data['release-group']['primary-type'];
		if (type && type.toLowerCase() in types) {
			type = types[type.toLowerCase()];
		}

		if (type && page.state.header_type) {
			page.state.header_type.textContent = type;
		}

		/*if (page.subpage == 'overview') {
            const metadata_row = info_panel?.querySelector('.metadata-row');

            if (data.annotation && metadata_row) {
                metadata_row.appendChild(html.node`
                    <div class="metadata-group">
                        <div class="sub-text music-small-header">
                            ${tl(trans.annotation)}
                        </div>
                        <div class="oracle-annotation">
                            ${data.annotation}
                        </div>
                    </div>
                `);
            }
        }*/

		let labels = data['label-info'];
		if (labels && labels.length > 0 && page.subpage == 'overview') {
			// filter out visually duplicates
			const seen = new Set();
			labels = labels.filter((label) => {
				if (!label.label) return;

				const name = label.label.name;
				if (seen.has(name)) return false;

				seen.add(name);
				return true;
			});

			render(
				label_panel,
				html`
					©
					${labels.map((label, index) => {
						let label_elem;
						const elem = html.node`
                        <span class="music-label" ref=${(
							el,
						) => (label_elem = el)}>${label.label.name}</span>${
							index < labels.length - 1 ? ', ' : ''
						}
                    `;

						if (label.label.disambiguation != '') {
							tippy(label_elem, {
								content: label.label.disambiguation,
							});
						}

						return elem;
					})}
				`,
			);
		}

		if (page.subpage != 'overview') return;

		const media = data.media;
		const discs = media.filter((item) => item.tracks != null);

		const result = discs.reduce((acc, disc) => {
			acc.count += disc['track-count'];

			const length = disc.tracks.reduce((sum, track) => {
				return sum + track.length;
			}, 0);

			acc.length += length;

			return acc;
		}, { count: 0, length: 0 });

		const total_s = Math.floor(result.length / 1000);
		const h = Math.floor(total_s / 3600);
		const m = Math.floor((total_s % 3600) / 60);
		const s = total_s % 60;

		const length = `${h > 0 ? `${h}:` : ''}${pad2(m)}:${pad2(s)}`;

		render(
			metadata,
			html`
				<div class="metadata-group">
					<dt class="catalogue-metadata-heading">${tl(
						trans.length,
					)}</dt>
					<dd class="catalogue-metadata-description">${tl(
						trans.value_tracks_time,
						{ count: result.count, length },
					)}</dd>
				</div>
				<div class="metadata-group">
					<dt class="catalogue-metadata-heading">${tl(
						trans.released,
					)}</dt>
					<dd class="catalogue-metadata-description">${DateTime
						.fromISO(data.date).toLocaleString(
							DateTime.DATE_MED,
						)}</dd>
				</div>
			`,
		);

		const artist_id = data['artist-credit'][0].id;
		const artist = data['artist-credit'][0].name.toLowerCase();
		const album = page.name.toLowerCase();

		const defaults = {
			guests_in_title: true,
		};

		const oracle_entry = {
			...defaults,
			...((
					oracle_albums.hasOwnProperty(artist) &&
					oracle_albums[artist].hasOwnProperty(album)
				)
				? oracle_albums[artist][album]
				: {}),
		};
		log('entry', 'oracle', 'info', { oracle_entry });

		if (discs.length == 0) {
			render(
				tracklist_oracle,
				html`
					<div class="loading-data-container">
						<div class="loading-data-text failed">${tl(
							trans.no_tracks_found_mb,
						)}</div>
					</div>
				`,
			);

			return;
		}

		render(
			tracklist_oracle,
			html`
				${discs.map((disc) =>
					render_tracklist(disc, discs.length, artist)
				)}
			`,
		);

		function render_tracklist(disc, length, retrieved_artist) {
			return html.node`
                ${
				length > 1
					? html.node`
                <div class="sub-text normal disc-header">
                    <span class="bleh-icon" style="--icon: var(--mask)" />
                    ${tl(trans.disc_number, { n: disc.position })}
                </div>
                `
					: ''
			}
                <table class="chartlist chartlist--with-index chartlist--with-index--length-1 chartlist--with-artist chartlist--with-more chartlist--with-duration chartlist--with-bar">
                    <tbody>
                        ${
				disc.tracks.map((track) => {
					let title = fix_title(track.title);

					const artist_lower = fix_title(
						track['artist-credit'][0].name,
					).toLowerCase();
					const title_lower = title.toLowerCase();

					const track_entry = (
							oracle_tracks.hasOwnProperty(artist_lower) &&
							oracle_tracks[artist_lower].hasOwnProperty(
								title_lower,
							)
						)
						? oracle_tracks[artist_lower][title_lower]
						: null;

					const total_s = Math.floor(track.length / 1000);
					const m = Math.floor(total_s / 60);
					const s = total_s % 60;

					const disambig = track.recording.disambiguation;
					const video = track.recording.video;

					if (video) return html.node``;

					const artists = track['artist-credit'];
					let inherit_guests = [];
					let guests = [];
					let found_feature = false;
					let first_joinphrase;

					for (let i = 1; i < artists.length; i++) {
						const artist = artists[i];
						const joinphrase = (artists[i - 1].joinphrase || '')
							.trim()
							.toLowerCase();

						if (!found_feature) {
							if (
								['feat', 'with'].some((phrase) =>
									joinphrase.includes(phrase)
								)
							) {
								found_feature = true;
								first_joinphrase = joinphrase;

								guests.push(artist);
							} else {
								inherit_guests.push(artist);
							}
						} else {
							guests.push(artist);
						}
					}

					log(`${track.position}: artists`, 'oracle', 'log', {
						artists,
						guests,
						inherit_guests,
					});

					if (track_entry) {
						title = track_entry;
					} else if (
						oracle_entry.guests_in_title &&
						guests.length > 0
					) {
						title += ` ${
							oracle_entry.guest_brackets != 'none' ? '(' : ''
						}${first_joinphrase} `;

						guests.forEach((artist, index) => {
							log(`guest ${index}`, 'oracle', 'info', {
								artist,
							});
							let joinphrase = artist.joinphrase || '';

							if (
								index == guests.length - 2 &&
								oracle_entry.final_guest_separator
							) {
								joinphrase = oracle_entry.final_guest_separator;
							}

							title += `${fix_title(artist.name)}${joinphrase}`;
						});

						if (oracle_entry.guest_brackets != 'none') title += ')';
					} else if (!oracle_entry.guests_in_title) {
						inherit_guests.push(...guests);

						log(
							`${track.position}: artists, changed due to disabled title injection`,
							'oracle',
							'log',
							{
								inherit_guests,
							},
						);
					}

					log(`${track.position}: title`, 'oracle', 'log', {
						title,
					});

					const elem = html.node`
                                <tr class="chartlist-row" data-disambig=${disambig}>
                                    <td class="chartlist-index">${track.position}</td>
                                    <td class="chartlist-name">
                                        <a href="${root}music/${
						sanitise(
							fix_title(
								oracle_aliases(
									track['artist-credit'][0],
									page.sister,
									artist_id,
								),
							),
						)
					}/_/${
						sanitise(title)
					}" data-name=${title} data-inherit-artists=${
						inherit_guests.map((artist) =>
							sanitise(fix_title(artist.name), ' ')
						).join(';')
					}>
                                            ${title}
                                        </a>
                                    </td>
                                    <td class="chartlist-duration">
                                        ${m}:${s.toString().padStart(2, '0')}
                                    </td>
                                    <td class="chartlist-more">
                                        <div>
                                            <ul class="chartlist-more-menu" />
                                        </div>
                                    </td>
                                </tr>
                            `;

					return elem;
				})
			}
                    </tbody>
                </table>
            `;
		}
	}

	function oracle_track_releases_process(data) {
		const recording = oracle_pick_recording(data);

		if (!recording) {
			oracle_error('No track found to continue with');
			return;
		}

		log('picked recording, proceeding to connect', 'oracle', 'info', {
			recording,
		});

		cache.track = {
			id: recording.id,
		};
		oracle_save_cache('track');

		oracle_track_fetch(recording);
	}

	function oracle_track_releases(recording) {
		// let's comb through the releases to remove
		// various artists
		let releases = [];
		let releases_to_move = [];

		if (!recording) {
			if (releases_panel) {
				render(
					releases_panel,
					html`
						<div class="top-container">
							<h3 class="text-18">
						        ${tl(
							trans.albums,
						)}<span class="new-badge beta">${tl(trans.beta)}</span>
						    </h3>
							<div class="view-buttons blend blend-v2">
								<p class="blend-text">${tl(
									trans.are_these_results_accurate,
								)}</p>
								<button class="left-icon blend-v2-btn mark-incorrect"
									data-type="dislike" onclick=${() => {
										report_incorrect();
									}}>
						            ${tl(trans.report_incorrect)}
						        </button>
							</div>
						</div>
						<div class="loading-data-container">
							<div class="loading-data-text failed">
						        ${tl(trans.no_releases_found)}
						    </div>
						</div>
					`,
				);
			}
			return;
		}

		// let's look thru the last.fm provided ones
		// to possibly get listener and cover data
		let lastfm_releases = [];
		const lastfm_source_albums = albums_and_lyrics_row?.querySelectorAll(
			'.source-album',
		);
		// you may ask why im not cleaning the title here
		// its to avoid misleading the listener count incase it tries to show
		// the listener count for GNX (Spotify) under GNX
		lastfm_source_albums?.forEach((release) => {
			lastfm_releases.push({
				title: release.querySelector('.source-album-name').textContent,
				artist: release.querySelector('.source-album-artist')
					.textContent,
				plays: clean_number(
					release
						.querySelector('.source-album-stats')
						.firstChild.textContent.trim(),
				),
				artwork: release.querySelector(
					'.source-album-art > .cover-art > img',
				).src,
			});
		});

		page.state.oracle_debug.recording_id = recording.id;
		log('picked recording, proceeding', 'oracle', 'info', {
			recording,
		});

		if (recording) {
			log('releases in recording', 'oracle', 'info', {
				recording,
				releases: recording.releases,
			});
			recording.releases.forEach((release) => {
				const artist = release['artist-credit']
					? release['artist-credit'][0].name
					: recording['artist-credit'].name;

				if (artist == 'Various Artists') return;

				const status = release.status?.toLowerCase();
				const disambiguation = release.disambiguation?.toLowerCase();

				// seems to ignore english translations of jp albums sometimes
				if (status && status.startsWith('pseudo')) return;

				if (disambiguation) {
					if (disambiguation.includes('english')) {
						releases_to_move.push(release);
						return;
					}
				}

				releases.push(release);
			});

			releases.push(...releases_to_move);

			log('releases in recording after parsing', 'oracle', 'info', {
				releases,
			});

			// makes 'Bootleg' less likely if there's duplicates
			releases.sort((a, b) => {
				const rank = (status) => {
					if (status == 'Official') return 0;
					if (!status) return 1;
					return 2;
				};

				return rank(a.status) - rank(b.status);
			});

			// lets change titles before filtering
			releases.forEach((release) => {
				let title = fix_title(release.title);
				const artist = fix_title(
					oracle_aliases(
						release['artist-credit']?.[0] ||
							recording['artist-credit'][0],
						page.sister,
						'',
					),
				);

				const artist_lower = artist.toLowerCase();
				const title_lower = title.toLowerCase();

				const defaults = {
					guests_in_title: false,
					guest_brackets: true,
				};

				const oracle_entry = {
					...defaults,
					...((
							oracle_albums.hasOwnProperty(artist_lower) &&
							oracle_albums[artist_lower].hasOwnProperty(
								title_lower,
							)
						)
						? oracle_albums[artist_lower][title_lower]
						: {}),
				};
				log('entry', 'oracle', 'info', {
					oracle_entry,
				});

				if (oracle_entry.disambiguation) {
					if (oracle_entry.disambiguation[release.disambiguation]) {
						title =
							oracle_entry.disambiguation[release.disambiguation];
					} else if (oracle_entry.disambiguation.other) {
						title = oracle_entry.disambiguation.other;
					}
				}

				release.title = title;
			});

			releases = releases.filter((release, index, self) => {
				const artist = release['artist-credit']?.[0]?.name;
				const title = release.title;

				// find duplicates
				const duplicates = self.filter(
					(r) =>
						r.title.toLowerCase() == title.toLowerCase() &&
						r['artist-credit']?.[0]?.name?.toLowerCase() ==
							artist?.toLowerCase(),
				);

				// if multiple, prefer digital media pressing
				// with a date if possible!!
				if (duplicates.length > 1) {
					const digital_with_date = duplicates.find(
						(r) =>
							r.media?.[0]?.format == 'Digital Media' && r.date,
					);
					if (digital_with_date) return release == digital_with_date;

					// otherwise prefer any digital
					const digital = duplicates.find(
						(r) => r.media?.[0]?.format == 'Digital Media',
					);
					if (digital) return release == digital;
				}

				// otherwise, use what we have
				return (
					index ==
						self.findIndex(
							(r) =>
								r.title.toLowerCase() == title.toLowerCase() &&
								r['artist-credit']?.[0]?.name.toLowerCase() ==
									artist.toLowerCase(),
						)
				);
			});

			releases.sort((a, b) => {
				const rank = (release) => {
					const type = release['release-group']?.['primary-type']
						?.toLowerCase();
					const digital =
						release.media?.[0]?.format == 'Digital Media';

					let rank = 4;
					if (type == 'single') rank = 0;
					else if (type == 'ep') rank = 1;
					else if (type == 'album') rank = 3;
					else rank = 2;

					// boost priority for digital media
					return (digital ? 0 : 10) + rank;
				};

				const artist_matches = (release) => {
					return release['artist-credit']?.some((artist) => {
						const name = oracle_aliases(artist, page.sister);
						return name.toLowerCase() == page.sister.toLowerCase();
					});
				};

				const a_artist_match = artist_matches(a);
				const b_artist_match = artist_matches(b);

				if (a_artist_match && !b_artist_match) return -1;
				if (!a_artist_match && b_artist_match) return 1;

				const type_diff = rank(a) - rank(b);
				if (type_diff != 0) return type_diff;

				function parse_date(release) {
					if (!release.date) return null;

					const date = new Date(release.date);
					return isNaN(date) ? null : date;
				}

				const a_date = parse_date(a);
				const b_date = parse_date(b);

				if (a_date && b_date) return a_date - b_date;
				if (a_date && !b_date) return -1;
				if (!a_date && b_date) return 1;
				return 0;
			});

			log('releases in recording after filter', 'oracle', 'info', {
				releases,
			});

			if (releases[0]) {
				const release = releases[0];

				let title = release.title;
				const artist = fix_title(
					oracle_aliases(
						release['artist-credit']?.[0] ||
							recording['artist-credit'][0],
						page.sister,
					),
				);

				const match = lastfm_releases.find(
					(r) =>
						r.title == title &&
						r.artist == artist,
				);

				let plays = 0;
				let artwork;
				if (match) {
					plays = match.plays;
					artwork = match.artwork;
				}

				if (artwork) {
					create_avatar(
						page.state.avatar_side,
						artwork,
						page.state.avatar_side_override,
					);

					save_hoshino_artwork(
						artwork,
						title,
						artist,
						plays,
					);
				} else {
					const entry = load_hoshino_artwork(title, artist);

					if (entry && entry.artwork && entry.listeners) {
						create_avatar(
							page.state.avatar_side,
							entry.artwork,
							page.state.avatar_side_override,
						);
					} else {
						create_avatar(
							page.state.avatar_side,
							null,
							page.state.avatar_side_override,
						);

						fetch(
							`${root}music/${sanitise(artist)}/${
								sanitise(title)
							}/`,
						)
							.then((res) => {
								if (!res.ok) {
									log(
										'error fetching cover art',
										'oracle',
										'error',
										{ res },
									);

									throw new Error();
								}

								return res.text();
							})
							.then((dom) => {
								const doc = new DOMParser().parseFromString(
									dom,
									'text/html',
								);

								const background_image = doc.querySelector(
									'.header-new-background-image',
								);

								let artwork = null;

								if (background_image) {
									artwork = background_image
										.getAttribute('content')
										.replace('/ar0/', '/300x300/');
								}

								const listeners = doc.querySelector(
									'.header-new-info-desktop .header-metadata-tnew-display > p > abbr',
								);

								create_avatar(
									page.state.avatar_side,
									artwork,
									page.state.avatar_side_override,
								);

								save_hoshino_artwork(
									artwork,
									title,
									artist,
									listeners?.textContent.trim(),
								);
							})
							.catch((err) => {
								console.error('oracle', err);
								return;
							});
					}
				}
			}

			const allow_overflow = false;

			if (page.subpage == 'overview') releases = releases.slice(0, 2);

			let source_albums;
			if (releases_panel) {
				render(
					releases_panel,
					html`
						<div class="top-container">
							<h3 class="text-18">
						        ${tl(
							trans.albums,
						)}<span class="new-badge beta">${tl(trans.beta)}</span>
						    </h3>
							<div class="view-buttons blend blend-v2">
								<p class="blend-text">${tl(
									trans.are_these_results_accurate,
								)}</p>
								<button class="left-icon blend-v2-btn mark-incorrect"
									data-type="dislike" onclick=${() => {
										report_incorrect();
									}}>
						            ${tl(trans.report_incorrect)}
						        </button>
							</div>
						</div>
						<div class="${page.subpage == 'overview'
							? 'source-albums-container'
							: 'resource-list-container'}">
							<div class="${page.subpage == 'overview'
								? 'source-albums'
								: 'resource-list--release-list'}">
						        ${releases.map((release, index) => {
							log('release', 'oracle', 'log', {
								release,
							});
							let title = release.title;
							const artist = fix_title(
								oracle_aliases(
									release['artist-credit']?.[0] ||
										recording['artist-credit'][0],
									page.sister,
								),
							);

							const types = {
								album: tl(trans.album),
								single: tl(trans.single),
								ep: 'EP',
								other: tl(trans.other),
							};

							let type = release['release-group']['primary-type'];
							if (type && type.toLowerCase() in types) {
								type = types[type.toLowerCase()];
							}

							// is there a matching last.fm entry available atm?
							const match = lastfm_releases.find(
								(r) =>
									r.title == title &&
									r.artist == artist,
							);

							let plays = 0;
							let artwork;
							if (match) {
								plays = match.plays;
								artwork = match.artwork;
							}

							let artwork_container;
							let stats;

							let title_elem;
							let artist_elem;
							if (useSettings.get('format_guest_features')) {
								const formatted = name_includes(
									title,
									artist,
								);

								title_elem = html.node`<a class="smart-title">${
									smart_title(
										formatted.song_title,
										formatted.song_tags,
									)
								}</a>`;
								artist_elem = html.node`${
									smart_artists(
										formatted.song_artist,
										formatted.song_guests,
									)
								}`;
							} else {
								title_elem = romanise(
									correct_item_by_artist(
										title,
										artist,
									),
								);
								artist_elem = romanise(
									correct_artist(artist),
								);
							}

							let elem;

							if (page.subpage == 'overview') {
								elem = html.node`
                                        <div class="source-album js-link-block link-block-cover-link">
                                            <div class="source-album-art" ref=${(
									el,
								) => artwork_container = el}>
                                                ${
									artwork
										? html.node`
                                                    <span class="cover-art">
                                                        <img src=${artwork} alt=${title} loading="lazy">
                                                    </span>
                                                `
										: html.node`
                                                    <span class="cover-art">
                                                        <img class="missing-album" />
                                                    </span>
                                                `
								}
                                            </div>
                                            <div class="source-album-details" data-kate-processed="true">
                                                <h4 class="source-album-name">${title_elem}</h4>
                                                <p class="source-album-artist">${artist_elem}</p>
                                                <p class="source-album-stats oracle-stats" ref=${(
									el,
								) => (stats = el)}>
                                                    <span class="oracle-stat type">${type}</span>
                                                    ${
									match
										? html.node`
                                                        <span class="oracle-stat plays">
                                                            <span class="bleh-icon" />
                                                            ${
											plays.toLocaleString(lang)
										}
                                                        </span>
                                                    `
										: ''
								}
                                                </p>
                                                <a class="js-link-block-cover-link link-block-cover-link" href="${root}music/${
									sanitise(artist)
								}/${
									sanitise(title)
								}" tabindex="-1" aria-hidden="true" />
                                            </div>
                                        </div>
                                    `;
							} else {
								elem = html.node`
                                        <div class="resource-list--release-list-item-wrap">
                                            <div class="resource-list--release-list-item js-link-block">
                                                <h3 class="resource-list--release-list-item-name">${title_elem}</h3>
                                                <p class="resource-list--release-list-item-artist">${artist_elem}</p>
                                                <p class="resource-list--release-list-item-aux-text resource-list--release-list-item-listeners oracle-stats" ref=${(
									el,
								) => stats = el}>
                                                    <span class="oracle-stat type">${type}</span>
                                                    ${
									match
										? html.node`
                                                        <span class="oracle-stat plays">
                                                            <span class="bleh-icon" />
                                                            ${
											plays.toLocaleString(lang)
										}
                                                        </span>
                                                    `
										: ''
								}
                                                </p>
                                                <p class="resource-list--release-list-item-aux-text">
                                                    ${
									tl(trans.count_tracks, {
										c: release['track-count'],
									})
								}
                                                </p>
                                                <div class="media-item" ref=${(
									el,
								) => artwork_container = el}>
                                                    ${
									artwork
										? html.node`
                                                        <span class="resource-list--release-list-item-image cover-art">
                                                            <img src=${artwork} alt=${title}>
                                                        </span>
                                                    `
										: html.node`
                                                        <span class="resource-list--release-list-item-image cover-art">
                                                            <img class="missing-album" />
                                                        </span>
                                                    `
								}
                                                </div>
                                                <a class="js-link-block-cover-link link-block-cover-link" href="${root}music/${
									sanitise(artist)
								}/${
									sanitise(title)
								}" tabindex="-1" aria-hidden="true" />
                                            </div>
                                        </div>
                                    `;
							}

							if (!artwork && index < 2) {
								load_cover_art(
									artwork_container,
									title,
									artist,
									stats,
									type,
									index,
								);
							}

							return elem;
						})}
						    </div>
						</div>
					`,
				);
			}

			const artist_elem = header.querySelector('h2');
			if (recording.disambiguation == 'explicit') {
				artist_elem.insertBefore(
					html.node`
                    <span class="track-explicit icon">${
						tl(trans.explicit)
					}</span>
                `,
					artist_elem.firstChild,
				);
			}
		} else {
			if (releases_panel) {
				render(
					releases_panel,
					html`
						<h3 class="text-18">
						    ${tl(trans.albums)}<span class="new-badge beta"
						        >${tl(trans.beta)}</span
						    >
						</h3>
						<div class="loading-data-container">
							<div class="loading-data-text failed">
						        ${tl(trans.no_releases_found)}
						    </div>
						</div>
					`,
				);
			}
		}
	}

	function load_cover_art(
		parent,
		title,
		artist,
		stats = null,
		type = null,
		index = 1,
	) {
		const entry = load_hoshino_artwork(title, artist);

		if (entry && entry.artwork && entry.listeners) {
			render(
				parent,
				html`
					<span class="cover-art">
						<img src=${entry.artwork} alt=${title} />
					</span>
				`,
			);

			if (index == 0) {
				create_avatar(
					page.state.avatar_side,
					entry.artwork,
					page.state.avatar_side_override,
				);
			}

			render(
				stats,
				html`
					${type}
					<span class="oracle-stat plays">
					    <span class="bleh-icon" />
					    ${entry.listeners.toLocaleString(lang)}
					</span>
				`,
			);

			return;
		}

		render(
			parent,
			html`
				<span class="cover-art oracle-loading">
					<span class="loading-spinner">
						<span class="bleh-icon" />
					</span>
					<img class="empty" />
				</span>
			`,
		);

		if (!ff('oracle_fetch_artwork')) return;

		log(`loading cover art for index ${index}`, 'oracle');

		fetch(`${root}music/${sanitise(artist)}/${sanitise(title)}/`)
			.then((res) => {
				if (!res.ok) {
					log('error fetching cover art', 'oracle', 'error', { res });

					render(
						parent,
						html`
							<span class="cover-art">
								<img class="missing-album error" />
							</span>
						`,
					);

					throw new Error();
				}

				return res.text();
			})
			.then((dom) => {
				const doc = new DOMParser().parseFromString(dom, 'text/html');

				const background_image = doc.querySelector(
					'.header-new-background-image',
				);

				let artwork = null;

				if (!background_image) {
					render(
						parent,
						html`
							<span class="cover-art">
								<img class="missing-album" />
							</span>
						`,
					);
				} else {
					artwork = background_image
						.getAttribute('content')
						.replace('/ar0/', '/300x300/');

					render(
						parent,
						html`
							<span class="cover-art">
								<img src=${artwork} alt=${title} />
							</span>
						`,
					);
				}

				const listeners = doc.querySelector(
					'.header-new-info-desktop .header-metadata-tnew-display > p > abbr',
				);

				render(
					stats,
					html`
						${type}
						<span class="oracle-stat plays">
						    <span class="bleh-icon" />
						    ${listeners?.title.toLocaleString(lang)}
						</span>
					`,
				);
			})
			.catch((err) => {
				console.error('oracle', err);
				return;
			});
	}

	function oracle_error(
		response: XMLHttpRequestResponseType | Error | string,
	) {
		if (page.subpage != 'overview') return;

		if (typeof response == 'string') {
			info_panel?.after(html.node`
                <section class="oracle-error">
                    <div class="alert alert-error">
                        oracle: ${response}
                    </div>
                </section>
            `);
			return;
		}

		if (!response.status) {
			info_panel?.after(html.node`
                <section class="oracle-error">
                    <div class="alert alert-error">
                        oracle: ${
				response.message ? response.message : response
			}
                    </div>
                </section>
            `);
			return;
		}

		info_panel?.after(html.node`
            <section class="oracle-error">
                <div class="alert alert-error">
                    oracle: (Error ${response.status}) ${response.responseText}
                </div>
            </section>
        `);
	}

	function oracle_artist_fetch(data) {
		if (tries < 1) return;
		tries--;

		const url =
			`https://musicbrainz.org/ws/2/artist/${data.id}?inc=artist-credits+url-rels+annotation+artist-rels+work-rels+label-rels+release-groups`;

		log(
			`using url ${encodeURI(url)} with ${tries} tries available`,
			'oracle',
		);

		page.state.oracle_debug.artist_id = data.id;

		GM_xmlhttpRequest({
			method: 'GET',
			url,
			headers: {
				'User-Agent':
					`bleh/${version.build} <https://github.com/katelyynn/bleh>`,
				Accept: 'application/json',
			},
			onload: function (response) {
				if (response.status < 200 || response.status >= 300) {
					log('error fetching connect data', 'oracle', 'error', {
						response,
					});

					oracle_error(response);

					return;
				}

				let data;
				try {
					data = JSON.parse(response.responseText);
				} catch (e) {
					log('failed to parse', 'oracle', 'error', { e });

					oracle_error(e);

					return;
				}

				log('received connect artist data', 'oracle', 'info', { data });
				page.state.oracle = data;

				page.state.oracle_temp = {
					page: {
						name: page.name,
						sister: null,
						type: page.type,
					},
					...data,
				};
				log('saved temp', 'oracle', 'info', {
					temp: page.state.oracle_temp,
				});

				oracle_artist(data);
			},
			onerror: function (err) {
				console.error('oracle', err);

				setTimeout(() => {
					oracle_artist_fetch(data);
				}, mb_delay);
			},
		});
	}

	function oracle_artist(data) {
		if (page.subpage != 'overview') return;

		const area = data.area;
		const area_code = flag_candidates(data.country, area);
		const area_name = area?.name;

		const lifespan = data['life-span'];
		const begin = data['begin-area'];
		const end = data['end-area'];

		const begin_code = begin && begin['iso-3166-2-codes']
			? begin['iso-3166-2-codes'][0]?.split('-')[0]
			: null;
		const end_code = end && end['iso-3166-2-codes']
			? end['iso-3166-2-codes'][0]?.split('-')[0]
			: null;

		const artists_seen = new Set();
		const artists = data.relations
			.filter((relation) => relation.type == 'member of band')
			.filter((relation) => {
				const name = relation.artist.name;
				if (artists_seen.has(name)) return false;

				artists_seen.add(name);
				return true;
			});

		const labels_seen = new Set();
		const labels = data.relations
			.filter((relation) => relation['target-type'] == 'label')
			.filter((relation) => {
				if (!relation.label) return;

				const name = relation.label.name;
				if (labels_seen.has(name)) return false;

				labels_seen.add(name);
				return true;
			});

		console.info(
			'labels',
			labels,
			data.relations.filter((relation) =>
				relation['target-type'] == 'label'
			),
		);

		render(
			metadata!,
			html`
				<div class="metadata-column">
				    ${area
					? html.node`
                <div class="metadata-group">
                    <dt class="catalogue-metadata-heading">${
						tl(trans.origin)
					}</dt>
                    <dd class="catalogue-metadata-description has-flag">
                        ${flag(area_code)}
                        ${area_name}
                    </dd>
                </div>
                `
					: ''}
				    ${data.type == 'Person'
					? html.node`
                    ${
						lifespan.begin
							? html.node`
                    <div class="metadata-group ${
								begin_code || begin ? 'has-secondary-info' : ''
							}">
                        <dt class="catalogue-metadata-heading">${
								tl(trans.born)
							}</dt>
                        <dd class="catalogue-metadata-description has-age">
                            ${
								DateTime.fromISO(lifespan.begin).toLocaleString(
									DateTime.DATE_MED,
								)
							}
                            ${
								!lifespan.end
									? html.node`<span class="artist-age">(${
										age(lifespan.begin)
									})</span>`
									: ''
							}
                        </dd>
                        ${
								begin_code
									? html.node`
                        <dd class="catalogue-metadata-description has-flag secondary-info">
                            ${flag(begin_code)}
                            ${begin.name}
                        </dd>
                        `
									: begin
									? html.node`
                        <dd class="catalogue-metadata-description has-flag secondary-info">
                            ${flag(area_code)}
                            ${begin.name}
                        </dd>
                        `
									: ''
							}
                    </div>
                    `
							: ''
					}
                    ${
						lifespan.end
							? html.node`
                    <div class="metadata-group ${
								end_code || end ? 'has-secondary-info' : ''
							}">
                        <dt class="catalogue-metadata-heading">${
								tl(trans.died)
							}</dt>
                        <dd class="catalogue-metadata-description has-age">
                            ${
								DateTime.fromISO(lifespan.end).toLocaleString(
									DateTime.DATE_MED,
								)
							}
                            <span class="artist-age">(${
								age(lifespan.begin, lifespan.end)
							})</span>
                        </dd>
                        ${
								end_code
									? html.node`
                        <dd class="catalogue-metadata-description has-flag secondary-info">
                            ${flag(end_code)}
                            ${end.name}
                        </dd>
                        `
									: end
									? html.node`
                        <dd class="catalogue-metadata-description has-flag secondary-info">
                            ${flag(area_code)}
                            ${end.name}
                        </dd>
                        `
									: ''
							}
                    </div>
                    `
							: ''
					}
                `
					: html.node`
                    ${
						lifespan.begin
							? html.node`
                    <div class="metadata-group ${
								begin_code || begin ? 'has-secondary-info' : ''
							}">
                        <dt class="catalogue-metadata-heading">${
								tl(trans.formed)
							}</dt>
                        <dd class="catalogue-metadata-description has-age">
                            ${
								DateTime.fromISO(lifespan.begin).toLocaleString(
									DateTime.DATE_MED,
								)
							}
                        </dd>
                        ${
								begin_code
									? html.node`
                        <dd class="catalogue-metadata-description has-flag secondary-info">
                            ${flag(begin_code)}
                            ${begin.name}
                        </dd>
                        `
									: begin
									? html.node`
                        <dd class="catalogue-metadata-description has-flag secondary-info">
                            ${flag(area_code)}
                            ${begin.name}
                        </dd>
                        `
									: ''
							}
                    </div>
                    `
							: ''
					}
                    ${
						lifespan.end
							? html.node`
                    <div class="metadata-group ${
								end_code || end ? 'has-secondary-info' : ''
							}">
                        <dt class="catalogue-metadata-heading">${
								tl(trans.ended)
							}</dt>
                        <dd class="catalogue-metadata-description has-age">
                            ${
								DateTime.fromISO(lifespan.end).toLocaleString(
									DateTime.DATE_MED,
								)
							}
                        </dd>
                        ${
								end_code
									? html.node`
                        <dd class="catalogue-metadata-description has-flag secondary-info">
                            ${flag(end_code)}
                            ${end.name}
                        </dd>
                        `
									: end
									? html.node`
                        <dd class="catalogue-metadata-description has-flag secondary-info">
                            ${flag(area_code)}
                            ${end.name}
                        </dd>
                        `
									: ''
							}
                    </div>
                    `
							: ''
					}
                    ${
						artists.length > 0
							? html.node`
                    <div class="metadata-group">
                        <dt class="catalogue-metadata-heading">${
								tl(trans.artists)
							}</dt>
                        <dd class="catalogue-metadata-description group-artist-list">
                            ${
								artists.map((artist, i) => {
									const last = i == artists.length - 1;
									console.info('group artist', artist);

									return html.node`
                                    <span class="group-artist">
                                        <a class="group-artist-link" href="${root}music/${redirect()}${
										sanitise(artist.artist.name)
									}">${
										romanise(
											correct_artist(artist.artist.name),
										)
									}</a>${!last ? ',' : ''}
                                    </span>
                                `;
								})
							}
                        </dd>
                    </div>
                    `
							: ''
					}
                `}
				</div>
			`,
		);

		if (labels.length) {
			render(
				label_panel,
				html`
					©
					${labels.map((label, index) => {
						let label_elem;
						const elem = html.node`
                        <span class="music-label" ref=${(
							el,
						) => (label_elem = el)}>${label.label.name}</span>${
							index < labels.length - 1 ? ', ' : ''
						}
                    `;

						if (label.label.disambiguation != '') {
							tippy(label_elem, {
								content: label.label.disambiguation,
							});
						}

						return elem;
					})}
				`,
			);
		}
	}
}

export function oracle_data(force = false) {
	if (!(ff('oracle') && settings.oracle_beta)) return;

	let cached_artists = localStorage.getItem('oracle_artists');
	let cached_artists_expire = new Date(
		localStorage.getItem('oracle_artists_expire'),
	);

	let cached_albums = localStorage.getItem('oracle_albums');
	let cached_albums_expire = new Date(
		localStorage.getItem('oracle_albums_expire'),
	);

	let cached_tracks = localStorage.getItem('oracle_tracks');
	let cached_tracks_expire = new Date(
		localStorage.getItem('oracle_tracks_expire'),
	);

	let current_time = new Date();

	if (!cached_artists) {
		log('artists list is not cached, fetching', 'oracle');
		oracle_request('artists', true);
	} else {
		// we prefer to load the current cache before waiting for a new response
		parse(oracle_artists, cached_artists, 'artists');

		// is it valid?
		if (cached_artists_expire < current_time && !force) {
			oracle_request('artists');
		} else if (force) {
			oracle_request('artists', true);
		}
	}

	if (!cached_albums) {
		log('albums list is not cached, fetching', 'oracle');
		oracle_request('albums', true);
	} else {
		// we prefer to load the current cache before waiting for a new response
		parse(oracle_albums, cached_albums, 'albums');

		// is it valid?
		if (cached_albums_expire < current_time && !force) {
			oracle_request();
		} else if (force) {
			oracle_request('albums', true);
		}
	}

	if (!cached_tracks) {
		log('tracks list is not cached, fetching', 'oracle');
		oracle_request('tracks', true);
	} else {
		// we prefer to load the current cache before waiting for a new response
		parse(oracle_tracks, cached_tracks, 'tracks');

		// is it valid?
		if (cached_tracks_expire < current_time && !force) {
			oracle_request('tracks');
		} else if (force) {
			oracle_request('tracks', true);
		}
	}
}

function parse(value: {}, key: string, type: string) {
	try {
		Object.assign(value, parse_object(type, key));
	} catch (e) {
		notify({
			title: `Loading of oracle ${type} data failed`,
			body: 'Please report this as a bug',
			type: 'error',
			persist: true,
		});
	}
}

function oracle_request(type = 'albums', send_notify = false) {
	let xhr = new XMLHttpRequest();
	let url =
		`https://katelyynn.github.io/oracle/${type}.json?${Math.random()}`;
	xhr.open('GET', url, true);

	xhr.onload = function () {
		log(`${type} list responded with ${xhr.status}`, 'oracle');

		if (xhr.status != 200) {
			log(
				'request has been cancelled, will request again in 1h',
				'oracle',
			);
			api_expire.setHours(api_expire.getHours() + 1);
		}

		// set expire date
		let api_expire = new Date();

		if (xhr.status == 200) {
			if (type == 'artists') {
				parse(oracle_artists, this.response, 'artists');
			} else if (type == 'albums') {
				parse(oracle_albums, this.response, 'albums');
			} else {
				parse(oracle_tracks, this.response, 'tracks');
			}

			if (send_notify) {
				status({
					title: tl(trans.downloaded_value).replace(
						'{v}',
						`oracle ${tl(trans[type])}`,
					),
				});
			}

			// save to cache for next page load
			set_storage(`oracle_${type}`, this.response);
			api_expire.setHours(api_expire.getHours() + 4);
			log(`${type} list cached until ${api_expire}`, 'oracle');
		}

		set_storage(`oracle_${type}_expire`, api_expire);
	};

	xhr.send();
}

export function oracle_credits() {
	const relations = page.state.oracle?.relations;
	if (!relations) return;

	const flatten = (relations) => {
		return relations.reduce((acc, rel) => {
			acc.push(rel);

			if (rel.work?.relations?.length) {
				acc.push(...flatten(rel.work.relations));
			}

			return acc;
		}, []);
	};

	const list = (relations) => {
		return relations.reduce((acc, relation) => {
			if (!relation.artist) return acc;

			let type = relation.type;

			if (['programming', 'producer'].includes(type)) {
				type = 'mix';
			} else if (type.includes('instrument') || type == 'orchestrator') {
				type = 'recording';
			}

			const name = relation.artist.name;

			if (!acc[type]) {
				acc[type] = [];
			}

			let existing = acc[type].find((a) => a.name == name);

			if (!existing) {
				acc[type].push({
					name,
					attributes: relation.attributes
						? [...relation.attributes]
						: [],
				});
			} else {
				if (relation.attributes && relation.attributes.length) {
					const merged = new Set([
						...existing.attributes,
						...relation.attributes,
					]);
					existing.attributes = [...merged];
				}
			}

			return acc;
		}, {});
	};

	const order = [
		'vocal',
		'recording',
		'mix',
		'engineer',
		'writer',
	];

	const grouped = Object.entries(list(flatten(relations)))
		.sort(([a], [b]) => {
			const a_index = order.indexOf(a);
			const b_index = order.indexOf(b);

			if (a_index == -1) return 1;
			if (b_index == -1) return -1;

			return a_index - b_index;
		});

	console.info('oracle list', grouped, relations);

	dialog({
		id: 'oracle_credits',
		title: {
			html: tl(trans.credits_for_value, {
				v: `<i>${
					sanitise_text(
						romanise(
							correct_item_by_artist(page.name, page.sister),
						),
					)
				}</i>`,
			}),
		},
		body: html.node`
            <div class="oracle-credits">
                ${
			grouped.length == 0
				? html.node`
                <div class="loading-data-container">
                    <div class="loading-data-text failed">${
					tl(trans.oracle_no_credits)
				}</div>
                </div>
                `
				: grouped.map(([type, artists]) => {
					let text = trans.hasOwnProperty(`oracle_${type}`)
						? tl(trans[`oracle_${type}`])
						: `${type} (unknown, please report as bug)`;

					return html.node`
                        <div class="oracle-credit-group">
                            <h4 class="oracle-credit-group-title">${text}</h4>
                            <div class="oracle-credit-list">
                                ${
						artists.map((artist, i) => {
							const name = artist.name;
							const attributes = artist.attributes;
							const last = i == artists.length - 1;

							const info_box = html.node`
                                        <div class="oracle-info-box">
                                            ${icon({ name: icons.info })}
                                        </div>
                                    `;

							const elem = html.node`
                                        <div class="oracle-credit">
                                            <a class="oracle-credit-link" href="${root}music/${redirect()}${
								sanitise(name)
							}">${romanise(correct_artist(name))}</a>
                                            ${attributes.length ? info_box : ''}
                                            ${!last ? ', ' : ''}
                                        </div>
                                    `;

							if (attributes.length) {
								tippy(elem, {
									content: html.node`
                                                <span class="oracle-attributes">${
										attributes.join(', ')
									}</span>
                                            `,
								});
							}

							return elem;
						})
					}
                            </div>
                        </div>
                    `;
				})
		}
            </div>
        `,
	});
}

export function oracle_debug() {
	const debug = page.state.oracle_debug;
	log('debug', 'oracle', 'info', { debug });

	dialog({
		id: 'oracle_debug',
		title: 'oracle',
		body: html.node`
            <div class="setting-group">
                ${
			Object.entries(debug).map(([item, val]) => {
				let va;
				const entry = html.node`
                        <div class="setting" data-type="info">
                            <div class="heading">
                                <h5>${item}</h5>
                            </div>
                            <div class="info" ref=${(el) => (va = el)}>
                                <p>${val}</p>
                            </div>
                        </tr>
                    `;

				if (item == 'artist') {
					render(
						va,
						html`
							<p>type: ${val.type}</p>
							<p>name: ${val.name}</p>
							${val.type == 'id'
								? html.node`
                                <a
                                    class="see-more"
                                    href="https://musicbrainz.org/artist/${val.name}"
                                    target="_blank"
                                    >view</a
                                >
                                `
								: ''}
						`,
					);
				} else if (item == 'release_id') {
					render(
						va,
						html`
							<p>${val}</p>
							<a
								class="see-more"
								href="https://musicbrainz.org/release/${val}"
								target="_blank"
							>view</a>
						`,
					);
				} else if (item == 'recording_id') {
					render(
						va,
						html`
							<p>${val}</p>
							<a
								class="see-more"
								href="https://musicbrainz.org/recording/${val}"
								target="_blank"
							>view</a>
						`,
					);
				} else if (item == 'artist_id') {
					render(
						va,
						html`
							<p>${val}</p>
							<a
								class="see-more"
								href="https://musicbrainz.org/artist/${val}"
								target="_blank"
							>view</a>
						`,
					);
				}

				return entry;
			})
		}
                <div
                    class="setting"
                    data-type="info"
                    disabled=${
			!oracle_artists.version ||
			!oracle_albums.version ||
			!oracle_tracks.version
		}
                >
                    <div class="heading">
                        <h5>${tl(trans.current_version)}</h5>
                    </div>
                    <div class="info">
                        <p>
                            ${oracle_artists.version}, ${oracle_albums.version}, ${oracle_tracks.version}
                        </p>
                        <button
                            class="see-more update-check"
                            onclick=${() => oracle_data(true)}
                        >
                            ${tl(trans.update_check)}
                        </button>
                    </div>
                </div>
                <div
                    class="setting"
                    data-type="info"
                    disabled=${
			!oracle_artists.version ||
			!oracle_albums.version ||
			!oracle_tracks.version
		}
                >
                    <div class="heading">
                        <h5>${tl(trans.manage_data)}</h5>
                    </div>
                    <div class="info">
                        <button
                            class="see-more"
                            onclick=${() => manage_oracle_data()}
                        >
                            ${tl(trans.view_all)}
                        </button>
                    </div>
                </div>
            </div>
        `,
	});
}

export function manage_oracle_data() {
	const oracle = JSON.parse(localStorage.getItem('bleh_oracle_cache')) || {};

	console.info('oracle data', oracle);

	dialog({
		id: 'oracle',
		title: tl(trans.manage_data),
		body: html.node`
            <div class="data-table">
                ${
			Object.entries(oracle).map(([artist, data]) =>
				load_artist(artist, data)
			)
		}
            </div>
        `,
		allow_scroll: true,
	});

	function load_artist(artist, data) {
		const entry = html.node`
            <div class="data-table-entry">
                <div class="entry-header">
                    <strong class="entry-header-text">${artist}</strong>
                    <div class="entry-actions">
                        <button class="btn icon danger-subtle chibi" data-type="delete" onclick=${() =>
			delete_artist()}>${tl(trans.delete)}</button>
                    </div>
                </div>
                <div class="entry-data">
                    ${
			Object.entries(data).map(([item, data]) =>
				load_item(item, data, artist)
			)
		}
                </div>
            </div>
        `;

		function delete_artist() {
			delete oracle[artist];
			log('deleted artist', 'oracle', 'info', { artist, oracle });
			save_cache();
			entry.remove();
		}

		return entry;
	}

	function load_item(item, data, artist) {
		const entry = html.node`
            <div class="data-table-entry">
                <div class="entry-header">
                    <strong class="entry-header-text">${item}</strong>
                    <div class="entry-actions">
                        <button class="btn icon danger-subtle chibi" data-type="delete" onclick=${() =>
			delete_item()}>${tl(trans.delete)}</button>
                    </div>
                </div>
                <div class="entry-data">
                    ${
			data.album && Object.keys(data.album).length > 0
				? load_item_data('album', data.album, item, artist)
				: ''
		}
                    ${
			data.track && Object.keys(data.track).length > 0
				? load_item_data('track', data.track, item, artist)
				: ''
		}
                </div>
            </div>
        `;

		function delete_item() {
			delete oracle[artist][item];
			log('deleted item', 'oracle', 'info', { item, artist, oracle });
			save_cache();
			entry.remove();
		}

		return entry;
	}

	function load_item_data(type, data, item, artist) {
		const entry = html.node`
            <div class="data-table-entry">
                <div class="entry-header">
                    <strong class="entry-type">
                        ${icon({ name: icons[type] })}
                        ${type}
                    </strong>
                    <div class="entry-subdata">
                        ${
			data.date
				? html.node`
                            <div class="entry-data-row">
                                <strong class="entry-data-head">fetched:</strong>
                                <p class="entry-data-text">${
					DateTime.fromMillis(data.date).toRelative()
				}</p>
                            </div>
                        `
				: ''
		}
                        ${
			data.expire
				? html.node`
                            <div class="entry-data-row">
                                <strong class="entry-data-head">expires:</strong>
                                <p class="entry-data-text">${
					DateTime.fromMillis(data.expire).toRelative()
				}</p>
                            </div>
                        `
				: ''
		}
                    </div>
                    <div class="entry-actions">
                        <button class="btn icon danger-subtle chibi" data-type="delete" onclick=${() =>
			delete_item()}>${tl(trans.delete)}</button>
                    </div>
                </div>
                <div class="entry-subdata">
                    ${
			data.id
				? html.node`
                        <div class="entry-data-row">
                            <p>id: ${data.id}</p>
                        </div>
                    `
				: ''
		}
                    ${
			data.artwork
				? html.node`
                        <div class="entry-data-row">
                            <p>artwork</p>
                        </div>
                    `
				: ''
		}
                </div>
            </div>
        `;

		function delete_item() {
			delete oracle[artist][item][type];
			log('deleted item sub', 'oracle', 'info', {
				type,
				item,
				artist,
				oracle,
			});
			save_cache();
			entry.remove();
		}

		return entry;
	}

	function save_cache() {
		log('saved to cache', 'oracle', 'info', { oracle });
		set_storage('bleh_oracle_cache', JSON.stringify(oracle));
	}
}

function report_incorrect() {
	if (settings.tracklist_source != 'oracle' && page.type == 'album') {
		return;
	}

	let title = `${correct_artist(page.sister)} - ${
		correct_item_by_artist(page.name, page.sister)
	}`;
	let link = window.location.href;

	let sources;

	let template;

	if (page.type == 'track') {
		template = '1-incorrect-albums-assigned-to-track.yml';
	} else {
		template = '2-incorrect-album-listing.yml';
	}

	dialog({
		id: 'oracle_correction',
		title: tl(trans.suggest_correction),
		body: html.node`
            <div class="new-scrobble-form">
                <p class="generic-label">${tl(trans.what_did_you_expect)}</p>
                ${sources = input({
			type: 'textarea',
		})}
                <p class="form-tip">${
			tl(trans[`oracle_sources_tip_${page.type}`])
		}</p>
            </div>
            <div class="modal-footer">
                <button class="see-more cancel left-icon" onclick=${() =>
			dialog_rm({ id: 'oracle_correction' })}>
                    ${tl(trans.cancel)}
                </button>
                <div class="fill" />
                <button class="btn primary continue" onclick=${() => {
			open(
				`https://github.com/katelyynn/oracle/issues/new?template=${template}&title=${
					sanitise(title, ' ')
				}&link=${encodeURIComponent(link)}&sources=${
					sanitise(sources.value, ' ')
				}`,
			);
		}}>
                    ${tl(trans.suggest)}
                </button>
            </div>
        `,
	});
}
