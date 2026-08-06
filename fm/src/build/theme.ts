/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { trans, translation } from '@/build/trans.ts';
import { icons } from '@/components/shared/icon.tsx';

export interface theme {
	name: translation;
	type: 'light' | 'dark';
	icon?: string;
	external?: boolean;
	new_release?: boolean;
}

// use this to fill in theme info accessible with all modern
// bleh TSX components
export const themes: Record<string, theme> = {
	light: {
		name: trans.themes.light,
		type: 'light',
		icon: icons.theme_light,
	},
	ink: {
		name: trans.themes.ink,
		type: 'light',
		icon: icons.theme_ink,
	},
	dark: {
		name: trans.themes.dark,
		type: 'dark',
		icon: icons.theme_dark,
	},
	darker: {
		name: trans.themes.darker,
		type: 'dark',
		icon: icons.theme_darker,
	},
	oled: {
		name: trans.themes.oled,
		type: 'dark',
		icon: icons.theme_oled,
	},
	rose_pine: {
		name: trans.themes.rose_pine,
		type: 'dark',
		external: true,
		new_release: true,
	},
	rose_pine_dawn: {
		name: trans.themes.rose_pine_dawn,
		type: 'light',
		external: true,
		new_release: true,
	},
	kanagawa_dragon: {
		name: trans.themes.kanagawa_dragon,
		type: 'dark',
		external: true,
		new_release: true,
	},
	kanagawa: {
		name: trans.themes.kanagawa,
		type: 'light',
		external: true,
		new_release: true,
	},
};

// this lets you choose which themes to expose to the user-facing screens
export const light_themes = ['light', 'ink', 'rose_pine_dawn'];
export const dark_themes = [
	'dark',
	'darker',
	'oled',
	'rose_pine',
	'kanagawa_dragon',
];

// this lets you mark which themes dont support changing the
// saturation of the background elements
export const saturation_themes_unsupported = [
	'rose_pine',
	'rose_pine_dawn',
	'kanagawa_dragon',
	'kanagawa',
];
