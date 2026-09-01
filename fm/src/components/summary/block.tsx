import { WithChildren } from '@/types/generic.tsx';
import { lang, tl, trans } from '@/build/trans.ts';
import { createRef, ReactNode } from 'jsx-dom';
import { Icon, icons } from '@/components/shared/icon.tsx';
import { hover_tooltip, Tooltip } from '@/components/shared/tooltips.tsx';
import { CountUp } from 'countup.js';

export function ProfileSummaryBlocks({
	children,
}: WithChildren) {
	return (
		<div class='summary-blocks'>
			{children}
		</div>
	);
}

interface ProfileSummaryBlockProps {
	type: string;
	value: number;
	tooltip?: ReactNode;
	counter?: boolean;
}

export function ProfileSummaryBlock({
	type,
	value,
	tooltip,
	counter,
}: ProfileSummaryBlockProps) {
	let text: ReactNode;
	let icon_name;

	if (type == 'scrobbles') {
		text = tl(trans.scrobbles);
		icon_name = icons.track;
	} else if (type == 'artists') {
		text = tl(trans.artists);
		icon_name = icons.artist;
	} else if (type == 'loved') {
		text = tl(trans.loved);
		icon_name = icons.loved;
	}

	const value_elem = createRef();

	const elem = (
		<div class={['summary-block', counter && 'summary-block-hidden']}>
			<div class='summary-icon'>
				<Icon name={icon_name} identifier='summary' />
			</div>
			<div class='summary-info'>
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

		setTimeout(() => {
			count.start();

			setTimeout(() => {
				elem.classList.remove('summary-block-hidden');
			}, 10);
		}, 0);
	}

	return elem;
}
