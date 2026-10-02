/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { useSettings } from '@/page.ts';
import { SettingSelect } from '@/components/settings/provider/select.tsx';
import { select_prepare_list } from '@/components/settings/select.ts';
import { tl, trans } from '@/build/trans.ts';
import { icons } from '@/components/shared/icon.tsx';

export function StarredFriend() {
	const elem = (
		<SettingSelect
			allowArbitrary
			icon={icons.starred_friend}
			bind='starred_friend'
			values={set_list()}
			onChange={(v: string) => {
				if (!v) return;

				const friends = useSettings.get('friends') as string[];
				if (friends.includes(v)) {
					return;
				}

				useSettings.append('friends', v);
			}}
		/>
	);

	useSettings.on('friends', () => {
		elem.values = set_list();
	});

	function set_list() {
		const friends = useSettings.get('friends') as string[];
		if (!friends.includes(useSettings.get('starred_friend') as string)) {
			useSettings.set('starred_friend', '');
		}

		return select_prepare_list([{
			value: '',
			text: tl(trans.none.starred_friend),
		}, ...friends]);
	}

	return elem;
}
