/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ReactNode } from 'jsx-dom';
import { Icon } from '@/components/shared/icon.tsx';

interface PanelHeadProps {
	icon?: string;
	children: ReactNode;
}

export function PanelHead({
	icon,
	children,
}: PanelHeadProps) {
	return (
		<h4 class={[icon && 'header-with-icon']}>
			{icon && <Icon name={icon} />}
			{children}
		</h4>
	);
}
