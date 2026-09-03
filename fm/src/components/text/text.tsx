import { ReactNode } from 'jsx-dom';
import { Icon } from '@/components/shared/icon.tsx';

interface IconLabelProps {
	icon: string;
	children: ReactNode;
}

export function IconLabel({
	icon,
	children,
}: IconLabelProps) {
	return (
		<>
			<Icon name={icon} />
			{children}
		</>
	);
}
