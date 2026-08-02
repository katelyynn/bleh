/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export function age(date: string, compare?: string) {
	const today = compare ? new Date(compare) : new Date();
	const birth = new Date(date);

	let age = today.getFullYear() - birth.getFullYear();

	const had_birthday = today.getMonth() > birth.getMonth() ||
		(today.getMonth() == birth.getMonth() &&
			today.getDate() >= birth.getDate());

	if (!had_birthday) {
		age--;
	}

	return age;
}
