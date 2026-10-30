/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { page } from '@/build/page.ts';
import { tl, trans } from '@/build/trans';
import {
	attendance,
	EventItem,
	EventItemProps,
	EventList,
} from '@/components/event/item.tsx';
import { icons } from '@/components/shared/icon';
import { PanelHead } from '@/components/text/head';
import { PanelTop, SeeMore, ViewButtons } from '@/components/text/see_more.tsx';

export function bleh_event_artist() {
	const upcoming_link = page.structure.main!.querySelector(
		'#events-section > p',
	);
	const link = upcoming_link?.querySelector('a');
	if (link) {
		upcoming_link!.replaceWith(
			<div class='event-list-below'>
				<SeeMore href={link.href}>
					{link.textContent.trim()}
				</SeeMore>
			</div>,
		);
	}

	const tables = page.structure.main!.querySelectorAll('.events-list');
	tables.forEach((table) => {
		const events: EventItemProps[] = [];

		const items = table.querySelectorAll('.events-list-item');
		items.forEach((item) => {
			const calendar = item.querySelector('.events-list-item-date-icon');
			const title = item.querySelector('.events-list-item-event-name');
			const artists = item.querySelectorAll(
				'.events-list-item-acts > span > span[itemprop="name"]',
			);
			const venue = item.querySelector('.events-list-item-venue--title');
			const city = item.querySelector('.events-list-item-venue--address');

			const badge = item.querySelector(
				'.events-list-item-user-attendance',
			);
			const badge_type =
				item.classList.contains('events-list-item--attending')
					? 'going'
					: item.classList.contains('events-list-item--interested')
						? 'maybe'
						: undefined;

			const count = item.querySelectorAll(
				'.events-list-item-attendees-count',
			);
			const avatars = item.querySelectorAll(
				'.users-you-know-user > .avatar',
			);

			const link = item.querySelector('.link-block-cover-link');

			const cancelled = item.classList.contains(
				'events-list-item--cancelled',
			);

			events.push({
				date: calendar?.getAttribute('datetime') || '',
				title: title?.textContent.trim() || '',
				artists: Array.from(artists).map((artist) =>
					artist.textContent.trim()
				),
				venue: venue?.textContent.trim() || '',
				city: city?.textContent.trim() || '',
				attendance: badge_type,
				attendance_text: badge?.textContent.trim(),
				attendance_count: count?.[0]?.textContent.trim(),
				interested_count: count?.[1]?.textContent.trim(),
				avatars: Array.from(avatars),
				href: link?.getAttribute('href'),
				cancelled,
			});
		});

		table.replaceWith(
			<EventList>
				{events.map((event, i) => (
					<EventItem
						date={event.date}
						title={event.title}
						artists={event.artists}
						venue={event.venue}
						city={event.city}
						country={event.country}
						attendance={event.attendance}
						attendance_text={event.attendance_text}
						attendance_count={event.attendance_count}
						interested_count={event.interested_count}
						avatars={event.avatars}
						href={event.href}
						cancelled={event.cancelled}
					/>
				))}
			</EventList>,
		);
	});
}

export function artist_event_sidebar() {
	const menu = page.structure.side!.querySelector('#events-select') as HTMLElement;
	if (!menu) return;

	const panel = menu.parentElement!;
	panel.classList.add('artist-events-sidebar');

	const select_btn = panel.querySelector('.dropdown-menu-clickable-button') as HTMLButtonElement;
	select_btn.classList.remove('dropdown-menu-clickable-button', 'section-control');
	select_btn.classList.add('btn', 'select-button', 'link-select', 'blend-v2-btn');

	const head = panel.querySelector('h2')!;

	head.replaceWith(
		<PanelTop>
			<PanelHead top icon={icons.events}>
				{tl(trans.events)}
			</PanelHead>
			{select_btn && (
				<ViewButtons blend blendV2 accompany>
					{select_btn}
					{menu}
				</ViewButtons>
			)}
		</PanelTop>
	);

	const list = panel.querySelector(':scope > .buffer-standard') as HTMLElement;
	list.classList.add('artist-events-list');
}
