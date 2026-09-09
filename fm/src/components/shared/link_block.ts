/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export function bind_link_block(
	link_block: HTMLAnchorElement,
	binder: Element,
) {
	link_block.addEventListener('mouseenter', () => {
		binder.classList.add('link-block--hover');
	});

	link_block.addEventListener('mouseleave', () => {
		binder.classList.remove('link-block--hover');
	});
}
