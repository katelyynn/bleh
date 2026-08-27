/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { lang, tl, trans } from '@/build/trans';
import { html, render } from 'lighterhtml';
import { select } from '@/components/settings/select';
import { setting } from '@/components/settings/settings';
import { input } from '@/components/settings/input';
import { auth, page, root } from '@/build/page';
import { notify, notify_rm } from '@/components/dialog/notify';
import { clean_number, pad2, sanitise } from '@/build/tools';
import { log } from '@/build/log.ts';
import { music_grids } from '@/components/music/music_grid';
import { settings } from '@/build/config';
import { version } from '@/main';
import { download } from '@/components/dialog/share';
import { render_user } from '@/pages/home/minis.js';
import { redirect } from '@/components/music/music';
import tippy from 'tippy.js';
import html2canvas from 'html2canvas-pro';
import { icon, icons } from '../shared/icon';
import { hybrid_timeframe_picker, timeframe_text } from '../date/timeframe';
import { avatar } from '../shared/avatar';
import { useSettings } from '@/page.ts';

export function collage({ host, sidebar } = {}) {
	if (!host || !sidebar) return;

	let width;
	let height;

	let timeframe;
	let type;

	let settings_btn;
	let submit;
	let body;

	const value = 3;
	const min = 1;
	const max = 20;

	const current_year = new Date().getFullYear();
	const previous_year = current_year - 1;

	const default_type = page.requested.type || 'albums';
	const default_timeframe = page.requested.timeframe ||
		'date_preset=LAST_30_DAYS';

	if (page.requested.redirect) {
		setTimeout(() => {
			notify({
				id: 'collage_redirect',
				title: tl(trans.collage),
				body: tl(trans.collage_redirect),
				icon: 'icon-16-collage',
				persist: true,
			});
		}, 100);
	}

	let user;
	render(
		host,
		html`
			<div class="compare-header">
				<div class="compare-users">
					<div class="compare-user focus" ref=${(el) => (user = el)}>
			            ${render_user(page.name, page.avatar, user, true)}
			        </div>
				</div>
				<div class="compare-selection">
			        <div class="input-group">
			            ${(width = input({
				type: 'number',
				value: value,
				placeholder: value,
				min: min,
				max: max,
			}))}
			            ${icon({ name: icons.x })}
			            ${(height = input({
				type: 'number',
				value: value,
				placeholder: value,
				min: min,
				max: max,
			}))}
			        </div>
			        ${type = select({
				values: [
					{
						text: tl(trans.item_type),
					},
					{
						value: 'artists',
						text: html`<div
                                    class="bleh-icon"
                                    style="--icon: var(--icon-16-artist)"
                                />
                                ${tl(trans.artists)}`,
					},
					{
						value: 'albums',
						text: html`<div
                                    class="bleh-icon"
                                    style="--icon: var(--icon-16-album)"
                                />
                                ${tl(trans.albums)}`,
					},
					{
						value: 'tracks',
						text: html`<div
                                    class="bleh-icon"
                                    style="--icon: var(--icon-16-track)"
                                />
                                ${tl(trans.tracks)}`,
					},
				],
				initial: default_type,
			})}
			        ${timeframe = hybrid_timeframe_picker({
				initial: default_timeframe,
			})}
			        <button
			            class="btn primary icon"
			            data-type="collage"
			            ref=${(el) => (submit = el)}
			            onclick=${() => init_collage()}
			        >
			            ${tl(trans.generate)}
			        </button>
			    </div>
			</div>
			<div
				class="compare-body"
				data-filled="false"
				ref=${(el) => (body = el)}
			>
				<div class="placeholder-block">
					<div class="placeholder-head">(๑>◡<๑)</div>
					<div class="placeholder-summary">${tl(
						trans.choose_a_timeframe_above,
					)}</div>
				</div>
			</div>
		`,
	);

	let setting_group;
	let inputter;
	render(
		sidebar,
		html`
			<h2>${tl(trans.settings)}</h2>
			<div class="setting-group" ref=${(el) => (setting_group = el)}>
			    <div class="setting v" data-type="text">
			        <div class="heading">
			            <h5>${tl(trans.profile)}</h5>
			        </div>
			        <div class="input-container content-form">
			            <input
			                type="text"
			                class="input"
			                ref=${(el) => (inputter = el)}
			                placeholder=${tl(trans.enter_a_profile)}
			                value=${page.requested.profile}
			                onchange=${(e) => {
				page.requested.profile = e.target.value;
				page.name = page.requested.profile;

				page.avatar = '';
				if (page.name == auth.name) {
					page.avatar = auth.avatar;
				}

				render(
					user,
					html`
						${render_user(
							page.name,
							page.avatar,
							user,
							true,
						)}
					`,
				);
			}}
			            />
			            ${() => {
				let btn = html.node`
                            <button class="btn chibi icon" data-type="profile" onclick=${() => {
					inputter.value = auth.name;
					inputter.dispatchEvent(new Event('change'));
				}}>${tl(trans.profile)}</button>
                        `;

				tippy(btn, {
					content: tl(trans.profile),
				});

				return btn;
			}}
			            ${() => {
				let btn = html.node`
                            <button class="btn chibi icon colourful" data-type="starred_friend" data-starred=${
					useSettings.get('starred_friend') != ''
				} onclick=${() => {
					if (useSettings.get('starred_friend') == '') return;

					inputter.value = useSettings.get('starred_friend');
					inputter.dispatchEvent(new Event('change'));
				}}>${tl(trans.starred_friend.name)}</button>
                        `;

				tippy(btn, {
					content: tl(trans.starred_friend.name),
				});

				return btn;
			}}
			        </div>
			    </div>
			    ${setting({ id: 'collage_title' })}
			    ${setting({ id: 'collage_grid_gap' })}
			    ${setting({ id: 'collage_centered' })}
			    ${setting({ id: 'collage_grid_text' })}
			    ${setting({ id: 'collage_grid_plays' })}
			</div>
		`,
	);
	let collage_settings = setting_group.querySelectorAll(':scope > .setting');

	function init_collage(bypass = false) {
		try {
			make_collage(bypass);
		} catch (e) {
			collage_error(e);
		}
	}

	function collage_error(e) {
		render(
			body,
			html`
				<div class="loading-data-container">
					<div class="alert alert-error">${e && e.message
						? e.message
						: e}</div>
				</div>
			`,
		);

		console.error(e);

		type.querySelector('button').disabled = false;
		timeframe.disabled = false;
		collage_settings.forEach((option) => {
			option.setAttribute('disabled', false);
		});
		submit.disabled = false;
	}

	function make_collage(bypass = false) {
		if (
			width.value == '' ||
			height.value == '' ||
			parseInt(width.value) < min ||
			parseInt(width.value) > max ||
			parseInt(height.value) < min ||
			parseInt(height.value) > max
		) {
			notify({
				id: 'collage_failed',
				title: tl(trans.name_failed).replace(
					'{name}',
					tl(trans.collage),
				),
				body: tl(trans.your_settings_are_invalid),
				type: 'error',
			});
			return;
		}

		if (!auth.name) {
			notify({
				id: 'collage_failed',
				title: tl(trans.name_failed).replace(
					'{name}',
					tl(trans.collage),
				),
				body: tl(trans.you_need_to_be_logged_in),
				type: 'error',
			});
			return;
		}

		let per_page = 50; // decided by last.fm
		let pages = Math.ceil((width.value * height.value) / per_page);

		if (pages > 4 && !bypass) {
			let warn = notify({
				id: 'collage_warning',
				title: tl(trans.are_you_sure),
				body: tl(trans.this_will_require_loading_count_pages).replace(
					'{c}',
					pages,
				),
				type: 'warning',
				actions: [
					{
						type: 'check',
						action: () => {
							notify_rm(warn);
							init_collage(true);
						},
						text: tl(trans.continue),
					},
				],
				persist: true,
			});
			return;
		}

		type.querySelector('button').disabled = true;
		timeframe.disabled = true;
		collage_settings.forEach((option) => {
			option.setAttribute('disabled', true);
		});
		submit.disabled = true;

		page.state.collage = [];
		get_grid(1, pages);
	}

	function get_grid(current_page, pages) {
		render(
			body,
			html`
				<div class="loading-data-container">
					<div class="loading-data-text">
				        ${tl(trans.gathering_plays_for_user_pages)
					.replace('{u}', page.name)
					.replace('{current_page}', current_page)
					.replace('{pages}', pages)}
				    </div>
				</div>
			`,
		);

		fetch(
			`${root}user/${page.name}/library/${type.value}?format=list&${timeframe.value}&page=${current_page}&ajax=1`,
		)
			.then(function (response) {
				console.log('returned', response, response.text);

				return response.text();
			})
			.then(function (dom) {
				let doc = new DOMParser().parseFromString(dom, 'text/html');
				console.log('DOC', doc);

				let next_button = doc.querySelector('.pagination-next');

				try {
					let tracks = doc.querySelectorAll('.chartlist-row');
					tracks.forEach((track) => {
						let item = {};

						item.avatar = track.querySelector(
							'.chartlist-image img',
						);
						if (item.avatar) {
							item.avatar = item.avatar.getAttribute('src');
						}
						item.name = track
							.querySelector('.chartlist-name a')
							.textContent.trim();
						if (type.value != 'artists') {
							item.sister = track
								.querySelector('.chartlist-artist a')
								.textContent.trim();
						}
						item.plays = clean_number(
							track
								.querySelector('.chartlist-count-bar-slug')
								.getAttribute('data-stat-value'),
						);

						page.state.collage.push(item);
					});
				} catch (e) {
					notify({
						id: 'collage_failed',
						title: tl(trans.name_failed).replace(
							'{name}',
							tl(trans.collage),
						),
						body: tl(trans.there_was_a_network_error),
						type: 'error',
					});
					console.error(e);
				}

				if (next_button && current_page < pages) {
					get_grid(current_page + 1, pages);
				} else {
					continue_collage();
				}
			});
	}

	async function continue_collage() {
		try {
			log(
				'gathered initial values',
				'collage',
				'info',
				page.state.collage,
			);

			if (page.state.collage.length == 0) {
				render(
					body,
					html`
						<div class="loading-data-container">
							<div class="loading-data-text failed">
						        ${tl(trans.no_plays_in_range)}
						    </div>
						</div>
					`,
				);

				type.querySelector('button').disabled = false;
				timeframe.disabled = false;
				collage_settings.forEach((option) => {
					option.setAttribute('disabled', false);
				});
				submit.disabled = false;

				return;
			}

			let grid = html.node`
                <ol class="grid-items grid-items--numbered collage-grid" style="--width: ${width.value}; --height: ${height.value}" data-width=${width.value} data-height=${height.value} data-centered=${settings.collage_centered} />
            `;

			if (!settings.collage_grid_gap) {
				grid.style.setProperty('--item-list-gap', '0px');
				grid.style.setProperty('--radius-s', '0');
			}

			let total = width.value * height.value - 1;
			grid.style.setProperty(
				'--highest',
				Math.max(+width.value, +height.value).toString(),
			);

			page.state.collage.some((data, index) => {
				if (index > total) return false;

				let template;
				if (type.value == 'artists') template = sanitise(data.name);
				else {template = `${sanitise(data.sister)}/${
						sanitise(data.name)
					}`;}

				grid.appendChild(html.node`
                    <li class="compare-item grid-items-item">
                        <div class="grid-items-cover-image">
                            <div class="grid-items-cover-image-image ${
					data.avatar.endsWith(
							'/c6f59c1e5e7240a4c0d427abd71f3dbb.jpg',
						) ||
						data.avatar.endsWith(
							'/2a96cbd8b46e442fc41c2b86b821562f.jpg',
						)
						? 'grid-items-cover-default'
						: ''
				}">
                                <img src="${
					avatar(data.avatar, '500x500')
				}" alt=${data.name} loading="lazy">
                            </div>
                            ${
					(
							settings.collage_grid_text ||
							settings.collage_grid_plays
						)
						? html.node`
                            <div class="grid-items-item-details">
                                ${
							settings.collage_grid_text
								? html.node`
                                <p class="grid-items-item-main-text">
                                    <a class="link-block-target" href="${root}music/${redirect()}${template}" title="${data.name}">
                                        ${data.name}
                                    </a>
                                </p>
                                `
								: ''
						}
                                ${
							type.value != 'artists'
								? html.node`
                                <p class="grid-items-item-aux-text">
                                    ${
									settings.collage_grid_text
										? html.node`
                                    <a class="grid-items-item-aux-block" href="${root}music/${redirect()}${data.sister}">
                                        ${data.sister}
                                    </a>
                                    ${
											settings.collage_grid_plays
												? html.node`
                                    <a class="grid-item-plays icon-mask" href="${root}user/${page.name}/library/music/${redirect()}${template}?date_preset=${timeframe.value}" target="_blank">
                                        ${data.plays.toLocaleString(lang)}
                                    </a>
                                    `
												: ''
										}
                                    `
										: settings.collage_grid_plays
										? html.node`
                                    <a class="grid-item-plays icon-mask" href="${root}user/${page.name}/library/music/${redirect()}${template}?date_preset=${timeframe.value}" target="_blank">
                                        ${
											tl(trans.count_plays, {
												c: data.plays.toLocaleString(
													lang,
												),
											})
										}
                                    </a>
                                    `
										: ''
								}
                                </p>
                                `
								: html.node`
                                ${
									settings.collage_grid_plays
										? html.node`
                                <p class="grid-items-item-aux-text">
                                    <a class="grid-item-plays icon-mask" href="${root}user/${page.name}/library/music/${redirect()}${template}?date_preset=${timeframe.value}" target="_blank">
                                        ${
											tl(trans.count_plays, {
												c: data.plays.toLocaleString(
													lang,
												),
											})
										}
                                    </a>
                                </p>
                                `
										: ''
								}
                                `
						}
                            </div>
                            `
						: ''
				}
                        </div>
                    </li>
                `);
			});

			let collage_dom = html.node`
                <div class="collage">
                    ${
				settings.collage_title
					? html.node`
                    <div class="header">
                        <div class="type" data-type=${type.value}>
                            <div class="bleh-icon" />
                            <svg class="brand" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 92.328 35.064"><path d="M8.845.086c-.443.15-.91-.136-1.348.086-1.06-.216-2.146 0-3.203.025-.617-.03-1.358-.016-1.862.3-.471.752-.694 1.59-.827 2.462-.162.653-.598 1.207-.432 1.896-.183.59-.64 1.07-.526 1.733-.037.928.034 1.916-.349 2.775-.055 1.148.052 2.344-.147 3.462.2 1.582.008 3.197.098 4.784-.45 1.182-.07 2.422-.12 3.633-.321.737.223 1.476-.035 2.23-.034.618-.25 1.224.116 1.789.179.472-.333 1.07.265 1.363.592.691.374 1.735 1.034 2.392.254.654.387 1.355.959 1.826.28.555.559 1.104 1.035 1.534.792.806 1.918 1.201 2.975 1.546.339-.011.642.474 1.07.327.544-.174.94.384 1.504.284.55.165 1.074.497 1.646.207.698-.094 1.392.667 2.018.131.634-.339 1.402-.52 1.842-1.13.844.516 1.713-.256 2.496-.557.498-.389.594-1.149 1.227-1.424.522-.493.986-1.023 1.605-1.392.417-.365.83-.769.824-1.349.276-.426 1.02-.419.924-1.045.143-1.093 1.033-2.128.66-3.255-.337-.413.293-.89.076-1.397.146-.837-.098-1.707-.038-2.52.765-.93.005-2.104-.454-2.99-.114-.652-.683-.834-1.066-1.264-.392-.608-.982-1.014-1.567-1.407a2.27 2.27 0 0 0-1.821-1.321c-1.409-.496-2.8-1.23-4.333-1.172-.467.042-.96-.128-1.384-.11-.67.506-1.477.765-2.276.987-.213.46-.462.916-.842 1.26.152-.759.32-1.529.406-2.289.506-.5.322-1.251.463-1.893.081-1.152.013-2.324.149-3.462-.374-1.17.39-2.358-.04-3.526-.324-.962.47-1.974-.051-2.884-.133-.438-.059-.934-.671-.645m66.45-.018c-.822-.108-1.283 1-2.094.671-.377-.308-.774-.496-1.235-.229-.54.176-1.252.255-1.33.925-.193.505-.142 1.044-.294 1.56.253 1.015-.198 2.059-.007 3.099-.028.668-.097 1.353-.038 2.041-.005.638.047 1.255.004 1.886-.007.613-.073 1.25.097 1.838-.282.64.036 1.343-.043 2.018.193.473.09.914-.038 1.394-.237.705.114 1.427-.054 2.131.135.799-.112 1.689.092 2.443.438.262.602.723.132 1.055-.424.573-.36 1.361-.404 2.022.367 1.027-.1 2.163.194 3.227.238.658.07 1.31-.044 1.97.049.776.016 1.558.145 2.324-.209.547-.13 1.076.084 1.602.171.89.303 1.978 1.078 2.533.613.212 1.263.684 1.9.371.503-.558 1.268-.842 1.992-.967.955-.245 2.253.293 2.901-.683.411-1.105.053-2.332 0-3.47.107-1.002.54-1.995.49-3.035-.026-1.019.402-2.031.085-3.052a44 44 0 0 0-.198-1.914c.657-.198 1.087-.881 1.821-.823.51-.267.643.075.903.448.146.466.877.336.933.9.374.838 1.46 1.353 1.277 2.385.087 1.485.112 3.041.816 4.393.12.532-.245 1.104-.071 1.673.113.43.276.835.025 1.26-.189.998.845 1.69 1.587 2.092.464-.077.85.019 1.262.24.807.345 1.823.13 2.298-.632.333-.464.857-.205 1.284-.17.777.025.887-.798.968-1.382.132-.887.327-1.765.218-2.665.18-.82.024-1.656.14-2.485-.067-.682-.099-1.38.157-2.033-.208-1.246-.18-2.55-.412-3.795-.006-.72-.439-1.37-.633-2.057-.186-.78-.383-1.636-1.123-2.107-.74-.91-1.72-1.616-2.327-2.633-.49-.52-1.229-.65-1.788-1.075-.37-.227-.883-.065-1.215-.096-.304-.664-1.165-.588-1.723-.844-.814-.014-1.651.131-2.464-.088-.518-.099-1.181.092-1.436-.509-.778-.683-.64-1.78-.514-2.704.152-.973.03-1.963.026-2.928.17-.515-.325-1.128.208-1.513.402-.701-.297-1.379-.431-2.069-.256-.54-.385-1.269-.84-1.638-.86.012-1.463-.709-2.237-.905l-.062-.007zM29.669 3.012c-.75-.07-1.347.538-1.472 1.244-.18.612-.951 1.067-.837 1.747.307.448-.25.959-.236 1.453-.113.673.115 1.342-.073 2.012-.127 1.25.063 2.524-.253 3.755.078 1.532-.202 3.06-.059 4.591-.138.767-.112 1.662-.712 2.237-.375.613.496 1.01.125 1.637-.056.575-.246 1.213-.186 1.751.538.33.136.954.58 1.332.437.428-.045 1.062.207 1.59.156.576.558 1.015.578 1.633.273.905.828 1.693 1.277 2.508.518.72 1.347 1.15 1.858 1.855.78.355 1.512.934 2.324 1.145 1.061-.268 2.129.215 3.205.17 1.088.22 2.28.32 3.34-.072.598-.378.695-1.128.612-1.786.09-.513-.47-1.169.15-1.504.554-.563.404-1.458-.213-1.904-.39-.364-.754-.76-.953-1.25-.239-.437-.786-.511-1.23-.61-.646.13-1.28-.215-1.888-.38-.59-.37-.5-1.222-1.055-1.653-.318-.522-.296-1.187-.06-1.747-.284-.593-.657-1.173-.414-1.856.111-.83-.04-1.65-.117-2.467.18-.773.338-1.559.717-2.265-.196-1.668.167-3.356.272-5.023.377-1.784.49-3.604.633-5.416.205-.591-.005-1.283-.616-1.528-.128-.387-.952-.063-1.354-.153-.723.035-1.37-.341-2.085-.294-.67-.304-1.285-.866-2.065-.752m25.2 4.392c-.555.372-1.18.567-1.819.705-.59.439-1.33.45-2.027.479-.66.269-1.103.905-1.745 1.233-.54.411-1.096.974-1.257 1.622-.219.397-.522.817-.903 1.123-.312.507-1.173.416-1.232 1.11-.464 1.071-1.356 1.954-1.435 3.175-.133.662-.299 1.32-.151 1.99-.338 1.079-.676 2.203-.375 3.335-.09.958.236 1.896.033 2.855.663 1.176.815 2.56 1.39 3.76.442.495.991.92 1.09 1.625 1.042.773 2.47.979 3.262 2.082.752.532 1.674.791 2.498 1.205.76.333 1.61.16 2.38.408.748.1 1.497.186 2.251.174.533.053 1.048-.196 1.57-.253.532-.29 1.087-.482 1.698-.48 1.042-.215 1.751-1.09 2.652-1.59.367-.363.942-.594.899-1.222.37-.717-.343-1.262-.585-1.859-.344-1.213-1.319-2.1-1.98-3.139-.815-.242-1.79-.313-2.456.31-.593.324-1.356.235-2.015.318-.577-.242-1.174-.22-1.78-.173-.752-.15-1.61-.105-2.146-.765-.57-.415-.487-1.244-.916-1.792-.277-.29.478-.268.702-.244.339-.046.658.013.96-.048.6-.007 1.192-.187 1.813-.114 1.903.05 3.805-.07 5.705-.043 1.443.231 2.898-.167 4.198-.761.478-.298.986-.905.658-1.479.172-.472.664-.854.677-1.424.125-1.125.155-2.26.284-3.388.18-.569-.093-1.098-.254-1.608.097-1.013-.642-1.82-1.33-2.481-.363-.604-.672-1.297-1.328-1.663-.848-.647-1.624-1.383-2.424-2.08-.862.15-1.506-.881-2.391-.613-.727.287-1.463-.31-2.232-.157a3.3 3.3 0 0 1-1.74-.24zm2.927 6.092c.727-.088.322 1.023.94 1.031.53.089.081.866.511 1.192.141.371.044 1.009.05 1.478-1.188.316-2.38-.19-3.5-.458-.648.179-1.287.088-1.93.019-.552.129-1.104.337-1.643.026-.466-.041-.716-.217-.321-.608.434-.725.978-1.482 1.737-1.897 1.176.033 2.254-.462 3.397-.662.254-.029.51-.227.76-.121M12.071 21.42c.616.261 1.296.19 1.927.144.14.462.553.78.758 1.17-.1.813-.058 1.655-.152 2.451-.304.43-.604.951-1.055 1.202-.548.163-1.18.096-1.633.527-.448.184-.96.275-1.383.475-.497-.276-.29-1.007-.691-1.391-.398-.305-.455-.82-.816-1.154-.4-.823-.431-1.975.41-2.54.433-.516 1.014-.825 1.703-.802.31-.019.622-.101.932-.082"/></svg>
                            <strong>${timeframe_text(timeframe.value)}</strong>
                            <strong>${
						tl(trans.top_type).replace(
							'{type}',
							tl(trans[type.value]),
						)
					}</strong>
                            <strong>${width.value}×${height.value}</strong>
                        </div>
                        <div class="user">
                            <div class="avatar">
                                <img src="${page.avatar}" alt="${
						tl(trans.avatar_for_user).replace('{u}', page.name)
					}">
                            </div>
                            <strong>${page.name}</strong>
                        </div>
                    </div>
                    `
					: ''
			}
                    ${grid}
                </div>
            `;
			render(
				body,
				html`
					<div class="loading-data-container">
					    <div class="loading-data-text">
					        ${tl(trans.waiting_for_images)}
					    </div>
					</div>
					${collage_dom}
				`,
			);

			music_grids(grid, false);

			// 10 = item-list-gap
			// 15 = card-gap
			const default_size = 380;
			const base = 6;
			const highest = Math.max(+width.value, +height.value);

			const grid_item_size = Math.min(
				default_size,
				Math.floor((default_size * base) / highest),
			);
			const grid_item_gap = settings.collage_grid_gap ? 6 : 0;
			const padding = settings.collage_grid_gap ? 15 : 0;
			const title_height = settings.collage_title ? 32 + 15 : 0;
			const cv_width = padding * 2 +
				grid_item_size * width.value +
				grid_item_gap * (width.value - 1);
			const cv_height = padding * 2 +
				title_height +
				grid_item_size * height.value +
				grid_item_gap * (height.value - 1);

			const cv_scale = 1;

			collage_dom.style.width = `${cv_width}px`;
			collage_dom.style.height = `${cv_height}px`;
			collage_dom.style.padding = `${padding}px`;
			collage_dom.style.gap = `${padding}px`;
			collage_dom.style.setProperty(
				'--item-list-gap',
				`${grid_item_gap}px`,
			);
			collage_dom.style.setProperty(
				'--grid-item-size',
				`${grid_item_size}px`,
			);

			let initial_canvas = html.node`
                <canvas width=${cv_width * cv_scale} height=${
				cv_height * cv_scale
			} />
            `;

			html2canvas(collage_dom, {
				useCORS: true,
				letterRendering: true,
				canvas: initial_canvas,
				scale: cv_scale,
				onclone: (doc) => {
					doc.querySelectorAll('*').forEach((el) => {
						el.style.setProperty(
							'font-family',
							'Hanken Grotesk, Funnel Sans, Inter, Ubuntu Sans, Spline Sans, Roboto, Noto Sans, Noto Sans JP, Noto Sans KR, Noto Sans TC, Lucida Grande, Verdana, Tahoma, -apple-system, BlinkMacSystemFont, sans-serif',
						);
					});
				},
			}).then((canvas) => {
				canvas.toBlob((blob) => {
					const blob_url = URL.createObjectURL(blob);

					const date = new Date();

					const filename = tl(trans.chart_template_filename, {
						timeframe: timeframe_text(timeframe.value),
						user: page.name,
						type: tl(trans[type.value]),
						size: `${width.value}×${height.value}`,
						brand: version.brand,
						date: `${date.getFullYear()}-${
							pad2(date.getMonth() + 1)
						}-${pad2(date.getDate())}`,
					});

					render(
						body,
						html`
							<div class="collage-canvas">
							    ${canvas}
							    <div class="collage-canvas-actions">
							        <button
							            class="btn primary icon"
							            data-type="download"
							            onclick=${() =>
								download(blob_url, filename)}
							        >
							            ${tl(trans.download)}
							        </button>
							        <button
							            class="btn open"
							            data-type="open"
							            onclick=${() => open(blob_url)}
							        >
							            ${tl(trans.open)}
							        </button>
							    </div>
							</div>
						`,
					);

					type.querySelector('button').disabled = false;
					timeframe.disabled = false;
					collage_settings.forEach((option) => {
						option.setAttribute('disabled', false);
					});
					submit.disabled = false;
				}, 'image/png');
			});
		} catch (e) {
			collage_error(e);
		}
	}
}
