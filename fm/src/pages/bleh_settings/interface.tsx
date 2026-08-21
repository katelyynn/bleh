/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { dialog } from '@/components/dialog/dialog.tsx';
import { lang, tl, trans } from '@/build/trans.ts';
import { SettingGroup } from '@/components/settings/group.tsx';
import { SettingKeybind } from '@/components/settings/provider/keybind.tsx';
import { auth, page, root } from '@/build/page.ts';
import { avatar } from '@/components/shared/avatar.tsx';
import { useSettings } from '@/page.ts';
import { createRef, ReactNode } from 'jsx-dom';
import { WithChildren } from '@/types/generic.tsx';
import { PanelHead } from '@/components/text/head.tsx';
import { icons } from '@/components/shared/icon.tsx';
import { SettingRadio } from '@/components/settings/provider/radio.tsx';
import { parse_scrobbles_as_rank } from '@/components/music/colourful_counts.js';
import { SettingSwitch } from '@/components/settings/provider/switch.tsx';
import { SettingList } from '@/components/settings/provider/list.tsx';
import {
	page_loading,
	render_setting_page,
} from '@/pages/bleh_settings/bleh_settings.js';
import { markdown } from '@/components/markdown/markdown.tsx';
import { SettingAction } from '@/components/settings/provider/action.tsx';
import { SeeMore } from '@/components/text/see_more.tsx';
import { count_bar } from '@/components/track/bar.tsx';

export function interface_page() {
	if (!page.state.music_links) {
		setTimeout(() => {
			render_setting_page('interface');
		}, 10);
		page_loading();
		return;
	}

	const track_preview = createRef();
	const tag_preview = createRef();
	const bar_preview = createRef();
	const shout_preview = createRef();

	useSettings.on('track_album_name_location', render_track_preview);
	useSettings.on('track_layout', render_track_preview);
	useSettings.on('expand_tracks', render_track_preview);

	useSettings.on('gendered_tags', render_tag_preview);

	useSettings.on('colourful_counts', render_bar_preview);
	useSettings.on('bar_v2', render_bar_preview);

	useSettings.on('shout_markdown', render_shout_preview);

	function render_track_preview() {
		const album_name_location = useSettings.get(
			'track_album_name_location',
		) as string;
		const track_layout = useSettings.get('track_layout') as string;
		const expand_tracks = useSettings.get('expand_tracks') as string;

		const avi = avatar(auth.avatar, 'avatar170s');

		track_preview.current.replaceChildren(
			<table class='chartlist chartlist--with-image chartlist--with-loved chartlist--with-artist chartlist--with-more'>
				<tbody>
					<TrackPreview
						playing
						avatar={avi}
						album_name_location={album_name_location}
						track_layout={track_layout}
						expand_tracks={expand_tracks}
					/>
					<TrackPreview
						avatar={avi}
						album_name_location={album_name_location}
						track_layout={track_layout}
						expand_tracks={expand_tracks}
					/>
				</tbody>
			</table>,
		);
	}

	function render_tag_preview() {
		const hide = useSettings.get('gendered_tags') as boolean;

		tag_preview.current.replaceChildren(
			<ul class='tags-list tags-list--global'>
				<TagPreview>pop</TagPreview>
				<TagPreview>country</TagPreview>
				<TagPreview>singer-songwriter</TagPreview>
				{!hide && <TagPreview>female vocalists</TagPreview>}
				<TagPreview>synthpop</TagPreview>
			</ul>,
		);
	}

	function render_bar_preview() {
		const colourful = useSettings.get('colourful_counts') as boolean;
		const v2 = useSettings.get('bar_v2') as boolean;

		const max = 20_000;
		const addition = page.mobile ? 3_000 : 1_000;

		bar_preview.current.replaceChildren(
			<div class={['bars', v2 && 'v2']}>
				{Array.from(
					{ length: Math.floor(max / addition) + 1 },
					(_, i) => {
						const value = i * addition;
						return (
							<BarPreview
								value={value}
								max={max}
								colourful={colourful}
							/>
						);
					},
				)}
			</div>,
		);
	}

	function render_shout_preview() {
		shout_preview.current.replaceChildren(
			<ShoutPreview image={auth.avatar!} name={auth.name!}>
				{tl(trans.markdown_shouts.preview)}
			</ShoutPreview>,
		);
	}

	page.structure.main!.replaceChildren(
		<>
			<section class='bleh--panel'>
				<PanelHead icon={icons.recent}>
					{tl(trans.recents)}
				</PanelHead>
				<div class='inner-preview pad' ref={track_preview} />
				<SettingGroup>
					<SettingRadio bind='track_layout' />
					<SettingRadio bind='expand_tracks' />
					<SettingRadio bind='track_album_name_location' />
				</SettingGroup>
			</section>
			<section class='bleh--panel'>
				<PanelHead icon={icons.play}>
					{tl(trans.scrobbles)}
				</PanelHead>
				<div class='inner-preview pad' ref={bar_preview} />
				<SettingGroup>
					<SettingSwitch bind='colourful_counts' />
					<SettingSwitch bind='count_bar_right' />
					<SettingSwitch bind='bar_v2' />
				</SettingGroup>
			</section>
			<section class='bleh--panel'>
				<PanelHead icon={icons.album}>
					{tl(trans.overview)}
				</PanelHead>
				<SettingGroup>
					<SettingList
						bind='music_links'
						values={page.state.music_links}
					/>
				</SettingGroup>
				<SettingGroup>
					<SettingRadio bind='default_avatar_action' />
					<SettingSwitch bind='simulate_scroll' />
				</SettingGroup>
			</section>
			<section class='bleh--panel'>
				<PanelHead icon={icons.tag}>
					{tl(trans.tags)}
				</PanelHead>
				<div class='inner-preview pad' ref={tag_preview} />
				<SettingGroup>
					<SettingSwitch bind='gendered_tags' />
				</SettingGroup>
			</section>
			<section class='bleh--panel'>
				<PanelHead icon={icons.shoutbox}>
					{tl(trans.shouts)}
				</PanelHead>
				<div class='inner-preview pad' ref={shout_preview} />
				<SettingGroup>
					<SettingSwitch bind='shout_markdown' />
				</SettingGroup>
			</section>
			{!page.mobile && (
				<section class='bleh--panel'>
					<PanelHead icon={icons.rabbit}>
						{tl(trans.quick_switcher)}
					</PanelHead>
					<SettingGroup>
						<SettingSwitch bind='rabbit' />
						<SettingAction name={tl(trans.quick_switcher_keybinds)}>
							<SeeMore onClick={rabbit_keybinds}>
								{tl(trans.change_now)}
							</SeeMore>
						</SettingAction>
					</SettingGroup>
				</section>
			)}
		</>,
	);

	render_track_preview();
	render_tag_preview();
	render_bar_preview();
	render_shout_preview();
}

