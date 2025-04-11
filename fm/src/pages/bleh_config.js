import { settings, settings_base } from "../build/config";
import { log } from "../build/log";
import { album_track_corrections, artist_corrections, ranks } from "../build/music";
import { auth, page, root, theme_preview } from "../build/page";
import { stored_season } from "../build/seasonal";
import { sponsor_list } from "../build/sponsor";
import { lang, lang_info, non_override_lang, trans_legacy, valid_langs, trans, tl } from "../build/trans";
import { dialog, dialog_legacy, dialog_rm, kill_window } from "../components/dialog";
import { notify } from "../components/notify";
import { create_settings_template, load_settings, refresh_all } from "../config";
import { version } from "../main";
import { update_page } from "../page";
import { seasonal_timer_end, seasonal_timer_start } from "../seasonal";
import { ff } from "../sku";
import { bleh_moderation, reset_moderation } from "./moderation";


export function bleh_settings() {
    page.type = 'bleh_settings';
    page.subpage = '';

    update_page();

    // remove error stuff cus we control this page
    page.structure.row.removeChild(page.structure.row.firstElementChild);
    page.structure.row.removeChild(page.structure.row.firstElementChild);

    let params = new URLSearchParams(document.location.search);
    page.requested.tab = params.get('tab');
    page.requested.setting = params.get('setting');


    // go wild
    let nav = document.createElement('nav');
    nav.classList.add('navlist', 'secondary-nav', 'navlist--more', 'redesigned-navigation', 'bleh-settings-navigation');

    nav.innerHTML = (`
        <ul class="navlist-items">
            <li class="navlist-item secondary-nav-item">
                <a class="secondary-nav-item-link bleh--nav" data-bleh-page="home" onclick="_change_settings_page('home')">
                    ${tl(trans.home)}
                </a>
            </li>
            <li class="navlist-item secondary-nav-item">
                <a class="secondary-nav-item-link bleh--nav" data-bleh-page="themes" onclick="_change_settings_page('themes')">
                    ${tl(trans.appearance)}
                </a>
            </li>
            <li class="navlist-item secondary-nav-item">
                <a class="secondary-nav-item-link bleh--nav" data-bleh-page="customise" onclick="_change_settings_page('customise')">
                    ${tl(trans.layout)}
                </a>
            </li>
            <li class="navlist-item secondary-nav-item">
                <a class="secondary-nav-item-link bleh--nav" data-bleh-page="music" onclick="_change_settings_page('music')">
                    ${tl(trans.music)}
                </a>
            </li>
            <li class="navlist-item secondary-nav-item">
                <a class="secondary-nav-item-link bleh--nav" data-bleh-page="profiles" onclick="_change_settings_page('profiles')">
                    ${trans_legacy[lang].settings.profiles.name}
                </a>
            </li>
            <li class="navlist-item secondary-nav-item">
                <a class="secondary-nav-item-link bleh--nav" data-bleh-page="seasonal" data-season="${stored_season.id}" onclick="_change_settings_page('seasonal')">
                    ${tl(trans.seasonal.name)}
                </a>
            </li>
            <li class="navlist-item secondary-nav-item">
                <a class="secondary-nav-item-link bleh--nav" data-bleh-page="moderation" onclick="_change_settings_page('moderation')">
                    ${tl(trans.moderation)}
                </a>
            </li>
            <li class="navlist-item secondary-nav-item">
                <a class="secondary-nav-item-link bleh--nav" data-bleh-page="text" onclick="_change_settings_page('text')">
                    ${trans_legacy[lang].settings.text.name}
                </a>
            </li>
            <li class="navlist-item secondary-nav-item">
                <a class="secondary-nav-item-link bleh--nav" data-bleh-page="accessibility" onclick="_change_settings_page('accessibility')">
                    ${tl(trans.accessibility)}
                </a>
            </li>
            <li class="navlist-item secondary-nav-item">
                <a class="secondary-nav-item-link bleh--nav" data-bleh-page="performance" onclick="_change_settings_page('performance')">
                    ${tl(trans.troubleshooting)}
                </a>
            </li>
            <li class="navlist-item secondary-nav-item">
                <a class="secondary-nav-item-link bleh--nav" data-bleh-page="sku" onclick="_change_settings_page('sku')">
                    shhh...
                </a>
            </li>
        </ul>
    `);

    page.structure.side.innerHTML = (`
        <div class="bleh--panel">
            ${(!ff('bleh_settings_tabs')) ? (`
            <div class="btns">
                <button class="btn bleh--btn" data-bleh-page="home" onclick="_change_settings_page('home')">
                    ${tl(trans.home)}
                </button>
                <button class="btn bleh--btn" data-bleh-page="themes" onclick="_change_settings_page('themes')">
                    ${tl(trans.appearance)}
                </button>
                <button class="btn bleh--btn" data-bleh-page="customise" onclick="_change_settings_page('customise')">
                    ${tl(trans.layout)}
                </button>
                <button class="btn bleh--btn" data-bleh-page="music" onclick="_change_settings_page('music')">
                    ${tl(trans.music)}
                </button>
                <button class="btn bleh--btn" data-bleh-page="accessibility" onclick="_change_settings_page('accessibility')">
                    ${tl(trans.accessibility)}
                </button>
                <button class="btn bleh--btn" data-bleh-page="seasonal" data-season="${stored_season.id}" onclick="_change_settings_page('seasonal')">
                    ${tl(trans.seasonal.name)}
                </button>
            </div>
            <div class="btns sep">
                <button class="btn bleh--btn" data-bleh-page="text" onclick="_change_settings_page('text')">
                    ${trans_legacy[lang].settings.text.name}
                </button>
                <button class="btn bleh--btn" data-bleh-page="sku" onclick="_change_settings_page('sku')">
                    shhh...
                </button>
            </div>
            <div class="btns sep">
                <button class="btn" data-bleh-action="import" onclick="_import_settings()">
                    ${tl(trans.import)}
                </button>
                <button class="btn" data-bleh-action="export" onclick="_export_settings()">
                    ${tl(trans.export)}
                </button>
            </div>
            <div class="btns sep">
                <button class="btn bleh--btn" data-bleh-page="profiles" onclick="_change_settings_page('profiles')">
                    ${trans_legacy[lang].settings.profiles.name}
                </button>
                <button class="btn bleh--btn" data-bleh-page="performance" onclick="_change_settings_page('performance')">
                    ${tl(trans.troubleshooting)}
                </button>
                <button class="btn" data-bleh-action="reset" onclick="_reset_settings()">
                    ${tl(trans.reset)}
                </button>
            </div>
            `) : (`
            ${(ff('skip_to_setting')) ? (`
            <h4>${trans_legacy[lang].settings.skip_to.name}</h4>
            <div class="skip-to-list"></div>
            `) : ''}
            ${(ff('skip_to_setting')) ? '<div class="btns sep">' : '<div class="btns">'}
                <button class="btn" data-bleh-action="import" onclick="_import_settings()">
                    ${tl(trans.import)}
                </button>
                <button class="btn" data-bleh-action="export" onclick="_export_settings()">
                    ${tl(trans.export)}
                </button>
                <button class="btn" data-bleh-action="reset" onclick="_reset_settings()">
                    ${tl(trans.reset)}
                </button>
            </div>
            `)}
            ${(settings.feature_flags.changelogs != false) ? (`
            <div class="btns">
                <button class="btn bleh--btn primary" data-bleh-page="changelog" onclick="_query_changelog()">
                    ${tl(trans.changelog)}
                </button>
            </div>
            `) : ''}
        </div>
    `);


    page.structure.container.insertBefore(nav, page.structure.row);

    if (page.requested.tab == null)
        change_settings_page('themes');
    else
        change_settings_page(page.requested.tab);

    if (page.requested.setting != null) {
        scroll_to_setting(page.requested.setting);
    }
}

