/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { root } from '@/build/page';
import { redirect } from '../music/music';
import { sanitise } from '@/build/tools';

export function taste_artist(artist: string) {
	return `<a class="taste-artist" href="${root}music/${redirect()}${
		sanitise(artist)
	}">${artist}</a>`;
}
