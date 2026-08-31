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
import { Icon, icons, SaveIcon } from '@/components/shared/icon.tsx';
import { SettingInput } from '@/components/settings/provider/input.tsx';
import { SettingLabel } from '@/components/settings/provider/main.tsx';
import { Input } from '@/components/input/input.tsx';
import { createRef } from 'jsx-dom';
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

interface ProfileAccentProps {
	ref?: ReturnType<typeof createRef<ProfileAccentElement>>;
	markdown: string;
	onChange: (v: string) => void;
}

interface Accent {
	hue: number;
	sat: number;
	lit: number;
}

type ProfileAccentElement = HTMLDivElement & {
	markdown: string;
	value: Accent;
};

export function ProfileAccent({
	ref,
	markdown,
	onChange,
}: ProfileAccentProps) {
	const accent_regex =
		/\[accent=([0-9]{1,3}),([0-9]*\.?[0-9]+),([0-9]*\.?[0-9]+)\]/;

	let value: Accent = { hue: 0, sat: 0, lit: 0 };

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
					<Button onClick={modal}>
						<Icon name={icons.edit} />
						{tl(trans.edit)}
					</Button>
				</div>
			</div>
		</div>
	) as ProfileAccentElement;

	function modal() {
		const convert = createRef();
		const hue = createRef();
		const sat = createRef();
		const lit = createRef();
		const current_preview = createRef();

		dialog({
			id: 'profile_accent',
			title: tl(trans.profile_accent.name),
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
							onClick={() => dialog_rm({ id: 'profile_accent' })}
						>
							{tl(trans.cancel)}
						</SeeMore>
						<FooterFill />
						<ButtonGroup>
							<Button
								primary
								onClick={() => {
									set({
										hue: hue.current.value,
										sat: sat.current.value,
										lit: lit.current.value,
									});
									dialog_rm({ id: 'profile_accent' });
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

	function update(v: Accent) {
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

	function set(v: Accent) {
		value = v;

		const match = markdown.match(accent_regex);

		const new_accent = `[accent=${v.hue},${v.sat},${v.lit}]`;

		if (match) {
			onChange(markdown.replace(accent_regex, new_accent));
		} else {
			const trimmed = markdown.trimEnd();

			if (trimmed.length == 0) {
				onChange(new_accent);
			} else {
				onChange(trimmed + '\n\n' + new_accent);
			}
		}

		update(v);
	}

	Object.defineProperty(elem, 'markdown', {
		set(v: string) {
			markdown = v;

			const match = markdown.match(accent_regex);

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
		set(v: Accent) {
			set(v);
		},
	});

	const match = markdown.match(accent_regex);

	update({
		hue: Number(match?.[1] || undefined),
		sat: Number(match?.[2] || undefined),
		lit: Number(match?.[3] || undefined),
	});

	return elem;
}
