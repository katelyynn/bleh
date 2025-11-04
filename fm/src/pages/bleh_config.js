//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { settings } from '../build/config';
import { album_track_corrections, artist_corrections } from '../build/music';
import {
    api_key,
    auth,
    oracle_albums,
    oracle_artists,
    oracle_tracks,
    page,
    root,
    theme_preview
} from '../build/page';
import { stored_season } from '../build/seasonal';
import { sponsor_list } from '../build/sponsor';
import { clamp_sat, hex_to_hsl, set_storage, time } from '../build/tools';
import { lang, lang_info, tl, trans } from '../build/trans';
import { load_badges } from '../components/badge';
import { dialog, dialog_rm } from '../components/dialog';
import { markdown } from '../components/markdown';
import { notify } from '../components/notify';
import { load_settings, refresh_all, update_colour_swatches } from '../config';
import { version } from '../main';
import { update_page } from '../page';
import { seasonal_timer_end, seasonal_timer_start } from '../seasonal';
import { ff } from '../sku';
import { html, render } from 'lighterhtml';
import {
    compile_settings,
    save_setting,
    setting
} from '../components/settings.js';
import { parse_scrobbles_as_rank } from '../components/colourful_counts.js';
import { input } from '../components/input.js';
import { share } from '../components/share.js';
import { force_refresh_style, start_update, update_check } from '../style.js';
import tippy from 'tippy.js';
import {
    checkup_friend_cache,
    load_profile_cache_externally
} from './profile.js';
import { select_prepare_list } from '../components/select.js';
import { match } from '../components/dynamic_theming.js';
import { manage_oracle_data, oracle_data } from '../components/oracle.js';
import { render_activity } from '../activity.js';
import { DateTime } from 'luxon';
import { sponsor, sponsor_manage, sponsors } from '../sponsor.js';
import { version as florence_version } from '@tealmiku/florence';

export function bleh_settings() {
    page.name = auth.name;
    page.subpage = '';

    update_page();

    // remove error stuff cus we control this page
    page.structure.row.removeChild(page.structure.row.firstElementChild);
    page.structure.row.removeChild(page.structure.row.firstElementChild);

    let params = new URLSearchParams(document.location.search);
    page.requested.tab = params.get('tab');
    page.requested.setting = params.get('setting');

    let path = window.location.pathname.split('/');
    let tab = path[path.length - 1];

    if (tab == 'bleh') tab = null;

    if (page.requested.tab && !tab) tab = page.requested.tab;

    const tabs = {
        general: {
            name: tl(trans.general),
            icon: 'general'
        },
        visual: {
            name: tl(trans.visual),
            icon: 'visual'
        },
        interface: {
            name: tl(trans.interface),
            icon: 'layout'
        },
        profile: {
            name: tl(trans.profile),
            icon: 'user'
        },
        playback: {
            name: tl(trans.playback),
            icon: 'album'
        },
        seasonal: {
            name: tl(trans.seasonal.name)
        },
        accessibility: {
            name: tl(trans.accessibility)
        },
        fill: {
            type: 'fill'
        },
        performance: {
            name: tl(trans.troubleshooting),
            icon: 'advanced'
        },
        sku: {
            name: tl(trans.flags),
            password: settings.hu_tao
        }
    };

    // go wild
    let nav = html.node`
        <div class="toolbar">
            <nav class="navlist secondary-nav navlist--more redesigned-navigation bleh-settings-navigation">
                <ul class="navlist-items">
                    ${Object.entries(tabs).map(([id, tab]) => {
                        if (tab.hide_if) return html.node``;

                        if (tab.type && tab.type == 'fill') {
                            return html.node`
                                <div class="fill" />
                            `;
                        }

                        return html.node`
                            <li class="navlist-item secondary-nav-item">
                                <a class="secondary-nav-item-link bleh--nav" data-bleh-page=${id} data-type=${tab.icon} data-password=${tab.password} onclick=${() => change_settings_page(id)}>
                                    ${tab.label ? tab.label : tab.name}
                                </a>
                            </li>
                        `;
                    })}
                </ul>
            </nav>
        </div>
    `;

    render(page.structure.side, html`
        <div class="cta first priority sponsor colourful">
            ${auth.sponsor ? html.node`
                <strong>${tl(trans.you_are_a_sponsor)}</strong>
                <a class="see-more" onclick=${() => sponsor_manage()}>${tl(trans.manage_sponsor)}</a>
            ` : html.node`
                <strong>${tl(trans.news_sponsor_cta)}</strong>
                <a class="see-more" onclick=${() => sponsor()}>${tl(trans.sponsor)}</a>
            `}
        </div>
        <section class="side-actions">
            <button class="btn side-action" data-type="import" onclick=${() => import_settings()}>
                ${tl(trans.import)}
            </button>
            <button class="btn side-action" data-type="export" onclick=${() => export_settings()}>
                ${tl(trans.export)}
            </button>
            <button class="btn side-action" data-type="reset" onclick=${() => reset_settings()}>
                ${tl(trans.reset)}
            </button>
        </section>
        ${ff('skip_to_setting') ? html.node`
            <div class="bleh--panel">
                <h4>${tl(trans.skip_to)}</h4>
                <div class="skip-to-list"></div>
            </div>
        ` : ''}
        <div class="bleh--panel">
            <p class="card-tip">
                ${version.brand} ${version.build}.${version.sku}
                <i>(florence ${florence_version})</i>
            </p>
        </div>
    `);

    page.structure.row.insertBefore(nav, page.structure.content);

    if (!tab) change_settings_page('general');
    else change_settings_page(tab);

    if (page.requested.setting) scroll_to_setting(page.requested.setting);
}

function page_loading() {
    render(page.structure.main, html`
        <div class="bleh--panel">
            <div class="loading-data-container">
                <div class="loading-data-text">${tl(trans.loading)}</div>
            </div>
        </div>
    `);
}

