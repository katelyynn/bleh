/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { settings } from '@/build/config';
import { log } from '@/build/log';
import { auth, page, recent_activity_list, root } from '@/build/page';
import { romanise, sanitise, set_storage } from '@/build/tools';
import { tl, trans } from '@/build/trans';
import {
	correct_artist,
	correct_item_by_artist,
	name_includes,
	smart_artists,
	smart_title,
} from '@/components/music/lotus';
import { html, render } from 'lighterhtml';
import { redirect } from '@/components/music/music';
import tippy from 'tippy.js';
import { DateTime } from 'luxon';
import { useSettings } from '@/page.ts';

export function get_activity_list() {
	load_activities();

	// we want to show in date order from latest to oldest down
	// but .reverse() is destructive, so we copy first
	let recent_activity_list_r = recent_activity_list;
	recent_activity_list_r.reverse();

	return recent_activity_list_r;
}

export function render_activity_list() {
	load_activities();

	let activity_list = html.node`
        <div class="activity-list" />
    `;

	// we want to show in date order from latest to oldest down
	// but .reverse() is destructive, so we copy first
	let recent_activity_list_r = recent_activity_list;
	recent_activity_list_r.reverse();

	recent_activity_list_r.forEach((activity) => {
		activity_list.appendChild(render_activity(activity));
	});

	return activity_list;
}

export function render_activity(activity) {
	// type: string,
	// involved: [{name: string, type: user | artist | album | track}, sister?: string],
	// context: string,
	// date: string

	const activity_item = html.node`
        <a class="activity-item activity--${activity.type} icon" href=${activity.context} />
    `;

	let involved_text = '';

	let tooltip_name;
	let tooltip_sister;

	activity.involved.forEach((involved) => {
		let involved_link;

		if (involved.type == 'user') {
			involved_link = `${root}user/${involved.name}`;
		} else if (involved.type == 'artist') {
			involved_link = `${root}music/${redirect()}${
				sanitise(involved.name)
			}`;
		} else if (involved.type == 'album') {
			involved_link = `${root}music/${redirect()}${
				sanitise(involved.sister)
			}/${sanitise(involved.name)}`;
		} else if (involved.type == 'track') {
			involved_link = `${root}music/${redirect()}${
				sanitise(involved.sister)
			}/_/${sanitise(involved.name)}`;
		} else if (involved.type == 'tag') {
			involved_link = `${root}tag/${sanitise(involved.name)}`;
		} else if (involved.type == 'bwaa') involved_link = `${root}bwaa`;
		else if (involved.type == 'bleh') involved_link = `${root}bleh`;

		let name = involved.name;
		let sister = involved.sister;

		// tooltip
		if (
			involved.type != 'artist' &&
			involved.type != 'user' &&
			involved.type != 'tag' &&
			involved.type != 'bwaa' &&
			involved.type != 'bleh'
		) {
			tooltip_name = name;
			tooltip_sister = sister;
		}

		if (
			involved.type == 'track' && useSettings.get('format_guest_features')
		) {
			const formatted = name_includes(name, sister);

			name = html.node`${
				smart_title(formatted.song_title, formatted.song_tags)
			}`;
			sister = html.node`${
				smart_artists(formatted.song_artist, formatted.song_guests)
			}`;

			tooltip_name = formatted.corrected_title;
			tooltip_sister = formatted.song_artist;
		} else if (
			(involved.type == 'album' || involved.type == 'track') &&
			useSettings.get('corrections')
		) {
			name = romanise(correct_item_by_artist(name, sister));
			tooltip_name = name;
			sister = romanise(correct_artist(sister));
			tooltip_sister = sister;
		} else if (
			involved.type == 'artist' && useSettings.get('corrections')
		) {
			name = romanise(correct_artist(name));
		}

		if (involved_text != '') {
			involved_text = html
				.node`${involved_text}, <a class="wiki-link icon wiki-link-smart-title" data-link-type=${involved.type} href="${involved_link}">${name}</a>`;
		} else {
			involved_text = html
				.node`${involved_text}<a class="wiki-link icon wiki-link-smart-title" data-link-type=${involved.type} href="${involved_link}">${name}</a>`;
		}
	});

	render(
		activity_item,
		html`
			<div class="type">
			    ${tl(trans.activity.listing[activity.type])}
			    <div class="date">
			        ${DateTime.fromISO(activity.date).toRelative()}
			    </div>
			</div>
			<div class="name">${involved_text}</div>
		`,
	);

	if (tooltip_name) {
		tippy(activity_item.querySelector('.name a'), {
			theme: 'name-sister-combo',
			content: html.node`
                <span class="name">${tooltip_name}</span>
                <span class="sister">${tooltip_sister}</span>
            `,
		});
	}

	return activity_item;
}