export function render_setting_page(page_id) {
    if (page_id == 'home') {
        register_skip_to([]);

        let sponsoring = false;
        if (sponsor_list)
            sponsoring = sponsor_list.sponsors.includes(auth.name);

        return (`
        <div class="bleh--panel">
            <h4 class="top-header">${tl(trans.home)}</h4>
            <div class="user-top-panel" data-sponsoring="${sponsoring}">
                <div class="user-top-avatar user-top-avatar-side-left"></div>
                <img class="user-top-avatar user-top-avatar-main" src="${auth.avatar.replace('avatar42s', 'avatar300s')}" alt="${auth.name}">
                <div class="user-top-avatar user-top-avatar-side-right"></div>
            </div>
            ${(sponsoring) ? (`
            <h4>${trans_legacy[lang].settings.home.sponsor.thanks
            .replace('{m}', `<a class="mention" href="${root}user/${auth.name}">@${auth.name}</a>`)
            .replace('{v}', `<span class="version-link" onclick="_change_settings_page('sku')">${version.build}.${version.sku}</span>`)}</h4>
            `) : (`
            <h4>${trans_legacy[lang].settings.home.thanks
            .replace('{m}', `<a class="mention" href="${root}user/${auth.name}">@${auth.name}</a>`)
            .replace('{v}', `<span class="version-link" onclick="_change_settings_page('sku')">${version.build}.${version.sku}</span>`)}</h4>
            `)}
            <div class="screen-row actions-only">
                <div class="actions">
                    <button class="btn primary update icon" onclick="_force_refresh_theme()">
                        ${trans_legacy[lang].settings.home.update.update_now}
                    </button>
                    ${(settings.dev ? (`
                    <a class="btn primary update icon" href="https://github.com/katelyynn/bleh/raw/uwu/fm/bleh.user.css">
                        ${trans_legacy[lang].settings.home.update.css}
                    </a>
                    `) : '')}
                    ${(ff('sponsor') ? (`
                    <button class="btn primary sponsor" onclick="_sponsor()">
                        ${trans_legacy[lang].settings.home.sponsor.name}<div class="new-badge">${trans_legacy[lang].settings.new}</div>
                    </button>
                    `) : '')}
                    <a class="btn action bleh--issues" href="https://github.com/katelyynn/bleh/issues" target="_blank">
                        ${trans_legacy[lang].settings.home.issues.name}
                    </a>
                </div>
            </div>
            <div class="sep"></div>
            <h4>${tl(trans.seasonal.name)}</h4>
            <div class="current-season-box no-margin" data-season="${stored_season.id}">
                <div class="current-season-info">
                    <div class="bleh-icon bleh-seasonal-icon" data-season="${stored_season.id}"></div>
                    <h4>${trans_legacy[lang].settings.customise.seasonal.listing[stored_season.id]}</h4>
                </div>
                <div class="glacier-library-top season-top">
                    <div class="glacier-library-metadata">
                        ${(stored_season.id != 'none' && stored_season.start && stored_season.end) ? (`
                        <div class="glacier-library-metadata-item">
                            <div class="sub-text">${trans_legacy[lang].settings.customise.seasonal.started}</div>
                            <div class="glacier-library-metadata-item-value" id="current_season">${moment(stored_season.start.replace('y0', stored_season.year).replace('{offset}', stored_season.offset)).from(stored_season.now)}</div>
                        </div>
                        <div class="glacier-library-metadata-item">
                            <div class="sub-text">${trans_legacy[lang].settings.customise.seasonal.ends_in}</div>
                            <div class="glacier-library-metadata-item-value" id="current_season_start">${moment(stored_season.end.replace('y0', stored_season.year).replace('{offset}', stored_season.offset)).to(stored_season.now, true)}</div>
                        </div>
                        `) : ''}
                    </div>
                </div>
            </div>
            <button class="btn continue" onclick="_change_settings_page('seasonal')">
                ${trans_legacy[lang].settings.customise.seasonal.view}
            </button>
            <h4>${trans_legacy[lang].settings.home.recommended}</h4>
            <div class="setting-items full">
                <div class="side-right full">
                    <button class="btn setting-item bleh--themes" onclick="_change_settings_page('themes')">
                        <div class="text">
                            <h5>${tl(trans.themes.name)}</h5>
                            <p>${trans_legacy[lang].settings.themes.bio}</p>
                        </div>
                    </button>
                    <button class="btn setting-item bleh--palette" onclick="_change_settings_page('themes')">
                        <div class="text">
                            <h5>${trans_legacy[lang].settings.home.colours.name}</h5>
                            <p>${trans_legacy[lang].settings.home.colours.bio}</p>
                        </div>
                    </button>
                    <button class="btn setting-item bleh--corrections" onclick="_change_settings_page('music', 'corrections')">
                        <div class="text">
                            <h5>${trans_legacy[lang].settings.corrections.name}</h5>
                            <p>${trans_legacy[lang].settings.corrections.bio}</p>
                        </div>
                    </button>
                    <button class="btn setting-item bleh--motion" onclick="_change_settings_page('accessibility')">
                        <div class="text">
                            <h5>${trans_legacy[lang].settings.accessibility.reduced_motion.name}</h5>
                            <p>${trans_legacy[lang].settings.accessibility.reduced_motion.bio}</p>
                        </div>
                    </button>
                    <button class="btn setting-item bleh--link" onclick="_change_settings_page('accessibility')">
                        <div class="text">
                            <h5>${trans_legacy[lang].settings.accessibility.underline_links.name}</h5>
                            <p>${trans_legacy[lang].settings.accessibility.underline_links.bio}</p>
                        </div>
                    </button>
                </div>
            </div>
            <div class="sep"></div>
            <h4>Try out the latest</h4>
            <div class="setting-items">
                <div class="side-left">
                    <a class="btn setting-item has-image bleh--bwaa" href="https://cutensilly.org/bwaa/fm" target="_blank">
                        <div class="image"></div>
                        <div class="text">
                            <h5>bwaa (BETA) for Last.fm</h5>
                            <p>bring last.fm back to 2012 while retaining all modern features. (includes a dark mode)</p>
                        </div>
                        <div class="image-row">
                            <img src="https://cutensilly.org/img/bwaa-image.png">
                        </div>
                    </a>
                </div>
            </div>
        </div>
        `);
    } else if (page_id == 'themes') {
        register_skip_to([
            {
                id: 'hue_from_album',
                name: tl(trans.hue_from_album.name)
            },
            {
                id: 'colourful_tracks',
                name: tl(trans.colourful_tracks.name)
            },
            {
                id: 'colourful_counts',
                name: trans_legacy[lang].settings.customise.colourful_counts.name
            }
        ]);

        let preview_bar = 'background: linear-gradient(90deg';
        let preview_bar_text = '';

        // global sat/lit is used to substitute the values computed in h3 sat/lit
        // as they return eg. calc(0.85 * 50%), so we use global_sat to get 0.85
        // which can then be used in a .replace(global_sat, 'whatever we want')
        let global_sat = getComputedStyle(document.body).getPropertyValue('--sat');
        let global_lit = getComputedStyle(document.body).getPropertyValue('--lit');
        let h3_sat = getComputedStyle(document.body).getPropertyValue('--h3-sat');
        let h3_lit = getComputedStyle(document.body).getPropertyValue('--h3-lit');

        let maximum = 16_000;
        let max_rank = 11;

        //console.info(maximum, max_rank);
        for (let rank = 0; rank <= max_rank; rank++) {
            let this_rank = ranks[parseInt(rank)];
            //console.info(this_rank);

            let percent = ((this_rank.start / maximum) * 100);
            preview_bar = `${preview_bar}, hsl(${this_rank.hue}, ${h3_sat.replace(global_sat, this_rank.sat)}, ${h3_lit.replace(global_lit, this_rank.lit)}) ${percent}%`;

            if ((this_rank.start > 500 || this_rank.start == 0) && this_rank.start != 1500) {
                let text = `${this_rank.start}`;

                preview_bar_text = `${preview_bar_text}<div class="preview-bar-text-entry" style="left: ${percent}%">${text.replaceAll('_', ',')}</div>`;
            }
        }

        preview_bar = `${preview_bar});`;
        //console.info('preview bar', preview_bar, global_sat, h3_sat, global_lit, h3_lit);

        return (`
            <div class="bleh--panel">
                <h4 class="top-header">${tl(trans.appearance)}</h4>
                <h4>${tl(trans.themes.name)}</h4>
                <!--<h4>${trans_legacy[lang].settings.themes.dark.name}</h4>-->
                <div class="setting-items full">
                    <div class="side-left full even-more">
                        <button class="btn theme-item" data-bleh-theme="light" onclick="change_theme_from_settings('light')">
                            <div class="preview" data-bleh--theme="light">
                                ${theme_preview}
                            </div>
                            <div class="text">
                                <h5>${tl(trans.themes.light)}</h5>
                            </div>
                        </button>
                        <button class="btn theme-item" data-bleh-theme="dark" onclick="change_theme_from_settings('dark')">
                            <div class="preview" data-bleh--theme="dark">
                                ${theme_preview}
                            </div>
                            <div class="text">
                                <h5>${tl(trans.themes.dark)}</h5>
                            </div>
                        </button>
                        <button class="btn theme-item" data-bleh-theme="darker" onclick="change_theme_from_settings('darker')">
                            <div class="preview" data-bleh--theme="darker">
                                ${theme_preview}
                            </div>
                            <div class="text">
                                <h5>${tl(trans.themes.darker)}</h5>
                            </div>
                        </button>
                        <button class="btn theme-item" data-bleh-theme="oled" onclick="change_theme_from_settings('oled')">
                            <div class="preview" data-bleh--theme="oled">
                                ${theme_preview}
                            </div>
                            <div class="text">
                                <h5>${tl(trans.themes.oled)}</h5>
                            </div>
                        </button>
                    </div>
                </div>
                ${(ff('high_contrast')) ? (`
                <div class="toggle-container" id="container-high_contrast" onclick="_update_item('high_contrast')">
                    <button class="btn reset" onclick="_reset_item('high_contrast')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.customise.high_contrast.name}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-high_contrast" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                `) : ''}
                <div class="sep"></div>
                <h4>${tl(trans.colours)}</h4>
                <div class="inner-preview pad">
                    <div class="palette">
                        <div class="swatch" style="--col: hsl(var(--l2-c))"></div>
                        <div class="swatch" style="--col: hsl(var(--l3-c))"></div>
                        <div class="swatch" style="--col: hsl(var(--l4-c))"></div>
                        <div class="swatch" style="--col: hsl(var(--l2))"></div>
                        <div class="swatch" style="--col: hsl(var(--l3))"></div>
                        <div class="swatch" style="--col: hsl(var(--l4))"></div>
                    </div>
                    <table class="chartlist chartlist--with-image chartlist--with-loved chartlist--with-artist" style="margin: var(--card-gap) 0 !important">
                        <tbody>
                            <tr class="chartlist-row chartlist-row--now-scrobbling chartlist-row--with-artist" style="transition: none !important">
                                <td class="chartlist-image">
                                    <a class="cover-art"><img src="${auth.avatar.replace('/avatar42s/', '/avatar170s/')}" loading="lazy"></a>
                                </td>
                                <td class="chartlist-loved">
                                    <button class="chartlist-love-button" data-toggle-button-current-state="unloved"></button>
                                </td>
                                <td class="chartlist-name">
                                    <a>Song title</a>
                                </td>
                                <td class="chartlist-artist">
                                    <a>${auth.name}</a>
                                </td>
                                <td class="chartlist-timestamp chartlist-timestamp--lang-en">
                                    <span class="chartlist-now-scrobbling">
                                        <a>Scrobbling now</a>
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="btn-row">
                        <button class="btn">${trans_legacy[lang].settings.examples.button}</button>
                        <button class="btn primary">${trans_legacy[lang].settings.examples.button}</button>
                        <div class="chartlist-count-bar">
                            <a class="chartlist-count-bar-link">
                                <span class="chartlist-count-bar-slug" style="width: 60%"></span>
                                <span class="chartlist-count-bar-value">44,551</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="view-buttons colour-buttons view-buttons-middle" id="colour_custom"></div>
                <div class="swatch-group">
                    <div id="colour_red" class="palette options colours"></div>
                    <div id="colour_orange" class="palette options colours"></div>
                    <div id="colour_yellow" class="palette options colours"></div>
                    <div id="colour_green" class="palette options colours"></div>
                    <div id="colour_lime" class="palette options colours"></div>
                    <div id="colour_aqua" class="palette options colours"></div>
                    <div id="colour_blue" class="palette options colours"></div>
                    <div id="colour_purple" class="palette options colours"></div>
                    <div id="colour_pink" class="palette options colours"></div>
                </div>
                <div class="toggle-container" id="container-hue_from_album" onclick="_update_item('hue_from_album')">
                    <button class="btn reset" onclick="_reset_item('hue_from_album')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${tl(trans.hue_from_album.name)}</h5>
                        <p>${tl(trans.hue_from_album.body)}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-hue_from_album" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-colourful_tracks" onclick="_update_item('colourful_tracks')">
                    <button class="btn reset" onclick="_reset_item('colourful_tracks')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${tl(trans.colourful_tracks.name)}</h5>
                        <p>${tl(trans.colourful_tracks.body)}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-colourful_tracks" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="sep"></div>
                <div class="inner-preview pad">
                    <div class="personal-stats-preview-bar-container">
                        <div class="personal-stats-preview-bar" style="${preview_bar}"></div>
                        <div class="personal-stats-preview-text">${preview_bar_text}</div>
                    </div>
                    <div class="sep"></div>
                    <div class="tracks">
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="bar">
                                <div class="fill not-colourful-example" style="width: 100%"></div>
                                <div class="fill colourful-example" style="width: 100%; --hue: -16.888749999999998; --sat: 1.5; --lit: 0.875"></div>
                            </div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="bar">
                                <div class="fill not-colourful-example" style="width: 85%"></div>
                                <div class="fill colourful-example" style="width: 85%; --hue: 0.21863999999999972; --sat: 1.399218; --lit: 0.891406"></div>
                            </div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="bar">
                                <div class="fill not-colourful-example" style="width: 60%"></div>
                                <div class="fill colourful-example" style="width: 60%; --hue: 18.77; --sat: 1.425; --lit: 0.9175833333333334"></div>
                            </div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="bar">
                                <div class="fill not-colourful-example" style="width: 30%"></div>
                                <div class="fill colourful-example" style="width: 30%; --hue: 50.769767441860466; --sat: 1.361813953488372; --lit: 0.943406976744186"></div>
                            </div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="bar">
                                <div class="fill not-colourful-example" style="width: 5%"></div>
                                <div class="fill colourful-example" style="width: 5%; --hue: 92.42; --sat: 1.35; --lit: 0.925"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="toggle-container" id="container-colourful_counts" onclick="_update_item('colourful_counts')">
                    <button class="btn reset" onclick="_reset_item('colourful_counts')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.customise.colourful_counts.name}</h5>
                        <p>${trans_legacy[lang].settings.customise.colourful_counts.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-colourful_counts" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
            </div>
            `);
    } else if (page_id == 'customise') {
        register_skip_to([
            {
                id: 'profile_avi_background',
                name: trans_legacy[lang].settings.customise.profile_header.see_type
            },
            {
                id: 'profile_header_own',
                name: trans_legacy[lang].settings.customise.profile_header.view_on
            },
            {
                id: 'show_your_progress',
                name: trans_legacy[lang].settings.customise.show_your_progress.name
            }
        ]);

        return (`
            <div class="bleh--panel check-artist-hover">
                <h4 class="top-header">${tl(trans.layout)}</h4>
                <h4>${trans_legacy[lang].settings.layout.header}</h4>
                <div class="inner-preview pad">
                    <div class="profile-mockup artist">
                        <div class="mockup-header">
                            <div class="mockup-avatar-wrap">
                                <img class="mockup-avatar" src="https://lastfm.freetls.fastly.net/i/u/avatar170s/383d6c03304e720075d0050e8a6a4644">
                            </div>
                            <div class="mockup-info">
                                <div class="mockup-subtext"></div>
                                <div class="mockup-name"></div>
                            </div>
                            <div class="mockup-actions">
                                <div class="mockup-big-button">
                                    <div class="mockup-text"></div>
                                </div>
                            </div>
                        </div>
                        <div class="mockup-container">
                            <div class="mockup-col-main">
                                <div class="mockup-panel"></div>
                                <div class="mockup-panel main"></div>
                            </div>
                            <div class="mockup-col-sidebar">
                                <div class="mockup-panel"></div>
                                <div class="mockup-panel main"></div>
                            </div>
                        </div>
                        <div class="profile-mockup-background" style="background-image: url(https://lastfm.freetls.fastly.net/i/u/avatar170s/383d6c03304e720075d0050e8a6a4644);"></div>
                    </div>
                </div>
                <h4>${trans_legacy[lang].settings.layout.avatar_action.name}</h4>
                <p>${trans_legacy[lang].settings.layout.avatar_action.bio}</p>
                <div class="primary-selections artist-hover-image">
                    <div class="btn primary-selection" id="toggle-default_avatar_action-expand" data-toggle="default_avatar_action" data-toggle-value="expand" onclick="_update_item('default_avatar_action', 'expand')">
                        <h5>${trans_legacy[lang].gallery.open.name}</h5>
                    </div>
                    <div class="btn primary-selection" id="toggle-default_avatar_action-gallery" data-toggle="default_avatar_action" data-toggle-value="gallery" onclick="_update_item('default_avatar_action', 'gallery')">
                        <h5>${trans_legacy[lang].settings.layout.avatar_action.gallery}</h5>
                    </div>
                </div>
                <h4>${trans_legacy[lang].settings.layout.quick_artist_button.name}</h4>
                <p>${trans_legacy[lang].settings.layout.quick_artist_button.bio}</p>
                <div class="primary-selections artist-hover-button">
                    <div class="btn primary-selection" id="toggle-quick_artist_button-gallery" data-toggle="quick_artist_button" data-toggle-value="gallery" onclick="_update_item('quick_artist_button', 'gallery')">
                        <h5>${trans_legacy[lang].gallery.view}</h5>
                    </div>
                    <div class="btn primary-selection" id="toggle-quick_artist_button-shouts" data-toggle="quick_artist_button" data-toggle-value="shouts" onclick="_update_item('quick_artist_button', 'shouts')">
                        <h5>${trans_legacy[lang].settings.layout.quick_artist_button.shouts}</h5>
                    </div>
                    <div class="btn primary-selection" id="toggle-quick_artist_button-wiki" data-toggle="quick_artist_button" data-toggle-value="wiki" onclick="_update_item('quick_artist_button', 'wiki')">
                        <h5>${trans_legacy[lang].settings.layout.quick_artist_button.wiki}</h5>
                    </div>
                    <div class="btn primary-selection" id="toggle-quick_artist_button-listens" data-toggle="quick_artist_button" data-toggle-value="listens" onclick="_update_item('quick_artist_button', 'listens')">
                        <h5>${trans_legacy[lang].settings.layout.quick_artist_button.listens}</h5>
                    </div>
                </div>
            </div>
            <div class="bleh--panel">
                <h4>${trans_legacy[lang].settings.customise.profile_header.name}</h4>
                <div class="inner-preview pad">
                    <div class="profile-mockup">
                        <div class="mockup-header">
                            <img class="mockup-avatar" src="${auth.avatar}">
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
                                <div class="mockup-panel mockup-obsession-panel">
                                    <img class="mockup-obsession-art" src="https://lastfm.freetls.fastly.net/i/u/64s/510546e3b6df7504392274c528c77780.jpg">
                                    <div class="mockup-obsession-name"></div>
                                </div>
                                <div class="mockup-panel main"></div>
                            </div>
                        </div>
                        <div class="profile-mockup-background from-avatar" style="background-image: url(${auth.avatar});"></div>
                        <div class="profile-mockup-background from-track" style="background-image: url(https://lastfm.freetls.fastly.net/i/u/avatar170s/df927f4f88034b7f9a651636b965c9d7);"></div>
                    </div>
                </div>
                <div class="toggle-container" id="container-profile_avi_background" onclick="_update_item('profile_avi_background')">
                    <button class="btn reset" onclick="_reset_item('profile_avi_background')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.customise.profile_header.see_type}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-profile_avi_background" aria-checked="false">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <h4>${trans_legacy[lang].settings.customise.profile_header.view_on}</h4>
                <div class="toggle-container" id="container-profile_header_own" onclick="_update_item('profile_header_own')">
                    <button class="btn reset" onclick="_reset_item('profile_header_own')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.customise.profile_header.for_own}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-profile_header_own" aria-checked="false">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-profile_header_others" onclick="_update_item('profile_header_others')">
                    <button class="btn reset" onclick="_reset_item('profile_header_others')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.customise.profile_header.for_others}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-profile_header_others" aria-checked="false">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="sep"></div>
                <div class="toggle-container" id="container-show_your_progress" onclick="_update_item('show_your_progress')">
                    <button class="btn reset" onclick="_reset_item('show_your_progress')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.customise.show_your_progress.name}</h5>
                        <p>${trans_legacy[lang].settings.customise.show_your_progress.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-show_your_progress" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="sep"></div>
                <div class="toggle-container" id="container-rain" onclick="_update_item('rain')">
                    <button class="btn reset" onclick="_reset_item('rain')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.customise.rain.name}</h5>
                        <p>${trans_legacy[lang].settings.customise.rain.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-rain" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
            </div>
            `);
    } else if (page_id == 'seasonal') {
        register_skip_to([]);

        return (`
            <div class="bleh--panel">
                <div class="seasonal-inner">
                    <div class="sub-text">${trans_legacy[lang].settings.customise.seasonal.timeline}</div>
                    <h4>${moment(stored_season.now).format('MMMM Do YYYY')}</h4>
                    <div class="current-season-box" data-season="${stored_season.id}">
                        <div class="current-season-info">
                            <div class="bleh-icon bleh-seasonal-icon" data-season="${stored_season.id}"></div>
                            <h4>${trans_legacy[lang].settings.customise.seasonal.listing[stored_season.id]}</h4>
                        </div>
                        <div class="glacier-library-top season-top">
                            <div class="glacier-library-metadata">
                                ${(stored_season.id != 'none' && stored_season.start && stored_season.end) ? (`
                                <div class="glacier-library-metadata-item">
                                    <div class="sub-text">${trans_legacy[lang].settings.customise.seasonal.started}</div>
                                    <div class="glacier-library-metadata-item-value" id="current_season_start">${moment(stored_season.start.replace('y0', stored_season.year).replace('{offset}', stored_season.offset)).from(stored_season.now)}</div>
                                </div>
                                <div class="glacier-library-metadata-item">
                                    <div class="sub-text">${trans_legacy[lang].settings.customise.seasonal.ends_in}</div>
                                    <div class="glacier-library-metadata-item-value" id="current_season">${moment(stored_season.end.replace('y0', stored_season.year).replace('{offset}', stored_season.offset)).to(stored_season.now, true)}</div>
                                </div>
                                `) : ''}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="info-box no-padding">
                    <div class="bleh-icon bleh-info-icon"></div>
                    ${trans_legacy[lang].settings.customise.seasonal.info.replace('{offset}', `<code>${stored_season.offset}</code>`)}
                </div>
                <!--<p>${trans_legacy[lang].settings.customise.seasonal.bio}</p>
                <div class="inner-preview pad click-thru">
                    <div class="current-season-container">
                        <div class="current-season" data-season="${stored_season.id}" id="current_season">
                            ${(stored_season.id != 'none')
                            ? trans_legacy[lang].settings.customise.seasonal.marker.current.replace('{season}', trans_legacy[lang].settings.customise.seasonal.listing[stored_season.id])
                            : (settings.seasonal) ? trans_legacy[lang].settings.customise.seasonal.marker.none : trans_legacy[lang].settings.customise.seasonal.marker.disabled}
                        </div>
                        <div class="current-season-started" id="current_season_start">
                            ${(stored_season.id != 'none')
                            ? trans_legacy[lang].settings.customise.seasonal.marker.started
                            : ''}
                        </div>
                    </div>
                </div>-->
                <h4>${trans_legacy[lang].settings.configure}</h4>
                <div class="toggle-container" id="container-seasonal" onclick="_update_item('seasonal')">
                    <button class="btn reset" onclick="_reset_item('seasonal')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.customise.seasonal.option.name}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-seasonal" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="sep"></div>
                <div class="toggle-container hide-if-seasonal-disabled" id="container-seasonal_particles" onclick="_update_item('seasonal_particles')">
                    <button class="btn reset" onclick="_reset_item('seasonal_particles')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.customise.seasonal.particles.name}</h5>
                        <p>${trans_legacy[lang].settings.customise.seasonal.particles.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-seasonal_particles" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container hide-if-seasonal-disabled" id="container-seasonal_particles_reduced" onclick="_update_item('seasonal_particles_reduced')">
                    <button class="btn reset" onclick="_reset_item('seasonal_particles_reduced')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.customise.seasonal.show_less_particles.name}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-seasonal_particles_reduced" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container hide-if-seasonal-disabled" id="container-seasonal_particles_fps" onclick="_update_item('seasonal_particles_fps')">
                    <button class="btn reset" onclick="_reset_item('seasonal_particles_fps')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.customise.seasonal.fps_particles.name}</h5>
                        <p>${trans_legacy[lang].settings.customise.seasonal.fps_particles.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-seasonal_particles_fps" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="sep"></div>
                <div class="toggle-container hide-if-seasonal-disabled" id="container-seasonal_overlays" onclick="_update_item('seasonal_overlays')">
                    <button class="btn reset" onclick="_reset_item('seasonal_overlays')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.customise.seasonal.overlays.name}</h5>
                        <p>${trans_legacy[lang].settings.customise.seasonal.overlays.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-seasonal_overlays" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
            </div>
        `);
    } else if (page_id == 'performance') {
        register_skip_to([]);

        return (`
            <div class="bleh--panel">
                <h4 class="top-header">${tl(trans.troubleshooting)}</h4>
                <p>${trans_legacy[lang].settings.performance.bio}</p>
                <div class="toggle-container">
                    <div class="heading">
                        <h5>Refresh theme</h5>
                        <p>Force download the latest version of the stylesheet</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="bleh--btn primary" onclick="_force_refresh_theme()">Refresh</button>
                    </div>
                </div>
                <div class="toggle-container" id="container-dev" onclick="_update_item('dev')">
                    <button class="btn reset" onclick="_reset_item('dev')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.performance.dev.name}</h5>
                        <p>${trans_legacy[lang].settings.performance.dev.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-dev" aria-checked="false">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="sep"></div>
                <div class="toggle-container">
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.performance.bug.name}</h5>
                        <p>${trans_legacy[lang].settings.performance.bug.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <a class="btn bleh--btn primary" href="https://github.com/katelyynn/bleh/issues/new/choose" target="_blank">${trans_legacy[lang].settings.go}</a>
                    </div>
                </div>
                <div class="sep"></div>
                <h4>Debug information</h4>
                <ul>
                    <li>Theme loading is currently ${!settings.dev}</li>
                    <li><span class="lotus lotus-name lotus-name-small">lotus</span> is currently ${settings.corrections}</li>
                    <br>
                    <li>Theme will expire at <span class="time">${moment(localStorage.getItem('bleh_cached_style_timeout')).format('HH:mm:ss Z')}</span></li>
                    <li><span class="lotus lotus-name lotus-name-small">lotus</span> (artist) will expire at <span class="time">${moment(localStorage.getItem('lotus_artist_expire')).format('HH:mm:ss Z')}</span></li>
                    <li><span class="lotus lotus-name lotus-name-small">lotus</span> (album_track) will expire at <span class="time">${moment(localStorage.getItem('lotus_album_track_expire')).format('HH:mm:ss Z')}</span></li>
                    <br>
                    <li>It is currently <span class="time">${moment().format('HH:mm:ss Z')}</span></li>
                    <br>
                    <li>Has the timeout expired? ${new Date(localStorage.getItem('bleh_cached_style_timeout')) < new Date()}</li>
                </ul>
                <div class="sep"></div>
                <h4>Debugging interactions</h4>
                <button class="continue" onclick="_notify({
                id: 'test',
                title: 'testing!',
                body: 'haaaiaiii test bodyyy.......'
                })">Deliver notification</button>
                <button class="continue" onclick="_notify({
                id: 'test',
                title: 'testing!',
                body: 'haaaiaiii test bodyyy.......',
                persist: true
                })">Deliver persistent notification</button>
                <div class="sep"></div>
                <h4>Manage flags</h4>
                <button class="continue" onclick="_change_settings_page('sku')">Open sku page</button>
            </div>
            `);
    } else if (page_id == 'profiles') {
        register_skip_to([
            {
                id: 'profile_shortcut',
                type: 'text',
                name: trans_legacy[lang].settings.music.profile_shortcut.name
            },
            {
                id: 'activities',
                name: trans_legacy[lang].settings.activities.toggle.name
            }
        ]);

        let sponsoring = false;
        if (sponsor_list)
            sponsoring = sponsor_list.sponsors.includes(auth.name);

        return (`
            <div class="bleh--panel sponsor-badge-panel" data-sponsoring="${sponsoring}">
                <div class="profile-container">
                    <div class="avatar-side small">
                        <div class="avatar">
                            <img src="${auth.avatar.replace('/avatar42s/', '/avatar170s/')}" alt="Your avatar" loading="lazy">
                        </div>
                    </div>
                    <div class="info-side">
                        <div class="header-info">
                            <div class="sub-text">${trans_legacy[lang].settings.profiles.you}</div>
                            <div class="header standalone title-container">
                                <h1>${auth.name}</h1>
                                ${(auth.pro) ? (`
                                <span class="label user-status-subscriber">${tl(trans.badges['user-status-subscriber'].name)}</span>
                                `) : ''}
                            </div>
                        </div>
                    </div>
                </div>
                ${(ff('api')) ? (`
                <h4>${trans_legacy[lang].settings.profiles.api.name}</h4>
                <div class="alert alert-info">${trans_legacy[lang].settings.profiles.api.bio}</div>
                <div class="text-container" id="container-api_key">
                    <button class="btn reset" onclick="_reset_item('api_key')">${tl(trans.reset)}</button>
                    <div class="heading content-form">
                        <div class="input-container">
                            <input type="password" maxlength="120" id="text-api_key" value="${settings.api_key}" placeholder="${trans_legacy[lang].settings.profiles.api.placeholder}">
                            <button class="btn primary save" onclick="_save_api_key()">${trans_legacy[lang].settings.save}</button>
                            <a class="btn-add" href="${root}api/account/create" target="_blank">${trans_legacy[lang].settings.create}</a>
                        </div>
                    </div>
                </div>
                `) : ''}
                <div class="sep"></div>
                ${(sponsoring) ? (`
                <h4>${trans_legacy[lang].settings.home.sponsor.status.yes}</h4>
                <div class="alert alert-info">${trans_legacy[lang].settings.home.sponsor.version
                .replace('{v}', `<span class="version-link sponsor-related">${sponsor_list.latest}</span>`)}</div>
                <div class="screen-row actions-only">
                    <div class="actions">
                        <button class="btn primary sponsor" onclick="_sponsor_manage()">
                            ${trans_legacy[lang].settings.home.sponsor.manage}<div class="new-badge">${trans_legacy[lang].settings.new}</div>
                        </button>
                        <button class="btn refresh icon" onclick="_sponsor_check()">
                            ${trans_legacy[lang].settings.home.sponsor.check}
                        </button>
                    </div>
                </div>
                `) : (`
                <h4>${trans_legacy[lang].settings.home.sponsor.status.no}</h4>
                <div class="alert alert-info">${trans_legacy[lang].settings.home.sponsor.version
                .replace('{v}', `<span class="version-link sponsor-related">${sponsor_list.latest}</span>`)}</div>
                <div class="screen-row actions-only">
                    <div class="actions">
                        <button class="btn primary sponsor" onclick="_sponsor()">
                            ${trans_legacy[lang].settings.home.sponsor.name}<div class="new-badge">${trans_legacy[lang].settings.new}</div>
                        </button>
                        <button class="btn refresh icon" onclick="_sponsor_check()">
                            ${trans_legacy[lang].settings.home.sponsor.check}
                        </button>
                    </div>
                </div>
                `)}
            </div>
            <div class="bleh--panel">
                <div class="slider-container" id="container-avatar_radius">
                    <button class="btn reset" onclick="_reset_item('avatar_radius')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.profiles.avatar_radius.name}</h5>
                    </div>
                    <div class="slider">
                        <div class="slider-track" id="slider-track-avatar_radius"><div class="slider-fill"></div><div class="slider-nub"></div></div>
                        <input type="range" min="0" max="50" value="0" step="1" id="slider-avatar_radius" oninput="_update_item('avatar_radius', this.value)">
                        <p id="value-avatar_radius">0</p>
                    </div>
                </div>
                <h4>${trans_legacy[lang].settings.music.profile_shortcut.name}</h4>
                <p>${trans_legacy[lang].settings.music.profile_shortcut.bio}</p>
                <div class="text-container" id="container-profile_shortcut">
                    <button class="btn reset" onclick="_reset_item('profile_shortcut')">${tl(trans.reset)}</button>
                    <div class="avatar-container">
                        <div class="avatar-inner" id="avatar-profile_shortcut">
                            <img id="avatar_src-profile_shortcut" src="${localStorage.getItem('bleh_profile_shortcut_avi') || ''}">
                        </div>
                    </div>
                    <div class="heading content-form">
                        <h5>${trans_legacy[lang].settings.music.profile_shortcut.placeholder}</h5>
                        <div class="input-container">
                            <input type="text" maxlength="40" id="text-profile_shortcut" value="${settings.profile_shortcut}" placeholder="${trans_legacy[lang].settings.music.profile_shortcut.header}">
                            <button class="bleh--btn primary save" onclick="_save_profile_shortcut()">${trans_legacy[lang].settings.save}</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bleh--panel">
                <h4>${trans_legacy[lang].settings.activities.name}</h4>
                <p>${trans_legacy[lang].settings.activities.bio}</p>
                <div class="toggle-container" id="container-activities" onclick="_update_item('activities')">
                    <button class="btn reset" onclick="_reset_item('activities')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.activities.toggle.name}</h5>
                        <p>${trans_legacy[lang].settings.activities.toggle.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-activities" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="sep"></div>
                <div class="toggle-container" id="container-activity_shout" onclick="_update_item('activity_shout')">
                    <button class="btn reset" onclick="_reset_item('activity_shout')">${tl(trans.reset)}</button>
                    <div class="icon">
                        <div class="bleh-icon" style="--icon: var(--icon-16-shoutbox)"></div>
                    </div>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.activities.types.shout}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-activity_shout" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-activity_image" onclick="_update_item('activity_image')">
                    <button class="btn reset" onclick="_reset_item('activity_image')">${tl(trans.reset)}</button>
                    <div class="icon">
                        <div class="bleh-icon" style="--icon: var(--icon-16-gallery-vertical)"></div>
                    </div>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.activities.types.image}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-activity_image" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-activity_obsess" onclick="_update_item('activity_obsess')">
                    <button class="btn reset" onclick="_reset_item('activity_obsess')">${tl(trans.reset)}</button>
                    <div class="icon">
                        <div class="bleh-icon" style="--icon: var(--icon-16-obsession)"></div>
                    </div>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.activities.types.obsess}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-activity_obsess" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-activity_love" onclick="_update_item('activity_love')">
                    <button class="btn reset" onclick="_reset_item('activity_love')">${tl(trans.reset)}</button>
                    <div class="icon">
                        <div class="bleh-icon" style="--icon: var(--icon-16-heart)"></div>
                    </div>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.activities.types.love}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-activity_love" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-activity_wiki" onclick="_update_item('activity_wiki')">
                    <button class="btn reset" onclick="_reset_item('activity_wiki')">${tl(trans.reset)}</button>
                    <div class="icon">
                        <div class="bleh-icon" style="--icon: var(--icon-16-bio)"></div>
                    </div>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.activities.types.wiki}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-activity_wiki" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-activity_install" onclick="_update_item('activity_install')">
                    <button class="btn reset" onclick="_reset_item('activity_install')">${tl(trans.reset)}</button>
                    <div class="icon">
                        <div class="bleh-icon" style="--icon: var(--icon-16-download)"></div>
                    </div>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.activities.types.install}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-activity_install" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
            </div>
            <div class="bleh--panel">
                <h4>${trans_legacy[lang].settings.profiles.notes.name}</h4>
                <div class="profile-notes" id="profile-notes"></div>
            </div>
            `);
    } else if (page_id == 'accessibility') {
        register_skip_to([]);

        return (`
            <div class="bleh--panel">
                <h4 class="top-header">${tl(trans.accessibility)}</h4>
                <div class="toggle-container" id="container-reduced_motion" onclick="_update_item('reduced_motion')">
                    <button class="btn reset" onclick="_reset_item('reduced_motion')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.accessibility.reduced_motion.name}</h5>
                        <p>${trans_legacy[lang].settings.accessibility.reduced_motion.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-reduced_motion" aria-checked="false">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="inner-preview pad flex">
                    <div class="shout js-shout js-link-block" data-kate-processed="true">
                        <h3 class="shout-user">
                            <a>${auth.name}</a>
                        </h3>
                        <span class="avatar shout-user-avatar">
                            <img src="${auth.avatar.replace('/avatar42s/', '/avatar170s/')}" alt="Your avatar" loading="lazy">
                        </span>
                        <a class="shout-permalink shout-timestamp">
                            <time datetime="2024-06-05T02:33:39+01:00" title="Wednesday 5 Jun 2024, 2:33am">
                                5 Jun 2:33am
                            </time>
                        </a>
                        <div class="shout-body">
                            <p>${trans_legacy[lang].settings.accessibility.shout_preview}</p>
                        </div>
                    </div>
                </div>
                <div class="toggle-container" id="container-accessible_name_colours" onclick="_update_item('accessible_name_colours')">
                    <button class="btn reset" onclick="_reset_item('accessible_name_colours')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.accessibility.accessible_name_colours.name}</h5>
                        <p>${trans_legacy[lang].settings.accessibility.accessible_name_colours.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-accessible_name_colours" aria-checked="false">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-underline_links" onclick="_update_item('underline_links')">
                    <button class="btn reset" onclick="_reset_item('underline_links')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.accessibility.underline_links.name}</h5>
                        <p>${trans_legacy[lang].settings.accessibility.underline_links.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-underline_links" aria-checked="false">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-toggle_icon" onclick="_update_item('toggle_icon')">
                    <button class="btn reset" onclick="_reset_item('toggle_icon')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.accessibility.toggle_icon.name}</h5>
                        <p>${trans_legacy[lang].settings.accessibility.toggle_icon.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-toggle_icon" aria-checked="false">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
            </div>
            `);
    } else if (page_id == 'text') {
        register_skip_to([]);

        return (`
            <div class="bleh--panel">
                <h4 class="top-header">${trans_legacy[lang].settings.text.name}</h4>
                <h4>${trans_legacy[lang].settings.text.font.name}</h4>
                <div class="text-container" id="container-font">
                    <button class="btn reset" onclick="_reset_item('font')">${tl(trans.reset)}</button>
                    <div class="heading content-form">
                        <div class="input-container">
                            <input type="text" maxlength="120" id="text-font" value="${settings.font}" placeholder="${trans_legacy[lang].settings.text.font.placeholder}">
                            <button class="bleh--btn primary save" onclick="_save_font()">${trans_legacy[lang].settings.save}</button>
                        </div>
                    </div>
                </div>
                <div class="slider-container" id="container-font_weight">
                    <button class="btn reset" onclick="_reset_item('font_weight')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.text.font_weight.name}</h5>
                        <p>${trans_legacy[lang].settings.text.font_weight.bio}</p>
                    </div>
                    <div class="slider">
                        <div class="slider-track" id="slider-track-font_weight"><div class="slider-fill"></div><div class="slider-nub"></div></div>
                        <input type="range" min="0" max="900" value="0" step="10" id="slider-font_weight" oninput="_update_item('font_weight', this.value)">
                        <p id="value-font_weight">0</p>
                    </div>
                </div>
                <div class="slider-container" id="container-font_weight_medium">
                    <button class="btn reset" onclick="_reset_item('font_weight_medium')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.text.font_weight_medium.name}</h5>
                        <p>${trans_legacy[lang].settings.text.font_weight_medium.bio}</p>
                    </div>
                    <div class="slider">
                        <div class="slider-track" id="slider-track-font_weight_medium"><div class="slider-fill"></div><div class="slider-nub"></div></div>
                        <input type="range" min="0" max="900" value="0" step="10" id="slider-font_weight_medium" oninput="_update_item('font_weight_medium', this.value)">
                        <p id="value-font_weight_medium">0</p>
                    </div>
                </div>
                <div class="slider-container" id="container-font_weight_bold">
                    <button class="btn reset" onclick="_reset_item('font_weight_bold')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.text.font_weight_bold.name}</h5>
                        <p>${trans_legacy[lang].settings.text.font_weight_bold.bio}</p>
                    </div>
                    <div class="slider">
                        <div class="slider-track" id="slider-track-font_weight_bold"><div class="slider-fill"></div><div class="slider-nub"></div></div>
                        <input type="range" min="0" max="900" value="0" step="10" id="slider-font_weight_bold" oninput="_update_item('font_weight_bold', this.value)">
                        <p id="value-font_weight_bold">0</p>
                    </div>
                </div>
                <div class="toggle-container" id="container-font_emoji" onclick="_update_item('font_emoji')">
                    <button class="btn reset" onclick="_reset_item('font_emoji')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.text.font_emoji.name}</h5>
                        <p>${trans_legacy[lang].settings.text.font_emoji.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-font_emoji" aria-checked="false">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="sep"></div>
                <div class="inner-preview pad flex">
                    <div class="shout js-shout js-link-block" data-kate-processed="true">
                        <h3 class="shout-user">
                            <a>${auth.name}</a>
                        </h3>
                        <span class="avatar shout-user-avatar avatar--bleh-missing">
                            <img src="" alt="Your avatar" loading="lazy">
                        </span>
                        <a class="shout-permalink shout-timestamp">
                            <time datetime="2024-06-05T02:33:39+01:00" title="Wednesday 5 Jun 2024, 2:33am">
                                5 Jun 2:33am
                            </time>
                        </a>
                        <div class="shout-body if-markdown-on">
                            <p>${trans_legacy[lang].settings.text.shout_preview_md}</p>
                        </div>
                        <div class="shout-body if-markdown-off">
                            <p>${trans_legacy[lang].settings.text.shout_preview}</p>
                        </div>
                    </div>
                </div>
                <h4>${trans_legacy[lang].settings.text.markdown.name}</h4>
                <p>${trans_legacy[lang].settings.text.markdown.bio}</p>
                <div class="toggle-container" id="container-shout_markdown" onclick="_update_item('shout_markdown')">
                    <button class="btn reset" onclick="_reset_item('shout_markdown')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.text.markdown.shouts}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-shout_markdown" aria-checked="false">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-bio_markdown" onclick="_update_item('bio_markdown')">
                    <button class="btn reset" onclick="_reset_item('bio_markdown')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.text.markdown.profile}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-bio_markdown" aria-checked="false">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
            </div>
            <div class="bleh--panel">
                <h4 class="top-header">${trans_legacy[lang].settings.language.name}</h4>
                ${(!valid_langs.includes(document.documentElement.getAttribute('lang'))) ? `
                <div class="alert alert-error">Selected language is not currently supported in bleh, sorry for the inconvenience.</div>
                ` : ''}
                <h4>${trans_legacy[lang].settings.language.supported}</h4>
                <div class="languages" id="languages"></div>
                <div class="sep"></div>
                <div class="alert alert-warning">This page is still under construction! A wiki page dedicated to submitting a language is not available currently.</div>
                <div class="toggle-container">
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.language.submit.name}</h5>
                        <p>${trans_legacy[lang].settings.language.submit.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <a class="btn bleh--btn primary" href="https://github.com/katelyynn/bleh/wiki" target="_blank">${trans_legacy[lang].settings.language.submit.action}</a>
                    </div>
                </div>
            </div>
            `);
    } else if (page_id == 'sku') {
        register_skip_to([]);

        return (`
            <div class="bleh--panel shh">
                <div class="sub-text">${version.build}.${version.sku}</div>
                ☆⌒(>w<)
            </div>
            <div class="bleh--panel">
                <h4>Manage active flags</h4>
                <div class="alert alert-danger">Be careful! Only manage these if you know what you are doing.</div>
                <div class="feature-flags" id="feature-flags"></div>
            </div>
            `);
    } else if (page_id == 'music') {
        register_skip_to([
            {
                id: 'format_guest_features',
                name: trans_legacy[lang].settings.corrections.format_guest_features.name
            },
            {
                id: 'corrections',
                name: trans_legacy[lang].settings.corrections.toggle.name
            },
            {
                id: 'stacked_chartlist_info',
                name: trans_legacy[lang].settings.corrections.stacked_chartlist_info.name
            },
            {
                id: 'travis',
                name: trans_legacy[lang].settings.redirects.name
            },
            {
                id: 'gloss',
                type: 'slider',
                name: trans_legacy[lang].settings.customise.gloss.name
            },
            {
                id: 'grid_glow',
                name: trans_legacy[lang].settings.music.grid_glow.name
            },
            {
                id: 'gendered_tags',
                name: trans_legacy[lang].settings.customise.gendered_tags.name
            }
        ]);

        console.info(artist_corrections, album_track_corrections);

        return (`
            <div class="bleh--panel">
                <h4>${trans_legacy[lang].settings.corrections.formatting}</h4>
                <div class="inner-preview pad flex">
                    <section class="redesigned-header mockup redesigned-track-header no-top-margin">
                        <div class="avatar-side">
                            <img src="https://lastfm.freetls.fastly.net/i/u/avatar170s/8bd696cbd4aa4d4eb6d35393232f55e4.jpg">
                        </div>
                        <div class="info-side">
                            <div class="sub-text">${trans_legacy[lang].track.name}</div>
                            <div class="title-container">
                                <h1 class="bleh--name-with-features">
                                    <div class="title">California Love</div>
                                    <div class="feat" data-bleh--tag-type="ft." data-bleh--tag-group="guests">ft. Dr. Dre, Roger Troutman</div>
                                    <div class="feat" data-bleh--tag-type="- remix" data-bleh--tag-group="mixes">Remix</div>
                                </h1>
                                <h1 class="bleh--name-without-features">
                                    California Love (ft. Dr. Dre, Roger Troutman) - Remix
                                </h1>
                            </div>
                            <h2>
                                <a class="header-new-crumb">2Pac</a><span class="bleh--name-with-features">, </span>
                                <a class="header-new-crumb bleh--name-with-features">Dr. Dre</a><span class="bleh--name-with-features">, </span>
                                <a class="header-new-crumb bleh--name-with-features">Roger Troutman</a>
                            </h2>
                        </div>
                    </section>
                </div>
                <div class="toggle-container" id="container-format_guest_features" onclick="_update_item('format_guest_features')">
                    <button class="btn reset" onclick="_reset_item('format_guest_features')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.corrections.format_guest_features.name}</h5>
                        <p>${trans_legacy[lang].settings.corrections.format_guest_features.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-format_guest_features" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container hide-if-format-guest-disabled" id="container-show_guest_features" onclick="_update_item('show_guest_features')">
                    <button class="btn reset" onclick="_reset_item('show_guest_features')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.corrections.show_guest_features.name}</h5>
                        <p>${trans_legacy[lang].settings.corrections.show_guest_features.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-show_guest_features" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="inner-preview pad flex">
                    <section class="redesigned-header mockup redesigned-album-header no-top-margin">
                        <div class="avatar-side">
                            <img src="https://lastfm.freetls.fastly.net/i/u/avatar170s/def68d94aae8e52ef2d1c0c9d3e16ff4.jpg">
                        </div>
                        <div class="info-side">
                            <div class="sub-text">${trans_legacy[lang].album.name}</div>
                            <div class="title-container">
                                <h1>
                                    <div class="title">my anti-aircraft friend</div>
                                    <div class="feat" data-bleh--tag-type="(remaster" data-bleh--tag-group="remasters">Remastered</div>
                                </h1>
                            </div>
                            <h2>
                                <a class="header-new-crumb">julie</a>
                            </h2>
                        </div>
                    </section>
                </div>
                <div class="toggle-container hide-if-format-guest-disabled" id="container-show_remaster_tags" onclick="_update_item('show_remaster_tags')">
                    <button class="btn reset" onclick="_reset_item('show_remaster_tags')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.corrections.show_remaster_tags.name} <div class="new-badge">${trans_legacy[lang].settings.beta}</div></h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-show_remaster_tags" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
            </div>
            <div class="bleh--panel lotus">
                <h4>${trans_legacy[lang].lotus.version
                .replace('lotus', `<a class="lotus lotus-name" href="https://github.com/katelyynn/lotus" target="_blank" id="lotus_hover">lotus</a>`)
                .replace('{v}', `<span class="version-link lotus">${(artist_corrections.version >= album_track_corrections.version) ? artist_corrections.version : album_track_corrections.version}</span>`)}</h4>
                <p>${trans_legacy[lang].settings.corrections.bio}</p>
                <!--<div class="screen-row actions-only">
                    <div class="actions">
                        <a class="btn action" href="https://github.com/katelyynn/bleh/issues/new/choose" target="_blank">
                            <div class="icon bleh--correction"></div>
                            <span class="text">
                                <h5>${trans_legacy[lang].settings.corrections.submit.name}</h5>
                            </span>
                        </a>
                        <button class="btn action" onclick="_open_correction_modal()">
                            <div class="icon bleh--correction_modal"></div>
                            <span class="text">
                                <h5>${trans_legacy[lang].settings.corrections.view.name}</h5>
                            </span>
                        </button>
                    </div>
                </div>-->
                <div class="screen-row actions-only">
                    <div class="actions">
                        <a class="btn primary external lotus" href="https://github.com/katelyynn/lotus/issues/new/choose" target="_blank">
                            ${trans_legacy[lang].settings.corrections.submit.name}
                        </a>
                        <button class="btn continue" onclick="_open_correction_modal()">
                            ${trans_legacy[lang].settings.corrections.view.name}
                        </button>
                        <button class="btn continue" onclick="_lotus_check()">
                            ${trans_legacy[lang].lotus.check}
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-corrections" onclick="_update_item('corrections')">
                    <button class="btn reset" onclick="_reset_item('corrections')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.corrections.toggle.name}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle lotus" id="toggle-corrections" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
            </div>
            <div class="bleh--panel">
                <h4 class="top-header">${tl(trans.music)}</h4>
                <h4>${trans_legacy[lang].settings.music.header}</h4>
                <div class="inner-preview pad">
                    <div class="tracks">
                        <div class="track realtime">
                            <div class="cover"></div>
                            <div class="info">
                                <div class="title"></div>
                                <div class="artist"></div>
                            </div>
                            <div class="time"></div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="info">
                                <div class="title"></div>
                                <div class="artist"></div>
                            </div>
                            <div class="time"></div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="info">
                                <div class="title"></div>
                                <div class="artist"></div>
                            </div>
                            <div class="time"></div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="info">
                                <div class="title"></div>
                                <div class="artist"></div>
                            </div>
                            <div class="time"></div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="info">
                                <div class="title"></div>
                                <div class="artist"></div>
                            </div>
                            <div class="time"></div>
                        </div>
                    </div>
                </div>
                <div class="toggle-container" id="container-stacked_chartlist_info" onclick="_update_item('stacked_chartlist_info')">
                    <button class="btn reset" onclick="_reset_item('stacked_chartlist_info')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.corrections.stacked_chartlist_info.name}</h5>
                        <p>${trans_legacy[lang].settings.corrections.stacked_chartlist_info.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-stacked_chartlist_info" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container hide-if-no-bulk-edit" id="container-show_bulk_edit_album" onclick="_update_item('show_bulk_edit_album')">
                    <button class="btn reset" onclick="_reset_item('show_bulk_edit_album')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.music.show_bulk_edit_album.name}</h5>
                        <p>${trans_legacy[lang].settings.music.show_bulk_edit_album.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-show_bulk_edit_album" aria-checked="false">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="sep"></div>
                <h4>${trans_legacy[lang].glacier.name}</h4>
                <div class="toggle-container" id="container-glacier_library_graphs" onclick="_update_item('glacier_library_graphs')">
                    <button class="btn reset" onclick="_reset_item('glacier_library_graphs')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].glacier.option.name}</h5>
                        <p>${trans_legacy[lang].glacier.option.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-glacier_library_graphs" aria-checked="true" type="button">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
            </div>
            <div class="bleh--panel">
                <h4>${trans_legacy[lang].settings.redirects.name}</h4>
                <p>${trans_legacy[lang].settings.redirects.bio}</p>
                <div class="inner-preview">
                    <div class="nag-bar nag-bar--corrections nag-bar--corrections--artist preview-bar">
                        <div class="container">
                            <p class="nag-bar-message">
                                Did you mean <strong><a href="/music/Travi$+Scott">Travi$ Scott</a></strong>? <strong><a href="/music/Lil%27+Wayne">Lil' Wayne</a></strong> maybe?
                            </p>
                        </div>
                    </div>
                </div>
                <div class="toggle-container" id="container-travis" onclick="_update_item('travis')">
                    <button class="btn reset" onclick="_reset_item('travis')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.redirects.travis.name}</h5>
                        <p>${trans_legacy[lang].settings.redirects.travis.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-travis" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container">
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.redirects.autocorrect.name}</h5>
                        <p>${trans_legacy[lang].settings.redirects.autocorrect.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <a class="btn bleh--btn primary" href="${root}settings/website" target="_blank">${trans_legacy[lang].settings.redirects.autocorrect.action}</a>
                    </div>
                </div>
            </div>
            <div class="bleh--panel">
                <h4>${trans_legacy[lang].settings.customise.artwork.name}</h4>
                <div class="inner-preview pad">
                    <div class="palette albums" style="height: fit-content">
                        <div class="album-cover swatch" style="background-image: url('https://lastfm.freetls.fastly.net/i/u/770x0/1569198c4cf0a3b2ff8728975e8359fa.jpg')"></div>
                        <div class="album-cover swatch" style="background-image: url('https://lastfm.freetls.fastly.net/i/u/770x0/b897255bf422baa93a42536af293f9f8.jpg')"></div>
                        <div class="album-cover swatch" style="background-image: url('https://lastfm.freetls.fastly.net/i/u/770x0/def68d94aae8e52ef2d1c0c9d3e16ff4.jpg')"></div>
                        <div class="album-cover swatch" style="background-image: url('https://lastfm.freetls.fastly.net/i/u/770x0/510546e3b6df7504392274c528c77780.jpg')"></div>
                        <div class="album-cover swatch" style="background-image: url('https://lastfm.freetls.fastly.net/i/u/770x0/49cc807f69d59746b6b04be3434e6637.jpg')"></div>
                        <div class="album-cover swatch" style="background-image: url('https://lastfm.freetls.fastly.net/i/u/770x0/dd76702cea38c838a3090dd9496d92d9.jpg')"></div>
                    </div>
                </div>
                <div class="slider-container" id="container-gloss">
                    <button class="btn reset" onclick="_reset_item('gloss')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.customise.gloss.name}</h5>
                        <p>${trans_legacy[lang].settings.customise.gloss.bio}</p>
                    </div>
                    <div class="slider">
                        <div class="slider-track" id="slider-track-gloss"><div class="slider-fill"></div><div class="slider-nub"></div></div>
                        <input type="range" min="0" max="1" value="0" step="0.05" id="slider-gloss" oninput="_update_item('gloss', this.value)">
                        <p id="value-gloss">0</p>
                    </div>
                </div>
                <div class="toggle-container" id="container-grid_glow" onclick="_update_item('grid_glow')">
                    <button class="btn reset" onclick="_reset_item('grid_glow')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.music.grid_glow.name}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-grid_glow" aria-checked="true" type="button">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
            </div>
            <div class="bleh--panel">
                <h4>${trans_legacy[lang].settings.customise.display.name}</h4>
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
                                <a href="/tag/singer-songwriter">singer-songwriter</a>
                            </li>
                            <li class="tag">
                                <a href="/tag/female+vocalists">female vocalists</a>
                            </li>
                            <li class="tag">
                                <a href="/tag/synthpop">synthpop</a>
                            </li>
                        </ul>
                    </section>
                </div>
                <div class="toggle-container" id="container-gendered_tags" onclick="_update_item('gendered_tags')">
                    <button class="btn reset" onclick="_reset_item('gendered_tags')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.customise.gendered_tags.name}</h5>
                        <p>${trans_legacy[lang].settings.customise.gendered_tags.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-gendered_tags" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
            </div>
            `);
    } else if (page_id == 'moderation') {
        register_skip_to([]);

        return (`
            <div class="bleh--panel">
                <h4>${tl(trans.moderation)}</h4>
                <p>Decide the way hateful terms across the site are treated.</p>
                <div class="user-top-panel">
                    <div class="user-top-avatar user-top-avatar-side-left"><div class="bleh-icon"></div></div>
                    <img class="user-top-avatar user-top-avatar-main" src="${auth.avatar.replace('avatar42s', 'avatar300s')}" alt="${auth.name}">
                    <div class="user-top-avatar user-top-avatar-side-right"><div class="bleh-icon"></div></div>
                </div>
                <div class="toggle-container" id="container-enable_moderation" onclick="_update_item('enable_moderation')">
                    <button class="btn reset" onclick="_reset_item('enable_moderation')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>Enable moderation</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-enable_moderation" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="sep"></div>
                <h4>Method</h4>
                <div class="primary-selections">
                    <div class="btn primary-selection" id="toggle-removal_method-remove" data-toggle="removal_method" data-toggle-value="remove" onclick="_update_item('removal_method', 'remove')">
                        <h5>Remove</h5>
                        <p>Any matching words will be completely hidden.</p>
                    </div>
                    <div class="btn primary-selection" id="toggle-removal_method-censor" data-toggle="removal_method" data-toggle-value="censor" onclick="_update_item('removal_method', 'censor')">
                        <h5>Censor</h5>
                        <p>Any matching words will be replaced by hearts.</p>
                    </div>
                </div>
            </div>
            <div class="bleh--panel">
                <h4>Manage block lists</h4>
                <p>Enter a URL pointing to a CORS-enabled block list.</p>
                <div class="text-container" id="container-block_list">
                    <div class="heading content-form">
                        <div class="input-container">
                            <input type="url" id="block-list-input" placeholder="https://example.com">
                            <div class="custom-selector block-list-selector">
                                <select id="block-list-type">
                                    <option value="strings">Strings (per line)</option>
                                    <option value="regex">Regex expressions</option>
                                </select>
                            </div>
                            <button class="btn-add primary" onclick="_add_block()">Add</button>
                            <button class="btn icon delete" onclick="_reset_moderation()">Reset</button>
                        </div>
                    </div>
                </div>
                <div class="generic-table-list" id="block-lists"></div>
            </div>
            <div class="bleh--panel">
                <h4>Moderate where?</h4>
                <h5>User-generated</h5>
                <div class="toggle-container" id="container-moderate_shouts" onclick="_update_item('moderate_shouts')">
                    <button class="btn reset" onclick="_reset_item('moderate_shouts')">${tl(trans.reset)}</button>
                    <div class="icon">
                        <div class="bleh-icon" style="--icon: var(--icon-16-shoutbox)"></div>
                    </div>
                    <div class="heading">
                        <h5>Shouts</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-moderate_shouts" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-moderate_bios" onclick="_update_item('moderate_bios')">
                    <button class="btn reset" onclick="_reset_item('moderate_bios')">${tl(trans.reset)}</button>
                    <div class="icon">
                        <div class="bleh-icon" style="--icon: var(--icon-16-user)"></div>
                    </div>
                    <div class="heading">
                        <h5>Profile biographies</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-moderate_bios" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="sep"></div>
                <h5>Music</h5>
                <div class="toggle-container" id="container-moderate_artists" onclick="_update_item('moderate_artists')">
                    <button class="btn reset" onclick="_reset_item('moderate_artists')">${tl(trans.reset)}</button>
                    <div class="icon">
                        <div class="bleh-icon" style="--icon: var(--icon-16-artist)"></div>
                    </div>
                    <div class="heading">
                        <h5>Artist names</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-moderate_artists" aria-checked="false">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-moderate_albums" onclick="_update_item('moderate_albums')">
                    <button class="btn reset" onclick="_reset_item('moderate_albums')">${tl(trans.reset)}</button>
                    <div class="icon">
                        <div class="bleh-icon" style="--icon: var(--icon-16-album)"></div>
                    </div>
                    <div class="heading">
                        <h5>Album names</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-moderate_albums" aria-checked="false">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-moderate_tracks" onclick="_update_item('moderate_tracks')">
                    <button class="btn reset" onclick="_reset_item('moderate_tracks')">${tl(trans.reset)}</button>
                    <div class="icon">
                        <div class="bleh-icon" style="--icon: var(--icon-16-track)"></div>
                    </div>
                    <div class="heading">
                        <h5>Track names</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-moderate_tracks" aria-checked="false">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
            </div>
            `);
    }
}

