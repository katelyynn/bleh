/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { html, render } from 'lighterhtml';
import { auth, page, random_list, root } from '@/build/page';
import { tl, trans } from '@/build/trans';
import { dialog, dialog_rm } from '@/components/dialog/dialog';
import { input } from '@/components/settings/input';
import { icon, icons } from '../shared/icon';
import { select } from '../settings/select';
import { hybrid_timeframe_picker } from '../date/timeframe';
import { romanise, sanitise } from '@/build/tools';
import JSON5 from 'json5';
import { log } from '@/build/log';
import { load_chart_colours, prep_chart_colours } from '../music/chart';
import { Chart } from 'chart.js';
import { correct_artist, correct_item_by_artist } from '../music/lotus';
import { keys } from '../settings/storage';
import { load_profile_cache_externally } from '@/pages/profile/profile';
import { is_sponsor } from '../sponsor';
import { settings } from '@/build/config';
import tippy from 'tippy.js';
import { DateTime } from 'luxon';
import { chart_bucket } from '@/types/library';
import { redirect } from '../music/music';
import { notify } from '../dialog/notify';
import { toggle } from '../settings/toggle';
import { save_setting } from '../settings/settings';

export function plot({ host, sidebar } = {}) {
	if (!host || !sidebar) return;

	let data_points = [];

	const graph_colour_length = 11;

	let temporary_data_source = {};
	let temporary_user = '';

	const current_year = new Date().getFullYear();
	const previous_year = current_year - 1;

	let selected_data_source = '';
	let selected_user = '';

	let body;
	let footer;
	let timeframe;

	let from;
	let to;

	let data_source;
	let user;

	let add_data_point_btn;

	let allow_adding = true;

	let plot_header_options;

	let refresh_graph_btn;

	let current_timeframe = 'date_preset=LAST_365_DAYS';
	let proposed_timeframe;
	let timeframe_matches = true;

	let fixing_timeframe = false;

	let alert;

	let chart_bucket: chart_bucket;

	render(
		host,
		html`
			<div class="plot-header">
				<div class="plot-header-side plot-header-side-main">
					<label class="plot-header-label">${tl(
						trans.add_to_graph,
					)}</label>
					<div class="plot-header-options" ref=${(el) =>
						plot_header_options = el} />
				</div>
				<div class="plot-header-side">
					<label class="plot-header-label">${tl(
						trans.graph_options,
					)}</label>
					<div class="plot-header-options">
			            ${timeframe = hybrid_timeframe_picker({
				initial: 'date_preset=LAST_365_DAYS',
				func: (val: string) => {
					if (!timeframe_matches && val != current_timeframe) return;

					if (current_timeframe != val && data_points.length > 0) {
						timeframe_matches = false;
						timeframe_mismatch();
						proposed_timeframe = val;
						return;
					}

					current_timeframe = val;
					timeframe_matches = true;
					refresh_graph_btn.disabled = true;
					refresh_graph_btn.classList.remove('primary');
					proposed_timeframe = val;
					check_if_allow();
				},
			})}
			            <button class="btn icon" data-type="reload" disabled onclick=${() =>
				match_timeframe()} ref=${(el) => refresh_graph_btn = el}>
			                ${tl(trans.refresh)}
			            </button>
			        </div>
				</div>
			</div>
			<div class="plot-alert" data-hidden="true" ref=${(el) =>
				alert = el} />
			<div class="plot-body empty" ref=${(el) => body = el}>
				<div class="plot-body-empty-message">
					<div class="placeholder-block">
						<div class="placeholder-head">( ╹ -╹)?</div>
						<div class="placeholder-summary">${tl(
							trans.no_data_to_display,
						)}</div>
						<button class="see-more left-icon" data-type="plus"
							onclick=${() => data_source.open()}>
			                ${tl(trans.add_to_graph)}
			            </button>
					</div>
				</div>
				<div class="plot-body-loading-message">
					<div class="loading-data-container">
						<div class="loading-data-text">${tl(
							trans.plotting_your_data,
						)}</div>
					</div>
				</div>
			</div>
			<div class="plot-footer" ref=${(el) => footer = el} />
		`,
	);

	const refresh_tooltip = tippy(refresh_graph_btn, {
		content: tl(trans.refresh_plot_notice),
	});

	update_plot_options();

	function timeframe_mismatch() {
		if (fixing_timeframe) return;

		timeframe.disabled = false;
		refresh_graph_btn.removeAttribute('disabled');
		refresh_graph_btn.classList.add('primary');
		check_if_allow();
	}

	async function match_timeframe() {
		fixing_timeframe = true;
		refresh_graph_btn.disabled = true;
		timeframe.disabled = true;
		refresh_graph_btn.classList.remove('primary');
		current_timeframe = proposed_timeframe;

		const previous_data_points = [...data_points];
		data_points.length = 0;

		body.classList.add('loading');
		body.classList.remove('empty');

		for (const point of previous_data_points) {
			await fetch_data_set(
				point.user,
				JSON5.stringify(point.media),
				false,
			);
		}

		body.classList.remove('loading');

		timeframe.disabled = false;
		timeframe_matches = true;
		fixing_timeframe = false;
		check_if_allow();
	}

	function update_plot_options() {
		const data_source_history = JSON5.parse(
			localStorage.getItem(keys.plot_data_history) || '[]',
		);

		const unique_users = [...new Set(data_points.map((item) => item.user))];

		const seen_media = new Set();
		const unique_media = [];

		const media_list = [
			{
				text: tl(trans.data_source),
			},
			{
				type: 'plus',
				text: tl(trans.add),
				action: add_new_data_source,
			},
		];

		data_points.forEach((point) => {
			const media_string = JSON5.stringify(point.media);

			if (!seen_media.has(media_string)) {
				seen_media.add(media_string);
				unique_media.push(point.media);
			}
		});

		const media = [];
		unique_media.forEach((item) => {
			media.push({
				value: JSON5.stringify(item),
				text: plot_media_title(item, true),
			});
		});

		const media_history = [];
		data_source_history.forEach((point) => {
			const media_point = JSON5.parse(point);

			if (
				media_point.artist == '' ||
				(media_point.artist != '' &&
					(media_point.album == '' || media_point.track == ''))
			) return;

			const media_string = JSON5.stringify(media_point);

			const existing = media.some((item) => item.value == media_string);

			if (!existing) {
				media_history.push({
					value: media_string,
					text: plot_media_title(media_point, true),
				});
			}
		});

		if (Object.keys(temporary_data_source).length > 0) {
			const media_string = JSON5.stringify(temporary_data_source);

			const existing = media.some((item) => item.value == media_string);

			if (!existing) {
				media.unshift({
					value: media_string,
					text: plot_media_title(temporary_data_source, true),
				});
			}
		}

		if (media.length > 0) {
			media_list.push({
				text: 'sep',
			});
			media_list.push({
				text: tl(trans.existing),
			});
			media_list.push(...media);
		}

		if (media_history.length > 0) {
			media_list.push({
				text: 'sep',
			});
			media_list.push({
				text: tl(trans.history),
			});
			media_list.push(...media_history.toReversed());
		}

		const user_list = [
			{
				text: tl(trans.profile),
			},
			{
				value: auth.name,
				text: generic_user_title(auth.name, 'user', true),
			},
		];

		const unique_users_not_self = unique_users.filter((user) =>
			user != auth.name && !settings.friends.includes(user)
		);

		console.info('unique', unique_users, unique_users_not_self);

		if (
			temporary_user == auth.name ||
			settings.friends.includes(temporary_user) ||
			unique_users_not_self.includes(temporary_user)
		) {
			temporary_user = '';
		}

		user_list.push({
			text: 'sep',
		});
		user_list.push({
			text: tl(trans.existing),
		});
		user_list.push({
			type: 'plus',
			text: tl(trans.add),
			action: add_new_user,
		});

		if (temporary_user != '') {
			user_list.push({
				value: temporary_user,
				text: generic_user_title(temporary_user, 'user', true),
			});
		}

		if (unique_users_not_self.length > 0) {
			unique_users_not_self.forEach((user) => {
				user_list.push({
					value: user,
					text: generic_user_title(user, 'user', true),
				});
			});
		}

		const starred = settings.starred_friend || '';
		let friends = settings.friends.filter((f) => f != starred);

		if (starred || friends.length > 0) {
			user_list.push({
				text: 'sep',
			});
			user_list.push({
				text: tl(trans.close_friends),
			});

			if (starred) {
				user_list.push({
					value: starred,
					text: generic_user_title(starred, 'starred', true),
				});
			}

			friends.forEach((friend: string) => {
				user_list.push({
					value: friend,
					text: generic_user_title(friend, 'friend', true),
				});
			});
		}

		render(
			plot_header_options,
			html`
				${data_source = select({
					values: media_list,
					func: (val: string) => {
						selected_data_source = val;
						check_if_allow();
					},
					initial: selected_data_source,
				})}
				${user = select({
					values: user_list,
					func: (val: string) => {
						selected_user = val;
						check_if_allow();
					},
					initial: user_list.find((user) =>
							user.value && user.value == selected_user
						)
						? selected_user
						: '',
				})}
				${icon({ name: icons.animated_dots })}
				<button class="btn primary icon" data-type="plot" onclick=${() =>
					add_data_point()} ref=${(el) => add_data_point_btn = el}>
				    ${tl(trans.plot.name)}
				</button>
			`,
		);

		check_if_allow();
	}

	async function plot_footer() {
		render(footer, html``);

		const nodes = await Promise.all(
			data_points.map(async (point, index) => {
				const cache = await load_profile_cache_externally(point.user);

				let user_name = html.node`
                    <a href="${root}user/${point.user}" />
                `;

				const valid = is_sponsor(point.user);

				if (cache.username && valid) {
					render(
						user_name,
						html`
							<strong class="username-combo">
								<span class="username-custom">${cache
									.username}</span>
								<span class="username-original">
							        <span class="at">@</span>${point.user}
							    </span>
							</strong>
						`,
					);
				} else {
					render(
						user_name,
						html`
							<strong><span class="at">@</span>${point
								.user}</strong>
						`,
					);
				}

				const elem = html.node`
                    <div class="plot-footer-item">
                        <div class="plot-footer-colour" style="background-color: var(--graph-colour-${
					index % graph_colour_length
				})" />
                        <div class="plot-footer-info">
                            <div class="plot-footer-header">
                                <div class="plot-header-avatar avatar">
                                    <img src=${
					auth.name == point.user ? auth.avatar : cache.avatar
				} alt=${point.user} />
                                </div>
                                ${user_name}
                            </div>
                            <div class="plot-footer-media">
                                ${plot_media_title(point.media)}
                            </div>
                        </div>
                        <div class="plot-footer-action">
                            <button class="btn icon-mask chibi plot-footer-action-btn" data-type="x" onclick=${() => {
					for (let i = data_points.length - 1; i >= 0; i--) {
						let p = data_points[i];
						if (
							(p.user == point.user) && (p.media == point.media)
						) {
							data_points.splice(i, 1);
						}
					}

					if (data_points.length == 0) {
						timeframe.disabled = false;
						refresh_graph_btn.disabled = true;
						refresh_graph_btn.classList.remove('primary');
						timeframe_matches = true;
						current_timeframe = proposed_timeframe;
						check_if_allow();
					}

					update_plot_options();
					plot_footer();
					update_chart();
				}}>
                                ${tl(trans.close)}
                            </button>
                        </div>
                    </div>
                `;

				elem.addEventListener('mouseenter', () => {
					highlight_data_set(index);
				});

				elem.addEventListener('mouseleave', () => {
					highlight_data_set(null);
				});

				return elem;
			}),
		);

		render(
			footer,
			html`
				${nodes}
			`,
		);
	}

	prep_chart_colours();

	let scrobble_canvas_container = document.createElement('div');
	scrobble_canvas_container.classList.add('plot-canvas-container');

	let scrobble_canvas = document.createElement('canvas');
	scrobble_canvas.classList.add('plot-canvas');

	Chart.defaults.font.family = page.state.chart_colours.font;
	const chart = new Chart(scrobble_canvas.getContext('2d'), {
		type: 'line',
		data: {
			datasets: data_points,
		},
		options: {
			color: page.state.chart_colours.text_col,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: false,
				},
				tooltip: {
					backgroundColor: page.state.chart_colours.root_bg_col,
					titleColor: page.state.chart_colours.text_primary_col,
					bodyColor: page.state.chart_colours.text_primary_col,
					footerColor: page.state.chart_colours.text_secondary_col,
					multiKeyBackground: page.state.chart_colours.root_bg_col,
					boxPadding: 6,
					padding: 9,
					cornerRadius: 9,
					caretSize: 0,
					callbacks: {
						title: (context) => {
							const point = context[0].dataset;
							return point.user;
						},
						afterTitle: (context) => {
							const point = context[0].dataset;
							return plot_media_title(point.media);
						},
						label: (context) => {
							const point = context.raw;
							return point.y;
						},
						footer: (context) => {
							const point = context[0].raw;
							return DateTime.fromISO(point.x).toLocaleString(
								DateTime.DATE_MED,
							);
						},
					},
				},
				interaction: {
					mode: 'point',
					intersect: false,
				},
				zoom: {
					pan: {
						enabled: true,
					},
					zoom: {
						wheel: {
							enabled: true,
						},
						drag: {
							enabled: true,
						},
						mode: 'x',
					},
					limits: {
						x: { min: 'original', max: 'original' },
						y: { min: 'original', max: 'original' },
					},
				},
			},
			scales: {
				x: {
					type: 'time',
					time: {
						unit: 'month',
					},
					grid: {
						color: page.state.chart_colours.axis_col,
						display: true,
					},
				},
				y: {
					beginAtZero: true,
					grid: {
						color: page.state.chart_colours.axis_col,
						display: true,
					},
					suggestedMax: 10,
				},
			},
		},
	});

	scrobble_canvas_container.appendChild(scrobble_canvas);

	body.appendChild(scrobble_canvas_container);

	async function fetch_data_set(
		user: string,
		media: string,
		change_history = true,
	) {
		if (change_history) {
			const data_source_history = JSON5.parse(
				localStorage.getItem(keys.plot_data_history) || '[]',
			);
			if (
				!data_source_history.some((item) =>
					JSON5.stringify(item) == JSON5.stringify(media)
				)
			) {
				data_source_history.push(media);
			} else {
				data_source_history.splice(
					data_source_history.indexOf(media),
					1,
				);
				data_source_history.push(media);
			}

			if (data_source_history.length > 30) {
				data_source_history.shift();
			}
			localStorage.setItem(
				keys.plot_data_history,
				JSON5.stringify(data_source_history),
			);
		}

		const data_point = JSON5.parse(media);

		let media_url;
		let type;

		if (data_point.album && data_point.artist) {
			media_url = `${sanitise(data_point.artist)}/${
				sanitise(data_point.album)
			}`;
		} else if (data_point.track && data_point.artist) {
			media_url = `${sanitise(data_point.artist)}/_/${
				sanitise(data_point.track)
			}`;
		} else {
			media_url = sanitise(data_point.artist);
		}

		const url =
			`${root}user/${user}/library/music/${redirect()}${media_url}?${timeframe.value}`;
		console.info('timeframe url', url);

		const res = await fetch(url);
		if (!res.ok) {
			log('failed to fetch', 'plot', 'error', { res });
			return;
		}

		const dom = await res.text();
		const parser = new DOMParser();
		const doc = parser.parseFromString(dom, 'text/html');

		const table = doc.querySelector('.scrobble-table');
		if (!table) {
			log('failed to find table', 'plot', 'error', { table });
			return;
		}

		chart_bucket = table.getAttribute('data-bucket-size') as chart_bucket;

		const entries = table.querySelectorAll('tbody tr');
		console.info('table', table, entries);

		const point = {
			user,
			media: data_point,
			data: [],
			borderWidth: 2,
			fill: true,
			pointRadius: 0,
			pointHitRadius: 20,
			tension: 0.1,
		};

		let seen_over_0 = false;
		const length = Array.from(entries).length;

		entries.forEach((entry, index) => {
			const period = entry.querySelector('.js-period > a')?.getAttribute(
				'href',
			);
			const params = new URLSearchParams(period);

			const from = params.get('from');

			const scrobbles = Number(
				entry.querySelector('.js-scrobbles').textContent.trim(),
			);
			if (scrobbles > 0 || (index + 1) >= length / 2) seen_over_0 = true;

			//if (!seen_over_0 && scrobbles == 0) return;

			point.data.push({
				x: from,
				y: scrobbles,
				hide: !seen_over_0 && scrobbles == 0,
			});
		});

		data_points.push(point);
		update_plot_options();
		plot_footer();
		update_chart(change_history);
	}

	function add_data_point() {
		allow_adding = false;

		add_data_point_btn.disabled = true;
		body.classList.add('loading');
		body.classList.remove('empty');

		fetch_data_set(user.value, data_source.value);
	}

	page.state.update_plot_chart = update_chart;

	function check_if_allow() {
		alert.setAttribute('data-hidden', true);

		const media = data_source.value;
		const user_name = user.value;

		const existing = data_points.find((point) =>
			point.user == user_name && JSON5.stringify(point.media) == media
		);

		if (
			existing || !timeframe_matches || data_source.value == '' ||
			user.value == ''
		) {
			allow_adding = false;
			add_data_point_btn.disabled = true;

			if (!timeframe_matches) {
				alert.setAttribute('data-hidden', false);
				render(
					alert,
					html`
						<div class="alert alert-warning">
						    ${tl(trans.refresh_plot_alert)}
						</div>
					`,
				);
			}

			return;
		}

		allow_adding = true;
		add_data_point_btn.disabled = false;
		timeframe.disabled = false;
	}

	function update_chart(update_body = true) {
		highlight_data_set(null, false);

		load_chart_colours();
		const computed = getComputedStyle(document.body);

		const graph_colours = Array.from(
			{ length: graph_colour_length },
			(_, i) => `${computed.getPropertyValue(`--graph-colour-${i}`)}`,
		);

		const graph_colour_gradient = Array.from(
			{ length: graph_colour_length },
			(_, i) =>
				`${
					computed.getPropertyValue(`--graph-colour-${i}`).slice(
						0,
						-1,
					)
				} / 10%)`,
		);

		chart.options.color = page.state.chart_colours.text_col;
		chart.options.plugins.tooltip.backgroundColor =
			page.state.chart_colours.root_bg_col;
		chart.options.plugins.tooltip.titleColor =
			page.state.chart_colours.text_primary_col;
		chart.options.plugins.tooltip.bodyColor =
			page.state.chart_colours.text_primary_col;
		chart.options.plugins.tooltip.footerColor =
			page.state.chart_colours.text_secondary_col;
		chart.options.plugins.tooltip.multiKeyBackground =
			page.state.chart_colours.root_bg_col;

		chart.options.scales.x.grid.color = page.state.chart_colours.axis_col;
		chart.options.scales.y.grid.color = page.state.chart_colours.axis_col;

		chart.options.plugins.zoom = {
			pan: {
				enabled: true,
			},
			zoom: {
				wheel: {
					enabled: true,
				},
				drag: {
					enabled: true,
				},
				mode: 'x',
			},
			limits: {
				x: { min: 'original', max: 'original' },
				y: { min: 'original', max: 'original' },
			},
		};

		if (chart_bucket == 'YEARLY') {
			chart.options.scales.x.time = {
				unit: 'year',
			};
		} else if (chart_bucket == 'MONTHLY') {
			chart.options.scales.x.time = {
				unit: 'month',
			};
		} else if (chart_bucket == 'DAILY') {
			chart.options.scales.x.time = {
				unit: 'day',
			};
		} else if (chart_bucket == 'HOURLY') {
			chart.options.scales.x.time = {
				unit: 'hour',
			};
		}

		/*
        graph_colours.forEach((colour, index) => {
            page.structure.side.appendChild(html.node`<div style="background-color: var(--graph-colour-${index}); display: block; width: 40px; height: 40px"></div>`);
        });
        */

		data_points.forEach((point, index) => {
			point.backgroundColor = (context) => {
				const chart = context.chart;
				const { ctx, chartArea } = chart;

				if (!chartArea) return 'transparent';

				const gradient = ctx.createLinearGradient(
					0,
					chartArea.top,
					0,
					chartArea.bottom,
				);
				gradient.addColorStop(
					0,
					graph_colour_gradient[index % graph_colour_gradient.length],
				);
				gradient.addColorStop(1, 'transparent');

				return gradient;
			};
			point.borderColor = graph_colours[index % graph_colours.length];
		});

		if (update_body) {
			body.classList.toggle('empty', data_points.length == 0);
			body.classList.remove('loading');
		}

		chart.update();

		check_if_allow();
	}

	function add_new_data_source() {
		let artist;
		let album;
		let track;

		const random =
			random_list[Math.floor(Math.random() * random_list.length)];

		dialog({
			id: 'add_new_data_source',
			title: tl(trans.data_source),
			body: html.node`
                <p class="modal-explain">${tl(trans.data_source_explain)}</p>
                <div class="new-scrobble-form">
                    <div class="form-combo">
                        <div class="form-inner">
                            <p class="generic-label">${tl(trans.track)}</p>
                            ${track = input({
				type: 'text',
				placeholder: tl(trans.example, { v: random.track }),
				func: check_if_matching,
				submit_on_character: true,
			})}
                            <p class="generic-label">${tl(trans.album)}</p>
                            ${album = input({
				type: 'text',
				placeholder: tl(trans.example, { v: random.album }),
				func: check_if_matching,
				submit_on_character: true,
			})}
                        </div>
                        <div class="form-actions">
                            ${() => {
				const btn = html.node`
                                    <button class="btn chibi icon subtle" data-type="switch" onclick=${() => {
					const track_val = track.value;
					const album_val = album.value;

					if (!track_val && !album_val) return;

					track.value = album_val;
					album.value = track_val;
				}}>
                                        ${tl(trans.switch)}
                                    </button>
                                `;

				tippy(btn, {
					content: btn.textContent,
				});

				return btn;
			}}
                        </div>
                    </div>
                    <div class="form-inner">
                        <p class="generic-label">${tl(trans.artist)}</p>
                        ${artist = input({
				type: 'text',
				placeholder: tl(trans.example, { v: random.artist }),
				warn_if_empty: true,
			})}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="see-more cancel left-icon" onclick=${() =>
				dialog_rm({ id: 'add_new_data_source' })}>
                        ${tl(trans.cancel)}
                    </button>
                    <div class="fill" />
                    <button class="btn primary icon" data-type="plus" onclick=${complete_add}>
                        ${tl(trans.add)}
                    </button>
                </div>
            `,
		});

		function check_if_matching() {
			const track_val = track.value;
			const album_val = album.value;

			if (track_val && !album_val) {
				album.disabled(true);
				track.disabled(false);
				return;
			}

			if (album_val && !track_val) {
				album.disabled(false);
				track.disabled(true);
				return;
			}

			album.disabled(false);
			track.disabled(false);
		}

		function complete_add() {
			if (!artist.value) {
				notify({
					type: 'error',
					title: tl(trans.data_source),
					body: tl(trans.artist_required),
				});
				return;
			}

			if (album.value && track.value) {
				notify({
					type: 'error',
					title: tl(trans.data_source),
					body: tl(trans.choose_either_an_album_or_track),
				});
				return;
			}

			temporary_data_source = {
				artist: artist.value,
			};

			if (album.value) {
				temporary_data_source.album = album.value;
			} else if (track.value) {
				temporary_data_source.track = track.value;
			}

			const data_source_history = JSON5.parse(
				localStorage.getItem(keys.plot_data_history) || '[]',
			);

			const existing = data_source_history.find((point) =>
				point == JSON5.stringify(temporary_data_source)
			);
			if (existing) {
				notify({
					type: 'error',
					title: tl(trans.data_source),
					body: tl(trans.already_exists),
				});
				return;
			}

			dialog_rm({ id: 'add_new_data_source' });
			selected_data_source = JSON5.stringify(temporary_data_source);
			update_plot_options();
		}
	}

	function add_new_user() {
		let user_name;
		let add_as_close_friend;

		dialog({
			id: 'add_new_user',
			title: tl(trans.profile),
			body: html.node`
                <div class="new-scrobble-form">
                    <div class="form-inner">
                        <p class="generic-label">${tl(trans.username.name)}</p>
                        ${user_name = input({
				type: 'text',
				submit_on_character: true,
			})}
                    </div>
                    <div class="form-inner">
                        ${add_as_close_friend = toggle({
				type: 'checkbox',
				title: tl(trans.add_as_friend),
			})}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="see-more cancel left-icon" onclick=${() =>
				dialog_rm({ id: 'add_new_user' })}>
                        ${tl(trans.cancel)}
                    </button>
                    <div class="fill" />
                    <button class="btn primary icon" data-type="plus" onclick=${complete_add}>
                        ${tl(trans.add)}
                    </button>
                </div>
            `,
		});

		function complete_add() {
			if (!user_name.value) {
				notify({
					type: 'error',
					title: tl(trans.profile),
					body: tl(trans.username_required),
				});
				return;
			}

			if (add_as_close_friend.checked()) {
				const existing = settings.friends.find((user) =>
					user.toLowerCase() == user_name.value.toLowerCase()
				);
				if (existing) {
					notify({
						type: 'error',
						title: tl(trans.profile),
						body: tl(trans.already_a_close_friend),
					});
				} else {
					settings.friends.push(user_name.value);
					save_setting('friends', settings.friends);
				}
			}

			dialog_rm({ id: 'add_new_user' });
			temporary_user = user_name.value;
			selected_user = user_name.value;
			update_plot_options();
		}
	}

	function highlight_data_set(index: number | null, update = true) {
		data_points.forEach((point, i) => {
			if (i == index) {
				point.borderWidth = 4;
			} else {
				point.borderWidth = 2;
			}
		});

		if (update) chart.update();
	}
}

interface plot_media {
	artist: string;
	album?: string;
	track?: string;
}

function plot_media_title(data: plot_media, fancy = false) {
	let text;
	let icon_name;

	if (data.album) {
		text = `${romanise(correct_artist(data.artist))} - ${
			romanise(correct_item_by_artist(data.album, data.artist))
		}`;
		icon_name = icons.album;
	} else if (data.track) {
		text = `${romanise(correct_artist(data.artist))} - ${
			romanise(correct_item_by_artist(data.track, data.artist))
		}`;
		icon_name = icons.track;
	} else {
		text = romanise(correct_artist(data.artist));
		icon_name = icons.artist;
	}

	if (fancy) {
		return html`<span class="bleh-icon" data-type=${icon_name} style="--icon: var(--mask)" />${text}`;
	}

	return text;
}

function generic_user_title(user: string, type = 'user', fancy = false) {
	let icon_name;

	if (type == 'user') {
		icon_name = icons.user;
	} else if (type == 'starred') {
		icon_name = icons.starred_friend;
	} else {
		icon_name = icons.users;
	}

	if (fancy) {
		return html`<span class="bleh-icon" data-type=${icon_name} style="--icon: var(--mask)" />${user}`;
	}

	return user;
}
