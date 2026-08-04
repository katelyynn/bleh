/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { createRef } from 'jsx-dom';

interface CheckboxProps {
	interact?: boolean;
	checked?: boolean;
}

export function Checkbox({
	interact = true,
	checked = false,
}: CheckboxProps) {
	const checkbox = createRef();
	const elem = createRef();

	function update() {
		checkbox.current.checked = checked;
		elem.current.setAttribute('aria-checked', checked);
	}

	const wrap = (
		<div class='checkbox-wrap'>
			<input type='checkbox' ref={checkbox} />
			<button
				type='button'
				class={['btn', 'checkbox', !interact && 'no-interact']}
				ref={elem}
				onClick={() => {
					if (!interact) return;

					checked = !checked;
					update();
				}}
			>
				<div class='bleh-icon' />
			</button>
		</div>
	);

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
