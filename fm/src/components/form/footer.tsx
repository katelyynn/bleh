/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ReactNode } from 'jsx-dom';

interface SettingsFooterProps {
	end?: boolean;
	gap?: boolean;
	children: ReactNode;
}

export function SettingsFooter({
	end = true,
	gap,
	children,
}: SettingsFooterProps) {
	return (
		<div class={['settings-footer', end && 'end', gap && 'gap']}>
			{children}
		</div>
	);
}
