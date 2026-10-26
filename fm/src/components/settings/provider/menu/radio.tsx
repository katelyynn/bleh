/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { createRef, ReactNode } from 'jsx-dom';
import {
	get_from_store,
	is_incompatible,
	SettingLabel,
} from '@/components/settings/provider/main.tsx';
import { tl, translation } from '@/build/trans.ts';
import { useSettings } from '@/page.tsx';
import { Radio } from '@/components/settings/clickables/radio.tsx';
import { MenuContents } from '@/components/menu/menu';
import { Button } from '@/components/button/button';
import { menu_tooltip } from '@/components/shared/tooltips';
import { Icon, icons } from '@/components/shared/icon';

interface MenuRadioProps {
	ref?: ReturnType<typeof createRef<HTMLDivElement>>;
	bind?: string;
	standalone?: boolean;
	icon?: string;
	name?: ReactNode;
	body?: ReactNode;
	value?: string;
	values?: RadioOptions;
	onChange?: (val: string) => void;
	disabled?: boolean;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
}

type MenuRadioElement = HTMLDivElement & {
	update: () => void;
	value: boolean;
};

export type RadioOptions = Record<string, RadioOption>;

export interface RadioOption {
	name: translation | string;
}

export function MenuRadio({
	ref,
	bind,
	standalone = false,
	icon,
	name,
	body,
	value,
	values,
	onChange,
	disabled,
	onMouseEnter,
	onMouseLeave,
}: MenuRadioProps) {
	if (bind) value = useSettings.get(bind) as string;

	let buttons: RadioItemElement[] = [];

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

		if (store.values) values = store.values;

		if (store.incompatible) {
			Object.entries(store.incompatible).forEach(([key]) => {
				useSettings.on(key, () => {
					update();
				});
			});
		}
	}

	const value_name = createRef();

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

		buttons = [];

		elem.replaceChildren(
			<>
				<div class='auth-dropdown-item-row'>
					<span class='auth-dropdown-item-left'>
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
							menu
							ref={reset}
						/>
					</span>
					<span class='auth-dropdown-item-right'>
						<p ref={value_name}>{tl(values![value].name)}</p>
					</span>
				</div>
				<Icon name={icons.arrow_right} />
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

		buttons.forEach((elem) => {
			elem.checked = elem.value == value;
		});
	}

	const elem = (
		<Button
			className='menu-setting'
			menu
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			ref={ref}
		/>
	) as MenuRadioElement;

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
		} else {
			if (onChange) onChange(val);
		}

		buttons.forEach((elem) => {
			elem.checked = elem.value == val;
		});

		if (onMouseEnter) onMouseEnter();

		value_name.current.textContent = tl(values![value].name) as string;
	}

	Object.defineProperty(elem, 'value', {
		get() {
			return value;
		},
		set(val: string) {
			set(val);
		},
	});

	elem.update = update;

	return elem;
}

type RadioItemElement = HTMLDivElement & {
	checked: boolean;
	value: string;
};

interface RadioItemProps {
	id: string;
	value: string;
	name: ReactNode;
	checked?: boolean;
	onChange: (val: string) => void;
}

function RadioItem({
	id,
	value,
	name,
	checked,
	onChange,
}: RadioItemProps) {
	const radio = createRef();

	function update() {
		radio.current.checked = checked;
	}

	const wrap = (
		<Button
			className='menu-setting'
			menu
			onClick={() => {
				onChange(value);
			}}
		>
			<Radio
				name={id}
				value={value}
				ref={radio}
				className='setting-inner'
				menu
				interact={false}
			/>
			<SettingLabel name={name} menu />
		</Button>
	) as RadioItemElement;

	update();

	Object.defineProperty(wrap, 'checked', {
		get() {
			return checked;
		},
		set(val: boolean) {
			checked = val;
			update();
		},
	});

	Object.defineProperty(wrap, 'value', {
		get() {
			return value;
		},
	});

	return wrap;
}