function register_skip_to(list = null) {
    if (!ff('skip_to_setting'))
        return;

    if (list == null)
        return;

    let panel = page.structure.side.querySelector('.skip-to-list');
    panel.innerHTML = '';

    list.forEach((item) => {
        let button = document.createElement('button');
        button.classList.add('skip-to-item');
        button.setAttribute('onclick', `_scroll_to_setting('${item.id}')`);
        button.textContent = item.name;

        if (item.type != null)
            button.setAttribute('data-type', item.type);

        panel.appendChild(button);
    });
}

unsafeWindow._scroll_to_setting = function(id) {
    scroll_to_setting(id);
}

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

unsafeWindow._change_settings_page = function(page, setting = null) {
    change_settings_page(page, setting);
}

function change_settings_page(page_id, setting = null) {
    page.structure.main.innerHTML = '';

    if (ff('bleh_settings_tabs')) {
        let btns = document.querySelectorAll('.bleh--nav');
        btns.forEach((btn) => {
            console.log(btn.getAttribute('data-bleh-page'),page_id);
            if (btn.getAttribute('data-bleh-page') != page_id) {
                btn.classList.remove('secondary-nav-item-link--active');
            } else {
                btn.classList.add('secondary-nav-item-link--active');
            }
        });
    } else {
        let btns = document.querySelectorAll('.bleh--btn');
        btns.forEach((btn) => {
            console.log(btn.getAttribute('data-bleh-page'),page_id);
            if (btn.getAttribute('data-bleh-page') != page_id) {
                btn.classList.remove('active');
            } else {
                btn.classList.add('active');
            }
        });
    }

    if (page_id == 'home' || page_id == 'seasonal')
        seasonal_timer_start();
    else
        seasonal_timer_end();

    page.structure.main.innerHTML = render_setting_page(page_id);

    if (page_id == 'themes') {
        show_theme_change_in_settings();
        display_colour_presets();
        refresh_all();
    } else if (page_id == 'customise' || page_id == 'performance' || page_id == 'accessibility' || page_id == 'text' || page_id == 'seasonal' || page_id == 'music' || page_id == 'activities') {
        refresh_all();
    } else if (page_id == 'profiles') {
        init_profile_notes();
        init_profile_page();
        refresh_all();
    } else if (page_id == 'sku') {
        bleh_sku_page();
    } else if (page_id == "moderation") {
        bleh_moderation();
        refresh_all();
    }

    if (page_id == 'text')
        prepare_language_page();

    if (page_id == 'music') {
        tippy(document.getElementById('lotus_hover'), {
            content: trans_legacy[lang].lotus.tooltip.replace('lotus', '<span class="lotus lotus-name lotus-name-small">lotus</span>'),
            allowHTML: true
        });

        tippy(document.getElementById('container-show_bulk_edit_album'), {
            content: trans_legacy[lang].settings.music.show_bulk_edit_album.require
        });
    }

    if ((page_id == 'seasonal' || page_id == 'home') && settings.seasonal && stored_season.id != 'none' && stored_season.start && stored_season.end) {
        tippy(document.getElementById('current_season'), {
            content: new Date(stored_season.end.replace('y0', stored_season.year).replace('{offset}', stored_season.offset)).toLocaleString(lang)
        });
        tippy(document.getElementById('current_season_start'), {
            content: new Date(stored_season.start.replace('y0', stored_season.year).replace('{offset}', stored_season.offset)).toLocaleString(lang)
        });
    }

    if (setting != null) {
        let setting_container = document.body.querySelector(`#container-${setting}`);

        if (setting_container != null) {
            let y = setting_container.getBoundingClientRect().top + window.scrollY - 300;
            window.scroll({
                top: y,
                behavior: 'smooth'
            });
        }
    }
}

