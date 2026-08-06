/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { html } from 'lighterhtml';
import { settings } from '@/build/config';
import { log } from '@/build/log';
import { auth, page, root } from '@/build/page';
import {
	correct_artist,
	correct_item_by_artist,
} from '@/components/music/lotus';
import { checkup_page_structure } from '@/components/page/structure';
import { patch_titles } from '@/components/music/track';
import { register_background, update_page } from '@/page';
import { tl, trans } from '@/build/trans';
import { load_profile_cache_externally } from '@/pages/profile/profile';
import { sanitise } from '@/build/tools';
import tippy from 'tippy.js';
import { avatar } from '@/components/shared/avatar';
import { icon, icons } from '@/components/shared/icon';
import { useSettings } from '@/config.ts';

export async function bleh_search() {
	page.structure.container = document.body.querySelector('.page-content');
	try {
		page.structure.row = page.structure.container.querySelector('.row');
		page.structure.main = page.structure.row.querySelector('.col-main');
		page.structure.side = page.structure.row.querySelector('.col-sidebar');
	} catch (e) {
		log('unable to find elements', 'page structure');
	}

	const content_top = document.body.querySelector('.content-top');

	const search_form = page.structure.main.querySelector('.search-form');
	const search = search_form.querySelector('#site-search');
	const value = search.getAttribute('value');

	if (!page.mobile) {
		let site_search = document.body.querySelector('#masthead-search-field');
		site_search.setAttribute('value', value);
		site_search.focus();
		page.structure.main.removeChild(search_form);
	}

	page.name = (value != '') ? value : 'empty..';

	checkup_page_structure(false, content_top);
	log('status is', 'page', 'info', page);
	update_page();

	if (page.subpage != 'overview') {
		const new_panel = document.createElement('section');
		new_panel.classList.add('search-results-panel');

		const elements = page.structure.main.querySelectorAll(
			':scope > *:not(form)',
		);
		elements.forEach((element) => {
			new_panel.appendChild(element);
		});

		page.structure.main.appendChild(new_panel);
	}

	if (page.subpage == 'overview' || page.subpage == 'tracks') {
		patch_titles();
	}

	if (page.subpage == 'artists' && useSettings.get('corrections')) {
		const artists = page.structure.main.querySelectorAll(
			'.artist-result-heading a',
		);
		artists.forEach((artist) => {
			artist.textContent = correct_artist(artist.textContent);
		});
	}

	if (page.subpage == 'albums') {
		let results = page.structure.main.querySelectorAll(
			'.album-result-inner',
		);
		results.forEach((result) => {
			const heading = result.querySelector('.album-result-heading a');
			const artist_parent = result.querySelector('.album-result-artist');
			const artist = artist_parent.querySelector('a');

			artist.textContent = correct_artist(artist.textContent);

			heading.textContent = correct_item_by_artist(
				heading.textContent,
				artist.textContent,
			);

			// match artists
			const image = result.querySelector('.album-result-image');
			const image_parent = document.createElement('span');
			image_parent.classList.add('avatar', 'album-result-image');
			image_parent.appendChild(image);

			image.classList = [];

			artist_parent.after(image_parent);
		});
	}

	page.structure.container.insertBefore(
		html.node`
        <section class="page-header for-generic">
            <div class="page-header-icon">
                ${icon({ name: icons.search })}
            </div>
            <div class="page-header-info">
                <div class="sub-text">${tl(trans.search)}</div>
                <h1 class="page-header-title generic-page-title">${value}</h1>
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

	if (!auth.pro) return;

	const nav_items = page.structure.nav.querySelector('.navlist-items');
	let explore;
	nav_items.appendChild(html.node`
        <li class="fill"></li>
        <li class="navlist-item secondary-nav-item secondary-nav-item--library">
            <a class="secondary-nav-item-link" ref=${(el) => explore = el}>
                ${tl(trans.explore_in_library)}
            </a>
        </li>
    `);

	tippy(explore, {
		content: html.node`
            <a class="dropdown-menu-clickable-item" data-type="artist" href="${root}user/${auth.name}/library/artists/search?query=${
			sanitise(value)
		}">
                ${tl(trans.artists)}
            </a>
            <a class="dropdown-menu-clickable-item" data-type="album" href="${root}user/${auth.name}/library/albums/search?query=${
			sanitise(value)
		}">
                ${tl(trans.albums)}
            </a>
            <a class="dropdown-menu-clickable-item" data-type="track" href="${root}user/${auth.name}/library/tracks/search?query=${
			sanitise(value)
		}">
                ${tl(trans.tracks)}
            </a>
        `,
		theme: 'menu',
		placement: 'bottom',
		interactive: true,
		interactiveBorder: 10,
		trigger: 'click',

		onShow(instance) {
			instance.popper.addEventListener('click', (event) => {
				instance.hide();
			});
		},
	});
}
