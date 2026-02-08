//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { html } from 'lighterhtml';
import { settings } from '../build/config';
import { auth, page, root } from '../build/page';
import { tl, trans } from '../build/trans';
import { dialog, dialog_rm } from './dialog';
import { notify } from './notify';
import { save_setting, setting } from './settings.js';
import tippy from 'tippy.js';
import { set_storage } from '../build/tools.js';

unsafeWindow._open_profile_shortcut_window = function () {
    open_profile_shortcut_window();
};
export function open_profile_shortcut_window() {
    let modal = dialog({
        id: 'profile_shortcut',
        title: tl(trans.profile_shortcut.name),
        body: html.node`
            ${setting({ id: 'profile_shortcut', text: false, focus: true, standalone: true })}
        `
    });

    modal.querySelector('#text-profile_shortcut').focus();
}

unsafeWindow._other_listener = function (id) {
    other_listener(id);
};
export function other_listener(id) {
    let input;
    let submit;

    dialog({
        id: 'other_listener',
        title: tl(trans.view_others_library),
        body: html.node`
        <div class="setting standalone" data-type="text">
            <div class="avatar-container">
                <div class="avatar-inner avatar--bleh-missing">
                    <img>
                </div>
            </div>
            <div class="input-container content-form">
                <input type="text" maxlength="40" id="text-profile" ref=${(el) => (input = el)} placeholder="${tl(trans.enter_username)}">
                <button class="btn chibi icon primary submit" ref=${(el) => (submit = el)} onclick=${() => {
                    let name = input.value;
                    let link = id;

                    dialog_rm({
                        id: 'other_listener'
                    });
                    window.location.href = `${root}user/${name}/library/music/${link}`;
                }}>${tl(trans.done)}</button>
            </div>
        </div>
        `
    });

    input.addEventListener('keydown', (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            submit.click();
        }
    });

    tippy(submit, {
        content: tl(trans.save)
    });

    input.focus();
}

export function set_profile_as_shortcut() {
    dialog({
        id: 'profile_shortcut',
        title: tl(trans.profile_shortcut.name),
        body: html.node`
            <div class="big-modal-alert alert-danger">
                ${{ html: tl(trans.profile_shortcut.notice).replace('{u}', `<a class="mention" href="${root}user/${settings.profile_shortcut}" target="_blank">@${settings.profile_shortcut}</a>`) }}
            </div>
            <div class="modal-footer">
                <button class="see-more cancel" onclick=${() => dialog_rm({ id: 'profile_shortcut' })}>
                    ${tl(trans.back)}
                </button>
                <div class="fill"></div>
                <button class="btn primary save" onclick=${() => confirm_set_profile_as_shortcut()}>
                    ${tl(trans.replace)}
                </button>
            </div>
        `
    });
}

function confirm_set_profile_as_shortcut() {
    dialog_rm({
        id: 'profile_shortcut'
    });

    let avatar_src = page.structure.container
        .querySelector(':scope > .redesigned-profile-header .avatar img')
        ?.getAttribute('src');
    set_storage('bleh_profile_shortcut_avi', avatar_src);
    notify({
        id: 'profile_shortcut_saved',
        title: tl(trans.profile_shortcut.name),
        body: tl(trans.profile_shortcut.linked).replace('{u}', page.name),
        icon: 'icon-16-profile-shortcut'
    });

    // show on button
    page.state.profile_shortcut_button.setAttribute('data-is-shortcut', 'true');
    page.state.profile_shortcut_button.removeAttribute('onclick');

    // save to settings
    save_setting('profile_shortcut', page.name);
}

export function save_profile_shortcut(input, value, submit, reset_btn, avatar) {
    if (value == '' || value == auth.name) {
        localStorage.removeItem('bleh_profile_shortcut_avi');
        avatar.querySelector('img').setAttribute('src', '');
        avatar.querySelector('img').setAttribute('alt', '');

        reset_btn.disabled = false;
        input.disabled = false;
        submit.disabled = false;
        save_setting('profile_shortcut', '');
        return;
    }

    avatar.classList.add('requesting');

    fetch(`${root}user/${value}/tags`)
        .then(function (response) {
            console.log('returned', response, response.text);

            return response.text();
        })
        .then(function (dom) {
            let doc = new DOMParser().parseFromString(dom, 'text/html');
            console.log('DOC', doc);

            reset_btn.disabled = false;
            input.disabled = false;
            submit.disabled = false;
            avatar.classList.remove('requesting');

            try {
                let avatar_src = doc
                    .querySelector('.header-avatar-inner-wrap img')
                    .getAttribute('src');

                set_storage('bleh_profile_shortcut_avi', avatar_src);
                avatar.querySelector('img').setAttribute('src', avatar_src);
                avatar.querySelector('img').setAttribute('alt', value);

                notify({
                    id: 'profile_shortcut_saved',
                    title: tl(trans.profile_shortcut.name),
                    body: tl(trans.profile_shortcut.linked).replace(
                        '{u}',
                        value
                    ),
                    icon: 'icon-16-profile-shortcut'
                });

                // save to settings
                save_setting('profile_shortcut', value);
            } catch (e) {
                notify({
                    id: 'profile_shortcut_error',
                    title: tl(trans.profile_shortcut.name),
                    body: tl(trans.failed_to_find_profile),
                    type: 'error'
                });
                localStorage.removeItem('bleh_profile_shortcut_avi');
                avatar.querySelector('img').setAttribute('src', '');
                avatar.querySelector('img').setAttribute('alt', '');
            }
        });
}

unsafeWindow._save_profile_shortcut = function () {
    let profile_name = document.getElementById('text-profile_shortcut').value;
    let profile_img = document.getElementById('avatar-profile_shortcut');

    if (profile_name == '' || profile_name == auth.name) {
        localStorage.removeItem('bleh_profile_shortcut_avi');
        document
            .getElementById('avatar_src-profile_shortcut')
            .setAttribute('src', '');

        // save to settings
        save_setting('profile_shortcut', '');

        return;
    }

    profile_img.classList.add('requesting');

    fetch(`${root}user/${profile_name}/tags`)
        .then(function (response) {
            console.log('returned', response, response.text);

            return response.text();
        })
        .then(function (html) {
            let doc = new DOMParser().parseFromString(html, 'text/html');
            console.log('DOC', doc);

            profile_img.classList.remove('requesting');

            try {
                let avatar_src = doc
                    .querySelector('.header-avatar-inner-wrap img')
                    .getAttribute('src');
                set_storage('bleh_profile_shortcut_avi', avatar_src);
                document
                    .getElementById('avatar_src-profile_shortcut')
                    .setAttribute('src', avatar_src);
                notify({
                    id: 'profile_shortcut_saved',
                    title: tl(trans.profile_shortcut.name),
                    body: tl(trans.profile_shortcut.linked).replace(
                        '{u}',
                        profile_name
                    ),
                    icon: 'icon-16-profile-shortcut'
                });

                // save to settings
                save_setting('profile_shortcut', profile_name);
            } catch (e) {
                notify({
                    id: 'profile_shortcut_saved',
                    title: tl(trans.profile_shortcut.name),
                    body: tl(trans.failed_to_find_profile),
                    type: 'error'
                });
                localStorage.removeItem('bleh_profile_shortcut_avi');
                document
                    .getElementById('avatar_src-profile_shortcut')
                    .setAttribute('src', '');
            }
        });
};
