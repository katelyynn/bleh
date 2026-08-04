/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ReactNode } from 'jsx-dom';
import type { ClassNames } from 'jsx-dom';

interface SeeMoreProps {
	href?: string;
	icon?: string;
	external?: boolean;
	onClick?: () => void;
	iconPlacement?: 'left' | 'right';
	className?: string;
	children: ReactNode;
}

export function SeeMore({
	href,
	icon,
	external = false,
	onClick,
	iconPlacement = 'right',
	className,
	children,
}: SeeMoreProps) {
	const classes: ClassNames = [
		'see-more',
		iconPlacement == 'left' && 'left-icon',
		className && className,
	];

	if (!href && onClick) {
		return (
			<button
				type='button'
				class={classes}
				onClick={onClick}
				data-type={icon}
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
