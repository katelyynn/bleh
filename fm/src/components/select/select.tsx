/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { createRef, ReactNode } from 'jsx-dom';
import {
	flip,
	inline,
	offset as offsetMiddleware,
	shift as shiftMiddleware,
} from '@floating-ui/dom';
import { menu_tooltip, Tooltip } from '@/components/shared/tooltips.tsx';
import { tl, trans } from '@/build/trans.ts';

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
	allowArbitrary?: boolean;
}

type SelectElement = HTMLDivElement & {
	value: string;
	disabled: boolean;
	open: () => void;
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
	allowArbitrary,
}: SelectProps) {
	if (!value) value = values.find((v) => 'value' in v)?.value;

	const button = createRef();
	const select = createRef();
	const inner = createRef();
	const input = createRef();

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
					allowArbitrary && 'arbitrary',
				]}
				ref={button}
			/>
			<input
				class={['select-input']}
				onInput={() => {
					temporary_focus = -1;
					search();
				}}
				onKeyDown={(e) => {
					if (!e.key.startsWith('Arrow') && e.key != 'Enter') return;

					e.preventDefault();

					if (e.key.startsWith('Arrow')) {
						if (temporary_focus < 0) find_temporary_focus();
					}

					if (
						e.key == 'ArrowUp' &&
						temporary_focus - 1 >= 0
					) {
						temporary_focus--;
						search();
					} else if (
						e.key == 'ArrowDown' &&
						temporary_focus + 1 < results.length
					) {
						temporary_focus++;
						search();
					} else if (e.key == 'Enter') {
						if (results[temporary_focus].value != null) {
							set(results[temporary_focus].value!);
						} else if (results[temporary_focus].onSelect) {
							results[temporary_focus].onSelect!();
						}

						temporary_focus = -1;
					}
				}}
				ref={input}
			/>
		</div>
	) as SelectElement;

	function find_temporary_focus() {
		const in_results = results.findIndex((v) => v.value == value);

		if (in_results >= 0) {
			temporary_focus = in_results;
		} else {
			temporary_focus = 0;
		}
	}

	let temporary_focus = 0;
	let results: SelectOption[] = [];

	const menu = menu_tooltip(
		button.current,
		<Tooltip
			theme='select-menu'
			ref={inner}
			onPointerDown={() => {
				setTimeout(() => {
					if (menu.is_mounted) {
						input.current.focus();
					}
				}, 0);
			}}
		/>,
		{
			middleware: [
				flip(),
				inline(),
				shiftMiddleware({
					crossAxis: true,
					padding: 4,
				}),
				offsetMiddleware(2),
			],
			onShow: (element) => {
				if (values.length > 15) {
					setTimeout(() => {
						const focused = element.querySelector(
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

				temporary_focus = -1;
				input.current.value = '';
				input.current.focus();
				search();
			},
			onHide: () => {
				temporary_focus = -1;
				input.current.value = '';
				input.current.blur();
				input.current.classList.remove('with-query');
				button.current.classList.remove('with-query');

				button.current.focus();
			},
		},
	);

	function search() {
		const query = input.current.value.trim() || '';
		input.current.classList.toggle('with-query', query);
		button.current.classList.toggle('with-query', query);

		results = values.filter((val) => {
			if (query == '') return true;

			if (val.value == null) return false;

			if (typeof val.text == 'function') {
				const text = (val.text() as Element).textContent
					.trim().toLowerCase();
				console.info('testing elem', text);
				if (!text.includes(query)) return false;
			} else {
				console.info('testing', val.text);
				if (
					!(val.text as string).toLowerCase().includes(
						query,
					)
				) {
					return false;
				}
			}

			return true;
		});

		if (
			!results.find((v) => v.value == query.toLowerCase()) &&
			query != '' && allowArbitrary
		) {
			results = [
				{
					type: 'arbitrary',
					text: query || value,
					value: query || value,
					onSelect: () => {
						temporary_focus = -1;
						input.current.value = '';
					},
				},
				...results,
			];
		}

		if (
			query && (temporary_focus < 0 || temporary_focus > results.length)
		) {
			find_temporary_focus();
		}

		console.info(
			'testing | query:',
			query,
			'focus:',
			temporary_focus,
			'value:',
			value,
			results,
		);

		inner.current.replaceChildren(
			<>
				{results.map((val, i) => {
					if (val.value == null && val.type != 'arbitrary') {
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

					const selected = val.value == value || i == temporary_focus;

					return (
						<button
							type='button'
							class={[
								'btn',
								'dropdown-menu-clickable-item',
								'select-item',
								(i == temporary_focus && val.value != value) &&
								'candidate',
							]}
							aria-checked={String(selected)}
							onClick={() => {
								if (val.value == null) return;

								if (val.onSelect) val.onSelect();
								set(val.value!);
							}}
							key={i}
						>
							{select_text(val.text)}
						</button>
					);
				})}
				{(allowArbitrary && !query) && (
					<div class='select-header'>
						{tl(trans.select_arbitrary)}
					</div>
				)}
			</>,
		);
	}

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

	wrap.open = () => {
		menu.show();
	};

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
		button.current.replaceChildren(value);

		const val = values.find((v) => v.value == value) || { text: value };

		button.current.replaceChildren(select_text(val.text));

		select.current.value = value;

		if (onChange && !initial) onChange(value as string);

		menu.hide();

		setTimeout(() => {
			search();
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
