import { auth, page, root } from '@/build/page';
import { lang, tl, trans } from '@/build/trans';
import { html, render } from 'lighterhtml';
import { icon, icons } from '../shared/icon';
import tippy from 'tippy.js';
import { prep_chart_colours } from '../music/chart';
import { Chart } from 'chart.js';
import { log } from '@/build/log';
import { DateTime } from 'luxon';
import { sanitise } from '@/build/tools';
import { CountUp } from 'countup.js';
import { Odometer } from 'odometer_countup';

export interface music_stat {
	text?: string;
	value?: number | string;
	abbr?: string;
	link?: string;
}

export function music_summary(
	listeners: music_stat,
	scrobbles: music_stat,
	metascore: music_stat,
) {
	let graph_blocks: HTMLElement[] = [];
	page.state.graph_blocks = graph_blocks;

	let title;

	const on_tour = !!page.state.on_tour;

	const panel = html.node`
        <section class="profile-summary music-summary">
            <div class="top-container">
                <h2 class="summary-title">
                    ${tl(trans.about)}
                    ${
		on_tour
			? html.node`
                    <a class="on-tour colourful" href="${root}music/${
				sanitise(page.name)
			}/+events">${tl(trans.on_tour)}</a>
                    `
			: ''
	}
                </h2>
                <div class="summary-blocks">
                    ${summary_block('listeners', listeners)}
                    ${summary_block('scrobbles', scrobbles)}
                </div>
            </div>
            <div class="summary-main">
                <div class="summary-content" />
                <div class="summary-sep" />
                <div class="summary-aside">
                    <div class="graph-container">
                        <div class="graph-blocks">
                            ${
		Array.from({ length: 3 * 10 }).map((_, i) => {
			const elem = create_graph_block(i + 1);

			graph_blocks.push(elem);

			return elem;
		})
	}
                        </div>
                        <p class="subtle-like" ref=${(el) => title = el}>${
		tl(trans.value_scrobbles_recently, { v: 0 })
	}</p>
                    </div>
                </div>
            </div>
        </section>
    `;

	page.state.graph_title = title;

	page.structure.main!.insertBefore(panel, page.structure.main!.firstChild);

	bleh_music_chart();
}

function create_graph_block(index: number) {
	return html.node`
        <div class="graph-block empty" style="--delay: ${index * 0.04 + 's'}" />
    `;
}

function graph_block_level(value: number, max: number, avg: number) {
	if (max == 0) return 0;

	const normalized = value / (avg * 2);
	return Math.min(9, Math.floor(normalized * 10));
}

function summary_block(type: string, stat: music_stat) {
	let text;
	let icon_name;

	if (type == 'scrobbles') {
		text = tl(trans.scrobbles);
		icon_name = icons.track;
	} else if (type == 'listeners') {
		text = tl(trans.listeners);
		icon_name = icons.listeners;
	}

	let value;

	const elem = html.node`
        <div class="summary-block">
            <div class="summary-icon">
                ${icon({ name: icon_name, identifier: 'summary' })}
            </div>
            <div class="summary-info">
                <h3 class="summary-label">${text}</h3>
                <p class="summary-value" ref=${(el) => value = el}>${
		stat.abbr || stat.value?.toLocaleString(lang)
	}</p>
            </div>
        </div>
    `;

	if (stat.abbr && stat.value) {
		tippy(elem, {
			content: stat.value.toLocaleString(lang),
		});
	}

	/*(if (typeof stat.value == 'number') {
        const count = new CountUp(value!, stat.value);

        setTimeout(() => {
            count.start();

            setTimeout(() => {
                elem.classList.remove('summary-block-hidden');
            }, 10);
        }, 0);
    }*/

	return elem;
}

function bleh_music_chart() {
	let trend = page.structure.container!.querySelector('.listener-trend');

	if (!trend) return;

	let table = trend.querySelector('tbody');

	let days = table.querySelectorAll('tr');
	if (days.length == 0) return;

	let labels: DateTime[] = [];
	let values: number[] = [];

	let has_seen_more_than_0 = false;
	days.forEach((day, index) => {
		if (!day) return;

		//let label = day.querySelector('time').textContent.trim();
		let label = DateTime.fromISO(
			day.querySelector('time').getAttribute('datetime'),
		);
		let value = day.querySelector('.js-value');

		console.log('day', index, label, day, day.innerHTML);

		if (!value.getAttribute('data-value')) value = 0;
		else value = Number(value.getAttribute('data-value'));

		if (value == 0 && index < 120 && !has_seen_more_than_0) return;
		has_seen_more_than_0 = true;

		labels.push(label);
		values.push(value);
	});

	page.state.labels = labels;
	page.state.values = values;

	setTimeout(() => {
		fill_graph_blocks(labels.slice(-30), values.slice(-30));
	}, 100);

	bleh_music_chart_render();
}

export function bleh_music_chart_render() {
	const labels = page.state.labels;
	const values = page.state.values;

	let aside = page.structure.side!.querySelector('.listen-panel');

	if (!aside) {
		aside = html.node`
            <section class="listen-panel" />
        `;
		page.structure.side!.appendChild(aside);
	}

	prep_chart_colours();

	let scrobble_canvas_container = document.createElement('div');
	scrobble_canvas_container.classList.add(
		'scrobble-canvas-container',
		'icon-mask',
	);

	let scrobble_canvas = document.createElement('canvas');
	scrobble_canvas.classList.add('scrobble-canvas');

	let gradient = scrobble_canvas
		.getContext('2d')
		.createLinearGradient(0, 0, 0, 160);
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
		options: page.state.chart_line_options,
	});

	scrobble_canvas_container.appendChild(scrobble_canvas);

	render(
		aside,
		html`
			${scrobble_canvas_container}
		`,
	);
}

function fill_graph_blocks(labels: DateTime[], values: number[]) {
	const graph_blocks = page.state.graph_blocks;
	const title = page.state.graph_title;

	let sum = 0;
	let max = Math.max(...values);
	let avg = values.reduce((sum, val) => sum + val, 0) / values.length;

	values.forEach((value, i) => {
		const label = labels[i];

		const elem = graph_blocks[i];
		if (!elem) return;

		if (value > 0) {
			elem.classList.remove('empty');

			const level = graph_block_level(value, max, avg);

			elem.classList.add(`level-${level}`);
			//elem.textContent = level;

			sum += value;
		}

		tippy(elem, {
			content: `${
				label.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
			}: ${value.toLocaleString(lang)}`,
		});
	});

	title.textContent = tl(trans.value_scrobbles_recently, {
		v: sum.toLocaleString(lang),
	});
}
