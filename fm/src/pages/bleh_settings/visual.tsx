/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { html, render } from 'lighterhtml';
import { auth, page } from '@/build/page';
import { tl, trans } from '@/build/trans';
import { save_setting, setting } from '@/components/settings/settings';
import { update_colour_swatches } from '@/config';
import {
	page_loading,
	register_skip_to,
	render_setting_page,
	theme_bubbles,
} from './bleh_settings';
import { ff } from '@/components/settings/sku';
import { settings } from '@/build/config';
import { match } from '@/components/settings/dynamic_theming';
import { dialog } from '@/components/dialog/dialog';
import { display_colour_presets } from '@/components/settings/swatch';
import { header_colour } from '@/components/page/colour';
import { avatar } from '@/components/shared/avatar';
import { SettingTheme } from '@/components/settings/provider/theme.tsx';
import { SettingGroup } from '@/components/settings/group.tsx';
import { SettingSwitch } from '@/components/settings/provider/switch.tsx';
import { SettingRange } from '@/components/settings/provider/range.tsx';
import { createRef } from 'jsx-dom';

export function visual() {
	if (
		auth.name &&
		auth.sets.hue == 255 &&
		auth.sets.sat == 1 &&
		auth.sets.lit == 1
	) {
		setTimeout(() => {
			render_setting_page('visual');
		}, 10);
		page_loading();
		return;
	}

	register_skip_to([]);

	let colourful_active;
	let colourful_all;

	let font_choice;
	let custom_font;
	let font_preview;

	let hovering_serif = false;

	const sat_bg = createRef();

	page.structure.main!.replaceChildren(
		<section class='bleh--panel'>
			<h4>{tl(trans.themes.name)}</h4>
			<SettingTheme
				theme={{
					id: settings.theme as string,
					adaptive: settings.theme_schedule as boolean,
					theme_day: settings.theme_day as string,
					theme_night: settings.theme_night as string,
				}}
				onChange={(val) => {
					if (settings.theme != val.id) {
						save_setting('theme', val.id);
					}
					if (settings.theme_day != val.theme_day) {
						save_setting('theme_day', val.theme_day);
					}
					if (settings.theme_night != val.theme_night) {
						save_setting(
							'theme_night',
							val.theme_night,
						);
					}

					sat_bg.current.update();
				}}
			/>
			<SettingGroup>
				<SettingSwitch bind='solarium' />
				<SettingRange bind='noise' />
				<SettingRange bind='sat_bg' ref={sat_bg} />
			</SettingGroup>
		</section>,
	);

	return;

	render(
		page.structure.main,
		html`
			<section class="bleh--panel">
				<h4>${tl(trans.appearance)}</h4>
				<div class="setting-group">
			        <div class="setting" data-type="action" id="setting_theme">
			            <div class="heading">
			                <h5>${tl(trans.themes.name)}</h5>
			            </div>
			            <div class="info v">
			                ${bubbles = theme_bubbles(() => {
				sat_bg.compat();

				render_tip();
				match();
			})}
			                <p class="card-tip" ref=${(el) =>
				adaptive_tip = el} />
			            </div>
			        </div>
			        ${setting({ id: 'solarium' })}
			        ${ff('high_contrast')
				? setting({ id: 'high_contrast' })
				: ''}
			        ${setting({ id: 'noise' })}
			    </div>
				<div class="setting-group">
					<div class="setting" data-type="action" id="setting_hue">
						<div class="heading">
							<h5>${tl(trans.hue)}</h5>
						</div>
						<div class="info swatch-info">
							<div
								id="colour_custom"
								class="swatch-group palette"
							></div>
							<div class="sep swatch-sep" />
							<div
								id="colour_palette"
								class="swatch-group palette"
							></div>
						</div>
					</div>
					<div class="setting" data-type="options">
						<div class="heading">
							<h5>${tl(trans.change_my_colour_when.name)}</h5>
							<p>${tl(trans.change_my_colour_when.body)}</p>
						</div>
						<div class="primary-selections">
			                ${setting({
				id: 'hue_from_artist',
				standalone: true,
			})}
			                ${setting({
				id: 'hue_from_album',
				standalone: true,
			})}
			                ${setting({
				id: 'hue_from_track',
				standalone: true,
			})}
			                <div class="primary-selection-sep" />
			                ${colourful_active = setting({
				id: 'colourful_tracks',
				standalone: true,
				func: () => {
					colourful_all.compat();
				},
			})}
			                ${colourful_all = setting({
				id: 'colourful_tracks_all',
				standalone: true,
				func: () => {
					colourful_active.compat();
				},
			})}
			            </div>
					</div>
				</div>
			</section>
			<section class="bleh--panel">
				<h4>${tl(trans.fonts)}</h4>
				<div class="inner-preview pad" ref=${(el) =>
					font_preview = el} />
				<div class="setting-group">
			        ${font_choice = setting({
				id: 'font_choice',
				func: () => {
					custom_font.compat();
					render_font_preview();
				},
			})}
			        ${custom_font = setting({ id: 'font', text: false })}
			        ${setting({
				id: 'font_serif',
				mouseenter: () => {
					hovering_serif = true;
					render_font_preview();
				},
				mouseleave: () => {
					hovering_serif = false;
					render_font_preview();
				},
			})}
			    </div>
				<div class="setting-group">
			        ${setting({ id: 'font_weight' })}
			        ${setting({ id: 'font_weight_medium' })}
			        ${setting({ id: 'font_weight_bold' })}
			        ${setting({ id: 'font_emoji' })}
			    </div>
			</section>
			<section class="bleh--panel">
				<h4>${tl(trans.artwork)}</h4>
				<div class="inner-preview pad">
					<div class="album-cover-examples">
			            ${album_cover_example(
				'https://lastfm.freetls.fastly.net/i/u/ar0/b9436242d32247cbce3d403581284cd3.jpg',
			)}
			            ${album_cover_example(
				'https://lastfm.freetls.fastly.net/i/u/ar0/6180e2f14ff339d02aab62895e258cc1.jpg',
			)}
			            ${album_cover_example(
				'https://lastfm.freetls.fastly.net/i/u/ar0/0ee08bda639c3df913e1a4a37508a841.jpg',
			)}
			            ${album_cover_example(
				'https://lastfm.freetls.fastly.net/i/u/ar0/94bc3ddb27c99cbdbe4779614e50c426.jpg',
			)}
			            ${album_cover_example(
				'https://lastfm.freetls.fastly.net/i/u/ar0/b00527c6ae0cd1d4c9bf3706b130ad56.jpg',
			)}
			            ${album_cover_example(
				'https://lastfm.freetls.fastly.net/i/u/ar0/703293187fdb99b70e9cdb30cb4b2420.jpg',
			)}
			        </div>
				</div>
				<div class="setting-group">
			        ${setting({ id: 'grid_glow' })}
			        ${setting({ id: 'gloss' })}
			    </div>
				<div class="setting-group">
			        ${setting({ id: 'show_disc_image' })}
			        ${setting({ id: 'avatar_radius' })}
			    </div>
			</section>
			<section class="bleh--panel">
				<h4>${tl(trans.other)}</h4>
				<div class="setting-group">${setting({ id: 'rain' })}</div>
			</section>
		`,
	);

	render_tip();

	display_colour_presets();
	update_colour_swatches();

	render_font_preview();

	function render_font_preview() {
		if (!settings.font_serif) hovering_serif = false;

		let font = window.getComputedStyle(document.body).getPropertyValue(
			'--font-choice',
		);
		if (font == `""`) font = tl(trans.no_font_selected);

		if (hovering_serif) font = tl(trans.font_serif);

		render(
			font_preview,
			html`
				<div class="font-preview-stack">
					<h1 class="font-preview" data-serif=${hovering_serif}>${tl(
						trans.font_example,
					)}</h1>
					<span class="font-preview-label">${tl(trans.previewing, {
						v: font,
					})}</span>
				</div>
			`,
		);
	}
}

function album_cover_example(url) {
	url = avatar(url, '300x300');

	const elem = html.node`
        <div class="album-cover-example colourful">
            <div class="cover-art album-cover-example-art">
                <img src=${url} />
            </div>
        </div>
    `;

	const colour = header_colour(
		html.node`
        <img src=${url} />
    `,
		false,
		[elem],
	);

	return elem;
}
