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
import {
	Keybind,
	KeybindList,
} from '@/components/settings/clickables/keybind.tsx';
import { SettingIcon } from '@/components/settings/provider/icon.tsx';

interface SettingKeybindProps {
	ref?: ReturnType<typeof createRef<HTMLDivElement>>;
	value?: string[];
	bind?: string;
	icon?: string;
	name?: string;
	body?: string;
	showLabel?: boolean;
	onChange?: (val: string[]) => void;
	disabled?: boolean;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
}

type SettingKeybindElement = HTMLDivElement & {
	update: () => void;
	value: string | number;
};

export function SettingKeybind({
	ref,
	value = [],
	bind,
	icon,
	name,
	body,
	showLabel = true,
	onChange,
	disabled,
	onMouseEnter,
	onMouseLeave,
}: SettingKeybindProps) {
	let previousValue: string[] = [];
	if (bind) value = settings[bind] as string[];

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
		let incompatible_strings: string[] = [];

		if (store) {
			({
				incompatible,
				list: incompatible_list,
				list_strings: incompatible_strings,
			} = is_incompatible(
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

		if (value == previousValue) return;
		previousValue = value;

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
				<KeybindList ref={input}>
					{value.map((key, index) => {
						const interact = !['⌘', '⇧', '⌥', '⌃', '⏎', '⎋', '⌫']
							.includes(key);

						return (
							<Keybind
								value={key}
								interact={interact}
								onChange={(val: string) => {
									const next = [...value];
									next[index] = val;

									previousValue = next;
									set(next);
								}}
								key={index}
							/>
						);
					})}
				</KeybindList>
				{Object.keys(incompatible_list).length > 0 && (
					<SettingIncompatibleWith
						list={incompatible_list}
						strings={incompatible_strings}
					/>
				)}
			</>,
		);
	}

	const elem = (
		<div
			class='setting'
			data-type='keybind'
			id={bind}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			ref={ref}
		/>
	) as SettingKeybindElement;

	update();

	function set(val: string[]) {
		value = val;
		console.info('setting: set value to', val);

		reset.current.value = val;

		if (bind) save_setting(bind, val);
		if (onChange) onChange(val);
		if (onMouseEnter) onMouseEnter();
		update();
	}

	Object.defineProperty(elem, 'value', {
		get() {
			return value;
		},
	});

	elem.update = update;

	return elem;
}