export function show_theme_change_in_settings(theme = '') {
    if (theme != '')
        settings.theme = theme;

    let btns = document.querySelectorAll('.theme-item');
    btns.forEach((btn) => {
        console.log(btn.getAttribute('data-bleh-theme'),settings.theme);
        if (btn.getAttribute('data-bleh-theme') != settings.theme) {
            btn.classList.remove('active');
        } else {
            btn.classList.add('active');
        }
    });
}
export function show_theme_change_in_menu(theme = '', element = document.body) {
    if (theme != '')
        settings.theme = theme;

    let btns = element.querySelectorAll('.theme-item-in-menu');
    btns.forEach((btn) => {
        console.log(btn.getAttribute('data-bleh-theme'),settings.theme);
        if (btn.getAttribute('data-bleh-theme') != settings.theme) {
            btn.classList.remove('active');
        } else {
            btn.classList.add('active');
        }
    });
}


export function load_skus() {
    for (let flag in version.feature_flags) {
        let current_state = version.feature_flags[flag].default;

        if (settings.feature_flags[flag] != null)
            current_state = settings.feature_flags[flag];

        document.documentElement.setAttribute(`data-ff--${flag}`, current_state);
    }
}

function bleh_sku_page() {
    let flags_container = document.getElementById('feature-flags');

    for (let flag in version.feature_flags) {
        let current_state = version.feature_flags[flag].default;

        if (settings.feature_flags[flag] != undefined)
            current_state = settings.feature_flags[flag];

        let feature_flag_element = document.createElement('div');
        feature_flag_element.classList.add('toggle-container');
        feature_flag_element.setAttribute('onclick', `_update_flag_toggle('${flag}', this)`);
        feature_flag_element.innerHTML = (`
            <div class="heading">
                <h5>${version.feature_flags[flag].name}</h5>
                ${(version.feature_flags[flag].notice) ? `<p>${version.feature_flags[flag].notice}</p>` : ''}
                <div class="info-row">
                    <div class="new-badge flag-${version.feature_flags[flag].default}">${version.feature_flags[flag].default}</div><p class="date">${version.feature_flags[flag].date}</p><p>${flag}</p>
                </div>
            </div>
            <div class="toggle-wrap">
                <button id="feature-flag-toggle-${flag}" class="toggle" aria-checked="${current_state}">
                    <div class="dot"></div>
                </button>
            </div>
        `);

        flags_container.appendChild(feature_flag_element);

        document.documentElement.setAttribute(`data-ff--${flag}`, current_state);
    }
}

