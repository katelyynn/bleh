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
import {
	List,
	ListAdd,
	ListCandidate,
	ListItem,
} from '@/components/settings/clickables/list.tsx';
import { page } from '@/build/page.ts';

interface SettingListProps {
	ref?: ReturnType<typeof createRef<HTMLDivElement>>;
	bind?: string;
	standalone?: boolean;
	icon?: string;
	name?: string;
	body?: string;
	value?: string[];
	values?: ListOptions;
	predefined?: boolean;
	onChange?: (val: string[]) => void;
	disabled?: boolean;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
}

type SettingListElement = HTMLDivElement & {
	update: () => void;
	value: boolean;
};

export type ListOptions = Record<string, ListOption>;

export interface ListOption {
	icon?: string;
	name: translation | string;
}

export function SettingList({
	ref,
	bind,
	standalone = false,
	icon,
	name,
	body,
	value,
	values = {},
	predefined,
	onChange,
	disabled,
	onMouseEnter,
	onMouseLeave,
}: SettingListProps) {
	if (bind) value = useSettings.get(bind) as string[];

	const uuid = crypto.randomUUID();

	if (bind) {
		useSettings.on(bind, (val, id) => {
			if (id == uuid) return;

			set(val as string[], true);
		});
	}

	const store = get_from_store(bind);

	if (store) {
		if (!icon) icon = store.icon;

		if (store.values) values = store.values;
		predefined = store.predefined || false;

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

		let available = {};

		if (predefined) {
			available = Object.fromEntries(
				Object.entries(values).filter(([key]) => !value!.includes(key)),
			);
		}

		elem.replaceChildren(
			<>
				{icon && <SettingIcon name={icon} />}
				<SettingLabel
					name={name}
					body={body}
					store={store}
				/>
				<List>
					{value!.map((val, i) => (
						<ListItem
							icon={values[val]?.icon}
							name={values[val] ? tl(values[val].name) : val}
							onRemove={() => {
								const new_list = value!.filter((item) =>
									item != val
								);

								set(new_list);
							}}
							key={i}
						/>
					))}
					{!predefined
						? (
							<ListAdd
								onAdd={(val) => {
									const new_list = [...value!, val];

									set(new_list);
								}}
							/>
						)
						: Object.entries(available).map(([val, formal], i) => (
							<ListCandidate
								icon={formal.icon}
								name={formal.name}
								onAdd={() => {
									const new_list = [...value!, val];

									set(new_list);
								}}
								key={i}
							/>
						))}
				</List>
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
			data-type='list'
			id={`setting_${bind}`}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			ref={ref}
		/>
	) as SettingListElement;

	update();

	function set(val: string[], received = false) {
		if (value == val) return;

		value = val;

		if (bind) {
			if (!received) useSettings.set(bind, val, uuid);
		}

		if (onChange) onChange(val);

		update();

		if (onMouseEnter) onMouseEnter();
	}

	Object.defineProperty(elem, 'value', {
		get() {
			return value;
		},
		set(val: string[]) {
			set(val);
		},
	});

	elem.update = update;

	return elem;
}
