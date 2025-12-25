//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { settings } from '../build/config';
import { log } from '../build/log';
import { auth, page, root } from '../build/page';
import { sponsor_list } from '../build/sponsor';
import { sanitise } from '../build/tools';
import { tl, trans } from '../build/trans';
import { ff } from '../sku';
import { correct_artist } from './lotus';
import { html } from 'lighterhtml';
import { sponsor } from '../sponsor.js';
import { redirect } from './music.js';
import tippy from 'tippy.js';
import { register_menu } from './menu.js';
import { notify } from './notify.js';
import { dialog, dialog_rm } from './dialog.js';
import { save_setting } from './settings.js';

export function redesign_profile_header(is_own_profile, is_following) {
    let base_header = document.body.querySelector('.header-info-secondary');
    if (!base_header) return;

    let katsune = ff('katsune');

    // taste
    let taste = '';
    let taste_percentage = '';
    let taste_artists = [];

    if (!is_own_profile && page.name != sponsor_list.sponsor_account) {
        let taste_meter = base_header.querySelector('.tasteometer');

        if (taste_meter) {
            taste = taste_meter.classList[1].replace('tasteometer-compat-', '');

            let artists = taste_meter.querySelectorAll('a');
            artists.forEach((artist) => {
                taste_artists.push(
                    correct_artist(artist.getAttribute('title'))
                );
            });

            taste_percentage = taste_meter
                .querySelector('.tasteometer-viz')
                .getAttribute('title');
            if (taste_percentage == '99%') taste_percentage = '100%';
        }
    }

    // create new
    let about_me = page.structure.container.querySelector('.about-me-sidebar');

    let profile_header = html.node`
        <section class="side-actions" />
    `;

    if (
        !is_own_profile &&
        page.name != sponsor_list.sponsor_account &&
        auth.name
    ) {
        // follow
        let follow_wrap = document.body.querySelector('.header-avatar .class > div');

        if (follow_wrap) {
            let follow_btn = follow_wrap.querySelector('button');
            follow_btn.classList.add('btn', 'side-action');
            follow_btn.classList.remove('toggle-button', 'header-follower-btn');
            follow_btn.setAttribute('data-type', 'follow');
            profile_header.appendChild(follow_wrap);

            if (is_following) follow_btn.setAttribute('data-followed', 'true');

            follow_btn.appendChild(html.node`
                <i>${tl(trans.following_mutuals)}</i>
            `);

            follow_btn.parentElement.classList.add('follow-combo');

            friends_button(follow_btn.parentElement);
        } else {
            // ignore list
            profile_header.appendChild(html.node`
                <button class="btn side-action" data-type="follow" disabled="true" data-ignored="true">
                    ${tl(trans.blocked)}
                </button>
            `);
        }
    }

    if (!is_own_profile) {
        // message
        let msg_button = document.body.querySelector('.header-message-user');
        if (msg_button) {
            if (page.name != sponsor_list.sponsor_account) {
                create_profile_top_item(profile_header, {
                    name: page.name,
                    type: 'message',
                    link: msg_button.getAttribute('href'),
                    text: tl(trans.send_message)
                });

                if (page.name == sponsor_list.special[0]) {
                    create_profile_top_item(profile_header, {
                        name: page.name,
                        type: 'sponsor',
                        link: () => sponsor(),
                        action: 'button'
                    });
                }
            } else {
                create_profile_top_item(profile_header, {
                    name: page.name,
                    type: 'sponsor',
                    link: () => sponsor(),
                    action: 'button'
                });
                create_profile_top_item(profile_header, {
                    name: page.name,
                    type: 'message_sponsor',
                    link: msg_button.getAttribute('href'),
                    full: true
                });
            }
        }

        if (page.name != sponsor_list.sponsor_account) {
            if (ff('compare')) {
                create_profile_top_item(profile_header, {
                    name: page.name,
                    type: 'compare',
                    link: `${root}bleh/minis/compare?profile=${page.name}`,
                    text: tl(trans.compare_plays)
                });
            }
        }
    } else {
        // edit
        create_profile_top_item(profile_header, {
            name: page.name,
            type: 'edit',
            text: tl(trans.edit_profile),
            link: `${root}settings`
        });
        create_profile_top_item(profile_header, {
            name: page.name,
            type: 'collage',
            link: `${root}bleh/minis/collage`,
            text: tl(trans.create_collage)
        });
        create_profile_top_item(profile_header, {
            name: page.name,
            type: 'obsession',
            text: tl(trans.set_obsession),
            link: `${root}user/${page.name}/obsessions/set`
        });

        if (ff('minis')) {
            create_profile_top_item(profile_header, {
                name: page.name,
                type: 'minis',
                link: `${root}bleh/minis`,
                text: tl(trans.explore_minis)
            });
        } else {
            create_profile_top_item(profile_header, {
                name: page.name,
                type: 'labs',
                link: `${root}labs`,
                tooltip: `
                    <strong>${tl(trans.labs_by_last)}</strong>
                    <p>${tl(trans.labs_by_last.tagline)}</p>
                `,
                tooltip_style: 'stack'
            });
        }
    }

    if (!page.mobile)
        page.structure.side.insertBefore(
            profile_header,
            page.structure.side.firstElementChild
        );
    else
        page.structure.main.insertBefore(
            profile_header,
            page.structure.main.firstElementChild
        );

    let listen_container = page.structure.row.querySelector('.listen-panel');

    if (
        !is_own_profile &&
        page.name != sponsor_list.sponsor_account &&
        katsune &&
        auth.name
    ) {
        if (taste == '') {
            listen_container.appendChild(html.node`
                <div class="loading-data-container">
                    <div class="loading-data-text error">${tl(trans.missing_component)}</div>
                </div>
            `);

            return;
        }

        let taste_wrap = html.node`
            <div class="btn listen-item ${taste != 'super' && taste != 'very_low' ? 'icon' : ''} taste">
                <div class="taste-icon colourful" data-taste=${taste}>
                    <div class="bleh-icon" />
                </div>
                <div class="span">
                    <img class="view-item-avatar" src=${auth.avatar} alt=${auth.name}>
                    <img class="view-item-avatar" src=${page.avatar} alt=${page.name}>
                    <div class="info">
                        <h3>${html.node([
                            tl(trans.you_share_count_with).replace(
                                '{c}',
                                `<span class="colourful" data-taste=${taste}>${taste_percentage}</span>`
                            )
                        ])}</h3>
                        <p>
                            ${taste_artists.length == 1 ? taste_artists[0] : ''}
                            ${taste_artists.length == 2 ? tl(trans.you_share_count_with.two).replace('{artist1}', taste_artists[0]).replace('{artist2}', taste_artists[1]) : ''}
                            ${taste_artists.length == 3 ? tl(trans.you_share_count_with.three).replace('{artist1}', taste_artists[0]).replace('{artist2}', taste_artists[1]).replace('{artist3}', taste_artists[2]) : ''}
                        </p>
                    </div>
                </div>
            </div>
        `;

        tippy(taste_wrap, {
            theme: 'stack',
            content: html.node`
                <span>
                    ${tl(trans.taste_similarity)}
                </span>
                <div class="hint">${tl(trans.click_for_more_options)}</div>
            `
        });

        if (taste_artists.length > 1) {
            const other_avi = page.avatar.replace('/avatar300s/', '/avatar42s/');

            tippy(taste_wrap, {
                theme: 'context-menu',
                content: html.node`
                    <h4 class="menu-header">${tl(trans.compare_plays)}</h4>
                    <a class="dropdown-menu-clickable-item" href="${root}user/${page.name}/library/music/${redirect()}${sanitise(taste_artists[0])}" data-menu-item="shared-artist">
                        <span class="menu-avatar">
                            <img src=${other_avi} alt=${page.name}>
                        </span>
                        ${taste_artists[0]}
                    </a>
                    <a class="dropdown-menu-clickable-item" href="${root}user/${auth.name}/library/music/${redirect()}${sanitise(taste_artists[0])}" data-menu-item="shared-artist">
                        <span class="menu-avatar">
                            <img src=${auth.avatar} alt=${auth.name}>
                        </span>
                        ${taste_artists[0]}
                    </a>
                    ${taste_artists.length >= 2 ? html.node`
                    <div class="sep"></div>
                    <a class="dropdown-menu-clickable-item" href="${root}user/${page.name}/library/music/${redirect()}${sanitise(taste_artists[1])}" data-menu-item="shared-artist">
                        <span class="menu-avatar">
                            <img src=${other_avi} alt=${page.name}>
                        </span>
                        ${taste_artists[1]}
                    </a>
                    <a class="dropdown-menu-clickable-item" href="${root}user/${auth.name}/library/music/${redirect()}${sanitise(taste_artists[1])}" data-menu-item="shared-artist">
                        <span class="menu-avatar">
                            <img src=${auth.avatar} alt=${auth.name}>
                        </span>
                        ${taste_artists[1]}
                    </a>
                    ` : ''}
                    ${taste_artists.length >= 3 ? html.node`
                    <div class="sep"></div>
                    <a class="dropdown-menu-clickable-item" href="${root}user/${page.name}/library/music/${redirect()}${sanitise(taste_artists[2])}" data-menu-item="shared-artist">
                        <span class="menu-avatar">
                            <img src=${other_avi} alt=${page.name}>
                        </span>
                        ${taste_artists[2]}
                    </a>
                    <a class="dropdown-menu-clickable-item" href="${root}user/${auth.name}/library/music/${redirect()}${sanitise(taste_artists[2])}" data-menu-item="shared-artist">
                        <span class="menu-avatar">
                            <img src=${auth.avatar} alt=${auth.name}>
                        </span>
                        ${taste_artists[2]}
                    </a>
                    ` : ''}
                    <div class="sep"></div>
                    <a class="dropdown-menu-clickable-item" data-type="compare" href="${root}bleh/minis/compare?profile=${page.name}">${tl(trans.compare)}</a>
                `,
                trigger: 'click',
                placement: 'bottom',
                interactive: true,
                interactiveBorder: 10,
                offset: [0, 0]
            });
        }

        const row = listen_container.querySelector('.listener-row');
        row.after(taste_wrap);
    }
}

