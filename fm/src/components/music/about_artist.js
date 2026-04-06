//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { html, render } from 'lighterhtml';
import { page, root } from '@/build/page';
import { sanitise } from '@/build/tools';
import { tl, trans } from '@/build/trans';
import { expand_avatar } from '@/components/shared/avatar';
import { correct_artist } from '@/components/music/lotus';
import { redirect } from '@/components/music/music';
import { bleh_tags_mini } from '@/pages/tag';

export function bleh_about_artist() {
    let legacy_container = page.structure.main.querySelector('.about-artist');
    if (!legacy_container) return;

    let avatar = legacy_container.querySelector(
        '.gallery-preview-image--0 img'
    );
    let listeners = legacy_container.querySelector('.about-artist-listeners');
    let tags = legacy_container.querySelector('.about-artist-tags');

    let wiki = legacy_container.querySelector('.wiki-block.visible-lg');
    if (wiki) wiki.classList.remove('visible-lg');

    let about_artist_container = legacy_container.parentElement;
    about_artist_container.classList.add('about-artist-container');

    bleh_tags_mini(tags);

    render(
        about_artist_container,
        html`
            <div class="about-artist-panel">
                <div class="avatar-side">
                    ${avatar ?
                        html.node`
                    <img src=${avatar.src.replace('/300x300/', '/500x500/')}>
                    <a onclick=${() => expand_avatar(avatar.src.replace('/300x300/', '/ar0/'))} class="bleh--avatar-clickable-link"></a>
                `
                    :   html.node`
                    <img class="missing-artist">
                `}
                </div>
                <div class="info-side">
                    <div class="sub-text">${tl(trans.about)}</div>
                    <h1>
                        <a
                            href="${root}music/${redirect()}${sanitise(
                                page.sister
                            )}"
                            >${correct_artist(page.sister)}</a
                        >
                    </h1>
                    ${listeners} ${tags} ${wiki}
                </div>
            </div>
            ${page.sister_others.length > 0 ?
                html.node`<div class="sep"></div><div class="sub-text">${tl(trans.others_featured)}</div>`
            :   ''}
        `
    );

    // there are guest features
    if (page.sister_others.length > 0) {
        about_artist_container.appendChild(html.node`
            <div class="about-guest-features-panel">
                ${page.sister_others.map((guest) => {
                    return html.node`
                        <a class="btn about-guest-feature" href="${root}music/${redirect()}${sanitise(guest)}">
                            ${guest}
                        </a>
                    `;
                })}
            </div>
        `);
    }

    page.structure.side.appendChild(about_artist_container);
}
