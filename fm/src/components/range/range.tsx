/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { createRef } from 'jsx-dom';

interface RangeProps {
	ref?: ReturnType<typeof createRef<HTMLDivElement>>;
	id?: string;
	className?: string;
	value?: number;
	suffix?: string;
	min?: number;
	max?: number;
	step?: number;
	onInput?: (val: number) => void;
	onChange?: (val: number) => void;
}

type RangeElement = HTMLDivElement & {
	value: number;
};

export function Range({
	ref,
	id,
	className,
	value = 0,
	suffix,
	min = 0,
	max = 1,
	step = 0.1,
	onInput,
	onChange,
}: RangeProps) {
	const range = createRef();

	const track = createRef();

	const marker = createRef();

	const working_max = max - min;

	const wrap = (
		<div class={['range', className && className]} ref={ref}>
			<div class={['track', 'colourful']} data-id={id} ref={track}>
				<div class='fill' />
				<div class='nub' />
			</div>
			<p class='value-marker' ref={marker} />
			<input
				type='range'
				min={min}
				max={max}
				step={step}
				ref={range}
				onInput={() => {
					set(range.current.value, true);
				}}
				onChange={() => {
					set(range.current.value, false);
				}}
			/>
		</div>
	) as RangeElement;

	Object.defineProperty(wrap, 'value', {
		get() {
			return value;
		},
		set(val: number) {
			set(val);
		},
	});

	function update() {
		range.current.value = value;
		marker.current.replaceChildren(
			<>
				{value}
				{suffix && <span class='suffix'>{suffix}</span>}
			</>,
		);

		track.current.style.setProperty(
			'--percent',
			`${((value - min) / working_max) * 100}%`,
		);
	}

	let last = 0;
	let timeout: number | undefined;

	function set(val: number, input?: boolean) {
		val = Number(val); // precaution for some reason

		value = val;
		update();

		if (input) {
			const now = performance.now();
			const remaining = 20 - (now - last);

			if (remaining <= 0) {
				clearTimeout(timeout);
				last = now;
				if (onInput) onInput(val);
			} else {
				clearTimeout(timeout);
				timeout = setTimeout(() => {
					last = performance.now();
					if (onInput) onInput(val);
				}, remaining);
			}

			if (now - last >= 500) {
				last = now;
				if (onInput) onInput(val);
			}
		} else {
			if (onChange) onChange(val);
		}
	}

	update();

	return wrap;
}
