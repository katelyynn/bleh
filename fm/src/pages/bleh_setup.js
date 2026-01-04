//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { register_activity } from '../activity';
import { log } from '../build/log';
import { auth, discord, page, root } from '../build/page';
import { tl, trans } from '../build/trans';
import { request_changelog } from '../news.js';
import { notify } from '../components/notify';
import { checkup_page_structure } from '../components/structure';
import { refresh_all, update_colour_swatches } from '../config';
import { version } from '../main';
import { register_background, update_page } from '../page';
import { display_colour_presets, theme_bubbles } from './bleh_config';
import { html, render } from 'lighterhtml';
import { setting } from '../components/settings.js';
import { ff } from '../sku.js';
import { sponsor } from '../sponsor.js';
import { settings } from '../build/config.js';
import { dialog } from '../components/dialog.js';
import { match } from '../components/dynamic_theming.js';
import { set_storage } from '../build/tools.js';

export function bleh_setup() {
    page.structure.container = document.body.querySelector('.page-content');
    try {
        page.structure.row = page.structure.container.querySelector('.row');
        page.structure.main = page.structure.row.querySelector('.col-main');
        page.structure.side = page.structure.row.querySelector('.col-sidebar');
    } catch (e) {
        log('unable to find elements', 'page structure');
    }

    let content_top = document.body.querySelector('.content-top');

    checkup_page_structure(false, content_top);

    if (auth.avatar)
        register_background(auth.avatar.replace('/avatar42s/', '/ar0/'));
    else register_background(null);

    page.type = 'bleh_setup';
    page.subpage = '';

    log('status is', 'page', 'info', page);

    update_page();

    page.state.trans = 0;

    // remove error stuff cus we control this page
    page.structure.row.removeChild(page.structure.row.firstElementChild);
    page.structure.row.removeChild(page.structure.row.firstElementChild);

    page.structure.container.removeAttribute('data-beret');
    page.structure.container.removeAttribute('data-short');
    page.structure.content.classList.add('cards-view');

    let masthead = document.body.querySelector('.masthead');
    masthead.classList.add('in-setup');

    render(
        page.structure.main,
        html`
            <section class="setup" ref=${(el) => (page.structure.setup = el)}>
                ${auth.name ?
                    html.node`
            <div class="avatar">
                <img src=${auth.avatar.replace('/avatar42s/', '/avatar170s/')} alt=${tl(trans.your_avatar)}>
            </div>
            <div class="info">
                <h1>${tl(trans.bleh_setup)}</h1>
                <div class="subtle">
                    ${{ html: tl(trans.logged_in_as).replace('{user}', `<a class="mention" href="${root}user/${auth.name}">@${auth.name}</a>`) }}
                </div>
            </div>
            `
                :   html.node`
            <div class="avatar">
                <img class="missing-avatar" alt=${tl(trans.your_avatar)}>
            </div>
            <div class="info">
                <h1>${tl(trans.bleh_setup)}</h1>
                <div class="subtle">
                    ${tl(trans.not_logged_in)}
                </div>
            </div>
            `}
                <div class="sep"></div>
                <div
                    class="setup-content"
                    ref=${(el) => (page.structure.setup_content = el)}
                ></div>
                <div
                    class="setup-footer"
                    ref=${(el) => (page.structure.setup_footer = el)}
                ></div>
            </section>
        `
    );

    bleh_setup_start();
}

function bleh_setup_start() {
    page.structure.setup.setAttribute('data-page', 'start');
    page.structure.setup.setAttribute('data-animating', 'true');
    setTimeout(function () {
        page.structure.setup.setAttribute('data-animating', 'false');
        render(page.structure.setup_content, html`
            <p>${{ html: tl(trans.welcome_to_bleh) }}</p>
        `);
        render(page.structure.setup_footer, html`
            <a class="see-more cancel" href="${root}user/${auth.name}">
                ${tl(trans.skip)}
            </a>
            <div class="fill"></div>
            <button class="btn primary continue" onclick=${() => setup_accessibility()}>
                ${tl(trans.next)}
            </button>
        `);
    }, page.state.trans);

    page.state.trans = 200;
}

