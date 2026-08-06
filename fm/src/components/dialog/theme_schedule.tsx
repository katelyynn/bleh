/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { dialog } from '@/components/dialog/dialog.tsx';
import { tl, trans } from '@/build/trans.ts';
import { SettingGroup } from '@/components/settings/group.tsx';
import { SettingSelect } from '@/components/settings/provider/select.tsx';
import { dark_themes, light_themes, theme, themes } from '@/build/theme.ts';
import { SelectOption } from '@/components/select/select.tsx';
import { settings } from '@/build/config.ts';
import { Icon } from '@/components/shared/icon.tsx';
import { useSettings } from '@/config.ts';

export interface theme_min {
	theme_day: string;
	theme_night: string;
}

interface theme_schedule_props {
	onChange?: (val: theme_min) => void;
}

export function theme_schedule_dialog({
	onChange,
}: theme_schedule_props) {
	let theme_day = useSettings.get('theme_day') as string;
	let theme_night = useSettings.get('theme_night') as string;

	dialog({
		id: 'theme_schedule',
		title: tl(trans.themes.name),
		body: (
			<SettingGroup>
				<SettingSelect
					bind='theme_day'
					values={convert_list_to_select(themes, 'light')}
					onChange={(val: string) => {
						theme_day = val;

						if (onChange) onChange({ theme_day, theme_night });
					}}
				/>
				<SettingSelect
					bind='theme_night'
					values={convert_list_to_select(themes, 'dark')}
					onChange={(val: string) => {
						theme_night = val;

						if (onChange) onChange({ theme_day, theme_night });
					}}
				/>
			</SettingGroup>
		),
	});
}

function convert_list_to_select(
	list: Record<string, theme>,
	filter: 'light' | 'dark',
) {
	const values: SelectOption[] = [];

	let base_list;

	if (filter == 'light') {
		base_list = light_themes;
	} else {
		base_list = dark_themes;
	}

	base_list.map((key) => {
		const entry = list[key];
		if (!entry) return;

		values.push({
			value: key,
			text: tl(entry.name),
		});
	});

	return values;
}
