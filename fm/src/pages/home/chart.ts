/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { settings } from '@/build/config';
import { api_key, page, root } from '@/build/page';
import { lang, tl, trans } from '@/build/trans';
import {
	correct_artist,
	correct_item_by_artist,
} from '@/components/music/lotus';
import { html, render } from 'lighterhtml';
import tippy from 'tippy.js';
import { DateTime } from 'luxon';
import { setting } from '@/components/settings/settings';
import { bind_link_block } from '@/components/shared/link_block';
import { ff } from '@/components/settings/sku';
import { beta_indicator, new_indicator } from '@/components/shared/indicator';
import { select } from '@/components/settings/select';
import { flag } from '@/components/shared/flag';
import { header_colour } from '@/components/page/colour';
import { chart_top_tracks, chart_track } from '@/types/chart';
import { error } from '@/types/api';
import { romanise } from '@/build/tools';

export function bleh_charts() {
	if (page.type == 'explore_charts') {
		bleh_explore_charts();
	} else if (page.type == 'geo_charts') {
		bleh_geo_charts();
	}

	let charts = page.structure.main.querySelector('.charts');

	if (ff('aihara')) {
		const new_nav = html.node`
            <div class="toolbar">
                <nav class="navlist secondary-nav navlist--more redesigned-navigation">
                    <ul class="navlist-items">
                        <li class="navlist-item secondary-nav-item secondary-nav-item--daily">
                            <a href="${root}charts" class="secondary-nav-item-link ${
			page.subpage == 'overview' ? 'secondary-nav-item-link--active' : ''
		}">
                                ${tl(trans.daily)}
                            </a>
                        </li>
                        <li class="navlist-item secondary-nav-item secondary-nav-item--weekly">
                            <a href="${root}charts/weekly" class="secondary-nav-item-link ${
			page.subpage == 'weekly' ? 'secondary-nav-item-link--active' : ''
		}">
                                ${tl(trans.weekly)}
                            </a>
                        </li>
                        <li class="navlist-item secondary-nav-item secondary-nav-item--explore">
                            <a href="${root}charts/explore" class="secondary-nav-item-link ${
			page.type == 'explore_charts'
				? 'secondary-nav-item-link--active'
				: ''
		}">
                                ${tl(trans.explore)}
                                ${new_indicator()}
                            </a>
                        </li>
                        <li class="navlist-item secondary-nav-item secondary-nav-item--geo">
                            <a href="${root}charts/geo" class="secondary-nav-item-link ${
			page.type == 'geo_charts' ? 'secondary-nav-item-link--active' : ''
		}">
                                ${tl(trans.country)}
                                ${new_indicator()}
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        `;

		if (page.structure.toolbar) {
			page.structure.toolbar.remove();
			page.structure.toolbar = new_nav;
		}

		page.structure.row.insertBefore(new_nav, page.structure.content);
	} else {
		const daily_tab = page.structure.container.querySelector(
			'.secondary-nav-item--overview',
		);
		if (daily_tab) {
			daily_tab.classList.remove('secondary-nav-item--overview');
			daily_tab.classList.add('secondary-nav-item--daily');
		}
	}

	if (page.subpage == 'weekly') {
		const head = charts.querySelector(':scope > h3');
		if (!head) return;

		head.replaceWith(html.node`
            <div class="charts-header top-header">
                <div class="left">

                </div>
                <div class="middle">
                    <div class="sub-text">${tl(trans.weekly_charts)}</div>
                    <h2 class="chart-heading">${head.textContent.trim()}</h2>
                </div>
                <div class="right">

                </div>
                <div class="charts-header-bg" />
            </div>
        `);

		const items = page.structure.main.querySelectorAll('.weeklychart-item');
		items.forEach((item) => {
			const change = item.querySelector('.weeklychart-change');
			if (!change) return;

			change.classList.add('colourful');

			render(change, html.node`<span class="bleh-icon" />`);
		});
	}

	if (page.subpage != 'overview') return;

	charts.classList.add('legacy-charts');
	let chart_rows = charts.querySelectorAll(
		'.charts-col:not(.charts-col--mobile-ad)',
	);

	let new_panel = document.createElement('section');
	new_panel.classList.add('charts-panel');

	let out_now = page.structure.side.querySelector(
		'.more-link-fullwidth-right a',
	);
	if (out_now) out_now.classList.add('btn', 'out-now-btn', 'icon', 'icon-r');

	let settings_btn;

	new_panel.appendChild(html.node`
        <div class="charts-header top-header">
            <div class="left">

            </div>
            <div class="middle">
                <div class="sub-text">${tl(trans.charts_for)}</div>
                <h2 class="chart-heading">${
		DateTime.now().toLocaleString(DateTime.DATE_FULL)
	}</h2>
            </div>
            <div class="right">
                <div class="view-buttons blend blend-v2">
                    <button class="left-icon blend-v2-btn" data-type="settings" ref=${(
		el,
	) => settings_btn = el}>
                        ${tl(trans.settings)}
                    </button>
                </div>
            </div>
            <div class="charts-header-bg" />
        </div>
    `);

	tippy(settings_btn, {
		theme: 'context-menu',
		content: html.node`
            ${setting({ id: 'simulate_scroll', in_menu: true })}
        `,
		placement: 'bottom',
		interactive: true,
		interactiveBorder: 10,
		trigger: 'click',
	});

	chart_rows.forEach((row, index) => {
		let chart_row = html.node`
            <div class="charts-new-row" data-index=${index}>
                ${row.querySelector('h2')}
            </div>
        `;

		let list = html.node`
            <ol class="music-bookmarks-artists charts-list" />
        `;

		if (settings.simulate_scroll) {
			list.addEventListener('wheel', (e) => {
				e.preventDefault();

				if (e.deltaY > 0) {
					list.scrollBy({
						top: 0,
						left: +600,
						behavior: 'smooth',
					});
				} else {
					list.scrollBy({
						top: 0,
						left: -600,
						behavior: 'smooth',
					});
				}
			});
		}

		let items = row.querySelectorAll('.globalchart-item');
		items.forEach((item, item_index) => {
			let list_item;

			let image = item.querySelector('.globalchart-image img');
			let rank = item.querySelector('.globalchart-rank');
			let name = item.querySelector('.globalchart-name a');

			let link = name.getAttribute('href');

			image.setAttribute(
				'src',
				image.getAttribute('src').replace(
					'/avatar70s/',
					'/avatar300s/',
				),
			);

			let link_block;

			if (index == 1) {
				name.textContent = correct_artist(name.textContent);

				list_item = html.node`
                    <li class="music-bookmarks-artists-item-wrap charts-list-item">
                        <div class="music-bookmarks-artists-item charts-list-item-inner">
                            <div class="charts-list-rank">${rank.textContent.trim()}</div>
                            <h3 class="music-bookmarks-artists-item-name">
                                ${name}
                            </h3>
                            <div class="media-item">
                                <span class="music-bookmarks-albums-item-image cover-art">
                                    ${image}
                                </span>
                                <div class="charts-list-rank-overlay-wrap">
                                    <div class="charts-list-rank-overlay">
                                        <span class="rank-overlay-text">${rank.textContent}</span>
                                        <span class="rank-overlay-back">${rank.textContent}</span>
                                    </div>
                                </div>
                            </div>
                            <a class="link-block-cover-link" ref=${(el) =>
					link_block = el} href=${link}></a>
                        </div>
                    </li>
                `;
			} else {
				let artist = item.querySelector(
					'.globalchart-track-artist-name a',
				);
				artist.textContent = correct_artist(artist.textContent);
				name.textContent = correct_item_by_artist(
					name.textContent,
					artist.textContent,
				);

				list_item = html.node`
                    <li class="music-bookmarks-albums-item-wrap charts-list-item">
                        <div class="music-bookmarks-albums-item charts-list-item-inner">
                            <div class="charts-list-rank">${rank.textContent.trim()}</div>
                            <h3 class="music-bookmarks-albums-item-name">
                                ${name}
                            </h3>
                            <p class="music-bookmarks-albums-item-artist">
                                ${artist}
                            </p>
                            <div class="media-item">
                                <span class="music-bookmarks-albums-item-image cover-art">
                                    ${image}
                                </span>
                                <div class="charts-list-rank-overlay-wrap">
                                    <div class="charts-list-rank-overlay">
                                        <span class="rank-overlay-text">${rank.textContent}</span>
                                        <span class="rank-overlay-back">${rank.textContent}</span>
                                    </div>
                                </div>
                            </div>
                            <a class="link-block-cover-link" ref=${(el) =>
					link_block = el} href=${link}></a>
                        </div>
                    </li>
                `;
			}

			bind_link_block(link_block, list_item);

			list.appendChild(list_item);
		});

		chart_row.appendChild(list);

		new_panel.appendChild(chart_row);
	});

	page.structure.main.insertBefore(
		new_panel,
		page.structure.main.firstElementChild,
	);
}

