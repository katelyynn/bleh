import { settings } from '@/build/config';
import { auth, page, root } from '@/build/page';
import { romanise, sanitise } from '@/build/tools';
import { tl, trans } from '@/build/trans';
import { correct_artist, correct_item_by_artist, name_includes, smart_artists, smart_title } from '@/components/music/lotus';
import { redirect } from '@/components/music/music';
import { html, render } from 'lighterhtml';
import { load_profile_cache_externally } from '../profile/profile';
import { load_recent_tracks } from '../home';
import tippy from 'tippy.js';

interface album {
    image: string,
    title: string,
    artist: string,
    plays: string,
    formatted_title: string | ReturnType<typeof html.node>,
    formatted_artist: string | ReturnType<typeof html.node>,
    corrected_title: string,
    corrected_artist: string
}

export function campfire() {
    let selected_index = 0;
    let previous_index = 0;
    let max_index = 0;
    let items_container: HTMLElement;
    let item_details: HTMLElement;
    let current_bg: HTMLElement;
    let previous_bg: HTMLElement;

    const container = html.node`
        <div class="campfire">
            <div class="campfire-intro">
                <h2 class="music-section-heading">${tl(trans.your_recent_30_days)}</h2>
            </div>
            <div class="campfire-items" ref=${el => items_container = el} />
            <div class="campfire-details" ref=${el => item_details = el} />
            <div class="campfire-bg current" ref=${el => current_bg = el} />
            <div class="campfire-bg previous" ref=${el => previous_bg = el} />
        </div>
    `;
    page.structure.row.insertBefore(container, page.structure.content);

    campfire_extended(container);

    let albums: album[] = [];
    let album_elements: HTMLElement[] = [];

    fetch(`${root}user/${auth.name}/partial/albums?albums_date_preset=LAST_30_DAYS&ajax=1`)
        .then(function (response) {
            console.log('returned', response, response.text);

            return response.text();
        })
        .then(function (dom) {
            let doc = new DOMParser().parseFromString(dom, 'text/html');
            console.log('DOC', doc);

            const items = doc.querySelectorAll('.grid-items > .grid-items-item');
            items.forEach(item => {
                const image = item.querySelector('.grid-items-cover-image-image img').src;
                const title = item.querySelector('.grid-items-item-main-text a').textContent;
                const artist = item.querySelector('.grid-items-item-aux-block').textContent;
                const plays = item.querySelector('.grid-items-item-aux-text a:last-child').textContent.trim();

                let corrected_title = romanise(correct_item_by_artist(title, artist));
                let corrected_artist = romanise(correct_artist(artist));

                let formatted_title = corrected_title;
                let formatted_artist = corrected_artist;

                if (settings.format_guest_features) {
                    const formatted = name_includes(title, artist);

                    formatted_title = smart_title(formatted[0], formatted[1]);
                    formatted_artist = smart_artists(formatted[2], formatted[3]);
                }

                albums.push({
                    image: image.replace('/avatar300s/', '/500x500/'),
                    title,
                    artist,
                    plays,
                    formatted_title,
                    formatted_artist,
                    corrected_title,
                    corrected_artist
                });
            });

            max_index = albums.length - 1;

            render(items_container, html`
                ${albums.map((album, index) => {
                    const elem = html.node`
                        <div class="campfire-item" style="--index: ${index}" onclick=${() => {
                            if (selected_index != index) set_index(index);
                        }}>
                            <div class="campfire-item-cover">
                                <img src=${album.image} alt=${album.corrected_title} />
                            </div>
                        </div>
                    `;

                    album_elements.push(elem);

                    return elem;
                })}
            `);

            let timeout;
            container.addEventListener('wheel', e => {
                e.preventDefault();
                if (timeout) return;

                timeout = setTimeout(() => {
                    timeout = null;
                }, 0.15);

                const direction = Math.sign(e.deltaY);
                if (direction == 0) return;
                set_index(selected_index + direction);
            }, { passive: false });

            set_index(selected_index);
        });

    function set_index(index: number) {
        if (index > max_index) index = 0;
        else if (index < 0) index = max_index;

        album_elements.forEach((album, album_index) => {
            album.setAttribute('aria-checked', (album_index == index).toString());
        });

        previous_index = selected_index;
        selected_index = index;
        items_container.style.setProperty('--selected-index', index.toString());

        const album = albums[index];

        current_bg.style.setProperty('background-image', `url(${album.image})`);

        render(item_details, html`
            <a class="campfire-title smart-title" href="${root}music/${sanitise(album.artist)}/${sanitise(album.title)}" target="_blank">
                ${album.formatted_title}
            </a>
            <span class="campfire-artist">
                ${settings.format_guest_features ? album.formatted_artist : html.node`<a class="campfire-artist" href="${root}music/${redirect()}${sanitise(album.artist)}" target="_blank">${album.corrected_artist}</a>`}
            </span>
            <div class="campfire-plays">
                ${album.plays}
            </div>
        `);
    }
}

