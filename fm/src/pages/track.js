import { settings } from "../build/config";
import { log } from "../build/log";
import { auth, page, root } from "../build/page";
import { lang, trans_legacy, trans, tl } from "../build/trans";
import { bleh_about_artist } from "../components/about_artist";
import { correct_item_by_artist, patch_header_title } from "../components/lotus";
import { register_menu } from "../components/menu";
import { bleh_music_page_charts, show_your_scrobbles } from "../components/music";
import { checkup_page_structure } from "../components/structure";
import { register_background, update_page } from "../page";
import { ff } from "../sku";
import { bleh_tags_mini } from "./tag";
import { bleh_wiki, bleh_wiki_editor, bleh_wiki_history } from "./wiki";

export function bleh_tracks() {
    let track_header = document.body.querySelector('.header-new--track');

    if (track_header == undefined)
        return;

    if (track_header.hasAttribute('data-bwaa'))
        return;
    track_header.setAttribute('data-bwaa', 'true');

    patch_header_title();

    page.sister = track_header.querySelector('.header-new-crumb span').textContent;
    page.name = correct_item_by_artist(document.body.querySelector('[data-page-resource-name]').getAttribute('data-page-resource-name'), page.sister, "track_title");

    let is_subpage = track_header.classList.contains('header-new--subpage');


    // without pro theres two containers
    if (auth.pro) {
        // pro

        page.structure.container = document.body.querySelector('.page-content');
    } else {
        // not pro

        if (!is_subpage) {
            // normal, is there an ad then a container?
            page.structure.container = document.body.querySelector('.full-bleed-ad-container + .page-content:not(.visible-xs)');

            // death grips for some reason
            if (!page.structure.container)
                page.structure.container = document.body.querySelector('.page-content');
        } else {
            page.structure.container = document.body.querySelector('.page-content');
        }
    }
    page.structure.row = page.structure.container.querySelector('.row');
    try {
        if (!is_subpage) {
            page.structure.main = page.structure.row.querySelector('.col-main.buffer-standard');

            if (page.structure.main.classList[2])
                page.structure.main = page.structure.row.querySelector('.col-main.buffer-standard:not(:first-child)');
        } else {
            page.structure.main = page.structure.row.querySelector('.col-main');
        }
        page.structure.side = page.structure.row.querySelector('.col-sidebar:not(.track-overview-video-column)');
    } catch(e) {
        log('unable to find elements', 'page structure');
    }

    console.info('bleee', page.structure.row, page.structure.main);

    checkup_page_structure(is_subpage, track_header);

    if (ff('refreshed_music_nav')) {
        let artist_avatar = track_header.querySelector('.header-new-background-image');
        let title = track_header.querySelector('.header-new-title');
        let artist = track_header.querySelector('[itemprop="byArtist"]');
        let position = track_header.querySelector('.header-new-chart-position-number');

        let source_album = page.structure.main.querySelector('.source-album');
        let album_avatar;
        if (source_album != null)
            album_avatar = source_album.querySelector('.source-album-art img');

        let redesigned_track_header = document.createElement('section');
        redesigned_track_header.classList.add('redesigned-header', 'redesigned-track-header', 'no-background');
        redesigned_track_header.innerHTML = (`
            <div class="avatar-side">
                ${(album_avatar != null) ? (`
                <img src="${album_avatar.getAttribute('src').replace('300x300', 'avatar300s')}">
                <a class="bleh--avatar-clickable-link"></a>
                `)
                : (artist_avatar != null) ? (`
                <img src="${artist_avatar.getAttribute('content').replace('/ar0/', '/avatar170s/')}">
                <a class="bleh--avatar-clickable-link"></a>
                `) : '<img class="missing-track">'}
            </div>
            <div class="info-side">
                <div class="sub-text">${trans_legacy[lang].track.name}</div>
                <div class="title-container">
                    <h1>${title.innerHTML}</h1>
                    ${(position) ? position.outerHTML : ''}
                </div>
                <h2>${artist.innerHTML}</h2>
            </div>
        `);

        let bg;

        if (album_avatar && !album_avatar.getAttribute('src').endsWith('c6f59c1e5e7240a4c0d427abd71f3dbb.jpg'))
            bg = register_background(album_avatar.getAttribute('src').replace('/300x300/', '/ar0/'));
        else if (artist_avatar)
            bg = register_background(artist_avatar.getAttribute('content'));
        else
            bg = register_background(null);

        page.structure.container.insertBefore(redesigned_track_header, page.structure.container.firstElementChild);
        track_header.classList.add('legacy-header');


        let avatar_side = redesigned_track_header.querySelector('.avatar-side');
        let avatar_link = avatar_side.querySelector('a');

        let expand_link;
        if (album_avatar)
            expand_link = `_expand_avatar('${album_avatar.getAttribute('src').replace('300x300', 'ar0')}')`;
        else if (artist_avatar)
            expand_link = `_expand_avatar('${artist_avatar.getAttribute('content')}')`;

        if (settings.default_avatar_action == 'expand' && (album_avatar != null || artist_avatar != null))
            avatar_link.setAttribute('onclick', expand_link);
        else if (settings.default_avatar_action == 'gallery' && album_avatar != null)
            avatar_link.href = source_album.querySelector('.link-block-cover-link').getAttribute('href');

        let menu = tippy(avatar_side, {
            theme: 'context-menu',
            content: (`
                ${(album_avatar != null || artist_avatar != null) ? (`
                <button class="dropdown-menu-clickable-item" onclick="${expand_link}" data-menu-item="expand">
                    ${trans_legacy[lang].gallery.open.name}
                </button>
                `) : ''}
                ${(album_avatar != null) ? (`
                <a class="dropdown-menu-clickable-item" href="${source_album.querySelector('.link-block-cover-link').getAttribute('href')}" data-menu-item="album">
                    ${trans_legacy[lang].settings.layout.avatar_action.album}
                </a>
                `) : ''}
                <div class="sep"></div>
                <a class="dropdown-menu-clickable-item" href="${root}bleh?tab=customise" data-menu-item="settings">
                    ${trans_legacy[lang].settings.configure}
                </a>
            `),
            allowHTML: true,
            placement: 'right-start',
            trigger: 'manual',
            interactive: true,
            interactiveBorder: 10,
            offset: [0, 0],

            onShow(instance) {
                instance.popper.addEventListener('click', event => {
                    instance.hide();
                });
            }
        });

        register_menu(avatar_side, menu);
    }

    if (!is_subpage) {
        show_your_scrobbles();

        bleh_music_page_charts();

        bleh_about_artist();

        bleh_tags_mini();


        let similar_tracks = page.structure.main.querySelector('.track-similar-tracks');
        if (similar_tracks) {
            let similar_panel = similar_tracks.parentElement;
            similar_panel.classList.add('similar-panel');
        }
    } else {
        let btn_add = page.structure.side.querySelector('.add-button');
        if (btn_add != null)
            btn_add.setAttribute('data-page-subpage', page.subpage);

        if (page.subpage == 'wiki_overview')
            bleh_wiki();
        else if (page.subpage == 'wiki_history')
            bleh_wiki_history();
        else if (page.subpage == 'wiki_edit')
            bleh_wiki_editor();
    }

    log('status is', 'page', 'info', page);
    update_page();
}