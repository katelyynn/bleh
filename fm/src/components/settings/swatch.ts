/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

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

	const bg_colour = window.getComputedStyle(colour_preview).backgroundColor;

	const final = formatHex(bg_colour);
	colour.value = final;
}
