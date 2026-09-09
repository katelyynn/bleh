/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { WithChildren } from '@/types/generic.tsx';
import { Tooltip } from '@/components/shared/tooltips.tsx';

export function MenuContents({
	children,
}: WithChildren) {
	return (
		<Tooltip theme='context-menu'>
			{children}
		</Tooltip>
	);
}