function setup_themes() {
    page.structure.setup.setAttribute('data-page', 'themes');
    page.structure.setup.setAttribute('data-animating', 'true');

    let adaptive_tip;
    let bubbles;

    function render_tip() {
        adaptive_tip.setAttribute('aria-hidden', !settings.theme_schedule);

        render(
            adaptive_tip,
            html`
                ${tl(trans.adaptive_tip, {
                    day: tl(trans.themes[settings.theme_day]),
                    night: tl(trans.themes[settings.theme_night])
                })}<a
                    onclick=${() => {
                        dialog({
                            id: 'auto_theme',
                            title: tl(trans.themes.name),
                            body: html.node`
                        <div class="setting-group">
                            ${(theme_day = setting({
                                id: 'theme_day',
                                list: [
                                    {
                                        value: 'light',
                                        text: tl(trans.themes.light)
                                    },
                                    {
                                        value: 'ink',
                                        text: tl(trans.themes.ink)
                                    },
                                    {
                                        value: 'dark',
                                        text: tl(trans.themes.dark)
                                    },
                                    {
                                        value: 'darker',
                                        text: tl(trans.themes.darker)
                                    },
                                    {
                                        value: 'oled',
                                        text: tl(trans.themes.oled)
                                    }
                                ],
                                func: () => {
                                    render_tip();
                                    bubbles.re_render();
                                    match();
                                }
                            }))}
                            ${(theme_night = setting({
                                id: 'theme_night',
                                list: [
                                    {
                                        value: 'light',
                                        text: tl(trans.themes.light)
                                    },
                                    {
                                        value: 'ink',
                                        text: tl(trans.themes.ink)
                                    },
                                    {
                                        value: 'dark',
                                        text: tl(trans.themes.dark)
                                    },
                                    {
                                        value: 'darker',
                                        text: tl(trans.themes.darker)
                                    },
                                    {
                                        value: 'oled',
                                        text: tl(trans.themes.oled)
                                    }
                                ],
                                func: () => {
                                    render_tip();
                                    bubbles.re_render();
                                    match();
                                }
                            }))}
                        </div>
                        <p class="card-tip">${tl(trans.theme_schedule)}</p>
                    `
                        });
                    }}
                    >${tl(trans.change_schedule)}</a
                >
            `
        );
    }

    setTimeout(function () {
        page.structure.setup.setAttribute('data-animating', 'false');
        render(
            page.structure.setup_content,
            html`
                <div class="setting-group">
                    <div class="setting" data-type="action">
                        <div class="heading">
                            <h5>${tl(trans.themes.name)}</h5>
                        </div>
                        <div class="info v">
                            ${(bubbles = theme_bubbles(() => {
                                sat_bg.compat();

                                render_tip();
                                match();
                            }))}
                            <p
                                class="card-tip"
                                ref=${(el) => (adaptive_tip = el)}
                            />
                        </div>
                    </div>
                    ${setting({ id: 'solarium' })}
                    <div class="setting" data-type="action">
                        <div class="heading">
                            <h5>${tl(trans.hue)}</h5>
                        </div>
                        <div class="info swatch-info">
                            <div
                                id="colour_custom"
                                class="swatch-group palette"
                            ></div>
                            <div class="sep swatch-sep" />
                            <div
                                id="colour_palette"
                                class="swatch-group palette"
                            ></div>
                        </div>
                    </div>
                    ${ff('card_saturation') ?
                        html.node`
                ${(sat_bg = setting({ id: 'sat_bg' }))}
                `
                    :   ''}
                </div>
            `
        );
        render(page.structure.setup_footer, html`
            <button class="see-more cancel" onclick=${() => setup_accessibility()}>
                ${tl(trans.back)}
            </button>
            <div class="fill"></div>
            <button class="btn primary continue" onclick=${() => setup_music()}>
                ${tl(trans.next)}
            </button>
        `);

        render_tip();

        display_colour_presets();
        update_colour_swatches();
    }, page.state.trans);
};

function setup_accessibility() {
    page.structure.setup.setAttribute('data-page', 'accessibility');
    page.structure.setup.setAttribute('data-animating', 'true');
    setTimeout(function () {
        page.structure.setup.setAttribute('data-animating', 'false');
        render(
            page.structure.setup_content,
            html`
                <p>${tl(trans.accessibility_explain)}</p>
                <div class="settings">
                    <div class="setting-group">
                        ${setting({ id: 'reduced_motion', func: (val) => {
                            if (val) {
                                page.state.trans = 0;
                            } else {
                                page.state.trans = 200;
                            }
                        } })}
                        ${setting({ id: 'underline_links' })}
                    </div>
                </div>
            `
        );
        render(page.structure.setup_footer, html`
            <button class="see-more cancel" onclick=${() => setup()}>
                ${tl(trans.back)}
            </button>
            <div class="fill"></div>
            <button class="btn primary continue" onclick=${() => setup_themes()}>
                ${tl(trans.next)}
            </button>
        `);
    }, page.state.trans);
};

