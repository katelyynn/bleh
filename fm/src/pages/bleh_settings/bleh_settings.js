//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { settings } from '@/build/config.js';
import { album_track_corrections, artist_corrections } from '@/build/music.js';
import {
    api_key,
    auth,
    oracle_albums,
    oracle_artists,
    oracle_tracks,
    page,
    root,
    theme_preview
} from '@/build/page.js';
import { stored_season } from '@/build/seasonal';
import { clamp_sat, copy, hex_to_hsl, set_storage, time } from '@/build/tools';
import { get_trans_key, lang, lang_browser, lang_info, tl, trans } from '@/build/trans';
import { load_badges } from '@/components/shared/badge';
import { dialog, dialog_rm } from '@/components/dialog/dialog';
import { markdown } from '@/components/shared/markdown';
import { notify } from '@/components/dialog/notify';
import { load_settings, refresh_all, update_colour_swatches } from '../../config.js';
import { version } from '@/main';
import { update_page } from '@/page.js';
import { seasonal_timer_end, seasonal_timer_start } from '@/components/seasonal';
import { ff } from '@/components/settings/sku.js';
import { html, render } from 'lighterhtml';
import {
    compile_settings,
    save_setting,
    setting
} from '@/components/settings/settings';
import { parse_scrobbles_as_rank } from '@/components/music/colourful_counts';
import { input } from '@/components/settings/input';
import { share } from '@/components/dialog/share';
import { force_refresh_style, start_update, update_check } from '@/components/page/style';
import tippy from 'tippy.js';
import {
    checkup_friend_cache,
    load_profile_cache_externally
} from '../profile/profile';
import { select, select_prepare_convert_from_setting, select_prepare_list } from '@/components/settings/select';
import { manage_oracle_data, oracle_data } from '@/components/music/oracle';
import { render_activity } from '@/components/shared/activity';
import { DateTime } from 'luxon';
import { sponsor, sponsor_manage, sponsors } from '@/components/sponsor';
import { version as florence_version } from '@tealmiku/florence';
import { queue_popup } from '@/components/dialog/popup';
import { visual } from '@/pages/bleh_settings/visual';
import { general } from '@/pages/bleh_settings/general';
import { seasonal } from './seasonal';
import { settings_search } from './search.js';

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
            icon: 'general',
            settings: [
                'branding_type',
                'translator'
            ]
        },
        visual: {
            name: tl(trans.visual),
            icon: 'visual',
            settings: [
                'theme',
                'theme_day',
                'theme_night',
                'solarium',
                'hue',
                'sat',
                'lit',
                'hue_from_album',
                'colourful_tracks',
                'colourful_tracks_all',
                'sat_bg',
                'noise',
                'font',
                'font_weight',
                'font_weight_medium',
                'font_weight_bold',
                'font_emoji',
                'gloss',
                'grid_glow',
                'avatar_radius',
                'rain'
            ]
        },
        interface: {
            name: tl(trans.interface),
            icon: 'layout',
            settings: [
                'track_layout',
                'expand_tracks',
                'track_album_name_location',
                'colourful_counts',
                'music_links',
                'default_avatar_action',
                'simulate_scroll',
                'gendered_tags',
                'shout_markdown',
                'rabbit'
            ]
        },
        profile: {
            name: tl(trans.profile),
            icon: 'user',
            settings: [
                'friends',
                'starred_friend',
                'navigation_items',
                'navigation_language',
                'profile_header_own',
                'profile_header_others',
                'profile_avi_background',
                'bio_markdown',
                'show_your_progress',
                'activities'
            ]
        },
        playback: {
            name: tl(trans.playback),
            icon: 'album',
            settings: [
                'corrections',
                'prefer_no_redirect',
                'travis',
                'format_guest_features',
                'show_guest_features',
                'show_remaster_tags',
                'romanise_jp',
                'romanise_ko',
                'glacier_library_graphs',
                'oracle_beta',
                'tracklist_source'
            ]
        },
        seasonal: {
            name: tl(trans.seasonal.name),
            settings: [
                'seasonal',
                'seasonal_particles',
                'seasonal_particles_fps',
                'seasonal_overlays'
            ]
        },
        accessibility: {
            name: tl(trans.accessibility),
            settings: [
                'reduced_motion',
                'underline_links',
                'display_name_styles',
                'accessible_name_colours'
            ]
        },
        fill: {
            type: 'fill'
        },
        translate: {
            name: tl(trans.translate),
            icon: 'language',
            hide: !settings.translator
        },
        performance: {
            name: tl(trans.troubleshooting),
            icon: 'advanced',
            settings: [
                'dev',
                'branch'
            ]
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
                                <a class="secondary-nav-item-link bleh--nav" data-bleh-page=${id} data-type=${tab.icon} data-password=${tab.password} data-should-hide=${tab.hide} data-hide=${tab != id} onclick=${() => change_settings_page(id)}>
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
        ${settings_search(tabs)}
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
                ${version.brand} ${version.build} ‘${version.sku}’
            </p>
            <p class="card-tip">
                florence ${florence_version}
            </p>
        </div>
    `);

    page.structure.row.insertBefore(nav, page.structure.content);

    if (!tab) change_settings_page('general');
    else change_settings_page(tab);

    if (page.requested.setting) scroll_to_setting(page.requested.setting);

    const profile_tab = nav.querySelector('[data-bleh-page="profile"]');
    if (profile_tab) {
        setTimeout(() => {
            queue_popup('close_friends', profile_tab);
        }, 0);
    }
}

export function page_loading() {
    render(page.structure.main, html`
        <div class="bleh--panel">
            <div class="loading-data-container">
                <div class="loading-data-text">${tl(trans.loading)}</div>
            </div>
        </div>
    `);
}

export function page_error(e) {
    render(page.structure.main, html`
        <div class="bleh--panel">
            <div class="loading-data-container">
                <div class="alert alert-error">${e && e.message ? e.message : e}</div>
            </div>
        </div>
    `);
}

export async function render_setting_page(page_id) {
    page_loading();

    try {
        if (page_id == 'general')
            general();
        else if (page_id == 'visual')
            visual();
        else if (page_id == 'seasonal')
            seasonal();
    } catch (e) {
        page_error(e);
    }

    if (page_id == 'interface') {
        register_skip_to([]);

        function chartlist_bar(value, max) {
            let count_bar = html.node`
                <div class="chartlist-count-bar">
                    <a class="chartlist-count-bar-link">
                        <span class="chartlist-count-bar-slug" data-max-stat-value="${max}" data-stat-value="${value}" style="width: ${(max / max) * 100}%" />
                        <span class="chartlist-count-bar-value">${value.toLocaleString(DateTime.DATE_MED)}</span>
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
                                    <a>${tl(trans.track_name)}</a>
                                </span>
                                <span class="chartlist-artist">
                                    <a>${tl(trans.artist_name)}</a>
                                </span>
                                ${settings.expand_tracks != 'never' && settings.track_layout == 'column' ? html.node`
                                    <span class="chartlist-album custom-album-text">
                                        <a>${tl(trans.album_name)}</a>
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
                                    <a>${tl(trans.track_name)}</a>
                                </span>
                                <span class="chartlist-artist">
                                    <a>${tl(trans.artist_name)}</a>
                                </span>
                                ${settings.expand_tracks == 'always' && settings.expand_tracks != 'never' &&settings.track_layout == 'column' ? html.node`
                                    <span class="chartlist-album custom-album-text">
                                        <a>${tl(trans.album_name)}</a>
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
                                value += page.mobile ? 3_000 : 1_000
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
                    ${ff('menus') ? setting({ id: 'menu_replacement' }) : ''}
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
                    <button class="see-more" onclick=${() => {
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
                    }}>
                        ${tl(trans.manage_feature_flags)}
                    </button>
                    <button class="see-more" onclick=${() => {
                        save_setting('popups_seen', []);
                    }}>
                        Forget which popups have been seen
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

        if (!page.state.quick_access_items) {
            setTimeout(() => {
                render_setting_page('profile');
            }, 10);
            page_loading();
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
                ${ff('friends') ? html.node`
                    <section class="bleh--panel">
                        <h4>${tl(trans.close_friends)}</h4>
                        <div class="setting-group">
                            ${friends = setting({
                                id: 'friends',
                                list: settings.friends,
                                func: (val) => {
                                    if (!val.includes(settings.starred_friend))
                                        save_setting('starred_friend', '');

                                    checkup_friend_cache(val);

                                    starred.update(select_prepare_list([{ value: '', text: tl(trans.none) }, ...val]));
                                }
                            })}
                            ${starred = setting({ id: 'starred_friend', list: select_prepare_list([{ value: '', text: tl(trans.none) }, ...settings.friends]) })}
                        </div>
                        <p class="card-tip">${tl(trans.friend_difference)}</p>
                    </section>
                ` : ''}
                <section class="bleh--panel">
                    <h4>${tl(trans.navigation_items.name)}</h4>
                    <div class="setting-group">
                        ${setting({ id: 'navigation_items', list: page.state.quick_access_items })}
                        ${!page.mobile ? setting({ id: 'navigation_language' }) : ''}
                    </div>
                </section>
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
                            <div class="profile-mockup-background from-avatar" style="background-image: url(${auth.avatar.replace('/avatar42s/','/avatar300s/')})" />
                            ${cache.banner ? html.node`
                                <div class="profile-mockup-background from-banner" style="background-image: url(${cache.banner})"></div>
                            ` : html.node`
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
                                ${setting({ id: 'profile_header_own', standalone: true })}
                                ${setting({ id: 'profile_header_others', standalone: true })}
                            </div>
                        </div>
                        ${setting({ id: 'profile_avi_background' })}
                    </div>
                </section>
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

        const flags = Object.entries(version.feature_flags)
            .sort((a, b) => {
                const a_date = new Date(a[1].date);
                const b_date = new Date(b[1].date);

                return b_date - a_date;
            });

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
                    ${flags.map(([flag, details]) => {
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
                                    <button class="btn toggle" aria-checked=${value} ref=${(el) => (state = el)}>
                                        <div class="dot" />
                                    </button>
                                </div>
                            </div>
                        `;
                    })}
                </div>
            </div>
        `);
    } else if (page_id == 'translate') {
        let translation_view_container;

        render(page.structure.main, html`
            <section class="bleh--panel">
                ${select(select_prepare_convert_from_setting(lang_info), settings.translator_view, '', translation_view, false, (val) => html.node`
                    <span class="language-header">
                        <span class="flag" style="background-image: url(https://katelyynn.github.io/bleh/fm/flags/${val.value}.svg)" />
                        <p>${val.text}</p>
                    </span>
                `, true)}
                <div class="translation-view" ref=${el => translation_view_container = el} />
            </section>
        `);

        function translation_view(lang) {
            const language = lang_info[lang];

            render(translation_view_container, html`
                <div class="language-sub">
                    <div class="language-info colourful translated"><span class="bleh-icon" />${tl(trans.amount_translated, { c: language.translated })} (${language.percent}%)</div>
                    ${() => {
                        const btn = html.node`
                            <div class="language-info colourful missing" onclick=${() => {
                                copy(language.missing_keys.map(key => `${key}: ${get_trans_key(key).en}`).join('\n'))
                            }}><span class="bleh-icon" />${tl(trans.missing_translated, { c: language.missing })}</div>
                        `;

                        tippy(btn, {
                            content: tl(trans.click_to_copy)
                        });

                        return btn;
                    }}
                </div>
                <table class="responsive-table">
                    <thead>
                        <tr>
                            <th style="width: 35%">${tl(trans.translation_key)}</th>
                            <th>${tl(trans.original)}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${language.missing_keys.map(key => {
                            const row = html.node`
                                <tr>
                                    <td style="width: 35%"><code>${key}</code></td>
                                    <td>${get_trans_key(key).en}</td>
                                </tr>
                            `;

                            return row;
                        })}
                    </tbody>
                </table>
            `);
        }

        translation_view(settings.translator_view);
    }
}

export function register_skip_to(list = null) {
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

export function scroll_to_setting(id) {
    const setting = page.structure.main.querySelector(`#setting_${id}`);
    if (!setting) return;

    setting.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });

    setTimeout(() => {
        setting.classList.add('highlight');
    }, 200);
}