export async function render_setting_page(page_id) {
    if (page_id == 'general') {
        if (auth.pro === null) {
            setTimeout(() => {
                render_setting_page('general');
            }, 10);
            page_loading();
            return;
        }

        register_skip_to([]);

        let update_btn;
        let pause_btn;

        const update_required = localStorage.getItem('bleh_update_required') || 'false';
        const last_checked = localStorage.getItem('bleh_update_checked') || null;
        const version_to_install = localStorage.getItem('bleh_update_to') || null;

        let paused = localStorage.getItem('bleh_update_paused') || 'false';
        let paused_until =
            localStorage.getItem('bleh_update_paused_until') || null;

        let badge_count = 0;

        let badges = load_badges(auth.name);
        if (badges) badge_count = badges.length;
        if (auth.pro) badge_count++;

        const auth_key = localStorage.getItem('bleh_auth');
        const auth_valid = localStorage.getItem('bleh_auth_valid');

        render(page.structure.main, html`
                <section class="bleh--panel">
                    <div class="update-center-header">
                        ${paused === 'true' ? html.node`
                            <div class="update-center-icon">
                                <div class="update-container">
                                    <div class="bleh-icon" data-type="update" />
                                </div>
                                <div class="check-circle paused colourful">
                                    <div class="bleh-icon" data-type="paused" />
                                </div>
                            </div>
                            <div class="update-center-details">
                                <h2>${tl(trans.updates_paused)}</h2>
                                <p class="last-checked">${tl(trans.paused_until_date).replace('{d}', DateTime.fromJSDate(new Date(paused_until)).toRelative())}</p>
                            </div>
                            <button class="btn primary icon" data-type="update" ref=${(el) => (update_btn = el)} disabled>${tl(trans.check)}</button>
                        ` : update_required === 'false' ? html.node`
                            <div class="update-center-icon">
                                <div class="update-container">
                                    <div class="bleh-icon" data-type="update" />
                                </div>
                                ${last_checked
                                        ? html.node`
                                <div class="check-circle colourful">
                                    <div class="bleh-icon" data-type="check-thick" />
                                </div>
                                `
                                        : ''
                                    }
                            </div>
                            <div class="update-center-details">
                                ${last_checked
                                        ? html.node`
                                <h2>${tl(trans.you_are_up_to_date)}</h2>
                                <p class="last-checked">${tl(trans.last_checked_date).replace('{d}', DateTime.fromJSDate(new Date(last_checked)).toRelative())}</p>
                                `
                                        : html.node`
                                <h2>${tl(trans.missing_updates)}</h2>
                                <p class="last-checked">${tl(trans.never_checked)}</p>
                                `
                                    }
                            </div>
                            <button class="btn primary icon" data-type="update" ref=${(el) => (update_btn = el)} onclick=${() => update_check(true, update_btn, () => {
                                notify({
                                    id: 'update',
                                    title: tl(trans.updates),
                                    body: tl(trans.checked_for_updates),
                                    icon: 'icon-16-update'
                                });
                                render_setting_page('general');
                            })}>${tl(trans.check)}</button>
                        ` : html.node`
                            <div class="update-center-icon">
                                <div class="update-container">
                                    <div class="bleh-icon" data-type="update" />
                                </div>
                            </div>
                            <div class="update-center-details">
                                <h2>${tl(trans.update_available_to_install)}</h2>
                                ${last_checked ? html.node`
                                    <p class="last-checked">${tl(trans.last_checked_date, { d: DateTime.fromJSDate(new Date(last_checked)).toRelative() })}</p>
                                ` : html.node`
                                    <p class="last-checked">${tl(trans.never_checked)}</p>
                                `}
                            </div>
                            <div class="button-group">
                                <button class="btn icon" data-type="update" ref=${(el) => (update_btn = el)} onclick=${() => update_check(true, update_btn, () => {
                                    notify({
                                        id: 'update',
                                        title: tl(trans.updates),
                                        body: tl(trans.checked_for_updates),
                                        icon: 'icon-16-update'
                                    });
                                    render_setting_page('general');
                                })}>${tl(trans.check)}</button>
                                <button class="btn primary icon" data-type="update" ref=${(el) => (update_btn = el)} onclick=${() => start_update()}>${tl(trans.install_now)}</button>
                            </div>
                        `}
                    </div>
                    ${last_checked && paused === 'false' && update_required === 'true' ? html.node`
                        <div class="alert alert-info">${tl(trans.you_are_installing_version, { v: version_to_install })}</div>
                    ` : html.node`
                        <div class="alert alert-info">${tl(trans.you_are_running_version, { v: version.build })}</div>
                    `}
                </section>
                <section class="bleh--panel">
                    <h4>${tl(trans.profile)}</h4>
                    <div class="setting-group">
                        ${auth.name ? html.node`
                            <div class="setting" data-type="info">
                                <div class="avatar-container">
                                    <div class="avatar-inner">
                                        <img src=${auth.avatar} alt=${auth.name} />
                                    </div>
                                </div>
                                <div class="heading">
                                    <h5>@${auth.name}</h5>
                                </div>
                                <div class="info">
                                    <p>${tl(trans.profile_and_badges, { c: badge_count.toString() })}</p>
                                    ${badge_count > 0 ? html.node`
                                        <button class="see-more" onclick=${() => {
                                            dialog({
                                                id: 'badges',
                                                title: auth.name,
                                                body: html.node`
                                                    <div class="generic-table-list badge-list">
                                                        ${badges ? badges.map(badge => {
                                                            let style;
                                                            let classname = '';
                                                            if (
                                                                badge.icon &&
                                                                badge.hue &&
                                                                badge.sat &&
                                                                badge.lit
                                                            ) {
                                                                style = `--mask: url(${badge.icon}); --hue: ${badge.hue}; --sat: ${badge.sat}; --lit: ${badge.lit}`;
                                                            } else {
                                                                classname = `user-status--bleh-${badge.type} user-status--bleh-user-${auth.name}`;
                                                            }

                                                            return html.node`
                                                                <div class="generic-table-list-entry badge-list-entry">
                                                                    <div class="icon-container colourful ${classname}" style=${style}>
                                                                        <div class="bleh-icon" style="--icon: var(--mask)" />
                                                                    </div>
                                                                    <div class="name colourful ${classname}" style=${style}>
                                                                        ${badge.name}
                                                                    </div>
                                                                    <div class="text">
                                                                        ${badge.reason}
                                                                    </div>
                                                                </div>
                                                            `;
                                                        }) : ''}
                                                        ${auth.pro ? html.node`
                                                            <div class="generic-table-list-entry badge-list-entry">
                                                                <div class="icon-container colourful user-status-subscriber">
                                                                    <div class="bleh-icon" style="--icon: var(--mask)" />
                                                                </div>
                                                                <div class="name colourful user-status-subscriber">
                                                                    ${tl(trans.badges['user-status-subscriber'].name)}
                                                                </div>
                                                                <div class="text">
                                                                    ${tl(trans.badges['user-status-subscriber'].reason)}
                                                                </div>
                                                            </div>
                                                        ` : ''}
                                                    </div>
                                                `
                                            });
                                        }}>${tl(trans.view)}</button>
                                    ` : ''}
                                </div>
                            </div>
                        ` : ''}
                        ${auth.sponsor ? html.node`
                            <div class="setting" data-type="action">
                                <div class="heading">
                                    <h5>${tl(trans.you_are_a_sponsor)}</h5>
                                    <p>${tl(trans.sponsor_get_badge)}</p>
                                </div>
                                <div class="toggle-wrap">
                                    <button class="btn primary icon sponsor" data-type="sponsor" onclick=${() => sponsor_manage()}>
                                        ${tl(trans.manage_sponsor)}
                                    </button>
                                </div>
                            </div>
                        ` : html.node`
                            <div class="setting" data-type="action">
                                <div class="heading">
                                    <h5>${tl(trans.news_sponsor_cta)}</h5>
                                    <p>${tl(trans.api.body)}</p>
                                </div>
                                <div class="toggle-wrap">
                                    <button class="btn primary icon sponsor" data-type="sponsor" onclick=${() => sponsor()}>
                                        ${tl(trans.sponsor)}
                                    </button>
                                </div>
                            </div>
                        `}
                        <div class="setting" data-type="info">
                            <div class="heading">
                                <h5>${tl(trans.current_version)}</h5>
                            </div>
                            <div class="info">
                                <p>${sponsor_list.latest}</p>
                                <button class="see-more update-check sponsor-related" onclick=${() => sponsors(true, () => {
                                    render_setting_page('general');
                                })}>
                                    ${tl(trans.update_check)}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
                ${!page.mobile ? html.node`
                    <section class="bleh--panel">
                        <h4>${tl(trans.branding)}</h4>
                        <div class="setting-group">
                            ${setting({ id: 'branding_type' })}
                        </div>
                    </section>
                ` : ''}
                ${auth.name ? html.node`
                    <section class="bleh--panel">
                        <h4>API</h4>
                        <div class="setting-group">
                            <div class="setting" data-type="action">
                                <div class="heading">
                                    <h5>${tl(trans.api.name)}</h5>
                                    <p>${tl(trans.api.body)}</p>
                                </div>
                                <div class="toggle-wrap">
                                    <a class="btn ${auth_key && auth_valid == 'true' ? '' : 'primary'} icon connect" href="${root}api/auth?api_key=${api_key}&cb=${root}bleh/api">
                                        ${tl(trans.connect)}
                                    </a>
                                </div>
                            </div>
                            <div class="setting" data-type="info">
                                <div class="heading">
                                    <h5>${tl(trans.api_status)}</h5>
                                </div>
                                <div class="info">
                                    ${auth_key && auth_valid == 'true'
                                    ? html.node`
                                    <p>${tl(trans.connected)}</p>
                                    `
                                    : html.node`
                                    <p>${tl(trans.not_connected)}</p>
                                    `
                                }
                                </div>
                            </div>
                        </div>
                    </section>
                ` : ''}
                <section class="bleh--panel">
                    <h4>${tl(trans.language)}</h4>
                    <div class="setting-group">
                        <div class="languages">
                            ${Object.entries(lang_info).sort(([, a], [, b]) => b.percent - a.percent).map(([key, language]) => {
                                let date;

                                const row = html.node`
                                    <div class="language-row${lang == key ? ' active' : ''}">
                                        <div class="flag-container">
                                            <img src="https://katelyynn.github.io/bleh/fm/flags/${key}.svg" alt="flag for ${key}">
                                        </div>
                                        <div class="name">
                                            <h5>${language.name}</h5>
                                            <p>${{ html: tl(trans.by_user, { u: language.by.map((user) => `<a href="${root}user/${user}">${user}</a>`).join(', ') }) }}</p>
                                        </div>
                                        ${language.new ? html.node`
                                            <div class="badges">
                                                <div class="new-badge">${tl(trans.new)}</div>
                                            </div>
                                        ` : html.node`
                                            <div class="badges"></div>
                                        `}
                                        ${language.percent ? () => {
                                            const elem = html.node`
                                                                    <div class="percent colourful" style="--hue-over: ${language.percent * 1.2}; --sat-over: 1.2; --lit-over: 1;" data-percent=${language.percent}>
                                                                        ${language.percent}%
                                                                    </div>
                                                                `;

                                            tippy(elem, {
                                                content: `${tl(trans.amount_translated, { c: language.translated })}, ${tl(trans.missing_translated, { c: language.missing })}`
                                            });

                                            return elem;
                                        } : ''}
                                        <div class="date">
                                            <p ref=${(el) => (date = el)}>${language.last_updated != 'latest' ? DateTime.fromISO(language.last_updated).toRelative() : language.last_updated}</p>
                                        </div>
                                    </div>
                                `;

                                if (language.last_updated != 'latest') {
                                    tippy(date, {
                                        content: DateTime.fromISO(
                                            language.last_updated
                                        ).toLocaleString(DateTime.DATE_MED)
                                    });
                                }

                                return row;
                            })}
                        </div>
                    </div>
                    <div class="setting-group">
                        <div class="setting" data-type="action">
                            <div class="heading">
                                <h5>${tl(trans.submit_language.name)}</h5>
                                <p>${tl(trans.submit_language.body)}</p>
                            </div>
                            <div class="toggle-wrap">
                                <a class="see-more" href="https://github.com/katelyynn/bleh/wiki" target="_blank">
                                    ${tl(trans.help_contribute)}
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            `
        );
    } else if (page_id == 'visual') {
        if (
            auth.name &&
            auth.sets.hue == 255 &&
            auth.sets.sat == 1 &&
            auth.sets.lit == 1
        ) {
            setTimeout(() => {
                render_setting_page('visual');
            }, 10);
            page_loading();
            return;
        }

        register_skip_to([]);

        let colourful_active;
        let colourful_all;
        let sat_bg;

        let adaptive_tip;
        let bubbles;

        function render_tip() {
            adaptive_tip.setAttribute('aria-hidden', !settings.theme_schedule);

            render(adaptive_tip, html`
                ${tl(trans.adaptive_tip, {
                    day: tl(trans.themes[settings.theme_day]),
                    night: tl(trans.themes[settings.theme_night])
                })}
                <a onclick=${() => {
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
                }}>
                    ${tl(trans.change_schedule)}
                </a>
            `);
        }

        render(page.structure.main, html`
                <section class="bleh--panel">
                    <h4>${tl(trans.appearance)}</h4>
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
                        ${ff('high_contrast')
                    ? setting({ id: 'high_contrast' })
                    : ''}
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
                        <div class="setting" data-type="options">
                            <div class="heading">
                                <h5>${tl(trans.change_my_colour_when.name)}</h5>
                                <p>${tl(trans.change_my_colour_when.body)}</p>
                            </div>
                            <div class="primary-selections">
                                ${setting({
                        id: 'hue_from_album',
                        standalone: true
                    })}
                                ${(colourful_active = setting({
                        id: 'colourful_tracks',
                        standalone: true,
                        func: () => {
                            colourful_all.compat();
                        }
                    }))}
                                ${(colourful_all = setting({
                        id: 'colourful_tracks_all',
                        standalone: true,
                        func: () => {
                            colourful_active.compat();
                        }
                    }))}
                            </div>
                        </div>
                        ${ff('card_saturation')
                    ? html.node`
                                ${(sat_bg = setting({ id: 'sat_bg' }))}
                            `
                    : ''}
                        ${setting({ id: 'noise' })}
                    </div>
                </section>
                <section class="bleh--panel">
                    <h4>${tl(trans.fonts)}</h4>
                    <div class="inner-preview pad">
                        <h1 class="font-preview">${tl(trans.font_example)}</h1>
                    </div>
                    <div class="setting-group">
                        ${setting({ id: 'font' })}
                        ${setting({ id: 'font_weight' })}
                        ${setting({ id: 'font_weight_medium' })}
                        ${setting({ id: 'font_weight_bold' })}
                        ${setting({ id: 'font_emoji' })}
                    </div>
                </section>
                <section class="bleh--panel">
                    <h4>${tl(trans.artwork)}</h4>
                    <div class="inner-preview pad">
                        <div class="palette albums" style="height: fit-content">
                            <div
                                class="album-cover swatch"
                                style="background-image: url('https://lastfm.freetls.fastly.net/i/u/770x0/1569198c4cf0a3b2ff8728975e8359fa.jpg')"
                            ></div>
                            <div
                                class="album-cover swatch"
                                style="background-image: url('https://lastfm.freetls.fastly.net/i/u/770x0/b897255bf422baa93a42536af293f9f8.jpg')"
                            ></div>
                            <div
                                class="album-cover swatch"
                                style="background-image: url('https://lastfm.freetls.fastly.net/i/u/770x0/def68d94aae8e52ef2d1c0c9d3e16ff4.jpg')"
                            ></div>
                            <div
                                class="album-cover swatch"
                                style="background-image: url('https://lastfm.freetls.fastly.net/i/u/770x0/510546e3b6df7504392274c528c77780.jpg')"
                            ></div>
                            <div
                                class="album-cover swatch"
                                style="background-image: url('https://lastfm.freetls.fastly.net/i/u/770x0/49cc807f69d59746b6b04be3434e6637.jpg')"
                            ></div>
                            <div
                                class="album-cover swatch"
                                style="background-image: url('https://lastfm.freetls.fastly.net/i/u/770x0/dd76702cea38c838a3090dd9496d92d9.jpg')"
                            ></div>
                        </div>
                    </div>
                    <div class="setting-group">
                        ${setting({ id: 'gloss' })}
                        ${setting({ id: 'grid_glow' })}
                    </div>
                    <div class="setting-group">
                        ${setting({ id: 'avatar_radius' })}
                    </div>
                </section>
                <section class="bleh--panel">
                    <h4>${tl(trans.other)}</h4>
                    <div class="setting-group">${setting({ id: 'rain' })}</div>
                </section>
            `
        );

        render_tip();

        display_colour_presets();
        update_colour_swatches();
    } else if (page_id == 'interface') {
        if (!page.state.quick_access_items) {
            setTimeout(() => {
                render_setting_page('interface');
            }, 10);
            page_loading();
            return;
        }

        register_skip_to([]);

        function chartlist_bar(value, max) {
            let count_bar = html.node`
                <div class="chartlist-count-bar">
                    <a class="chartlist-count-bar-link">
                        <span class="chartlist-count-bar-slug" data-max-stat-value="${max}" data-stat-value="${value}" style="width: ${(max / max) * 100}%" />
                        <span class="chartlist-count-bar-value">${value.toLocaleString(lang)}</span>
                    </a>
                </div>
            `;

            let parsed_scrobble_as_rank = parse_scrobbles_as_rank(value);

            count_bar.setAttribute(
                'data-bleh--scrobble-milestone',
                parsed_scrobble_as_rank.milestone
            );
            count_bar.style.setProperty(
                '--hue-over',
                parsed_scrobble_as_rank.hue
            );
            count_bar.style.setProperty(
                '--sat-over',
                parsed_scrobble_as_rank.sat
            );
            count_bar.style.setProperty(
                '--lit-over',
                parsed_scrobble_as_rank.lit
            );

            return count_bar;
        }

        let bars;

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

        render(page.structure.main, html`
            <section class="bleh--panel">
                <h4>${tl(trans.tracklist)}</h4>
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
            </section>
            <section class="bleh--panel">
                <div class="inner-preview pad">
                    <div class="bars" ref=${(el) => (bars = el)}>
                        ${() => {
                            let max = 30_000;

                            for (
                                let value = 1_000;
                                value <= max;
                                value += 1_000
                            ) {
                                bars.appendChild(chartlist_bar(value, max));
                            }
                        }}
                    </div>
                </div>
                <div class="setting-group">
                    ${setting({ id: 'colourful_counts' })}
                </div>
            </section>
            <section class="bleh--panel">
                <h4>${tl(trans.overview)}</h4>
                <div class="setting-group">
                    ${setting({
                        id: 'music_links',
                        list: page.state.music_links
                    })}
                    ${setting({ id: 'default_avatar_action' })}
                    ${setting({ id: 'simulate_scroll' })}
                </div>
                <div class="inner-preview pad flex">
                    <section class="catalogue-tags">
                        <ul class="tags-list tags-list--global">
                            <li class="tag">
                                <a href="/tag/pop">pop</a>
                            </li>
                            <li class="tag">
                                <a href="/tag/country">country</a>
                            </li>
                            <li class="tag">
                                <a href="/tag/singer-songwriter"
                                    >singer-songwriter</a
                                >
                            </li>
                            <li class="tag">
                                <a href="/tag/female+vocalists"
                                    >female vocalists</a
                                >
                            </li>
                            <li class="tag">
                                <a href="/tag/synthpop">synthpop</a>
                            </li>
                        </ul>
                    </section>
                </div>
                <div class="setting-group">
                    ${setting({ id: 'gendered_tags' })}
                </div>
            </section>
            <section class="bleh--panel">
                <h4>${tl(trans.navigation_items.name)}</h4>
                <div class="setting-group">
                    ${setting({ id: 'navigation_items', list: page.state.quick_access_items })}
                    ${!page.mobile ? setting({ id: 'navigation_language' }) : ''}
                </div>
            </section>
            <section class="bleh--panel">
                <h4>${tl(trans.shouts)}</h4>
                <div class="inner-preview pad flex">
                    <div
                        class="shout js-shout js-link-block"
                        data-kate-processed="true"
                    >
                        ${auth.name
                ? html.node`
                    <h3 class="shout-user">
                        <a>${auth.name}</a>
                    </h3>
                    <span class="avatar shout-user-avatar">
                        <img src="${auth.avatar.replace('/avatar42s/', '/avatar170s/')}" alt="${tl(trans.your_avatar)}" loading="lazy">
                    </span>
                    `
                : html.node`
                    <h3 class="shout-user">
                        <a>${tl(trans.profile)}</a>
                    </h3>
                    <span class="avatar shout-user-avatar">
                        <img class="missing-avatar" alt="${tl(trans.your_avatar)}" loading="lazy">
                    </span>
                    `}
                        <a class="shout-permalink shout-timestamp">
                            <time
                                datetime="2024-06-05T02:33:39+01:00"
                                title="Wednesday 5 Jun 2024, 2:33am"
                            >
                                5 Jun 2:33am
                            </time>
                        </a>
                        <div class="shout-body if-markdown-on">
                            ${markdown(tl(trans.markdown_shouts.preview))}
                        </div>
                        <div class="shout-body if-markdown-off">
                            <p>${tl(trans.markdown_shouts.preview)}</p>
                        </div>
                    </div>
                </div>
                <div class="setting-group">
                    ${setting({ id: 'shout_markdown' })}
                </div>
            </section>
            ${!page.mobile ? html.node`
            <section class="bleh--panel">
                <h4>${tl(trans.quick_switcher)}</h4>
                <div class="setting-group">
                    ${setting({ id: 'rabbit' })}
                    <div class="setting" data-type="action">
                        <div class="heading">
                            <h5>${tl(trans.quick_switcher_keybinds)}</h5>
                        </div>
                        <div class="toggle-wrap">
                            <button class="btn see-more" onclick=${() => {
                            dialog({
                                id: 'quick_switcher_keybinds',
                                title: tl(trans.quick_switcher),
                                body: html.node`
                                        <div class="setting-group">
                                            ${setting({ id: 'rabbit_primary' })}
                                            ${setting({ id: 'rabbit_search' })}
                                            ${setting({ id: 'rabbit_profile' })}
                                            ${setting({ id: 'rabbit_shortcut' })}
                                            ${setting({ id: 'rabbit_bleh_settings' })}
                                        </div>
                                    `
                            });
                        }}>
                                ${tl(trans.change_now)}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            `: ''}
        `);

        render_track_preview();
    } else if (page_id == 'playback') {
        let total_artists = 0;
        let total_album_tracks = 0;

        if (artist_corrections)
            total_artists = Object.keys(artist_corrections).length;
        if (album_track_corrections)
            total_album_tracks = Object.values(album_track_corrections).reduce(
                (sum, album_tracks) => sum + Object.keys(album_tracks).length,
                0
            );

        let corrections;
        let format_guest_features;
        let romanise_jp;
        let romanise_ko;

        let tracklist_source;

        render(page.structure.main, html`
            <section class="bleh--panel">
                <h4>${tl(trans.music_corrections)}</h4>
                <div class="inner-preview pad">
                    <div class="lotus-preview">
                        <div class="before">
                            <h1>mY aNtI-aIrCrAfT fRiEnD</h1>
                            <h2>jUlIe</h2>
                        </div>
                        <div class="after">
                            <h1>my anti-aircraft friend</h1>
                            <h2>julie</h2>
                        </div>
                    </div>
                </div>
                <div class="setting-group">
                    ${(corrections = setting({
            id: 'corrections',
            func: () => {
                romanise_jp.compat();
                romanise_ko.compat();
            }
        }))}
                    <div
                        class="setting"
                        data-type="info"
                        disabled=${!artist_corrections.version ||
            !album_track_corrections.version}
                    >
                        <div class="heading">
                            <h5>${tl(trans.corrections_loaded)}</h5>
                        </div>
                        <div class="info">
                            <p>
                                ${tl(trans.corrections_loaded_value)
                .replace('{c1}', total_artists)
                .replace('{c2}', total_album_tracks)}
                            </p>
                            <button
                                class="see-more"
                                onclick="_open_correction_modal()"
                            >
                                ${tl(trans.view_all)}
                            </button>
                        </div>
                    </div>
                    <div
                        class="setting"
                        data-type="info"
                        disabled=${!artist_corrections.version ||
            !album_track_corrections.version}
                    >
                        <div class="heading">
                            <h5>${tl(trans.current_version)}</h5>
                        </div>
                        <div class="info">
                            <p>
                                ${artist_corrections.version ==
                album_track_corrections.version
                ? artist_corrections.version
                : `${artist_corrections.version}, ${album_track_corrections.version}`}
                            </p>
                            <button
                                class="see-more update-check"
                                onclick="_lotus_check()"
                            >
                                ${tl(trans.update_check)}
                            </button>
                        </div>
                    </div>
                    <div
                        class="setting"
                        data-type="info"
                        disabled=${!artist_corrections.version ||
            !album_track_corrections.version}
                    >
                        <div class="heading">
                            <h5>${tl(trans.help_contribute)}</h5>
                        </div>
                        <div class="info">
                            <a
                                class="see-more"
                                href="https://github.com/katelyynn/lotus/issues/new/choose"
                                target="_blank"
                            >
                                ${tl(trans.suggest_correction)}
                            </a>
                        </div>
                    </div>
                </div>
                <div class="setting-group">
                    ${setting({ id: 'prefer_no_redirect' })}
                    <div class="setting" data-type="action">
                        <div class="heading">
                            <h5>${tl(trans.legacy_redirects.name)}</h5>
                            <p>${tl(trans.legacy_redirects.body)}</p>
                        </div>
                        <div class="toggle-wrap">
                            <a
                                class="btn see-more"
                                href="${root}settings/website"
                                target="_blank"
                            >
                                ${tl(trans.change_now)}
                            </a>
                        </div>
                    </div>
                    ${setting({ id: 'travis' })}
                </div>
            </section>
            <section class="bleh--panel">
                <h4>${tl(trans.smart_music_titles)}</h4>
                <div class="inner-preview pad flex">
                    <section
                        class="redesigned-header mockup redesigned-track-header no-top-margin"
                    >
                        <div class="avatar-side">
                            <img
                                src="https://lastfm.freetls.fastly.net/i/u/avatar170s/8bd696cbd4aa4d4eb6d35393232f55e4.jpg"
                            />
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
                    ${(format_guest_features = setting({
                id: 'format_guest_features',
                func: () => {
                    romanise_jp.compat();
                    romanise_ko.compat();
                }
            }))}
                    ${setting({ id: 'show_guest_features' })}
                    ${setting({ id: 'show_remaster_tags' })}
                </div>
                <div class="setting-group">
                    <div class="setting" data-type="options">
                        <div class="heading">
                            <h5>${tl(trans.romanise_titles)}</h5>
                        </div>
                        <div class="primary-selections">
                            ${(romanise_jp = setting({
                id: 'romanise_jp',
                standalone: true
            }))}
                            ${(romanise_ko = setting({
                id: 'romanise_ko',
                standalone: true
            }))}
                        </div>
                    </div>
                </div>
                <div class="card-tip">${tl(trans.romanise_require)}</div>
                <div class="setting-group">
                    ${setting({ id: 'glacier_library_graphs' })}
                </div>
            </section>
            ${ff('oracle') ? html.node`
                <section class="bleh--panel">
                    <h4>${tl(trans.oracle_heading)}</h4>
                    <div class="setting-group">
                        ${setting({ id: 'oracle_beta', func: () => {
                            tracklist_source.compat();
                        } })}
                        ${tracklist_source = setting({ id: 'tracklist_source', list: page.state.tracklist_sources })}
                        <div
                            class="setting"
                            data-type="info"
                            disabled=${!oracle_artists.version || !oracle_albums.version || !oracle_tracks.version}
                        >
                            <div class="heading">
                                <h5>${tl(trans.current_version)}</h5>
                            </div>
                            <div class="info">
                                <p>
                                    ${oracle_artists.version}, ${oracle_albums.version}, ${oracle_tracks.version}
                                </p>
                                <button
                                    class="see-more update-check"
                                    onclick=${() => oracle_data(true)}
                                >
                                    ${tl(trans.update_check)}
                                </button>
                            </div>
                        </div>
                        <div
                            class="setting"
                            data-type="info"
                            disabled=${!oracle_artists.version || !oracle_albums.version || !oracle_tracks.version}
                        >
                            <div class="heading">
                                <h5>${tl(trans.manage_data)}</h5>
                            </div>
                            <div class="info">
                                <button class="see-more" onclick=${() => manage_oracle_data()}>
                                    ${tl(trans.view_all)}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            ` : ''}
        `);
    } else if (page_id == 'seasonal') {
        register_skip_to([]);

        render(
            page.structure.main,
            html`
                <div class="bleh--panel">
                    <div class="seasonal-inner">
                        <div class="sub-text">
                            ${tl(trans.seasonal_timeline)}
                        </div>
                        <h4>
                            ${DateTime.fromJSDate(
                new Date(stored_season.now)
            ).toLocaleString(DateTime.DATE_FULL)}
                        </h4>
                    </div>
                    <div class="setting-group">
                        ${setting({ id: 'seasonal' })}
                        <div class="setting" data-type="info">
                            <div class="heading">
                                <h5>${tl(trans.current_season)}</h5>
                            </div>
                            <div class="info">
                                <div
                                    class="icon-combo"
                                    data-season=${stored_season.id}
                                >
                                    <div
                                        class="bleh-icon bleh-seasonal-icon"
                                    ></div>
                                    <p>
                                        ${tl(
                trans.seasonal.listing[
                stored_season.id
                ]
            )}
                                    </p>
                                </div>
                            </div>
                        </div>
                        ${stored_season.id != 'none' &&
                    stored_season.start &&
                    stored_season.end
                    ? html.node`
                    <div class="setting" data-type="info">
                        <div class="heading">
                            <h5>${tl(trans.started)}</h5>
                        </div>
                        <div class="info">
                            <p id="current_season_start">${DateTime.fromISO(stored_season.start.replace('y0', stored_season.year).replace('{offset}', stored_season.offset)).toRelative(DateTime.fromISO(stored_season.now))}</p>
                        </div>
                    </div>
                    <div class="setting" data-type="info">
                        <div class="heading">
                            <h5>${tl(trans.ends_in)}</h5>
                        </div>
                        <div class="info">
                            <p id="current_season">${DateTime.fromISO(stored_season.end.replace('y0', stored_season.year).replace('{offset}', stored_season.offset)).toRelative(DateTime.fromISO(stored_season.now))}</p>
                        </div>
                    </div>
                    `
                    : settings.seasonal
                        ? html.node`
                    <div class="setting" data-type="info">
                        <div class="heading">
                            <h5>${tl(trans.next_in)}</h5>
                        </div>
                        <div class="info">
                            <p id="next_season_start">${DateTime.fromISO(stored_season.next_start.replace('y0', stored_season.next_is_new_year ? stored_season.year + 1 : stored_season.year).replace('{offset}', stored_season.offset)).toRelative(DateTime.fromISO(stored_season.now))}</p>
                        </div>
                    </div>
                    `
                        : ''}
                        ${settings.seasonal
                    ? html.node`
                    <div class="setting" data-type="info">
                        <div class="heading">
                            <h5>${tl(trans.calculated_offset)}</h5>
                        </div>
                        <div class="info">
                            <p>${stored_season.offset}</p>
                        </div>
                    </div>
                    `
                    : ''}
                    </div>
                    <h4>${tl(trans.settings)}</h4>
                    <div class="setting-group">
                        ${setting({ id: 'seasonal_particles' })}
                        ${setting({ id: 'seasonal_particles_fps' })}
                        ${setting({ id: 'seasonal_overlays' })}
                    </div>
                </div>
            `
        );
    } else if (page_id == 'performance') {
        register_skip_to([]);

        if (settings.hu_tao != 'develop') {
            dialog({
                id: 'development_only',
                body: html.node`
                    <div class="modal-vertical-inner error-inner">
                        <div class="bleh-icon" style="--icon: var(--icon-16-warning)"></div>
                        <h1>${tl(trans.intended_for_development.name)}</h1>
                        <p>${tl(trans.intended_for_development.body)}</p>
                    </div>
                `,
                theme: 'error'
            });
        }

        render(
            page.structure.main,
            html`
                <section class="bleh--panel">
                    <div class="alert alert-danger">
                        ${tl(trans.beware_notice)}
                    </div>
                    <div class="setting-group">
                        ${setting({ id: 'dev' })} ${setting({ id: 'branch' })}
                        <div class="setting" data-type="action">
                            <div class="heading">
                                <h5>${tl(trans.force_refresh_style.name)}</h5>
                                <p>${tl(trans.force_refresh_style.body)}</p>
                            </div>
                            <div class="toggle-wrap">
                                <button
                                    class="btn see-more update-check"
                                    onclick=${() => force_refresh_style()}
                                >
                                    ${tl(trans.refresh)}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="sep"></div>
                    <h4>Debug information</h4>
                    <ul>
                        <li>Theme loading is currently ${!settings.dev}</li>
                        <li>
                            <span class="lotus lotus-name lotus-name-small"
                                >lotus</span
                            >
                            is currently ${settings.corrections}
                        </li>
                        <br />
                        <li>
                            Theme will expire at
                            <span class="time"
                                >${time(
                localStorage.getItem(
                    'bleh_cached_style_timeout'
                )
            )}</span
                            >
                        </li>
                        <li>
                            <span class="lotus lotus-name lotus-name-small"
                                >lotus</span
                            >
                            (artist) will expire at
                            <span class="time"
                                >${time(
                localStorage.getItem('lotus_artist_expire')
            )}</span
                            >
                        </li>
                        <li>
                            <span class="lotus lotus-name lotus-name-small"
                                >lotus</span
                            >
                            (album_track) will expire at
                            <span class="time"
                                >${time(
                localStorage.getItem(
                    'lotus_album_track_expire'
                )
            )}</span
                            >
                        </li>
                        <br />
                        <li>
                            It is currently
                            <span class="time">${time()}</span>
                        </li>
                        <br />
                        <li>
                            Has the timeout expired?
                            ${new Date(
                localStorage.getItem(
                    'bleh_cached_style_timeout'
                )
            ) < new Date()}
                        </li>
                    </ul>
                    <div class="sep"></div>
                    <h4>${tl(trans.development)}</h4>
                    <button
                        class="see-more"
                        onclick=${() => {
                    if (settings.hu_tao == 'develop') {
                        change_settings_page('sku');
                    } else {
                        dialog({
                            id: 'hu_tao',
                            title: tl(trans.development),
                            body: html.node`
                                ${setting({ id: 'hu_tao', text: false, focus: true })}
                            `
                        });
                    }
                }}
                    >
                        ${tl(trans.manage_feature_flags)}
                    </button>
                </section>
            `
        );
    } else if (page_id == 'profile') {
        if (!auth.name) {
            render(
                page.structure.main,
                html`
                    <div class="bleh--panel">
                        <div class="loading-data-container">
                            <div class="loading-data-text error">
                                ${tl(trans.not_logged_in)}
                            </div>
                        </div>
                    </div>
                `
            );
            return;
        }

        register_skip_to([]);

        const cache = await load_profile_cache_externally(auth.name);

        let friends;
        let starred;

        console.info('friends', settings.friends, settings);

        render(
            page.structure.main,
            html`
                <section class="bleh--panel">
                    <h4>${tl(trans.banners)}</h4>
                    <div class="inner-preview pad">
                        <div class="profile-mockup">
                            <div class="mockup-header">
                                <img
                                    class="mockup-avatar"
                                    src="${auth.avatar}"
                                />
                                <div class="mockup-info">
                                    <div class="mockup-subtext"></div>
                                    <div class="mockup-name"></div>
                                </div>
                            </div>
                            <div class="mockup-container">
                                <div class="mockup-col-main">
                                    <div class="mockup-panel main"></div>
                                </div>
                                <div class="mockup-col-sidebar">
                                    <div
                                        class="mockup-panel mockup-obsession-panel"
                                    >
                                        <img
                                            class="mockup-obsession-art"
                                            src="https://lastfm.freetls.fastly.net/i/u/64s/510546e3b6df7504392274c528c77780.jpg"
                                        />
                                        <div
                                            class="mockup-obsession-name"
                                        ></div>
                                    </div>
                                    <div class="mockup-panel main"></div>
                                </div>
                            </div>
                            <div
                                class="profile-mockup-background from-avatar"
                                style="background-image: url(${auth.avatar.replace(
                '/avatar42s/',
                '/avatar300s/'
            )})"
                            ></div>
                            ${cache.banner
                    ? html.node`
                        <div class="profile-mockup-background from-banner" style="background-image: url(${cache.banner})"></div>
                        `
                    : html.node`
                        <div class="profile-mockup-background from-track" style="background-image: url(https://lastfm.freetls.fastly.net/i/u/avatar300s/df927f4f88034b7f9a651636b965c9d7)"></div>
                        `}
                        </div>
                    </div>
                    <div class="setting-group">
                        <div class="setting" data-type="options">
                            <div class="heading">
                                <h5>${tl(trans.view_backgrounds_on)}</h5>
                            </div>
                            <div class="primary-selections">
                                ${setting({
                        id: 'profile_header_own',
                        standalone: true
                    })}
                                ${setting({
                        id: 'profile_header_others',
                        standalone: true
                    })}
                            </div>
                        </div>
                        ${setting({ id: 'profile_avi_background' })}
                    </div>
                </section>
                ${ff('friends')
                    ? html.node`
            <section class="bleh--panel">
                <h4>${tl(trans.friends)}</h4>
                <div class="setting-group">
                    ${(friends = setting({
                        id: 'friends',
                        list: settings.friends,
                        func: (val) => {
                            if (!val.includes(settings.starred_friend))
                                save_setting('starred_friend', '');

                            checkup_friend_cache(val);

                            render_setting_page('profile');
                        }
                    }))}
                    ${(starred = setting({ id: 'starred_friend', list: select_prepare_list([{ value: '', text: tl(trans.none) }, ...settings.friends]) }))}
                </div>
                <p class="card-tip">${tl(trans.friend_difference)}</p>
            </section>
            `
                    : ''}
                <section class="bleh--panel">
                    <h4>${tl(trans.other)}</h4>
                    <div class="setting-group">
                        ${setting({ id: 'bio_markdown' })}
                        ${setting({ id: 'show_your_progress' })}
                    </div>
                </section>
                <section class="bleh--panel">
                    <h4>${tl(trans.notes)}</h4>
                    <div class="setting-group">
                        <div class="profile-notes">
                            <div class="loading-data-container">
                                <div class="loading-data-text failed">
                                    ${tl(trans.no_notes)}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="bleh--panel">
                    <h4>${tl(trans.activity)}</h4>
                    <p>${tl(trans.what_are_activities)}</p>
                    <div class="inner-preview pad">
                        <div class="preview-card activity-preview" />
                    </div>
                    <div class="setting-group">
                        ${setting({ id: 'activities' })}
                        <div class="setting" data-type="action">
                            <div class="heading">
                                <h5>${tl(trans.clear_history)}</h5>
                            </div>
                            <div class="toggle-wrap">
                                <button
                                    class="see-more"
                                    onclick=${() => {
                    localStorage.removeItem(
                        'bwaa_recent_activity'
                    );
                    notify({
                        id: 'cleared_history',
                        title: tl(
                            trans.cleared_activity_history
                        ),
                        type: 'success'
                    });
                }}
                                >
                                    ${tl(trans.clear)}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="setting-group">
                        ${setting({ id: 'activity_shout' })}
                        ${setting({ id: 'activity_image' })}
                        ${setting({ id: 'activity_obsess' })}
                        ${setting({ id: 'activity_love' })}
                        ${setting({ id: 'activity_bookmark' })}
                        ${setting({ id: 'activity_wiki' })}
                        ${setting({ id: 'activity_install' })}
                    </div>
                </section>
            `
        );

        init_profile_notes();
        activity_preview();
    } else if (page_id == 'accessibility') {
        register_skip_to([]);

        render(page.structure.main, html`
            <section class="bleh--panel">
                <h4>${tl(trans.accessibility)}</h4>
                <div class="setting-group">
                    ${setting({ id: 'reduced_motion' })}
                    ${setting({ id: 'underline_links' })}
                </div>
            </section>
            <section class="bleh--panel">
                <h4>${tl(trans.display_name.name)}</h4>
                <div class="setting-group">
                    ${setting({ id: 'display_name_styles' })}
                    ${setting({ id: 'accessible_name_colours' })}
                </div>
            </section>
            ${ff('static_gifs') ? html.node`
            <section class="bleh--panel">
                <h4>${tl(trans.images)}</h4>
                <div class="setting-group">
                    ${setting({ id: 'static_gifs' })}
                    <div class="setting" data-type="options">
                        <div class="heading">
                            <h5>${tl(trans.apply_to)}<div class="new-badge">${tl(trans.new)}</div></h5>
                        </div>
                        <div class="primary-selections">
                            ${setting({ id: 'static_avatars', standalone: true })}
                            ${setting({ id: 'static_music', standalone: true })}
                        </div>
                    </div>
                    ${setting({ id: 'static_banners' })}
                </div>
            </section>
            ` : ''}
        `);
    } else if (page_id == 'sku') {
        register_skip_to([]);

        render(page.structure.main, html`
            <div class="bleh--panel">
                <div class="panel-intro">
                    <div class="sub-text">
                        ${version.build}.${version.sku}
                    </div>
                    <h1>☆⌒(>w<)</h1>
                </div>
                <div class="sep" />
                <h4>${tl(trans.manage_feature_flags)}</h4>
                <div class="alert alert-danger">
                    ${tl(trans.beware_notice)}
                </div>
                <div class="setting-group">
                    ${Object.entries(version.feature_flags).reverse().map(([flag, details]) => {
                        let value = ff(flag);

                        let checkbox;
                        let state;

                        return html.node`
                            <div class="setting" data-type="toggle" onclick=${() => {
                                let current = checkbox.checked;

                                checkbox.checked = !current;
                                state.setAttribute('aria-checked', !current);

                                settings.feature_flags[flag] = !current;
                                document.documentElement.setAttribute(
                                    `data-ff--${flag}`,
                                    (!current).toString()
                                );
                                compile_settings();
                            }}>
                                <div class="heading">
                                    <h5>${details.name}</h5>
                                    ${details.notice ? html.node`<p>${{ html: details.notice }}</p>` : ''}
                                    <div class="info-row">
                                        <div class="new-badge flag-${details.default}">${details.default}</div><p class="date">${details.date}</p><p>${flag}</p>
                                    </div>
                                </div>
                                <div class="toggle-wrap">
                                    <input type="checkbox" ref=${(el) => (checkbox = el)} value=${value} checked=${value} />
                                    <button class="toggle" aria-checked=${value} ref=${(el) => (state = el)}>
                                        <div class="dot" />
                                    </button>
                                </div>
                            </div>
                        `;
                    })}
                </div>
            </div>
        `);
    } else if (page_id == 'music') {
        register_skip_to([
            {
                id: 'corrections',
                name: tl(trans.correct_titles_with_lotus)
            },
            {
                id: 'format_guest_features',
                name: tl(trans.format_guest_features.name)
            },
            {
                id: 'stacked_chartlist_info',
                name: tl(trans.track_column_view)
            },
            {
                id: 'colourful_counts',
                name: tl(trans.colourful_counts.name)
            },
            {
                id: 'travis',
                name: tl(trans.redirect_messages.name)
            },
            {
                id: 'gloss',
                type: 'slider',
                name: tl(trans.gloss.name)
            },
            {
                id: 'grid_glow',
                name: tl(trans.grid_glow.name)
            },
            {
                id: 'gendered_tags',
                name: tl(trans.gendered_tags.name)
            }
        ]);

        render(
            page.structure.main,
            html`
                <div class="bleh--panel">
                    <h4 class="top-header">${tl(trans.music)}</h4>
                    <h4>${tl(trans.tracklist)}</h4>
                    <div class="inner-preview pad">
                        <div class="tracks">
                            <div class="track realtime">
                                <div class="cover"></div>
                                <div class="info">
                                    <div class="title"></div>
                                    <div class="artist"></div>
                                    <div class="album"></div>
                                </div>
                                <div class="time"></div>
                            </div>
                            <div class="track">
                                <div class="cover"></div>
                                <div class="info">
                                    <div class="title"></div>
                                    <div class="artist"></div>
                                    <div class="album"></div>
                                </div>
                                <div class="time"></div>
                            </div>
                            <div class="track">
                                <div class="cover"></div>
                                <div class="info">
                                    <div class="title"></div>
                                    <div class="artist"></div>
                                    <div class="album"></div>
                                </div>
                                <div class="time"></div>
                            </div>
                            <div class="track">
                                <div class="cover"></div>
                                <div class="info">
                                    <div class="title"></div>
                                    <div class="artist"></div>
                                    <div class="album"></div>
                                </div>
                                <div class="time"></div>
                            </div>
                            <div class="track">
                                <div class="cover"></div>
                                <div class="info">
                                    <div class="title"></div>
                                    <div class="artist"></div>
                                    <div class="album"></div>
                                </div>
                                <div class="time"></div>
                            </div>
                        </div>
                    </div>
                    <div class="setting-group">
                        ${setting({ id: 'stacked_chartlist_info' })}
                        ${setting({ id: 'expand_tracks' })}
                        ${setting({ id: 'glacier_library_graphs' })}
                    </div>
                    <div class="inner-preview pad">
                        <div class="bars" ref=${(el) => (bars = el)}>
                            ${() => {
                    let max = 30_000;

                    for (
                        let value = 1_000;
                        value <= max;
                        value += 1_000
                    ) {
                        bars.appendChild(chartlist_bar(value, max));
                    }
                }}
                        </div>
                    </div>
                    <div class="setting-group">
                        ${setting({ id: 'colourful_counts' })}
                    </div>
                </div>
            `
        );
    }
}

