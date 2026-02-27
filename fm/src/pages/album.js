//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { settings } from '@/build/config';
import { log } from '@/build/log';
import { auth, page, root } from '@/build/page';
import {
    clamp_lit,
    clamp_sat,
    clean_number,
    desanitise,
    hex_to_oklch,
    sanitise
} from '@/build/tools';
import { tl, trans } from '@/build/trans';
import { load_chart_colours } from '@/components/music/chart.js';
import { bleh_about_artist } from '@/components/music/about_artist.js';
import { patch_header_title } from '@/components/music/lotus.js';
import { register_menu } from '@/components/menu';
import {
    bleh_music_page_charts,
    redirect,
    show_your_scrobbles,
    similar_items
} from '@/components/music/music';
import { checkup_page_structure } from '@/components/page/structure';
import { register_background, update_page } from '@/page';
import { ff } from '@/components/settings/sku';
import { bleh_gallery_list, bleh_gallery_upload } from '@/pages/music/gallery';
import { bleh_tags_mini } from '@/pages/tag';
import { bleh_wiki, bleh_wiki_editor, bleh_wiki_history } from '@/pages/music/wiki';
import { html, render } from 'lighterhtml';
import { expand_avatar } from '@/components/shared/avatar';
import { setting } from '@/components/settings/settings';
import tippy from 'tippy.js';
import { oracle_process } from '@/components/music/oracle';
import { save_hoshino_artwork } from '@/components/music/hoshino.js';

