/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { settings } from '@/build/config';
import { log } from '@/build/log.js';
import {
	album_track_corrections,
	artist_corrections,
	combined_artists,
	includes,
} from '@/build/music';
import { page, root } from '@/build/page';
import {
	desanitise,
	parse_object,
	return_artist_from_generic,
	romanise,
	sanitise,
	set_storage,
} from '@/build/tools';
import { tl, trans } from '@/build/trans';
import { render_setting_page } from '@/pages/bleh_settings/bleh_settings.js';
import { dialog, dialog_rm } from '@/components/dialog/dialog';
import { html, render } from 'lighterhtml';
import { redirect } from '@/components/music/music';
import { status } from '@/components/dialog/status';
import { input } from '@/components/settings/input';
import { notify } from '../dialog/notify';
import { useSettings } from '@/page.ts';

const flat_patterns: flat_pattern[] = [];

interface flat_pattern {
	group: string;
	pattern: string | RegExp;
	regex: boolean;
}

Object.entries(includes).forEach(([group, patterns]) => {
	patterns.forEach((pattern) => {
		flat_patterns.push({
			group,
			pattern,
			regex: pattern instanceof RegExp,
		});
	});
});

// prefer longest patterns first
flat_patterns.sort((a, b) => {
	const a_length = a.regex
		? (a.pattern as RegExp).source.length
		: (a.pattern as string).length;
	const b_length = b.regex
		? (b.pattern as RegExp).source.length
		: (b.pattern as string).length;

	return b_length - a_length;
});

log('finalised flat patterns', 'lotus', 'info', { flat_patterns });

export function lotus(force = false) {
	if (!useSettings.get('corrections')) return;

	let lotus_artist = localStorage.getItem('lotus_artist');
	let lotus_artist_expire = new Date(
		localStorage.getItem('lotus_artist_expire'),
	);

	let lotus_album_track = localStorage.getItem('lotus_album_track');
	let lotus_album_track_expire = new Date(
		localStorage.getItem('lotus_album_track_expire'),
	);

	let lotus_combined_artists = localStorage.getItem('lotus_combined_artists');
	let lotus_combined_artists_expire = new Date(
		localStorage.getItem('lotus_combined_artists_expire'),
	);

	let current_time = new Date();

	if (!lotus_artist) {
		log('artist list is not cached, fetching', 'lotus');
		lotus_request('artist', true);
	} else {
		// we prefer to load the current cache before waiting for a new response
		parse(artist_corrections, lotus_artist, 'artist');

		// is it valid?
		if (lotus_artist_expire < current_time && !force) {
			lotus_request();
		} else if (force) {
			lotus_request('artist', true);
		}
	}

	if (!lotus_album_track) {
		log('album track list is not cached, fetching', 'lotus');
		lotus_request('album_track', true);
	} else {
		// we prefer to load the current cache before waiting for a new response
		parse(album_track_corrections, lotus_album_track, 'album_track');

		// is it valid?
		if (lotus_album_track_expire < current_time && !force) {
			lotus_request('album_track');
		} else if (force) {
			lotus_request('album_track', true);
		}
	}

	if (!lotus_combined_artists) {
		log('combined artists list is not cached, fetching', 'lotus');
		lotus_request('combined_artists', true);
	} else {
		// we prefer to load the current cache before waiting for a new response
		parse(combined_artists, lotus_combined_artists, 'combined_artists');

		// is it valid?
		if (lotus_combined_artists_expire < current_time && !force) {
			lotus_request('combined_artists');
		} else if (force) {
			lotus_request('combined_artists', true, true);
		}
	}
}

function parse(value: {}, key: string, type: string) {
	try {
		Object.assign(value, parse_object(type, key));
	} catch (e) {
		notify({
			title: `Loading of lotus ${type} data failed`,
			body: 'Please report this as a bug',
			type: 'error',
			persist: true,
		});
	}
}

