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
import { SettingIcon } from '@/components/settings/provider/icon.tsx';
import { Select, SelectOption } from '@/components/select/select.tsx';
import { useSettings } from '@/page.ts';

interface SettingSelectProps {
	ref?: ReturnType<typeof createRef<HTMLDivElement>>;
	values?: SelectOption[];
	value?: string;
	bind?: string;
	icon?: string;
	name?: string;
	body?: string;
	showLabel?: boolean;
	onChange?: (val: string) => void;
	disabled?: boolean;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
}

type SettingSelectElement = HTMLDivElement & {
	update: () => void;
	value: string | number;
};

export function SettingSelect({
	ref,
	values,
	value,
	bind,
	icon,
	name,
	body,
	showLabel = true,
	onChange,
	disabled,
	onMouseEnter,
	onMouseLeave,
}: SettingSelectProps) {
	if (bind) value = settings[bind] as string;

	const uuid = crypto.randomUUID();

	if (bind) {
		useSettings.on(bind, (val, id) => {
			if (id == uuid) return;

			set(val as string, true);
		});
	}

	const reset = createRef();

	const store = get_from_store(bind);

	if (store) {
		if (!icon) icon = store.icon;
		if (!values && store.values) values = store.values;

		if (store.incompatible) {
			Object.entries(store.incompatible).forEach(([key]) => {
				useSettings.on(key, () => {
					update();
				});
			});
		}
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

		elem.replaceChildren(
			<>
				{icon && <SettingIcon name={icon} />}
				{showLabel && (
					<SettingLabel
						name={name}
						body={body}
						store={store}
						value={value}
						setValue={(val: string) => {
							set(val);
							update();
						}}
						defaultValue={store?.default}
						ref={reset}
					/>
				)}
				<Select
					className='setting-inner'
					value={value}
					values={values}
					onChange={set}
					inSettings
				/>
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
			data-type='select'
			id={`setting_${bind}`}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			ref={ref}
		/>
	) as SettingSelectElement;

	update();

	function set(val: string, received = false) {
		if (value == val) return;

		value = val;
		reset.current.value = val;

		if (bind) {
			if (!received) useSettings.set(bind, val, uuid);
		} else {
			if (onChange) onChange(val);
		}

		if (onMouseEnter) onMouseEnter();
	}

	Object.defineProperty(elem, 'value', {
		get() {
			return value;
		},
	});

	elem.update = update;

	return elem;
}
