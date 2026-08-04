/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { html } from 'lighterhtml';
import { log } from '@/build/log';
import { dialogs, page } from '@/build/page';
import { tl, trans } from '@/build/trans';
import { ReactElement } from 'jsx-dom';

export function load_dialogs() {
	const elem = (
		<div
			class='bleh-modals'
			onClick={() => {
				const latest = Object.keys(dialogs).at(-1);
				if (!latest) return;

				if (dialogs[latest].dismiss) {
					dialog_rm({ id: latest, modal_bg: true });
				}
			}}
		/>
	);

	document.body.appendChild(elem);
	page.structure.dialogs = elem;
}

type dialog = {
	id: string;
	title?: string;
	subtitle?: string;
	body: HTMLElement | ReactElement;
	dismiss?: boolean;
	type?: string;
	has_overlays?: boolean;
	replace?: boolean;
	replace_if_possible?: boolean;
	replace_id?: string;
	allow_scroll?: boolean;
	colourful?: boolean;
	colourful_bg?: boolean;
	handle_escape_manually?: boolean;
};

// Present a fullscreen dialog to the user
export function dialog({
	id = '',
	title,
	subtitle,
	body = html.node``,
	dismiss = true,
	type = '',
	has_overlays = true,
	replace = false,
	replace_if_possible = false,
	replace_id = '',
	allow_scroll = false,
	colourful = false,
	colourful_bg = false,
	handle_escape_manually = false,
}: dialog): HTMLElement {
	log(`creating ${id}`, 'window', 'info', {
		id: id,
		title: title,
		subtitle: subtitle,
		body: body,
		dismiss: dismiss,
		type: type,
		has_overlays: has_overlays,
		replace: replace,
		replace_id: replace_id,
		allow_scroll: allow_scroll,
		colourful: colourful,
		colourful_bg: colourful_bg,
		handle_escape_manually: handle_escape_manually,
	});

	if (replace && replace_if_possible) replace_if_possible = false;

	if (replace_if_possible && Object.keys(dialogs).length > 0) {
		replace = true;

		for (let dialog in dialogs) {
			replace_id = dialog;
			break;
		}
	}

	const modal = (
		<div
			class={[
				'bleh-modal',
				colourful && 'colourful',
				colourful_bg && 'colourful-bg',
			]}
			role='dialog'
			data-modal-id={id}
			data-modal-has-overlays={has_overlays}
			data-modal-type={type}
		/>
	);

	if (title) {
		modal.setAttribute('aria-labelledby', 'modal_title');
		modal.appendChild(
			<div class='bleh-modal-title' id='modal_title'>
				<h1>{title}</h1>
				{subtitle && <p class='bleh-modal-subtitle'>{subtitle}</p>}
			</div>,
		);
	}

	if (dismiss) {
		modal.appendChild(
			<button
				type='button'
				class='modal-close-button'
				onClick={() => dialog_rm({ id })}
			>
				{tl(trans.close)}
			</button>,
		);
	}

	if (dismiss && !handle_escape_manually) {
		document.addEventListener('keydown', (e) => {
			if (e.key == 'Escape') {
				dialog_rm({ id: id });
			}
		});
	}

	modal.appendChild(
		<div class='bleh-modal-body' data-allow-scroll={String(allow_scroll)}>
			{body}
		</div>,
	);

	dialogs[id] = {
		instance: modal,
		dismiss,
	};

	if (replace || (!replace && dialogs.hasOwnProperty(replace_id))) {
		log(`window set to replace ${replace_id}`, 'window');

		dialog_rm({ id: replace_id });
	}

	page.structure.dialogs.appendChild(modal);
	page.structure.dialogs.classList.add('has-dialog');

	return modal;
}

export function dialog_rm({
	id = '',
	all = false,
	modal_bg = false,
}) {
	// prevents clicks inside modal being broken
	if (modal_bg) {
		// @ts-ignore
		if (event.target.classList[0] != 'bleh-modals') return;
	}

	if (all) {
		log('requested kill all', 'window', 'info', { dialogs });

		for (let dialog in dialogs) {
			dialog_rm({
				id: dialog,
			});
		}

		return;
	}

	if (!id) return;

	if (!page.structure.dialogs) return;

	if (dialogs.hasOwnProperty(id)) {
		let dialog = dialogs[id];

		if (!page.structure.dialogs.contains(dialog.instance)) return;

		log(`queuing ${id} to kill`, 'window');

		dialog.instance.classList.add('to-remove');

		setTimeout(function () {
			page.structure.dialogs.removeChild(dialog.instance);
		}, 400);

		delete dialogs[id];

		if (JSON.stringify(dialogs) == '{}') {
			page.structure.dialogs.classList.remove('has-dialog');
		}
	}
}
