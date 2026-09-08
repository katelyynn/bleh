/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ReactNode } from 'jsx-dom';
import { Icon } from '@/components/shared/icon.tsx';

interface CtaProps {
	icon?: string;
	label?: ReactNode;
	className?: string;
	colourful?: boolean;
	children?: ReactNode;
}

export function Cta({
	icon,
	label,
	className,
	colourful,
	children,
}: CtaProps) {
	if (label) {
		return (
			<section class={['cta', colourful && 'colourful', className]}>
				<label class='cta-label'>
					{icon && <Icon name={icon} />}
					<strong>{label}</strong>
				</label>
				<div class='cta-actions'>
					{children}
				</div>
			</section>
		);
	}

	return (
		<section class={['cta', colourful && 'colourful', className]}>
			<strong>{children}</strong>
		</section>
	);
}
