import { settings } from "../build/config";
import { log } from "../build/log";
import { album_track_corrections, artist_corrections, includes } from "../build/music";
import { page, root } from "../build/page";
import { return_artist_from_generic, sanitise, sanitise_text } from "../build/tools";
import { lang, trans_legacy, trans, tl } from "../build/trans";
import { prepare_corrections_page } from "../pages/bleh_config";
import { clean_message } from "../pages/moderation";
import { dialog } from "./dialog";
import { notify } from "./notify";

export function lotus(force = false) {
    if (!settings.corrections)
        return;

    let lotus_artist = localStorage.getItem('lotus_artist');
    let lotus_artist_expire = new Date(localStorage.getItem('lotus_artist_expire'));

    let lotus_album_track = localStorage.getItem('lotus_album_track');
    let lotus_album_track_expire = new Date(localStorage.getItem('lotus_album_track_expire'));

    let current_time = new Date();

    if (lotus_artist == null) {
        console.info('lotus - artist list is not cached, fetching');
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

    if (lotus_album_track == null) {
        console.info('lotus - album_track list is not cached, fetching');
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
}

function lotus_request(type = 'artist', send_notify = false) {
    let button = document.body.querySelector('[onclick="_lotus_check()"]');
    if (button != null)
        button.setAttribute('disabled', '');

    let xhr = new XMLHttpRequest();
    let url = `https://katelyynn.github.io/lotus/${type}.json?${Math.random()}`;
    xhr.open('GET',url,true);

    xhr.onload = function() {
        log(`${type} list responded with ${xhr.status}`, 'lotus');

        if (xhr.status != 200) {
            log('request has been cancelled, will request again in 1h', 'lotus');
            api_expire.setHours(api_expire.getHours() + 1);
        }

        // set expire date
        let api_expire = new Date();

        if (xhr.status == 200) {
            if (type == 'artist') {
                Object.assign(artist_corrections, JSON.parse(this.response));
            } else {
                Object.assign(album_track_corrections, JSON.parse(this.response));
            }

            if (send_notify) {
                notify({
                    title: trans_legacy[lang].lotus[type],
                    icon: 'icon-16-lotus',
                    classname: 'lotus'
                });
            }

            // save to cache for next page load
            localStorage.setItem(`lotus_${type}`, this.response);
            api_expire.setHours(api_expire.getHours() + 4);
            log(`${type} list cached until ${api_expire}`, 'lotus');
        }

        localStorage.setItem(`lotus_${type}_expire`, api_expire);

        if (button != null)
            button.removeAttribute('disabled');
    }

    xhr.send();
}


unsafeWindow._lotus_check = function() {
    lotus(true);
}


unsafeWindow._open_correction_modal = function() {
    dialog({
        id: 'corrections',
        title: trans_legacy[lang].settings.corrections.name,
        body: (`
            <h4>${trans_legacy[lang].settings.corrections.listing.artists}</h4>
            <div class="corrections artist" id="corrections-artist"></div>
            <h4>${trans_legacy[lang].settings.corrections.listing.albums_tracks}</h4>
            <div class="corrections album_tracks" id="corrections-albums_tracks"></div>
        `),
        has_close: true,
        type: 'corrections',
        allow_scroll: true
    });

    prepare_corrections_page();
}


/**
     * correct capitalisation of a generic album/track name & artist combo
     * @param {string} parent individual css selector for each item wrapper
     * @returns if not found
     */
export function correct_generic_combo(parent) {
    let albums = document.body.querySelectorAll(`.${parent}`);

    if (albums == undefined)
        return;

    if (!settings.corrections)
        return;

    albums.forEach((album) => {
        if (!album.hasAttribute('data-kate-processed')) {
            album.setAttribute('data-kate-processed','true');

            let album_name = album.querySelector(`.${parent.replace('-details','')}-name a`);

            if (album_name == null)
                return;

            let artist_name = album.querySelector(`.${parent.replace('-details','')}-artist a`);

            if (artist_name == undefined)
                return;

            let corrected_album_name = correct_item_by_artist(album_name.textContent, artist_name.textContent);
            let corrected_artist_name = correct_artist(artist_name.textContent);

            album_name.textContent = corrected_album_name;
            artist_name.textContent = corrected_artist_name;
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

    if (albums == null)
        return;

    albums.forEach((album) => {
        if (!album.hasAttribute('data-kate-processed')) {
            album.setAttribute('data-kate-processed','true');

            let album_name = album.querySelector(`.${parent.replace('-details','')}-name a`);

            if (album_name == null)
                return;

            let artist_name = return_artist_from_generic(album_name.getAttribute('href'));

            let corrected_album_name = correct_item_by_artist(album_name.textContent, artist_name);
            album_name.textContent = corrected_album_name;
        }
    });
}


// correction handler
/**
 * correct item based on artist
 * @param {string} item either a track/album title
 * @param {string} artist artist name (is converted to lowercase)
 * @returns corrected title if applicable or original title
 */
export function correct_item_by_artist(item, artist, type = "album_title") {
    if (!settings.corrections)
        return clean_message(item, type);
    artist = artist.toLowerCase();

    try {
        if (album_track_corrections.hasOwnProperty(artist)) {
            if (album_track_corrections[artist].hasOwnProperty(item)) {
                log(`corrected ${item} by ${artist} as ${album_track_corrections[artist][item]}`, 'lotus');
                return clean_message(album_track_corrections[artist][item], "track_title");
            } else {
                return clean_message(item, type);
            }
        } else {
            return clean_message(item, type);
        }
    } catch(e) {
        log(`correcting ${item} by ${artist}`, 'lotus');
        console.error(e);
        return clean_message(item, type);
    }
}
/**
 * correct artist
 * @param {string} artist artist name (NOT converted to lowercase)
 * @returns corrected artist if applicable or original artist
 */
export function correct_artist(artist, broadcast = false) {
    if (!settings.corrections)
        return clean_message(artist, "artist_name");

    try {
        if (artist_corrections.hasOwnProperty(artist)) {
            log(`corrected ${artist} as ${artist_corrections[artist]}`, 'lotus');
            if (broadcast)
                page.corrected = true;

            return clean_message(artist_corrections[artist], "artist_name");
        } else {
            if (broadcast)
                page.corrected = false;

            return clean_message(artist, "artist_name");
        }
    } catch(e) {
        log(`correcting ${artist}`, 'lotus');
        console.error(e);
        return clean_message(artist, "artist_name");
    }
}


// feat.
export function name_includes(original_title, original_artist) {
    console.log(original_title, original_artist);
    let formatted_title = original_title;

    let original_title_corrected = false;

    if (album_track_corrections.hasOwnProperty(original_artist.toLowerCase()) && settings.corrections) {
        if (album_track_corrections[original_artist.toLowerCase()].hasOwnProperty(formatted_title)) {
            formatted_title = album_track_corrections[original_artist.toLowerCase()][formatted_title];
            log(`corrected ${original_title} by ${original_artist} as ${formatted_title}`, 'lotus');

            original_title_corrected = true;
        }
    }

    // remove double feature detection in titles breakign things
    // eg. (with A$AP Rocky & feat. Takeoff)
    formatted_title = formatted_title
    .replaceAll(' & feat. ', ';')
    .replaceAll(' & with ', ';');

    let lowercase_title = formatted_title.toLowerCase();
    console.log('lowercase', lowercase_title);
    let extras = [];

    console.log(formatted_title, lowercase_title);


    // includes is now sorted into groups, first we run thru groups
    for (let group in includes) {
        // now we run thru individual includes in said-group
        for (let possible_match in includes[group]) {
            // does the title include this text match?
            if (lowercase_title.includes(includes[group][possible_match])) {
                // mark character in string
                let chr = lowercase_title.indexOf(`${includes[group][possible_match]}`);

                // featuring ty dolla $ign
                // skips if this is the first character
                if (chr < 1)
                    continue;

                // differentiate 2017 remaster to 20th deluxe
                console.log(group, group == 'remasters', lowercase_title.includes(' remaster'));
                if (group == 'remasters' && !lowercase_title.includes(' remaster') && !lowercase_title.includes('(remaster')) {
                    continue;
                } else {
                    // everything else
                    extras.push({
                        type: includes[group][possible_match],
                        group: group,
                        chr: chr
                    });
                }
            }
        }
    }

    // sort by occurance in string
    extras.sort((a, b) => a.chr - b.chr);

    // remove tags from original title
    for (let extra in extras) {
        formatted_title = formatted_title.slice(0, (extras[extra].chr - 1));
        break;
    }

    // find song guests
    let song_guests = [];

    console.log(extras);
    for (let extra in extras) {
        console.log(extras[extra]);
        if ((parseInt(extra) + 1) < extras.length) {
            let chr = extras[extra].chr;
            let next_chr = extras[parseInt(extra) + 1].chr;

            extras[extra].text = original_title.slice(chr, (next_chr - 1)).replaceAll('(','').replaceAll(')','').replaceAll('[','').replaceAll(']','').replaceAll('- ','');
        } else {
            let chr = extras[extra].chr;
            extras[extra].text = original_title.slice(chr).replaceAll('(','').replaceAll(')','').replaceAll('[','').replaceAll(']','').replaceAll('- ','');
        }


        let field_group = extras[extra].group;
        // remove beginning tag
        let field_text = extras[extra].text
        .replace(' feat. ', '').replace('feat. ', '')
        .replace('featuring ', '').replace('Feat. ', '')
        .replace('ft. ', '').replace('FEAT. ', '').replace('Ft. ', '')
        .replace('WITH', 'with').replace('w/ ', '').replace('with ', '').replace('With ', '')
        .replaceAll(' & ', ';').replaceAll(', ', ';').replaceAll(' and ', ';')
        .replaceAll(' with ', ';')
        .replaceAll('- ', '')
        .replaceAll(',; ', ';')
        .replaceAll('Tyler;the', 'Tyler, the').replaceAll('Tyler;The', 'Tyler, The');

        console.log('pre-split', field_text);

        if (field_group == 'guests') {
            song_guests = field_text.split(';');

            for (let guest in song_guests)
                song_guests[guest] = correct_artist(song_guests[guest]);
        }
    }


    // song artist
    if (artist_corrections.hasOwnProperty(original_artist) && settings.corrections)
        original_artist = correct_artist(artist_corrections[original_artist]);


    if (extras.length > 0)
        log(`parsed ${original_title} as ${formatted_title} by ${original_artist} with`, 'guest features', 'info', {extras: extras, song_guests: song_guests});
    return [formatted_title, extras, original_artist, song_guests, original_title_corrected];
}


export function artist_title() {
    let title = document.body.querySelector('.header-new-title');
    let title_text = title.textContent.trim();

    let has_multi = false;
    if (title_text.includes(', ') || title_text.includes(' & '))
        has_multi = true;

    page.multi = false;

    if (!has_multi) {
        if (!settings.corrections)
            return;

        title.textContent = correct_artist(title_text, true);
    } else {
        title_text = title_text
        .replaceAll(' & ', ';').replaceAll(', ', ';')
        .replace('Tyler;the', 'Tyler, The').replace('Tyler;The', 'Tyler, The')
        .replaceAll(';;', ';');

        page.multi = true;
        title.innerHTML = '';

        let split = title_text.split(';');

        if (split.length < 2) {
            page.multi = false;

            if (!settings.corrections)
                return;

            title.textContent = correct_artist(title_text, true);

            return;
        }

        split.forEach((artist, index) => {
            if (index > 0)
                title.innerHTML += ',';

            let part = document.createElement('a');
            part.classList.add('multi-artist-part');
            part.setAttribute('href',`${root}music/${sanitise(artist)}`);

            if (settings.corrections)
                part.textContent = correct_artist(artist);
            else
                part.textContent = artist;

            title.appendChild(part);
        });
    }
}

export function patch_header_title() {
    if (!settings.corrections && !settings.format_guest_features && !multi)
        return;

    page.corrected = false;

    let track_title = document.body.querySelector('.header-new-title');
    let track_artist = document.body.querySelector('.header-new-crumb span');

    if (!track_title)
        return;

    // correct artist
    if (track_artist == null) {
        // must be on artist page
        if (artist_corrections.hasOwnProperty(track_title.textContent)) {
            let corrected_artist = artist_corrections[track_title.textContent];
            log(`corrected ${track_title.textContent} as ${corrected_artist}`, 'lotus');
            track_title.textContent = corrected_artist;

            page.corrected = true;
        }
    } else {
        // album/track page
        if (artist_corrections.hasOwnProperty(track_artist.textContent)) {
            let corrected_artist = artist_corrections[track_artist.textContent];
            log(`corrected ${track_artist.textContent} as ${corrected_artist}`, 'lotus');
            track_artist.textContent = corrected_artist;
        }
    }

    if (track_artist == null)
        return;

    if (settings.format_guest_features) {
        try {
        if (!track_title.hasAttribute('data-kate-processed')) {
            track_title.setAttribute('data-kate-processed','true');

            let formatted_title = name_includes(track_title.textContent, track_artist.textContent);
            let song_title = formatted_title[0];
            let song_tags = formatted_title[1];

            page.corrected = formatted_title[4];

            // parse tags into text
            let song_tags_text = '';
            for (let song_tag in song_tags) {
                song_tags_text = `${song_tags_text}<div class="feat" data-bleh--tag-type="${song_tags[song_tag].type}" data-bleh--tag-group="${song_tags[song_tag].group}">${song_tags[song_tag].text}</div>`;
            }

            // combine
            track_title.innerHTML = `<div class="title">${sanitise_text(clean_message(song_title, "track_title"))}</div>${song_tags_text}`;

            let song_artist_element = document.body.querySelector('span[itemprop="byArtist"]');
            let song_guests = formatted_title[3];
            page.sister_others = formatted_title[3];
            for (let guest in song_guests) {
                // &
                song_artist_element.innerHTML = `${song_artist_element.innerHTML},`;

                let guest_element = document.createElement('a');
                guest_element.classList.add('header-new-crumb');
                guest_element.setAttribute('href', `${root}music/${sanitise(song_guests[guest])}`);
                guest_element.setAttribute('title', sanitise_text(song_guests[guest]));
                guest_element.textContent = song_guests[guest];

                song_artist_element.appendChild(guest_element);
            }
        }
        } catch(e) {}
    } else {
        if (!track_title.hasAttribute('data-kate-processed')) {
            track_title.setAttribute('data-kate-processed','true');

            let corrected_title = correct_item_by_artist(track_title.textContent, track_artist.textContent, "track_title");
            log(`corrected ${track_title.textContent} by ${track_artist.textContent} as ${corrected_title}`, 'lotus');

            if (corrected_title != track_title.textContent)
                page.corrected = true;

            track_title.textContent = corrected_title;
        }
    }
}