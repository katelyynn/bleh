import { load_activities } from "../activity"
import { settings } from "../build/config";
import { log } from "../build/log";
import { auth, page, recent_activity_list, root } from "../build/page";
import { lang, trans_legacy, trans, tl } from "../build/trans";
import { checkup_page_structure } from "../components/structure";
import { register_background, update_page } from "../page";
import { bleh_charts } from "./chart";
import { bleh_native_settings } from './lastfm_settings';
import { sponsor_list } from "../build/sponsor";
import { sanitise } from "../build/tools"

export function bleh_home() {
    page.structure.container = document.body.querySelector('.page-content');
    try {
        page.structure.row = page.structure.container.querySelector('.row');
        page.structure.main = page.structure.row.querySelector('.col-main');
        page.structure.side = page.structure.row.querySelector('.col-sidebar');
    } catch(e) {
        log('unable to find elements', 'page structure');
    }

    let content_top = document.body.querySelector('.content-top');

    checkup_page_structure(false, content_top);
    log('status is', 'page', 'info', page);
    update_page();

    register_background(auth.avatar.replace('/avatar42s/', '/ar0/'));


    let banner = document.createElement('div');
    banner.classList.add('top-banner', 'home-banner', 'colourful');

    let sponsoring = false;
    if (sponsor_list)
        sponsoring = sponsor_list.sponsors.includes(auth.name);

    banner.innerHTML = (`
        <a class="home-avatar" href="${root}user/${auth.name}">
            <img src="${auth.avatar.replace('/avatar42s/', '/avatar170s/')}">
        </a>
        ${(sponsoring) ? (`
        <div class="subtext sponsor-message colourful">
            <div class="bleh-icon-container"><div class="bleh-icon" style="--icon: var(--icon-16-heart-solid); --icon-size: 14px"></div></div>
            Thank you for sponsoring!
        </div>
        `) : ''}
        <h1>${trans_legacy[lang].home.welcome.replace('{m}', `<a class="mention" href="${root}user/${auth.name}">@${auth.name}</a>`)}</h1>
    `);

    page.structure.container.insertBefore(banner, page.structure.container.firstElementChild);

    let nav = document.createElement('nav');
    nav.classList.add('navlist', 'secondary-nav', 'navlist--more', 'redesigned-navigation');
    nav.innerHTML = (`
        <ul class="navlist-items">
            <li class="navlist-item secondary-nav-item secondary-nav-item--home">
                <a href="${root}music" class="secondary-nav-item-link ${(page.subpage == 'music') ? 'secondary-nav-item-link--active' : ''}">
                    ${tl(trans.home)}
                </a>
            </li>
            <li class="navlist-item secondary-nav-item secondary-nav-item--recommendations">
                <a href="${root}music/+recommended" class="secondary-nav-item-link ${(page.type == 'recommended') ? 'secondary-nav-item-link--active' : ''}">
                    ${tl(trans.recommendations)}
                </a>
            </li>
            <li class="navlist-item secondary-nav-item secondary-nav-item--releases">
                <a href="${root}music/+releases/out-now" class="secondary-nav-item-link ${(page.type == 'releases') ? 'secondary-nav-item-link--active' : ''}">
                    ${tl(trans.releases)}
                </a>
            </li>
            <li class="navlist-item secondary-nav-item secondary-nav-item--bookmarks">
                <a href="${root}music/+bookmarks" class="secondary-nav-item-link ${(page.type == 'bookmarks') ? 'secondary-nav-item-link--active' : ''}">
                    ${tl(trans.bookmarks)}
                </a>
            </li>
            <li class="navlist-item secondary-nav-item secondary-nav-item--charts">
                <a href="${root}charts" class="secondary-nav-item-link ${(page.type == 'charts') ? 'secondary-nav-item-link--active' : ''}">
                    ${tl(trans.charts)}
                </a>
            </li>
            <li class="fill"></li>
            <li class="navlist-item secondary-nav-item secondary-nav-item--settings">
                <a href="${root}settings" class="secondary-nav-item-link ${(page.type == 'settings') ? 'secondary-nav-item-link--active' : ''}">
                    ${tl(trans.settings)}
                </a>
            </li>
            <li class="navlist-item secondary-nav-item secondary-nav-item--bleh">
                <a href="${root}bleh" class="secondary-nav-item-link ${(page.type == 'error') ? 'secondary-nav-item-link--active' : ''}">
                    bleh
                </a>
            </li>
            <li class="navlist-item secondary-nav-item secondary-nav-item--more">
                <a class="secondary-nav-item-link no-text">
                    ${tl(trans.more)}
                </a>
            </li>
        </ul>
    `);

    page.structure.nav = nav;
    banner.after(nav);

    if (page.type == 'charts')
        bleh_charts();

    if (page.type == 'settings')
        bleh_native_settings();

    let menu_button = nav.querySelector('.secondary-nav-item--more a');
    tippy(menu_button, {
        theme: "menu",
        content: (`
            <button class="dropdown-menu-clickable-item update" onclick="_force_refresh_theme()">
                ${trans_legacy[lang].settings.home.update.update_now}
            </button>
            ${(settings.dev ? (`
            <a class="dropdown-menu-clickable-item update" href="https://github.com/katelyynn/bleh/raw/uwu/fm/bleh.user.css">
                ${trans_legacy[lang].settings.home.update.css}
            </a>
            `) : '')}
            <button class="dropdown-menu-clickable-item sponsor" onclick="_sponsor()">
                ${trans_legacy[lang].settings.home.sponsor.name}<div class="new-badge">${trans_legacy[lang].settings.new}</div>
            </button>
            <a class="dropdown-menu-clickable-item issues" href="https://github.com/katelyynn/bleh/issues" target="_blank">
                ${trans_legacy[lang].settings.home.issues.name}
            </a>
        `),
        allowHTML: true,
        placement: "bottom",
        interactive: true,
        interactiveBorder: 10,
        trigger: "click"
    });


    if (page.subpage == 'music') {
        // top panel
        let beret = document.createElement('section');
        beret.classList.add('beret-music', 'bleh--panel');

        beret.innerHTML = (`
            <div class="panel-side panel-side-main">
                <h4>Recent listening</h4>
                <div class="recent-listening-container">
                    <div class="loading-data-container">
                        <p class="loading-data-text">Finding your tracks</p>
                    </div>
                </div>
            </div>
            <div class="panel-side panel-side-alt">
                <h4>Recent activities</h4>
            </div>
        `);

        let track_list = beret.querySelector('.recent-listening-container');

        fetch(`${root}user/${auth.name}/partial/recenttracks?ajax=1`)
        .then(function(response) {
            console.log('returned', response, response.text);

            return response.text();
        })
        .then(function(html) {
            let doc = new DOMParser().parseFromString(html, 'text/html');
            console.log('DOC', doc);

            let tracklist_panel = doc.querySelector('.chartlist');

            if (tracklist_panel)
                track_list.outerHTML = tracklist_panel.outerHTML;
        });

        let activity_list = beret.querySelector('.panel-side-alt');

        load_activities();

        // we want to show in date order from latest to oldest down
        // but .reverse() is destructive, so we copy first
        let recent_activity_list_r = recent_activity_list;
        recent_activity_list_r.reverse();

        recent_activity_list_r.forEach((activity) => {
            // type: string,
            // involved: [{name: string, type: user | artist | album | track}, sister?: string],
            // context: string,
            // date: string

            let activity_item = document.createElement('a');
            activity_item.classList.add('activity-item', `activity--${activity.type}`);
            activity_item.setAttribute('href', activity.context);

            let involved_text = '';

            let tooltip_name;
            let tooltip_sister;

            activity.involved.forEach((involved) => {
                let involved_link;

                if (involved.type == 'user')
                    involved_link = `${root}user/${involved.name}`;
                else if (involved.type == 'artist')
                    involved_link = `${root}music/${sanitise(involved.name)}`;
                else if (involved.type == 'album')
                    involved_link = `${root}music/${sanitise(involved.sister)}/${sanitise(involved.name)}`;
                else if (involved.type == 'track')
                    involved_link = `${root}music/${sanitise(involved.sister)}/_/${sanitise(involved.name)}`;
                else if (involved.type == 'tag')
                    involved_link = `${root}tag/${sanitise(involved.name)}`;
                else if (involved.type == 'bwaa')
                    involved_link = `${root}bwaa`;
                else if (involved.type == 'bleh')
                    involved_link = `${root}bleh`;

                // tooltip
                if (involved.type != 'artist' && involved.type != 'user' && involved.type != 'tag' && involved.type != 'bwaa' && involved.type != 'bleh') {
                    tooltip_name = involved.name;
                    tooltip_sister = involved.sister;
                }

                if (involved_text != '')
                    involved_text = `${involved_text}, <a class="involved--${involved.type}" href="${involved_link}">${involved.name}</a>`;
                else
                    involved_text = `${involved_text}<a class="involved--${involved.type}" href="${involved_link}">${involved.name}</a>`;
            });

            activity_item.innerHTML = (`
                <div class="type">${trans_legacy[lang].activities[activity.type]}<div class="date">${moment(activity.date).fromNow(true)}</div></div>
                <div class="title">${involved_text}</div>
            `);

            activity_list.appendChild(activity_item);

            if (tooltip_name != undefined)
                tippy(activity_item.querySelector('.title a'), {
                    content: `${tooltip_sister} - ${tooltip_name}`
                });
        });

        page.structure.main.appendChild(beret);


        let music_sections = document.body.querySelectorAll('.music-section');
        music_sections.forEach((music_section) => {
            page.structure.main.appendChild(music_section);
        });

        let items = page.structure.main.querySelectorAll('.music-featured-item');
        items.forEach((item) => {
            let bg = item.querySelector('.music-featured-item-background');

            if (!bg) return;

            let style = bg.style.getPropertyValue('background-image');
            let cover_substr = style.indexOf('url');
            let cover = style.substring(cover_substr);

            bg.style.setProperty('background', cover);
        });
    }
}

export function bleh_home_legacy() {
    window.location.href = `${root}music`;
}