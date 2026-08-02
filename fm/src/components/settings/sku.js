/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { settings } from '@/build/config';
import { log } from '@/build/log';
import { version } from '@/main';

/**
 * @param {string} flag
 */
export function ff(flag) {
	log(`parsing ${flag}`, 'flag', 'log', {
		setting: settings.feature_flags[flag],
		sku: version.feature_flags[flag],
	});

	if (settings.feature_flags[flag] != null) {
		return settings.feature_flags[flag];
	}

	if (version.feature_flags[flag] != null) {
		return version.feature_flags[flag].default;
	}
}
