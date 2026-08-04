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
	colour_type,
	colours,
	default_colour,
} from '@/components/settings/swatch.ts';

interface SettingColourProps {
	colour: colour_response;
	onChange?: (val: colour_response) => void;
}

interface colour_response {
	hue: number;
	sat: number;
	lit: number;
	type: colour_type;
}

export function SettingColour({
	colour,
	onChange,
}: SettingColourProps) {
	const list: ColourSwatchElement[] = [];

	const wrap = (
		<div class='setting' data-type='action'>
			<SettingLabel name={tl(trans.hue)} />
			<div class={['info', 'swatch-info']}>
				<SwatchGroup>
					{() => {
						const elem = (
							<ColourSwatch
								colour={default_colour}
								onChange={set}
							/>
						) as ColourSwatchElement;

						list.push(elem);

						return elem;
					}}
					{() => {
						const elem = (
							<ColourSwatch
								colour={avatar_colour}
								onChange={set}
							/>
						) as ColourSwatchElement;

						list.push(elem);

						return elem;
					}}
					{() => {
						const elem = (
							<ColourSwatch
								colour={{
									type: 'customise',
									label: trans.edit,
								}}
							/>
						) as ColourSwatchElement;

						list.push(elem);

						return elem;
					}}
				</SwatchGroup>
				<SwatchSeparator />
				<SwatchGroup>
					{colours.map((col, i) => {
						const elem = (
							<ColourSwatch colour={col} key={i} onChange={set} />
						) as ColourSwatchElement;

						list.push(elem);

						return elem;
					})}
				</SwatchGroup>
			</div>
		</div>
	);

	function update() {
		list.forEach((entry) => {
			entry.active = is_active(entry.colour, colour);
		});
	}

	update();

	return wrap;

	function set({ value }: { value: colour }) {
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

		update();

		if (onChange) onChange(colour);
	}
}

function is_active(entry: colour, colour: colour_response) {
	if (entry.type != colour.type) return false;

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
	const swatch = (
		<button
			type='button'
			class={['btn', 'swatch-container']}
			onClick={() => {
				active = true;

				if (onChange) onChange(colour);

				update();
			}}
		>
			<div
				class={['swatch', 'colourful']}
				data-swatch-type={colour.type}
			/>
			<div class='swatch-inner'>
				<strong class={['swatch-name', 'colourful']}>
					{tl(colour.label)}
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
		swatch.setAttribute('aria-selected', String(active));
	}

	update();

	return swatch;
}