function register_skip_to(list = null) {
    if (!ff('skip_to_setting')) return;

    if (list == null) return;

    let panel = page.structure.side.querySelector('.skip-to-list');
    panel.innerHTML = '';

    list.forEach((item) => {
        let button = document.createElement('button');
        button.classList.add('skip-to-item');
        button.setAttribute('onclick', `_scroll_to_setting('${item.id}')`);
        button.textContent = item.name;

        if (item.type != null) button.setAttribute('data-type', item.type);

        panel.appendChild(button);
    });
}

unsafeWindow._scroll_to_setting = function (id) {
    scroll_to_setting(id);
};

function scroll_to_setting(id) {
    let setting = document.body.querySelector(`#container-${id}`);

    if (setting != null) {
        let y = setting.getBoundingClientRect().top + window.scrollY - 300;
        window.scroll({
            top: y,
            behavior: 'smooth'
        });
    }
}

unsafeWindow._change_settings_page = function (page, setting = null) {
    change_settings_page(page, setting);
};

export function change_settings_page(page_id, setting = null) {
    if (page_id == page.state.settings_page) return;

    window.history.pushState(page_id, '', `${root}bleh/${page_id}`);
    page.state.settings_page = page_id;

    page.structure.main.innerHTML = '';

    if (ff('bleh_settings_tabs')) {
        let btns = document.querySelectorAll('.bleh--nav');
        btns.forEach((btn) => {
            console.log(btn.getAttribute('data-bleh-page'), page_id);
            if (btn.getAttribute('data-bleh-page') != page_id) {
                btn.classList.remove('secondary-nav-item-link--active');
            } else {
                btn.classList.add('secondary-nav-item-link--active');
            }
        });
    } else {
        let btns = document.querySelectorAll('.bleh--btn');
        btns.forEach((btn) => {
            console.log(btn.getAttribute('data-bleh-page'), page_id);
            if (btn.getAttribute('data-bleh-page') != page_id) {
                btn.classList.remove('active');
            } else {
                btn.classList.add('active');
            }
        });
    }

    if (page_id == 'seasonal') seasonal_timer_start();
    else seasonal_timer_end();

    try {
        render_setting_page(page_id);
    } catch (e) {
        render(
            page.structure.main,
            html`
                <div class="bleh--panel">
                    <div class="loading-data-container">
                        <div class="loading-data-text failed">
                            ${tl(trans.value_failed_to_load).replace(
                '{v}',
                tl(trans.settings)
            )}
                        </div>
                        <pre class="error-info">
${e
                    ? html.node`<span class="error-type">${e.name}</span>: ${e.message}`
                    : ''}</pre
                        >
                    </div>
                </div>
            `
        );
    }

    if (page_id == 'seasonal') {
        refresh_all();
    }

    if (
        page_id == 'seasonal' &&
        settings.seasonal &&
        stored_season.id != 'none' &&
        stored_season.start &&
        stored_season.end
    ) {
        tippy(document.getElementById('current_season'), {
            content: new Date(
                stored_season.end
                    .replace('y0', stored_season.year)
                    .replace('{offset}', stored_season.offset)
            ).toLocaleString(lang)
        });
        tippy(document.getElementById('current_season_start'), {
            content: new Date(
                stored_season.start
                    .replace('y0', stored_season.year)
                    .replace('{offset}', stored_season.offset)
            ).toLocaleString(lang)
        });
        tippy(document.getElementById('next_season_start'), {
            content: new Date(
                stored_season.next_start
                    .replace(
                        'y0',
                        stored_season.next_is_new_year
                            ? stored_season.year + 1
                            : stored_season.year
                    )
                    .replace('{offset}', stored_season.offset)
            ).toLocaleString(lang)
        });
    }

    if (setting != null) {
        let setting_container = page.structure.main.querySelector(
            `.setting[data-id="${setting}"]`
        );

        if (setting_container != null) {
            let y =
                setting_container.getBoundingClientRect().top +
                window.scrollY -
                300;
            window.scroll({
                top: y,
                behavior: 'smooth'
            });
        }
    }
}

