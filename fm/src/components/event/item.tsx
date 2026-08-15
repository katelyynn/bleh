import { Icon, icons } from '@/components/shared/icon.tsx';
import { correct_artist } from '@/components/music/lotus.ts';
import { copy, romanise, sanitise } from '@/build/tools.ts';
import { Button } from '@/components/button/button.tsx';
import { tl, trans } from '@/build/trans.ts';
import { root } from '@/build/page.ts';
import { DateTime } from 'luxon';
import { ReactNode } from 'jsx-dom';
import { WithChildren } from '@/types/generic.tsx';

export type attendance = 'going' | 'maybe';

export interface EventItemProps {
	date: string;
	title: string;
	artists?: string[];
	venue: string;
	city: string;
	country: string;
	attendance?: attendance;
	attendance_text?: string;
	attendance_count?: string;
	avatars?: ReactNode[];
	href: string;
}

export function EventItem({
	date,
	title,
	artists,
	venue,
	city,
	country,
	attendance,
	attendance_text,
	attendance_count,
	avatars,
	href,
}: EventItemProps) {
	return (
		<div class={['event-item']}>
			<div class={['event-item-top']}>
				<div class='event-item-date'>
					<Icon name={icons.events} identifier='event-item' />
					<p class='event-item-date-text'>
						{DateTime.fromISO(date).toLocaleString(
							DateTime.DATE_MED_WITH_WEEKDAY,
						)}
					</p>
					<div class='event-item-dot' />
					<p class='event-item-date-text'>
						{DateTime.fromISO(date).toRelative({ style: 'short' })}
					</p>
				</div>
				{(attendance_count != null || avatars) && (
					<div class={['event-item-aside']}>
						{avatars && (
							<div class='event-item-attendees'>
								{avatars.map((avatar) => avatar)}
							</div>
						)}
						{attendance_count != null && (
							<div class='event-item-count'>
								<Icon name={icons.users} />
								{attendance_count}
							</div>
						)}
					</div>
				)}
			</div>
			<div class={['event-item-middle']}>
				<h1 class='event-item-title'>{title}</h1>
				{artists && (
					<h2 class='event-item-artists'>
						{artists.map((artist, i) => (
							<>
								<a
									class='event-item-artist'
									href={`${root}music/${sanitise(artist)}`}
									key={i}
								>
									{romanise(correct_artist(artist))}
								</a>
								{i < artists.length - 1 && ', '}
							</>
						))}
					</h2>
				)}
			</div>
			<div class={['event-item-bottom']}>
				<div class='event-item-location'>
					<Icon name={icons.location} />
					<p class='event-item-location-name'>
						<span class='event-item-venue'>{venue}</span>,{' '}
						<span class='event-item-city'>{city} {country}</span>
					</p>
				</div>
				<div class='event-item-buttons'>
					<Button
						onClick={() => copy(`https://www.last.fm${href}`)}
					>
						<Icon name={icons.link} />
						{tl(trans.copy)}
					</Button>
					<Button
						href={href}
						primary={!!attendance}
						colourful
						className={`event-${attendance}`}
					>
						<Icon
							name={attendance
								? icons[attendance]
								: icons.calendar}
						/>
						{attendance == 'going'
							? tl(trans.going)
							: attendance == 'maybe'
							? tl(trans.interested)
							: tl(trans.view)}
					</Button>
				</div>
			</div>
		</div>
	);
}

export function EventList({
	children,
}: WithChildren) {
	return (
		<div class='event-item-list'>
			{children}
		</div>
	);
}
