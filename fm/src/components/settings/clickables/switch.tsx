/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { createRef } from 'jsx-dom';

interface SwitchProps {
	ref?: ReturnType<typeof createRef<HTMLDivElement>>;
	name?: string;
	className?: string;
	interact?: boolean;
	checked?: boolean;
}

export function Switch({
	ref,
	name,
	className,
	interact = true,
	checked = false,
}: SwitchProps) {
	const checkbox = createRef();
	const elem = createRef();

	function update() {
		checkbox.current.checked = checked;
		elem.current.setAttribute('aria-checked', checked);
	}

	const wrap = (
		<div class={['toggle-wrap', className && className]} ref={ref}>
			<input type='checkbox' name={name} ref={checkbox} />
			<button
				type='button'
				class={[
					'btn',
					'toggle',
					'colourful',
					!interact && 'no-interact',
				]}
				ref={elem}
				onClick={() => {
					if (!interact) return;

					checked = !checked;
					update();
				}}
			>
				<div class='dot' />
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
