/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { log } from '@/build/log';
import { page } from '@/build/page';
import { html, render } from 'lighterhtml';
import { tl, trans } from '@/build/trans';
import tippy from 'tippy.js';

export function load_notifications() {
	if (!page.structure.notifications) {
		const notification_host = html.node`
            <div class="bleh-notifications" />
        `;
		page.structure.notifications = notification_host;
		document.body.appendChild(notification_host);
	}
}

/**
 * @deprecated Automatically redirects to notify
 * @see notify
 */
export function deliver_notif(
	content: string,
	persist = false,
	has_icon = false,
	append_class = null,
	action = '',
) {
	// redirect
	return notify({
		id: 'legacy_notification',
		title: content,
		icon: 'icon-16-info',
		classname: append_class,
	});
}

type notify = {
	id?: string;
	title: string;
	body?: string | HTMLElement;
	icon?: string;
	classname?: string;
	actions?: notify_action[];
	persist?: boolean;
	type?: string;
	long?: boolean;
	colourful?: boolean;
	progress?: boolean;
};

type notify_action = {
	type: string;
	action: Function;
	text: string;
};

// Delivers a top-right flyout notification
export function notify({
	id,
	title,
	body,
	icon,
	classname,
	actions = [],
	persist = false,
	type = 'generic',
	long = false,
	colourful = false,
	progress = false,
}: notify) {
	log(`creating ${title}`, 'notification', 'info', {
		id: id,
		title: title,
		body: body,
		icon: icon,
		classname: classname,
		persist: persist,
		type: type,
		long: long,
		colourful: colourful,
		progress: progress,
	});

	if (type == 'error') {
		if (!icon) icon = 'icon-16-x';
		colourful = true;
	} else if (type == 'warning') {
		if (!icon) icon = 'icon-16-warning';
		colourful = true;
	} else if (type == 'success') {
		if (!icon) icon = 'icon-16-check';
		colourful = true;
	}

	if (!icon) icon = 'icon-16-info';

	let bar;

	actions.push({
		type: 'close',
		action: () => notify_rm(notif),
		text: tl(trans.close),
	});

	if (progress && persist) persist = false;

	let information;

	const notif = html.node`
        <div class="bleh-notification" data-type=${type} style="--mask: var(--${icon})">
            <div class="notification-information" ref=${(el) =>
		information = el}>
                <div class="notification-title">${title}</div>
                ${
		body
			? html.node`
                <div class="notification-body">${body}</div>
                `
			: ''
	}
            </div>
            ${
		!persist
			? html.node`
            <div class="notification-progress"><div class="fill" ref=${(el) =>
				bar = el} /></div>
            `
			: ''
	}
            <div class="notification-actions">
                ${
		(actions.length > 0)
			? actions.map((action) => () => {
				const button = html.node`
                        <button class="btn notification-action icon-mask" data-type=${action.type} onclick=${action.action}>${action.text}</button>
                    `;

				tippy(button, {
					content: action.text,
				});

				return button;
			})
			: ''
	}
            </div>
        </div>
    `;

	if (icon) notif.classList.add('with-icon');
	if (classname) notif.classList.add(classname);
	if (long) notif.classList.add('long');
	if (colourful) notif.classList.add('colourful');

	page.structure.notifications.appendChild(notif);

	notif.remove = () => {
		notify_rm(notif);
	};

	// @ts-ignore
	notif.set = (value) => {
		bar.style.setProperty('width', `${value}%`);
	};

	// @ts-ignore
	notif.set_body = (body) => {
		render(
			information,
			html`
				<div class="notification-title">${title}</div>
				${body
					? html.node`
            <div class="notification-body">${body}</div>
            `
					: ''}
			`,
		);
	};

	if (persist || progress) {
		return notif;
	}

	const ms = long ? 7000 : 3000;
	let counter = 100;
	const step = ms / 100;

	const timer = setInterval(() => {
		if (notif.matches(':hover')) {
			return;
		}

		counter--;
		bar.style.setProperty('width', `${counter}%`);

		if (counter <= 0) {
			clearInterval(timer);
			notify_rm(notif);
		}
	}, step);

	return notif;
}

export function notify_rm(notif: HTMLElement) {
	notif.classList.add('fade-out');

	setTimeout(function () {
		page.structure.notifications.removeChild(notif);
	}, 400);
}