export function load_skus() {
    for (let flag in version.feature_flags) {
        let current_state = version.feature_flags[flag].default;

        if (settings.feature_flags[flag] != null)
            current_state = settings.feature_flags[flag];

        document.documentElement.setAttribute(
            `data-ff--${flag}`,
            current_state
        );
    }
}

unsafeWindow._update_flag_toggle = function (flag, container) {
    update_flag_toggle(flag, container);
};
function update_flag_toggle(flag, container) {
    let button = container.querySelector('.toggle');
    if (!button) return;

    let current_state = ff(flag);

    button.setAttribute('aria-checked', !current_state);
    settings.feature_flags[flag] = !current_state;
    document.documentElement.setAttribute(
        `data-ff--${flag}`,
        `${!current_state}`
    );

    // save to settings
    compile_settings();
}

export function display_colour_presets() {
    let colours = {
        custom: [
            {
                type: 'default',
                sets: {
                    hue: 255,
                    sat: 1,
                    lit: 1
                },
                displays: {
                    hue: 'var(--hue-seasonal, 255)',
                    sat: 'var(--sat-seasonal, 1)',
                    lit: 'var(--lit-seasonal, 1)'
                }
            },
            {
                type: 'avatar',
                sets: {
                    hue: auth.sets.hue,
                    sat: auth.sets.sat,
                    lit: auth.sets.lit
                },
                requires_flag: 'colour_based_on_avatar'
            },
            {
                type: 'adaptive',
                requires_flag: 'adaptive_colours'
            },
            {
                type: 'customise'
            }
        ],
        palette: [
            {
                sets: {
                    hue: 0,
                    sat: 1.2,
                    lit: 0.9
                },
                label: trans.red
            },
            {
                sets: {
                    hue: 19,
                    sat: 1.275,
                    lit: 0.95
                },
                label: trans.orange
            },
            {
                sets: {
                    hue: 48,
                    sat: 1.5,
                    lit: 1
                },
                label: trans.yellow
            },
            {
                sets: {
                    hue: 98,
                    sat: 1.05,
                    lit: 1.025
                },
                label: trans.lime
            },
            {
                sets: {
                    hue: 131,
                    sat: 1,
                    lit: 0.925
                },
                label: trans.green
            },
            {
                sets: {
                    hue: 188,
                    sat: 1,
                    lit: 1.1
                },
                label: trans.aqua
            },
            {
                sets: {
                    hue: 228,
                    sat: 1.3,
                    lit: 0.9
                },
                label: trans.blue
            },
            {
                sets: {
                    hue: 254,
                    sat: 1.07,
                    lit: 1
                },
                label: trans.purple
            },
            {
                sets: {
                    hue: 317,
                    sat: 1.1,
                    lit: 1
                },
                label: trans.pink
            },
            {
                sets: {
                    hue: 0,
                    sat: 0,
                    lit: 1
                },
                label: trans.grey
            }
        ]
    };
    let exclusives = {
        christmas: [
            {
                type: 'season',
                label: trans.seasonal.presets.nonsense,
                sets: {
                    hue: 352,
                    sat: 1.8,
                    lit: 0.925
                }
            },
            {
                type: 'season',
                label: trans.seasonal.presets.fruitcake,
                sets: {
                    hue: 24,
                    sat: 0.93,
                    lit: 1
                }
            },
            {
                type: 'season',
                label: trans.seasonal.presets.mistletoe,
                sets: {
                    hue: 130,
                    sat: 0.45,
                    lit: 0.75
                }
            },
            {
                type: 'season',
                label: trans.seasonal.presets.festival,
                sets: {
                    hue: 240,
                    sat: 1.4,
                    lit: 0.875
                }
            }
        ]
    };
    exclusives.new_years = exclusives.christmas;

    let hue_range;
    let sat_range;
    let lit_range;

    for (let type in colours) {
        const swatch_group = page.structure.main.querySelector(`#colour_${type}`);
        if (!swatch_group) return;

        colours[type].forEach(colour => {
            if (colour.type == 'default' && stored_season.id != 'none' && exclusives[stored_season.id]) {
                swatch_group.appendChild(create_swatch(type, colour));

                exclusives[stored_season.id].forEach(exclusive => {
                    swatch_group.appendChild(create_swatch(type, exclusive));
                });

                return;
            }

            swatch_group.appendChild(create_swatch(type, colour));
        });
    }

    function create_swatch(type, colour) {
        if (
            colour.requires_flag &&
            version.feature_flags.hasOwnProperty(colour.requires_flag)
        ) {
            if (!ff(colour.requires_flag)) return html.node``;
        }

        if (colour.type == 'avatar' && !auth.name) return html.node``;

        let text;
        if (colour.label) text = tl(colour.label);

        if (!colour.type) colour.type = 'colour';

        if (!colour.displays && colour.sets) colour.displays = colour.sets;

        let blob;
        let text_elem;
        const swatch = html.node`
            <button class="swatch-container" onclick=${() => {
                if (!colour.sets) return;

                hue_range.set(colour.sets.hue);
                sat_range.set(colour.sets.sat);
                lit_range.set(colour.sets.lit);
            }}>
                <div class="swatch colourful" ref=${(el) => (blob = el)} data-swatch-type=${colour.type} />
                <strong ref=${(el) => (text_elem = el)} />
            </button>
        `;

        if (type == 'custom' && !colour.label) text = tl(trans[colour.type]);

        if (colour.type == 'customise') {
            text = tl(trans.edit);

            let colour;

            tippy(swatch, {
                theme: 'window',
                content: html.node`
                    <div class="dialog-settings">
                        <div class="setting-group blend">
                            ${ff('colour_based_on_hex')
                        ? html.node`
                            <div class="setting" data-type="text">
                                <div class="heading">
                                    <h5>${tl(trans.convert_from_hex)}</h5>
                                </div>
                                <div class="input-container content-form">
                                    ${(colour = input({
                            type: 'colour',
                            value: '#999999',
                            maxlength: 7,
                            warn_if_empty: true
                        }))}
                                    <button class="btn primary icon convert" onclick=${() => {
                                const value = colour.value();
                                const hsl = hex_to_hsl(value);

                                hue_range.set(hsl.h);
                                sat_range.set(
                                    clamp_sat((hsl.s / 100) * 3)
                                );
                                lit_range.set(hsl.l / 100 + 0.35);
                            }}>${tl(trans.convert)}</button>
                                </div>
                            </div>
                            `
                        : ''
                    }
                            ${(hue_range = setting({ id: 'hue', func: update_colour_swatches }))}
                            ${(sat_range = setting({ id: 'sat', func: update_colour_swatches }))}
                            ${(lit_range = setting({ id: 'lit', func: update_colour_swatches }))}
                        </div>
                    </div>
                `,
                placement: 'bottom',
                interactive: true,
                interactiveBorder: 10,
                trigger: 'click',
                appendTo: document.body
            });
        }

        if (colour.sets) {
            colour.sets.accent_type = colour.type;

            blob.style.setProperty('--hue-over', colour.displays.hue);
            blob.style.setProperty('--sat-over', colour.displays.sat);
            blob.style.setProperty('--lit-over', colour.displays.lit);
        }

        if (colour.type == 'default' && stored_season.id != 'none') {
            text = tl(trans.seasonal.name);
        }

        text_elem.textContent = text;

        tippy(swatch, {
            content: text
        });

        return swatch;
    }
}

