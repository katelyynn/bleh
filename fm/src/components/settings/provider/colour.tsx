/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { SettingGroup } from '@/components/settings/group.tsx';
import { createRef, ReactNode } from 'jsx-dom';
import { SettingLabel } from '@/components/settings/provider/main.tsx';
import { tl, trans } from '@/build/trans.ts';
import { Icon } from '@/components/shared/icon.tsx';
import {
	avatar_colour,
	colour,
	colour_set,
	colour_type,
	colours,
	default_colour,
	seasonal_colours,
} from '@/components/settings/swatch.ts';
import { season } from '@/components/seasonal.ts';
import { formatHex } from 'culori';
import namer from 'color-namer';
import { SettingRange } from '@/components/settings/provider/range.tsx';
import { SettingInput } from '@/components/settings/provider/input.tsx';
import { clamp_lit, clamp_sat, hex_to_oklch } from '@/build/tools.ts';
import { page } from '@/build/page.ts';

interface SettingColourProps {
	ref?: ReturnType<typeof createRef<HTMLDivElement>>;
	colour: colour_response;
	recents?: colour_set[];
	season?: season;
	onChange?: (val: colour_response) => void;
}

interface colour_response {
	hue: number;
	sat: number;
	lit: number;
	type: colour_type;
}

type SettingColourElement = HTMLDivElement & {
	update: () => void;
};

export function SettingColour({
	ref,
	colour,
	recents = [],
	season,
	onChange,
}: SettingColourProps) {
	let list: ColourSwatchElement[] = [];

	let seasonal: colour[] = [];
	if (season?.id && seasonal_colours[season.id]) {
		seasonal = seasonal_colours[season.id];

		seasonal.forEach((col) => {
			col.seasonal = season.id;
		});
	}

	let custom_swatches: colour[] = [];

	const recent_swatches: colour[] = [
		...recents.map((recent) => ({
			type: 'colour',
			sets: {
				hue: recent.hue,
				sat: recent.sat,
				lit: recent.lit,
			},
		})),
		...Array.from(
			{ length: Math.max(0, 5 - 1 - recents.length) },
			() => ({ type: 'placeholder' }),
		),
	];

	const info = createRef();
	const presets = createRef();

	const convert = createRef();
	const hue = createRef();
	const sat = createRef();
	const lit = createRef();

	const wrap = (
		<SettingGroup ref={ref}>
			<div class='setting' data-type='action' ref={presets} />
			<SettingInput
				name={tl(trans.convert_from_hex)}
				type='colour'
				length={7}
				saveText={tl(trans.convert)}
				onChange={(val: string) => {
					const hsl = hex_to_oklch(val);

					const clamped_sat = clamp_sat((hsl.s / 100) * 3);

					hue.current.value = hsl.h;
					sat.current.value = clamped_sat;
					lit.current.value = clamp_lit(
						clamped_sat,
						hsl.l / 100 + 0.35,
					);

					set({
						type: 'customise',
						sets: {
							hue: hue.current.value,
							sat: sat.current.value,
							lit: lit.current.value,
						},
					});
					update(false);
				}}
				ref={convert}
			/>
			<SettingRange
				bind='hue'
				ref={hue}
				onChange={(val: number) => {
					set({
						type: 'customise',
						sets: {
							hue: val,
							sat: colour.sat,
							lit: colour.lit,
						},
					});
					update(false);
				}}
			/>
			<SettingRange
				bind='sat'
				ref={sat}
				onChange={(val: number) => {
					set({
						type: 'customise',
						sets: {
							hue: colour.hue,
							sat: val,
							lit: colour.lit,
						},
					});
					update(false);
				}}
			/>
			<SettingRange
				bind='lit'
				ref={lit}
				onChange={(val: number) => {
					set({
						type: 'customise',
						sets: {
							hue: colour.hue,
							sat: colour.sat,
							lit: val,
						},
					});
					update(false);
				}}
			/>
		</SettingGroup>
	) as SettingColourElement;

	function update(set_after = true) {
		console.info('re-rendering');
		list = [];

		custom_swatches = [
			default_colour,
			avatar_colour,
			{
				type: 'placeholder',
				sets: {
					hue: colour.hue,
					sat: colour.sat,
					lit: colour.lit,
				},
			},
			...seasonal,
		];

		presets.current.replaceChildren(
			<>
				<SettingLabel name={tl(trans.presets)} />
				<div
					class={['info', 'swatch-info']}
					ref={info}
					onMouseEnter={() => {
						info.current.classList.add('has-hover');
					}}
					onMouseLeave={() => {
						info.current.classList.remove('has-hover');
					}}
				>
					<SwatchGroup>
						{custom_swatches.map((col, i) => {
							const elem = (
								<ColourSwatch
									colour={col}
									active={is_active(col, colour)}
									key={i}
									onChange={(val: colour) => {
										set(val);
										hue.current.value = val.sets?.hue;
										sat.current.value = val.sets?.sat;
										lit.current.value = val.sets?.lit;
									}}
								/>
							) as ColourSwatchElement;

							list.push(elem);

							return elem;
						})}
					</SwatchGroup>
					<SwatchSeparator />
					<SwatchGroup>
						{colours.map((col, i) => {
							const elem = (
								<ColourSwatch
									colour={col}
									active={is_active(col, colour)}
									key={i}
									onChange={(val: colour) => {
										set(val);
										hue.current.value = val.sets?.hue;
										sat.current.value = val.sets?.sat;
										lit.current.value = val.sets?.lit;
									}}
								/>
							) as ColourSwatchElement;

							list.push(elem);

							return elem;
						})}
					</SwatchGroup>
				</div>
			</>,
		);

		const preview = page.state.colour_preview;
		const bg_colour = window.getComputedStyle(preview).backgroundColor;

		const final = formatHex(bg_colour);
		convert.current.value = final;
	}

	update();

	wrap.update = update;

	return wrap;

	function set(value: colour) {
		if (!value.sets) return;

		value.sets.hue = Number(value.sets.hue);
		value.sets.sat = Number(value.sets.sat);
		value.sets.lit = Number(value.sets.lit);

		console.info('setting colour to', value);
		if (value.type == 'customise') {
			colour = {
				...colour,
				type: 'customise',
			};

			if (value.sets) {
				colour.hue = value.sets.hue;
				colour.sat = value.sets.sat;
				colour.lit = value.sets.lit;
			}
		} else {
			if (!value.sets) return;

			colour = {
				...colour,
				type: value.type || 'colour',
				hue: value.sets.hue,
				sat: value.sets.sat,
				lit: value.sets.lit,
			};
		}

		if (
			colour.type == 'avatar' &&
			colour.hue != avatar_colour.sets?.hue &&
			colour.sat != avatar_colour.sets?.sat &&
			colour.lit != avatar_colour.sets?.lit
		) {
			colour.type = 'customise';
		}

		console.info('info', colour.type);
		console.info('setting colour to: found colour');
		list.forEach((entry) => {
			entry.active = is_active(entry.colour, colour);
		});

		if (onChange) onChange(colour);
	}
}

