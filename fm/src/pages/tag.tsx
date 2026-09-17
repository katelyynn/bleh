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
import { register_background, update_page, useSettings } from '../page';
import { ff } from '@/components/settings/sku';
import {
	bleh_wiki,
	bleh_wiki_editor,
	bleh_wiki_history,
} from '@/pages/music/wiki';
import { page_header_title } from '@/components/music/header';
import { icons } from '@/components/shared/icon';
import { hover_tooltip, Tooltip } from '@/components/shared/tooltips.tsx';
import { SideActions } from '@/components/side_action/side_action.tsx';
import { PageHeader } from '@/components/page/header.tsx';

export function bleh_tags() {
	const tag_header = document.body.querySelector(
		'.header--tag',
	) as HTMLDivElement;
	if (!tag_header) return;

	page_header_title(tag_header);

	const is_subpage = tag_header.classList.contains('header--sub-page');

	page.structure.container = document.body.querySelector('.page-content')!;
	page.structure.row = page.structure.container.querySelector('.row')!;
	try {
		page.structure.main = page.structure.row.querySelector('.col-main')!;
		page.structure.side = page.structure.row.querySelector('.col-sidebar')!;
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

		//const same_page = is_same_page();

		const redesigned_tag_header = (
			<PageHeader
				icon={icons.tag}
				type='tag'
				name={title}
			/>
		);

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
		const col_main = page.structure.main!.querySelector('.wiki-section');

		const tags = document.createElement('div');
		tags.classList.add('catalogue-tags');

		const related = page.structure.main!.querySelector('.tags-list');

		if (related) {
			const parent = related.parentElement!;
			parent.remove();

			tags.appendChild(related);

			const header_tags = document.createElement('div');
			header_tags.classList.add('sub-text', 'music-small-header');
			header_tags.textContent = tl(trans.related_to);
			col_main.appendChild(header_tags);

			col_main.appendChild(tags);

			bleh_tags_mini(tags);
		}

		const bookmark_form = page.structure.side!.querySelector(
			':scope > div',
		);

		const side = <SideActions />;

		if (bookmark_form) {
			const bookmark = bookmark_form.querySelector('button')!;
			bookmark.classList.add('btn', 'side-action', 'icon-mask');
			bookmark.setAttribute('data-type', 'bookmark');

			side.appendChild(bookmark_form);
		}

		// new tag playlist
		const new_playlist = page.structure.side!.querySelector(
			'form[action$="from-tag"]',
		);
		if (new_playlist) {
			const head = new_playlist.querySelector('h3');
			if (head) head.remove();

			const playlist = new_playlist.querySelector('button')!;
			playlist.classList.add('btn', 'side-action', 'icon-mask');
			playlist.setAttribute('data-type', 'playlist');

			side.appendChild(playlist);
		}

		page.structure.side!.insertBefore(
			side,
			page.structure.side!.firstElementChild,
		);
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
	const tags = observer.querySelectorAll('.big-tags-item-wrap');
	tags.forEach((tag) => {
		const text = tag.querySelector('.big-tags-item-name').textContent
			.trim();

		const result = tag_test(text);

		if (!result) tag.remove();
	});
}

export function bleh_tags_mini(observer = page.structure.main) {
	if (!observer) return;
	const hide_gendered = useSettings.get('gendered_tags') as boolean;

	const tags = observer.querySelectorAll('.tag');
	tags.forEach((tag) => {
		const elem = tag.firstElementChild;
		elem.classList.add('btn', 'tag-item');

		const text = elem.textContent.trim();

		const result = tag_test(text);

		if (!result) tag.remove();
	});

	const tag_user_avatar = observer.querySelector('.tags-user-avatar');
	if (!tag_user_avatar) return;

	const tags_list = tag_user_avatar.nextElementSibling;
	const user_tags = tags_list.querySelectorAll('.tag a');
	user_tags.forEach((tag) => {
		tag.classList.add('user-created-tag');
		hover_tooltip(tag, <Tooltip>{tl(trans.personal_tag)}</Tooltip>);
	});
}

export function tag_test(text: string) {
	const hide_gendered = useSettings.get('gendered_tags') as boolean;

	if (hide_gendered && gendered_pattern.test(text)) {
		return false;
	}

	// annoying radio mis-use
	if (text.startsWith('wsum 91.7')) {
		return false;
	}

	return true;
}
