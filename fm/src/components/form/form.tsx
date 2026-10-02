/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { WithChildren } from '@/types/generic.tsx';

export function FormInner({
	children,
}: WithChildren) {
	return (
		<div class='form-inner'>
			{children}
		</div>
	);
}

export function GenericLabel({
	children,
}: WithChildren) {
	return (
		<p class='generic-label'>
			{children}
		</p>
	);
}
