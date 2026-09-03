/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { badge } from '@/types/badge';
import { dialog } from './dialog';
import { tl, trans } from '@/build/trans';
import { avatar } from '../shared/avatar';
import { sponsor } from '../sponsor';
import '@zachleat/hypercard';
import { load_profile_cache_externally } from '@/pages/profile/profile';
import { get_amount_of_badge } from '../shared/badge';

export async function present_badge(badge: badge) {
	let head;
	let bg_avatar;

	let type;

	if (badge.inbuilt) {
		type = badge.reason;
	} else {
		type = tl(trans.badge_types[badge.type || 'reserved'], {
			u: badge.user,
		});
	}

	const count = get_amount_of_badge(badge);

	const window = (
		<>
			{badge.type == 'reserved'
				? (
					<div className='present-badge-type-indicator'>
						{tl(trans.badges.reserved.reason)}
					</div>
				)
				: ''}
			<hyper-card className='present-badge-hyper-card'>
				<div className='present-badge-window'>
					<div className='present-badge-corner corner-left' />
					<div className='present-badge-corner corner-right' />
					<div
						className='present-badge-avatar-back'
						ref={(el) => bg_avatar = el}
					/>
					<div className='present-badge-head' ref={(el) => head = el}>
						<div className='present-badge-avatar avatar'>
							<img className='missing-avatar' />
						</div>
						<span className='present-badge-username'>
							{badge.user}
						</span>
					</div>
					<div className='present-badge-inner'>
						<div className='present-badge-top'>
							<div className='present-badge colourful'>
								<div
									className='bleh-icon present-badge-icon'
									data-mask={String(badge.mask)}
								/>
							</div>
						</div>
						<strong className='present-badge-name'>
							{badge.name}
						</strong>
						<p className='present-badge-reason'>{badge.reason}</p>
						<p className='present-badge-type'>{type}</p>
					</div>
					{count > 0
						? (
							<div className='present-badge-bottom'>
								<p className='present-badge-count'>
									{count == 1
										? tl(trans.badge_only_user, {
											u: badge.user,
										})
										: tl(trans.badge_multiple_users, {
											u: badge.user,
											c: count,
										})}
								</p>
							</div>
						)
						: ''}
				</div>
			</hyper-card>
			{badge.type == 'sponsor'
				? (
					<div className='present-badge-actions'>
						<button
							type='button'
							className='btn primary icon sponsor colourful'
							data-type='sponsor'
							onClick={() => sponsor()}
						>
							{tl(trans.sponsor)}
						</button>
					</div>
				)
				: badge.type == 'translation'
				? (
					<div className='present-badge-actions'>
						<a
							className='btn primary icon translate colourful'
							data-type='translate'
							href='https://github.com/katelyynn/bleh/wiki/Translations'
							target='_blank'
						>
							{tl(trans.translate)}
						</a>
					</div>
				)
				: ''}
		</>
	);

	const elem = dialog({
		id: 'badge',
		title: badge.name,
		body: window,
		type: 'badge',
		colourful: true,
		colourful_bg: true,
	});

	if (
		badge.icon != '' &&
		badge.hue! > -1 &&
		badge.sat! > -1 &&
		badge.lit! > -1
	) {
		// new style badge
		elem.style.setProperty('--mask', `url(${badge.icon})`);
		elem.style.setProperty('--hue-over', String(badge.hue));
		elem.style.setProperty('--sat-over', String(badge.sat));
		elem.style.setProperty('--lit-over', String(badge.lit));
	} else if (badge.inbuilt) {
		elem.classList.add(badge.type!);
	} else {
		elem.classList.add(
			`user-status--bleh-${badge.type}`,
			`user-status--bleh-user-${badge.user}`,
		);
	}

	const cache = await load_profile_cache_externally(badge.user);

	head!.replaceChildren(
		<>
			<div className='present-badge-avatar avatar'>
				<img src={avatar(cache.avatar, 'avatar300s')} />
			</div>
			<span className='present-badge-username'>{badge.user}</span>
		</>,
	);

	bg_avatar!.replaceChildren(
		<img src={avatar(cache.avatar, 'avatar300s')} />,
	);
}
