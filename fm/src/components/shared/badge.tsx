/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { log } from '@/build/log';
import { sponsor_list } from '@/build/sponsor';
import { lang_info, tl, trans } from '@/build/trans';
import { html } from 'lighterhtml';
import tippy from 'tippy.js';
import { page } from '@/build/page';
import { style_name_from_badge } from './avatar';
import { flag_url } from './flag';
import { present_badge } from '../dialog/badge';
import { hover_tooltip, Tooltip } from '@/components/shared/tooltips.tsx';

export function load_badges(user, solo = false) {
	if (!sponsor_list.version) return;

	let badges = [];

	// create modern translation badges
	const trans_contributions = get_trans_contributions(user);
	log(
		`found ${trans_contributions.length} contribution(s) for ${user}`,
		'sponsor',
		'info',
		{ trans_contributions },
	);
	if (trans_contributions.length > 0) {
		trans_contributions.forEach((contribution) => {
			badges.push({
				type: 'translation',
				translation_code: contribution.code,
				reason: contribution.name,
			});
		});
	}

	let entry = sponsor_list.users[user];

	if (entry) {
		entry = {
			sponsor: true,
			contributor: false,
			...entry,
		};

		if (entry.contributor) {
			badges.push({
				type: 'contributor',
			});
		}

		if (entry.sponsor) {
			badges.push({
				type: 'sponsor',
			});
		}

		if (entry.badges) {
			log(
				'multiple badges found',
				'sponsor',
				'info',
				sponsor_list.users[user].badges,
			);

			badges = [...badges, ...sponsor_list.users[user].badges];
		}
	}

	// now we run thru to add missing metadata
	badges.forEach((badge) => {
		if (entry && entry.sponsor && !badge.type) badge.type = 'sponsor';
		badge = process_badge(badge, user);
	});

	log(`final badge list for @${user}`, 'sponsor', 'info', { badges });

	if (solo) return badges[badges.length - 1];

	return badges;
}

export function get_amount_of_badge(badge) {
	const users = {};

	for (const user in sponsor_list.users) {
		users[user] = load_badges(user);
	}

	console.info('badges loaded', users, Object.values(users));

	return Object.values(users)
		.flat()
		.filter((b) =>
			b.type == badge.type && b.name == badge.name &&
			b.reason == badge.reason
		)
		.length;
}

function get_trans_contributions(user) {
	return Object.entries(lang_info)
		.filter(([code, info]) =>
			info.by.map((name) => name.toLowerCase()).includes(
				user.toLowerCase(),
			) && code != 'en'
		)
		.map(([code, info]) => ({
			code,
			name: info.name,
		}));
}

export function process_badge(badge, user) {
	const translation = trans.badges[badge.type];

	badge.user = user;

	if (!badge.name) {
		if (translation?.name) {
			badge.name = tl(translation.name);
		} else {
			badge.name = tl(trans.unavailable);
			badge.reason = tl(trans.requires_higher_bleh_version);
		}
	}

	if (badge.reason) return badge;

	if (translation?.reason) {
		badge.reason = tl(translation.reason);
		return badge;
	}

	if (badge.type == 'cute' || badge.type == 'queen') {
		badge.reason = tl(trans.badges.cute.reason);
	} else badge.reason = tl(trans.badges.reserved.reason);

	return {
		mask: true,
		...badge,
	};
}

export function create_badge(
	badge = {
		type: '',
		icon: '',
		reason: '',
		hue: -1,
		sat: -1,
		lit: -1,
		name: '',
		user: '',
		inbuilt: false,
		translation_code: '',
	},
	on_avatar = false,
	long = false,
	small = false,
) {
	log(`creating '${badge.name}' for @${badge.user}`, 'badge', 'info', {
		badge,
		on_avatar,
		long,
		small,
	});

	const classlist = on_avatar ? 'avatar-status-dot' : 'label no-hover';

	const elem = (
		<span
			class={[
				on_avatar ? 'avatar-status-dot' : 'label no-hover',
				long && 'expand',
				small && 'small',
			]}
			onClick={() => {
				if (!small && !on_avatar) {
					present_badge(badge);
				}
			}}
		>
			{badge.name}
		</span>
	);

	if (small) {
		elem.appendChild(
			<span class='badge-back' />,
		);
	}

	if (badge.translation_code) {
		elem.classList.add('translation-lang');
		elem.style.setProperty(
			'--flag',
			`url(${flag_url(badge.translation_code)})`,
		);
	}

	if (
		badge.icon != '' &&
		badge.hue > -1 &&
		badge.sat > -1 &&
		badge.lit > -1
	) {
		// new style badge
		elem.style.setProperty('--mask', `url(${badge.icon})`);
		elem.style.setProperty('--hue-over', String(badge.hue));
		elem.style.setProperty('--sat-over', String(badge.sat));
		elem.style.setProperty('--lit-over', String(badge.lit));
	} else if (badge.inbuilt) {
		elem.classList.add(badge.type);
	} else {
		elem.classList.add(
			`user-status--bleh-${badge.type}`,
			`user-status--bleh-user-${badge.user}`,
		);
	}

	if (on_avatar || small) return elem;

	hover_tooltip(
		elem,
		<Tooltip>{badge.reason}</Tooltip>,
	);

	return elem;
}

export function verified() {
	const today = new Date();
	const april = today.getMonth() == 3 && today.getDate() == 1;

	page.state.april = april;

	if (april) document.body.setAttribute('data-verified-check', 'true');
}
