/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { settings } from '@/build/config';
import { log } from '@/build/log';
import { auth, page } from '@/build/page';
import { tl, trans } from '@/build/trans';
import { bleh_about_artist } from '@/components/music/about_artist.js';
import {
	bleh_music_page_charts,
	show_your_scrobbles,
	similar_items,
} from '@/components/music/music';
import { checkup_page_structure } from '@/components/page/structure';
import {
	is_same_page,
	register_background,
	update_page,
	useSettings,
} from '@/page';
import { ff } from '@/components/settings/sku';
import { bleh_tags_mini } from '@/pages/tag';
import {
	bleh_wiki,
	bleh_wiki_editor,
	bleh_wiki_history,
} from '@/pages/music/wiki';
import { html, render } from 'lighterhtml';
import { avatar } from '@/components/shared/avatar';
import { oracle_process } from '@/components/music/oracle';
import { hoshino_return } from '@/components/music/hoshino.js';
import { page_header_title, PageHeaderAvatar } from '@/components/music/header';
import { header_colour } from '@/components/page/colour';
import {
	PageHeader,
	PageHeaderArtist,
	PageHeaderTitle,
} from '@/components/page/header.tsx';
import { createRef, ReactElement, RefObject } from 'jsx-dom';

export function bleh_tracks() {
	const track_header = document.body.querySelector(
		'.header-new--track',
	) as HTMLElement;

	page.sister = track_header.querySelector(
		'.header-new-crumb span',
	).textContent;
	page.name = document.body
		.querySelector('[data-page-resource-name]')
		.getAttribute('data-page-resource-name');

	page_header_title(track_header);

	const is_subpage = page.subpage != 'overview';

	// without pro theres two containers
	if (auth.pro) {
		// pro

		page.structure.container = document.body.querySelector('.page-content');
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
				'.page-content',
			);
		}
	}
	page.structure.row = page.structure.container!.querySelector('.row');
	try {
		if (!is_subpage) {
			page.structure.main = page.structure.row!.querySelector(
				'.col-main.buffer-standard',
			);

			if (page.structure.main?.classList[2]) {
				page.structure.main = page.structure.row!.querySelector(
					'.col-main.buffer-standard:not(:first-child)',
				);
			}
		} else {
			page.structure.main = page.structure.row!.querySelector(
				'.col-main',
			);
		}
		page.structure.side = page.structure.row!.querySelector(
			'.col-sidebar:not(.track-overview-video-column)',
		);
	} catch (e) {
		log('unable to find elements', 'page structure');
	}

	checkup_page_structure(is_subpage, track_header);

	if (ff('refreshed_music_nav')) {
		const artist_avatar = track_header.querySelector(
			'.header-new-background-image',
		);
		const title = track_header.querySelector(
			'.header-new-title',
		) as HTMLDivElement;
		const artist = track_header.querySelector(
			'[itemprop="byArtist"]',
		) as HTMLElement;
		const position = track_header.querySelector(
			'.header-new-chart-position-number',
		) as HTMLAnchorElement;

		const source_album = page.structure.main?.querySelector(
			'.source-album',
		);
		let album_avatar;
		if (source_album) {
			album_avatar = source_album.querySelector('.source-album-art img');
		}

		page.state.avatar_side_override =
			settings.default_avatar_action == 'expand'
				? 'expand'
				: source_album
				? source_album.querySelector('.link-block-cover-link')
					.getAttribute('href')
				: '';

		//const same_page = is_same_page();

		const page_avatar = createRef();

		const redesigned_track_header = (
			<PageHeader
				type='track'
				avatar={<PageHeaderAvatar ref={page_avatar} />}
			>
				<PageHeaderTitle>
					{title}
					{position}
				</PageHeaderTitle>
				<PageHeaderArtist type='track'>
					{artist}
				</PageHeaderArtist>
			</PageHeader>
		);

		const hoshino_entry = hoshino_return(page.name, page.sister);

		page.state.avatar_side = page_avatar;

		if (
			page.state.oracle_temp && page.state.oracle_temp.page &&
			(page.state.oracle_temp &&
				page.name == page.state.oracle_temp.page.name &&
				page.sister == page.state.oracle_temp.page.sister &&
				page.type == page.state.oracle_temp.page.type)
		) {
			// skip
		} else if (hoshino_entry && ff('ruby')) {
			create_avatar(
				page_avatar,
				hoshino_entry,
				page.state.avatar_side_override,
			);
		} else if (album_avatar) {
			create_avatar(
				page_avatar,
				album_avatar.src.replace('300x300', 'avatar300s'),
				page.state.avatar_side_override,
			);
		} else if (artist_avatar) {
			create_avatar(
				page_avatar,
				artist_avatar
					.getAttribute('content')
					.replace('/ar0/', '/avatar170s/'),
				page.state.avatar_side_override,
			);
		} else {
			create_avatar(
				page_avatar,
				'',
				page.state.avatar_side_override,
			);
		}

		page.structure.container!.insertBefore(
			redesigned_track_header,
			page.structure.container!.firstElementChild,
		);
		track_header.classList.add('legacy-header');
	}

	if (!is_subpage) {
		show_your_scrobbles();

		bleh_music_page_charts();

		bleh_about_artist();

		bleh_tags_mini();

		similar_items();
	} else {
		const btn_add = page.structure.side.querySelector('.add-button');
		if (btn_add != null) {
			btn_add.setAttribute('data-page-subpage', page.subpage);
		}

		if (page.subpage == 'wiki_overview') bleh_wiki();
		else if (page.subpage == 'wiki_history') bleh_wiki_history();
		else if (page.subpage == 'wiki_edit') bleh_wiki_editor();
	}

	if (ff('oracle') && settings.oracle_beta) oracle_process();

	log('status is', 'page', 'info', page);
	update_page();
}

export function create_avatar(
	parent: RefObject<ReactElement>,
	src: string,
	override = 'expand',
) {
	log(`creating avatar for ${src} with override ${override}`, 'track');

	let full = avatar(src, 'ar0');

	if (
		!src ||
		(src.endsWith('c6f59c1e5e7240a4c0d427abd71f3dbb.jpg') ||
			src.endsWith('c6f59c1e5e7240a4c0d427abd71f3dbb.jpg') || src == '')
	) {
		src = '';
		full = '';
	}

	register_background(full);

	const outer = parent.current!.parentElement!;
	parent.current!.remove();
	const new_parent = (
		<PageHeaderAvatar
			url={src}
			paint={useSettings.get('hue_from_track') as boolean}
			ref={parent}
		/>
	);
	outer.appendChild(new_parent);
}
