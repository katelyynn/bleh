import { ReactNode } from 'jsx-dom';

interface SideActionsProps {
	children: ReactNode;
}

export function SideActions({
	children,
}: SideActionsProps) {
	return (
		<section class='side-actions'>
			{children}
		</section>
	);
}

interface SideActionProps {
	type: string;
	children: ReactNode;
}

export function SideAction({
	type,
	children,
}: SideActionProps) {
	return (
		<button
			type='button'
			class={['btn', 'side-action', 'icon-mask']}
			data-type={type}
		>
			{children}
		</button>
	);
}
