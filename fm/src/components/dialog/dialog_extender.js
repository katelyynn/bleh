/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { page, root } from '@/build/page';
import { tl, trans } from '@/build/trans';
import { html, render } from 'lighterhtml';
import { toggle } from '@/components/settings/toggle';
import { log } from '@/build/log.js';
import {
	correct_artist,
	correct_item_by_artist,
} from '@/components/music/lotus';
import { icon, icons } from '../shared/icon';

export function dialog_extender() {
	// data-processed=true is signature of bulk edit
	const wrappers = document.body.querySelectorAll(
		':scope > .popup_wrapper, :scope > div > .popup_wrapper',
	);

	log(`found ${Array.from(wrappers).length} dialog(s)`, 'loop', 'log', {
		wrappers,
	});

	wrappers.forEach((wrapper) => {
		const modal_dialog = wrapper.querySelector(
			'.modal-dialog:not([data-dialog-extender])',
		);
		if (!modal_dialog) return;

		modal_dialog.setAttribute('data-dialog-extender', 'true');

		const body = modal_dialog.querySelector('.modal-body');
		if (!body) return;

		const title = body.querySelector('.modal-title');

		const contents = body.querySelector(':scope > div');

		const form = contents.querySelector('form');
		if (!form) return;

		const dismiss = modal_dialog.querySelector('.modal-dismiss');

		const token = form.querySelector('[name="csrfmiddlewaretoken"]');
		if (token) page.token = token.getAttribute('value');

		if (form.action && form.action.endsWith('+bookmarks/modal/added')) {
			// bookmark added modal

			title.textContent = tl(trans.saved_to_bookmarks);

			let new_form;
			render(
				contents,
				html`
					<div class="big-modal-alert">
					    ${{
						html: tl(trans.bookmark_save_msg).replace(
							'{link}',
							`<a class="see-more" href="${root}music/+bookmarks">${
								tl(trans.go_there_now_lower)
							}</a>`,
						),
					}}
					</div>
					<form
						method="post"
						ref=${(el) => (new_form = el)}
						onsubmit=${async (e) => {
							e.preventDefault();

							const url = `${root}music/+bookmarks/modal/added`;
							const form_data = new FormData(new_form);

							console.info(form_data);

							try {
								await fetch(url, {
									method: 'POST',
									body: form_data,
								}).then((res) => {
									let data = res.json();

									log('received response', 'form', 'info', {
										data: data,
									});
									dismiss.click();
								});
							} catch (e) {
								console.error(e);
							}
						}}
					>
						<input
							type="hidden"
							name="csrfmiddlewaretoken"
							value="${page.token}"
						/>
						<div class="modal-footer">
					        ${toggle({
						value: true,
						type: 'checkbox',
						name: 'always_show',
						title: tl(trans.always_remind_me),
					})}
					        <button class="btn primary done" type="submit">
					            ${tl(trans.done)}
					        </button>
					    </div>
					</form>
				`,
			);
		} else if (body.classList.contains('automatic-edit-modal-body-v2')) {
			// automatic edit v2

			// we use this to detect the bulk edit extension
			let bulk_edit_active = false;

			const edit_all = body.querySelector('[name="edit_all"]');
			if (edit_all && edit_all.disabled) bulk_edit_active = true;

			if (!bulk_edit_active) title.textContent = tl(trans.edit_scrobble);
			else title.textContent = tl(trans.edit_scrobbles_in_bulk);

			modal_dialog.classList.add('automatic-edit-modal');

			const checkboxes = body.querySelectorAll('.checkbox');

			checkboxes.forEach((checkbox) => {
				const input_el = checkbox.querySelector('input');
				const value = input_el.checked;
				const name = input_el.getAttribute('name');
				const text = checkbox.textContent.trim();
				const disabled = input_el.disabled;

				render(
					checkbox.parentElement,
					html`
						${toggle({
							value: value,
							type: 'checkbox',
							name: name,
							title: text,
							disabled: disabled,
							data: input_el.value,
						})}
					`,
				);
			});

			const original_fields = body.querySelectorAll(
				'.edit-scrobble-label--originally',
			);
			original_fields.forEach((field) => {
				field.textContent = field.textContent
					.trim()
					.replace(/"([^"]*)"/g, '‘$1’');
			});

			const submit = body.querySelector('.form-group--submit');
			submit.classList = 'modal-footer';

			const delete_form = body.querySelector(
				'.edit-scrobble-form-delete',
			);
			let delete_btn;
			if (delete_form) {
				delete_btn = delete_form.querySelector('.btn-delete');
			}

			const submit_input = submit.querySelector('input');
			const submit_button = submit.querySelector('[type="submit"]');

			submit_button.classList = 'btn primary icon';
			submit_button.setAttribute('data-type', 'item-edit');
			submit_button.textContent = tl(trans.edit);

			render(
				submit,
				html`
					<button class="see-more cancel left-icon" type="button" onclick=${() =>
						dismiss.click()}>
					    ${tl(trans.cancel)}
					</button>
					<div class="fill" />
					<div class="button-group">
					    ${delete_form
						? html.node`
                        <button class="btn icon danger-subtle" data-type="delete" type="button" onclick=${() => {
							delete_btn.click();
						}}>
                            ${tl(trans.delete)}
                        </button>
                        `
						: ''}
					    ${submit_input}
					    ${submit_button}
					</div>
				`,
			);
		} else if (body.querySelector('.lastfm-bulk-edit-list')) {
			// bulk edit
			// select albums to edit

			let checks;

			const controls = body.querySelector(
				'.lastfm-bulk-edit-form-group-controls',
			);
			if (controls) {
				const parent = controls.parentElement;
				parent.parentElement.removeChild(parent);

				const disclaimer = body.querySelector('.form-disclaimer');

				disclaimer.after(html.node`
                    <div class="button-group">
                        <button class="btn flex-button" onclick=${() => {
					checks.forEach((check) => {
						check.check();
					});
				}} type="button">
                            ${icon({ name: icons.select_all })}
                            ${tl(trans.select_all)}
                        </button>
                        <button class="btn flex-button" onclick=${() => {
					checks.forEach((check) => {
						check.uncheck();
					});
				}} type="button">
                            ${icon({ name: icons.deselect_all })}
                            ${tl(trans.deselect_all)}
                        </button>
                    </div>
                `);
			}

			const list = body.querySelector('.lastfm-bulk-edit-list');

			const checkboxes = list.querySelectorAll('.checkbox');

			checkboxes.forEach((checkbox) => {
				const input_el = checkbox.querySelector('input');
				const value = input_el.checked;
				const name = input_el.getAttribute('name');
				const disabled = input_el.disabled;
				const data = input_el.getAttribute('value');

				const item_artist = correct_artist(
					checkbox.querySelector('div').title,
				);
				const item_name = correct_item_by_artist(
					checkbox.querySelector('strong').title,
					item_artist,
				);
				const item_scrobbles = checkbox
					.querySelector('small')
					.textContent.trim();

				render(
					checkbox.parentElement,
					html`
						${toggle({
							value: value,
							type: 'checkbox',
							name: name,
							title: item_name +
								tl(trans.by_artist).replace('{a}', item_artist),
							body: item_scrobbles,
							disabled: disabled,
							data: data,
						})}
					`,
				);
			});

			checks = list.querySelectorAll('.setting');

			const footer = body.querySelector('.form-group--submit');
			footer.classList = 'modal-footer';
			render(
				footer,
				html`
					<button class="see-more cancel left-icon" type="reset">
					    ${tl(trans.cancel)}
					</button>
					<div class="fill" />
					<button class="btn primary continue" type="submit">
					    ${tl(trans.continue)}
					</button>
				`,
			);
		}
	});
}
