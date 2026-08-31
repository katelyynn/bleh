/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { createRef } from 'jsx-dom';
import { SeeMore } from '@/components/text/see_more.tsx';
import { tl, trans } from '@/build/trans.ts';
import { icons } from '@/components/shared/icon.tsx';

export type InputType =
	| 'text'
	| 'number'
	| 'date'
	| 'password'
	| 'textarea'
	| 'colour'
	| 'url';

interface InputProps {
	ref?: ReturnType<typeof createRef<HTMLDivElement>>;
	className?: string;
	value?: string | number;
	name?: string;
	length?: number;
	disabled?: boolean;
	type?: InputType;
	onChange?: (val: string | number) => void;
	onSubmit?: (val: string | number) => void;
	saveManually?: boolean;
	saveText?: string;
}

type InputElement = HTMLDivElement & {
	disabled: boolean;
	focus: () => void;
};

export function Input({
	ref,
	className,
	value = '',
	name,
	length,
	disabled,
	type = 'text',
	onChange,
	onSubmit,
	saveManually = false,
	saveText,
}: InputProps) {
	const input = createRef();
	const colour_block = createRef();

	const wrap = (
		<div
			class={[
				'content-form',
				'input-container',
				'colourful',
				type == 'textarea' && 'textarea',
				className && className,
				saveManually && 'save-manually',
			]}
			data-type={type}
			ref={ref}
		>
			{type == 'colour' && (
				<span class='colour-block' ref={colour_block} />
			)}
			{type != 'textarea'
				? (
					<input
						class='modern-input'
						type={type}
						value={value}
						ref={input}
						maxlength={length}
						name={name}
						onInput={() => {
							if (
								type == 'colour' &&
								!input.current.value.startsWith('#')
							) {
								input.current.value = `#${input.current.value}`;
							}

							value = input.current.value;
							update(true);
						}}
						onKeyDown={(e: KeyboardEvent) => {
							if (e.key == 'Enter') {
								if (onSubmit) onSubmit(input.current.value);
								return;
							}

							if (
								type == 'colour' &&
								!input.current.value.startsWith('#')
							) {
								input.current.value = `#${input.current.value}`;
							}

							value = input.current.value;
							update(true);
						}}
					/>
				)
				: (
					<textarea
						class='modern-input'
						value={value}
						ref={input}
						name={name}
						onChange={() => {
							value = input.current.value;
							update(true);
						}}
						onKeyDown={(e: KeyboardEvent) => {
							if (e.key == 'Enter') {
								if (onSubmit) onSubmit(input.current.value);
								return;
							}

							value = input.current.value;
							update(true);
						}}
					/>
				)}
			{saveManually && (
				<SeeMore
					icon={icons.save}
					iconPlacement='left'
					onClick={() => {
						update(true);
						if (onSubmit) onSubmit(input.current.value);
					}}
				>
					{saveText || tl(trans.save)}
				</SeeMore>
			)}
		</div>
	) as InputElement;

	function update(from_input = false) {
		if (disabled) {
			input.current.setAttribute('disabled', 'true');
		} else {
			input.current.removeAttribute('disabled');
		}

		if (type == 'colour') {
			colour_block.current.style.backgroundColor = value;
		}

		if (!from_input) {
			input.current.value = value;
		} else {
			if (onChange) onChange(input.current.value);
		}
	}

	Object.defineProperty(wrap, 'value', {
		get() {
			return value;
		},
		set(val: string | number) {
			value = val;
			update();
		},
	});

	Object.defineProperty(wrap, 'disabled', {
		get() {
			return disabled;
		},
		set(val: boolean) {
			disabled = val;
			update();
		},
	});

	update();

	wrap.focus = () => {
		input.current.focus();
	};

	return wrap;
}
