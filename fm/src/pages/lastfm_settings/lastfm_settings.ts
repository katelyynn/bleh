//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { auth, page, root } from '@/build/page';
import { tl, trans } from '@/build/trans';
import { bleh_auto_edits } from '@/components/dialog/auto_edit';
import { dialog, dialog_rm } from '@/components/dialog/dialog';
import {
    custom_select,
    select,
    select_prepare,
    update_inbuilt_select
} from '@/components/settings/select';
import { update_inbuilt_item } from '../../config';
import { ff } from '@/components/settings/sku';
import { markdown, markdown_field, markdown_prompt } from '@/components/shared/markdown';
import { html, render } from 'lighterhtml';
import tippy from 'tippy.js';
import { save_setting, setting } from '@/components/settings/settings';
import { settings } from '@/build/config';
import { input } from '@/components/settings/input';
import { clamp_sat, clamp_lit, hex_to_oklch } from '@/build/tools';
import { log } from '@/build/log';
import { toggle } from '@/components/settings/toggle';
import { status } from '@/components/dialog/status';
import { radio, radio_convert } from '@/components/radio/radio_toggle';
import { notify, notify_rm } from '@/components/dialog/notify';
import { avatar } from '@/components/shared/avatar';
import { lastfm_settings_profile } from './profile';

// patch last.fm settings
export function bleh_native_settings() {
    const no_data = page.structure.container.querySelector(':scope > .no-data-message');
    if (no_data) page.structure.main.appendChild(no_data);

    if (page.subpage == 'overview') {
        lastfm_settings_profile();
    } else if (page.subpage == 'privacy') {
        patch_settings_privacy_tab();
    } else if (page.subpage == 'subscription_overview') {
        let panel = page.structure.container.querySelector('.row + div');

        let subscription = panel.querySelector('#current-subscription');
        let edits = panel.querySelector('#automatic-edits');
        let merch_h = panel.querySelector(':scope > h2');
        let merch = panel.querySelector('#mechandise-discount');
        let history = panel.querySelector('#pro-history');

        merch.insertBefore(merch_h, merch.firstElementChild);

        page.structure.main.appendChild(subscription);
        page.structure.main.appendChild(edits);
        page.structure.main.appendChild(merch);
        page.structure.main.appendChild(history);

        let button = subscription.querySelector('.btn-primary');
        if (button)
            button.classList.add('subscription-button', 'icon', 'primary');

        let more_link_wrap = edits.querySelector('.more-link');
        if (more_link_wrap) {
            more_link_wrap.classList = '';
            let edit_buttons = more_link_wrap.querySelectorAll('a');
            edit_buttons.forEach((edit_button, index) => {
                edit_button.classList.add(
                    'btn',
                    'edit-lead-button',
                    'icon',
                    'primary'
                );

                if (index == 0) edit_button.classList.add('edit-album');
                else edit_button.classList.add('edit-track');
            });
        }
    } else if (page.subpage.startsWith('subscription_automatic-edits')) {
        bleh_auto_edits();
    } else if (page.subpage == 'account_overview') {
        bleh_accounts();
    } else if (page.subpage == 'website') {
        bleh_website();
    } else if (page.subpage == 'change-username_overview') {
        bleh_name_change();
    } else if (page.subpage == 'applications_overview') {
        bleh_applications();
    }
}

// privacy
function patch_settings_privacy_tab() {
    let privacy_panel = document.getElementById('privacy');

    // if we can continue, we are on privacy tab
    let token = document.body
        .querySelector('[name="csrfmiddlewaretoken"]')
        .getAttribute('value');

    bleh_communication_panel(token);
    patch_settings_privacy_panel(token, privacy_panel);
}

