/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { html, render } from 'lighterhtml';
import { settings } from '@/build/config';
import { log } from '@/build/log';
import { auth, page, root } from '@/build/page';
import {
	desanitise,
	sanitise,
	sanitise_text,
	year_from_date,
} from '@/build/tools';
import { tl, trans } from '@/build/trans';
import { prep_chart_colours } from '@/components/music/chart';
import {
	correct_artist,
	correct_item_by_artist,
} from '@/components/music/lotus';
import { ff } from '@/components/settings/sku';
import { input } from '@/components/settings/input';
import { setting } from '@/components/settings/settings';
import { redirect } from '@/components/music/music';
import tippy from 'tippy.js';
import { Chart } from '@/main';
import { load_profile_cache_externally } from '@/pages/profile/profile';

export function bleh_user_library() {
	// date sidebar into its own panel
	const date_items = page.structure.side.querySelectorAll(
		':scope > :is(div, figure)',
	);

	//let date_button_panel = document.createElement('section');
	//date_button_panel.classList.add('date-button-panel');

	const date_panel = html.node`
        <section class="date-panel" data-glacier-graphs=${settings.glacier_library_graphs} />
    `;

	date_items.forEach((item, index) => {
		date_panel.appendChild(item);

		if (item.classList.contains('row')) item.classList = 'date-selector';

		if (index == 0) page.structure.glacier.selector = item;
	});

	if (date_items.length > 0) {
		if (!page.mobile) page.structure.side.appendChild(date_panel);
		else {
			page.structure.main.insertBefore(
				date_panel,
				page.structure.main.firstChild,
			);
		}
	}

	page.structure.glacier.date_panel = date_panel;

	// tabs
	const search = page.structure.content_top.querySelector('.library-search');
	const nav = page.structure.content_top.querySelector(
		'.library-controls nav',
	);
	const tabs = nav.querySelector('.navlist-items');
	if (page.name == auth.name) {
		const velocity_tab = document.createElement('li');
		velocity_tab.classList.add(
			'navlist-item',
			'secondary-nav-item',
			'secondary-nav-item--velocity',
		);
		velocity_tab.innerHTML = `
            <a class="secondary-nav-item-link" href="${root}labs/artist-velocity" target="_blank">
                ${tl(trans.velocity)}
            </a>
        `;
		tabs.appendChild(velocity_tab);
	} else {
		tabs.appendChild(html.node`
            <li class="navlist-item secondary-nav-item secondary-nav-item--compare">
                <a class="secondary-nav-item-link" href="${root}bleh/minis/compare?profile=${page.name}">
                    ${tl(trans.compare)}
                </a>
            </li>
        `);
	}

	const scrobbles = tabs.querySelector('.secondary-nav-item--overview');
	scrobbles.classList.remove('secondary-nav-item--overview');
	scrobbles.classList.add('secondary-nav-item--scrobbles');

	if (ff('mualani')) {
		const toolbar = html.node`
            <div class="toolbar">
                ${search}
                ${nav}
            </div>
        `;

		nav.classList.add('redesigned-navigation');

		page.structure.content_top.style.display = 'none';

		page.structure.row.insertBefore(
			toolbar,
			page.structure.row.firstElementChild,
		);
	}

	if (!ff('glacier_library')) return;

	if (settings.glacier_library_graphs && date_items.length > 0) {
		page.structure.glacier.selector.after(html.node`
            <div class="view-buttons chart-view-selector view-buttons-middle">
                ${
			setting({
				id: 'chart_view',
				standalone: true,
				func: bleh_glacier_date_graph_generate,
			})
		}
            </div>
            <div class="view-buttons chart-axis-selector view-buttons-middle">
                ${
			setting({
				id: 'chart_bar_axis',
				standalone: true,
				func: bleh_glacier_date_graph_generate,
			})
		}
            </div>
        `);
	}

	//let picker_content = date_button_panel.querySelector('.date-range-picker-content');
	if (date_items.length > 0) bleh_glacier_library_date();

	if (
		page.subpage == 'library_overview' ||
		page.subpage.endsWith('-search')
	) {
		// scrobbles tab
		bleh_glacier_library_top(true);

		const pagination = page.structure.main.querySelector(
			':scope > .pagination',
		);
		page.structure.main.appendChild(html.node`
            <section class="pagination-panel">
                ${pagination}
            </section>
        `);

		page.state.glacier.insights = {
			artist: {
				display: false,
				values: [],
				labels: [],
				highest: {
					value: 0,
					label: '',
					link: '',
					img: '',
				},
			},
			album: {
				display: false,
				values: [],
				labels: [],
				highest: {
					value: 0,
					label: '',
					link: '',
					img: '',
				},
			},
			track: {
				display: false,
				values: [],
				labels: [],
				highest: {
					value: 0,
					label: '',
					link: '',
					img: '',
				},
			},
		};
	}

	if (
		date_items.length > 0 &&
		(page.subpage == 'library_overview' ||
			page.subpage.startsWith('library_artist_') ||
			page.subpage.startsWith('library_album_') ||
			page.subpage.startsWith('library_track_'))
	) {
		// new graph
		log('refresh is now marked true', 'glacier library');
		page.structure.glacier.refresh = true;
		bleh_glacier_date_graph(true);
	}

	if (
		page.subpage.startsWith('library_artist_') ||
		page.subpage.startsWith('library_album_') ||
		page.subpage.startsWith('library_track_')
	) {
		bleh_glacier_library_focused();
	}
}

