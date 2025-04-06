import { settings } from "../build/config";
import { log } from "../build/log";
import { page, root } from "../build/page";
import { clamp_sat, return_artist_from_track, rgb_to_hsl, sanitise, sanitise_text } from "../build/tools";
import { bleh_glacier_insights } from "../pages/glacier";
import { clean_message } from "../pages/moderation";
import { patch_artist_ranks_in_list_view } from "./colourful_counts";
import { correct_artist, correct_item_by_artist, name_includes } from "./lotus";
import { register_menu } from "./menu";

export function patch_titles() {
    if (page.subpage == 'tags_overview')
        return;

    if (page.structure.main == null)
        return;

    let tracklists = page.structure.main.querySelectorAll('.chartlist:not(.chartlist__placeholder)');

    let insights = {
        artist: {
            display: false,
            values: [],
            labels: [],
            highest: {
                value: 0,
                label: '',
                link: '',
                img: ''
            }
        },
        album: {
            display: false,
            values: [],
            labels: [],
            highest: {
                value: 0,
                label: '',
                link: '',
                img: ''
            }
        },
        track: {
            display: false,
            values: [],
            labels: [],
            highest: {
                value: 0,
                label: '',
                link: '',
                img: ''
            }
        }
    };

    tracklists.forEach((tracklist) => {
        if (tracklist == null)
            return;

        console.log('tracklist found', tracklist);

        // used to ensure this hasnt been ran thru
        if (tracklist.querySelector('tbody > .chartlist-row:first-child > .kate-placeholder') != null)
            return;

        console.log('tracklist has not been run thru', tracklist);

        let tracks = tracklist.querySelectorAll('.chartlist-row:not(.chartlist__placeholder-row)');

        // we dont show "from this album" on these pages
        let is_library_track_page = (page.subpage == 'library_track_overview');

        tracks.forEach((track => {
            console.log('track', track);
            if (track.getAttribute('data-track-type'))
                return;

            let bla = document.createElement('div');
            bla.classList.add('kate-placeholder');
            track.appendChild(bla);


            let track_title = track.querySelector('.chartlist-name a:not(.offset-section-anchor)');

            if (track_title == null)
                return;

            let is_user = (track.querySelector('.chartlist-image .avatar') != null);
            let is_artist = false;
            if (is_user) {
                // is it really a user?
                let link = track_title.getAttribute('href');
                if (link.startsWith(`${root}music/`)) {
                    is_user = false;
                    is_artist = true;
                }
            }

            if (is_user) {
                track.setAttribute('data-track-type', 'user');

                if (settings.colourful_counts)
                    patch_artist_ranks_in_list_view(track);

                return;
            }

            if (is_artist) {
                track.setAttribute('data-track-type', 'artist');

                if (settings.colourful_counts)
                    patch_artist_ranks_in_list_view(track);

                if (settings.corrections)
                    track_title.textContent = correct_artist(track_title.getAttribute('title'));

                insights.artist.display = true;
                let bar = track.querySelector('.chartlist-count-bar-slug');
                let value = parseInt(bar.getAttribute('data-stat-value'));
                insights.artist.values.push(value);

                if (value > insights.artist.highest.value)
                    insights.artist.highest.value = value;

                log(`pushed insight artist label of ${track_title.textContent}`, 'glacier library', 'log');
                insights.artist.labels.push(track_title.textContent);

                return;
            }

            let is_album = track.hasAttribute('data-album-row');
            if (is_album)
                track.classList.add('bleh--is-album');

            let track_artist = return_artist_from_track(track_title.getAttribute('href'), is_album);
            track.classList.add('chartlist-row--with-artist');

            let bar = track.querySelector('.chartlist-count-bar-slug');
            if (bar) {
                let value = parseInt(bar.getAttribute('data-stat-value'));

                if (is_album) {
                    insights.album.display = true;
                    insights.album.values.push(value);

                    if (value > insights.album.highest.value)
                        insights.album.highest.value = value;
                } else {
                    insights.track.display = true;
                    insights.track.values.push(value);

                    if (value > insights.track.highest.value)
                        insights.track.highest.value = value;
                }
            }

            // menu
            let track_legacy_menu = track.querySelector('.chartlist-more-menu');

            if (settings.format_guest_features) {
                let formatted_title = name_includes(track_title.getAttribute('title'), track_artist);
                console.log('formatted', formatted_title);
                let song_title = track_title.getAttribute('title');
                let song_tags = {};
                if (formatted_title != undefined) {
                    song_title = formatted_title[0];
                    song_tags = formatted_title[1];
                }

                track_title.setAttribute('title', correct_item_by_artist(track_title.getAttribute('title'), track_artist));

                // parse tags into text
                let song_tags_text = '';
                for (let song_tag in song_tags) {
                    song_tags_text = `${song_tags_text}<div class="feat" data-bleh--tag-type="${song_tags[song_tag].type}" data-bleh--tag-group="${song_tags[song_tag].group}">${sanitise_text(song_tags[song_tag].text)}</div>`;
                }

                // combine
                track_title.innerHTML = `<div class="title">${clean_message(sanitise_text(song_title), 'track')}</div>${song_tags_text}`;

                let song_artist_element = track.querySelector('.chartlist-artist');
                if (song_artist_element == null && !is_user) {
                    song_artist_element = document.createElement('td');
                    song_artist_element.classList.add('chartlist-artist');
                    track.appendChild(song_artist_element);
                }

                // if artist matches OR artist is blank
                if (song_artist_element.textContent.replaceAll('+', ' ').trim() == track_artist || song_artist_element.textContent.trim() == '') {
                    // replaces with corrected artist if applicable
                    song_artist_element.innerHTML = `<a href="${root}music/${sanitise(formatted_title[2])}" title="${sanitise_text(formatted_title[2])}">${sanitise_text(clean_message(formatted_title[2], 'artist'))}</a>`;

                    // append guests
                    let song_guests = formatted_title[3];
                    for (let guest in song_guests) {
                        // &
                        song_artist_element.innerHTML = `${song_artist_element.innerHTML},`;

                        let guest_element = document.createElement('a');
                        guest_element.setAttribute('href', `${root}music/${sanitise(song_guests[guest])}`);
                        guest_element.setAttribute('title', song_guests[guest]);
                        guest_element.textContent = clean_message(song_guests[guest], 'artist');

                        song_artist_element.appendChild(guest_element);
                    }
                }

                // duration
                let track_timestamp = track.querySelector('.chartlist-timestamp span');
                let track_timestamp_contents;
                if (track_timestamp != null) {
                    track_timestamp_contents = track_timestamp.getAttribute('title');
                    track_timestamp.setAttribute('title', '');
                }

                let image = track.querySelector('.chartlist-image img');

                // hacky workaround to chartlists with no image
                if (image == null && page.type == 'user')
                    is_library_track_page = true;

                if (track_legacy_menu) {
                    let track_preview = document.createElement('div');
                    track_preview.classList.add('track-preview');
                    track_preview.innerHTML = (`
                        <div class="image">
                            <div class="inner-image">
                                ${(image != null) ? image.outerHTML : '<img class="missing-track">'}
                            </div>
                        </div>
                        <div class="info">
                            <h5 class="title">${clean_message(song_title, 'track')}</h5>
                            <p class="artist">${song_artist_element.innerHTML}</p>
                            <div class="tags">${song_tags_text}</div>
                            ${(!is_library_track_page) ? (is_album) ? '' : `<p class="album">${(image != null) ? correct_item_by_artist(sanitise_text(image.getAttribute('alt')), track_artist) : page.name}</p>` : ''}
                            ${(track_timestamp != null && track_timestamp_contents != null) ? `<p class="timestamp">${track_timestamp_contents}</p>` : ''}
                        </div>
                    `);
                    track_legacy_menu.insertBefore(track_preview, track_legacy_menu.firstElementChild);
                }
            } else if (settings.corrections) {
                let song_artist_element = track.querySelector('.chartlist-artist a');
                if (song_artist_element != null) {
                    let corrected_title = correct_item_by_artist(track_title.textContent, song_artist_element.textContent);
                    track_title.textContent = corrected_title;
                    track_title.setAttribute('title', corrected_title);

                    let corrected_artist = correct_artist(song_artist_element.textContent);
                    song_artist_element.textContent = corrected_artist;
                    song_artist_element.setAttribute('title', corrected_artist);
                } else {
                    let corrected_title = correct_item_by_artist(track_title.textContent, track_artist);
                    track_title.textContent = corrected_title;
                    track_title.setAttribute('title', corrected_title);
                }

                let track_timestamp = track.querySelector('.chartlist-timestamp span');
                let track_timestamp_contents;
                if (track_timestamp != null) {
                    track_timestamp_contents = track_timestamp.getAttribute('title');
                    track_timestamp.setAttribute('title', '');

                    tippy(track_timestamp, {
                        content: track_timestamp_contents
                    });
                }
            } else {
                let track_timestamp = track.querySelector('.chartlist-timestamp span');
                let track_timestamp_contents;
                if (track_timestamp != null) {
                    track_timestamp_contents = track_timestamp.getAttribute('title');
                    track_timestamp.setAttribute('title', '');

                    tippy(track_timestamp, {
                        content: track_timestamp_contents
                    });
                }
            }

            if (track_legacy_menu) {
                let menu = tippy(track, {
                    theme: 'context-menu',
                    content: (`
                        ${track_legacy_menu.innerHTML}
                    `),
                    allowHTML: true,
                    placement: 'right-start',
                    trigger: 'manual',
                    interactive: true,
                    interactiveBorder: 10,
                    offset: [0, 0],

                    onShow(instance) {
                        instance.popper.addEventListener('click', event => {
                            instance.hide();
                        });

                        /*let menu_items = track_legacy_menu.querySelectorAll('li > *');
                        let content = instance.popper.querySelector('.tippy-content');

                        menu_items.forEach((item) => {
                            content.appendChild(item);
                        });*/
                    }
                });

                register_menu(track, menu);
            }

            if (is_album) {
                log(`pushed insight album label of ${track_title.getAttribute('title')}`, 'glacier library', 'log');
                insights.album.labels.push(track_title.getAttribute('title'));
            } else {
                log(`pushed insight track label of ${track_title.getAttribute('title')}`, 'glacier library', 'log');
                insights.track.labels.push(track_title.getAttribute('title'));
            }

            if (!settings.colourful_tracks)
                return;

            if (!is_album && track.classList.contains('chartlist-row--now-scrobbling')) {
                let image_wrap = track.querySelector('.chartlist-image');
                if (image_wrap) {
                    let link = image_wrap.querySelector('.cover-art');
                    let image = link.querySelector('img');

                    if (!settings.album_text) {
                        let alt = image.getAttribute('alt');

                        let album_text = document.createElement('td');
                        album_text.classList.add('chartlist-album', 'custom-album-text');
                        album_text.innerHTML = (`
                            <a href="${link.getAttribute('href')}">${alt}</a>
                        `);
                        track.appendChild(album_text);
                    }

                    image.setAttribute('crossorigin', 'anonymous');
                    try {
                        image.addEventListener('load', function() {
                            let thief = new ColorThief();
                            let colour = thief.getColor(image);

                            let hsl = rgb_to_hsl(colour[0], colour[1], colour[2]);

                            track.style.setProperty('--hue-over', hsl.h);
                            track.style.setProperty('--sat-over', clamp_sat((hsl.s / 100) * 3));
                            track.style.setProperty('--lit-over', 1);
                        });
                    } catch(e) {}
                }
            }
        }));
    });

    if (page.subpage.startsWith('library'))
        bleh_glacier_insights(insights);
}