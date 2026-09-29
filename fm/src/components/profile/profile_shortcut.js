/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { html } from 'lighterhtml';
import { root } from '@/build/page';
import { tl, trans } from '@/build/trans';
import { dialog, dialog_rm } from '@/components/dialog/dialog';
import tippy from 'tippy.js';

/**
 * @deprecated needs replacing
 */
export function other_listener(id) {
	let input;
	let submit;

	dialog({
		id: 'other_listener',
		title: tl(trans.view_others_library),
		body: html.node`
        <div class="setting standalone" data-type="text">
            <div class="avatar-container">
                <div class="avatar-inner">
                    <img class="missing-avatar">
                </div>
            </div>
            <div class="input-container content-form">
                <input type="text" maxlength="40" id="text-profile" ref=${(
			el,
		) => (input = el)} placeholder="${tl(trans.enter_username)}">
                <button class="btn chibi icon primary submit" ref=${(
			el,
		) => (submit = el)} onclick=${() => {
			let name = input.value;
			let link = id;

			dialog_rm({
				id: 'other_listener',
			});
			window.location.href = `${root}user/${name}/library/music/${link}`;
		}}>${tl(trans.done)}</button>
            </div>
        </div>
        `,
	});

	input.addEventListener('keydown', (event) => {
		if (event.keyCode === 13) {
			event.preventDefault();
			submit.click();
		}
	});

	tippy(submit, {
		content: tl(trans.save),
	});

	input.focus();
}