function campfire_extended(container: HTMLElement) {
    const friends = settings.friends as string[];

    container.after(html.node`
        <section class="campfire-extended">
            <div class="content-panel content-main">

            </div>
            <div class="content-panel content-side">
                <section class="friends-panel">
                    <h2>${tl(trans.friends)}</h2>
                    <div class="friends">
                        ${friends.length > 0 ? html.node`
                            ${friends.map((friend: string) => campfire_friend(friend))}
                        ` : html.node`
                            bleh is better with friends!! add from your following list
                        `}
                    </div>
                </section>
            </div>
        </section>
    `);
}

function campfire_friend(friend: string) {
    let cover_art: HTMLElement;
    let track_info: HTMLElement;
    let user_avatar: HTMLElement;
    let user_name: HTMLElement;

    const elem = html.node`
        <div class="user friend" data-live="false">
            <div class="user-avatar cover-art" ref=${el => cover_art = el}>
                <div class="bleh-icon loading-spinner" />
            </div>
            <div class="user-info">
                <div class="user-name">
                    <div class="avatar" ref=${el => user_avatar = el}>
                        <div class="bleh-icon loading-spinner" />
                    </div>
                    <p ref=${el => user_name = el}>@${friend}</p>
                    <a class="link-block-cover-link" href="${root}user/${friend}" />
                </div>
                <div class="user-about track" ref=${el => track_info = el}>
                    <p>${tl(trans.loading)}</p>
                </div>
            </div>
        </div>
    `;

    load_profile_cache_externally(friend).then(cache => {
        render(user_avatar, html`
            <img src=${cache.avatar} alt=${friend}>
        `);

        if (cache.username)
            user_name.textContent = cache.username;

        load_recent_tracks(friend).then(tracks => {
            const item = tracks[0];

            if (item) {
                let sister = item.sister;
                let name = item.name;

                if (settings.format_guest_features) {
                    const formatted = name_includes(name, sister);

                    name = html.node`${smart_title(formatted[0], formatted[1])}`;
                    sister = html.node`${smart_artists(formatted[2], formatted[3])}`;
                } else if (settings.corrections) {
                    sister = romanise(correct_artist(item.sister));
                    name = romanise(correct_item_by_artist(item.name, item.sister));
                }

                if (item.time) {
                    render(user_name, html`
                        ${{ html: tl(trans.user_listened_time, { u: `<strong>${cache.username ? cache.username : `@${friend}`}</strong>`, time: item.time }) }}
                    `);
                } else {
                    render(user_name, html`
                        ${{ html: tl(trans.user_is_listening_to, { u: `<strong>${cache.username ? cache.username : `@${friend}`}</strong>` }) }}
                    `);

                    elem.setAttribute('data-live', true);
                }

                render(cover_art, html`
                    <img src=${item.avatar} alt=${name}>
                    <a class="link-block-cover-link" href="${root}music/${item.sister}/_/${item.name}" />
                `);

                const track_elem = html.node`
                    <a class="wiki-link icon" data-link-type="track" href="${root}music/${item.sister}/_/${item.name}">${name}</a>
                `;

                tippy(track_elem, {
                    theme: 'name-sister-combo',
                    content: html.node`
                        <span class="name">${{ html: track_elem.innerHTML }}</span>
                        <span class="sister">${sister}</span>
                    `
                });

                render(track_info, track_elem);
            }
        });
    });

    return elem;
}