function bleh_communication_panel(token) {
    let profile_notes =
        JSON.parse(localStorage.getItem('bleh_profile_notes')) || {};

    let panel = page.structure.main.querySelector('#ignorelist');
    panel.classList.add('bleh--panel');

    const alert = panel.querySelector('.alert');

    let list = panel.querySelectorAll('.ignore-list tr');

    let new_list = document.createElement('div');
    new_list.classList.add(
        'generic-table-list',
        'user-vertical-list',
        'take-space'
    );

    let exceeded = false;
    let exceed_amount = 10;
    let amount = 0;

    Array.from(list).reverse().forEach((item, index) => {
        let name = item.querySelector('td').textContent.trim();
        let form = item.querySelector('form');
        let button = form.querySelector('button');

        button.classList.add('btn', 'icon', 'chibi', 'danger-subtle', 'list-action');
        button.setAttribute('data-type', 'x');
        tippy(button, {
            content: tl(trans.remove)
        });

        let entry = html.node`
            <div class="generic-table-list-entry user-vertical-list-item">
                <div class="name">
                    <a class="mention" href="${root}user/${name}" target="_blank">@${name}</a>
                </div>
                <div class="text preview">
                    ${profile_notes.hasOwnProperty(name) ? html.node`
                        <p id="profile-note-row-preview--${name}">${{ html: profile_notes[name] }}</p>
                    ` : ''}
                </div>
                <div class="actions">
                    ${form}
                </div>
            </div>
        `;

        if (index > exceed_amount && !exceeded) exceeded = true;

        if (exceeded) entry.classList.add('entry-is-exceeded');

        new_list.appendChild(entry);
        amount += 1;
    });

    if (exceeded) {
        let remainder = amount - exceed_amount;

        new_list.classList.add('list-is-exceeded');
        new_list.setAttribute('data-expanded', 'false');

        let expand = html.node`
            <button class="see-more expand-down left-icon" onclick=${() => {
                expand.style.display = 'none';
                new_list.setAttribute('data-expanded', 'true');
            }}>
                ${tl(trans.view_count_more).replace('{c}', remainder.toString())}
            </button>
        `;

        new_list.appendChild(expand);
    }

    let form = page.structure.main.querySelector('[name="ignorelist"]');

    if (page.token == '')
        page.token = form
            .querySelector('[name="csrfmiddlewaretoken"]')
            .getAttribute('value');

    render(panel, html`
        <h4>${tl(trans.block_list)}</h4>
        <div class="user-top-panel">
            <div class="user-top-avatar user-top-avatar-side-left">
                <div class="bleh-icon"></div>
            </div>
            <img
                class="user-top-avatar user-top-avatar-main"
                src=${avatar(auth.avatar, 'avatar300s')}
                alt=${auth.name}
            />
            <div class="user-top-avatar user-top-avatar-side-right">
                <div class="bleh-icon"></div>
            </div>
        </div>
        ${alert}
        <div class="setting" data-type="text">
            <div class="heading">
                <h5>${tl(trans.profile)}</h5>
                <form
                    action="${root}settings/privacy#ignorelist"
                    name="ignorelist"
                    method="post"
                >
                    <input
                        type="hidden"
                        name="csrfmiddlewaretoken"
                        value=${page.token}
                    />
                    <div class="input-container">
                        <input
                            type="text"
                            maxlength="80"
                            id="id_user"
                            name="user"
                            placeholder=${tl(trans.enter_username)}
                        />
                        <input
                            type="hidden"
                            name="listaction"
                            value="add"
                        />
                        <input
                            type="hidden"
                            name="submit"
                            value="ignorelist"
                        />
                        <button
                            class="btn primary icon block"
                            type="submit"
                        >
                            ${tl(trans.block)}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <div class="alert alert-info">
            ${tl(trans.blocked_count, { c: amount })}
        </div>
        <div class="setting-group">
            ${new_list}
        </div>
        <div class="sep" />
        <h5>${tl(trans.when_blocked)}</h5>
        <div class="to-consider">
            <ul class="to-consider-good">
                <li>${tl(trans.blocked_user_public)}</li>
                <li>${tl(trans.blocked_user_message)}</li>
                <li>${tl(trans.blocked_user_new_shouts)}</li>
            </ul>
            <ul class="to-consider-bad">
                <li>${tl(trans.blocked_user_old_shouts)}</li>
                <li>${tl(trans.blocked_user_view_profile)}</li>
            </ul>
        </div>
    `);
}