export function subscribe_to_events() {
	if (!settings.activities || !page.structure.main) return;

	let love_track = page.structure.container.querySelectorAll(
		`form[action="${root}user/${auth.name}/loved"]:not([data-bleh-subscribed])`,
	);
	love_track.forEach((form) => {
		form.setAttribute('data-bleh-subscribed', 'true');

		let track = form.querySelector('[name="track"]')?.getAttribute('value');
		let artist = form
			?.querySelector('[name="artist"]')
			?.getAttribute('value');

		if (!track || !artist) return;

		artist = correct_artist(artist);
		track = correct_item_by_artist(track, artist);

		let btn = form.querySelector('button');

		btn.addEventListener(
			'click',
			(event) => {
				event.preventDefault();

				log('heard', 'event', 'info', event);

				let action = btn.getAttribute('data-analytics-action');

				if (btn.getAttribute('data-type') == 'love') {
					btn.textContent = tl(trans.love_track);
				} else if (btn.getAttribute('data-type') == 'bookmark') {
					btn.textContent = tl(trans.bookmark_item, {
						v: tl(trans[`${page.type}_lower`]),
					});
				}

				register_activity(
					action == 'LoveTrack' ? 'love' : 'unlove',
					[{ name: track, type: 'track', sister: artist }],
					`${root}music/${redirect()}${sanitise(artist)}/_/${
						sanitise(track)
					}`,
				);
			},
			false,
		);
	});

	let bookmark_item = document.body.querySelectorAll(
		`form[action="/music/+bookmarks"]:not([data-bleh-subscribed])`,
	);
	bookmark_item.forEach((form) => {
		form.setAttribute('data-bleh-subscribed', 'true');

		let btn = form.querySelector('button');

		btn.addEventListener(
			'click',
			(event) => {
				log('heard', 'event', 'info', event);

				let action = btn.getAttribute('data-analytics-action');

				register_activity(
					action.startsWith('Bookmark') ? 'bookmark' : 'unbookmark',
					[{ name: page.name, type: page.type, sister: page.sister }],
					window.location.href,
				);
			},
			false,
		);
	});

	let obsess = document.body.querySelectorAll(
		`.modal-body form[action$="${auth.name}/obsessions"]:not([data-bleh-subscribed])`,
	);
	obsess.forEach((form) => {
		form.setAttribute('data-bleh-subscribed', 'true');

		let track = form.querySelector('[name="name"]').getAttribute('value');
		let artist = form
			.querySelector('[name="artist_name"]')
			.getAttribute('value');

		artist = correct_artist(artist);
		track = correct_item_by_artist(track, artist);

		let btn = form.querySelector('button');

		btn.addEventListener(
			'click',
			(event) => {
				log('heard', 'event', 'info', event);

				register_activity(
					'obsess',
					[{ name: track, type: 'track', sister: artist }],
					window.location.href,
				);
			},
			false,
		);
	});

	const post_shouts = page.structure.main.querySelectorAll(
		'.btn-post-shout:not([data-bleh-subscribed])',
	);
	post_shouts.forEach((post) => {
		post.setAttribute('data-bleh-subscribed', 'true');

		post.addEventListener(
			'click',
			(e) => {
				log('heard', 'event', 'info', e);

				// wait 0.15s
				setTimeout(() => {
					const is_loading = post.classList.contains('btn--loading');
					console.info(is_loading, post.classList);
					if (!is_loading) return;

					register_activity(
						'shout',
						[
							{
								name: page.name,
								type: page.type,
								sister: page.sister,
							},
						],
						window.location.href,
					);
				}, 150);
			},
			false,
		);
	});

	let save_wiki_form = document.body.querySelector(
		'.wiki-edit-form:not([data-bleh-subscribed])',
	);
	if (save_wiki_form) {
		save_wiki_form.setAttribute('data-bleh-subscribed', 'true');

		let btn = save_wiki_form.querySelector('.form-submit button');

		btn.addEventListener(
			'click',
			(event) => {
				log('heard', 'event', 'info', event);

				register_activity(
					'wiki',
					[{ name: page.name, type: page.type, sister: page.sister }],
					window.location.href,
				);
			},
			false,
		);
	}

	let upload_img_form = document.body.querySelector(
		'form[action$="/+images/upload"]:not([data-bleh-subscribed])',
	);
	if (upload_img_form) {
		upload_img_form.setAttribute('data-bleh-subscribed', 'true');

		let btn = upload_img_form.querySelector('.form-submit button');
		if (!btn) btn = upload_img_form.querySelector('button[type="submit"]');
		if (btn) {
			btn.addEventListener(
				'click',
				(event) => {
					log('heard', 'event', 'info', event);

					register_activity(
						'image_upload',
						[
							{
								name: page.name,
								type: page.type,
								sister: page.sister,
							},
						],
						window.location.href,
					);
				},
				false,
			);
		}
	}
}

