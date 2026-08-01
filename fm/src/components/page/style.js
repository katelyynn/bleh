//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { html } from 'lighterhtml';
import { settings } from '@/build/config';
import { log } from '@/build/log';
import { tl, trans } from '@/build/trans';
import { chart_reflow } from '@/components/music/chart';
import { dialog, dialog_rm } from '@/components/dialog/dialog';
import { invoke_reload } from '@/config';
import { version } from '@/main';
import { download_with_progress, set_storage } from '@/build/tools';
import cropper_css from 'cropperjs/dist/cropper.min.css' with { type: 'text' };
import css from '@/styles/index.css' with { type: 'text' };
import { root } from '@/build/page';
import { keys } from '../settings/storage';
import { reset_update_status } from './update';
import { ff } from '../settings/sku';

export function append_style() {
    document.documentElement.classList.add('florence-supports-loading');

    for (var member in settings) delete settings[member];
    Object.assign(settings, JSON.parse(localStorage.getItem('bleh')));

    const split = window.location.pathname.replace(root, '').split('/');
    const length = split.length - 1;

    // style is neither fetched nor applied in these interfaces
    if (split[0] == 'labs' && split[length] != 'labs') {
        log('disabled loading for special interface', 'style');
        return;
    }

    document.documentElement.setAttribute('data-bleh--theme', settings.theme);
    document.documentElement.appendChild(
        html.node`<style>${cropper_css}</style>`
    );

    if (settings.dev) return;

    const style = html.node`
        <style id="bleh--cached-style">${css}</style>
    `;
    document.documentElement.appendChild(style);

    style.onload = () => {
        log('loaded', 'style');
        chart_reflow();
    };
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
    })
        .then(async (blob) => {
            const text = await blob.text();

            if (btn) btn.removeAttribute('disabled');

            try {
                let data = JSON.parse(text);
                console.log(data);

                let update_required = update_comparison(version.build, data.build);
                set_storage(keys.update_required, update_required.toString());
                set_storage(keys.update_to_version, data.build);
                set_storage(keys.update_checked_date, new Date().toString());

                let next = new Date();
                next.setHours(next.getHours() + 2);

                set_storage(keys.update_next_check_date, next.toString());
                log('update check finished', 'update', 'info', {
                    next_in: next,
                    current_time: new Date()
                });

                if (func) func(true);
            } catch (e) {
                log('error parsing', 'update', 'error', { error: e });
                if (func) func(false, e);
            }
        })
        .catch(e => {
            log('error downloading', 'update', 'error', { error: e });

            if (btn) btn.removeAttribute('disabled');

            if (func) func(false, e);
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
    open(`https://github.com/katelyynn/bleh/raw/refs/heads/uwu/fm/bleh.user.js?${Math.random()}`);

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

        `,
        type: 'wait',
        dismiss: false,
        replace_if_possible: true
    });

    // reset update status
    reset_update_status();

    invoke_reload();
}


export function remove_lastfm_styles() {
    if (!ff('hutao')) return;

    if (!document.head) return;

    const styles = document.head.querySelectorAll('link[rel="stylesheet"]');
    styles.forEach(style => {
        const name = style.getAttribute('data-stylesheet-name');
        if (!name) return; // assume its not last.fm-provided

        log('removed style entry', 'style', 'log', { name, style });
        style.remove();
    });
}
