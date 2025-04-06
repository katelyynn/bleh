import { settings } from "./build/config";
import { log } from "./build/log";
import { auth, page, recent_activity_list, root } from "./build/page";
import { sanitise } from "./build/tools";
import { correct_artist, correct_item_by_artist } from "./components/lotus";

export function subscribe_to_events() {
    if (!settings.activities)
        return;

    let love_track = document.body.querySelectorAll(`form[action$="${auth.name}/loved"]:not([data-bleh-subscribed])`);
    love_track.forEach((form) => {
        form.setAttribute('data-bleh-subscribed', 'true');

        let track = form.querySelector('[name="track"]').getAttribute('value');
        let artist = form.querySelector('[name="artist"]').getAttribute('value');

        artist = correct_artist(artist);
        track = correct_item_by_artist(track, artist, 'track');

        let btn = form.querySelector('button');

        btn.addEventListener('click', (event) => {
            log('heard', 'event', 'info', event);

            let action = btn.getAttribute('data-analytics-action');

            register_activity((action == 'LoveTrack') ? 'love' : 'unlove', [{name: track, type: 'track', sister: artist}], `${root}music/${sanitise(artist)}/_/${sanitise(track)}`);
        }, false);
    });


    let bookmark_item = document.body.querySelectorAll(`form[action="/music/+bookmarks"]:not([data-bleh-subscribed])`);
    bookmark_item.forEach((form) => {
        form.setAttribute('data-bleh-subscribed', 'true');

        let btn = form.querySelector('button');

        btn.addEventListener('click', (event) => {
            log('heard', 'event', 'info', event);

            let action = btn.getAttribute('data-analytics-action');

            register_activity((action.startsWith('Bookmark')) ? 'bookmark' : 'unbookmark', [{name: page.name, type: page.type, sister: page.sister}], window.location.href);
        }, false);
    });


    let obsess = document.body.querySelectorAll(`.modal-body form[action$="${auth.name}/obsessions"]:not([data-bleh-subscribed])`);
    obsess.forEach((form) => {
        form.setAttribute('data-bleh-subscribed', 'true');

        let track = form.querySelector('[name="name"]').getAttribute('value');
        let artist = form.querySelector('[name="artist"]').getAttribute('value');

        artist = correct_artist(artist);
        track = correct_item_by_artist(track, artist);

        let btn = form.querySelector('button');

        btn.addEventListener('click', (event) => {
            log('heard', 'event', 'info', event);

            register_activity('obsess', [{name: track, type: 'track', sister: artist}], window.location.href);
        }, false);
    });


    let post_shouts_btn = document.body.querySelector('.btn-post-shout:not([data-bleh-subscribed])');
    if (post_shouts_btn != null) {
        post_shouts_btn.setAttribute('data-bleh-subscribed', 'true');

        post_shouts_btn.addEventListener('click', (event) => {
            log('heard', 'event', 'info', event);

            // wait 0.15s
            window.setTimeout(function() {
                let actual_btn = event.target.parentElement;

                let is_loading = actual_btn.classList.contains('btn--loading');
                console.log('is button loading', is_loading, actual_btn, event.target);

                if (!is_loading)
                    return;

                register_activity('shout', [{name: page.name, type: page.type, sister: page.sister}], window.location.href);
            }, 150);
        }, false);
    }


    let save_wiki_form = document.body.querySelector('.wiki-edit-form:not([data-bleh-subscribed])');
    if (save_wiki_form != null) {
        save_wiki_form.setAttribute('data-bleh-subscribed', 'true');

        let btn = save_wiki_form.querySelector('.form-submit button');

        btn.addEventListener('click', (event) => {
            log('heard', 'event', 'info', event);

            register_activity('wiki', [{name: page.name, type: page.type, sister: page.sister}], window.location.href);
        }, false);
    }


    let upload_img_form = document.body.querySelector('form[action$="/+images/upload"]:not([data-bleh-subscribed])');
    if (upload_img_form != null) {
        upload_img_form.setAttribute('data-bleh-subscribed', 'true');

        let btn = upload_img_form.querySelector('.form-submit button');

        btn.addEventListener('click', (event) => {
            log('heard', 'event', 'info', event);

            register_activity('image_upload', [{name: page.name, type: page.type, sister: page.sister}], window.location.href);
        }, false);
    }
}


export function load_activities() {
    if (!settings.activities)
        return;
    recent_activity_list.length = 0
    recent_activity_list.push(...(JSON.parse(localStorage.getItem('bwaa_recent_activity')) || []));
    log('loaded', 'activity', 'info', recent_activity_list);

    // check if over 10
    check_activities_length();

    log('saved', 'activity', 'info', recent_activity_list);
    localStorage.setItem('bwaa_recent_activity', JSON.stringify(recent_activity_list));
}

function check_activities_length() {
    if (recent_activity_list.length > 10) {
        let to_delete = recent_activity_list.length - 10;

        recent_activity_list.splice(0, to_delete);
        log(`reached maximum of 10, removed leftovers`, 'activity');
    }

    return recent_activity_list;
}

export function register_activity(type, involved, context, date=new Date()) {
    if (!settings.activities)
        return;

    if (type == 'shout') {
        if (!settings.activity_shout)
            return;
    } else if (type == 'image_upload' || type == 'image_star' || type == 'bookmark' || type == 'unbookmark') {
        if (!settings.activity_image)
            return;
    } else if (type == 'obsess' || type == 'unobsess') {
        if (!settings.activity_obsess)
            return;
    } else if (type == 'love' || type == 'unlove') {
        if (!settings.activity_love)
            return;
    } else if (type == 'install_bwaa' || type == 'update_bwaa' || type == 'install_bleh' || type == 'update_bleh') {
        if (!settings.activity_install)
            return;
    } else if (type == 'wiki') {
        if (!settings.wiki)
            return;
    }

    recent_activity_list.length = 0
    recent_activity_list.push(...(JSON.parse(localStorage.getItem('bwaa_recent_activity')) || []));

    log('loaded', 'activity', 'info', recent_activity_list);

    recent_activity_list.push({
        type: type,
        involved: involved,
        context: context,
        date: date
    });

    log('registered new', 'activity', 'info', {
        type: type,
        involved: involved,
        context: context,
        date: date
    });

    // check if over 10
    check_activities_length();

    log('saved', 'activity', 'info', recent_activity_list);
    localStorage.setItem('bwaa_recent_activity', JSON.stringify(recent_activity_list));
}