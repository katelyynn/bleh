import { auth, auth_link, page, root } from "../build/page";
import { lang, trans_legacy, trans, tl } from "../build/trans";
import { bleh_auto_edits } from "../components/auto_edit";
import { dialog_legacy, kill_window } from "../components/dialog";
import { custom_select, update_inbuilt_select } from "../components/select";
import { update_inbuilt_item } from "../config";
import { ff } from "../sku";
import { markdown } from "../components/markdown";

// patch last.fm settings
export function bleh_native_settings() {
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
        if (button) button.classList.add('subscription-button', 'icon', 'primary');

        let more_link_wrap = edits.querySelector('.more-link');
        if (more_link_wrap) {
            more_link_wrap.classList = '';
            let edit_buttons = more_link_wrap.querySelectorAll('a');
            edit_buttons.forEach((edit_button, index) => {
                edit_button.classList.add('btn', 'edit-lead-button', 'icon', 'primary');

                if (index == 0)
                    edit_button.classList.add('edit-album');
                else
                    edit_button.classList.add('edit-track');
            });
        }
    } else if (page.subpage.startsWith('subscription_automatic-edits')) {
        bleh_auto_edits();

        let header = content_top.querySelector('.content-top-header');
        header_text = header.textContent.trim();
    }

    if (ff('katsune'))
        return;

    let edit_header = document.createElement('section');
    edit_header.classList.add('redesigned-header', 'edit-header', 'no-background');
    edit_header.innerHTML = (`
        <div class="tag-side">
            <div class="tag-icon cog-icon"></div>
        </div>
        <div class="info-side">
            <div class="sub-text">${trans_legacy[lang].settings.name}</div>
            <h1>${header_text}</h1>
        </div>
    `);

    page.structure.container.insertBefore(edit_header, page.structure.container.firstElementChild);
}

function patch_settings_profile_tab() {
    let update_picture = document.getElementById('update-picture');

    if (update_picture == undefined)
        return;

    // if we can continue, we are on profile tab
    let token = document.body.querySelector('[name="csrfmiddlewaretoken"]').getAttribute('value');

    patch_settings_profile_panel(token, update_picture);
    patch_settings_charts_panel(token);
}

