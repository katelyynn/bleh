/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ReactNode } from 'jsx-dom';
import { useSettings } from '@/page.tsx';
import { WithChildren } from '@/types/generic.tsx';

interface SideActionsProps {
	children?: ReactNode;
}

export function SideActions({
	children,
}: SideActionsProps) {
	const elem = (
		<section class='side-actions'>
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
	onClick?: () => void;
	children: ReactNode;
}

export function SideAction({
	type,
	onClick,
	children,
}: SideActionProps) {
	return (
		<button
			type='button'
			class={['btn', 'side-action', 'icon-mask']}
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
