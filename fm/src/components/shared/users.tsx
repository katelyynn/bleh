/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { html, render } from 'lighterhtml';
import { page } from '@/build/page';
import { markdown } from '@/components/markdown/markdown';
import {
	patch_avatar,
	style_name_from_badge,
} from '@/components/shared/avatar';
import { correct_artist } from '@/components/music/lotus';
import { log } from '@/build/log.ts';
import { keys } from '../settings/storage';
import { is_sponsor } from '../sponsor';
import { header_colour } from '../page/colour';
import { useSettings } from '@/page';
import { setting } from '../settings/settings';
import { settings } from '@/build/config';

export function bleh_users() {
	const users = page.structure.main?.querySelectorAll(
		'.user-list-item:not(.user-list-item-mobile-ad)',
	);

	const cache = JSON.parse(localStorage.getItem(keys.profile_cache) || '{}');

	users.forEach((user, index) => {
		patch_user_list_item(user, index, cache);
	});
}

export function patch_user_list_item(user, index, cache = {}) {
	user.classList.add('colourful');
	user.style.setProperty('--delay', index * 0.04 + 's');

	const avatar = user.querySelector('.user-list-avatar');
	const name = user.querySelector('.user-list-link');

	const badge = patch_avatar(avatar, name?.textContent.trim(), 'follow');
	if (name) style_name_from_badge(name, badge);

	const artists = user.querySelectorAll('.user-list-shared-artists a');
	artists.forEach((artist) => {
		artist.textContent = correct_artist(artist.textContent);
	});

	const md = user.querySelector(
		'.user-list-about-me:not(.has-featured-track)',
	);

	log('patching', 'user', 'info', { user, name: name?.textContent, md });

	if (name) {
		name.textContent = name.textContent.trim();
		const name_text = name.textContent;
		const valid = is_sponsor(name_text);

		if (cache[name_text]?.username && valid) {
			name.classList.add('username-combo', 'username-combo-vertical');
			render(
				name,
				html`
					<span class="username-custom">${cache[name_text]
						.username}</span>
					<span class="username-original">
					    <span class="at">@</span>${name_text}
					</span>
				`,
			);
		} else {
			name.insertBefore(
				html.node`<span class="at">@</span>`,
				name.firstChild,
			);
		}
	}

	if (md) {
		// this removes fancy markdown components
		md.textContent = md.textContent.replace(/(?<!\!)\[[^\]]*\]/g, '');

		// this removes incomplete image snippets
		md.textContent = md.textContent.replace(/^!\[[\s\S]*?…$/gm, '…');

		render(
			md,
			markdown(md.textContent, {
				allow_headers: false,
				line_breaks: false,
				allow_lists: false,
			}),
		);
	}

	const is_followed = user.querySelector('.user-follow');
	user.setAttribute('data-is-followed', is_followed != null);

	const follow = user.querySelector('.toggle-button');
	if (follow) {
		follow.classList.add('btn');
	}

	const tooltip = user.querySelector('.user-library-controls-tooltip');
	if (tooltip) tooltip.remove();

	const img = avatar.querySelector('img');
	if (!img.src.endsWith('818148bf682d429dc215c1705eb27b98.png')) {
		user.appendChild(html.node`
            <div class="user-background" style="background-image: url(${img.src.replace('/avatar70s/', '/avatar300s/')
			})" />
        `);

		header_colour(img, false, [user]);
	}
	img.src = img.src.replace('/avatar70s/', '/avatar170s/');

	return user;
}

export function page_with_users() {
	const no_data = page.structure.main!.querySelector('.no-data-message') as HTMLElement;
	const pagination = page.structure.main!.querySelector('.pagination') as HTMLElement;

	let no_data_neighbours = page.structure.main!.querySelector(':scope > p') as HTMLElement | undefined;
	if (no_data_neighbours) no_data_neighbours.classList.add('no-data-message');

	const user_list = page.structure.main!.querySelector('.user-list') as HTMLElement;
	user_list?.setAttribute('data-list-view', settings.list_view as string);

	const items = user_list?.querySelectorAll('.user-list-item') || [];
	items.forEach(item => {
		item.setAttribute('data-list-view', settings.list_view as string);
	});

	if (user_list) no_data_neighbours = undefined;

	page.structure.main!.replaceChildren(
		<section class='users'>
			{(!no_data && !no_data_neighbours) && setting({
				id: 'list_view', func: (val: string) => {
					user_list?.setAttribute('data-list-view', val);
					items.forEach(item => {
						item.setAttribute('data-list-view', val);
					});
				}
			})}
			{no_data}
			{no_data_neighbours}
			{user_list}
			{pagination}
		</section>
	);
}
