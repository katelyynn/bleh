//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import {
	patch_avatar,
	style_name_from_badge,
} from '@/components/shared/avatar';
import { settings } from '@/build/config';
import { log } from '@/build/log.js';
import { auth, page, root, shout_parse_queue } from '@/build/page';
import { lang, tl, trans } from '@/build/trans';
import { notify } from '@/components/dialog/notify';
import { html, render } from 'lighterhtml';
import { setting } from '@/components/settings/settings';
import {
	markdown,
	markdown_field,
	markdown_preview,
} from '@/components/shared/markdown';
import {
	copy,
	get_language_name,
	lazy,
	romanise,
	translate,
} from '@/build/tools';
import tippy from 'tippy.js';
import { keybind } from '@/components/dialog/rabbit';
import {
	correct_artist,
	correct_item_by_artist,
} from '@/components/music/lotus';
import { ff } from '../settings/sku';
import { keys } from '../settings/storage';
import { is_sponsor } from '../sponsor';

export function patch_shouts() {
	if (!page.structure.main) return;

	const use_md = settings.shout_markdown;

	let shout_controls = page.structure.main.querySelector(
		'.shoutbox-controls-wrapper:not([data-shouts])',
	);
	if (shout_controls) {
		shout_controls.setAttribute('data-shouts', 'true');
		shout_header(shout_controls);
	}

	const cache = JSON.parse(localStorage.getItem(keys.profile_cache) || '{}');

	let shouts = page.structure.main.querySelectorAll(
		'.shout:not([data-kate-processed])',
	) as NodeListOf<HTMLElement>;

	shouts.forEach((shout, index) => {
		try {
			shout.setAttribute('data-kate-processed', 'true');
			shout.style.setProperty('--delay', index * 0.04 + 's');

			shout.classList.add('icon-mask');

			const shout_name = shout.querySelector('.shout-user > a');
			if (!shout_name) return;

			const shout_name_text = shout_name.textContent;

			const valid = is_sponsor(shout_name_text);

			if (cache[shout_name_text]?.username && valid) {
				shout_name.classList.add('username-combo');
				render(
					shout_name,
					html`
						<span class="username-custom">${cache[shout_name_text]
							.username}</span>
						<span class="username-original">
						    <span class="at">@</span>${shout_name_text}
						</span>
					`,
				);
			} else {
				shout_name.insertBefore(
					html.node`<span class="at">@</span>`,
					shout_name.firstChild,
				);
			}

			const shout_avatar = shout.querySelector('.shout-user-avatar');

			let badge = patch_avatar(shout_avatar, shout_name_text, 'shout');

			if (badge) {
				if (badge.type && badge.type == 'avatar-status-dot--staff') {
					shout.classList.add('staff-shout');
				}

				style_name_from_badge(shout_name, badge);
			}

			const shout_body = shout.querySelector('.shout-body');
			if (!shout_body) return;

			const shout_p = shout_body.querySelector('p');
			const shout_text = shout_p.textContent.trim();

			if (settings.shout_markdown) {
				shout_parse_queue.push({ element: shout_p });
			}

			const indicator = html.node`
                <div class="shout-vote-indicator colourful" aria-checked="false" />
            `;
			shout.appendChild(indicator);

			// timestamp
			const timestamp = shout.querySelector('.shout-timestamp');
			if (timestamp) {
				const timestamp_text = timestamp.querySelector(
					'.shout-timestamp time',
				);

				tippy(timestamp, {
					content: timestamp_text.getAttribute('title'),
				});

				timestamp_text.removeAttribute('title');
			}

			const action_list = shout.querySelector('.shout-actions');

			let actions = action_list.querySelectorAll(
				'.shout-actions .shout-action',
			);
			actions.forEach((action) => {
				let buttons = action.querySelectorAll('button, a');
				buttons.forEach((button) => {
					button.classList.add(
						'btn',
						'shout-action-button',
						'see-more',
					);
				});
			});

			shout.insertBefore(
				html.node`
                <div class="shout-top">
                    <div class="shout-basics">
                        ${shout_name.parentElement}
                        ${timestamp}
                    </div>
                    ${action_list}
                </div>
            `,
				shout.firstChild,
			);

			const more_button = shout.querySelector('.shout-more-actions');
			if (more_button) {
				more_button.classList.add(
					'btn',
					'see-more',
					'shout-action-button',
				);
			}

			// detect vote status
			const form = shout.querySelector('.vote-button-toggle');

			const voted_button = form.querySelector('.vote-button--voted');
			const unvote_button = form.querySelector(
				'.vote-button:not(.vote-button--voted)',
			);

			if (!voted_button || !unvote_button) return;

			// if the ALREADY VOTED button changes to MODIFIED STATE when clicked,
			// that means the server gave us a shout that is ALREADY VOTED
			const initial_is_voted =
				voted_button.getAttribute('data-ajax-form-sets-state') ==
					'modified-state';

			indicator.setAttribute('aria-checked', initial_is_voted.toString());

			voted_button.classList.add('colourful');
			voted_button.addEventListener('click', (e) => vote_button());
			unvote_button.classList.add('colourful');
			unvote_button.addEventListener('click', (e) => vote_button());

			function vote_button() {
				setTimeout(() => {
					const modified =
						form.getAttribute('data-ajax-form-state') ==
							'modified-state';
					const current_is_voted = initial_is_voted != modified;

					indicator.setAttribute(
						'aria-checked',
						current_is_voted.toString(),
					);
				}, 0);
			}

			const menu = shout.querySelector('.shout-more-actions-menu');

			const buttons = menu.querySelectorAll('button');
			buttons.forEach((button) => {
				const type = button.classList[1];
				if (type == 'more-item--delete') {
					button.textContent = tl(trans.delete);
					button.classList.add('colourful', 'danger-subtle');
				} else if (type == 'more-item--report') {
					button.textContent = tl(trans.report);
					button.classList.add('colourful', 'danger-subtle');
				}
			});

			menu.insertBefore(
				html.node`
                <button class="dropdown-menu-clickable-item" data-type="translate" onclick=${async () => {
					if (shout.translated) return;

					translate(shout_text, lang).then((res) => {
						shout.translated = true;

						shout_body.setAttribute('data-show-translated', 'true');

						if (settings.shout_markdown) {
							res.translated = markdown(res.translated);
						}

						const detected = get_language_name(res.detected);

						shout_body.appendChild(html.node`
                            <div class="translated-notice">
                                <div class="bleh-icon translated-notice-icon" data-type="translate" style="--icon: var(--mask)" />
                                <p class="translated-notice-text">${
							tl(trans.translated_from_value, { v: detected })
						}</p>
                            </div>
                            <p class="translated-body">
                                ${res.translated}
                            </p>
                        `);
					});
				}}>
                    ${tl(trans.translate)}
                </button>
                <button class="dropdown-menu-clickable-item" data-type="copy" onclick=${() => {
					copy(shout_text);
				}}>
                    ${tl(trans.copy)}
                </button>
                <div class="sep" />
            `,
				menu.firstElementChild,
			);

			let send_button = shout.querySelector('.form-group--submit');
			shout_send(send_button);
		} catch (e) {
			notify({
				id: 'shout',
				title: tl(trans.shouts),
				body: 'Failed to be modified :(',
				type: 'error',
				icon: 'icon-16-shoutbox',
			});
			log('failed to modify', 'shout', 'error', { error: e });
		}
	});

	if (settings.shout_markdown && shout_parse_queue.length > 0) {
		parse_shout_queue();
	}

	// enter a shout field
	const shout_forms = document.querySelectorAll(
		'.shout-form:not([data-shout-form])',
	);
	shout_forms.forEach((shout_form) => {
		shout_form.setAttribute('data-shout-form', 'true');

		const avatar = shout_form.querySelector('.shout-user-avatar');

		patch_avatar(avatar, auth.name);

		let send_button = shout_form.querySelector('.form-group--submit');
		shout_send(send_button);

		const help_text = shout_form.querySelector('.form-row-help-text');
		help_text.classList.add('dual-tip', 'shout-help-text');

		const legacy_textarea = shout_form.querySelector('textarea');

		let placeholder = legacy_textarea.placeholder;

		const is_reply = placeholder.includes(auth.name);

		if (!is_reply) {
			if (page.type == 'user') {
				placeholder = tl(trans.shoutbox_placeholder_user, {
					u: auth.name,
					v: page.name,
				});
			} else {
				placeholder = tl(trans.shoutbox_placeholder, {
					u: auth.name,
					v: page.type == 'artist'
						? romanise(correct_artist(page.name))
						: ['album', 'track'].includes(page.type)
						? romanise(
							correct_item_by_artist(page.name, page.sister),
						)
						: page.name,
				});
			}
		}

		const textarea = markdown_field(
			(val) => {
				chars.textContent = tl(trans.value_characters_max, {
					v: `${val.length}/1000`,
				});
				chars.setAttribute('data-exceeded', val.length >= 1000);

				if (use_md) preview.setAttribute('disabled', val.length <= 0);
			},
			{},
			'',
			'body',
			null,
			null,
			placeholder,
			legacy_textarea.maxLength,
			true,
			!is_reply,
		);

		legacy_textarea.replaceWith(textarea);

		let chars;
		let preview;
		render(
			help_text,
			html`
				${use_md
					? html.node`
                <div class="tip preview" onclick=${() =>
						markdown_preview(textarea.value)} ref=${(
						el,
					) => (preview = el)} disabled="true">
                    ${tl(trans.preview)}
                </div>
            `
					: ''}
				<div class="tip characters colourful" ref=${(
					el,
				) => (chars = el)}>
				    ${tl(trans.value_characters_max, { v: '0/1000' })}
				</div>
			`,
		);

		shout_form.addEventListener('keydown', (e) => {
			// CTRL + ENTER
			if (e.ctrlKey && e.keyCode == 13) {
				e.preventDefault();

				send_button.querySelector('.btn-post-shout').click();
				notify({
					id: 'shout',
					title: tl(trans.shouts),
					body: tl(trans.sent),
					icon: 'icon-16-shoutbox',
				});
			}
		});
	});
}

