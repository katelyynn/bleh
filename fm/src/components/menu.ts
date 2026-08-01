//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { html } from 'lighterhtml';
import tippy from 'tippy.js';
import { tl, trans } from '@/build/trans';
import { ff } from '@/components/settings/sku';
import { log } from '@/build/log';
import { copy, paste, redo, undo } from '@/build/tools';
import { settings } from '@/build/config';
import { external_url_prompt } from '@/components/shared/markdown';

export function register_menu(element, menu) {
	element.setAttribute('data-has-bleh-menu', true);

	element.addEventListener(
		'contextmenu',
		(e) => {
			e.preventDefault();
			log('requested', 'menu', 'info', { e });

			menu.setProps({
				placement: 'right-start',
				offset: [0, 0],
				getReferenceClientRect: () => ({
					width: 0,
					height: 0,
					top: e.clientY,
					bottom: e.clientY,
					left: e.clientX,
					right: e.clientX,
				}),
			});

			menu.show();
		},
		true,
	);
}

export function page_menu() {
	if (!ff('menus') || !settings.menu_replacement) return;

	const menu = tippy(document.body, {
		theme: 'context-menu',
		placement: 'right-start',
		trigger: 'manual',
		interactive: true,
		interactiveBorder: 10,
		offset: [0, 0],
		appendTo: document.body,

		onShow(instance) {
			instance.popper.addEventListener('click', (event) => {
				instance.hide();
			});
		},
	});

	document.addEventListener('contextmenu', (e) => {
		if (!show_menu(e)) return;

		e.preventDefault();

		const elem: any = e.target;

		const value = elem.value?.trim();
		const is_image = elem.tagName == 'IMG';
		const link = elem.href;
		const unsafe_link = elem.getAttribute('data-unsafe-href');

		const src = elem.src;

		const text = elem.textContent?.trim();
		const valid_for_text = ['TEXTAREA', 'INPUT'].includes(elem.tagName);

		const alt = elem.getAttribute('alt')?.trim();

		const start = elem.selectionStart;
		const end = elem.selectionEnd;
		const selected = elem.value?.substring(start, end);

		log('requesting', 'menu', 'log', {
			text,
			value,
			elem,
			tag: elem.tagName,
			is_image,
			link,
			unsafe_link,
			valid_for_text,
		});

		const contents = html.node`
            ${
			is_image
				? html.node`
                ${
					unsafe_link
						? html.node`
                    <div class="button-combo">
                        <a class="dropdown-menu-clickable-item" data-type="image" href=${src} target="_blank">
                            ${tl(trans.view_image)}
                        </a>
                        <div class="button-combo-sep" />
                        ${() => {
							const url = new URL(unsafe_link);
							const scheme = url.protocol;
							const hostname = url.hostname;
							const path = url.pathname + url.search + url.hash;

							let dangerous = false;

							if (
								!scheme || !scheme.startsWith('http')
							) dangerous = true;

							const btn = html.node`
                                <button class="dropdown-menu-clickable-item chibi" data-type="continue" onclick=${() => {
								if (settings.trusted_sites.includes(hostname)) {
									open(unsafe_link, '_blank');
									return;
								}

								external_url_prompt(unsafe_link, dangerous);
							}}>
                                    ${tl(trans.view_image_unsafe)}
                                </button>
                            `;

							tippy(btn, {
								theme: 'name-sister-combo',
								content: html.node`
                                    <span class="name">
                                        <span class="link">
                                            ${
									scheme != 'https:'
										? html.node`
                                            <span class="scheme">
                                                ${scheme}//
                                            </span>
                                            `
										: ''
								}
                                            ${
									hostname
										? html.node`
                                            <span class="hostname">
                                                ${hostname}
                                            </span>
                                            `
										: html.node`
                                            <span class="hostname">
                                                ${path}
                                            </span>
                                            `
								}
                                            ${
									path != '/' && hostname
										? html.node`
                                            <span class="path">
                                                ${path}
                                            </span>
                                            `
										: ''
								}
                                        </span>
                                    </span>
                                    <span class="sister">${
									tl(trans.external)
								}</span>
                                `,
							});

							return btn;
						}}
                    </div>
                `
						: html.node`
                    <a class="dropdown-menu-clickable-item" data-type="image" href=${src} target="_blank">
                        ${tl(trans.view_image)}
                    </a>
                `
				}
                <a class="dropdown-menu-clickable-item" data-type="link" onclick=${() => {
					copy(unsafe_link ? unsafe_link : src);
				}}>
                    ${tl(trans.copy_link)}
                </a>
                ${
					alt
						? html.node`
                    <a class="dropdown-menu-clickable-item" data-type="copy" onclick=${() => {
							copy(alt);
						}}>
                        ${tl(trans.copy_text)}
                    </a>
                `
						: ''
				}
            `
				: ''
		}
            ${link ? generic_link_menu(link) : ''}
            ${
			valid_for_text
				? html.node`
                <a class="dropdown-menu-clickable-item" data-type="undo" onclick=${() => {
					undo();
				}}>
                    ${tl(trans.undo)}
                </a>
                <a class="dropdown-menu-clickable-item" data-type="redo" onclick=${() => {
					redo();
				}}>
                    ${tl(trans.redo)}
                </a>
            `
				: ''
		}
            ${
			valid_for_text
				? html.node`
                <a class="dropdown-menu-clickable-item" data-type="cut" onclick=${() => {
					document.execCommand('cut');
				}}>
                    ${tl(trans.cut)}
                </a>
                <a class="dropdown-menu-clickable-item" data-type="copy" onclick=${() => {
					if (selected) copy(selected, true);
					else if (value) copy(value, true);
				}}>
                    ${tl(trans.copy)}
                </a>
                <a class="dropdown-menu-clickable-item" data-type="paste" onclick=${() => {
					paste(elem, true);
				}}>
                    ${tl(trans.paste)}
                </a>
            `
				: ''
		}
        `;

		if (
			![...contents.childNodes].some(
				(node) => node.nodeType == Node.ELEMENT_NODE,
			)
		) {
			return;
		}

		menu.setProps({
			// @ts-ignore
			getReferenceClientRect: () => ({
				width: 0,
				height: 0,
				top: e.clientY,
				bottom: e.clientY,
				left: e.clientX,
				right: e.clientX,
			}),
		});

		menu.setContent(contents);

		menu.show();
	});
}

function show_menu(e) {
	const target = e.target;
	console.info('menu target', target);

	if (target.closest('[data-has-bleh-menu]')) return false;

	return true;
}

export function generic_link_menu(link: string, copy_link: string = link) {
	return html.node`
        <a class="dropdown-menu-clickable-item" data-type="web" href=${link} target="_blank">
            ${tl(trans.open_link)}
        </a>
        <a class="dropdown-menu-clickable-item" data-type="link" onclick=${() => {
		copy(copy_link);
	}}>
            ${tl(trans.copy_link)}
        </a>
    `;
}
