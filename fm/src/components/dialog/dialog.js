//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { html, render } from 'lighterhtml';
import { log } from '../build/log';
import { dialogs, page } from '../build/page';

export function load_dialogs() {
    let dialogs = document.createElement('div');
    dialogs.classList.add('bleh-modals');

    document.body.appendChild(dialogs);

    page.structure.dialogs = dialogs;
}

/**
 * Present a fullscreen dialog to the user
 * @param {string} id - Exclusive id for future reference
 * @param {string} title - Dialog title
 * @param {string} subtitle - Dialog subtitle (placed below main title)
 * @param {HTMLElement} body - Inner contents of dialog, use html.node`` to create
 * @param {boolean} dismiss - Allows the user to dismiss with the close button or by clicking out
 * @param {string} type - Applies a data-modal-type=${type} tag to the dialog instance
 * @param has_overlays
 * @param {boolean} replace - Replaces a specific dialog id
 * @param {boolean} replace_if_possible - Automatically replaces the dialog prior if it exists
 * @param {string} replace_id - Dialog id to replace (requires replace=true)
 * @param {boolean} allow_scroll - Automatically style this dialog to scroll if necessary
 * @param {boolean} colourful - Allow custom colouring (links only)
 * @param {boolean} colourful_bg - Allow custom colouring (background only)
 * @returns {HTMLElement} - Dialog instance
 */
export function dialog({
    id = '',
    title,
    subtitle,
    body = html.node``,
    dismiss = true,
    type = '',
    has_overlays = true,
    replace = false,
    replace_if_possible = true,
    replace_id = '',
    allow_scroll = false,
    colourful = false,
    colourful_bg = false,
    handle_escape_manually = false
}) {
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
        handle_escape_manually: handle_escape_manually
    });

    if (replace && replace_if_possible) replace_if_possible = false;

    if (replace_if_possible && Object.keys(dialogs).length > 0) {
        replace = true;

        for (let dialog in dialogs) {
            replace_id = dialog;
            break;
        }
    }

    let modal = html.node`
        <div
        class=${[
            'bleh-modal',
            colourful ? 'colorful' : '',
            colourful_bg ? 'colourful-bg' : ''
        ].join(' ')}
        role="dialog"
        data-modal-id=${id}
        data-modal-has-overlays=${has_overlays}
        data-modal-type=${type}
        />
    `;

    if (title) {
        modal.setAttribute('aria-labelledby', 'modal_title');
        modal.appendChild(html.node`
            <div class="bleh-modal-title" id="modal_title">
                <h1>${title}</h1>
                ${subtitle ? html.node`<p class="bleh-modal-subtitle">${subtitle}</p>` : ''}
            </div>
        `);
    }

    if (dismiss) {
        let modal_close = document.createElement('button');
        modal_close.classList.add('modal-close-button');
        modal_close.setAttribute('onclick', `_dialog_rm({id: "${id}"})`);

        modal.appendChild(modal_close);

        // allow clicking out of the modal to close
        page.structure.dialogs.setAttribute(
            'onclick',
            '_dialog_rm({all: true, modal_bg: true})'
        );
    } else {
        page.structure.dialogs.removeAttribute('onclick');
    }

    if (dismiss && !handle_escape_manually) {
        document.addEventListener('keydown', (e) => {
            if (e.key == 'Escape') {
                dialog_rm({ id: id });
            }
        });
    }

    let modal_body = document.createElement('div');
    modal_body.classList.add('bleh-modal-body');
    modal_body.setAttribute('data-allow-scroll', allow_scroll);

    modal_body.appendChild(body);

    modal.appendChild(modal_body);

    dialogs[id] = {
        instance: modal
    };

    if (replace || (!replace && dialogs.hasOwnProperty(replace_id))) {
        log(`window set to replace ${replace_id}`, 'window');

        dialog_rm({ id: replace_id });
        delete dialogs[replace_id];
    }

    page.structure.dialogs.appendChild(modal);
    page.structure.dialogs.classList.add('has-dialog');

    return modal;
}
unsafeWindow._dialog_rm = function ({
    id = null,
    all = false,
    modal_bg = false
}) {
    dialog_rm({
        id: id,
        all: all,
        modal_bg: modal_bg
    });
};
export function dialog_rm({ id, all = false, modal_bg = false }) {
    if (all) {
        // prevents clicks inside modal being broken
        if (modal_bg) {
            console.log(event);
            if (event.target.classList[0] != 'bleh-modals') return;
        }

        log('requested kill all', 'window');
        console.info(dialogs);
        for (let dialog in dialogs) {
            dialog_rm({
                id: dialog
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
