/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { settings } from '@/build/config';
import { log } from '@/build/log';
import { auth, page, root } from '@/build/page';
import { clean_number, desanitise, sanitise } from '@/build/tools';
import { tl, trans } from '@/build/trans';
import { bleh_about_artist } from '@/components/music/about_artist.js';
import {
	bleh_music_page_charts,
	redirect,
	show_your_scrobbles,
	similar_items,
} from '@/components/music/music';
import { checkup_page_structure } from '@/components/page/structure';
import { is_same_page, register_background, update_page } from '@/page';
import { ff } from '@/components/settings/sku';
import { bleh_gallery_list, bleh_gallery_upload } from '@/pages/music/gallery';
import { bleh_tags_mini } from '@/pages/tag';
import {
	bleh_wiki,
	bleh_wiki_editor,
	bleh_wiki_history,
} from '@/pages/music/wiki';
import { html, render } from 'lighterhtml';
import { setting } from '@/components/settings/settings';
import tippy from 'tippy.js';
import { oracle_process } from '@/components/music/oracle';
import { save_hoshino_artwork } from '@/components/music/hoshino.js';
import {
	page_header_avatar,
	page_header_disc,
	page_header_title,
} from '@/components/music/header';
import { header_colour } from '@/components/page/colour';

export function bleh_albums() {
	const album_header = document.body.querySelector(
		'.header-new--album',
	) as HTMLElement;

	page.sister =
		album_header.querySelector('.header-new-crumb span').textContent;
	page.name = document.body
		.querySelector('[data-page-resource-name]')
		.getAttribute('data-page-resource-name');

	page_header_title(album_header);

	const is_subpage = page.subpage != 'overview';

	// without pro theres two containers
	if (auth.pro) {
		// pro

		page.structure.container = document.body.querySelector(
			'.page-content:not(:has(.content-top-lower-row, a + .js-gallery-heading))',
		);
	} else {
		// not pro

		if (!is_subpage) {
			// normal, is there an ad then a container?
			page.structure.container = document.body.querySelector(
				'.full-bleed-ad-container + .page-content:not(.visible-xs)',
			);

			// death grips for some reason
			if (!page.structure.container) {
				page.structure.container = document.body.querySelector(
					'.page-content',
				);
			}
		} else {
			page.structure.container = document.body.querySelector(
				'.page-content:not(:has(.content-top-lower-row, a + .js-gallery-heading))',
			);
		}
	}
	page.structure.row = page.structure.container.querySelector('.row');
	try {
		page.structure.main = page.structure.row.querySelector(
			'.col-main:not(.visible-xs, .hidden-xs, .upper-overview)',
		);
		if (!is_subpage) {
			page.structure.side = page.structure.row.querySelector(
				'.col-sidebar.hidden-xs.masonry-right-bottom',
			);
		} else {
			page.structure.side = page.structure.row.querySelector(
				'.col-sidebar.hidden-xs',
			);
		}
	} catch (e) {
		log('unable to find elements', 'page structure');
	}

	checkup_page_structure(is_subpage, album_header);

	if (ff('refreshed_music_nav')) {
		const avatar = album_header.querySelector(
			'.header-new-background-image',
		);
		const title = album_header.querySelector('.header-new-title');
		const artist = album_header.querySelector('[itemprop="byArtist"]');
		const position = album_header.querySelector(
			'.header-new-chart-position-number',
		);

		const avatar_img = avatar?.getAttribute('content').replace(
			'/ar0/',
			'/avatar300s/',
		);

		const listeners = document.body.querySelector(
			'.header-new-info-desktop .header-metadata-tnew-display > p > abbr',
		);

		save_hoshino_artwork(
			avatar_img,
			page.name,
			page.sister,
			clean_number(listeners?.title),
		);

		let page_avatar;

		const same_page = is_same_page();

		const redesigned_album_header = html.node`
            <section class="page-header for-album ${same_page ? 'same' : ''}">
                <div class="page-header-avatar-list">
                    ${page_avatar = page_header_avatar(avatar_img)}
                    ${page_header_disc()}
                </div>
                <div class="page-header-info">
                    <div class="sub-text" ref=${(el) =>
			page.state.header_type = el}>${tl(trans.album)}</div>
                    <div class="title-container">
                        ${title}
                        ${position ? position : ''}
                    </div>
                    <h2 class="page-header-artist artist-for-album">${artist}</h2>
                </div>
                ${
			page.suggest
				? html.node`
                <div class="suggest-side">
                    <div class="cta suggest">
                        <strong>${tl(trans.suggest_title.name)}</strong>
                        <a class="see-more" href="${root}music/${redirect()}${
					sanitise(page.sister)
				}/${page.suggest}">${
					tl(trans.suggest_title.body).replace(
						'{v}',
						desanitise(page.suggest, '+'),
					)
				}</a>
                    </div>
                </div>
                `
				: ''
		}
        `;

		header_colour(page_avatar.image, settings.hue_from_album, [
			page_avatar,
		]);

		if (avatar) register_background(avatar.getAttribute('content'));
		else register_background(null);

		page.structure.container.insertBefore(
			redesigned_album_header,
			page.structure.container.firstElementChild,
		);
		album_header.classList.add('legacy-header');
	}

	if (!is_subpage) {
		show_your_scrobbles();

		bleh_music_page_charts();

		album_missing_a_tracklist();

		bleh_about_artist();

		bleh_tags_mini();

		similar_items();
	} else {
		const btn_add = page.structure.side.querySelector('.add-button');
		if (btn_add) btn_add.setAttribute('data-page-subpage', page.subpage);

		if (page.subpage == 'images_image-upload') bleh_gallery_upload();
		else if (page.subpage == 'images_overview') bleh_gallery_list();
		else if (page.subpage == 'wiki_overview') bleh_wiki();
		else if (page.subpage == 'wiki_history') bleh_wiki_history();
		else if (page.subpage == 'wiki_edit') bleh_wiki_editor();
	}

	if (ff('oracle') && settings.oracle_beta) {
		oracle_process();
	} else {
		const old_tracklist = page.structure.main.querySelector('#tracklist');
		if (old_tracklist) {
			const buffer = old_tracklist.querySelector('.buffer-standard');

			if (buffer) {
				const more = buffer.querySelectorAll('.more-items');
				more.forEach((item) => {
					item.classList.add('more-tracklist-items');
				});
			}
		}
	}

	log('status is', 'page', 'info', page);
	update_page();
}

