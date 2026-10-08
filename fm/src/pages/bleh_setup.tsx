/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { log } from '@/build/log';
import { auth, discord, page, root } from '@/build/page';
import { tl, trans } from '@/build/trans';
import { checkup_page_structure } from '@/components/page/structure';
import { update_colour_swatches } from '../config';
import { version } from '@/main';
import {
	register_background,
	update_page,
	useSeasons,
	useSettings,
} from '@/page';
import { theme_bubbles } from '@/pages/bleh_settings/bleh_settings';
import { html, render } from 'lighterhtml';
import { save_setting, setting } from '@/components/settings/settings';
import { ff } from '@/components/settings/sku';
import { sponsor } from '@/components/sponsor';
import { settings } from '@/build/config';
import { dialog, FooterFill } from '@/components/dialog/dialog';
import { match } from '@/components/settings/dynamic_theming';
import { avatar } from '@/components/shared/avatar';
import { sponsor_list } from '@/build/sponsor';
import { createRef, ReactNode } from 'jsx-dom';
import { SeeMore } from '@/components/text/see_more.tsx';
import { Icon, icons } from '@/components/shared/icon.tsx';
import { Button } from '@/components/button/button.tsx';
import { SettingGroup } from '@/components/settings/group.tsx';
import { SettingSwitch } from '@/components/settings/provider/switch.tsx';
import { SettingTheme } from '@/components/settings/provider/theme.tsx';
import { SettingRange } from '@/components/settings/provider/range.tsx';
import {
	SettingOptions,
	SettingOptionsSeparator,
} from '@/components/settings/provider/options.tsx';
import { SettingCheckbox } from '@/components/settings/provider/checkbox.tsx';
import { SettingRadio } from '@/components/settings/provider/radio.tsx';
import { SettingInput } from '@/components/settings/provider/input.tsx';
import { SettingColour } from '@/components/settings/provider/colour.tsx';
import { colour_type } from '@/components/settings/swatch.ts';
import { TrackPreview } from '@/pages/bleh_settings/interface.tsx';

interface SetupPage {
	id: string;
	content: () => ReactNode;
}

