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
import { createRef } from 'jsx-dom';
import { SettingGroup } from '@/components/settings/group.tsx';
import { SettingLabel } from '@/components/settings/provider/main.tsx';
import { MarkdownField } from '@/components/markdown/field.tsx';
import { ProfileBanner } from '@/components/settings/provider/profile_banner.tsx';
import { ProfileAccent } from '@/components/settings/provider/profile_accent.tsx';
import { ProfileName } from '@/components/settings/provider/profile_name.tsx';
import { SettingInfo } from '@/components/settings/provider/info.tsx';
import { SettingInput } from '@/components/settings/provider/input.tsx';
import { useSettings } from '@/page.ts';
import { SettingSelect } from '@/components/settings/provider/select.tsx';
import { PanelHead } from '@/components/text/head.tsx';
import { icons, SaveIcon } from '@/components/shared/icon.tsx';
import { Token } from '@/components/form/token.tsx';
import { SettingsFooter } from '@/components/form/footer.tsx';
import { Button } from '@/components/button/button.tsx';
import { SettingCheckbox } from '@/components/settings/provider/checkbox.tsx';
import { SettingRadio } from '@/components/settings/provider/radio.tsx';

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
	const update_picture = page.structure.main!.querySelector(
		'#update-picture',
	);
	if (!update_picture) return;

	update_picture.classList.add('bleh--panel');

	const bio_max_length = 500;

	//const upload_form = update_picture.querySelector('.avatar-upload-form');
	const avatar_url = (update_picture.querySelector(
		'.image-upload-preview img',
	) as HTMLImageElement).src;
	const upload_finished = update_picture.querySelector('.alert-success');

	if (page.state.avatar_changer && upload_finished) {
		const id = page.state.avatar_changer.getAttribute('data-modal-id');
		dialog_rm({ id });
	}

	const update_profile = page.structure.main!.querySelector(
		'#update-profile',
	)!;
	const alert = update_profile.querySelector('.alert');

	const form_display_name =
		(document.getElementById('id_full_name') as HTMLInputElement).value;
	const form_website =
		(document.getElementById('id_homepage') as HTMLInputElement).value;
	const form_country = document.getElementById(
		'id_country',
	) as HTMLSelectElement;
	const form_about_me = document.getElementById(
		'id_about_me',
	) as HTMLTextAreaElement;

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

	const about = markdown_field(
		update_about,
		markdown_settings,
		form_about_me.textContent,
		'about_me',
		40,
		10,
		tl(trans.anything_you_can_imagine),
		null,
		false,
		false,
		false,
	);
	const preview = createRef();

	const accent_setting = html.node`
        <div class="setting" data-type="info" disabled=${!auth.sponsor} />
    `;
	const font_setting = html.node`
        <p class="card-tip" />
    `;

	page.structure.side!.replaceChildren(
		<section class='about-me-preview'>
			<h2>{tl(trans.about_me_preview)}</h2>
			<span
				class={['bleh--about-me-preview', 'markdown-body']}
				ref={preview}
			/>
		</section>,
	);

	page.structure.main!.removeChild(update_profile);

	// about me

	const chars = createRef();
	const md = createRef();
	const banner = createRef();
	const accent = createRef();
	const name = createRef();

	const website = createRef();
	const country = createRef();

	update_picture.replaceChildren(
		<>
			<PanelHead icon={icons.profile}>
				{tl(trans.profile)}
			</PanelHead>
			{alert}
			<form
				class='dont-move'
				action={`${root}settings`}
				name='profile-form'
				method='post'
			>
				<Token value={page.token} />
				<SettingGroup>
					<SettingInfo
						name={tl(trans.avatar)}
						body={tl(trans.avatar_desc)}
					>
						<div
							class={['avatar', 'image-uploader']}
							onClick={() => avatar()}
						>
							<img src={avatar_url} loading='lazy' />
							<div class={['avatar-overlay', 'icon-mask']} />
						</div>
					</SettingInfo>
					<ProfileName
						disabled={!auth.sponsor}
						markdown={form_about_me.value}
						onChange={(v: string) => md.current.value = v}
						ref={banner}
					/>
					<SettingInput
						name={tl(trans.profile_title)}
						body={tl(trans.pronoun_tip)}
						id='full_name'
						value={form_display_name}
						saveManually={false}
						length={36}
					/>
					<SettingInput
						name={tl(trans.website)}
						id='homepage'
						value={form_website}
						ref={website}
						saveManually={false}
						type='url'
					/>
					<SettingSelect
						name={tl(trans.country)}
						id={form_country.name}
						values={select_prepare(form_country)}
						value={form_country.value}
						ref={country}
					/>
					<ProfileBanner
						markdown={form_about_me.value}
						onChange={(v: string) => md.current.value = v}
						ref={banner}
					/>
					<ProfileAccent
						disabled={!auth.sponsor}
						markdown={form_about_me.value}
						onChange={(v: string) => md.current.value = v}
						ref={accent}
					/>
					<div class='setting' data-type='text'>
						<SettingLabel name={tl(trans.about)}>
							<p
								class={['tip', 'characters', 'colourful']}
								ref={chars}
							>
								{tl(trans.value_characters_max, {
									v: bio_max_length,
								})}
							</p>
						</SettingLabel>
						<MarkdownField
							elem={form_about_me}
							options={markdown_settings}
							onChange={(v) => {
								banner.current.markdown = v;
								accent.current.markdown = v;
								name.current.markdown = v;
							}}
							ref={md}
						/>
					</div>
				</SettingGroup>
				<SettingsFooter>
					<Button primary type='submit'>
						<SaveIcon />
						{tl(trans.save)}
					</Button>
					<input type='hidden' value='profile' name='submit' />
				</SettingsFooter>
			</form>
			<SettingGroup>
				<SettingCheckbox bind='hide_unused_settings' />
				<SettingRadio bind='avatar_radius' />
			</SettingGroup>
		</>,
	);

	function update() {
		const hide = useSettings.get('hide_unused_settings') as boolean;

		website.current.setAttribute('data-hidden', String(hide));
		country.current.setAttribute('data-hidden', String(hide));
	}

	useSettings.on('hide_unused_settings', update);

	update();

	update_about();

	function len(text: string) {
		return text.replace(/\n/g, '\r\n').length;
	}

	function update_about(value = about.value) {
		const length = len(value);

		chars.current.replaceChildren(
			tl(trans.value_characters_max, {
				v: `${length}/${bio_max_length}`,
			}),
		);
		chars.current.setAttribute(
			'data-exceeded',
			String(length > bio_max_length),
		);

		delete_cache(cache);

		preview.current.replaceChildren(markdown(value, markdown_settings));

		save_profile_cache(cache, profile_cache, auth.name!);

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
		replace_if_possible: true,
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
