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
import { update_inbuilt_item } from '../config';
import { ff } from '@/components/settings/sku';
import { markdown, markdown_field, markdown_prompt } from '@/components/shared/markdown';
import { html, render } from 'lighterhtml';
import tippy from 'tippy.js';
import Cropper from 'cropperjs';
import { save_setting, setting } from '@/components/settings/settings';
import { settings, settings_store } from '@/build/config';
import { input } from '@/components/settings/input';
import { hex_to_hsl } from '@/build/tools';
import { log } from '@/build/log';
import { toggle } from '@/components/settings/toggle';
import { status } from '@/components/dialog/status';
import { radio, radio_convert } from '@/components/radio/radio_toggle';
import { notify, notify_rm } from '@/components/dialog/notify';

let cropper;

// patch last.fm settings
export function bleh_native_settings() {
    const no_data = page.structure.container.querySelector(':scope > .no-data-message');
    if (no_data) page.structure.main.appendChild(no_data);

    if (page.subpage == 'overview') {
        patch_settings_profile_tab();
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

function patch_settings_profile_tab() {
    let update_picture = page.structure.main.querySelector('#update-picture');
    if (!update_picture) return;

    // if we can continue, we are on profile tab
    let token = document.body
        .querySelector('[name="csrfmiddlewaretoken"]')
        .getAttribute('value');

    patch_settings_profile_panel(token, update_picture);
    patch_settings_charts_panel(token);
}

function patch_settings_charts_panel(token) {
    let charts_panel = document.getElementById('update-chart');

    if (charts_panel.hasAttribute('data-kate-processed')) return;

    charts_panel.setAttribute('data-kate-processed', 'true');
    charts_panel.classList.add('bleh--panel');

    // get info before destroying
    let original_chart_settings = {
        recent: {
            recent_artwork: document.getElementById(
                'id_show_recent_tracks_artwork'
            ).checked,
            count: document.getElementById('id_chart_length_recent_tracks')
                .outerHTML,
            recent_realtime: document.getElementById(
                'id_auto_refresh_recent_tracks'
            ).checked
        },
        artists: {
            timeframe: document.getElementById('id_chart_range_top_artists')
                .outerHTML,
            style: document.getElementById(
                'id_chart_style_and_length_top_artists'
            ).outerHTML
        },
        albums: {
            timeframe: document.getElementById('id_chart_range_top_albums')
                .outerHTML,
            style: document.getElementById(
                'id_chart_style_and_length_top_albums'
            ).outerHTML
        },
        tracks: {
            count: document.getElementById('id_chart_length_top_tracks')
                .outerHTML,
            timeframe: document.getElementById('id_chart_range_top_tracks')
                .outerHTML
        }
    };

    charts_panel.innerHTML = `
        <h4>${tl(trans.recent_tracks)}</h4>
        <form action="${root}settings#update-chart" name="chart-form" method="post">
            <input type="hidden" name="csrfmiddlewaretoken" value="${token}">
            <div class="inner-preview pad">
                <div class="tracks recent">
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
                <div class="setting" data-type="select">
                    <div class="heading">
                        <h5>${tl(trans.amount_to_display)}</h5>
                    </div>
                    <div class="select-wrap custom-selector" id="id_chart_length_recent_tracks_select">
                        ${original_chart_settings.recent.count}
                    </div>
                </div>
                <div class="setting" data-type="toggle" onclick="_update_inbuilt_item('recent_artwork')" id="container-recent_artwork">
                    <button class="btn reset" onclick="_reset_inbuilt_item('recent_artwork')">Reset to default</button>
                    <div class="heading">
                        <h5>${tl(trans.recent_artwork)}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <input class="companion-checkbox" type="checkbox" name="show_recent_tracks_artwork" id="inbuilt-companion-checkbox-recent_artwork">
                        <span class="btn toggle" id="toggle-recent_artwork" aria-checked="false">
                            <div class="dot"></div>
                        </span>
                    </div>
                </div>
                <div class="setting" data-type="toggle" onclick="_update_inbuilt_item('recent_realtime')" id="container-recent_realtime">
                    <button class="btn reset" onclick="_reset_inbuilt_item('recent_realtime')">Reset to default</button>
                    <div class="heading">
                        <h5>${tl(trans.recent_realtime.name)}</h5>
                        <p>${tl(trans.recent_realtime.body)}</p>
                    </div>
                    <div class="toggle-wrap">
                        <input class="companion-checkbox" type="checkbox" name="auto_refresh_recent_tracks" id="inbuilt-companion-checkbox-recent_realtime">
                        <span class="btn toggle" id="toggle-recent_realtime" aria-checked="false">
                            <div class="dot"></div>
                        </span>
                    </div>
                </div>
            </div>
            <h4>${tl(trans.top_artists)}</h4>
            <div class="inner-preview pad">
                <div class="item-grid artist">
                    <div class="grid-primary artist">
                        <div class="grid-item"></div>
                    </div>
                    <div class="grid-mains">
                        <div class="grid-main artist">
                            <div class="grid-item grid-item--extra artist"></div>
                            <div class="grid-item grid-item--extra artist"></div>
                            <div class="grid-item"></div>
                            <div class="grid-item"></div>
                        </div>
                        <div class="grid-main artist">
                            <div class="grid-item grid-item--extra artist"></div>
                            <div class="grid-item grid-item--extra artist"></div>
                            <div class="grid-item"></div>
                            <div class="grid-item"></div>
                        </div>
                    </div>
                </div>
                <div class="tracks artist">
                    <div class="track">
                        <div class="cover"></div>
                        <div class="title"></div>
                        <div class="bar">
                            <div class="fill" style="width: 100%"></div>
                        </div>
                    </div>
                    <div class="track">
                        <div class="cover"></div>
                        <div class="title"></div>
                        <div class="bar">
                            <div class="fill" style="width: 85%"></div>
                        </div>
                    </div>
                    <div class="track">
                        <div class="cover"></div>
                        <div class="title"></div>
                        <div class="bar">
                            <div class="fill" style="width: 60%"></div>
                        </div>
                    </div>
                    <div class="track">
                        <div class="cover"></div>
                        <div class="title"></div>
                        <div class="bar">
                            <div class="fill" style="width: 30%"></div>
                        </div>
                    </div>
                    <div class="track">
                        <div class="cover"></div>
                        <div class="title"></div>
                        <div class="bar">
                            <div class="fill" style="width: 5%"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="setting-group">
                <div class="setting" data-type="select">
                    <div class="heading">
                        <h5>${tl(trans.default_timeframe)}</h5>
                    </div>
                    <div class="select-wrap custom-selector" id="id_chart_range_top_artists_select">
                        ${original_chart_settings.artists.timeframe}
                    </div>
                </div>
                <div class="setting" data-type="select">
                    <div class="heading">
                        <h5>${tl(trans.chart_style)}</h5>
                    </div>
                    <div class="select-wrap custom-selector" id="id_chart_style_and_length_top_artists_select">
                        ${original_chart_settings.artists.style}
                    </div>
                </div>
            </div>
            <h4>${tl(trans.top_albums)}</h4>
            <div class="inner-preview pad">
                <div class="item-grid album">
                    <div class="grid-primary album">
                        <div class="grid-item"></div>
                    </div>
                    <div class="grid-mains">
                        <div class="grid-main album">
                            <div class="grid-item"></div>
                            <div class="grid-item"></div>
                            <div class="grid-item grid-item--extra album"></div>
                            <div class="grid-item grid-item--extra album"></div>
                        </div>
                        <div class="grid-main album">
                            <div class="grid-item"></div>
                            <div class="grid-item"></div>
                            <div class="grid-item grid-item--extra album"></div>
                            <div class="grid-item grid-item--extra album"></div>
                        </div>
                    </div>
                </div>
                <div class="tracks album">
                    <div class="track">
                        <div class="cover"></div>
                        <div class="title"></div>
                        <div class="bar">
                            <div class="fill" style="width: 100%"></div>
                        </div>
                    </div>
                    <div class="track">
                        <div class="cover"></div>
                        <div class="title"></div>
                        <div class="bar">
                            <div class="fill" style="width: 85%"></div>
                        </div>
                    </div>
                    <div class="track">
                        <div class="cover"></div>
                        <div class="title"></div>
                        <div class="bar">
                            <div class="fill" style="width: 60%"></div>
                        </div>
                    </div>
                    <div class="track">
                        <div class="cover"></div>
                        <div class="title"></div>
                        <div class="bar">
                            <div class="fill" style="width: 30%"></div>
                        </div>
                    </div>
                    <div class="track">
                        <div class="cover"></div>
                        <div class="title"></div>
                        <div class="bar">
                            <div class="fill" style="width: 5%"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="setting-group">
                <div class="setting" data-type="select">
                    <div class="heading">
                        <h5>${tl(trans.default_timeframe)}</h5>
                    </div>
                    <div class="select-wrap custom-selector" id="id_chart_range_top_albums_select">
                        ${original_chart_settings.albums.timeframe}
                    </div>
                </div>
                <div class="setting" data-type="select">
                    <div class="heading">
                        <h5>${tl(trans.chart_style)}</h5>
                    </div>
                    <div class="select-wrap custom-selector" id="id_chart_style_and_length_top_albums_select">
                        ${original_chart_settings.albums.style}
                    </div>
                </div>
            </div>
            <h4>${tl(trans.top_tracks)}</h4>
            <div class="inner-preview pad">
                <div class="tracks">
                    <div class="track">
                        <div class="cover"></div>
                        <div class="title"></div>
                        <div class="artist"></div>
                        <div class="bar">
                            <div class="fill" style="width: 100%"></div>
                        </div>
                    </div>
                    <div class="track">
                        <div class="cover"></div>
                        <div class="title"></div>
                        <div class="artist"></div>
                        <div class="bar">
                            <div class="fill" style="width: 85%"></div>
                        </div>
                    </div>
                    <div class="track">
                        <div class="cover"></div>
                        <div class="title"></div>
                        <div class="artist"></div>
                        <div class="bar">
                            <div class="fill" style="width: 60%"></div>
                        </div>
                    </div>
                    <div class="track">
                        <div class="cover"></div>
                        <div class="title"></div>
                        <div class="artist"></div>
                        <div class="bar">
                            <div class="fill" style="width: 30%"></div>
                        </div>
                    </div>
                    <div class="track">
                        <div class="cover"></div>
                        <div class="title"></div>
                        <div class="artist"></div>
                        <div class="bar">
                            <div class="fill" style="width: 5%"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="setting-group">
                <div class="setting" data-type="select">
                    <div class="heading">
                        <h5>${tl(trans.default_timeframe)}</h5>
                    </div>
                    <div class="select-wrap custom-selector" id="id_chart_range_top_tracks_select">
                        ${original_chart_settings.tracks.timeframe}
                    </div>
                </div>
                <div class="setting" data-type="select">
                    <div class="heading">
                        <h5>${tl(trans.amount_to_display)}</h5>
                    </div>
                    <div class="select-wrap custom-selector" id="id_chart_length_top_tracks_select">
                        ${original_chart_settings.tracks.count}
                    </div>
                </div>
            </div>
            <div class="settings-footer">
                <button type="submit" class="btn-primary save">
                    ${tl(trans.save)}
                </button>
                <input type="hidden" value="chart" name="submit">
            </div>
        </form>
    `;

    custom_select(
        charts_panel.querySelector('#id_chart_length_recent_tracks'),
        charts_panel.querySelector('#id_chart_length_recent_tracks_select')
    );
    custom_select(
        charts_panel.querySelector('#id_chart_range_top_artists'),
        charts_panel.querySelector('#id_chart_range_top_artists_select')
    );
    custom_select(
        charts_panel.querySelector('#id_chart_style_and_length_top_artists'),
        charts_panel.querySelector(
            '#id_chart_style_and_length_top_artists_select'
        )
    );
    custom_select(
        charts_panel.querySelector('#id_chart_range_top_albums'),
        charts_panel.querySelector('#id_chart_range_top_albums_select')
    );
    custom_select(
        charts_panel.querySelector('#id_chart_style_and_length_top_albums'),
        charts_panel.querySelector(
            '#id_chart_style_and_length_top_albums_select'
        )
    );
    custom_select(
        charts_panel.querySelector('#id_chart_range_top_tracks'),
        charts_panel.querySelector('#id_chart_range_top_tracks_select')
    );
    custom_select(
        charts_panel.querySelector('#id_chart_length_top_tracks'),
        charts_panel.querySelector('#id_chart_length_top_tracks_select')
    );

    for (let category in original_chart_settings) {
        for (let setting in original_chart_settings[category]) {
            update_inbuilt_item(
                setting,
                original_chart_settings[category][setting],
                false
            );
        }
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

function patch_settings_profile_panel(token, update_picture) {
    const bio_max_length = 500;

    update_picture.classList.add('bleh--panel');

    const upload_form = update_picture.querySelector('.avatar-upload-form');
    const avatar_url = update_picture
        .querySelector('.image-upload-preview img')
        .getAttribute('src');
    const upload_finished = update_picture.querySelector('.alert-success');

    if (page.state.avatar_changer && upload_finished) {
        const id = page.state.avatar_changer.getAttribute('data-modal-id');
        dialog_rm({ id });
    }

    const update_profile = page.structure.main.querySelector('#update-profile');
    const alert = update_profile.querySelector('.alert');

    let form_display_name = document.getElementById('id_full_name').value;
    let form_website = document.getElementById('id_homepage').value;
    let form_country = document.getElementById('id_country');
    let form_about_me = document.getElementById('id_about_me').textContent;

    const markdown_settings = {
        allow_headers: true,
        allow_banners: true,
        allow_icons: true,
        allow_hue: true,
        allow_fonts: true,
        cache: true,
        take_effect: false,
        allow_socials: true,
        allow_alignment: true,
        allow_lists: true
    };

    let chars;
    const about = markdown_field(update_about, markdown_settings, form_about_me, 'about_me', 40, 10, tl(trans.anything_you_can_imagine), null, false, false, false);
    let preview;

    let accent_setting;
    let font_setting;

    render(page.structure.side, html`
        <section>
            <h2>${tl(trans.about_me_preview)}</h2>
            <span class="bleh--about-me-preview markdown-body" ref=${(el) => (preview = el)} />
        </section>
    `);

    let profile_cache = JSON.parse(localStorage.getItem('bleh_profile_cache')) || {};
    let cache = profile_cache[auth.name];

    render(update_picture, html`
        <h4>${tl(trans.profile)}</h4>
        ${alert}
        <form
            class="dont-move"
            action="${root}settings#update-profile"
            name="profile-form"
            data-form-type="identity"
            method="post"
        >
            <input
                type="hidden"
                name="csrfmiddlewaretoken"
                value="${token}"
            />
            <div class="setting-group">
                <div class="setting" data-type="info">
                    <div class="heading">
                        <h5>${tl(trans.avatar)}</h5>
                        <p>${tl(trans.avatar_desc)}</p>
                    </div>
                    <div class="info">
                        <div class="avatar image-uploader" onclick=${() => avatar(token)}>
                            <img
                                src=${avatar_url}
                                alt=${tl(trans.your_avatar)}
                                loading="lazy"
                            />
                            <div class="avatar-overlay" />
                        </div>
                    </div>
                </div>
                ${() => {
                    const username_regex = /\[name=([^\]]+)\]/;

                    const elem = html.node`
                        <div class="setting" data-type="text" disabled=${!auth.sponsor}>
                            <div class="heading">
                                <h5>${tl(trans.display_name.name)}<span class="new-badge sponsor-related">${tl(trans.sponsors_only)}</span></h5>
                                <p>${tl(trans.display_name.body)}</p>
                            </div>
                            ${input({
                                value: cache.username,
                                placeholder: auth.name,
                                func: (val) => {
                                    const match = about.value().match(username_regex);

                                    const new_name = `[name=${val}]`;

                                    if (match) {
                                        about.value(about.value().replace(username_regex, new_name));
                                    } else {
                                        const trimmed = about.value().trimEnd();

                                        if (trimmed.length == 0) {
                                            about.value(new_name);
                                        } else {
                                            about.value(trimmed + '\n\n' + new_name);
                                        }
                                    }
                                },
                                submit_on_character: true
                            })}
                        </div>
                    `;

                    return elem;
                }}
                ${ff('profile_fonts') ? html.node`
                <div
                    class="setting"
                    data-type="info"
                    disabled=${!auth.sponsor}
                    ref=${(el) => (font_setting = el)}
                />
                ` : ''}
                <div class="setting" data-type="text">
                    <div class="heading">
                        <h5>${tl(trans.profile_title)}</h5>
                        <p>${tl(trans.pronoun_tip)}</p>
                    </div>
                    <div class="input-container content-form">
                        <input
                            type="text"
                            name="full_name"
                            value=${form_display_name}
                            maxlength="36"
                            id="id_full_name"
                            data-form-type="other"
                        />
                    </div>
                </div>
                <div class="setting" data-type="text">
                    <div class="heading">
                        <h5>${tl(trans.website)}</h5>
                    </div>
                    <div class="input-container content-form">
                        <input
                            type="url"
                            name="homepage"
                            value=${form_website}
                            id="id_homepage"
                            data-form-type="website"
                        />
                    </div>
                </div>
                <div class="setting" data-type="select">
                    <div class="heading">
                        <h5>${tl(trans.country)}</h5>
                    </div>
                    <div class="select-wrap custom-selector">
                        ${select(
                            select_prepare(form_country),
                            form_country.value,
                            'country'
                        )}
                    </div>
                </div>
                ${() => {
                    const banner_regex = /\[banner=([^\]]+)\]/;
                    const match = about.value().match(banner_regex);

                    const pre_existing = match ? match[1] : '';
                    let preview;

                    const elem = html.node`
                        <div class="setting" data-type="text">
                            <div class="heading">
                                <h5>${tl(trans.profile_banner.name)}</h5>
                                <p>${tl(trans.profile_banner.body)}</p>
                            </div>
                            <div class="info v">
                                ${input({
                                    value: pre_existing,
                                    func: (val) => {
                                        const match = about.value().match(banner_regex);

                                        const new_banner = `[banner=${val}]`;

                                        if (match) {
                                            about.value(about.value().replace(banner_regex, new_banner));
                                        } else {
                                            const trimmed = about.value().trimEnd();

                                            if (trimmed.length == 0) {
                                                about.value(new_banner);
                                            } else {
                                                about.value(trimmed + '\n\n' + new_banner);
                                            }
                                        }

                                        preview.style.setProperty('background-image', `url(${val})`);
                                    },
                                    submit_on_character: true
                                })}
                                <div class="banner-image" ref=${el => preview = el} />
                            </div>
                        </div>
                    `;

                    preview.style.setProperty('background-image', `url(${pre_existing})`);

                    return elem;
                }}
                <div
                    class="setting"
                    data-type="info"
                    disabled=${!auth.sponsor}
                    ref=${(el) => (accent_setting = el)}
                />
                ${() => {
                    const status_regex = /\[status=([^\]]+)\]/;
                    const match = about.value().match(status_regex);

                    const pre_existing = match ? match[1] : '';

                    const elem = html.node`
                        <div class="setting" data-type="text">
                            <div class="heading">
                                <h5><a href="https://status.cafe" target="_blank">status.cafe</a><span class="new-badge new">${tl(trans.new)}</span></h5>
                                <p>${tl(trans.status_cafe.body)}</p>
                            </div>
                            ${input({
                                value: pre_existing,
                                func: (val) => {
                                    const match = about.value().match(status_regex);

                                    const new_status = `[status=${val}]`;

                                    if (match) {
                                        about.value(about.value().replace(status_regex, new_status));
                                    } else {
                                        const trimmed = about.value().trimEnd();

                                        if (trimmed.length == 0) {
                                            about.value(new_status);
                                        } else {
                                            about.value(trimmed + '\n\n' + new_status);
                                        }
                                    }
                                },
                                submit_on_character: true
                            })}
                        </div>
                    `;

                    return elem;
                }}
                <div class="setting" data-type="text">
                    <div class="heading">
                        <h5>${tl(trans.about)}</h5>
                        <p class="tip characters" ref=${(el) => (chars = el)}>
                            ${tl(
                                trans.value_characters_max,
                                { v: bio_max_length }
                            )}
                        </p>
                    </div>
                    <div class="${!ff('cosplay') ? 'input-container content-form textarea' : 'limitless'}">
                        ${about}
                    </div>
                </div>
            </div>
            <div class="settings-footer end">
                <button
                    type="submit"
                    class="btn-primary save"
                    data-form-type="action"
                >
                    ${tl(trans.save)}
                </button>
                <input
                    type="hidden"
                    value="profile"
                    name="submit"
                />
            </div>
        </form>
        <div class="setting-group">
            ${setting({ id: 'avatar_radius' })}
        </div>
    `);

    page.structure.main.removeChild(
        page.structure.main.querySelector('#update-profile')
    );

    // about me
    update_about();

    function len(text) {
        return text.replace(/\n/g, '\r\n').length;

        // utf-8 or something i dont know
        const normalised = text.replace(/\r\n/g, '\n');

        return new TextEncoder().encode(normalised).length;
    }

    function update_about(value = about.value()) {
        log('re-rendering', 'about', 'log');

        const length = len(value);
        chars.textContent = tl(trans.value_characters_max, {
            v: `${length}/${bio_max_length}`
        });
        chars.setAttribute('data-exceeded', length > bio_max_length);

        render(preview, markdown(value, markdown_settings));

        let profile_cache = JSON.parse(localStorage.getItem('bleh_profile_cache')) || {};
        let cache = profile_cache[auth.name];

        console.info('cache', cache);

        const accent_regex = /\[accent=([0-9]{1,3}),([0-9]*\.?[0-9]+),([0-9]*\.?[0-9]+)\]/;
        const font_regex = /\[font=([^\]]+)\]/;

        console.info(
            'cache update',
            about.value(),
            cache.hue,
            cache.sat,
            cache.lit
        );

        let accent_edit;
        render(accent_setting, html``);
        render(accent_setting, html`
            <div class="heading">
                <h5>${tl(trans.profile_accent.name)}<span class="new-badge sponsor-related">${tl(trans.sponsors_only)}</span></h5>
                <p>${tl(trans.profile_accent.body)}</p>
            </div>
            <div class="info">
                <div
                    class="colour-tile colourful"
                    style="--hue-over: ${cache.hue}; --sat-over: ${cache.sat}; --lit-over: ${cache.lit}"
                />
                <div class="swatch-group palette">
                    <button
                        class="swatch-container"
                        ref=${(el) => (accent_edit = el)}
                        type="button"
                        onclick=${() => {
                            let hue_range;
                            let sat_range;
                            let lit_range;

                            const match = about.value().match(accent_regex);

                            if (match) {
                                save_setting(
                                    'profile_hue',
                                    parseInt(match[1], 10)
                                );
                                save_setting(
                                    'profile_sat',
                                    parseFloat(match[2])
                                );
                                save_setting(
                                    'profile_lit',
                                    parseFloat(match[3])
                                );
                            }

                            let accent_preview;

                            dialog({
                                id: 'profile_accent',
                                title: tl(trans.profile_accent.name),
                                body: html.node`
                                    <div class="setting-group">
                                        <div class="setting" data-type="info">
                                            <div class="heading">
                                                <h5>${tl(trans.preview)}</h5>
                                            </div>
                                            <div class="info">
                                                <div class="colour-tile colourful" ref=${(el) => (accent_preview = el)} style="--hue-over: ${settings.profile_hue}; --sat-over: ${settings.profile_sat}; --lit-over: ${settings.profile_lit}" />
                                            </div>
                                        </div>
                                        ${
                                            ff('colour_based_on_hex') ?
                                                html.node`
                                        <div class="setting" data-type="text">
                                            <div class="heading">
                                                <h5>${tl(trans.convert_from_hex)}</h5>
                                            </div>
                                            <div class="input-container content-form">
                                                ${(colour = input({
                                                    type: 'colour',
                                                    value: '#999999',
                                                    maxlength: 7,
                                                    warn_if_empty: true
                                                }))}
                                                <button class="btn primary icon convert" onclick=${() => {
                                                    const value = colour.value();
                                                    const hsl = hex_to_hsl(value);

                                                    hue_range.set(hsl.h);
                                                    sat_range.set(
                                                        clamp_sat((hsl.s / 100) * 3)
                                                    );
                                                    lit_range.set(
                                                        hsl.l / 100 + 0.35
                                                    );
                                                }}>${tl(trans.convert)}</button>
                                            </div>
                                        </div>
                                        `
                                            :   ''
                                        }
                                        ${(hue_range = setting({ id: 'profile_hue', func: update_colour_preview }))}
                                        ${(sat_range = setting({ id: 'profile_sat', func: update_colour_preview }))}
                                        ${(lit_range = setting({ id: 'profile_lit', func: update_colour_preview }))}
                                    </div>
                                    <div class="modal-footer">
                                        <button class="see-more cancel" onclick=${() => dialog_rm({ id: 'profile_accent' })}>
                                            ${tl(trans.back)}
                                        </button>
                                        <div class="fill"></div>
                                        <div class="button-group">
                                            ${() => {
                                                const btn = html.node`
                                                    <button class="btn icon select-button" data-type="copy">
                                                        ${tl(trans.copy)}
                                                    </button>
                                                `;

                                                tippy(btn, {
                                                    theme: 'context-menu',
                                                    content: html.node`
                                                        <button class="dropdown-menu-clickable-item" data-type="profile" onclick=${() => {
                                                            hue_range.set(settings.hue);
                                                            sat_range.set(settings.sat);
                                                            lit_range.set(settings.lit);
                                                        }}>${tl(trans.apply_global_accent)}</button>
                                                        <button class="dropdown-menu-clickable-item" data-type="global" onclick=${() => {
                                                            const warn = notify({
                                                                id: 'confirm_accent',
                                                                title: tl(trans.are_you_sure),
                                                                body: tl(trans.this_will_replace_your_global_accent),
                                                                type: 'warning',
                                                                actions: [
                                                                    {
                                                                        type: 'check',
                                                                        action: () => {
                                                                            notify_rm(warn);

                                                                            save_setting('hue', settings.profile_hue);
                                                                            save_setting('sat', settings.profile_sat);
                                                                            save_setting('lit', settings.profile_lit);
                                                                        },
                                                                        text: tl(trans.continue)
                                                                    }
                                                                ],
                                                                persist: true
                                                            })
                                                        }}>${tl(trans.apply_profile_accent)}</button>
                                                    `,
                                                    trigger: 'click',
                                                    placement: 'bottom',
                                                    interactive: true,
                                                    interactiveBorder: 10,
                                                    offset: [0, 0]
                                                });

                                                return btn;
                                            }}
                                            <button class="btn primary continue" onclick=${() => {
                                                const new_accent = `[accent=${settings.profile_hue},${settings.profile_sat},${settings.profile_lit}]`;

                                                if (match) {
                                                    about.value(about.value().replace(
                                                        accent_regex,
                                                        new_accent
                                                    ));
                                                } else {
                                                    const trimmed = about.value().trimEnd();

                                                    if (trimmed.length == 0) {
                                                        about.value(new_accent);
                                                    } else {
                                                        about.value(trimmed + '\n\n' + new_accent);
                                                    }
                                                }

                                                dialog_rm({ id: 'profile_accent' });
                                                status({
                                                    title: tl(
                                                        trans.profile_accent.reminder
                                                    )
                                                });
                                            }}>
                                                ${tl(trans.change)}
                                            </button>
                                        </div>
                                    </div>
                                `
                                    });

                                    function update_colour_preview() {
                                        accent_preview.style = `--hue-over: ${settings.profile_hue}; --sat-over: ${settings.profile_sat}; --lit-over: ${settings.profile_lit}`;
                                    }
                                }}
                        >
                            <div
                                class="swatch colourful"
                                data-swatch-type="customise"
                            />
                        </button>
                    </div>
                </div>
            `);

        tippy(accent_edit, {
            content: tl(trans.edit)
        });

        if (font_setting) {
            let font_edit;
            let font_tile;
            render(font_setting, html``);
            render(font_setting, html`
                <div class="heading">
                    <h5>${tl(trans.profile_font.name)}<span class="new-badge sponsor-related">${tl(trans.sponsors_only)}</span></h5>
                    <p>${tl(trans.profile_font.body)}</p>
                </div>
                <div class="info">
                    <div class="font-tile">
                        <span class="preview-style" data-font=${cache.font} data-font-style=${cache.font_style} ref=${el => font_tile = el}>Aa</span>
                    </div>
                    <div class="swatch-group palette">
                        <button
                            class="swatch-container"
                            ref=${(el) => (font_edit = el)}
                            type="button"
                            onclick=${() => {
                                const match = about.value().match(font_regex);

                                if (match) {
                                    save_setting(
                                        'profile_hue',
                                        parseInt(match[1], 10)
                                    );
                                    save_setting(
                                        'profile_sat',
                                        parseFloat(match[2])
                                    );
                                    save_setting(
                                        'profile_lit',
                                        parseFloat(match[3])
                                    );
                                }

                                let font_name = cache.font;
                                let font_style = cache.font_style;

                                let font_preview;
                                let font_buttons = [];
                                let font_style_buttons = [];

                                dialog({
                                    id: 'profile_font',
                                    title: tl(trans.profile_font.name),
                                    body: html.node`
                                        <div class="font-name-preview">
                                            <span data-font=${font_name} data-font-style=${font_style} ref=${el => font_preview = el}>${cache.username ? cache.username : auth.name}</span>
                                        </div>
                                        <div class="font-name-options">
                                            <h4 class="font-options-header">${tl(trans.font.name)}</h4>
                                            <div class="font-options">
                                                ${Object.entries(page.state.fonts).map(([font, family]) => {
                                                    if (family == '') family = tl(trans.none);

                                                    const elem = html.node`
                                                        <button class="btn font-selection" data-font=${font} aria-checked=${font == font_name} onclick=${() => {
                                                            font_name = font;

                                                            font_preview.setAttribute('data-font', font);
                                                            font_tile.setAttribute('data-font', font);
                                                            font_buttons.forEach(btn => {
                                                                btn.setAttribute('aria-checked', btn.getAttribute('data-font') == font)
                                                            });
                                                        }}>
                                                            <span data-font=${font}>Aa</span>
                                                        </button>
                                                    `;

                                                    tippy(elem, {
                                                        content: family,
                                                        delay: [500, 0]
                                                    });

                                                    font_buttons.push(elem);
                                                    return elem;
                                                })}
                                            </div>
                                            <h4 class="font-options-header">${tl(trans.font_style)}</h4>
                                            <div class="font-options">
                                                ${['solid', 'pop', 'out', 'glow'].map(style => {
                                                    const elem = html.node`
                                                        <button class="btn font-selection font-style" data-font-style=${style} aria-checked=${style == font_style} onclick=${() => {
                                                            font_style = style;

                                                            font_preview.setAttribute('data-font-style', style);
                                                            font_tile.setAttribute('data-font-style', style);
                                                            font_style_buttons.forEach(btn => {
                                                                btn.setAttribute('aria-checked', btn.getAttribute('data-font-style') == style)
                                                            });
                                                        }}>
                                                            <span class="preview-style" data-font-style=${style}>${tl(trans.font_style[style])}</span>
                                                        </button>
                                                    `;

                                                    font_style_buttons.push(elem);
                                                    return elem;
                                                })}
                                            </div>
                                        </div>
                                        <div class="modal-footer">
                                            <button class="see-more cancel" onclick=${() => dialog_rm({ id: 'profile_font' })}>
                                                ${tl(trans.back)}
                                            </button>
                                            <div class="fill"></div>
                                            <button class="btn primary continue" onclick=${() => {
                                                const new_font = `[font=${font_name}${font_style != 'solid' ? `,${font_style}` : ''}]`;

                                                if (match) {
                                                    about.value(about.value().replace(
                                                        font_regex,
                                                        new_font
                                                    ));
                                                } else {
                                                    const trimmed = about.value().trimEnd();

                                                    if (trimmed.length == 0) {
                                                        about.value(new_font);
                                                    } else {
                                                        about.value(trimmed + '\n\n' + new_font);
                                                    }
                                                }

                                                dialog_rm({ id: 'profile_font' });
                                                status({
                                                    title: tl(
                                                        trans.profile_font.reminder
                                                    )
                                                });
                                            }}>
                                                ${tl(trans.change)}
                                            </button>
                                        </div>
                                    `
                                        });

                                        function update_colour_preview() {
                                            accent_preview.style = `--hue-over: ${settings.profile_hue}; --sat-over: ${settings.profile_sat}; --lit-over: ${settings.profile_lit}`;
                                        }
                                    }}
                            >
                                <div
                                    class="swatch colourful"
                                    data-swatch-type="customise"
                                />
                            </button>
                        </div>
                    </div>
                `);

            tippy(font_edit, {
                content: tl(trans.edit)
            });
        }
    }
}

export function use_pronouns(value) {
    // no spaces, easier to detect
    value = value.replaceAll(' ', '');

    if (
        value.startsWith('she/') ||
        value.startsWith('he/') ||
        value.startsWith('they/') ||
        value.startsWith('it/') ||
        value.startsWith('xe/') ||
        value.startsWith('any/')
    )
        return true;

    return false;
}

function avatar(token = '') {
    if (!token) token = page.token;
    else page.token = token;

    page.state.avatar_changer = dialog({
        id: 'edit_avatar',
        title: tl(trans.change_avatar),
        body: html.node`
            <div class="forms">
                <form action="${root}settings" name="avatar-form" method="post" enctype="multipart/form-data">
                    <input type="hidden" name="csrfmiddlewaretoken" value=${page.token}>
                    <div class="form-group form-group--avatar js-form-group upload-avatar">
                        <div class="js-form-group-controls form-group-controls">
                            <span class="btn-secondary btn primary btn-file" data-kate-processed="true">
                                ${tl(trans.upload)}
                                <input type="file" onchange=${() => update_avatar(event)} name="avatar" data-require="components/file-input" data-file-input-copy="${tl(trans.upload)}" data-no-file-copy="No file chosen" accept="image/*" required="" id="id_avatar" data-kate-processed="true">
                            </span>
                        </div>
                    </div>
                    <button type="submit" class="btn-primary save" id="avatar_saver">
                        ${tl(trans.save)}
                    </button>
                    <input type="hidden" value="avatar" name="submit">
                </form>
                <form action="${root}settings/avatar/delete" method="post">
                    <input type="hidden" name="csrfmiddlewaretoken" value=${page.token}>
                    <div class="form-group delete-avatar">
                        <button class="btn image-upload-remove" type="submit" value="delete-avatar" name="delete-avatar">${tl(trans.delete)}</button>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="see-more cancel" onclick=${() => dialog_rm({ id: 'edit_avatar' })}>${tl(trans.cancel)}</button>
                <div class="fill"></div>
                <button class="btn primary save" onclick=${() => save_avatar()} disabled>${tl(trans.save)}</button>
            </div>
        `
    });

    page.state.avatar_changer.querySelector('[name="avatar-form"]').onsubmit =
        finish_saving_avatar;
    const file_button = page.state.avatar_changer.querySelector('.btn-file');
    const save_button = page.state.avatar_changer.querySelector(
        '.modal-footer .primary'
    );

    let form;

    function update_avatar(e) {
        console.info(e);
        if (!e.target.files || !e.target.files[0]) return;
        form = page.state.avatar_changer.querySelector('.bleh-modal-body');

        if (e.target.files[0].type == 'image/gif') {
            save_avatar();
            finish_saving_avatar();
            return;
        }

        let reader = new FileReader();
        reader.onload = function () {
            crop(reader.result);
            save_button.removeAttribute('disabled');
        };
        reader.readAsDataURL(e.target.files[0]);
    }

    function save_avatar() {
        page.state.avatar_changer.querySelector('#avatar_saver').click();
    }

    function finish_saving_avatar() {
        page.state.avatar_changer.setAttribute('data-loading', 'true');
        page.state.avatar_changer
            .querySelectorAll('.bleh-modal-body button')
            .forEach((button) => {
                button.setAttribute('disabled', 'true');
                button.removeAttribute('onclick');
            });
    }

    function crop(file) {
        let crop_image;
        let save;

        const crop_dialog = dialog({
            id: 'crop',
            title: tl(trans.crop_avatar),
            body: html.node`
                <div class="crop">
                    <img src=${file} ref=${(el) => (crop_image = el)}>
                </div>
                <div class="alert alert-info">
                    ${tl(trans.crop_notice)}
                </div>
                <div class="modal-footer">
                    <button class="see-more cancel" onclick=${() => {
                        if (cropper && cropper.destroy) cropper.destroy();
                        cropper = null;

                        avatar();
                    }}>${tl(trans.cancel)}</button>
                    <div class="fill"></div>
                    <button class="btn primary save" onclick=${() => {
                        if (!cropper) return;

                        crop_dialog
                            .querySelectorAll('.bleh-modal-body button')
                            .forEach((button) => {
                                button.setAttribute('disabled', 'true');
                                button.removeAttribute('onclick');
                            });

                        const canvas = cropper.getCroppedCanvas();

                        canvas.toBlob((blob) => {
                            const cropped_file = new File(
                                [blob],
                                'avatar.png',
                                { type: 'image/png' }
                            );

                            const inner_form = form.querySelector('form');
                            inner_form.style.display = 'none';
                            crop_dialog
                                .querySelector('.bleh-modal-body')
                                .appendChild(inner_form);

                            const file_input =
                                inner_form.querySelector('input[type="file"]');

                            const data_transfer = new DataTransfer();
                            data_transfer.items.add(cropped_file);
                            file_input.files = data_transfer.files;

                            inner_form.querySelector('#avatar_saver').click();
                        }, 'image/png');
                    }} ref=${(el) => (save = el)} disabled>${tl(trans.save)}</button>
                </div>
            `
        });
        page.state.avatar_changer = crop_dialog;

        crop_image.onload = () => {
            if (cropper && cropper.destroy) cropper.destroy();

            crop_image.style.maxWidth = 'none';
            crop_image.style.width = crop_image.naturalWidth + 'px';
            crop_image.style.height = crop_image.naturalHeight + 'px';

            cropper = new Cropper(crop_image, {
                viewMode: 3,
                dragMode: 'crop',
                movable: true,
                zoomable: true,
                scalable: false,
                cropBoxMovable: true,
                cropBoxResizable: true,
                background: false,
                guides: true,
                autoCropArea: 1
            });

            save.removeAttribute('disabled');
        };
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
            <button class="see-more expand-down" onclick=${() => {
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
                src=${auth.avatar.replace('avatar42s', 'avatar300s')}
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
                        <span class="btn toggle" id="toggle-recent_listening" aria-checked="false">
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
                        <span class="btn toggle" id="toggle-disable_shoutbox" aria-checked="false">
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
                                    class="see-more danger logout"
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
                                    class="see-more danger delete-account"
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
