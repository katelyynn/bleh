/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { html } from 'lighterhtml';
import { auth, root } from '@/build/page';
import { tl, trans } from '@/build/trans';
import {
	create_badge,
	load_badges,
	process_badge,
} from '@/components/shared/badge';
import { dialog } from '@/components/dialog/dialog';
import tippy from 'tippy.js';
import { control_gif_pause } from '@/build/tools';
import { register_menu } from '@/components/menu';
import { log } from '@/build/log';

export function patch_avatar(
	avatar,
	name,
	type = '',
	parent = null,
	side = 'right',
) {
	if (avatar.hasAttribute('data-bleh-avatar')) return {};
	avatar.setAttribute('data-bleh-avatar', 'true');

	const avatar_img = avatar.querySelector('img');
	if (!avatar_img) return {};

	// last.fm bug: it uses 64s instead of avatar70s for
	// event attendees - this causes it to center in the middle of the image
	// rather than the top
	avatar_img.setAttribute(
		'src',
		avatar_img.getAttribute('src').replace('/64s/', '/avatar70s/'),
	);

	avatar.setAttribute('title', '');

	let badges = load_badges(name);
	let pre_existing_badge = avatar.querySelector('.avatar-status-dot');

	if (badges && pre_existing_badge) avatar.removeChild(pre_existing_badge);

	if (!parent) avatar.classList.add('avatar-can-hoverbox');
	else parent.classList.add('parent-can-hoverbox');

	let pre_existing_badge_type;
	if (pre_existing_badge) {
		pre_existing_badge_type = pre_existing_badge.classList[1].replace(
			'avatar-status-dot--',
			'user-status-',
		);
	}
	if (pre_existing_badge_type == 'user-follow') {
		pre_existing_badge = null;
		pre_existing_badge_type = null;
	}

	if (pre_existing_badge) {
		const new_pre_existing = process_badge(
			{
				type: pre_existing_badge_type,
				inbuilt: true,
			},
			name,
		);

		if (pre_existing_badge_type == 'user-status-subscriber') {
			badges = [new_pre_existing, ...badges];
		} else {
			badges = [...badges, new_pre_existing];
		}
	}

	if (badges.length > 0) {
		avatar.appendChild(create_badge(badges[badges.length - 1], true));
	}

	const popup = tippy(parent ? parent : avatar, {
		theme: 'context-menu',
		content: (
			<>
				<div class='track-preview user-preview'>
					<div class='track-preview-image'>
						<div class='inner-image'>
							<img
								src={avatar_img
									.getAttribute('src')
									.replace('/avatar42s/', '/avatar170s/')}
								alt={name}
							/>
						</div>
					</div>
					<div class='track-preview-info'>
						<h5 class='track-preview-text track-preview-title'>
							<span class='at'>@</span>
							{name}
						</h5>
						{badges.length > 0 && (
							<div class='badges track-preview-badges'>
								{create_badge(
									badges[badges.length - 1],
									false,
									true,
									true,
								)}
								{badges.length > 1 && (
									<div class='extra-badges-text'>
										{tl(trans.and_count_more, {
											c: badges.length - 1,
										})}
									</div>
								)}
							</div>
						)}
					</div>
				</div>
				<a
					class='dropdown-menu-clickable-item'
					data-type='profile'
					href={`${root}user/${name}`}
				>
					{tl(trans.profile)}
				</a>
				<a
					class='dropdown-menu-clickable-item'
					data-type='library'
					href={`${root}user/${name}/library`}
				>
					{tl(trans.library)}
				</a>
				<a
					class='dropdown-menu-clickable-item'
					data-type='friends'
					href={`${root}user/${name}/friends`}
				>
					{tl(trans.friends)}
				</a>
				<a
					class='dropdown-menu-clickable-item'
					data-type='shouts'
					href={`${root}user/${name}/shoutbox`}
				>
					{tl(trans.shouts)}
				</a>
			</>
		),
		placement: side,
		interactive: true,
		trigger: 'click',
		appendTo: document.body,
	});

	register_menu(parent ? parent : avatar, popup);

	control_gif_pause(avatar_img);

	if (badges.length > 0) {
		return badges[badges.length - 1];
	} else {
		return {};
	}
}

export function return_name_from_avatar(avatar) {
	if (!avatar) return;

	if (!avatar.hasAttribute('alt')) return;

	if (avatar.getAttribute('alt') == tl(trans.your_avatar)) return auth;

	return avatar.getAttribute('alt').replace(tl(trans.avatar_for_user), '');
}

unsafeWindow._expand_avatar = function (src) {
	expand_avatar(src);
};
export function expand_avatar(src, alt = '') {
	const alt_text = <div class='alt-text'>ALT</div>;
	dialog({
		id: 'avatar',
		body: (
			<div class='full-avatar-wrapper'>
				<div class='full-avatar'>
					<img src={src} alt={alt} />
					{alt != '' && alt_text}
				</div>
				<div class='modal-footer'>
					<div class='fill'></div>
					<a class='btn primary open' href={src} target='_blank'>
						{tl(trans.open_new_tab)}
					</a>
					<div class='fill'></div>
				</div>
			</div>
		),
		type: 'avatar',
		has_overlays: false,
	});
	if (alt != '') {
		tippy(alt_text, {
			content: alt,
		});
	}
}

export function style_name_from_badge(name, badge) {
	if (!badge) return;

	name.classList.add('colourful');

	if (badge.hue > -1 && badge.sat > -1 && badge.lit > -1) {
		name.style.setProperty('--hue-over', badge.hue);
		name.style.setProperty('--sat-over', badge.sat);
		name.style.setProperty('--lit-over', badge.lit);
	} else if (badge.type) {
		if (!badge.inbuilt) {
			name.classList.add(
				`user-status--bleh-${badge.type}`,
				`user-status--bleh-user-${badge.user}`,
			);
		} else {
			name.classList.add(badge.type);
		}
	} else {
		name.classList.add(badge.type);
	}
}

export type avatar_dimensions =
	| 'avatar42s'
	| '64s'
	| 'avatar70s'
	| 'avatar170s'
	| 'avatar300s'
	| '300x300'
	| '370x208'
	| '500x500'
	| '1170x658'
	| 'arG'
	| 'ar0';

/**
 * builds an avatar or cover art url with the specified sizing
 * @param url full original image url or filename
 * @param requested requested sizing
 * @returns
 */
export function avatar(url: string | null, requested: avatar_dimensions) {
	if (url == null) return '';

	let image: string;

	if (url.startsWith('https')) {
		if (
			!/^https:\/\/lastfm(?:-img)?\.freetls\.fastly\.net\/i\/u\//.test(
				url,
			)
		) {
			return url;
		}

		const built = new URL(url);

		const split = built.pathname.split('/');
		image = split[split.length - 1];
	}

	const final =
		`https://lastfm-img.freetls.fastly.net/i/u/${requested}/${image}`;
	log(`created ${requested} image`, 'avatar', 'info', { final, url });

	return final;
}
