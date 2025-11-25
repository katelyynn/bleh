//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { html } from 'lighterhtml';
import { settings } from './build/config';
import { log } from './build/log';
import { tl, trans } from './build/trans';
import { chart_reflow } from './chart';
import { dialog, dialog_rm } from './components/dialog';
import { invoke_reload } from './config';
import { version } from './main';
import { download_with_progress, set_storage } from './build/tools.js';
import cropper_css from 'cropperjs/dist/cropper.min.css';
import { root } from './build/page.js';

export function append_style() {
    document.documentElement.classList.add('florence-supports-loading');

    for (var member in settings) delete settings[member];
    Object.assign(settings, JSON.parse(localStorage.getItem('bleh')));

    let cached_style = localStorage.getItem('bleh_cached_style') || '';

    const split = window.location.pathname.replace(root, '').split('/');
    const length = split.length - 1;

    // style is neither fetched nor applied in these interfaces
    if (
        (split[length] == 'playback' && split[2] == 'listening-report') ||
        split[0] == 'labs'
    ) {
        // this sometimes fixes last.fm just not appending classes and i dont know why
        if (split[length] == 'playback' && split[2] == 'listening-report') document.body?.classList.add('playback-2024');

        log('disabled loading for special interface', 'style');
        return;
    }

    document.documentElement.setAttribute('data-bleh--theme', settings.theme);
    document.documentElement.appendChild(
        html.node`<style>${cropper_css}</style>`
    );

    if (settings.dev) return;

    if (cached_style == '') {
        // style has never been cached
        log('never cached, fetching', 'style');
        fetch_new_style();
    } else {
        // style is currently cached, load that first
        // ensures no flashing missing styles hopefully
        log('requesting cache', 'style');
        load_cached_style(cached_style);
    }
}

function load_cached_style(cached_style) {
    const style = html.node`
        <style id="bleh--cached-style">${cached_style}</style>
    `;
    document.documentElement.appendChild(style);

    style.onload = () => {
        log('loaded cache', 'style');
        chart_reflow();

        // now, analyse if we should fetch a new one
        log('checking timeout', 'style');
        check_if_style_cache_is_valid();
    };
}

function check_if_style_cache_is_valid() {
    const cached_style_timeout = new Date(
        localStorage.getItem('bleh_cached_style_timeout')
    );
    const current_time = new Date();

    // check if timeout has expired
    if (cached_style_timeout < current_time) {
        log('fetching new, expired timeout', 'style');
        fetch_new_style();
    } else {
        log(`timeout valid until ${cached_style_timeout}`, 'style');
    }
}

function fetch_new_style(
    delete_old_style = false,
    reload_on_finish = false,
    allow_incompatible = false
) {
    const url = `https://github.com/katelyynn/bleh/raw/refs/heads/uwu/fm/bleh.css?${Math.random()}`;
    log(`making request ${url}`, 'style');

    GM_xmlhttpRequest({
        method: 'GET',
        url,
        onload: (res) => {
            log(`style responded ${res.status}`, 'style');

            if (res.status != 200) {
                log('error fetching', 'style', 'error', { res });
                return;
            }

            const text = res.responseText;
            const style = html.node`
                <style>${text}</style>
            `;
            document.documentElement.appendChild(style);

            style.onload = () => {
                const theme_version = getComputedStyle(document.body)
                    .getPropertyValue('--version-build')
                    .replaceAll("'", '')
                    .replaceAll('"', '');

                if (!allow_incompatible && theme_version != version.build) {
                    log(
                        'denied loading, incompatible version',
                        'style',
                        'info',
                        {
                            theme: theme_version,
                            script: version.build
                        }
                    );
                    document.documentElement.removeChild(style);
                    return;
                }

                // remove the old style, if needed
                if (delete_old_style)
                    document.documentElement.removeChild(
                        document.getElementById('bleh--cached-style')
                    );

                log('loaded', 'style');
                document.body.classList.add('bleh');

                chart_reflow();

                if (reload_on_finish) invoke_reload();
            };

            const expire = new Date();
            expire.setHours(expire.getHours() + 1);
            localStorage.setItem('bleh_cached_style', text);
            localStorage.setItem('bleh_cached_style_timeout', expire);
            log(`cached until ${expire}`, 'style');
        },
        onerror: (e) => {
            log('error fetching', 'style', 'error', { e });
        }
    });
}

function parse_version(v) {
    const parts = v.split('.').map(Number);

    // ensure [major, minor, patch]
    while (parts.length < 3) parts.push(0);
    return parts.slice(0, 3);
}

