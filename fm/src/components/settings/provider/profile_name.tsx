/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { useSettings } from '@/page.ts';
import { SettingSelect } from '@/components/settings/provider/select.tsx';
import { select_prepare_list } from '@/components/settings/select.ts';
import { tl, trans } from '@/build/trans.ts';
import { settings_store } from '@/build/config.ts';
import {
	Icon,
	IconArrowIcon,
	icons,
	SaveIcon,
} from '@/components/shared/icon.tsx';
import { SettingInput } from '@/components/settings/provider/input.tsx';
import { SettingLabel } from '@/components/settings/provider/main.tsx';
import { Input } from '@/components/input/input.tsx';
import { createRef, ReactNode } from 'jsx-dom';
import { expand_avatar } from '@/components/shared/avatar.tsx';
import { Button, ButtonGroup } from '@/components/button/button.tsx';
import { SettingGroup } from '@/components/settings/group.tsx';
import {
	dialog,
	dialog_rm,
	FooterFill,
	ModalFooter,
} from '@/components/dialog/dialog.tsx';
import { SettingRange } from '@/components/settings/provider/range.tsx';
import { SettingInfo } from '@/components/settings/provider/info.tsx';
import {
	ColourTile,
	ColourTiles,
} from '@/components/settings/provider/colour.tsx';
import { SeeMore } from '@/components/text/see_more.tsx';
import { clamp_lit, clamp_sat, hex_to_oklch } from '@/build/tools.ts';
import { formatHex } from 'culori';
import { page } from '@/build/page.ts';
import { MenuContents } from '@/components/menu/menu.tsx';
import { notify, notify_rm } from '@/components/dialog/notify.ts';
import { Carousel, CarouselItem } from '@/components/select/carousel.tsx';

interface ProfileNameProps {
	ref?: ReturnType<typeof createRef<ProfileNameElement>>;
	markdown: string;
	onChange: (v: string) => void;
}

interface Name {
	hue: number;
	sat: number;
	lit: number;
}

type ProfileNameElement = HTMLDivElement & {
	markdown: string;
	value: Name;
};

