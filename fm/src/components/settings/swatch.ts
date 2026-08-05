/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { settings_store } from '@/build/config';
import { auth, page } from '@/build/page';
import { stored_season } from '@/build/seasonal';
import { tl, trans, translation } from '@/build/trans';
import { version } from '@/main';
import { html } from 'lighterhtml';
import { ff } from './sku';
import tippy from 'tippy.js';
import { input } from './input';
import { clamp_lit, clamp_sat, hex_to_oklch } from '@/build/tools';
import { setting } from './settings';
import { update_colour_swatches } from '@/config';
import { formatHex } from 'culori';

export interface colour {
	type?: colour_type;
	sets?: colour_set;
	displays?: display_set;
	requires_flag?: string;
	label?: translation;
	seasonal?: string;
}

export type colour_type =
	| 'default'
	| 'avatar'
	| 'season'
	| 'colour'
	| 'customise'
	| 'placeholder';

export interface colour_set {
	hue: number;
	sat: number;
	lit: number;
}

interface display_set {
	hue: string;
	sat: string;
	lit: string;
}

export const default_colour: colour = {
	type: 'default',
	sets: {
		hue: settings_store.hue.default as number,
		sat: settings_store.sat.default as number,
		lit: settings_store.lit.default as number,
	},
	displays: {
		hue: `var(--hue-seasonal, ${settings_store.hue.default})`,
		sat: `var(--sat-seasonal, ${settings_store.sat.default})`,
		lit: `var(--lit-seasonal, ${settings_store.lit.default})`,
	},
	label: trans.default,
};

export const avatar_colour: colour = {
	type: 'avatar',
	sets: {
		hue: auth.sets.hue,
		sat: auth.sets.sat,
		lit: auth.sets.lit,
	},
	requires_flag: 'colour_based_on_avatar',
	label: trans.avatar,
};

export const colours: colour[] = [
	{
		sets: {
			hue: 19,
			sat: 1.5,
			lit: 0.84,
		},
		label: trans.red,
	},
	{
		sets: {
			hue: 37,
			sat: 1.4,
			lit: 0.9,
		},
		label: trans.orange,
	},
	{
		sets: {
			hue: 73,
			sat: 1.38,
			lit: 1.07,
		},
		label: trans.yellow,
	},
	{
		sets: {
			hue: 115,
			sat: 1.16,
			lit: 1,
		},
		label: trans.lime,
	},
	{
		sets: {
			hue: 145,
			sat: 1.6,
			lit: 0.95,
		},
		label: trans.green,
	},
	{
		sets: {
			hue: 178,
			sat: 1,
			lit: 1,
		},
		label: trans.aqua,
	},
	{
		sets: {
			hue: 248,
			sat: 1.45,
			lit: 0.82,
		},
		label: trans.blue,
	},
	{
		sets: {
			hue: 290,
			sat: 1.45,
			lit: 0.82,
		},
		label: trans.purple,
	},
	{
		sets: {
			hue: 340,
			sat: 1.35,
			lit: 0.93,
		},
		label: trans.pink,
	},
	{
		sets: {
			hue: 0,
			sat: 0,
			lit: 1,
		},
		label: trans.grey,
	},
];

export const seasonal_colours: Record<string, colour[]> = {
	christmas: [
		{
			type: 'season',
			label: trans.seasonal.presets.nonsense,
			sets: {
				hue: 352,
				sat: 1.8,
				lit: 0.925,
			},
		},
		{
			type: 'season',
			label: trans.seasonal.presets.fruitcake,
			sets: {
				hue: 24,
				sat: 0.93,
				lit: 1,
			},
		},
		{
			type: 'season',
			label: trans.seasonal.presets.mistletoe,
			sets: {
				hue: 130,
				sat: 0.45,
				lit: 0.75,
			},
		},
		{
			type: 'season',
			label: trans.seasonal.presets.festival,
			sets: {
				hue: 240,
				sat: 1.4,
				lit: 0.875,
			},
		},
	],
};
seasonal_colours.new_years = seasonal_colours.christmas;

