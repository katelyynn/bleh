/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ReactNode } from 'jsx-dom';
import type { ClassNames, createRef } from 'jsx-dom';
import { WithChildren } from '@/types/generic.tsx';
import { useSettings } from '@/page.ts';
import { Icon, icons } from '@/components/shared/icon.tsx';

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
				data-see-more='true'
				ref={ref as ReturnType<typeof createRef<HTMLButtonElement>>}
			>
				{iconPlacement == 'left' && (
					<Icon name={icon || icons.arrow_left} />
				)}
				{children}
				{iconPlacement == 'right' && (
					<Icon name={icon || icons.arrow_right} />
				)}
			</button>
		);
	}

	return (
		<a
			class={classes}
			href={href}
			target={external ? '_blank' : undefined}
			onClick={onClick}
			data-see-more='true'
			ref={ref as ReturnType<typeof createRef<HTMLAnchorElement>>}
		>
			{iconPlacement == 'left' && <Icon
				name={icon || icons.arrow_left}
			/>}
			{children}
			{iconPlacement == 'right' && (
				<Icon name={icon || icons.arrow_right} />
			)}
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
