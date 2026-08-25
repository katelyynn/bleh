import { WithChildren } from '@/types/generic.tsx';
import { Tooltip } from '@/components/shared/tooltips.tsx';
import { createRef, ReactNode } from 'jsx-dom';
import { Icon } from '@/components/shared/icon.tsx';

export function NavWindow({
	children,
}: WithChildren) {
	return (
		<Tooltip theme='nav-window'>
			{children}
		</Tooltip>
	);
}

interface NavWindowHeaderProps {
	icon: string;
	name: ReactNode;
}

export function NavWindowHeader({
	icon,
	name,
}: NavWindowHeaderProps) {
	return (
		<div class='window-header'>
			<Icon name={icon} identifier='window_header' />
			<div class='window-title'>{name}</div>
		</div>
	);
}

interface NavWindowContentsProps {
	ref?: ReturnType<typeof createRef<HTMLDivElement>>;
	className?: string;
	children: ReactNode;
}

export function NavWindowContents({
	ref,
	className,
	children,
}: NavWindowContentsProps) {
	return (
		<div class={['window-content', className && className]} ref={ref}>
			{children}
		</div>
	);
}
