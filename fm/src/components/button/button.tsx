import { ClassNames, createRef, ReactNode } from 'jsx-dom';
import { Icon, icons } from '@/components/shared/icon.tsx';
import { tl, trans } from '@/build/trans.ts';

interface ButtonProps {
	ref?: ReturnType<typeof createRef>;
	primary?: boolean;
	colourful?: boolean;
	disabled?: boolean;
	loading?: boolean;
	href?: string;
	external?: boolean;
	onClick?: () => void;
	className?: string;
	children: ReactNode;
}

type ButtonElement = HTMLButtonElement & {
	disabled: boolean;
	loading: boolean;
};

type ButtonLinkElement = HTMLAnchorElement & {
	disabled: boolean;
	loading: boolean;
};

export function Button({
	ref,
	primary = false,
	colourful = false,
	disabled = false,
	loading = false,
	href,
	external,
	onClick,
	className,
	children,
}: ButtonProps) {
	const classes: ClassNames = [
		'btn',
		'flex-button',
		primary && 'primary',
		colourful && 'colourful',
		className && className,
	];

	let elem: ButtonElement | ButtonLinkElement;

	if (!href) {
		elem = (
			<button
				type='button'
				class={classes}
				onClick={handleOnClick}
				ref={ref as ReturnType<typeof createRef<HTMLButtonElement>>}
			>
				{children}
			</button>
		) as ButtonElement;
	}

	elem = (
		<a
			class={classes}
			href={href}
			target={external ? '_blank' : undefined}
			onClick={handleOnClick}
			ref={ref as ReturnType<typeof createRef<HTMLAnchorElement>>}
		>
			{children}
		</a>
	) as ButtonLinkElement;

	function handleOnClick() {
		if (!onClick || disabled || loading) return;

		onClick();
	}

	function update() {
		if (disabled) {
			elem.setAttribute('disabled', 'true');
		} else {
			elem.removeAttribute('disabled');
		}

		if (loading) {
			elem.replaceChildren(
				<>
					<Icon name={icons.spinner} />
					{tl(trans.loading)}
				</>,
			);
			elem.setAttribute('data-loading', 'true');
		} else {
			elem.replaceChildren(
				<>
					{children}
				</>,
			);
			elem.removeAttribute('data-loading');
		}
	}

	Object.defineProperty(elem, 'disabled', {
		get() {
			return disabled;
		},
		set(val: boolean) {
			disabled = val;
			update();
		},
	});

	Object.defineProperty(elem, 'loading', {
		get() {
			return loading;
		},
		set(val: boolean) {
			loading = val;
			update();
		},
	});

	update();

	return elem;
}
