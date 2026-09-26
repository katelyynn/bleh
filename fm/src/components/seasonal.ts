/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { page, root } from '@/build/page';
import { tl, trans } from '@/build/trans';
import { DateTime } from 'luxon';

export interface season {
	id: string;
	start: DateTime;
	end: DateTime;
	snowflakes: {
		state: boolean;
		count?: number;
	};
}
