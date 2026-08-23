/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { avatar, patch_avatar } from '@/components/shared/avatar';
import { settings } from '@/build/config';
import { log } from '@/build/log';
import { artist_corrections } from '@/build/music';
import { page, root } from '@/build/page';
import { sanitise } from '@/build/tools';
import { tl, trans } from '@/build/trans';
import {
	correct_item_by_artist,
	name_includes,
	smart_title,
} from '@/components/music/lotus';
import { checkup_page_structure } from '@/components/page/structure';
import { register_background, update_page } from '@/page';
import { html, render } from 'lighterhtml';
import { redirect } from '@/components/music/music';
import tippy from 'tippy.js';
import { hoshino } from '@/components/music/hoshino';
import { header_colour } from '@/components/page/colour';
import { icon, icons } from '@/components/shared/icon';
import { useSettings } from '@/page.ts';

export function bleh_obsession() {
	const obsession_container = document.querySelector('.obsession-container');
	if (!obsession_container) return;

	page.structure.container = document.body.querySelector(
		'.page-content:not(.obsession-container .page-content)',
	);
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

	page.structure.container.classList.add('has-cards-view');
	page.structure.content.classList.add('cards-view', 'obsession-view');

	let background = obsession_container.querySelector(
		'.obsession-background-inner',
	);
	background = background.style
		.getPropertyValue('background-image')
		.replace('url("', '')
		.replace('")', '');

	if (!background.endsWith('/4128a6eb29f94943c9d206c08e625904.jpg')) {
		register_background(background);

		header_colour(
			html.node`<img src=${avatar(background, 'avatar300s')} />`,
			true,
		);
	} else {
		register_background('');
	}

	const track_title = obsession_container.querySelector(
		'.obsession-meta-track',
	);
	const track_artist = obsession_container.querySelector(
		'.obsession-meta-artist',
	);
	const scrobbles = obsession_container.querySelector(
		'.obsession-meta-scrobbles',
	);

	const link = track_title.querySelector('a').getAttribute('href');

	const by = track_artist.querySelector('.obsession-meta-artist-by');
	track_artist.removeChild(by);

	// correct artist
	const artist_name = track_artist.querySelector('a');
	if (artist_corrections.hasOwnProperty(artist_name.textContent)) {
		const corrected_artist = artist_corrections[artist_name.textContent];
		log(
			`corrected ${artist_name.textContent} as ${corrected_artist}`,
			'lotus',
		);
		artist_name.textContent = corrected_artist;
	}

	artist_name.classList.add('header-new-crumb');

	if (useSettings.get('format_guest_features')) {
		const formatted = name_includes(
			track_title.textContent.trim(),
			artist_name.textContent,
		);

		page.corrected = formatted.corrected_title;

		// combine
		track_title.classList.add('smart-title');
		render(
			track_title,
			smart_title(formatted.song_title, formatted.song_tags),
		);

		const song_guests = formatted.song_guests;
		page.sister_others = song_guests;
		for (const guest in song_guests) {
			// &
			track_artist.innerHTML = `${track_artist.innerHTML},`;

			const guest_element = document.createElement('a');
			guest_element.classList.add('header-new-crumb');
			guest_element.setAttribute(
				'href',
				`${root}music/${redirect()}${sanitise(song_guests[guest])}`,
			);
			guest_element.textContent = song_guests[guest];

			track_artist.appendChild(guest_element);
		}
	} else {
		if (!track_title.hasAttribute('data-kate-processed')) {
			track_title.setAttribute('data-kate-processed', 'true');

			const corrected_title = correct_item_by_artist(
				track_title.textContent.trim(),
				artist_name.textContent,
			);
			log(
				`corrected ${track_title.textContent} by ${artist_name.textContent} as ${corrected_title}`,
				'lotus',
			);

			if (corrected_title != track_title.textContent) {
				page.corrected = true;
			}

			track_title.textContent = corrected_title;
		}
	}

	track_title.classList.remove('obsession-meta-track');

	const track_header = html.node`
        <section class="page-header for-track for-obsession">
            <div class="page-header-info">
                <div class="sub-text">${tl(trans.obsession)}</div>
                <div class="title-container">
                    <h1 class="header-new-title page-header-title"><a href="${link}">${track_title}</a></h1>
                </div>
                <h2 class="page-header-artist artist-for-track">${
		html.node([track_artist.innerHTML])
	}</h2>
            </div>
        </section>
    `;

	page.structure.container.insertBefore(
		track_header,
		page.structure.container.firstElementChild,
	);

	const video = obsession_container.querySelector(
		'.obsession-video-container',
	);
	if (video) track_header.after(video);

	// remove quotations
	const obsession_reason = obsession_container.querySelector(
		'.obsession-reason',
	);
	if (obsession_reason) {
		const obsession_reason_text = obsession_reason.textContent;
		obsession_reason.textContent = obsession_reason_text
			.trim()
			.substr(1)
			.slice(0, -1);
	}

	const obsession_author = document.querySelector(
		'.obsession-details-intro a',
	).textContent;
	const obsession_avatar = document.querySelector(
		'.obsession-details-intro-avatar-wrap .avatar',
	);

	page.name = obsession_author;

	const date = obsession_container.querySelector(
		'.obsession-details-date-short',
	);

	const first = obsession_container.querySelector('.obsession-first');

	const quote = html.node`
        <section class="obsession-quote sour">
            ${
		first
			? () => {
				const elem = html.node`
                    <div class="grid-item-icon grid-item-icon-first colourful obsession-first-icon">
                        ${icon({ name: icons.star })}
                    </div>
                    `;

				tippy(elem, {
					content: tl(trans.obsession_first),
				});

				return elem;
			}
			: ''
	}
            ${
		obsession_reason
			? html.node`
            <div class="quote">
                ${obsession_reason.textContent.trim()}
            </div>
            `
			: html.node`
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
		scrobbles
			? html.node`
                <div class="obsession-listens icon-mask">
                    ${html.node([scrobbles.innerHTML])}
                </div>
                `
			: ''
	}
                <div class="obsession-date icon-mask">
                    ${date.textContent}
                </div>
            </div>
        </section>
    `;

	const manage = obsession_container.querySelector('form');
	if (manage) {
		quote.appendChild(manage);

		const trash = quote.querySelector('button');
		trash.classList.add(
			'see-more',
			'left-icon',
			'danger-subtle',
			'colourful',
		);
		trash.setAttribute('data-type', 'delete');
		trash.textContent = tl(trans.delete);
	}

	page.structure.main.insertBefore(
		quote,
		page.structure.main.firstElementChild,
	);

	const author = quote.querySelector('.obsession-author');
	const badge = patch_avatar(
		obsession_avatar,
		obsession_author,
		'',
		author,
		'bottom',
	);

	if (badge.type) {
		author.classList.add('colourful');
		author.classList.add(
			`user-status--bleh-${badge.type}`,
			`user-status--bleh-user-${obsession_author}`,
		);
	}

	const related = html.node`
        <section class="obsession-related sour" />
    `;

	const other_tracks = document.body.querySelector('.other-obsessions');

	if (other_tracks) {
		const header = document.createElement('h2');
		header.textContent = tl(trans.others_from_profile).replace(
			'{user}',
			obsession_author,
		);
		related.appendChild(header);

		const see_more = other_tracks.nextElementSibling;

		related.appendChild(other_tracks);

		if (see_more) {
			const more = document.createElement('div');
			more.classList.add('more-link-fullwidth-right');
			more.appendChild(see_more.querySelector('a'));
			related.appendChild(more);
		}
	}

	const shared_users = document.body.querySelector('.fellow-obsessors');

	if (shared_users) {
		if (other_tracks) {
			const sep = document.createElement('div');
			sep.classList.add('sep');
			related.appendChild(sep);
		}

		const header = document.createElement('h2');
		header.textContent = tl(trans.shared_with_others);
		related.appendChild(header);

		const users = shared_users.querySelectorAll('.avatar');
		users.forEach((user) => {
			const name = user.querySelector('img').getAttribute('alt');
			patch_avatar(user, name);
		});

		related.appendChild(shared_users);
	}

	quote.after(related);

	const pages = obsession_container.querySelector('.obsession-pagination');
	if (pages) {
		page.structure.container.appendChild(pages);

		const links = pages.querySelectorAll('a');
		links.forEach((link) => {
			link.classList.add('obsession-pagination-link');
		});
	}
}

export function obsession_list() {
	const section_controls = page.structure.container.querySelector(
		'.section-controls',
	);
	let buttons;
	if (section_controls != null) {
		section_controls.classList.add('legacy-section-controls');
		buttons = section_controls.querySelectorAll(':is(button, a)');

		const header = page.structure.container.querySelector(
			'.content-top-header',
		);
		page.structure.content_top.innerHTML = `
            <div class="content-top-inner-wrap">
                <div class="container content-top-lower">
                    <h1 class="content-top-header">${header.textContent.trim()}</h1>
                </div>
            </div>
        `;
	}

	const count_text = page.structure.content_top
		.querySelector('h1')
		.textContent.trim();
	const chr = count_text.indexOf('(');

	let count = 0;
	if (chr != -1) {
		count = count_text
			.substring(chr)
			.replace('(', '')
			.replace(')', '');
	}

	page.structure.nav.querySelector(
		'.secondary-nav-item--obsessions a',
	).appendChild(html.node`
        <div class="new-badge count-badge">${count}</div>
    `);

	const new_panel = document.createElement('section');
	new_panel.classList.add('obsessions-panel');

	const wrap = document.createElement('div');
	wrap.classList.add('view-buttons-wrapper');
	const button_header = document.createElement('div');
	button_header.classList.add(
		'view-buttons',
		'obsession-buttons',
		'blend',
	);

	buttons.forEach((button) => {
		if (button.classList.contains('btn-sm')) {
			button.classList = [];
			button.setAttribute('data-type', 'obsession');

			tippy(button, {
				content: button.textContent,
			});

			button.textContent = tl(trans.obsess);
		}

		button.classList.add(
			'btn',
			'view-item',
			'interact-item',
			'obsession-top-item',
			'icon',
		);

		button_header.appendChild(button);
	});
	wrap.appendChild(button_header);
	new_panel.appendChild(wrap);

	page.structure.main.appendChild(new_panel);

	//

	const grid = document.createElement('ol');
	grid.classList.add(
		'grid-items',
		'grid-items--numbered',
		'obsessions-grid',
	);

	const items = page.structure.container.querySelectorAll(
		'.obsession-history-item',
	);
	items.forEach((item) => {
		let link = item.querySelector(
			'.obsession-history-item-heading-link',
		);

		let artist = item.querySelector(
			'.obsession-history-item-artist a',
		);
		const artist_link = artist.getAttribute('href');
		artist = artist.textContent.trim();

		const title = link.textContent.trim();
		link = link.getAttribute('href');
		const date = item
			.querySelector('.obsession-history-item-date')
			.textContent.trim();

		const bg = item
			.querySelector('.obsession-history-item-background')
			.style.getPropertyValue('background-image')
			.trim();
		const cover_substr = bg.indexOf('url');
		const cover = html.node`
            <img
            src=${
			bg
				.substring(cover_substr)
				.replace('url("', '')
				.replace('")', '')
				.trim()
		}
            alt=${title} loading="lazy">
        `;

		hoshino(cover, title, artist);

		const obsession_is_first =
			item.querySelector('.obsession-first') != null;

		const grid_item = html.node`
            <li class="grid-items-item obsessions-item ${
			obsession_is_first ? 'first' : ''
		}">
                ${
			obsession_is_first
				? html.node`
                    <div class="grid-item-icon grid-item-icon-first colourful">
                        ${icon({ name: icons.star })}
                    </div>
                `
				: ''
		}
                <div class="grid-items-cover-image">
                    <div class="grid-items-cover-image-image ${
			cover.src.endsWith('4128a6eb29f94943c9d206c08e625904.jpg')
				? 'grid-items-cover-default'
				: ''
		}">
                        ${cover}
                    </div>
                    <div class="grid-items-item-details">
                        <p class="grid-items-item-main-text">
                            <a class="link-block-target" href="${link}" title="${title}">
                                ${title}
                            </a>
                        </p>
                        <p class="grid-items-item-aux-text obsessions-item-aux">
                            <a class="grid-items-item-aux-block" href="${artist_link}">
                                ${artist}
                            </a>
                            <a class="obsessions-item-date" href="${link}">
                                ${date}
                            </a>
                        </p>
                    </div>
                    <a class="link-block-cover-link" href="${link}" tabindex="-1" aria-hidden="true"></a>
                </div>
            </li>
        `;

		if (obsession_is_first) {
			tippy(grid_item, {
				content: tl(trans.obsession_first),
			});
		}

		grid.appendChild(grid_item);
	});

	new_panel.appendChild(grid);

	const no_data = page.structure.container.querySelector(
		'.no-data-message--obsession-history',
	);
	if (no_data) wrap.after(no_data);

	const pagination = page.structure.container.querySelector('.pagination');
	if (pagination) new_panel.appendChild(pagination);
}
