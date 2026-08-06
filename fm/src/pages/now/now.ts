/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { settings } from '@/build/config';
import { log } from '@/build/log';
import { auth, page, root, urls } from '@/build/page';
import { romanise } from '@/build/tools';
import {
	correct_artist,
	correct_item_by_artist,
	name_includes,
	smart_artists,
	smart_title,
} from '@/components/music/lotus';
import { header_colour } from '@/components/page/colour';
import { checkup_page_structure } from '@/components/page/structure';
import { avatar } from '@/components/shared/avatar';
import { is_url, register_background, update_page } from '@/page';
import { html, render } from 'lighterhtml';
import { useSettings } from '@/config.ts';

export function bleh_now() {
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

	page.type = 'bleh_now';
	page.subpage = '';

	log('status is', 'page', 'info', page);

	update_page();

	// remove error stuff cus we control this page
	page.structure.row.removeChild(page.structure.row.firstElementChild);
	page.structure.row.removeChild(page.structure.row.firstElementChild);

	page.structure.container.classList.add('has-cards-view');
	page.structure.content.classList.add('cards-view');

	let now_header: HTMLElement;
	let now_content: HTMLElement;

	page.structure.main.classList.add('now-container');
	render(
		page.structure.main,
		html`
			<header class="now-header" ref=${(el) => now_header = el} />
			<section class="now-content sour" ref=${(el) => now_content = el} />
		`,
	);

	let now = {
		name: null,
		artist: null,
		cover: null,
	};

	get_recents(auth.name);
	const timer = setInterval(() => {
		if (!is_url(urls.now)) {
			clearInterval(timer);
			return;
		}

		get_recents(auth.name);
	}, 10000);

	function get_recents(user: string) {
		fetch(`${root}user/${user}/partial/recenttracks?ajax=1`)
			.then((res) => res.text())
			.then((dom) => {
				const parser = new DOMParser();
				const doc = parser.parseFromString(dom, 'text/html');

				const list = doc.querySelector('.chartlist');
				if (!list) return;

				const items = list.querySelectorAll(
					'.chartlist-row:not(.chartlist-row--interlist-ad)',
				);
				if (!items) return;

				const most_recent = items[0];
				const name = most_recent.querySelector('.chartlist-name')
					.textContent.trim();
				const artist = most_recent.querySelector('.chartlist-artist')
					.textContent.trim();
				const cover = most_recent.querySelector('.cover-art > img')
					?.src;

				const previous_now = now;
				now = {
					name,
					artist,
					cover,
				};

				if (
					previous_now.name == name && previous_now.artist == artist
				) return;

				new_poll();
			});
	}

	function new_poll() {
		console.info('new poll', now);

		register_background(avatar(now.cover, 'avatar300s'));

		const name = romanise(correct_item_by_artist(now.name, now.artist));
		const artist = romanise(correct_artist(now.artist));

		const song_link = html.node`
            <a href="${root}music/${now.artist}/_/${now.name}" target="_blank" />
        `;

		let artist_link = html.node`
            <a href="${root}user/${now.artist}" target="_blank">${artist}</a>
        `;

		if (useSettings.get('format_guest_features')) {
			const formatted = name_includes(now.name, now.artist);

			song_link.classList.add('smart-title');
			render(
				song_link,
				smart_title(formatted.song_title, formatted.song_tags),
			);

			artist_link = html.node`${
				smart_artists(formatted.song_artist, formatted.song_guests)
			}`;
		} else {
			song_link.textContent = name;
		}

		let now_image: HTMLElement;

		render(now_header, html``);
		render(
			now_header,
			html`
				<div class="now-header-image-container">
					<div class="now-header-image cover-art colourful" ref=${(
						el,
					) => now_image = el}>
						<img src=${avatar(now.cover, '500x500')} alt=${name}>
					</div>
					<div class="now-header-image now-header-image-reflect">
						<img src=${avatar(now.cover, '500x500')} alt=${name}>
					</div>
				</div>
				<div class="now-header-info">
					<h1 class="now-header-head">
				        ${song_link}
				    </h1>
					<h3 class="now-header-artist">
				        ${artist_link}
				    </h3>
				</div>
			`,
		);

		header_colour(
			html.node`<img src=${
				avatar(now.cover, 'avatar300s')
			} />` as HTMLImageElement,
			true,
			[now_image],
		);
	}
}
