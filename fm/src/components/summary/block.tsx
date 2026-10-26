/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { lang, tl, trans } from '@/build/trans.ts';
import { createRef, ReactNode } from 'jsx-dom';
import { Icon, icons } from '@/components/shared/icon.tsx';
import { hover_tooltip, Tooltip } from '@/components/shared/tooltips.tsx';
import { CountUp } from 'countup.js';
import { lazy } from '@/build/tools';

interface ProfileSummaryBlocksProps {
	large?: boolean;
	children?: ReactNode;
}

export function ProfileSummaryBlocks({
	large,
	children,
}: ProfileSummaryBlocksProps) {
	return (
		<div class={['summary-blocks', large && 'size-lg']}>
			{children}
		</div>
	);
}

interface ProfileSummaryBlockProps {
	large?: boolean;
	type: string;
	value: number;
	tooltip?: ReactNode;
	counter?: boolean;
}

export function ProfileSummaryBlock({
	large,
	type,
	value,
	tooltip,
	counter,
}: ProfileSummaryBlockProps) {
	let text: ReactNode;
	let icon_name;

	if (type == 'scrobbles') {
		text = tl(trans.scrobbles);
		icon_name = icons.play;
	} else if (type == 'artists') {
		text = tl(trans.artists);
		icon_name = icons.artists;
	} else if (type == 'loved') {
		text = tl(trans.loved);
		icon_name = icons.loved;
	} else if (type == 'average') {
		text = tl(trans.daily);
		icon_name = icons.calendar;
	} else if (type == 'albums') {
		text = tl(trans.albums);
		icon_name = icons.albums;
	} else if (type == 'tracks') {
		text = tl(trans.tracks);
		icon_name = icons.tracks;
	}

	const value_elem = createRef();

	const elem = (
		<div class={['summary-block', counter && 'summary-block-hidden', large && 'size-lg']}>
			<div class={['summary-icon', large && 'size-lg']}>
				<Icon name={icon_name} identifier='summary' />
			</div>
			<div class={['summary-info', large && 'size-lg']}>
				<h3 class='summary-label'>{text}</h3>
				<p class='summary-value' ref={value_elem}>
					{value.toLocaleString(lang)}
				</p>
			</div>
		</div>
	);

	if (tooltip) {
		hover_tooltip(
			elem,
			<Tooltip>{tooltip}</Tooltip>,
		);
	}

	if (counter) {
		const count = new CountUp(value_elem.current, value);

		lazy(elem, () => {
			count.start();

			setTimeout(() => {
				elem.classList.remove('summary-block-hidden');
			}, 10);
		});
	}

	return elem;
}
