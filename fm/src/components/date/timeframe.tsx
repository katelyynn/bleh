/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { tl, trans } from '@/build/trans';
import { html, render } from 'lighterhtml';
import tippy from 'tippy.js';
import { setting } from '../settings/settings';
import { settings } from '@/build/config';
import { input } from '../settings/input';
import { DateTime } from 'luxon';
import { pad2 } from '@/build/tools';
import { useSettings } from '@/page.ts';
import { Button } from '@/components/button/button.tsx';
import {
	FloatingWindow,
	FloatingWindowContents,
} from '@/components/menu/floating_window.tsx';
import { Tabbed } from '@/components/tab/tabbed.tsx';
import { icons } from '@/components/shared/icon.tsx';
import { createRef } from 'jsx-dom';

interface HybridTimeframePickerProps {
	ref?: ReturnType<typeof createRef>;
	value?: string;
	disallowed?: boolean;
	onChange?: (val: string) => void;
}

type HybridTimeframePickerElement = HTMLButtonElement & {
	disallowed: boolean;
};

export function HybridTimeframePicker({
	ref,
	value,
	disallowed = false,
	onChange,
}: HybridTimeframePickerProps) {
	if (!value) value = 'date_preset=LAST_7_DAYS';

	const modal = <FloatingWindow />;

	const elem = (
		<Button
			className='timeframe-picker-button'
			opens={modal}
			ref={ref}
		/>
	) as HybridTimeframePickerElement;

	function update() {
		elem.setAttribute('disabled', String(disallowed));

		elem.replaceChildren(
			<>
				{timeframe_text(value!)}
			</>,
		);
	}

	function set(v: string, bubble = true) {
		value = v;

		if (onChange && bubble) onChange(value);

		modal.replaceChildren(
			<FloatingWindowContents>
				<Tabbed
					page={useSettings.get('date_selector') as string}
					pages={{
						presets: {
							icon: icons.calendar,
							label: tl(trans.presets),
							content: () => <PresetPage />,
						},
					}}
				/>
			</FloatingWindowContents>,
		);

		update();
	}

	function PresetPage() {
		const buttons: TimeframePresetElement[] = [];

		const years = Array.from({
			length: new Date().getFullYear() - 2002,
		}, (_, i) => 2003 + i).reverse();

		const elem = (
			<>
				<div class='date-range-picker-presets-wrap'>
					<ul class={['date-range-picker-presets']}>
						<TimeframePreset
							type='date_preset=LAST_7_DAYS'
							append={buttons}
							onChange={set_preset}
						/>
						<TimeframePreset
							type='date_preset=LAST_30_DAYS'
							append={buttons}
							onChange={set_preset}
						/>
						<TimeframePreset
							type='date_preset=LAST_90_DAYS'
							append={buttons}
							onChange={set_preset}
						/>
					</ul>
					<ul
						class={[
							'date-range-picker-presets',
							'date-range-picker-presets--col-2',
						]}
					>
						<TimeframePreset
							type='date_preset=LAST_180_DAYS'
							append={buttons}
							onChange={set_preset}
						/>
						<TimeframePreset
							type='date_preset=LAST_365_DAYS'
							append={buttons}
							onChange={set_preset}
						/>
						<TimeframePreset
							type='date_preset=ALL'
							append={buttons}
							onChange={set_preset}
						/>
					</ul>
				</div>
				<div class='date-range-picker-years'>
					{years.map((year) => (
						<TimeframePreset
							type={`from=${year}-01-01&rangetype=year`}
							append={buttons}
							onChange={set_preset}
						/>
					))}
				</div>
			</>
		);

		function update_presets() {
			buttons.forEach((button) => {
				button.active = value == button.type;
			});
		}

		function set_preset(v: string) {
			set(v);
			update_presets();
		}

		update_presets();

		return elem;
	}

	set(value, false);

	Object.defineProperty(elem, 'value', {
		get() {
			return value;
		},
		set(v: string) {
			set(v);
		},
	});

	Object.defineProperty(elem, 'disallowed', {
		get() {
			return disallowed;
		},
		set(v: boolean) {
			disallowed = v;
			update();
		},
	});

	return elem;
}

