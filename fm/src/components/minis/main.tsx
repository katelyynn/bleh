/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { WithChildren } from '@/types/generic.tsx';
import { createRef } from 'jsx-dom';

export function CompareHeader({
	children,
}: WithChildren) {
	return (
		<div class='compare-header'>
			{children}
		</div>
	);
}

export function CompareBody({
	ref,
	children,
}: WithChildren) {
	return (
		<div
			class='compare-body'
			ref={ref as ReturnType<typeof createRef<HTMLDivElement>>}
		>
			{children}
		</div>
	);
}
