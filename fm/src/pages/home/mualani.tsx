/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { register_background, update_page } from '@/page';
import { auth, page } from '@/build/page';
import { log } from '@/build/log.ts';
import { checkup_page_structure } from '@/components/page/structure.js';
import { html, render } from 'lighterhtml';
import { notify } from '@/components/dialog/notify';
import { download_with_progress } from '@/build/tools';
import { status } from '@/components/dialog/status.js';
import { dialog } from '@/components/dialog/dialog';
import { save_setting, setting } from '@/components/settings/settings';
import { markdown, markdown_field } from '@/components/markdown/markdown';
import { sponsor_list } from '@/build/sponsor';
import { create_badge, load_badges } from '@/components/shared/badge';
import { clamp_lit, clamp_sat, rgb_to_oklch } from '@/build/tools';
import { chartlist_bar } from '@/components/music/bar';
import { avatar } from '@/components/shared/avatar';
import { click_indicator } from '@/components/shared/indicator';
import { createRef, ReactNode } from 'jsx-dom';
import { SettingGroup } from '@/components/settings/group.tsx';
import { SettingAction } from '@/components/settings/provider/action.tsx';
import { SettingInfo } from '@/components/settings/provider/info.tsx';
import { Switch } from '@/components/settings/clickables/switch.tsx';
import { Checkbox } from '@/components/settings/clickables/checkbox.tsx';
import { SettingSwitch } from '@/components/settings/provider/switch.tsx';
import { Button } from '@/components/button/button.tsx';
import { SeeMore } from '@/components/text/see_more.tsx';
import { Keybind } from '@/components/settings/clickables/keybind.tsx';
import { Input } from '@/components/input/input.tsx';
import { SettingInput } from '@/components/settings/provider/input.tsx';
import { SettingKeybind } from '@/components/settings/provider/keybind.tsx';
import { SettingTheme } from '@/components/settings/provider/theme.tsx';
import { SettingCheckbox } from '@/components/settings/provider/checkbox.tsx';
import { settings } from '@/build/config.ts';
import { Select } from '@/components/select/select.tsx';
import { SettingSelect } from '@/components/settings/provider/select.tsx';
import { select_prepare_list } from '@/components/settings/select.ts';
import { tl, trans } from '@/build/trans.ts';
import { Range } from '@/components/range/range.tsx';
import { SettingRange } from '@/components/settings/provider/range.tsx';
import {
	ColourSwatch,
	SettingColour,
} from '@/components/settings/provider/colour.tsx';
import { colour_type } from '@/components/settings/swatch.ts';
import { DateTime } from 'luxon';
import { SettingRadio } from '@/components/settings/provider/radio.tsx';
import {
	List,
	ListAdd,
	ListCandidate,
	ListItem,
} from '@/components/settings/clickables/list.tsx';
import { SettingList } from '@/components/settings/provider/list.tsx';
import { EventItem } from '@/components/event/item.tsx';
import {
	CancelIcon,
	icons,
	MinusIcon,
	PlusIcon,
	SaveIcon,
} from '@/components/shared/icon.tsx';
import { Flag } from '@/components/shared/flag.tsx';
import { TopAlbum } from '@/components/album/top_album.tsx';
import { Tabbed } from '@/components/tab/tabbed.tsx';
import { ProfileStreak } from '@/components/profile/streak.tsx';
import { Alert } from '@/components/text/alert.tsx';
import { MarkdownField } from '@/components/markdown/field.tsx';
import { profile_bio_markdown_settings } from '@/pages/profile/about.tsx';
import { ProfileBanner } from '@/components/settings/provider/profile_banner.tsx';
import { ProfileAccent } from '@/components/settings/provider/profile_accent.tsx';
import { Carousel } from '@/components/select/carousel.tsx';
import {
	convert_name_fonts,
	convert_name_styles,
	NameStyles,
	ProfileName,
} from '@/components/settings/provider/profile_name.tsx';

