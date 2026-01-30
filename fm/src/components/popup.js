import { html } from "lighterhtml";
import tippy from "tippy.js";
import { tl, trans, translation_fallback } from "../build/trans";
import { notify } from "./notify";
import { log } from "../build/log";

export let popup_queue = [];

export function queue_popup(key, host) {
    if (!host || !host.offsetParent) {
        log(`skipped adding ${key} as the host is not accessible (probably intentional)`, 'popup', 'info', { key, host });
        return;
    }

    popup_queue.push({ key, host });

    check_queue();
}

export function clear_popup_queue() {
    popup_queue = [];
}

function check_queue() {
    const first = popup_queue[0];
    if (!first) return;

    popup(first.key, first.host);
}

function popup(key, host) {
    const title = tl(trans[`popup_${key}`]?.title);
    const body = tl(trans[`popup_${key}`]?.body);

    if ([title, body].includes(translation_fallback)) {
        log(`popup_${key} not found in translations`, 'popup', 'error', { title, body, key, host });

        notify({
            id: 'popup_not_found',
            title: tl(trans.value_failed_to_load, { v: `${key} (popup)` }),
            body: `Missing title and/or body for translation key popup_${key}`,
            type: 'error'
        });
        popup_queue = popup_queue.filter(i => i.key != key);
        check_queue();

        return;
    }

    log(`registered for ${key}`, 'popup', 'info', { title, body, key, host });

    const tooltip = tippy(host, {
        theme: 'popup',
        content: html.node`
            <div class="popup-content">
                <small class="popup-sub">${tl(trans.tip)}</small>
                <strong class="popup-title">${title}</strong>
                <p class="popup-body">${body}</p>
            </div>
            <div class="popup-action">
                <button class="see-more" onclick=${() => {
                    popup_queue = popup_queue.filter(i => i.key != key);
                    tooltip.hide();

                    setTimeout(() => {
                        tooltip.destroy();
                    }, 500);

                    check_queue();
                }}>
                    ${tl(trans.got_it)}
                </button>
            </div>
        `,
        interactive: true,
        hideOnClick: false,
        appendTo: document.body,
        aria: {
            expanded: false
        },
        trigger: 'manual',
        zIndex: 998
    });

    tooltip.show();
}
