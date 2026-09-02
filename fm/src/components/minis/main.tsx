import { WithChildren } from '@/types/generic.tsx';

export function CompareHeader({
	children,
}: WithChildren) {
	return (
		<div class='compare-header'>
			{children}
		</div>
	);
}
