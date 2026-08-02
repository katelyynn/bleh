/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { settings } from '@/build/config';
import { log } from '@/build/log';
import { page, root } from '@/build/page';
import { seasonal_events } from '@/build/seasonal';
import { set_storage } from '@/build/tools';
import { tl, trans } from '@/build/trans';
import { load_chart_colours } from '@/components/music/chart';
import { notify } from '@/components/dialog/notify';
import { html, render } from 'lighterhtml';
import { DateTime } from 'luxon';
import { keys } from './settings/storage';

export interface season {
	id: string;
	start: DateTime;
	end: DateTime;
	snowflakes: {
		state: boolean;
		count?: number;
	};
}

export function set_season() {
	if (!settings.seasonal) {
		page.state.seasons = {
			now: DateTime.local(),
			current: null,
			prev: null,
			next: null,
		};
		return;
	}

	const last_season_seen = localStorage.getItem(keys.last_season_seen) || '';

	const state = get_season_state();
	page.state.seasons = state;

	if (!state.current) return;

	apply_season(state.current);

	if (state.current.id != last_season_seen) {
		new_season(state.current, state.now);
	}
}

function apply_season(current: season) {
	log(`applying ${current.id}`, 'season', 'info', { current });
	document.body.setAttribute('data-bleh--season', current.id);

	if (current.snowflakes.state && settings.seasonal_particles != 'none') {
		log('let the snow start!', 'season');
		prep_snow();

		const snowflakes_enabled = true;
		let snowflakes_count = current.snowflakes.count;

		if (settings.seasonal_particles == 'less' && snowflakes_count > 10) {
			snowflakes_count *= 0.45;
		}

		if (page.mobile && snowflakes_count > 10) snowflakes_count *= 0.5;

		begin_snowflakes(snowflakes_enabled, snowflakes_count);
	}

	update_season_nav();
}

function new_season(current: season, now: DateTime) {
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
	const year = now.year;

	const seasons = resolve_seasons(now);

	seasons.sort((a, b) => a.start.toMillis() - b.start.toMillis());

	const current = seasons.find((season) => season.current) || null;

	let prev = null;
	let next = null;

	if (current) {
		const index = seasons.findIndex((season) => season.id == current.id);

		prev = seasons[index - 1] || null;
		next = seasons[index + 1] || null;

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
		next = seasons.find((season) => now < season.start) || null;

		if (!next) {
			const first = seasons[0];
			next = {
				...first,
				start: process_date(first.start, 'start', year + 1),
				end: process_date(first.end, 'end', year + 1),
			};
		}

		const index = seasons.findIndex((season) => season.id == next.id);

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

export function update_season_nav() {
	if (!page.header.season) return;

	const state = page.state.seasons;

	page.header.season.setAttribute(
		'href',
		`${root}bleh${state.current ? '/seasonal' : ''}`,
	);
	page.header.season.setAttribute(
		'data-season',
		state.current ? state.current.id : 'none',
	);
	page.header.season.setAttribute('data-season-active', !!state.current);
	page.header.season.textContent = state.current
		? state.current.end.toRelative(state.now)
		: tl(trans.bleh_settings);
}

function prep_snow() {
	if (page.state.snow) return;

	page.state.snow = html.node`
        <div class="snow-container" />
    `;
	document.documentElement.appendChild(page.state.snow);
}

// loosely based on https://app.embed.im/snow.js
function begin_snowflakes(enabled, count) {
	if (!enabled) return;

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

	render(
		page.state.snow,
		html`
			${flakes.map((flake) =>
				html.node`
            <div class="snow" style="width: ${flake.size}px; height: ${flake.size}px; --x: ${flake.x}vw; --x-end: calc(${flake.x}vw + ${flake.drift}vw); --s: ${flake.scale}; animation-duration: ${flake.duration}s; animation-delay: ${flake.delay}s; opacity: ${flake.opacity}" />
        `
			)}
		`,
	);
}
