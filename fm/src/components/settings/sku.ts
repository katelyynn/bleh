/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { log } from '@/build/log';
import { version } from '@/main';
import { useSettings } from '@/config.ts';

interface flag {
	default: boolean;
	name: string;
	notice?: string;
	date: string;
}

export function ff(flag: string) {
	const flags: Record<string, flag> = version.feature_flags;
	const local_flags: Record<string, flag> =
		useSettings.get('feature_flags') || {};

	log(`parsing ${flag}`, 'flag', 'log', {
		setting: local_flags[flag],
		sku: flags[flag],
	});

	if (local_flags[flag] != null) {
		return local_flags[flag];
	}

	if (flags[flag] != null) {
		return flags[flag].default;
	}
}
