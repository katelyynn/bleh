//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { page } from '@/build/page';
import {
	bleh_glacier_date_graph_generate,
	bleh_glacier_insights,
	bleh_glacier_library_open_index,
} from '@/pages/profile/glacier.js';
import { bleh_music_chart_render } from './summary.js';
import { bleh_profile_chart_render } from '../profile/summary.js';

export function chart_reflow() {
	if (!document.body) return;

	load_chart_colours();

	// trigger re-flow of chart
	if (
		(page.type == 'artist' || page.type == 'album' ||
			page.type == 'track') && page.subpage == 'overview'
	) {
		bleh_music_chart_render();
	}

	if (page.type == 'user' && page.subpage == 'overview') {
		bleh_profile_chart_render();
	}

	if (page.type == 'user' && page.subpage.startsWith('library')) {
		bleh_glacier_date_graph_generate();
		bleh_glacier_insights();
	}

	if (
		page.type == 'minis' && page.state.update_plot_chart &&
		page.mini == 'plot'
	) {
		page.state.update_plot_chart();
	}
}

export function prep_chart_colours() {
	if (page.state.chart_colours.link_col == 'oklch()') {
		load_chart_colours();
	}
}

export function load_chart_colours() {
	const link_col = `oklch(${
		getComputedStyle(document.body).getPropertyValue('--l3-c')
	})`;
	const link_h_col = getComputedStyle(document.body).getPropertyValue('--h3-s');
	const link_bg_col = `oklch(${
		getComputedStyle(document.body).getPropertyValue('--h4')
	} / 30%)`;
	const link_bg_col_2 = `oklch(${
		getComputedStyle(document.body).getPropertyValue('--h4')
	} / 2%)`;
	const text_col = `oklch(${
		getComputedStyle(document.body).getPropertyValue('--c3')
	})`;
	const axis_col = `${
		getComputedStyle(document.body).getPropertyValue('--separator-base')
	}`;
	const text_primary_col = `oklch(${
		getComputedStyle(document.body).getPropertyValue('--c2')
	})`;
	const text_secondary_col = `oklch(${
		getComputedStyle(document.body).getPropertyValue('--c3')
	})`;
	const bg_col = `oklch(${
		getComputedStyle(document.body).getPropertyValue('--b5')
	})`;
	const root_bg_col = `oklch(${
		getComputedStyle(document.body).getPropertyValue('--b6')
	} / 92%)`;
	const hue = getComputedStyle(document.body).getPropertyValue('--hue');
	page.state.chart_colours = {
		link_col: link_col,
		link_h_col: link_h_col,
		link_bg_col: link_bg_col,
		link_bg_col_2: link_bg_col_2,
		text_col: text_col,
		axis_col: axis_col,
		text_primary_col,
		text_secondary_col,
		bg_col: bg_col,
		root_bg_col: root_bg_col,
		hue: hue,
		font: getComputedStyle(document.body).getPropertyValue('--font'),
	};

	console.log('chart colours', page.state.chart_colours);

	page.state.chart_line_options = {
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				backgroundColor: root_bg_col,
				titleColor: text_primary_col,
				bodyColor: text_primary_col,
				multiKeyBackground: root_bg_col,
				boxPadding: 6,
				padding: 9,
				cornerRadius: 9,
				caretSize: 0,
			},
		},
		scales: {
			x: {
				type: 'time',
				time: {
					unit: 'month',
					displayFormats: {
						month: 'LLL',
					},
					tooltipFormat: 'EEEE, LLLL d yyyy',
				},
				grid: {
					color: axis_col,
					display: false,
				},
			},
			y: {
				display: false,
				grid: {
					display: false,
				},
				suggestedMax: 10,
			},
		},
	};

	page.state.chart_library_line_options = {
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				backgroundColor: root_bg_col,
				titleColor: text_primary_col,
				bodyColor: text_primary_col,
				multiKeyBackground: root_bg_col,
				boxPadding: 6,
				padding: 9,
				cornerRadius: 9,
				caretSize: 0,
			},
		},
		scales: {
			x: {
				grid: {
					color: axis_col,
					display: false,
				},
			},
			y: {
				display: true,
				grid: {
					display: false,
				},
				suggestedMax: 10,
			},
		},
		onClick: (e, active, chart) => {
			//console.info(active[0].index);
			bleh_glacier_library_open_index(active[0].index);
		},
	};
	page.state.chart_library_line_options_no_click = {
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				backgroundColor: root_bg_col,
				titleColor: text_primary_col,
				bodyColor: text_primary_col,
				multiKeyBackground: root_bg_col,
				boxPadding: 6,
				padding: 9,
				cornerRadius: 9,
				caretSize: 0,
			},
		},
		scales: {
			x: {
				grid: {
					color: axis_col,
					display: false,
				},
			},
			y: {
				grid: {
					display: false,
				},
				suggestedMax: 10,
			},
		},
	};
	page.state.chart_library_line_options_mini = {
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				backgroundColor: root_bg_col,
				titleColor: text_primary_col,
				bodyColor: text_primary_col,
				multiKeyBackground: root_bg_col,
				boxPadding: 6,
				padding: 9,
				cornerRadius: 9,
				caretSize: 0,
			},
		},
		scales: {
			x: {
				display: false,
				grid: {
					color: axis_col,
					display: false,
				},
			},
			y: {
				display: true,
				grid: {
					display: false,
				},
				suggestedMax: 10,
			},
		},
		onClick: (e, active, chart) => {
			//console.info(active[0].index);
			bleh_glacier_library_open_index(active[0].index);
		},
	};

	page.state.chart_library_pie_options = {
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				backgroundColor: root_bg_col,
				titleColor: text_primary_col,
				bodyColor: text_primary_col,
				multiKeyBackground: root_bg_col,
				boxPadding: 6,
				padding: 9,
				cornerRadius: 9,
				caretSize: 0,
			},
		},
		onClick: (e, active, chart) => {
			//console.info(active[0].index);
			bleh_glacier_library_open_index(active[0].index);
		},
	};
	page.state.chart_library_pie_options_no_click = {
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				backgroundColor: root_bg_col,
				titleColor: text_primary_col,
				bodyColor: text_primary_col,
				padding: 7,
				cornerRadius: 10,
				caretSize: 0,
			},
		},
	};

	page.state.chart_library_bar_options = {
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				backgroundColor: root_bg_col,
				titleColor: text_primary_col,
				bodyColor: text_primary_col,
				multiKeyBackground: root_bg_col,
				boxPadding: 6,
				padding: 9,
				cornerRadius: 9,
				caretSize: 0,
			},
		},
		onClick: (e, active, chart) => {
			//console.info(active[0].index);
			bleh_glacier_library_open_index(active[0].index);
		},
	};
	page.state.chart_library_bar_v_options = {
		indexAxis: 'y',
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				backgroundColor: root_bg_col,
				titleColor: text_primary_col,
				bodyColor: text_primary_col,
				multiKeyBackground: root_bg_col,
				boxPadding: 6,
				padding: 9,
				cornerRadius: 9,
				caretSize: 0,
			},
		},
		onClick: (e, active, chart) => {
			//console.info(active[0].index);
			bleh_glacier_library_open_index(active[0].index);
		},
	};
	page.state.chart_library_bar_options_no_click = {
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				backgroundColor: root_bg_col,
				titleColor: text_primary_col,
				bodyColor: text_primary_col,
				multiKeyBackground: root_bg_col,
				boxPadding: 6,
				padding: 9,
				cornerRadius: 9,
				caretSize: 0,
			},
		},
	};
}
