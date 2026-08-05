/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { settings } from '@/build/config';
import { auth, page, root } from '@/build/page';
import { clamp_lit, clamp_sat, hex_to_oklch } from '@/build/tools';
import { tl, trans } from '@/build/trans';
import { dialog, dialog_rm } from '@/components/dialog/dialog';
import { notify, notify_rm } from '@/components/dialog/notify';
import { input } from '@/components/settings/input';
import { select, select_prepare } from '@/components/settings/select';
import { save_setting, setting } from '@/components/settings/settings';
import { expand_avatar } from '@/components/shared/avatar';
import { markdown, markdown_field } from '@/components/markdown/markdown';
import { html, render } from 'lighterhtml';
import tippy from 'tippy.js';
import Cropper from 'cropperjs';
import { ff } from '@/components/settings/sku';
import { toggle } from '@/components/settings/toggle';
import {
	render_chart_preview,
	render_track_preview,
} from '@/components/settings/preview';
import { keys } from '@/components/settings/storage';
import { save_profile_cache } from '../profile/profile';
import { delete_cache } from '@/components/profile/cache';
import { new_indicator } from '@/components/shared/indicator';
import { colour_tile } from '@/components/settings/swatch';

let cropper: Cropper;

export function lastfm_settings_profile() {
	page.token =
		page.structure.main.querySelector('[name="csrfmiddlewaretoken"]').value;

	profile_panel();
	charts_panel();
}

