//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { auth, page, root } from '@/build/page';
import { desanitise } from '@/build/tools';
import {
	correct_artist,
	correct_item_by_artist,
} from '@/components/music/lotus';
import { html, render } from 'lighterhtml';
import { tl, trans } from '@/build/trans';
import { patch_avatar } from '@/components/shared/avatar';
import { toggle } from '@/components/settings/toggle';
import { icon, icons } from '../shared/icon';

export function bleh_message_list(
	list,
	mini = false,
	delete_btn = null,
	checkboxes = [],
) {
	list.classList = 'notification-list';

	if (mini) list.classList.add('mini');

	const sent_to = page.subpage == 'sent_overview';

	let selected_messages = [];

	const messages = list.querySelectorAll('.inbox-message');
	messages.forEach((message, index) => {
		if (mini && index > 4) message.style.display = 'none';

		const link = message.querySelector('.inbox-message-preview > a');
		const href = link.getAttribute('href');

		const active = message.classList.contains('inbox-message--unviewed');

		message.classList = 'notification message';
		if (active) message.classList.add('active');
		if (mini) message.classList.add('mini');

		const avatar = message.querySelector('.avatar');
		avatar.classList = 'avatar';

		const id = message.querySelector('input').value;

		const author = message.querySelector('.inbox-message-sender-name')
			.textContent.trim();
		const time = message.querySelector('.inbox-message-timestamp');

		const subject = message.querySelector('.inbox-message-subject > span')
			.textContent.trim();
		const content = message.querySelector('.inbox-message-message > span')
			.textContent.trim();

		let valentine = false;

		if (subject.endsWith('♡')) {
			// valentines check

			for (let translation in trans.valentine) {
				if (
					subject ==
						trans.valentine[translation].replace('{u}', auth.name)
				) {
					valentine = true;
					break;
				}
			}
		}

		if (valentine) message.classList.add('valentine', 'colourful');

		patch_avatar(avatar, author);

		let checkbox;

		render(
			message,
			html`
				${!mini
					? html.node`
                <div class="message-checkbox">
                    ${checkbox = toggle({
						type: 'checkbox',
						name: 'message_id',
						id,
						data: id,
						func: (val) => {
							message.setAttribute('aria-checked', val);

							if (val) {
								selected_messages.push(message);
							} else {
								selected_messages = selected_messages.filter(
									(selected_msg) => selected_msg != message,
								);
							}

							if (selected_messages.length > 0) {
								delete_btn.removeAttribute('disabled');
							} else {
								delete_btn.setAttribute('disabled', 'true');
							}
						},
					})}
                </div>
            `
					: ''}
				<div class="notification-avatar">${avatar}</div>
				${icon({ name: !valentine ? icons.message : icons.valentine })}
				<div class="notification-content not-main">
				    ${sent_to
					? html.node`
                    <div class="notification-context">
                        <span class="notification-type">
                            ${tl(trans.you_sent_to)}
                        </span>
                    </div>
                `
					: ''}
				    <div class="notification-title">
				        ${author}
				    </div>
				    ${!sent_to
					? html.node`
                    <div class="notification-context">
                        <span class="notification-type">
                            ${tl(trans.sent_to_you)}
                        </span>
                    </div>
                `
					: ''}
				</div>
				<div class="message-content">
				    <div class="message-subject">
				        ${subject}
				    </div>
				    <div class="message-summary">
				        ${content}
				    </div>
				</div>
				<div class="notification-time">${time}</div>
				<a
				    class="link-block-cover-link"
				    href=${href}
				/>
			`,
		);

		checkboxes.push(checkbox);
	});
}
