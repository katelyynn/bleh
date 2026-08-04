/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { createRef } from 'jsx-dom';
import { SeeMore } from '@/components/text/see_more.tsx';
import { tl, trans } from '@/build/trans.ts';
import { icons } from '@/components/shared/icon.tsx';

export type InputType = 'text' | 'number' | 'date' | 'password' | 'textarea';

interface InputProps {
	ref?: ReturnType<typeof createRef<HTMLDivElement>>;
	className?: string;
	value?: string | number;
	disabled?: boolean;
	type?: InputType;
	onChange?: (val: string | number) => void;
	onSubmit?: (val: string | number) => void;
	saveManually?: boolean;
}

type InputElement = HTMLDivElement & {
	disabled: boolean;
};

export function Input({
	ref,
	className,
	value = '',
	disabled,
	type = 'text',
	onChange,
	onSubmit,
	saveManually = false,
}: InputProps) {
	const input = createRef();

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
			ref={ref}
		>
			{type != 'textarea'
				? (
					<input
						class='modern-input'
						type={type}
						value={value}
						ref={input}
						onChange={() => {
							value = input.current.value;
							update(true);
						}}
						onKeyDown={(e: KeyboardEvent) => {
							if (e.key != 'Enter') return;

							update(true);
							if (onSubmit) onSubmit(input.current.value);
						}}
					/>
				)
				: (
					<textarea
						class='modern-input'
						value={value}
						ref={input}
						onChange={() => {
							value = input.current.value;
							update(true);
						}}
						onKeyDown={(e: KeyboardEvent) => {
							if (e.key != 'Enter') return;

							update(true);
							if (onSubmit) onSubmit(input.current.value);
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
					{tl(trans.save)}
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

		if (!from_input) {
			input.current.value = value;
		}

		if (onChange) onChange(input.current.value);
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

	return wrap;
}