function init_profile_notes() {
    let profile_notes_table =
        page.structure.main.querySelector('.profile-notes');
    if (!profile_notes_table) return;

    let profile_notes =
        JSON.parse(localStorage.getItem('bleh_profile_notes')) || {};

    if (Object.keys(profile_notes).length == 0) return;

    profile_notes_table.classList =
        'generic-table-list user-vertical-list take-space profile-notes';
    profile_notes_table.innerHTML = '';

    for (let user in profile_notes) {
        profile_notes_table.appendChild(html.node`
            <div class="generic-table-list-entry user-vertical-list-item" id="profile-note-row--${user}">
                <div class="name">
                    <a class="mention" href="${root}user/${user}">@${user}</a>
                </div>
                <div class="text preview">
                    <p id="profile-note-row-preview--${user}">${{ html: profile_notes[user] }}</p>
                </div>
                <div class="actions">
                    <button class="icon chibi edit" onclick=${() => edit_profile_note(user)}>
                        ${tl(trans.delete)}
                    </button>
                    <button class="icon chibi delete danger-subtle" onclick=${() => delete_profile_note(user)}>
                        ${tl(trans.delete)}
                    </button>
                </div>
            </div>
        `);
    }
}

function delete_profile_note(user) {
    let profile_notes =
        JSON.parse(localStorage.getItem('bleh_profile_notes')) || {};
    delete profile_notes[username];
    document
        .getElementById(`profile-note-row--${username}`)
        .style.setProperty('display', 'none');

    set_storage('bleh_profile_notes', JSON.stringify(profile_notes));
}

