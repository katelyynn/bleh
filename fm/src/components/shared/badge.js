//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { log } from '@/build/log';
import { sponsor_list } from '@/build/sponsor';
import { lang_info, tl, trans } from '@/build/trans';
import { html } from 'lighterhtml';
import { sponsor } from '@/components/sponsor';
import tippy from 'tippy.js';
import { page } from '@/build/page';
import { style_name_from_badge } from './avatar';
import { flag_url } from './flag';
import { present_badge } from '../dialog/badge';

export function load_badges(user, solo = false) {
    if (!sponsor_list.version) return;

    let badges = [];

    // create modern translation badges
    const trans_contributions = get_trans_contributions(user);
    log(`found ${trans_contributions.length} contribution(s) for ${user}`, 'sponsor', 'info', { trans_contributions });
    if (trans_contributions.length > 0) {
        trans_contributions.forEach(contribution => {
            badges.push({
                type: 'translation',
                translation_code: contribution.code,
                reason: contribution.name
            });
        });
    }

    let entry = sponsor_list.users[user];

    if (entry) {
        entry = {
            sponsor: true,
            contributor: false,
            ...entry
        }

        if (entry.contributor) {
            badges.push({
                type: 'contributor'
            });
        }

        if (entry.sponsor) {
            badges.push({
                type: 'sponsor'
            });
        }

        if (entry.badges) {
            log(
                'multiple badges found',
                'sponsor',
                'info',
                sponsor_list.users[user].badges
            );

            badges = [...badges, ...sponsor_list.users[user].badges];
        }
    }

    // now we run thru to add missing metadata
    badges.forEach((badge) => {
        if (entry && entry.sponsor && !badge.type) badge.type = 'sponsor';
        badge = process_badge(badge, user);
    });

    log(`final badge list for @${user}`, 'sponsor', 'info', { badges });

    if (solo) return badges[badges.length - 1];

    return badges;
}

export function get_amount_of_badge(badge) {
    const users = {};

    for (let user in sponsor_list.users) {
        users[user] = load_badges(user);
    }

    console.info('badges loaded', users, Object.values(users));

    return Object.values(users)
        .flat()
        .filter(b => b.type == badge.type && b.name == badge.name && b.reason == badge.reason)
        .length;
}

function get_trans_contributions(user) {
    return Object.entries(lang_info)
        .filter(([code, info]) => info.by.includes(user) && code != 'en')
        .map(([code, info]) => ({
            code,
            name: info.name
        }));
}

export function process_badge(badge, user) {
    const translation = trans.badges[badge.type];

    badge.user = user;

    if (!badge.name) {
        if (translation?.name) {
            badge.name = tl(translation.name);
        } else {
            badge.name = tl(trans.unavailable);
            badge.reason = tl(trans.requires_higher_bleh_version);
        }
    }


    if (badge.reason) return badge;

    if (translation?.reason) {
        badge.reason = tl(translation.reason);
        return badge;
    }


    if (badge.type == 'cute' || badge.type == 'queen')
        badge.reason = tl(trans.badges.cute.reason);
    else badge.reason = tl(trans.badges.reserved.reason);

    return {
        mask: true,
        ...badge
    };
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
        inbuilt: false,
        translation_code: ''
    },
    on_avatar = false,
    long = false,
    small = false
) {
    log(`creating '${badge.name}' for @${badge.user}`, 'badge', 'info', { badge, on_avatar, long, small });

    const classlist = on_avatar ? 'avatar-status-dot' : 'label no-hover';

    let elem = html.node`
        <span class=${classlist} onclick=${() => {
            if (!small && !on_avatar) {
                present_badge(badge);
            }
        }}>
            ${badge.name}
        </span>
    `;

    if (small) {
        elem.appendChild(html.node`
            <span class="badge-back" />
        `);
    }

    if (badge.translation_code) {
        elem.classList.add('translation-lang');
        elem.style.setProperty('--flag', `url(${flag_url(badge.translation_code)})`);
    }

    if (long) elem.classList.add('expand');
    if (small) elem.classList.add('small');

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

    let badge_name;
    tippy(elem, {
        theme: 'badge',
        placement: 'bottom',
        content: html.node`
            <div class="badge-name colourful" ref=${el => badge_name = el}>${badge.name}</div>
            <div class="badge-reason">${badge.reason}</div>
        `
    });

    style_name_from_badge(badge_name, badge);

    return elem;
}

export function verified() {
    const today = new Date();
    const april = today.getMonth() == 3 && today.getDate() == 1;

    page.state.april = april;

    if (april) document.body.setAttribute('data-verified-check', 'true');
}
