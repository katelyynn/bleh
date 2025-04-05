import { load_activities } from "../activity"
import { patch_avatar } from "../avatar"
import { settings } from "../build/config"
import { log } from "../build/log"
import { auth, page, recent_activity_list, root } from "../build/page"
import { cute, sponsor_list } from "../build/sponsor"
import { clean_number, sanitise } from "../build/tools"
import { lang, trans_legacy, trans, tl } from "../build/trans"
import { load_badges } from "../components/badge"
import { dialog } from "../components/dialog"
import { correct_artist, correct_item_by_artist } from "../components/lotus"
import { markdown } from "../components/markdown"
import { deliver_notif, notify } from "../components/notify"
import { create_profile_top_item, redesign_profile_header } from "../components/profile_header"
import { custom_select, update_inbuilt_select } from "../components/select"
import { checkup_page_structure } from "../components/structure"
import { refresh_all, update_inbuilt_item } from "../config"
import { register_background, update_page } from "../page"
import { ff } from "../sku"
import { bleh_user_library } from "./glacier"
import { use_pronouns } from "./lastfm_settings"
import { patch_obsession_view } from "./obsession"

export function bleh_profiles() {
    // the obsessions page is a user subpage but works very differently
    if (page.subpage == 'obsessions_obsession') {
        patch_obsession_view();
        return;
    }

    // are we on a profile?
    let profile_header = document.body.querySelector('.header--user');

    if (!profile_header)
        return;

    page.name = profile_header.querySelector('.header-title a').textContent;

    // are we on the overview page?
    let is_subpage = (page.subpage != 'overview');

    page.structure.container = document.body.querySelector('.page-content:not(.profile-cards-container, .report-box-container .page-content)');
    try {
        page.structure.row = page.structure.container.querySelector('.row:not(._buffer)');
        page.structure.main = page.structure.row.querySelector('.col-main');
        page.structure.side = page.structure.row.querySelector('.col-sidebar');
    } catch(e) {
        log('unable to find elements', 'page structure');
    }

    checkup_page_structure(is_subpage, profile_header);

    let new_account = false;

    let katsune = ff('katsune');

    if (ff('refreshed_nav')) {
        let avatar = profile_header.querySelector('.avatar');
        let title_wrap = profile_header.querySelector('.header-title-label-wrap');
        let sub_wrap = profile_header.querySelector('.header-title-secondary');

        // new account
        if (avatar == null) {
            avatar = profile_header.querySelector('.header-avatar-add');
            new_account = true;
        }

        // me :3
        if (cute.includes(page.name)) {
            title_wrap.querySelector('.header-title a').classList.add('bleh--name-is-cute');
        }


        // acquire info
        let scrobbles = 0;
        let average = 0;
        let artists = 0;
        let loved = 0;

        if (katsune) {
            let metadata = profile_header.querySelectorAll('.header-metadata-display');
            metadata.forEach((item, index) => {
                if (index == 0) {
                    let para = item.querySelector('p');

                    scrobbles = clean_number(para.textContent.trim()).toLocaleString(lang);
                    average = para.getAttribute('title');
                } else if (index == 1) {
                    artists = clean_number(item.textContent.trim()).toLocaleString(lang);
                } else if (index == 2) {
                    loved = clean_number(item.textContent.trim()).toLocaleString(lang);
                }
            });
        }


        let redesigned_profile_header = document.createElement('section');
        redesigned_profile_header.classList.add('redesigned-header', 'redesigned-profile-header', 'no-background');
        redesigned_profile_header.innerHTML = (`
            <div class="avatar-side">
                ${avatar.innerHTML}
            </div>
            <div class="info-side">
                <div class="sub-text">${trans_legacy[lang].profile.name}</div>
                ${(title_wrap != null) ? `<div class="title-container">${title_wrap.innerHTML}</div>` : ''}
                ${(sub_wrap != null) ? sub_wrap.outerHTML : ''}
            </div>
            ${(katsune) ? (`
            ${(!is_subpage) ? (`
            <div class="stat-side glacier-library-top">
                <div class="glacier-library-metadata">
                    <div class="glacier-library-metadata-item">
                        <div class="sub-text">${trans_legacy[lang].profile.scrobbles}</div>
                        <div class="glacier-library-metadata-item-value" id="scrobbles_tooltip">${scrobbles}</div>
                    </div>
                    <div class="glacier-library-metadata-item">
                        <div class="sub-text">${trans_legacy[lang].profile.artists}</div>
                        <div class="glacier-library-metadata-item-value">${artists}</div>
                    </div>
                    <div class="glacier-library-metadata-item">
                        <div class="sub-text">${trans_legacy[lang].profile.loved}</div>
                        <div class="glacier-library-metadata-item-value">${loved}</div>
                    </div>
                </div>
            </div>
            `) : ''}
            <div class="expand-side">
                <button class="header-expand-button icon" onclick="_toggle_profile_header(this)" aria-expanded="${settings.profile_header_expand}">${trans_legacy[lang].gallery.open.name}</button>
            </div>
            `) : ''}
        `);

        tippy(redesigned_profile_header.querySelector('#scrobbles_tooltip'), {
            content: average
        });

        // staff
        let is_staff = (title_wrap.querySelector('.user-status-staff') != null);
        if (is_staff) {
            redesigned_profile_header.classList.add('staff-profile');
        }

        if (page.name == auth.name && !settings.profile_header_own) {
            register_background(null, 'hidden');
        } else if (page.name != auth.name && !settings.profile_header_others) {
            register_background(null, 'hidden');
        } else {
            if (settings.profile_avi_background) {
                if (avatar != null)
                    register_background(avatar.querySelector('img').getAttribute('src').replace('/avatar170s/', '/ar0/'), 'avatar');
                else
                    register_background(null, 'none');
            } else {
                let background = document.body.querySelector('.header-background--has-image');
                if (background != null)
                    register_background(background.style.getPropertyValue('background-image').replace('url("', '').replace('")', ''), 'artist');
                else
                    register_background(null, 'none');
            }
        }

        page.structure.container.insertBefore(redesigned_profile_header, page.structure.container.firstElementChild);
        profile_header.classList.add('legacy-header');


        // make avatar clickable
        let header_avatar;
        if (ff('refreshed_nav'))
            header_avatar = page.structure.container.querySelector('.redesigned-profile-header .avatar-side');
        else
            header_avatar = document.querySelector('.header-avatar .avatar');

        if (!new_account) {
            let src = header_avatar.querySelector('img').getAttribute('src');

            let avatar_link = document.createElement('a');
            avatar_link.classList.add('bleh--avatar-clickable-link');
            avatar_link.setAttribute('onclick', `_expand_avatar('${src.replace('avatar170s', 'ar0')}')`);
            header_avatar.appendChild(avatar_link);
        }
    }

    let current_year = new Date().getFullYear();

    if (current_year < 2025 && ff('glacier_library')) {
        let tab = page.structure.nav.querySelector('.secondary-nav-item--library a');

        let beta = document.createElement('span');
        beta.classList.add('new-badge', 'beta-badge');
        beta.textContent = trans_legacy[lang].settings.new;

        tab.appendChild(beta);
    }

    let library_tab = page.structure.nav.querySelector('.secondary-nav-item--library a');
    library_tab.textContent = trans_legacy[lang].auth_menu.library;


    let is_own_profile = (page.name == auth.name);
    if (is_own_profile)
        profile_header.setAttribute('data-is-own-profile', 'true');

    if (!is_subpage) {
        let is_following = false;
        if (profile_header.querySelector('.label.user-follow'))
            is_following = true;

        if (ff('redesigned_profile_header'))
            redesign_profile_header(is_own_profile, is_following);


        //


        profile_recents();
        profile_artists();
        profile_albums();
        profile_tracks();


        if (is_own_profile && settings.activities) {
            let recent_activity_section = document.createElement('section');
            recent_activity_section.classList.add('recent-activity-section');
            recent_activity_section.innerHTML = (`
                <h2>${trans_legacy[lang].activities.name}</h2>
            `);

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

                recent_activity_section.appendChild(activity_item);

                if (tooltip_name != undefined)
                    tippy(activity_item.querySelector('.title a'), {
                        content: `${tooltip_sister} - ${tooltip_name}`
                    });

                let reports = page.structure.side.querySelector('.promo-v3');
                if (reports)
                    reports.after(recent_activity_section);
            });
        }


        if (page.name == sponsor_list.sponsor_account && !is_own_profile) {
            page.structure.container.removeChild(page.structure.nav);
            page.structure.main.innerHTML = '';
            page.structure.side.innerHTML = '';

            let alert = document.createElement('div');
            alert.classList.add('alert', 'alert-info');
            alert.textContent = 'This is a special bleh account used for managing sponsors.';

            page.structure.container.appendChild(alert);
        }


        // featured track
        let featured_track_panel = profile_header.querySelector('.header-featured-track');
        if (featured_track_panel != null)
            bleh_featured_profile_track(featured_track_panel);
    } else {
        load_banner_from_cache();


        let btn_add = page.structure.side.querySelector('.add-button');
        if (btn_add != null)
            btn_add.setAttribute('data-page-subpage', page.subpage);

        if (page.subpage.startsWith('library')) {
            bleh_user_library();
        } else if (page.subpage == 'events') {
            let selected_tab = page.structure.content_top.querySelector('.secondary-nav-item-link--active');

            let value_panel = document.createElement('section');
            value_panel.classList.add('value-panel');
            value_panel.innerHTML = (`
                <h2 class="text-18">${(selected_tab != null) ? selected_tab.textContent : trans_legacy[lang].profile.events}</h2>
            `);

            let values = page.structure.main.querySelectorAll('.metadata-display');

            let value_header = document.createElement('div');
            value_header.classList.add('event-value-top-header', 'view-buttons');

            values.forEach((value, index) => {
                let type = 'going';
                if (index == 1)
                    type = 'maybe';

                create_profile_top_item(value_header, {
                    name: page.name,
                    text: value.textContent,
                    type: type,
                    tooltip:  trans_legacy[lang].event[type].replace('{c}', value.textContent)
                });
            });

            value_panel.appendChild(value_header);


            let total_value = page.structure.side.querySelector('.metadata-display');
            if (total_value != null) {
                let total_text = document.createElement('h2');
                total_text.classList.add('text-18');
                total_text.textContent = trans_legacy[lang].event.all_time;

                value_panel.appendChild(total_text);

                let total_header = document.createElement('div');
                total_header.classList.add('event-value-top-header', 'view-buttons');

                create_profile_top_item(total_header, {
                    name: page.name,
                    text: total_value.textContent,
                    type: 'total',
                    tooltip:  trans_legacy[lang].event.total.replace('{c}', total_value.textContent)
                });

                value_panel.appendChild(total_header);
            }

            let legacy_metadata = page.structure.main.querySelector('.metadata-list');
            if (legacy_metadata)
                page.structure.main.removeChild(legacy_metadata);


            page.structure.side.innerHTML = '';
            page.structure.side.appendChild(value_panel);
        } else if (page.subpage.startsWith('listening-report')) {
            document.documentElement.setAttribute('data-bleh--theme', 'oled');

            page.structure.content_top.classList.add('listening-report-navlist');

            let report_box_container = document.body.querySelector('.report-box-container--overview');
            if (report_box_container != null) {
                if (report_box_container != null)
                    page.structure.content_top.after(report_box_container);
            } else {
                let dashboard = page.structure.container.querySelector('.user-dashboard');

                if (dashboard == null)
                    return;

                // v2
                dialog({
                    id: 'listening_report_v2',
                    title: 'Listening reports v2',
                    body: (`
                        <div class="alert alert-error">Unfortunately, legacy listening reports are not yet supported in bleh3.</div>
                        <br>
                        <p>To view this page properly it's recommended to temporarily disable bleh :3</p>
                        <p>Don't worry, they will be looked at eventually. Sorry for the inconvenience !!</p>
                    `)
                });
                return;
            }
        } else if (page.subpage == 'obsessions_overview') {
            let section_controls = page.structure.container.querySelector('.section-controls');
            let buttons;
            if (section_controls != null) {
                section_controls.classList.add('legacy-section-controls');
                buttons = section_controls.querySelectorAll(':is(button, a)');

                let header = page.structure.container.querySelector('.content-top-header');
                page.structure.content_top.innerHTML = (`
                    <div class="content-top-inner-wrap">
                        <div class="container content-top-lower">
                            <h1 class="content-top-header">${header.textContent.trim()}</h1>
                        </div>
                    </div>
                `);
            }

            let new_panel = document.createElement('section');
            new_panel.classList.add('obsessions-panel');

            let wrap = document.createElement('div');
            wrap.classList.add('view-buttons-wrapper');
            let button_header = document.createElement('div');
            button_header.classList.add('view-buttons', 'obsession-buttons');

            buttons.forEach((button) => {
                if (button.classList.contains('btn-sm')) {
                    button.classList = [];
                    button.classList.add('obsession-btn');

                    tippy(button, {
                        content: button.textContent
                    });

                    button.textContent = trans_legacy[lang].music.obsession;
                }

                button.classList.add('btn', 'view-item', 'interact-item', 'obsession-top-item');

                button_header.appendChild(button);
            });
            wrap.appendChild(button_header);
            new_panel.appendChild(wrap);

            page.structure.main.appendChild(new_panel);


            //


            let grid = document.createElement('ol');
            grid.classList.add('grid-items', 'grid-items--numbered', 'obsessions-grid');

            let items = page.structure.container.querySelectorAll('.obsession-history-item');
            items.forEach((item) => {
                let bg = item.querySelector('.obsession-history-item-background').style.getPropertyValue('background-image').trim();
                let cover_substr = bg.indexOf('url');
                let cover = bg.substring(cover_substr).replace('url("', '').replace('")', '').trim();

                let link = item.querySelector('.obsession-history-item-heading-link');

                let artist = item.querySelector('.obsession-history-item-artist a');
                let artist_link = artist.getAttribute('href');
                artist = artist.textContent.trim();

                let title = link.textContent.trim();
                link = link.getAttribute('href');
                let date = item.querySelector('.obsession-history-item-date').textContent.trim();

                let obsession_is_first = (item.querySelector('.obsession-first') != null);

                let grid_item = document.createElement('li');
                grid_item.classList.add('grid-items-item', 'obsessions-item');
                grid_item.innerHTML = (`
                    <div class="grid-items-cover-image">
                        <div class="grid-items-cover-image-image ${(cover.endsWith('4128a6eb29f94943c9d206c08e625904.jpg')) ? 'grid-items-cover-default' : ''}">
                            <img src="${cover}" alt="${title}" loading="lazy">
                        </div>
                        <div class="grid-items-item-details">
                            <p class="grid-items-item-main-text">
                                <a class="link-block-target" href="${link}" title="${title}">
                                    ${title}
                                </a>
                            </p>
                            <p class="grid-items-item-aux-text obsessions-item-aux">
                                <a class="grid-items-item-aux-block" href="${artist_link}">
                                    ${artist}
                                </a>
                                <a class="obsessions-item-date" href="${link}">
                                    ${date}
                                </a>
                            </p>
                        </div>
                        <a class="link-block-cover-link" href="${link}" tabindex="-1" aria-hidden="true"></a>
                    </div>
                    ${(obsession_is_first) ? `<div class="new-badge first-obsession">#1</div>` : ''}
                `);

                if (obsession_is_first) {
                    tippy(grid_item, {
                        content: trans_legacy[lang].music.obsession_first
                    });
                }

                grid.appendChild(grid_item);
            });

            new_panel.appendChild(grid);


            let no_data = page.structure.container.querySelector('.no-data-message--obsession-history');
            if (no_data != null) {
                wrap.after(no_data);
            }
        }
    }

    log('status is', 'page', 'info', page);
    update_page();


    patch_profile_following();

    // profile note
    let profile_notes = JSON.parse(localStorage.getItem('bleh_profile_notes')) || {};
    let profile_note = profile_notes[page.name];

    let profile_has_note = false;
    if (profile_note != undefined)
        profile_has_note = true;

    // badges
    log(`querying badges for ${page.name}`, 'profile');

    let profile_name_obj;
    if (ff('refreshed_nav'))
        profile_name_obj = page.structure.container.querySelector('.redesigned-profile-header .title-container');
    else
        profile_name_obj = profile_header.querySelector('.header-title-label-wrap');


    if (ff('badges')) {
        let stock_badges = profile_name_obj.querySelectorAll('.label');
        stock_badges.forEach((badge) => {
            if (badge.classList[1] == 'user-status-None')
                return;

            badge.classList.add('no-hover');

            tippy(badge, {
                theme: 'badge',
                placement: 'bottom',
                content: (`
                    <div class="badge-name">${badge.textContent}</div>
                    <div class="badge-reason">${tl(trans.badges[badge.classList[1]].reason)}</div>
                `),
                allowHTML: true
            });
        });
    }


    let badges = load_badges(page.name);

    if (badges) {
        badges.forEach((this_badge) => {
            let badge = document.createElement('span');
            badge.classList.add('label',`user-status--bleh-${this_badge.type}`,`user-status--bleh-user-${page.name}`);
            badge.textContent = this_badge.name;
            profile_name_obj.appendChild(badge);

            if (ff('badges')) {
                badge.classList.add('no-hover');

                tippy(badge, {
                    theme: 'badge',
                    placement: 'bottom',
                    content: (`
                        <div class="badge-name">${this_badge.name}</div>
                        <div class="badge-reason">${tl(trans.badges[this_badge.reason].reason)}</div>
                    `),
                    allowHTML: true
                });
            }

            if (this_badge.type == 'sponsor')
                badge.setAttribute('onclick', '_sponsor()');
        });
    }

    // secondary text
    let profile_sub_text;
    if (ff('refreshed_nav'))
        profile_sub_text = page.structure.container.querySelector('.redesigned-profile-header .header-title-secondary');
    else
        profile_sub_text = document.body.querySelector('.header-title-secondary');

    if (profile_sub_text == null)
        return;

    let display_name = profile_sub_text.querySelector('.header-title-display-name');
    let scrobble_since = profile_sub_text.querySelector('.header-scrobble-since');
    scrobble_since.textContent = scrobble_since.textContent.replace(trans_legacy[lang].profile.created.replace,'');

    /*tippy(display_name, {
        content: display_name.textContent
    });*/

    // pronouns?
    let pronouns = use_pronouns(display_name.textContent);

    let display_name_pre = document.createElement('span');
    display_name_pre.classList.add('header-title-secondary--pre');
    display_name_pre.textContent = pronouns ? trans_legacy[lang].profile.display_name.pronouns : trans_legacy[lang].profile.display_name.aka;
    profile_sub_text.insertBefore(display_name_pre, display_name);

    let scrobble_since_pre = document.createElement('span');
    scrobble_since_pre.classList.add('header-title-secondary--pre');
    scrobble_since_pre.textContent = trans_legacy[lang].profile.created.name;
    profile_sub_text.insertBefore(scrobble_since_pre, scrobble_since);

    let about_me_sidebar = document.body.querySelector('.about-me-sidebar');

    if (!about_me_sidebar) {
        if (settings.bio_markdown)
            save_banner_to_cache('none');

        return;
    }

    if (!about_me_sidebar.hasAttribute('data-kate-processed')) {
        about_me_sidebar.setAttribute('data-kate-processed','true');

        if (settings.bio_markdown) {
            // parse body
            let about_me_text = about_me_sidebar.querySelector('p');
            let result = bio_parse(about_me_text, true);
            about_me_text.innerHTML = result;
        }

        // add buttons
        let buttons = document.createElement('div');
        buttons.classList.add('user-about-buttons');

        if (!profile_has_note) {
            let add_note_button = document.createElement('button');
            add_note_button.classList.add('btn', 'icon');
            add_note_button.setAttribute('data-action-type', 'note');
            add_note_button.setAttribute('id', 'bleh--add-note');
            add_note_button.textContent = trans_legacy[lang].settings.profiles.notes.edit_user.replace('{u}', page.name);
            add_note_button.setAttribute('onclick',`_add_profile_note('${page.name}',${profile_has_note})`);

            tippy(add_note_button, {
                content: trans_legacy[lang].settings.profiles.notes.edit_user.replace('{u}', page.name)
            });

            buttons.appendChild(add_note_button);
        } else {
            create_profile_note_panel(page.name, true);
        }

        let about_more = document.createElement('button');
        about_more.classList.add('btn', 'icon');
        about_more.setAttribute('data-action-type', 'configure');
        about_more.textContent = trans_legacy[lang].settings.configure;

        tippy(about_more, {
            content: trans_legacy[lang].settings.configure
        });

        tippy(about_more, {
            theme: 'window',
            content: (`
                <div class="dialog-settings">
                    <h4>${trans_legacy[lang].settings.text.markdown.name}</h4>
                    <div class="toggle-container" id="container-bio_markdown" onclick="_update_item('bio_markdown')">
                        <button class="btn reset" onclick="_reset_item('bio_markdown')">${trans_legacy[lang].settings.reset}</button>
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

        buttons.appendChild(about_more);

        let about_me_header = about_me_sidebar.querySelector('h2');
        about_me_header.appendChild(buttons);
    }
}

unsafeWindow._add_profile_note = function(username, has_note) {
    add_profile_note(username, has_note);
}
function add_profile_note(username, has_note) {
    document.getElementById('bleh--add-note').style.setProperty('display','none');

    create_profile_note_panel(username, has_note);
}


function create_profile_note_panel(username, has_note) {
    let note_panel = document.createElement('section');
    note_panel.classList.add('bleh--panel','bleh--profile-note-panel');

    if (has_note) {
        note_panel.innerHTML = (`
        <h2>${trans_legacy[lang].settings.profiles.notes.header}</h2>
        <div class="content-form">
            <textarea id="bleh--profile-note" placeholder="${trans_legacy[lang].settings.profiles.notes.placeholder}">${JSON.parse(localStorage.getItem('bleh_profile_notes'))[username]}</textarea>
        </div>
        <div class="actions">
            <button class="btn" onclick="_clear_profile_note('${username}')">${trans_legacy[lang].settings.clear}</button>
            <button class="btn primary" onclick="_save_profile_note('${username}')">${trans_legacy[lang].settings.save}</button>
        </div>
        `);
    } else {
        note_panel.innerHTML = (`
        <h2>Your notes</h2>
        <div class="content-form">
            <textarea id="bleh--profile-note" placeholder="${trans_legacy[lang].settings.profiles.notes.placeholder}"></textarea>
        </div>
        <div class="actions">
            <button class="btn" onclick="_clear_profile_note('${username}')">${trans_legacy[lang].settings.clear}</button>
            <button class="btn primary" onclick="_save_profile_note('${username}')">${trans_legacy[lang].settings.save}</button>
        </div>
        `);
    }

    let about_me_sidebar = document.body.querySelector('.about-me-sidebar');
    about_me_sidebar.after(note_panel);
}

unsafeWindow._clear_profile_note = function(username) {
    let profile_notes = JSON.parse(localStorage.getItem('bleh_profile_notes')) || {};
    delete profile_notes[username];
    document.getElementById('bleh--profile-note').value = '';

    localStorage.setItem('bleh_profile_notes',JSON.stringify(profile_notes));
}

unsafeWindow._save_profile_note = function(username) {
    save_profile_note(username);
}
function save_profile_note(username) {
    let profile_notes = JSON.parse(localStorage.getItem('bleh_profile_notes')) || {};
    profile_notes[username] = document.getElementById('bleh--profile-note').value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

    localStorage.setItem('bleh_profile_notes',JSON.stringify(profile_notes));
}


// patch following
function patch_profile_following() {
    // this happens on your main profile, no matter the tab
    let following_tab = page.structure.nav.querySelector('.secondary-nav-item--following');
    let following_tab_html = following_tab.outerHTML;
    if (following_tab == undefined)
        return;

    if (following_tab.hasAttribute('data-kate-processed'))
        return;

    following_tab.setAttribute('data-kate-processed', 'true');
    following_tab.querySelector('a').textContent = trans_legacy[lang].profile.friends.name;


    // the rest happens on a following/followers page
    if (page.subpage != 'following' && page.subpage != 'followers' && page.subpage != 'neighbours')
        return;

    //let following_tab = document.body.querySelector('.secondary-nav-item--following');
    let followers_tab = page.structure.nav.querySelector('.secondary-nav-item--followers');
    let followers_tab_html = followers_tab.outerHTML;
    let neighbours_tab = page.structure.nav.querySelector('.secondary-nav-item--neighbours');
    let neighbours_tab_html = neighbours_tab.outerHTML;

    let tab = undefined;
    if (page.subpage == 'followers')
        tab = followers_tab;
    else if (page.subpage == 'following')
        tab = following_tab;
    else
        tab = neighbours_tab;

    tab.querySelector('a').textContent = trans_legacy[lang].profile.friends.name;


    // create nav
    let follow_nav = document.createElement('div');
    follow_nav.classList.add('bleh--nav-wrap', 'bleh--friends-nav');
    follow_nav.innerHTML = (`
        <nav class="navlist secondary-nav redesigned-navigation">
            <ul class="navlist-items bleh--navlist-items">
                ${following_tab_html}
                ${followers_tab_html}
                ${neighbours_tab_html}
            </ul>
        </nav>
    `);

    page.structure.content_top.after(follow_nav);
    page.structure.row.classList.add('col-main-is-primary');


    if (ff('katsune') && page.subpage != 'neighbours') {
        let count_text = page.structure.content_top.querySelector('h1').textContent.trim();
        let chr = count_text.indexOf('(');

        let count = 0;
        if (chr != -1)
            count = count_text.substring(chr).replace('(', '').replace(')', '');

        let count_badge = document.createElement('div');
        count_badge.classList.add('new-badge', 'count-badge');
        count_badge.textContent = count;
        follow_nav.querySelector('.secondary-nav-item-link--active').appendChild(count_badge);
    }


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
    page.structure.main.insertBefore(view_buttons, page.structure.main.firstElementChild);

    refresh_all();


    // users
    let users = page.structure.main.querySelectorAll('.user-list-inner-wrap');
    users.forEach((user) => {
        let avatar = user.querySelector('.user-list-avatar');
        let name = user.querySelector('.user-list-link').textContent;

        let badge = patch_avatar(avatar, name, 'follow');

        if (badge.type == 'avatar-status-dot--staff')
            user.classList.add('staff-user');
    });
}


unsafeWindow._refresh_tracks = function(button) {
    refresh_tracks(button);
}
function refresh_tracks(button) {
    let panel = page.structure.main.querySelector('#recent-tracks-section');
    panel.classList.remove('has-refreshed');
    button.setAttribute('disabled', '');

    // we need to fetch the tracklist, this function presumes that
    // the user has a tracklist to begin with, as that is the only
    // way to call the function on the frontend
    fetch(`${root}user/${page.name}/partial/recenttracks?ajax=1`)
    .then(function(response) {
        console.log('returned', response, response.text);

        return response.text();
    })
    .then(function(html) {
        let doc = new DOMParser().parseFromString(html, 'text/html');
        console.log('DOC', doc);

        let tracklist_panel = doc.querySelector('.chartlist');

        button.removeAttribute('disabled');

        if (!tracklist_panel) {
            notify({
                title: 'Recent tracks failed to load',
                icon: 'icon-16-refresh',
                type: 'error'
            });
            return;
        }

        notify({
            title: 'Recent tracks refreshed',
            icon: 'icon-16-refresh'
        });
        panel.classList.add('has-refreshed');

        page.structure.main.querySelector('#recent-tracks-section .chartlist').outerHTML = tracklist_panel.outerHTML;
    });
}

function bleh_featured_profile_track(object) {
    let art = object.querySelector('.featured-item-art');
    let details = object.querySelector('.featured-item-details');
    let form = document.body.querySelector('.header-info-primary form');

    let heading = details.querySelector('.featured-item-heading');
    let heading_link = heading.outerHTML;
    details.removeChild(heading);

    if (settings.corrections) {
        let name_elem = object.querySelector('.featured-item-name');
        let artist_elem = object.querySelector('.featured-item-artist');

        let name = correct_item_by_artist(name_elem.textContent.trim(), artist_elem.textContent.trim());
        let artist = correct_artist(artist_elem.textContent.trim());

        name_elem.textContent = name;
        artist_elem.textContent = artist;
    }

    if (form) {
        let button = form.querySelector('button');
        button.classList = 'featured-item-manage';
        button.textContent = trans_legacy[lang].settings.remove;
    }

    let panel = document.createElement('section');
    panel.classList.add('featured-item-panel');
    panel.innerHTML = (`
        <div class="sub-text">${heading_link}${(form != null) ? form.outerHTML : ''}</div>
        <div class="track-template">
            ${art.outerHTML}
            ${details.outerHTML}
        </div>
    `);

    let about_me = page.structure.side.querySelector('.about-me-sidebar');
    if (about_me != null)
        about_me.after(panel);
    else
        page.structure.side.insertBefore(panel, page.structure.side.firstElementChild);
}


function profile_recents() {
    let panel = page.structure.main.querySelector('#recent-tracks-section');

    if (panel == null)
        return;

    let more_link = panel.nextElementSibling;
    panel.appendChild(more_link);

    let form = panel.querySelector('#recent-tracks-settings');
    let link = panel.querySelector('[aria-controls="recent-tracks-settings"]');
    let tooltip;


    let view_buttons = document.createElement('div');
    view_buttons.classList.add('view-buttons');

    let header = document.createElement('div');
    header.classList.add('top-container');

    let header_text = panel.querySelector('h2');
    header.appendChild(header_text);

    // refresh
    let refresh_btn = document.createElement('button');
    refresh_btn.classList.add('btn', 'view-item', 'interact-item', 'refresh-tracklist-btn');
    refresh_btn.textContent = trans_legacy[lang].music.refresh;
    refresh_btn.setAttribute('onclick', '_refresh_tracks(this)');

    tippy(refresh_btn, {
        content: trans_legacy[lang].music.refresh_tracks
    });

    view_buttons.appendChild(refresh_btn);

    header.appendChild(view_buttons);
    panel.insertBefore(header, panel.firstElementChild);

    if (form == null)
        return;

    if (page.token == '')
        page.token = form.querySelector('[name="csrfmiddlewaretoken"]').getAttribute('value');

    let original_chart_settings = {};

    let new_button = document.createElement('button');
    new_button.classList.add('panel-settings-button', 'btn', 'view-item', 'interact-item');
    new_button.textContent = trans_legacy[lang].profile.settings;

    form.classList = '';

    tooltip = tippy(new_button, {
        theme: 'window',
        content: form.outerHTML,
        allowHTML: true,
        placement: 'bottom',
        interactive: true,
        interactiveBorder: 10,
        trigger: 'click',

        onShow(instance) {
            let form = instance.popper.querySelector('form');

            form.innerHTML = (`
                <input type="hidden" name="csrfmiddlewaretoken" value="${page.token}">
                <div class="select-container">
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.inbuilt.charts.recent.count.name}</h5>
                    </div>
                    <div class="select-wrap custom-selector" id="id_chart_length_recent_tracks_select">
                        ${original_chart_settings.count}
                    </div>
                </div>
                <div class="toggle-container" id="container-recent_artwork" onclick="_update_inbuilt_item('recent_artwork')">
                    <button class="btn reset" onclick="_reset_inbuilt_item('recent_artwork')">Reset to default</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.inbuilt.charts.recent.artwork.name}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <input class="companion-checkbox" type="checkbox" name="show_recent_tracks_artwork" id="inbuilt-companion-checkbox-recent_artwork">
                        <span class="btn toggle" id="toggle-recent_artwork" aria-checked="false">
                            <div class="dot"></div>
                        </span>
                    </div>
                </div>
                <div class="toggle-container" id="container-recent_realtime" onclick="_update_inbuilt_item('recent_realtime')">
                    <button class="btn reset" onclick="_reset_inbuilt_item('recent_realtime')">Reset to default</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.inbuilt.charts.recent.realtime.name}</h5>
                        <p>${trans_legacy[lang].settings.inbuilt.charts.recent.realtime.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <input class="companion-checkbox" type="checkbox" name="auto_refresh_recent_tracks" id="inbuilt-companion-checkbox-recent_realtime">
                        <span class="btn toggle" id="toggle-recent_realtime" aria-checked="false" type="button">
                            <div class="dot"></div>
                        </span>
                    </div>
                </div>
                <div class="sep"></div>
                <div class="toggle-container" id="container-format_guest_features" onclick="_update_item('format_guest_features')">
                    <button class="btn reset" onclick="_reset_item('format_guest_features')">${trans_legacy[lang].settings.reset}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.corrections.format_guest_features.name}</h5>
                        <p>${trans_legacy[lang].settings.corrections.format_guest_features.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-format_guest_features" aria-checked="true" type="button">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container hide-if-format-guest-disabled" id="container-show_guest_features" onclick="_update_item('show_guest_features')">
                    <button class="btn reset" onclick="_reset_item('show_guest_features')">${trans_legacy[lang].settings.reset}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.corrections.show_guest_features.name}</h5>
                        <p>${trans_legacy[lang].settings.corrections.show_guest_features.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-show_guest_features" aria-checked="true" type="button">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-stacked_chartlist_info" onclick="_update_item('stacked_chartlist_info')">
                    <button class="btn reset" onclick="_reset_item('stacked_chartlist_info')">${trans_legacy[lang].settings.reset}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.corrections.stacked_chartlist_info.name}</h5>
                        <p>${trans_legacy[lang].settings.corrections.stacked_chartlist_info.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-stacked_chartlist_info" aria-checked="true" type="button">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-colourful_tracks" onclick="_update_item('colourful_tracks')">
                    <button class="btn reset" onclick="_reset_item('colourful_tracks')">${trans_legacy[lang].settings.reset}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.customise.colourful_tracks.name}</h5>
                        <p>${trans_legacy[lang].settings.customise.colourful_tracks.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-colourful_tracks" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="settings-footer">
                    <button type="submit" class="btn-primary save">
                        ${trans_legacy[lang].settings.save}
                    </button>
                    <a class="btn icon settings not-a-view-button" href="${root}bleh">
                        ${trans_legacy[lang].settings.configure}
                    </a>
                </div>
            `);

            custom_select(form.querySelector('#id_chart_length_recent_tracks'), form.querySelector('#id_chart_length_recent_tracks_select'));

            let selects = form.querySelectorAll('select');
            selects.forEach((select) => {
                select.setAttribute('onchange', `_update_inbuilt_select('${select.getAttribute('id')}', this.value)`);
                update_inbuilt_select(select.getAttribute('id'), select.value);
            });

            for (let setting in original_chart_settings) {
                update_inbuilt_item(setting, original_chart_settings[setting], false, form);
            }

            refresh_all(instance.popper);
        }
    });

    view_buttons.appendChild(new_button);

    original_chart_settings = {
        recent_artwork: form.querySelector('#id_show_recent_tracks_artwork').checked,
        count: form.querySelector('#id_chart_length_recent_tracks').outerHTML,
        recent_realtime: form.querySelector('#id_auto_refresh_recent_tracks').checked
    }

    form.innerHTML = '';
}

function profile_artists() {
    let panel = page.structure.main.querySelector('#top-artists');

    if (panel == null)
        return;

    panel.classList.remove('section-with-settings');

    let form = panel.querySelector('#artist-chart-settings');
    let link = panel.querySelector('[aria-controls="artist-chart-settings"]');
    let tooltip;


    let view_buttons = document.createElement('div');
    view_buttons.classList.add('view-buttons');

    let header = document.createElement('div');
    header.classList.add('top-container');

    let header_text = panel.querySelector('h2');
    header.appendChild(header_text);

    // select
    let select_btn = panel.querySelector('.dropdown-menu-clickable-button');
    select_btn.classList.add('btn', 'view-item', 'interact-item');
    select_btn.classList.remove('section-control')
    view_buttons.appendChild(select_btn);

    header.appendChild(view_buttons);
    panel.insertBefore(header, panel.firstElementChild);

    if (form == null)
        return;

    if (page.token == '')
        page.token = form.querySelector('[name="csrfmiddlewaretoken"]').getAttribute('value');

    let original_chart_settings = {};

    let new_button = document.createElement('button');
    new_button.classList.add('panel-settings-button', 'btn', 'view-item', 'interact-item');
    new_button.textContent = trans_legacy[lang].profile.settings;

    form.classList = '';

    tooltip = tippy(new_button, {
        theme: 'window',
        content: form.outerHTML,
        allowHTML: true,
        placement: 'bottom',
        interactive: true,
        interactiveBorder: 10,
        trigger: 'click',

        onShow(instance) {
            let form = instance.popper.querySelector('form');

            form.innerHTML = (`
                <input type="hidden" name="csrfmiddlewaretoken" value="${page.token}">
                <div class="select-container">
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.inbuilt.charts.artists.timeframe.name}</h5>
                    </div>
                    <div class="select-wrap custom-selector" id="id_chart_range_top_artists_select">
                        ${original_chart_settings.timeframe}
                    </div>
                </div>
                <div class="select-container">
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.inbuilt.charts.artists.style.name}</h5>
                    </div>
                    <div class="select-wrap custom-selector" id="id_chart_style_top_artists_select">
                        ${original_chart_settings.style}
                    </div>
                </div>
                <div class="select-container hide-if-artist-list">
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.inbuilt.charts.artists.length.name}</h5>
                    </div>
                    <div class="select-wrap custom-selector" id="id_artists_image_grid_length_select">
                        ${original_chart_settings.length}
                    </div>
                </div>
                <div class="select-container hide-if-artist-grid">
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.inbuilt.charts.artists.length.name}</h5>
                    </div>
                    <div class="select-wrap custom-selector" id="id_artists_chartlist_length_select">
                        ${original_chart_settings.length_list}
                    </div>
                </div>
                <div class="settings-footer">
                    <button type="submit" class="btn-primary save">
                        ${trans_legacy[lang].settings.save}
                    </button>
                </div>
            `);

            custom_select(form.querySelector('#id_chart_range_top_artists'), form.querySelector('#id_chart_range_top_artists_select'));
            custom_select(form.querySelector('#id_chart_style_top_artists'), form.querySelector('#id_chart_style_top_artists_select'));
            custom_select(form.querySelector('#id_artists_image_grid_length'), form.querySelector('#id_artists_image_grid_length_select'));
            custom_select(form.querySelector('#id_artists_chartlist_length'), form.querySelector('#id_artists_chartlist_length_select'));

            let selects = form.querySelectorAll('select');
            selects.forEach((select) => {
                select.setAttribute('onchange', `_update_inbuilt_select('${select.getAttribute('id')}', this.value)`);
                update_inbuilt_select(select.getAttribute('id'), select.value);
            });
        }
    });

    view_buttons.appendChild(new_button);

    original_chart_settings = {
        timeframe: form.querySelector('#id_chart_range_top_artists').outerHTML,
        style: form.querySelector('#id_chart_style_top_artists').outerHTML,
        length: form.querySelector('#id_artists_image_grid_length').outerHTML,
        length_list: form.querySelector('#id_artists_chartlist_length').outerHTML
    }

    form.innerHTML = '';
}

function profile_albums() {
    let panel = page.structure.main.querySelector('#top-albums');

    if (panel == null)
        return;

    panel.classList.remove('section-with-settings');

    let form = panel.querySelector('#albums-chart-settings');
    let link = panel.querySelector('[aria-controls="albums-chart-settings"]');
    let tooltip;


    let view_buttons = document.createElement('div');
    view_buttons.classList.add('view-buttons');

    let header = document.createElement('div');
    header.classList.add('top-container');

    let header_text = panel.querySelector('h2');
    header.appendChild(header_text);

    // select
    let select_btn = panel.querySelector('.dropdown-menu-clickable-button');
    select_btn.classList.add('btn', 'view-item', 'interact-item');
    select_btn.classList.remove('section-control')
    view_buttons.appendChild(select_btn);

    header.appendChild(view_buttons);
    panel.insertBefore(header, panel.firstElementChild);

    if (form == null)
        return;

    if (page.token == '')
        page.token = form.querySelector('[name="csrfmiddlewaretoken"]').getAttribute('value');

    let original_chart_settings = {};

    let new_button = document.createElement('button');
    new_button.classList.add('panel-settings-button', 'btn', 'view-item', 'interact-item');
    new_button.textContent = trans_legacy[lang].profile.settings;

    form.classList = '';

    tooltip = tippy(new_button, {
        theme: 'window',
        content: form.outerHTML,
        allowHTML: true,
        placement: 'bottom',
        interactive: true,
        interactiveBorder: 10,
        trigger: 'click',

        onShow(instance) {
            let form = instance.popper.querySelector('form');

            form.innerHTML = (`
                <input type="hidden" name="csrfmiddlewaretoken" value="${page.token}">
                <div class="select-container">
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.inbuilt.charts.albums.timeframe.name}</h5>
                    </div>
                    <div class="select-wrap custom-selector" id="id_chart_range_top_albums_select">
                        ${original_chart_settings.timeframe}
                    </div>
                </div>
                <div class="select-container">
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.inbuilt.charts.albums.style.name}</h5>
                    </div>
                    <div class="select-wrap custom-selector" id="id_chart_style_top_albums_select">
                        ${original_chart_settings.style}
                    </div>
                </div>
                <div class="select-container hide-if-album-list">
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.inbuilt.charts.albums.length.name}</h5>
                    </div>
                    <div class="select-wrap custom-selector" id="id_albums_image_grid_length_select">
                        ${original_chart_settings.length}
                    </div>
                </div>
                <div class="select-container hide-if-album-grid">
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.inbuilt.charts.albums.length.name}</h5>
                    </div>
                    <div class="select-wrap custom-selector" id="id_albums_chartlist_length_select">
                        ${original_chart_settings.length_list}
                    </div>
                </div>
                <div class="settings-footer">
                    <button type="submit" class="btn-primary save">
                        ${trans_legacy[lang].settings.save}
                    </button>
                </div>
            `);

            custom_select(form.querySelector('#id_chart_range_top_albums'), form.querySelector('#id_chart_range_top_albums_select'));
            custom_select(form.querySelector('#id_chart_style_top_albums'), form.querySelector('#id_chart_style_top_albums_select'));
            custom_select(form.querySelector('#id_albums_image_grid_length'), form.querySelector('#id_albums_image_grid_length_select'));
            custom_select(form.querySelector('#id_albums_chartlist_length'), form.querySelector('#id_albums_chartlist_length_select'));

            let selects = form.querySelectorAll('select');
            selects.forEach((select) => {
                select.setAttribute('onchange', `_update_inbuilt_select('${select.getAttribute('id')}', this.value)`);
                update_inbuilt_select(select.getAttribute('id'), select.value);
            });
        }
    });

    view_buttons.appendChild(new_button);

    original_chart_settings = {
        timeframe: form.querySelector('#id_chart_range_top_albums').outerHTML,
        style: form.querySelector('#id_chart_style_top_albums').outerHTML,
        length: form.querySelector('#id_albums_image_grid_length').outerHTML,
        length_list: form.querySelector('#id_albums_chartlist_length').outerHTML
    }

    form.innerHTML = '';
}

function profile_tracks() {
    let panel = page.structure.main.querySelector('#top-tracks');

    if (panel == null)
        return;

    panel.classList.remove('section-with-settings');

    let form = panel.querySelector('#track-chart-settings');
    let link = panel.querySelector('[aria-controls="track-chart-settings"]');
    let tooltip;


    let view_buttons = document.createElement('div');
    view_buttons.classList.add('view-buttons');

    let header = document.createElement('div');
    header.classList.add('top-container');

    let header_text = panel.querySelector('h2');
    header.appendChild(header_text);

    // select
    let select_btn = panel.querySelector('.dropdown-menu-clickable-button');
    select_btn.classList.add('btn', 'view-item', 'interact-item');
    select_btn.classList.remove('section-control')
    view_buttons.appendChild(select_btn);

    header.appendChild(view_buttons);
    panel.insertBefore(header, panel.firstElementChild);

    if (form == null)
        return;

    if (page.token == '')
        page.token = form.querySelector('[name="csrfmiddlewaretoken"]').getAttribute('value');

    let original_chart_settings = {};

    let new_button = document.createElement('button');
    new_button.classList.add('panel-settings-button', 'btn', 'view-item', 'interact-item');
    new_button.textContent = trans_legacy[lang].profile.settings;

    form.classList = '';

    tooltip = tippy(new_button, {
        theme: 'window',
        content: form.outerHTML,
        allowHTML: true,
        placement: 'bottom',
        interactive: true,
        interactiveBorder: 10,
        trigger: 'click',

        onShow(instance) {
            let form = instance.popper.querySelector('form');

            form.innerHTML = (`
                <input type="hidden" name="csrfmiddlewaretoken" value="${page.token}">
                <div class="select-container">
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.inbuilt.charts.tracks.timeframe.name}</h5>
                    </div>
                    <div class="select-wrap custom-selector" id="id_chart_range_top_tracks_select">
                        ${original_chart_settings.timeframe}
                    </div>
                </div>
                <div class="select-container">
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.inbuilt.charts.tracks.count.name}</h5>
                    </div>
                    <div class="select-wrap custom-selector" id="id_chart_length_top_tracks_select">
                        ${original_chart_settings.count}
                    </div>
                </div>
                <div class="sep"></div>
                <div class="toggle-container" id="container-format_guest_features" onclick="_update_item('format_guest_features')">
                    <button class="btn reset" onclick="_reset_item('format_guest_features')">${trans_legacy[lang].settings.reset}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.corrections.format_guest_features.name}</h5>
                        <p>${trans_legacy[lang].settings.corrections.format_guest_features.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-format_guest_features" aria-checked="true" type="button">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container hide-if-format-guest-disabled" id="container-show_guest_features" onclick="_update_item('show_guest_features')">
                    <button class="btn reset" onclick="_reset_item('show_guest_features')">${trans_legacy[lang].settings.reset}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.corrections.show_guest_features.name}</h5>
                        <p>${trans_legacy[lang].settings.corrections.show_guest_features.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-show_guest_features" aria-checked="true" type="button">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="settings-footer">
                    <button type="submit" class="btn-primary save">
                        ${trans_legacy[lang].settings.save}
                    </button>
                    <a class="btn icon settings not-a-view-button" href="${root}bleh">
                        ${trans_legacy[lang].settings.configure}
                    </a>
                </div>
            `);

            custom_select(form.querySelector('#id_chart_range_top_tracks'), form.querySelector('#id_chart_range_top_tracks_select'));
            custom_select(form.querySelector('#id_chart_length_top_tracks'), form.querySelector('#id_chart_length_top_tracks_select'));

            let selects = form.querySelectorAll('select');
            selects.forEach((select) => {
                select.setAttribute('onchange', `_update_inbuilt_select('${select.getAttribute('id')}', this.value)`);
                update_inbuilt_select(select.getAttribute('id'), select.value);
            });

            refresh_all(instance.popper);
        }
    });

    view_buttons.appendChild(new_button);

    original_chart_settings = {
        timeframe: form.querySelector('#id_chart_range_top_tracks').outerHTML,
        count: form.querySelector('#id_chart_length_top_tracks').outerHTML
    }

    form.innerHTML = '';
}

function bio_parse(text, cache = false) {
    let result = markdown(text.textContent);

    let temp = document.createElement('div');
    temp.innerHTML = result;

    use_banner(temp, cache);

    return result;
}

function use_banner(temp, cache) {
    if ((page.name == auth.name && !settings.profile_header_own) || (page.name != auth.name && !settings.profile_header_others))
        return;

    let banner = temp.querySelector('img[alt="banner"]');
    if (banner) {
        set_profile_banner(banner, cache);
    } else {
        save_banner_to_cache('none');
    }
}

function set_profile_banner(img, cache) {
    let src = img.getAttribute('src');
    register_background(src, 'bio');

    if (cache)
        save_banner_to_cache(src);
}


function load_banner_from_cache() {
    let banners = JSON.parse(localStorage.getItem('bleh_profile_banners')) || {};

    if (banners[page.name]) {
        if (banners[page.name] == 'none')
            return;

        register_background(banners[page.name], 'bio');
    } else {
        request_banner();
    }
}

function request_banner() {
    fetch(`${root}user/${page.name}`)
    .then(function(response) {
        console.log('returned', response, response.text);

        return response.text();
    })
    .then(function(html) {
        let doc = new DOMParser().parseFromString(html, 'text/html');
        console.log('DOC', doc);

        let about_me_sidebar = doc.querySelector('.about-me-sidebar');
        if (about_me_sidebar) {
            let about_me_text = about_me_sidebar.querySelector('p');
            let result = bio_parse(about_me_text, true);
        } else {
            save_banner_to_cache('none');
        }
    });
}

function save_banner_to_cache(img) {
    let banners = JSON.parse(localStorage.getItem('bleh_profile_banners')) || {};

    banners[page.name] = img;

    let banners_o = Object.keys(banners);
    if (banners_o.length > 150) {
        let values = banners_o.splice(150, banners_o.length);

        values.forEach((value) => {
            delete banners[value];
        });
    }

    localStorage.setItem('bleh_profile_banners', JSON.stringify(banners));
}