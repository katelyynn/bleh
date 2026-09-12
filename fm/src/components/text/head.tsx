/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ReactNode } from 'jsx-dom';
import { Icon } from '@/components/shared/icon.tsx';
import { useSettings } from '@/page.ts';

interface PanelHeadProps {
	icon?: string;
	small?: boolean;
	margin?: boolean;
	top?: boolean;
	children: ReactNode;
}

export function PanelHead({
	icon,
	small,
	margin = true,
	top,
	children,
}: PanelHeadProps) {
	const elem = (
		<h4
			class={[
				icon && 'header-with-icon',
				margin && 'with-margin',
				small && 'is-small',
				top && 'is-top',
			]}
		>
			{icon && <Icon name={icon} />}
			{children}
		</h4>
	);

	function update() {
		elem.setAttribute('data-theme', useSettings.get('theme') as string);
	}

	update();

	useSettings.on('theme', update);

	return elem;
}
