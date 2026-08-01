//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { html, render } from 'lighterhtml';
import { page, root } from '@/build/page';
import { sanitise } from '@/build/tools';
import { tl, trans } from '@/build/trans';
import { avatar, expand_avatar } from '@/components/shared/avatar';
import { correct_artist } from '@/components/music/lotus';
import { redirect } from '@/components/music/music';
import { bleh_tags_mini } from '@/pages/tag';

export function bleh_about_artist() {
	let legacy_container = page.structure.main.querySelector('.about-artist');
	if (!legacy_container) return;

	let image = legacy_container.querySelector('.gallery-preview-image--0 img');
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
			    <div class="about-artist-avatar">
			        ${image
				? html.node`
                <img src=${avatar(image.src, 'avatar300s')}>
                `
				: html.node`
                <img class="missing-artist">
                `}
			    </div>
			    <div class="about-artist-info">
			        <div class="sub-text">${tl(trans.about)}</div>
			        <h1 class="about-artist-name">${correct_artist(
				page.sister,
			)}</h1>
			        ${listeners} ${tags} ${wiki}
			    </div>
			    <a class="link-block-cover-link" href="${root}music/${redirect()}${sanitise(
				page.sister,
			)}" />
			</div>
			${page.sister_others.length > 0
				? html.node`
        <div class="sep"></div><div class="sub-text">${
					tl(trans.others_featured)
				}</div>
        `
				: ''}
		`,
	);

	// there are guest features
	if (page.sister_others.length > 0) {
		about_artist_container.appendChild(html.node`
            <div class="about-guest-features-panel">
                ${
			page.sister_others.map((guest) => {
				return html.node`
                        <a class="btn about-guest-feature" href="${root}music/${redirect()}${
					sanitise(guest)
				}">
                            ${guest}
                        </a>
                    `;
			})
		}
            </div>
        `);
	}

	page.structure.side.appendChild(about_artist_container);
}
