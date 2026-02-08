//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { html } from 'lighterhtml';
import { page } from '../../build/page';

export function load_status() {
    if (!page.structure.status) {
        let notification_host = html.node`
            <div class="status-alerts" />
        `;
        page.structure.status = notification_host;
        document.body.appendChild(notification_host);
    }
}

export function status({ title, body, type }) {
    let icon = 'icon-16-info';

    if (type == 'error') {
        icon = 'icon-16-x';
    }

    const alert = html.node`
        <div class="status-alert colourful colourful-bg" onclick=${() => status_remove()}>
            <div class="status-icon">
                <div class="bleh-icon" style="--icon: var(--${icon})" />
            </div>
            <div class="status-title">${title}</div>
            ${body ? html.node`<div class="status-body">${body}</div>` : ''}
        </div>
    `;

    setTimeout(() => {
        status_remove();
    }, 3000);

    page.structure.status.appendChild(alert);

    return alert;

    function status_remove() {
        alert.classList.add('hiding');

        setTimeout(() => {
            alert.remove();
        }, 150);
    }
}
