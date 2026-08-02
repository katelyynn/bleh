//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { html, render } from 'lighterhtml';
import { page } from '@/build/page';
import { markdown } from '@/components/shared/markdown';
import {
	patch_avatar,
	style_name_from_badge,
} from '@/components/shared/avatar';
import { correct_artist } from '@/components/music/lotus';
import { log } from '@/build/log.js';
import { keys } from '../settings/storage';
import { is_sponsor } from '../sponsor';

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
            <div class="user-background" style="background-image: url(${
			img.src.replace('/avatar70s/', '/avatar300s/')
		})" />
        `);
	}
	img.src = img.src.replace('/avatar70s/', '/avatar170s/');

	return user;
}
