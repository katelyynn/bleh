//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { html } from 'lighterhtml';
import { auth, root } from './build/page';
import { tl, trans } from './build/trans';
import { create_badge, load_badges } from './components/badge';
import { dialog } from './components/dialog';
import tippy from 'tippy.js';
import { control_gif_pause } from './build/tools';
import { register_menu } from './components/menu';

export function patch_avatar(
    avatar,
    name,
    type = '',
    parent = null,
    side = 'right'
) {
    if (avatar.hasAttribute('data-bleh-avatar')) return {};
    avatar.setAttribute('data-bleh-avatar', 'true');

    const avatar_img = avatar.querySelector('img');
    if (!avatar_img) return {};

    // last.fm bug: it uses 64s instead of avatar70s for
    // event attendees - this causes it to center in the middle of the image
    // rather than the top
    avatar_img.setAttribute(
        'src',
        avatar_img.getAttribute('src').replace('/64s/', '/avatar70s/')
    );

    avatar.setAttribute('title', '');

    let badges = load_badges(name);
    let pre_existing_badge = avatar.querySelector('.avatar-status-dot');

    if (badges && pre_existing_badge) avatar.removeChild(pre_existing_badge);

    if (!parent) avatar.classList.add('avatar-can-hoverbox');
    else parent.classList.add('parent-can-hoverbox');

    let pre_existing_badge_type;
    if (pre_existing_badge)
        pre_existing_badge_type = pre_existing_badge.classList[1].replace(
            'avatar-status-dot--',
            'user-status-'
        );
    if (pre_existing_badge_type == 'user-follow') {
        pre_existing_badge = null;
        pre_existing_badge_type = null;
    }

    if (badges)
        avatar.appendChild(create_badge(badges[badges.length - 1], true));

    let image_header;
    const popup = tippy(parent ? parent : avatar, {
        theme: 'context-menu',
        content: html.node`
            <div class="track-preview user-preview">
                <div class="image">
                    <div class="inner-image">
                        <img src=${avatar_img.getAttribute('src').replace('/avatar42s/', '/avatar170s/')} alt=${name}>
                    </div>
                </div>
                <div class="info">
                    <h5 class="title">@${name}</h5>
                    ${
                        badges ?
                            html.node`
                    <div class="badges">
                        ${badges.map((badge, index) => create_badge(badge, false, index == badges.length - 1))}
                        ${
                            pre_existing_badge ?
                                create_badge({
                                    type: pre_existing_badge_type,
                                    name: tl(
                                        trans.badges[pre_existing_badge_type]
                                            .name
                                    ),
                                    reason: tl(
                                        trans.badges[pre_existing_badge_type]
                                            .reason
                                    ),
                                    inbuilt: true
                                })
                            :   ''
                        }
                    </div>
                    `
                        : pre_existing_badge ?
                            html.node`
                    <div class="badges">
                        ${create_badge({
                            type: pre_existing_badge_type,
                            name: tl(
                                trans.badges[pre_existing_badge_type].name
                            ),
                            reason: tl(
                                trans.badges[pre_existing_badge_type].reason
                            ),
                            inbuilt: true
                        })}
                    </div>
                    `
                        :   ''
                    }
                </div>
            </div>
            <a class="dropdown-menu-clickable-item" data-type="profile" href="${root}user/${name}">
                ${tl(trans.profile)}
            </a>
            <a class="dropdown-menu-clickable-item" data-type="library" href="${root}user/${name}/library">
                ${tl(trans.library)}
            </a>
            <a class="dropdown-menu-clickable-item" data-type="friends" href="${root}user/${name}/friends">
                ${tl(trans.friends)}
            </a>
            <a class="dropdown-menu-clickable-item" data-type="shouts" href="${root}user/${name}/shoutbox">
                ${tl(trans.shouts)}
            </a>
        `,
        placement: side,
        interactive: true,
        trigger: 'click',
        appendTo: document.body
    });

    register_menu(parent ? parent : avatar, popup);

    control_gif_pause(avatar_img);

    if (badges) return badges[badges.length - 1];
    else if (pre_existing_badge)
        return { type: pre_existing_badge.classList[1] };
    else return { type: 'none' };
}

export function return_name_from_avatar(avatar) {
    if (!avatar) return;

    if (!avatar.hasAttribute('alt')) return;

    if (avatar.getAttribute('alt') == tl(trans.your_avatar)) return auth;

    return avatar.getAttribute('alt').replace(tl(trans.avatar_for_user), '');
}

unsafeWindow._expand_avatar = function (src) {
    expand_avatar(src);
};
export function expand_avatar(src, alt = '') {
    dialog({
        id: 'avatar',
        body: html.node`
            <div class="full-avatar-wrapper">
                <div class="full-avatar">
                    <img src=${src} alt=${alt}>
                    ${
                        alt != '' ?
                            () => {
                                const elem = html.node`
                            <div class="alt-text">
                                ALT
                            </div>
                        `;

                                tippy(elem, {
                                    content: alt
                                });

                                return elem;
                            }
                        :   ''
                    }
                </div>
                <div class="modal-footer">
                    <div class="fill"></div>
                    <a class="btn primary open" href=${src} target="_blank">
                        ${tl(trans.open_new_tab)}
                    </a>
                    <div class="fill"></div>
                </div>
            </div>
        `,
        type: 'avatar',
        has_overlays: false
    });
}

export function style_name_from_badge(name, badge) {
    if (!badge) return;

    if (badge.hue > -1 && badge.sat > -1 && badge.lit > -1) {
        name.style.setProperty('--hue-over', badge.hue);
        name.style.setProperty('--sat-over', badge.sat);
        name.style.setProperty('--lit-over', badge.lit);
    } else if (badge.type) {
        name.classList.add(
            `user-status--bleh-${badge.type}`,
            `user-status--bleh-user-${badge.user}`
        );
    } else {
        name.classList.add(badge.type);
    }
}
