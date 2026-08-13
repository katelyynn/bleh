/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { page } from '@/build/page';
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

export function playback() {
	page.structure.main!.replaceChildren(
		<>
			<section class='bleh--panel'>
				<PanelHead icon={icons.lotus}>
					{tl(trans.music_corrections)}
				</PanelHead>
				<div class='inner-preview pad'>
					<div class='lotus-preview'>
						<div class='lotus-preview-inner before icon-mask'>
							<h1 class='lotus-preview-header'>
								mY aNtI-aIrCrAfT fRiEnD
							</h1>
							<h2 class='lotus-preview-sub'>jUlIe</h2>
						</div>
						<div class='lotus-preview-inner after'>
							<h1 class='lotus-preview-header'>
								my anti-aircraft friend
							</h1>
							<h2 class='lotus-preview-sub'>julie</h2>
						</div>
					</div>
				</div>
				<SettingGroup>
					<SettingSwitch bind='corrections' />
				</SettingGroup>
				<SettingGroup>
					<SettingSwitch bind='prefer_no_redirect' />
					<SettingSwitch bind='travis' />
				</SettingGroup>
			</section>
			<section class='bleh--panel'>
				<PanelHead icon={icons.track}>
					{tl(trans.smart_music_titles)}
				</PanelHead>
				<SettingGroup>
					<SettingSwitch bind='format_guest_features' />
					<SettingSwitch bind='show_guest_features' />
					<SettingSwitch bind='show_remaster_tags' />
					<SettingOptions name={tl(trans.romanise_titles)}>
						<SettingCheckbox bind='romanise_jp' standalone />
						<SettingCheckbox bind='romanise_ko' standalone />
					</SettingOptions>
				</SettingGroup>
			</section>
			<section class='bleh--panel'>
				<PanelHead icon={icons.oracle}>
					oracle
					<BetaIndicator />
				</PanelHead>
				<SettingGroup>
					<SettingSwitch bind='oracle_beta' />
					<SettingSelect
						bind='tracklist_source'
						values={page.state.tracklist_sources}
					/>
				</SettingGroup>
			</section>
			<section class='bleh--panel'>
				<PanelHead icon={icons.more}>
					{tl(trans.miscellaneous)}
				</PanelHead>
				<SettingGroup>
					<SettingSwitch bind='glacier_library_graphs' />
				</SettingGroup>
			</section>
		</>,
	);
}
