/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { settings } from '@/build/config';
import { auth, page, root } from '@/build/page';
import { romanise, sanitise } from '@/build/tools';
import { lang, tl, trans } from '@/build/trans';
import {
	correct_artist,
	correct_item_by_artist,
	name_includes,
	smart_artists,
	smart_title,
} from '@/components/music/lotus';
import { redirect } from '@/components/music/music';
import { Hole, html, render } from 'lighterhtml';
import {
	load_profile_cache_externally,
	open_starred_friend_window,
} from '../profile/profile';
import { load_recent_tracks } from '../home';
import { is_sponsor, sponsor } from '@/components/sponsor';
import { DateTime } from 'luxon';
import { icon, icons } from '@/components/shared/icon';
import { UnderConstruction } from '@/components/shared/construction.tsx';
import { useSettings } from '@/config.ts';

interface album {
	image: string;
	title: string;
	artist: string;
	plays: string;
	corrected_title: string;
	corrected_artist: string;
}

export function campfire() {
	let previous_index = 0;
	let max_index = 0;
	let items_container: HTMLElement;
	let item_details: HTMLElement;
	let current_bg: HTMLElement;
	let previous_bg: HTMLElement;

	let visual_index = 0;
	let real_index = 0;
	let is_wrapping = false;

	let campfire_top;
	let campfire_main;
	let campfire_side;
	const container = html.node`
    <div class="campfire-panels">
      <div class="campfire-bg current" ref=${(el) => current_bg = el} />
      <div class="campfire-panel-main" ref=${(el) => campfire_main = el}>
        <div class="campfire" ref=${(el) => campfire_top = el}>
          <div class="campfire-intro">
            <h2 class="music-section-heading">${
		tl(trans.your_recent_30_days)
	}</h2>
          </div>
          <div class="campfire-items" ref=${(el) => items_container = el} />
          <div class="campfire-details" ref=${(el) => item_details = el} />
          <div class="campfire-bg previous" ref=${(el) => previous_bg = el} />
        </div>
      </div>
      <div class="campfire-panel-side" ref=${(el) => campfire_side = el}>
        <section class="side-actions">
          <a class="btn side-action icon-mask" data-type="profile" href="${root}user/${auth.name}">
            ${tl(trans.profile)}
          </a>
          <a class="btn side-action icon-mask" data-type="library" href="${root}user/${auth.name}/library">
            ${tl(trans.library)}
          </a>
          <a class="btn side-action icon-mask" data-type="friends" href="${root}user/${auth.name}/friends">
            ${tl(trans.friends)}
          </a>
          <a class="btn side-action icon-mask" data-type="shouts" href="${root}user/${auth.name}/shoutbox">
            ${tl(trans.shouts)}
          </a>
        </section>
      </div>
    </div>
  `;

	page.structure.row!.insertBefore(container, page.structure.content);

	campfire_extended(campfire_side);
	campfire_cta(container);

	const albums: album[] = [];
	const album_elements: { elem: HTMLElement; index: number }[] = [];

	fetch(
		`${root}user/${auth.name}/library/albums?date_preset=LAST_30_DAYS&page=1&ajax=1`,
	)
		.then(function (response) {
			console.log('returned', response, response.text);

			return response.text();
		})
		.then(function (dom) {
			const doc = new DOMParser().parseFromString(dom, 'text/html');
			console.log('DOC', doc);

			const items = doc.querySelectorAll('.chartlist-row');
			items.forEach((item) => {
				const image = item.querySelector('.cover-art > img').src;
				const title =
					item.querySelector('.chartlist-name > a').textContent;
				const artist =
					item.querySelector('.chartlist-artist > a').textContent;
				const plays = item.querySelector('.chartlist-count-bar-slug')
					.getAttribute('data-stat-value');

				const corrected_title = romanise(
					correct_item_by_artist(title, artist),
				);
				const corrected_artist = romanise(correct_artist(artist));

				albums.push({
					image: image.replace('/64s/', '/500x500/'),
					title,
					artist,
					plays,
					corrected_title,
					corrected_artist,
				});
			});

			max_index = albums.length - 1;

			visual_index = max_index + 1;
			real_index = 0;

			items_container.style.setProperty(
				'--max-index',
				max_index.toString(),
			);

			const cloned_albums = [...albums, ...albums, ...albums];

			render(
				items_container,
				html`
					${cloned_albums.map((album, index) => {
						const item_index =
							((index % albums.length) + albums.length) %
							albums.length;

						const elem = html.node`
            <div class="campfire-item" style="--index: ${index}" onclick=${() => {
							if (is_wrapping) return;

							if (item_index != real_index) {
								let diff = item_index - real_index;
								if (diff > (max_index + 1) / 2) {
									diff -= max_index + 1;
								} else if (diff < -(max_index + 1) / 2) {
									diff += max_index + 1;
								}

								set_index(visual_index + diff);
							}
						}}>
              <div class="campfire-item-cover">
                <img src=${album.image} alt=${album.corrected_title} />
                <div class="campfire-item-cover-reflection" style="background-image: url(${album.image})" />
              </div>
            </div>
          `;

						album_elements.push({ elem, index: item_index });

						return elem;
					})}
				`,
			);

			let timeout;
			campfire_top.addEventListener('wheel', (e) => {
				e.preventDefault();
				if (timeout) return;

				timeout = setTimeout(() => {
					timeout = null;
				}, 0.15);

				const direction = Math.sign(e.deltaY);
				if (direction == 0) return;
				set_index(visual_index + direction);
			}, { passive: false });

			set_index(visual_index);
		});

	function set_index(index: number) {
		if (is_wrapping) return;

		real_index = ((index % albums.length) + albums.length) % albums.length;

		previous_index = visual_index;
		visual_index = index;

		items_container.style.setProperty(
			'--selected-index',
			visual_index.toString(),
		);

		album_elements.forEach(({ elem, index: i }) => {
			elem.setAttribute('aria-checked', (i == real_index).toString());

			let dist = i - real_index;

			if (dist > (max_index + 1) / 2) dist -= max_index + 1;
			else if (dist < -(max_index + 1) / 2) dist += max_index + 1;

			if (dist > 5) dist = 5;
			else if (dist < -5) dist = -5;

			elem.style.setProperty('--proximity', dist.toString());
			elem.setAttribute('data-proximity', dist.toString());
		});

		if (visual_index <= max_index || visual_index >= (max_index * 2) + 2) {
			is_wrapping = true;

			setTimeout(() => {
				items_container.style.setProperty('--trans-toggle', '0');

				visual_index = real_index + max_index + 1;
				items_container.style.setProperty(
					'--selected-index',
					visual_index.toString(),
				);

				void items_container.offsetWidth;

				items_container.style.setProperty('--trans-toggle', '1');
				is_wrapping = false;
			}, 500);
		}

		const album = albums[real_index];

		current_bg.style.setProperty('background-image', `url(${album.image})`);

		console.info('album', album);

		let formatted_title: string | Hole = album.corrected_title;
		let formatted_artist: string | Hole = album.corrected_artist;

		if (useSettings.get('format_guest_features')) {
			const formatted = name_includes(album.title, album.artist);

			formatted_title = smart_title(
				formatted.song_title,
				formatted.song_tags,
			);
			formatted_artist = smart_artists(
				formatted.song_artist,
				formatted.song_guests,
			);
		}

		render(item_details, html``);
		render(
			item_details,
			html`
				<a class="campfire-title smart-title"
					href="${root}music/${sanitise(album.artist)}/${sanitise(
						album.title,
					)}" target="_blank">
				  ${formatted_title}
				</a>
				<span class="campfire-artist">
				  ${useSettings.get('format_guest_features')
					? formatted_artist
					: html
						.node`<a class="campfire-artist" href="${root}music/${redirect()}${
						sanitise(album.artist)
					}" target="_blank">${album.corrected_artist}</a>`}
				</span>
				<div class="campfire-plays">
				  ${tl(trans.count_plays, {
					c: album.plays.toLocaleString(lang),
				})}
				</div>
			`,
		);
	}
}

function campfire_extended(container: HTMLElement) {
	const friends = settings.friends as string[];

	let summary;

	container.appendChild(html.node`
        <section class="friends-panel">
            <h2>${tl(trans.scrobbling_now)}</h2>
            ${
		friends.length > 0
			? html.node`
                <div class="friends">
                  ${campfire_friend(auth.name, true)}
                  ${friends.map((friend: string) => campfire_friend(friend))}
                </div>
            `
			: html.node`
                <div class="friends">
                  ${campfire_friend(auth.name, true)}
                </div>
                <div class="placeholder-block">
                  <div class="placeholder-head">ദ്ദി◝ ⩊ ◜.ᐟ</div>
                  <div class="placeholder-summary" ref=${(el) =>
				summary = el}>${{
				html: tl(trans.better_with_friends, { a: `<a>`, '/a': '</a>' }),
			}}</div>
                </div>
            `
	}
        </section>
    `);

	if (summary) {
		const link = summary.querySelector('a');
		if (!link) return;

		link.onclick = () => {
			open_starred_friend_window();
		};
	}
}

function campfire_friend(friend: string, own = false) {
	let track_info: HTMLElement;
	let user_avatar: HTMLElement;
	let user_name: HTMLElement;
	let track_time: HTMLElement;

	const elem = html.node`
        <div class="user friend hidden-user" data-live="false" data-own=${own}>
          <div class="user-avatar avatar" ref=${(el) => user_avatar = el}>
              <div class="bleh-icon loading-spinner" />
          </div>
            <div class="user-info">
                <div class="user-name">
                    <a class="user-name-inner" href="${root}user/${friend}" ref=${(
		el,
	) => user_name = el}>@${friend}</a>
                    <span class="track-time icon-mask" ref=${(el) =>
		track_time = el} />
                </div>
                <div class="user-about track" ref=${(el) => track_info = el}>
                  <div class="status">
                      <div class="status-image smaller" />
                  </div>
                </div>
            </div>
        </div>
    `;

	load_profile_cache_externally(friend).then((cache) => {
		render(
			user_avatar,
			html`
				<img src=${own ? auth.avatar : cache.avatar} alt=${friend}>
			`,
		);

		if (cache.username) {
			user_name.textContent = cache.username;
		}

		load_recent_tracks(friend).then((tracks) => {
			const item = tracks[0];

			if (item) {
				let sister = item.sister;
				let name = item.name;

				if (useSettings.get('format_guest_features')) {
					const formatted = name_includes(name, sister);

					name = html.node`${
						smart_title(formatted.song_title, formatted.song_tags)
					}`;
					sister = html.node`${
						smart_artists(
							formatted.song_artist,
							formatted.song_guests,
						)
					}`;
				} else if (useSettings.get('corrections')) {
					sister = romanise(correct_artist(item.sister));
					name = romanise(
						correct_item_by_artist(item.name, item.sister),
					);
				}

				const valid = is_sponsor(friend);

				if (cache.username && valid) {
					render(
						user_name,
						html`
							<strong class="username-combo">
								<span class="username-custom">${cache
									.username}</span>
								<span class="username-original">
							        <span class="at">@</span>${friend}
							    </span>
							</strong>
						`,
					);
				} else {
					render(
						user_name,
						html`
							<strong><span class="at">@</span>${friend}</strong>
						`,
					);
				}

				if (!item.live) {
					track_time.textContent = DateTime.fromSeconds(item.time)
						.toRelative();
				} else {
					elem.classList.remove('hidden-user');
					track_time.textContent = tl(trans.scrobbling_now);
					track_time.setAttribute('data-live', 'true');

					elem.setAttribute('data-live', 'true');
				}

				render(
					track_info,
					html`
						<div class="status">
							<div class="status-image smaller" data-live=${item
								.live}>
								<img src=${item.avatar} alt=${name}>
							</div>
							<div class="status-info">
								<strong
									class="status-text status-title smaller"><a class="smart-title" href="${root}music/${redirect()}${sanitise(
										item.sister,
									)}/_/${sanitise(
										item.name,
									)}">${name}</a></strong>
								<p
									class="status-text status-artist smaller"><span class="artist">${sister}</span></p>
							</div>
						</div>
					`,
				);
			}
		});
	});

	return elem;
}

function get_loop_index(index: number, selected: number, max: number): number {
	let diff = index - selected;

	if (diff > (max + 1) / 2) diff -= max + 1;
	else if (diff < -(max + 1) / 2) diff += max + 1;

	return diff;
}

function campfire_cta(container: Element) {
	const cta = html.node`
        <div class="campfire-cta">
            <a class="btn campfire-cta-btn" href="${root}bleh/minis/collage?type=albums&timeframe=date_preset=LAST_30_DAYS">
                <div class="campfire-cta-icon colourful">
                    ${icon({ name: icons.collage })}
                </div>
                <div class="campfire-cta-text">
                    <strong class="campfire-cta-text-head">${
		tl(trans.collage_cta.name)
	}</strong>
                    <p class="campfire-cta-text-sub">${
		tl(trans.collage_cta.body)
	}</p>
                </div>
            </a>
            <a class="btn campfire-cta-btn" href="${root}bleh/minis/compare">
                <div class="campfire-cta-icon colourful">
                    ${icon({ name: icons.compare })}
                </div>
                <div class="campfire-cta-text">
                    <strong class="campfire-cta-text-head">${
		tl(trans.compare_cta.name)
	}</strong>
                    <p class="campfire-cta-text-sub">${
		tl(trans.compare_cta.body)
	}</p>
                </div>
            </a>
            <button class="btn campfire-cta-btn" onclick=${() => sponsor()}>
                <div class="campfire-cta-icon colourful sponsor">
                    ${icon({ name: icons.sponsor })}
                </div>
                <div class="campfire-cta-text">
                    <strong class="campfire-cta-text-head">${
		tl(trans.sponsor)
	}</strong>
                    <p class="campfire-cta-text-sub">${
		tl(trans.sponsor_cta.body)
	}</p>
                </div>
            </button>
        </div>
    `;
	container.after(cta);

	cta.after(<UnderConstruction />);
}
