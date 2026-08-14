/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { DateTime } from 'luxon';
import tippy from 'tippy.js';
import { ReactNode } from 'jsx-dom';

export function time_tooltip(elem: ReactNode, time: DateTime) {
	tippy(elem, {
		content: time.toLocaleString(DateTime.DATE_MED),
	});

	return elem;
}
