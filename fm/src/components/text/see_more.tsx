/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ReactNode } from 'jsx-dom';
import type { ClassNames, createRef } from 'jsx-dom';
import { WithChildren } from '@/types/generic.tsx';

interface SeeMoreProps {
	ref?: ReturnType<typeof createRef>;
	href?: string;
	icon?: string;
	external?: boolean;
	onClick?: () => void;
	iconPlacement?: 'left' | 'right';
	colourful?: boolean;
	blend?: boolean;
	className?: string;
	children: ReactNode;
}

export function SeeMore({
	ref,
	href,
	icon,
	external = false,
	onClick,
	iconPlacement = 'right',
	colourful,
	blend,
	className,
	children,
}: SeeMoreProps) {
	const classes: ClassNames = [
		!blend && 'see-more',
		iconPlacement == 'left' && 'left-icon',
		blend && 'blend-v2-btn',
		colourful && 'colourful',
		className && className,
	];

	if (!href && onClick) {
		return (
			<button
				type='button'
				class={classes}
				onClick={onClick}
				data-type={icon}
				ref={ref as ReturnType<typeof createRef<HTMLButtonElement>>}
			>
				{children}
			</button>
		);
	}

	return (
		<a
			class={classes}
			href={href}
			target={external ? '_blank' : undefined}
			onClick={onClick}
			data-type={icon}
			ref={ref as ReturnType<typeof createRef<HTMLAnchorElement>>}
		>
			{children}
		</a>
	);
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

export function PanelTop({
	children,
}: WithChildren) {
	return (
		<div class='top-container'>
			{children}
		</div>
	);
}

interface ViewButtonsProps {
	blend?: boolean;
	blendV2?: boolean;
	children: ReactNode;
}

export function ViewButtons({
	blend = true,
	blendV2 = true,
	children,
}: ViewButtonsProps) {
	return (
		<div class={['view-buttons', blend && 'blend', blendV2 && 'blend-v2']}>
			{children}
		</div>
	);
}