unsafeWindow._update_flag_toggle = function(flag, container) {
    update_flag_toggle(flag, container);
}
function update_flag_toggle(flag, container) {
    let button = container.querySelector('.toggle');
    if (!button)
        return;

    let current_state = version.feature_flags[flag].default;
    if (settings.feature_flags[flag] != undefined) current_state = settings.feature_flags[flag];

    if (current_state == true) {
        button.setAttribute('aria-checked', 'false');
        settings.feature_flags[flag] = false;
        document.documentElement.setAttribute(`data-ff--${flag}`, false);
    } else {
        button.setAttribute('aria-checked', 'true');
        settings.feature_flags[flag] = true;
        document.documentElement.setAttribute(`data-ff--${flag}`, true);
    }

    // save to settings
    localStorage.setItem('bleh', JSON.stringify(settings));
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
                type: 'seasonal'
            },
            {
                type: 'customise'
            }
        ],
        red: [
            {sets: {
                hue: 360,
                sat: 1.425,
                lit: 0.725
            }},
            {sets: {
                hue: 360,
                sat: 1.4,
                lit: 0.775
            }},
            {sets: {
                hue: 360,
                sat: 1.325,
                lit: 0.825
            }},
            {sets: {
                hue: 360,
                sat: 1.225,
                lit: 0.875
            }},
            {sets: {
                hue: 360,
                sat: 1.1,
                lit: 0.925
            }},
            {sets: {
                hue: 360,
                sat: 1.05,
                lit: 1
            }}
        ],
        orange: [
            {sets: {
                hue: 10,
                sat: 1.425,
                lit: 0.725
            }},
            {sets: {
                hue: 13,
                sat: 1.4,
                lit: 0.75
            }},
            {sets: {
                hue: 16,
                sat: 1.325,
                lit: 0.8
            }},
            {sets: {
                hue: 20,
                sat: 1.225,
                lit: 0.825
            }},
            {sets: {
                hue: 21,
                sat: 1.275,
                lit: 0.85
            }},
            {sets: {
                hue: 26,
                sat: 1.35,
                lit: 0.9
            }}
        ],
        yellow: [
            {sets: {
                hue: 32,
                sat: 1.25,
                lit: 0.825
            }},
            {sets: {
                hue: 35,
                sat: 1.2,
                lit: 0.85
            }},
            {sets: {
                hue: 40,
                sat: 1.16,
                lit: 0.875
            }},
            {sets: {
                hue: 43,
                sat: 1.1,
                lit: 0.9
            }},
            {sets: {
                hue: 44,
                sat: 1,
                lit: 0.975
            }},
            {sets: {
                hue: 46,
                sat: 1.05,
                lit: 1
            }}
        ],
        green: [
            {sets: {
                hue: 85,
                sat: 1.425,
                lit: 0.725
            }},
            {sets: {
                hue: 90,
                sat: 1.4,
                lit: 0.775
            }},
            {sets: {
                hue: 94,
                sat: 1.325,
                lit: 0.825
            }},
            {sets: {
                hue: 99,
                sat: 1.25,
                lit: 0.85
            }},
            {sets: {
                hue: 105,
                sat: 1.15,
                lit: 0.9
            }},
            {sets: {
                hue: 108,
                sat: 1.075,
                lit: 0.95
            }}
        ],
        lime: [
            {sets: {
                hue: 115,
                sat: 1.15,
                lit: 0.725
            }},
            {sets: {
                hue: 121,
                sat: 1.09,
                lit: 0.775
            }},
            {sets: {
                hue: 127,
                sat: 1.05,
                lit: 0.825
            }},
            {sets: {
                hue: 135,
                sat: 1.03,
                lit: 0.85
            }},
            {sets: {
                hue: 141,
                sat: 1,
                lit: 0.9
            }},
            {sets: {
                hue: 148,
                sat: 1,
                lit: 0.975
            }}
        ],
        aqua: [
            {sets: {
                hue: 165,
                sat: 1.5,
                lit: 0.725
            }},
            {sets: {
                hue: 172,
                sat: 1.425,
                lit: 0.775
            }},
            {sets: {
                hue: 180,
                sat: 1.35,
                lit: 0.825
            }},
            {sets: {
                hue: 188,
                sat: 1.275,
                lit: 0.875
            }},
            {sets: {
                hue: 194,
                sat: 1.2,
                lit: 0.95
            }},
            {sets: {
                hue: 200,
                sat: 1.125,
                lit: 1
            }}
        ],
        blue: [
            {sets: {
                hue: 233,
                sat: 1.4,
                lit: 0.75
            }},
            {sets: {
                hue: 230,
                sat: 1.3,
                lit: 0.8
            }},
            {sets: {
                hue: 225,
                sat: 1.25,
                lit: 0.825
            }},
            {sets: {
                hue: 219,
                sat: 1.2,
                lit: 0.85
            }},
            {sets: {
                hue: 214,
                sat: 1.15,
                lit: 0.9
            }},
            {sets: {
                hue: 208,
                sat: 1.025,
                lit: 0.95
            }}
        ],
        purple: [
            {sets: {
                hue: 246,
                sat: 1.32,
                lit: 0.825
            }},
            {sets: {
                hue: 244,
                sat: 1.2,
                lit: 0.85
            }},
            {sets: {
                hue: 246,
                sat: 1.12,
                lit: 0.875
            }},
            {sets: {
                hue: 249,
                sat: 1.11,
                lit: 0.925
            }},
            {sets: {
                hue: 253,
                sat: 1.07,
                lit: 0.97
            }},
            {sets: {
                hue: 255,
                sat: 1.01,
                lit: 1.01
            }}
        ],
        pink: [
            {sets: {
                hue: 346,
                sat: 1.35,
                lit: 0.75
            }},
            {sets: {
                hue: 340,
                sat: 1.275,
                lit: 0.8
            }},
            {sets: {
                hue: 333,
                sat: 1.225,
                lit: 0.85
            }},
            {sets: {
                hue: 320,
                sat: 1.15,
                lit: 0.925
            }},
            {sets: {
                hue: 312,
                sat: 1.05,
                lit: 0.975
            }},
            {sets: {
                hue: 304,
                sat: 1,
                lit: 1
            }}
        ]
    }

    for (let type in colours) {
        let swatch_group = document.body.querySelector(`#colour_${type}`);

        if (!swatch_group)
            return;

        colours[type].forEach((colour) => {
            if (colour.requires_flag && version.feature_flags.hasOwnProperty(colour.requires_flag)) {
                if (!ff(colour.requires_flag))
                    return;
            }

            if (!colour.type)
                colour.type = 'colour';

            if (!colour.displays && colour.sets)
                colour.displays = colour.sets;

            let swatch = document.createElement('button');
            swatch.classList.add('swatch', 'btn');
            swatch.setAttribute('data-swatch-type', colour.type);

            if (type == 'custom')
                swatch.classList.add('view-item', 'colour-btn');

            if (type == 'custom')
                swatch.textContent = tl(trans[colour.type]);

            if (colour.type == 'seasonal') {
                swatch.textContent = tl(trans.seasonal.name);
                if (stored_season.id == 'none')
                    return;

                //swatch.classList.add('select-button');

                tippy(swatch, {
                    theme: 'menu',
                    content: '',
                    allowHTML: true,
                    placement: 'bottom',
                    interactive: true,
                    interactiveBorder: 10,
                    trigger: 'click',

                    onShow(instance) {
                        let content = instance.popper.querySelector('.tippy-content');

                        display_seasonal_exclusives(content);
                    }
                });
            }

            if (colour.type == 'customise') {
                //swatch.classList.add('select-button');

                tippy(swatch, {
                    theme: 'window',
                    content: (`
                        <div class="dialog-settings">
                            <div class="alert alert-info seasonal-hsl-alert">
                                ${trans_legacy[lang].settings.customise.colours.modals.custom_colour.seasonal_alert}
                            </div>
                            <div class="slider-container dim-using-hue-gradient dim-during-seasonal" id="container-hue">
                                <button class="btn reset" onclick="_reset_item('hue')">${tl(trans.reset)}</button>
                                <div class="heading">
                                    <h5>${tl(trans.hue)}</h5>
                                </div>
                                <div class="slider">
                                    <div class="slider-track" id="slider-track-hue"><div class="slider-fill"></div><div class="slider-nub"></div></div>
                                    <input type="range" min="0" max="360" value="${settings.hue}" id="slider-hue" oninput="_update_item('hue', this.value)">
                                    <p id="value-hue">${settings.hue}${settings_base.hue.unit}</p>
                                </div>
                                <div class="hint">
                                    <p style="left: 0">0</p>
                                    <p style="left: calc((255 / 360) * 100%)">255</p>
                                    <p style="left: 100%">360</p>
                                </div>
                            </div>
                            <div class="slider-container dim-using-hue-gradient dim-during-seasonal" id="container-sat">
                                <button class="btn reset" onclick="_reset_item('sat')">${tl(trans.reset)}</button>
                                <div class="heading">
                                    <h5>${tl(trans.sat)}</h5>
                                </div>
                                <div class="slider">
                                    <div class="slider-track" id="slider-track-sat"><div class="slider-fill"></div><div class="slider-nub"></div></div>
                                    <input type="range" min="0" max="1.5" value="${settings.sat}" step="0.025" id="slider-sat" oninput="_update_item('sat', this.value)">
                                    <p id="value-sat">${settings.sat}${settings_base.sat.unit}</p>
                                </div>
                                <div class="hint">
                                    <p style="left: 0">0</p>
                                    <p style="left: calc((1 / 1.5) * 100%)">1</p>
                                    <p style="left: 100%">1.5</p>
                                </div>
                            </div>
                            <div class="slider-container dim-using-hue-gradient dim-during-seasonal" id="container-lit">
                                <button class="btn reset" onclick="_reset_item('lit')">${tl(trans.reset)}</button>
                                <div class="heading">
                                    <h5>${tl(trans.lit)}</h5>
                                </div>
                                <div class="slider">
                                    <div class="slider-track" id="slider-track-lit"><div class="slider-fill"></div><div class="slider-nub"></div></div>
                                    <input type="range" min="0" max="1.5" value="${settings.lit}" step="0.025" id="slider-lit" oninput="_update_item('lit', this.value)">
                                    <p id="value-lit">${settings.lit}${settings_base.lit.unit}</p>
                                </div>
                                <div class="hint">
                                    <p style="left: 0">0</p>
                                    <p style="left: calc((1 / 1.5) * 100%)">1</p>
                                    <p style="left: 100%">1.5</p>
                                </div>
                            </div>
                            ${(ff('card_saturation')) ? (`
                            <div class="slider-container hide-if-light-theme" id="container-sat_bg">
                                <button class="btn reset" onclick="_reset_item('sat_bg')">${tl(trans.reset)}</button>
                                <div class="heading">
                                    <h5>${tl(trans.card_background_saturation.name)}</h5>
                                    <p>${tl(trans.card_background_saturation.body)}</p>
                                </div>
                                <div class="slider">
                                    <div class="slider-track" id="slider-track-sat_bg"><div class="slider-fill"></div><div class="slider-nub"></div></div>
                                    <input type="range" min="0" max="3" value="0" step="0.1" id="slider-sat_bg" oninput="_update_item('sat_bg', this.value)">
                                    <p id="value-sat_bg">0</p>
                                </div>
                            </div>
                            `) : ''}
                        </div>
                    `),
                    allowHTML: true,
                    placement: 'bottom',
                    interactive: true,
                    interactiveBorder: 10,
                    trigger: 'click',

                    onShow(instance) {
                        refresh_all(instance.popper);
                    }
                });
            }

            if (colour.sets) {
                colour.sets.accent_type = colour.type;

                swatch.setAttribute('onclick', `_update_params(${JSON.stringify(colour.sets)})`);

                swatch.style.setProperty('--hue-over', colour.displays.hue);
                swatch.style.setProperty('--sat-over', colour.displays.sat);
                swatch.style.setProperty('--lit-over', colour.displays.lit);

                tippy(swatch, {
                    theme: 'key_value',
                    content: (`
                        <span class="key">hue<span class="value">${colour.sets.hue}</span></span>
                        <span class="key">sat<span class="value">${colour.sets.sat}</span></span>
                        <span class="key">lit<span class="value">${colour.sets.lit}</span></span>
                    `),
                    allowHTML: true,
                    delay: [250, 0]
                });
            }

            swatch_group.appendChild(swatch);
        });
    }
}
unsafeWindow._create_a_custom_colour = function() {
    notify({
        title: 'Under construction',
        body: 'This dialog is being moved!',
        icon: 'icon-16-x',
        persist: true
    });
}

