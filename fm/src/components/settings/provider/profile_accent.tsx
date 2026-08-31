/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { useSettings } from '@/page.ts';
import { SettingSelect } from '@/components/settings/provider/select.tsx';
import { select_prepare_list } from '@/components/settings/select.ts';
import { tl, trans } from '@/build/trans.ts';
import { Icon, icons } from '@/components/shared/icon.tsx';
import { SettingInput } from '@/components/settings/provider/input.tsx';
import { SettingLabel } from '@/components/settings/provider/main.tsx';
import { Input } from '@/components/input/input.tsx';
import { createRef } from 'jsx-dom';
import { expand_avatar } from '@/components/shared/avatar.tsx';
import { Button } from '@/components/button/button.tsx';

interface ProfileAccentProps {
	ref?: ReturnType<typeof createRef<ProfileAccentElement>>;
	markdown: string;
	onChange: (v: string) => void;
}

type ProfileAccentElement = HTMLDivElement & {
	markdown: string;
	value: string;
};

export function ProfileAccent({
	ref,
	markdown,
	onChange,
}: ProfileAccentProps) {
	const accent_regex =
		/\[accent=([0-9]{1,3}),([0-9]*\.?[0-9]+),([0-9]*\.?[0-9]+)\]/;

	let value = '';

	const input = createRef();
	const preview = createRef();

	const elem = (
		<div class='setting' data-type='info' ref={ref}>
			<SettingLabel
				name={tl(trans.profile_accent.name)}
				body={tl(trans.profile_accent.body)}
			/>
			<div class='info'>
				<div class='colour-tile-and-button'>
					<div class={['colour-tile', 'colourful']} ref={preview} />
					<Button>
						<Icon name={icons.edit} />
						{tl(trans.change)}
					</Button>
				</div>
			</div>
		</div>
	) as ProfileAccentElement;

	function update(hue: number, sat: number, lit: number) {
		// TODO
	}

	function set(v: string) {
		// TODO
	}

	function get(v: string) {
		// TODO
	}

	Object.defineProperty(elem, 'markdown', {
		set(v: string) {
			markdown = v;

			const match = markdown.match(banner_regex);

			update(match ? match[1] : '');
		},
	});

	Object.defineProperty(elem, 'value', {
		get() {
			return value;
		},
		set(v: string) {
			set(v);
		},
	});

	const match = markdown.match(accent_regex);

	update(match ? match[1] : '');

	return elem;
}
