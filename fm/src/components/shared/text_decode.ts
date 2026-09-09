/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export function text_decode(text: string) {
	const textarea = document.createElement('textarea');
	textarea.innerHTML = text;
	return textarea.value;
}