function bleh_explore_charts() {
	page.structure.row.removeChild(page.structure.row.firstElementChild);
	page.structure.row.removeChild(page.structure.row.firstElementChild);

	const new_panel = html.node`
        <section class="explore-charts" />
    `;

	let content;

	new_panel.appendChild(html.node`
        <div class="charts-header top-header">
            <div class="left">

            </div>
            <div class="middle">
                <div class="sub-text">${tl(trans.charts_for)}</div>
                <h2 class="chart-heading">${{
		html: tl(trans.hot_100, { b: '<i>bleh</i>' }),
	}}${beta_indicator()}</h2>
            </div>
            <div class="right">

            </div>
            <div class="charts-header-bg" />
        </div>
        <div class="charts-content charts-row" ref=${(el) => content = el} />
    `);

	page.structure.main.appendChild(new_panel);

	const url =
		`http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${api_key}&format=json&limit=100`;

	render(
		content,
		html`
			<div class="loading-data-container">
				<div class="loading-data-text">${tl(
					trans.gathering_plays,
				)}</div>
			</div>
		`,
	);

	fetch(url)
		.then((response) => response.json())
		.then((data: chart_top_tracks | error) => {
			if ((data as error).error) {
				data = data as error;

				render(
					content,
					html`
						<div class="loading-data-container">
							<div class="alert alert-error">
						        ${data.message}
						    </div>
						</div>
					`,
				);
				return;
			}

			data = data as chart_top_tracks;

			render(
				content,
				html`
					<table class="weeklychart">
						<thead>
							<tr>
								<th />
								<th class="weeklychart-image-header" />
								<th>${tl(trans.listeners)}</th>
								<th>${tl(trans.scrobbles)}</th>
							</tr>
						</thead>
						<tbody>
					        ${data.tracks.track.map((track, index) =>
						chart_item(track, index)
					)}
					    </tbody>
					</table>
				`,
			);
		});

	function chart_item(track: chart_track, index: number) {
		return html.node`
            <tr class="weeklychart-item">
                <td class="weeklychart-rank weeklychart-rank-bigger">${
			index + 1
		}</td>
                <td class="weeklychart-track-info">
                    <div class="weeklychart-track-name">
                        <a href=${track.url}>${
			romanise(correct_item_by_artist(track.name, track.artist.name))
		}</a>
                    </div>
                    <div class="weeklychart-track-artist">
                        <a href=${track.artist.url}>${
			romanise(correct_artist(track.artist.name))
		}</a>
                    </div>
                </td>
                <td class="weeklychart-listeners">${
			Number(track.listeners).toLocaleString(lang)
		}</td>
                <td class="weeklychart-scrobblers">${
			Number(track.playcount).toLocaleString(lang)
		}</td>
            </tr>
        `;
	}
}