function bleh_glacier_library_date() {
	const button = page.structure.glacier.date_panel.querySelector(
		'.date-range-picker-button.disclose-trigger:not([data-glacier-library-date])',
	);
	if (!button) return;

	button.setAttribute('data-glacier-library-date', 'true');
	console.info('button', button);

	const date_picker = page.structure.glacier.date_panel.querySelector(
		'.library-controls-datepicker',
	);
	const old_date_btn = date_picker.querySelector(
		'.date-range-picker-button:not(.disclose-trigger)',
	);
	if (old_date_btn) old_date_btn.remove();

	const date_btn = html.node`
        <button class="btn date-range-picker-button">${
		button.querySelector('.date-range-picker-button-inner').textContent
	}</button>
    `;
	date_picker.appendChild(date_btn);

	const picker_content = page.structure.glacier.date_panel.querySelector(
		'.date-range-picker-content:not([data-glacier-library-date])',
	);
	if (!picker_content) return;

	picker_content.setAttribute('data-glacier-library-date', 'true');

	const params = new URLSearchParams(document.location.search);
	page.requested.from = params.get('from');
	page.requested.to = params.get('to');
	page.requested.rangetype = params.get('rangetype');

	const picker_presets = picker_content.querySelectorAll(
		'.date-range-picker-presets-wrap > .date-range-picker-presets',
	);

	const items = picker_content.querySelectorAll('.date-range-picker-preset');
	items.forEach((item) => {
		const link = item.firstElementChild;

		link.classList.add('btn', 'date-picker-preset-item');
	});

	load_profile_cache_externally(page.name).then((cache) => {
		if (!cache.created) return;

		const year = parseInt(year_from_date(cache.created));
		const current_year = new Date().getFullYear();

		const years = Array.from(
			{ length: current_year - year + 1 },
			(_, i) => year + i,
		);

		years.forEach((year, index) => {
			const selected = page.requested.from == `${year}-01-01` &&
				(page.requested.to == `${year}-12-31` ||
					page.requested.rangetype == 'year');
			const target = index % 2;

			picker_presets[target].appendChild(html.node`
                <li class="date-range-picker-preset ${
				selected ? 'date-range-picker-preset--selected' : ''
			}">
                    <a class="btn date-picker-preset-item" href="${
				window.location.href.replace(window.location.search, '')
			}?from=${year}-01-01&rangetype=year" data-analytics-action="DateSelector" onclick=${() => {
				modal.hide();
			}}>
                        ${year}
                    </a>
                </li>
            `);
		});
	});

	picker_content.classList = 'date-range-picker-content-inner';
	const modal = tippy(date_btn, {
		theme: 'window',
		content: picker_content,
		placement: 'bottom',
		interactive: true,
		interactiveBorder: 10,
		trigger: 'click',
		appendTo: document.body,
		hideOnClick: 'toggle',

		onClickOutside(instance, event) {
			if (
				instance.popper.querySelector('[aria-expanded="true"]') ||
				event.target.classList.contains('dropdown-menu-clickable-item')
			) {
				return;
			}

			instance.hide();
		},
	});

	picker_content.querySelectorAll('a, button').forEach((elem) => {
		elem.addEventListener('click', () => {
			console.info('modal hide due to inner click', elem);
			modal.hide();
		});
	});

	const form = picker_content.querySelector(
		':scope > .date-range-picker-form',
	);

	const from_group = form.querySelector('.form-group--from');
	const from_input = from_group.querySelector('input');

	const to_group = form.querySelector('.form-group--to');
	const to_input = to_group.querySelector('input');

	form.insertBefore(
		html.node`
        <div class="input-group library-date-group">
            ${
			input({
				type: 'date',
				value: from_input.value,
				name: from_input.name,
				min: '2000-01-01',
				show_time: false,
			})
		}
            <div class="bleh-icon" style="--icon: var(--icon-16-arrow-right)" />
            ${
			input({
				type: 'date',
				value: to_input.value,
				name: to_input.name,
				min: '2000-01-01',
				show_time: false,
			})
		}
        </div>
    `,
		form.firstChild,
	);

	from_group.remove();
	to_group.remove();
}

// can update at any time!!
export function bleh_glacier_library() {
	// table
	bleh_glacier_library_table();

	// top header info
	bleh_glacier_library_top();

	// new graph
	bleh_glacier_date_graph();
}

