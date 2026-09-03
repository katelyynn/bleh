import { createRef, ReactNode } from 'jsx-dom';

interface AlertProps {
	ref?: ReturnType<typeof createRef<HTMLLabelElement>>;
	type?: 'info' | 'danger' | 'error' | 'success';
	margin?: boolean;
	children?: ReactNode;
}

export function Alert({
	ref,
	type = 'info',
	margin,
	children,
}: AlertProps) {
	return (
		<label
			class={['alert', `alert-${type}`, !margin && 'no-margin']}
			ref={ref}
		>
			{children}
		</label>
	);
}
