//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import {render_activity_list} from "../activity";
import {log} from "../build/log";
import {auth, page, root} from "../build/page";
import {tl, trans} from "../build/trans";
import {checkup_nav, checkup_page_structure} from "../components/structure";
import {register_background, update_page} from "../page";
import {bleh_charts} from "./chart";
import {bleh_native_settings} from './lastfm_settings';
import {html, render} from "lighterhtml";
import {ff} from "../sku.js";
import { load_profile_cache_externally } from './profile.js';
import { correct_artist, correct_item_by_artist, name_includes, smart_artists, smart_title } from "../components/lotus.js";
import { romanise, sanitise } from "../build/tools.js";
import { redirect } from "../components/music.js";
import { settings } from "../build/config.js";
import { expand_avatar } from "../avatar.js";
import tippy from "tippy.js";

export async function bleh_home() {
    page.structure.container = document.body.querySelector('.page-content');
    try {
        page.structure.row = page.structure.container.querySelector('.row');
        page.structure.main = page.structure.row.querySelector('.col-main');
        page.structure.side = page.structure.row.querySelector('.col-sidebar');
    } catch(e) {
        log('unable to find elements', 'page structure');
    }

    let content_top = document.body.querySelector('.content-top');

    page.name = auth.name;

    checkup_page_structure(false, content_top);
    log('status is', 'page', 'info', page);
    update_page();

    let cache;
    if (auth.name) {
        cache = await load_profile_cache_externally(auth.name);
        if (cache.banner)
            register_background(cache.banner);
        else if (auth.avatar && !auth.avatar.endsWith('818148bf682d429dc215c1705eb27b98.png'))
            register_background(auth.avatar.replace('/avatar42s/', '/ar0/'));
        else
            register_background(null);
    } else {
        register_background(null);
    }


    let hour = new Date().getHours();
    let time;
    if (hour >= 22 || hour <= 6)
        time = 'night';
    else if (hour >= 7 && hour <= 10)
        time = 'morning';
    else if (hour >= 11 && hour <= 18)
        time = 'afternoon';
    else
        time = 'evening';
    log(`hour ${hour} time ${time}`, 'time');

    let welcome;
    if (auth.name) {
        let profile_name;
        welcome = html.node`
            <section class="redesigned-header redesigned-profile-header no-background">
                <div class="avatar-side">
                    <div class="avatar" onclick=${() => {
                        expand_avatar(auth.avatar.replace('/avatar42s/', '/ar0/'));
                    }}>
                        <img src=${auth.avatar.replace('/avatar42s/', '/avatar170s/')} alt=${tl(trans.your_avatar)}>
                    </div>
                </div>
                <div class="info-side has-main-info">
                    <div class="main-info">
                        <div class="greeting">
                            ${tl(trans[`good_${time}_user`])}
                        </div>
                        <div class="title-container">
                            <div class="header-title-label-wrap">
                                <h1 class="header-title">
                                    <a class="profile-name" href="${root}user/${auth.name}" ref=${el => profile_name = el}>${cache.username ? cache.username : auth.name}</a>
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;

        if (settings.display_name_styles) {
            profile_name.setAttribute('data-font', cache.font);
            profile_name.setAttribute('data-font-style', cache.font_style);
        }
    } else {
        welcome = html.node`
            <section class="redesigned-header redesigned-profile-header no-background">
                <div class="avatar-side">
                    <div class="avatar">
                        <img class="missing-avatar" alt=${tl(trans.your_avatar)}>
                    </div>
                </div>
                <div class="info-side has-main-info">
                    <div class="main-info">
                        <div class="greeting">
                            ${tl(trans[`good_${time}_user`])}
                        </div>
                        <div class="title-container">
                            <div class="header-title-label-wrap">
                                <h1>${tl(trans.not_logged_in)}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    page.structure.container.insertBefore(welcome, page.structure.container.firstElementChild);

    let nav;
    if (auth.name) {
        nav = html.node`
            <nav class="navlist secondary-nav navlist--more redesigned-navigation">
                <ul class="navlist-items">
                    <li class="navlist-item secondary-nav-item secondary-nav-item--home">
                        <a href="${root}music" class="secondary-nav-item-link ${(page.subpage == 'music' || page.type == 'events') ? 'secondary-nav-item-link--active' : ''}">
                            ${tl(trans.home)}
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--recommendations">
                        <a href="${root}music/+recommended" class="secondary-nav-item-link ${(page.type == 'recommended') ? 'secondary-nav-item-link--active' : ''}">
                            ${tl(trans.recommendations)}
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--releases">
                        <a href="${root}music/+releases/out-now" class="secondary-nav-item-link ${(page.type == 'releases') ? 'secondary-nav-item-link--active' : ''}">
                            ${tl(trans.releases)}
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--bookmarks">
                        <a href="${root}music/+bookmarks" class="secondary-nav-item-link ${(page.type == 'bookmarks') ? 'secondary-nav-item-link--active' : ''}">
                            ${tl(trans.bookmarks)}
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--charts">
                        <a href="${root}charts" class="secondary-nav-item-link ${(page.type == 'charts') ? 'secondary-nav-item-link--active' : ''}">
                            ${tl(trans.charts)}
                        </a>
                    </li>
                    ${ff('minis') ? html.node`
                    <li class="navlist-item secondary-nav-item secondary-nav-item--minis">
                        <a href="${root}bleh/minis" data-type="mini" class="secondary-nav-item-link ${(page.type == 'minis') ? 'secondary-nav-item-link--active' : ''}">
                            ${tl(trans.minis)}
                        </a>
                    </li>
                    ` : ''}
                    <li class="fill"></li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--settings">
                        <a href="${root}settings" class="secondary-nav-item-link ${(page.type == 'settings') ? 'secondary-nav-item-link--active' : ''}">
                            ${tl(trans.settings)}
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--bleh">
                        <a href="${root}bleh" class="secondary-nav-item-link ${(page.type == 'bleh_settings') ? 'secondary-nav-item-link--active' : ''}">
                            ${tl(trans.settings)}
                        </a>
                    </li>
                </ul>
            </nav>
        `;
    } else {
        nav = html.node`
            <nav class="navlist secondary-nav navlist--more redesigned-navigation">
                <ul class="navlist-items">
                    <li class="navlist-item secondary-nav-item secondary-nav-item--home">
                        <a href="${root}music" class="secondary-nav-item-link ${(page.subpage == 'music' || page.type == 'events') ? 'secondary-nav-item-link--active' : ''}">
                            ${tl(trans.home)}
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--charts">
                        <a href="${root}charts" class="secondary-nav-item-link ${(page.type == 'charts') ? 'secondary-nav-item-link--active' : ''}">
                            ${tl(trans.charts)}
                        </a>
                    </li>
                    <li class="fill"></li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--bleh">
                        <a href="${root}bleh" class="secondary-nav-item-link ${(page.type == 'bleh_settings') ? 'secondary-nav-item-link--active' : ''}">
                            ${tl(trans.settings)}
                        </a>
                    </li>
                </ul>
            </nav>
        `;
    }

    page.structure.nav = nav;
    welcome.after(nav);
    checkup_nav();

    if (page.type == 'charts')
        bleh_charts();

    if (page.type == 'settings')
        bleh_native_settings();


    if (page.subpage == 'music') {
        let music_sections = document.body.querySelectorAll('.music-section');
        music_sections.forEach((music_section) => {
            page.structure.main.appendChild(music_section);
        });
    }

    if (page.subpage == 'music' && auth.name) {
        if (ff('campfire')) {
            campfire();
        } else {
            let toolbar = html.node`
                <div class="toolbar">
                    <nav class="navlist secondary-nav navlist--more redesigned-navigation">
                        <ul class="navlist-items">
                            <li class="navlist-item secondary-nav-item">
                                <a href="${root}user/${auth.name}" data-type="mention" class="secondary-nav-item-link">
                                    ${tl(trans.profile)}
                                </a>
                            </li>
                            <li class="navlist-item secondary-nav-item">
                                <a href="${root}user/${auth.name}/library" data-type="library" class="secondary-nav-item-link">
                                    ${tl(trans.library)}
                                </a>
                            </li>
                            <li class="navlist-item secondary-nav-item">
                                <a href="${root}user/${auth.name}/following" data-type="profile" class="secondary-nav-item-link">
                                    ${tl(trans.friends)}
                                </a>
                            </li>
                            <li class="navlist-item secondary-nav-item">
                                <a href="${root}user/${auth.name}/shoutbox" data-type="shouts" class="secondary-nav-item-link">
                                    ${tl(trans.shouts)}
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            `;

            page.structure.row.insertBefore(toolbar, page.structure.content);

            let track_list;
            page.structure.row.insertBefore(html.node`
                <div class="content override">
                    <div class="col-main" ref=${el => page.structure.main = el}>
                        <section>
                            <h2>${tl(trans.recent_tracks)}</h2>
                            <div class="recent-listening-container" ref=${el => track_list = el}>
                                <div class="loading-data-container">
                                    <p class="loading-data-text">${tl(trans.finding_your_tracks)}</p>
                                </div>
                            </div>
                        </section>
                    </div>
                    <div class="col-sidebar" ref=${el => page.structure.side = el}>
                        <section>
                            <h2>${tl(trans.activity)}</h2>
                            ${render_activity_list()}
                            <div class="more-link">
                                <a href="${root}bleh/profile?setting=activities">${tl(trans.activity_settings)}</a>
                            </div>
                        </section>
                    </div>
                </div>
            `, page.structure.content);

            fetch(`${root}user/${auth.name}/partial/recenttracks?ajax=1`)
            .then(function(response) {
                console.log('returned', response, response.text);

                return response.text();
            })
            .then(function(html) {
                let doc = new DOMParser().parseFromString(html, 'text/html');
                console.log('DOC', doc);

                let tracklist_panel = doc.querySelector('.chartlist');

                if (tracklist_panel)
                    track_list.outerHTML = tracklist_panel.outerHTML;
            });
        }
    } else if (page.type == 'releases') {
        let content = page.structure.main.querySelectorAll(':scope > *');
        let panel = html.node`
            <section class="releases-panel" />
        `;

        content.forEach((element) => {
            panel.appendChild(element);
        });

        render(page.structure.main, panel);
    }
}

export function bleh_home_legacy() {
    const main_content = document.body.querySelector('.adaptive-skin-container');
    if (!main_content) return;

    render(main_content, html``);

    window.location.href = `${root}music`;
}

function campfire() {
    let selected_index = 0;
    let previous_index = 0;
    let max_index = 0;
    let items_container;
    let item_details;
    let current_bg;
    let previous_bg;

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

    let albums = [];
    let album_elements = [];

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

    function set_index(index) {
        if (index > max_index) index = 0;
        else if (index < 0) index = max_index;

        album_elements.forEach((album, album_index) => {
            album.setAttribute('aria-checked', album_index == index);
        });

        previous_index = selected_index;
        selected_index = index;
        items_container.style.setProperty('--selected-index', index);

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

function campfire_extended(container) {
    container.after(html.node`
        <section class="campfire-extended">
            <div class="content-panel content-main">

            </div>
            <div class="content-panel content-side">
                <section class="friends-panel">
                    <h2>Friends</h2>
                    <div class="friends">
                        ${settings.friends.length > 0 ? html.node`
                            ${settings.friends.map(friend => campfire_friend(friend))}
                        ` : html.node`

                        `}
                    </div>
                </section>
            </div>
        </section>
    `);
}

function campfire_friend(friend) {
    let cover_art;
    let track_info;
    let user_avatar;
    let user_name;

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
                    <a class="involved--track" href="${root}music/${item.sister}/_/${item.name}">${name}</a>
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

export async function load_recent_tracks(name) {
    return new Promise((resolve, reject) => {
        fetch(`${root}user/${name}/partial/recenttracks?ajax=1`)
            .then(function (response) {
                console.log('returned', response, response.text);

                return response.text();
            })
            .then(function (dom) {
                let doc = new DOMParser().parseFromString(dom, 'text/html');
                console.log('DOC', doc);

                let tracks = [];
                const track_list = doc.querySelectorAll('.chartlist-row');
                if (track_list.length > 0) {
                    track_list.forEach(track => {
                        let item = {};

                        item.avatar = track.querySelector('.chartlist-image img');
                        if (item.avatar)
                            item.avatar = item.avatar.src;

                        item.name = track.querySelector('.chartlist-name a').textContent.trim();
                        item.sister = track.querySelector('.chartlist-artist a').textContent.trim();

                        item.time = track.querySelector('.chartlist-timestamp > span:not(.chartlist-now-scrobbling)')?.textContent.trim();

                        tracks.push(item);
                    });
                }

                resolve(tracks);
            })
            .catch(reject);
    });
}