function patch_settings_charts_panel(token) {
    let charts_panel = document.getElementById('update-chart');

    if (charts_panel.hasAttribute('data-kate-processed'))
        return;

    charts_panel.setAttribute('data-kate-processed', 'true');
    charts_panel.classList.add('bleh--panel');

    // get info before destroying
    let original_chart_settings = {
        recent: {
            recent_artwork: document.getElementById('id_show_recent_tracks_artwork').checked,
            count: document.getElementById('id_chart_length_recent_tracks').outerHTML,
            recent_realtime: document.getElementById('id_auto_refresh_recent_tracks').checked
        },
        artists: {
            timeframe: document.getElementById('id_chart_range_top_artists').outerHTML,
            style: document.getElementById('id_chart_style_and_length_top_artists').outerHTML
        },
        albums: {
            timeframe: document.getElementById('id_chart_range_top_albums').outerHTML,
            style: document.getElementById('id_chart_style_and_length_top_albums').outerHTML
        },
        tracks: {
            count: document.getElementById('id_chart_length_top_tracks').outerHTML,
            timeframe: document.getElementById('id_chart_range_top_tracks').outerHTML
        }
    };

    charts_panel.innerHTML = (`
        <h4>${trans_legacy[lang].settings.inbuilt.charts.name}</h4>
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
            <div class="select-container">
                <div class="heading">
                    <h5>${trans_legacy[lang].settings.inbuilt.charts.recent.count.name}</h5>
                </div>
                <div class="select-wrap custom-selector" id="id_chart_length_recent_tracks_select">
                    ${original_chart_settings.recent.count}
                </div>
            </div>
            <div class="toggle-container" id="container-recent_artwork">
                <button class="btn reset" onclick="_reset_inbuilt_item('recent_artwork')">Reset to default</button>
                <div class="heading">
                    <h5>${trans_legacy[lang].settings.inbuilt.charts.recent.artwork.name}</h5>
                </div>
                <div class="toggle-wrap">
                    <input class="companion-checkbox" type="checkbox" name="show_recent_tracks_artwork" id="inbuilt-companion-checkbox-recent_artwork">
                    <span class="btn toggle" id="toggle-recent_artwork" onclick="_update_inbuilt_item('recent_artwork')" aria-checked="false">
                        <div class="dot"></div>
                    </span>
                </div>
            </div>
            <div class="toggle-container" id="container-recent_realtime">
                <button class="btn reset" onclick="_reset_inbuilt_item('recent_realtime')">Reset to default</button>
                <div class="heading">
                    <h5>${trans_legacy[lang].settings.inbuilt.charts.recent.realtime.name}</h5>
                    <p>${trans_legacy[lang].settings.inbuilt.charts.recent.realtime.bio}</p>
                </div>
                <div class="toggle-wrap">
                    <input class="companion-checkbox" type="checkbox" name="auto_refresh_recent_tracks" id="inbuilt-companion-checkbox-recent_realtime">
                    <span class="btn toggle" id="toggle-recent_realtime" onclick="_update_inbuilt_item('recent_realtime')" aria-checked="false">
                        <div class="dot"></div>
                    </span>
                </div>
            </div>
            <div class="sep"></div>
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
            <div class="select-container">
                <div class="heading">
                    <h5>${trans_legacy[lang].settings.inbuilt.charts.artists.timeframe.name}</h5>
                </div>
                <div class="select-wrap custom-selector" id="id_chart_range_top_artists_select">
                    ${original_chart_settings.artists.timeframe}
                </div>
            </div>
            <div class="select-container">
                <div class="heading">
                    <h5>${trans_legacy[lang].settings.inbuilt.charts.artists.style.name}</h5>
                </div>
                <div class="select-wrap custom-selector" id="id_chart_style_and_length_top_artists_select">
                    ${original_chart_settings.artists.style}
                </div>
            </div>
            <div class="sep"></div>
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
            <div class="select-container">
                <div class="heading">
                    <h5>${trans_legacy[lang].settings.inbuilt.charts.albums.timeframe.name}</h5>
                </div>
                <div class="select-wrap custom-selector" id="id_chart_range_top_albums_select">
                    ${original_chart_settings.albums.timeframe}
                </div>
            </div>
            <div class="select-container">
                <div class="heading">
                    <h5>${trans_legacy[lang].settings.inbuilt.charts.albums.style.name}</h5>
                </div>
                <div class="select-wrap custom-selector" id="id_chart_style_and_length_top_albums_select">
                    ${original_chart_settings.albums.style}
                </div>
            </div>
            <div class="sep"></div>
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
            <div class="select-container">
                <div class="heading">
                    <h5>${trans_legacy[lang].settings.inbuilt.charts.tracks.timeframe.name}</h5>
                </div>
                <div class="select-wrap custom-selector" id="id_chart_range_top_tracks_select">
                    ${original_chart_settings.tracks.timeframe}
                </div>
            </div>
            <div class="select-container">
                <div class="heading">
                    <h5>${trans_legacy[lang].settings.inbuilt.charts.tracks.count.name}</h5>
                </div>
                <div class="select-wrap custom-selector" id="id_chart_length_top_tracks_select">
                    ${original_chart_settings.tracks.count}
                </div>
            </div>
            <div class="settings-footer">
                <button type="submit" class="btn-primary save">
                    ${trans_legacy[lang].settings.save}
                </button>
                <input type="hidden" value="chart" name="submit">
            </div>
        </form>
    `);

    custom_select(charts_panel.querySelector('#id_chart_length_recent_tracks'), charts_panel.querySelector('#id_chart_length_recent_tracks_select'));
    custom_select(charts_panel.querySelector('#id_chart_range_top_artists'), charts_panel.querySelector('#id_chart_range_top_artists_select'));
    custom_select(charts_panel.querySelector('#id_chart_style_and_length_top_artists'), charts_panel.querySelector('#id_chart_style_and_length_top_artists_select'));
    custom_select(charts_panel.querySelector('#id_chart_range_top_albums'), charts_panel.querySelector('#id_chart_range_top_albums_select'));
    custom_select(charts_panel.querySelector('#id_chart_style_and_length_top_albums'), charts_panel.querySelector('#id_chart_style_and_length_top_albums_select'));
    custom_select(charts_panel.querySelector('#id_chart_range_top_tracks'), charts_panel.querySelector('#id_chart_range_top_tracks_select'));
    custom_select(charts_panel.querySelector('#id_chart_length_top_tracks'), charts_panel.querySelector('#id_chart_length_top_tracks_select'));

    for (let category in original_chart_settings) {
        for (let setting in original_chart_settings[category]) {
            update_inbuilt_item(setting, original_chart_settings[category][setting], false);
        }
    }

    let selects = document.body.querySelectorAll('select');
    selects.forEach((select) => {
        select.setAttribute('onchange', `_update_inbuilt_select('${select.getAttribute('id')}', this.value)`);
        update_inbuilt_select(select.getAttribute('id'), select.value);
    });
}

