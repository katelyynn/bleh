/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import {
	inbuilt_settings,
	other_setting_types,
	settings,
	settings_store,
} from '@/build/config';
import { log } from '@/build/log';
import { page, reload_pending } from '@/build/page';
import { tl, trans } from '@/build/trans.ts';
import { load_chart_colours } from '@/components/music/chart';
import { notify } from '@/components/dialog/notify';
import { load_skus } from '@/pages/bleh_settings/bleh_settings.js';
import { compile_settings, save_setting } from '@/components/settings/settings';

function parse_bleh_version(version: string) {
	return parseFloat(version.substring(0, 7));
}

export function load_settings(skip = false) {
	if (!skip) {
		for (let setting in settings_store) {
			// assign default if missing
			if (settings[setting] == null) {
				settings[setting] = structuredClone(
					settings_store[setting].default,
				);
			}
		}

		if (!settings.version) settings.version = '10000000';
	}

	migrations(parse_bleh_version(settings.version));

	// save setting into body
	for (let setting in settings) {
		document.body.classList.toggle(
			'increase-btn-contrast',
			settings.lit <= 0.3,
		);

		if (
			(setting == 'hue' || setting == 'sat' || setting == 'lit') &&
			settings.hue == settings_store.hue.default &&
			settings.sat == settings_store.sat.default &&
			settings.lit == settings_store.lit.default
		) {
			document.body.classList.remove('increase-btn-contrast');
			continue;
		}

		if (settings_store[setting]) {
			const type = settings_store[setting].type || 'toggle';

			if (settings_store[setting].css) {
				document.body.style.setProperty(
					`--${settings_store[setting].css}`,
					`${settings[setting]}${
						settings_store[setting].suffix || ''
					}`,
				);
			}

			if (
				!other_setting_types.includes(type) &&
				settings_store[setting].bubble
			) {
				document.body.setAttribute(
					`data-bleh--${setting}`,
					settings[setting],
				);
			}
		}
	}

	load_skus();

	// save to settings
	compile_settings();

	// override theme when browsing listening reports
	if (document.body.classList.contains('user-dashboard-layout')) {
		document.body.setAttribute('data-bleh--theme', 'oled');
		page.state.settings_reload = true;
	}

	load_chart_colours();
}

export function migrations(version: number) {
	if (!settings.theme_type) {
		if (settings.theme == 'light' || settings.theme == 'ink') {
			settings.theme_type = 'light';
		} else settings.theme_type = 'dark';
	}

	if (version < 2025.0929) {
		if (settings.seasonal_particles == true) {
			settings.seasonal_particles = 'all';
		} else if (settings.seasonal_particles == false) {
			settings.seasonal_particles = 'none';
		}

		if (settings.seasonal_particles_reduced == true) {
			settings.seasonal_particles = 'less';
			delete settings.seasonal_particles_reduced;
		} else if (settings.seasonal_particles_reduced == false) {
			delete settings.seasonal_particles_reduced;
		}

		if (settings.font_weight == 480 || settings.font_weight == 440) {
			settings.font_weight = settings_store.font_weight.default;
		}

		if (
			settings.font_weight_medium == 650 ||
			settings.font_weight_medium == 570
		) {
			settings.font_weight_medium =
				settings_store.font_weight_medium.default;
		}

		if (
			settings.font_weight_bold == 730 ||
			settings.font_weight_bold == 760 ||
			settings.font_weight_bold == 680
		) {
			settings.font_weight_bold = settings_store.font_weight_bold.default;
		}
	}

	if (version < 2026.0201) {
		if (settings.noise == 0.5) {
			settings.noise = settings_store.noise.default;
		}
	}

	if (version < 2026.022) {
		if (settings.hue == 255 && settings.sat == 1 && settings.lit == 1) {
			settings.hue = settings_store.hue.default;
			settings.sat = settings_store.sat.default;
			settings.lit = settings_store.lit.default;
		}
	}

	if (version < 2026.08) {
		if (Number(settings.noise) == 0.35) {
			settings.noise = 0.25;
		}
	}

	if (!['circle', 'squircle', 'square'].includes(settings.avatar_radius as string)) {
		if (Number(settings.avatar_radius) == 0) {
			settings.avatar_radius = 'square';
		} else if (Number(settings.avatar_radius) == 25) {
			settings.avatar_radius = 'squircle';
		} else {
			settings.avatar_radius = 'circle';
		}
	}

	if (Number.isInteger(settings.list_view)) {
		if (settings.list_view == 0) {
			settings.list_view = 'list';
		} else {
			settings.list_view = 'cards';
		}
	}

	if (settings.profile_shortcut) {
		settings.friends = [settings.profile_shortcut];
		settings.starred_friend = settings.profile_shortcut;

		localStorage.removeItem('bleh_profile_shortcut_avi');
		delete settings.profile_shortcut;
	}
}

