/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { createRef, ReactNode } from 'jsx-dom';

interface AlertProps {
	ref?: ReturnType<typeof createRef<HTMLLabelElement>>;
	type?: 'info' | 'danger' | 'error' | 'success';
	className?: string;
	hidden?: boolean;
	margin?: boolean;
	children?: ReactNode;
}

export type AlertElement = HTMLLabelElement & {
	hidden: boolean;
};

export function Alert({
	ref,
	type = 'info',
	className,
	hidden,
	margin,
	children,
}: AlertProps) {
	const elem = (
		<label
			class={['alert', `alert-${type}`, !margin && 'no-margin', className]}
			ref={ref}
		>
			{children}
		</label>
	) as AlertElement;

	function update() {
		elem.setAttribute('data-hidden', String(hidden));
	}
	update();

	Object.defineProperty(elem, 'hidden', {
		get() {
			return hidden;
		},
		set(v: boolean) {
			hidden = v;
			update();
		},
	});

	return elem;
}
