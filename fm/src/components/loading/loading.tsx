/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { createRef, ReactNode } from 'jsx-dom';

interface LoadingDataProps {
	ref?: ReturnType<typeof createRef<HTMLDivElement>>;
	type?: 'loading' | 'failed' | 'private';
	children: ReactNode;
}

export function LoadingData({
	ref,
	type = 'loading',
	children,
}: LoadingDataProps) {
	return (
		<div class='loading-data-container'>
			<div
				class={['loading-data-text', type != 'loading' && type]}
				ref={ref}
			>
				{children}
			</div>
		</div>
	);
}
