//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { patch_avatar } from '@/components/shared/avatar';
import { settings } from '@/build/config';
import { log } from '@/build/log';
import { artist_corrections } from '@/build/music';
import { page, root } from '@/build/page';
import { clamp_sat, rgb_to_hsl, sanitise } from '@/build/tools';
import { tl, trans } from '@/build/trans';
import { correct_item_by_artist, name_includes } from '@/components/music/lotus';
import { checkup_page_structure } from '@/components/page/structure';
import { register_background, update_page } from '@/page';
import { html, render } from 'lighterhtml';
import { redirect } from '@/components/music/music';

export function bleh_obsession() {
    let obsession_container = document.querySelector('.obsession-container');
    if (!obsession_container) return;

    page.structure.container = document.body.querySelector(
        '.page-content:not(.obsession-container .page-content)'
    );
    try {
        page.structure.row = page.structure.container.querySelector('.row');
        page.structure.main = page.structure.row.querySelector('.col-main');
        page.structure.side = page.structure.row.querySelector('.col-sidebar');
    } catch (e) {
        log('unable to find elements', 'page structure');
    }

    let content_top = document.body.querySelector('.content-top');

    checkup_page_structure(false, content_top);
    log('status is', 'page', 'info', page);
    update_page();

    page.structure.container.setAttribute('data-beret', 'false');
    page.structure.container.setAttribute('data-short', 'false');

    let background = obsession_container.querySelector(
        '.obsession-background-inner'
    );
    background = background.style
        .getPropertyValue('background-image')
        .replace('url("', '')
        .replace('")', '');

    if (!background.endsWith('/4128a6eb29f94943c9d206c08e625904.jpg')) {
        register_background(background);

        try {
            let bg = obsession_container.style
                .getPropertyValue('background')
                .replace('rgb(', '')
                .replace(')', '')
                .split(', ');
            let hsl = rgb_to_hsl(
                parseInt(bg[0]),
                parseInt(bg[1]),
                parseInt(bg[2])
            );
            document.body.style.setProperty('--hue-album', hsl.h);
            document.body.style.setProperty(
                '--sat-album',
                clamp_sat((hsl.s / 100) * 3)
            );
            document.body.style.setProperty('--lit-album', hsl.l / 100 + 0.35);

            log(
                `sourced hsl of (${hsl.h}, ${hsl.s}, ${hsl.l}) - using final value of (${hsl.h}, ${clamp_sat((hsl.s / 100) * 3)}, ${hsl.l / 100 + 0.35})`,
                'hue from album'
            );
        } catch (e) {
            console.error(e);
            log('no cover present', 'hue from album');
        }
    } else {
        register_background('');
    }

    let track_title = obsession_container.querySelector(
        '.obsession-meta-track'
    );
    let track_artist = obsession_container.querySelector(
        '.obsession-meta-artist'
    );
    let scrobbles = obsession_container.querySelector(
        '.obsession-meta-scrobbles'
    );

    let link = track_title.querySelector('a').getAttribute('href');

    let by = track_artist.querySelector('.obsession-meta-artist-by');
    track_artist.removeChild(by);

    // correct artist
    let artist_name = track_artist.querySelector('a');
    if (artist_corrections.hasOwnProperty(artist_name.textContent)) {
        let corrected_artist = artist_corrections[artist_name.textContent];
        log(
            `corrected ${artist_name.textContent} as ${corrected_artist}`,
            'lotus'
        );
        artist_name.textContent = corrected_artist;
    }

    artist_name.classList.add('header-new-crumb');

    if (settings.format_guest_features) {
        let formatted_title = name_includes(
            track_title.textContent.trim(),
            artist_name.textContent
        );
        let song_title = formatted_title[0];
        let song_tags = formatted_title[1];

        page.corrected = formatted_title[4];

        // combine
        render(
            track_title,
            html.node`
            <div class="title">${song_title.trim()}</div>
            ${song_tags.map(
                (tag) => html.node`
                <div class="feat" data-bleh--tag-type="${tag.type}" data-bleh--tag-group="${tag.group}">${tag.text}</div>
            `
            )}
        `
        );

        let song_guests = formatted_title[3];
        page.sister_others = formatted_title[3];
        for (let guest in song_guests) {
            // &
            track_artist.innerHTML = `${track_artist.innerHTML},`;

            let guest_element = document.createElement('a');
            guest_element.classList.add('header-new-crumb');
            guest_element.setAttribute(
                'href',
                `${root}music/${redirect()}${sanitise(song_guests[guest])}`
            );
            guest_element.textContent = song_guests[guest];

            track_artist.appendChild(guest_element);
        }
    } else {
        if (!track_title.hasAttribute('data-kate-processed')) {
            track_title.setAttribute('data-kate-processed', 'true');

            let corrected_title = correct_item_by_artist(
                track_title.textContent.trim(),
                artist_name.textContent
            );
            log(
                `corrected ${track_title.textContent} by ${artist_name.textContent} as ${corrected_title}`,
                'lotus'
            );

            if (corrected_title != track_title.textContent)
                page.corrected = true;

            track_title.textContent = corrected_title;
        }
    }

    track_title.classList.remove('obsession-meta-track');

    let track_header = html.node`
        <section class="redesigned-header redesigned-track-header no-background obsession-track-header">
            <div class="info-side">
                <div class="sub-text">${tl(trans.obsession)}</div>
                <div class="title-container">
                    <h1><a href="${link}">${track_title}</a></h1>
                </div>
                <h2>${html.node([track_artist.innerHTML])}</h2>
            </div>
        </section>
    `;

    page.structure.container.insertBefore(
        track_header,
        page.structure.container.firstElementChild
    );

    let video = obsession_container.querySelector('.obsession-video-container');
    if (video) track_header.after(video);

    // remove quotations
    let obsession_reason =
        obsession_container.querySelector('.obsession-reason');
    if (obsession_reason) {
        let obsession_reason_text = obsession_reason.textContent;
        obsession_reason.textContent = obsession_reason_text
            .trim()
            .substr(1)
            .slice(0, -1);
    }

    let obsession_author = document.querySelector(
        '.obsession-details-intro a'
    ).textContent;
    let obsession_avatar = document.querySelector(
        '.obsession-details-intro-avatar-wrap .avatar'
    );

    page.name = obsession_author;

    let date = obsession_container.querySelector(
        '.obsession-details-date-short'
    );

    let quote = html.node`
        <section class="obsession-quote sour">
            ${
                obsession_reason ?
                    html.node`
            <div class="quote">
                ${obsession_reason.textContent}
            </div>
            `
                :   html.node`
            <div class="quote no-quote">
                ...
            </div>
            `
            }
            <div class="sub-text">
                <div class="obsession-author">
                    ${obsession_avatar}
                    <strong class="name">${obsession_author}</strong>
                    <a class="link-block-cover-link" href="${root}user/${obsession_author}"></a>
                </div>
                ${
                    scrobbles ?
                        html.node`
                <div class="obsession-listens">
                    ${html.node([scrobbles.innerHTML])}
                </div>
                `
                    :   ''
                }
                <div class="obsession-date">
                    ${date.textContent}
                </div>
            </div>
        </section>
    `;

    let manage = obsession_container.querySelector('form');
    if (manage) {
        quote.appendChild(manage);

        const trash = quote.querySelector('button');
        trash.classList.add('btn');
        trash.textContent = tl(trans.delete);
    }

    page.structure.main.insertBefore(
        quote,
        page.structure.main.firstElementChild
    );

    let author = quote.querySelector('.obsession-author');
    let badge = patch_avatar(
        obsession_avatar,
        obsession_author,
        '',
        author,
        'bottom'
    );

    if (badge.type) {
        author.classList.add('colourful');
        author.classList.add(
            `user-status--bleh-${badge.type}`,
            `user-status--bleh-user-${obsession_author}`
        );
    }

    let related = html.node`
        <section class="obsession-related sour" />
    `;

    let other_tracks = document.body.querySelector('.other-obsessions');

    if (other_tracks) {
        let header = document.createElement('h2');
        header.textContent = tl(trans.others_from_profile).replace(
            '{user}',
            obsession_author
        );
        related.appendChild(header);

        let see_more = other_tracks.nextElementSibling;

        related.appendChild(other_tracks);

        if (see_more) {
            let more = document.createElement('div');
            more.classList.add('more-link-fullwidth-right');
            more.appendChild(see_more.querySelector('a'));
            related.appendChild(more);
        }
    }

    let shared_users = document.body.querySelector('.fellow-obsessors');

    if (shared_users) {
        if (other_tracks) {
            let sep = document.createElement('div');
            sep.classList.add('sep');
            related.appendChild(sep);
        }

        let header = document.createElement('h2');
        header.textContent = tl(trans.shared_with_others);
        related.appendChild(header);

        let users = shared_users.querySelectorAll('.avatar');
        users.forEach((user) => {
            let name = user.querySelector('img').getAttribute('alt');
            patch_avatar(user, name);
        });

        related.appendChild(shared_users);
    }

    quote.after(related);

    let pages = obsession_container.querySelector('.obsession-pagination');
    if (pages) page.structure.container.appendChild(pages);
}
