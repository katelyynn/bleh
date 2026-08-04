/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { setting_value } from '@/build/config.ts';
import { tl, trans } from '@/build/trans.ts';
import tippy from 'tippy.js';
import { createRef } from 'jsx-dom';

interface SettingResetProps {
	ref?: ReturnType<typeof createRef<HTMLButtonElement>>;
	value: setting_value;
	setValue: (val: setting_value) => void;
	defaultValue: setting_value;
}

type SettingResetElement = HTMLButtonElement & {
	value: setting_value;
};

export function SettingReset({
	ref,
	value,
	setValue,
	defaultValue,
}: SettingResetProps) {
	const reset = (
		<button
			type='button'
			class={['btn', 'reset']}
			onClick={() => {
				if (value == defaultValue) return;

				setValue(defaultValue);
				value = defaultValue;
				update();
			}}
			ref={ref}
		>
			{tl(trans.reset)}
		</button>
	) as SettingResetElement;

	tippy(reset, {
		content: tl(trans.reset),
	});

	Object.defineProperty(reset, 'value', {
		set(val: setting_value) {
			value = val;
			update();
		},
	});

	function update() {
		reset.setAttribute('data-modified', String(value != defaultValue));
	}

	update();

	return reset;
}
