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
