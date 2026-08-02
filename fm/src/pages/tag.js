/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { log } from '@/build/log';
import { gendered_pattern, page } from '@/build/page';
import { desanitise } from '@/build/tools';
import { tl, trans } from '@/build/trans';
import { checkup_page_structure } from '@/components/page/structure';
import { is_same_page, register_background, update_page } from '../page';
import { ff } from '@/components/settings/sku';
import {
	bleh_wiki,
	bleh_wiki_editor,
	bleh_wiki_history,
} from '@/pages/music/wiki';
import tippy from 'tippy.js';
import { settings } from '@/build/config';
import { page_header_title } from '@/components/music/header';
import { html } from 'lighterhtml';
import { icon, icons } from '@/components/shared/icon';

export function bleh_tags() {
	const tag_header = document.body.querySelector('.header--tag');
	if (!tag_header) return;

	if (tag_header.hasAttribute('data-bwaa')) {
		return;
	}
	tag_header.setAttribute('data-bwaa', 'true');

	page_header_title(tag_header);

	const is_subpage = tag_header.classList.contains('header--sub-page');

	page.structure.container = document.body.querySelector('.page-content');
	page.structure.row = page.structure.container.querySelector('.row');
	try {
		page.structure.main = page.structure.row.querySelector('.col-main');
		page.structure.side = page.structure.row.querySelector('.col-sidebar');
	} catch (e) {
		log('unable to find elements', 'page structure');
	}

	checkup_page_structure(is_subpage, tag_header);

	if (ff('refreshed_music_nav')) {
		const split = window.location.href.split('/');

		/* languages */
		let index = 4;
		if (split[3] != 'tag') {
			index = 5;
		}

		const title = desanitise(split[index]);
		page.name = title;

		const same_page = is_same_page();

		const redesigned_tag_header = html.node`
            <section class="page-header for-generic ${same_page ? 'same' : ''}">
                <div class="page-header-icon">
                    ${icon({ name: icons.tag })}
                </div>
                <div class="page-header-info">
                    <div class="sub-text">${tl(trans.tag)}</div>
                    <h1 class="page-header-title generic-page-title">${title}</h1>
                </div>
            </section>
        `;

		const background = document.body.querySelector(
			'.header-background--has-image',
		);
		if (background) {
			register_background(
				background.style.getPropertyValue('background-image').replace(
					'url("',
					'',
				).replace('")', ''),
			);
		} else {
			register_background();
		}

		page.structure.container.insertBefore(
			redesigned_tag_header,
			page.structure.container.firstElementChild,
		);
		tag_header.classList.add('legacy-header');
	}

	if (!is_subpage) {
		const col_main = page.structure.main.querySelector('.wiki-section');

		const tags = document.createElement('div');
		tags.classList.add('catalogue-tags');
		const related = page.structure.main.querySelector('.tags-list');

		if (related) {
			page.structure.main.removeChild(related.parentElement);
			tags.appendChild(related);

			const header_tags = document.createElement('div');
			header_tags.classList.add('sub-text', 'music-small-header');
			header_tags.textContent = tl(trans.related_to);
			col_main.appendChild(header_tags);

			col_main.appendChild(tags);

			bleh_tags_mini(tags);
		}

		const bookmark_form = page.structure.side.querySelector(':scope > div');
		const view_all_panel = document.createElement('section');
		view_all_panel.classList.add('side-actions');

		const button = bookmark_form.querySelector('button');
		button.classList = 'btn side-action icon-mask';
		button.setAttribute('data-type', 'bookmark');

		view_all_panel.appendChild(bookmark_form);
		page.structure.side.appendChild(view_all_panel);

		// new tag playlist
		const new_playlist = page.structure.side.querySelector('form');

		const header = new_playlist.querySelector('h3');
		new_playlist.removeChild(header);

		const playlist_button = new_playlist.querySelector('button');
		playlist_button.classList = 'btn side-action icon-mask';
		playlist_button.setAttribute('data-type', 'playlist');

		view_all_panel.appendChild(new_playlist);
	} else {
		if (page.subpage == 'wiki_overview') {
			bleh_wiki();
		} else if (page.subpage == 'wiki_history') {
			bleh_wiki_history();
		} else if (page.subpage == 'wiki_edit') {
			bleh_wiki_editor();
		}
	}

	log('status is', 'page', 'info', page);
	update_page();
}

export function bleh_tags_large(observer = page.structure.main) {
	const hide_gendered = settings.gendered_tags;

	const tags = observer.querySelectorAll('.big-tags-item-wrap');
	tags.forEach((tag) => {
		const text = tag.querySelector('.big-tags-item-name').textContent
			.trim();

		if (hide_gendered && gendered_pattern.test(text)) {
			tag.remove();
		}
	});
}

export function bleh_tags_mini(observer = page.structure.main) {
	if (!observer) return;
	const hide_gendered = settings.gendered_tags;

	const tags = observer.querySelectorAll('.tag');
	tags.forEach((tag) => {
		const elem = tag.firstElementChild;
		elem.classList.add('btn', 'tag-item');

		const text = elem.textContent.trim();

		if (hide_gendered && gendered_pattern.test(text)) {
			tag.remove();
		}
	});

	const tag_user_avatar = observer.querySelector('.tags-user-avatar');
	if (!tag_user_avatar) return;

	const tags_list = tag_user_avatar.nextElementSibling;
	const user_tags = tags_list.querySelectorAll('.tag a');
	user_tags.forEach((tag) => {
		tag.classList.add('user-created-tag');

		tippy(tag, {
			content: tl(trans.personal_tag),
		});
	});
}
