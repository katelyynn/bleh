/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { log } from '@/build/log';
import { page } from '@/build/page';
import { tl, trans } from '@/build/trans';
import { Icon, icons } from '@/components/shared/icon.tsx';
import { createRef, ReactNode } from 'jsx-dom';
import { Button } from '@/components/button/button.tsx';

export function load_notifications() {
	if (!page.structure.notifications) {
		const notification_host = <div class='bleh-notifications' />;
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
		classname: append_class,
	});
}

interface NotificationProps {
	id?: string;
	title: ReactNode;
	body?: ReactNode;
	icon?: string;
	classname?: string;
	actions?: NotificationAction[];
	persist?: boolean;
	type?: 'error' | 'warning' | 'success' | 'generic';
	long?: boolean;
	progress?: boolean;
}

type NotificationAction = {
	onClick: () => void;
	children: () => ReactNode;
};

type NotificationElement = HTMLDivElement & {
	title: ReactNode;
	body: ReactNode;
	value: number;
	hide: () => void;
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
	progress = false,
}: NotificationProps) {
	let value = 0;

	log(`creating ${title}`, 'notification', 'info', {
		id: id,
		title: title,
		body: body,
		icon: icon,
		classname: classname,
		persist: persist,
		type: type,
		long: long,
		progress: progress,
	});

	if (type == 'error') {
		if (!icon) icon = icons.error;
	} else if (type == 'warning') {
		if (!icon) icon = icons.warning;
	} else if (type == 'success') {
		if (!icon) icon = icons.check;
	}

	if (!icon) icon = icons.info;

	actions.push({
		onClick: () => notify_rm(notif),
		children: () => (
			<>
				<Icon name={icons.x} />
				{tl(trans.close)}
			</>
		),
	});

	if (progress && persist) persist = false;

	const information = createRef();
	const bar = createRef();

	const notif = (
		<div class={['bleh-notification']} data-notification-type={type}>
			<div
				class='bleh-notification-icon-wrap'
				data-notification-type={type}
			>
				<div
					class={['bleh-notification-icon-back', 'colourful']}
					data-notification-type={type}
				/>
				<Icon
					name={icon}
					className='colourful bleh-notification-icon'
					data-notification-type={type}
				/>
			</div>
			<div class='bleh-notification-body' ref={information} />
			{!persist && (
				<div class='notification-progress'>
					<div class='notification-progress-fill' ref={bar} />
				</div>
			)}
			<div class='notification-actions'>
				{actions.map((action) => (
					<Button
						className='notification-action'
						onClick={action.onClick}
					>
						{action.children()}
					</Button>
				))}
			</div>
		</div>
	) as NotificationElement;

	function update_information() {
		information.current.replaceChildren(
			<>
				<strong className='bleh-notification-title'>{title}</strong>
				<p className='bleh-notification-summary'>{body}</p>
			</>,
		);
	}

	function update_progress() {
		bar.current.style.setProperty('width', `${value}%`);
	}

	update_information();

	page.structure.notifications.appendChild(notif);

	notif.hide = () => {
		notify_rm(notif);
	};

	Object.defineProperty(notif, 'value', {
		get() {
			return value;
		},
		set(v: number) {
			value = v;
			update_progress();
		},
	});

	Object.defineProperty(notif, 'title', {
		set(v: ReactNode) {
			title = v;
			update_information();
		},
	});

	Object.defineProperty(notif, 'body', {
		set(v: ReactNode) {
			body = v;
			update_information();
		},
	});

	if (progress) {
		update_progress();
	}

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
		bar.current.style.setProperty('width', `${counter}%`);

		if (counter <= 0) {
			clearInterval(timer);
			notify_rm(notif);
		}
	}, step);

	return notif;
}

export function notify_rm(notif: NotificationElement) {
	notif.classList.add('fade-out');

	setTimeout(() => {
		notif.remove();
	}, 400);
}
