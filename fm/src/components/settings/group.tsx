/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { createRef, ReactNode } from 'jsx-dom';

interface SettingGroupProps {
	ref?: ReturnType<typeof createRef<HTMLDivElement>>;
	minWidth?: boolean;
	blend?: boolean;
	children?: ReactNode;
}

export function SettingGroup({
	ref,
	minWidth,
	blend = false,
	children,
}: SettingGroupProps) {
	return (
		<div
			class={['setting-group', blend && 'blend', minWidth && 'min-width']}
			ref={ref}
		>
			{children}
		</div>
	);
}
