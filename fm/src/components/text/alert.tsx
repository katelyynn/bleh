import { ReactNode } from 'jsx-dom';

interface AlertProps {
	type?: 'info' | 'danger' | 'error' | 'success';
	margin?: boolean;
	children: ReactNode;
}

export function Alert({
	type = 'info',
	margin,
	children,
}: AlertProps) {
	return (
		<label class={['alert', `alert-${type}`, !margin && 'no-margin']}>
			{children}
		</label>
	);
}