function bleh_glacier_library_table() {
	if (!ff('glacier_library')) return;

	const table = page.structure.glacier.date_panel.querySelector(
		'.highcharts-root',
	);

	if (table == null) return;

	console.log('glacier library', table);
	log('refresh is now marked false (table log)', 'glacier library', 'log');
	page.structure.glacier.refresh = false;

	const current_view = page.structure.glacier.date_panel.querySelector(
		'.date-range-picker-button-inner',
	);

	if (current_view == null) {
		console.log(
			'glacier library current view',
			page.structure.glacier.date_panel.innerHTML,
		);
		log('returned as current view is null', 'glacier library');
		log('refresh is now marked true', 'glacier library');
		page.structure.glacier.refresh = true;
		return;
	}

	if (table.hasAttribute('data-glacier-library-table')) return;
	table.setAttribute('data-glacier-library-table', 'true');

	page.structure.glacier.table = table;
	log('refresh is now marked true (table found)', 'glacier library');
	page.structure.glacier.refresh = true;
	log('pending refresh', 'glacier library');
}

function bleh_glacier_library_top(static_page = false) {
	if (!ff('glacier_library')) return;

	let legacy_top_header;
	if (!static_page) {
		legacy_top_header = page.structure.main.querySelector('.library-top');
	} else {
		legacy_top_header = page.structure.main.querySelector('.metadata-list');
	}

	if (!legacy_top_header) return;

	legacy_top_header.classList.add('glacier-legacy-top-header');

	if (!static_page) {
		if (legacy_top_header.style.getPropertyValue('display')) {
			legacy_top_header.removeAttribute('data-glacier-library-top');
			return;
		}

		if (legacy_top_header.hasAttribute('data-glacier-library-top')) return;
		legacy_top_header.setAttribute('data-glacier-library-top', 'true');
	}

	log('loading top', 'glacier library');

	const metadata = legacy_top_header.querySelectorAll('.metadata-item');

	let first_run = false;
	let glacier_top = page.structure.glacier.top;
	if (!glacier_top || !page.structure.main.contains(glacier_top)) {
		first_run = true;
	}

	if (first_run) {
		glacier_top = document.createElement('section');
		glacier_top.classList.add('glacier-library-top');
	}

	// meta
	let glacier_meta;
	if (first_run) {
		glacier_meta = document.createElement('div');
		glacier_meta.classList.add('glacier-library-metadata');
	} else {
		glacier_meta = page.structure.glacier.top.querySelector(
			'.glacier-library-metadata',
		);
		glacier_meta.innerHTML = '';
	}

	metadata.forEach((meta, index) => {
		let text = meta.querySelector('.metadata-title');
		let value = meta.querySelector('.metadata-display').textContent;

		if (text) {
			text = text.textContent;

			if (page.subpage == 'library_overview') {
				if (index == 1) text = tl(trans.average);
			} else if (page.subpage == 'library_artists') {
				text = tl(trans.artists);
			} else if (page.subpage == 'library_albums') {
				text = tl(trans.albums);
			} else if (page.subpage == 'library_tracks') {
				text = tl(trans.tracks);
			}
		} else {
			// search results
			text = tl(trans.results_for);
			value = meta.querySelector('.metadata-display').textContent;

			const start = value.indexOf('“') + 1;
			const end = value.indexOf('”');
			value = desanitise(value.substring(start, end));
		}

		glacier_meta.appendChild(html.node`
            <div class="glacier-library-metadata-item">
                <div class="sub-text">${text}</div>
                <div class="glacier-library-metadata-item-value">${value}</div>
            </div>
        `);
	});

	if (first_run) glacier_top.appendChild(glacier_meta);

	if (!first_run) return;

	// buttons
	const top_wrap = page.structure.main.querySelector('.library-top-wrap');

	const view_buttons = document.createElement('div');
	view_buttons.classList.add('view-buttons', 'glacier-library-buttons');

	let add_divider = false;

	const sort = legacy_top_header.querySelector('.library-sort');
	if (!static_page) {
		let sort_button;
		if (sort) {
			sort_button = sort.querySelector('.dropdown-menu-clickable-button');
			add_divider = true;

			if (sort_button) {
				sort_button.classList.add(
					'btn',
					'view-item',
					'glacier-library-button',
				);
				const sort_menu = sort.querySelector(
					'.dropdown-menu-clickable',
				);

				view_buttons.appendChild(sort_button);
				view_buttons.appendChild(sort_menu);
			}
		}
	}

	if (!static_page && page.subpage != 'library_tracks') {
		const format_button = html.node`
            <button class="btn view-item icon glacier-library-button glacier-view-button" onclick=${() => {
			const format = page.structure.main.querySelector(
				'.library-view-button',
			);
			if (!format) return;

			format.click();

			if (
				format.getAttribute('href') &&
				format.getAttribute('href').endsWith('reset')
			) {
				format_button.setAttribute('data-glacier-view', 'list');
				format_button.textContent = tl(trans.list);
			} else {
				format_button.setAttribute('data-glacier-view', 'grid');
				format_button.textContent = tl(trans.grid);
			}
		}} />
        `;
		add_divider = true;

		if (top_wrap.getAttribute('data-current-format') == 'grid') {
			format_button.setAttribute('data-glacier-view', 'grid');
			format_button.textContent = tl(trans.grid);
		} else {
			format_button.setAttribute('data-glacier-view', 'list');
			format_button.textContent = tl(trans.list);
		}

		view_buttons.appendChild(format_button);
	}

	if (!static_page && add_divider) {
		view_buttons.appendChild(html.node`
            <div class="listen-divider" />
        `);
	}

	const configure_button = document.createElement('button');
	configure_button.classList.add(
		'btn',
		'view-item',
		'icon',
		'glacier-library-button',
		'glacier-configure-button',
		'panel-settings-button',
	);
	configure_button.textContent = tl(trans.settings);

	tippy(configure_button, {
		content: tl(trans.settings),
	});

	tippy(configure_button, {
		theme: 'window',
		content: html.node`
            <div class="dialog-settings">
                <div class="setting-group blend">
                    ${
			page.subpage == 'library_artists'
				? setting({ id: 'colourful_counts' })
				: html.node`
                                ${setting({ id: 'format_guest_features' })}
                                ${setting({ id: 'show_guest_features' })}
                            `
		}
                    ${
			(
					(page.subpage == 'library_artists' ||
						page.subpage == 'library_albums') &&
					auth.pro
				)
				? html.node`
                                ${setting({ id: 'grid_glow' })}
                            `
				: ''
		}
                    ${setting({ id: 'glacier_library_graphs' })}
                </div>
            </div>
        `,
		placement: 'bottom',
		interactive: true,
		interactiveBorder: 10,
		trigger: 'click',
		appendTo: document.body,
		hideOnClick: 'toggle',

		onClickOutside(instance) {
			if (instance.popper.querySelector('[aria-expanded="true"]')) {
				return;
			}

			instance.hide();
		},
	});

	view_buttons.appendChild(configure_button);

	glacier_top.appendChild(view_buttons);

	page.structure.glacier.top = glacier_top;
	page.structure.main.insertBefore(
		glacier_top,
		page.structure.main.firstElementChild,
	);
}

