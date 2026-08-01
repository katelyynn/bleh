//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { page, root } from '@/build/page';
import { tl, trans } from '@/build/trans';
import { html } from 'lighterhtml';

export function bleh_auto_edits() {
	let corrections_panel = document.body.querySelector(
		'#subscription-corrections',
	);
	page.structure.main.appendChild(corrections_panel);

	// we want the other navigation
	let nav = page.structure.container.querySelector(
		'nav[data-more-string] .navlist-items',
	);

	nav.insertBefore(
		html.node`
        <li class="navlist-item secondary-nav-item secondary-nav-item--back">
            <a class="secondary-nav-item-link" href="${root}settings/subscription">
                ${tl(trans.back)}
            </a>
        </li>
    `,
		nav.firstElementChild,
	);
}