export function load_activities() {
	if (!settings.activities) return;
	recent_activity_list.length = 0;
	recent_activity_list.push(
		...(JSON.parse(localStorage.getItem('bwaa_recent_activity')) || []),
	);
	log('loaded', 'activity', 'info', recent_activity_list);

	// check if over 10
	check_activities_length();

	log('saved', 'activity', 'info', recent_activity_list);
	set_storage('bwaa_recent_activity', JSON.stringify(recent_activity_list));
}

function check_activities_length() {
	if (recent_activity_list.length > 10) {
		let to_delete = recent_activity_list.length - 10;

		recent_activity_list.splice(0, to_delete);
		log(`reached maximum of 10, removed leftovers`, 'activity');
	}

	return recent_activity_list;
}

export function register_activity(type, involved, context, date = new Date()) {
	if (!settings.activities) return;

	if (type == 'shout') {
		if (!settings.activity_shout) return;
	} else if (type == 'image_upload' || type == 'image_star') {
		if (!settings.activity_image) return;
	} else if (type == 'obsess' || type == 'unobsess') {
		if (!settings.activity_obsess) return;
	} else if (type == 'love' || type == 'unlove') {
		if (!settings.activity_love) return;
	} else if (type == 'bookmark' || type == 'unbookmark') {
		if (!settings.activity_bookmark) return;
	} else if (
		type == 'install_bwaa' ||
		type == 'update_bwaa' ||
		type == 'install_bleh' ||
		type == 'update_bleh'
	) {
		if (!settings.activity_install) return;
	} else if (type == 'wiki') {
		if (!settings.wiki) return;
	}

	recent_activity_list.length = 0;
	recent_activity_list.push(
		...(JSON.parse(localStorage.getItem('bwaa_recent_activity')) || []),
	);

	log('loaded', 'activity', 'info', recent_activity_list);

	recent_activity_list.push({
		type: type,
		involved: involved,
		context: context,
		date: date,
	});

	log('registered new', 'activity', 'info', {
		type: type,
		involved: involved,
		context: context,
		date: date,
	});

	// check if over 10
	check_activities_length();

	log('saved', 'activity', 'info', recent_activity_list);
	set_storage('bwaa_recent_activity', JSON.stringify(recent_activity_list));
}