function patch_settings_profile_panel(token, update_picture) {
    if (update_picture.hasAttribute('data-kate-processed'))
        return;

    update_picture.setAttribute('data-kate-processed', 'true');
    update_picture.classList.add('bleh--panel');

    let avatar_url = document.body.querySelector('.image-upload-preview img').getAttribute('src');

    let form_display_name = document.getElementById('id_full_name').value;
    let form_website = document.getElementById('id_homepage').value;
    let form_country = document.getElementById('id_country').outerHTML;
    let form_about_me = document.getElementById('id_about_me').textContent;

    document.getElementById('update-profile').outerHTML = '';

    let new_sidebar = document.createElement('section');
    new_sidebar.classList.add('bleh--panel', 'about-me-preview');
    new_sidebar.innerHTML = (`
        <h4>${tl(trans.about_me_preview)}</h4>
        <span class="bleh--about-me-preview" id="about_me_preview"></span>
    `);

    page.structure.side.appendChild(new_sidebar);

    update_picture.innerHTML = (`
        <h4>${trans_legacy[lang].settings.inbuilt.profile.name}</h4>
        <div class="banner-preview"></div>
        <div class="profile-container">
            <div class="avatar-side">
                <div class="avatar image-upload-preview" onclick="_open_avatar_changer('${token}')">
                    <img src="${avatar_url}" alt="Your avatar" loading="lazy">
                    <div class="avatar-overlay"></div>
                </div>
            </div>
            <div class="info-side">
                <div class="header-info">
                    <div class="header">
                        <h1>${auth.name}</h1>
                    </div>
                    <div class="header-title-secondary">
                        <span class="header-title-secondary--pre" id="header-title-display-name--pre"></span>
                        <span class="header-title-display-name" id="header-title-display-name"></span>
                        <!--<span class="header-title-secondary--pre" id="header-scrobble-since--pre">created</span>
                        <span class="header-scrobble-since" id="header-scrobble-since"></span>-->
                    </div>
                </div>
                <div class="sub-info">
                    <form action="${root}settings#update-profile" name="profile-form" data-form-type="identity" method="post">
                        <input type="hidden" name="csrfmiddlewaretoken" value="${token}">
                        <div class="info-row">
                            <div class="title">
                                ${trans_legacy[lang].settings.inbuilt.profile.subtitle.name}
                            </div>
                            <div class="input">
                                <input type="text" name="full_name" value="${form_display_name}" maxlength="36" id="id_full_name" oninput="_update_display_name(this.value)" data-form-type="other">
                                <div class="tip">${trans_legacy[lang].settings.inbuilt.profile.pronoun_tip}</div>
                            </div>
                        </div>
                        <div class="info-row">
                            <div class="title">
                                ${trans_legacy[lang].settings.inbuilt.profile.country}
                            </div>
                            <div class="input custom-selector" id="country_select">
                                ${form_country}
                            </div>
                        </div>
                        <div class="info-row">
                            <div class="title">
                                ${trans_legacy[lang].settings.inbuilt.profile.website}
                            </div>
                            <div class="input">
                                <input type="url" name="homepage" value="${form_website}" id="id_homepage" data-form-type="website">
                            </div>
                        </div>
                        <div class="info-row">
                            <div class="title">
                                ${trans_legacy[lang].settings.inbuilt.profile.about}
                            </div>
                            <div class="input about-me" data-bleh--show-preview="false" id="about_me">
                                <textarea name="about_me" cols="40" rows="10" class="textarea--s" maxlength="500" id="id_about_me" oninput="_update_about_me_preview(this.value)" data-form-type="other">${form_about_me}</textarea>
                                <div class="tip">${tl(trans.markdown_tip)}</div>
                            </div>
                        </div>
                        <div class="save-row">
                            <div class="form-submit">
                                <button type="submit" class="btn-primary save" data-form-type="action">
                                    ${trans_legacy[lang].settings.save}
                                </button>
                                <input type="hidden" value="profile" name="submit">
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `);

    custom_select(update_picture.querySelector('#id_country'), update_picture.querySelector('#country_select'));


    // about me
    let about_me_box = document.getElementById('id_about_me');
    update_about_me_preview(about_me_box.value);

    // subtitle
    update_display_name(form_display_name);

    // preview
    tippy(document.getElementById('btn--toggle-about-me-preview'), {
        content: trans_legacy[lang].settings.inbuilt.profile.toggle_preview.bio
    });
}