function charts_panel() {
	const charts_panel = page.structure.main.querySelector('#update-chart');
	if (!charts_panel) return;

	charts_panel.classList.add('bleh--panel');

	const alert = charts_panel.querySelector('.alert');

	const form = charts_panel.querySelector('form');

	const original_chart_settings = {
		recent: {
			recent_artwork: form.querySelector(
				'#id_show_recent_tracks_artwork',
			) as HTMLInputElement,
			count: form.querySelector(
				'#id_chart_length_recent_tracks',
			) as HTMLSelectElement,
			recent_realtime: form.querySelector(
				'#id_auto_refresh_recent_tracks',
			) as HTMLInputElement,
		},
		artists: {
			timeframe: form.querySelector(
				'#id_chart_range_top_artists',
			) as HTMLSelectElement,
			style: form.querySelector(
				'#id_chart_style_and_length_top_artists',
			) as HTMLSelectElement,
		},
		albums: {
			timeframe: form.querySelector(
				'#id_chart_range_top_albums',
			) as HTMLSelectElement,
			style: form.querySelector(
				'#id_chart_style_and_length_top_albums',
			) as HTMLSelectElement,
		},
		tracks: {
			count: form.querySelector(
				'#id_chart_length_top_tracks',
			) as HTMLSelectElement,
			timeframe: form.querySelector(
				'#id_chart_range_top_tracks',
			) as HTMLSelectElement,
		},
	};

	let recent_listening_preview;
	let top_artists_preview;
	let top_albums_preview;

	function render_chart(type: 'album' | 'artist', val: string) {
		const split = val.split(',');

		const arrange = split[0];
		const second = Number(split[1]) > 4;

		if (arrange == 'classic') {
			return render_chart_preview(type, second, true);
		}

		if (arrange == 'grid') {
			return render_chart_preview(type, second, false);
		}

		return render_track_preview(false, true, true);
	}

	render(
		charts_panel,
		html`
			<h4>${tl(trans.recents)}</h4>
			${alert}
			<form action="${root}settings#update-chart" name="chart-form" method="post">
			    <input type="hidden" name="csrfmiddlewaretoken" value=${page
				.token}>
			    <div class="inner-preview pad" ref=${(el) =>
				recent_listening_preview = el}>
			        ${render_track_preview(
				false,
				false,
				original_chart_settings.recent.recent_artwork.checked,
			)}
			    </div>
			    <div class="setting-group">
			        <div class="setting" data-type="select">
			            <div class="heading">
			                <h5>${tl(trans.amount_to_display)}</h5>
			            </div>
			            ${select({
				values: select_prepare(original_chart_settings.recent.count),
				initial: original_chart_settings.recent.count.value,
				name: original_chart_settings.recent.count.name,
				in_settings: true,
			})}
			        </div>
			        ${toggle({
				title: tl(trans.recent_artwork),
				value: original_chart_settings.recent.recent_artwork.checked,
				name: original_chart_settings.recent.recent_artwork.name,
				standalone: false,
				func: (val: boolean) => {
					render(
						recent_listening_preview,
						render_track_preview(false, false, val),
					);
				},
			})}
			        ${toggle({
				title: tl(trans.recent_realtime.name),
				body: tl(trans.recent_realtime.body),
				value: original_chart_settings.recent.recent_realtime.checked,
				name: original_chart_settings.recent.recent_realtime.name,
				standalone: false,
			})}
			    </div>
			    <h4>${tl(trans.top_artists)}</h4>
			    <div class="inner-preview pad" ref=${(el) =>
				top_artists_preview = el}>
			        ${render_chart(
				'artist',
				original_chart_settings.artists.style.value,
			)}
			    </div>
			    <div class="setting-group">
			        <div class="setting" data-type="select">
			            <div class="heading">
			                <h5>${tl(trans.default_timeframe)}</h5>
			            </div>
			            ${select({
				values: select_prepare(
					original_chart_settings.artists.timeframe,
				),
				initial: original_chart_settings.artists.timeframe.value,
				name: original_chart_settings.artists.timeframe.name,
				in_settings: true,
			})}
			        </div>
			        <div class="setting" data-type="select">
			            <div class="heading">
			                <h5>${tl(trans.chart_style)}</h5>
			            </div>
			            ${select({
				values: select_prepare(original_chart_settings.artists.style),
				initial: original_chart_settings.artists.style.value,
				name: original_chart_settings.artists.style.name,
				in_settings: true,
				func: (val: string) => {
					render(top_artists_preview, render_chart('artist', val));
				},
			})}
			        </div>
			    </div>
			    <h4>${tl(trans.top_albums)}</h4>
			    <div class="inner-preview pad" ref=${(el) =>
				top_albums_preview = el}>
			        ${render_chart(
				'album',
				original_chart_settings.albums.style.value,
			)}
			    </div>
			    <div class="setting-group">
			        <div class="setting" data-type="select">
			            <div class="heading">
			                <h5>${tl(trans.default_timeframe)}</h5>
			            </div>
			            ${select({
				values: select_prepare(
					original_chart_settings.albums.timeframe,
				),
				initial: original_chart_settings.albums.timeframe.value,
				name: original_chart_settings.albums.timeframe.name,
				in_settings: true,
			})}
			        </div>
			        <div class="setting" data-type="select">
			            <div class="heading">
			                <h5>${tl(trans.chart_style)}</h5>
			            </div>
			            ${select({
				values: select_prepare(original_chart_settings.albums.style),
				initial: original_chart_settings.albums.style.value,
				name: original_chart_settings.albums.style.name,
				in_settings: true,
				func: (val: string) => {
					render(top_albums_preview, render_chart('album', val));
				},
			})}
			        </div>
			    </div>
			    <h4>${tl(trans.top_tracks)}</h4>
			    <div class="inner-preview pad">
			        ${render_track_preview(false, true)}
			    </div>
			    <div class="setting-group">
			        <div class="setting" data-type="select">
			            <div class="heading">
			                <h5>${tl(trans.default_timeframe)}</h5>
			            </div>
			            ${select({
				values: select_prepare(
					original_chart_settings.tracks.timeframe,
				),
				initial: original_chart_settings.tracks.timeframe.value,
				name: original_chart_settings.tracks.timeframe.name,
				in_settings: true,
			})}
			        </div>
			        <div class="setting" data-type="select">
			            <div class="heading">
			                <h5>${tl(trans.amount_to_display)}</h5>
			            </div>
			            ${select({
				values: select_prepare(original_chart_settings.tracks.count),
				initial: original_chart_settings.tracks.count.value,
				name: original_chart_settings.tracks.count.name,
				in_settings: true,
			})}
			        </div>
			    </div>
			    <div class="settings-footer">
			        <button type="submit" class="btn-primary save">
			            ${tl(trans.save)}
			        </button>
			        <input type="hidden" value="chart" name="submit">
			    </div>
			</form>
		`,
	);
}

