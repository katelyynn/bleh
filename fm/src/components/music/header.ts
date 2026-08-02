import { page, root } from '@/build/page';
import { html, render } from 'lighterhtml';
import { avatar, expand_avatar } from '../shared/avatar';
import { settings } from '@/build/config';
import { romanise, sanitise } from '@/build/tools';
import { redirect } from './music';
import tippy from 'tippy.js';
import { tl, trans } from '@/build/trans';
import { register_menu } from '../menu';
import {
	correct_artist,
	correct_item_by_artist,
	name_includes,
	smart_title,
} from './lotus';
import { artist_corrections, combined_artists } from '@/build/music';
import { log } from '@/build/log';

interface page_header_avatar extends HTMLDivElement {
	image: HTMLImageElement;
	src: string;
}

export function page_header_avatar(url?: string): page_header_avatar {
	const supports_gallery = ['artist', 'album'].includes(page.type);

	let link = sanitise(page.name);
	if (page.type != 'artist') {
		link = `${sanitise(page.sister)}/${sanitise(page.name)}`;
	}

	let action = 'expand';
	if (supports_gallery) {
		action = settings.default_avatar_action as string;
	}

	let image: HTMLImageElement;

	const elem = html.node`
        <div class="page-header-avatar colourful" onclick=${() => {
		if (!url) return;

		if (action == 'expand') {
			expand_avatar(avatar(url, 'ar0'));
		} else if (action == 'gallery') {
			open(`${root}music/${redirect()}${link}/+images`);
		}
	}}>
            ${
		url
			? html.node`
                <img src=${
				avatar(url, 'avatar300s')
			} crossorigin="anonymous" ref=${(el) => image = el}>
            `
			: html.node`
                <img class="missing-${page.type}" crossorigin="anonymous" ref=${(
				el,
			) => image = el}>
            `
	}
        </div>
    `;

	Object.defineProperty(elem, 'image', {
		get() {
			return image;
		},
	});

	Object.defineProperty(elem, 'src', {
		get() {
			return url;
		},
	});

	const menu = tippy(elem, {
		theme: 'context-menu',
		content: html.node`
            ${
			url
				? html.node`
                <button class="dropdown-menu-clickable-item" data-type="expand" onclick=${() =>
					expand_avatar(avatar(url, 'ar0'))}>
                    ${tl(trans.expand)}
                </button>
            `
				: ''
		}
            ${
			supports_gallery
				? html.node`
                <a class="dropdown-menu-clickable-item" data-type="gallery" href="${root}music/${redirect()}${link}/+images">
                    ${tl(trans.photos)}
                </a>
                <div class="sep"></div>
                <a class="dropdown-menu-clickable-item" href="${root}bleh/customise" data-menu-item="settings">
                    ${tl(trans.settings)}
                </a>
            `
				: ''
		}
        `,
		placement: 'right-start',
		trigger: 'manual',
		interactive: true,
		interactiveBorder: 10,
		offset: [0, 0],
		appendTo: document.body,

		onShow(instance) {
			instance.popper.addEventListener('click', (event) => {
				instance.hide();
			});
		},
	});

	register_menu(elem, menu);

	return elem;
}

export function page_header_disc() {
	if (!settings.show_disc_image) return;

	return html.node`
        <div class="page-header-disc" />
    `;
}

