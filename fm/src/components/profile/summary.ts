/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { auth, page, root } from '@/build/page';
import { lang, tl, trans } from '@/build/trans';
import { html, render } from 'lighterhtml';
import { icon, icons } from '../shared/icon';
import tippy from 'tippy.js';
import { prep_chart_colours } from '../music/chart';
import { Chart } from 'chart.js';
import { log } from '@/build/log';
import { DateTime } from 'luxon';
import { CountUp } from 'countup.js';

export function profile_summary(
	recent_tracks: Element | undefined,
	top_artists: Element | undefined,
) {
	let graph_blocks: HTMLElement[] = [];

	const date = new Date();
	const year = date.getFullYear();
	const month = date.getMonth() + 1;

	let title;
	let graph_container;

	const panel = html.node`
        <section class="profile-summary">
            <div class="top-container">
                <h2 class="summary-title" ref=${(el) => title = el}>${
		tl(trans.value_scrobbles_recently, { v: 0 })
	}</h2>
                <div class="summary-blocks">
                    ${summary_block('scrobbles', page.state.scrobbles)}
                    ${summary_block('artists', page.state.artists)}
                    ${summary_block('loved', page.state.loved)}
                </div>
            </div>
            <div class="summary-main">
                <div class="graph-blocks">
                    ${
		Array.from({ length: 30 }).map((_, i) => {
			const elem = create_graph_block(i + 1);

			graph_blocks.push(elem);

			return elem;
		})
	}
                </div>
                <div class="summary-sep" />
                <div class="month-graph" ref=${(el) => graph_container = el}>
                    ${
		page.state.scrobbles > 0
			? html.node`
                    <div class="scrobble-canvas-container mini icon-mask">
                        <div class="loading-data-container">
                            <div class="loading-data-text">${
				tl(trans.loading_count_days).replace('{c}', '90')
			}</div>
                        </div>
                    </div>
                    <div class="bottom-card-links" style="display: none">
                        <a class="this-month see-more left-icon" href="${root}user/${page.name}/library?from=${year}-${month}-01&rangetype=1month">
                            ${tl(trans.value_this_month, { v: 0 })}
                        </a>
                        <a class="see-more" href="${root}user/${page.name}/library/artists?date_preset=LAST_90_DAYS&page=1">
                            ${tl(trans.explore_in_library)}
                        </a>
                    </div>
                    `
			: auth.name
			? html.node`
                    <div class="scrobble-canvas-container mini icon-mask">
                        <div class="loading-data-container">
                            <div class="loading-data-text failed">${
				tl(trans.profile_does_not_have_enough_scrobbles)
			}</div>
                        </div>
                    </div>
                    `
			: html.node``
	}
                </div>
            </div>
        </section>
    `;

	page.structure.main!.insertBefore(panel, page.structure.main!.firstChild);

	/*

    if (top_artists) {
        page.structure.main!.insertBefore(panel, top_artists);
    } else if (recent_tracks) {
        recent_tracks.after(panel);
    } else {
        page.structure.main!.insertBefore(panel, page.structure.main!.firstChild);
    }

    */

	fetch_30_day();

	function fetch_30_day() {
		fetch(
			`${root}user/${page.name}/library/artists/chart?date_preset=LAST_30_DAYS&page=1&ajax=1`,
		)
			.then((res) => {
				if (!res.ok) throw new Error();

				return res.text();
			})
			.then((dom) => {
				try {
					const doc = new DOMParser().parseFromString(
						dom,
						'text/html',
					);

					const table = doc.querySelector('table');
					if (!table) throw new Error();

					const values: number[] = [];

					const entries = table.querySelectorAll('tbody tr');
					entries.forEach((entry, i) => {
						const period = entry.querySelector('.js-period a');
						const value = Number(
							entry.querySelector('.js-scrobbles')?.textContent
								.trim(),
						);

						const elem = graph_blocks[i - 1];
						if (!elem) return;

						const link = `${root}user/${page.name}/library${
							period?.getAttribute('href')
						}`;
						elem.href = link;

						const url = new URL(`https://www.last.fm${link}`);
						const date = DateTime.fromISO(
							url.searchParams.get('from') || '',
						);

						values.push(value);

						tippy(elem, {
							content: `${
								date.toLocaleString(
									DateTime.DATE_MED_WITH_WEEKDAY,
								)
							}: ${value.toLocaleString(lang)}`,
						});
					});

					let sum = 0;
					const max = Math.max(...values);
					const avg = values.reduce((sum, val) => sum + val, 0) /
						values.length;

					values.forEach((value, i) => {
						const elem = graph_blocks[i];
						if (!elem) return;

						if (value > 0) {
							elem.classList.remove('empty');

							const level = graph_block_level(value, max, avg);

							elem.classList.add(`level-${level}`);

							sum += value;
						}
					});

					title.textContent = tl(trans.value_scrobbles_recently, {
						v: sum.toLocaleString(lang),
					});
				} catch (e) {
					throw new Error(e);
				}
			});
	}

	if (page.state.scrobbles > 0 && auth.name) {
		bleh_profile_chart(graph_container);
	}
}

