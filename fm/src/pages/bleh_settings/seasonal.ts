import { html, render } from "lighterhtml";
import { register_skip_to } from "./bleh_settings";
import { trans } from "@/build/trans";
import { tl } from "@/build/trans";
import { page } from "@/build/page";
import { DateTime } from 'luxon';
import { setting } from "@/components/settings/settings";
import { settings } from "@/build/config";
import { season } from "@/components/seasonal";
import { log } from '@/build/log';

export function seasonal() {
    register_skip_to([]);

    const state = page.state.seasons;

    render(page.structure.main, html`
        <div class="bleh--panel">
            ${seasonal_timeline(state.current, state.prev, state.next)}
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
                            data-season=${state.current ? state.current.id : 'none'}
                        >
                            <div
                                class="bleh-icon bleh-seasonal-icon"
                            ></div>
                            <p>
                                ${tl(trans.seasonal.listing[state.current ? state.current.id : 'none'])}
                            </p>
                        </div>
                    </div>
                </div>
                ${state.current ? html.node`
                <div class="setting" data-type="info">
                    <div class="heading">
                        <h5>${tl(trans.started)}</h5>
                    </div>
                    <div class="info">
                        <p id="current_season_start">${state.current.start.toRelative(state.now)}</p>
                    </div>
                </div>
                <div class="setting" data-type="info">
                    <div class="heading">
                        <h5>${tl(trans.ends_in)}</h5>
                    </div>
                    <div class="info">
                        <p id="current_season">${state.current.end.toRelative(state.now)}</p>
                    </div>
                </div>
                ` : settings.seasonal ? html.node`
                <div class="setting" data-type="info">
                    <div class="heading">
                        <h5>${tl(trans.next_in)}</h5>
                    </div>
                    <div class="info">
                        <p id="next_season_start">${state.next.start.toRelative(state.now)}</p>
                    </div>
                </div>
                ` : ''}
            </div>
            <h4>${tl(trans.settings)}</h4>
            <div class="setting-group">
                ${setting({ id: 'seasonal_particles' })}
                ${setting({ id: 'seasonal_particles_fps' })}
                ${setting({ id: 'seasonal_overlays' })}
            </div>
        </div>
    `);
}

export function seasonal_timeline(current: season | null, prev: season, next: season) {
    if (!settings.seasonal) return html.node``;

    return html.node`
        <div class="seasonal-timeline">
            ${seasonal_timeline_item(prev, 'prev')}
            ${current ? seasonal_timeline_item(current, 'current') : html.node`
                <div class="seasonal-timeline-item no-season" data-season-type="current">
                    <div class="seasonal-icon colourful" data-season="none">
                        <div class="bleh-icon" data-season="none" />
                    </div>
                    <strong class="seasonal-name">${tl(trans.seasonal.listing.none)}</strong>
                    <p class="seasonal-desc">${tl(trans.current)}</p>
                </div>
            `}
            ${seasonal_timeline_item(next, 'next')}
        </div>
    `;
}

export function seasonal_timeline_item(season: season, type: 'current' | 'prev' | 'next') {
    let time: string;

    log('creating timeline item', 'season', 'info', { season, type });

    if (type == 'prev') {
        time = season.end.toRelative(page.state.seasons.now);
    } else if (type == 'next') {
        time = season.start.toRelative(page.state.seasons.now);
    } else {
        time = tl(trans.current);
    }

    return html.node`
        <div class="seasonal-timeline-item" data-season-type=${type}>
            <div class="seasonal-icon colourful" data-season=${season.id}>
                <div class="bleh-icon" data-season=${season.id} />
            </div>
            <strong class="seasonal-name colourful" data-season=${season.id}>${tl(trans.seasonal.listing[season.id])}</strong>
            <p class="seasonal-desc">${time}</p>
        </div>
    `;
}
