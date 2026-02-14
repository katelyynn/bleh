//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { settings } from '@/build/config';
import { log } from '@/build/log';
import { page, STORAGE_LAST_SEASON_SEEN } from '@/build/page';
import {
    seasonal_events,
    seasonal_timer,
    stored_season
} from '@/build/seasonal';
import { set_storage } from '@/build/tools';
import { tl, trans } from '@/build/trans';
import { load_chart_colours } from '@/components/music/chart';
import { notify } from '@/components/dialog/notify';
import { html, render } from 'lighterhtml';
import { DateTime, Duration } from 'luxon';

export interface season {
    id: string,
    start: DateTime,
    end: DateTime,
    snowflakes: {
        state: boolean,
        count?: number
    }
}

export function set_season() {
    if (!settings.seasonal) return;

    const last_season_seen = localStorage.getItem(STORAGE_LAST_SEASON_SEEN) || '';

    const state = get_season_state();
    page.state.seasons = state;

    if (!state.current) return;

    apply_season(state.current);

    if (state.current.id != last_season_seen)
        new_season(state.current, state.now);
}

function apply_season(current: season) {
    log(`applying ${current.id}`, 'season', 'info', { current });
    document.documentElement.setAttribute('data-bleh--season', current.id);

    if (current.snowflakes.state && settings.seasonal_particles != 'none') {
        log('let the snow start!', 'season');
        prep_snow();

        const snowflakes_enabled = true;
        let snowflakes_count = current.snowflakes.count;

        if (settings.seasonal_particles == 'less' && snowflakes_count > 10)
            snowflakes_count *= 0.45;

        if (page.mobile && snowflakes_count > 10) snowflakes_count *= 0.5;

        begin_snowflakes(snowflakes_enabled, snowflakes_count);
    }

    update_season_nav();
}

function new_season(current: season, now: DateTime) {
    set_storage(STORAGE_LAST_SEASON_SEEN, current.id);
    load_chart_colours();

    notify({
        id: 'new_season',
        title: tl(trans.new_season),
        body: tl(trans.value_for_time, {
            v: tl(trans.seasonal.listing[current.id]),
            time: current.end.toRelative(now)
        }),
        icon: 'icon-16-season',
        persist: true
    });
}

function get_season_state(now = DateTime.local()) {
    const year = now.year;

    const seasons = resolve_seasons(now);

    seasons.sort((a, b) => a.start.toMillis() - b.start.toMillis());

    const current = seasons.find(season => season.current) || null;

    let prev = null;
    let next = null;

    if (current) {
        const index = seasons.findIndex(season => season.id == current.id);

        prev = seasons[index - 1] || null;
        next = seasons[index + 1] || null;

        if (!prev) {
            const last = seasons[seasons.length - 1];
            prev = {
                ...last,
                start: process_date(last.start, 'start', year - 1),
                end: process_date(last.end, 'end', year - 1)
            };
        }

        if (!next) {
            const first = seasons[0];
            next = {
                ...first,
                start: process_date(first.start, 'start', year + 1),
                end: process_date(first.end, 'end', year + 1)
            };
        }
    } else {
        next = seasons.find(season => now < season.start) || null;

        if (!next) {
            const first = seasons[0];
            next = {
                ...first,
                start: process_date(first.start, 'start', year + 1),
                end: process_date(first.end, 'end', year + 1)
            };
        }

        const index = seasons.findIndex(season => season.id == next.id);

        prev = seasons[index - 1] || seasons[seasons.length - 1];
    }

    return {
        now,
        current,
        prev,
        next
    };
}

function resolve_seasons(now = DateTime.local()) {
    const year = now.year;

    return seasonal_events.map(season => {
        const start = process_date(season.start, 'start', year);
        const end = process_date(season.end, 'end', year);

        const current = now >= start && now <= end;

        return {
            ...season,
            start,
            end,
            current
        };
    })
}

interface date {
    month: number,
    day: number,
    hour?: number,
    minute?: number,
    second?: number
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
        second
    }, {
        zone: 'local'
    });
}

