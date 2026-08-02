/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { html } from 'lighterhtml';
import { icon, icons } from './icon';
import { tl, trans } from '@/build/trans';

export function under_construction() {
	return html.node`
        <div class="under-construction colourful">
            ${icon({ name: icons.construction })}
            <p>${tl(trans.under_construction)}</p>
        </div>
    `;
}