export function bleh_albums() {
    let album_header = document.body.querySelector('.header-new--album');

    page.sister = album_header.querySelector(
        '.header-new-crumb span'
    ).textContent;
    page.name = document.body
        .querySelector('[data-page-resource-name]')
        .getAttribute('data-page-resource-name');

    patch_header_title();

    let is_subpage = album_header.classList.contains('header-new--subpage');

    // without pro theres two containers
    if (auth.pro) {
        // pro

        page.structure.container = document.body.querySelector(
            '.page-content:not(:has(.content-top-lower-row, a + .js-gallery-heading))'
        );
    } else {
        // not pro

        if (!is_subpage) {
            // normal, is there an ad then a container?
            page.structure.container = document.body.querySelector(
                '.full-bleed-ad-container + .page-content:not(.visible-xs)'
            );

            // death grips for some reason
            if (!page.structure.container)
                page.structure.container =
                    document.body.querySelector('.page-content');
        } else {
            page.structure.container = document.body.querySelector(
                '.page-content:not(:has(.content-top-lower-row, a + .js-gallery-heading))'
            );
        }
    }
    page.structure.row = page.structure.container.querySelector('.row');
    try {
        page.structure.main = page.structure.row.querySelector(
            '.col-main:not(.visible-xs, .hidden-xs, .upper-overview)'
        );
        if (!is_subpage)
            page.structure.side = page.structure.row.querySelector(
                '.col-sidebar.hidden-xs.masonry-right-bottom'
            );
        else
            page.structure.side = page.structure.row.querySelector(
                '.col-sidebar.hidden-xs'
            );
    } catch (e) {
        log('unable to find elements', 'page structure');
    }

    checkup_page_structure(is_subpage, album_header);

    if (ff('refreshed_music_nav')) {
        let avatar = album_header.querySelector('.header-new-background-image');
        let title = album_header.querySelector('.header-new-title');
        let artist = album_header.querySelector('[itemprop="byArtist"]');
        let position = album_header.querySelector(
            '.header-new-chart-position-number'
        );

        const avatar_img = avatar
            ?.getAttribute('content')
            .replace('/ar0/', '/avatar300s/');

        const listeners = document.body.querySelector(
            '.header-new-info-desktop .header-metadata-tnew-display > p > abbr'
        );

        save_hoshino_artwork(
            avatar_img,
            page.name,
            page.sister,
            clean_number(listeners?.title)
        );

        let redesigned_album_header = html.node`
            <section class="redesigned-header redesigned-album-header no-background">
                ${
                    is_subpage || ff('show_album_cover_always') ?
                        html.node`
                <div class="avatar-side">
                    ${
                        avatar ?
                            html.node`
                    <img src="${avatar.getAttribute('content').replace('/ar0/', '/avatar170s/')}">
                    <a class="bleh--avatar-clickable-link"></a>
                    `
                        :   html.node`<img class="missing-album">`
                    }
                </div>
                `
                    :   ''
                }
                <div class="info-side">
                    <div class="sub-text">${tl(trans.album)}</div>
                    <div class="title-container">
                        ${title}
                        ${position ? position : ''}
                    </div>
                    <h2>${artist}</h2>
                </div>
                ${
                    page.suggest ?
                        html.node`
                <div class="suggest-side">
                    <div class="cta suggest">
                        <strong>${tl(trans.suggest_title.name)}</strong>
                        <a class="see-more" href="${root}music/${redirect()}${sanitise(page.sister)}/${page.suggest}">${tl(trans.suggest_title.body).replace('{v}', desanitise(page.suggest, '+'))}</a>
                    </div>
                </div>
                `
                    :   ''
                }
        `;

        if (avatar) register_background(avatar.getAttribute('content'));
        else register_background(null);

        page.structure.container.insertBefore(
            redesigned_album_header,
            page.structure.container.firstElementChild
        );
        album_header.classList.add('legacy-header');

        let avatar_side = redesigned_album_header.querySelector('.avatar-side');
        let avatar_link = avatar_side.querySelector('a');

        if (avatar && avatar_link) {
            if (settings.default_avatar_action == 'expand' && avatar)
                avatar_link.setAttribute(
                    'onclick',
                    `_expand_avatar('${avatar.getAttribute('content')}')`
                );
            else if (settings.default_avatar_action == 'gallery')
                avatar_link.href = `${root}music/${redirect()}${sanitise(page.sister)}/${sanitise(page.name)}/+images`;

            let menu = tippy(avatar_side, {
                theme: 'context-menu',
                content: html.node`
                    ${
                        avatar ?
                            html.node`
                    <button class="dropdown-menu-clickable-item" onclick=${() => expand_avatar(avatar.getAttribute('content'))} data-menu-item="expand">
                        ${tl(trans.expand)}
                    </button>
                    `
                        :   ''
                    }
                    <a class="dropdown-menu-clickable-item" href="${root}music/${redirect()}${sanitise(page.sister)}/${sanitise(page.name)}/+images" data-menu-item="gallery">
                        ${tl(trans.artwork)}
                    </a>
                    <div class="sep"></div>
                    <a class="dropdown-menu-clickable-item" href="${root}bleh/customise" data-menu-item="settings">
                        ${tl(trans.settings)}
                    </a>
                `,
                placement: 'right-start',
                trigger: 'manual',
                interactive: true,
                interactiveBorder: 10,
                offset: [0, 0],

                onShow(instance) {
                    instance.popper.addEventListener('click', (event) => {
                        instance.hide();
                    });
                }
            });

            register_menu(avatar_side, menu);
        }
    }

    // cover
    if (settings.hue_from_album) {
        let header_inner = album_header.querySelector('.header-new-inner');
        try {
            let bg = header_inner
                .getAttribute('style')
                .replace('background: #', '');
            let hsl = hex_to_oklch(bg);

            let sat = clamp_sat((hsl.s / 100) * 3);
            let lit = clamp_lit(sat, hsl.l / 100 + 0.35, true);

            document.body.style.setProperty('--hue-album', hsl.h);
            document.body.style.setProperty('--sat-album', sat);
            document.body.style.setProperty('--lit-album', lit);

            log(
                `sourced hsl of (${hsl.h}, ${hsl.s}, ${hsl.l}) - using final value of (${hsl.h}, ${sat}, ${lit})`,
                'hue from album'
            );

            load_chart_colours();
        } catch (e) {
            log('no cover present', 'hue from album');
        }
    }

    if (!is_subpage) {
        show_your_scrobbles();

        bleh_music_page_charts();

        album_missing_a_tracklist();

        bleh_about_artist();

        bleh_tags_mini();

        similar_items();
    } else {
        let btn_add = page.structure.side.querySelector('.add-button');
        if (btn_add) btn_add.setAttribute('data-page-subpage', page.subpage);

        if (page.subpage == 'images_image-upload') bleh_gallery_upload();
        else if (page.subpage == 'images_overview') bleh_gallery_list();
        else if (page.subpage == 'wiki_overview') bleh_wiki();
        else if (page.subpage == 'wiki_history') bleh_wiki_history();
        else if (page.subpage == 'wiki_edit') bleh_wiki_editor();
    }

    if (ff('oracle') && settings.oracle_beta) oracle_process();

    log('status is', 'page', 'info', page);
    update_page();
}