export function ProfileName({
	ref,
	markdown,
	onChange,
}: ProfileNameProps) {
	const Name_regex =
		/\[Name=([0-9]{1,3}),([0-9]*\.?[0-9]+),([0-9]*\.?[0-9]+)\]/;

	let value: Name = { hue: 0, sat: 0, lit: 0 };

	const preview = createRef();

	const elem = (
		<div class='setting' data-type='info' ref={ref}>
			<SettingLabel
				name={tl(trans.profile_Name.name)}
				body={tl(trans.profile_Name.body)}
			/>
			<div class='info'>
				<div class='colour-tile-and-button'>
					<div class={['colour-tile', 'colourful']} ref={preview} />
					<Button onClick={modal}>
						<Icon name={icons.edit} />
						{tl(trans.edit)}
					</Button>
				</div>
			</div>
		</div>
	) as ProfileNameElement;

	function modal() {
		const convert = createRef();
		const hue = createRef();
		const sat = createRef();
		const lit = createRef();
		const current_preview = createRef();

		dialog({
			id: 'profile_Name',
			title: tl(trans.profile_Name.name),
			body: (
				<>
					<SettingGroup>
						<SettingInfo name={tl(trans.preview)}>
							<ColourTiles ref={current_preview} />
						</SettingInfo>
						<SettingInput
							name={tl(trans.convert_from_hex)}
							type='colour'
							length={7}
							saveText={tl(trans.convert)}
							onChange={(val: string) => {
								const hsl = hex_to_oklch(val);

								const clamped_sat = clamp_sat(
									(hsl.s / 100) * 3,
								);

								hue.current.value = hsl.h;
								sat.current.value = clamped_sat;
								lit.current.value = clamp_lit(
									clamped_sat,
									hsl.l / 100 + 0.35,
								);

								update_preview();
							}}
							ref={convert}
						/>
						<SettingRange
							name={tl(trans.hue)}
							value={value.hue ||
								settings_store.hue.default as number}
							min={settings_store.hue.min}
							max={settings_store.hue.max}
							step={settings_store.hue.step}
							defaultValue={settings_store.hue.default as number}
							onChange={() => update_preview()}
							ref={hue}
						/>
						<SettingRange
							name={tl(trans.sat)}
							value={value.sat ||
								settings_store.sat.default as number}
							min={settings_store.sat.min}
							max={settings_store.sat.max}
							step={settings_store.sat.step}
							defaultValue={settings_store.sat.default as number}
							onChange={() => update_preview()}
							ref={sat}
						/>
						<SettingRange
							name={tl(trans.lit)}
							value={value.lit ||
								settings_store.lit.default as number}
							min={settings_store.lit.min}
							max={settings_store.lit.max}
							step={settings_store.lit.step}
							defaultValue={settings_store.lit.default as number}
							onChange={() => update_preview()}
							ref={lit}
						/>
					</SettingGroup>
					<ModalFooter>
						<SeeMore
							iconPlacement='left'
							icon={icons.x}
							onClick={() => dialog_rm({ id: 'profile_Name' })}
						>
							{tl(trans.cancel)}
						</SeeMore>
						<FooterFill />
						<ButtonGroup>
							<Button
								opens={
									<MenuContents>
										<Button
											menu
											onClick={() => {
												hue.current.value = useSettings
													.get('hue') as number;
												sat.current.value = useSettings
													.get('sat') as number;
												lit.current.value = useSettings
													.get('lit') as number;

												update_preview();
											}}
										>
											<IconArrowIcon
												icon1={
													<Icon
														name={icons
															.bleh_settings}
														className='icon-highlight'
													/>
												}
												icon2={
													<Icon
														name={icons.profile}
													/>
												}
											/>
											{tl(trans.apply_global_Name)}
										</Button>
										<Button
											menu
											onClick={() => {
												const warn = notify({
													id: 'confirm_Name',
													title: tl(
														trans.are_you_sure,
													),
													body: tl(
														trans
															.this_will_replace_your_global_Name,
													),
													type: 'warning',
													actions: [
														{
															type: 'check',
															action: () => {
																notify_rm(warn);

																useSettings.set(
																	'hue',
																	hue.current
																		.value as number,
																);
																useSettings.set(
																	'sat',
																	sat.current
																		.value as number,
																);
																useSettings.set(
																	'lit',
																	lit.current
																		.value as number,
																);
															},
															text: tl(
																trans.continue,
															),
														},
													],
													persist: true,
												});
											}}
										>
											<IconArrowIcon
												icon1={
													<Icon
														name={icons.profile}
													/>
												}
												icon2={
													<Icon
														name={icons
															.bleh_settings}
														className='icon-highlight'
													/>
												}
											/>
											{tl(trans.apply_profile_Name)}
										</Button>
									</MenuContents>
								}
							>
								<Icon name={icons.copy} />
								{tl(trans.copy)}
							</Button>
							<Button
								primary
								onClick={() => {
									set({
										hue: hue.current.value,
										sat: sat.current.value,
										lit: lit.current.value,
									});
									dialog_rm({ id: 'profile_Name' });
								}}
							>
								<SaveIcon />
								{tl(trans.save)}
							</Button>
						</ButtonGroup>
					</ModalFooter>
				</>
			),
		});

		function update_preview() {
			const style =
				`--hue-over: ${hue.current.value}; --sat-over: ${sat.current.value}; --lit-over: ${lit.current.value}`;

			current_preview.current.replaceChildren(
				<>
					<ColourTile type='l3' style={style} />
					<ColourTile type='l4' style={style} />
					<ColourTile type='h3' style={style} />
					<ColourTile type='h4' style={style} />
				</>,
			);

			const preview = page.state.colour_preview;
			preview.setAttribute('style', style);
			const bg_colour = window.getComputedStyle(preview).backgroundColor;

			const final = formatHex(bg_colour);
			convert.current.value = final;
			preview.removeAttribute('style');
		}

		update_preview();
	}

	function update(v: Name) {
		value = v;

		if (
			isNaN(v.hue) || isNaN(v.sat) || isNaN(v.lit)
		) {
			preview.current.style.removeProperty('--hue-over');
			preview.current.style.removeProperty('--sat-over');
			preview.current.style.removeProperty('--lit-over');
			preview.current.classList.add('empty');
			return;
		}

		preview.current.style.setProperty('--hue-over', String(v.hue));
		preview.current.style.setProperty('--sat-over', String(v.sat));
		preview.current.style.setProperty('--lit-over', String(v.lit));
		preview.current.classList.remove('empty');
	}

	function set(v: Name) {
		value = v;

		const match = markdown.match(Name_regex);

		const new_Name = `[Name=${v.hue},${v.sat},${v.lit}]`;

		if (match) {
			onChange(markdown.replace(Name_regex, new_Name));
		} else {
			const trimmed = markdown.trimEnd();

			if (trimmed.length == 0) {
				onChange(new_Name);
			} else {
				onChange(trimmed + '\n\n' + new_Name);
			}
		}

		update(v);
	}

	Object.defineProperty(elem, 'markdown', {
		set(v: string) {
			markdown = v;

			const match = markdown.match(Name_regex);

			update({
				hue: Number(match?.[1]),
				sat: Number(match?.[2]),
				lit: Number(match?.[3]),
			});
		},
	});

	Object.defineProperty(elem, 'value', {
		get() {
			return value;
		},
		set(v: Name) {
			set(v);
		},
	});

	const match = markdown.match(Name_regex);

	update({
		hue: Number(match?.[1] || undefined),
		sat: Number(match?.[2] || undefined),
		lit: Number(match?.[3] || undefined),
	});

	return elem;
}

export function convert_name_fonts(values: Record<string, string>) {
	const vals: CarouselItem[] = [];
	Object.entries(values).forEach(([font, family]) => {
		vals.push({
			value: font,
			display: (
				<NameStyle value={font} type='font'>
					{family || tl(trans.none)}
				</NameStyle>
			),
		});
	});

	return vals;
}

export function convert_name_styles() {
	return ['solid', 'pop', 'out', 'glow'].map((item) => ({
		value: item,
		display: (
			<NameStyle value={item} type='style'>
				{tl(trans.font_style[item])}
			</NameStyle>
		),
	})) as CarouselItem[];
}

interface NameStylesProps {
	value: string;
	values: CarouselItem[];
	onChange?: (v: string) => void;
}

export function NameStyles({
	value,
	values,
	onChange,
}: NameStylesProps) {
	return (
		<Carousel
			className='name-style-block'
			value={value}
			values={values}
			onChange={onChange}
		/>
	);
}

interface NameStyleProps {
	value: string;
	type: 'font' | 'style';
	children: ReactNode;
}

function NameStyle({
	value,
	type,
	children,
}: NameStyleProps) {
	const elem = (
		<div class='name-style'>
			{children}
		</div>
	);

	if (type == 'font') {
		elem.setAttribute('data-font', value);
	} else {
		elem.setAttribute('data-font-style', value);
	}

	return elem;
}
