/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import {
	inbuilt_settings,
	other_setting_types,
	setting_value,
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

export function load_settings() {
	if (!settings.version) settings.version = '10000000';

	migrations(parse_bleh_version(settings.version));

	// save setting into body
	for (const setting in settings_store) {
		const value = useSettings.get(setting);
		const store = settings_store[setting];
		const type = store.type || 'toggle';

		if (['hue', 'sat', 'lit'].includes(setting)) {
			document.body.classList.toggle(
				'increase-btn-contrast',
				useSettings.get('lit') as number <= 0.3,
			);

			if (
				useSettings.isDefault('hue') && useSettings.isDefault('sat') &&
				useSettings.isDefault('lit')
			) {
				document.body.classList.remove('increase-btn-contrast');
				continue;
			}
		}

		if (store.css) {
			document.body.style.setProperty(
				`--${store.css}`,
				`${value}${store.suffix || ''}`,
			);
		}

		if (!other_setting_types.includes(type) && store.bubble) {
			document.body.setAttribute(`data-bleh--${setting}`, String(value));
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
	if (!useSettings.get('theme_type')) {
		if (
			useSettings.get('theme') == 'light' ||
			useSettings.get('theme') == 'ink'
		) {
			useSettings.set('theme_type', 'light');
		} else {
			useSettings.set('theme_type', 'dark');
		}
	}

	if (version < 2025.0929) {
		if (useSettings.get('seasonal_particles') == true) {
			useSettings.set('seasonal_particles', 'all');
		} else if (useSettings.get('seasonal_particles') == false) {
			useSettings.set('seasonal_particles', 'none');
		}

		if (useSettings.get('seasonal_particles_reduced') == true) {
			useSettings.set('seasonal_particles', 'less');
			delete settings.seasonal_particles_reduced;
		} else {
			delete settings.seasonal_particles_reduced;
		}

		if (
			useSettings.get('font_weight') == 480 ||
			useSettings.get('font_weight') == 440
		) {
			useSettings.reset('font_weight');
		}

		if (
			useSettings.get('font_weight_medium') == 650 ||
			useSettings.get('font_weight_medium') == 570
		) {
			useSettings.reset('font_weight_medium');
		}

		if (
			useSettings.get('font_weight_bold') == 730 ||
			useSettings.get('font_weight_bold') == 760 ||
			useSettings.get('font_weight_bold') == 680
		) {
			useSettings.reset('font_weight_bold');
		}
	}

	if (version < 2026.0201) {
		if (useSettings.get('noise') == 0.5) useSettings.reset('noise');
	}

	if (version < 2026.022) {
		if (
			useSettings.isDefault('hue') &&
			useSettings.isDefault('sat') &&
			useSettings.isDefault('lit')
		) {
			useSettings.reset('hue');
			useSettings.reset('sat');
			useSettings.reset('lit');
		}
	}

	if (version < 2026.08) {
		if (useSettings.get('noise') == 0.35) useSettings.reset('noise');
	}

	if (
		!['circle', 'squircle', 'square'].includes(
			useSettings.get('avatar_radius') as string,
		)
	) {
		if (useSettings.get('avatar_radius') == 0) {
			useSettings.set('avatar_radius', 'square');
		} else if (useSettings.get('avatar_radius') == 25) {
			useSettings.set('avatar_radius', 'squircle');
		} else {
			useSettings.set('avatar_radius', 'circle');
		}
	}

	if (Number.isInteger(useSettings.get('list_view'))) {
		if (useSettings.get('list_view') == 0) {
			useSettings.set('list_view', 'list');
		} else {
			useSettings.set('list_view', 'cards');
		}
	}

	if (useSettings.get('profile_shortcut')) {
		useSettings.set('friends', [useSettings.get('profile_shortcut')]);
		useSettings.set(
			'starred_friend',
			useSettings.get('profile_shortcut') as string,
		);

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

type listener = (val: setting_value, uuid?: string) => void;

export class Settings {
	private data = new Map<string, setting_value>();

	private listeners = new Map<string, listener[]>();

	constructor() {
		log('constructing...', 'settings');
		this.rebuild();
	}

	public rebuild() {
		for (const key in settings_store) {
			const local = JSON.parse(localStorage.getItem('bleh') || '{}');

			if (local[key]) {
				let val = local[key];

				try {
					val = Number(val);
				} catch {
					//
				}

				this.change(key, val);
			} else {
				this.change(key, settings_store[key].default);
			}
		}
	}

	public get(key: string) {
		return this.data.get(key);
	}

	public store(key: string) {
		return settings_store[key];
	}

	public isDefault(key: string, val?: setting_value) {
		if (val == undefined) val = this.data.get(key);

		return val == this.store(key).default;
	}

	public set(key: string, val: setting_value, uuid?: string) {
		this.change(key, val);

		save_setting(key, val);

		this.listeners.get(key)?.forEach((cb) => {
			cb(val, uuid);
		});
	}

	private change(key: string, val: setting_value) {
		val = structuredClone(val);

		this.data.set(key, val);

		settings[key] = val;
	}

	public reset(key: string) {
		this.set(key, this.store(key).default);
	}

	public append(key: string, value: setting_value) {
		if (!Array.isArray(this.get(key))) return;

		this.set(key, [...this.get(key), value]);
	}

	// members can subscribe to setting changes
	// and receive the new value
	public on(key: string, callback: listener) {
		if (!this.listeners.has(key)) {
			this.listeners.set(key, []);
		}

		this.listeners.get(key)!.push(callback);
	}
}

export let useSettings: Settings;

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