function setup_music() {
    page.structure.setup.setAttribute('data-page', 'music');
    page.structure.setup.setAttribute('data-animating', 'true');
    setTimeout(function () {
        page.structure.setup.setAttribute('data-animating', 'false');

        render(page.structure.setup_content, html`
            <p>${tl(trans.music_explain)}</p>
            <div class="settings">
                <div class="inner-preview pad flex">
                    <section class="redesigned-header mockup redesigned-track-header no-top-margin">
                        <div class="avatar-side">
                            <img src="https://lastfm.freetls.fastly.net/i/u/avatar170s/8bd696cbd4aa4d4eb6d35393232f55e4.jpg">
                        </div>
                        <div class="info-side">
                            <div class="sub-text">${tl(trans.track)}</div>
                            <div class="title-container">
                                <h1 class="bleh--name-with-features">
                                    <div class="title">California Love</div>
                                    <div
                                        class="feat"
                                        data-bleh--tag-type="ft."
                                        data-bleh--tag-group="guests"
                                    >
                                        ft. Dr. Dre, Roger Troutman
                                    </div>
                                    <div
                                        class="feat"
                                        data-bleh--tag-type="- remix"
                                        data-bleh--tag-group="mixes"
                                    >
                                        Remix
                                    </div>
                                </h1>
                                <h1 class="bleh--name-without-features">
                                    California Love (ft. Dr. Dre, Roger
                                    Troutman) - Remix
                                </h1>
                            </div>
                            <h2>
                                <a class="header-new-crumb">2Pac</a
                                ><span class="bleh--name-with-features"
                                    >,
                                </span>
                                <a
                                    class="header-new-crumb bleh--name-with-features"
                                    >Dr. Dre</a
                                ><span class="bleh--name-with-features"
                                    >,
                                </span>
                                <a
                                    class="header-new-crumb bleh--name-with-features"
                                    >Roger Troutman</a
                                >
                            </h2>
                        </div>
                    </section>
                </div>
                <div class="setting-group">
                    ${setting({ id: 'corrections' })}
                    ${setting({ id: 'format_guest_features' })}
                </div>
            </div>
        `);
        render(page.structure.setup_footer, html`
            <button class="see-more cancel" onclick=${() => setup_themes()}>
                ${tl(trans.back)}
            </button>
            <div class="fill"></div>
            <button class="btn primary continue" onclick=${() => setup_layout()}>
                ${tl(trans.next)}
            </button>
        `);
    }, page.state.trans);
};

function setup_layout() {
    page.structure.setup.setAttribute('data-page', 'music');
    page.structure.setup.setAttribute('data-animating', 'true');
    setTimeout(function () {
        page.structure.setup.setAttribute('data-animating', 'false');

        let track_layout;
        let expand_tracks;
        let track_album_name_location;

        let preview;

        function render_track_preview() {
            const avi = auth.avatar.replace('/avatar42s/', '/avatar170s/');

            render(preview, html`
                <table class="chartlist chartlist--with-image chartlist--with-loved chartlist--with-artist chartlist--with-more">
                    <tbody>
                        <tr
                            class="chartlist-row chartlist-row--with-artist chartlist-row--now-scrobbling"
                            data-has-bar="false"
                            data-show-album-text=${settings.expand_tracks != 'never' && settings.track_layout == 'column'}
                        >
                            <td class="chartlist-image">
                                <a class="cover-art">
                                    <img src=${avi} loading="lazy" />
                                </a>
                            </td>
                            <td class="kate-placeholder" />
                            <td class="track-info" data-has-bar="false">
                                <span class="chartlist-name">
                                    <a>Track name</a>
                                </span>
                                <span class="chartlist-artist">
                                    <a>Artist name</a>
                                </span>
                                ${settings.expand_tracks != 'never' && settings.track_layout == 'column' ? html.node`
                                    <span class="chartlist-album custom-album-text">
                                        <a>Album name</a>
                                    </span>
                                ` : ''}
                            </td>
                        </tr>
                        <tr
                            class="chartlist-row chartlist-row--with-artist"
                            data-has-bar="false"
                            data-show-album-text=${settings.expand_tracks == 'always' && settings.expand_tracks != 'never' && settings.track_layout == 'column'}
                        >
                            <td class="chartlist-image">
                                <a class="cover-art">
                                    <img src=${avi} loading="lazy" />
                                </a>
                            </td>
                            <td class="kate-placeholder" />
                            <td class="track-info" data-has-bar="false">
                                <span class="chartlist-name">
                                    <a>Track name</a>
                                </span>
                                <span class="chartlist-artist">
                                    <a>Artist name</a>
                                </span>
                                ${settings.expand_tracks == 'always' && settings.expand_tracks != 'never' &&settings.track_layout == 'column' ? html.node`
                                    <span class="chartlist-album custom-album-text">
                                        <a>Album name</a>
                                    </span>
                                ` : ''}
                            </td>
                        </tr>
                    </tbody>
                </table>
            `);
        }

        render(page.structure.setup_content, html`
            <p>${tl(trans.music_explain)}</p>
            <div class="settings">
                <div class="inner-preview pad" ref=${(el) => (preview = el)} />
                <div class="setting-group">
                    ${(track_layout = setting({
                        id: 'track_layout',
                        func: () => {
                            expand_tracks.compat();
                            track_album_name_location.compat();
                            render_track_preview();
                        }
                    }))}
                    ${(expand_tracks = setting({
                        id: 'expand_tracks',
                        func: () => {
                            render_track_preview();
                        }
                    }))}
                    ${(track_album_name_location = setting({
                        id: 'track_album_name_location'
                    }))}
                </div>
            </div>
        `);
        render(page.structure.setup_footer, html`
            <button class="see-more cancel" onclick=${() => setup_music()}>
                ${tl(trans.back)}
            </button>
            <div class="fill"></div>
            <button class="btn primary continue" onclick=${() => setup_end()}>
                ${tl(trans.next)}
            </button>
        `);

        render_track_preview();
    }, page.state.trans);
};