function display_seasonal_exclusives(instance) {
    let exclusives = {
        christmas: [
            {
                type: 'season',
                name: trans_legacy[lang].settings.customise.seasonal.nonsense,
                sets: {
                    hue: 352,
                    sat: 1.8,
                    lit: 0.925
                }
            },
            {
                type: 'season',
                name: trans_legacy[lang].settings.customise.seasonal.fruitcake,
                sets: {
                    hue: 24,
                    sat: 0.93,
                    lit: 1
                }
            },
            {
                type: 'season',
                name: trans_legacy[lang].settings.customise.seasonal.mistletoe,
                sets: {
                    hue: 130,
                    sat: 0.45,
                    lit: 0.75
                }
            },
            {
                type: 'season',
                name: trans_legacy[lang].settings.customise.seasonal.festival,
                sets: {
                    hue: 240,
                    sat: 1.4,
                    lit: 0.875
                }
            }
        ]
    }
    exclusives.new_years = exclusives.christmas;

    if (!exclusives.hasOwnProperty(stored_season.id)) {
        instance.innerHTML = (`
            <div class="alert alert-info">${trans_legacy[lang].settings.customise.seasonal.none}</div>
        `);

        return;
    }

    instance.innerHTML = '';

    exclusives[stored_season.id].forEach((colour) => {
        colour.sets = {accent_type: colour.type, ...colour.sets};
        colour.displays = colour.sets;

        let item = document.createElement('button');
        item.classList.add('dropdown-menu-clickable-item', 'swatch');
        item.setAttribute('data-swatch-type', colour.type);
        item.textContent = colour.name;

        item.setAttribute('onclick', `_update_params(${JSON.stringify(colour.sets)})`);

        item.style.setProperty('--hue-over', colour.displays.hue);
        item.style.setProperty('--sat-over', colour.displays.sat);
        item.style.setProperty('--lit-over', colour.displays.lit);

        if (colour.displays.hue == settings.hue && colour.displays.sat == settings.sat && colour.displays.lit)
            item.setAttribute('aria-checked', 'true');

        instance.appendChild(item);
    });
}


