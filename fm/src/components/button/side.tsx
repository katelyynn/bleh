/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ReactNode } from 'jsx-dom';
import { useSettings } from '@/page.tsx';
import { WithChildren } from '@/types/generic.tsx';

interface SideActionsProps {
	inset?: boolean;
	children?: ReactNode;
}

export function SideActions({
	inset = true,
	children,
}: SideActionsProps) {
	const elem = (
		<section class={['side-actions', !inset && 'no-inset']}>
			{children}
		</section>
	);

	function update() {
		elem.setAttribute('data-theme', useSettings.get('theme') as string);
	}

	update();
	useSettings.on('theme', update);

	return elem;
}

interface SideActionProps {
	type: string;
	href?: string;
	onClick?: () => void;
	children: ReactNode;
}

export function SideAction({
	type,
	href,
	onClick,
	children,
}: SideActionProps) {
	const classes = ['btn', 'side-action', 'icon-mask'];

	if (href) {
		return (
			<a
				type='button'
				class={classes}
				data-type={type}
				href={href}
				onClick={onClick}
			>
				{children}
			</a>
		)
	}

	return (
		<button
			type='button'
			class={classes}
			data-type={type}
			onClick={onClick}
		>
			{children}
		</button>
	);
}

export function SideActionLabel({
	children,
}: WithChildren) {
	return <label class='side-action-label'>{children}</label>;
}

export function SideActionContent({
	children,
}: WithChildren) {
	return <p class='side-action-content'>{children}</p>;
}