function shout_send(send_button) {
	if (!send_button) return;

	let button = send_button.querySelector('.btn-post-shout');
	if (!button) return;

	button.classList.add('btn', 'btn-send-shout-generic', 'icon');
	button.textContent = tl(trans.send);
	button.removeAttribute('disabled');

	/* this is a joke */
	/*button.parentElement.insertBefore(html.node`
        <button class="btn icon primary" data-type="ai">
            Write<span class="new-badge">PRO</span>
        </button>
    `, button);*/

	if (page.mobile) return;

	tippy(button, {
		content: tl(trans.send_quickly_with).replace(
			'{kbd}',
			keybind(['⌘', '⏎']).outerHTML,
		),
		allowHTML: true,
		delay: [500, 0],
	});
}

export function shout_header(shout_controls) {
	let panel;
	let settings_btn;

	if (page.subpage == 'shoutbox_shout') {
		panel = page.structure.main.querySelector(
			':scope > section:not([data-shout-patched])',
		);
		if (!panel) return;

		panel.setAttribute('data-shout-patched', 'true');

		let link = window.location.href;

		panel.insertBefore(
			html.node`
            <div class="top-container">
                <h2>
                    <a class="text-colour-link" href=${link}>${
				tl(trans.shouts)
			}</a>
                </h2>
                <div class="accompany view-buttons blend blend-v2">
                    <p class="notice">${tl(trans.single_shout)}</p>
                </div>
                <div class="view-buttons blend blend-v2">
                    <button class="left-icon blend-v2-btn" data-type="settings" ref=${(
				el,
			) => (settings_btn = el)}>
                        ${tl(trans.settings)}
                    </button>
                </div>
            </div>
        `,
			panel.firstElementChild,
		);
	} else if (shout_controls) {
		panel = shout_controls.parentElement;

		if (panel.hasAttribute('data-shout-patched')) return;
		panel.setAttribute('data-shout-patched', 'true');

		let select_btn = panel.querySelector('.dropdown-menu-clickable-button');

		let header = panel.querySelector(':scope > h2');
		if (!header) return;
		if (header) header.parentElement.removeChild(header);

		let link = window.location.href;
		let shoutbox_link = '+shoutbox';
		if (page.type == 'user' || page.type == 'event') {
			shoutbox_link = 'shoutbox';
		}

		if (!page.subpage.startsWith('shoutbox')) link += `/${shoutbox_link}`;

		panel.insertBefore(
			html.node`
            <div class="top-container">
                <h2>
                    <a class="text-colour-link" href=${link}>${
				tl(trans.shouts)
			}</a>
                </h2>
                ${
				select_btn
					? html.node`
                    <div class="accompany view-buttons blend blend-v2">
                        ${() => {
						select_btn.classList.add(
							'select-button',
							'link-select',
							'blend-v2-btn',
						);
						select_btn.classList.remove(
							'section-control',
							'dropdown-menu-clickable-button',
						);
						return shout_controls;
					}}
                    </div>
                `
					: ''
			}
                <div class="view-buttons blend blend-v2">
                    <button class="left-icon blend-v2-btn" data-type="settings" ref=${(
				el,
			) => (settings_btn = el)}>
                        ${tl(trans.settings)}
                    </button>
                </div>
            </div>
        `,
			panel.firstElementChild,
		);
	} else {
		const candidate = page.structure.main.querySelector('#shoutbox > h2');
		if (!candidate) return;

		candidate.replaceWith(html.node`
            <div class="top-container">
                <h2>
                    <a class="text-colour-link">${tl(trans.shouts)}</a>
                </h2>
                <div class="view-buttons blend blend-v2">
                    <button class="left-icon blend-v2-btn" data-type="settings" ref=${(
			el,
		) => settings_btn = el}>
                        ${tl(trans.settings)}
                    </button>
                </div>
            </div>
        `);
	}

	if (!settings_btn) return;

	tippy(settings_btn, {
		theme: 'window',
		content: html.node`
            <div class="dialog-settings">
                <div class="setting-group blend">
                    ${setting({ id: 'shout_markdown' })}
                    ${setting({ id: 'accessible_name_colours' })}
                    ${setting({ id: 'underline_links' })}
                </div>
            </div>
        `,
		placement: 'bottom',
		interactive: true,
		interactiveBorder: 10,
		trigger: 'click',
		appendTo: document.body,
	});

	if (!panel) return;

	const cant_shout = panel.querySelector('.shouting-unavailable');
	if (cant_shout) {
		render(
			cant_shout,
			html`
				<div class="loading-data-container">
					<div class="loading-data-text static" data-type="shouts">
				        ${tl(trans.cant_shout)}
				    </div>
				</div>
			`,
		);
	}
}

