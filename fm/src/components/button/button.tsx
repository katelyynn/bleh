import { ClassNames, createRef, ReactNode } from 'jsx-dom';

interface ButtonProps {
	ref?: ReturnType<typeof createRef>;
	primary?: boolean;
	colourful?: boolean;
	href?: string;
	external?: boolean;
	onClick?: () => void;
	className?: string;
	children: ReactNode;
}

export function Button({
	ref,
	primary = false,
	colourful = false,
	href,
	external,
	onClick,
	className,
	children,
}: ButtonProps) {
	const classes: ClassNames = [
		'btn',
		primary && 'primary',
		colourful && 'colourful',
		className && className,
	];

	if (!href) {
		return (
			<button
				type='button'
				class={classes}
				onClick={onClick}
				ref={ref as ReturnType<typeof createRef<HTMLButtonElement>>}
			>
				{children}
			</button>
		);
	}

	return (
		<a
			class={classes}
			href={href}
			target={external ? '_blank' : undefined}
			onClick={onClick}
			ref={ref as ReturnType<typeof createRef<HTMLAnchorElement>>}
		>
			{children}
		</a>
	);
}
