//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { patch_avatar, style_name_from_badge } from './avatar';
import { settings } from './build/config';
import { log } from './build/log';
import { auth, page, shout_parse_queue } from './build/page';
import { tl, trans } from './build/trans';
import { notify } from './components/notify';
import { html, render } from 'lighterhtml';
import { setting } from './components/settings.js';
import {
    markdown,
    markdown_field,
    markdown_preview,
    markdown_prompt
} from './components/markdown.js';
import { copy, romanise } from './build/tools.js';
import tippy from 'tippy.js';
import { keybind } from './components/rabbit.js';
import { correct_artist, correct_item_by_artist } from './components/lotus.js';

export function patch_shouts() {
    if (!page.structure.main) return;

    let shout_controls = page.structure.main.querySelector(
        '.shoutbox-controls-wrapper:not([data-shouts])'
    );
    if (shout_controls) {
        shout_controls.setAttribute('data-shouts', 'true');
        shout_header(shout_controls);
    }

    let shouts = page.structure.main.querySelectorAll(
        '.shout:not([data-kate-processed])'
    );

    shouts.forEach((shout, index) => {
        try {
            shout.setAttribute('data-kate-processed', 'true');
            shout.style.setProperty('--delay', index * 0.04 + 's');

            let shout_name = shout.querySelector('.shout-user a');
            if (!shout_name) return;

            let shout_name_text = shout_name.textContent;
            shout_name.textContent = `@${shout_name_text}`;

            let shout_avatar = shout.querySelector('.shout-user-avatar');

            let badge = patch_avatar(shout_avatar, shout_name_text, 'shout');

            if (badge) {
                if (badge.type && badge.type == 'avatar-status-dot--staff')
                    shout.classList.add('staff-shout');

                style_name_from_badge(shout_name, badge);
            }

            const shout_body = shout.querySelector('.shout-body p');
            const shout_text = shout_body.textContent.trim();
            if (settings.shout_markdown) {
                shout_parse_queue.push({ element: shout_body });
            }

            const indicator = html.node`
                <div class="shout-vote-indicator colourful" aria-checked="false" />
            `;
            shout.appendChild(indicator);

            // timestamp
            let shout_timestamp = shout.querySelector('.shout-timestamp time');
            if (shout_timestamp) {
                tippy(shout_timestamp, {
                    content: shout_timestamp.getAttribute('title')
                });

                shout_timestamp.removeAttribute('title');
            }

            let actions = shout.querySelectorAll(
                '.shout-actions .shout-action'
            );
            actions.forEach((action) => {
                let buttons = action.querySelectorAll('button, a');
                buttons.forEach((button) => {
                    button.classList.add('shout-action-button', 'see-more');
                });
            });

            // detect vote status
            const form = shout.querySelector('.vote-button-toggle');

            const voted_button = form.querySelector('.vote-button--voted');
            const unvote_button = form.querySelector(
                '.vote-button:not(.vote-button--voted)'
            );

            if (!voted_button || !unvote_button) return;

            // if the ALREADY VOTED button changes to MODIFIED STATE when clicked,
            // that means the server gave us a shout that is ALREADY VOTED
            const initial_is_voted =
                voted_button.getAttribute('data-ajax-form-sets-state') ==
                'modified-state';

            indicator.setAttribute('aria-checked', initial_is_voted.toString());

            voted_button.addEventListener('click', (e) => vote_button());
            unvote_button.addEventListener('click', (e) => vote_button());

            function vote_button() {
                setTimeout(() => {
                    const modified =
                        form.getAttribute('data-ajax-form-state') ==
                        'modified-state';
                    const current_is_voted = initial_is_voted != modified;

                    indicator.setAttribute(
                        'aria-checked',
                        current_is_voted.toString()
                    );
                }, 0);
            }

            const menu = shout.querySelector('.shout-more-actions-menu');

            const buttons = menu.querySelectorAll('button');
            buttons.forEach((button) => {
                const type = button.classList[1];
                if (type == 'more-item--delete') {
                    button.textContent = tl(trans.delete);
                } else if (type == 'more-item--report') {
                    button.textContent = tl(trans.report);
                }
            });

            menu.insertBefore(
                html.node`
                <button class="dropdown-menu-clickable-item" data-type="copy" onclick=${() => {
                    copy(shout_text);
                }}>
                    ${tl(trans.copy)}
                </button>
                <div class="sep" />
            `,
                menu.firstElementChild
            );

            let send_button = shout.querySelector('.form-group--submit');
            shout_send(send_button);
        } catch (e) {
            notify({
                id: 'shout',
                title: tl(trans.shouts),
                body: 'Failed to be modified :(',
                type: 'error',
                icon: 'icon-16-shoutbox'
            });
            log('failed to modify', 'shout', 'error', { error: e });
        }
    });

    if (settings.shout_markdown && shout_parse_queue.length > 0)
        parse_shout_queue();

    // enter a shout field
    const shout_forms = document.querySelectorAll('.shout-form:not([data-kate-processed])');
    shout_forms.forEach((shout_form) => {
        shout_form.setAttribute('data-kate-processed', 'true');
        let shout_avatar = shout_form.querySelector('.shout-user-avatar');

        patch_avatar(shout_avatar, auth.name);

        let send_button = shout_form.querySelector('.form-group--submit');
        shout_send(send_button);

        const help_text = shout_form.querySelector('.form-row-help-text');
        help_text.classList.add('dual-tip');

        const legacy_textarea = shout_form.querySelector('textarea');

        let placeholder = legacy_textarea.placeholder;
        if (placeholder.includes(auth.name)) {
            if (page.type == 'user') {
                placeholder = tl(trans.shoutbox_placeholder_user, {
                    u: auth.name,
                    v: page.name
                });
            } else {
                placeholder = tl(trans.shoutbox_placeholder, {
                    u: auth.name,
                    v: page.type == 'artist' ? romanise(correct_artist(page.name)) : ['album', 'track'].includes(page.type) ? romanise(correct_item_by_artist(page.name, page.sister)) : page.name
                });
            }
        }

        const textarea = markdown_field((val) => {
            chars.textContent = tl(trans.value_characters_max, {
                v: `${val.length}/1000`
            });
            chars.setAttribute('data-exceeded', val.length >= 1000);

            preview.setAttribute('disabled', val.length <= 0);
        }, {}, '', 'body', null, null, placeholder, legacy_textarea.maxLength, true);

        legacy_textarea.replaceWith(textarea);

        let chars;
        let preview;
        render(help_text, html`
            <div class="tip preview" onclick=${() => markdown_preview(textarea.value())} ref=${(el) => (preview = el)} disabled="true">
                ${tl(trans.preview)}
            </div>
            <div class="tip characters" ref=${(el) => (chars = el)}>
                ${tl(trans.value_characters_max, { v: '0/1000' })}
            </div>
        `);

        shout_form.addEventListener('keydown', (e) => {
            // CTRL + ENTER
            if (e.ctrlKey && e.keyCode == 13) {
                e.preventDefault();

                send_button.querySelector('.btn-post-shout').click();
                notify({
                    id: 'shout',
                    title: tl(trans.shouts),
                    body: tl(trans.sent),
                    icon: 'icon-16-shoutbox'
                });
            }
        });
    });
}

