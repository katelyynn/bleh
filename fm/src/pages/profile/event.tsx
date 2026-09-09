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

export function bleh_event_profile() {
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

	const tables = page.structure.main!.querySelectorAll('.events-list-anhv1');
	tables.forEach((table) => {
		const events: EventItemProps[] = [];

		const items = table.querySelectorAll('.events-list-item');
		items.forEach((item) => {
			const calendar = item.querySelector('.calendar-icon');
			const title = item.querySelector('.events-list-item-event--title');
			const artists = item.querySelector(
				'.events-list-item-event--lineup',
			);
			const venue = item.querySelector('.events-list-item-venue--title');
			const city = item.querySelector('.events-list-item-venue--city');
			const country = item.querySelector(
				'.events-list-item-venue--country',
			);

			const badge = item.querySelector('.attendance-badge');
			const badge_class = badge
				? badge.classList[1].replace('attendance-badge--', '').replace(
					'attending',
					'going',
				)
				: undefined;

			const count = item.querySelector(
				'.events-list-item-attendees-count',
			);
			const avatars = item.querySelectorAll(
				'.avatar.attendee-you-know-avatar',
			);

			const link = item.querySelector('.events-list-cover-link');

			const cancelled = item.classList.contains(
				'events-list-item--cancelled',
			);

			events.push({
				date: calendar?.getAttribute('datetime') || '',
				title: title?.textContent.trim() || '',
				artists: artists?.textContent.trim().split(','),
				venue: venue?.textContent.trim() || '',
				city: city?.textContent.trim() || '',
				country: country?.textContent.trim() || '',
				attendance: badge_class as attendance || undefined,
				attendance_text: badge?.textContent.trim(),
				attendance_count: count?.textContent.trim(),
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
						avatars={event.avatars}
						href={event.href}
						cancelled={event.cancelled}
					/>
				))}
			</EventList>,
		);
	});
}