function create_graph_block(index: number) {
	return html.node`
        <a class="graph-block empty" style="--delay: ${index * 0.04 + 's'}" />
    `;
}

function graph_block_level(value: number, max: number, avg: number) {
	if (max == 0) return 0;

	const normalized = value / (avg * 2);
	return Math.min(9, Math.floor(normalized * 10));
}

function summary_block(type: string, value: number) {
	let text;
	let icon_name;

	if (type == 'scrobbles') {
		text = tl(trans.scrobbles);
		icon_name = icons.track;
	} else if (type == 'artists') {
		text = tl(trans.artists);
		icon_name = icons.artist;
	} else if (type == 'loved') {
		text = tl(trans.loved);
		icon_name = icons.loved;
	}

	let value_elem;

	const elem = html.node`
        <div class="summary-block summary-block-hidden">
            <div class="summary-icon">
                ${icon({ name: icon_name, identifier: 'summary' })}
            </div>
            <div class="summary-info">
                <h3 class="summary-label">${text}</h3>
                <p class="summary-value" ref=${(el) => value_elem = el}>${
		value.toLocaleString(lang)
	}</p>
            </div>
        </div>
    `;

	if (type == 'scrobbles') {
		tippy(elem, {
			content: page.state.average,
		});
	}

	const count = new CountUp(value_elem!, value);

	setTimeout(() => {
		count.start();

		setTimeout(() => {
			elem.classList.remove('summary-block-hidden');
		}, 10);
	}, 0);

	return elem;
}

function bleh_profile_chart(panel: HTMLElement) {
	let table = panel.querySelector('table');

	if (table) {
		bleh_profile_chart_render(panel, table);
		return;
	}

	fetch(
		`${root}user/${page.name}/library/artists/chart?date_preset=LAST_90_DAYS&page=1&ajax=1`,
	)
		.then(function (response) {
			console.log(
				'glacier library returned',
				response,
				response.text,
				response.status,
			);

			if (response.status != 200) throw new Error();

			return response.text();
		})
		.then(function (html) {
			const doc = new DOMParser().parseFromString(
				html,
				'text/html',
			);
			console.log(
				'glacier library DOC',
				doc,
				doc.querySelector('.table'),
			);

			log('received response', 'glacier library');

			table = doc.querySelector('.table');

			if (table) {
				panel.appendChild(table);
				bleh_profile_chart_render(panel);
			} else {
				log('table is null?', 'glacier library', 'error');
				console.info('glacier library', doc.body.innerHTML);
				console.info(
					'glacier library',
					new DOMParser().parseFromString(
						doc.body.innerHTML,
						'text/html',
					),
				);
			}
		});
}