function patch_settings_privacy_panel(token, privacy_panel) {
    privacy_panel.classList.add('bleh--panel');

    // get info before destroying
    let original_privacy_settings = {
        recent_listening: document.getElementById('id_hide_realtime').checked,
        receiving_msgs: document.getElementById('id_message_privacy').outerHTML,
        disable_shoutbox: document.getElementById('id_shoutbox_disabled')
            .checked
    };

    privacy_panel.innerHTML = `
        <h4>${tl(trans.privacy)}</h4>
        <form action="${root}settings/privacy" name="privacy" method="post">
            <input type="hidden" name="csrfmiddlewaretoken" value="${token}">
            <div class="inner-preview pad">
                <div class="tracks recent_listening">
                    <div class="track realtime">
                        <div class="cover"></div>
                        <div class="title"></div>
                        <div class="artist"></div>
                        <div class="time"></div>
                    </div>
                    <div class="track">
                        <div class="cover"></div>
                        <div class="title"></div>
                        <div class="artist"></div>
                        <div class="time"></div>
                    </div>
                    <div class="track">
                        <div class="cover"></div>
                        <div class="title"></div>
                        <div class="artist"></div>
                        <div class="time"></div>
                    </div>
                    <div class="track">
                        <div class="cover"></div>
                        <div class="title"></div>
                        <div class="artist"></div>
                        <div class="time"></div>
                    </div>
                    <div class="track">
                        <div class="cover"></div>
                        <div class="title"></div>
                        <div class="artist"></div>
                        <div class="time"></div>
                    </div>
                </div>
            </div>
            <div class="setting-group">
                <div class="setting" data-type="toggle" onclick="_update_inbuilt_item('recent_listening')" id="container-recent_listening">
                    <button class="btn reset" onclick="_reset_inbuilt_item('recent_listening')">Reset to default</button>
                    <div class="heading">
                        <h5>${tl(trans.recent_listening.name)}</h5>
                        <p>${tl(trans.recent_listening.body)}</p>
                    </div>
                    <div class="toggle-wrap">
                        <input class="companion-checkbox" type="checkbox" name="hide_realtime" id="inbuilt-companion-checkbox-recent_listening">
                        <span class="btn toggle colourful" id="toggle-recent_listening" aria-checked="false">
                            <div class="dot"></div>
                        </span>
                    </div>
                </div>
                <div class="setting" data-type="options">
                    <div class="heading">
                        <h5>${tl(trans.allow_messages_from)}</h5>
                    </div>
                    <div class="primary-selections">
                        ${original_privacy_settings.receiving_msgs}
                        <div class="btn primary-selection" id="primary-selection-receiving_msgs-everyone" onclick="_update_inbuilt_selection('id_message_privacy', 0)">
                            <h5>${tl(trans.everyone)}</h5>
                        </div>
                        <div class="btn primary-selection" id="primary-selection-receiving_msgs-neighbours" onclick="_update_inbuilt_selection('id_message_privacy', 1)">
                            <h5>${tl(trans.following_and_neighbours)}</h5>
                        </div>
                        <div class="btn primary-selection" id="primary-selection-receiving_msgs-follow" onclick="_update_inbuilt_selection('id_message_privacy', 2)">
                            <h5>${tl(trans.following)}</h5>
                        </div>
                    </div>
                </div>
            </div>
            <div class="inner-preview pad">
                <div class="shouts">
                    <div class="shout-preview">
                        <div class="avatar-side">
                            <div class="shout-avatar-placeholder"></div>
                        </div>
                        <div class="info-side">
                            <div class="header">
                                <div class="shout-username"></div>
                                <div class="shout-time"></div>
                            </div>
                            <div class="shout-contents"></div>
                            <div class="shout-contents"></div>
                        </div>
                    </div>
                    <div class="shout-preview">
                        <div class="avatar-side">
                            <div class="shout-avatar-placeholder"></div>
                        </div>
                        <div class="info-side">
                            <div class="header">
                                <div class="shout-username"></div>
                                <div class="shout-time"></div>
                            </div>
                            <div class="shout-contents"></div>
                            <div class="shout-contents"></div>
                        </div>
                    </div>
                    <div class="shout-preview">
                        <div class="avatar-side">
                            <div class="shout-avatar-placeholder"></div>
                        </div>
                        <div class="info-side">
                            <div class="header">
                                <div class="shout-username"></div>
                                <div class="shout-time"></div>
                            </div>
                            <div class="shout-contents"></div>
                            <div class="shout-contents"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="setting-group">
                <div class="setting" data-type="toggle" onclick="_update_inbuilt_item('disable_shoutbox')" id="container-disable_shoutbox">
                    <button class="btn reset" onclick="_reset_inbuilt_item('disable_shoutbox')">Reset to default</button>
                    <div class="heading">
                        <h5>${tl(trans.close_shouts.name)}</h5>
                        <p>${tl(trans.close_shouts.body)}</p>
                    </div>
                    <div class="toggle-wrap">
                        <input class="companion-checkbox" type="checkbox" name="shoutbox_disabled" id="inbuilt-companion-checkbox-disable_shoutbox">
                        <span class="btn toggle colourful" id="toggle-disable_shoutbox" aria-checked="false">
                            <div class="dot"></div>
                        </span>
                    </div>
                </div>
            </div>
            <div class="settings-footer">
                <button type="submit" class="btn-primary save">
                    ${tl(trans.save)}
                </button>
                <input type="hidden" value="privacy" name="submit">
            </div>
        </form>
    `;

    for (let setting in original_privacy_settings) {
        update_inbuilt_item(setting, original_privacy_settings[setting], false);
    }

    let selects = document.body.querySelectorAll('select');
    selects.forEach((select) => {
        select.setAttribute(
            'onchange',
            `_update_inbuilt_select('${select.getAttribute('id')}', this.value)`
        );
        update_inbuilt_select(select.getAttribute('id'), select.value);
    });
}

