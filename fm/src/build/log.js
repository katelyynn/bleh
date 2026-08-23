/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { html } from 'lighterhtml';
import { page } from './page';

export function log(text, system, type = 'info', append = {}) {
	if (!page.structure.logs) {
		const logs = html.node`
            <div class="logs" />
        `;

		document.documentElement.appendChild(logs);
		page.structure.logs = logs;
	}

	let system_colour;

	switch (system) {
		case 'load':
			system_colour = '#8CB9D9';
			break;
		case 'lotus':
			system_colour = '#8CD9A6';
			break;
		case 'season':
			system_colour = '#65B6D8';
			break;
		case 'page':
			system_colour = '#E4B381';
			break;
		case 'page structure':
			system_colour = '#D88A69';
			break;
		case 'style':
			system_colour = '#C9C678';
			break;
		case 'profile':
			system_colour = '#D56854';
			break;
		case 'settings':
			system_colour = '#6D6977';
			break;
		case 'sponsor':
			system_colour = '#CE4E88';
			break;
		default:
			system_colour = '#C8DD88';
			break;
	}

	const has_append = Object.keys(append).length > 0;

	if (has_append) {
		console[type](
			`%c${system}%c ${text}`,
			`background: ${system_colour}; display: block; width: fit-content; font-weight: bold; color: #000; padding: 0 4px; border-radius: 4px`,
			'color: unset',
			append,
		);
	} else {
		console[type](
			`%c${system}%c ${text}`,
			`background: ${system_colour}; display: block; width: fit-content; font-weight: bold; color: #000; padding: 0 4px; border-radius: 4px`,
			'color: unset',
		);
	}
}