export function bleh_profile_chart_render(
	panel = page.structure.main!.querySelector('.month-graph'),
) {
	if (!panel) return;

	const table = panel.querySelector('table');
	if (!table) return;

	const entries = table.querySelectorAll('tbody tr');

	if (entries.length == 0) return;

	let labels = [];
	const links = [];
	let values = [];

	page.state.glacier.links = [];
	entries.forEach((entry) => {
		const period = entry.querySelector('.js-period a');
		const value = entry.querySelector('.js-scrobbles').textContent.trim();

		labels.push(period.textContent.trim());
		links.push(period.getAttribute('href'));
		values.push(value);

		page.state.glacier.links.push(
			`${root}user/${page.name}/library` + period.getAttribute('href'),
		);
	});

	const last_month = parseInt(values[values.length - 2]);
	const this_month = parseInt(values[values.length - 1]);
	const diff = this_month - last_month;

	render(
		panel.querySelector('.this-month'),
		html`
			${tl(trans.value_this_month, {
				v: this_month.toLocaleString(lang),
			})}
			${!Number.isNaN(diff)
				? html.node`<span class="diff">(${
					tl(trans[diff > 0 ? 'value_more' : 'value_less'], {
						v: diff > 0
							? diff.toLocaleString(lang)
							: Math.abs(diff).toLocaleString(lang),
					})
				})</span>`
				: ''}
		`,
	);

	prep_chart_colours();

	const scrobble_canvas_container = panel.querySelector(
		'.scrobble-canvas-container',
	);
	scrobble_canvas_container.innerHTML = '';

	const scrobble_canvas = document.createElement('canvas');
	scrobble_canvas.classList.add('scrobble-canvas', 'monthly-canvas');

	let gradient = scrobble_canvas.getContext('2d').createLinearGradient(
		0,
		0,
		0,
		160,
	);
	try {
		gradient.addColorStop(0, page.state.chart_colours.link_bg_col);
		gradient.addColorStop(1, page.state.chart_colours.link_bg_col_2);
	} catch (e) {
		gradient = page.state.chart_colours.link_bg_col;
	}

	Chart.defaults.color = page.state.chart_colours.text_col;
	Chart.defaults.font.family = page.state.chart_colours.font;
	let scrobble_chart = new Chart(scrobble_canvas.getContext('2d'), {
		type: 'line',
		data: {
			labels: labels,
			datasets: [
				{
					data: values,
					borderWidth: 2,
					backgroundColor: gradient,
					borderColor: page.state.chart_colours.link_col,
					fill: true,
					pointRadius: 0,
					pointHitRadius: 20,
					tension: 0.1,
				},
			],
		},
		options: page.state.chart_library_line_options_mini,
	});

	scrobble_canvas_container.appendChild(html.node`
        <div class="monthly-chart-line">
            ${scrobble_canvas}
        </div>
    `);

	//

	const scrobble_canvas_2 = document.createElement('canvas');
	scrobble_canvas_2.classList.add('scrobble-canvas', 'monthly-canvas-pie');

	let scrobble_chart_2 = new Chart(scrobble_canvas_2.getContext('2d'), {
		type: 'pie',
		data: {
			labels: labels,
			datasets: [
				{
					data: values,
					borderWidth: 2,
					backgroundColor: [
						page.state.chart_colours.link_bg_col,
						page.state.chart_colours.link_bg_col,
						page.state.chart_colours.link_bg_col,
						page.state.chart_colours.link_col,
					],
					borderColor: page.state.chart_colours.bg_col,
					pointRadius: 0,
					pointHitRadius: 20,
					tension: 0.1,
				},
			],
		},
		options: page.state.chart_library_pie_options,
	});

	scrobble_canvas_container.appendChild(html.node`
        <div class="monthly-chart-pie">
            ${scrobble_canvas_2}
        </div>
    `);
}
