import { ReactNode } from 'jsx-dom';
import { useSettings } from '@/page.ts';

interface SideActionsProps {
	children?: ReactNode;
}

export function SideActions({
	children,
}: SideActionsProps) {
	const elem = (
		<section class='side-actions'>
			{children}
		</section>
	);

	function update() {
		elem.setAttribute('data-theme', useSettings.get('theme') as string);
	}

	update();
	useSettings.on('theme', update);

	return elem;
}

interface SideActionProps {
	type: string;
	onClick?: () => void;
	children: ReactNode;
}

export function SideAction({
	type,
	onClick,
	children,
}: SideActionProps) {
	return (
		<button
			type='button'
			class={['btn', 'side-action', 'icon-mask']}
			data-type={type}
			onClick={onClick}
		>
			{children}
		</button>
	);
}
