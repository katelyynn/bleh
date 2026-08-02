/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { page } from '@/build/page';
import { html, render } from 'lighterhtml';

export function bleh_suggested() {
	const items = page.structure.main!.children;

	render(
		page.structure.main!,
		html`
			<section class="suggested-panel">
			    ${Array.from(items).map((item) => item)}
			</section>
		`,
	);

	if (['artists', 'albums'].includes(page.subpage)) {
		const suggestions = page.structure.main!.querySelector(
			`.music-recommended-${page.subpage}`,
		);
		suggestions?.querySelectorAll(':scope > li').forEach((suggestion) => {
			const avi = suggestion.querySelector('.media-item');

			const anchor = suggestion.querySelector('.users-you-know-anchor');
			if (anchor) {
				avi?.appendChild(anchor);
			}

			const form = suggestion.querySelector('form');
			if (form) {
				const remove = form.querySelector('button');
				remove!.classList = 'btn remove-suggestion icon chibi';
				remove?.setAttribute('data-type', 'x');
			}
		});
	}
}