function bleh_geo_charts() {
	page.structure.row.removeChild(page.structure.row.firstElementChild);
	page.structure.row.removeChild(page.structure.row.firstElementChild);

	const new_panel = html.node`
        <section class="explore-charts" />
    `;

	const geos = [
		{
			value: 'Brazil',
			text: 'Brazil',
			flag: 'BR',
		},
		{
			value: 'United Kingdom',
			text: 'United Kingdom',
			flag: 'GB',
		},
		{
			value: 'Germany',
			text: 'Germany',
			flag: 'DE',
		},
		{
			value: 'France',
			text: 'France',
			flag: 'FR',
		},
		{
			value: 'Cape Verde',
			text: 'Cape Verde',
			flag: 'CV',
		},
		{
			value: 'Palestine',
			text: 'Palestine',
			flag: 'PS',
		},
	];

	let content;
	let selector;
	let bg;

	new_panel.appendChild(html.node`
        <div class="charts-header top-header colourful" ref=${(el) => bg = el}>
            <div class="left">

            </div>
            <div class="middle">
                <div class="sub-text">${tl(trans.charts_for)}</div>
                <h2 class="chart-heading chart-heading-geo">
                    ${selector = select({
		values: geos,
		func: render_geo,
		title_func: (val) =>
			html.node`
                            <span class="language-header-chart chart-heading">
                                ${flag(val.flag, 'geo-chart-flag')}
                                <p>${val.text}</p>
                            </span>
                        `,
		hide: true,
	})}
                </h2>
            </div>
            <div class="right">

            </div>
            <div class="charts-header-bg" />
        </div>
        <div class="charts-content" ref=${(el) => content = el} />
    `);

	function render_geo(val: string) {
		const flag_code = geos.find((g) => g.value == val).flag;

		header_colour(
			html.node`
            <img src="https://purecatamphetamine.github.io/country-flag-icons/3x2/${flag_code}.svg" />
        ` as HTMLImageElement,
			false,
			[bg],
		);

		render(
			content,
			html`
				${val}
			`,
		);
	}

	render_geo(selector.value);

	page.structure.main.appendChild(new_panel);
}