function bleh_glacier_date_graph(static_page = false, own_table = null) {
	if (!page.structure.glacier.refresh) return;

	if (!settings.glacier_library_graphs) return;

	log('reviewing graph situation', 'glacier library');

	if (own_table != null) {
		log(
			'table has been passed to function (from network request presumably?)',
			'glacier library',
			'info',
			own_table,
		);
	} else {
		log(
			'no table has been passed, must source ourselves',
			'glacier library',
		);
	}

	/*let scrobble_chart_wrap = page.structure.side.querySelector('.scrobble-table:not([data-glacier-date-graph])');

    if (scrobble_chart_wrap == null)
        return;

    scrobble_chart_wrap.setAttribute('data-glacier-date-graph', 'true');*/

	bleh_glacier_library_date();

	let current_view = page.structure.glacier.date_panel.querySelector(
		'.date-range-picker-button-inner',
	);

	if (!current_view) return;

	current_view = current_view.textContent.trim();

	let tab_matches;
	if (
		page.name == page.state.glacier.name &&
		(page.subpage == 'library_overview' ||
			page.subpage == 'library_artists' ||
			page.subpage == 'library_albums' ||
			page.subpage == 'library_tracks') &&
		(page.state.glacier.current_tab == 'library_overview' ||
			page.state.glacier.current_tab == 'library_artists' ||
			page.state.glacier.current_tab == 'library_albums' ||
			page.state.glacier.current_tab == 'library_tracks')
	) {
		tab_matches = true;
	}

	if (
		page.state.glacier.current_view == current_view &&
		!own_table &&
		tab_matches
	) {
		// re-use old values as view matches
		bleh_glacier_date_graph_generate();
		log('refresh is now marked false', 'glacier library');
		page.structure.glacier.refresh = false;

		log(
			`returned as view (${current_view}) matches ${page.state.glacier.current_view}. last tab was ${page.state.glacier.current_tab} (${page.state.glacier.name}) and current tab is ${page.subpage} (${page.name})`,
			'glacier library',
		);
		return;
	}

	page.state.glacier.current_view = current_view;

	const scrobble_chart_content = page.structure.row.querySelector(
		'#scrobble-chart-content',
	);
	if (!scrobble_chart_content) return;

	if (
		scrobble_chart_content.getAttribute('data-highcharts-chart') &&
		scrobble_chart_content.getAttribute('data-highcharts-chart') == '0'
	) {
		log('highchart registered', 'glacier library');
		log('refresh is now marked false', 'glacier library');
		page.structure.glacier.refresh = false;
		return;
	}

	const scrobble_chart_wrap = page.structure.row.querySelector(
		'.scrobble-table',
	);

	if (!scrobble_chart_wrap) return;

	let scrobble_table;
	if (own_table) scrobble_table = own_table;
	else scrobble_table = scrobble_chart_wrap.querySelector('.table');

	if (!scrobble_table) {
		// lets see if we can make this request ourselves
		let request_url;
		if (window.location.search == '') {
			request_url = `${window.location.href}/chart?ajax=1`;
		} else {
			request_url = window.location.href.replace(
				window.location.search,
				`/chart${window.location.search}&ajax=1`,
			);
		}
		bleh_glacier_library_request(request_url);
		/*console.info(page.structure.glacier.table);

        let series = page.structure.glacier.table.querySelectorAll('.highcharts-bar-series a');

        // we fake-hover the first bar to get the relationship
        // between height and real value
        let subject = series[0];
        let bar = subject.querySelector('rect');
        let height = bar.getAttribute('height');

        setTimeout(function() {
            subject.dispatchEvent(new Event('mouseover'));
        }, 300);

        subject.addEventListener('mouseover', e => {
            console.info(e);
        });*/

		return;
	}

	const entries = scrobble_table.querySelectorAll('tbody tr');

	page.state.glacier.labels = [];
	page.state.glacier.links = [];
	page.state.glacier.values = [];

	let values_not_empty = 0;

	entries.forEach((entry) => {
		const period = entry.querySelector('.js-period a');
		const value = entry.querySelector('.js-scrobbles').textContent.trim();

		page.state.glacier.labels.push(period.textContent.trim());
		page.state.glacier.links.push(period.getAttribute('href'));
		page.state.glacier.values.push(value);

		if (value != '0') values_not_empty += 1;
	});

	if (values_not_empty == 0) {
		log('graph cancelled as all values are 0', 'glacier library');
		page.structure.glacier.refresh = false;
		return;
	}

	scrobble_table.innerHTML = '';

	bleh_glacier_date_graph_generate();

	log('refresh is now marked false (finished generating)', 'glacier library');
	page.structure.glacier.refresh = false;
}

