/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { createRef, ReactNode } from 'jsx-dom';
import tippy, { Instance, Props } from 'tippy.js';

export interface SelectOption {
	value?: string;
	text: ReactNode | (() => ReactNode);
	onSelect?: () => void;
	type?: string;
}

interface SelectProps {
	ref?: ReturnType<typeof createRef<HTMLDivElement>>;
	values: SelectOption[];
	value?: string;
	disabled?: boolean;
	className?: string;
	name?: string;
	onChange?: (val: string) => void;
	inSettings?: boolean;
}

type SelectElement = HTMLDivElement & {
	value: string;
	disabled: boolean;
};

export function Select({
	ref,
	values,
	value,
	disabled,
	className,
	name,
	onChange,
	inSettings,
}: SelectProps) {
	if (!value) value = values.find((v) => 'value' in v)?.value;

	const button = createRef();
	const select = createRef();

	const wrap = (
		<div
			class={['select-wrap', 'custom-selector', className && className]}
			ref={ref}
		>
			<select name={name} ref={select} />
			<button
				type='button'
				class={[
					'btn',
					'select-button',
					inSettings && 'select-in-settings',
				]}
				ref={button}
			/>
		</div>
	) as SelectElement;

	const menu = tippy(button.current, {
		theme: 'select-menu',
		placement: 'bottom',
		interactive: true,
		interactiveBorder: 10,
		trigger: 'click',
		appendTo: document.body,

		onShow(instance: Instance<Props>) {
			if (values.length > 15) {
				setTimeout(() => {
					const focused = instance.popper.querySelector(
						'[aria-checked="true"]',
					);
					if (!focused) return;

					focused
						.scrollIntoView({
							behavior: 'instant',
							block: 'center',
							container: 'nearest',
						});
				}, 1);
			}
		},
	});

	Object.defineProperty(wrap, 'value', {
		get() {
			return value;
		},
		set(val: string) {
			set(val);
		},
	});

	Object.defineProperty(wrap, 'disabled', {
		get() {
			return value;
		},
		set(val: boolean) {
			disabled = val;
			update();
		},
	});

	function set(val: string) {
		value = val;
		update();
	}

	function update(initial = false) {
		if (disabled) {
			button.current.setAttribute('disabled', 'true');
		} else {
			button.current.removeAttribute('disabled');
		}

		select.current.replaceChildren(
			<>
				{values.map((val, i) => {
					if (val.value == null) return;

					return (
						<option
							value={val.value}
							selected={val.value == value}
							key={i}
						>
							{select_text(val.text)}
						</option>
					);
				})}
			</>,
		);

		// fallback
		button.current.replaceChildren('?');

		const val = values.find((v) => v.value == value);
		if (!val) return;

		button.current.replaceChildren(select_text(val.text));

		select.current.value = value;

		if (onChange && !initial) onChange(value as string);

		menu.hide();

		setTimeout(() => {
			menu.setContent(
				<>
					{values.map((val, i) => {
						if (val.value == null) {
							if (val.onSelect) {
								return (
									<button
										type='button'
										class={[
											'btn',
											'dropdown-menu-clickable-item',
											'icon-mask',
										]}
										data-type={val.type}
										onClick={() => {
											menu.hide();
											val.onSelect!();
										}}
										key={i}
									>
										{select_text(val.text)}
									</button>
								);
							}

							if (val.text == 'sep') {
								return <div class='sep' key={i} />;
							}

							return (
								<div class='select-header' key={i}>
									{select_text(val.text)}
								</div>
							);
						}

						return (
							<button
								type='button'
								class={[
									'btn',
									'dropdown-menu-clickable-item',
									'select-item',
								]}
								aria-checked={String(val.value == value)}
								onClick={() => set(val.value!)}
								key={i}
							>
								{select_text(val.text)}
							</button>
						);
					})}
				</>,
			);
		}, 300);
	}

	update(true);

	return wrap;
}

function select_text(text: ReactNode | (() => ReactNode)) {
	if (typeof text == 'function') {
		return text();
	}

	return text;
}
