/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { season } from '@/components/seasonal.ts';
import { log } from '@/build/log.ts';
import { DateTime } from 'luxon';
import { keys } from '@/components/settings/storage.ts';
import { useSettings } from '@/page.ts';
import { set_storage } from '@/build/tools.ts';
import { load_chart_colours } from '@/components/music/chart.ts';
import { notify } from '@/components/dialog/notify.ts';
import { tl, trans } from '@/build/trans.ts';
import { page } from '@/build/page.ts';
import { CSSProperties } from 'jsx-dom';

export const seasonal_timer = {
	state: undefined,
};
export const stored_season = {
	id: 'none',
	new_years_eve: false,
};
export const seasonal_events: season[] = [
	{
		id: 'new_years',
		start: {
			month: 1,
			day: 1,
		},
		end: {
			month: 1,
			day: 14,
		},
		snowflakes: {
			state: true,
			count: 90,
		},
	},
	{
		id: 'easter',
		start: {
			month: 4,
			day: 2,
		},
		end: {
			month: 4,
			day: 30,
		},
		snowflakes: {
			state: false,
		},
	},
	{
		id: 'pride',
		start: {
			month: 6,
			day: 1,
		},
		end: {
			month: 6,
			day: 30,
		},
		snowflakes: {
			state: false,
		},
	},
	{
		id: 'summer',
		start: {
			month: 7,
			day: 1,
		},
		end: {
			month: 9,
			day: 10,
		},
		snowflakes: {
			state: false,
		},
	},
	{
		id: 'halloween',
		start: {
			month: 9,
			day: 24,
		},
		end: {
			month: 11,
			day: 1,
		},
		snowflakes: {
			state: false,
		},
	},
	{
		id: 'pre_fall',
		start: {
			month: 11,
			day: 1,
			hour: 12,
		},
		end: {
			month: 11,
			day: 12,
		},
		snowflakes: {
			state: true,
			count: 12,
		},
	},
	{
		id: 'fall',
		start: {
			month: 11,
			day: 13,
		},
		end: {
			month: 11,
			day: 22,
		},
		snowflakes: {
			state: true,
			count: 80,
		},
	},
	{
		id: 'christmas',
		start: {
			month: 11,
			day: 23,
		},
		end: {
			month: 12,
			day: 31,
		},
		snowflakes: {
			state: true,
			count: 160,
		},
	},
];

type listener = (state: seasonState) => void;

type processedSeason = season & {
	start: DateTime;
	end: DateTime;
};

type seasonState = {
	now?: DateTime;
	previous?: processedSeason | undefined;
	current?: processedSeason | undefined;
	next?: processedSeason | undefined;
};

export class Seasons {
	private now: DateTime;
	private previous: processedSeason | undefined;
	private current: processedSeason | undefined;
	private next: processedSeason | undefined;

	private listeners: listener[] = [];

	constructor() {
		log('constructing...', 'season');
		this.rebuild();

		useSettings.on('seasonal', () => this.rebuild());
		useSettings.on('seasonal_particles', () => this.rebuild());
		useSettings.on('seasonal_particles_fps', () => this.rebuild());
	}

	public rebuild() {
		const state = get_season_state();

		if (!useSettings.get('seasonal')) {
			state.prev = undefined;
			state.current = undefined;
			state.next = undefined;
		}

		this.now = state.now;
		this.previous = state.prev;
		this.current = state.current;
		this.next = state.next;

		this.apply();

		if (!this.current) return;
	}

	public get() {
		return {
			now: this.now,
			previous: this.previous,
			current: this.current,
			next: this.next,
		};
	}

	private apply() {
		apply_season(this.current);

		this.listeners.forEach((cb) => {
			cb({
				now: this.now,
				previous: this.previous,
				current: this.current,
				next: this.next,
			});
		});
	}

	// members can subscribe to seasonal changes
	// and receive the new value
	public on(callback: listener) {
		this.listeners.push(callback);
	}
}

function apply_season(current?: processedSeason) {
	if (!current || useSettings.get('seasonal_particles') == 'none') {
		if (page.state.snow) page.state.snow.innerHTML = '';
	}

	if (!current) {
		document.body.removeAttribute('data-bleh--season');

		return;
	}

	log(`applying ${current.id}`, 'season', 'info', { current });
	document.body.setAttribute('data-bleh--season', current.id);

	if (
		current.snowflakes.state &&
		useSettings.get('seasonal_particles') != 'none'
	) {
		log('let the snow start!', 'season');
		prep_snow();

		const snowflakes_enabled = true;
		let snowflakes_count = current.snowflakes.count || 0;

		if (
			useSettings.get('seasonal_particles') == 'less' &&
			snowflakes_count > 10
		) {
			snowflakes_count *= 0.45;
		}

		if (page.mobile && snowflakes_count > 10) snowflakes_count *= 0.5;

		begin_snowflakes(snowflakes_enabled, snowflakes_count);
	}
}

