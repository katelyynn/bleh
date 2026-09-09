/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { createRef, ReactNode } from 'jsx-dom';

interface AlertProps {
	ref?: ReturnType<typeof createRef<HTMLLabelElement>>;
	type?: 'info' | 'danger' | 'error' | 'success';
	margin?: boolean;
	children?: ReactNode;
}

export function Alert({
	ref,
	type = 'info',
	margin,
	children,
}: AlertProps) {
	return (
		<label
			class={['alert', `alert-${type}`, !margin && 'no-margin']}
			ref={ref}
		>
			{children}
		</label>
	);
}