unsafeWindow._change_settings_page = function (page, setting = null) {
    change_settings_page(page, setting);
};

export function change_settings_page(page_id, setting = null) {
    if (page_id == page.state.settings_page) return;

    window.history.pushState(page_id, '', `${root}bleh/${page_id}`);
    page.state.settings_page = page_id;

    page.structure.main.innerHTML = '';

    let btns = page.structure.container.querySelectorAll('.bleh--nav');
    btns.forEach((btn) => {
        const id = btn.getAttribute('data-bleh-page');

        btn.setAttribute('data-hide', page_id != id);

        btn.classList.toggle('secondary-nav-item-link--active', page_id == id);
    });

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
            ).toLocaleString(DateTime.DATE_MED)
        });
        tippy(document.getElementById('current_season_start'), {
            content: new Date(
                stored_season.start
                    .replace('y0', stored_season.year)
                    .replace('{offset}', stored_season.offset)
            ).toLocaleString(DateTime.DATE_MED)
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
            ).toLocaleString(DateTime.DATE_MED)
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
                    swatch_group.appendChild(create_swatch(type, exclusive, true));
                });

                return;
            }

            swatch_group.appendChild(create_swatch(type, colour));
        });
    }

    function create_swatch(type, colour, exclusive = false) {
        if (
            colour.requires_flag &&
            version.feature_flags.hasOwnProperty(colour.requires_flag)
        ) {
            if (!ff(colour.requires_flag)) return html.node``;
        }

        if (colour.type == 'avatar' && !auth.name) return html.node``;

        let text;
        let label;
        if (colour.label) text = tl(colour.label);

        if (exclusive) label = tl(trans.seasonal.exclusive);

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
                            ${ff('colour_based_on_hex') ? html.node`
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
                            ` : ''}
                            ${hue_range = setting({ id: 'hue', func: update_colour_swatches })}
                            ${sat_range = setting({ id: 'sat', func: update_colour_swatches })}
                            ${lit_range = setting({ id: 'lit', func: update_colour_swatches })}
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

        if (!label) {
            tippy(swatch, {
                content: text
            });
        } else {
            tippy(swatch, {
                theme: 'generic',
                content: html.node`
                    <span>${text}</span>
                    <small>${label}</small>
                `
            });
        }

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
                    <p id="profile-note-row-preview--${user}">${profile_notes[user]}</p>
                </div>
                <div class="actions">
                    ${() => {
                        const btn = html.node`
                            <button class="btn icon chibi list-action" data-type="edit" onclick=${() => edit_profile_note(user)}>
                                ${tl(trans.edit)}
                            </button>
                        `;

                        tippy(btn, {
                            content: btn.textContent
                        });

                        return btn;
                    }}
                    ${() => {
                        const btn = html.node`
                            <button class="btn icon chibi danger-subtle list-action" data-type="delete" onclick=${() => delete_profile_note(user)}>
                                ${tl(trans.delete)}
                            </button>
                        `;

                        tippy(btn, {
                            content: btn.textContent
                        });

                        return btn;
                    }}
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
                <button class="see-more cancel" onclick=${() => {
                    dialog_rm({ id: 'import_settings' });
                }}>
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
            hide: !ff('adaptive_theme')
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
