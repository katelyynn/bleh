//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { html, render } from 'lighterhtml';
import {
	other_setting_types,
	setting_value,
	settings,
	settings_store,
} from '@/build/config';
import { tl, trans } from '@/build/trans';
import { notify } from '@/components/dialog/notify';
import { auth, page } from '@/build/page';
import { request_reload } from '@/config';
import { log } from '@/build/log.js';
import { change_settings_page } from '@/pages/bleh_settings/bleh_settings.js';
import { dialog_rm } from '@/components/dialog/dialog';
import { keybind } from '@/components/dialog/rabbit';
import tippy from 'tippy.js';
import { version } from '@/main';
import { select } from '@/components/settings/select';
import { input } from '@/components/settings/input';
import { status } from '@/components/dialog/status';
import { chart_reflow } from '@/components/music/chart';
import { set_storage } from '@/build/tools';
import { ff } from './sku';
import { new_indicator } from '../shared/indicator';

interface setting {
	id: string;
	text?: boolean;
	focus?: boolean;
	standalone?: boolean;
	func?: Function;
	list?: [];
	center?: boolean;
	in_menu?: boolean;
	mouseenter?: () => void;
	mouseleave?: () => void;
}

interface setting_element extends HTMLElement {
	value?: string;
	compat?: () => void;
	update?: (new_list: []) => void;
}

