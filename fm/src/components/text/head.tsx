/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ReactNode } from 'jsx-dom';
import { Icon } from '@/components/shared/icon.tsx';

interface PanelHeadProps {
	icon?: string;
	small?: boolean;
	margin?: boolean;
	children: ReactNode;
}

export function PanelHead({
	icon,
	small,
	margin = true,
	children,
}: PanelHeadProps) {
	return (
		<h4
			class={[
				icon && 'header-with-icon',
				margin && 'with-margin',
				small && 'is-small',
			]}
		>
			{icon && <Icon name={icon} />}
			{children}
		</h4>
	);
}