// theme
export function toggle_theme() {
	if (page.subpage.startsWith('listening-report')) return;

	const themes = ['light', 'ink', 'dark', 'darker', 'oled'];
	const current = settings.theme;

	const next = themes[(themes.indexOf(current) + 1) % themes.length];

	// save value
	save_setting('theme_schedule', false);
	save_setting('theme', next);
}

export function request_reload() {
	if (page.type == 'bleh_setup') return;

	log('requesting reload', 'settings');
	reload_pending.state = true;
	notify({
		title: tl(trans.refresh_pending.name),
		body: tl(trans.refresh_pending.body),
		icon: 'icon-16-settings',
		persist: true,
		actions: [
			{
				action: () => invoke_reload(),
				text: tl(trans.refresh),
				type: 'refresh',
			},
		],
	});
}
export function invoke_reload() {
	window.location.reload();
}

export function update_colour_swatches() {
	let found = false;
	let custom = null;
	let seasonal = null;

	let swatches = page.structure.main.querySelectorAll('.swatch');
	swatches.forEach((swatch) => {
		let h = swatch.style.getPropertyValue('--hue-over');
		let s = swatch.style.getPropertyValue('--sat-over');
		let l = swatch.style.getPropertyValue('--lit-over');

		let parent = swatch.parentElement;
		if (swatch.classList[0] == 'dropdown-menu-clickable-item') {
			parent = swatch;
		}

		if (
			(h == settings.hue && s == settings.sat && l == settings.lit) ||
			(swatch.getAttribute('data-swatch-type') == 'default' &&
				settings.hue == settings_store.hue.default &&
				settings.sat == settings_store.sat.default &&
				settings.lit == settings_store.lit.default)
		) {
			parent.setAttribute('aria-checked', 'true');

			if (swatch.classList[0] != 'dropdown-menu-clickable-item') {
				found = true;
			}
		} else {
			parent.setAttribute('aria-checked', 'false');
		}

		if (!custom && swatch.getAttribute('data-swatch-type') == 'customise') {
			custom = parent;
		}

		if (!seasonal && swatch.getAttribute('data-swatch-type') == 'default') {
			seasonal = parent;
		}
	});

	if (found) return;

	if (custom && settings.accent_type != 'season') {
		custom.setAttribute('aria-checked', 'true');
	} else if (seasonal) seasonal.setAttribute('aria-checked', 'true');
}

unsafeWindow._reset_inbuilt_item = function (item) {
	reset_inbuilt_item(item);
};
unsafeWindow._update_inbuilt_params = function (params = {}) {
	update_inbuilt_params(params);
};
unsafeWindow._update_inbuilt_item = function (item, value) {
	update_inbuilt_item(item, value);
};

export function update_inbuilt_item(
	item,
	value,
	modify = true,
	element = document.body,
) {
	//console.log('update item',item,value);
	console.warn('update item', item, value, 'modify', modify);

	let test_if_valid = element.querySelector(`#toggle-${item}`);
	console.warn(test_if_valid, `toggle-${item}`);
	//console.info(test_if_valid, item, value, inbuilt_settings[item], 'modify', modify);
	if (test_if_valid == undefined) return;

	if (inbuilt_settings[item].type == 'toggle') {
		if (modify) {
			value = document
				.getElementById(`toggle-${item}`)
				.getAttribute('aria-checked') === 'true';
			log(`updated (inbuilt) ${item} to ${!value}`, 'settings');
		}

		//console.info(value, inbuilt_settings[item].values[0], value == inbuilt_settings[item].values[0], modify);

		if (value == inbuilt_settings[item].values[0] && modify) {
			element.querySelector(`#inbuilt-companion-checkbox-${item}`)
				.checked = false;
			element
				.querySelector(`#toggle-${item}`)
				.setAttribute('aria-checked', false);
			document.body.setAttribute(
				`data-bleh--inbuilt-${item}`,
				inbuilt_settings[item].values[1],
			);
		} else if (modify) {
			element.querySelector(`#inbuilt-companion-checkbox-${item}`)
				.checked = true;
			element
				.querySelector(`#toggle-${item}`)
				.setAttribute('aria-checked', true);
			document.body.setAttribute(
				`data-bleh--inbuilt-${item}`,
				inbuilt_settings[item].values[0],
			);
		} else {
			// dont modify, just show
			console.warn(
				item,
				value,
				value == true,
				value == false,
				typeof value,
				typeof true,
			);
			if (value == true) {
				console.warn(item, value, 'TRUE');
				element.querySelector(`#inbuilt-companion-checkbox-${item}`)
					.checked = true;
				element
					.querySelector(`#toggle-${item}`)
					.setAttribute('aria-checked', true);
				document.body.setAttribute(`data-bleh--inbuilt-${item}`, true);
			} else if (value == false) {
				console.warn(item, value, 'FALSE');
				element.querySelector(`#inbuilt-companion-checkbox-${item}`)
					.checked = false;
				element
					.querySelector(`#toggle-${item}`)
					.setAttribute('aria-checked', false);
				document.body.setAttribute(`data-bleh--inbuilt-${item}`, false);
			}
		}
	}
}
