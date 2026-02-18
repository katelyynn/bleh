//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { html } from 'lighterhtml';
import { log } from '@/build/log';
import { auth, page, root } from '@/build/page';
import { sponsor_list } from '@/build/sponsor';
import { tl, trans } from '@/build/trans';
import { dialog } from '@/components/dialog/dialog';
import { ff } from '@/components/settings/sku';
import { status } from '@/components/dialog/status';
import { set_storage } from '@/build/tools';
import { create_badge, process_badge } from '@/components/shared/badge';
import { notify } from '@/components/dialog/notify';

export function sponsors(force = false, func = null) {
    if (!ff('sponsor')) return;

    let sponsor_data = localStorage.getItem('kat_sponsors');
    let sponsor_expire = new Date(localStorage.getItem('kat_sponsors_expire'));

    let current_time = new Date();

    if (!sponsor_data) {
        log('not cached, fetching', 'sponsor');
        sponsor_request(true, func);
    } else {
        // we prefer to load the current cache before waiting for a new response
        for (var member in sponsor_list) delete sponsor_list[member];
        Object.assign(sponsor_list, JSON.parse(sponsor_data));

        if (sponsor_list) {
            auth.sponsor = sponsor_list.sponsors.includes(auth.name);
            auth.sponsor_full = !sponsor_list.sponsors_one_time.includes(auth.name);

            if (sponsor_list.badges?.[auth.name]) {
                const old_badges = JSON.parse(localStorage.getItem('kat_sponsor_cache')) || {};

                if (JSON.stringify(old_badges) != JSON.stringify(sponsor_list.badges[auth.name])) {
                    console.info('sponsor initial', old_badges, sponsor_list.badges[auth.name]);
                    set_storage('kat_sponsor_cache', JSON.stringify(sponsor_list.badges[auth.name]));
                    new_badges(sponsor_list.badges[auth.name]);

                    return;
                }
            }
        }

        // is it valid?
        if (sponsor_expire < current_time && !force) {
            sponsor_request(false, func);
        } else if (force) {
            sponsor_request(true, func);
        }
    }
}

function sponsor_request(should_notify = false, func = null) {
    log(`initiating request with notify ${should_notify}`, 'sponsor');

    let button = document.body.querySelector('[onclick="_sponsor_check()"]');
    if (button) button.setAttribute('disabled', '');

    let xhr = new XMLHttpRequest();
    let url = `https://katelyynn.github.io/bleh/fm/badges/badges.json?${Math.random()}`;
    xhr.open('GET', url, true);

    xhr.onload = function () {
        log(`list responded with ${xhr.status}`, 'sponsor');

        // set expire date
        let api_expire = new Date();

        if (xhr.status != 200) {
            log(
                'request has been cancelled, will request again in 1h',
                'sponsor'
            );
            api_expire.setHours(api_expire.getHours() + 1);
        }

        if (xhr.status == 200) {
            try {
                if (sponsor_list.latest != 0.0 || (sponsor_list && parseFloat(JSON.parse(this.response).latest) >= parseFloat(sponsor_list.latest))) {
                    for (const member in sponsor_list) delete sponsor_list[member];
                    Object.assign(sponsor_list, JSON.parse(this.response));

                    if (sponsor_list) {
                        auth.sponsor = sponsor_list.sponsors.includes(auth.name);
                        auth.sponsor_full = !sponsor_list.sponsors_one_time.includes(auth.name);

                        if (sponsor_list.badges?.[auth.name]) {
                            const old_badges = JSON.parse(localStorage.getItem('kat_sponsor_cache')) || {};

                            if (JSON.stringify(old_badges) != JSON.stringify(sponsor_list.badges[auth.name])) {
                                console.info('sponsor request', old_badges, sponsor_list.badges[auth.name]);
                                set_storage('kat_sponsor_cache', JSON.stringify(sponsor_list.badges[auth.name]));
                                new_badges(sponsor_list.badges[auth.name]);
                            }
                        }
                    }

                    if (should_notify)
                        status({
                            title: tl(trans.downloaded_value, { v: tl(trans.sponsor_details) })
                        });

                    // save to cache for next page load
                    set_storage('kat_sponsors', this.response);
                    if (func) func();

                    api_expire.setHours(api_expire.getHours() + 4);
                    log(`list cached until ${api_expire}`, 'sponsor');
                }
            } catch (e) {
                log('parsing list failed', 'sponsor', 'error', { e });
                notify({
                    id: 'sponsor_failed',
                    title: tl(trans.value_failed_to_load, { v: tl(trans.sponsor_details) }),
                    body: e.message || e,
                    type: 'error',
                    persist: true
                });
                if (func) func(false);

                api_expire.setHours(api_expire.getMinutes() + 30);
                log(`list cached until ${api_expire}`, 'sponsor');
            }
        }

        set_storage('kat_sponsors_expire', api_expire);

        if (button != null) button.removeAttribute('disabled');
    };

    xhr.send();
}