function bleh_accounts() {
    let token = page.structure.main
        .querySelector('[name="csrfmiddlewaretoken"]')
        .getAttribute('value');

    // get info before destroying
    let original_settings = {
        email_language: page.structure.main.querySelector('[name="language"]'),
        marketing_emails: page.structure.main.querySelector(
            '[name="opt_in_marketing"]'
        ),
        email: page.structure.main.querySelector('[name="email"]').value,
        captcha: page.structure.main.querySelector('.lfm-recaptcha')
    };

    const alert = update_profile.querySelector('.alert');

    render(
        page.structure.main,
        html`
            <section class="bleh--panel">
                <h4>${tl(trans.information)}</h4>
                ${alert}
                <div class="setting-group">
                    <form
                        action="${root}settings/change-username/send-email"
                        method="post"
                    >
                        <input
                            type="hidden"
                            name="csrfmiddlewaretoken"
                            value="${token}"
                        />
                        <div class="setting" data-type="text">
                            <div class="heading">
                                <h5>${tl(trans.username.name)}</h5>
                                <p>
                                    ${{
                                        html: tl(trans.username.body)
                                            .replace(
                                                '{a}',
                                                `<a href="https://support.last.fm/" target="_blank">`
                                            )
                                            .replace('{/a}', '</a>')
                                    }}
                                </p>
                            </div>
                            <div class="input-container content-form">
                                <input
                                    id="id_current_username"
                                    type="text"
                                    name="current_username"
                                    value="${auth.name}"
                                    disabled
                                    required
                                />
                                <button class="btn chibi icon primary submit">
                                    ${tl(trans.send)}
                                </button>
                                <input
                                    type="hidden"
                                    value="change_username"
                                    name="submit"
                                />
                            </div>
                        </div>
                    </form>
                    <form
                        action="${root}settings/account"
                        name="change-email"
                        method="post"
                    >
                        <input
                            type="hidden"
                            name="csrfmiddlewaretoken"
                            value="${token}"
                        />
                        <div class="setting" data-type="text">
                            <div class="heading">
                                <h5>${tl(trans.email)}</h5>
                            </div>
                            <div class="input-container content-form">
                                <input
                                    id="id_email"
                                    type="text"
                                    name="email"
                                    value="${original_settings.email}"
                                    required
                                />
                                <button class="btn chibi icon primary submit">
                                    ${tl(trans.save)}
                                </button>
                                <input
                                    type="hidden"
                                    value="email_update"
                                    name="submit"
                                />
                            </div>
                        </div>
                    </form>
                </div>
                <form
                    class="password-container"
                    action="${root}settings/account/password#change-password"
                    name="change-password"
                    method="post"
                >
                    <input
                        type="hidden"
                        name="csrfmiddlewaretoken"
                        value="${token}"
                    />
                    <div class="setting-group">
                        <div class="setting" data-type="text">
                            <div class="heading">
                                <h5>${tl(trans.password)}</h5>
                            </div>
                            <div class="input-container content-form">
                                <input
                                    id="id_password"
                                    type="password"
                                    name="password"
                                    required
                                />
                            </div>
                        </div>
                        <div class="setting" data-type="text">
                            <div class="heading">
                                <h5>${tl(trans.new_password)}</h5>
                            </div>
                            <div class="input-container content-form">
                                <input
                                    id="id_new_password"
                                    type="password"
                                    name="new_password"
                                    required
                                />
                            </div>
                        </div>
                        <div class="setting" data-type="text">
                            <div class="heading">
                                <h5>${tl(trans.confirm_password)}</h5>
                            </div>
                            <div class="input-container content-form">
                                <input
                                    id="id_new_password_confirmation"
                                    type="password"
                                    name="new_password_confirmation"
                                    required
                                />
                            </div>
                        </div>
                        ${original_settings.captcha}
                    </div>
                    <div class="settings-footer end">
                        <button class="btn-primary save" type="submit">
                            ${tl(trans.change)}
                        </button>
                    </div>
                </form>
            </section>
            <section class="bleh--panel">
                <h4>${tl(trans.communication)}</h4>
                <form
                    action="${root}settings/account"
                    name="email-settings"
                    method="post"
                >
                    <input
                        type="hidden"
                        name="csrfmiddlewaretoken"
                        value="${token}"
                    />
                    <div class="setting-group">
                        <div class="setting" data-type="select">
                            <div class="heading">
                                <h5>${tl(trans.email_language)}</h5>
                            </div>
                            <div class="select-wrap custom-selector">
                                ${select(
                                    select_prepare(
                                        original_settings.email_language
                                    ),
                                    original_settings.email_language.value,
                                    original_settings.email_language.name
                                )}
                            </div>
                        </div>
                        ${toggle({
                            value: original_settings.marketing_emails.checked,
                            name: original_settings.marketing_emails.name,
                            title: tl(trans.marketing_emails.name),
                            body: tl(trans.marketing_emails.body),
                            standalone: false
                        })}
                    </div>
                    <div class="settings-footer end">
                        <button class="btn-primary save" type="submit">
                            ${tl(trans.save)}
                        </button>
                        <input
                            type="hidden"
                            value="email_settings"
                            name="submit"
                        />
                    </div>
                </form>
            </section>
            <section class="bleh--panel">
                <h4>${tl(trans.security)}</h4>
                <form
                    action="${root}settings/account"
                    name="email-settings"
                    method="post"
                >
                    <input
                        type="hidden"
                        name="csrfmiddlewaretoken"
                        value="${token}"
                    />
                    <div class="setting-group">
                        <div class="setting" data-type="action">
                            <div class="heading">
                                <h5>${tl(trans.logout_everywhere)}</h5>
                            </div>
                            <div class="toggle-wrap">
                                <a
                                    class="see-more danger logout left-icon"
                                    href="${root}settings/account/logout-everywhere"
                                >
                                    ${tl(trans.logout)}
                                </a>
                            </div>
                        </div>
                        <div class="setting" data-type="action">
                            <div class="heading">
                                <h5>${tl(trans.delete_account.name)}</h5>
                                <p>${tl(trans.delete_account.body)}</p>
                            </div>
                            <div class="toggle-wrap">
                                <a
                                    class="see-more danger delete-account left-icon"
                                    href="${root}settings/account/delete"
                                >
                                    ${tl(
                                        trans.delete_account_permanently
                                    ).replace('{u}', auth.name)}
                                </a>
                            </div>
                        </div>
                    </div>
                </form>
            </section>
        `
    );

    for (let setting in original_settings) {
        update_inbuilt_item(setting, original_settings[setting], false);
    }
}
function bleh_name_change() {
    let token = page.structure.row
        .querySelector('[name="csrfmiddlewaretoken"]')
        .getAttribute('value');

    return;
}

