import { WithChildren } from '@/types/generic.tsx';
import { createRef } from 'jsx-dom';

export function CompareHeader({
	children,
}: WithChildren) {
	return (
		<div class='compare-header'>
			{children}
		</div>
	);
}

export function CompareBody({
	ref,
	children,
}: WithChildren) {
	return (
		<div
			class='compare-body'
			ref={ref as ReturnType<typeof createRef<HTMLDivElement>>}
		>
			{children}
		</div>
	);
}
