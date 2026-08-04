/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { createRef } from 'jsx-dom';
import {
	get_from_store,
	is_incompatible,
	SettingIncompatibleWith,
	SettingLabel,
} from '@/components/settings/provider/main.tsx';
import { settings } from '@/build/config.ts';
import { save_setting } from '@/components/settings/settings.tsx';
import { Input } from '@/components/input/input.tsx';

interface SettingInputProps {
	ref?: ReturnType<typeof createRef<HTMLDivElement>>;
	bind?: string;
	name?: string;
	body?: string;
	showLabel?: boolean;
	onChange?: (val: string | number) => void;
	disabled?: boolean;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
}

type SettingInputElement = HTMLDivElement & {
	update: () => void;
	value: string | number;
};

export function SettingInput({
	ref,
	bind,
	name,
	body,
	showLabel = true,
	onChange,
	disabled,
	onMouseEnter,
	onMouseLeave,
}: SettingInputProps) {
	let value = bind ? settings[bind] as string | number : '';

	const input = createRef();
	const reset = createRef();

	const store = get_from_store(bind);

	function update() {
		disabled = false;

		let incompatible = false;
		let incompatible_list: Record<string, boolean> = {};

		if (store) {
			({ incompatible, list: incompatible_list } = is_incompatible(
				store,
			));
		}

		if (incompatible) {
			disabled = true;
		}

		if (disabled) {
			elem.setAttribute('disabled', 'true');
		} else {
			elem.removeAttribute('disabled');
		}

		elem.replaceChildren(
			<>
				{showLabel && (
					<SettingLabel
						name={name}
						body={body}
						store={store}
						value={value}
						setValue={set}
						defaultValue={store?.default}
						ref={reset}
					/>
				)}
				<Input
					className='setting-inner'
					value={value}
					onSubmit={set}
					ref={input}
					saveManually
				/>
				{Object.keys(incompatible_list).length > 0 && (
					<SettingIncompatibleWith list={incompatible_list} />
				)}
			</>,
		);
	}

	const elem = (
		<div
			class='setting'
			data-type='input'
			id={bind}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			ref={ref}
		/>
	) as SettingInputElement;

	update();

	function set(val: string | number) {
		value = val;

		reset.current.value = val;

		if (bind) save_setting(bind, val);
		if (onChange) onChange(val);
	}

	Object.defineProperty(elem, 'value', {
		get() {
			return value;
		},
	});

	elem.update = update;

	return elem;
}
