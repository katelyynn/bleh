import { DateTime } from 'luxon';
import { page, root } from '@/build/page.ts';
import { prep_chart_colours } from '@/components/music/chart.ts';
import { Chart } from '@/main.ts';
import { useSettings } from '@/page.ts';

export async function collect_last_60(container: Element) {
	const current = DateTime.now().startOf('day');

	const part_1 = current.minus({ days: 30 });
	const part_2 = current.minus({ days: 60 });

	const values: number[] = [];
	const dates: string[] = [];

	await collect_day_range(part_2, values, dates);
	await collect_day_range(part_1, values, dates);

	render_graph(container, values, dates);
	useSettings.on('theme', () => {
		if (!container || !container.isConnected) return;

		render_graph(container, values, dates);
	});
}

function render_graph(container: Element, values: number[], dates: string[]) {
	prep_chart_colours();

	const scrobble_canvas_container = container.querySelector(
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

	const scrobble_chart = new Chart(scrobble_canvas.getContext('2d'), {
		type: 'line',
		data: {
			labels: dates,
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
}

async function collect_day_range(
	start: DateTime,
	values: number[],
	dates: string[],
) {
	const end = start.plus({ days: 30 });

	const res = await fetch(
		`${root}user/${page.name}/library/artists/chart?from=${start.toISODate()}&to=${end.toISODate()}&page=1&ajax=1`,
	);

	if (!res.ok) throw new Error();

	const dom = await res.text();

	const doc = new DOMParser().parseFromString(dom, 'text/html');

	const table = doc.querySelector('table');
	if (!table) throw new Error();

	const entries = table.querySelectorAll('tbody tr');

	entries.forEach((entry) => {
		const period = entry.querySelector('.js-period a');
		const value = Number(
			entry.querySelector('.js-scrobbles')?.textContent.trim(),
		);

		const link = `${root}user/${page.name}/library${
			period?.getAttribute('href')
		}`;

		const url = new URL(`https://www.last.fm${link}`);
		const date = DateTime.fromISO(
			url.searchParams.get('from') || '',
		);

		values.push(value);
		dates.push(date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY));
	});

	return {
		values,
		dates,
	};
}