export function mualani() {
	page.structure.container = document.body.querySelector('.page-content');
	try {
		page.structure.row = page.structure.container.querySelector('.row');
		page.structure.main = page.structure.row.querySelector('.col-main');
		page.structure.side = page.structure.row.querySelector('.col-sidebar');
	} catch (e) {
		log('unable to find elements', 'page structure');
	}

	checkup_page_structure();

	register_background(avatar(auth.avatar, 'ar0'));

	page.type = 'bleh_mualani';
	page.avatar = auth.avatar!;
	page.name = auth.name!;
	page.subpage = '';

	log('status is', 'page', 'info', page);

	update_page();

	// remove error stuff cus we control this page
	page.structure.row.removeChild(page.structure.row.firstElementChild);
	page.structure.row.removeChild(page.structure.row.firstElementChild);

	page.structure.content?.classList.add('single-column');

	let md_body;
	const md_options = {
		allow_headers: true,
		allow_banners: true,
		allow_icons: true,
		allow_hue: true,
		allow_fonts: true,
		allow_socials: true,
		allow_alignment: true,
		allow_lists: true,
	};

	let md_body_links;

	const colours = [
		[0, 0, 0],
		[64, 64, 64],
		[128, 128, 128],
		[255, 255, 255],
		[137, 105, 128],
		[217, 85, 102],
		[243, 179, 134],
		[122, 68, 205],
		[86, 126, 81],
		[188, 243, 211],
		[195, 121, 82],
		[26, 99, 253],
		[255, 0, 220],
		[255, 216, 0],
		[0, 127, 70],
		[38, 127, 0],
		[0, 255, 255],
		[12, 7, 34],
	];

	const link_text = `
        [links]
        https://x.com/ZZZ_EN
        https://twitter.com/ZZZ_EN
        https://open.spotify.com/album/4T7qu6MdxoGjzZPErRWgsO
        https://youtube.com
        https://github.com
        https://discord.com
        https://bandcamp.com
        https://soundcloud.com
        https://tiktok.com
        https://ko-fi.com
        https://patreon.com
        https://twitch.tv
        https://linktr.ee
        https://carrd.co
        https://music.apple.com
        https://music.youtube.com
        https://facebook.com
        https://discogs.com
        https://tidal.com
        https://record.club
        https://rateyourmusic.com
        https://albumoftheyear.org
        https://kyu.re
        https://katelyn.moe
        https://google.com
        https://mastodon.social
        https://bsky.app
        https://reddit.com
        [/links]
    `;

	let bars;

	const format_guest_features = createRef();
	const show_guest_features = createRef();

	const mouse = createRef();

	const colour = createRef();

	const md = createRef();
	const banner = createRef();
	const accent = createRef();
	const name = createRef();

	page.structure.main!.replaceChildren(
		<>
			<section>
				<DemoGrid>
					<DemoItem label='Button'>
						<Button>Button</Button>
						<Button primary>Button</Button>
						<Button disabled>Button</Button>
						<Button primary disabled>Button</Button>
						<Button loading>Button</Button>
						<Button primary loading>Button</Button>
						<Button>
							<SaveIcon />
							Button
						</Button>
						<Button primary>
							<SaveIcon />
							Button
						</Button>
						<Button>
							<CancelIcon />
							Button
						</Button>
						<Button primary>
							<CancelIcon />
							Button
						</Button>
						<Button>
							<PlusIcon />
							Button
						</Button>
						<Button primary>
							<PlusIcon />
							Button
						</Button>
						<Button>
							<MinusIcon />
							Button
						</Button>
						<Button primary>
							<MinusIcon />
							Button
						</Button>
					</DemoItem>
					<DemoItem label='SeeMore'>
						<SeeMore>See more</SeeMore>
						<SeeMore iconPlacement='left'>See more</SeeMore>
					</DemoItem>
				</DemoGrid>
			</section>
			<section>
				<DemoGrid>
					<DemoItem label='SettingAction'>
						<SettingGroup>
							<SettingAction
								name='Setting name'
								body='Setting body'
							>
								action goes here!!
							</SettingAction>
						</SettingGroup>
					</DemoItem>
					<DemoItem label='SettingInfo'>
						<SettingGroup>
							<SettingInfo
								name='Setting name'
								body='Setting body'
							>
								info goes here!!
							</SettingInfo>
						</SettingGroup>
					</DemoItem>
					<DemoItem label='Switch'>
						<Switch />
						<Switch checked />
					</DemoItem>
					<DemoItem label='Checkbox'>
						<Checkbox />
						<Checkbox checked />
					</DemoItem>
					<DemoItem label='SettingSwitch'>
						<SettingGroup>
							<SettingSwitch
								name='Setting name'
								body='Setting body'
							/>
							<SettingSwitch name='Setting name' />
						</SettingGroup>
					</DemoItem>
					<DemoItem label='SettingCheckbox'>
						<SettingGroup>
							<SettingCheckbox
								name='Setting name'
								body='Setting body'
							/>
							<SettingCheckbox name='Setting name' />
						</SettingGroup>
					</DemoItem>
				</DemoGrid>
			</section>
			<section>
				<DemoGrid>
					<DemoItem label='SettingSwitch (binded to underline_links)'>
						<SettingGroup>
							<SettingSwitch bind='underline_links' />
						</SettingGroup>
					</DemoItem>
					<DemoItem label='SettingSwitch (testing compatibility)'>
						<SettingGroup>
							<SettingSwitch bind='format_guest_features' />
							<SettingSwitch bind='show_guest_features' />
							<SettingSwitch name='example' />
						</SettingGroup>
						<SettingGroup>
							<SettingSwitch bind='format_guest_features' />
							<SettingSwitch bind='show_guest_features' />
							<SettingSwitch name='example' />
						</SettingGroup>
					</DemoItem>
					<DemoItem label='SettingSwitch (tracking mouse enter and leave)'>
						<p ref={mouse}>Not hovered</p>
						<SettingGroup>
							<SettingSwitch
								name='Hover to update the above'
								onMouseEnter={() => {
									mouse.current.textContent = 'Hovered';
								}}
								onMouseLeave={() => {
									mouse.current.textContent = 'Not hovered';
								}}
							/>
						</SettingGroup>
					</DemoItem>
				</DemoGrid>
			</section>
			<section>
				<DemoGrid>
					<DemoItem label='Keybind'>
						<Keybind value='⌘' />
						<Keybind value='⇧' />
						<Keybind value='⌥' />
						<Keybind value='⌃' />
						<Keybind value='⏎' />
						<Keybind value='⎋' />
						<Keybind value='⌫' />
					</DemoItem>
					<DemoItem label='Keybind (interactable)'>
						<Keybind value='⌘' />
						<Keybind value='A' interact />
					</DemoItem>
					<DemoItem label='SettingKeybind'>
						<SettingGroup>
							<SettingKeybind
								name='Setting name'
								body='Setting body'
								value={['⌘', 'A']}
							/>
						</SettingGroup>
					</DemoItem>
					<DemoItem label='SettingKeybind (binded to rabbit_primary)'>
						<SettingGroup>
							<SettingKeybind bind='rabbit_primary' />
							<SettingKeybind bind='rabbit_primary' />
						</SettingGroup>
					</DemoItem>
				</DemoGrid>
			</section>
			<section>
				<DemoGrid>
					<DemoItem label='Input'>
						<Input />
						<Input type='number' />
						<Input type='password' />
						<Input type='colour' />
					</DemoItem>
					<DemoItem label='Input (textarea)'>
						<Input type='textarea' />
					</DemoItem>
					<DemoItem label='SettingInput'>
						<SettingGroup>
							<SettingInput
								name='Setting name'
								body='Setting body'
							/>
							<SettingInput
								name='Setting name'
								body='Setting body'
								showLabel={false}
							/>
						</SettingGroup>
					</DemoItem>
					<DemoItem label='SettingInput (binded to font)'>
						<SettingGroup>
							<SettingInput bind='font' />
							<SettingInput bind='font' showLabel={false} />
						</SettingGroup>
					</DemoItem>
				</DemoGrid>
			</section>
			<section>
				<DemoGrid>
					<DemoItem label='Select'>
						<Select
							values={[
								{
									value: 'hello',
									text: 'Hello',
								},
								{
									value: 'world',
									text: 'World',
								},
							]}
						/>
					</DemoItem>
					<DemoItem label='Select (with advanced stuff)'>
						<Select
							values={[
								{
									text: 'See below',
								},
								{
									value: 'hello',
									text: 'Hello',
								},
								{
									text: 'sep',
								},
								{
									value: 'world',
									text: 'World',
								},
							]}
						/>
					</DemoItem>
					<DemoItem label='SettingSelect'>
						<SettingGroup>
							<SettingSelect
								name='Select body'
								values={[
									{
										value: 'hello',
										text: 'Hello',
									},
									{
										value: 'world',
										text: 'World',
									},
								]}
							/>
						</SettingGroup>
					</DemoItem>
					<DemoItem label='SettingSelect (binded to starred_friend)'>
						<SettingGroup>
							<SettingSelect
								bind='starred_friend'
								values={select_prepare_list([
									{ value: '', text: tl(trans.none) },
									...settings.friends,
								])}
							/>
						</SettingGroup>
					</DemoItem>
				</DemoGrid>
			</section>
			<section>
				<DemoGrid>
					<DemoItem label='SettingTheme'>
						<SettingTheme
							theme={{
								id: settings.theme as string,
								adaptive: settings.theme_schedule as boolean,
								theme_day: settings.theme_day as string,
								theme_night: settings.theme_night as string,
							}}
						/>
						<SettingTheme
							theme={{
								id: settings.theme as string,
								adaptive: settings.theme_schedule as boolean,
								theme_day: settings.theme_day as string,
								theme_night: settings.theme_night as string,
							}}
						/>
					</DemoItem>
				</DemoGrid>
			</section>
			<section>
				<DemoGrid>
					<DemoItem label='Range'>
						<Range max={100} step={1} />
					</DemoItem>
					<DemoItem label='SettingRange'>
						<SettingGroup>
							<SettingRange
								name='Setting body'
								max={100}
								step={1}
							/>
						</SettingGroup>
					</DemoItem>
					<DemoItem label='SettingRange (binded to gloss)'>
						<SettingGroup>
							<SettingRange bind='gloss' />
						</SettingGroup>
					</DemoItem>
				</DemoGrid>
			</section>
			<section>
				<DemoGrid>
					<DemoItem label='ColourSwatch'>
						<ColourSwatch
							colour={{
								type: 'colour',
							}}
						/>
						<ColourSwatch
							colour={{
								type: 'colour',
							}}
							active
						/>
					</DemoItem>
					<DemoItem label='SettingColour'>
						<SettingColour
							colour={{
								type: settings.accent_type as colour_type,
								hue: settings.hue as number,
								sat: settings.sat as number,
								lit: settings.lit as number,
							}}
							season={{
								id: 'christmas',
								start: DateTime.fromISO('2026-08-05'),
								end: DateTime.fromISO('2026-08-05'),
								snowflakes: {
									state: false,
								},
							}}
							recents={[
								{
									hue: 210,
									sat: 1,
									lit: 1,
								},
								{
									hue: 300,
									sat: 1.5,
									lit: 0.85,
								},
								{
									hue: 20,
									sat: 1.3,
									lit: 1.05,
								},
								{
									hue: 40,
									sat: 1.3,
									lit: 1.05,
								},
								{
									hue: 20,
									sat: 1.3,
									lit: 1.05,
								},
								{
									hue: 180,
									sat: 1.3,
									lit: 1.05,
								},
								{
									hue: 20,
									sat: 1.3,
									lit: 1.05,
								},
								{
									hue: 120,
									sat: 1.3,
									lit: 1.05,
								},
								{
									hue: 20,
									sat: 1.6,
									lit: 0.9,
								},
								{
									hue: 70,
									sat: 1.5,
									lit: 1.05,
								},
								{
									hue: 20,
									sat: 1.3,
									lit: 1.05,
								},
								{
									hue: 90,
									sat: 1.3,
									lit: 1.05,
								},
							]}
						/>
						<SettingColour
							colour={{
								type: settings.accent_type as colour_type,
								hue: settings.hue as number,
								sat: settings.sat as number,
								lit: settings.lit as number,
							}}
							season={{
								id: 'christmas',
								start: DateTime.fromISO('2026-08-05'),
								end: DateTime.fromISO('2026-08-05'),
								snowflakes: {
									state: false,
								},
							}}
						/>
					</DemoItem>
				</DemoGrid>
			</section>
			<section>
				<DemoGrid>
					<DemoItem label='SettingRadio'>
						<SettingGroup>
							<SettingRadio
								name='Setting name'
								body='Setting body'
								value='hello'
								values={{
									hello: {
										name: 'Hello',
									},
									world: {
										name: 'World',
									},
								}}
							/>
						</SettingGroup>
					</DemoItem>
					<DemoItem label='SettingRadio (binded to track_album_name_location)'>
						<SettingGroup>
							<SettingRadio bind='track_album_name_location' />
						</SettingGroup>
					</DemoItem>
				</DemoGrid>
			</section>
			<section>
				<DemoGrid>
					<DemoItem label='List'>
						<List>
							<ListItem name='List item' />
							<ListItem name='List item' />
							<ListItem name='List item' />
							<ListAdd />
						</List>
						<List>
							<ListCandidate name='List item' />
							<ListCandidate name='List item' />
							<ListCandidate name='List item' />
						</List>
					</DemoItem>
					<DemoItem label='SettingList'>
						<SettingGroup>
							<SettingList
								name='Setting name'
								body='Setting body'
								value={['hello', 'world']}
								values={{
									hello: {
										name: 'Hello',
									},
									world: {
										name: 'World',
									},
								}}
							/>
							<SettingList
								name='Setting name'
								body='Setting body'
								value={['hello', 'world']}
							/>
							<SettingList
								name='Setting name'
								body='Setting body'
								value={['hello']}
								values={{
									hello: {
										name: 'Hello',
									},
									world: {
										name: 'World',
									},
								}}
								predefined
							/>
						</SettingGroup>
					</DemoItem>
					<DemoItem label='SettingList (binded to friends)'>
						<SettingGroup>
							<SettingList bind='friends' />
						</SettingGroup>
					</DemoItem>
					<DemoItem label='SettingList (binded to navigation_items)'>
						<SettingGroup>
							<SettingList bind='navigation_items' />
							<SettingList
								bind='navigation_items'
								values={page.state.quick_access_items}
							/>
						</SettingGroup>
					</DemoItem>
				</DemoGrid>
			</section>
			<section>
				<DemoGrid>
					<DemoItem label='Markdown (music links)'>
						<div class='markdown-body'>
							{markdown(link_text, { allow_socials: true })}
						</div>
					</DemoItem>
				</DemoGrid>
			</section>
			<section>
				<DemoGrid>
					<DemoItem label='EventItem'>
						<EventItem
							date='2026-08-14T00:00:00'
							title='BST Hyde Park: Sabrina Carpenter'
							artists={[
								'Sabrina Carpenter',
								'Amber Mark',
								'beabadoobee',
								'Clairo',
								'DellaXOZ',
								'Luvcat',
								'SOFY',
								'Sola',
							]}
							venue='Hyde Park'
							city='London'
							country='United Kingdom'
							attendance='going'
							attendance_text='You went'
							attendance_count='31 went'
							href='/event/4881572+BST+Hyde+Park:+Sabrina+Carpenter'
						/>
						<EventItem
							date='2026-08-14T00:00:00'
							title='BST Hyde Park: Sabrina Carpenter'
							artists={[
								'Sabrina Carpenter',
								'Amber Mark',
								'beabadoobee',
								'Clairo',
								'DellaXOZ',
								'Luvcat',
								'SOFY',
								'Sola',
							]}
							venue='Hyde Park'
							city='London'
							country='United Kingdom'
							attendance='maybe'
							attendance_text='You were interested'
							attendance_count='31 went'
							href='/event/4881572+BST+Hyde+Park:+Sabrina+Carpenter'
						/>
						<EventItem
							date='2026-08-14T00:00:00'
							title='BST Hyde Park: Sabrina Carpenter'
							artists={[
								'Sabrina Carpenter',
								'Amber Mark',
								'beabadoobee',
								'Clairo',
								'DellaXOZ',
								'Luvcat',
								'SOFY',
								'Sola',
							]}
							venue='Hyde Park'
							city='London'
							country='United Kingdom'
							attendance_count='31 went'
							href='/event/4881572+BST+Hyde+Park:+Sabrina+Carpenter'
						/>
						<EventItem
							date='2026-08-20T00:00:00'
							title='Tiffany Day'
							venue='Hyde Park'
							city='London'
							country='United Kingdom'
							attendance='going'
							attendance_text='You went'
							attendance_count='31 went'
							href='/event/4881572+BST+Hyde+Park:+Sabrina+Carpenter'
						/>
						<EventItem
							date='2026-08-20T00:00:00'
							title='Tiffany Day'
							venue='Hyde Park'
							city='London'
							country='United Kingdom'
							avatars={[
								<span
									class='avatar attendee-you-know-avatar'
									key={0}
								>
									<img src={auth.avatar} />
								</span>,
								<span
									class='avatar attendee-you-know-avatar'
									key={1}
								>
									<img src={auth.avatar} />
								</span>,
							]}
							attendance='going'
							attendance_text='You went'
							attendance_count='31 went'
							href='/event/4881572+BST+Hyde+Park:+Sabrina+Carpenter'
						/>
					</DemoItem>
				</DemoGrid>
			</section>
			<section>
				<DemoGrid>
					<DemoItem label='Flag'>
						<Flag code='GB' />
						<Flag code='GB-SCT' />
						<Flag code='US' />
						<Flag code='DE' />
					</DemoItem>
				</DemoGrid>
			</section>
			<section>
				<DemoGrid>
					<DemoItem label='TopAlbum'>
						<TopAlbum
							name='test'
							artist='test2'
							href='/music/test2/test'
						/>
					</DemoItem>
				</DemoGrid>
			</section>
			<section>
				<DemoGrid>
					<DemoItem label='Tabbed'>
						<Tabbed
							page='hello'
							pages={{
								hello: {
									icon: icons.accent,
									label: 'Hello',
									content: <p>hello!!</p>,
								},
								world: {
									icon: icons.cut,
									label: 'World',
									content: <p>hello world!!</p>,
								},
							}}
						/>
					</DemoItem>
				</DemoGrid>
			</section>
			<section>
				<DemoGrid>
					<DemoItem label='ProfileStreak'>
						<ProfileStreak loading />
						<ProfileStreak />
						<ProfileStreak
							artist={{ count: 50, name: 'Tiffany Day' }}
						/>
						<ProfileStreak
							artist={{ count: 100, name: 'Tiffany Day' }}
						/>
						<ProfileStreak
							artist={{ count: 50, name: 'Tiffany Day' }}
							album={{ count: 50, name: 'HALO' }}
						/>
					</DemoItem>
				</DemoGrid>
			</section>
			<section>
				<DemoGrid>
					<DemoItem label='Alert'>
						<Alert margin={false}>test alert</Alert>
						<Alert type='danger' margin={false}>test alert</Alert>
						<Alert type='error' margin={false}>test alert</Alert>
						<Alert type='success' margin={false}>test alert</Alert>
					</DemoItem>
				</DemoGrid>
			</section>
			<section>
				<DemoGrid>
					<DemoItem label='MarkdownField'>
						<MarkdownField
							elem={<textarea /> as HTMLTextAreaElement}
						/>
						<MarkdownField
							elem={<textarea /> as HTMLTextAreaElement}
							onChange={(v) => {
								console.info('value', v);
								banner.current.markdown = v;
								accent.current.markdown = v;
								name.current.markdown = v;
							}}
							ref={md}
							options={profile_bio_markdown_settings}
						/>
					</DemoItem>
				</DemoGrid>
			</section>
			<section>
				<DemoGrid>
					<DemoItem label='ProfileBanner'>
						<SettingGroup>
							<ProfileBanner
								markdown=''
								onChange={(v: string) => md.current.value = v}
								ref={banner}
							/>
						</SettingGroup>
					</DemoItem>
					<DemoItem label='ProfileAccent'>
						<SettingGroup>
							<ProfileAccent
								markdown=''
								onChange={(v: string) => md.current.value = v}
								ref={accent}
							/>
						</SettingGroup>
					</DemoItem>
					<DemoItem label='ProfileName'>
						<SettingGroup>
							<ProfileName
								markdown=''
								onChange={(v: string) => md.current.value = v}
								ref={name}
							/>
						</SettingGroup>
					</DemoItem>
				</DemoGrid>
			</section>
			<section>
				<DemoGrid>
					<DemoItem label='Carousel'>
						<Carousel
							values={[
								{
									value: 'hello',
									display: () => 'Hello',
								},
								{
									value: 'world',
									display: () => 'world',
								},
								{
									value: 'hello1',
									display: () => 'Hello1',
								},
								{
									value: 'world2',
									display: () => 'world2',
								},
							]}
						/>
					</DemoItem>
					<DemoItem label='Carousel (NameStyles)'>
						<NameStyles
							value=''
							values={convert_name_fonts(page.state.fonts)}
						/>
						<NameStyles
							value=''
							values={convert_name_styles()}
						/>
					</DemoItem>
				</DemoGrid>
			</section>
		</>,
	);

	return;

	render(
		page.structure.main,
		html`
			<section class="flexy">
				<h2>Buttons</h2>
				<div class="flexy h">
					<button class="btn">Button</button>
					<button class="btn primary">Button</button>
					<button class="btn" disabled>Button</button>
					<button class="btn primary" disabled>Button</button>
				</div>
				<div class="flexy h">
					<button class="btn danger-subtle">Button</button>
					<button class="btn primary danger">Button</button>
					<button class="btn danger-subtle" disabled>Button</button>
					<button class="btn primary danger" disabled>Button</button>
				</div>
				<div class="flexy h">
			        ${click_indicator()}
			    </div>
			</section>
			<section class="flexy">
				<h2>Settings</h2>
				<div class="setting-group">
			        ${setting({ id: 'solarium' })} ${setting({ id: 'gloss' })}
			        ${setting({ id: 'expand_tracks' })}
			        ${setting({ id: 'romanise_jp' })}
			        ${setting({
				id: 'navigation_items',
				list: page.state.quick_access_items,
			})}
			    </div>
				<div class="tippy-box" data-theme="context-menu" data-state="visible">
					<div class="tippy-content">
			            ${setting({ id: 'solarium', in_menu: true })}
			            ${setting({ id: 'romanise_jp', in_menu: true })}
			            ${setting({ id: 'expand_tracks', in_menu: true })}
			        </div>
				</div>
			</section>
			<section class="flexy">
				<h2>Notifications</h2>
				<div class="flexy h">
					<button
						class="btn continue"
						onclick=${() =>
							notify({
								id: 'test',
								title: 'testing!',
								body: 'haaaiaiii test bodyyy.......',
							})}
					>
			            Deliver notification
			        </button>
					<button
						class="btn continue"
						onclick=${() =>
							notify({
								id: 'test',
								title: 'testing!',
								body: 'haaaiaiii test bodyyy.......',
								persist: true,
							})}
					>
			            Deliver persistent notification
			        </button>
					<button
						class="btn continue"
						onclick=${() => {
							let notification = notify({
								id: 'async',
								title: 'progress',
								body: 'downloading...',
								progress: true,
							});

							download_with_progress(
								`https://lastfm.freetls.fastly.net/i/u/ar0/6644c67eaa3669676252d3190f9b019f.jpg?a=${Math.random()}`,
								(percent) => {
									notification.set_body(
										`downloading... ${percent}%`,
									);
									notification.set(percent);
								},
							).then(async (blob) => {
								const text = await blob.text();

								notification.set_body('download complete');
								notification.set(100);

								console.info(text);
							});
						}}
					>
			            Deliver async progress notification
			        </button>
				</div>
			</section>
			<section class="flexy">
				<h2>Status alerts</h2>
				<button
					class="btn continue"
					onclick=${() =>
						status({
							title: 'test alert',
							body: 'haiaiai nothing to worry about >_<',
						})}
				>
			        Deliver status alert
			    </button>
			</section>
			<section class="flexy">
				<h2>Modals</h2>
				<button class="btn continue" onclick=${() => dialog_loop()}>
			        Open dialog loop
			    </button>
			</section>
			<section class="flexy">
			    <h2>Markdown (with bio settings)</h2>
			    ${markdown_field((val) => {
				render(md_body, markdown(val, md_options));
			}, md_options)}
			    <div class="sep" />
			    <div class="markdown-body" ref=${(el) => md_body = el} />
			</section>
			<section class="flexy">
			    <h2>Markdown (with defaults)</h2>
			    ${markdown_field((val) => {
				render(md_body_default, markdown(val));
			})}
			    <div class="sep" />
			    <div class="markdown-body" ref=${(el) =>
				md_body_default = el} />
			</section>
			<section class="flexy">
				<h2>Graph colours</h2>
				<div style="display: flex; flex-wrap: wrap; gap: 8px">
			        ${Array.from({ length: 13 }, (_, i) => {
				return html.node`
                            <div style="display: flex; flex-direction: column; gap: 10px">
                                <div style="width: 40px; height: 40px; background-color: var(--graph-colour-${i})" />
                                <div style="width: 40px; height: 3px; background-color: var(--graph-colour-${i})" />
                            </div>
                        `;
			})}
			    </div>
			</section>
			<section class="flexy">
				<div class="inner-preview pad">
					<div class="bars" ref=${(el) => (bars = el)}>
			            ${() => {
				let max = 100_000;

				for (
					let value = 0;
					value <= max;
					value += 200
				) {
					bars.appendChild(chartlist_bar(value, max));
				}
			}}
			        </div>
				</div>
			</section>
			<section class="flexy">
				<h2>Colour conversions</h2>
				<div class="colour-list">
			            ${colours.map((colour) => {
				const hsl = rgb_to_oklch(colour[0], colour[1], colour[2]);

				hsl.s = clamp_sat((hsl.s / 100) * 3);

				const hue = {
					h: hsl.h,
					s: hsl.s,
					l: clamp_lit(hsl.s, hsl.l / 100 + 0.35),
				};

				return html.node`
                                <div class="colour-list-item">
                                    <div class="colour-tile colourful" style="background: rgb(${
					colour[0]
				}, ${colour[1]}, ${colour[2]})" />
                                    <div class="colour-text">rgb(${
					colour[0]
				}, ${colour[1]}, ${colour[2]})</div>
                                    <div class="bleh-icon" data-type="arrow-right" style="--icon: var(--mask)" />
                                    <div class="colour-tile colourful" style="--hue-over: ${hue.h}; --sat-over: ${hue.s}; --lit-over: ${hue.l}" />
                                    <div class="colour-text">hue ${hue.h}, sat ${hue.s}, lit ${hue.l}</div>
                                </div>
                            `;
			})}
			    </div>
			</section>
			<section class="flexy">
				<h2>Badges</h2>
				<div class="button-group">
			        ${sponsor_list.version
				? Object.entries(sponsor_list.users).map(([user, contents]) => {
					const badges = load_badges(user);

					return html.node`
                            ${
						badges.map((badge) => {
							if (
								badge.type == 'sponsor' && !badge.icon
							) return html.node``;

							return create_badge(badge, false, true);
						})
					}
                        `;
				})
				: ''}
			    </div>
				<div class="button-group">
			        ${sponsor_list.version
				? Object.entries(sponsor_list.users).map(([user, contents]) => {
					const badges = load_badges(user);

					return html.node`
                            ${
						badges.map((badge) => {
							if (
								badge.type == 'sponsor' && !badge.icon
							) return html.node``;

							return create_badge(badge, false, true, true);
						})
					}
                        `;
				})
				: ''}
			    </div>
			</section>
			<section class="flexy">
				<h2>Brand</h2>
				<div class="brand-container-demo">
					<div class="brand-demo" />
				</div>
				<div class="brand-container-demo">
					<div class="brand-demo brand-demo-mask" />
				</div>
				<div class="brand-container-demo empty">
					<div class="brand-demo" />
					<div class="brand-demo brand-demo-small" />
				</div>
			</section>
			<section class="flexy">
				<h2>Links</h2>
				<div class="markdown-body" ref=${(el) => md_body_links = el} />
			</section>
		`,
	);
}

function dialog_loop() {
	const num = Math.random();

	dialog({
		id: `loop_${num}`,
		title: num,
		body: html.node`
            <button onclick=${() => dialog_loop()}>Open a new dialog</button>
        `,
	});
}

function DemoGrid({ children }: { children: ReactNode }) {
	return (
		<div class='demo-grid'>
			{children}
		</div>
	);
}

function DemoItem({ children, label }: { children: ReactNode; label: string }) {
	return (
		<div class='demo-item-wrap'>
			<h4 class='demo-label'>{label}</h4>
			<div class='demo-item'>
				{children}
			</div>
		</div>
	);
}
