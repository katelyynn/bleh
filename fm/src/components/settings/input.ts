/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { html } from 'lighterhtml';
import { tl, trans } from '@/build/trans';
import { log } from '@/build/log.ts';
import tippy from 'tippy.js';
import { calendar } from '@/components/dialog/calendar';
import { auth } from '@/build/page';
import { icon as icon_elem } from '../shared/icon';

interface input {
	type?: string;
	value?: string | number;
	placeholder?: string;
	min?: number | string;
	max?: number | string;
	maxlength?: number;
	warn_if_empty?: boolean;
	warn_if_matches_auth?: boolean;
	warn_if_not_matching_lower?: string;
	focus?: boolean;
	disabled?: boolean;
	show_time?: boolean;
	name?: string;
	func?: Function;
	func_esc?: Function;
	func_select?: Function;
	func_mouseup?: Function;
	submit_on_character?: boolean;
	value_in_iso?: boolean;
	cols?: number;
	rows?: number;
	required?: boolean;
	hide_on_change?: boolean;
	icon?: string;
}

interface input_element extends HTMLElement {
	range: [start: number, end: number];
	value: string;
}

export function input({
	type = 'text',
	value,
	placeholder,
	min,
	max,
	maxlength,
	warn_if_empty = false,
	warn_if_matches_auth = false,
	warn_if_not_matching_lower = '',
	focus = false,
	disabled,
	show_time = true,
	name,
	func,
	func_esc,
	func_select,
	func_mouseup,
	submit_on_character = false,
	value_in_iso = false,
	cols,
	rows,
	required = false,
	hide_on_change,
	icon,
}: input) {
	if (type == 'date') {
		return calendar({
			value,
			min,
			max,
			disabled,
			show_time,
			name,
			value_in_iso,
			func,
			hide_on_change,
		}) as input_element;
	}

	let input_box: HTMLInputElement;
	// deno-lint-ignore prefer-const
	let error_tooltip: tippy.Instance;

	let colour_block: HTMLElement;

	const container = html.node`
        <div class="content-form input-container colourful ${
		type == 'textarea' ? 'textarea' : ''
	} ${icon ? 'input-has-icon' : ''}" data-type=${type} data-has-error="false">
            ${
		type == 'colour'
			? html.node`<span class="colour-block" ref=${(
				el,
			) => (colour_block = el)} />`
			: ''
	}
            ${
		type == 'textarea'
			? html.node`
                <textarea class="modern-input" name=${name} disabled=${disabled} autofocus=${focus} value=${value} placeholder=${placeholder} min=${min} max=${max} maxlength=${maxlength} cols=${cols} rows=${rows} required=${required} ref=${(
				el,
			) => (input_box = el)} />
            `
			: html.node`
                <input class="modern-input" name=${name} disabled=${disabled} autofocus=${focus} type=${type} value=${value} placeholder=${placeholder} min=${min} max=${max} maxlength=${maxlength} required=${required} ref=${(
				el,
			) => (input_box = el)} />
            `
	}
            ${
		icon
			? html.node`
                <div class="input-icons">
                    ${icon_elem({ name: icon })}
                </div>
            `
			: ''
	}
        </div>
    ` as input_element;

	if (focus) {
		setTimeout(() => {
			input_box.focus();
		}, 1);
	}

	error_tooltip = tippy(input_box, {
		theme: 'error',
		placement: 'top',
		trigger: 'manual',
	});
	error_tooltip.disable();

	update_input(true);
	input_box.addEventListener('input', () => {
		update_input();
	});

	input_box.addEventListener('keydown', (event) => {
		if (event.keyCode == 13 && type != 'textarea') {
			event.preventDefault();

			if (func) func(input_box.value);
		} else if (event.keyCode == 27) {
			event.preventDefault();

			if (func_esc) func_esc(input_box.value);
		} else if (submit_on_character) {
			setTimeout(() => {
				if (func) func(input_box.value);
			}, 1);
		}
	});

	input_box.addEventListener('paste', () => {
		if (func) func(input_box.value);
	});

	input_box.addEventListener('select', () => {
		if (func_select) func_select(input_box, input_box.value);
	});

	input_box.addEventListener('mouseup', () => {
		if (func_mouseup) func_mouseup(input_box, input_box.value);
	});

	input_box.addEventListener('blur', () => {
		if (func_mouseup) func_mouseup(input_box, input_box.value);
	});

	Object.defineProperty(container, 'editor', {
		get() {
			return input_box;
		},
	});

	container.submit = () => {
		if (func) func(input_box.value);
	};

	container.focus = () => {
		setTimeout(() => {
			input_box.focus();
		}, 5);
	};

	Object.defineProperty(container, 'value', {
		get() {
			return input_box.value;
		},
		set(val: string | number) {
			input_box.value = val;
			update_input();
		},
	});

	container.disabled = (state = null) => {
		if (state === null) return input_box.getAttribute('disabled') || false;

		if (state === true) input_box.setAttribute('disabled', 'true');
		else input_box.removeAttribute('disabled');

		return state;
	};

	Object.defineProperty(container, 'range', {
		set([start, end]: [start: number, end: number]) {
			input_box.setSelectionRange(start, end);
		},
	});

	return container;

	function update_input(skip_most = false) {
		container.setAttribute('data-has-error', 'false');
		error_tooltip.disable();

		if (type != 'number' && !skip_most) {
			if (input_box.value == '' && warn_if_empty) {
				error_input(tl(trans.this_field_is_required));
			} else if (maxlength && input_box.value.length > maxlength) {
				error_input(tl(trans.keep_within_the_range));
			} else if (warn_if_matches_auth && input_box.value == auth.name) {
				error_input(tl(trans.please_dont_clone_yourself));
			} else if (
				warn_if_not_matching_lower != '' &&
				input_box.value.toLowerCase() != warn_if_not_matching_lower
			) {
				error_input(tl(trans.please_match_the_format));
			}
		}

		if (type == 'number' && !skip_most) {
			// is a number?
			if (input_box.value == '') {
				error_input(tl(trans.only_numbers_are_allowed));
			} else if (
				parseInt(input_box.value) > max ||
				parseInt(input_box.value) < min
			) {
				error_input(tl(trans.keep_within_the_range));
			}
		} else if (type == 'colour') {
			if (!input_box.value.startsWith('#')) {
				input_box.value = `#${input_box.value}`;
			}

			colour_block.style.backgroundColor = input_box.value;
		}

		if (func && !skip_most && submit_on_character) func(input_box.value);
	}

	function error_input(reason) {
		log(reason, 'input', 'log');
		container.setAttribute('data-has-error', 'true');
		error_tooltip.setContent(reason);
		error_tooltip.enable();
		error_tooltip.show();
	}
}