function setup_end() {
    page.structure.setup.setAttribute('data-page', 'end');
    page.structure.setup.setAttribute('data-animating', 'true');
    setTimeout(function () {
        page.structure.setup.setAttribute('data-animating', 'false');
        render(
            page.structure.setup_content,
            html`
                <p>
                    ${{
                        html: tl(trans.setup_end)
                            .replace('{a}', `<a href="${root}bleh">`)
                            .replace('{/a}', '</a>')
                    }}
                </p>
                <div class="mini-list">
                    <a
                        class="btn mini"
                        href="https://discord.gg/${discord}"
                        target="_blank"
                    >
                        <div class="mini-icon colourful" data-type="discord">
                            <div class="bleh-icon" />
                        </div>
                        <div class="mini-info">
                            <h5>${tl(trans.join_discord)}</h5>
                        </div>
                        <div
                            class="bleh-icon mini-arrow"
                            style="--icon: var(--mask)"
                            data-type="arrow-right"
                        ></div>
                    </a>
                    <button class="btn mini" onclick=${() => sponsor()}>
                        <div class="mini-icon colourful" data-type="sponsor">
                            <div class="bleh-icon" />
                        </div>
                        <div class="mini-info">
                            <h5>${tl(trans.sponsor)}</h5>
                        </div>
                        <div
                            class="bleh-icon mini-arrow"
                            style="--icon: var(--mask)"
                            data-type="arrow-right"
                        ></div>
                    </button>
                </div>
            `
        );

        if (auth.name) {
            render(page.structure.setup_footer, html`
                <button class="see-more cancel" onclick=${() => setup_layout()}>
                    ${tl(trans.back)}
                </button>
                <div class="fill"></div>
                <a class="btn primary continue" href="${root}user/${auth.name}">
                    ${tl(trans.finish)}
                </a>
            `);
        } else {
            render(page.structure.setup_footer, html`
                <button class="see-more cancel" onclick=${() => setup_layout()}>
                    ${tl(trans.back)}
                </button>
                <div class="fill"></div>
                <a class="btn primary continue" href="${root}dashboard">
                    ${tl(trans.finish)}
                </a>
            `);
        }
    }, page.state.trans);
};

/**
 * notify user if new update and stores in localStorage for next time
 * @returns if first-time installing, redirect to setup
 */
export function notify_if_new_update() {
    let last_version_used =
        localStorage.getItem('bleh_last_version_used') || '';

    // enter first-time setup
    if (last_version_used == '') {
        window.location.href = `${root}bleh/setup`;
        set_storage('bleh_last_version_used', version.build);
        register_activity('install_bleh', [], `${root}bleh`);
        return;
    }

    // otherwise, it's a usual update
    if (last_version_used != version.build) {
        notify({
            title: tl(trans.you_are_up_to_date),
            body: tl(trans.updated.notification, {
                v: `${version.build}.${version.sku}`
            }),
            persist: true,
            icon: 'icon-16-update'
        });
        register_activity(
            'update_bleh',
            [{ name: version.build, type: 'bleh' }],
            `${root}bleh`
        );
        set_storage('bleh_last_version_used', version.build);

        request_changelog();
    }
}
