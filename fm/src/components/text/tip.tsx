/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ReactNode } from 'jsx-dom';

interface CardTipProps {
	children: ReactNode;
}

export function CardTip({
	children,
}: CardTipProps) {
	return (
		<label class='card-tip'>
			{children}
		</label>
	);
}
