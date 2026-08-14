/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import {
	oracle_albums,
	oracle_artists,
	oracle_tracks,
	page,
	root,
} from '@/build/page';
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
import { SettingAction } from '@/components/settings/provider/action.tsx';
import { createRef } from 'jsx-dom';
import { useSettings } from '@/page.ts';
import { manage_oracle_data, oracle_data } from '@/components/music/oracle.tsx';

export function playback() {
	let total_artists = 0;
	let total_album_tracks = 0;

	if (artist_corrections) {
		total_artists = Object.keys(artist_corrections).length;
	}
	if (album_track_corrections) {
		total_album_tracks = Object.values(album_track_corrections).reduce(
			(sum, album_tracks) => sum + Object.keys(album_tracks).length,
			0,
		);
	}

	let lotus_version_text;
	if (artist_corrections.version == album_track_corrections.version) {
		lotus_version_text = artist_corrections.version;
	} else {
		lotus_version_text =
			`${artist_corrections.version}, ${album_track_corrections.version}`;
	}

	const header_preview = createRef();

	useSettings.on('format_guest_features', render_header_preview);
	useSettings.on('show_guest_features', render_header_preview);

	function render_header_preview() {
		const format = useSettings.get('format_guest_features');
		const show_artist_tag = useSettings.get('show_guest_features');

		header_preview.current.replaceChildren(
			<div class='page-header-info'>
				<div class='title-container'>
					<h1
						class='header-new-title page-header-title'
						data-kate-processed='true'
					>
						<div class='title'>
							THE END{!format &&
								' (feat. will.i.am & Jessica Pratt)'}
						</div>
						{(format && show_artist_tag) && (
							<div class='feat' data-tag-group='guests'>
								feat. will.i.am & Jessica Pratt
							</div>
						)}
					</h1>
				</div>
				<h2 class='page-header-artist artist-for-track'>
					<span itemProp='byArtist' style={{ display: 'flex' }}>
						<a class='header-new-crumb'>
							A$AP Rocky
						</a>
						{format && (
							<>
								<a class='header-new-crumb'>
									will.i.am
								</a>
								{', '}
								<a class='header-new-crumb'>
									Jessica Pratt
								</a>
							</>
						)}
					</span>
				</h2>
			</div>,
		);
	}

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
					<SettingInfo name={tl(trans.current_version)}>
						<p>{lotus_version_text}</p>
						<SeeMore
							className='update-check'
							iconPlacement='left'
							onClick={() => lotus(true)}
						>
							{tl(trans.update_check)}
						</SeeMore>
					</SettingInfo>
					<SettingInfo name={tl(trans.corrections_loaded)}>
						<p>
							{tl(trans.corrections_loaded_value, {
								c1: total_artists,
								c2: total_album_tracks,
							})}
						</p>
						<SeeMore
							onClick={() => lotus_modal()}
						>
							{tl(trans.view_all)}
						</SeeMore>
					</SettingInfo>
					<SettingInfo name={tl(trans.help_contribute)}>
						<SeeMore
							href='https://github.com/katelyynn/lotus/issues/new/choose'
							external
						>
							{tl(trans.suggest_correction)}
						</SeeMore>
					</SettingInfo>
				</SettingGroup>
				<CardTip>{tl(trans.lotus_edit_notice)}</CardTip>
			</section>
			<section class='bleh--panel'>
				<PanelHead icon={icons.redirect}>
					{tl(trans.redirections)}
				</PanelHead>
				<SettingGroup>
					<SettingSwitch bind='prefer_no_redirect' />
					<SettingAction
						name={tl(trans.legacy_redirects.name)}
						body={tl(trans.legacy_redirects.body)}
					>
						<SeeMore
							href={`${root}settings/website`}
							external
						>
							{tl(trans.change_now)}
						</SeeMore>
					</SettingAction>
					<SettingSwitch bind='travis' />
				</SettingGroup>
			</section>
			<section class='bleh--panel'>
				<PanelHead icon={icons.track}>
					{tl(trans.smart_music_titles)}
				</PanelHead>
				<div class='inner-preview pad flex' ref={header_preview} />
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
					<SettingInfo name={tl(trans.current_version)}>
						<p>
							{oracle_artists.version}, {oracle_albums.version},
							{' '}
							{oracle_tracks.version}
						</p>
						<SeeMore
							className='update-check'
							iconPlacement='left'
							onClick={() => oracle_data(true)}
						>
							{tl(trans.update_check)}
						</SeeMore>
					</SettingInfo>
					<SettingAction name={tl(trans.manage_data)}>
						<SeeMore
							onClick={() => manage_oracle_data()}
						>
							{tl(trans.view_all)}
						</SeeMore>
					</SettingAction>
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

	render_header_preview();
}
