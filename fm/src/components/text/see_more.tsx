import { ReactNode } from 'jsx-dom';
import type { ClassNames } from 'jsx-dom';

interface SeeMoreProps {
	href?: string;
	external?: boolean;
	onClick?: () => void;
	children: ReactNode;
}

export function SeeMore({
	href,
	external = false,
	onClick,
	children,
}: SeeMoreProps) {
	const classes: ClassNames = ['see-more'];

	if (!href && onClick) {
		return (
			<button
				type='button'
				class={classes}
				onClick={onClick}
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
		>
			{children}
		</a>
	);
}

interface SeeMoreGroupProps {
	children: ReactNode;
}

export function SeeMoreGroup({
	children,
}: SeeMoreGroupProps) {
	return (
		<div class='see-more-row'>
			{children}
		</div>
	);
}