function shout_send(send_button) {
    if (!send_button) return;

    let button = send_button.querySelector('.btn-post-shout');
    if (!button) return;

    button.classList.add('btn-send-shout-generic');
    button.textContent = tl(trans.send);
    button.removeAttribute('disabled');

    if (page.mobile) return;

    tippy(button, {
        content: tl(trans.send_quickly_with).replace(
            '{kbd}',
            keybind(['⌘', '⏎']).outerHTML
        ),
        allowHTML: true,
        delay: [500, 0]
    });
}

export function shout_header(shout_controls) {
    let panel;
    let settings_btn;

    if (page.subpage == 'shoutbox_shout') {
        panel = page.structure.main.querySelector(':scope > section');

        let link = window.location.href;

        panel.insertBefore(
            html.node`
            <div class="top-container">
                <h2>
                    <a class="text-colour-link" href=${link}>${tl(trans.shouts)}</a>
                </h2>
                <div class="accompany view-buttons blend blend-v2">
                    <p class="notice">${tl(trans.single_shout)}</p>
                </div>
                <div class="view-buttons blend blend-v2">
                    <button class="left-icon blend-v2-btn" data-type="settings" ref=${(el) => (settings_btn = el)}>
                        ${tl(trans.settings)}
                    </button>
                </div>
            </div>
        `,
            panel.firstElementChild
        );
    } else if (shout_controls) {
        panel = shout_controls.parentElement;

        let select_btn = panel.querySelector('.dropdown-menu-clickable-button');

        let header = panel.querySelector('h2');
        if (header) header.parentElement.removeChild(header);

        let link = window.location.href;
        let shoutbox_link = '+shoutbox';
        if (page.type == 'user' || page.type == 'event')
            shoutbox_link = 'shoutbox';

        if (!page.subpage.startsWith('shoutbox')) link += `/${shoutbox_link}`;

        panel.insertBefore(
            html.node`
            <div class="top-container">
                <h2>
                    <a class="text-colour-link" href=${link}>${tl(trans.shouts)}</a>
                </h2>
                ${
                    select_btn ?
                        html.node`
                    <div class="accompany view-buttons blend blend-v2">
                        ${() => {
                            select_btn.classList.add(
                                'select-button',
                                'link-select',
                                'blend-v2-btn'
                            );
                            select_btn.classList.remove(
                                'section-control',
                                'dropdown-menu-clickable-button'
                            );
                            return shout_controls;
                        }}
                    </div>
                `
                    :   ''
                }
                <div class="view-buttons blend blend-v2">
                    <button class="left-icon blend-v2-btn" data-type="settings" ref=${(el) => (settings_btn = el)}>
                        ${tl(trans.settings)}
                    </button>
                </div>
            </div>
        `,
            panel.firstElementChild
        );
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
        appendTo: document.body
    });

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
            `
        );
    }
}

export function parse_shout_queue() {
    if (shout_parse_queue.length == 0) return;

    const shout = shout_parse_queue.shift();

    const parsed = html.node`
        <div class="markdown-body">
            ${markdown(shout.element.textContent)}
        </div>
    `;

    shout.element.replaceWith(parsed);
    render(shout.element, html.node`${parsed}`);

    log('parsed one shout', 'shout', 'log');

    if (shout_parse_queue.length > 0) setTimeout(parse_shout_queue, 50);
}

export function shout_messages() {
    if (!page.structure.main) return;

    let alerts = page.structure.main.querySelectorAll(
        '.shout-messages > .alert'
    );
    alerts.forEach((alert) => {
        if (alert.classList.contains('alert-danger')) {
            // assume its the generic rate limit
            notify({
                id: 'shout',
                title: tl(trans.shouts),
                body: tl(trans.failed_to_send),
                type: 'error',
                icon: 'icon-16-shoutbox'
            });
        } else {
            return;
        }

        alert.remove();
    });
}
