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
import { tl, translation } from '@/build/trans.ts';
import { save_setting } from '@/components/settings/settings.tsx';
import { SettingIcon } from '@/components/settings/provider/icon.tsx';
import { useSettings } from '@/page.ts';
import { Radio } from '@/components/settings/clickables/radio.tsx';

interface SettingRadioProps {
	ref?: ReturnType<typeof createRef<HTMLDivElement>>;
	bind?: string;
	standalone?: boolean;
	icon?: string;
	name?: string;
	body?: string;
	value?: string;
	values?: RadioOptions;
	onChange?: (val: string) => void;
	disabled?: boolean;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
}

type SettingRadioElement = HTMLDivElement & {
	update: () => void;
	value: boolean;
};

export type RadioOptions = Record<string, RadioOption>;

export interface RadioOption {
	name: translation | string;
}

export function SettingRadio({
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
}: SettingRadioProps) {
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
				{icon && <SettingIcon name={icon} />}
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
				<div class='primary-selections'>
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
				</div>
				{Object.keys(incompatible_list).length > 0 && (
					<SettingIncompatibleWith
						list={incompatible_list}
						strings={incompatible_strings}
					/>
				)}
			</>,
		);

		buttons.forEach((elem) => {
			elem.checked = elem.value == value;
		});
	}

	const elem = (
		<div
			class={['setting', standalone && 'standalone']}
			data-type='options'
			id={`setting_${bind}`}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			ref={ref}
		/>
	) as SettingRadioElement;

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
	name: string;
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
		<div
			class={['setting', 'standalone']}
			data-type='radio'
			onClick={() => {
				onChange(value);
			}}
		>
			<Radio name={id} value={value} ref={radio} interact={false} />
			<SettingLabel name={name} />
		</div>
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