export function artist_title(header = document.body) {
	const title = header.querySelector('.header-new-title') as HTMLElement;
	title.classList.add('page-header-title');

	let title_text = title.textContent.trim();

	let has_multi = false;
	if (title_text.includes(', ') || title_text.includes('&')) has_multi = true;

	page.multi = false;

	if (!has_multi) {
		if (!settings.corrections) {
			title.textContent = romanise(title_text);
			return;
		}

		title.textContent = romanise(correct_artist(title_text, true));
	} else {
		title_text = title_text
			.replaceAll('&', ';')
			.replaceAll(', ', ';')
			.replaceAll(';;', ';');

		for (const [key, value] of Object.entries(combined_artists)) {
			if (key == 'version') continue;

			// passing thru regex, so
			const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

			const regex = new RegExp(escaped, 'gi');

			title_text = title_text.replace(regex, value);
		}

		page.multi = true;
		title.innerHTML = '';

		let split = title_text.split(';');

		if (split.length < 2) {
			page.multi = false;

			if (!settings.corrections) return;

			title.textContent = romanise(correct_artist(title_text, true));

			return;
		}

		split.forEach((artist, index) => {
			if (index > 0) title.innerHTML += ',';

			artist = artist.trim();

			const part = document.createElement('a');
			part.classList.add('multi-artist-part');
			part.setAttribute(
				'href',
				`${root}music/${redirect()}${sanitise(artist)}`,
			);

			if (settings.corrections) {
				part.textContent = romanise(correct_artist(artist));
			} else part.textContent = romanise(artist);

			title.appendChild(part);
		});
	}
}

export function page_header_title(header = document.body) {
	page.suggest = null;

	if (
		!settings.corrections && !settings.format_guest_features && !page.multi
	) {
		return;
	}

	page.corrected = false;

	const track_title = header.querySelector('.header-new-title');
	const track_artist = header.querySelector('.header-new-crumb span');

	if (!track_title) return;

	track_title.classList.add('page-header-title');

	// correct artist
	if (track_artist) {
		// album/track page
		if (artist_corrections.hasOwnProperty(track_artist.textContent)) {
			const corrected_artist = artist_corrections[track_artist.textContent];
			log(
				`corrected ${track_artist.textContent} as ${corrected_artist}`,
				'lotus',
			);

			track_artist.parentElement.setAttribute(
				'href',
				`${root}music/${redirect()}${
					sanitise(track_artist.textContent)
				}`,
			);
			track_artist.textContent = romanise(corrected_artist);
		} else {
			track_artist.parentElement.setAttribute(
				'href',
				`${root}music/${redirect()}${
					sanitise(track_artist.textContent)
				}`,
			);
			track_artist.textContent = romanise(track_artist.textContent);
		}
	}

	if (settings.format_guest_features) {
		try {
			if (!track_title.hasAttribute('data-kate-processed')) {
				track_title.setAttribute('data-kate-processed', 'true');

				const formatted = name_includes(
					track_title.textContent,
					track_artist.textContent,
				);

				page.corrected =
					formatted.corrected_title != track_title.textContent;

				// combine
				render(
					track_title,
					smart_title(
						formatted.song_title,
						formatted.song_tags,
						true,
					),
				);

				// (spotify) / (explicit) / (clean) in title
				if (formatted.song_tags.some((tag) => tag.group == 'form')) {
					page.suggest = sanitise(formatted.song_title.trim());
				}

				const song_artist_element = document.body.querySelector(
					'span[itemprop="byArtist"]',
				);
				const song_guests = formatted.song_guests;
				page.sister_others = song_guests;
				song_artist_element.innerHTML = song_artist_element.innerHTML
					.trim();
				for (const guest in song_guests) {
					// &
					song_artist_element.innerHTML =
						`${song_artist_element.innerHTML},`;

					// no whitespace to make sure it looks correct
					song_artist_element.appendChild(html.node`
                    <a class="header-new-crumb" href="${root}music/${redirect()}${
						sanitise(song_guests[guest])
					}">${romanise(song_guests[guest])}</a>
                `);
				}
			}
		} catch (e) {}
	} else {
		if (!track_title.hasAttribute('data-kate-processed')) {
			track_title.setAttribute('data-kate-processed', 'true');

			const corrected_title = correct_item_by_artist(
				track_title.textContent,
				track_artist.textContent,
			);
			log(
				`corrected ${track_title.textContent} by ${track_artist.textContent} as ${corrected_title}`,
				'lotus',
			);

			if (corrected_title != track_title.textContent) {
				page.corrected = true;
			}

			track_title.textContent = romanise(corrected_title);
		}
	}
}
