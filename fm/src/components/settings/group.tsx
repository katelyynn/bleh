/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ReactNode } from 'jsx-dom';

interface SettingGroupProps {
	blend?: boolean;
	children: ReactNode;
}

export function SettingGroup({
	blend = false,
	children,
}: SettingGroupProps) {
	return (
		<div class={['setting-group', blend && 'blend']}>
			{children}
		</div>
	);
}
