/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { settings } from '@/build/config';
import { log } from '@/build/log';
import { page } from '@/build/page';
import { save_setting } from '@/components/settings/settings';
import { useSettings } from '@/page.ts';

export function dynamic_theming() {
	const media = window.matchMedia('(prefers-color-scheme: dark)');
	page.state.media = media;

	match(media);

	media.addEventListener('change', match);

	useSettings.on('theme_schedule', () => {
		match();
	});
	useSettings.on('theme_day', () => {
		match();
	});
	useSettings.on('theme_night', () => {
		match();
	});
}

export function match(media = page.state.media) {
	if (!useSettings.get('theme_schedule')) return useSettings.get('theme');

	if (media.matches) return apply_theme('night');
	else return apply_theme('day');
}

/**
 * @param {string} time
 */
function apply_theme(time) {
	if (useSettings.get('theme') == useSettings.get(`theme_${time}`)) {
		return useSettings.get(`theme_${time}`);
	}

	log(`applying theme for time ${time}`, 'dynamic theming');
	useSettings.set('theme', useSettings.get(`theme_${time}`));

	return useSettings.get(`theme_${time}`);
}
