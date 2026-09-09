/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ReactNode } from 'jsx-dom';

interface SideActionsProps {
	children: ReactNode;
}

export function SideActions({
	children,
}: SideActionsProps) {
	return (
		<section class='side-actions'>
			{children}
		</section>
	);
}

interface SideActionProps {
	type: string;
	children: ReactNode;
}

export function SideAction({
	type,
	children,
}: SideActionProps) {
	return (
		<button
			type='button'
			class={['btn', 'side-action', 'icon-mask']}
			data-type={type}
		>
			{children}
		</button>
	);
}