function profile_panel() {
	const update_picture = page.structure.main.querySelector('#update-picture');
	if (!update_picture) return;

	update_picture.classList.add('bleh--panel');

	const bio_max_length = 500;

	const upload_form = update_picture.querySelector('.avatar-upload-form');
	const avatar_url =
		update_picture.querySelector('.image-upload-preview img').src;
	const upload_finished = update_picture.querySelector('.alert-success');

	if (page.state.avatar_changer && upload_finished) {
		const id = page.state.avatar_changer.getAttribute('data-modal-id');
		dialog_rm({ id });
	}

	const update_profile = page.structure.main.querySelector('#update-profile');
	const alert = update_profile.querySelector('.alert');

	const form_display_name =
		(document.getElementById('id_full_name') as HTMLInputElement).value;
	const form_website =
		(document.getElementById('id_homepage') as HTMLInputElement).value;
	const form_country = document.getElementById(
		'id_country',
	) as HTMLSelectElement;
	const form_about_me =
		(document.getElementById('id_about_me') as HTMLTextAreaElement)
			.textContent;

	const profile_cache =
		JSON.parse(localStorage.getItem(keys.profile_cache)) ||
		{};
	const cache = profile_cache[auth.name];

	delete_cache(cache);

	const markdown_settings = {
		allow_headers: true,
		allow_banners: true,
		allow_icons: true,
		allow_hue: true,
		allow_fonts: true,
		cache,
		take_effect: false,
		allow_socials: true,
		allow_alignment: true,
		allow_lists: true,
	};

	let chars = html.node`
        <p class="tip characters colourful">
            ${tl(trans.value_characters_max, { v: bio_max_length })}
        </p>
    `;
	const about = markdown_field(
		update_about,
		markdown_settings,
		form_about_me,
		'about_me',
		40,
		10,
		tl(trans.anything_you_can_imagine),
		null,
		false,
		false,
		false,
	);
	let preview;

	const accent_setting = html.node`
        <div class="setting" data-type="info" disabled=${!auth.sponsor} />
    `;
	const font_setting = html.node`
        <p class="card-tip" />
    `;

	render(
		page.structure.side,
		html`
			<section class="about-me-preview">
				<h2>${tl(trans.about_me_preview)}</h2>
				<span class="bleh--about-me-preview markdown-body" ref=${(
					el,
				) => (preview = el)} />
			</section>
		`,
	);

	page.structure.main.removeChild(
		page.structure.main.querySelector('#update-profile'),
	);

	// about me
	update_about();

	let country_elem;
	let website_elem;

	render(
		update_picture,
		html`
			<h4>${tl(trans.profile)}</h4>
			${alert}
			<form
			    class="dont-move"
			    action="${root}settings#update-profile"
			    name="profile-form"
			    data-form-type="identity"
			    method="post"
			>
			    <input
			        type="hidden"
			        name="csrfmiddlewaretoken"
			        value="${page.token}"
			    />
			    <div class="setting-group">
			        <div class="setting" data-type="info">
			            <div class="heading">
			                <h5>${tl(trans.avatar)}</h5>
			                <p>${tl(trans.avatar_desc)}</p>
			            </div>
			            <div class="info">
			                <div class="avatar image-uploader" onclick=${() =>
				avatar()}>
			                    <img
			                        src=${avatar_url}
			                        alt=${tl(trans.your_avatar)}
			                        loading="lazy"
			                    />
			                    <div class="avatar-overlay icon-mask" />
			                </div>
			            </div>
			        </div>
			        ${() => {
				const username_regex = /\[name=([^\]]+)\]/;

				const elem = html.node`
                        <div class="setting" data-type="text" disabled=${!auth
					.sponsor}>
                            <div class="heading">
                                <h5>${
					tl(trans.display_name.name)
				}<span class="new-badge sponsor-related">${
					tl(trans.sponsors_only)
				}</span></h5>
                                <p>${tl(trans.display_name.body)}</p>
                            </div>
                            <div class="info v">
                                ${
					input({
						value: cache.username,
						placeholder: auth.name,
						func: (val) => {
							const match = about.value.match(username_regex);

							let new_name = val.trim() ? `[name=${val}]` : '';

							if (!new_name.match(username_regex)) new_name = '';

							if (match) {
								about.value = about.value.replace(
									username_regex,
									new_name,
								);
							} else {
								const trimmed = about.value.trimEnd();

								if (trimmed.length == 0) {
									about.value = new_name;
								} else {
									about.value = trimmed + '\n\n' + new_name;
								}
							}
						},
						submit_on_character: true,
					})
				}
                                ${font_setting}
                            </div>
                        </div>
                    `;

				return elem;
			}}
			        <div class="setting" data-type="text">
			            <div class="heading">
			                <h5>${tl(trans.profile_title)}</h5>
			                <p>${tl(trans.pronoun_tip)}</p>
			            </div>
			            <div class="input-container content-form">
			                <input
			                    type="text"
			                    name="full_name"
			                    value=${form_display_name}
			                    maxlength="36"
			                    id="id_full_name"
			                    data-form-type="other"
			                />
			            </div>
			        </div>
			        <div class="setting" data-type="text" ref=${(el) =>
				website_elem = el} data-hidden=${settings.hide_unused_settings}>
			            <div class="heading">
			                <h5>${tl(trans.website)}</h5>
			            </div>
			            <div class="input-container content-form">
			                <input
			                    type="url"
			                    name="homepage"
			                    value=${form_website}
			                    id="id_homepage"
			                    data-form-type="website"
			                />
			            </div>
			        </div>
			        <div class="setting" data-type="select" ref=${(el) =>
				country_elem = el} data-hidden=${settings.hide_unused_settings}>
			            <div class="heading">
			                <h5>${tl(trans.country)}</h5>
			            </div>
			            <div class="select-wrap custom-selector">
			                ${select({
				values: select_prepare(form_country),
				initial: form_country.value,
				name: form_country.name,
				in_settings: true,
			})}
			            </div>
			        </div>
			        ${() => {
				const banner_regex = /\[banner=([^\]]+)\]/;
				const match = about.value.match(banner_regex);

				const pre_existing = match ? match[1] : '';
				let preview;

				const elem = html.node`
                        <div class="setting" data-type="text">
                            <div class="heading">
                                <h5>${tl(trans.profile_banner.name)}</h5>
                                <p>${tl(trans.profile_banner.body)}</p>
                                <p>${{
					html: tl(trans.aspect_ratio_banner, {
						v: '<strong>1300 / 325</strong>',
					}),
				}}</p>
                            </div>
                            <div class="info v">
                                ${
					input({
						value: pre_existing,
						func: (val) => {
							const match = about.value.match(banner_regex);

							let new_banner = val.trim()
								? `[banner=${val}]`
								: '';

							if (!new_banner.match(banner_regex)) {
								new_banner = '';
							}

							if (match) {
								about.value = about.value.replace(
									banner_regex,
									new_banner,
								);
							} else {
								const trimmed = about.value.trimEnd();

								if (trimmed.length == 0) {
									about.value = new_banner;
								} else {
									about.value = trimmed + '\n\n' + new_banner;
								}
							}

							preview.style.setProperty(
								'background-image',
								`url(${val})`,
							);
							preview.onclick = () => {
								expand_avatar(val);
							};
						},
						submit_on_character: true,
					})
				}
                                <div class="banner-image" ref=${(el) =>
					preview = el} />
                            </div>
                        </div>
                    `;

				preview.style.setProperty(
					'background-image',
					`url(https://images.weserv.nl/?url=${
						encodeURIComponent(pre_existing)
					}&output=webp&n=-1)`,
				);
				preview.onclick = () => {
					expand_avatar(pre_existing);
				};

				return elem;
			}}
			        ${accent_setting}
			        <div class="setting" data-type="text">
			            <div class="heading">
			                <h5>${tl(trans.about)}</h5>
			                ${chars}
			            </div>
			            <div class="${!ff('cosplay')
				? 'input-container content-form textarea'
				: 'limitless'}">
			                ${about}
			            </div>
			        </div>
			        ${() => {
				const status_regex = /\[status=([^\]]+)\]/;
				const match = about.value.match(status_regex);

				const pre_existing = match ? match[1] : '';

				const elem = html.node`
                        <div class="setting" data-type="text">
                            <div class="heading">
                                <h5><a href="https://status.cafe" target="_blank">status.cafe</a></h5>
                                <p>${tl(trans.status_cafe.body)}</p>
                            </div>
                            ${
					input({
						value: pre_existing,
						func: (val) => {
							const match = about.value.match(status_regex);

							let new_status = val.trim()
								? `[status=${val}]`
								: '';

							if (!new_status.match(status_regex)) {
								new_status = '';
							}

							if (match) {
								about.value = about.value.replace(
									status_regex,
									new_status,
								);
							} else {
								const trimmed = about.value.trimEnd();

								if (trimmed.length == 0) {
									about.value = new_status;
								} else {
									about.value = trimmed + '\n\n' + new_status;
								}
							}
						},
						submit_on_character: true,
					})
				}
                        </div>
                    `;

				return elem;
			}}
			    </div>
			    <div class="settings-footer end">
			        <button
			            type="submit"
			            class="btn-primary save"
			            data-form-type="action"
			        >
			            ${tl(trans.save)}
			        </button>
			        <input
			            type="hidden"
			            value="profile"
			            name="submit"
			        />
			    </div>
			</form>
			<div class="setting-group">
			    ${setting({
				id: 'hide_unused_settings',
				func: (val: boolean) => {
					website_elem.setAttribute('data-hidden', val);
					country_elem.setAttribute('data-hidden', val);
				},
			})}
			    ${setting({ id: 'avatar_radius' })}
			</div>
		`,
	);

	function len(text: string) {
		return text.replace(/\n/g, '\r\n').length;

		// utf-8 or something i dont know
		const normalised = text.replace(/\r\n/g, '\n');

		return new TextEncoder().encode(normalised).length;
	}

	function update_about(value = about.value) {
		const length = len(value);
		chars.textContent = tl(trans.value_characters_max, {
			v: `${length}/${bio_max_length}`,
		});
		chars.setAttribute('data-exceeded', length > bio_max_length);

		delete_cache(cache);

		render(preview, markdown(value, markdown_settings));

		save_profile_cache(cache, profile_cache, auth.name);

		console.info('cache', cache);

		console.info(
			'cache update',
			about.value,
			cache.hue,
			cache.sat,
			cache.lit,
		);

		const accent_regex =
			/\[accent=([0-9]{1,3}),([0-9]*\.?[0-9]+),([0-9]*\.?[0-9]+)\]/;
		const font_regex = /\[font=([^\]]+)\]/;

		if (font_setting) {
			let font_name = cache.font;
			let font_style = cache.font_style;

			let font_name_preview;

			let font_tile;
			render(font_setting, html``);
			render(
				font_setting,
				html`
					<span ref=${(el) => font_name_preview = el}>${{
						html: tl(trans.styled_with_font, {
							f: `<span class="font-name-preview-mini" data-font=${font_name}>${
								font_name && font_name != 'none'
									? page.state.fonts[font_name]
									: tl(trans.none)
							}</span>`,
						}),
					}}</span>
					<a class="card-tip-link" onclick=${() => {
						const match = about.value.match(font_regex);

						font_name = cache.font;
						font_style = cache.font_style;

						let font_preview;
						let font_buttons = [];
						let font_style_buttons = [];

						dialog({
							id: 'profile_font',
							title: tl(trans.profile_font.name),
							body: html.node`
                            <div class="font-name-preview">
                                <span data-font=${font_name} data-font-style=${font_style} ref=${(
								el,
							) => font_preview = el}>${
								cache.username ? cache.username : auth.name
							}</span>
                            </div>
                            <div class="font-name-options">
                                <h4 class="font-options-header">${
								tl(trans.font.name)
							}</h4>
                                <div class="font-options primary">
                                    ${
								Object.entries(page.state.fonts).map(
									([font, family]) => {
										if (family == '') {
											family = tl(trans.none);
										}

										const elem = html.node`
                                            <button class="btn font-selection" data-font=${font} aria-checked=${
											font == font_name
										} onclick=${() => {
											font_name = font;

											font_preview.setAttribute(
												'data-font',
												font,
											);
											font_buttons.forEach((btn) => {
												btn.setAttribute(
													'aria-checked',
													btn.getAttribute(
														'data-font',
													) == font,
												);
											});
										}}>
                                                <span data-font=${font}>Aa</span>
                                            </button>
                                        `;

										tippy(elem, {
											content: family,
											delay: [500, 0],
										});

										font_buttons.push(elem);
										return elem;
									},
								)
							}
                                </div>
                                <h4 class="font-options-header">${
								tl(trans.font_style)
							}</h4>
                                <div class="font-options">
                                    ${
								['solid', 'pop', 'out', 'glow'].map((style) => {
									const elem = html.node`
                                            <button class="btn font-selection font-style" data-font-style=${style} aria-checked=${
										style == font_style
									} onclick=${() => {
										font_style = style;

										font_preview.setAttribute(
											'data-font-style',
											style,
										);
										font_style_buttons.forEach((btn) => {
											btn.setAttribute(
												'aria-checked',
												btn.getAttribute(
													'data-font-style',
												) == style,
											);
										});
									}}>
                                                <span class="preview-style" data-font-style=${style}>${
										tl(trans.font_style[style])
									}</span>
                                            </button>
                                        `;

									font_style_buttons.push(elem);
									return elem;
								})
							}
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button class="see-more cancel left-icon" onclick=${() =>
								dialog_rm({ id: 'profile_font' })}>
                                    ${tl(trans.back)}
                                </button>
                                <div class="fill"></div>
                                <button class="btn primary continue" onclick=${() => {
								const new_font = `[font=${font_name}${
									font_style != 'solid'
										? `,${font_style}`
										: ''
								}]`;

								if (match) {
									about.value = about.value.replace(
										font_regex,
										new_font,
									);
								} else {
									const trimmed = about.value.trimEnd();

									if (trimmed.length == 0) {
										about.value = new_font;
									} else {
										about.value = trimmed + '\n\n' +
											new_font;
									}
								}

								render(
									font_name_preview,
									html`
										${{
											html: tl(trans.styled_with_font, {
												f: `<span class="font-name-preview-mini" data-font=${font_name} data-font-style=${font_style}>${
													font_name &&
														font_name != 'none'
														? page.state
															.fonts[font_name]
														: tl(trans.none)
												}</span>`,
											}),
										}}
									`,
								);

								dialog_rm({ id: 'profile_font' });
								status({
									title: tl(
										trans.profile_font.reminder,
									),
								});
							}}>
                                    ${tl(trans.change)}
                                </button>
                            </div>
                        `,
						});
					}}>${tl(trans.change_font)}</a>
				`,
			);
		}

		if (accent_setting) {
			let accent_edit;
			render(accent_setting, html``);
			render(
				accent_setting,
				html`
					<div class="heading">
						<h5>${tl(
							trans.profile_accent.name,
						)}<span class="new-badge sponsor-related">${tl(
							trans.sponsors_only,
						)}</span></h5>
						<p>${tl(trans.profile_accent.body)}</p>
					</div>
					<div class="info">
						<div class="colour-tile-and-button">
							<div class="colour-tile colourful"
								style="--hue-over: ${cache
									.hue}; --sat-over: ${cache
									.sat}; --lit-over: ${cache.lit}" />
							<button class="btn icon" data-type="edit" type="button"
								onclick=${() => {
									let hue_range;
									let sat_range;
									let lit_range;

									const match = about.value.match(
										accent_regex,
									);

									if (match) {
										save_setting(
											'profile_hue',
											parseInt(match[1], 10),
										);
										save_setting(
											'profile_sat',
											parseFloat(match[2]),
										);
										save_setting(
											'profile_lit',
											parseFloat(match[3]),
										);
									}

									let colour;
									let accent_preview;

									const style_for_tile =
										`--hue-over: ${settings.profile_hue}; --sat-over: ${settings.profile_sat}; --lit-over: ${settings.profile_lit};`;

									dialog({
										id: 'profile_accent',
										title: tl(trans.profile_accent.name),
										body: html.node`
                                    <div class="setting-group">
                                        <div class="setting" data-type="info">
                                            <div class="heading">
                                                <h5>${tl(trans.preview)}</h5>
                                            </div>
                                            <div class="info">
                                                <div class="colour-tiles" ref=${(
											el,
										) => accent_preview = el}>
                                                    ${
											colour_tile('l3', style_for_tile)
										}
                                                    ${
											colour_tile('l4', style_for_tile)
										}
                                                    ${
											colour_tile('h3', style_for_tile)
										}
                                                    ${
											colour_tile('h4', style_for_tile)
										}
                                                </div>
                                            </div>
                                        </div>
                                        ${
											ff('colour_based_on_hex')
												? html.node`
                                        <div class="setting" data-type="text">
                                            <div class="heading">
                                                <h5>${
													tl(trans.convert_from_hex)
												}</h5>
                                            </div>
                                            <div class="input-container content-form">
                                                ${(colour = input({
													type: 'colour',
													value: '#999999',
													maxlength: 7,
													warn_if_empty: true,
												}))}
                                                <button class="btn primary icon convert" onclick=${() => {
													const value = colour.value;
													const hsl = hex_to_oklch(
														value,
													);

													const sat = clamp_sat(
														(hsl.s / 100) * 3,
													);

													hue_range.value = hsl.h;
													sat_range.value = sat;
													lit_range.value = clamp_lit(
														sat,
														hsl.l / 100 + 0.35,
													);
												}}>${tl(trans.convert)}</button>
                                            </div>
                                        </div>
                                        `
												: ''
										}
                                        ${(hue_range = setting({
											id: 'profile_hue',
											func: update_colour_preview,
										}))}
                                        ${(sat_range = setting({
											id: 'profile_sat',
											func: update_colour_preview,
										}))}
                                        ${(lit_range = setting({
											id: 'profile_lit',
											func: update_colour_preview,
										}))}
                                    </div>
                                    <div class="modal-footer">
                                        <button class="see-more cancel left-icon" onclick=${() =>
											dialog_rm({
												id: 'profile_accent',
											})}>
                                            ${tl(trans.back)}
                                        </button>
                                        <div class="fill"></div>
                                        <div class="button-group">
                                            ${() => {
											const btn = html.node`
                                                    <button class="btn icon select-button" data-type="copy">
                                                        ${tl(trans.copy)}
                                                    </button>
                                                `;

											tippy(btn, {
												theme: 'context-menu',
												content: html.node`
                                                        <button class="dropdown-menu-clickable-item" data-type="profile" onclick=${() => {
													hue_range.value =
														settings.hue;
													sat_range.value =
														settings.sat;
													lit_range.value =
														settings.lit;
												}}>${
													tl(
														trans
															.apply_global_accent,
													)
												}</button>
                                                        <button class="dropdown-menu-clickable-item" data-type="global" onclick=${() => {
													const warn = notify({
														id: 'confirm_accent',
														title: tl(
															trans.are_you_sure,
														),
														body: tl(
															trans
																.this_will_replace_your_global_accent,
														),
														type: 'warning',
														actions: [
															{
																type: 'check',
																action: () => {
																	notify_rm(
																		warn,
																	);

																	save_setting(
																		'hue',
																		settings
																			.profile_hue,
																	);
																	save_setting(
																		'sat',
																		settings
																			.profile_sat,
																	);
																	save_setting(
																		'lit',
																		settings
																			.profile_lit,
																	);
																},
																text: tl(
																	trans
																		.continue,
																),
															},
														],
														persist: true,
													});
												}}>${
													tl(
														trans
															.apply_profile_accent,
													)
												}</button>
                                                    `,
												trigger: 'click',
												placement: 'bottom',
												interactive: true,
												interactiveBorder: 10,
												appendTo: document.body,
											});

											return btn;
										}}
                                            <button class="btn primary continue" onclick=${() => {
											const new_accent =
												`[accent=${settings.profile_hue},${settings.profile_sat},${settings.profile_lit}]`;

											if (match) {
												about.value = about.value
													.replace(
														accent_regex,
														new_accent,
													);
											} else {
												const trimmed = about.value
													.trimEnd();

												if (trimmed.length == 0) {
													about.value = new_accent;
												} else {
													about.value = trimmed +
														'\n\n' + new_accent;
												}
											}

											dialog_rm({ id: 'profile_accent' });
											status({
												title: tl(
													trans.profile_accent
														.reminder,
												),
											});
										}}>
                                                ${tl(trans.change)}
                                            </button>
                                        </div>
                                    </div>
                                `,
									});

									function update_colour_preview() {
										const style_for_tile =
											`--hue-over: ${settings.profile_hue}; --sat-over: ${settings.profile_sat}; --lit-over: ${settings.profile_lit};`;

										render(
											accent_preview,
											html`
												${colour_tile(
													'l3',
													style_for_tile,
												)}
												${colour_tile(
													'l4',
													style_for_tile,
												)}
												${colour_tile(
													'h3',
													style_for_tile,
												)}
												${colour_tile(
													'h4',
													style_for_tile,
												)}
											`,
										);
									}
								}}
								}}>
					            ${tl(trans.edit)}
					        </button>
						</div>
				`,
			);

			tippy(accent_edit, {
				content: tl(trans.edit),
			});
		}
	}
}

