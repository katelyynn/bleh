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
import { SettingInput } from '@/components/settings/provider/input.tsx';
import { SettingLabel } from '@/components/settings/provider/main.tsx';
import { Input } from '@/components/input/input.tsx';
import { createRef } from 'jsx-dom';
import { expand_avatar } from '@/components/shared/avatar.tsx';

interface ProfileBannerProps {
	ref?: ReturnType<typeof createRef<ProfileBannerElement>>;
	markdown: string;
	onChange: (v: string) => void;
}

type ProfileBannerElement = HTMLDivElement & {
	markdown: string;
	value: string;
};

export function ProfileBanner({
	ref,
	markdown,
	onChange,
}: ProfileBannerProps) {
	const banner_regex = /\[banner=([^\]]+)\]/;

	let value = '';

	const input = createRef();
	const preview = createRef();

	const elem = (
		<div class='setting' data-type='text' ref={ref}>
			<SettingLabel
				name={tl(trans.profile_banner.name)}
				body={tl(trans.profile_banner.body)}
				sub={tl(trans.aspect_ratio_banner, {
					v: <strong>1300 / 325</strong>,
				})}
			/>
			<div class={['info', 'v']}>
				<Input
					className='profile-banner-input'
					onChange={(v) => set(String(v))}
					ref={input}
				/>
				<div class='banner-image' ref={preview} />
			</div>
		</div>
	) as ProfileBannerElement;

	function update(val: string) {
		const sanitised = `url(https://images.weserv.nl/?url=${
			encodeURIComponent(val)
		}&output=webp&n=-1)`;

		preview.current.style.setProperty('background-image', sanitised);
		preview.current.onclick = () => {
			expand_avatar(sanitised);
		};

		input.current.value = val;
	}

	function set(v: string) {
		value = v;

		const match = markdown.match(banner_regex);

		const new_banner = get(v);

		if (match) {
			onChange(markdown.replace(banner_regex, new_banner));
		} else {
			const trimmed = markdown.trimEnd();

			if (trimmed.length == 0) {
				onChange(new_banner);
			} else {
				onChange(trimmed + '\n\n' + new_banner);
			}
		}

		update(v);
	}

	function get(v: string) {
		let new_banner = v.trim() ? `[banner=${v}]` : '';

		if (!new_banner.match(banner_regex)) {
			new_banner = '';
		}

		return new_banner;
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

	const match = markdown.match(banner_regex);

	update(match ? match[1] : '');

	return elem;
}
