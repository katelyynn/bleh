/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { DateTime } from 'luxon';
import { hover_tooltip, Tooltip } from '@/components/shared/tooltips.tsx';

export function time_tooltip(elem: Element, time: DateTime) {
	hover_tooltip(
		elem,
		<Tooltip>
			{time.toLocaleString(DateTime.DATE_MED)}
		</Tooltip>,
	);
	return elem;
}