function album_missing_a_tracklist() {
	// tracklist
	let tracklist = page.structure.main.querySelector('#tracklist');

	let settings_btn;

	if (tracklist) {
		const top = tracklist.querySelector('.section-controls');
		top.classList = 'top-container';

		const header = top.querySelector('h3');

		const select_btn = top.querySelector('.dropdown-menu-clickable-button');

		if (select_btn) {
			select_btn.classList.add(
				'select-button',
				'link-select',
				'blend-v2-btn',
			);
			select_btn.classList.remove('dropdown-menu-clickable-button');
		}

		header.after(html.node`
            <div class="accompany view-buttons blend blend-v2">
                ${select_btn}
            </div>
            <div class="view-buttons blend blend-v2">
                <button class="left-icon blend-v2-btn" data-type="settings" ref=${(
			el,
		) => (settings_btn = el)}>
                    ${tl(trans.settings)}
                </button>
            </div>
        `);
	} else if (!ff('oracle') || !settings.oracle_beta) {
		const top_overview = page.structure.main.querySelector(
			'.music-summary',
		);
		if (!top_overview) return;

		const top = html.node`
            <div class="top-container">
                <h3 class="text-18">${tl(trans.tracklist)}</h3>
                <div class="view-buttons blend blend-v2">
                    <button class="left-icon blend-v2-btn" data-type="settings" ref=${(
			el,
		) => (settings_btn = el)}>
                        ${tl(trans.settings)}
                    </button>
                </div>
            </div>
        `;

		tracklist = html.node`
            <section>
                ${top}
                <div class="loading-data-container">
                    <p class="loading-data-text">${
			tl(trans.gathering_your_plays)
		}</p>
                </div>
            </section>
        `;
		top_overview.after(tracklist);

		/*let url_split = window.location.href.split('/');
        let album_url = `${url_split[(url_split.length - 2)]}/${url_split[(url_split.length - 1)]}`;
        let album_as_track_url = window.location.href.replace(album_url, `${url_split[(url_split.length - 2)]}/_/${url_split[(url_split.length - 1)]}`);*/

		let url = document.querySelector('.header-metadata-display a');
		if (!url) {
			const url_split = window.location.href.split('/');
			const album_url = `${url_split[url_split.length - 2]}/${
				url_split[url_split.length - 1]
			}`;
			const album_as_track_url = window.location.href.replace(
				album_url,
				`${url_split[url_split.length - 2]}/_/${
					url_split[url_split.length - 1]
				}`,
			);

			render(
				tracklist,
				html`
					${top}
					<div class="loading-data-container">
					    <p class="loading-data-text failed">
					        ${tl(trans.failed_to_find_tracks)}
					    </p>
					    <a class="see-more" href="${album_as_track_url}">
					        ${tl(trans.open_album_as_track)}
					    </a>
					</div>
				`,
			);
			return;
		}
		url = url.getAttribute('href');

		// we need to fetch the tracklist
		fetch(url)
			.then(function (response) {
				console.error('returned', response, response.text);

				return response.text();
			})
			.then(function (dom) {
				const doc = new DOMParser().parseFromString(dom, 'text/html');

				//deliver_notif(`using url ${`/user/${auth.name}/library/music/${album_url}`}`);
				console.log('DOC', doc);

				const inner_tracklist = doc.querySelector(
					'#top-tracks-section [v-else=""] .chartlist',
				);
				if (inner_tracklist == null) {
					const url_split = window.location.href.split('/');
					const album_url = `${url_split[url_split.length - 2]}/${
						url_split[url_split.length - 1]
					}`;
					const album_as_track_url = window.location.href.replace(
						album_url,
						`${url_split[url_split.length - 2]}/_/${
							url_split[url_split.length - 1]
						}`,
					);

					render(
						tracklist,
						html`
							${top}
							<div class="loading-data-container">
							    <p class="loading-data-text failed">
							        ${tl(trans.failed_to_find_tracks)}
							    </p>
							    <a class="see-more" href=${album_as_track_url}>
							        ${tl(trans.open_album_as_track)}
							    </a>
							</div>
						`,
					);
					return;
				}

				inner_tracklist.classList.remove('chartlist--with-image');

				render(
					tracklist,
					html`
						${top}
						<div class="alert alert-info">
						    ${tl(trans.sourced_from_own_plays)}
						</div>
						${inner_tracklist}
					`,
				);
			});
	}

	tippy(settings_btn, {
		theme: 'window',
		content: html.node`
            <div class="dialog-settings">
                <div class="setting-group blend">
                    ${setting({ id: 'format_guest_features' })}
                    ${setting({ id: 'show_guest_features' })}
                    ${setting({ id: 'count_bar_axis' })}
                </div>
            </div>
        `,
		placement: 'bottom',
		interactive: true,
		interactiveBorder: 10,
		trigger: 'click',
		appendTo: document.body,
	});
}