function bleh_website() {
    const token = page.structure.row
        .querySelector('[name="csrfmiddlewaretoken"]')
        .getAttribute('value');

    const auto_correct = page.structure.main.querySelector(
        '[name="corrections_enabled"]:checked'
    );

    const preferred_affiliate = page.structure.main.querySelector(
        '[name="preferred_affiliate"]:checked'
    );

    const timezone = page.structure.main.querySelector('[name="timezone"]');
    const help_text = page.structure.main.querySelector('.js-field-help-text');

    const location = page.structure.main.querySelector(
        '[data-require="components/location-form-field-v2"]'
    );

    const radius = page.structure.main.querySelector('[name="event_radius"]');

    let timezone_text;
    page.structure.main.insertBefore(
        html.node`
            <form class="dont-move" action="${root}settings/website" method="post">
                <input type="hidden" name="csrfmiddlewaretoken" value="${token}">
                <section class="bleh--panel">
                    <h4>${tl(trans.website)}</h4>
                    <div class="setting-group">
                        <div class="setting v2" data-type="options">
                            <div class="heading">
                                <h5>${tl(trans.auto_correct_scrobbles.name)}</h5>
                                <p>${tl(trans.auto_correct_scrobbles.body)}</p>
                            </div>
                            ${radio({
                                name: auto_correct.name,
                                value: auto_correct.value,
                                values: {
                                    False: {
                                        name: tl(
                                            trans.auto_correct_scrobbles.false
                                        )
                                    },
                                    True: {
                                        name: tl(
                                            trans.auto_correct_scrobbles.true
                                        )
                                    }
                                }
                            })}
                        </div>
                    </div>
                    <div class="alert alert-danger">
                        ${tl(trans.auto_correct_scrobbles.warning)}
                    </div>
                </section>
                <section class="bleh--panel">
                    <h4>${tl(trans.events)}</h4>
                    <div class="setting-group">
                        <div class="setting v2" data-type="select">
                            <div class="heading">
                                <h5>${tl(trans.timezone)}</h5>
                                <p ref=${(el) => (timezone_text = el)}>${help_text.textContent.trim()}</p>
                            </div>
                            ${select(
                                select_prepare(timezone),
                                timezone.value,
                                timezone.name,
                                (val) => {
                                    fetch(
                                        `${root}settings/partial/timezone-help-text?tz=${val}&ajax=1`
                                    )
                                        .then((res) => res.text())
                                        .then((dom) => {
                                            const parser = new DOMParser();
                                            const doc = parser.parseFromString(
                                                dom,
                                                'text/html'
                                            );

                                            const text = doc.querySelector('p');
                                            if (!text) return;

                                            timezone_text.textContent =
                                                text.textContent;
                                        })
                                        .catch((e) =>
                                            log(
                                                'unable to get text',
                                                'timezone',
                                                'error',
                                                { e }
                                            )
                                        );
                                }
                            )}
                        </div>
                        <div class="setting v2" data-type="action">
                            <div class="heading">
                                <h5>${tl(trans.location.name)}</h5>
                                <p>${tl(trans.location.body)}</p>
                            </div>
                            <div class="toggle-wrap">
                                ${location}
                            </div>
                        </div>
                        <div class="setting v2" data-type="select">
                            <div class="heading">
                                <h5>${tl(trans.event_radius)}</h5>
                            </div>
                            ${select(select_prepare(radius), radius.value, radius.name)}
                        </div>
                    </div>
                    <div class="settings-footer end">
                        <button type="submit" class="btn-primary save">
                            ${tl(trans.save)}
                        </button>
                        <input type="hidden" value="website" name="submit">
                    </div>
                </section>
            </form>
            <section class="bleh--panel">
                <h4>${tl(trans.playback)}</h4>
                <form action="${root}settings/website" method="post">
                    <input type="hidden" name="csrfmiddlewaretoken" value=${token}>
                    <div class="setting-group">
                        <div class="setting v2" data-type="options">
                            <div class="heading">
                                <h5>${tl(trans.preferred_affiliate.name)}</h5>
                                <p>${tl(trans.preferred_affiliate.body)}</p>
                            </div>
                            ${radio({
                                name: preferred_affiliate.name,
                                value: preferred_affiliate.value,
                                values: radio_convert(
                                    page.structure.main.querySelectorAll(
                                        '#id_preferred_affiliate > .lfm-form-radio'
                                    )
                                )
                            })}
                        </div>
                    </div>
                    <div class="settings-footer end">
                        <button type="submit" class="btn-primary save">
                            ${tl(trans.save)}
                        </button>
                        <input type="hidden" value="playback" name="submit">
                    </div>
                </form>
            </section>
        `,
        page.structure.main.firstElementChild
    );

    const website = page.structure.main.querySelector('#website');
    website.remove();

    const playback = page.structure.main.querySelector('#playback');
    playback.remove();
}