export function bleh_glacier_insights(insights = null) {
	if (insights) {
		if (page.subpage == 'library_artists') {
			page.state.glacier.insights.album.display = false;
			page.state.glacier.insights.track.display = false;
		}
		if (page.subpage == 'library_albums') {
			page.state.glacier.insights.artist.display = false;
			page.state.glacier.insights.track.display = false;
		}
		if (page.subpage == 'library_tracks') {
			page.state.glacier.insights.artist.display = false;
			page.state.glacier.insights.album.display = false;
		}

		for (const item in insights) {
			log(
				`checking insights status of item ${item} - display of ${
					insights[item].display
				}`,
				'glacier library',
				'log',
				{
					checking: insights[item],
					global: page.state.glacier.insights[item],
				},
			);
			if (
				insights[item].display &&
				JSON.stringify(insights[item]) !=
					JSON.stringify(page.state.glacier.insights[item])
			) {
				log(
					`confirmed insights status of item ${item} - is different`,
					'glacier library',
				);
				page.state.glacier.insights[item] = insights[item];

				bleh_glacier_insights_generate(
					item,
					page.state.glacier.insights[item],
				);
			}
		}
	} else {
		for (const item in page.state.glacier.insights) {
			if (page.state.glacier.insights[item].display) {
				bleh_glacier_insights_generate(
					item,
					page.state.glacier.insights[item],
				);
			}
		}
	}
}

function bleh_glacier_insights_generate(type, item) {
	if (item.highest.value == 0) return;

	let new_run = false;
	let scrobble_insights_panel = page.structure.side.querySelector(
		`.scrobble-insights-panel[data-type="${type}"]`,
	);
	if (!scrobble_insights_panel) {
		scrobble_insights_panel = html.node`
            <section class="scrobble-insights-panel" data-type=${type} />
        `;
		new_run = true;
	}

	log(
		`requesting insights generator for ${type}`,
		'glacier library',
		'info',
		{ item, new_run },
	);

	// converts to plural
	render(scrobble_insights_panel, html``);
	render(
		scrobble_insights_panel,
		html`
			<h2>${tl(trans[`${type}s`])}</h2>
		`,
	);

	const scrobble_canvas_container = document.createElement('div');
	scrobble_canvas_container.classList.add(
		'scrobble-insights-canvas-container',
	);

	const scrobble_canvas = document.createElement('canvas');
	scrobble_canvas.classList.add('scrobble-insights-canvas');

	Chart.defaults.color = page.state.chart_colours.text_col;
	Chart.defaults.font.family = page.state.chart_colours.font;
	if (settings.chart_insights_view == 'line') {
		let gradient = scrobble_canvas
			.getContext('2d')
			.createLinearGradient(0, 0, 0, 160);
		try {
			gradient.addColorStop(0, page.state.chart_colours.link_bg_col);
			gradient.addColorStop(1, page.state.chart_colours.link_bg_col_2);
		} catch (e) {
			gradient = page.state.chart_colours.link_bg_col;
		}

		let scrobble_chart = new Chart(scrobble_canvas.getContext('2d'), {
			type: 'line',
			data: {
				labels: item.labels,
				datasets: [
					{
						data: item.values,
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
			options: page.state.chart_library_line_options_no_click,
		});
	} else if (settings.chart_insights_view == 'pie') {
		let scrobble_chart = new Chart(scrobble_canvas.getContext('2d'), {
			type: 'pie',
			data: {
				labels: item.labels,
				datasets: [
					{
						data: item.values,
						borderWidth: 2,
						backgroundColor: [
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'360',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'340',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'320',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'300',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'280',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'270',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'255',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'235',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'220',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'208',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'200',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'180',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'160',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'140',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'120',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'100',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'80',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'60',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'40',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'20',
								)
							})`,
						],
						borderColor: page.state.chart_colours.bg_col,
						pointRadius: 0,
						pointHitRadius: 20,
						tension: 0.1,
					},
				],
			},
			options: page.state.chart_library_pie_options_no_click,
		});
	} else if (settings.chart_insights_view == 'bar') {
		let scrobble_chart = new Chart(scrobble_canvas.getContext('2d'), {
			type: 'bar',
			data: {
				labels: item.labels,
				datasets: [
					{
						data: item.values,
						borderWidth: 0,
						backgroundColor: [
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'360',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'340',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'320',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'300',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'280',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'270',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'255',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'235',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'220',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'208',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'200',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'180',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'160',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'140',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'120',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'100',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'80',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'60',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'40',
								)
							})`,
							`hsl(${
								page.state.chart_colours.link_h_col.replace(
									page.state.chart_colours.hue,
									'20',
								)
							})`,
						],
						borderColor: page.state.chart_colours.bg_col,
						pointRadius: 0,
						pointHitRadius: 20,
						tension: 0.1,
						borderRadius: 9,
					},
				],
			},
			options: page.state.chart_library_bar_options_no_click,
		});
	}

	scrobble_canvas_container.appendChild(scrobble_canvas);
	scrobble_insights_panel.appendChild(scrobble_canvas_container);
	if (new_run) page.structure.side.appendChild(scrobble_insights_panel);
}

