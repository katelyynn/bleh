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
import { colour_tile, colour_type } from '@/components/settings/swatch';
import { header_colour } from '@/components/page/colour';
import { avatar } from '@/components/shared/avatar';
import { SettingTheme } from '@/components/settings/provider/theme.tsx';
import { SettingGroup } from '@/components/settings/group.tsx';
import { SettingSwitch } from '@/components/settings/provider/switch.tsx';
import { SettingRange } from '@/components/settings/provider/range.tsx';
import { createRef } from 'jsx-dom';
import {
	ColourTile,
	ColourTiles,
	SettingColour,
} from '@/components/settings/provider/colour.tsx';
import {
	SettingOptions,
	SettingOptionsSeparator,
} from '@/components/settings/provider/options.tsx';
import { SettingCheckbox } from '@/components/settings/provider/checkbox.tsx';
import { PanelHead } from '@/components/text/head.tsx';
import { icons } from '@/components/shared/icon.tsx';
import { SettingRadio } from '@/components/settings/provider/radio.tsx';
import { useSettings } from '@/page.ts';
import { SettingInput } from '@/components/settings/provider/input.tsx';

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

	let font_choice;
	let custom_font;

	const font_preview = createRef();

	let hovering_serif = false;

	const sat_bg = createRef();

	const season = page.state.seasons?.current;

	page.structure.main!.replaceChildren(
		<>
			<section class='bleh--panel'>
				<PanelHead icon={icons.visual}>
					{tl(trans.themes.name)}
				</PanelHead>
				<SettingTheme
					theme={{
						id: settings.theme as string,
						adaptive: settings.theme_schedule as boolean,
						theme_day: settings.theme_day as string,
						theme_night: settings.theme_night as string,
					}}
				/>
				<SettingGroup>
					<SettingSwitch bind='solarium' />
					<SettingRange bind='noise' />
					<SettingRange bind='sat_bg' />
				</SettingGroup>
			</section>
			<section class='bleh--panel'>
				<PanelHead icon={icons.accent}>
					{tl(trans.colours)}
				</PanelHead>
				<div class='inner-preview'>
					<ColourTiles>
						<ColourTile type='b2' />
						<ColourTile type='b3' />
						<ColourTile type='b4' />
						<ColourTile type='b5' />
						<ColourTile type='l3' />
						<ColourTile type='l4' />
						<ColourTile type='h3' />
						<ColourTile type='h4' />
					</ColourTiles>
				</div>
				<SettingColour
					colour={{
						type: settings.accent_type as colour_type,
						hue: settings.hue as number,
						sat: settings.sat as number,
						lit: settings.lit as number,
					}}
					onChange={(val) => {
						if (settings.hue != val.hue) {
							save_setting('hue', val.hue);
						}
						if (settings.sat != val.sat) {
							save_setting('sat', val.sat);
						}
						if (settings.lit != val.lit) {
							save_setting('lit', val.lit);
						}
						if (settings.accent_type != val.type) {
							save_setting('accent_type', val.type);
						}
					}}
					season={season}
				/>
				<SettingGroup>
					<SettingOptions
						name={tl(trans.change_my_colour_when.name)}
						body={tl(trans.change_my_colour_when.body)}
					>
						<SettingCheckbox standalone bind='hue_from_artist' />
						<SettingCheckbox standalone bind='hue_from_album' />
						<SettingCheckbox standalone bind='hue_from_track' />
						<SettingOptionsSeparator />
						<SettingCheckbox
							standalone
							bind='colourful_tracks'
						/>
						<SettingCheckbox
							standalone
							bind='colourful_tracks_all'
						/>
					</SettingOptions>
				</SettingGroup>
			</section>
			<section class='bleh--panel'>
				<PanelHead icon={icons.text}>
					{tl(trans.fonts)}
				</PanelHead>
				<div class='inner-preview' ref={font_preview} />
				<SettingGroup>
					<SettingRadio bind='font_choice' />
					<SettingInput bind='font' showLabel={false} />
					<SettingCheckbox
						bind='font_serif'
						onMouseEnter={() => {
							hovering_serif = true;
							render_font_preview();
						}}
						onMouseLeave={() => {
							hovering_serif = false;
							render_font_preview();
						}}
					/>
				</SettingGroup>
				<SettingGroup>
					<SettingRange bind='font_weight' />
					<SettingRange bind='font_weight_medium' />
					<SettingRange bind='font_weight_bold' />
					<SettingSwitch bind='font_emoji' />
				</SettingGroup>
			</section>
			<section class='bleh--panel'>
				<PanelHead icon={icons.image}>
					{tl(trans.artwork)}
				</PanelHead>
				<div class={['inner-preview', 'pad']}>
					<div class='album-cover-examples'>
						<AlbumCoverExample url='https://lastfm-img.freetls.fastly.net/i/u/ar0/b9436242d32247cbce3d403581284cd3.jpg' />
						<AlbumCoverExample url='https://lastfm-img.freetls.fastly.net/i/u/ar0/6180e2f14ff339d02aab62895e258cc1.jpg' />
						<AlbumCoverExample url='https://lastfm-img.freetls.fastly.net/i/u/ar0/0ee08bda639c3df913e1a4a37508a841.jpg' />
						<AlbumCoverExample url='https://lastfm-img.freetls.fastly.net/i/u/ar0/94bc3ddb27c99cbdbe4779614e50c426.jpg' />
						<AlbumCoverExample url='https://lastfm-img.freetls.fastly.net/i/u/ar0/b00527c6ae0cd1d4c9bf3706b130ad56.jpg' />
						<AlbumCoverExample url='https://lastfm-img.freetls.fastly.net/i/u/ar0/703293187fdb99b70e9cdb30cb4b2420.jpg' />
					</div>
				</div>
				<SettingGroup>
					<SettingSwitch bind='grid_glow' />
					<SettingRange bind='gloss' />
				</SettingGroup>
				<SettingGroup>
					<SettingSwitch bind='show_disc_image' />
					<SettingRadio bind='avatar_radius' />
				</SettingGroup>
			</section>
			<section class='bleh--panel'>
				<PanelHead icon={icons.more}>
					{tl(trans.miscellaneous)}
				</PanelHead>
				<SettingGroup>
					<SettingSwitch bind='rain' />
				</SettingGroup>
			</section>
		</>,
	);

	// TODO: setting components dont respect 'requires'
	// which means the custom font input shows up even
	// if custom font isnt enabled

	function render_font_preview() {
		if (!useSettings.get('font_serif')) hovering_serif = false;

		let font = window.getComputedStyle(document.body).getPropertyValue(
			'--font-choice',
		);
		if (font == `""`) font = tl(trans.no_font_selected) as string;

		if (hovering_serif) font = tl(trans.font_serif) as string;

		font_preview.current.replaceChildren(
			<div class='font-preview-stack'>
				<h1 class='font-preview' data-serif={hovering_serif}>
					{tl(trans.font_example)}
				</h1>
				<span class='font-preview-label'>
					{tl(trans.previewing, { v: font })}
				</span>
			</div>,
		);
	}

	useSettings.on('font_choice', render_font_preview);
	useSettings.on('font_serif', render_font_preview);

	render_font_preview();
}

interface AlbumCoverExampleProps {
	url: string;
}

function AlbumCoverExample({
	url,
}: AlbumCoverExampleProps) {
	url = avatar(url, '300x300');

	const elem = (
		<div class={['album-cover-example', 'colourful']}>
			<div class={['cover-art', 'album-cover-example-art']}>
				<img src={url} />
			</div>
		</div>
	);

	header_colour(<img src={url} /> as HTMLImageElement, false, [elem]);

	return elem;
}