function album_missing_a_tracklist() {
    // tracklist
    let tracklist = page.structure.main.querySelector('#tracklist');

    let settings_btn;

    if (tracklist) {
        let top = tracklist.querySelector('.section-controls');
        top.classList = 'top-container';

        let header = top.querySelector('h3');

        let select_btn = top.querySelector('.dropdown-menu-clickable-button');

        if (select_btn) {
            select_btn.classList.add(
                'select-button',
                'link-select',
                'blend-v2-btn'
            );
            select_btn.classList.remove('dropdown-menu-clickable-button');
        }

        header.after(html.node`
            <div class="accompany view-buttons blend blend-v2">
                ${select_btn}
            </div>
            <div class="view-buttons blend blend-v2">
                <button class="left-icon blend-v2-btn" data-type="settings" ref=${(el) => (settings_btn = el)}>
                    ${tl(trans.settings)}
                </button>
            </div>
        `);
    } else if (!ff('oracle') || !settings.oracle_beta) {
        let top_overview = page.structure.main.querySelector(
            '.top-overview-panel'
        );
        if (!top_overview) return;

        let top = html.node`
            <div class="top-container">
                <h3 class="text-18">${tl(trans.tracklist)}</h3>
                <div class="view-buttons blend blend-v2">
                    <button class="left-icon blend-v2-btn" data-type="settings" ref=${(el) => (settings_btn = el)}>
                        ${tl(trans.settings)}
                    </button>
                </div>
            </div>
        `;

        tracklist = html.node`
            <section>
                ${top}
                <div class="loading-data-container">
                    <p class="loading-data-text">${tl(trans.gathering_your_plays)}</p>
                </div>
            </section>
        `;
        top_overview.after(tracklist);

        /*let url_split = window.location.href.split('/');
        let album_url = `${url_split[(url_split.length - 2)]}/${url_split[(url_split.length - 1)]}`;
        let album_as_track_url = window.location.href.replace(album_url, `${url_split[(url_split.length - 2)]}/_/${url_split[(url_split.length - 1)]}`);*/

        let url = document.querySelector('.header-metadata-display a');
        if (!url) {
            let url_split = window.location.href.split('/');
            let album_url = `${url_split[url_split.length - 2]}/${url_split[url_split.length - 1]}`;
            let album_as_track_url = window.location.href.replace(
                album_url,
                `${url_split[url_split.length - 2]}/_/${url_split[url_split.length - 1]}`
            );

            render(tracklist, html`
                ${top}
                <div class="loading-data-container">
                    <p class="loading-data-text failed">
                        ${tl(trans.failed_to_find_tracks)}
                    </p>
                    <a class="see-more" href="${album_as_track_url}">
                        ${tl(trans.open_album_as_track)}
                    </a>
                </div>
            `);
            return;
        }
        url = url.getAttribute('href');

        // we need to fetch the tracklist
        fetch(url)
            .then(function (response) {
                console.error('returned', response, response.text);

                return response.text();
            })
            .then(function (dom) {
                let doc = new DOMParser().parseFromString(dom, 'text/html');

                //deliver_notif(`using url ${`/user/${auth.name}/library/music/${album_url}`}`);
                console.log('DOC', doc);

                let inner_tracklist = doc.querySelector(
                    '#top-tracks-section [v-else=""] .chartlist'
                );
                if (inner_tracklist == null) {
                    let url_split = window.location.href.split('/');
                    let album_url = `${url_split[url_split.length - 2]}/${url_split[url_split.length - 1]}`;
                    let album_as_track_url = window.location.href.replace(
                        album_url,
                        `${url_split[url_split.length - 2]}/_/${url_split[url_split.length - 1]}`
                    );

                    render(tracklist, html`
                        ${top}
                        <div class="loading-data-container">
                            <p class="loading-data-text failed">
                                ${tl(trans.failed_to_find_tracks)}
                            </p>
                            <a class="see-more" href=${album_as_track_url}>
                                ${tl(trans.open_album_as_track)}
                            </a>
                        </div>
                    `);
                    return;
                }

                inner_tracklist.classList.remove('chartlist--with-image');

                render(tracklist, html`
                    ${top}
                    <div class="alert alert-info">
                        ${tl(trans.sourced_from_own_plays)}
                    </div>
                    ${inner_tracklist}
                `);
            });
    }

    tippy(settings_btn, {
        theme: 'window',
        content: html.node`
            <div class="dialog-settings">
                <div class="setting-group blend">
                    ${setting({ id: 'format_guest_features' })}
                    ${setting({ id: 'show_guest_features' })}
                </div>
            </div>
        `,
        placement: 'bottom',
        interactive: true,
        interactiveBorder: 10,
        trigger: 'click'
    });
}
