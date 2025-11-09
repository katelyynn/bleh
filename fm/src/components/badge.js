//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { log } from '../build/log';
import { sponsor_list } from '../build/sponsor';
import { tl, trans } from '../build/trans';
import { html } from 'lighterhtml';
import { sponsor } from '../sponsor.js';
import tippy from 'tippy.js';

export function load_badges(user, solo = false) {
    if (!sponsor_list || !sponsor_list.badges) return;

    if (!sponsor_list.badges.hasOwnProperty(user)) return;

    let badges = [];

    if (!Array.isArray(sponsor_list.badges[user])) {
        log('1 badge found', 'sponsor', 'info', sponsor_list.badges[user]);
        badges.push(sponsor_list.badges[user]);
    } else {
        log(
            'multiple badges found',
            'sponsor',
            'info',
            sponsor_list.badges[user]
        );

        if (solo)
            badges.push(
                sponsor_list.badges[user][
                    Object.keys(sponsor_list.badges[user]).length - 1
                ]
            );
        else badges = sponsor_list.badges[user];
    }

    // now we run thru to add missing metadata
    badges.forEach((badge) => {
        badge = process_badge(badge, user);
    });

    log('final badge list', 'sponsor', 'info', badges);
    return badges;
}

export function process_badge(badge, user) {
    badge.user = user;

    if (!badge.name) {
        if (trans.badges[badge.type]) {
            badge.name = tl(trans.badges[badge.type].name);
        } else {
            badge.name = tl(trans.unavailable);
            badge.reason = tl(trans.requires_higher_bleh_version);
        }
    }

    if (trans.badges[badge.type] && trans.badges[badge.type].reason)
        badge.reason = tl(trans.badges[badge.type].reason);
    else if (
        badge.reason &&
        trans.badges[badge.reason] &&
        trans.badges[badge.reason].reason
    )
        badge.reason = tl(trans.badges[badge.reason].reason);

    if (badge.reason) return badge;

    if (badge.type == 'sponsor' || badge.type == 'contributor')
        badge.reason = badge.type;
    else if (badge.type == 'cute' || badge.type == 'queen')
        badge.reason = tl(trans.badges.cute.reason);
    else badge.reason = tl(trans.badges.reserved.reason);

    return badge;
}

export function create_badge(
    badge = {
        type: '',
        icon: '',
        reason: '',
        hue: -1,
        sat: -1,
        lit: -1,
        name: '',
        user: '',
        inbuilt: false
    },
    on_avatar = false,
    long = false,
    small = false
) {
    log('creating', 'badge', 'info', { badge, on_avatar, long, small });

    const classlist = on_avatar ? 'avatar-status-dot' : 'label no-hover';

    let elem = html.node`
        <span class=${classlist}>
            ${badge.name}
        </span>
    `;

    if (long) elem.classList.add('expand');

    if (
        badge.icon != '' &&
        badge.hue > -1 &&
        badge.sat > -1 &&
        badge.lit > -1
    ) {
        // new style badge
        elem.style.setProperty('--mask', `url(${badge.icon})`);
        elem.style.setProperty('--hue-over', badge.hue);
        elem.style.setProperty('--sat-over', badge.sat);
        elem.style.setProperty('--lit-over', badge.lit);
    } else if (badge.inbuilt) {
        elem.classList.add(badge.type);
    } else {
        elem.classList.add(
            `user-status--bleh-${badge.type}`,
            `user-status--bleh-user-${badge.user}`
        );
    }

    if (on_avatar || small) return elem;

    tippy(elem, {
        theme: 'badge',
        placement: 'bottom',
        content: html.node`
            <div class="badge-name">${badge.name}</div>
            <div class="badge-reason">${badge.reason}</div>
        `
    });

    if (badge.type == 'sponsor') elem.onclick = sponsor;

    return elem;
}