export function display_colour_presets() {
	let hue_range;
	let sat_range;
	let lit_range;

	const season = page.state.seasons.current?.id;

	for (const type in colours) {
		const swatch_group = page.structure.main.querySelector(
			`#colour_${type}`,
		);
		if (!swatch_group) return;

		colours[type].forEach((colour) => {
			if (
				colour.type == 'default' && season != 'none' &&
				exclusives[season]
			) {
				swatch_group.appendChild(create_swatch(type, colour));

				exclusives[season].forEach((exclusive) => {
					swatch_group.appendChild(
						create_swatch(type, exclusive, true),
					);
				});

				return;
			}

			swatch_group.appendChild(create_swatch(type, colour));
		});
	}

	function create_swatch(type, colour, exclusive = false) {
		if (
			colour.requires_flag &&
			version.feature_flags.hasOwnProperty(colour.requires_flag)
		) {
			if (!ff(colour.requires_flag)) return html.node``;
		}

		if (colour.type == 'avatar' && !auth.name) return html.node``;

		let text: string;
		let label: string;
		if (colour.label) text = tl(colour.label);

		if (exclusive) label = tl(trans.seasonal.exclusive);

		if (!colour.type) colour.type = 'colour';

		if (!colour.displays && colour.sets) colour.displays = colour.sets;

		let blob;
		let text_elem;
		let desc_elem;
		const swatch = html.node`
            <button class="swatch-container" onclick=${() => {
			if (!colour.sets) return;

			hue_range.value = colour.sets.hue;
			sat_range.value = colour.sets.sat;
			lit_range.value = colour.sets.lit;
		}}>
                <div class="swatch colourful" ref=${(
			el,
		) => (blob = el)} data-swatch-type=${colour.type} />
                <div class="swatch-inner">
                    <strong class="swatch-name colourful" ref=${(
			el,
		) => (text_elem = el)} />
                    ${
			label
				? html.node`<p class="swatch-desc" ref=${(el) =>
					desc_elem = el}>${label}</p>`
				: ''
		}
                </div>
            </button>
        `;

		swatch.addEventListener('mouseenter', () => {
			const parent = swatch.parentElement?.parentElement;
			if (!parent) return;

			parent.classList.add('has-hover');
		});

		swatch.addEventListener('mouseleave', () => {
			const parent = swatch.parentElement?.parentElement;
			if (!parent) return;

			parent.classList.remove('has-hover');
		});

		if (type == 'custom' && !colour.label) text = tl(trans[colour.type]);

		if (colour.type == 'customise') {
			text = tl(trans.edit);

			let colour;

			customise_swatch(swatch, colour);
		}

		if (colour.sets) {
			colour.sets.accent_type = colour.type;

			blob.style.setProperty('--hue-over', colour.displays.hue);
			blob.style.setProperty('--sat-over', colour.displays.sat);
			blob.style.setProperty('--lit-over', colour.displays.lit);

			text_elem.style.setProperty('--hue-over', colour.displays.hue);
			text_elem.style.setProperty('--sat-over', colour.displays.sat);
			text_elem.style.setProperty('--lit-over', colour.displays.lit);
		}

		if (colour.type == 'default' && stored_season.id != 'none') {
			text = tl(trans.seasonal.name);
		}

		text_elem.textContent = text;

		return swatch;
	}

	function customise_swatch(swatch, colour) {
		tippy(swatch, {
			theme: 'window',
			content: html.node`
                <div class="dialog-settings">
                    <div class="setting-group blend">
                        <div class="setting" data-type="info">
                            <div class="heading">
                                <h5>${tl(trans.preview)}</h5>
                            </div>
                            <div class="info">
                                <div class="colour-tiles">
                                    ${colour_tile('l3')}
                                    ${colour_tile('l4')}
                                    ${colour_tile('h3')}
                                    ${colour_tile('h4')}
                                </div>
                            </div>
                        </div>
                        ${
				ff('colour_based_on_hex')
					? html.node`
                        <div class="setting" data-type="text">
                            <div class="heading">
                                <h5>${tl(trans.convert_from_hex)}</h5>
                            </div>
                            <div class="input-container content-form">
                                ${colour = input({
						type: 'colour',
						value: '#999999',
						maxlength: 7,
						warn_if_empty: true,
					})}
                                <button class="btn primary icon convert" onclick=${() => {
						const value = colour.value;
						const hsl = hex_to_oklch(value);

						const sat = clamp_sat((hsl.s / 100) * 3);

						hue_range.value = hsl.h;
						sat_range.value = sat;
						lit_range.value = clamp_lit(sat, hsl.l / 100 + 0.35);
					}}>${tl(trans.convert)}</button>
                            </div>
                        </div>
                        `
					: ''
			}
                        ${hue_range = setting({
				id: 'hue',
				func: update_values,
			})}
                        ${sat_range = setting({
				id: 'sat',
				func: update_values,
			})}
                        ${lit_range = setting({
				id: 'lit',
				func: update_values,
			})}
                    </div>
                </div>
            `,
			placement: 'bottom',
			interactive: true,
			interactiveBorder: 10,
			trigger: 'click',
			appendTo: document.body,

			onShow(instance) {
				show_preview_as_hex();
			},
		});

		function show_preview_as_hex() {
			const colour_preview = page.state.colour_preview;

			const bg_colour =
				window.getComputedStyle(colour_preview).backgroundColor;

			const final = formatHex(bg_colour);
			colour.value = final;
		}

		function update_values() {
			show_preview_as_hex();
			update_colour_swatches();
		}
	}
}

export function colour_tile(type, style = '') {
	let text;
	const number = type.slice(-1);

	if (type.startsWith('l')) {
		text = tl(trans.link_val, { v: number });
	} else {
		text = tl(trans.bg_val, { v: number });
	}

	return html.node`
        <div class="colour-tile-wrap">
            <div class="colour-tile mini colourful ${type}" style=${style} />
            <div class="colour-tile-type">${text}</div>
        </div>
    `;
}

export function show_preview_as_hex() {
	const colour_preview = page.state.colour_preview;
	if (!colour_preview) return '';

	const bg_colour =
		window.getComputedStyle(colour_preview).backgroundColor;

	const final = formatHex(bg_colour);
	colour.value = final;
}