function edit_profile_note(user) {
    let profile_notes =
        JSON.parse(localStorage.getItem('bleh_profile_notes')) || {};

    let modal = dialog({
        id: 'edit_profile_note',
        title: tl(trans.edit_profile_note),
        body: html.node`
            <textarea class="modal-text" id="bleh--profile-note" placeholder=${tl(trans.anything_you_can_imagine)}>${profile_notes[user]}</textarea>
            <div class="modal-footer">
                <button class="see-more cancel" onclick=${() => dialog_rm({ id: 'edit_profile_note' })}>
                    ${tl(trans.cancel)}
                </button>
                <div class="fill"></div>
                <button class="btn primary save" onclick=${() => save_profile_note_in_window(modal, user)}>
                    ${tl(trans.save)}
                </button>
            </div>
        `
    });
}

function save_profile_note_in_window(modal, user) {
    let profile_notes =
        JSON.parse(localStorage.getItem('bleh_profile_notes')) || {};
    let value_to_save = modal
        .querySelector('#bleh--profile-note')
        .value.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    profile_notes[user] = value_to_save;

    document.getElementById(`profile-note-row-preview--${user}`).textContent =
        value_to_save;

    set_storage('bleh_profile_notes', JSON.stringify(profile_notes));
    dialog_rm({ id: 'edit_profile_note' });
}

