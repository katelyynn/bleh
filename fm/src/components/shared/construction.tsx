/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Icon, icons } from './icon';
import { tl, trans } from '@/build/trans';

export function UnderConstruction() {
	return (
		<div class={['under-construction', 'colourful']}>
			<Icon name={icons.construction} />
			<p>{tl(trans.under_construction)}</p>
		</div>
	);
}
