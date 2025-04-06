import { patch_avatar } from "../avatar";
import { settings } from "../build/config";
import { log } from "../build/log";
import { auth, page, root } from "../build/page";
import { clean_number, return_artist_from_track } from "../build/tools";
import { lang, trans_legacy, trans, tl } from "../build/trans";
import { prep_chart_colours } from "../chart";
import { refresh_all } from "../config";
import { create_divider } from "../pages/gallery";
import { ff } from "../sku";
import { parse_scrobbles_as_rank } from "./colourful_counts";
import { correct_item_by_artist } from "./lotus";
import { register_menu } from "./menu";
import { other_listener } from "./profile_shortcut";

unsafeWindow._other_listener = function(id) {
    other_listener(id);
}

export function show_your_scrobbles() {
    let katsune = ff('katsune');
    show_numbers_on_side(page.type);

    let col_main = page.structure.container.querySelector('.top-overview-panel');
    if (col_main == null)
        col_main = document.body.querySelector('.col-main');


    if (page.type == 'track') {
        let new_panel = document.createElement('section');
        new_panel.classList.add('track-info-panel');
        new_panel.innerHTML = col_main.innerHTML;

        page.structure.main.insertBefore(new_panel, page.structure.main.firstElementChild);

        col_main.style.setProperty('display', 'none');

        console.info(col_main, new_panel);

        // now redirect later code
        col_main = new_panel;
    }


    // create container
    let top_container = document.createElement('div');
    top_container.classList.add('top-container');
    if (katsune)
        top_container.classList.add('katsune-button-row');

    let listen_container = document.createElement('div');
    if (!katsune)
        listen_container.classList.add('listen-container', 'view-buttons');


    // page url
    let page_url = window.location.href;
    let page_url_split = page_url.split('/');
    let page_url_length = (page_url_split.length - 1);

    // artist
    let scrobble_page = page_url_split[page_url_length];
    if (page.type == 'album') {
        scrobble_page = page_url_split[page_url_length - 1] + '/' + page_url_split[page_url_length];
    } else if (page.type == 'track') {
        scrobble_page = page_url_split[page_url_length - 2] + '/_/' + page_url_split[page_url_length];
    }


    // you
    let your_listens = {
        name: auth.name,
        listens: 0,
        link: scrobble_page,
        avi: auth.avatar,
        katsune: katsune
    };
    // check to see if you have scrobbles
    let scrobble_button = col_main.querySelector('.personal-stats-item--scrobbles .hidden-xs a');
    if (scrobble_button != null) {
        your_listens.listens = clean_number(scrobble_button.textContent.trim());
    }
    // create child for u
    create_listen_item(listen_container, your_listens, page.type);


    // profile shortcut :3
    if (settings.profile_shortcut != '') {
        let shortcut_listens = {
            name: settings.profile_shortcut,
            listens: -1,
            link: scrobble_page,
            avi: localStorage.getItem('bleh_profile_shortcut_avi'),
            katsune: katsune
        }
        // create child for them
        create_listen_item(listen_container, shortcut_listens);

        fetch(`${root}user/${shortcut_listens.name}/library/music/${scrobble_page}`)
        .then(function(response) {
            console.log('returned', response, response.text);

            return response.text();
        })
        .then(function(html) {
            let doc = new DOMParser().parseFromString(html, 'text/html');
            console.log('DOC', doc);

            let first_metadata_item = doc.querySelector('.metadata-item .metadata-display');

            let listens = 0;

            let listen_item = document.getElementById(`listen-item--${shortcut_listens.name}`);

            // sometimes this fails even thou they do have plays, this is just a last.fm bug
            // i dont feel comfortable displaying 0 here as it may not be true
            // but i guess i should?
            if (first_metadata_item != null)
                listens = clean_number(first_metadata_item.textContent.trim());

            listen_item.setAttribute('data-listens', listens);

            listen_item.innerHTML = (`
                <img class="view-item-avatar" src="${shortcut_listens.avi}" alt="${shortcut_listens.name}">${trans_legacy[lang].music.listens.count_listens.replace('{c}', listens.toLocaleString(lang))}
            `);

            // colourful counts
            if (settings.colourful_counts && page.type == 'artist') {
                let parsed_scrobble_as_rank = parse_scrobbles_as_rank(listens);

                listen_item.setAttribute('data-bleh--scrobble-milestone',parsed_scrobble_as_rank.milestone);
                listen_item.style.setProperty('--hue-over',parsed_scrobble_as_rank.hue);
                listen_item.style.setProperty('--sat-over',parsed_scrobble_as_rank.sat);
                listen_item.style.setProperty('--lit-over',parsed_scrobble_as_rank.lit);
            }
        });
    }


    // other user
    create_listen_item(listen_container, {
        name: 'other',
        listens: -3,
        link: scrobble_page,
        button: true,
        katsune: katsune
    }, page.type);


    // append
    top_container.appendChild(listen_container);
    if (!katsune)
        col_main.insertBefore(top_container, col_main.firstElementChild);
    else
        page.structure.container.querySelector('.bleh-background').after(top_container);


    // other listeners
    if (page.type == 'artist') {
        //
        let other_container = col_main.querySelector('.personal-stats-item--listeners');
        if (other_container != null) {
            let listen_divider = document.createElement('div');
            listen_divider.classList.add('listen-divider');

            listen_container.appendChild(listen_divider);

            let avatars = other_container.querySelectorAll('.personal-stats-listener-avatar img');
            let count = other_container.querySelector('.header-metadata-display a');

            let other_listeners = {
                name: 'others',
                listens: -2,
                link: scrobble_page,
                avi: avatars,
                count: (count != null) ? clean_number(count.textContent.trim()) : 5,
                katsune: katsune
            }
            // create child for them
            create_listen_item(listen_container, other_listeners, page.type);
        }
    }


    // interactables on the right
    let interact_container = document.createElement('div');
    if (!katsune)
        interact_container.classList.add('interact-container', 'view-buttons');


    let text = document.body.querySelector('.header-new-title').textContent
    .replaceAll(' ', '+')
    .replaceAll('&', '%26');

    let artist = document.body.querySelector('.header-new-crumb');
    if (artist != undefined)
        text = `${text}+${artist.textContent
        .replaceAll(' ', '+')
        .replaceAll('&', '%26')}`;


    // temp probably
    let header_actions = document.body.querySelector('.header-new-actions');

    interact_container.innerHTML = header_actions.innerHTML;


    let buttons = interact_container.querySelectorAll('button');
    buttons.forEach((button) => {
        if (button.classList[0] != 'header-new-playlink')
            button.classList.add('btn', 'view-item', 'interact-item', (katsune) ? 'icon' : '');
        else
            button.classList.add('dropdown-menu-clickable-item');

        if (button.classList[0] == 'header-new-more-button')
            interact_container.removeChild(button.parentElement);
    });
    let links = interact_container.querySelectorAll('a');
    links.forEach((button) => {
        if (button.classList[0] != 'header-new-playlink')
            button.classList.add('btn', 'view-item', 'interact-item');
        else
            button.classList.add('dropdown-menu-clickable-item');
    });


    // bookmark
    let bookmark_btn = interact_container.querySelector('[data-toggle-button-current-state*="bookmark"]');
    bookmark_btn.after(create_divider());


    // obsession
    let obsession_form = header_actions.querySelector('form[action$="obsessions"]');
    if (obsession_form != null) {
        let obsession_btn = obsession_form.querySelector('button');
        obsession_btn.classList = 'btn view-item interact-item obsession-btn';

        tippy(obsession_btn, {
            content: obsession_btn.textContent
        });
        obsession_btn.textContent = trans_legacy[lang].music.obsession;

        interact_container.appendChild(obsession_form);
    }


    // artist btn
    if (katsune && page.type == 'artist') {
        let artist_btn = document.createElement('a');
        artist_btn.classList.add('btn', 'view-item', 'interact-item', 'artist-btn', 'icon');

        if (settings.quick_artist_button == 'gallery') {
            artist_btn.setAttribute('data-artist-btn-type', 'gallery');
            artist_btn.setAttribute('href', `${window.location.href}/+images`);
            artist_btn.textContent = trans_legacy[lang].gallery.view;
        } else if (settings.quick_artist_button == 'shouts') {
            artist_btn.setAttribute('data-artist-btn-type', 'shouts');
            artist_btn.setAttribute('href', `${window.location.href}/+shoutbox`);
            artist_btn.textContent = trans_legacy[lang].settings.layout.quick_artist_button.shouts;
        } else if (settings.quick_artist_button == 'wiki') {
            artist_btn.setAttribute('data-artist-btn-type', 'wiki');
            artist_btn.setAttribute('href', `${window.location.href}/+wiki`);
            artist_btn.textContent = trans_legacy[lang].settings.layout.quick_artist_button.wiki;
        } else if (settings.quick_artist_button == 'listens') {
            artist_btn.setAttribute('data-artist-btn-type', 'gallery');
            artist_btn.setAttribute('href', `${window.location.href}/+listeners/you-know`);
            artist_btn.textContent = trans_legacy[lang].settings.layout.quick_artist_button.listens;
        }

        interact_container.appendChild(artist_btn);

        let view_menu = tippy(artist_btn, {
            theme: 'context-menu',
            content: (`
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

        register_menu(artist_btn, view_menu);
    }


    // search similar!
    let search_btn = document.createElement('a');
    search_btn.classList.add('btn', 'view-item', 'interact-item', 'search-similar-btn', (katsune) ? 'icon' : '');
    search_btn.textContent = trans_legacy[lang].music.search_variations.name;
    search_btn.href = `${root}search/${page.type}s?q=${text}`;
    search_btn.target = '_blank';

    tippy(search_btn, {
        content: trans_legacy[lang].music.search_variations.tooltip
    });

    interact_container.appendChild(search_btn);


    // search lyrics
    let search_lyrics = null;
    if (page.type == 'track') {
        search_lyrics = document.createElement('a');
        search_lyrics.classList.add('dropdown-menu-clickable-item', 'search-genius-btn');
        search_lyrics.textContent = trans_legacy[lang].music.search_genius;
        search_lyrics.href = `https://genius.com/search?q=${text}`;
        search_lyrics.target = '_blank';
    }


    // lotus
    let lotus_btn = null;
    if (settings.corrections) {
        lotus_btn = document.createElement('a');
        /*lotus_btn.classList.add('btn', 'view-item', 'interact-item', 'lotus', 'lotus-btn');*/
        lotus_btn.classList.add('dropdown-menu-clickable-item', 'lotus', 'lotus-btn');
        lotus_btn.textContent = trans_legacy[lang].lotus.correct.name;
        lotus_btn.href = 'https://github.com/katelyynn/lotus/issues/new/choose';
        lotus_btn.target = '_blank';

        if (page.corrected)
            lotus_btn.classList.add('active');

        /*if (page.corrected)
            tippy(lotus_btn, {
                content: (`<span class="lotus-active">${trans_legacy[lang].lotus.correct.tooltip_active}</span><br><div class="tooltip-sub">${document.body.querySelector('.main-content > [itemscope]').getAttribute('data-page-resource-name')}</div>`),
                allowHTML: true
            });
        else
            tippy(lotus_btn, {
                content: (`${trans_legacy[lang].lotus.correct.tooltip}<br><div class="tooltip-sub">${document.body.querySelector('.main-content > [itemscope]').getAttribute('data-page-resource-name')}</div>`),
                allowHTML: true
            });

        interact_container.appendChild(lotus_btn);*/
    }


    // ...
    let menu_btn = document.createElement('button');
    menu_btn.classList.add('btn', 'view-item', 'interact-item', 'menu-btn', (katsune) ? 'icon' : '');
    menu_btn.textContent = trans_legacy[lang].music.menu;

    let play_btn = interact_container.querySelector('.header-new-playlink');

    let music_menu = tippy(menu_btn, {
        theme: 'select-menu',
        content: (`
            ${(search_lyrics != null) ? search_lyrics.outerHTML : ''}
            ${(lotus_btn != null) ? lotus_btn.outerHTML : ''}
            ${(play_btn != null) ? play_btn.outerHTML : ''}
        `),
        allowHTML: true,
        placement: 'bottom',
        interactive: true,
        interactiveBorder: 10,
        trigger: 'click',

        onShow(instance) {
            /*let lotus_item = instance.popper.querySelector('.lotus-btn:not([aria-describedby])');

            if (page.corrected)
                tippy(lotus_item, {
                    theme: 'lotus-tooltip-corrected',
                    content: (`<span class="lotus-active">${trans_legacy[lang].lotus.correct.tooltip_active}</span><br><div class="tooltip-sub">${document.body.querySelector('.main-content > [itemscope]').getAttribute('data-page-resource-name')}</div>`),
                    allowHTML: true,
                    placement: 'right'
                });
            else
                tippy(lotus_item, {
                    theme: 'lotus-tooltip',
                    content: (`${trans_legacy[lang].lotus.correct.tooltip}<br><div class="tooltip-sub">${document.body.querySelector('.main-content > [itemscope]').getAttribute('data-page-resource-name')}</div>`),
                    allowHTML: true,
                    placement: 'right'
                });*/
        }
    });

    if (play_btn != null)
        interact_container.removeChild(play_btn);

    interact_container.appendChild(menu_btn);


    top_container.appendChild(interact_container);
}

function create_listen_item(parent, {name, listens, link, avi, count=0, button=false, katsune=false}, header_type) {
    log(`creating listen item of ${name}, ${count}, ${listens}`, 'artist', 'info', {avi: avi, link: link});

    let listen_item = document.createElement((!button) ? 'a' : 'button');
    listen_item.classList.add('btn', 'listen-item', 'view-item');
    listen_item.setAttribute('href', `${root}user/${name}/library/music/${link}`);
    //listen_item.setAttribute('target', '_blank');
    listen_item.setAttribute('data-listens', listens);
    listen_item.setAttribute('id', `listen-item--${name}`);

    if (listens > -1) {
        // 0 listens
        listen_item.innerHTML = (`
            <img class="view-item-avatar" src="${avi}" alt="${name}">${trans_legacy[lang].music.listens.count_listens.replace('{c}', listens.toLocaleString(lang))}
        `);

        let menu = tippy(listen_item, {
            theme: 'context-menu',
            content: (`
                <a class="dropdown-menu-clickable-item" href="${root}user/${name}" data-menu-item="view_profile">
                    ${trans_legacy[lang].music.view_profile}
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

        register_menu(listen_item, menu);
    } else if (listens > -2) {
        // loading listens
        listen_item.innerHTML = (`
            <img class="view-item-avatar" src="${avi}" alt="${name}">${trans_legacy[lang].music.listens.loading_listens}
        `);

        let menu = tippy(listen_item, {
            theme: 'context-menu',
            content: (`
                <a class="dropdown-menu-clickable-item" href="${root}user/${name}" data-menu-item="view_profile">
                    ${trans_legacy[lang].music.view_profile}
                </a>
                <div class="sep"></div>
                <button class="dropdown-menu-clickable-item" onclick="_open_profile_shortcut_window()" data-menu-item="settings">
                    ${trans_legacy[lang].settings.configure}
                </button>
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

        register_menu(listen_item, menu);
    } else if (listens == -3) {
        listen_item.classList.add('listen-item-other');

        listen_item.removeAttribute('href');
        listen_item.setAttribute('onclick', `_other_listener('${link}')`);

        tippy(listen_item, {
            content: trans_legacy[lang].music.listens.custom.tooltip
        });
    } else {
        // other listeners by clicking this link (artist)
        listen_item.innerHTML = (`
            ${(avi[0] != null) ? `<img class="view-item-avatar" src="${avi[0].getAttribute('src')}">` : ''}
            ${(avi[1] != null) ? `<img class="view-item-avatar" src="${avi[1].getAttribute('src')}">` : ''}
            ${(avi[2] != null) ? `<img class="view-item-avatar" src="${avi[2].getAttribute('src')}">` : ''}
            ${trans_legacy[lang].music.listens.other_listeners.replace('{c}', count)}
        `);
        listen_item.setAttribute('href', `${window.location.href}/+listeners/you-know`);
    }

    // colourful counts
    if (settings.colourful_counts && listens > -1 && header_type == 'artist') {
        let parsed_scrobble_as_rank = parse_scrobbles_as_rank(listens);

        listen_item.setAttribute('data-bleh--scrobble-milestone',parsed_scrobble_as_rank.milestone);
        listen_item.style.setProperty('--hue-user',parsed_scrobble_as_rank.hue);
        listen_item.style.setProperty('--sat-user',parsed_scrobble_as_rank.sat);
        listen_item.style.setProperty('--lit-user',parsed_scrobble_as_rank.lit);
    }

    if (katsune) {
        listen_item.classList.add('icon');
    }

    parent.appendChild(listen_item);

    // ensure proper listeners element
    if (listens < -1)
        return;

    tippy(listen_item, {
        content: name
    });
}


function show_numbers_on_side(header_type) {
    let metadata = document.body.querySelectorAll('.header-metadata-tnew-item');

    let listeners = {};
    let scrobbles = {};
    let metascore = {};

    metadata.forEach((item, index) => {
        let text = item.querySelector('.header-metadata-tnew-title').textContent.trim();
        let value = item.querySelector('.header-metadata-tnew-display abbr');

        if (index == 0) {
            listeners.text = text;
            listeners.value = clean_number(value.getAttribute('title'));
            listeners.abbr = value.textContent.trim();
        } else if (index == 1) {
            scrobbles.text = text;
            scrobbles.value = clean_number(value.getAttribute('title'));
            scrobbles.abbr = value.textContent.trim();
        } else if (index == 2) {
            let link = item.querySelector('a');
            if (link == null)
                return;

            metascore.text = text;
            metascore.abbr = value.textContent.trim();
            metascore.link = link.getAttribute('href');
        }
    });


    // get panel
    let panel = page.structure.side.querySelector('section.section-with-separator:has(.listener-trend)');

    if (panel == null) {
        panel = document.createElement('section');
        panel.classList.add('section-with-separator');

        page.structure.side.insertBefore(panel, page.structure.side.firstElementChild);
    }

    panel.classList.add('listen-panel');


    let row = document.createElement('div');
    row.classList.add('listener-row');
    row.innerHTML = (`
        <div class="listener-side" id="listeners">
            <h3>${listeners.text}</h3>
            <p>${listeners.abbr}</p>
        </div>
        <div class="scrobble-side" id="scrobbles">
            <h3>${scrobbles.text}</h3>
            <p>${scrobbles.abbr}</p>
        </div>
        ${(metascore.text != undefined) ? (`
        <div class="metascore-side">
            <h3>${metascore.text}</h3>
            <p><a href="${metascore.link}" target="_blank">${metascore.abbr}</a></p>
        </div>
        `) : ''}
    `);

    panel.insertBefore(row, panel.firstElementChild);

    tippy(document.getElementById('listeners'), {
        content: listeners.value.toLocaleString(lang)
    });
    tippy(document.getElementById('scrobbles'), {
        content: scrobbles.value.toLocaleString(lang)
    });


    // is there album artwork?
    if (page.type == 'album') {
        let album_artwork = document.body.querySelector('.artwork-and-metadata-row');

        if (album_artwork)
            page.structure.side.insertBefore(album_artwork, page.structure.side.firstElementChild);
    }

    if (page.type == 'album' || page.type == 'artist') {
        let upper = document.body.querySelector('.col-main');
        upper.classList.add('upper-overview-to-hide');

        let new_upper = document.createElement('section');
        new_upper.classList.add('top-overview-panel');
        new_upper.setAttribute('data-page-type', page.type);
        new_upper.innerHTML = upper.innerHTML;

        page.structure.main.insertBefore(new_upper, page.structure.main.firstElementChild);
    }


    // is there a video?
    if (page.type == 'track') {
        let video_col = document.body.querySelector('.track-overview-video-column.col-sidebar');
        video_col.classList.remove('col-sidebar');
        page.structure.side.insertBefore(video_col, page.structure.side.firstElementChild);

        let video = video_col.querySelector('.video-preview');

        if (video) {
            video_col.classList.remove('col-sidebar');
            page.structure.side.insertBefore(video_col, page.structure.side.firstElementChild);

            let container = document.createElement('div');
            container.classList.add('video-overlay-container');

            let view_buttons = document.createElement('div');
            view_buttons.classList.add('view-buttons');

            let playlink = video.querySelector('.video-preview-playlink a');
            let replace = video_col.querySelector('.video-preview-replace a');

            playlink.classList = 'btn view-item video-item video-item--play';
            replace.classList = 'btn view-item video-item video-item--edit';

            view_buttons.appendChild(playlink);
            view_buttons.appendChild(replace);

            container.appendChild(view_buttons);
            video.appendChild(container);

            tippy(playlink, {
                content: playlink.getAttribute('title')
            });
            playlink.removeAttribute('title');
            tippy(replace, {
                content: replace.textContent
            });
        } else {
            let cta = video_col.querySelector('.video-preview-upload-cta');

            if (cta)
                return;

            page.structure.side.removeChild(video_col);

            let video_placeholder = document.createElement('section');
            video_placeholder.classList.add('video-placeholder');
            video_placeholder.innerHTML = (`
                <div class="bleh-icon" style="--icon: var(--icon-16-video-broken)"></div>
                Video removed by Last.fm
            `);

            page.structure.side.insertBefore(video_placeholder, page.structure.side.firstElementChild);


            let links = page.structure.side.querySelector('.external-links-section .play-this-track-playlinks');
            if (links)
                links.classList.add('video-unavailable');
        }
    }
}

export function bleh_music_page_charts() {
    if (!ff('music_page_charts'))
        return;

    log('beginning replacement', 'music charts');

    let panel = document.body.querySelector('.listen-panel'); // page.structure.side fails without pro
    let trend = panel.querySelector('.listener-trend');

    if (trend == null)
        return;

    prep_chart_colours();

    // is this a chart reflow due to style loading?
    let previous_chart = panel.querySelector('.scrobble-canvas-container');
    if (previous_chart != null)
        panel.removeChild(previous_chart);

    let table = trend.querySelector('tbody');
    let days = table.querySelectorAll('tr');

    let labels = [];
    let values = [];

    let has_seen_more_than_0 = false;
    days.forEach((day, index) => {
        if (!day)
            null;

        //let label = day.querySelector('time').textContent.trim();
        let label = moment(day.querySelector('time').getAttribute('datetime'));
        let value = day.querySelector('.js-value');

        console.log('day', index, label, day, day.innerHTML);

        if (!value.getAttribute('data-value'))
            value = 0;
        else
            value = value.getAttribute('data-value');

        if (value == '0' && index < 120 && !has_seen_more_than_0)
            return;
        has_seen_more_than_0 = true;

        labels.push(label);
        values.push(value);
    });

    prep_chart_colours();

    let scrobble_canvas_container = document.createElement('div');
    scrobble_canvas_container.classList.add('scrobble-canvas-container');

    let scrobble_canvas = document.createElement('canvas');
    scrobble_canvas.classList.add('scrobble-canvas');

    let gradient = scrobble_canvas.getContext('2d').createLinearGradient(0, 0, 0, 160);
    try {
        gradient.addColorStop(0, page.state.chart_colours.link_bg_col);
        gradient.addColorStop(1, page.state.chart_colours.link_bg_col_2);
    } catch(e) {
        gradient = page.state.chart_colours.link_bg_col;
    }

    Chart.defaults.color = page.state.chart_colours.text_col;
    Chart.defaults.font.family = 'Ubuntu Sans';
    let scrobble_chart = new Chart(scrobble_canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                borderWidth: 2,
                backgroundColor: gradient,
                borderColor: page.state.chart_colours.link_col,
                fill: true,
                pointRadius: 0,
                pointHitRadius: 20,
                tension: 0.1
            }]
        },
        options: page.state.chart_line_options
    });

    scrobble_canvas_container.appendChild(scrobble_canvas);
    panel.appendChild(scrobble_canvas_container);

    trend.style.setProperty('display', 'none');

    log('finished', 'music charts');
}

export function bleh_top_listeners() {
    if (!ff('unify_top_listeners'))
        return;

    let panel = page.structure.main.querySelector(':scope > .buffer-standard');

    // view-related buttons
    let view_buttons = document.createElement('div');
    view_buttons.classList.add('view-buttons-wrapper');
    view_buttons.innerHTML = (`
        <div class="view-buttons">
            <button class="btn view-item" id="toggle-list_view-1" data-toggle="list_view" data-toggle-value="1" onclick="_update_item('list_view', 1)">
                ${trans_legacy[lang].glacier.view.grid}
            </button>
            <button class="btn view-item" id="toggle-list_view-0" data-toggle="list_view" data-toggle-value="0" onclick="_update_item('list_view', 0)">
                ${trans_legacy[lang].glacier.view.list}
            </button>
        </div>
    `);
    panel.insertBefore(view_buttons, panel.firstElementChild);

    refresh_all();

    let legacy_top_listeners_container = panel.querySelector('.top-listeners');
    let legacy_top_listeners = legacy_top_listeners_container.querySelectorAll('.top-listeners-item');

    let new_container = document.createElement('ul');
    new_container.classList.add('user-list', 'top-listeners-list');

    legacy_top_listeners.forEach((listener, index) => {
        let new_listener = document.createElement('li');
        new_listener.classList.add('user-list-item', 'listener-list-item');

        let position = index + 1;
        if (page.requested.page != null && page.requested.page != "1") {
            position += ((parseInt(page.requested.page) - 1) * 30);
        }

        let name_wrap = listener.querySelector('.top-listeners-item-name a');
        let name = name_wrap.textContent;
        let track_wrap = listener.querySelector('.top-listeners-track');

        let avatar = listener.querySelector('.top-listeners-item-image');

        let follow = listener.querySelector('.class');

        new_listener.innerHTML = (`
            <div class="user-list-inner-wrap">
                <span class="listener-list-position">
                    ${position}
                </span>
                <h4 class="user-list-name">
                    <a class="user-list-link link-block-target" href="${name_wrap.getAttribute('href')}">
                        ${name}
                    </a>
                </h4>
                <span class="avatar user-list-avatar">
                    ${avatar.innerHTML}
                </span>
                ${(follow) ? follow.outerHTML : ''}
                <div class="user-list-description">
                    <p class="user-list-about-me">
                        ${track_wrap.innerHTML}
                    </p>
                </div>
            </div>
        `);

        patch_avatar(new_listener.querySelector('.user-list-avatar'), name, 'listener');

        let track_link = new_listener.querySelector('.user-list-about-me a');
        let artist = return_artist_from_track(track_link.getAttribute('href'), false);
        let track = correct_item_by_artist(track_link.textContent.trim(), artist, 'track');
        track_link.textContent = track;

        new_container.appendChild(new_listener);
    });

    view_buttons.after(new_container);
    panel.removeChild(legacy_top_listeners_container);
}