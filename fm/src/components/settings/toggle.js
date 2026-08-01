//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { html } from 'lighterhtml';

export function toggle({
	value = false,
	type = 'toggle',
	name = '',
	title = '',
	body = '',
	small = '',
	disabled = false,
	data = '',
	func = null,
	standalone = true,
	id = '',
}) {
	let checkbox;
	let state;

	let elem = html.node`
        <div class="setting ${
		standalone ? 'standalone' : ''
	}" data-type=${type} onclick=${() => {
		if (disabled) return;

		let current = checkbox.checked;

		if (func) func(!current);

		checkbox.checked = !current;
		state.setAttribute('aria-checked', !current);
	}}>
            <div class="heading">
                <h5>${title}</h5>
                ${body != '' ? html.node`<p>${body}</p>` : ''}
                ${small != '' ? html.node`<small>${small}</small>` : ''}
            </div>
            ${
		type == 'toggle'
			? html.node`
            <div class="toggle-wrap">
                <input type="checkbox" ref=${(
				el,
			) => (checkbox = el)} id=${id} name=${name} />
                <button class="btn toggle" ref=${(
				el,
			) => (state = el)} aria-checked=${value} type="button">
                    <div class="dot" />
                </button>
            </div>
            `
			: html.node`
            <div class="check">
                <input type="checkbox" ref=${(
				el,
			) => (checkbox = el)} id=${id} name=${name} disabled=${disabled} />
                <div class="box" ref=${(
				el,
			) => (state = el)} aria-checked=${value} disabled=${disabled}>
                    <div class="bleh-icon" />
                </div>
            </div>
            `
	}
        </div>
    `;

	if (value) {
		checkbox.checked = value;
	}

	if (data) {
		checkbox.setAttribute('value', data);
	}

	elem.check = () => {
		if (disabled) return;

		if (func) func(true);

		checkbox.checked = true;
		state.setAttribute('aria-checked', true);
	};

	elem.uncheck = () => {
		if (disabled) return;

		if (func) func(false);

		checkbox.checked = false;
		state.setAttribute('aria-checked', false);
	};

	elem.checked = (val) => {
		if (val == null) return checkbox.checked;

		if (val) elem.check();
		else elem.uncheck();
	};

	elem.disabled = (state = null) => {
		if (state === null) return checkbox.getAttribute('disabled') || false;

		if (state === true) checkbox.setAttribute('disabled', 'true');
		else checkbox.removeAttribute('disabled');

		return state;
	};

	return elem;
}