interface TimeframePresetProps {
	type: string;
	active?: boolean;
	append?: TimeframePresetElement[];
	onChange?: (v: string) => void;
}

type TimeframePresetElement = HTMLButtonElement & {
	type: string;
	active: boolean;
};

function TimeframePreset({
	type,
	active,
	append,
	onChange,
}: TimeframePresetProps) {
	const elem = (
		<li class='date-range-picker-preset'>
			<Button
				className='date-picker-preset-item'
				onClick={() => onChange?.(type)}
			>
				{timeframe_text(type)}
			</Button>
		</li>
	) as TimeframePresetElement;

	function update() {
		elem.classList.toggle('date-range-picker-preset--selected', active);
	}

	update();

	Object.defineProperty(elem, 'type', {
		get() {
			return type;
		},
	});

	Object.defineProperty(elem, 'active', {
		get() {
			return active;
		},
		set(v: boolean) {
			active = v;
			update();
		},
	});

	if (append) {
		append.push(elem);
	}

	return elem;
}

interface hybrid_timeframe_picker {
	initial?: string;
	func?: (val: string) => void;
}

export function hybrid_timeframe_picker({
	initial,
	func,
}: hybrid_timeframe_picker) {
	let value = 'date_preset=LAST_7_DAYS';
	if (initial) value = initial;

	let disabled = false;

	const elem = html.node`
        <button class="select-button timeframe-picker-button" type="button">
            ${timeframe_text(value)}
        </button>
    `;

	let menu = tippy(elem, {
		theme: 'window',
		content: html.node``,
		placement: 'bottom',
		interactive: true,
		interactiveBorder: 10,
		trigger: 'click',
		appendTo: document.body,

		onShow() {
			set_value(value, true, false);
		},
		hideOnClick: 'toggle',

		onClickOutside(instance, event) {
			if (
				instance.popper.querySelector('[aria-expanded="true"]') ||
				event.target.classList.contains('dropdown-menu-clickable-item')
			) {
				return;
			}

			instance.hide();
		},
	});

	Object.defineProperty(elem, 'value', {
		get() {
			return value;
		},
		set(val: string) {
			set_value(val);
		},
	});

	Object.defineProperty(elem, 'disabled', {
		get() {
			return disabled;
		},
		set(val: boolean) {
			disabled = val;

			elem.removeAttribute('disabled');
			if (val) elem.setAttribute('disabled', '');
		},
	});

	let content;
	let alert;

	let time_from;
	let time_to;

	let timeframe_valid = true;
	let timeframe_invalid_reason = '';

	function update_alert() {
		if (timeframe_valid) {
			alert.setAttribute('data-hidden', 'true');
		} else {
			alert.setAttribute('data-hidden', 'false');
			alert.textContent = timeframe_invalid_reason;
		}
	}

	function set_value(val: string, update = true, bubble = true) {
		value = val;
		elem.textContent = timeframe_text(val);

		if (update) {
			menu.setContent(html.node`
                <div class="timeframe-menu">
                    ${
				setting({
					id: 'date_selector',
					func: (val: string) => render_page(val),
				})
			}
                    <div class="timeframe-menu-content" ref=${(el) =>
				content = el} />
                    <div class="alert alert-error timeframe-error" data-hidden="true" ref=${(
				el,
			) => alert = el} />
                </div>
            `);

			render_page(useSettings.get('date_selector') as string);
		}

		if (bubble) {
			console.info('now set value', time_from, time_to);

			if (func) func(val);

			update_alert();
		}
	}

	function render_page(page: string) {
		if (!['preset', 'custom'].includes(page)) page = 'preset';

		if (page == 'preset') {
			const years = Array.from({
				length: new Date().getFullYear() - 2002,
			}, (_, i) => 2003 + i).reverse();

			render(
				content,
				html`
					<div class="date-range-picker-presets-wrap">
						<ul class="date-range-picker-presets">
					        ${render_timeframe_preset(
						'date_preset=LAST_7_DAYS',
					)}
					        ${render_timeframe_preset(
						'date_preset=LAST_30_DAYS',
					)}
					        ${render_timeframe_preset(
						'date_preset=LAST_90_DAYS',
					)}
					    </ul>
						<ul class="date-range-picker-presets date-range-picker-presets--col-2">
					        ${render_timeframe_preset(
						'date_preset=LAST_180_DAYS',
					)}
					        ${render_timeframe_preset(
						'date_preset=LAST_365_DAYS',
					)}
					        ${render_timeframe_preset('date_preset=ALL')}
					    </ul>
					</div>
					<div class="date-range-picker-years">
					    ${years.map((year: number) =>
						render_timeframe_preset(
							`from=${year}-01-01&rangetype=year`,
						)
					)}
					</div>
				`,
			);
			return;
		}

		if (page == 'custom') {
			const now = new Date();
			const date = date_to_iso(now);

			let from;
			let to;

			console.info('timeframe text - now', now, date, time_from, time_to);

			render(
				content,
				html`
					<div class="timeframe-picker-custom">
						<div class="timeframe-picker-item">
					        <label class="timeframe-picker-label">From</label>
					        ${from = input({
						type: 'date',
						min: '2003-01-01',
						max: date,
						value: time_from || date,
						show_time: false,
						func: (val: string) => {
							time_from = val;
							console.info('timeframe from', time_from);
							check_timeframe_valid();
							update_range();
						},
						hide_on_change: true,
					})}
					    </div>
						<div class="timeframe-picker-item">
					        <label class="timeframe-picker-label">To</label>
					        ${to = input({
						type: 'date',
						min: '2003-01-01',
						max: date,
						value: time_to || date,
						show_time: false,
						func: (val: string) => {
							time_to = val;
							console.info('timeframe to', time_to);
							check_timeframe_valid();
							update_range();
						},
						hide_on_change: true,
					})}
					    </div>
					</div>
				`,
			);

			if (!time_from) time_from = date_to_iso(from.value);
			if (!time_to) time_to = date_to_iso(to.value);

			function check_timeframe_valid() {
				timeframe_valid = true;

				if (new Date(time_from) > new Date(time_to)) {
					timeframe_valid = false;

					timeframe_invalid_reason = 'Invalid timeframe';
				}

				update_alert();
			}

			function update_range() {
				if (!timeframe_valid) return;

				console.info('timeframe update range', time_from, time_to);

				setTimeout(() => {
					set_value(`from=${time_from}&to=${time_to}`);
				}, 0);
			}

			return;
		}

		render(content, html``);
	}

	function render_timeframe_preset(type: string) {
		const current = type == value;

		return html.node`
            <li class="date-range-picker-preset ${
			current ? 'date-range-picker-preset--selected' : ''
		}">
                <button class="btn date-picker-preset-item" onclick=${() => {
			alert.setAttribute('data-hidden', 'true');
			timeframe_valid = true;

			set_value(type);
		}}>${timeframe_text(type)}</button>
            </li>
        `;
	}

	return elem;
}

export function timeframe_text(value: string) {
	if (value.startsWith('date_preset=')) {
		if (value == 'date_preset=ALL') return tl(trans.all_time);

		return tl(trans.last_count_days, { c: value.match(/\d+/)[0] });
	} else if (value.startsWith('from=')) {
		if (value.endsWith('rangetype=year')) {
			return value.match(/\d{4}/)[0];
		}

		const params = new URLSearchParams(value);
		const from = params.get('from');
		const to = params.get('to');

		console.info('timeframe text', value, params, from, to);

		return `${DateTime.fromISO(from).toLocaleString(DateTime.DATE_MED)} - ${
			DateTime.fromISO(to).toLocaleString(DateTime.DATE_MED)
		}`;
	}
}

function date_to_iso(date: Date) {
	return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${
		pad2(date.getDate())
	}`;
}
