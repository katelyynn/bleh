import { load_activities, subscribe_to_events } from "./activity";
import { settings } from "./build/config";
import { log } from "./build/log";
import { auth, auth_link, bleh_url, has_prompted_for_update, last_page_subpage, last_page_type, page, root, setup_url, shout_parse_queue, sponsor_url } from "./build/page";
import { stored_season } from "./build/seasonal";
import { lang, lookup_lang, non_override_lang, trans_legacy } from "./build/trans";
import { auto_edit_modal } from "./components/auto_edit";
import { dialog, load_dialogs } from "./components/dialog";
import { correct_generic_combo, correct_generic_combo_no_artist, lotus } from "./components/lotus";
import { music_grids } from "./components/music_grid";
import { nag_bar } from "./components/nag_bar";
import { load_notifications, notify } from "./components/notify";
import { patch_titles } from "./components/track";
import { load_settings } from "./config";
import { theme_version, version } from "./main";
import { append_nav, patch_masthead } from "./navigation";
import { bleh_albums } from "./pages/album";
import { bleh_artists } from "./pages/artist";
import { bleh_settings } from "./pages/bleh_config";
import { bleh_setup, notify_if_new_update } from "./pages/bleh_setup";
import { bleh_error } from "./pages/error";
import { bleh_events } from "./pages/event";
import { bleh_gallery, bleh_gallery_upload_check, patch_gallery_page } from "./pages/gallery";
import { bleh_glacier_library, bleh_glacier_library_bulk_edit } from "./pages/glacier";
import { bleh_home, bleh_home_legacy } from "./pages/home";
import { bleh_inbox } from "./pages/inbox";
import { load_moderation } from "./pages/moderation";
import { bleh_profiles } from "./pages/profile";
import { bleh_search } from "./pages/search";
import { bleh_tags } from "./pages/tag";
import { bleh_tracks } from "./pages/track";
import { patch_wiki } from "./pages/wiki";
import { start_rain } from "./rain";
import { seasonal_timer_end, set_season } from "./seasonal";
import { parse_shout_queue, patch_shouts } from "./shout";
import { ff } from "./sku";
import { bleh_sponsor_page, sponsors } from "./sponsor";
import { append_style } from "./style";

export function bleh() {
    let head_observer = new MutationObserver((mutations) => {
        if (document.head) {
            append_style();

            head_observer.disconnect();
        }
    });

    head_observer.observe(document.documentElement, {
        childList: true
    });

    let pre_observer = new MutationObserver((mutations) => {
        if (document.body && document.body.querySelector('.masthead-logo')) {
            bleh_main();

            pre_observer.disconnect();
        }
    });

    pre_observer.observe(document.documentElement, {
        childList: true
    });
}