export function setting({
	id = '',
	text = true,
	focus = false,
	standalone = false,
	func,
	list,
	center = true,
	in_menu = false,
	mouseenter,
	mouseleave,
}: setting): setting_element {
	try {
		const value = settings[id];
		log(`creating ${id} with value ${value}`, 'settings', 'log', {
			settings: settings,
			settings_id: settings[id],
		});

		if (!settings_store[id]) {
			return setting_fail(id, {
				message: 'No settings store entry present',
			});
		}

		const type = settings_store[id].type || 'toggle';
		const title =
			(settings_store[id].title && !settings.developer_setting_names)
				? tl(settings_store[id].title)
				: id;
		let body = settings_store[id].body ? tl(settings_store[id].body) : null;
		const icon = settings_store[id].icon;

		if (
			![
				'toggle',
				'range',
				'text',
				'checkbox',
				'tabs',
				'radio',
				'list',
				'select',
			].includes(type)
		) {
			return setting_fail(id, {
				message: `Invalid type "${type}"`,
			});
		}

		const incompatible_with = settings_store[id].incompatible;
		const requires = settings_store[id].requires;
		const hide_if_incompatible = settings_store[id].hide_if_incompatible ||
			false;

		if (!body && settings_store[id].keybind) {
			body = keybind(settings_store[id].keybind);
		}

		let disabled = false;
		let disabled_reason = '';
		if (
			settings_store[id].platforms &&
			!settings_store[id].platforms.includes(page.platform)
		) {
			const platforms = {
				win32: 'Windows',
				darwin: 'macOS',
				ios: 'iOS',
				android: 'Android',
				linux: 'Linux',
				other: tl(trans.platforms.other),
			};

			disabled = true;
			disabled_reason = tl(trans.item_is_unavailable_on_platform, {
				i: title,
				p: platforms[page.platform],
			});
		}

		if (disabled && disabled_reason) {
			return setting_fail(id, {
				message: disabled_reason,
				unavailable: true,
			});
		}

		const html_title = html.node`${title}`;

		if (settings_store[id].beta) {
			html_title.appendChild(
				html.node`<span class="new-badge beta">${
					tl(trans.beta)
				}</span>`,
			);
		}
		if (settings_store[id].new_release) {
			html_title.appendChild(new_indicator());
		}

		if (type == 'toggle') {
			let toggle;

			let elem;

			if (!in_menu) {
				elem = html.node`
                    <div class="setting v2 ${
					standalone ? 'standalone' : ''
				}" data-type="toggle" data-hide=${hide_if_incompatible} id="setting_${id}" onclick=${() =>
					update_toggle()}>
                        ${
					icon
						? html.node`
                        <div class="icon">
                            <div class="bleh-icon" style="--icon: var(--${icon})" />
                        </div>
                        `
						: ''
				}
                        ${
					text
						? html.node`
                        <div class="heading">
                            <h5>${html_title}</h5>
                            ${body ? html.node`<p>${body}</p>` : ''}
                        </div>
                        `
						: ''
				}
                        ${
					settings_store[id].extensions
						? html.node`
                        <div class="extensions">
                            ${
							settings_store[id].extensions.map(
								(extension) => () => {
									const container = html.node`
                                    <div class="extension">
                                        <div class="bleh-icon" />
                                    </div>
                                `;

									tippy(container, {
										content: tl(
											trans.requires_extension_value,
										).replace('{v}', tl(extension)),
									});

									return container;
								},
							)
						}
                        </div>
                        `
						: ''
				}
                        ${
					setting_incompatible_block(settings_store[id].incompatible)
				}
                        <div class="toggle-wrap">
                            <button class="btn toggle colourful" ref=${(
					el,
				) => (toggle = el)} aria-checked=${value} type="button">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                ` as setting_element;
			} else {
				elem = html.node`
                    <button class="dropdown-menu-clickable-item" data-hide=${hide_if_incompatible} aria-checked=${value} onclick=${() =>
					update_toggle()} ref=${(el) => (toggle = el)}>
                        ${
					icon
						? html.node`
                        <div class="icon">
                            <div class="bleh-icon" style="--icon: var(--${icon})" />
                        </div>
                        `
						: ''
				}
                        ${
					text
						? html.node`
                        <span class="menu-item-body">
                            <strong class="menu-item-head">${html_title}</strong>
                        </span>
                        `
						: ''
				}
                        ${
					setting_incompatible_block(settings_store[id].incompatible)
				}
                    </button>
                ` as setting_element;
			}

			if (mouseenter) elem.addEventListener('mouseenter', mouseenter);
			if (mouseleave) elem.addEventListener('mouseleave', mouseleave);

			function update_toggle() {
				if (elem.getAttribute('disabled') == 'true') {
					status({
						title: tl(trans.incompatible_alert),
					});
					return;
				}

				let val = settings[id];

				toggle.setAttribute('aria-checked', !val);

				save_setting(id, !val);
				if (func) func(!val);

				if (mouseenter) mouseenter();
			}

			elem.compat = () => {
				if (!incompatible_with) return;

				elem.removeAttribute('disabled');

				Object.entries(incompatible_with).forEach(([key, val]) => {
					if (Array.isArray(val)) {
						if (val.includes(settings[key])) {
							elem.setAttribute('disabled', 'true');
						}
					} else {
						if (
							JSON.stringify(val) == JSON.stringify(settings[key])
						) {
							elem.setAttribute('disabled', 'true');
						}
					}
				});
			};

			elem.compat();

			return elem;
		} else if (type == 'range') {
			let option;

			const min = settings_store[id].min || 0;
			const max = settings_store[id].max || 0;
			const step = settings_store[id].step || 0;

			if (min >= max || step === 0) {
				return setting_fail(id, {
					message:
						'A range type requires a min, max, and step defined in the settings store',
				});
			}

			let reset_btn;

			let track;
			let input;
			let marker;

			const working_max = settings_store[id].max - settings_store[id].min;

			const elem = html.node`
                <div class="setting v2 ${standalone ? 'standalone' : ''} ${
				settings_store[id].vertical ? 'v' : ''
			}" data-type="range" disabled=${disabled} id="setting_${id}" data-hide=${hide_if_incompatible} ref=${(
				el,
			) => (option = el)} data-modified=${
				value != settings_store[id].default
			}>
                    ${
				text
					? html.node`
                    <div class="heading">
                        <h5>${html_title}<button class="btn reset" ref=${(
						el,
					) => (reset_btn = el)} onclick=${() => reset_range()}>${
						tl(trans.reset)
					}</button></h5>
                        ${body ? html.node`<p>${body}</p>` : ''}
                    </div>
                    `
					: ''
			}
                    ${
				settings_store[id].extensions
					? html.node`
                    <div class="extensions">
                        ${
						settings_store[id].extensions.map(
							(extension) => () => {
								const container = html.node`
                                <div class="extension">
                                    <div class="bleh-icon" />
                                </div>
                            `;
								tippy(container, {
									content: tl(
										trans.requires_extension_value,
									).replace('{v}', tl(extension)),
								});
								return container;
							},
						)
					}
                    </div>
                    `
					: ''
			}
                    ${
				setting_incompatible_block(settings_store[id].incompatible)
			}
                    <div class="range">
                        <div class="track colourful" style="--percent: ${
				((value - settings_store[id].min) / working_max) * 100
			}%" data-id=${id} ref=${(el) => (track = el)}>
                            <div class="fill" />
                            <div class="nub" />
                        </div>
                        <input type="range" min=${min} max=${max} step=${step} value=${value} ref=${(
				el,
			) => (input = el)} oninput=${() => update_range(input.value)} />
                        <p class="value-marker" ref=${(
				el,
			) => (marker = el)}>${value}${settings_store[id].suffix || ''}</p>
                    </div>
                </div>
            ` as setting_element;

			if (mouseenter) elem.addEventListener('mouseenter', mouseenter);
			if (mouseleave) elem.addEventListener('mouseleave', mouseleave);

			elem.compat = () => {
				if (!incompatible_with) return;

				elem.setAttribute('disabled', 'false');

				Object.entries(incompatible_with).forEach(([key, val]) => {
					if (Array.isArray(val)) {
						if (val.includes(settings[key])) {
							elem.setAttribute('disabled', 'true');
						}
					} else {
						if (
							JSON.stringify(val) == JSON.stringify(settings[key])
						) {
							elem.setAttribute('disabled', 'true');
						}
					}
				});
			};

			elem.compat();

			tippy(reset_btn, {
				content: tl(trans.reset),
			});

			Object.defineProperty(elem, 'value', {
				set(val: number) {
					update_range(val);
				},
			});

			const max_range = max - min;

			function update_range(val) {
				input.value = val;
				track.style.setProperty(
					'--percent',
					`${((val - settings_store[id].min) / max_range) * 100}%`,
				);
				marker.textContent = `${val}${settings_store[id].suffix || ''}`;

				option.setAttribute(
					'data-modified',
					val != settings_store[id].default,
				);

				save_setting(id, val);
				if (func) func(val);
			}
			function reset_range() {
				update_range(settings_store[id].default);
				status({
					title: tl(trans.reset_item_to_default),
				});
			}

			return elem;
		} else if (type == 'text') {
			let option;

			let min = settings_store[id].min || 0;
			let max = settings_store[id].max || 0;

			if (max === 0) {
				return setting_fail(id, {
					message:
						'A text type requires a max defined in the settings store',
				});
			}

			let reset_btn;
			let avatar;
			let input;
			let submit;

			let input_container;
			let error_tooltip;

			let placeholder = settings_store[id].placeholder;
			if (placeholder && placeholder != 'empty') {
				placeholder = tl(placeholder);
			}

			const container = html.node`
                <div class="setting v2 ${
				standalone ? 'standalone' : ''
			}" data-type="text" disabled=${disabled} data-hide=${hide_if_incompatible} id="setting_${id}" ref=${(
				el,
			) => (option = el)} data-modified=${
				value != settings_store[id].default
			}>
                    ${
				icon
					? html.node`
                    <div class="icon">
                        <div class="bleh-icon" style="--icon: var(--${icon})" />
                    </div>
                    `
					: ''
			}
                    ${
				text
					? html.node`
                    <div class="heading">
                        <h5>${html_title}<button class="btn reset" ref=${(
						el,
					) => (reset_btn = el)} onclick=${() =>
						reset_text(
							id,
							input,
							submit,
							option,
							reset_btn,
							avatar,
						)}>${tl(trans.reset)}</button></h5>
                        ${body ? html.node`<p>${body}</p>` : ''}
                    </div>
                    `
					: ''
			}
                    ${
				settings_store[id].extensions
					? html.node`
                    <div class="extensions">
                        ${
						settings_store[id].extensions.map(
							(extension) => () => {
								let container = html.node`
                                <div class="extension">
                                    <div class="bleh-icon" />
                                </div>
                            `;
								tippy(container, {
									content: tl(
										trans.requires_extension_value,
									).replace('{v}', tl(extension)),
								});
								return container;
							},
						)
					}
                    </div>
                    `
					: ''
			}
                    ${
				setting_incompatible_block(settings_store[id].incompatible)
			}
                    ${
				settings_store[id].avatar
					? html.node`
                    <div class="avatar-container">
                        <div class="avatar-inner" ref=${(el) => (avatar = el)}>
                            <img src=${
						localStorage.getItem(`bleh_${id}_avi`) || ''
					} alt=${value} />
                        </div>
                    </div>
                    `
					: ''
			}
                    <div class="input-container content-form in-settings can-submit" data-has-error="false" ref=${(
				el,
			) => (input_container = el)}>
                        <input type="text" maxlength=${max} value=${value} style="--max: ${max}px; --min: ${min}px" ref=${(
				el,
			) => (input = el)} placeholder=${placeholder} />
                        <button class="btn primary icon" data-type="save" ref=${(
				el,
			) => (submit = el)} onclick=${() =>
				update_text(
					id,
					input,
					submit,
					option,
					input.value,
					reset_btn,
					avatar,
				)}>${tl(trans.save)}</button>
                    </div>
                </div>
            ` as setting_element;

			if (mouseenter) {
				container.addEventListener('mouseenter', mouseenter);
			}
			if (mouseleave) {
				container.addEventListener('mouseleave', mouseleave);
			}

			container.compat = () => {
				container.setAttribute('disabled', 'false');

				if (incompatible_with) {
					Object.entries(incompatible_with).forEach(([key, val]) => {
						if (Array.isArray(val)) {
							if (val.includes(settings[key])) {
								container.setAttribute('disabled', 'true');
							}
						} else {
							if (
								JSON.stringify(val) ==
									JSON.stringify(settings[key])
							) {
								container.setAttribute('disabled', 'true');
							}
						}
					});
				} else if (requires) {
					const all_met = Object.entries(requires).every(
						([key, val]) => {
							if (Array.isArray(val)) {
								return val.includes(settings[key]);
							} else {
								return JSON.stringify(val) ==
									JSON.stringify(settings[key]);
							}
						},
					);

					if (!all_met) {
						container.setAttribute('disabled', 'true');
					}
				}
			};

			container.compat();

			input.addEventListener('keydown', (event) => {
				if (
					event.keyCode === 13 &&
					input_container.getAttribute('data-has-error') == 'false'
				) {
					event.preventDefault();
					submit.click();
				}
			});

			tippy(reset_btn, {
				content: tl(trans.reset),
			});

			if (focus) input.focus();

			error_tooltip = tippy(input, {
				theme: 'error',
				placement: 'top',
				trigger: 'manual',
			});
			error_tooltip.disable();

			input.addEventListener('input', () => {
				input_container.setAttribute('data-has-error', 'false');
				error_tooltip.disable();
				submit.disabled = false;

				if (type == 'number') {
					// is a number?
					if (input.value == '') {
						error_input(
							tl(trans.only_numbers_are_allowed),
							input_container,
							error_tooltip,
							submit,
						);
					} else if (
						parseInt(input.value) > max ||
						parseInt(input.value) < min
					) {
						error_input(
							tl(trans.keep_within_the_range),
							input_container,
							error_tooltip,
							submit,
						);
					}
				} else if (type == 'text') {
					if (settings_store[id].warn_if_empty && input.value == '') {
						error_input(
							tl(trans.this_field_is_required),
							input_container,
							error_tooltip,
							submit,
						);
					} else if (
						settings_store[id].warn_if_matches_auth &&
						input.value == auth.name
					) {
						error_input(
							tl(trans.please_dont_clone_yourself),
							input_container,
							error_tooltip,
							submit,
						);
					}
				}
			});

			return container;
		} else if (type == 'checkbox') {
			let toggle;

			let elem;

			if (!in_menu) {
				elem = html.node`
                    <div class="setting v2 ${
					settings_store[id].horizontal ? 'horizontal' : ''
				} ${
					standalone
						? 'standalone'
						: ''
				}" data-type="checkbox" id="setting_${id}" data-hide=${hide_if_incompatible} onclick=${() =>
					update_toggle()}>
                        ${
					icon
						? html.node`
                        <div class="icon">
                            <div class="bleh-icon" style="--icon: var(--${icon})" />
                        </div>
                        `
						: ''
				}
                        ${
					text
						? html.node`
                        <div class="heading">
                            <h5>${html_title}</h5>
                            ${body ? html.node`<p>${body}</p>` : ''}
                        </div>
                        `
						: ''
				}
                        ${
					settings_store[id].extensions
						? html.node`
                        <div class="extensions">
                            ${
							settings_store[id].extensions.map(
								(extension) => () => {
									let container = html.node`
                                    <div class="extension">
                                        <div class="bleh-icon" />
                                    </div>
                                `;
									tippy(container, {
										content: tl(
											trans.requires_extension_value,
										).replace('{v}', tl(extension)),
									});
									return container;
								},
							)
						}
                        </div>
                        `
						: ''
				}
                        ${
					setting_incompatible_block(settings_store[id].incompatible)
				}
                        <div class="check">
                            <div class="box" ref=${(
					el,
				) => (toggle = el)} aria-checked=${value}>
                                <div class="bleh-icon" />
                            </div>
                        </div>
                    </div>
                ` as setting_element;
			} else {
				elem = html.node`
                    <button class="dropdown-menu-clickable-item" data-hide=${hide_if_incompatible} aria-checked=${value} onclick=${() =>
					update_toggle()} ref=${(el) => (toggle = el)}>
                        ${
					icon
						? html.node`
                        <div class="icon">
                            <div class="bleh-icon" style="--icon: var(--${icon})" />
                        </div>
                        `
						: ''
				}
                        ${
					text
						? html.node`
                        <span class="menu-item-body">
                            <strong class="menu-item-head">${html_title}</strong>
                        </span>
                        `
						: ''
				}
                        ${
					setting_incompatible_block(settings_store[id].incompatible)
				}
                    </button>
                ` as setting_element;
			}

			if (mouseenter) elem.addEventListener('mouseenter', mouseenter);
			if (mouseleave) elem.addEventListener('mouseleave', mouseleave);

			function update_toggle() {
				if (elem.getAttribute('disabled') == 'true') {
					status({
						title: tl(trans.incompatible_alert),
					});
					return;
				}

				let val = settings[id];

				toggle.setAttribute('aria-checked', !val);

				save_setting(id, !val);
				if (func) func(!val);

				if (mouseenter) mouseenter();
			}

			elem.compat = () => {
				if (!incompatible_with) return;

				elem.removeAttribute('disabled');

				Object.entries(incompatible_with).forEach(([key, val]) => {
					if (Array.isArray(val)) {
						if (val.includes(settings[key])) {
							elem.setAttribute('disabled', 'true');
						}
					} else {
						if (
							JSON.stringify(val) == JSON.stringify(settings[key])
						) {
							elem.setAttribute('disabled', 'true');
						}
					}
				});
			};

			elem.compat();

			return elem;
		} else if (type == 'tabs') {
			let buttons = [];

			const values = settings_store[id].values || list;

			if (!values) {
				return setting_fail(id, {
					message:
						'Tabs type requires you to either define values in config or pass a list to instance.',
				});
			}

			const inner = html.node`
                ${
				Object.entries(values).map(([key, val]) => {
					const icon = val.icon || key;

					const button = html.node`
                        <button class="btn view-item icon" data-type=${icon} data-value=${key} onclick=${() => {
						save_setting(id, key);

						buttons.forEach((btn) => {
							btn.setAttribute(
								'aria-checked',
								btn.getAttribute('data-value') == key,
							);
						});

						if (func) func(key);
					}} aria-checked=${value == key}>
                            ${
						typeof val.name == 'object' ? tl(val.name) : val.name
					}
                        </button>
                    `;

					buttons.push(button);
					return button;
				})
			}
            `;

			if (standalone) return inner;

			return html.node`
                <div class="view-buttons ${
				center ? 'view-buttons-middle' : ''
			}">
                    ${inner}
                </div>
            `;
		} else if (type == 'radio') {
			let buttons = [];

			let reset_btn;

			let elem;
			let value_holder;

			if (!in_menu) {
				elem = html.node`
                    <div class="setting v2" data-type="options" disabled=${disabled} data-hide=${hide_if_incompatible} id="setting_${id}" data-modified=${
					value != settings_store[id].default
				}>
                        ${
					icon
						? html.node`
                        <div class="icon">
                            <div class="bleh-icon" style="--icon: var(--${icon})" />
                        </div>
                        `
						: ''
				}
                        ${
					text
						? html.node`
                        <div class="heading">
                            <h5>${html_title}<button class="btn reset" ref=${(
							el,
						) => (reset_btn = el)} onclick=${() => reset_radio()}>${
							tl(trans.reset)
						}</button></h5>
                            ${body ? html.node`<p>${body}</p>` : ''}
                        </div>
                        `
						: ''
				}
                        ${
					settings_store[id].extensions
						? html.node`
                        <div class="extensions">
                            ${
							settings_store[id].extensions.map(
								(extension) => () => {
									let container = html.node`
                                    <div class="extension">
                                        <div class="bleh-icon" />
                                    </div>
                                `;
									tippy(container, {
										content: tl(
											trans.requires_extension_value,
										).replace('{v}', tl(extension)),
									});
									return container;
								},
							)
						}
                        </div>
                        `
						: ''
				}
                        ${
					setting_incompatible_block(settings_store[id].incompatible)
				}
                        <div class="primary-selections">
                            ${
					Object.entries(settings_store[id].values).map(
						([key, val]) => {
							const icon = val.icon;

							const button = html.node`
                                        <div class="setting v2 standalone" data-type="radio" data-value=${key} onclick=${() => {
								update_radio(key);
							}}>
                                            <div class="radio-cont">
                                                <div class="radio" aria-checked=${
								value == key
							} />
                                            </div>
                                            ${
								icon
									? html.node`
                                                        <div class="icon">
                                                            <div class="bleh-icon" style="--icon: var(--${icon})" />
                                                        </div>
                                                    `
									: ''
							}
                                            <div class="heading">
                                                <h5>${
								typeof val.name == 'object'
									? tl(val.name)
									: val.name
							}</h5>
                                            </div>
                                        </div>
                                    `;

							buttons.push(button);
							return button;
						},
					)
				}
                        </div>
                    </div>
                ` as setting_element;
			} else {
				elem = html.node`
                    <button class="dropdown-menu-clickable-item v2 icon-r opens-further" data-hide=${hide_if_incompatible}>
                        ${
					icon
						? html.node`
                        <div class="icon">
                            <div class="bleh-icon" style="--icon: var(--${icon})" />
                        </div>
                        `
						: ''
				}
                        <div class="auth-dropdown-item-row">
                            <span class="auth-dropdown-item-left">
                                ${
					text
						? html.node`
                                <span class="menu-item-body">
                                    <strong class="menu-item-head">${html_title}</strong>
                                </span>
                                `
						: ''
				}
                            </span>
                            <span class="auth-dropdown-item-right">
                                <p ref=${(el) => value_holder = el}>${
					tl(settings_store[id].values[value as string].name)
				}</p>
                            </span>
                        </div>
                        ${
					setting_incompatible_block(settings_store[id].incompatible)
				}
                    </button>
                ` as setting_element;

				tippy(elem, {
					theme: 'context-menu',
					content: html.node`
                        ${
						Object.entries(settings_store[id].values).map(
							([key, val]) => {
								const icon = val.icon;

								const button = html.node`
                                    <button class="dropdown-menu-clickable-item radio-menu-item" aria-checked=${
									value == key
								} data-value=${key} onclick=${() => {
									update_radio(key);
								}}>
                                        ${
									icon
										? html.node`
                                                    <div class="icon">
                                                        <div class="bleh-icon" style="--icon: var(--${icon})" />
                                                    </div>
                                                `
										: ''
								}
                                        ${tl(val.name)}
                                    </button>
                                `;

								buttons.push(button);
								return button;
							},
						)
					}
                        ${
						body
							? html
								.node`<p class="menu-item-description">${body}</p>`
							: ''
					}
                    `,
					placement: 'right',
					interactive: true,
					interactiveBorder: 10,
					appendTo: document.body,
					popperOptions: {
						modifiers: [
							{
								name: 'preventOverflow',
								options: {
									padding: 20,
								},
							},
						],
					},

					onShow(instance) {
						instance.popper.addEventListener('click', (event) => {
							instance.hide();
						});
					},
				});
			}

			elem.compat = () => {
				elem.removeAttribute('disabled');

				if (incompatible_with) {
					Object.entries(incompatible_with).forEach(([key, val]) => {
						if (Array.isArray(val)) {
							if (val.includes(settings[key])) {
								elem.setAttribute('disabled', 'true');
							}
						} else {
							if (
								JSON.stringify(val) ==
									JSON.stringify(settings[key])
							) {
								elem.setAttribute('disabled', 'true');
							}
						}
					});
				} else if (requires) {
					const all_met = Object.entries(requires).every(
						([key, val]) => {
							if (Array.isArray(val)) {
								return val.includes(settings[key]);
							} else {
								return JSON.stringify(val) ==
									JSON.stringify(settings[key]);
							}
						},
					);

					if (!all_met) {
						elem.setAttribute('disabled', 'true');
					}
				}
			};

			elem.compat();

			tippy(reset_btn, {
				content: tl(trans.reset),
			});

			function update_radio(val) {
				save_setting(id, val);

				elem.setAttribute(
					'data-modified',
					(val != settings_store[id].default).toString(),
				);

				buttons.forEach((btn) => {
					let target = btn.querySelector('.radio');
					if (!target) target = btn;

					target.setAttribute(
						'aria-checked',
						btn.getAttribute('data-value') == val,
					);
				});

				if (value_holder) {
					value_holder.textContent = tl(
						settings_store[id].values[val].name,
					);
				}

				if (func) func(val);
			}

			function reset_radio() {
				update_radio(settings_store[id].default);
				status({
					title: tl(trans.reset_item_to_default),
				});
			}

			return elem;
		} else if (type == 'list') {
			if (!list && settings_store[id].predefined) {
				return setting_fail(id, {
					message:
						'List type requires you to pass available items for matching.',
				});
			}

			let lists;

			const elem = html.node`
                <div class="setting v2" data-type="list" id="setting_${id}">
                    ${
				icon
					? html.node`
                    <div class="icon">
                        <div class="bleh-icon" style="--icon: var(--${icon})" />
                    </div>
                    `
					: ''
			}
                    ${
				text
					? html.node`
                    <div class="heading">
                        <h5>${html_title}</h5>
                        ${body ? html.node`<p>${body}</p>` : ''}
                    </div>
                    `
					: ''
			}
                    <div class="setting-lists" ref=${(el) => (lists = el)} />
                </div>
            ` as setting_element;

			elem.compat = () => {
				if (!incompatible_with) return;

				elem.setAttribute('disabled', 'false');

				Object.entries(incompatible_with).forEach(([key, val]) => {
					if (Array.isArray(val)) {
						if (val.includes(settings[key])) {
							elem.setAttribute('disabled', 'true');
						}
					} else {
						if (
							JSON.stringify(val) == JSON.stringify(settings[key])
						) {
							elem.setAttribute('disabled', 'true');
						}
					}
				});
			};

			elem.compat();

			render_list_items(value);

			function render_list_items(current = settings[id]) {
				let available = current;
				if (settings_store[id].predefined) {
					available = Object.fromEntries(
						Object.entries(list).filter(
							([key]) => !current.includes(key),
						),
					);
				}

				render(
					lists,
					html`
						${current.map((val, i) => {
							const elem = html.node`
                            <div class="setting-list-item current" data-host=${
								list[val]?.host
							}>
                                ${
								list[val]?.icon != null
									? html.node`
                                <div class="bleh-icon" data-type=${
										list[val].icon
									} />
                                `
									: ''
							}
                                <div class="info">
                                    ${list[val]?.name || val}
                                    ${
								list[val]?.new_release ? new_indicator() : ''
							}
                                </div>
                                <button class="btn chibi icon setting-list-item-btn" data-type="minus" onclick=${() => {
								const new_list = current.filter(
									(item) => item != val,
								);

								save_setting(id, new_list);
								render_list_items(new_list);

								if (func) func(new_list);
							}}>
                                    ${tl(trans.remove)}
                                </button>
                            </div>
                        `;

							const tip = tippy(elem, {
								content: html.node`
                                <div class="setting-list-buttons">
                                    <button class="btn chibi icon setting-list-item-btn big" data-type="prev" disabled=${
									i == 0
								} onclick=${() => {
									if (i == 0) return;

									const new_list = [...current];
									[new_list[i - 1], new_list[i]] = [
										new_list[i],
										new_list[i - 1],
									];

									save_setting(id, new_list);
									render_list_items(new_list);

									if (func) func(new_list);

									tip.hide();
								}}>
                                        ${tl(trans.move_up)}
                                    </button>
                                    <button class="btn chibi icon setting-list-item-btn big" data-type="next" disabled=${
									i == current.length - 1
								} onclick=${() => {
									if (i == current.length - 1) return;

									const new_list = [...current];
									[new_list[i + 1], new_list[i]] = [
										new_list[i],
										new_list[i + 1],
									];

									save_setting(id, new_list);
									render_list_items(new_list);

									if (func) func(new_list);

									tip.hide();
								}}>
                                        ${tl(trans.move_down)}
                                    </button>
                                </div>
                            `,
								interactive: true,
								appendTo: document.body,
							});

							return elem;
						})}
						${!settings_store[id].predefined
							? () => {
								const button = html.node`
                            <div class="setting-list-item current">
                                <div class="info">
                                    ${tl(trans.add)}
                                </div>
                                <button class="btn chibi icon setting-list-item-btn" data-type="plus">
                                    ${tl(trans.add)}
                                </button>
                            </div>
                        `;

								let input_box;

								const tooltip = tippy(button, {
									theme: 'window',
									content: html.node`
                                ${input_box = input({
										focus: true,
										func: complete_add,
										warn_if_matches_auth: settings_store[id]
											.warn_if_matches_auth,
										warn_if_empty: true,
									})}
                            `,
									placement: 'bottom',
									interactive: true,
									interactiveBorder: 10,
									trigger: 'click',
									appendTo: document.body,

									onShow() {
										input_box.focus();
									},
								});

								function complete_add(val) {
									if (val == auth.name || val.length < 1) {
										return;
									}

									tooltip.destroy();

									const new_list = [...current, val];
									save_setting(id, new_list);
									render_list_items(new_list);

									if (func) func(new_list);
								}

								return button;
							}
							: ''}
						${settings_store[id].predefined
							? html.node`
                        ${
								Object.entries(available).map(
									([val, formal]) => {
										return html.node`
                                <div class="setting-list-item" data-host=${formal.host}>
                                    ${
											formal.icon
												? html.node`
                                        <div class="bleh-icon" data-type=${formal.icon} />
                                    `
												: ''
										}
                                    <div class="info">
                                        ${formal.name}
                                        ${
											formal.new_release
												? new_indicator()
												: ''
										}
                                    </div>
                                    <button class="btn chibi icon setting-list-item-btn" data-type="plus" onclick=${() => {
											const new_list = [...current, val];

											save_setting(id, new_list);
											render_list_items(new_list);

											if (func) func(new_list);
										}}>
                                        ${tl(trans.add)}
                                    </button>
                                </div>
                            `;
									},
								)
							}
                    `
							: ''}
					`,
				);
			}

			return elem;
		} else if (type == 'select') {
			if (!list) {
				return setting_fail(id, {
					message:
						'Select type requires you to pass available items.',
				});
			}

			if (func) func(value);

			let reset_btn;

			let menu;

			if (list.length == 0) disabled = true;

			let select_hook;

			let elem = html.node`
                <div class="setting v2" data-type="select" disabled=${disabled} data-hide=${hide_if_incompatible} id="setting_${id}" data-modified=${
				value != settings_store[id].default
			}>
                    ${
				icon
					? html.node`
                    <div class="icon">
                        <div class="bleh-icon" style="--icon: var(--${icon})" />
                    </div>
                    `
					: ''
			}
                    ${
				text
					? html.node`
                    <div class="heading">
                        <h5>${html_title}<button class="btn reset" ref=${(
						el,
					) => (reset_btn = el)} onclick=${() => reset_select()}>${
						tl(trans.reset)
					}</button></h5>
                        ${body ? html.node`<p>${body}</p>` : ''}
                    </div>
                    `
					: ''
			}
                    ${
				settings_store[id].extensions
					? html.node`
                    <div class="extensions">
                        ${
						settings_store[id].extensions.map(
							(extension) => () => {
								let container = html.node`
                                <div class="extension">
                                    <div class="bleh-icon" />
                                </div>
                            `;
								tippy(container, {
									content: tl(
										trans.requires_extension_value,
									).replace('{v}', tl(extension)),
								});
								return container;
							},
						)
					}
                    </div>
                    `
					: ''
			}
                    ${
				setting_incompatible_block(settings_store[id].incompatible)
			}
                    <div class="select-hook" ref=${(el) => select_hook = el} />
                </div>
            ` as setting_element;

			render_select();

			function render_select(use_list = list, use_value = value) {
				render(
					select_hook,
					html`
						${menu = select({
							values: use_list,
							initial: use_value,
							func: (val: string) => {
								update_select(val);
							},
							in_settings: true,
						})}
					`,
				);
			}

			elem.update = (new_list) => {
				const new_value = settings[id];

				render_select(new_list, new_value);
			};

			elem.compat = () => {
				if (!incompatible_with) return;

				elem.setAttribute('disabled', 'false');

				Object.entries(incompatible_with).forEach(([key, val]) => {
					if (Array.isArray(val)) {
						if (val.includes(settings[key])) {
							elem.setAttribute('disabled', 'true');
						}
					} else {
						if (
							JSON.stringify(val) == JSON.stringify(settings[key])
						) {
							elem.setAttribute('disabled', 'true');
						}
					}
				});
			};

			elem.compat();

			tippy(reset_btn, {
				content: tl(trans.reset),
			});

			function update_select(val) {
				if (!elem) return;

				save_setting(id, val);

				elem.setAttribute(
					'data-modified',
					val != settings_store[id].default,
				);

				if (func) func(val);
			}

			function reset_select() {
				menu.value = settings_store[id].default;
				status({
					title: tl(trans.reset_item_to_default),
				});
			}

			return elem;
		}
	} catch (e) {
		console.error(e);
		return setting_fail(id, e);
	}

	return setting_fail(id);
}

