/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

interface TokenProps {
	value: string;
}

export function Token({
	value,
}: TokenProps) {
	return <input type='hidden' name='csrfmiddlewaretoken' value={value} />;
}

export function get_token(form: HTMLFormElement | Element) {
	const token = form.querySelector(
		'[name="csrfmiddlewaretoken"]',
	) as HTMLInputElement;

	if (token) return token.getAttribute('value')!;

	return '';
}
