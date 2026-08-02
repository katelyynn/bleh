/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export type profile_cache = {
	avatar?: string;
	banner?: string;
	banner_orig?: string;
	hue?: number;
	sat?: number;
	lit?: number;
	font?: string;
	font_style?: string;
	username?: string;
	aka?: string;
	created?: string;
} | boolean;

export type profile_cache_list = Record<string, profile_cache>;
