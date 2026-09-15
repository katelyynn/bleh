/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { createRef, ReactNode } from 'jsx-dom';

interface SettingGroupProps {
	ref?: ReturnType<typeof createRef<HTMLDivElement>>;
	minWidth?: boolean;
	blend?: boolean;
	disabled?: boolean;
	children?: ReactNode;
}

type SettingGroupElement = HTMLDivElement & {
	disabled: boolean;
};

export function SettingGroup({
	ref,
	minWidth,
	blend = false,
	disabled,
	children,
}: SettingGroupProps) {
	const elem = (
		<div
			class={['setting-group', blend && 'blend', minWidth && 'min-width']}
			ref={ref}
		>
			{children}
		</div>
	) as SettingGroupElement;

	function update() {
		elem.removeAttribute('disabled');

		if (disabled) elem.setAttribute('disabled', 'true');
	}

	update();

	Object.defineProperty(elem, 'disabled', {
		get() {
			return disabled;
		},
		set(v: boolean) {
			disabled = v;
			update();
		},
	});

	return elem;
}