function avatar() {
	page.state.avatar_changer = dialog({
		id: 'edit_avatar',
		title: tl(trans.change_avatar),
		body: html.node`
            <div class="forms">
                <form action="${root}settings" name="avatar-form" method="post" enctype="multipart/form-data">
                    <input type="hidden" name="csrfmiddlewaretoken" value=${page.token}>
                    <div class="form-group form-group--avatar js-form-group upload-avatar">
                        <div class="js-form-group-controls form-group-controls">
                            <span class="btn-secondary btn primary btn-file btn-lg" data-kate-processed="true">
                                ${tl(trans.upload)}
                                <input type="file" onchange=${() =>
			update_avatar(
				event,
			)} name="avatar" data-require="components/file-input" data-file-input-copy="${
			tl(trans.upload)
		}" data-no-file-copy="No file chosen" accept="image/*" required="" id="id_avatar" data-kate-processed="true">
                            </span>
                        </div>
                    </div>
                    <button type="submit" class="btn-primary save" id="avatar_saver">
                        ${tl(trans.save)}
                    </button>
                    <input type="hidden" value="avatar" name="submit">
                </form>
                <form action="${root}settings/avatar/delete" method="post">
                    <input type="hidden" name="csrfmiddlewaretoken" value=${page.token}>
                    <div class="form-group delete-avatar">
                        <button class="btn image-upload-remove icon colourful btn-lg" type="submit" value="delete-avatar" name="delete-avatar">${
			tl(trans.delete)
		}</button>
                    </div>
                </form>
            </div>
            <div class="crop-before-uploading">
                ${
			setting({ id: 'crop_image_before_uploading', standalone: true })
		}
            </div>
            <div class="modal-footer">
                <button class="see-more cancel left-icon" onclick=${() =>
			dialog_rm({ id: 'edit_avatar' })}>${tl(trans.cancel)}</button>
                <div class="fill"></div>
                <button class="btn primary save" onclick=${() =>
			save_avatar()} disabled>${tl(trans.save)}</button>
            </div>
        `,
	});

	page.state.avatar_changer.querySelector('[name="avatar-form"]').onsubmit =
		finish_saving_avatar;
	const file_button = page.state.avatar_changer.querySelector('.btn-file');
	const save_button = page.state.avatar_changer.querySelector(
		'.modal-footer .primary',
	);

	let form;

	function update_avatar(e) {
		console.info(e);
		if (!e.target.files || !e.target.files[0]) return;
		form = page.state.avatar_changer.querySelector('.bleh-modal-body');

		if (
			e.target.files[0].type == 'image/gif' ||
			!settings.crop_image_before_uploading
		) {
			save_avatar();
			finish_saving_avatar();
			return;
		}

		const reader = new FileReader();
		reader.onload = function () {
			crop(reader.result);
			save_button.removeAttribute('disabled');
		};
		reader.readAsDataURL(e.target.files[0]);
	}

	function save_avatar() {
		page.state.avatar_changer.querySelector('#avatar_saver').click();
	}

	function finish_saving_avatar() {
		page.state.avatar_changer.setAttribute('data-loading', 'true');
		page.state.avatar_changer
			.querySelectorAll('.bleh-modal-body button')
			.forEach((button) => {
				button.setAttribute('disabled', 'true');
				button.removeAttribute('onclick');
			});
	}

	function crop(file) {
		let crop_image;
		let save;

		const crop_dialog = dialog({
			id: 'crop',
			title: tl(trans.crop_avatar),
			body: html.node`
                <div class="crop">
                    <img src=${file} ref=${(el) => (crop_image = el)}>
                </div>
                <div class="alert alert-info">
                    ${tl(trans.crop_notice)}
                </div>
                <div class="modal-footer">
                    <button class="see-more cancel left-icon" onclick=${() => {
				if (cropper && cropper.destroy) cropper.destroy();
				cropper = null;

				avatar();
			}}>${tl(trans.cancel)}</button>
                    <div class="fill"></div>
                    <button class="btn primary save" onclick=${() => {
				if (!cropper) return;

				crop_dialog
					.querySelectorAll('.bleh-modal-body button')
					.forEach((button) => {
						button.setAttribute('disabled', 'true');
						button.removeAttribute('onclick');
					});

				const canvas = cropper.getCroppedCanvas();

				canvas.toBlob((blob) => {
					const cropped_file = new File(
						[blob],
						'avatar.png',
						{ type: 'image/png' },
					);

					const inner_form = form.querySelector('form');
					inner_form.style.display = 'none';
					crop_dialog
						.querySelector('.bleh-modal-body')
						.appendChild(inner_form);

					const file_input = inner_form.querySelector(
						'input[type="file"]',
					);

					const data_transfer = new DataTransfer();
					data_transfer.items.add(cropped_file);
					file_input.files = data_transfer.files;

					inner_form.querySelector('#avatar_saver').click();
				}, 'image/png');
			}} ref=${(el) => (save = el)} disabled>${tl(trans.save)}</button>
                </div>
            `,
			replace_if_possible: true,
		});
		page.state.avatar_changer = crop_dialog;

		crop_image.onload = () => {
			if (cropper && cropper.destroy) cropper.destroy();

			crop_image.style.maxWidth = 'none';
			crop_image.style.width = crop_image.naturalWidth + 'px';
			crop_image.style.height = crop_image.naturalHeight + 'px';

			cropper = new Cropper(crop_image, {
				viewMode: 3,
				dragMode: 'crop',
				movable: true,
				zoomable: true,
				scalable: false,
				cropBoxMovable: true,
				cropBoxResizable: true,
				background: false,
				guides: true,
				autoCropArea: 1,
			});

			save.removeAttribute('disabled');
		};
	}
}
