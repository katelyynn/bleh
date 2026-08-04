/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import {
	setting_instance,
	setting_value,
	settings,
	settings_store,
} from '@/build/config.ts';
import { tl, trans } from '@/build/trans.ts';
import { Icon, icons } from '@/components/shared/icon.tsx';
import { SettingReset } from '@/components/settings/provider/reset.tsx';
import { createRef } from 'jsx-dom';

interface SettingLabelProps {
	ref?: ReturnType<typeof createRef<HTMLDivElement>>;
	name?: string;
	body?: string;
	store?: setting_instance;
	value?: setting_value;
	setValue?: (val: setting_value) => void;
	defaultValue?: setting_value;
}

export function SettingLabel({
	ref,
	name,
	body,
	store,
	value,
	setValue,
	defaultValue,
}: SettingLabelProps) {
	const reset = createRef();

	if (store) {
		if (store.title) name = tl(store.title);
		if (store.body) body = tl(store.body);
	}

	if (!name) {
		return (
			<div class={['heading', 'setting-inner']}>
				<div class='alert alert-error no-margin'>
					No name provided
				</div>
			</div>
		);
	}

	const label = (
		<div class={['heading', 'setting-inner']} ref={ref}>
			<h5 class='setting-name'>
				{name}
				{(value != undefined && setValue != undefined &&
					defaultValue != undefined) &&
					(
						<SettingReset
							value={value}
							setValue={setValue}
							defaultValue={defaultValue}
							ref={reset}
						/>
					)}
			</h5>
			{body && <p class='setting-body'>{body}</p>}
		</div>
	);

	Object.defineProperty(label, 'value', {
		set(val: setting_value) {
			reset.current.value = val;
		},
	});

	return label;
}

export function get_from_store(id?: string) {
	if (!id) return undefined;

	return settings_store[id];
}

export function is_incompatible(store: setting_instance) {
	let incompatible = false;
	const list: Record<string, boolean> = {};
	const list_strings: string[] = [];

	if (!store.incompatible) {
		return {
			incompatible,
			list,
			list_strings,
		};
	}

	Object.entries(store.incompatible).forEach(([key, val], index) => {
		if (Array.isArray(val)) {
			if (val.includes(settings[key])) {
				incompatible = true;
				list[key] = val;

				if (store.incompatible_strings?.[index]) {
					list_strings[index] = store.incompatible_strings[index];
				} else {
					list_strings[index] = '';
				}
			}
		} else {
			if (JSON.stringify(val) == JSON.stringify(settings[key])) {
				incompatible = true;
				list[key] = val;

				if (store.incompatible_strings?.[index]) {
					list_strings[index] = store.incompatible_strings[index];
				} else {
					list_strings[index] = '';
				}
			}
		}
	});

	return {
		incompatible,
		list,
		list_strings,
	};
}

export function SettingIncompatibleWith({
	list,
	strings,
}: { list: Record<string, boolean>; strings: string[] }) {
	return (
		<div class='setting-incompatible-with colourful'>
			<Icon name={icons.error} identifier='setting-incompatible-with' />
			<strong class='setting-incompatible-with-text'>
				{tl(trans.incompatible)}
			</strong>
			<p class='setting-incompatible-with-list'>
				{Object.entries(list).map(([key, val], index) => {
					let title = key;

					if (strings[index] && strings[index] != '') return tl(strings[index]);

					if (settings_store[key]?.title) {
						title = tl(settings_store[key].title);
					}

					if (val == true) {
						return tl(trans.value_is_enabled, { v: title });
					}

					return tl(trans.value_is_disabled, { v: title });
				}).join(', ')}
			</p>
		</div>
	);
}