function error_input(reason, input, tooltip, submit) {
	log(reason, 'input', 'log');
	input.setAttribute('data-has-error', 'true');
	tooltip.setContent(reason);
	tooltip.enable();
	tooltip.show();
	submit.disabled = true;
}

function setting_incompatible_block(entries) {
	if (!entries) return '';

	// wip
	return '';

	return html.node`
        <div class="incompatible">
            ${
		entries.map((incompatible) => () => {
			let container = html.node`
                    <div class="extension">
                        <div class="bleh-icon" />
                    </div>
                `;
			tippy(container, {
				content: tl(trans.incompatible_with_value).replace(
					'{v}',
					tl(settings_store[incompatible.setting].title),
				),
			});
			return container;
		})
	}
        </div>
    `;
}

function setting_fail(id, e = null) {
	if (e && e.unavailable && e.message) {
		return html.node`
            <div class="setting">
                <div class="alert alert-info no-margin">
                    ${e.message}
                </div>
            </div>
        `;
	}

	return html.node`
        <div class="setting">
            <div class="alert alert-error no-margin">
                ${tl(trans.value_failed_to_load).replace('{v}', id)}
                ${e && e.message ? html`<br />${e.message}` : ''}
            </div>
        </div>
    `;
}

function update_text(
	id,
	input,
	submit,
	option,
	value,
	reset_btn,
	avatar,
	silent = false,
) {
	// wait on response to allow inputs
	if (settings_store[id].wait) {
		reset_btn.disabled = true;
		input.disabled = true;
		submit.disabled = true;
	}

	input.value = value;
	option.setAttribute('data-modified', value != settings_store[id].default);

	if (id == 'hu_tao') {
		if (value == 'develop') {
			dialog_rm({ id: 'hu_tao' });
			change_settings_page('sku');
			notify({
				id: 'unlocked',
				title: tl(trans.development),
				body: tl(trans.unlocked),
				type: 'success',
			});
		}
	}

	save_setting(id, value);
}
function reset_text(id, input, submit, option, reset_btn, avatar) {
	update_text(
		id,
		input,
		submit,
		option,
		settings_store[id].default,
		reset_btn,
		avatar,
		true,
	);
	notify({
		id: 'reset_setting',
		title: tl(trans.settings),
		body: tl(trans.reset_item_to_default),
		icon: 'icon-16-settings',
	});
}