export function new_season(current: season, now: DateTime) {
	set_storage(keys.last_season_seen, current.id);
	load_chart_colours();

	notify({
		id: 'new_season',
		title: tl(trans.new_season),
		body: tl(trans.value_for_time, {
			v: tl(trans.seasonal.listing[current.id]),
			time: current.end.toRelative(now),
		}),
		icon: 'icon-16-season',
		persist: true,
	});
}

function get_season_state(now = DateTime.local()) {
	//now = DateTime.fromISO('2026-12-25');
	const year = now.year;

	const seasons = resolve_seasons(now);

	seasons.sort((a, b) => a.start.toMillis() - b.start.toMillis());

	const current = seasons.find((season) => season.current) || undefined;

	let prev: processedSeason | undefined;
	let next: processedSeason | undefined;

	if (current) {
		const index = seasons.findIndex((season) => season.id == current.id);

		prev = seasons[index - 1] || undefined;
		next = seasons[index + 1] || undefined;

		if (!prev) {
			const last = seasons[seasons.length - 1];
			prev = {
				...last,
				start: process_date(last.start, 'start', year - 1),
				end: process_date(last.end, 'end', year - 1),
			};
		}

		if (!next) {
			const first = seasons[0];
			next = {
				...first,
				start: process_date(first.start, 'start', year + 1),
				end: process_date(first.end, 'end', year + 1),
			};
		}
	} else {
		next = seasons.find((season) => now < season.start) || undefined;

		if (!next) {
			const first = seasons[0];
			next = {
				...first,
				start: process_date(first.start, 'start', year + 1),
				end: process_date(first.end, 'end', year + 1),
			};
		}

		const index = seasons.findIndex((season) => season.id == next!.id);

		prev = seasons[index - 1] || seasons[seasons.length - 1];
	}

	return {
		now,
		current,
		prev,
		next,
	};
}

function resolve_seasons(now = DateTime.local()) {
	const year = now.year;

	return seasonal_events.map((season) => {
		const start = process_date(season.start, 'start', year);
		const end = process_date(season.end, 'end', year);

		const current = now >= start && now <= end;

		return {
			...season,
			start,
			end,
			current,
		};
	});
}

interface date {
	month: number;
	day: number;
	hour?: number;
	minute?: number;
	second?: number;
}

function process_date(date: date, type: 'start' | 'end', year: number) {
	let hour = date.hour || 0;
	let minute = date.minute || 0;
	let second = date.second || 0;

	if (type == 'end' && !date.hour && !date.minute && !date.second) {
		hour = 23;
		minute = 59;
		second = 59;
	}

	return DateTime.fromObject({
		year,
		month: date.month,
		day: date.day,
		hour,
		minute,
		second,
	}, {
		zone: 'local',
	});
}

function prep_snow() {
	if (page.state.snow) return;

	page.state.snow = <div class='snow-container' />;
	document.body.appendChild(page.state.snow);
}

// loosely based on https://app.embed.im/snow.js
function begin_snowflakes(enabled: boolean, count: number) {
	if (!enabled) {
		page.state.snow!.innerHTML = '';
		return;
	}

	const flakes = Array.from({ length: count * 0.7 }, () => {
		const x = (Math.random() * 100).toFixed(1);
		const drift = (Math.random() * 40 - 10).toFixed(1);
		const scale = (Math.random() * 0.9 + 0.4).toFixed(1);
		const size = 8 * scale;
		const duration = (Math.random() * 64 + 20).toFixed(1);
		const delay = (Math.random() * -30).toFixed(1);
		const opacity = (Math.random() * 0.7 + 0.2).toFixed(1);

		return { x, drift, scale, size, duration, delay, opacity };
	});

	page.state.snow!.replaceChildren(
		<>
			{flakes.map((flake) => (
				<div
					class='snow'
					style={{
						width: `${flake.size}px`,
						height: `${flake.size}px`,
						'--x': `${flake.x}vw`,
						'--x-end': `calc(${flake.x}vw + ${flake.drift}vw)`,
						'--s': flake.scale,
						animationDuration: `${flake.duration}s`,
						animationDelay: `${flake.delay}s`,
						opacity: flake.opacity,
					} as CSSProperties}
				/>
			))}
		</>,
	);
}