function TagPreview({
	children,
}: WithChildren) {
	return (
		<li class='tag'>
			<a class='btn tag-item'>{children}</a>
		</li>
	);
}

interface TrackPreviewProps {
	playing?: boolean;
	avatar: string;
	album_name_location: string;
	track_layout: string;
	expand_tracks: string;
}

function TrackPreview({
	playing,
	avatar,
	album_name_location,
	track_layout,
	expand_tracks,
}: TrackPreviewProps) {
	let show_album_text = false;

	if (playing) {
		show_album_text = expand_tracks != 'never' &&
			track_layout == 'column';
	} else {
		show_album_text = expand_tracks == 'always' &&
			track_layout == 'column';
	}

	return (
		<tr
			class={[
				'chartlist-row',
				'chartlist-row--with-artist',
				playing && 'chartlist-row--now-scrobbling',
			]}
			data-has-bar='false'
			data-show-album-text={String(show_album_text)}
			data-album-name-location={album_name_location}
		>
			<td class='chartlist-image'>
				<a class='cover-art'>
					<img src={avatar} loading='lazy' />
				</a>
			</td>
			<td class='kate-placeholder' />
			<td
				class='track-info'
				data-has-bar='false'
				data-track-layout={track_layout}
				data-album-name-location={album_name_location}
			>
				<span class='chartlist-name'>
					<a>{tl(trans.track_name)}</a>
				</span>
				<span class='chartlist-artist'>
					<a>{tl(trans.artist_name)}</a>
				</span>
				{show_album_text && (
					<span class='chartlist-album custom-album-text'>
						<a>{tl(trans.album_name)}</a>
					</span>
				)}
			</td>
		</tr>
	);
}

interface BarPreviewProps {
	value: number;
	max: number;
	colourful?: boolean;
}

function BarPreview({
	value,
	max,
	colourful,
}: BarPreviewProps) {
	const slug = createRef();
	const val = createRef();

	const elem = (
		<div class='chartlist-count-bar'>
			<a class='chartlist-count-bar-link'>
				<span
					class='chartlist-count-bar-slug'
					ref={slug}
					data-max-stat-value={max}
					data-stat-value={value}
					style={{ width: `${(max / max) * 100}%` }}
				/>
				<span class='chartlist-count-bar-value' ref={val}>
					{value.toLocaleString(lang)}
				</span>
			</a>
		</div>
	);

	count_bar(elem);

	if (colourful) {
		const parsed_scrobble_as_rank = parse_scrobbles_as_rank(value);

		elem.setAttribute(
			'data-bleh--scrobble-milestone',
			String(parsed_scrobble_as_rank.milestone),
		);
		elem.style.setProperty(
			'--hue-over',
			String(parsed_scrobble_as_rank.hue),
		);
		elem.style.setProperty(
			'--sat-over',
			String(parsed_scrobble_as_rank.sat),
		);
		elem.style.setProperty(
			'--lit-over',
			String(parsed_scrobble_as_rank.lit),
		);

		if (parsed_scrobble_as_rank.contrast) {
			slug.current.classList.add('bar-contrast');
			val.current.classList.add('bar-contrast');
		}
	}

	return elem;
}

interface ShoutPreviewProps {
	image: string;
	name: string;
	children: ReactNode;
}

function ShoutPreview({
	image,
	name,
	children,
}: ShoutPreviewProps) {
	const use_md = useSettings.get('shout_markdown');

	return (
		<div class='shout icon-mask' data-kate-processed='true'>
			<div class='shout-top'>
				<div class='shout-basics'>
					<h3 class='shout-user'>
						<a href={`${root}user/${name}`}>
							{name}
						</a>
					</h3>
				</div>
			</div>
			<span class='avatar shout-user-avatar'>
				<img src={avatar(image, 'avatar170s')} loading='lazy' />
			</span>
			<div class='shout-body'>
				{use_md ? markdown(String(children)) : children}
			</div>
		</div>
	);
}

export function rabbit_keybinds() {
	dialog({
		id: 'rabbit_keybinds',
		title: tl(trans.quick_switcher),
		body: (
			<SettingGroup>
				<SettingKeybind bind='rabbit_primary' />
				<SettingKeybind bind='rabbit_search' />
				<SettingKeybind bind='rabbit_profile' />
				<SettingKeybind bind='rabbit_shortcut' />
				<SettingKeybind bind='rabbit_bleh_settings' />
			</SettingGroup>
		),
	});
}
