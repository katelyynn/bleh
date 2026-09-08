/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ReactNode } from 'jsx-dom';
import { Icon } from '@/components/shared/icon.tsx';

interface IconLabelProps {
	icon: string;
	children: ReactNode;
}

export function IconLabel({
	icon,
	children,
}: IconLabelProps) {
	return (
		<>
			<Icon name={icon} />
			{children}
		</>
	);
}
