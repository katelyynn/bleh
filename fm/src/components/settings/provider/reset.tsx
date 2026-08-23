/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { setting_value } from '@/build/config.ts';
import { tl, trans } from '@/build/trans.ts';
import tippy from 'tippy.js';
import { createRef } from 'jsx-dom';
import { hover_tooltip, Tooltip } from '@/components/shared/tooltips.tsx';
import { Button } from '@/components/button/button.tsx';
import { Icon, icons } from '@/components/shared/icon.tsx';

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
		<Button
			chibi
			className='reset'
			onClick={() => {
				setValue(defaultValue);
			}}
			ref={ref}
		>
			<Icon name={icons.reset} identifier='reset-setting' />
			{tl(trans.reset)}
		</Button>
	) as SettingResetElement;

	hover_tooltip(
		reset,
		<Tooltip>{tl(trans.reset)}</Tooltip>,
	);

	Object.defineProperty(reset, 'value', {
		set(val: setting_value) {
			value = val;
			update();
		},
	});

	function update() {
		console.info(
			'setting: inspecting if modified',
			String(value),
			String(defaultValue),
		);

		reset.setAttribute(
			'data-modified',
			String(
				JSON.stringify(String(value)) !=
					JSON.stringify(String(defaultValue)),
			),
		);
	}

	update();

	return reset;
}
