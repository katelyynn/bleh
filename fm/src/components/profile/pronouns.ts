/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export function find_pronouns(text: string) {
	const regex = /\b[a-z]{1,4}\s*\/\s*[a-z]{1,4}(?:\s*\/\s*[a-z]{1,4})?\b/i;

	const start = text.match(new RegExp(`^(${regex.source})\\s*(.*)$`, 'i'));
	if (start) {
		return {
			pronouns: start[1].trim(),
			text: fix_up_string(start[2].trim()),
		};
	}

	const end = text.match(new RegExp(`^(.*)\\s+(${regex.source})$`, 'i'));
	if (end) {
		return {
			pronouns: end[2].trim(),
			text: fix_up_string(end[1].trim()),
		};
	}

	return {
		pronouns: null,
		text,
	};
}

function fix_up_string(text?: string) {
	if (!text) return null;

	return text.replace(/^[,\-–—.;:|•·/]+\s*/, '').replace(
		/\s*[,\-–—.;:|•·/]+$/,
		'',
	).trim();
}
