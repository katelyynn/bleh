/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ClassNames, createRef, ReactNode } from 'jsx-dom';
import { Icon, icons } from '@/components/shared/icon.tsx';
import { tl, trans } from '@/build/trans.ts';
import tippy, { Props } from 'tippy.js';

interface ButtonProps {
	ref?: ReturnType<typeof createRef>;
	type?: 'button' | 'submit',
	chibi?: boolean;
	primary?: boolean;
	colourful?: boolean;
	accented?: boolean;
	disabled?: boolean;
	loading?: boolean;
	menu?: boolean;
	href?: string;
	external?: boolean;
	onClick?: () => void;
	className?: string;
	children: ReactNode;
	tooltip?: Partial<Props>;
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
	type = 'button',
	chibi = false,
	primary = false,
	colourful = false,
	accented = false,
	disabled = false,
	loading = false,
	menu = false,
	href,
	external,
	onClick,
	className,
	children,
	tooltip,
}: ButtonProps) {
	const classes: ClassNames = [
		'btn',
		'flex-button',
		chibi && 'chibi',
		primary && 'primary',
		colourful && 'colourful',
		menu && 'dropdown-menu-clickable-item',
		(menu && accented) && 'accented-menu-item',
		className && className,
	];

	let elem: ButtonElement | ButtonLinkElement;

	if (!href) {
		elem = (
			<button
				type={type}
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

	if (tooltip) {
		tippy(elem, tooltip);
	}

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

interface ButtonComboProps {
	children: ReactNode;
}

export function ButtonCombo({
	children,
}: ButtonComboProps) {
	return (
		<div class='button-combo'>
			{children}
		</div>
	);
}

export function ButtonComboSeparator() {
	return <div class='button-combo-sep' />;
}
