import { WithChildren } from '@/types/generic.tsx';
import { Tooltip } from '@/components/shared/tooltips.tsx';

export function MenuContents({
	children,
}: WithChildren) {
	return (
		<Tooltip theme='context-menu'>
			{children}
		</Tooltip>
	);
}
