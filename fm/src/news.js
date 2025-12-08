//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { html } from 'lighterhtml';
import { log } from './build/log';
import { page, root } from './build/page';
import { tl, trans } from './build/trans';
import { dialog, dialog_rm } from './components/dialog';
import { sponsor_list } from './build/sponsor.js';
import { markdown } from './components/markdown.js';
import { set_storage } from './build/tools.js';
import { sponsor } from './sponsor.js';

export function news() {
    let changelog = localStorage.getItem('bleh_changelog');
    let changelog_expire = new Date(
        localStorage.getItem('bleh_changelog_expire')
    );

    let current_time = new Date();

    if (!changelog) {
        log('not cached, fetching', 'changelog');
        request_changelog();

        dialog_rm({ id: 'rabbit' });
    } else {
        if (changelog_expire < current_time) request_changelog();
        else open_changelog(JSON.parse(changelog));
    }
}

export function request_changelog(open_after = true) {
    let button = page.state.navigation_menu_news;
    if (button) button.setAttribute('disabled', '');

    let xhr = new XMLHttpRequest();
    let url = `https://katelyynn.github.io/bleh/fm/changelog/changelog.json?${Math.random()}`;
    xhr.open('GET', url, true);

    xhr.onload = function () {
        log(`responded with ${xhr.status}`, 'changelog');

        if (xhr.status != 200) {
            log(
                'request has been cancelled, will request again in 1h',
                'changelog'
            );
            api_expire.setHours(api_expire.getHours() + 1);
        }

        // set expire date
        let api_expire = new Date();

        if (xhr.status == 200) {
            if (open_after) {
                try {
                    open_changelog(JSON.parse(this.response));

                    // save to cache for next page load
                    set_storage('bleh_changelog', this.response);
                    api_expire.setHours(api_expire.getHours() + 2);
                    log(`cached until ${api_expire}`, 'changelog');

                    set_storage('bleh_changelog_expire', api_expire);
                } catch (e) {
                    deliver_notif(
                        'The changelog is currently unavailable due to errors, try again later.',
                        true
                    );
                    console.error(e);
                }
            }
        }

        if (button != null) button.removeAttribute('disabled');
    };

    xhr.send();
}

function open_changelog(changelog) {
    const sponsor_name = sponsor_list && sponsor_list.special ? sponsor_list.special[0] : 'clairedoll';
    let changelog_list;

    const window = dialog({
        id: 'changelog',
        title: {
            html: tl(trans.news_from_user, {
                user: `<a class="mention" href="${root}user/${sponsor_name}">@${sponsor_name}</a>`
            })
        },
        body: html.node`
            <div class="cta first sponsor colourful margin-bottom">
                <strong>${tl(trans.news_sponsor_cta)}</strong>
                <a class="see-more" onclick=${() => sponsor(true)}>${tl(trans.sponsor)}</a>
            </div>
            <div class="changelog-list" ref=${el => changelog_list = el}></div>
        `,
        type: 'changelog',
        allow_scroll: true
    });

    let index = 0;
    for (let version in changelog) {
        if (version == 'updated' || version == 'latest') continue;

        //if (index > 10) continue;

        const version_item = html.node`
            <div class="changelog-version-item" data-changelog-type="${changelog[version].type}" data-changelog-latest="${index == 0 ? 'true' : 'false'}" data-changelog-version="${version}">
                <div class="version-item-header">
                    <div class="sub-text">
                        <div class="breadcrumb">
                            <div class="breadcrumb-origin">
                                ${version}
                            </div>
                            <div class="breadcrumb-name">
                                ${tl(trans.news.type[changelog[version].type])}
                            </div>
                        </div>
                    </div>
                    <h3>${changelog[version].name}</h3>
                    ${version == '2025.0113' ? html.node`<h4 class="header-over">${changelog[version].name}</h4>` : ''}
                </div>
                <div class="version-item-body markdown-body">
                    ${markdown(changelog[version].bio, {
                        allow_lists: true,
                        allow_headers: true,
                        starting_header: 5,
                        in_dialog: true
                    })}
                </div>
            </div>
        `;

        if (changelog[version].type == 'major')
            version_item.setAttribute('id', 'latest_major_release');

        changelog_list.appendChild(version_item);

        index++;
    }
}

unsafeWindow._update_local_changelog_cache = function (json) {
    set_storage('bleh_changelog', JSON.stringify(json));
};
