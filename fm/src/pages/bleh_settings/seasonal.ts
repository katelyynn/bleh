/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { html, render } from 'lighterhtml';
import { register_skip_to } from './bleh_settings';
import { trans } from '@/build/trans';
import { tl } from '@/build/trans';
import { page } from '@/build/page';
import { DateTime } from 'luxon';
import { setting } from '@/components/settings/settings';
import { settings } from '@/build/config';
import { season } from '@/components/seasonal';
import { log } from '@/build/log';
import { time_tooltip } from '@/components/date/time';

export function seasonal() {
	register_skip_to([]);

	const state = page.state.seasons;

	render(
		page.structure.main!,
		html`
			<div class="bleh--panel">
			    ${seasonal_timeline(
				state.current,
				state.prev,
				state.next,
				state.now,
			)}
			    <div class="seasonal-inner">
			        <div class="sub-text">
			            ${tl(trans.seasonal_timeline)}
			        </div>
			        <h4>
			            ${state.now.toLocaleString(DateTime.DATE_FULL)}
			        </h4>
			    </div>
			    <div class="setting-group">
			        ${setting({ id: 'seasonal' })}
			        <div class="setting" data-type="info">
			            <div class="heading">
			                <h5>${tl(trans.current_season)}</h5>
			            </div>
			            <div class="info">
			                <div
			                    class="icon-combo colourful"
			                    data-season=${state.current
				? state.current.id
				: 'none'}
			                >
			                    <div class="bleh-icon bleh-seasonal-icon" data-season=${state
					.current
				? state.current.id
				: 'none'} />
			                    <p>
			                        ${tl(
				trans.seasonal
					.listing[state.current ? state.current.id : 'none'],
			)}
			                    </p>
			                </div>
			            </div>
			        </div>
			        ${state.current
				? html.node`
                <div class="setting" data-type="info">
                    <div class="heading">
                        <h5>${tl(trans.started)}</h5>
                    </div>
                    <div class="info">
                        ${
					time_tooltip(
						html.node`<p>${
							state.current.start.toRelative({ base: state.now })
						}</p>`,
						state.current.start,
					)
				}
                    </div>
                </div>
                <div class="setting" data-type="info">
                    <div class="heading">
                        <h5>${tl(trans.ends_in)}</h5>
                    </div>
                    <div class="info">
                        ${
					time_tooltip(
						html.node`<p>${
							state.current.end.toRelative({ base: state.now })
						}</p>`,
						state.current.end,
					)
				}
                    </div>
                </div>
                `
				: settings.seasonal
				? html.node`
                <div class="setting" data-type="info">
                    <div class="heading">
                        <h5>${tl(trans.next_in)}</h5>
                    </div>
                    <div class="info">
                        ${
					time_tooltip(
						html.node`<p>${
							state.next.start.toRelative({ base: state.now })
						}</p>`,
						state.next.start,
					)
				}
                    </div>
                </div>
                `
				: ''}
			    </div>
			    <h4>${tl(trans.settings)}</h4>
			    <div class="setting-group">
			        ${setting({ id: 'seasonal_particles' })}
			        ${setting({ id: 'seasonal_particles_fps' })}
			        ${setting({ id: 'seasonal_overlays' })}
			    </div>
			</div>
		`,
	);
}

export function seasonal_timeline(
	current: season | null,
	prev: season,
	next: season,
	now: DateTime,
) {
	if (!settings.seasonal) return html.node``;

	return html.node`
        <div class="seasonal-timeline">
            ${seasonal_timeline_item(prev, 'prev', now)}
            ${
		current ? seasonal_timeline_item(current, 'current', now) : html.node`
                <div class="seasonal-timeline-item no-season" data-season-type="current">
                    <div class="seasonal-icon colourful" data-season="none">
                        <div class="bleh-icon" data-season="none" />
                    </div>
                    <strong class="seasonal-name">${
			tl(trans.seasonal.listing.none)
		}</strong>
                    <p class="seasonal-desc">${tl(trans.current)}</p>
                </div>
            `
	}
            ${seasonal_timeline_item(next, 'next', now)}
        </div>
    `;
}

export function seasonal_timeline_item(
	season: season,
	type: 'current' | 'prev' | 'next',
	now: DateTime,
) {
	let time;

	log('creating timeline item', 'season', 'info', { season, type });

	if (type == 'prev') {
		time = time_tooltip(
			html.node`<p class="seasonal-desc">${
				season.end.toRelative({ base: now })
			}</p>`,
			season.end,
		);
	} else if (type == 'next') {
		time = time_tooltip(
			html.node`<p class="seasonal-desc">${
				season.start.toRelative({ base: now })
			}</p>`,
			season.start,
		);
	} else {
		time = html.node`<p class="seasonal-desc">${tl(trans.current)}</p>`;
	}

	return html.node`
        <div class="seasonal-timeline-item" data-season-type=${type}>
            <div class="seasonal-icon colourful" data-season=${season.id}>
                <div class="bleh-icon" data-season=${season.id} />
            </div>
            <strong class="seasonal-name colourful" data-season=${season.id}>${
		tl(trans.seasonal.listing[season.id])
	}</strong>
            ${time}
            <div class="seasonal-timeline-bg colourful" data-season=${season.id} data-season-type=${type} />
        </div>
    `;
}