unsafeWindow._toggle_about_me_preview = function() {
    toggle_about_me_preview();
}
function toggle_about_me_preview() {
    let about_me = document.getElementById('about_me');
    if (about_me.getAttribute('data-bleh--show-preview') == 'false')
        about_me.setAttribute('data-bleh--show-preview', 'true');
    else
        about_me.setAttribute('data-bleh--show-preview', 'false');
}

unsafeWindow._update_display_name = function(value) {
    update_display_name(value);
}
function update_display_name(value) {
    document.getElementById('header-title-display-name').textContent = value;

    // pronouns?
    let pronouns = use_pronouns(value);

    document.getElementById('header-title-display-name--pre').textContent = pronouns ? trans_legacy[lang].profile.display_name.pronouns : trans_legacy[lang].profile.display_name.aka;
}


export function use_pronouns(value) {
    // no spaces, easier to detect
    value = value.replaceAll(' ', '');

    if (value.startsWith('she/') ||
        value.startsWith('he/') ||
        value.startsWith('they/') ||
        value.startsWith('it/') ||
        value.startsWith('xe/') ||
        value.startsWith('any/')
    ) return true;

    return false;
}


unsafeWindow._open_avatar_changer = function(token) {
    open_avatar_changer(token);
}
function open_avatar_changer(token) {
    dialog_legacy('edit_avatar',trans_legacy[lang].settings.inbuilt.profile.avatar.name,`
        <div class="bleh--upload-avatar-container">
            <form class="avatar-upload-form bleh--upload-avatar-form" action="${root}settings" name="avatar-form" method="post" enctype="multipart/form-data">
                <input type="hidden" name="csrfmiddlewaretoken" value="${token}">
                <div class="form-group form-group--avatar js-form-group">
                    <div class="js-form-group-controls form-group-controls">
                        <span class="btn-secondary btn primary btn-file" data-kate-processed="true">
                        Choose file
                            <input type="file" name="avatar" data-require="components/file-input" data-file-input-copy="Choose file" data-no-file-copy="No file chosen" accept="image/*" required="" id="id_avatar" data-kate-processed="true">
                        </span>
                    </div>
                    ${trans_legacy[lang].settings.inbuilt.profile.avatar.upload}
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn-primary save" onclick="_save_avatar_changer()">
                        ${trans_legacy[lang].settings.save}
                    </button>
                    <input type="hidden" value="avatar" name="submit">
                </div>
            </form>
            <form class="image-remove-form bleh--upload-avatar-form" action="${root}settings/avatar/delete" method="post">
                <input type="hidden" name="csrfmiddlewaretoken" value="${token}">
                <div class="form-group">
                    <button class="mimic-link image-upload-remove" type="submit" value="delete-avatar" name="delete-avatar">Delete picture</button>
                    ${trans_legacy[lang].settings.inbuilt.profile.avatar.delete}
                </div>
                <div class="modal-footer">
                    <button class="btn cancel" onclick="_kill_window('edit_avatar')" type="button">${trans_legacy[lang].settings.cancel}</button>
                </div>
            </form>
        </div>
        `, true, 'upload-avatar');
}


unsafeWindow._save_avatar_changer = function() {
    document.getElementById('bleh--window-edit_avatar--body').classList.add('modal-processing');

    setTimeout(function() {
        kill_window('edit_avatar');

        auth.avatar = auth_link.state.querySelector('img').getAttribute('src');
        document.querySelector('.auth-dropdown-menu').style.setProperty('--url', `url(${auth.avatar.replace('avatar42s', 'avatar170s')})`);
    }, 5000);
}


unsafeWindow._update_about_me_preview = function(value) {
    update_about_me_preview(value);
}
function update_about_me_preview(value) {
    let result = markdown(value);
    let about_me = page.structure.side.querySelector('#about_me_preview');

    about_me.innerHTML = result;

    let banner = about_me.querySelector('img[alt="banner"]');
    let banner_img = page.structure.main.querySelector('.banner-preview');
    if (!banner)
        banner_img.removeAttribute('style');
    else
        banner_img.style.setProperty('background-image', `url(${banner.getAttribute('src')})`);
}


