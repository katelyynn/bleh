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

export function update_season_nav() {
	if (!page.header.season) return;

	const state = page.state.seasons;

	page.header.season.setAttribute(
		'href',
		`${root}bleh${state.current ? '/seasonal' : ''}`,
	);
	page.header.season.setAttribute(
		'data-season',
		state.current ? state.current.id : 'none',
	);
	page.header.season.setAttribute('data-season-active', !!state.current);
	page.header.season.textContent = state.current
		? state.current.end.toRelative(state.now)
		: tl(trans.bleh_settings);
}