function init_profile_page() {
    let profile_name_obj = document.body.querySelector('.title-container');

    if (sponsor_list && sponsor_list.badges.hasOwnProperty(auth.name)) {
        if (!Array.isArray(sponsor_list.badges[auth.name])) {
            // default
            log(`1 badge:`, 'profile', 'info', sponsor_list.badges[auth.name]);
            let this_badge = sponsor_list.badges[auth.name];

            let badge = document.createElement('span');
            badge.classList.add('label',`user-status--bleh-${this_badge.type}`,`user-status--bleh-user-${auth.name}`);
            badge.textContent = (this_badge.name != null) ? this_badge.name : tl(trans.badges[this_badge.type].name);
            profile_name_obj.appendChild(badge);
        } else {
            // multiple
            log(`multiple badges:`, 'profile', 'info', sponsor_list.badges[auth.name]);
            for (let badge_entry in sponsor_list.badges[auth.name]) {
                let this_badge = sponsor_list.badges[auth.name][badge_entry];

                let badge = document.createElement('span');
                badge.classList.add('label',`user-status--bleh-${this_badge.type}`,`user-status--bleh-user-${auth.name}`);
                badge.textContent = (this_badge.name != null) ? this_badge.name : tl(trans.badges[this_badge.type].name);
                profile_name_obj.appendChild(badge);
            }
        }
    } else {
        let badge = document.createElement('span');
        badge.classList.add('label','user-status--bleh-missing');
        badge.textContent = tl(trans.badges.missing.name);
        profile_name_obj.appendChild(badge);
    }
}

