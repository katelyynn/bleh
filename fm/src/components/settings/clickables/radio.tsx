/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { createRef } from 'jsx-dom';

type RadioElement = HTMLDivElement & {
	checked: boolean;
};

interface RadioProps {
	ref?: ReturnType<typeof createRef<HTMLDivElement>>;
	name?: string;
	value?: string;
	className?: string;
	interact?: boolean;
	checked?: boolean;
}

export function Radio({
	ref,
	name,
	value,
	className,
	interact = true,
	checked = false,
}: RadioProps) {
	const radio = createRef();
	const elem = createRef();

	function update() {
		radio.current.checked = checked;
		elem.current.setAttribute('aria-checked', checked);
	}

	const wrap = (
		<div class={['radio-cont', className && className]} ref={ref}>
			<input type='radio' name={name} value={value} ref={radio} />
			<button
				type='button'
				class={['btn', 'radio', !interact && 'no-interact']}
				ref={elem}
				onClick={() => {
					if (!interact) {
						return;
					}

					checked = !checked;
					update();
				}}
			/>
		</div>
	) as RadioElement;

	update();

	Object.defineProperty(wrap, 'checked', {
		get() {
			return checked;
		},
		set(val: boolean) {
			checked = val;
			update();
		},
	});

	return wrap;
}
