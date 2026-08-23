/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ReactNode } from 'jsx-dom';

interface SubTextProps {
	children: ReactNode;
}

export function SubText({
	children,
}: SubTextProps) {
	return (
		<label class='sub-text'>
			{children}
		</label>
	);
}