unsafeWindow._sponsor_check = function () {
    sponsors(true);
};

unsafeWindow._sponsor = function (replace = false) {
    sponsor(replace);
};
export function sponsor(replace = false) {
    open('https://katelyn.moe/sponsor');
}

unsafeWindow._sponsor_manage = function () {
    sponsor_manage();
};
export function sponsor_manage() {
    if (
        sponsor_list.sponsors_one_time &&
        sponsor_list.sponsors_one_time.includes(auth.name)
    ) {
        dialog({
            id: 'sponsor_manage',
            title: tl(trans.sponsor),
            body: html.node`
                <div class="modal-vertical-inner support-inner">
                    <div class="avatar">
                        <img src="${auth.avatar.replace('/avatar42s/', '/avatar170s/')}" alt="${tl(trans.your_avatar)}">
                        <span class="avatar-status-dot user-status--bleh-sponsor"></span>
                    </div>
                    <h1 class="colourful">${tl(trans.you_are_a_sponsor)}</h1>
                    <p>${tl(trans.sponsor_no_badge)}</p>
                </div>
            `,
            type: 'sponsor'
        });
    } else {
        dialog({
            id: 'sponsor_manage',
            title: tl(trans.sponsor),
            body: html.node`
                <div class="modal-vertical-inner support-inner">
                    <div class="avatar">
                        <img src="${auth.avatar.replace('/avatar42s/', '/avatar170s/')}" alt="${tl(trans.your_avatar)}">
                        <span class="avatar-status-dot user-status--bleh-sponsor"></span>
                    </div>
                    <h1 class="colourful">${tl(trans.you_are_a_sponsor)}</h1>
                    <p>${tl(trans.sponsor_get_badge)}</p>
                </div>
                <div class="modal-footer">
                    <div class="fill"></div>
                    <a class="btn primary sponsor icon colourful" href="${root}user/${sponsor_list.sponsor_account}" target="_blank">
                        ${tl(trans.manage_sponsor)}
                    </a>
                    <div class="fill"></div>
                </div>
            `,
            type: 'sponsor'
        });
    }
}

export function bleh_sponsor_page() {
    document.body.style.removeProperty('--hue-album');
    document.body.style.removeProperty('--sat-album');
    document.body.style.removeProperty('--lit-album');

    let adaptive_skin_container = document.querySelector(
        '.adaptive-skin-container:not([data-bleh])'
    );

    if (adaptive_skin_container == null) return;
    adaptive_skin_container.setAttribute('data-bleh', 'true');

    // initial
    adaptive_skin_container.innerHTML = '';

    log('internal bleh sponsor', 'page');
    page.type = 'bleh_sponsor';
    page.subpage = '';

    sponsor();
}

export function new_badges(badges) {
    dialog({
        id: 'sponsor_new_badges',
        title: tl(trans.sponsor),
        body: html.node`
            <div class="modal-vertical-inner support-inner">
                <div class="avatar">
                    <img src="${auth.avatar.replace('/avatar42s/', '/avatar170s/')}" alt="${tl(trans.your_avatar)}">
                </div>
                <h1>${tl(trans.you_have_new_badges)}</h1>
                <div class="badges">
                    ${badges.map(badge => create_badge(process_badge(badge, auth.name)))}
                </div>
            </div>
        `,
        type: 'sponsor'
    });
}
