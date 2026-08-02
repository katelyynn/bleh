//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import {
	avatar,
	patch_avatar,
	style_name_from_badge,
} from '@/components/shared/avatar';
import { log } from '@/build/log';
import { auth, page, root } from '@/build/page';
import { copy, sanitise } from '@/build/tools';
import { checkup_page_structure } from '@/components/page/structure';
import { is_same_page, register_background, update_page } from '../page';
import { bleh_notification_list } from '@/components/inbox/notifications';
import { tl, trans } from '@/build/trans';
import { html, render } from 'lighterhtml';
import { load_profile_cache_externally } from './profile/profile';
import { bleh_message_list } from '@/components/inbox/messages';
import { toggle } from '@/components/settings/toggle.js';
import tippy from 'tippy.js';
import { icon, icons } from '@/components/shared/icon';

export async function bleh_inbox() {
	page.structure.container = document.body.querySelector('.page-content');
	try {
		page.structure.row = page.structure.container.querySelector('.row');
		page.structure.main = page.structure.row.querySelector('.col-main');
		page.structure.side = page.structure.row.querySelector('.col-sidebar');
	} catch (e) {
		log('unable to find elements', 'page structure');
	}

	const content_top = document.body.querySelector('.content-top');

	const page_alert = content_top.querySelector('.notification > .alert');

	checkup_page_structure(false, content_top);
	log('status is', 'page', 'info', page);
	update_page();

	const same_page = is_same_page();

	page.structure.container.insertBefore(
		html.node`
        <section class="page-header ${same_page ? 'same' : ''}">
            <div class="page-header-icon">
                ${icon({ name: icons.inbox })}
            </div>
            <div class="page-header-info">
                <div class="sub-text">${tl(trans.inbox)}</div>
                <h1 class="page-header-title generic-page-title">${
			page.subpage == 'notifications'
				? tl(trans.notifications)
				: tl(trans.messages)
		}</h1>
            </div>
        </section>
    `,
		page.structure.container.firstElementChild,
	);

	let cache;
	if (auth.name) {
		cache = await load_profile_cache_externally(auth.name);
		if (cache.banner) {
			register_background(cache.banner);
		} else if (
			auth.avatar &&
			!auth.avatar.endsWith('818148bf682d429dc215c1705eb27b98.png')
		) {
			register_background(avatar(auth.avatar, 'ar0'));
		} else {
			register_background(null);
		}
	} else {
		register_background(null);
	}

	const messages_tab = page.structure.nav.querySelector(
		'.secondary-nav-item--overview',
	);
	messages_tab.classList.remove('secondary-nav-item--overview');
	messages_tab.classList.add('secondary-nav-item--messages');
	messages_tab.querySelector(':scope > a').textContent = tl(trans.messages);

	if (page.subpage == 'notifications') {
		const form = page.structure.container.querySelector('form');
		const notifications = page.structure.container.querySelector(
			'.inbox-notifications',
		);
		const pagination = page.structure.container.querySelector(
			'.pagination',
		);

		page.structure.main.appendChild(html.node`
            <section class="inbox-panel notifications-panel">
                ${page_alert}
                ${form}
                ${notifications}
                ${pagination}
            </section>
        `);

		if (!notifications) return;

		bleh_notification_list(notifications);
	} else if (
		page.subpage == 'message_overview' || page.subpage == 'sent_message' ||
		page.subpage == 'message_reply'
	) {
		const inbox = page.structure.container.querySelector(
			'.inbox-message-view',
		);
		page.structure.main.appendChild(inbox);

		const message = inbox.querySelector('.inbox-message');

		const sender_avatar_cont = message.querySelector(
			'.inbox-message-sender-avatar',
		);
		const sender_name = message.querySelector('.inbox-message-sender-name');
		const sender_time = message.querySelector('.inbox-message-timestamp');

		const sender_avatar = sender_avatar_cont.querySelector('.avatar');
		const name_text = sender_name.textContent.trim();
		const badge = patch_avatar(sender_avatar_cont, sanitise(name_text));

		const message_subject = message.querySelector('.inbox-message-subject');
		const message_preview = message.querySelector('.inbox-message-preview');
		const message_buttons = message.querySelector('.inbox-message-buttons');

		message_buttons.querySelectorAll(':is(button, a)').forEach((link) => {
			const type = link.classList[0];

			link.classList.add('btn', 'inbox-button', 'icon');

			if (type == 'back-button') {
				link.textContent = tl(trans.back);
			} else if (type == 'delete-button') {
				link.classList.add('danger-subtle');
				link.textContent = tl(trans.delete);
			}
		});

		inbox.insertBefore(message_buttons, message);

		let sender_panel;

		render(
			message,
			html`
				<div class="message-sender colourful" ref=${(el) =>
					sender_panel = el}>
				    ${sender_avatar_cont}
				    ${sender_name}
				    ${sender_time}
				    <div class="message-sender-actions">
				        ${() => {
					const btn = html.node`
                            <button class="btn message-sender-action icon chibi" data-type="copy" onclick=${() => {
						copy(name_text);
					}}>
                                ${tl(trans.copy_username)}
                            </button>
                        `;

					tippy(btn, {
						content: btn.textContent,
					});

					return btn;
				}}
				    </div>
				</div>
				<div class="message-content">
				    ${message_subject}
				    ${message_preview}
				</div>
			`,
		);

		if (page.subpage != 'sent_message') {
			let valentine = false;

			if (message_subject.textContent.trim().endsWith('♡')) {
				// valentines check

				for (let translation in trans.valentine) {
					if (
						message_subject.textContent.trim() ==
							trans.valentine[translation].replace(
								'{u}',
								auth.name,
							)
					) {
						valentine = true;
						break;
					}
				}
			}

			if (valentine) {
				message_preview.after(html.node`
                    <div class="alert colourful valentine-coloured" data-type="valentine">
                        ${tl(trans.valentine_message_footer, { u: name_text })}
                    </div>
                `);
			}
		}

		style_name_from_badge(sender_panel, badge);

		// reply

		const content_form = inbox.querySelector('.content-form');
		if (!content_form) return;

		const form = content_form.querySelector('form');

		const token = form.querySelector('[name="csrfmiddlewaretoken"]');
		const subject = form.querySelector('[name=subject]');
		const contents = form.querySelector('[name=message]');

		const alert = form.querySelector(':scope > .alert');

		content_form.classList = 'message-reply-section inbox-message';

		let sender_panel_own;

		render(
			content_form,
			html`
				<div class="message-sender colourful" ref=${(el) =>
					sender_panel_own = el}>
					<div class="inbox-message-sender-avatar">
						<span class="avatar" ref=${(el) => your_avatar = el}>
							<img src=${avatar(
								auth.avatar,
								'avatar70s',
							)} alt=${auth.name} loading="lazy" />
						</span>
					</div>
					<a class="inbox-message-sender-name"
						href="${root}user/${auth.name}">${auth.name}</a>
				</div>
				<div class="message-content">
				    <h2 class="text-18">${tl(trans.send_a_reply)}</h2>
				    ${alert}
				    <form method="post" action=${form.getAttribute('action')}>
				        ${token}
				        <div class="setting-group">
				            <div class="setting v" data-type="text">
				                <div class="heading">
				                    <h5>${tl(trans.subject)}</h5>
				                </div>
				                <div class="input-container content-form wide">
				                    ${subject}
				                </div>
				            </div>
				            <div class="setting v" data-type="text">
				                <div class="heading">
				                    <h5>${tl(trans.message)}</h5>
				                </div>
				                <div class="input-container content-form textarea">
				                    ${contents}
				                </div>
				            </div>
				        </div>
				        <div class="settings-footer end gap">
				            <button class="btn primary icon" data-type="message" type="submit">
				                ${tl(trans.send)}
				            </button>
				        </div>
				    </form>
				</div>
			`,
		);

		const your_badge = patch_avatar(your_avatar, auth.name);
		style_name_from_badge(sender_panel_own, your_badge);
	} else if (page.subpage.endsWith('overview')) {
		const inbox = page.structure.container.querySelector('.inbox');
		page.structure.main.appendChild(inbox);

		if (page_alert) inbox.insertBefore(page_alert, inbox.firstChild);

		const header = page.structure.main.querySelector('.inbox-buttons');
		const select_all = header.querySelector('.inbox-select-all');

		const delete_btn = header.querySelector('.inbox-delete-button');
		delete_btn?.classList.add('btn');

		const table = inbox.querySelector('.inbox-table');

		if (!table) return;

		table.classList = 'inbox-table-legacy';

		const checkboxes = [];

		bleh_message_list(
			table.querySelector('tbody'),
			false,
			delete_btn,
			checkboxes,
		);

		select_all.replaceWith(toggle({
			type: 'checkbox',
			func: (val) => {
				if (val) {
					checkboxes.forEach((checkbox) => {
						if (!checkbox.checked()) checkbox.checked(true);
					});
				} else {
					checkboxes.forEach((checkbox) => {
						if (checkbox.checked()) checkbox.checked(false);
					});
				}
			},
		}));
	} else if (page.subpage == 'compose') {
		const inbox = page.structure.container.querySelector(
			'.inbox-compose-view',
		);
		inbox.classList = 'inbox-message-view';
		page.structure.main.appendChild(inbox);

		const content_form = inbox.querySelector('.content-form');
		if (!content_form) return;

		const form = content_form.querySelector('form');

		const token = form.querySelector('[name="csrfmiddlewaretoken"]');
		const recipient = form.querySelector('[name=recipient_name]');
		const subject = form.querySelector('[name=subject]');
		const contents = form.querySelector('[name=message]');

		content_form.classList = 'message-compose-section inbox-message';

		let sender_panel_own;

		if (page.requested.subject) subject.value = page.requested.subject;

		const alert = form.querySelector(':scope > .alert');
		const disclaimer = form.querySelector('.form-disclaimer > .alert');

		render(
			content_form,
			html`
				<div class="message-sender colourful" ref=${(el) =>
					sender_panel_own = el}>
					<div class="inbox-message-sender-avatar">
						<span class="avatar" ref=${(el) => your_avatar = el}>
							<img src=${avatar(
								auth.avatar,
								'avatar70s',
							)} alt=${auth.name} loading="lazy" />
						</span>
					</div>
					<a class="inbox-message-sender-name"
						href="${root}user/${auth.name}">${auth.name}</a>
				</div>
				<div class="message-content">
				    <h2 class="text-18">${tl(trans.send_message)}</h2>
				    ${alert}
				    <form method="post" action=${form.getAttribute('action')}>
				        ${token}
				        <div class="setting-group">
				            <div class="setting v" data-type="text">
				                <div class="heading">
				                    <h5>${tl(trans.username.name)}</h5>
				                </div>
				                <div class="input-container content-form wide">
				                    ${recipient}
				                </div>
				            </div>
				            <div class="setting v" data-type="text">
				                <div class="heading">
				                    <h5>${tl(trans.subject)}</h5>
				                </div>
				                <div class="input-container content-form wide">
				                    ${subject}
				                </div>
				            </div>
				            <div class="setting v" data-type="text">
				                <div class="heading">
				                    <h5>${tl(trans.message)}</h5>
				                </div>
				                <div class="input-container content-form textarea">
				                    ${contents}
				                </div>
				            </div>
				            ${disclaimer}
				        </div>
				        <div class="settings-footer end gap">
				            <button class="btn primary icon" data-type="message" type="submit">
				                ${tl(trans.send)}
				            </button>
				        </div>
				    </form>
				</div>
			`,
		);

		const your_badge = patch_avatar(your_avatar, auth.name);
		style_name_from_badge(sender_panel_own, your_badge);
	} else {
		const inbox = page.structure.container.querySelector('.inbox');
		page.structure.main.appendChild(inbox);

		if (alert) inbox.appendChild(alert);
	}
}