export function bleh_setup() {
	if (!auth.name) {
		window.location.href = `${root}login?next=bleh/setup`;
		return;
	}

	page.structure.container = document.body.querySelector('.page-content')!;
	try {
		page.structure.row = page.structure.container.querySelector('.row')!;
		page.structure.main = page.structure.row.querySelector('.col-main')!;
		page.structure.side = page.structure.row.querySelector('.col-sidebar')!;
	} catch {
		log('unable to find elements', 'page structure');
	}

	const content_top = document.body.querySelector('.content-top')!;

	checkup_page_structure(false, content_top);

	page.type = 'bleh_setup';
	page.subpage = '';

	if (auth.avatar) {
		register_background(avatar(auth.avatar, 'ar0'));
	} else register_background(null);

	log('status is', 'page', 'info', page);

	update_page();

	// remove error stuff cus we control this page
	page.structure.row!.removeChild(page.structure.row!.firstElementChild!);
	page.structure.row!.removeChild(page.structure.row!.firstElementChild!);

	page.structure.container.classList.add('has-cards-view');
	page.structure.content!.classList.add('cards-view');

	const masthead = document.body.querySelector('.masthead')!;
	masthead.classList.add('in-setup');

	let transition_time = 200;

	if (useSettings.get('reduced_motion')) transition_time = 0;

	useSettings.on('reduced_motion', (v) => {
		transition_time = v ? 0 : 200;
	});

	const season = useSeasons.get().current;

	const header_preview = createRef();

	useSettings.on('format_guest_features', render_header_preview);
	useSettings.on('show_guest_features', render_header_preview);

	function render_header_preview() {
		if (!header_preview.current) return;

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
						{', '}
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

	const track_preview = createRef();

	useSettings.on('track_album_name_location', render_track_preview);
	useSettings.on('track_layout', render_track_preview);
	useSettings.on('expand_tracks', render_track_preview);

	function render_track_preview() {
		if (!track_preview.current) return;

		const album_name_location = useSettings.get(
			'track_album_name_location',
		) as string;
		const track_layout = useSettings.get('track_layout') as string;
		const expand_tracks = useSettings.get('expand_tracks') as string;

		const avi = avatar(auth.avatar, 'avatar170s');

		track_preview.current.replaceChildren(
			<table
				class='chartlist chartlist--with-image chartlist--with-loved chartlist--with-artist chartlist--with-more'
				data-theme={useSettings.get('theme')}
			>
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

	let current_page = 0;
	const pages: SetupPage[] = [
		{
			id: 'start',
			content: () => (
				<>
					<p>
						{tl(trans.welcome_to_bleh, {
							b: version.brand,
							break: <br />,
						})}
					</p>
				</>
			),
		},
		{
			id: 'accessibility',
			content: () => (
				<>
					<p>{tl(trans.accessibility_explain)}</p>
					<SettingGroup>
						<SettingSwitch bind='reduced_motion' />
						<SettingSwitch bind='reduced_flashing' />
						<SettingSwitch bind='show_scroller' />
						<SettingSwitch bind='underline_links' />
					</SettingGroup>
					<SettingGroup>
						<SettingRadio bind='font_choice' />
						<SettingInput bind='font' showLabel={false} />
					</SettingGroup>
				</>
			),
		},
		{
			id: 'themes',
			content: () => (
				<>
					<SettingTheme
						theme={{
							id: settings.theme as string,
							adaptive: settings.theme_schedule as boolean,
							theme_day: settings.theme_day as string,
							theme_night: settings.theme_night as string,
						}}
					/>
					<SettingGroup>
						<SettingSwitch bind='solarium' />
						<SettingRange bind='sat_bg' />
					</SettingGroup>
				</>
			),
		},
		{
			id: 'colours',
			content: () => (
				<>
					<SettingColour
						colour={{
							type: settings.accent_type as colour_type,
							hue: settings.hue as number,
							sat: settings.sat as number,
							lit: settings.lit as number,
						}}
						onChange={(val) => {
							if (settings.hue != val.hue) {
								save_setting('hue', val.hue);
							}
							if (settings.sat != val.sat) {
								save_setting('sat', val.sat);
							}
							if (settings.lit != val.lit) {
								save_setting('lit', val.lit);
							}
							if (settings.accent_type != val.type) {
								save_setting('accent_type', val.type);
							}
						}}
						season={season}
					/>
					<SettingGroup>
						<SettingOptions
							name={tl(trans.change_my_colour_when.name)}
							body={tl(trans.change_my_colour_when.body)}
							id='setting_change_my_colour_when'
						>
							<SettingCheckbox
								standalone
								bind='hue_from_artist'
							/>
							<SettingCheckbox standalone bind='hue_from_album' />
							<SettingCheckbox standalone bind='hue_from_track' />
							<SettingOptionsSeparator />
							<SettingCheckbox
								standalone
								bind='colourful_tracks'
							/>
							<SettingCheckbox
								standalone
								bind='colourful_tracks_all'
							/>
						</SettingOptions>
					</SettingGroup>
				</>
			),
		},
		{
			id: 'music',
			content: () => (
				<>
					<p>{tl(trans.music_explain)}</p>
					<div
						class='inner-preview pad flex'
						ref={header_preview}
						style={{ display: 'none' }}
					/>
					<SettingGroup>
						<SettingSwitch bind='corrections' />
						<SettingSwitch bind='format_guest_features' />
						<SettingOptions name={tl(trans.romanise_titles)}>
							<SettingCheckbox bind='romanise_jp' standalone />
							<SettingCheckbox bind='romanise_ko' standalone />
						</SettingOptions>
					</SettingGroup>
				</>
			),
		},
		{
			id: 'music',
			content: () => (
				<>
					<p>{tl(trans.music_explain)}</p>
					<div
						class='inner-preview pad'
						ref={track_preview}
						style={{ display: 'none' }}
					/>
					<SettingGroup>
						<SettingRadio bind='track_layout' />
						<SettingRadio bind='expand_tracks' />
						<SettingRadio bind='track_album_name_location' />
					</SettingGroup>
				</>
			),
		},
		{
			id: 'end',
			content: () => {
				// stalled til now so its downloaded
				const katelyn = sponsor_list.related.special[0] ||
					'dressupdarling';

				return (
					<>
						<p>
							{tl(trans.setup_end, {
								b: version.brand,
								settings: (
									<a href={`${root}bleh`}>
										{tl(trans.setup_end.settings)}
									</a>
								),
							})}
						</p>
						<div class={['campfire-cta', 'standalone']}>
							<a
								class={['btn', 'campfire-cta-btn']}
								href={`https://discord.gg/${discord}`}
								target='_blank'
							>
								<div
									class={[
										'campfire-cta-icon',
										'colourful',
										'discord',
									]}
								>
									<Icon name={icons.discord} />
								</div>
								<div class='campfire-cta-text'>
									<strong class='campfire-cta-text-head'>
										{tl(trans.join_discord)}
									</strong>
								</div>
							</a>
							<a
								class={['btn', 'campfire-cta-btn']}
								onClick={() => sponsor()}
							>
								<div
									class={[
										'campfire-cta-icon',
										'colourful',
										'sponsor',
									]}
								>
									<Icon name={icons.sponsor} />
								</div>
								<div class='campfire-cta-text'>
									<strong class='campfire-cta-text-head'>
										{tl(trans.sponsor)}
									</strong>
								</div>
							</a>
							<a
								class={['btn', 'campfire-cta-btn']}
								href={`${root}user/${katelyn}`}
								target='_blank'
							>
								<div class={['campfire-cta-icon', 'colourful']}>
									<Icon name={icons.follow} />
								</div>
								<div class='campfire-cta-text'>
									<strong class='campfire-cta-text-head'>
										{tl(trans.follow_user, {
											u: (
												<a class='mention'>
													<span class='at'>@</span>
													{katelyn}
												</a>
											),
										})}
									</strong>
								</div>
							</a>
						</div>
					</>
				);
			},
		},
	];

	const setup = createRef();
	const content = createRef();
	const footer = createRef();

	page.structure.main!.replaceChildren(
		<section class={['setup', 'sour']} ref={setup}>
			<div class='setup-top'>
				<div class={['avatar', 'setup-avatar']}>
					<img
						src={avatar(auth.avatar, 'avatar170s')}
						alt={auth.name}
					/>
				</div>
				<div class='setup-info'>
					<h1 class='setup-head'>
						{tl(trans.welcome, {
							u: (
								<a
									class='mention'
									href={`${root}user/${auth.name}`}
								>
									<span class='at'>@</span>
									{auth.name}
								</a>
							),
						})}
					</h1>
					<h2 class='setup-head-sub'>
						{tl(trans.bleh_setup_guide)}
					</h2>
				</div>
			</div>
			<div class='setup-content' ref={content} />
			<div class='setup-footer' ref={footer} />
		</section>,
	);

	function update() {
		const last_seen_page = current_page;
		const page_data = pages[current_page];

		setup.current.setAttribute('data-page', page_data.id);
		setup.current.setAttribute('data-animating', 'true');

		setTimeout(() => {
			if (current_page != last_seen_page) return;
			setup.current.setAttribute('data-animating', 'false');

			content.current.replaceChildren(page_data.content());

			console.error(current_page, pages.length);

			footer.current.replaceChildren(
				<>
					{current_page == 0
						? (
							<SeeMore
								iconPlacement='left'
								icon={icons.x}
								href={`${root}user/${auth.name}`}
							>
								{tl(trans.skip)}
							</SeeMore>
						)
						: (
							<SeeMore
								iconPlacement='left'
								icon={icons.arrow_left}
								onClick={go_back}
							>
								{tl(trans.back)}
							</SeeMore>
						)}
					<FooterFill />
					{current_page == pages.length - 1
						? (
							<Button primary onClick={go_next}>
								<Icon name={icons.check} />
								{tl(trans.finish)}
								<Icon name={icons.arrow_right} indicator />
							</Button>
						)
						: (
							<Button primary onClick={go_next}>
								{tl(trans.next)}
								<div class={['new-badge', 'count-badge']}>
									{current_page}/{pages.length - 1}
								</div>
								<Icon name={icons.arrow_right} indicator />
							</Button>
						)}
				</>,
			);
		}, transition_time);
	}

	update();

	function go_back() {
		if (current_page <= 0) return;

		current_page--;
		update();
	}

	function go_next() {
		if (current_page == pages.length - 1) {
			window.location.href = `${root}user/${auth.name}`;
			return;
		}

		current_page++;
		update();
	}
}