function init_profile_notes() {
    let profile_notes = JSON.parse(localStorage.getItem('bleh_profile_notes')) || {};
    let profile_notes_table = document.getElementById('profile-notes');

    for (let user in profile_notes) {
        let profile_note = document.createElement('div');
        profile_note.classList.add('profile-note-row');
        profile_note.setAttribute('id',`profile-note-row--${user}`);
        profile_note.innerHTML = (`
        <div class="name">
            <h5><a class="mention" href="${root}user/${user}">@${user}</a></h5>
        </div>
        <div class="note-preview">
            <p id="profile-note-row-preview--${user}">${profile_notes[user]}</p>
        </div>
        <div class="actions">
            <button class="btn bleh--edit-note" id="profile-note-row-edit--${user}" onclick="_edit_profile_note('${user}')">
                ${trans_legacy[lang].settings.profiles.notes.edit}
            </button>
            <button class="btn bleh--delete-note" id="profile-note-row-delete--${user}" onclick="_delete_profile_note('${user}')">
                ${trans_legacy[lang].settings.profiles.notes.delete}
            </button>
        </div>
        `);

        profile_notes_table.appendChild(profile_note);
        tippy(document.getElementById(`profile-note-row-edit--${user}`), {
            content: trans_legacy[lang].settings.profiles.notes.edit_user.replace('{u}', user)
        });
        tippy(document.getElementById(`profile-note-row-delete--${user}`), {
            content: trans_legacy[lang].settings.profiles.notes.delete_user.replace('{u}', user)
        });
    }
}

unsafeWindow._delete_profile_note = function(username) {
    let profile_notes = JSON.parse(localStorage.getItem('bleh_profile_notes')) || {};
    delete profile_notes[username];
    document.getElementById(`profile-note-row--${username}`).style.setProperty('display','none');

    localStorage.setItem('bleh_profile_notes',JSON.stringify(profile_notes));
}

unsafeWindow._edit_profile_note = function(username) {
    let profile_notes = JSON.parse(localStorage.getItem('bleh_profile_notes')) || {};

    dialog_legacy('edit_profile_note',trans_legacy[lang].settings.profiles.notes.edit_user.replace('{u}', username),`
    <textarea id="bleh--profile-note" placeholder="Enter a local note for this user">${profile_notes[username]}</textarea>
    <div class="modal-footer">
        <button class="btn primary save" onclick="_save_profile_note_in_window('${username}')">
            ${trans_legacy[lang].settings.save}
        </button>
        <button class="btn cancel" onclick="_kill_window('edit_profile_note')">
            ${trans_legacy[lang].settings.cancel}
        </button>
    </div>
    `, true);

    profile_notes[username] = document.getElementById('bleh--profile-note').value;

    localStorage.setItem('bleh_profile_notes',JSON.stringify(profile_notes));
}

unsafeWindow._save_profile_note_in_window = function(username) {
    let profile_notes = JSON.parse(localStorage.getItem('bleh_profile_notes')) || {};
    let value_to_save = document.getElementById('bleh--profile-note').value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
    profile_notes[username] = value_to_save;

    document.getElementById(`profile-note-row-preview--${username}`).textContent = value_to_save;

    localStorage.setItem('bleh_profile_notes',JSON.stringify(profile_notes));
    kill_window('edit_profile_note');
}




export function prepare_corrections_page() {
    let corrections_table_artist = document.getElementById('corrections-artist');

    for (let artist in artist_corrections) {
        if (artist == 'version')
            continue;

        let correction = document.createElement('div');
        correction.classList.add('correction-row');
        correction.innerHTML = (`
        <div class="primary-name pre-transition">
            <h5>${artist}</h5>
        </div>
        <div class="arrow-divider"></div>
        <div class="primary-name post-transition">
            <h5>${artist_corrections[artist]}</h5>
        </div>
        `);

        corrections_table_artist.appendChild(correction);
    }

    //

    let corrections_table_albums_tracks = document.getElementById('corrections-albums_tracks');

    for (let artist in album_track_corrections) {
        if (artist == 'version')
            continue;

        let artist_row = document.createElement('div');
        artist_row.classList.add('artist-row');
        artist_row.innerHTML = (`
            <h5>${artist}</h5>
        `);

        corrections_table_albums_tracks.appendChild(artist_row);

        for (let media in album_track_corrections[artist]) {
            let correction = document.createElement('div');
            correction.classList.add('correction-row');
            correction.innerHTML = (`
            <div class="primary-name pre-transition">
                <h5>${media}</h5>
            </div>
            <div class="arrow-divider"></div>
            <div class="primary-name post-transition">
                <h5>${album_track_corrections[artist][media]}</h5>
            </div>
            `);

            corrections_table_albums_tracks.appendChild(correction);
        }
    }
}


function prepare_language_page() {
    let languages_table = document.getElementById('languages');

    for (let language in lang_info) {
        let lang_row = document.createElement('div');
        lang_row.classList.add('language-row');

        if (non_override_lang == language)
            lang_row.classList.add('active');

        let users = '';
        for (let user in lang_info[language].by)
            users = `${users}<a class="mention" href="${root}user/${lang_info[language].by[user]}" target="_blank">@${lang_info[language].by[user]}</a> `;

        lang_row.innerHTML = (`
        <div class="flag-container">
            <img src="https://katelyynn.github.io/bleh/fm/flags/${language}.svg" alt="flag for ${language}">
        </div>
        <div class="name">
            <h5>${lang_info[language].name}</h5>
            <p>${trans_legacy[lang].settings.language.by.replace('{users}', users)}</p>
        </div>
        ${(lang_info[language].new ? (`
        <div class="badges">
            <div class="new-badge">${trans_legacy[lang].settings.new}</div>
        </div>
        `): '<div class="badges"></div>')}
        <div class="date">
            <p>${(lang_info[language].last_updated != 'latest') ? moment(lang_info[language].last_updated).fromNow() : lang_info[language].last_updated}</p>
        </div>
        `);

        languages_table.appendChild(lang_row);
    }
}


unsafeWindow._import_settings = function() {
    dialog({
        id: 'import_settings',
        title: trans_legacy[lang].settings.actions.import.modals.initial.name,
        body: (`
            <p class="alert alert-warning">${trans_legacy[lang].settings.actions.import.modals.initial.alert}</p>
            <br>
            <textarea id="import_area"></textarea>
            <div class="modal-footer">
                <button class="btn primary download" onclick="_confirm_import()">
                    ${tl(trans.import)}
                </button>
                <button class="btn cancel" onclick="_dialog_rm({id: 'import_settings'})">
                    ${trans_legacy[lang].settings.cancel}
                </button>
            </div>
        `)
    });
}

unsafeWindow._confirm_import = function() {
    //localStorage.setItem('old_settings', localStorage.getItem('bleh'));

    let requesting_setting = document.getElementById('import_area').value;
    try {
        let try_parse = JSON.parse(requesting_setting);

        // can continue
        localStorage.setItem('bleh', requesting_setting);
        load_settings();

        dialog_rm({
            id: 'import_settings'
        });
    } catch(e) {
        // cannot continue, halt
        dialog_rm({
            id: 'import_settings'
        });
        dialog({
            id: 'import_failed',
            title: trans_legacy[lang].settings.actions.import.modals.failed.name,
            body: (`
                <p class="alert alert-error">${trans_legacy[lang].settings.actions.import.modals.failed.alert}</p>
                <div class="modal-footer">
                    <button class="btn primary done" onclick="_dialog_rm({id: 'import_failed'})">
                        ${trans_legacy[lang].settings.done}
                    </button>
                </div>
            `)
        });
    }
}


// export settings
function export_settings() {
    dialog({
        id: 'export_settings',
        title: trans_legacy[lang].settings.actions.export.modals.initial.name,
        body: (`
            <p class="alert alert-success">${trans_legacy[lang].settings.actions.export.modals.initial.alert}</p>
            <br>
            <textarea>${JSON.stringify(settings)}</textarea>
            <div class="modal-footer">
                <button class="btn primary done" onclick="_dialog_rm({id: 'export_settings'})">
                    ${trans_legacy[lang].settings.done}
                </button>
            </div>
        `)
    });
}
unsafeWindow._export_settings = function() {
    export_settings();
}


// reset settings
unsafeWindow._reset_settings = function() {
    dialog({
        id: 'reset_settings',
        title: trans_legacy[lang].settings.actions.reset.modals.initial.name,
        body: (`
            <p class="alert alert-error">${trans_legacy[lang].settings.actions.reset.modals.initial.alert}</p>
            <div class="modal-footer">
                <button class="btn done danger" onclick="_confirm_reset()">
                    ${trans_legacy[lang].settings.actions.reset.modals.initial.confirm}
                </button>
                <button class="btn upload" onclick="_export_first()">
                    ${trans_legacy[lang].settings.actions.reset.modals.initial.export}
                </button>
                <button class="btn primary cancel" onclick="_dialog_rm({id: 'reset_settings'})">
                    ${trans_legacy[lang].settings.cancel}
                </button>
            </div>
        `)
    });
}

unsafeWindow._confirm_reset = function() {
    for (var member in settings) delete settings[member];
    Object.assign(settings, create_settings_template());
    load_settings(true);

    dialog_rm({
        id: 'reset_settings'
    });
}

unsafeWindow._export_first = function() {
    dialog_rm({
        id: 'reset_settings'
    });
    export_settings();
}

unsafeWindow._save_font = function() {
    let font = document.getElementById('text-font').value;

    document.body.style.setProperty(`--${settings_base.font.css}`, font);
    document.documentElement.setAttribute(`data-bleh--font`, font);

    // save to settings
    settings.font = font;
    localStorage.setItem('bleh', JSON.stringify(settings));
}