export function parse_shout_queue() {
	if (shout_parse_queue.length == 0) return;

	const shout = shout_parse_queue.shift();

	lazy(shout.element, () => {
		const parsed = markdown(shout.element.textContent);

		shout.element.classList.add('markdown-body');
		render(shout.element, html.node`${parsed}`);

		log('parsed one shout', 'shout', 'log');
	});

	if (shout_parse_queue.length > 0) setTimeout(parse_shout_queue, 50);
}

export function shout_messages() {
	if (!page.structure.main) return;

	let alerts = page.structure.main.querySelectorAll(
		'.shout-messages > .alert',
	);
	alerts.forEach((alert) => {
		if (alert.classList.contains('alert-danger')) {
			// assume its the generic rate limit
			notify({
				id: 'shout',
				title: tl(trans.shouts),
				body: tl(trans.failed_to_send),
				type: 'error',
				icon: 'icon-16-shoutbox',
			});
		} else {
			return;
		}

		alert.remove();
	});
}

export function join_the_conversation(blocked) {
	if (!ff('join_the_conversation')) return;

	const join = page.structure.main.querySelector('.btn-shouts-join');
	if (!join) return;

	if (blocked) {
		join.remove();
		return;
	}

	const use_partial = !ff('use_full_shoutbox');

	const partial = use_partial ? 'partial/' : '';

	let search = window.location.search;
	if (!use_partial) {
		search = search.replace('shoutbox-sort=', 'sort=');
	}

	const url =
		`${window.location.pathname}/+${partial}shoutbox${window.location.search}`;

	//

	const shoutbox = html.node`
        <section class="shoutbox-preview lazy-shoutbox shoutbox--with-header" id="shoutbox">
            <h2>${tl(trans.shouts)}</h2>
            <div class="loading-data-container">
                <div class="loading-data-text">${
		tl(trans.loading_conversations)
	}</div>
            </div>
        </section>
    `;

	join.replaceWith(shoutbox);

	lazy(shoutbox, () => {
		fetch(url)
			.then((res) => {
				if (!res.ok) {
					throw new Error();
				}

				return res.text();
			})
			.then((res) => {
				const doc = new DOMParser().parseFromString(res, 'text/html');

				const new_shoutbox = doc.querySelector(
					use_partial ? '.shoutbox' : '.col-main > section',
				);
				if (!new_shoutbox) throw new Error();

				if (use_partial) {
					render(shoutbox, html``);
					shoutbox.appendChild(new_shoutbox);
				} else {
					shoutbox.replaceWith(new_shoutbox);
					shout_header(
						new_shoutbox.querySelector('.section-controls'),
					);
				}
			})
			.catch((e) => {
				handle_shout_error(e);
			});
	});

	function handle_shout_error(e) {
		render(
			shoutbox,
			html`
				<h2>${tl(trans.shouts)}</h2>
				<div class="loading-data-container">
					<div class="alert alert-error">${e && e.message
						? e.message
						: tl(trans.shoutbox_failed)}</div>
				</div>
			`,
		);
	}
}
