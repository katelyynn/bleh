/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { page } from '@/build/page';
import { tl, trans } from '@/build/trans';
import { Wordmark } from '@/components/music/wordmark';
import { SettingGroup } from '@/components/settings/group.tsx';
import { SettingSwitch } from '@/components/settings/provider/switch.tsx';
import { icons } from '@/components/shared/icon.tsx';
import { PanelHead } from '@/components/text/head.tsx';
import { useSettings } from '@/page';
import { createRef } from 'jsx-dom';

export function accessibility() {
	const wordmarks = createRef();

	function update_wordmarks() {
		wordmarks.current.replaceChildren(
			<div class='sample-wordmarks'>
				<h1 class='sample-wordmark-title'>
					<Wordmark name='JENNIE' />
				</h1>
				<h1 class='sample-wordmark-title'>
					<Wordmark name='Tiffany Day' />
				</h1>
				<h1 class='sample-wordmark-title'>
					<Wordmark name='Nirvana' />
				</h1>
			</div>
		);
	}

	useSettings.on('artist_wordmarks', update_wordmarks);

	page.structure.main!.replaceChildren(
		<>
			<section class='bleh--panel'>
				<PanelHead icon={icons.motion}>
					{tl(trans.motion)}
				</PanelHead>
				<SettingGroup>
					<SettingSwitch bind='reduced_motion' />
					<SettingSwitch bind='reduced_flashing' />
				</SettingGroup>
				<SettingGroup>
					<SettingSwitch bind='show_scroller' />
				</SettingGroup>
			</section>
			<section class='bleh--panel'>
				<PanelHead icon={icons.text}>
					{tl(trans.text)}
				</PanelHead>
				<div class={['inner-preview', 'pad', 'flex']} ref={wordmarks} />
				<SettingGroup>
					<SettingSwitch bind='display_name_styles' />
					<SettingSwitch bind='artist_wordmarks' />
				</SettingGroup>
				<SettingGroup>
					<SettingSwitch bind='underline_links' />
					<SettingSwitch bind='accessible_name_colours' />
				</SettingGroup>
			</section>
		</>,
	);

	update_wordmarks();
}
