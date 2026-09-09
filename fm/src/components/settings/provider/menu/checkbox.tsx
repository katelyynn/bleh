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
import { Button } from '@/components/button/button.tsx';
import { Checkbox } from '@/components/settings/clickables/checkbox.tsx';

interface MenuCheckboxProps {
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

type MenuCheckboxElement = HTMLDivElement & {
	update: () => void;
	value: boolean;
};

export function MenuCheckbox({
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
}: MenuCheckboxProps) {
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

		//elem.setAttribute('aria-checked', String(value));

		elem.replaceChildren(
			<>
				<Checkbox
					className='setting-inner'
					menu
					checked={value}
					ref={checkbox}
				/>
				{icon && <SettingIcon name={icon} />}
				<SettingLabel name={name} body={body} store={store} menu />
			</>,
		);
	}

	const elem = (
		<Button
			className='menu-setting'
			menu
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onClick={() => {
				set(!value);
			}}
			ref={ref}
		/>
	) as MenuCheckboxElement;

	update();

	function set(val: boolean, received = false) {
		if (value == val) return;

		value = val;
		checkbox.current.checked = val;

		//elem.setAttribute('aria-checked', String(value));

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
