/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { createRef, ReactNode } from 'jsx-dom';
import {
	get_from_store,
	is_incompatible,
	SettingIncompatibleWith,
	SettingLabel,
} from '@/components/settings/provider/main.tsx';
import { settings } from '@/build/config.ts';
import { Switch } from '@/components/settings/clickables/switch.tsx';
import { tl } from '@/build/trans.ts';
import { save_setting } from '@/components/settings/settings.tsx';
import { SettingIcon } from '@/components/settings/provider/icon.tsx';
import { Checkbox } from '@/components/settings/clickables/checkbox.tsx';

interface SettingCheckboxProps {
	ref?: ReturnType<typeof createRef<HTMLDivElement>>;
	bind?: string;
	standalone?: boolean;
	icon?: string;
	name?: string;
	body?: string;
	onChange?: (val: boolean) => void;
	disabled?: boolean;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
}

type SettingCheckboxElement = HTMLDivElement & {
	update: () => void;
	value: boolean;
};

export function SettingCheckbox({
	ref,
	bind,
	standalone = false,
	icon,
	name,
	body,
	onChange,
	disabled,
	onMouseEnter,
	onMouseLeave,
}: SettingCheckboxProps) {
	let value = bind ? settings[bind] as boolean : true;
	const checkbox = createRef();

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

		elem.replaceChildren(
			<>
				<Checkbox
					className='setting-inner'
					checked={value}
					ref={checkbox}
				/>
				{icon && <SettingIcon name={icon} />}
				<SettingLabel name={name} body={body} store={store} />
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
			class={['setting', standalone && 'standalone']}
			data-type='toggle'
			id={`setting_${bind}`}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onClick={() => {
				set(!value);
			}}
			ref={ref}
		/>
	) as SettingCheckboxElement;

	update();

	function set(val: boolean) {
		value = val;
		checkbox.current.checked = value;

		if (bind) save_setting(bind, value);
		if (onChange) onChange(value);
		if (onMouseEnter) onMouseEnter();
	}

	Object.defineProperty(elem, 'value', {
		get() {
			return value;
		},
		set(val: boolean) {
			set(val);
		},
	});

	elem.update = update;

	return elem;
}
