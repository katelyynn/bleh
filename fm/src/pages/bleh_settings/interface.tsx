/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { dialog } from '@/components/dialog/dialog.tsx';
import { tl, trans } from '@/build/trans.ts';
import { SettingGroup } from '@/components/settings/group.tsx';
import { SettingKeybind } from '@/components/settings/provider/keybind.tsx';

export function rabbit_keybinds() {
	dialog({
		id: 'rabbit_keybinds',
		title: tl(trans.quick_switcher),
		body: (
			<SettingGroup>
				<SettingKeybind bind='rabbit_primary' />
				<SettingKeybind bind='rabbit_search' />
				<SettingKeybind bind='rabbit_profile' />
				<SettingKeybind bind='rabbit_shortcut' />
				<SettingKeybind bind='rabbit_bleh_settings' />
			</SettingGroup>
		),
	});
}
