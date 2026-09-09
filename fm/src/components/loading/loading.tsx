/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ReactNode } from 'jsx-dom';

interface LoadingDataProps {
	type?: 'loading' | 'failed' | 'private';
	children: ReactNode;
}

export function LoadingData({
	type = 'loading',
	children,
}: LoadingDataProps) {
	return (
		<div class='loading-data-container'>
			<div class={['loading-data-text', type != 'loading' && type]}>
				{children}
			</div>
		</div>
	);
}
