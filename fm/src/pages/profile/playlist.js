/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { html } from 'lighterhtml';
import { log } from '@/build/log';
import { auth, page } from '@/build/page';
import { tl, trans } from '@/build/trans';
import { checkup_page_structure } from '@/components/page/structure';
import { register_background, update_page } from '@/page';
import { load_profile_cache_externally } from './profile';
import { avatar } from '@/components/shared/avatar';

export async function bleh_playlist() {
	page.structure.container = document.body.querySelector('.page-content');
	try {
		page.structure.row = page.structure.container.querySelector('.row');
		page.structure.main = page.structure.row.querySelector('.col-main');
		page.structure.side = page.structure.row.querySelector('.col-sidebar');
	} catch (e) {
		log('unable to find elements', 'page structure');
	}

	const content_top = document.body.querySelector('.content-top');

	checkup_page_structure(false, content_top);
	log('status is', 'page', 'info', page);
	update_page();

	const value = page.structure.container.querySelector('.content-top-header')
		?.textContent;

	page.structure.container.insertBefore(
		html.node`
        <section class="redesigned-header search-header no-background">
            <div class="tag-side">
                <div class="tag-icon playlist-icon"></div>
            </div>
            <div class="info-side">
                <div class="sub-text">${tl(trans.playlists)}</div>
                <h1>${value}</h1>
            </div>
        </section>
    `,
		page.structure.container.firstElementChild,
	);

	let cache;
	if (auth.name) {
		cache = await load_profile_cache_externally(auth.name);
		if (cache.banner) {
			register_background(cache.banner);
		} else if (
			auth.avatar &&
			!auth.avatar.endsWith('818148bf682d429dc215c1705eb27b98.png')
		) {
			register_background(avatar(auth.avatar, 'ar0'));
		} else {
			register_background(null);
		}
	} else {
		register_background(null);
	}

	const options = page.structure.container.querySelector(
		'.playlisting-create-options',
	);
	const generate = page.structure.container.querySelector(
		'.playlisting-generate-search-container',
	);

	if (options) {
		const back = page.structure.container.querySelector(
			'.content-top-back-link',
		);
		const back_link = back.querySelector('a');
		back.remove();

		const form = page.structure.container.querySelector(
			':scope > .buffer-standard > form',
		);
		const form_btn = form.querySelector('button');
		form_btn.classList = 'btn inbox-button accented icon';
		form_btn.setAttribute('data-type', 'create-from-scratch');
		form.parentElement.remove();

		page.structure.main.appendChild(html.node`
            <section class="playlist-creator">
                <div class="inbox-message-buttons">
                    <a class="back-button btn inbox-button icon" href=${
			back_link.getAttribute('href')
		}>
                        ${tl(trans.back)}
                    </a>
                    ${form}
                </div>
                ${options}
            </section>
        `);
	} else if (generate) {
		page.structure.main.appendChild(html.node`
            <section class="playlist-generator">
                ${generate}
            </section>
        `);
	}
}
