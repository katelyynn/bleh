/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { page } from '@/build/page.ts';
import {
	attendance,
	EventItem,
	EventItemProps,
	EventList,
} from '@/components/event/item.tsx';
import { SeeMore } from '@/components/text/see_more.tsx';

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
					/>
				))}
			</EventList>,
		);
	});
}
