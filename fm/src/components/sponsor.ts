/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { html } from 'lighterhtml';
import { log } from '@/build/log';
import { auth, page, root } from '@/build/page';
import { sponsor_list } from '@/build/sponsor';
import { tl, trans } from '@/build/trans';
import { dialog } from '@/components/dialog/dialog';
import { ff } from '@/components/settings/sku';
import { status } from '@/components/dialog/status';
import { parse_object, set_storage } from '@/build/tools';
import { create_badge, process_badge } from '@/components/shared/badge';
import { notify } from '@/components/dialog/notify';
import { avatar } from './shared/avatar';
import JSON5 from 'json5';

export function sponsors(force = false, func?: () => void) {
	if (!ff('sponsor')) return;

	const sponsor_data = localStorage.getItem('kat_sponsors');
	const sponsor_expire = new Date(
		localStorage.getItem('kat_sponsors_expire'),
	);

	const current_time = new Date();

	if (!sponsor_data) {
		log('not cached, fetching', 'sponsor');
		sponsor_request(true, func);
	} else {
		// we prefer to load the current cache before waiting for a new response
		Object.assign(sponsor_list, parse_object('sponsor_data', sponsor_data));

		if (sponsor_list.badges) {
			// old version
			log('detected old sponsor data', 'sponsor');
			sponsor_request(true, func);
			return;
		}

		if (auth.name && sponsor_list.version) {
			auth.sponsor = is_sponsor(auth.name);

			if (sponsor_list.users[auth.name]?.badges) {
				const old_badges = parse_object(
					'sponsor_data',
					localStorage.getItem('kat_sponsor_cache'),
				) || {};

				if (
					JSON5.stringify(old_badges) !=
						JSON5.stringify(sponsor_list.users[auth.name].badges)
				) {
					console.info(
						'sponsor initial',
						old_badges,
						JSON5.stringify(old_badges),
						sponsor_list.users[auth.name].badges,
						JSON5.stringify(sponsor_list.users[auth.name].badges),
					);
					set_storage(
						'kat_sponsor_cache',
						JSON5.stringify(sponsor_list.users[auth.name].badges),
					);
					new_badges(sponsor_list.users[auth.name].badges);

					return;
				}
			}
		}

		// is it valid?
		if (sponsor_expire < current_time && !force) {
			sponsor_request(false, func);
		} else if (force) {
			sponsor_request(true, func);
		}
	}
}

function sponsor_request(should_notify = false, func = null) {
	log(`initiating request with notify ${should_notify}`, 'sponsor');

	const button = document.body.querySelector('[onclick="_sponsor_check()"]');
	if (button) button.setAttribute('disabled', '');

	const xhr = new XMLHttpRequest();
	const url =
		`https://katelyynn.github.io/bleh/fm/public/sponsors.json5?${Math.random()}`;
	xhr.open('GET', url, true);

	xhr.onload = function () {
		log(`list responded with ${xhr.status}`, 'sponsor');

		// set expire date
		const api_expire = new Date();

		if (xhr.status != 200) {
			log(
				'request has been cancelled, will request again in 1h',
				'sponsor',
			);
			api_expire.setHours(api_expire.getHours() + 1);
		}

		if (xhr.status == 200) {
			try {
				Object.assign(
					sponsor_list,
					parse_object('sponsor_data', this.response),
				);

				if (auth.name && sponsor_list.version) {
					auth.sponsor = is_sponsor(auth.name);

					if (sponsor_list.users[auth.name]?.badges) {
						const old_badges = parse_object(
							'sponsor_data',
							localStorage.getItem('kat_sponsor_cache'),
						) || {};

						if (
							JSON5.stringify(old_badges) !=
								JSON5.stringify(
									sponsor_list.users[auth.name].badges,
								)
						) {
							console.info(
								'sponsor request',
								old_badges,
								sponsor_list.users[auth.name],
							);
							set_storage(
								'kat_sponsor_cache',
								JSON5.stringify(
									sponsor_list.users[auth.name].badges,
								),
							);
							new_badges(sponsor_list.users[auth.name].badges);
						}
					}
				}

				if (should_notify) {
					status({
						title: tl(trans.downloaded_value, {
							v: tl(trans.sponsor_details),
						}),
					});
				}

				// save to cache for next page load
				set_storage('kat_sponsors', this.response);
				if (func) func();

				api_expire.setHours(api_expire.getHours() + 4);
				log(`list cached until ${api_expire}`, 'sponsor');
			} catch (e) {
				log('parsing list failed', 'sponsor', 'error', { e });
				notify({
					id: 'sponsor_failed',
					title: tl(trans.value_failed_to_load, {
						v: tl(trans.sponsor_details),
					}),
					body: e.message || e,
					type: 'error',
					persist: true,
				});
				if (func) func(false);

				api_expire.setHours(api_expire.getMinutes() + 30);
				log(`list cached until ${api_expire}`, 'sponsor');
			}
		}

		set_storage('kat_sponsors_expire', api_expire);

		if (button) button.removeAttribute('disabled');
	};

	xhr.send();
}

unsafeWindow._sponsor_check = function () {
	sponsors(true);
};

unsafeWindow._sponsor = function (replace = false) {
	sponsor(replace);
};
export function sponsor(replace = false) {
	if (sponsor_list.version) {
		open(sponsor_list.related.link);
		return;
	}

	open('https://katelyn.moe/sponsor');
}

unsafeWindow._sponsor_manage = function () {
	sponsor_manage();
};
export function sponsor_manage() {
	if (!auth.name) return;

	window.location.href =
		`${root}inbox/compose?to=${sponsor_list.related.account_name}`;
}

export function bleh_sponsor_page() {
	document.body.style.removeProperty('--hue-album');
	document.body.style.removeProperty('--sat-album');
	document.body.style.removeProperty('--lit-album');

	const adaptive_skin_container = document.querySelector(
		'.adaptive-skin-container:not([data-bleh])',
	);

	if (adaptive_skin_container == null) return;
	adaptive_skin_container.setAttribute('data-bleh', 'true');

	// initial
	adaptive_skin_container.innerHTML = '';

	log('internal bleh sponsor', 'page');
	page.type = 'bleh_sponsor';
	page.subpage = '';

	sponsor();
}

export function new_badges(badges) {
	dialog({
		id: 'sponsor_new_badges',
		title: tl(trans.sponsor),
		body: html.node`
            <div class="modal-vertical-inner support-inner">
                <div class="avatar">
                    <img src="${avatar(auth.avatar, 'avatar170s')}" alt="${
			tl(trans.your_avatar)
		}">
                </div>
                <h1>${tl(trans.you_have_new_badges)}</h1>
                <div class="badges">
                    ${
			Array.isArray(badges)
				? badges.map((badge) =>
					create_badge(process_badge(badge, auth.name))
				)
				: create_badge(process_badge(badges, auth.name))
		}
                </div>
            </div>
        `,
		type: 'sponsor',
	});
}

export function is_sponsor(name: string) {
	if (!sponsor_list.version) return false;

	if (sponsor_list.related.special.includes(name)) return true;

	let entry = sponsor_list.users[name];

	if (entry) {
		entry = {
			sponsor: true,
			contributor: false,
			...entry,
		};

		return entry.sponsor;
	}

	return false;
}
