//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { html } from 'lighterhtml';
import tippy from 'tippy.js';
import { tl, trans } from '../build/trans';
import { ff } from '../sku';
import { log } from '../build/log';
import { copy } from '../build/tools';
import { settings } from '../build/config';

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
                    right: e.clientX
                })
            });

            menu.show();
        },
        true
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
        }
    });

    document.addEventListener('contextmenu', (e) => {
        if (!show_menu(e)) return;

        e.preventDefault();

        const elem = e.target;
        const value = elem.value?.trim();
        const is_image = elem.tagName == 'IMG';
        const link = elem.href;
        const unsafe_link = elem.getAttribute('data-unsafe-href');

        const text = elem.textContent?.trim();
        const valid_for_text = ['TEXTAREA', 'INPUT'].includes(elem.tagName);

        log('requesting', 'menu', 'log', {
            text, value, elem, tag: elem.tagName, is_image, link, unsafe_link, valid_for_text
        });

        const contents = html.node`
            ${is_image ? html.node`
                ${unsafe_link ? html.node`
                    <div class="button-combo">
                        <a class="dropdown-menu-clickable-item" data-type="image" href=${elem.src} target="_blank">
                            ${tl(trans.view_image)}
                        </a>
                        <div class="button-combo-sep" />
                        ${() => {
                            const btn = html.node`
                                <a class="dropdown-menu-clickable-item chibi" data-type="continue" href=${unsafe_link} target="_blank">
                                    ${tl(trans.view_image_unsafe)}
                                </a>
                            `;

                            tippy(btn, {
                                content: btn.textContent
                            });

                            return btn;
                        }}
                    </div>
                ` : html.node`
                    <a class="dropdown-menu-clickable-item" data-type="image" href=${image.src} target="_blank">
                        ${tl(trans.view_image)}
                    </a>
                `}
                <a class="dropdown-menu-clickable-item" data-type="copy" onclick=${() => {
                    copy(unsafe_link ? unsafe_link : elem.src);
                }}>
                    ${tl(trans.copy_link)}
                </a>
            ` :   ''}
            ${link ? html.node`
                <a class="dropdown-menu-clickable-item" data-type="link" href=${link} target=${elem.target}>
                    ${tl(trans.open_link)}
                </a>
                <a class="dropdown-menu-clickable-item" data-type="copy" onclick=${() => {
                    copy(link);
                }}>
                    ${tl(trans.copy_link)}
                </a>
            ` :   ''}
            ${text && valid_for_text ? html.node`
                <a class="dropdown-menu-clickable-item" data-type="copy" onclick=${() => {
                    copy(text);
                }}>
                    ${tl(trans.copy_text)}
                </a>
            ` : value && valid_for_text ? html.node`
                <a class="dropdown-menu-clickable-item" data-type="copy" onclick=${() => {
                    copy(value);
                }}>
                    ${tl(trans.copy_text)}
                </a>
            ` : ''}
        `;

        if (
            ![...contents.childNodes].some(
                (node) => node.nodeType == Node.ELEMENT_NODE
            )
        )
            return;

        menu.setProps({
            getReferenceClientRect: () => ({
                width: 0,
                height: 0,
                top: e.clientY,
                bottom: e.clientY,
                left: e.clientX,
                right: e.clientX
            })
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