// privacy
function patch_settings_privacy_tab() {
    let privacy_panel = document.getElementById('privacy');

    // if we can continue, we are on privacy tab
    let token = document.body.querySelector('[name="csrfmiddlewaretoken"]').getAttribute('value');

    bleh_communication_panel(token);
    patch_settings_privacy_panel(token, privacy_panel);
}

function bleh_communication_panel(token) {
    let panel = page.structure.main.querySelector('#ignorelist');
    panel.classList.add('bleh--panel');

    let label = panel.querySelector('.control-label').textContent;
    let input = panel.querySelector('#id_user').outerHTML;
    let button_text = panel.querySelector('.btn-primary').textContent;

    let current = panel.querySelector('form + .form-horizontal .control-label').textContent;
    let list = panel.querySelectorAll('.ignore-list tr');


    let new_list = document.createElement('div');
    new_list.classList.add('generic-table-list', 'user-vertical-list');

    let exceeded = false;
    let exceed_amount = 10;
    let amount = 0;

    list.forEach((item, index) => {
        let entry = document.createElement('div');
        entry.classList.add('generic-table-list-entry', 'user-vertical-list-item');

        let name = item.querySelector('td').textContent.trim();
        let form = item.querySelector('form');
        let button = form.querySelector('button');

        button.classList.add('icon', 'delete-user-button', 'danger-subtle');

        entry.innerHTML = (`
            <span class="text">
                <a class="mention" href="${root}user/${name}" target="_blank">@${name}</a>
            </span>
            <span class="actions">
                ${form.outerHTML}
            </span>
        `);

        if (index > exceed_amount && !exceeded)
            exceeded = true;

        if (exceeded)
            entry.classList.add('entry-is-exceeded');

        new_list.appendChild(entry);
        amount += 1;
    });

    if (exceeded) {
        let remainder = amount - exceed_amount;

        new_list.classList.add('list-is-exceeded');
        new_list.setAttribute('data-expanded', 'false');

        let expand = document.createElement('button');
        expand.classList.add('expand-button', 'icon');
        expand.textContent = trans_legacy[lang].settings.inbuilt.ignore.view.replace('{c}', remainder);
        expand.setAttribute('onclick', '_expand_list(this)');

        new_list.appendChild(expand);
    }



    let form = page.structure.main.querySelector('[name="ignorelist"]');

    if (page.token == '')
        page.token = form.querySelector('[name="csrfmiddlewaretoken"]').getAttribute('value');

    panel.innerHTML = (`
        <h4>${trans_legacy[lang].settings.inbuilt.ignore.name}</h4>
        <div class="user-top-panel">
            <div class="user-top-avatar user-top-avatar-side-left"><div class="bleh-icon"></div></div>
            <img class="user-top-avatar user-top-avatar-main" src="${auth.avatar.replace('avatar42s', 'avatar300s')}" alt="${auth.name}">
            <div class="user-top-avatar user-top-avatar-side-right"><div class="bleh-icon"></div></div>
        </div>
        <h5>${trans_legacy[lang].settings.inbuilt.ignore.consider.name}</h5>
        <div class="to-consider">
            <ul class="to-consider-good">
                <li>${trans_legacy[lang].settings.inbuilt.ignore.consider.good[0]}</li>
                <li>${trans_legacy[lang].settings.inbuilt.ignore.consider.good[1]}</li>
                <li>${trans_legacy[lang].settings.inbuilt.ignore.consider.good[2]}</li>
            </ul>
            <ul class="to-consider-bad">
                <li>${trans_legacy[lang].settings.inbuilt.ignore.consider.bad[0]}</li>
                <li>${trans_legacy[lang].settings.inbuilt.ignore.consider.bad[1]}</li>
            </ul>
        </div>
        <div class="text-container">
            <div class="heading">
                <h5>${trans_legacy[lang].settings.music.profile_shortcut.placeholder}</h5>
                <form action="${root}settings/privacy#ignorelist" name="ignorelist" method="post">
                    <input type="hidden" name="csrfmiddlewaretoken" value="${page.token}">
                    <div class="input-container">
                        <input type="text" maxlength="80" id="id_user" name="user" placeholder="${trans_legacy[lang].settings.music.profile_shortcut.header}">
                        <input type="hidden" name="listaction" value="add">
                        <input type="hidden" name="submit" value="ignorelist">
                        <button class="bleh--btn primary icon add" type="submit">${trans_legacy[lang].settings.add}</button>
                    </div>
                </form>
            </div>
        </div>
        <div class="alert alert-info">
            ${trans_legacy[lang].settings.inbuilt.ignore.count.replace('{c}', amount)}
        </div>
    `);

    panel.appendChild(new_list);
}

