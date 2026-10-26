/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ReactElement, ReactNode } from 'jsx-dom';
import { Icon, icons } from '@/components/shared/icon.tsx';
import { useSettings } from '@/page.tsx';
import { WithChildren } from '@/types/generic.tsx';
import { hover_tooltip } from '@/components/shared/tooltips.tsx';

interface PanelHeadProps {
	icon?: string;
	small?: boolean;
	margin?: boolean;
	top?: boolean;
	children: ReactNode;
	hover?: ReactElement;
}

export function PanelHead({
	icon,
	small,
	margin = true,
	top,
	children,
	hover,
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

	if (hover) {
		hover_tooltip(
			elem,
			hover,
		);
	}

	return elem;
}

export function PanelHeadExtra({
	children,
}: WithChildren) {
	return (
		<div class='panel-head-extra'>
			<Icon name={icons.dot} />
			{children}
		</div>
	);
}
