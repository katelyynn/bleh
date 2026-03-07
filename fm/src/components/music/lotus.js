//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { settings } from '@/build/config';
import { log } from '@/build/log.js';
import {
    album_track_corrections,
    artist_corrections,
    combined_artists,
    includes
} from '@/build/music.js';
import { page, root } from '@/build/page';
import {
    desanitise,
    return_artist_from_generic,
    romanise,
    sanitise,
    set_storage
} from '@/build/tools';
import { tl, trans } from '@/build/trans';
import { prepare_corrections_page, render_setting_page } from '@/pages/bleh_settings/bleh_settings.js';
import { dialog, dialog_rm } from '@/components/dialog/dialog';
import { html, render } from 'lighterhtml';
import { redirect } from '@/components/music/music';
import { status } from '@/components/dialog/status';
import { input } from '@/components/settings/input';

const flat_patterns = [];

Object.entries(includes).forEach(([group, patterns]) => {
    patterns.forEach((pattern) => {
        flat_patterns.push({
            group,
            pattern,
            regex: pattern instanceof RegExp
        });
    });
});

// prefer longest patterns first
flat_patterns.sort((a, b) => {
    const a_length = a.regex ? a.pattern.source.length : a.pattern.length;
    const b_length = b.regex ? b.pattern.source.length : b.pattern.length;

    return b_length - a_length;
});

log('finalised flat patterns', 'lotus', 'info', { flat_patterns });

export function lotus(force = false) {
    if (!settings.corrections) return;

    let lotus_artist = localStorage.getItem('lotus_artist');
    let lotus_artist_expire = new Date(
        localStorage.getItem('lotus_artist_expire')
    );

    let lotus_album_track = localStorage.getItem('lotus_album_track');
    let lotus_album_track_expire = new Date(
        localStorage.getItem('lotus_album_track_expire')
    );

    let lotus_combined_artists = localStorage.getItem('lotus_combined_artists');
    let lotus_combined_artists_expire = new Date(
        localStorage.getItem('lotus_combined_artists_expire')
    );

    let current_time = new Date();

    if (!lotus_artist) {
        log('artist list is not cached, fetching', 'lotus');
        lotus_request('artist', true);
    } else {
        // we prefer to load the current cache before waiting for a new response
        Object.assign(artist_corrections, JSON.parse(lotus_artist));

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
        Object.assign(album_track_corrections, JSON.parse(lotus_album_track));

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
        Object.assign(combined_artists, JSON.parse(lotus_combined_artists));

        // is it valid?
        if (lotus_combined_artists_expire < current_time && !force) {
            lotus_request('combined_artists');
        } else if (force) {
            lotus_request('combined_artists', true, true);
        }
    }
}

function lotus_request(type = 'artist', send_notify = false, refresh_page = false) {
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
                'lotus'
            );
            api_expire.setHours(api_expire.getHours() + 1);
        }

        // set expire date
        let api_expire = new Date();

        if (xhr.status == 200) {
            if (type == 'artist') {
                Object.assign(artist_corrections, JSON.parse(this.response));
            } else if (type == 'album_track') {
                Object.assign(
                    album_track_corrections,
                    JSON.parse(this.response)
                );
            } else {
                Object.assign(combined_artists, JSON.parse(this.response));
            }

            if (send_notify)
                status({
                    title: tl(trans.downloaded_value).replace(
                        '{v}',
                        tl(trans.lotus[type])
                    )
                });

            // save to cache for next page load
            set_storage(`lotus_${type}`, this.response);
            api_expire.setHours(api_expire.getHours() + 4);
            log(`${type} list cached until ${api_expire}`, 'lotus');
        }

        set_storage(`lotus_${type}_expire`, api_expire);

        if (button != null) button.removeAttribute('disabled');

        if (refresh_page && page.type == 'bleh_settings') render_setting_page('playback');
    };

    xhr.send();
}

unsafeWindow._lotus_check = function () {
    lotus(true);
};

unsafeWindow._open_correction_modal = function () {
    dialog({
        id: 'corrections',
        title: tl(trans.music_corrections),
        body: html.node`
            <h4>${tl(trans.artists)}</h4>
            <div class="corrections artist" id="corrections-artist"></div>
            <h4>${tl(trans.albums_and_tracks)}</h4>
            <div class="corrections album_tracks" id="corrections-albums_tracks"></div>
        `,
        has_close: true,
        type: 'corrections',
        allow_scroll: true
    });

    prepare_corrections_page();
};