export function bleh_glacier_library_open_index(index) {
	const link = page.state.glacier.links[index];

	log(`opening link ${link}`, 'glacier library');
	window.location.href = link;
}

function bleh_glacier_library_request(request_url) {
	log(`making our own request with ${request_url}`, 'glacier library');
	console.info(page.structure.glacier.refresh);
	page.structure.glacier.refresh = false;

	page.structure.glacier.date_panel.classList.add('data-is-loading');

	fetch(request_url)
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
			const doc = new DOMParser().parseFromString(html, 'text/html');
			console.log(
				'glacier library DOC',
				doc,
				doc.querySelector('.table'),
			);

			log('received response', 'glacier library');
			log('refresh is now marked true', 'glacier library');
			page.structure.glacier.refresh = true;

			const table = doc.querySelector('.table');

			if (table != null) {
				bleh_glacier_date_graph(false, table);
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

			page.structure.glacier.date_panel.classList.remove(
				'data-is-loading',
			);
		});
}

export function bleh_glacier_date_graph_generate() {
	page.state.glacier.current_tab = page.subpage;
	page.state.glacier.name = page.name;
	log('generating', 'glacier library', 'info', {
		labels: page.state.glacier.labels,
		links: page.state.glacier.links,
		values: page.state.glacier.values,
	});

	prep_chart_colours();

	let new_run = false;
	let scrobble_canvas_container = page.structure.glacier.date_panel
		.querySelector('.scrobble-canvas-container');
	if (scrobble_canvas_container == null) {
		scrobble_canvas_container = document.createElement('div');
		scrobble_canvas_container.classList.add(
			'scrobble-canvas-container',
			'icon-mask',
		);
		new_run = true;
	} else {
		scrobble_canvas_container.innerHTML = '';
	}

	const scrobble_canvas = document.createElement('canvas');
	scrobble_canvas.classList.add('scrobble-canvas');

	scrobble_canvas_container.setAttribute('data-view', settings.chart_view);

	Chart.defaults.color = page.state.chart_colours.text_col;
	Chart.defaults.font.family = page.state.chart_colours.font;
	if (settings.chart_view == 'line') {
		let gradient = scrobble_canvas
			.getContext('2d')
			.createLinearGradient(0, 0, 0, 160);
		try {
			gradient.addColorStop(0, page.state.chart_colours.link_bg_col);
			gradient.addColorStop(1, page.state.chart_colours.link_bg_col_2);
		} catch (e) {
			gradient = page.state.chart_colours.link_bg_col;
		}

		let scrobble_chart = new Chart(scrobble_canvas.getContext('2d'), {
			type: 'line',
			data: {
				labels: page.state.glacier.labels,
				datasets: [
					{
						data: page.state.glacier.values,
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
			options: page.state.chart_library_line_options,
		});
	} else if (settings.chart_view == 'pie') {
		let scrobble_chart = new Chart(scrobble_canvas.getContext('2d'), {
			type: 'pie',
			data: {
				labels: page.state.glacier.labels,
				datasets: [
					{
						data: page.state.glacier.values,
						borderWidth: 2,
						backgroundColor: page.state.chart_colours.colours,
						borderColor: page.state.chart_colours.bg_col,
						pointRadius: 0,
						pointHitRadius: 20,
						tension: 0.1,
					},
				],
			},
			options: page.state.chart_library_pie_options,
		});
	} else if (settings.chart_view == 'bar') {
		let scrobble_chart = new Chart(scrobble_canvas.getContext('2d'), {
			type: 'bar',
			data: {
				labels: page.state.glacier.labels,
				datasets: [
					{
						data: page.state.glacier.values,
						borderWidth: 0,
						backgroundColor: page.state.chart_colours.colours,
						borderColor: page.state.chart_colours.bg_col,
						pointRadius: 0,
						pointHitRadius: 20,
						tension: 0.1,
						borderRadius: 9,
					},
				],
			},
			options: settings.chart_bar_axis == 'horizontal'
				? page.state.chart_library_bar_options
				: page.state.chart_library_bar_v_options,
		});
	}

	scrobble_canvas_container.appendChild(scrobble_canvas);
	if (new_run) {
		page.structure.glacier.date_panel.appendChild(
			scrobble_canvas_container,
		);
	}
}

function bleh_glacier_library_focused() {
	page.state.glacier.insights.artist = {
		display: false,
		values: [],
		labels: [],
		highest: {
			value: 0,
			label: '',
			link: '',
			img: '',
		},
	};

	const legacy_header = page.structure.main.querySelector('.library-header');

	let type;
	if (page.subpage.startsWith('library_artist')) type = 'artist';
	else if (page.subpage.startsWith('library_album')) type = 'album';
	else if (page.subpage.startsWith('library_track')) type = 'track';

	let header_title = legacy_header.querySelector('.library-header-crumb'); // subpage
	if (!header_title) {
		header_title = legacy_header.querySelector('.library-header-title'); // main
	}

	const duration = header_title.querySelector(
		'.library-header-title-duration',
	);
	if (duration) header_title.removeChild(duration);

	header_title = header_title.textContent.trim();

	let artist = legacy_header.querySelector('.text-colour-link');
	if (artist) artist = artist.textContent.trim();

	const image = legacy_header.querySelector('.library-header-image img');

	let link = `${root}music/${redirect()}${sanitise(header_title)}`;
	if (type == 'album') {
		link = `${root}music/${redirect()}${sanitise(artist)}/${
			sanitise(header_title)
		}`;
	} else if (type == 'track') {
		link = `${root}music/${redirect()}${sanitise(artist)}/_/${
			sanitise(header_title)
		}`;
	}

	const header = document.createElement('section');
	header.classList.add(
		'glacier-library-top',
		'glacier-library-focused-header',
	);

	const upper_wrap = document.createElement('div');
	upper_wrap.classList.add('glacier-library-top-upper');

	const current_suffix = window.location.search;

	const metadata = html.node`
        <div class="glacier-library-metadata">
            <div class="glacier-library-metadata-avatar">
                ${image}
            </div>
            <div class="glacier-library-metadata-item">
                <div class="sub-text">
                    ${tl(trans[type])}
                </div>
                <div class="glacier-library-metadata-item-value glacier-library-metadata-focus" data-type="${type}">
                    <a href="${link}">${
		type == 'artist'
			? correct_artist(header_title)
			: correct_item_by_artist(header_title, artist)
	}</a>${
		duration
			? html
				.node`<span class="glacier-library-track-duration">${duration.textContent}</span>`
			: ''
	}${
		type != 'artist'
			? html`${{
				html: tl(trans.by_artist, {
					a: `<a href="${root}user/${page.name}/library/music/+noredirect/${
						sanitise(artist)
					}${current_suffix}">${
						sanitise_text(correct_artist(artist))
					}</a>`,
				}),
			}}`
			: ''
	}
                </div>
            </div>
        </div>
    `;

	upper_wrap.appendChild(metadata);
	header.appendChild(upper_wrap);

	const view_buttons = document.createElement('div');
	view_buttons.classList.add('view-buttons', 'glacier-library-buttons');

	const cta = legacy_header.querySelector('.library-header-ctas');

	const love_form = legacy_header.querySelector(
		'.library-header-love-form:not(:has(button))',
	);
	if (love_form) {
		let state = love_form
			.querySelector(':scope > .love-button-toggle')
			.getAttribute('data-ajax-form-state');
		if (state == 'loved') state = 0;
		else state = 1;

		const love_form_items = love_form.querySelectorAll(
			':scope > div > div',
		);
		love_form_items.forEach((item, index) => {
			if (state != index) item.classList.add('hide');

			cta.appendChild(item);
		});
	}

	if (cta) {
		const wrappers = cta.querySelectorAll(':scope > *');
		wrappers.forEach((wrapper) => {
			let button;

			console.info('wrapper', wrapper);

			if (wrapper.classList[0] == 'library-header-cta-item') {
				button = wrapper;
			} else button = wrapper.querySelector('button');

			if (!button) button = wrapper.querySelector('span');

			if (!button) return;

			button.classList.add(
				'btn',
				'view-item',
				'icon',
				'glacier-library-button',
			);

			let tooltips = wrapper.querySelectorAll(
				'.user-library-controls-tooltip',
			);
			tooltips.forEach((tooltip) => {
				tooltip.parentElement.removeChild(tooltip);
			});

			view_buttons.appendChild(wrapper);

			const action = button.getAttribute('data-analytics-action');
			if (action) {
				if (action == 'EditScrobbleOpen') {
					button.textContent = tl(trans.edit);
				} else if (action == 'UnloveTrack' || action == 'LoveTrack') {
					const listen_divider = document.createElement('div');
					listen_divider.classList.add('listen-divider');
					view_buttons.appendChild(listen_divider);

					// we need to target the other button too lol
					button = wrapper.querySelector('button:not(.btn)');
					if (button) {
						button.classList.add(
							'btn',
							'view-item',
							'icon',
							'glacier-library-button',
						);
					}
				}
			} else {
				// have to read classlist
				if (button.classList.contains('delete-icon')) {
					button.classList.add('colourful');
					button.textContent = tl(trans.delete);
				}
			}
		});

		if (wrappers.length > 0) {
			const listen_divider = document.createElement('div');
			listen_divider.classList.add('listen-divider');
			view_buttons.appendChild(listen_divider);
		}
	}

	if (page.subpage == 'library_artist_overview' && auth.pro) {
		const search = document.createElement('a');
		search.classList.add(
			'btn',
			'view-item',
			'icon',
			'glacier-library-button',
			'glacier-search-button',
		);
		search.textContent = tl(trans.search);
		search.setAttribute(
			'href',
			`${root}user/${page.name}/library/tracks/search?query=${
				sanitise(correct_artist(header_title))
			}`,
		);

		tippy(search, {
			content: tl(trans.search_guest),
		});

		const divider = view_buttons.querySelector('.listen-divider');
		if (divider) view_buttons.insertBefore(search, divider);
	}

	const configure_button = document.createElement('button');
	configure_button.classList.add(
		'btn',
		'view-item',
		'icon',
		'glacier-library-button',
		'glacier-configure-button',
		'panel-settings-button',
	);
	configure_button.textContent = tl(trans.settings);

	tippy(configure_button, {
		content: tl(trans.settings),
	});

	tippy(configure_button, {
		theme: 'window',
		content: html.node`
            <div class="dialog-settings">
                <div class="setting-group blend">
                    ${setting({ id: 'format_guest_features' })}
                    ${setting({ id: 'show_guest_features' })}
                    ${setting({ id: 'glacier_library_graphs' })}
                </div>
            </div>
        `,
		placement: 'bottom',
		interactive: true,
		interactiveBorder: 10,
		trigger: 'click',
		appendTo: document.body,
		hideOnClick: 'toggle',

		onClickOutside(instance) {
			if (instance.popper.querySelector('[aria-expanded="true"]')) {
				return;
			}

			instance.hide();
		},
	});

	view_buttons.appendChild(configure_button);

	upper_wrap.appendChild(view_buttons);

	let lower_metadata;
	const lower_wrap = html.node`
        <div class="glacier-library-top-lower">
            <div class="glacier-library-metadata" ref=${(
		el,
	) => (lower_metadata = el)} />
        </div>
    `;

	const legacy_meta_wrap = page.structure.main.querySelector(
		'.metadata-list',
	);
	if (legacy_meta_wrap) {
		const metadatas = legacy_meta_wrap.querySelectorAll(
			'.metadata-item:not(.library-header-ctas__wrapper)',
		);

		metadatas.forEach((meta) => {
			let glacier_meta_item = document.createElement('div');
			glacier_meta_item.classList.add('glacier-library-metadata-item');
			glacier_meta_item.innerHTML = `
                <div class="sub-text">${
				meta.querySelector('.metadata-title').textContent
			}</div>
                <div class="glacier-library-metadata-item-value">${
				meta.querySelector('.metadata-display').textContent
			}</div>
            `;

			lower_metadata.appendChild(glacier_meta_item);
		});

		header.appendChild(lower_wrap);
	}

	page.structure.main.insertBefore(
		header,
		page.structure.main.firstElementChild,
	);

	let overview_headers = page.structure.main.querySelectorAll(
		'.library-overview-header',
	);
	overview_headers.forEach((top) => {
		top.classList = 'top-container';

		const header = top.querySelector('h2');

		const select_btn = top.querySelector('.dropdown-menu-clickable-button');

		if (!select_btn) {
			top.classList.add('spacing');
			return;
		}

		select_btn.classList.add(
			'select-button',
			'link-select',
			'blend-v2-btn',
		);
		select_btn.classList.remove('dropdown-menu-list-button');

		header.after(html.node`
            <div class="accompany view-buttons blend blend-v2">
                ${select_btn}
            </div>
        `);
	});

	// move random overview header into their section below
	const overview_header = page.structure.main.querySelector(
		':scope > .top-container',
	);
	if (!overview_header) return;

	overview_header.nextElementSibling.insertBefore(
		overview_header,
		overview_header.nextElementSibling.firstElementChild,
	);
}

export function bleh_glacier_library_bulk_edit() {
	// quick check to see if bulk edit is present
	const library_header = page.structure.main.querySelector('.library-header');
	if (!library_header) return;

	const bulk_edit = library_header.querySelector(
		'[href="javascript:void(0)"]',
	);
	if (!bulk_edit) return;

	// move to new area
	const view_buttons = page.structure.main.querySelector(
		'.glacier-library-buttons',
	);
	if (!view_buttons) return;

	const pre_existing_bulk = view_buttons.querySelector('.bulk-edit-button');
	if (pre_existing_bulk) return;

	const edit_form = view_buttons.querySelector(
		':scope > .library-header-edit-form',
	);
	const delete_button = view_buttons.querySelector(':scope > .delete-icon');
	if (!delete_button) return;

	bulk_edit.classList.add(
		'btn',
		'view-item',
		'icon',
		'glacier-library-button',
		'bulk-edit-button',
	);
	bulk_edit.textContent = tl(trans.bulk_edit);

	if (!edit_form) view_buttons.insertBefore(bulk_edit, delete_button);
	else view_buttons.insertBefore(bulk_edit, edit_form);
}