function is_active(
	entry: colour,
	colour: colour_response,
) {
	if (entry.type == 'placeholder' && colour.type != 'customise') return false;

	if (colour.type == 'season') {
		if (!entry.sets || entry.type != 'season') return false;

		return entry.sets.hue == colour.hue && entry.sets.sat == colour.sat &&
			entry.sets.lit == colour.lit;
	} else if (colour.type == 'colour' || entry.type == 'placeholder') {
		if (!entry.sets) return false;

		return entry.sets.hue == colour.hue && entry.sets.sat == colour.sat &&
			entry.sets.lit == colour.lit;
	} else {
		return entry.type == colour.type;
	}
}

interface SwatchGroupProps {
	children: ReactNode;
}

function SwatchGroup({
	children,
}: SwatchGroupProps) {
	return (
		<div class={['swatch-group', 'palette']}>
			{children}
		</div>
	);
}

function SwatchSeparator() {
	return <div class={['sep', 'swatch-sep']} />;
}

interface ColourSwatchProps {
	colour: colour;
	active?: boolean;
	onChange?: (val: colour) => void;
}

type ColourSwatchElement = ReactNode & HTMLButtonElement & {
	colour: colour;
	active: boolean;
};

export function ColourSwatch({
	colour,
	active,
	onChange,
}: ColourSwatchProps) {
	if (!colour.type) colour.type = 'colour';

	const displays = colour.displays || colour.sets;

	if (
		(['colour', 'placeholder'].includes(colour.type) && !colour.label) ||
		colour.type == 'customise'
	) {
		const preview = (
			<div
				class='colour-preview colourful'
				data-bleh--theme='oled'
				data-bleh--theme_type='dark'
				style={displays &&
					{
						'--hue-over': displays.hue,
						'--sat-over': displays.sat,
						'--lit-over': displays.lit,
					}}
			/>
		);

		document.body.appendChild(preview);

		const bg_colour = window.getComputedStyle(preview).backgroundColor;

		const final = formatHex(bg_colour);

		const labelled = namer(final);
		colour.label = labelled.pantone[0].name;
	}

	const swatch = (
		<button
			type='button'
			class={['swatch-container']}
			onClick={() => {
				active = !active;

				if (onChange) {
					onChange({
						...colour,
						type: colour.type == 'placeholder'
							? 'customise'
							: colour.type,
					});
				}

				update();
			}}
		>
			<div
				class={['swatch', 'colourful']}
				data-swatch-type={colour.type}
				style={displays &&
					{
						'--hue-over': displays.hue,
						'--sat-over': displays.sat,
						'--lit-over': displays.lit,
					}}
			>
				<Icon mask={false} identifier='swatch' />
			</div>
			<div class='swatch-inner'>
				<strong
					class={['swatch-name', 'colourful']}
					style={displays &&
						{
							'--hue-over': displays.hue,
							'--sat-over': displays.sat,
							'--lit-over': displays.lit,
						}}
				>
					{colour.label && tl(colour.label)}
				</strong>
			</div>
		</button>
	) as ColourSwatchElement;

	Object.defineProperty(swatch, 'colour', {
		get() {
			return colour;
		},
	});

	Object.defineProperty(swatch, 'active', {
		get() {
			return active;
		},
		set(val: boolean) {
			active = val;
			update();
		},
	});

	function update() {
		swatch.setAttribute('aria-checked', String(active));
	}

	update();

	return swatch;
}
