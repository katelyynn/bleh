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
import { auth, page } from '@/build/page.ts';
import { MenuContents } from '@/components/menu/menu.tsx';
import { notify, notify_rm } from '@/components/dialog/notify.ts';
import { Carousel, CarouselItem } from '@/components/select/carousel.tsx';
import { CardTip } from '@/components/text/tip.tsx';

interface ProfileNameProps {
	ref?: ReturnType<typeof createRef<ProfileNameElement>>;
	markdown: string;
	onChange: (v: string) => void;
}

interface Name {
	name: string;
	font: string;
	style: string;
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
	const name_regex = /\[name=([^\]]+)\]/;
	const font_regex = /\[font=([^\]]+)\]/;

	let value: Name = { name: '', font: '', style: '' };

	const preview = createRef();
	const input = createRef();

	const elem = (
		<div class='setting' data-type='text' ref={ref}>
			<SettingLabel
				name={tl(trans.display_name.name)}
				body={tl(trans.display_name.body)}
			/>
			<div class={['info', 'v']}>
				<Input
					value={value.name}
					ref={input}
					onChange={() => {
						set({ name: input.current.value as string });
					}}
				/>
				<CardTip>
					<span>
						{tl(trans.styled_with_font, {
							f: (
								<>
									{' '}
									<span
										class='font-name-preview-mini'
										ref={preview}
									/>
								</>
							),
						})}
					</span>
					<a class='card-tip-link' onClick={modal}>
						{tl(trans.change_font)}
					</a>
				</CardTip>
			</div>
		</div>
	) as ProfileNameElement;

	function modal() {
		let name = value.name;
		let font = value.font;
		let style = value.style;
		const current_preview = createRef();

		dialog({
			id: 'profile_name',
			title: tl(trans.profile_font.name),
			body: (
				<>
					<div class='font-name-preview'>
						<span ref={current_preview} />
					</div>
					<div class='font-name-options'>
						<NameStyles
							value={font}
							values={convert_name_fonts(page.state.fonts)}
							onChange={(v: string) => {
								font = v;
								update_preview();
							}}
						/>
						<NameStyles
							value={style}
							values={convert_name_styles()}
							onChange={(v: string) => {
								style = v;
								update_preview();
							}}
						/>
					</div>
					<ModalFooter>
						<SeeMore
							iconPlacement='left'
							icon={icons.x}
							onClick={() => dialog_rm({ id: 'profile_name' })}
						>
							{tl(trans.cancel)}
						</SeeMore>
						<FooterFill />
						<ButtonGroup>
							<Button
								primary
								onClick={() => {
									set({
										name,
										font,
										style,
									});
									dialog_rm({ id: 'profile_name' });
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
			current_preview.current.textContent = name || auth.name;
			current_preview.current.setAttribute('data-font', font);
			current_preview.current.setAttribute('data-font-style', style);
		}

		update_preview();
	}

	function font_name(v: string) {
		return !font_empty(v) ? page.state.fonts[v] : tl(trans.none);
	}

	function font_empty(v: string) {
		return v == '' || v == 'none';
	}

	function update(v: Name) {
		value = v;

		input.current.value = value.name;

		preview.current.textContent = font_name(value.font);
		preview.current.setAttribute('data-font', value.font);
	}

	function set(v: Partial<Name>) {
		value = {
			...value,
			...v,
		};

		const name_match = markdown.match(name_regex);
		const font_match = markdown.match(font_regex);

		const new_name = `[name=${value.name}]`;
		const new_font = `[font=${value.font},${value.style}]`;

		if (value.name != '') {
			if (name_match) {
				markdown = markdown.replace(name_regex, new_name);
			} else {
				const trimmed = markdown.trimEnd();

				if (trimmed.length == 0) {
					markdown = new_name;
				} else {
					markdown = trimmed + '\n\n' + new_name;
				}
			}
		} else {
			if (name_match) {
				markdown = markdown.replace(name_regex, '');
			}
		}

		if (
			font_empty(value.font) &&
			(value.style == '' || value.style == 'solid')
		) {
			if (font_match) {
				markdown = markdown.replace(font_regex, '');
			}
		} else if (value.font != '' && value.style != '') {
			if (font_match) {
				markdown = markdown.replace(font_regex, new_font);
			} else {
				const trimmed = markdown.trimEnd();

				if (trimmed.length == 0) {
					markdown = new_font;
				} else {
					markdown = trimmed + '\n' + new_font;
				}
			}
		}

		onChange(markdown);

		update(value);
	}

	Object.defineProperty(elem, 'markdown', {
		set(v: string) {
			markdown = v;

			const name_match = markdown.match(name_regex);
			const font_match = markdown.match(font_regex);

			const fonts = (font_match?.[1] || '').split(',');

			update({
				name: name_match?.[1] || '',
				font: fonts[0] || '',
				style: fonts[1] || '',
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

	const name_match = markdown.match(name_regex);
	const font_match = markdown.match(font_regex);

	const fonts = (font_match?.[1] || '').split(',');

	update({
		name: name_match?.[1] || '',
		font: fonts[0] || '',
		style: fonts[1] || '',
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
