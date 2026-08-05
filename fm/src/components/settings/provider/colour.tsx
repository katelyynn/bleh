/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { SettingGroup } from '@/components/settings/group.tsx';
import { createRef, ReactElement, ReactNode } from 'jsx-dom';
import { SettingLabel } from '@/components/settings/provider/main.tsx';
import { tl, trans } from '@/build/trans.ts';
import { dark_themes, light_themes, theme, themes } from '@/build/theme.ts';
import { avatar } from '@/components/shared/avatar.tsx';
import { auth } from '@/build/page.ts';
import { Icon } from '@/components/shared/icon.tsx';
import { SettingCheckbox } from '@/components/settings/provider/checkbox.tsx';
import { match } from '@/components/settings/dynamic_theming.js';
import {
	theme_min,
	theme_schedule_dialog,
} from '@/components/dialog/theme_schedule.tsx';
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
	if (season?.id) seasonal = seasonal_colours[season.id];

	seasonal.forEach((col) => {
		col.seasonal = true;
	});

	const custom_swatches: colour[] = [
		default_colour,
		avatar_colour,
		...seasonal,
	];

	const recent_swatches_start: colour[] = [
		{
			type: 'customise',
			label: trans.edit,
		},
	];

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
			{ length: Math.max(0, 10 - 1 - recents.length) },
			() => ({ type: 'placeholder' }),
		),
	];

	const info = createRef();

	const wrap = <SettingGroup ref={ref} /> as SettingColourElement;

	function update() {
		list = [];
		wrap.replaceChildren(
			<>
				<div class='setting' data-type='action'>
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
										key={i}
										onChange={set}
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
										key={i}
										onChange={set}
									/>
								) as ColourSwatchElement;

								list.push(elem);

								return elem;
							})}
						</SwatchGroup>
					</div>
				</div>
				<div class='setting' data-type='action'>
					<SettingLabel name={tl(trans.custom)} />
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
							{recent_swatches_start.map((col, i) => {
								const elem = (
									<ColourSwatch
										colour={col}
										key={i}
										onChange={set}
									/>
								) as ColourSwatchElement;

								list.push(elem);

								return elem;
							})}
						</SwatchGroup>
						<SwatchSeparator />
						<SwatchGroup>
							{recent_swatches.map((col, i) => {
								const elem = (
									<ColourSwatch
										colour={col}
										key={i}
										onChange={set}
									/>
								) as ColourSwatchElement;

								list.push(elem);

								return elem;
							})}
						</SwatchGroup>
					</div>
				</div>
			</>,
		);
		set(colour);
	}

	update();

	wrap.update = update;

	return wrap;

	function set(value: colour) {
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
		list.forEach((entry) => {
			entry.active = is_active(entry.colour, colour);
		});

		if (onChange) onChange(colour);
	}
}

function is_active(entry: colour, colour: colour_response) {
	if (colour.type == 'placeholder') return false;

	if (colour.type == 'colour') {
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
		(colour.type == 'colour' && !colour.label) || colour.type == 'customise'
	) {
		const preview = (
			<div
				class='colour-preview colourful'
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
				if (colour.type == 'placeholder') return;

				active = true;

				if (onChange) onChange(colour);

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