function lotus_request(
	type = 'artist',
	send_notify = false,
	refresh_page = false,
) {
	let button = document.body.querySelector('[onclick="_lotus_check()"]');
	if (button != null) button.setAttribute('disabled', '');

	let xhr = new XMLHttpRequest();
	let url = `https://katelyynn.github.io/lotus/${type}.json?${Math.random()}`;
	xhr.open('GET', url, true);

	xhr.onload = function () {
		log(`${type} list responded with ${xhr.status}`, 'lotus');

		if (xhr.status != 200) {
			log(
				'request has been cancelled, will request again in 1h',
				'lotus',
			);
			api_expire.setHours(api_expire.getHours() + 1);
		}

		// set expire date
		let api_expire = new Date();

		if (xhr.status == 200) {
			if (type == 'artist') {
				parse(artist_corrections, this.response, 'artist');
			} else if (type == 'album_track') {
				parse(album_track_corrections, this.response, 'album_track');
			} else {
				parse(combined_artists, this.response, 'combined_artists');
			}

			if (send_notify) {
				status({
					title: tl(trans.downloaded_value).replace(
						'{v}',
						tl(trans.lotus[type]),
					),
				});
			}

			// save to cache for next page load
			set_storage(`lotus_${type}`, this.response);
			api_expire.setHours(api_expire.getHours() + 4);
			log(`${type} list cached until ${api_expire}`, 'lotus');
		}

		set_storage(`lotus_${type}_expire`, api_expire);

		if (button != null) button.removeAttribute('disabled');

		if (refresh_page && page.type == 'bleh_settings') {
			render_setting_page('playback');
		}
	};

	xhr.send();
}

unsafeWindow._lotus_check = function () {
	lotus(true);
};

export function lotus_modal() {
	dialog({
		id: 'lotus',
		title: tl(trans.music_corrections),
		body: html.node`
            <table class="responsive-table">
                <thead>
                    <tr>
                        <th>${tl(trans.artist)}</th>
                        <th>${tl(trans.correction)}</th>
                    </tr>
                </thead>
                <tbody>
                    ${
			Object.entries(artist_corrections).map(([key, value]) => {
				if (key == 'version') return html.node``;

				return html.node`
                            <tr>
                                <td>
                                    ${key}
                                </td>
                                <td>
                                    ${value}
                                </td>
                            </tr>
                        `;
			})
		}
                </tbody>
            </table>
            <table class="responsive-table">
                <thead>
                    <tr>
                        <th>${tl(trans.albums_and_tracks)}</th>
                        <th>${tl(trans.correction)}</th>
                    </tr>
                </thead>
                <tbody>
                    ${
			Object.entries(album_track_corrections).flatMap(
				([artist, items]) => {
					if (artist == 'version') return html.node``;

					return Object.entries(items).map(([key, value]) =>
						html.node`
                            <tr>
                                <td>
                                    ${artist} - ${key}
                                </td>
                                <td>
                                    ${value}
                                </td>
                            </tr>
                        `
					);
				},
			)
		}
                </tbody>
            </table>
        `,
		type: 'corrections',
		allow_scroll: true,
	});
}

/**
 * correct capitalisation of a generic artist name combo
 * @param {string} parent individual css selector for each item wrapper
 * @returns if not found
 */
export function correct_generic_artist(parent) {
	if (!page.structure.container) return;

	let albums = page.structure.container.querySelectorAll(`.${parent}`);
	if (albums.length == 0) return;

	if (!useSettings.get('corrections')) return;

	albums.forEach((album) => {
		if (!album.hasAttribute('data-kate-processed')) {
			album.setAttribute('data-kate-processed', 'true');

			let artist_name = album.querySelector(
				`.${parent.replace('-details', '')}-name a`,
			);
			if (!artist_name) return;

			artist_name.textContent = romanise(
				correct_artist(artist_name.textContent),
			);
		}
	});
}
/**
 * correct capitalisation of a generic album/track name & artist combo
 * @param {string} parent individual css selector for each item wrapper
 * @returns if not found
 */
