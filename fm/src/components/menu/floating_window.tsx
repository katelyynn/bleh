import { WithChildren } from '@/types/generic.tsx';
import { Tooltip } from '@/components/shared/tooltips.tsx';
import { createRef, ReactNode } from 'jsx-dom';
import { Icon } from '@/components/shared/icon.tsx';

export function FloatingWindow({
	children,
}: WithChildren) {
	return (
		<Tooltip theme='window'>
			{children}
		</Tooltip>
	);
}

interface FloatingWindowHeaderProps {
	icon: string;
	name: ReactNode;
}

export function FloatingWindowHeader({
	icon,
	name,
}: FloatingWindowHeaderProps) {
	return (
		<div class='window-header'>
			<Icon name={icon} identifier='window_header' />
			<div class='window-title'>{name}</div>
		</div>
	);
}

interface FloatingWindowContentsProps {
	ref?: ReturnType<typeof createRef<HTMLDivElement>>;
	className?: string;
	children: ReactNode;
}

export function FloatingWindowContents({
	ref,
	className,
	children,
}: FloatingWindowContentsProps) {
	return (
		<div class={['window-content', className && className]} ref={ref}>
			{children}
		</div>
	);
}
