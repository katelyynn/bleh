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
import { SettingIcon } from '@/components/settings/provider/icon.tsx';
import { Select, SelectOption } from '@/components/select/select.tsx';
import { useSettings } from '@/page.tsx';
import { Button } from '@/components/button/button';
import { MenuContents } from '@/components/menu/menu';
import { menu_tooltip } from '@/components/shared/tooltips';

interface MenuSelectProps {
	ref?: ReturnType<typeof createRef<HTMLDivElement>>;
	values?: SelectOption[];
	id?: string;
	value?: string;
	bind?: string;
	icon?: string;
	name?: ReactNode;
	body?: ReactNode;
	showLabel?: boolean;
	onChange?: (val: string) => void;
	disabled?: boolean;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
	allowArbitrary?: boolean;
}

type MenuSelectElement = HTMLDivElement & {
	update: () => void;
	value: string | number;
	values: SelectOption[];
};

// WARN: this is not complete or ready for use
export function MenuSelect({
	ref,
	values,
	id,
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
	allowArbitrary,
}: MenuSelectProps) {
	if (bind) value = useSettings.get(bind) as string;

	const uuid = crypto.randomUUID();

	if (bind) {
		useSettings.on(bind, (val, id) => {
			if (id == uuid) return;

			set(val as string, true);
		});
	}

	const reset = createRef();
	const select = createRef();

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
				{showLabel && (
					<SettingLabel
						name={name}
						body={body}
						icon={icon}
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
					name={id}
					inSettings
					allowArbitrary={allowArbitrary}
					ref={select}
				/>
				{Object.keys(incompatible_list).length > 0 && (
					<SettingIncompatibleWith
						list={incompatible_list}
						strings={incompatible_strings}
					/>
				)}
			</>,
		);

		menu.replaceChildren(
			<>
				{Object.entries(values).map(
					(
						[key, val]: [key: string, val: RadioOption],
						i: number,
					) => {
						const elem = (
							<RadioItem
								id={bind || ''}
								value={key}
								name={tl(val.name)}
								onChange={set}
								key={i}
							/>
						) as RadioItemElement;

						buttons.push(elem);

						return elem;
					},
				)}
				{body && (
					<p class='menu-item-description'>{body}</p>
				)}
			</>
		);
	}

	const elem = (
		<Button
			className='menu-setting'
			menu
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			ref={ref}
		/>
	) as MenuSelectElement;

	const menu = (
		<MenuContents />
	);

	const popout = menu_tooltip(
		elem,
		menu,
		{
			placement: 'right'
		}
	);

	document.body.addEventListener('click', () => {
		setTimeout(() => {
			if (popout.element.matches(':hover') || elem.matches(':hover')) return;

			popout.hide();
		}, 1);
	});

	update();

	function set(val: string, received = false) {
		if (value == val) return;

		value = val;
		reset.current.value = val;

		if (bind) {
			if (!received) useSettings.set(bind, val, uuid);
		}

		if (onChange) onChange(val);

		if (onMouseEnter) onMouseEnter();
	}

	Object.defineProperty(elem, 'value', {
		get() {
			return value;
		},
	});

	Object.defineProperty(elem, 'values', {
		get() {
			return values;
		},
		set(vals: SelectOption[]) {
			values = vals;
			update();
		},
	});

	elem.update = update;

	return elem;
}
