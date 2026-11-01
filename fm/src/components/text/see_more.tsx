/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ReactNode } from 'jsx-dom';
import type { ClassNames, createRef, ReactElement } from 'jsx-dom';
import { WithChildren } from '@/types/generic.tsx';
import { useSettings } from '@/page.tsx';
import { Icon, icons } from '@/components/shared/icon.tsx';
import { hover_tooltip, menu_tooltip, Tooltip, TooltipInstance } from '@/components/shared/tooltips.tsx';

interface SeeMoreProps {
	ref?: ReturnType<typeof createRef>;
	chibi?: boolean;
	href?: string;
	icon?: string;
	external?: boolean;
	onClick?: () => void;
	iconPlacement?: 'left' | 'right';
	colourful?: boolean;
	blend?: boolean;
	className?: string;
	children: ReactNode;
	opens?: ReactElement;
}

type SeeMoreElement = HTMLElement & {
	menu?: TooltipInstance<ReactElement, ReactElement>;
}

export function SeeMore({
	ref,
	chibi,
	href,
	icon,
	external = false,
	onClick,
	iconPlacement = 'right',
	colourful,
	blend,
	className,
	children,
	opens,
}: SeeMoreProps) {
	const classes: ClassNames = [
		!blend && 'see-more',
		iconPlacement == 'left' && 'left-icon',
		blend && 'btn blend-v2-btn',
		colourful && 'colourful',
		chibi && 'chibi-see-more',
		opens && 'select-button link-select',
		className && className,
	];

	if (opens) {
		iconPlacement = 'left';
	}

	if (!icon && !opens) {
		if (external) {
			icon = icons.external;
		} else if (iconPlacement == 'left') {
			icon = icons.arrow_left;
		} else if (iconPlacement == 'right') {
			icon = icons.arrow_right;
		}
	}

	let elem: ReactElement;

	let instance: TooltipInstance<ReactElement, ReactElement>;

	if (!href && onClick) {
		elem = (
			<button
				type='button'
				class={classes}
				onClick={onClick}
				data-see-more='true'
				ref={ref as ReturnType<typeof createRef<HTMLButtonElement>>}
			>
				{(iconPlacement == 'left' && icon) && (
					<Icon name={icon} />
				)}
				{children}
				{(iconPlacement == 'right' && icon) && (
					<Icon name={icon} />
				)}
			</button>
		) as SeeMoreElement;
	} else {
		elem = (
			<a
				class={classes}
				href={href}
				target={external ? '_blank' : undefined}
				onClick={onClick}
				data-see-more='true'
				ref={ref as ReturnType<typeof createRef<HTMLAnchorElement>>}
			>
				{(iconPlacement == 'left' && icon) && (
					<Icon name={icon} />
				)}
				{children}
				{(iconPlacement == 'right' && icon) && (
					<Icon name={icon} />
				)}
			</a>
		) as SeeMoreElement;
	}

	if (chibi) {
		hover_tooltip(
			elem,
			<Tooltip>{children}</Tooltip>,
		);
	}

	if (opens) {
		instance = menu_tooltip(
			elem,
			opens,
		);
	}

	Object.defineProperty(elem, 'menu', {
		get() {
			return instance;
		},
	});

	return elem;
}

interface SeeMoreGroupProps {
	children: ReactNode;
}

export function SeeMoreGroup({
	children,
}: SeeMoreGroupProps) {
	return (
		<div class='see-more-row'>
			{children}
		</div>
	);
}

export function SeeMoreContainer({
	children,
}: WithChildren) {
	return (
		<div class='see-more-cont'>
			{children}
		</div>
	);
}

interface PanelTopProps {
	margin?: boolean;
	children: ReactNode;
}

export function PanelTop({
	margin = true,
	children,
}: PanelTopProps) {
	const elem = (
		<div class={['top-container', !margin && 'no-margin']}>
			{children}
		</div>
	);

	function update() {
		elem.setAttribute('data-theme', useSettings.get('theme') as string);
	}

	update();

	useSettings.on('theme', update);

	return elem;
}

interface ViewButtonsProps {
	accompany?: boolean;
	blend?: boolean;
	blendV2?: boolean;
	children: ReactNode;
}

export function ViewButtons({
	accompany,
	blend = true,
	blendV2 = true,
	children,
}: ViewButtonsProps) {
	return (
		<div
			class={[
				'view-buttons',
				blend && 'blend',
				blendV2 && 'blend-v2',
				accompany && 'accompany',
			]}
		>
			{children}
		</div>
	);
}