export function save_setting(id: string, value: setting_value) {
	const store = settings_store[id] || {};
	const type = store.type || 'toggle';

	settings[id] = value;

	if (!other_setting_types.includes(type) && store.bubble) {
		document.body.setAttribute(`data-bleh--${id}`, value.toString());
	}

	if (id == 'theme') {
		if (['light', 'ink'].includes(value as string)) {
			settings.theme_type = 'light';
		} else {
			settings.theme_type = 'dark';
		}

		document.body.setAttribute(
			`data-bleh--theme_type`,
			settings.theme_type,
		);

		chart_reflow();
	}

	document.body.classList.toggle(
		'increase-btn-contrast',
		settings.lit <= 0.3,
	);

	// if using a seasonal default,
	// do not apply the colour
	if (['hue', 'sat', 'lit'].includes(id)) {
		if (
			settings.hue == settings_store.hue.default &&
			settings.sat == settings_store.sat.default &&
			settings.lit == settings_store.lit.default
		) {
			document.body.style.removeProperty(`--${settings_store.hue.css}`);
			document.body.style.removeProperty(`--${settings_store.sat.css}`);
			document.body.style.removeProperty(`--${settings_store.lit.css}`);
			document.body.classList.remove('increase-btn-contrast');
		} else {
			document.body.style.setProperty(
				`--${settings_store.hue.css}`,
				settings.hue,
			);
			document.body.style.setProperty(
				`--${settings_store.sat.css}`,
				settings.sat,
			);
			document.body.style.setProperty(
				`--${settings_store.lit.css}`,
				settings.lit,
			);
		}
	} else if (value == store.default) {
		document.body.style.removeProperty(`--${store.css}`);
	} else if (store.css) {
		document.body.style.setProperty(
			`--${store.css}`,
			`${value}${store.suffix || ''}`,
		);
	}

	seasonal_colour_switch();

	if (
		store.require_reload == true ||
		(store.require_reload == 'partial' &&
			page.type != 'bleh_settings')
	) {
		request_reload();
	}

	compile_settings();
	log(`saved ${id} as ${value}`, 'settings', 'log', {
		settings: settings,
		settings_id: settings[id],
	});
}

export function seasonal_colour_switch() {
	const has_user_accent = document.body.style.getPropertyValue('--hue-album');

	document.body.setAttribute(
		'data-seasonal-accent',
		settings.hue == 255 &&
			settings.sat == 1 &&
			settings.lit == 1 &&
			!has_user_accent,
	);
}

export function compile_settings() {
	let clone = structuredClone(settings);

	for (let s in clone) {
		console.log('settings marin before loop', s, clone[s], typeof clone[s]);
	}

	for (let setting in clone) {
		if (
			settings_store[setting] &&
			JSON.stringify(clone[setting]) ===
				JSON.stringify(settings_store[setting].default) &&
			setting != 'version'
		) {
			log(
				`dropped ${setting} as value matches default`,
				'settings',
				'log',
				{
					value: clone[setting],
					default: settings_store[setting].default,
				},
			);
			delete clone[setting];
		}
	}

	clone.version = version.build;

	for (const s in clone) {
		console.log(
			'settings marin before stringify',
			s,
			clone[s],
			typeof clone[s],
		);
	}

	set_storage('bleh', JSON.stringify(clone));

	return clone;
}