export function prepare_corrections_page() {
    let corrections_table_artist =
        document.getElementById('corrections-artist');

    for (let artist in artist_corrections) {
        if (artist == 'version') continue;

        corrections_table_artist.appendChild(html.node`
        <div class="correction-row">
                <div class="primary-name pre-transition">
                    <h5>${artist}</h5>
                </div>
                <div class="arrow-divider"></div>
                <div class="primary-name post-transition">
                    <h5>${artist_corrections[artist]}</h5>
                </div>
        </div>`);
    }

    //

    let corrections_table_albums_tracks = document.getElementById(
        'corrections-albums_tracks'
    );

    for (let artist in album_track_corrections) {
        if (artist == 'version') continue;

        corrections_table_albums_tracks.appendChild(html.node`
            <div class="artist-row">
                <h5>${artist}</h5>
            </div>
        `);

        for (let media in album_track_corrections[artist]) {
            corrections_table_albums_tracks.appendChild(html.node`
                <div class="correction-row">
                    <div class="primary-name pre-transition">
                        <h5>${media}</h5>
                    </div>
                    <div class="arrow-divider"></div>
                    <div class="primary-name post-transition">
                        <h5>${album_track_corrections[artist][media]}</h5>
                    </div>
                </div>
            `);
        }
    }
}

function import_settings() {
    let text;

    const modal = dialog({
        id: 'import_settings',
        title: tl(trans.import_settings),
        body: html.node`
            <p class="big-modal-alert alert-danger">${tl(trans.import_notice)}</p>
            <br>
            <textarea class="modal-text" ref=${(el) => (text = el)} />
            <div class="modal-footer">
                <button class="see-more cancel" onclick="_dialog_rm({id: 'import_settings'})">
                    ${tl(trans.cancel)}
                </button>
                <div class="fill"></div>
                <button class="btn primary download" onclick=${() => {
                try {
                    const parsed = JSON.parse(text.value);

                    // safe to continue
                    set_storage('bleh', text.value);
                    Object.assign(settings, parsed);
                    load_settings();

                    dialog_rm({
                        id: 'import_settings'
                    });
                } catch (e) {
                    // halt
                    dialog({
                        id: 'import_failed',
                        title: tl(trans.import_failed),
                        body: html.node`
                                <p class="big-modal-alert alert-error">${tl(trans.import_failed.notice)}</p>
                                <div class="modal-footer">
                                    <div class="fill"></div>
                                    <button class="btn primary done" onclick=${() => dialog_rm({ id: 'import_failed' })}>
                                        ${tl(trans.done)}
                                    </button>
                                </div>
                            `
                    });
                    console.error(e);
                } finally {
                }
            }}>
                    ${tl(trans.import)}
                </button>
            </div>
        `
    });
}

// export settings
function export_settings() {
    share(JSON.stringify(compile_settings()));
}

