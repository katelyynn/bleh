import { tl, trans } from '@/build/trans.ts';
import { version } from '@/main.js';
import { WithChildren } from '@/types/generic.tsx';
import { DateTime } from 'luxon';
import { Button } from '@/components/button/button.tsx';
import { Icon, icons } from '@/components/shared/icon.tsx';

export function NewsTitle() {
	return (
		<h1 class={['news-title']}>
			{tl(trans.the_bleh_times, {
				b: <i class={['news-title-label']}>{version.brand}</i>,
			})}
		</h1>
	);
}

interface NewsDateProps {
	version: string;
}

export function NewsDate({
	version,
}: NewsDateProps) {
	const date = version_to_date(version);

	return (
		<h2 class={['news-date']}>
			{DateTime.fromISO(date).toLocaleString(DateTime.DATE_HUGE)}
		</h2>
	);
}

export function NewsPieces({
	children,
}: WithChildren) {
	return (
		<div class='news-pieces'>
			{children}
		</div>
	);
}

export function NewsPieceMain({
	children,
}: WithChildren) {
	return (
		<div class='news-piece-main'>
			{children}
		</div>
	);
}

export function NewsPieceBack({
	children,
}: WithChildren) {
	return (
		<div class='news-piece-back'>
			{children}
		</div>
	);
}

export function NewsPieceBack2({
	children,
}: WithChildren) {
	return (
		<div class='news-piece-back-2'>
			{children}
		</div>
	);
}

export function version_to_date(v: string) {
	return v.replace(/^(\d{4})\.(\d{2})(\d{2}).*$/, '$1-$2-$3');
}

interface NewsActionProps {
	disabled?: boolean;
	onClick: () => void;
	type: 'prev' | 'next';
}

type NewsActionElement = HTMLButtonElement & {
	disabled: boolean;
};

export function NewsAction({
	disabled,
	onClick,
	type,
}: NewsActionProps) {
	const text = type == 'prev' ? tl(trans.prev) : tl(trans.next);

	return (
		<Button
			chibi
			className='news-update-action'
			tooltip={text}
			onClick={onClick}
			disabled={disabled}
		>
			<Icon
				name={type == 'prev' ? icons.arrow_left : icons.arrow_right}
			/>
			{text}
		</Button>
	) as NewsActionElement;
}
