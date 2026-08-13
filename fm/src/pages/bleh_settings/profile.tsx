/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { auth, page } from '@/build/page';
import { tl, trans } from '@/build/trans';
import { settings } from '@/build/config';
import { SettingTheme } from '@/components/settings/provider/theme.tsx';
import { SettingGroup } from '@/components/settings/group.tsx';
import { SettingSwitch } from '@/components/settings/provider/switch.tsx';
import { SettingRange } from '@/components/settings/provider/range.tsx';
import { Icon, icons } from '@/components/shared/icon.tsx';
import { SettingSelect } from '@/components/settings/provider/select.tsx';
import { PanelHead } from '@/components/text/head.tsx';
import { SettingOptions } from '@/components/settings/provider/options.tsx';
import { SettingCheckbox } from '@/components/settings/provider/checkbox.tsx';
import { BetaIndicator } from '@/components/shared/indicator.tsx';
import { CardTip } from '@/components/text/tip.tsx';
import { album_track_corrections, artist_corrections } from '@/build/music.ts';
import { SettingInfo } from '@/components/settings/provider/info.tsx';
import { SeeMore } from '@/components/text/see_more.tsx';
import { lotus, lotus_modal } from '@/components/music/lotus.ts';
import {
	page_loading,
	render_setting_page,
} from '@/pages/bleh_settings/bleh_settings.js';
import { SettingList } from '@/components/settings/provider/list.tsx';
import { select_prepare_list } from '@/components/settings/select.ts';
import { useSettings } from '@/page.ts';
import { checkup_friend_cache } from '@/pages/profile/profile.ts';
import { StarredFriend } from '@/components/settings/provider/starred_friend.tsx';

export function profile() {
	if (!auth.name) {
		page.structure.main!.replaceChildren(
			<section class='bleh--panel'>
				<div class='loading-data-container'>
					<div class='loading-data-text error'>
						{tl(trans.not_logged_in)}
					</div>
				</div>
			</section>,
		);
		return;
	}

	if (!page.state.quick_access_items) {
		setTimeout(() => {
			render_setting_page('profile');
		}, 10);
		page_loading();
		return;
	}

	page.structure.main!.replaceChildren(
		<>
			<section class='bleh--panel'>
				<PanelHead icon={icons.friends}>
					{tl(trans.friends)}
				</PanelHead>
				<SettingGroup>
					<SettingList
						bind='friends'
						onChange={(val: string[]) => {
							if (
								!val.includes(
									useSettings.get('starred_friend') as string,
								)
							) {
								useSettings.set('starred_friend', '');
							}

							checkup_friend_cache(val);
						}}
					/>
					<StarredFriend />
				</SettingGroup>
			</section>
			<section class='bleh--panel'>
				<PanelHead icon={icons.profile_info}>
					{tl(trans.navigation_items.name)}
				</PanelHead>
				<SettingGroup>
					<SettingList
						bind='navigation_items'
						values={page.state.quick_access_items}
					/>
					<SettingCheckbox bind='navigation_language' />
					<SettingCheckbox bind='hybrid_inbox' />
				</SettingGroup>
			</section>
		</>,
	);
}