export function correct_generic_combo(parent) {
	if (!page.structure.container) return;

	let albums = page.structure.container.querySelectorAll(`.${parent}`);
	if (albums.length == 0) return;

	if (
		!useSettings.get('format_guest_features') &&
		!useSettings.get('corrections')
	) return;

	albums.forEach((album) => {
		if (!album.hasAttribute('data-kate-processed')) {
			album.setAttribute('data-kate-processed', 'true');

			try {
				let album_name = album.querySelector(
					`.${parent.replace('-details', '')}-name a`,
				);
				if (!album_name) return;

				let artist_name = album.querySelector(
					`.${parent.replace('-details', '')}-artist a`,
				);
				if (!artist_name) return;

				if (useSettings.get('format_guest_features')) {
					const formatted = name_includes(
						album_name.textContent,
						artist_name.textContent,
					);

					album_name.classList.add('smart-title');
					render(
						album_name,
						smart_title(formatted.song_title, formatted.song_tags),
					);
				} else if (useSettings.get('corrections')) {
					album_name.textContent = romanise(
						correct_item_by_artist(
							album_name.textContent,
							artist_name.textContent,
						),
					);
				}

				artist_name.textContent = romanise(
					correct_artist(artist_name.textContent),
				);
			} catch (e) {
				log('unable to correct generic combo', 'lotus', 'error', {
					e,
					album,
					html: album.innerHTML,
					format_guest_features: useSettings.get(
						'format_guest_features',
					),
					lotus: useSettings.get('corrections'),
				});
			}
		}
	});
}
/**
 * correct capitalisation of a generic album/track name (no artist field!!) combo
 * @param {string} parent individual css selector for each item wrapper
 * @returns if not found
 */
export function correct_generic_combo_no_artist(parent) {
	if (!page.structure.container) return;

	let albums = page.structure.container.querySelectorAll(`.${parent}`);
	if (albums.length == 0) return;

	if (
		!useSettings.get('format_guest_features') &&
		!useSettings.get('corrections')
	) return;

	albums.forEach((album) => {
		if (!album.hasAttribute('data-kate-processed')) {
			album.setAttribute('data-kate-processed', 'true');

			let album_name = album.querySelector(
				`.${parent.replace('-details', '')}-name a`,
			);
			if (!album_name) return;

			let artist_name = return_artist_from_generic(
				album_name.getAttribute('href'),
			);

			if (useSettings.get('format_guest_features')) {
				const formatted = name_includes(
					album_name.textContent,
					artist_name,
				);

				album_name.classList.add('smart-title');
				render(
					album_name,
					smart_title(formatted.song_title, formatted.song_tags),
				);
			} else if (useSettings.get('corrections')) {
				album_name.textContent = romanise(
					correct_item_by_artist(album_name.textContent, artist_name),
				);
			}
		}
	});
}

/**
 * correct item based on artist
 * @param {string} item either a track/album title
 * @param {string} artist artist name (is converted to lowercase)
 * @returns {string} corrected title if applicable or original title
 */
export function correct_item_by_artist(item, artist) {
	if (!useSettings.get('corrections')) return item;

	if (!artist) {
		log(
			'could not correct_item_by_artist, artist field is missing',
			'lotus',
			'error',
			{ item, artist },
		);
		return item;
	}

	artist = artist.toLowerCase();

	try {
		if (album_track_corrections.hasOwnProperty(artist)) {
			if (album_track_corrections[artist].hasOwnProperty(item)) {
				log(
					`corrected ${item} by ${artist} as ${
						album_track_corrections[artist][item]
					}`,
					'lotus',
				);
				return album_track_corrections[artist][item];
			} else {
				return item;
			}
		} else {
			return item;
		}
	} catch (e) {
		log(`correcting ${item} by ${artist}`, 'lotus');
		console.error(e);
		return item;
	}
}
/**
 * correct artist
 * @param {string} artist artist name (NOT converted to lowercase)
 * @param {boolean} broadcast save to page state correction status
 * @returns corrected artist if applicable or original artist
 */
export function correct_artist(artist, broadcast = false) {
	if (!useSettings.get('corrections')) return artist;

	try {
		if (artist_corrections.hasOwnProperty(artist)) {
			log(
				`corrected ${artist} as ${artist_corrections[artist]}`,
				'lotus',
			);
			if (broadcast) page.corrected = true;

			return artist_corrections[artist];
		} else {
			if (broadcast) page.corrected = false;

			return artist;
		}
	} catch (e) {
		log(`correcting ${artist}`, 'lotus');
		console.error(e);
		return artist;
	}
}

interface pattern_match {
	group: string;
	pattern: string | RegExp;
	regex: boolean;
	index: number;
	text: string | RegExp;
}