function bleh_main() {
    let performance_start = performance.now();

    auth_link.state = document.querySelector('a.auth-link');
    if (auth_link.state)
        auth.name = auth_link.state.querySelector('img').getAttribute('alt');

    load_settings();

    // messaging
    load_dialogs();

    theme_version.state = getComputedStyle(document.body).getPropertyValue('--version-build').replaceAll("'", '').replaceAll('"', ''); // remove quotations

    lookup_lang();
    patch_masthead(document.body);


    load_notifications();

    // load seasonal data
    set_season();

    start_rain();

    // everything past this point requires authorisation
    if (!auth.name) {
        notify({
            title: 'No account added',
            body: 'Please sign in to an account to access bleh features.',
            icon: 'icon-16-user',
            persist: true
        });
        document.body.classList.add('bleh-loaded');
        return;
    }

    load_activities();
    notify_if_new_update();

    lotus();
    sponsors();

    append_nav();
    load_moderation();
    
    try {
        //throw new Error;
        main_flow();

        // last.fm is a single page application
        const observer = new MutationObserver((mutations) => {
            lookup_lang();
            patch_masthead(document.body);

            theme_version.state = getComputedStyle(document.body).getPropertyValue('--version-build').replaceAll("'", '').replaceAll('"', ''); // remove quotations
            if (theme_version.state != version.build && theme_version.state != '' && !has_prompted_for_update.state) {
                // script is either out of date, or more in date (not gonna happen)
                log(`version mismatch! running ${version.build}, downloaded theme ${theme_version.state}`, 'update');

                prompt_for_update();
                has_prompted_for_update.state = true;
            }

            main_flow();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        let performance_end = performance.now();
        log(`finished in ${performance_end - performance_start}`, 'load');
    } catch(e) {
        handle_error(e);
    }
}

function handle_error(e = null) {
    dialog({
        id: 'error',
        title: 'An error has occured',
        body: (`
            <div class="modal-vertical-inner error-inner">
                <div class="bleh-icon" style="--icon: var(--icon-error)"></div>
                <h1>oops.. something broke</h1>
                <p>An error has prevented bleh from loading correctly, please report this issue on Github.</p>
                <pre class="error-info">${(e) ? `<span class="error-type">${e.name}</span>: ${e.message}` : ''}<br>on: ${page.type}/${page.subpage}</pre>
                <p>Please include this error and the steps you took in the report!</p>
            </div>
            <div class="modal-footer">
                <a class="btn primary report-bug continue" href="https://github.com/katelyynn/bleh/issues/new/choose" target="_blank">
                    Report bug now
                </a>
            </div>
        `),
        type: 'error'
    });

    if (e != null) {
        log('fatal failure', 'load');
        console.error(e);
    }

    log('current page', 'page', 'info', page);
}

export function handle_error_500() {
    document.body.classList.add('bleh-loaded');
    log('halted as root is inaccessible', 'load');
}

function main_flow() {
    assign_page();

    if (page.type == 'artist' || page.type == 'album') {
        bleh_gallery();
        bleh_gallery_upload_check();
    }

    if (page.type == 'user' ||
        page.type == 'search' ||
        page.type == 'tag'
    )
        music_grids();

    if (page.type == 'user' ||
        page.type == 'artist' ||
        page.type == 'album' ||
        page.type == 'track' ||
        page.type == 'events' ||
        page.type == 'festival' ||
        page.type == 'tag'
    ) {
        patch_shouts();

        if (shout_parse_queue.length > 0)
            parse_shout_queue();
    }
    patch_gallery_page();

    if (page.type == 'user' && page.subpage.startsWith('library') && (
        page.subpage != 'library_overview' && !page.subpage.startsWith('library_artist_') &&
        !page.subpage.startsWith('library_album_') && !page.subpage.startsWith('library_track_')
    ))
        bleh_glacier_library();

    // bulk edit check
    if (auth.pro && page.type == 'user' && page.name == auth.name && page.subpage == 'library_artist_overview' ||
        page.subpage == 'library_album_overview' || page.subpage == 'library_track_overview'
    ) {
        bleh_glacier_library_bulk_edit();
    }

    if (page.type == 'user' ||
        page.type == 'artist' ||
        page.type == 'album' ||
        page.type == 'events' ||
        page.type == 'festival' ||
        page.type == 'tag' ||
        page.type == 'overview'
    ) {
        patch_titles();
    }

    if (page.type == 'user' ||
        page.type == 'artist' ||
        page.type == 'album' ||
        page.type == 'track'
    ) {
        nag_bar();
    }

    if (settings.corrections) {
        correct_generic_combo_no_artist('artist-header-featured-items-item');
        correct_generic_combo_no_artist('artist-top-albums-item');
        correct_generic_combo('source-album-details');
        correct_generic_combo('resource-list--release-list-item');
        correct_generic_combo('similar-albums-item');
        correct_generic_combo('track-similar-tracks-item');
        correct_generic_combo('similar-items-sidebar-item');
    }

    subscribe_to_events();
    auto_edit_modal();
}

function assign_page() {
    document.documentElement.classList.add('bleh-supports-loading');
    if (!page.structure.wrapper)
        page.structure.wrapper = document.body.querySelector('.main-content');

    let main_content = page.structure.wrapper.querySelector(':scope > :last-child:not([data-bleh])');
    if (main_content) {
        assign_page_type();
        load_page();
        main_content.setAttribute('data-bleh', 'true');
    } else {
        assign_page_subpage();
    }

    document.body.classList.add('bleh-loaded');
}

function assign_page_type() {
    let page_classes = document.body.classList;
    page_classes.forEach((page_class, index) => {
        if (page_class.startsWith('namespace')) {
            page.initial = page_class.replace('namespace--', '');
            let page_split = page.initial.split('_');

            page.type = page_split[0];
            if (page.type == 'music') {
                page.type = page_split[1];
            }

            if (page.type != last_page_type.state) {
                last_page_type.state = page.type;
                log(page.type, 'page');
            }

            console.log(page);

            assign_page_subpage();

            return;
        }

        if (index > 4)
            return;
    });
}

function assign_page_subpage() {
    page.subpage = page.initial.replace(page.type, '').replace('_', '').replace('music_', '');

    if (last_page_subpage.state != page.subpage) {
        last_page_subpage.state = page.subpage;
        log(`subpage of ${page.subpage}`, 'page');

        load_settings();

        if (page.state.settings_reload) {
            page.state.settings_reload = false;
        }

        if (page.structure.indicator)
            page_indicator();
    }
}

function load_page() {
    append_nav();
    set_season();
    seasonal_timer_end();

    let masthead = document.body.querySelector('.masthead');
    window.addEventListener('scroll', (e) => {
        let scroll = window.scrollY;

        if (scroll > 30)
            masthead.classList.add('scrolled');
        else
            masthead.classList.remove('scrolled');
    });

    if (window.location.href.startsWith(setup_url.replace('{root}', root))) {
        bleh_setup();
    } else if (window.location.href.startsWith(sponsor_url.replace('{root}', root))) {
        bleh_sponsor_page();
    } else if (window.location.href.startsWith(bleh_url.replace('{root}', root))) {
        bleh_home();
        bleh_settings();
    } else {
        bleh_error();

        if (page.state.error)
            return;

        if (page.type == 'user')
            bleh_profiles();
        else if (page.type == 'artist')
            bleh_artists();
        else if (page.type == 'album')
            bleh_albums();
        else if (page.type == 'track')
            bleh_tracks();
        else if (page.type == 'events' || page.type == 'festival')
            bleh_events();
        else if (page.type == 'tag')
            bleh_tags();
        else if (page.type == 'search')
            bleh_search();
        else if (page.type == 'inbox')
            bleh_inbox();
        else if (page.type == 'home')
            bleh_home_legacy();
        else if (page.type == 'overview' || page.type == 'recommended' || page.type == 'releases' || page.type == 'bookmarks' || page.type == 'charts' || page.type == 'settings')
            bleh_home();

        if (
            (page.type == 'artist' || page.type == 'album' || page.type == 'track') &&
            page.subpage == 'overview'
        )
            patch_wiki();
    }

    if (ff('page_title')) {
        //document.title = `${page.type}_${page.subpage} (${page.name}, ${page.sister}) - bleh ${version.build}.${version.sku}`;
        try {
            document.title = `${trans_legacy[lang].pages[page.type][page.subpage].replace('{name}', page.name).replace('{sister}', page.sister)} | ${version.brand} ${version.build}.${version.sku}`
        } catch(e) {
            log(`translation key for this page could not be found`, 'page', 'info', page);
        }
    }

    page_title();

    if (page.structure.indicator)
        page_indicator();
}

function page_title() {
    if (!ff('katsune'))
        return;

    if (!page.structure.container)
        return;

    let title = page.structure.container.querySelector('.page-title');
    if (!title) {
        title = document.createElement('section');
        title.classList.add('page-header');

        page.structure.container.insertBefore(title, page.structure.container.firstElementChild);
    }

    let name = page.type;

    if (trans_legacy[lang].hasOwnProperty(page.type))
        name = trans_legacy[lang][page.type].name;
    else if (page.type == 'user')
        name = trans_legacy[lang].profile.name;
    else if (page.type == 'bleh_settings')
        name = trans_legacy[lang].settings.name;
    else if (page.type == 'events' || page.type == 'festival')
        name = trans_legacy[lang].event.name;

    title.setAttribute('data-page-type', page.type);
    title.innerHTML = (`
        <div class="bleh-icon page-header-icon"></div>
        <div class="page-header-title">
            ${name}
        </div>
    `);
}

function page_indicator() {
    page.structure.indicator.innerHTML = (`
        <div class="bleh">
            <strong>version</strong>
            <span>${version.brand}</span>
            <span>${version.build}</span>
            <span>${version.sku}</span>
        </div>
        <div class="page">
            <strong>auth</strong>
            <span>${auth.name}</span>
            <span>${lang} (${non_override_lang})</span>
        </div>
        <div class="page">
            <strong>page</strong>
            <span>${page.type}</span>
            <span>${page.subpage}</span>
        </div>
        <div class="page">
            <strong></strong>
            <span>${page.name}</span>
            <span>${page.sister}</span>
        </div>
        <div class="page">
            <strong>season</strong>
            <span>${stored_season.id}</span>
            <span>${stored_season.year}</span>
            <span>${stored_season.offset}</span>
        </div>
    `);
}


export function update_page() {
    page.structure.container.setAttribute('data-page-type', page.type);
    page.structure.container.setAttribute('data-page-subpage', page.subpage);
}

export function register_background(url, origin = null) {
    let flag = ff('katsune');

    let background;
    if (flag) {
        background = page.structure.container.querySelector('.bleh-background');

        if (!background) {
            background = document.createElement('div');
            background.classList.add('bleh-background', 'katsune-bleh-background');

            let border = document.createElement('div');
            border.classList.add('katsune-bleh-background-border');
            background.appendChild(border);

            page.structure.container.insertBefore(background, page.structure.container.firstElementChild);
        }
    } else {
        background = document.body.querySelector('.bleh-background');

        if (!background) {
            background = document.createElement('div');
            background.classList.add('bleh-background');

            document.body.appendChild(background);
        }
    }

    if (page.type == 'user' && origin) {
        let buttons = background.querySelector('.bleh-background-buttons');

        if (!buttons) {
            buttons = document.createElement('div');
            buttons.classList.add('view-buttons', 'bleh-background-buttons');
        } else {
            buttons.innerHTML = '';
        }

        let origin_button = document.createElement('button');
        origin_button.classList.add('btn', 'view-item', 'origin-button');

        buttons.appendChild(origin_button);

        /*tippy(origin_button, {
            content: `origin: ${origin}`
        });*/

        if (origin == 'bio') {
            tippy(origin_button, {
                theme: 'badge',
                content: (`
                    <div class="badge-name">${trans_legacy[lang].profile.banner.origin.bio[0]}</div>
                    <div class="badge-reason">${trans_legacy[lang].profile.banner.origin.bio[1].replace('{b}', '<code>![banner](url)</code>')}</div>
                `),
                allowHTML: true,
                placement: 'bottom'
            });
        } else {
            tippy(origin_button, {
                content: trans_legacy[lang].profile.banner.origin[origin],
                placement: 'bottom'
            });
        }

        background.appendChild(buttons);
    }

    background.setAttribute('data-page-type', page.type);
    background.setAttribute('data-background-origin', origin);

    if (url)
        background.style.setProperty('background-image', `url(${url})`);
    else
        background.style.removeProperty('background-image');

    if (page.type == 'user') {
        if (page.name == auth.name) {
            background.setAttribute('data-page-user-is-self', 'true');
        } else {
            background.setAttribute('data-page-user-is-self', 'false');
        }
    }

    return background;
}