export function create_profile_top_item(
    parent,
    {
        name,
        link,
        text = '',
        type,
        new_release = false,
        updated = false,
        action = '',
        tooltip = '',
        allow_html = false,
        tooltip_theme = ''
    }
) {
    log(`creating top item of ${name}, ${link}, ${text}`, 'profile');

    let side_action;
    if (action === 'button') {
        side_action = html.node`
            <button
                class="btn side-action"
                data-type=${type}
                onclick=${link}
            >
                ${text || tl(trans[type])}
                ${new_release ? html.node`<div class="new-badge">${tl(trans.new)}</div>` : ''}
                ${updated ? html.node`<div class="new-badge">${tl(trans.updated)}</div>` : ''}
            </button>
        `;
    } else {
        side_action = html.node`
            <a
                class="btn side-action"
                data-type=${type}
                href=${link}
            >
                ${text || tl(trans[type])}
                ${new_release ? html.node`<div class="new-badge">${tl(trans.new)}</div>` : ''}
                ${updated ? html.node`<div class="new-badge">${tl(trans.updated)}</div>` : ''}
            </a>
        `;
    }

    parent.appendChild(side_action);
    return side_action;
}

function friends_button(parent) {
    let friend_state = settings.friends.includes(page.name);
    let star_state = settings.starred_friend == page.name;

    if (!friend_state && star_state) {
        star_state = false;
        save_setting('starred_friend', '');
    }

    const elem = html.node`
        <button class="btn side-action" data-type="friends" type="button" onclick=${() => {
            if (friend_state) {
                dialog({
                    id: 'remove_friend',
                    title: tl(trans.remove_friend.name),
                    body: html.node`
                        <p>${{ html: tl(trans.remove_friend.body, { u: `<strong>${page.name}</strong>` }) }}</p>
                        <div class="modal-footer">
                            <button class="see-more cancel" onclick=${() => dialog_rm({ id: 'remove_friend' })}>
                                ${tl(trans.cancel)}
                            </button>
                            <div class="fill"></div>
                            <button class="btn primary icon danger" data-type="minus" onclick=${() => {
                                friend_state = false;
                                star_state = false;

                                const new_list = settings.friends.filter(
                                    (item) => item != page.name
                                );

                                save_setting('friends', new_list);
                                save_setting('starred_friend', '');

                                dialog_rm({ id: 'remove_friend' });
                                update_visual();

                                notify({
                                    id: 'friends',
                                    title: tl(trans.removed_friend),
                                    body: page.name,
                                    icon: 'icon-16-minus',
                                    type: 'error'
                                });
                            }}>
                                ${tl(trans.remove)}
                            </button>
                        </div>
                    `
                });
            } else {
                friend_state = true;

                const new_list = [...settings.friends, page.name];

                save_setting('friends', new_list);
                update_visual();

                notify({
                    id: 'friends',
                    title: tl(trans.added_as_friend),
                    body: page.name,
                    icon: 'icon-16-users',
                    type: 'success'
                });
            }
        }} />
    `;

    tippy(elem, {
        content: tl(trans.friend_difference)
    });

    const menu = tippy(elem, {
        theme: 'context-menu',
        content: html.node``,
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

            instance.setContent(html.node`
                <button class="dropdown-menu-clickable-item" data-type="starred_friend" data-starred="true" onclick=${() => {
                    if (star_state) {
                        star_state = false;
                        save_setting('starred_friend', '');
                        update_visual();

                        notify({
                            id: 'friends',
                            title: tl(trans.removed_star),
                            body: page.name,
                            icon: 'icon-16-minus',
                            type: 'error'
                        });
                    } else {
                        star_state = true;
                        save_setting('starred_friend', page.name);
                        update_visual();

                        notify({
                            id: 'friends',
                            title: tl(trans.added_star),
                            body: page.name,
                            icon: 'icon-16-starred-friend'
                        });
                    }
                }}>
                    ${star_state ? tl(trans.remove_as_star_friend) : tl(trans.add_as_starred_friend)}
                </button>
            `);
        }
    });

    register_menu(elem, menu);

    update_visual();

    function update_visual() {
        elem.setAttribute('data-friends', friend_state);
        elem.setAttribute('data-starred', star_state);

        if (star_state) {
            elem.textContent = tl(trans.starred_friend.name);
        } else if (friend_state) {
            elem.textContent = tl(trans.friends);
        } else {
            elem.textContent = tl(trans.add_as_friend);
        }
    }

    parent.appendChild(elem);
}
