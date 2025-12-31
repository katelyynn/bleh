//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { settings } from './build/config';
import { log } from './build/log';
import { page } from './build/page';
import {
    seasonal_events,
    seasonal_timer,
    stored_season
} from './build/seasonal';
import { set_storage } from './build/tools';
import { tl, trans } from './build/trans';
import { load_chart_colours } from './chart';
import { notify } from './components/notify';
import { html, render } from 'lighterhtml';
import { DateTime, Duration } from 'luxon';

export function set_season() {
    if (!settings.seasonal) return;

    let last_season_seen = localStorage.getItem('bleh_last_season_seen') || '';

    let now = new Date();
    log(`it is now ${now}`, 'season', 'log');

    stored_season.offset = calculate_offset(now);
    log(`calculated offset as ${stored_season.offset}`, 'season');

    let current_year = now.getFullYear();

    seasonal_events.forEach((season, index) => {
        log(
            `running thru, ${season.id} - ${new Date(season.start.replace('y0', current_year).replace('{offset}', stored_season.offset))} ${new Date(season.end.replace('y0', current_year).replace('{offset}', stored_season.offset))}`,
            'season',
            'log'
        );
        log(
            `${now >= new Date(season.start.replace('y0', current_year).replace('{offset}', stored_season.offset))} ${now <= new Date(season.end.replace('y0', current_year).replace('{offset}', stored_season.offset))}`,
            'season',
            'log'
        );

        season.days_until = -DateTime.now().diff(
            DateTime.fromISO(
                season.start
                    .replace('y0', current_year)
                    .replace('{offset}', stored_season.offset)
            ),
            'days'
        ).days;
        season.is_next_year = false;
        if (season.days_until < 0) {
            // new year
            season.days_until = -DateTime.now().diff(
                DateTime.fromISO(
                    season.start
                        .replace('y0', current_year + 1)
                        .replace('{offset}', stored_season.offset)
                ),
                'days'
            ).days;
            season.is_next_year = true;
        }

        if (
            now >=
                new Date(
                    season.start
                        .replace('y0', current_year)
                        .replace('{offset}', stored_season.offset)
                ) &&
            now <=
                new Date(
                    season.end
                        .replace('y0', current_year)
                        .replace('{offset}', stored_season.offset)
                )
        ) {
            stored_season.now = now;
            stored_season.year = current_year;

            update_season_nav();

            if (stored_season.id == season.id) return;
            stored_season.id = season.id;
            stored_season.start = season.start;
            stored_season.end = season.end;
            stored_season.snowflakes = season.snowflakes;

            if (now.getDate() == 31) {
                stored_season.new_years_eve = true;
                stored_season.seasonal_timer = setInterval(
                    update_season_nav,
                    1000
                );
            } else if (stored_season.seasonal_timer) {
                clearInterval(stored_season.seasonal_timer);
            }

            // whats the next season?
            if (seasonal_events[index + 1] == null) {
                stored_season.next_id = seasonal_events[0].id;
                stored_season.next_start = seasonal_events[0].start;
                stored_season.next_is_new_year = true;
            } else {
                stored_season.next_id = seasonal_events[index + 1].id;
                stored_season.next_start = seasonal_events[index + 1].start;
                stored_season.next_is_new_year = false;
            }

            log(`${season.id} from ${season.start} to ${season.end}`, 'season');
            log(
                `next will be ${stored_season.next_id} from ${stored_season.next_start} (is new year? ${stored_season.next_is_new_year})`,
                'season'
            );

            document.documentElement.setAttribute(
                'data-bleh--season',
                season.id
            );

            // snow
            if (
                season.snowflakes.state &&
                settings.seasonal_particles != 'none'
            ) {
                log('let the snow start!', 'season');
                prep_snow();

                let snowflakes_enabled = true;
                let snowflakes_count = season.snowflakes.count;

                if (settings.seasonal_particles == 'less' && snowflakes_count > 10)
                    snowflakes_count *= 0.45;

                if (page.mobile && snowflakes_count > 10) snowflakes_count *= 0.5;

                begin_snowflakes(snowflakes_enabled, snowflakes_count);
            }

            // new season?
            if (last_season_seen != '' && last_season_seen != season.id) {
                notify({
                    id: 'new_season',
                    title: tl(trans.new_season),
                    body: tl(trans.value_for_time)
                        .replace('{v}', tl(trans.seasonal.listing[season.id]))
                        .replace(
                            '{time}',
                            DateTime.fromISO(
                                season.end
                                    .replace('y0', stored_season.year)
                                    .replace('{offset}', stored_season.offset)
                            ).toRelative(DateTime.fromISO(stored_season.now))
                        ),
                    icon: 'icon-16-season',
                    persist: true
                });
            }
            set_storage('bleh_last_season_seen', season.id);

            load_chart_colours();

            return;
        }
    });

    let lowest = 400;
    let next_season = {
        start: ''
    };
    // TODO: investigate how next_season.start could be null
    // in the meantime, i added it above as an empty string incase
    if (stored_season.id == 'none') {
        seasonal_events.forEach((season) => {
            if (season.days_until < lowest) {
                lowest = season.days_until;
                next_season = season;
            }
        });

        stored_season.now = now;
        stored_season.year = current_year;

        stored_season.next_id = next_season.id;
        stored_season.next_start = next_season.start;
        stored_season.next_is_new_year = next_season.is_next_year;
        log('next season found', 'season', 'info', {
            next: next_season,
            stored: stored_season,
            date: stored_season.next_start
                .replace(
                    'y0',
                    stored_season.next_is_new_year ?
                        stored_season.year + 1
                    :   stored_season.year
                )
                .replace('{offset}', stored_season.offset)
        });
    }
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
    page.header.season.classList.remove('chibi');
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
    page.header.season.classList.add('chibi');
}

function update_season_nav() {
    if (!page.header.season) return;

    page.header.season.setAttribute('data-season', stored_season.id);

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
        page.header.season.classList.remove('chibi');

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