// reset settings
function reset_settings() {
    dialog({
        id: 'reset_settings',
        title: tl(trans.reset_settings),
        body: html.node`
            <div class="big-modal-alert alert-error">
                <strong>${tl(trans.reset_notice)}</strong>
                <a class="see-more" onclick=${() => export_settings()}>${tl(trans.make_a_backup)}</a>
            </div>
            <div class="modal-footer">
                <button class="see-more cancel" onclick=${() => dialog_rm({id: 'reset_settings'})}>
                    ${tl(trans.cancel)}
                </button>
                <div class="fill"></div>
                <button class="btn primary icon" data-type="reset" onclick=${() => confirm_reset()}>
                    ${tl(trans.reset)}
                </button>
            </div>
        `
    });
}

function confirm_reset() {
    for (var member in settings) delete settings[member];
    load_settings(true);

    dialog_rm({
        id: 'reset_settings'
    });
}

function activity_preview() {
    let preview = page.structure.main.querySelector('.activity-preview');
    if (!preview) return;

    let random_types = [
        'love',
        'love',
        'love',
        'unlove',
        'bookmark',
        'unbookmark',
        'obsess',
        'image_upload',
        'shout',
        'shout',
        'wiki'
    ];
    let random_involved = [
        {
            name: 'Espresso',
            type: 'track',
            sister: 'Sabrina Carpenter'
        },
        {
            name: 'Busy Woman',
            type: 'track',
            sister: 'Sabrina Carpenter'
        },
        {
            name: 'I might say something stupid',
            type: 'track',
            sister: 'Charli xcx'
        },
        {
            name: 'Seigfried',
            type: 'track',
            sister: 'Frank Ocean'
        },
        {
            name: 'OLYMPIAN',
            type: 'track',
            sister: 'Playboi Carti'
        },
        {
            name: 'GODSTAINED',
            type: 'track',
            sister: 'Quadeca'
        },
        {
            name: 'hypochondriac',
            type: 'album',
            sister: 'brakence'
        },
        {
            name: 'my anti-aircraft friend',
            type: 'album',
            sister: 'julie'
        },
        {
            name: 'In Utero',
            type: 'album',
            sister: 'Nirvana'
        },
        {
            name: 'channel ORANGE',
            type: 'album',
            sister: 'Frank Ocean'
        },
        {
            name: 'Future',
            type: 'artist'
        },
        {
            name: 'Billie Eilish',
            type: 'artist'
        },
        {
            name: 'Swirlies',
            type: 'artist'
        },
        {
            name: 'Lucy Bedroque',
            type: 'artist'
        },
        {
            name: 'underscores',
            type: 'artist'
        },
        {
            name: 'Bladee',
            type: 'artist'
        },
        {
            name: 'Charli xcx',
            type: 'artist'
        },
        {
            name: 'Dawn FM',
            type: 'album',
            sister: 'The Weeknd'
        },
        {
            name: 'Random Access Memories',
            type: 'album',
            sister: 'Daft Punk'
        },
        {
            name: "how i'm feeling now",
            type: 'album',
            sister: 'Charli xcx'
        },
        {
            name: 'Revengeseekerz',
            type: 'album',
            sister: 'Jane Remover'
        },
        {
            name: 'Around The Fur',
            type: 'album',
            sister: 'Deftones'
        },
        {
            name: 'Exmilitary',
            type: 'album',
            sister: 'Death Grips'
        },
        {
            name: 'OFFLINE!',
            type: 'album',
            sister: 'JPEGMAFIA'
        },
        {
            name: 'TRUST! - OFFLINE',
            type: 'track',
            sister: 'JPEGMAFIA'
        },
        {
            name: 'Hotline Bling',
            type: 'track',
            sister: 'Drake'
        },
        {
            name: 'All Eyez On Me',
            type: 'track',
            sister: '2Pac'
        },
        {
            name: 'DOGTOOTH',
            type: 'track',
            sister: 'Tyler, The Creator'
        },
        {
            name: 'so american',
            type: 'track',
            sister: 'Olivia Rodrigo'
        },
        {
            name: 'I KNOW ?',
            type: 'track',
            sister: 'Travis Scott'
        },
        {
            name: 'Apple Pie',
            type: 'track',
            sister: 'Travis Scott'
        },
        {
            name: '34+35',
            type: 'track',
            sister: 'Ariana Grande'
        },
        {
            name: 'New Again',
            type: 'track',
            sister: 'Kanye West'
        },
        {
            name: 'Radio Friendly Unit Shifter',
            type: 'track',
            sister: 'Nirvana'
        },
        {
            name: 'Empty Out Your Pockets',
            type: 'track',
            sister: 'Juice WRLD'
        },
        {
            name: 'Party By Myself',
            type: 'track',
            sister: 'Juice WRLD'
        },
        {
            name: 'Death Race For Love',
            type: 'album',
            sister: 'Juice WRLD'
        },
        {
            name: 'Timeless',
            type: 'track',
            sister: 'The Weeknd'
        },
        {
            name: 'SKITZO',
            type: 'track',
            sister: 'The Weeknd'
        },
        {
            name: 'OPM BABI',
            type: 'track',
            sister: 'Playboi Carti'
        }
    ];

    make_random_activity(preview, random_types, random_involved);
    make_random_activity(preview, random_types, random_involved);
    make_random_activity(preview, random_types, random_involved);

    page.state.activity_preview_timer = setInterval(function () {
        if (!preview) {
            clearInterval(page.state.activity_preview_timer);
            return;
        }

        make_random_activity(preview, random_types, random_involved);
    }, 2300);
}

function make_random_activity(preview, random_types, random_involved) {
    activity_preview_new(preview, {
        type: random_types[Math.floor(Math.random() * random_types.length)],
        date: new Date(),
        involved: [
            structuredClone(random_involved)[
            Math.floor(Math.random() * random_involved.length)
            ]
        ]
    });
}

function activity_preview_new(parent, activity) {
    parent.insertBefore(render_activity(activity), parent.firstElementChild);

    if (parent.childElementCount > 3)
        parent.removeChild(parent.lastElementChild);
}

export function theme_bubbles(func = null) {
    const themes = [
        {
            id: 'adaptive',
            name: tl(trans.auto),
            hide: !ff('adaptive_theme'),
            new_release: true
        },
        {
            id: 'glass',
            type: 'light',
            name: tl(trans.glass),
            hide: !ff('glass'),
            new_release: true
        },
        {
            type: 'sep',
            hide: !ff('adaptive_theme')
        },
        {
            id: 'light',
            type: 'light',
            name: tl(trans.themes.light)
        },
        {
            id: 'ink',
            type: 'light',
            name: tl(trans.themes.ink)
        },
        {
            type: 'sep'
        },
        {
            id: 'dark',
            formal: 'ash',
            type: 'dark',
            name: tl(trans.themes.dark)
        },
        {
            id: 'darker',
            formal: 'dark',
            type: 'darker',
            name: tl(trans.themes.darker)
        },
        {
            id: 'oled',
            formal: 'void',
            type: 'oled',
            name: tl(trans.themes.oled)
        }
    ];

    let buttons = [];

    const bubbles = html.node`
        <div class="theme-bubbles">
            ${themes.map((theme) => {
        if (theme.hide) return html.node``;

        if (theme.type == 'sep') {
            return html.node`
                        <div class="sep theme-bubble-sep" />
                    `;
        }

        if (!theme.formal) theme.formal = theme.id;

        const bubble = html.node`
                    <button class="theme-bubble" data-theme-id=${theme.id} onclick=${() => update_theme_bubble(theme.id)}>
                        <div class="bubble">
                            ${theme.id == 'adaptive'
                ? html.node`
                            <div class="inner theme-preview" data-bleh--theme=${settings.theme_day} data-bleh--theme_type=${['light', 'ink'].includes(settings.theme_day) ? 'light' : 'dark'}>
                                ${theme_preview()}
                            </div>
                            <div class="inner theme-preview" data-bleh--theme=${settings.theme_night} data-bleh--theme_type=${['light', 'ink'].includes(settings.theme_night) ? 'light' : 'dark'}>
                                ${theme_preview()}
                            </div>
                            `
                : html.node`
                            <div class="inner theme-preview" data-bleh--theme=${theme.id} data-bleh--theme_type=${theme.type}>
                                ${theme_preview()}
                            </div>
                            `
            }
                        </div>
                        <strong>
                            ${theme.name}
                            ${theme.new_release ? html.node`<div class="new-badge">${tl(trans.new)}</div>` : ''}
                        </strong>
                    </button>
                `;

        buttons.push(bubble);

        return bubble;
    })}
        </div>
    `;

    bubbles.re_render = () => {
        const adaptive = buttons.find(
            (button) => button.getAttribute('data-theme-id') == 'adaptive'
        );

        const bubble = adaptive.querySelector(':scope > .bubble');

        render(
            bubble,
            html`
                <div
                    class="inner theme-preview"
                    data-bleh--theme=${settings.theme_day}
                    data-bleh--theme_type=${['light', 'ink'].includes(
                settings.theme_day
            )
                    ? 'light'
                    : 'dark'}
                >
                    ${theme_preview()}
                </div>
                <div
                    class="inner theme-preview"
                    data-bleh--theme=${settings.theme_night}
                    data-bleh--theme_type=${['light', 'ink'].includes(
                        settings.theme_night
                    )
                    ? 'light'
                    : 'dark'}
                >
                    ${theme_preview()}
                </div>
            `
        );
    };

    update_theme_bubble();

    return bubbles;

    function update_theme_bubble(theme = null) {
        if (theme) {
            if (theme != 'adaptive') {
                save_setting('theme_schedule', false);
                save_setting('theme', theme);
            } else {
                save_setting('theme_schedule', true);
            }

            if (func) func(theme);
        }

        buttons.forEach((button) => {
            const type = button.getAttribute('data-theme-id');

            if (!settings.theme_schedule) {
                button.setAttribute('aria-selected', settings.theme == type);
            } else if (type == 'adaptive') {
                button.setAttribute('aria-selected', true);
            } else {
                button.setAttribute('aria-selected', false);
            }
        });
    }
}