function patch_settings_privacy_panel(token, privacy_panel) {
    privacy_panel.classList.add('bleh--panel');

    // get info before destroying
    let original_privacy_settings = {
        recent_listening: document.getElementById('id_hide_realtime').checked,
        receiving_msgs: document.getElementById('id_message_privacy').outerHTML,
        disable_shoutbox: document.getElementById('id_shoutbox_disabled').checked
    }

    privacy_panel.innerHTML = (`
        <h4>${trans_legacy[lang].settings.inbuilt.privacy.name}</h4>
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
            <div class="toggle-container" id="container-recent_listening">
                <button class="btn reset" onclick="_reset_inbuilt_item('recent_listening')">Reset to default</button>
                <div class="heading">
                    <h5>${trans_legacy[lang].settings.inbuilt.privacy.recent_listening.name}</h5>
                    <p>${trans_legacy[lang].settings.inbuilt.privacy.recent_listening.bio}</p>
                </div>
                <div class="toggle-wrap">
                    <input class="companion-checkbox" type="checkbox" name="hide_realtime" id="inbuilt-companion-checkbox-recent_listening">
                    <span class="btn toggle" id="toggle-recent_listening" onclick="_update_inbuilt_item('recent_listening')" aria-checked="false">
                        <div class="dot"></div>
                    </span>
                </div>
            </div>
            <div class="sep"></div>
            <h5>Who can send you messages?</h5>
            <div class="primary-selections">
                ${original_privacy_settings.receiving_msgs}
                <div class="btn primary-selection" id="primary-selection-receiving_msgs-everyone" onclick="_update_inbuilt_selection('id_message_privacy', 0)">
                    <h5>${trans_legacy[lang].settings.inbuilt.privacy.receiving_msgs.settings.everyone.name}</h5>
                </div>
                <div class="btn primary-selection" id="primary-selection-receiving_msgs-neighbours" onclick="_update_inbuilt_selection('id_message_privacy', 1)">
                    <h5>${trans_legacy[lang].settings.inbuilt.privacy.receiving_msgs.settings.neighbours.name}</h5>
                </div>
                <div class="btn primary-selection" id="primary-selection-receiving_msgs-follow" onclick="_update_inbuilt_selection('id_message_privacy', 2)">
                    <h5>${trans_legacy[lang].settings.inbuilt.privacy.receiving_msgs.settings.follow.name}</h5>
                </div>
            </div>
            <div class="sep"></div>
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
            <div class="toggle-container" id="container-disable_shoutbox">
                <button class="btn reset" onclick="_reset_inbuilt_item('disable_shoutbox')">Reset to default</button>
                <div class="heading">
                    <h5>${trans_legacy[lang].settings.inbuilt.privacy.disable_shoutbox.name}</h5>
                    <p>${trans_legacy[lang].settings.inbuilt.privacy.disable_shoutbox.bio}</p>
                </div>
                <div class="toggle-wrap">
                    <input class="companion-checkbox" type="checkbox" name="shoutbox_disabled" id="inbuilt-companion-checkbox-disable_shoutbox">
                    <span class="btn toggle" id="toggle-disable_shoutbox" onclick="_update_inbuilt_item('disable_shoutbox')" aria-checked="false">
                        <div class="dot"></div>
                    </span>
                </div>
            </div>
            <div class="settings-footer">
                <button type="submit" class="btn-primary save">
                    ${trans_legacy[lang].settings.save}
                </button>
                <input type="hidden" value="privacy" name="submit">
            </div>
        </form>
    `)

    for (let setting in original_privacy_settings) {
        update_inbuilt_item(setting, original_privacy_settings[setting], false);
    }

    let selects = document.body.querySelectorAll('select');
    selects.forEach((select) => {
        select.setAttribute('onchange', `_update_inbuilt_select('${select.getAttribute('id')}', this.value)`);
        update_inbuilt_select(select.getAttribute('id'), select.value);
    });
}