function compare_versions(a, b) {
    const [a_maj, a_min, a_patch] = parse_version(a);
    const [b_maj, b_min, b_patch] = parse_version(b);

    if (a_maj !== b_maj) return a_maj > b_maj ? 1 : -1;
    if (a_min !== b_min) return a_min > b_min ? 1 : -1;
    if (a_patch !== b_patch) return a_patch > b_patch ? 1 : -1;

    return 0;
}

export function update_comparison(current, latest) {
    return compare_versions(latest, current) === 1;
}

export function update_check(force = false, btn = null, func = null) {
    if (!force) {
        const last_checked =
            localStorage.getItem('bleh_update_checked') || null;
        const next_check =
            localStorage.getItem('bleh_update_next_check') || null;
        const current_time = new Date();

        if (last_checked && next_check && new Date(next_check) > current_time) {
            log('update check skipped', 'update', 'info', {
                next_in: next_check,
                current_time: current_time
            });
            if (func) func();

            return;
        }
    }

    if (btn) btn.setAttribute('disabled', '');

    let url = `https://katelyynn.github.io/bleh/fm/src/build/build.json?${Date.now()}`;

    /*let notification = notify({
        id: 'updater',
        title: 'Updater',
        body: 'Downloading update information',
        progress: true,
        icon: 'icon-16-update'
    });*/

    download_with_progress(url, (percent) => {
        //notification.set_body(`Downloading update information ${percent}%`);
        //notification.set(percent);
    }).then(async (blob) => {
        const text = await blob.text();

        if (btn) btn.removeAttribute('disabled');

        try {
            let data = JSON.parse(text);
            console.log(data);

            let update_required = update_comparison(version.build, data.build);
            set_storage('bleh_update_required', update_required.toString());
            set_storage('bleh_update_to', data.build);
            set_storage('bleh_update_checked', new Date().toString());

            let next = new Date();
            next.setHours(next.getHours() + 2);

            set_storage('bleh_update_next_check', next.toString());
            log('update check finished', 'update', 'info', {
                next_in: next,
                current_time: new Date()
            });

            if (func) func();
        } catch (e) {
            log('error parsing', 'update', 'error', { error: e });
        }
    });
}

export function prompt_for_update() {
    // prompt the user
    dialog({
        id: 'bleh_update',
        title: tl(trans.update_to_version).replace(
            '{v}',
            localStorage.getItem('bleh_update_to') || 'unknown'
        ),
        body: html.node`
            <div class="forms">
                <div class="form">
                    <div class="form-group proceed">
                        <button class="btn primary icon" data-type="update" onclick=${() => start_update()}>${tl(trans.update_now)}</button>
                    </div>
                </div>
                <div class="form">
                    <div class="form-group deny">
                        <button class="btn icon" data-type="ignore" onclick=${() => ignore_update()}>${tl(trans.ignore_for_now)}</button>
                    </div>
                </div>
            </div>
        `,
        dismiss: false,
        type: 'update',
        replace_if_possible: true
    });
}

function ignore_update() {
    dialog_rm({
        id: 'bleh_update'
    });
}

export function start_update() {
    open(
        `https://github.com/katelyynn/bleh/refs/heads/${settings.branch ? settings.branch : 'uwu'}/fm/bleh.user.js`
    );

    dialog({
        id: 'bleh_update',
        title: tl(trans.update_to_version).replace(
            '{v}',
            localStorage.getItem('bleh_update_to') || 'unknown'
        ),
        body: html.node`
            <div class="forms">
                <div class="form">
                    <div class="form-group proceed">
                        <button class="btn primary icon" data-type="finish" onclick=${() => finish_update()}>${tl(trans.finish)}</button>
                    </div>
                </div>
            </div>
        `,
        dismiss: false,
        type: 'update',
        replace_if_possible: true
    });
}

function finish_update() {
    dialog({
        id: 'bleh_wait',
        title: tl(trans.update_to_version).replace(
            '{v}',
            localStorage.getItem('bleh_update_to') || 'unknown'
        ),
        body: html.node`
            <div class="loading-data-container">
                <div class="loading-data-text">${tl(trans.downloading_styles)}</div>
            </div>
        `,
        type: 'wait',
        dismiss: false,
        replace_if_possible: true
    });

    // reset update status
    set_storage('bleh_update_required', 'false');
    set_storage('bleh_update_checked', new Date().toString());

    force_refresh_style();
}

export function force_refresh_style() {
    localStorage.removeItem('bleh_cached_style');
    localStorage.removeItem('bleh_cached_style_timeout');

    window.setTimeout(invoke_reload, 400);
}
