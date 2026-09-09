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
import { hover_tooltip } from '@/components/shared/tooltips.tsx';
import { HeatmapTooltip } from '@/components/date/heatmap.tsx';
import {
	ProfileSummary,
	ProfileSummaryMain,
	ProfileSummarySeparator,
	ProfileSummaryTitle,
} from '@/components/summary/summary.tsx';
import { PanelTop } from '@/components/text/see_more.tsx';
import { createRef } from 'jsx-dom';
import {
	ProfileSummaryBlock,
	ProfileSummaryBlocks,
} from '@/components/summary/block.tsx';
import {
	GraphBlock,
	GraphBlockElement,
	GraphBlocks,
} from '@/components/summary/graph.tsx';
import { LoadingData } from '@/components/loading/loading.tsx';

export function profile_summary(
	recent_tracks: Element | undefined,
	top_artists: Element | undefined,
) {
	const graph_blocks: GraphBlockElement[] = [];

	const date = new Date();
	const year = date.getFullYear();
	const month = date.getMonth() + 1;

	const title = createRef();
	const graph_container = createRef();

	const panel = (
		<ProfileSummary>
			<PanelTop>
				<ProfileSummaryTitle ref={title}>
					{tl(trans.value_scrobbles_recently, { v: 0 })}
				</ProfileSummaryTitle>
				<ProfileSummaryBlocks>
					<ProfileSummaryBlock
						type='scrobbles'
						value={page.state.scrobbles}
						tooltip={page.state.average}
					/>
					<ProfileSummaryBlock
						type='artists'
						value={page.state.artists}
					/>
					<ProfileSummaryBlock
						type='loved'
						value={page.state.loved}
					/>
				</ProfileSummaryBlocks>
			</PanelTop>
			<ProfileSummaryMain>
				<GraphBlocks>
					{Array.from({ length: 30 }).map((_, i) => {
						const elem = (
							<GraphBlock index={i + 1} />
						) as GraphBlockElement;

						graph_blocks.push(elem);

						return elem;
					})}
				</GraphBlocks>
				<ProfileSummarySeparator />
				<div class='month-graph' ref={graph_container}>
					{page.state.scrobbles > 0
						? (
							<div
								class={[
									'scrobble-canvas-container',
									'mini',
									'icon-mask',
								]}
							>
								<LoadingData>
									{tl(trans.loading_count_days, { c: 90 })}
								</LoadingData>
							</div>
						)
						: auth.name && (
							<div
								class={[
									'scrobble-canvas-container',
									'mini',
									'icon-mask',
								]}
							>
								<LoadingData type='failed'>
									{tl(
										trans
											.profile_does_not_have_enough_scrobbles,
									)}
								</LoadingData>
							</div>
						)}
				</div>
			</ProfileSummaryMain>
		</ProfileSummary>
	);

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

						hover_tooltip(
							elem,
							<HeatmapTooltip
								date={date.toLocaleString(
									DateTime.DATE_MED_WITH_WEEKDAY,
								)}
								value={value.toLocaleString(lang)}
							/>,
						);
					});

					let sum = 0;
					const max = Math.max(...values);
					const avg = values.reduce((sum, val) => sum + val, 0) /
						values.length;

					values.forEach((value, i) => {
						const elem = graph_blocks[i];
						if (!elem) return;

						if (value > 0) {
							const level = graph_block_level(value, max, avg);
							elem.level = level;

							sum += value;
						}
					});

					title.current.replaceChildren(
						tl(trans.value_scrobbles_recently, {
							v: sum.toLocaleString(lang),
						}),
					);
				} catch (e) {
					throw new Error(e);
				}
			});
	}

	if (page.state.scrobbles > 0 && auth.name) {
		bleh_profile_chart(graph_container.current);
	}
}

function graph_block_level(value: number, max: number, avg: number) {
	if (max == 0) return 0;

	const normalized = value / (avg * 2);
	return Math.min(9, Math.floor(normalized * 10));
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

	const this_month_elem = panel.querySelector('.this-month');
	if (this_month_elem) {
		this_month_elem.replaceChildren(
			<>
				{tl(trans.value_this_month, {
					v: this_month.toLocaleString(lang),
				})}
				{!Number.isNaN(diff) && (
					<span class='diff'>
						({tl(diff > 0 ? trans.value_more : trans.value_less, {
							v: diff > 0
								? diff.toLocaleString(lang)
								: Math.abs(diff).toLocaleString(lang),
						})})
					</span>
				)}
			</>,
		);
	}

	prep_chart_colours();

	const scrobble_canvas_container = panel.querySelector(
		'.scrobble-canvas-container',
	)!;
	scrobble_canvas_container.innerHTML = '';

	const scrobble_canvas = document.createElement('canvas');
	scrobble_canvas.classList.add('scrobble-canvas', 'monthly-canvas');

	let gradient = scrobble_canvas.getContext('2d')!.createLinearGradient(
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

	scrobble_canvas_container.appendChild(
		<div class='monthly-chart-line'>
			{scrobble_canvas}
		</div>,
	);

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

	scrobble_canvas_container.appendChild(
		<div class='monthly-chart-pie'>
			{scrobble_canvas_2}
		</div>,
	);
}