/**
 * correct capitalisation of a generic artist name combo
 * @param {string} parent individual css selector for each item wrapper
 * @returns if not found
 */
export function correct_generic_artist(parent) {
    let albums = document.body.querySelectorAll(`.${parent}`);
    if (albums.length == 0) return;

    if (!settings.corrections) return;

    albums.forEach((album) => {
        if (!album.hasAttribute('data-kate-processed')) {
            album.setAttribute('data-kate-processed', 'true');

            let artist_name = album.querySelector(
                `.${parent.replace('-details', '')}-name a`
            );
            if (!artist_name) return;

            artist_name.textContent = romanise(
                correct_artist(artist_name.textContent)
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
    let albums = document.body.querySelectorAll(`.${parent}`);
    if (albums.length == 0) return;

    if (!settings.format_guest_features && !settings.corrections) return;

    albums.forEach((album) => {
        if (!album.hasAttribute('data-kate-processed')) {
            album.setAttribute('data-kate-processed', 'true');

            let album_name = album.querySelector(
                `.${parent.replace('-details', '')}-name a`
            );
            if (!album_name) return;

            let artist_name = album.querySelector(
                `.${parent.replace('-details', '')}-artist a`
            );

            if (!artist_name) return;

            if (settings.format_guest_features) {
                const formatted = name_includes(
                    album_name.textContent,
                    artist_name.textContent
                );

                album_name.classList.add('smart-title');
                render(album_name, smart_title(formatted[0], formatted[1]));
            } else if (settings.corrections) {
                album_name.textContent = romanise(
                    correct_item_by_artist(
                        album_name.textContent,
                        artist_name.textContent
                    )
                );
            }

            artist_name.textContent = romanise(
                correct_artist(artist_name.textContent)
            );
        }
    });
}
/**
 * correct capitalisation of a generic album/track name (no artist field!!) combo
 * @param {string} parent individual css selector for each item wrapper
 * @returns if not found
 */
export function correct_generic_combo_no_artist(parent) {
    let albums = document.body.querySelectorAll(`.${parent}`);
    if (albums.length == 0) return;

    if (!settings.format_guest_features && !settings.corrections) return;

    albums.forEach((album) => {
        if (!album.hasAttribute('data-kate-processed')) {
            album.setAttribute('data-kate-processed', 'true');

            let album_name = album.querySelector(
                `.${parent.replace('-details', '')}-name a`
            );
            if (!album_name) return;

            let artist_name = return_artist_from_generic(
                album_name.getAttribute('href')
            );

            if (settings.format_guest_features) {
                const formatted = name_includes(
                    album_name.textContent,
                    artist_name
                );

                album_name.classList.add('smart-title');
                render(album_name, smart_title(formatted[0], formatted[1]));
            } else if (settings.corrections) {
                album_name.textContent = romanise(
                    correct_item_by_artist(album_name.textContent, artist_name)
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
    if (!settings.corrections) return item;

    if (!artist) {
        log('could not correct_item_by_artist, artist field is missing', 'lotus', 'error', { item, artist });
        return item;
    }

    artist = artist.toLowerCase();

    try {
        if (album_track_corrections.hasOwnProperty(artist)) {
            if (album_track_corrections[artist].hasOwnProperty(item)) {
                log(
                    `corrected ${item} by ${artist} as ${album_track_corrections[artist][item]}`,
                    'lotus'
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
    if (!settings.corrections) return artist;

    try {
        if (artist_corrections.hasOwnProperty(artist)) {
            log(
                `corrected ${artist} as ${artist_corrections[artist]}`,
                'lotus'
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

// feat.
export function name_includes(
    original_title,
    original_artist,
    inherit_guests = ''
) {
    // track if we applied an album/track correction
    let original_title_corrected = false;
    // start with the raw title, then apply any album_track_corrections
    let formatted_title = original_title;
    const artist_key = original_artist?.toLowerCase();
    if (
        album_track_corrections.hasOwnProperty(artist_key) &&
        settings.corrections
    ) {
        const corr_map = album_track_corrections[artist_key];
        if (corr_map.hasOwnProperty(formatted_title)) {
            formatted_title = corr_map[formatted_title];
            log(
                `corrected ${original_title} by ${original_artist} as ${formatted_title}`,
                'lotus'
            );
            original_title_corrected = true;
        }
    }

    const lower_title = formatted_title.toLowerCase();
    // find all tag‐matches (index ≥ 1), with special remaster logic
    // due to Nirvana nonsense such as 20th Anniversary Remaster etc.
    const matches = flat_patterns
        .map(({ group, pattern, regex }) => {
            let index = -1;

            if (regex) {
                const match = lower_title.match(pattern);
                index = match ? match.index : -1;
            } else {
                index = lower_title.indexOf(pattern.toLowerCase());
            }

            return {
                group,
                pattern,
                regex,
                index
            };
        })
        .filter((match) => {
            if (match.index < 1) return false;

            return !(
                match.group === 'remasters' &&
                !lower_title.includes(' remaster') &&
                !lower_title.includes('(remaster')
            );
        })
        .sort((a, b) => a.index - b.index);

    log('found tag matches', 'lotus', 'info', { lower_title, matches });

    // apply any artist corrections
    if (
        artist_corrections.hasOwnProperty(original_artist) &&
        settings.corrections
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
            const end =
                i + 1 < matches.length ?
                    matches[i + 1].index
                :   formatted_title.length;
            const tag_text = formatted_title
                .slice(start, end)
                .replace(/^[\(\[\{\)\]\}\-\:\s]+|[\(\[\{\)\]\}\-\:\s]+$/g, '')
                .trim();
            return {
                group: match.group,
                text: tag_text
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

    const result = [
        cleaned_title,
        extras,
        original_artist,
        song_guests,
        original_title_corrected
    ];

    log('finalised', 'lotus', 'log', { result });
    return result;
}

export function smart_title(song_title, song_tags) {
    const show_features = settings.show_guest_features;
    const show_remaster = settings.show_remaster_tags;

    return html`
        <div class="title">${romanise(song_title.trim())}</div>
        ${song_tags.map((tag) => {
            if (
                (!show_features && tag.group == 'guests') ||
                (!show_remaster && tag.group == 'remasters')
            ) {
                return html.node``;
            }

            return html.node`
                <div class="feat" data-tag-type=${tag.type} data-tag-group=${tag.group}>${romanise(tag.text)}</div>
            `;
        })}
    `;
}

export function smart_artists(song_artist, song_guests) {
    return html`
        <a href="${root}music/${redirect()}${sanitise(song_artist)}">${romanise(song_artist)}</a>
        ${song_guests.map(
            (guest) => html.node`
                ,<a href="${root}music/${redirect()}${sanitise(guest)}">${romanise(guest)}</a>
            `
        )}
    `;
}

export function artist_title() {
    let title = document.body.querySelector('.header-new-title');
    let title_text = title.textContent.trim();

    let has_multi = false;
    if (title_text.includes(', ') || title_text.includes('&')) has_multi = true;

    page.multi = false;

    if (!has_multi) {
        if (!settings.corrections) {
            title.textContent = romanise(title_text);
            return;
        }

        title.textContent = romanise(correct_artist(title_text, true));
    } else {
        title_text = title_text
            .replaceAll('&', ';')
            .replaceAll(', ', ';')
            .replaceAll(';;', ';');

        for (const [key, value] of Object.entries(combined_artists)) {
            if (key == 'version') continue;

            // passing thru regex, so
            const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            const regex = new RegExp(escaped, 'gi');

            title_text = title_text.replace(regex, value);
        }

        page.multi = true;
        title.innerHTML = '';

        let split = title_text.split(';');

        if (split.length < 2) {
            page.multi = false;

            if (!settings.corrections) return;

            title.textContent = romanise(correct_artist(title_text, true));

            return;
        }

        split.forEach((artist, index) => {
            if (index > 0) title.innerHTML += ',';

            artist = artist.trim();

            let part = document.createElement('a');
            part.classList.add('multi-artist-part');
            part.setAttribute(
                'href',
                `${root}music/${redirect()}${sanitise(artist)}`
            );

            if (settings.corrections)
                part.textContent = romanise(correct_artist(artist));
            else part.textContent = romanise(artist);

            title.appendChild(part);
        });
    }
}

export function patch_header_title() {
    page.suggest = null;

    if (!settings.corrections && !settings.format_guest_features && !page.multi)
        return;

    page.corrected = false;

    let track_title = document.body.querySelector('.header-new-title');
    let track_artist = document.body.querySelector('.header-new-crumb span');

    if (!track_title) return;

    // correct artist
    if (track_artist) {
        // album/track page
        if (artist_corrections.hasOwnProperty(track_artist.textContent)) {
            let corrected_artist = artist_corrections[track_artist.textContent];
            log(
                `corrected ${track_artist.textContent} as ${corrected_artist}`,
                'lotus'
            );

            track_artist.parentElement.setAttribute(
                'href',
                `${root}music/${redirect()}${sanitise(track_artist.textContent)}`
            );
            track_artist.textContent = romanise(corrected_artist);
        } else {
            track_artist.parentElement.setAttribute(
                'href',
                `${root}music/${redirect()}${sanitise(track_artist.textContent)}`
            );
            track_artist.textContent = romanise(track_artist.textContent);
        }
    }

    if (settings.format_guest_features) {
        try {
            if (!track_title.hasAttribute('data-kate-processed')) {
                track_title.setAttribute('data-kate-processed', 'true');

                let formatted_title = name_includes(
                    track_title.textContent,
                    track_artist.textContent
                );
                let song_title = formatted_title[0];
                let song_tags = formatted_title[1];

                page.corrected = formatted_title[4];

                // combine
                render(track_title, smart_title(song_title, song_tags));

                // (spotify) / (explicit) / (clean) in title
                if (song_tags.some((tag) => tag.group == 'form'))
                    page.suggest = sanitise(song_title.trim());

                let song_artist_element = document.body.querySelector(
                    'span[itemprop="byArtist"]'
                );
                let song_guests = formatted_title[3];
                page.sister_others = formatted_title[3];
                song_artist_element.innerHTML =
                    song_artist_element.innerHTML.trim();
                for (let guest in song_guests) {
                    // &
                    song_artist_element.innerHTML = `${song_artist_element.innerHTML},`;

                    // no whitespace to make sure it looks correct
                    song_artist_element.appendChild(html.node`
                    <a class="header-new-crumb" href="${root}music/${redirect()}${sanitise(song_guests[guest])}">${romanise(song_guests[guest])}</a>
                `);
                }
            }
        } catch (e) {}
    } else {
        if (!track_title.hasAttribute('data-kate-processed')) {
            track_title.setAttribute('data-kate-processed', 'true');

            let corrected_title = correct_item_by_artist(
                track_title.textContent,
                track_artist.textContent
            );
            log(
                `corrected ${track_title.textContent} by ${track_artist.textContent} as ${corrected_title}`,
                'lotus'
            );

            if (corrected_title != track_title.textContent)
                page.corrected = true;

            track_title.textContent = romanise(corrected_title);
        }
    }
}

export function create_correction(
    type,
    name = page.name,
    sister = page.sister
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

    dialog({
        id: 'lotus_correction',
        title: tl(trans.suggest_correction),
        body: html.node`
            <div class="new-scrobble-form">
                <p class="generic-label">${tl(trans.current)}</p>
                ${input({
                    type: 'text',
                    value: current,
                    disabled: true
                })}
                <p class="form-tip">${tl(trans.current_tip)}</p>
                <p class="generic-label">${tl(trans.correction)}</p>
                ${(correction = input({
                    type: 'text',
                    value: current,
                    placeholder: current,
                    warn_if_empty: true,
                    warn_if_not_matching_lower: current.toLowerCase()
                }))}
                <p class="form-tip">${tl(trans.correction_tip)}</p>
                <p class="generic-label">${tl(trans.sources)}</p>
                ${(sources = input({
                    type: 'textarea'
                }))}
                <p class="form-tip">${tl(trans.sources_tip)}</p>
            </div>
            <div class="modal-footer">
                <button class="see-more cancel left-icon" onclick=${() => dialog_rm({ id: 'lotus_correction' })}>
                    ${tl(trans.cancel)}
                </button>
                <div class="fill" />
                <button class="btn primary continue" onclick=${() => {
                    open(
                        `https://github.com/katelyynn/lotus/issues/new?template=${template}&title=${sanitise(title, ' ')}&current=${sanitise(current, ' ')}&correction=${sanitise(correction.value, ' ')}&link=${encodeURIComponent(link)}&sources=${sanitise(sources.value, ' ')}`
                    );
                }}>
                    ${tl(trans.suggest)}
                </button>
            </div>
        `
    });
}
