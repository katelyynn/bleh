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
import { Switch } from '@/components/settings/clickables/switch.tsx';
import { SettingIcon } from '@/components/settings/provider/icon.tsx';
import { useSettings } from '@/page.ts';

interface SettingSwitchProps {
	ref?: ReturnType<typeof createRef<HTMLDivElement>>;
	id?: string;
	value?: boolean;
	bind?: string;
	icon?: string;
	name?: ReactNode;
	body?: ReactNode;
	onChange?: (val: boolean) => void;
	disabled?: boolean;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
}

type SettingSwitchElement = HTMLDivElement & {
	update: () => void;
	value: boolean;
};

export function SettingSwitch({
	ref,
	id,
	value = false,
	bind,
	icon,
	name,
	body,
	onChange,
	disabled,
	onMouseEnter,
	onMouseLeave,
}: SettingSwitchProps) {
	if (bind) value = useSettings.get(bind) as boolean;
	const checkbox = createRef();

	const uuid = crypto.randomUUID();

	if (bind) {
		useSettings.on(bind, (val, id) => {
			if (id == uuid) return;

			set(val as boolean, true);
		});
	}

	const store = get_from_store(bind);

	if (store) {
		if (!icon) icon = store.icon;

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
				<SettingLabel name={name} body={body} store={store} />
				<Switch
					className='setting-inner'
					name={id}
					checked={value}
					ref={checkbox}
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
			data-type='toggle'
			id={`setting_${bind}`}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onClick={() => {
				set(!value);
			}}
			ref={ref}
		/>
	) as SettingSwitchElement;

	update();

	function set(val: boolean, received = false) {
		if (value == val) return;

		value = val;
		checkbox.current.checked = val;

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
