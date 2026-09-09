/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { auth, root } from '@/build/page';
import { desanitise } from '@/build/tools';
import {
	correct_artist,
	correct_item_by_artist,
} from '@/components/music/lotus';
import { html, render } from 'lighterhtml';
import { tl, trans } from '@/build/trans';
import { patch_avatar } from '@/components/shared/avatar';
import { icon, icons } from '../shared/icon';

export function bleh_notification_list(list, mini = false) {
	list.classList = 'notification-list';

	if (mini) list.classList.add('mini');

	const notifications = list.querySelectorAll('.inbox-notifications__item');
	notifications.forEach((notification, index) => {
		if (mini && index > 4) notification.style.display = 'none';

		const link = notification.querySelector(
			'.inbox-notifications__item-link',
		);
		const href = link.getAttribute('href');

		const active = link.classList.contains(
			'inbox-notifications__item--highlight',
		);

		//if (index == 0) active = true;

		notification.classList = 'notification';
		if (active) notification.classList.add('active');
		if (mini) notification.classList.add('mini');

		let type = 'shoutbox';
		const context = {
			name: null,
			sister: null,
		};
		let involved = [];

		const strongs = link.querySelectorAll('strong');

		let split = href.replace(root, '').split('/');

		const avatar = notification.querySelector('.avatar');
		avatar.classList = 'avatar';

		const time = notification.querySelector('time');

		let is_reply = false;
		let others_included = 0;

		if (href.endsWith('/obsessions/set')) {
			type = 'obsession';
			involved.push(split[1]);

			const desc = strongs[0].textContent;
			const desc_split = desc.split(' — ');

			context.type = 'track';
			context.sister = correct_artist(desc_split[0]);
			context.name = correct_item_by_artist(
				desc_split[1],
				context.sister,
			);

			patch_avatar(avatar, involved[0]);
		} else if (href.endsWith('/listening-report/month')) {
			type = 'listening_report';
			involved.push(strongs[0].textContent);

			const img = avatar.querySelector('img');
			img.src = auth.avatar;
			img.alt = auth.name;

			// remove the staff badge lol
			const label = avatar.querySelector('.avatar-status-dot');
			if (auth.pro) {
				label.classList =
					'avatar-status-dot avatar-status-dot--subscriber';
			} else {
				label.remove();
			}

			context.type = 'profile';
			context.name = split[1];

			patch_avatar(avatar, split[1]);
		} else if (href.startsWith(`${root}user/`)) {
			context.type = 'profile';
			context.name = split[1];

			strongs.forEach((strong, index) => {
				if (index == strongs.length - 1 && strongs.length > 1) {
					obtain_additional_info(
						strong.previousSibling.textContent,
						strong.nextSibling.textContent,
					);

					return;
				} else if (index == strongs.length - 1 && strongs.length == 1) {
					obtain_additional_info(strong.nextSibling.textContent);
				}

				involved.push(strong.textContent);
			});

			patch_avatar(avatar, involved[0]);
		} else if (href.startsWith(`${root}music/`)) {
			if (split[2].startsWith('+')) {
				// subpage
				context.type = 'artist';
				context.name = correct_artist(desanitise(split[1]));
			} else if (split[2] == '_') {
				context.type = 'track';
				context.sister = correct_artist(desanitise(split[1]));
				context.name = correct_item_by_artist(
					desanitise(split[3]),
					context.sister,
				);
			} else {
				context.type = 'album';
				context.sister = correct_artist(desanitise(split[1]));
				context.name = correct_item_by_artist(
					desanitise(split[2]),
					context.sister,
				);
			}

			strongs.forEach((strong, index) => {
				if (index == strongs.length - 1) {
					obtain_additional_info(
						strong.previousSibling.textContent,
						strong.nextSibling.textContent,
					);

					return;
				}

				involved.push(strong.textContent);
			});

			patch_avatar(avatar, involved[0]);
		} else if (href.startsWith(`${root}tag/`)) {
			context.type = 'tag';
			context.name = split[1];

			strongs.forEach((strong, index) => {
				if (index == strongs.length - 1) {
					obtain_additional_info(
						strong.previousSibling.textContent,
						strong.nextSibling.textContent,
					);

					return;
				}

				involved.push(strong.textContent);
			});

			patch_avatar(avatar, involved[0]);
		}

		render(
			notification,
			html`
				<div class="notification-avatar">${avatar}</div>
				${icon({ name: icons[type] })}
				<div class="notification-content">
				    <div class="notification-title">
				        ${type == 'shoutbox'
					? html.node`
                    ${
						others_included == 0
							? html.node`
                        ${
								is_reply
									? tl(trans.user_replied).replace(
										'{u}',
										involved.join(', '),
									)
									: tl(trans.user_commented).replace(
										'{u}',
										involved.join(', '),
									)
							}
                    `
							: html.node`
                        ${
								is_reply
									? tl(trans.users_replied).replace(
										'{u}',
										involved.join(', '),
									).replace('{c}', others_included)
									: tl(trans.users_commented).replace(
										'{u}',
										involved.join(', '),
									).replace('{c}', others_included)
							}
                    `
					}
                    `
					: type == 'obsession'
					? tl(trans.obsession_expired)
					: type == 'listening_report'
					? tl(trans.listening_report_available).replace(
						'{m}',
						involved[0],
					)
					: ''}
				    </div>
				    <div class="notification-context">
				        ${icon({ name: icons.indent })}
				        <span
				            class="notification-type"
				            data-type=${context.type}
				        >
				            <span
				                class="bleh-icon"
				                style="--icon: var(--mask)"
				            />
				            <span
				                >${context.sister
					? `${context.name} ${tl(trans.by)} ${context.sister}`
					: context.name}</span
				            >
				        </span>
				    </div>
				</div>
				<div class="notification-time">${time}</div>
				<a
				    class="link-block-cover-link"
				    href=${link.getAttribute('href')}
				/>
			`,
		);

		// we can use the last sibling to obtain info on if this is a reply or not and other users
		function obtain_additional_info(text, backup_text = null) {
			const match = text.match(/\d+/);
			if (match) others_included = parseInt(match[0]);

			if (text.includes(tl(trans.notification_replied_ctx))) {
				is_reply = true;
			} else if (
				backup_text &&
				backup_text.trim().includes(tl(trans.notification_replied_ctx))
			) {
				is_reply = true;
			}
		}
	});
}
