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
import { Input, InputType } from '@/components/input/input.tsx';
import { SettingIcon } from '@/components/settings/provider/icon.tsx';
import { useSettings } from '@/page.ts';

interface SettingInputProps {
	ref?: ReturnType<typeof createRef<HTMLDivElement>>;
	bind?: string;
	type?: InputType;
	length?: number;
	icon?: string;
	name?: string;
	body?: string;
	showLabel?: boolean;
	onChange?: (val: string | number) => void;
	disabled?: boolean;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
	saveText?: string;
}

type SettingInputElement = HTMLDivElement & {
	update: () => void;
	value: string | number;
};

export function SettingInput({
	ref,
	bind,
	type,
	length,
	icon,
	name,
	body,
	showLabel = true,
	onChange,
	disabled,
	onMouseEnter,
	onMouseLeave,
	saveText,
}: SettingInputProps) {
	let value = bind ? settings[bind] as string | number : '';

	const uuid = crypto.randomUUID();

	if (bind) {
		useSettings.on(bind, (val, id) => {
			if (id == uuid) return;

			set(val as string | number, true);
		});
	}

	const input = createRef();
	const reset = createRef();

	const store = get_from_store(bind);

	if (store) {
		if (!icon) icon = store.icon;
	}

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
				{icon && <SettingIcon name={icon} />}
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
					type={type}
					length={length}
					onSubmit={set}
					ref={input}
					saveManually
					saveText={saveText}
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
			id={`setting_${bind}`}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			ref={ref}
		/>
	) as SettingInputElement;

	update();

	function set(val: string | number, received = false) {
		if (value == val) return;

		value = val;

		if (reset.current) reset.current.value = val;

		if (bind) {
			if (!received) useSettings.set(bind, val, uuid);
		} else {
			if (onChange) onChange(val);
		}

		if (onMouseEnter) onMouseEnter();
		update();
	}

	Object.defineProperty(elem, 'value', {
		get() {
			return value;
		},
		set(val: string) {
			value = val;
			update();
		},
	});

	elem.update = update;

	return elem;
}