// feat.
export function name_includes(
	original_title: string,
	original_artist: string,
	inherit_guests = '',
) {
	// track if we applied an album/track correction
	let original_title_corrected = false;
	// start with the raw title, then apply any album_track_corrections
	let formatted_title = original_title;
	const artist_key = original_artist?.toLowerCase();
	if (
		album_track_corrections.hasOwnProperty(artist_key) &&
		useSettings.get('corrections')
	) {
		const corr_map = album_track_corrections[artist_key];
		if (corr_map.hasOwnProperty(formatted_title)) {
			formatted_title = corr_map[formatted_title];
			log(
				`corrected ${original_title} by ${original_artist} as ${formatted_title}`,
				'lotus',
			);
			original_title_corrected = true;
		}
	}

	const lower_title = formatted_title.toLowerCase();
	// find all tag‐matches (index ≥ 1), with special remaster logic
	// due to Nirvana nonsense such as 20th Anniversary Remaster etc.
	const matches: pattern_match[] = flat_patterns
		.flatMap(({ group, pattern, regex }) => {
			if (regex) {
				pattern = pattern as RegExp;
				const safe_pattern = pattern.global
					? pattern
					: new RegExp(pattern.source, pattern.flags + 'g');

				return [...lower_title.matchAll(safe_pattern)].map((m) => ({
					group,
					pattern,
					regex,
					index: m.index,
					text: m[0],
				}));
			} else {
				pattern = pattern as string;
				const index = lower_title.indexOf(pattern.toLowerCase());

				return index >= 0
					? [{
						group,
						pattern,
						regex,
						index,
						text: pattern,
					}]
					: [];
			}
		})
		.filter((match: pattern_match) => {
			if (match.index < 1) return false;

			return !(
				match.group === 'remasters' &&
				!lower_title.includes(' remaster') &&
				!lower_title.includes('(remaster')
			);
		})
		.sort((a: pattern_match, b: pattern_match) => a.index - b.index);

	log('found tag matches', 'lotus', 'info', { lower_title, matches });

	// apply any artist corrections
	if (
		artist_corrections.hasOwnProperty(original_artist) &&
		useSettings.get('corrections')
	) {
		original_artist = correct_artist(artist_corrections[original_artist]);
	}

	// everything before the first tag
	let cleaned_title = formatted_title;
	let extras = [];
	if (matches.length > 0) {
		cleaned_title = formatted_title
			.slice(0, matches[0].index)
			.trim()
			.replace(/[\(\[\{]+$/, '')
			.trim();

		// extract each tag block
		extras = matches.map((match, i) => {
			const start = match.index;
			const end = i + 1 < matches.length
				? matches[i + 1].index
				: formatted_title.length;
			const tag_text = formatted_title
				.slice(start, end)
				.replace(/^[\(\[\{\)\]\}\-\:\s]+|[\(\[\{\)\]\}\-\:\s]+$/g, '')
				.trim();
			return {
				group: match.group,
				text: tag_text,
			};
		});
	}

	// collect all guest artists
	let song_guests = [];

	if (inherit_guests) {
		song_guests = inherit_guests
			.split(';')
			.map((artist) => desanitise(artist, ' '));
	}

	extras.forEach((extra) => {
		if (extra.group != 'guests') return;
		let normalised = extra.text
			.replace(/\b(?:feat|ft|featuring)\.?\b/gi, '')
			.replace(/\bwith\b/gi, '')
			.replace(/w\//gi, '')
			.replace(/&/g, ';')
			.replace(/, /g, ';')
			.replace(/ and /gi, ';')
			.replace(/- /g, '')
			.replace(/,;/g, ';')
			.replace(/^[\.\-\s;]+/, '')
			.trim();

		// artists with commas in their title can mistakenly be separated
		// into multiple artists, so we fix them manually
		// see Tyler, The Creator
		for (const [key, value] of Object.entries(combined_artists)) {
			if (key == 'version') continue;

			// passing thru regex, so
			const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

			const regex = new RegExp(escaped, 'gi');

			normalised = normalised.replace(regex, value);
		}

		const guests = normalised
			.split(/;+/)
			.map((s) => s.trim())
			.filter(Boolean)
			.map(correct_artist);
		song_guests.push(...guests);
	});

	const result = {
		song_title: cleaned_title,
		song_tags: extras,
		song_artist: original_artist,
		song_guests: song_guests,
		corrected_title: formatted_title,
	};

	log('finalised', 'lotus', 'log', { result });
	return result;
}

export function smart_title(song_title: string, song_tags, in_header = false) {
	const show_features = useSettings.get('show_guest_features');
	const show_remaster = useSettings.get('show_remaster_tags');

	return html`
		<span class="title">${fancy_title(
			romanise(song_title.trim()),
			in_header,
		)}</span>
		${song_tags.map((tag) => {
			if (
				(!show_features && tag.group == 'guests') ||
				(!show_remaster && tag.group == 'remasters')
			) {
				return html.node``;
			}

			return html.node`
                <span class="feat" data-tag-type=${tag.type} data-tag-group=${tag.group}>${
				romanise(tag.text)
			}</span>
            `;
		})}
	`;
}

export function fancy_title(song_title: string, in_header: boolean) {
	const dollar = page.name == 'WOR$T GIRL IN AMERICA' &&
		page.sister == 'Slayyyter';
	const brat = page.name.toLowerCase().startsWith('brat') &&
		page.sister.toLowerCase() == 'charli xcx';

	const elem = html.node`
        <span class="fancy-title">${song_title}</span>
    `;

	console.info('fancy title', elem);

	if (dollar) {
		elem.innerHTML = elem.innerHTML.replace(
			/\$/g,
			'<i class="dollar">$</i>',
		);
	}

	if (brat && in_header) {
		render(
			elem,
			html`
				<span class="brat">${song_title}</span>
			`,
		);
	}

	return elem;
}

export function smart_artists(song_artist, song_guests) {
	// scuffed but if its on one line the comma wont be fucked up
	return html`
		<a href="${root}music/${redirect()}${sanitise(song_artist)}">${romanise(
			song_artist,
		)}</a>${song_guests.map((guest) =>
			html.node`,<a href="${root}music/${redirect()}${sanitise(guest)}">${
				romanise(guest)
			}</a>
        `
		)}
	`;
}

export function create_correction(
	type,
	name = page.name,
	sister = page.sister,
	existing = false,
) {
	let title;
	let current = name;
	let link = window.location.href;

	let correction;
	let sources;

	let template;

	if (type == 'artist') {
		title = sister;
		template = '1-artist.yml';
	} else {
		title = `${sister} - ${name}`;
		template = '2-album_track.yml';
	}

	let capitalised = name;
	if (type == 'artist') {
		capitalised = correct_artist(name);
	} else {
		capitalised = correct_item_by_artist(name, sister);
	}

	dialog({
		id: 'lotus_correction',
		title: tl(trans.suggest_correction),
		body: html.node`
            ${
			existing
				? html.node`
                <div class="alert alert-warning">
                    <p>${tl(trans.alert_of_correction, { t: capitalised })}</p>
                </div>
            `
				: ''
		}
            <div class="new-scrobble-form">
                <p class="generic-label">${tl(trans.current)}</p>
                ${
			input({
				type: 'text',
				value: current,
				disabled: true,
			})
		}
                <p class="form-tip">${tl(trans.current_tip)}</p>
                <p class="generic-label">${tl(trans.correction)}</p>
                ${(correction = input({
			type: 'text',
			value: current,
			placeholder: current,
			warn_if_empty: true,
			warn_if_not_matching_lower: current.toLowerCase(),
		}))}
                <p class="form-tip">${tl(trans.correction_tip)}</p>
                <p class="generic-label">${tl(trans.sources)}</p>
                ${(sources = input({
			type: 'textarea',
		}))}
                <p class="form-tip">${tl(trans.sources_tip)}</p>
            </div>
            <div class="modal-footer">
                <button class="see-more cancel left-icon" onclick=${() =>
			dialog_rm({ id: 'lotus_correction' })}>
                    ${tl(trans.cancel)}
                </button>
                <div class="fill" />
                <button class="btn primary continue" onclick=${() => {
			open(
				`https://github.com/katelyynn/lotus/issues/new?template=${template}&title=${
					sanitise(title, ' ')
				}&current=${sanitise(current, ' ')}&correction=${
					sanitise(correction.value, ' ')
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
