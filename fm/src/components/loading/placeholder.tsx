/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ReactNode } from 'jsx-dom';

interface PlaceholderProps {
	face: string;
	children: ReactNode;
}

export function Placeholder({
	face,
	children,
}: PlaceholderProps) {
	return (
		<div class='placeholder-block'>
			<div class='placeholder-head'>{face}</div>
			<div class='placeholder-summary'>{children}</div>
		</div>
	);
}
