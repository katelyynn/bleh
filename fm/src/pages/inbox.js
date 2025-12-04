//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import {patch_avatar, return_name_from_avatar} from "../avatar";
import {log} from "../build/log";
import {auth, page} from "../build/page";
import {sanitise} from "../build/tools";
import {checkup_page_structure} from "../components/structure";
import {register_background, update_page} from "../page";
import {bleh_notification_list} from "../components/notifications.js";
import { tl, trans } from "../build/trans.js";
import { html } from "lighterhtml";
import { load_profile_cache_externally } from "./profile.js";
import { bleh_message_list } from "../components/messages.js";

export async function bleh_inbox() {
    page.structure.container = document.body.querySelector('.page-content');
    try {
        page.structure.row = page.structure.container.querySelector('.row');
        page.structure.main = page.structure.row.querySelector('.col-main');
        page.structure.side = page.structure.row.querySelector('.col-sidebar');
    } catch (e) {
        log('unable to find elements', 'page structure');
    }

    let content_top = document.body.querySelector('.content-top');

    const alert = document.body.querySelector('.alert');


    checkup_page_structure(false, content_top);
    log('status is', 'page', 'info', page);
    update_page();

    page.structure.container.insertBefore(html.node`
        <section class="redesigned-header search-header no-background">
            <div class="tag-side">
                <div class="tag-icon inbox-icon"></div>
            </div>
            <div class="info-side">
                <div class="sub-text">${tl(trans.inbox)}</div>
                <h1>${page.subpage == 'notifications' ? tl(trans.notifications) : tl(trans.messages)}</h1>
            </div>
        </section>
    `, page.structure.container.firstElementChild);

    let cache;
    if (auth.name) {
        cache = await load_profile_cache_externally(auth.name);
        if (cache.banner)
            register_background(cache.banner);
        else if (auth.avatar && !auth.avatar.endsWith('818148bf682d429dc215c1705eb27b98.png'))
            register_background(auth.avatar.replace('/avatar42s/', '/ar0/'));
        else
            register_background(null);
    } else {
        register_background(null);
    }

    const messages_tab = page.structure.nav.querySelector('.secondary-nav-item--overview');
    messages_tab.classList.remove('secondary-nav-item--overview');
    messages_tab.classList.add('secondary-nav-item--messages');
    messages_tab.querySelector(':scope > a').textContent = tl(trans.messages);


    if (page.subpage == 'notifications') {
        let form = page.structure.container.querySelector('form');
        let notifications = page.structure.container.querySelector('.inbox-notifications');
        let pagination = page.structure.container.querySelector('.pagination');

        page.structure.main.appendChild(html.node`
            <section class="inbox-panel notifications-panel">
                ${alert}
                ${form}
                ${notifications}
                ${pagination}
            </section>
        `);

        if (!notifications) return;

        bleh_notification_list(notifications);
    } else if (page.subpage == 'message_overview' || page.subpage == 'sent_message') {
        let inbox = page.structure.container.querySelector('.inbox-message-view');
        page.structure.main.appendChild(inbox);

        if (alert) inbox.appendChild(alert);


        let sender_panel = inbox.querySelector('.inbox-message-sender-avatar');
        let sender_name = inbox.querySelector('.inbox-message-sender-name');
        let sender_time = inbox.querySelector('.inbox-message-timestamp');

        sender_panel.appendChild(sender_name);
        sender_panel.appendChild(sender_time);

        let avatar = sender_panel.querySelector('.avatar');
        let name_text = sanitise(sender_name.textContent.trim());
        let badge = patch_avatar(avatar, name_text);

        sender_panel.classList.add(`user-status--bleh-${badge.type}`, `user-status--bleh-user-${name_text}`);
    } else if (page.subpage.endsWith('overview')) {
        let inbox = page.structure.container.querySelector('.inbox');
        page.structure.main.appendChild(inbox);

        if (alert) inbox.appendChild(alert);

        const header = page.structure.main.querySelector('.inbox-buttons');
        const select_all = header.querySelector('.inbox-select-all');

        const delete_btn = header.querySelector('.inbox-delete-button');

        const table = inbox.querySelector('.inbox-table');

        if (!table) return;

        table.classList = 'inbox-table-legacy';

        bleh_message_list(table.querySelector('tbody'), false, delete_btn);
    } else if (page.subpage == 'compose') {
        let inbox = page.structure.container.querySelector('.inbox-compose-view');
        page.structure.main.appendChild(inbox);
    } else {
        let inbox = page.structure.container.querySelector('.inbox');
        page.structure.main.appendChild(inbox);

        if (alert) inbox.appendChild(alert);
    }
}
