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
import {
	checkup_friend_cache,
	load_profile_cache_externally,
} from '@/pages/profile/profile.ts';
import { StarredFriend } from '@/components/settings/provider/starred_friend.tsx';
import { createRef } from 'jsx-dom';
import { avatar } from '@/components/shared/avatar.tsx';

export async function profile() {
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

	const banner_preview = createRef();

	const cache = await load_profile_cache_externally(auth.name);

	useSettings.on('profile_header_own', render_banner_preview);
	useSettings.on('profile_header_others', render_banner_preview);
	useSettings.on('profile_avi_background', render_banner_preview);

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
				<CardTip>{tl(trans.friend_difference)}</CardTip>
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
			<section class='bleh--panel'>
				<PanelHead icon={icons.user}>
					{tl(trans.profile)}
				</PanelHead>
				<SettingGroup>
					<SettingSwitch bind='bio_markdown' />
					<SettingSwitch bind='show_your_progress' />
				</SettingGroup>
			</section>
			<section class='bleh--panel'>
				<PanelHead icon={icons.banner}>
					{tl(trans.banners)}
				</PanelHead>
				<div class={['inner-preview', 'pad']} ref={banner_preview} />
				<SettingGroup>
					<SettingOptions name={tl(trans.view_backgrounds_on)}>
						<SettingCheckbox bind='profile_header_own' standalone />
						<SettingCheckbox
							bind='profile_header_others'
							standalone
						/>
					</SettingOptions>
					<SettingSwitch bind='profile_avi_background' />
				</SettingGroup>
			</section>
		</>,
	);

	render_banner_preview();

	function render_banner_preview() {
		const own_banners = useSettings.get('profile_header_own');
		const other_banners = useSettings.get('profile_header_others');
		const avatar_replace = useSettings.get('profile_avi_background');

		const fallback_url =
			'https://lastfm.freetls.fastly.net/i/u/ar0/b9436242d32247cbce3d403581284cd3.jpg';
		const fallback_avi =
			'https://lastfm.freetls.fastly.net/i/u/ar0/818148bf682d429dc215c1705eb27b98.png';

		banner_preview.current.replaceChildren(
			<div class='banner-previews'>
				<div class='banner-preview-item'>
					<strong class='banner-preview-label'>{auth.name}</strong>
					<div
						class='banner-preview-avatar'
						style={{
							backgroundImage: `url(${
								avatar(auth.avatar, 'ar0')
							})`,
						}}
					/>
					<div
						class={[
							'banner-preview-img',
							!own_banners && 'hide-banner',
						]}
						style={{
							backgroundImage: `url(${
								cache.banner
									? cache.banner
									: avatar_replace
									? avatar(auth.avatar, 'ar0')
									: fallback_url
							})`,
						}}
					/>
				</div>
				<div class='banner-preview-item'>
					<strong class='banner-preview-label'>
						{tl(trans.other_profiles)}
					</strong>
					<div
						class='banner-preview-avatar'
						style={{
							backgroundImage: `url(${fallback_avi})`,
						}}
					/>
					<div
						class={[
							'banner-preview-img',
							!other_banners && 'hide-banner',
						]}
						style={{
							backgroundImage: `url(${
								avatar_replace ? fallback_avi : fallback_url
							})`,
						}}
					/>
				</div>
			</div>,
		);
	}
}