function calculate_offset(now) {
    let offset = now.getTimezoneOffset();

    if (offset == 0) return '+0000';

    const sign = offset < 0 ? '+' : '-';
    offset = Math.abs(offset);

    const hours = Math.floor(offset / 60);
    const minutes = offset % 60;

    const formatted_hours = hours < 10 ? `0${hours}` : hours.toString();
    const formatted_minutes = minutes < 10 ? `0${minutes}` : minutes.toString();

    return sign + formatted_hours + formatted_minutes;
}

export function seasonal_timer_start(bypass = false) {
    if (stored_season.new_years_eve && !bypass) return;

    if (seasonal_timer.state) return;

    seasonal_timer.state = setInterval(set_season, 1000);
    log('started interval', 'season', 'info');

    if (!page.header.season_tooltip) return;

    page.header.season_tooltip.setContent(html.node`
        <span class="season-colour-name colourful" data-season=${stored_season.id}>${tl(trans.seasonal.listing[stored_season.id])}</span>
        <span class="season-exclusive">${tl(trans.seasonal.live)}</span>
    `);

    page.header.season.setAttribute('data-live', true);
    page.header.season.classList.toggle('chibi', !stored_season.new_years_eve);
}
export function seasonal_timer_end() {
    if (stored_season.new_years_eve) return;

    if (!seasonal_timer.state) return;

    clearInterval(seasonal_timer.state);
    seasonal_timer.state = null;
    log('ended interval', 'season', 'info');

    if (!page.header.season_tooltip) return;

    page.header.season_tooltip.setContent(html.node`
        <span class="season-colour-name colourful" data-season=${stored_season.id}>${tl(trans.seasonal.listing[stored_season.id])}</span>
        <span class="season-exclusive">${tl(trans.seasonal.notice)}</span>
    `);

    page.header.season.setAttribute('data-live', false);
    page.header.season.classList.toggle('chibi', !stored_season.new_years_eve);
}

function update_season_nav() {
    if (!page.header.season) return;

    page.header.season.setAttribute('data-season', stored_season.id);
    page.header.season.classList.toggle('chibi', !stored_season.new_years_eve);

    if (!stored_season.new_years_eve) {
        page.header.season.textContent = DateTime.fromISO(
            stored_season.end
                .replace('y0', stored_season.year)
                .replace('{offset}', stored_season.offset)
        ).toRelative(DateTime.fromISO(stored_season.now));
    } else {
        let next = stored_season.next_start
            .replace('y0', stored_season.year)
            .replace('{offset}', stored_season.offset);
        if (stored_season.next_is_new_year)
            next = stored_season.next_start
                .replace('y0', stored_season.year + 1)
                .replace('{offset}', stored_season.offset);

        let time_until = new Date(next) - new Date();

        page.header.season.textContent = countdown_to(time_until);
        page.header.season.setAttribute('data-live', true);

        page.header.season_tooltip.setContent(html.node`
            <span class="season-colour-name">${tl(trans.seasonal.listing[stored_season.id])}</span>
            <span class="season-exclusive">${tl(trans.seasonal.live)}</span>
        `);
    }
}

function countdown_to(time_until) {
    const duration = Duration.fromMillis(time_until).shiftTo(
        'days',
        'hours',
        'minutes',
        'seconds'
    );
    let { days, hours, minutes, seconds } = duration.toObject();

    days = Math.floor(days);
    hours = Math.floor(hours);
    minutes = Math.floor(minutes);
    seconds = Math.floor(seconds);

    hours = String(hours).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    seconds = String(seconds).padStart(2, '0');

    if (days != 0)
        return DateTime.fromISO(
            stored_season.end
                .replace('y0', stored_season.year)
                .replace('{offset}', stored_season.offset)
        ).toRelative(DateTime.fromISO(stored_season.now));

    if (hours == '00' && minutes == '00' && seconds == '00') set_season();

    return `${hours}:${minutes}:${seconds}`;
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

    render(page.state.snow, html`
        ${flakes.map(flake => html.node`
            <div class="snow" style="width: ${flake.size}px; height: ${flake.size}px; --x: ${flake.x}vw; --x-end: calc(${flake.x}vw + ${flake.drift}vw); --s: ${flake.scale}; animation-duration: ${flake.duration}s; animation-delay: ${flake.delay}s; opacity: ${flake.opacity}" />
        `)}
    `);
}