function bleh_applications() {
    let session_types = page.structure.main.querySelectorAll('.api-sessions');

    let suggested;
    let connected;

    if (session_types.length > 1) {
        suggested = session_types[0];
        connected = session_types[1];
    } else {
        connected = session_types[0];
    }

    render(
        page.structure.main,
        html`
            <section class="applications">
                <div class="section-intro">
                    <h3>${tl(trans.applications)}</h3>
                    <p>${tl(trans.applications_intro)}</p>
                </div>
                ${suggested ?
                    html`
                        <h2>${tl(trans.suggested)}</h2>
                        ${suggested}
                    `
                :   ''}
                <h2>${tl(trans.connected)}</h2>
                ${connected}
            </section>
        `
    );

    session_types.forEach((session_type) => {
        let sessions = session_type.querySelectorAll('.api-session');

        sessions.forEach((session) => {
            const details = session.querySelector('.api-session-details');
            const form = session.querySelector('form');

            const button = form.querySelector('button');
            button.classList.add('chibi');

            tippy(button, {
                content: button.textContent
            });

            const name = details.querySelector('.api-session-app-name');
            const desc = details.querySelector('.api-session-app-description');
            const status = details.querySelector('.api-session-status');
            const image = details.querySelector('.api-session-app-image');

            image.classList = '';

            const default_image = image.src.endsWith(
                '14d19fbdca555c1782176cd789e81af7.png'
            );

            render(
                session,
                html`
                    <div class="session-header">
                        <div
                            class="session-image"
                            data-default-image=${default_image}
                        >
                            ${image}
                        </div>
                        <div class="session-details">${name} ${desc}</div>
                        ${form}
                    </div>
                    ${status ?
                        html.node`
                <div class="session-footer">
                    ${status}
                </div>
                `
                    :   ''}
                `
            );
        });
    });
}
