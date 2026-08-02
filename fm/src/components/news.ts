/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { html, render } from 'lighterhtml';
import { log } from '@/build/log';
import { page, root } from '@/build/page';
import { tl, trans } from '@/build/trans';
import { dialog, dialog_rm } from '@/components/dialog/dialog';
import { sponsor_list } from '@/build/sponsor';
import { markdown } from '@/components/markdown/markdown';
import { set_storage } from '@/build/tools';
import { sponsor } from '@/components/sponsor';
import tippy from 'tippy.js';

export function news() {
	const changelog = localStorage.getItem('bleh_changelog');
	const changelog_expire = new Date(
		localStorage.getItem('bleh_changelog_expire'),
	);

	const current_time = new Date();

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
	const button = page.state.navigation_menu_news;
	if (button) button.setAttribute('disabled', '');

	const xhr = new XMLHttpRequest();
	const url =
		`https://katelyynn.github.io/bleh/fm/changelog/changelog.json?${Math.random()}`;
	xhr.open('GET', url, true);

	xhr.onload = function () {
		log(`responded with ${xhr.status}`, 'changelog');

		if (xhr.status != 200) {
			log(
				'request has been cancelled, will request again in 1h',
				'changelog',
			);
			api_expire.setHours(api_expire.getHours() + 1);
		}

		// set expire date
		const api_expire = new Date();

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
						true,
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
	const sponsor_name = sponsor_list.related.special.length > 0
		? sponsor_list.related.special[0]
		: 'clairedoll';
	let changelog_list: HTMLDivElement;

	const versions = Object.keys(changelog);

	let focused_version = 0;

	const window = dialog({
		id: 'changelog',
		title: {
			html: tl(trans.news_from_user, {
				user:
					`<a class="mention" href="${root}user/${sponsor_name}">@${sponsor_name}</a>`,
			}),
		},
		body: html.node`
            <div class="cta first sponsor colourful margin-bottom">
                <strong>${tl(trans.news_sponsor_cta)}</strong>
                <a class="see-more" onclick=${() => sponsor(true)}>${
			tl(trans.sponsor)
		}</a>
            </div>
            <div class="changelog-list" ref=${(el) =>
			changelog_list = el}></div>
        `,
		type: 'changelog',
		allow_scroll: true,
	});

	render_update();

	function render_update() {
		console.info('news', versions, changelog, focused_version);

		const title = versions[focused_version];
		const version = changelog[title];

		const can_go_back = focused_version > 0;
		const can_go_forward = focused_version < versions.length - 1;

		render(
			changelog_list,
			html`
				<div class="news-update">
					<div class="news-update-head">
				        ${() => {
					const btn = html.node`
                            <button class="btn news-update-action chibi icon-mask" data-type="prev" disabled=${!can_go_forward} onclick=${() => {
						if (!can_go_forward) return;

						focused_version++;
						render_update();
					}}>
                                ${tl(trans.prev)}
                            </button>
                        `;

					tippy(btn, {
						content: btn.textContent,
					});

					return btn;
				}}
				        <div class="news-update-middle">
				            <label class="news-update-label">${tl(
					trans.news.type[version.type],
				)}</label>
				            <h3 class="news-update-name"><span class="news-update-version">${title}:</span> ${version
					.name}</h3>
				        </div>
				        ${() => {
					const btn = html.node`
                            <button class="btn news-update-action chibi icon-mask" data-type="next" disabled=${!can_go_back} onclick=${() => {
						if (!can_go_back) return;

						focused_version--;
						render_update();
					}}>
                                ${tl(trans.next)}
                            </button>
                        `;

					tippy(btn, {
						content: btn.textContent,
					});

					return btn;
				}}
				    </div>
					<div class="news-update-body markdown-body colourful"
						data-changelog-type=${version.type}>
				        ${markdown(version.bio, {
					allow_lists: true,
					allow_headers: true,
					starting_header: 5,
				})}
				    </div>
				</div>
			`,
		);
	}
}

unsafeWindow._update_local_changelog_cache = function (json) {
	set_storage('bleh_changelog', JSON.stringify(json));
};
