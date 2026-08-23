/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { page } from '@/build/page';
import { tl, trans } from '@/build/trans';
import { SettingGroup } from '@/components/settings/group.tsx';
import { SettingSwitch } from '@/components/settings/provider/switch.tsx';
import { icons } from '@/components/shared/icon.tsx';
import { PanelHead } from '@/components/text/head.tsx';

export function accessibility() {
	page.structure.main!.replaceChildren(
		<>
			<section class='bleh--panel'>
				<PanelHead icon={icons.motion}>
					{tl(trans.motion)}
				</PanelHead>
				<SettingGroup>
					<SettingSwitch bind='reduced_motion' />
					<SettingSwitch bind='show_scroller' />
				</SettingGroup>
			</section>
			<section class='bleh--panel'>
				<PanelHead icon={icons.text}>
					{tl(trans.text)}
				</PanelHead>
				<SettingGroup>
					<SettingSwitch bind='display_name_styles' />
					<SettingSwitch bind='underline_links' />
					<SettingSwitch bind='accessible_name_colours' />
				</SettingGroup>
			</section>
		</>,
	);
}
