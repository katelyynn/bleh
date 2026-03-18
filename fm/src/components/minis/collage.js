//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { lang, tl, trans } from '@/build/trans';
import { html, render } from 'lighterhtml';
import { select } from '@/components/settings/select';
import { setting } from '@/components/settings/settings';
import { input } from '@/components/settings/input';
import { auth, page, root } from '@/build/page';
import { notify, notify_rm } from '@/components/dialog/notify';
import { clean_number, pad2, sanitise, year_from_date } from '@/build/tools';
import { log } from '@/build/log.js';
import { music_grids } from '@/components/music/music_grid';
import { settings } from '@/build/config';
import { version } from '@/main';
import { download } from '@/components/dialog/share';
import { render_user } from '@/pages/home/minis.js';
import { redirect } from '@/components/music/music';
import tippy from 'tippy.js';
import html2canvas from 'html2canvas-pro';
import { load_profile_cache_externally } from '@/pages/profile/profile';
import { icon, icons } from '../shared/icon';

export function collage({ host, sidebar } = {}) {
    if (!host || !sidebar) return;

    let width;
    let height;

    let timeframe;
    let type;

    let settings_btn;
    let submit;
    let body;

    let value = 3;
    let min = 1;
    let max = 20;

    let current_year = new Date().getFullYear();
    let previous_year = current_year - 1;

    const default_type = page.requested.type || 'albums';
    let default_timeframe = page.requested.timeframe || 'date_preset=LAST_7_DAYS';

    if (page.requested.redirect) {
        setTimeout(() => {
            notify({
                id: 'collage_redirect',
                title: tl(trans.collage),
                body: tl(trans.collage_redirect),
                icon: 'icon-16-collage',
                persist: true
            });
        }, 100);
    }

    let user;
    render(host, html`
        <div class="compare-header">
            <div class="compare-users">
                <div class="compare-user focus" ref=${(el) => (user = el)}>
                    ${render_user(page.name, page.avatar, user, true)}
                </div>
            </div>
            <div class="compare-selection">
                <div class="input-group">
                    ${(width = input({
                        type: 'number',
                        value: value,
                        placeholder: value,
                        min: min,
                        max: max
                    }))}
                    ${icon({ name: icons.x })}
                    ${(height = input({
                        type: 'number',
                        value: value,
                        placeholder: value,
                        min: min,
                        max: max
                    }))}
                </div>
                ${type = select({
                    values: [
                        {
                            text: tl(trans.item_type)
                        },
                        {
                            value: 'artists',
                            text: html`<div
                                    class="bleh-icon"
                                    style="--icon: var(--icon-16-artist)"
                                />
                                ${tl(trans.artists)}`
                        },
                        {
                            value: 'albums',
                            text: html`<div
                                    class="bleh-icon"
                                    style="--icon: var(--icon-16-album)"
                                />
                                ${tl(trans.albums)}`
                        },
                        {
                            value: 'tracks',
                            text: html`<div
                                    class="bleh-icon"
                                    style="--icon: var(--icon-16-track)"
                                />
                                ${tl(trans.tracks)}`
                        }
                    ],
                    initial: default_type
                })}
                <div class="timeframe-container" ref=${el => timeframe_container = el} />
                <button
                    class="btn primary icon"
                    data-type="collage"
                    ref=${(el) => (submit = el)}
                    onclick=${() => init_collage()}
                >
                    ${tl(trans.generate)}
                </button>
            </div>
        </div>
        <div
            class="compare-body"
            data-filled="false"
            ref=${(el) => (body = el)}
        >
            <div class="loading-data-container">
                <div class="loading-data-text info">
                    ${tl(trans.choose_a_timeframe_above)}
                </div>
            </div>
        </div>
    `);

    load_timeframe_selection(page.name);

    function load_timeframe_selection(name) {
        let options = [
            {
                text: tl(trans.timeframe)
            },
            {
                value: 'date_preset=LAST_7_DAYS',
                text: tl(trans.last_count_days, { c: '7' })
            },
            {
                value: 'date_preset=LAST_30_DAYS',
                text: tl(trans.last_count_days, { c: '30' })
            },
            {
                value: 'date_preset=LAST_90_DAYS',
                text: tl(trans.last_count_days, { c: '90' })
            },
            {
                value: 'date_preset=LAST_180_DAYS',
                text: tl(trans.last_count_days, { c: '180' })
            },
            {
                value: 'date_preset=LAST_365_DAYS',
                text: tl(trans.last_count_days, { c: '365' })
            },
            {
                value: 'date_preset=ALL',
                text: tl(trans.all_time)
            }
        ];

        timeframe = select({
            values: options,
            initial: default_timeframe,
            func: update_timeframe_selection
        });

        render(timeframe_container, timeframe);

        load_profile_cache_externally(name).then(cache => {
            if (cache.created) {
                const year = parseInt(year_from_date(cache.created));
                const current_year = new Date().getFullYear();

                const years = Array.from({ length: current_year - year + 1 }, (_, i) => year + i);

                years.forEach(year => {
                    options.push({
                        value: `from=${year}-01-01&rangetype=year`,
                        text: year
                    });
                });
            }

            timeframe = select({
                values: options,
                initial: default_timeframe,
                func: update_timeframe_selection
            });

            render(timeframe_container, timeframe);
        });
    }

    function update_timeframe_selection(value) {
        if (!value.startsWith('date_preset=')) return;

        default_timeframe = value;
    }

    let setting_group;
    let inputter;
    render(
        sidebar,
        html`
            <h2>${tl(trans.settings)}</h2>
            <div class="setting-group" ref=${(el) => (setting_group = el)}>
                <div class="setting v" data-type="text">
                    <div class="heading">
                        <h5>${tl(trans.profile)}</h5>
                    </div>
                    <div class="input-container content-form">
                        <input
                            type="text"
                            class="input"
                            ref=${(el) => (inputter = el)}
                            placeholder=${tl(trans.enter_a_profile)}
                            value=${page.requested.profile}
                            onchange=${(e) => {
                                page.requested.profile = e.target.value;
                                page.name = page.requested.profile;

                                page.avatar = '';
                                if (page.name == auth.name)
                                    page.avatar = auth.avatar;

                                load_timeframe_selection(page.name);

                                render(
                                    user,
                                    html`
                                        ${render_user(
                                            page.name,
                                            page.avatar,
                                            user,
                                            true
                                        )}
                                    `
                                );
                            }}
                        />
                        ${() => {
                            let btn = html.node`
                            <button class="btn chibi icon" data-type="profile" onclick=${() => {
                                inputter.value = auth.name;
                                inputter.dispatchEvent(new Event('change'));
                            }}>${tl(trans.profile)}</button>
                        `;

                            tippy(btn, {
                                content: tl(trans.profile)
                            });

                            return btn;
                        }}
                        ${() => {
                            let btn = html.node`
                            <button class="btn chibi icon colourful" data-type="starred_friend" data-starred=${settings.starred_friend != ''} onclick=${() => {
                                if (settings.starred_friend == '') return;

                                inputter.value = settings.starred_friend;
                                inputter.dispatchEvent(new Event('change'));
                            }}>${tl(trans.starred_friend.name)}</button>
                        `;

                            tippy(btn, {
                                content: tl(trans.starred_friend.name)
                            });

                            return btn;
                        }}
                    </div>
                </div>
                ${setting({ id: 'collage_title' })}
                ${setting({ id: 'collage_grid_gap' })}
                ${setting({ id: 'collage_centered' })}
                ${setting({ id: 'collage_grid_text' })}
                ${setting({ id: 'collage_grid_plays' })}
            </div>
        `
    );
    let collage_settings = setting_group.querySelectorAll(':scope > .setting');

    function init_collage(bypass = false) {
        try {
            make_collage(bypass);
        } catch(e) {
            collage_error(e);
        }
    }

    function collage_error(e) {
        render(body, html`
                    <div class="loading-data-container">
                        <div class="alert alert-error">${e && e.message ? e.message : e}</div>
                    </div>
                `);

                type.querySelector('button').disabled = false;
                timeframe.querySelector('button').disabled = false;
                collage_settings.forEach((option) => {
                    option.setAttribute('disabled', false);
                });
                submit.disabled = false;
    }

    function make_collage(bypass = false) {
        if (
            width.value == '' ||
            height.value == '' ||
            parseInt(width.value) < min ||
            parseInt(width.value) > max ||
            parseInt(height.value) < min ||
            parseInt(height.value) > max
        ) {
            notify({
                id: 'collage_failed',
                title: tl(trans.name_failed).replace(
                    '{name}',
                    tl(trans.collage)
                ),
                body: tl(trans.your_settings_are_invalid),
                type: 'error'
            });
            return;
        }

        if (!auth.name) {
            notify({
                id: 'collage_failed',
                title: tl(trans.name_failed).replace(
                    '{name}',
                    tl(trans.collage)
                ),
                body: tl(trans.you_need_to_be_logged_in),
                type: 'error'
            });
            return;
        }

        let per_page = 50; // decided by last.fm
        let pages = Math.ceil((width.value * height.value) / per_page);

        if (pages > 4 && !bypass) {
            let warn = notify({
                id: 'collage_warning',
                title: tl(trans.are_you_sure),
                body: tl(trans.this_will_require_loading_count_pages).replace(
                    '{c}',
                    pages
                ),
                type: 'warning',
                actions: [
                    {
                        type: 'check',
                        action: () => {
                            notify_rm(warn);
                            init_collage(true);
                        },
                        text: tl(trans.continue)
                    }
                ],
                persist: true
            });
            return;
        }

        type.querySelector('button').disabled = true;
        timeframe.querySelector('button').disabled = true;
        collage_settings.forEach((option) => {
            option.setAttribute('disabled', true);
        });
        submit.disabled = true;

        page.state.collage = [];
        get_grid(1, pages);
    }

    function get_grid(current_page, pages) {
        render(
            body,
            html`
                <div class="loading-data-container">
                    <div class="loading-data-text">
                        ${tl(trans.gathering_plays_for_user_pages)
                            .replace('{u}', page.name)
                            .replace('{current_page}', current_page)
                            .replace('{pages}', pages)}
                    </div>
                </div>
            `
        );

        fetch(
            `${root}user/${page.name}/library/${type.value}?format=list&${timeframe.value}&page=${current_page}&ajax=1`
        )
            .then(function (response) {
                console.log('returned', response, response.text);

                return response.text();
            })
            .then(function (dom) {
                let doc = new DOMParser().parseFromString(dom, 'text/html');
                console.log('DOC', doc);

                let next_button = doc.querySelector('.pagination-next');

                try {
                    let tracks = doc.querySelectorAll('.chartlist-row');
                    tracks.forEach((track) => {
                        let item = {};

                        item.avatar = track.querySelector(
                            '.chartlist-image img'
                        );
                        if (item.avatar)
                            item.avatar = item.avatar.getAttribute('src');
                        item.name = track
                            .querySelector('.chartlist-name a')
                            .textContent.trim();
                        if (type.value != 'artists')
                            item.sister = track
                                .querySelector('.chartlist-artist a')
                                .textContent.trim();
                        item.plays = clean_number(
                            track
                                .querySelector('.chartlist-count-bar-slug')
                                .getAttribute('data-stat-value')
                        );

                        page.state.collage.push(item);
                    });
                } catch (e) {
                    notify({
                        id: 'collage_failed',
                        title: tl(trans.name_failed).replace(
                            '{name}',
                            tl(trans.collage)
                        ),
                        body: tl(trans.there_was_a_network_error),
                        type: 'error'
                    });
                    console.error(e);
                }

                if (next_button && current_page < pages) {
                    get_grid(current_page + 1, pages);
                } else {
                    continue_collage();
                }
            });
    }

    async function continue_collage() {
        try {
            log('gathered initial values', 'collage', 'info', page.state.collage);

            if (page.state.collage.length == 0) {
                render(
                    body,
                    html`
                        <div class="loading-data-container">
                            <div class="loading-data-text failed">
                                ${tl(trans.no_plays_in_range)}
                            </div>
                        </div>
                    `
                );

                type.querySelector('button').disabled = false;
                timeframe.querySelector('button').disabled = false;
                collage_settings.forEach((option) => {
                    option.setAttribute('disabled', false);
                });
                submit.disabled = false;

                return;
            }

            let grid = html.node`
                <ol class="grid-items grid-items--numbered collage-grid" style="--width: ${width.value}; --height: ${height.value}" data-width=${width.value} data-height=${height.value} data-centered=${settings.collage_centered} />
            `;

            if (!settings.collage_grid_gap) {
                grid.style.setProperty('--item-list-gap', '0px');
                grid.style.setProperty('--item-med-radius', '0');
            }

            let total = width.value * height.value - 1;
            grid.style.setProperty(
                '--highest',
                Math.max(+width.value, +height.value).toString()
            );

            page.state.collage.some((data, index) => {
                if (index > total) return false;

                let template;
                if (type.value == 'artists') template = sanitise(data.name);
                else template = `${sanitise(data.sister)}/${sanitise(data.name)}`;

                grid.appendChild(html.node`
                    <li class="compare-item grid-items-item">
                        <div class="grid-items-cover-image">
                            <div class="grid-items-cover-image-image ${data.avatar.endsWith('/c6f59c1e5e7240a4c0d427abd71f3dbb.jpg') || data.avatar.endsWith('/2a96cbd8b46e442fc41c2b86b821562f.jpg') ? 'grid-items-cover-default' : ''}">
                                <img src="${data.avatar.replace('/avatar70s/', '/avatar300s/').replace('/64s/', '/avatar300s/')}" alt="${data.name}" loading="lazy">
                            </div>
                            ${
                                (
                                    settings.collage_grid_text ||
                                    settings.collage_grid_plays
                                ) ?
                                    html.node`
                            <div class="grid-items-item-details">
                                ${
                                    settings.collage_grid_text ?
                                        html.node`
                                <p class="grid-items-item-main-text">
                                    <a class="link-block-target" href="${root}music/${redirect()}${template}" title="${data.name}">
                                        ${data.name}
                                    </a>
                                </p>
                                `
                                    :   ''
                                }
                                ${
                                    type.value != 'artists' ?
                                        html.node`
                                <p class="grid-items-item-aux-text">
                                    ${
                                        settings.collage_grid_text ?
                                            html.node`
                                    <a class="grid-items-item-aux-block" href="${root}music/${redirect()}${data.sister}">
                                        ${data.sister}
                                    </a>
                                    ${
                                        settings.collage_grid_plays ?
                                            html.node`
                                    <a class="grid-item-plays icon-mask" href="${root}user/${page.name}/library/music/${redirect()}${template}?date_preset=${timeframe.value}" target="_blank">
                                        ${data.plays.toLocaleString(lang)}
                                    </a>
                                    `
                                        :   ''
                                    }
                                    `
                                        : settings.collage_grid_plays ?
                                            html.node`
                                    <a class="grid-item-plays icon-mask" href="${root}user/${page.name}/library/music/${redirect()}${template}?date_preset=${timeframe.value}" target="_blank">
                                        ${tl(trans.count_plays, { c: data.plays.toLocaleString(lang) })}
                                    </a>
                                    `
                                        :   ''
                                    }
                                </p>
                                `
                                    :   html.node`
                                ${
                                    settings.collage_grid_plays ?
                                        html.node`
                                <p class="grid-items-item-aux-text">
                                    <a class="grid-item-plays icon-mask" href="${root}user/${page.name}/library/music/${redirect()}${template}?date_preset=${timeframe.value}" target="_blank">
                                        ${tl(trans.count_plays, { c: data.plays.toLocaleString(lang) })}
                                    </a>
                                </p>
                                `
                                    :   ''
                                }
                                `
                                }
                            </div>
                            `
                                :   ''
                            }
                        </div>
                    </li>
                `);
            });

            let collage_dom = html.node`
                <div class="collage">
                    ${
                        settings.collage_title ?
                            html.node`
                    <div class="header">
                        <div class="type" data-type=${type.value}>
                            <div class="bleh-icon" />
                            <svg class="brand" xmlns="http://www.w3.org/2000/svg" viewBox="0.1 25.618 89.836 33.432" data-asc="1.16" width="89.836" height="33.432"><path d="M21.4 44.75q-.05.2-.17.37-.13.18-.23.38l.15 1.6q0 .35-.02.67-.03.33-.03.73-.05.2-.12.32-.08.13-.18.33.1.1.18.25.07.15.12.25.05.8-.3 1.5t-.45 1.55q-.4.2-.67.47-.28.28-.28.78-.2.25-.45.5t-.55.4q-.05.05-.25.15-.3.35-.62.67-.33.33-.73.58-.2.2-.32.47-.13.28-.33.53-.35.2-.72.35-.38.15-.68.3-.35.05-.5-.08-.15-.12-.35-.17-.2.05-.37.27-.18.23-.53.48-.05.05-.22.1-.18.05-.33.15-.2.05-.4.17-.2.13-.45.23-.5-.15-1-.28-.5-.12-1.05.08-.35-.1-.65-.23-.3-.12-.65-.12-.25 0-.7-.35-.2.1-.65.1-.25 0-.42-.23-.18-.22-.48-.12-.5-.15-.97-.38-.48-.22-.88-.42-.35-.15-.6-.43-.25-.27-.5-.52-.05-.1-.1-.18-.05-.07-.15-.17-.1-.4-.35-.7l-.5-.6q-.15-.55-.35-1-.05-.2-.22-.43-.18-.22-.28-.47-.05-.55-.22-1.03-.18-.47-.58-.82.05-.2.05-.35 0-.15.05-.35-.1-.35-.3-.85.1-.4.13-.88.02-.47.07-.97-.05-.3-.13-.63-.07-.32.08-.67V44.9Q0 43.75.3 42.7q.15-.4.05-.95 0-1 .03-2.03Q.4 38.7.3 37.7q-.05-.1 0-.15.1-.7.1-1.43v-1.47-.23q0-.12.05-.17.2-.35.22-.73.03-.37.03-.72.1-.4.07-.88-.02-.47.03-.97.2-.3.37-.68.18-.37.08-.77v-.2q.1-.1.1-.23 0-.12.05-.17.25-.55.35-1.13.1-.57.25-1.12.2-.3.4-.75.55-.15 1.1-.15.25 0 .5.02.25.03.45-.02.55-.1 1.13-.1.57 0 1.17.05.15.05.33.02.17-.02.32-.07.2 0 .38.05.17.05.32 0 .1 0 .18-.03.07-.02.12-.02.05.2.13.37.07.18.12.43-.15.8-.2 1.2-.05.4.03.77.07.38.17 1.18-.1.65-.2 1.27-.1.63.1 1.33-.15.85-.1 1.65 0 .65-.02 1.3-.03.65-.18 1.3.1.25-.07.42-.18.18-.28.43 0 .45-.1.92-.1.48-.2.98-.05.25-.08.55-.02.3-.12.6 0 .05.1.07.1.03.1.08.6-.25 1-.7.4-.45.65-1 .55-.15 1.05-.35.5-.2 1-.55.2.05.43.1.22.05.42 0 .25 0 .42.02.18.03.38.03.55 0 1 .15.45.15.95.3.55.2 1.1.42.55.23 1.1.38.45.05.8.6.1.2.28.4.17.2.42.35.4.2.7.55.3.35.6.75.1.1.5.3.25.55.6 1.17.35.63.4 1.33m-6.75 2.6q-.05-.1-.05-.2t-.1-.2q-.4-.3-.6-.8-.2-.5-.8-.4-.7.15-1.25-.05-.3-.1-.45-.1-.45.05-.87.1-.43.05-.83.1l-.2.1q-.1.05-.25.05-.35.35-.8.75-.45.4-.7.95-.05.65-.02 1 .02.35.17.85.05.05.1.17.05.13.1.23.25.15.33.45.07.3.32.45.1.1.18.22.07.13.12.23.05.7.5 1.15.1.05.18.07.07.03.12.08.4 0 .55-.15.3-.15.67-.23.38-.07.68-.27.3-.25.73-.25.42 0 .77-.2.05 0 .25-.1.25-.4.55-.73.3-.32.5-.77v-1.2q.05-.3.08-.65.02-.35.02-.65zm24.25 6.6q0 .45-.4.75-.4.4-.2.95.1.35.1.75v.8q-.05.1-.12.22-.08.13-.18.23-.2.1-.25.1-.4.05-.8.07-.4.03-.8.03H36q-.7-.2-1.37-.23-.68-.02-1.33-.12-.4-.1-.75-.1t-.7.1q-.5-.25-.97-.53-.48-.27-1.03-.52-.35-.55-.87-.93-.53-.37-.93-.92-.1-.25-.22-.5-.13-.25-.28-.45-.5-.75-.65-1.65 0-.35-.25-.6-.4-.75-.2-1.4.05-.1.03-.23-.03-.12.02-.17-.2-.25-.3-.4l-.2-.3q0-.35.05-.5l-.4-.5q.1-.55.18-1.13.07-.57.17-1.07l-.35-.5q0-.2.15-.33.15-.12.25-.32.2-.55.25-1.05.15-.6.15-1.15-.1-1.1 0-2.15.1-1.05.05-2.15.25-1.1.2-2.2-.05-1.1.15-2.15v-.25q-.15-.6 0-1.15.15-.55.35-1-.05-.1-.05-.25t-.1-.25q.1-.35.3-.58.2-.22.35-.42.1-.2.18-.43.07-.22.12-.42l.35-.35q.45-.1.95-.05.15.05.33.15.17.1.37.2.35.2.68.32.32.13.72.08.55.2 1.08.25.52.05 1.02 0h.2l.03.02q.02.03.07.03.25.05.45.25t.1.45q-.1.75-.12 1.5-.03.75-.13 1.5-.1.7-.2 1.42-.1.73-.25 1.43-.05 1.1-.17 2.17-.13 1.08-.13 2.13 0 .15.03.25.02.1.02.2-.25.5-.37 1-.13.5-.28 1.05-.1.4 0 .85.15.6.13 1.2-.03.6-.13 1.25v.3q.1.2.23.45.12.25.22.5-.05.15-.1.32-.05.18-.1.33.1.25.13.55.02.3.07.55.2.25.4.47.2.23.25.53 0 .1.1.25t.15.25q.1.25.33.4.22.15.42.25.35.05.65.15.3.1.65.2.2 0 .33-.03.12-.02.27-.02.1.05.28.1.17.05.32.1.05.05.1.12.05.08.1.13.1.4.55.85.25.2.48.42.22.23.32.53zm25.95-13.6q-.05.5-.07 1.02-.03.53-.13 1.03-.05.5-.05 1.07 0 .58-.2 1.18-.1.15-.25.32-.15.18-.3.43 0 .2.03.35.02.15.07.35-.1.25-.3.42-.2.18-.4.28-.5.15-.92.3-.43.15-.88.25-.7.1-1.45.02-.75-.07-1.5-.02-.65 0-1.37.02-.73.03-1.48.03h-2.8q-.2.15-.42.1-.23-.05-.43.05-.2-.1-.45-.03-.25.08-.5-.02-.2.05-.37.07-.18.03-.43.08-.2-.05-.35-.13-.15-.07-.35.08.1.15.23.32.12.18.17.43.15.2.25.4t.2.45q.1.2.15.42.05.23.1.43.25.25.55.5l.6.5q.25.05.53.1.27.05.52.1l.6.1q.3.05.65 0 .35-.1.65.02.3.13.65.18.45-.05.93-.1.47-.05.92-.1.2-.15.43-.28.22-.12.42-.27.65-.15 1.3.05.15.25.38.5.22.25.42.55.3.45.6.87.3.43.4.98.1.25.3.5.2.25.3.45.05.25-.02.45-.08.2-.13.45-.2.2-.5.35-.05 0-.1.1t-.15.15l-.6.4q-.3.2-.55.4-.7.6-1.45.6-.3 0-.45.05-.25.05-.5.2-.25.15-.55.25-.25 0-.5.07-.25.08-.5.13-.15 0-.35-.03-.2-.02-.4-.02-.45.05-.9-.05t-.9-.1l-.3-.1q-.15-.05-.3-.05-.85.05-1.6-.28-.75-.32-1.5-.67-.6-.15-.85-.55-.35-.4-.77-.68-.43-.27-.93-.47-.3-.1-.6-.28l-.65-.37q-.05-.2-.15-.4l-.2-.4q-.1-.15-.27-.3-.18-.15-.33-.3-.15-.15-.25-.35-.25-.85-.5-1.68-.25-.82-.65-1.62.05-.35.08-.73.02-.37-.08-.82-.05-.1-.05-.25v-.25q0-.25.03-.43.02-.17-.03-.32l-.1-.8q-.05-.4.05-.75l.2-.8q.1-.4.25-.85-.05-.1-.05-.3 0-.2-.05-.4l.2-1.1q.1-.55.25-1.05.15-.3.33-.58.17-.27.37-.57.35-.6.55-1.15.6-.3.73-.38.12-.07.22-.22t.65-.6q-.05-.15.25-.45.3-.3.2-.5.45-.85 1.3-1.35.3-.2.58-.43.27-.22.47-.42.25-.15.48-.13.22.03.42.03.15-.05.33-.08.17-.02.37-.07.1-.05.25-.1t.25-.15l.2-.1q.1-.05.2-.05.45-.05.85-.25.4-.2.75-.4.75.3 1.55.2.5-.05.98.05.47.1.87.25l.7-.2q.4.05.75.25l.7.4h.45q.05.05.1.07.05.03.1.08.55.5 1.05.92.5.43 1.05.88.75.5.95 1.2.2.3.35.45.6.5 1.05 1.35 0 .1.03.27.02.18.02.33-.05.25.1.5.15.25.2.55M58.5 42v-1.25q0-.25-.05-.3-.05-.15-.12-.3-.08-.15-.13-.2v-.85l-.15-.15q-.2 0-.5-.1-.1-.45-.25-.7-.15-.2-.4-.25-.25-.05-.55-.15-.65.2-1.4.35-.75.15-1.45.4-.35.05-.65.05-.3 0-.6.05-.5.2-.87.62-.38.43-.73.83-.2.25-.35.55-.15.3-.35.55-.05.05-.05.3.15.4.45.5.3.05.6.15.3.1.65.2.15-.05.28-.05.12 0 .27-.05.6-.25 1-.05.4.05.73 0 .32-.05.67-.1.3.15.63.2.32.05.62.15.65.2 1.25.2t1.2-.15q.25-.25.25-.45zm31.4 7.8q-.2.65-.12 1.27.07.63-.03 1.28-.05.35 0 .7t-.05.75q-.05.3-.02.62.02.33.02.63-.05.2-.05.5-.1.35-.12.67-.03.33-.13.73 0 .05-.02.12-.03.08-.03.18 0 .35-.4.35-.05-.05-.25-.05-.35-.15-.6-.05l-.5.2-.3.3q-.15.15-.3.35-.55.3-1.02.17-.48-.12-.98-.42-.3 0-.45.05h-.15q-.05-.05-.15-.05-.2-.15-.37-.3-.18-.15-.38-.3-.4-.4-.3-.8.05-.2.13-.38.07-.17.02-.37-.05-.25-.12-.5-.08-.25-.08-.5t.08-.5q.07-.25.12-.5-.1-.4-.3-.8-.2-.4-.3-.85-.05-.4-.12-.83-.08-.42-.08-.82-.05-.45-.07-.88-.03-.42-.03-.92-.1-.6-.5-.95-.35-.4-.6-.75t-.45-.8q-.25-.2-.65-.35l-.1-.2q-.05-.1-.15-.15-.05-.05-.05-.13 0-.07-.05-.12l-.3-.3q-.2-.1-.4 0t-.35.1q-.2.05-.35.05-.15 0-.4.05-.2.1-.32.22-.13.13-.38.23-.15.15-.35.22-.2.08-.4.18-.2.45-.05.85.1.5.13 1.05.02.55.12 1.1.05.5-.1 1.15 0 .15-.05.32-.05.18-.05.38.05.8-.1 1.57-.15.78-.4 1.58.05.5.1.97.05.48.1.98v1.05q0 .65-.7.75H74.6q-.5.05-.97.1-.48.05-.88.3-.2.05-.37.15-.18.1-.43.2l-.35.35q-.1 0-.22.02-.13.03-.23-.02-.5-.25-.95-.4-.5-.65-.6-1.4-.1-.75-.35-1.4.05-.3.13-.58.07-.27-.03-.52-.05-.15-.05-.55 0-.15.03-.28.02-.12-.03-.22-.15-.95.1-1.65.1-.45-.05-.95-.2-.9-.15-1.85.15-.8-.05-1.6-.15-.15 0-.4 0-.25.03-.53.02-.27.07-.47.05-.2.2-.33.15-.12.25-.22l.15-.9q.1-.15-.15-.5-.05-.1-.15-.03-.1.08-.2.13l-.05-.05q0-.55.03-1.03.02-.47-.03-.97-.05-.2 0-.35.05-.15.05-.35 0-.15-.05-.35-.05-.2-.05-.4v-.25q0-.15.05-.3l.1-.5q.05-.25.15-.55-.2-.4-.17-.85.02-.45-.08-.95-.05-.15.03-.35.07-.2.12-.45-.2-.45-.15-1.03.05-.57 0-1.12.1-.3.05-.58-.05-.27-.05-.57.05-.5 0-.95-.05-.45.05-.9.05-.15.03-.25-.03-.1-.03-.2-.1-.95.05-1.75.05-.15.05-.4v-.45q-.05-.2-.07-.35-.03-.15.02-.35.15-.3.13-.63-.03-.32.17-.62l.03-.05q.02-.05.02-.1l.1-.05q0-.05.15-.05.25-.1.48-.18.22-.07.47-.12l.3.2q.15.1.35.2h.8q.1-.1.2-.15.1-.05.15-.1l.5-.35q.2-.1.43-.13.22-.02.37.13.45.3.88.5.42.2.87.25.25.4.38.75.12.35.27.75.15.5.45 1.15 0 .25-.17.4-.18.15-.23.45 0 .1.03.3.02.2.07.45 0 .2-.05.4t0 .45q.1.8.05 1.6t-.15 1.55v.7q0 .5.25 1 .2.2.38.42.17.23.32.48.3.3.65.3.7 0 1.43.12.72.13 1.42.03.15-.05.25-.03.1.03.25.03.15.1.38.15.22.05.42.1.55.1.45.65l.05.02q.05.03.1.08.1-.05.2-.05t.15-.05q.65-.25 1.15.1.3.25.7.37.4.13.75.53.35.6.9 1.12.55.53 1.1 1.13.1.15.25.27.15.13.25.23.45.45.5.9.15.7.35 1.1.15.55.45 1.25v.5q.05.2.1.42.05.23.05.48l.1 1.2.1 1.2q0 .05.03.12.02.08-.03.18z" fill="#fff"/></svg>
                            <strong>${timeframe.querySelector('button').textContent}</strong>
                            <strong>${tl(trans.top_type).replace('{type}', tl(trans[type.value]))}</strong>
                            <strong>${width.value}×${height.value}</strong>
                        </div>
                        <div class="user">
                            <div class="avatar">
                                <img src="${page.avatar}" alt="${tl(trans.avatar_for_user).replace('{u}', page.name)}">
                            </div>
                            <strong>${page.name}</strong>
                        </div>
                    </div>
                    `
                        :   ''
                    }
                    ${grid}
                </div>
            `;
            render(
                body,
                html`
                    <div class="loading-data-container">
                        <div class="loading-data-text">
                            ${tl(trans.waiting_for_images)}
                        </div>
                    </div>
                    ${collage_dom}
                `
            );

            music_grids(grid, false);

            // 10 = item-list-gap
            // 15 = card-gap
            const default_size = 380;
            const base = 6;
            const highest = Math.max(+width.value, +height.value);

            const grid_item_size = Math.min(
                default_size,
                Math.floor((default_size * base) / highest)
            );
            const grid_item_gap = settings.collage_grid_gap ? 6 : 0;
            const padding = settings.collage_grid_gap ? 15 : 0;
            const title_height = settings.collage_title ? 32 + 15 : 0;
            const cv_width =
                padding * 2 +
                grid_item_size * width.value +
                grid_item_gap * (width.value - 1);
            const cv_height =
                padding * 2 +
                title_height +
                grid_item_size * height.value +
                grid_item_gap * (height.value - 1);

            const cv_scale = 1;

            collage_dom.style.width = `${cv_width}px`;
            collage_dom.style.height = `${cv_height}px`;
            collage_dom.style.padding = `${padding}px`;
            collage_dom.style.gap = `${padding}px`;
            collage_dom.style.setProperty('--item-list-gap', `${grid_item_gap}px`);
            collage_dom.style.setProperty(
                '--grid-item-size',
                `${grid_item_size}px`
            );

            let initial_canvas = html.node`
                <canvas width=${cv_width * cv_scale} height=${cv_height * cv_scale} />
            `;

            html2canvas(collage_dom, {
                useCORS: true,
                letterRendering: true,
                canvas: initial_canvas,
                scale: cv_scale,
                onclone: (doc) => {
                    doc.querySelectorAll('*').forEach((el) => {
                        el.style.setProperty(
                            'font-family',
                            'Funnel Sans, Inter, Ubuntu Sans, Spline Sans, Roboto, Noto Sans, Noto Sans JP, Noto Sans KR, Noto Sans TC, Lucida Grande, Verdana, Tahoma, -apple-system, BlinkMacSystemFont, sans-serif'
                        );
                    });
                }
            }).then((canvas) => {
                canvas.toBlob((blob) => {
                    const blob_url = URL.createObjectURL(blob);

                    const date = new Date();

                    const filename = tl(trans.chart_template_filename)
                        .replace(
                            '{timeframe}',
                            timeframe.querySelector('button').textContent
                        )
                        .replace('{user}', page.name)
                        .replace('{type}', tl(trans[type.value]))
                        .replace('{size}', `${width.value}×${height.value}`)
                        .replace('{brand}', version.brand)
                        .replace(
                            '{date}',
                            `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
                        );

                    render(
                        body,
                        html`
                            <div class="collage-canvas">
                                ${canvas}
                                <div class="collage-canvas-actions">
                                    <button
                                        class="btn primary icon"
                                        data-type="download"
                                        onclick=${() =>
                                            download(blob_url, filename)}
                                    >
                                        ${tl(trans.download)}
                                    </button>
                                    <button
                                        class="btn open"
                                        data-type="open"
                                        onclick=${() => open(blob_url)}
                                    >
                                        ${tl(trans.open)}
                                    </button>
                                </div>
                            </div>
                        `
                    );

                    type.querySelector('button').disabled = false;
                    timeframe.querySelector('button').disabled = false;
                    collage_settings.forEach((option) => {
                        option.setAttribute('disabled', false);
                    });
                    submit.disabled = false;
                }, 'image/png');
            });
        } catch(e) {
            collage_error(e);
        }
    }
}
