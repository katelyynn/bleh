/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { tl, trans } from '@/build/trans.ts';
import { SettingGroup } from '@/components/settings/group.tsx';
import { auth, page, root } from '@/build/page.ts';
import { avatar } from '@/components/shared/avatar.tsx';
import { useSettings } from '@/page.ts';
import { createRef } from 'jsx-dom';
import { PanelHead } from '@/components/text/head.tsx';
import { icons } from '@/components/shared/icon.tsx';
import { SettingRadio } from '@/components/settings/provider/radio.tsx';
import { SettingSwitch } from '@/components/settings/provider/switch.tsx';
import { SettingList } from '@/components/settings/provider/list.tsx';
import {
	page_loading,
	render_setting_page,
} from '@/pages/bleh_settings/bleh_settings.tsx';
import { SettingAction } from '@/components/settings/provider/action.tsx';
import { SeeMore } from '@/components/text/see_more.tsx';
import { CardTip } from '@/components/text/tip.tsx';
import { flags } from '@/build/flags.ts';
import { SubText } from '@/components/text/sub.tsx';
import { ff } from '@/components/settings/sku.ts';
import { DateTime } from 'luxon';
import { SettingSelect } from '@/components/settings/provider/select.tsx';
import { SelectOption } from '@/components/select/select.tsx';
import { getThemes } from '@/build/theme.ts';

export function flags_page() {
	const grouped = Object.entries(flags)
		.sort((a, b) => b[1].date.localeCompare(a[1].date))
		.reduce((groups, entry) => {
			const date = entry[1].date;
			let key = date.slice(0, 7);

			if (key.startsWith('2099')) key = '2099';

			if (!groups[key]) groups[key] = [];

			groups[key].push(entry);

			return groups;
		}, {});

	const themes: SelectOption[] = [];
	Object.entries(getThemes()).forEach(([id, theme]) => {
		themes.push({
			value: id,
			text: tl(theme.name),
		});
	});

	page.structure.main!.replaceChildren(
		<>
			<section class='bleh--panel'>
				<PanelHead icon={icons.visual}>
					{tl(trans.themes.name)}
				</PanelHead>
				<SettingGroup>
					<SettingSelect bind='theme' values={themes} />
				</SettingGroup>
			</section>
			<section class='bleh--panel'>
				<PanelHead icon={icons.feature_flag}>
					{tl(trans.flags)}
				</PanelHead>
				{Object.entries(grouped).map(([month, month_flags]) => {
					let label = new Date(`${month}-01`).toLocaleString(
						undefined,
						{
							month: 'long',
							year: 'numeric',
						},
					);
					if (month.startsWith('2099')) label = tl(trans.general);

					return (
						<>
							<SubText>{label}</SubText>
							<SettingGroup>
								{month_flags.map(([flag, details]) => {
									const val = ff(flag);
									const enabled = flags[flag].enabled;

									return (
										<SettingSwitch
											name={details.name}
											body={details.notice}
											sub={`${flag} ${
												enabled ? '• Active' : ''
											} • ${
												DateTime.fromISO(details.date)
													.toLocaleString(
														DateTime.DATE_MED,
													)
											}`}
											value={val}
											onChange={(v) => {
												const current = useSettings.get(
													'feature_flags',
												) as Record<string, boolean>;
												current[flag] = v;

												useSettings.set(
													'feature_flags',
													current,
												);
											}}
										/>
									);
								})}
							</SettingGroup>
						</>
					);
				})}
			</section>
		</>,
	);
}
