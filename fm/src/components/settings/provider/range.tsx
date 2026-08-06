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
import { Range } from '@/components/range/range.tsx';
import { useSettings } from '@/config.ts';

interface SettingRangeProps {
	ref?: ReturnType<typeof createRef<HTMLDivElement>>;
	bind?: string;
	icon?: string;
	name?: string;
	body?: string;
	showLabel?: boolean;
	value?: number;
	suffix?: string;
	min?: number;
	max?: number;
	step?: number;
	onChange?: (val: number) => void;
	disabled?: boolean;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
}

type SettingRangeElement = HTMLDivElement & {
	update: () => void;
	value: number;
};

export function SettingRange({
	ref,
	bind,
	icon,
	name,
	body,
	showLabel = true,
	value = 0,
	suffix,
	min = 0,
	max = 1,
	step = 0.1,
	onChange,
	disabled,
	onMouseEnter,
	onMouseLeave,
}: SettingRangeProps) {
	if (bind) value = settings[bind] as number;

	const uuid = crypto.randomUUID();

	if (bind) {
		useSettings.on(bind, (val, id) => {
			if (id == uuid) return;

			set(val as number, true);
		});
	}

	const range = createRef();
	const reset = createRef();

	const store = get_from_store(bind);

	if (store) {
		if (!icon) icon = store.icon;
		if (store.min) min = store.min;
		if (store.max) max = store.max;
		if (store.step) step = store.step;
		if (store.suffix) suffix = store.suffix;

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
						setValue={(val: number) => {
							set(val);
							update();
						}}
						defaultValue={store?.default}
						ref={reset}
					/>
				)}
				<Range
					className='setting-inner'
					id={bind}
					value={value}
					min={min}
					max={max}
					step={step}
					suffix={suffix}
					onInput={set}
					ref={range}
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
			data-type='input'
			id={`setting_${bind}`}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			ref={ref}
		/>
	) as SettingRangeElement;

	update();

	function set(val: number, received = false) {
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
		set(val: number) {
			value = val;
			update();
		},
	});

	elem.update = update;

	return elem;
}
