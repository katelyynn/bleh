/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { createRef, ReactNode } from 'jsx-dom';
import { WithChildren } from '@/types/generic.tsx';
import { hover_tooltip, Tooltip } from '@/components/shared/tooltips.tsx';
import { Icon, icons } from '@/components/shared/icon.tsx';

interface CardTipProps {
	ref?: ReturnType<typeof createRef<HTMLLabelElement>>;
	gap?: boolean;
	children: ReactNode;
}

export function CardTip({
	ref,
	gap,
	children,
}: CardTipProps) {
	return (
		<label class={['card-tip', gap && 'gap']} ref={ref}>
			{children}
		</label>
	);
}

export function InfoTip({
	children,
}: WithChildren) {
	const elem = (
		<div class='info-tip'>
			<Icon name={icons.info} />
		</div>
	);

	hover_tooltip(
		elem,
		<Tooltip>{children}</Tooltip>,
	);

	return elem;
}
