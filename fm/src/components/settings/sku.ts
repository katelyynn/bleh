/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { log } from '@/build/log';
import { useSettings } from '@/page.ts';
import { flags } from '@/build/flags.ts';

export function ff(flag: string) {
	const local_flags: Record<string, boolean> =
		useSettings.get('feature_flags') || {};

	log(`parsing ${flag}`, 'flag', 'log', {
		setting: local_flags[flag],
		sku: flags[flag],
	});

	if (local_flags[flag] != null) {
		return local_flags[flag];
	}

	if (flags[flag] != null) {
		return flags[flag].enabled;
	}
}
