//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { render_activity_list } from '@/components/shared/activity';
import { log } from '@/build/log';
import { auth, page, root, urls } from '@/build/page';
import { tl, trans } from '@/build/trans';
import {
	checkup_nav,
	checkup_page_structure,
} from '@/components/page/structure';
import { is_same_page, is_url, register_background, update_page } from '@/page';
import { bleh_charts } from '@/pages/home/chart';
import { bleh_native_settings } from '@/pages/lastfm_settings/lastfm_settings';
import { html, render } from 'lighterhtml';
import { ff } from '@/components/settings/sku';
import { load_profile_cache_externally } from '@/pages/profile/profile';
import { settings } from '@/build/config';
import { avatar } from '@/components/shared/avatar';
import { page_header_avatar } from '@/components/music/header';
import { campfire } from './home/campfire';
import { bleh_suggested } from './home/suggested';
import { header_colour } from '@/components/page/colour';
import { beta_indicator, new_indicator } from '@/components/shared/indicator';
import { version } from '@/main';

export async function bleh_home() {
	page.structure.container = document.body.querySelector('.page-content');
	try {
		page.structure.row = page.structure.container!.querySelector('.row');
		page.structure.main = page.structure.row!.querySelector('.col-main');
		page.structure.side = page.structure.row!.querySelector('.col-sidebar');
	} catch (_e) {
		log('unable to find elements', 'page structure');
	}

	const content_top = document.body.querySelector('.content-top');

	page.name = auth.name;

	checkup_page_structure(false, content_top);
	log('status is', 'page', 'info', page);
	update_page();

	let cache;
	if (auth.name) {
		cache = await load_profile_cache_externally(auth.name);
		if (cache.banner) {
			register_background(cache.banner);
		} else if (
			auth.avatar &&
			!auth.avatar.endsWith('818148bf682d429dc215c1705eb27b98.png')
		) {
			register_background(avatar(auth.avatar, 'ar0'));
		} else {
			register_background(null);
		}
	} else {
		register_background(null);
	}

	const hour = new Date().getHours();
	let time;
	if (hour >= 22 || hour <= 6) {
		time = 'night';
	} else if (hour >= 7 && hour <= 10) {
		time = 'morning';
	} else if (hour >= 11 && hour <= 18) {
		time = 'afternoon';
	} else {
		time = 'evening';
	}
	log(`hour ${hour} time ${time}`, 'time');

	const same_page = is_same_page();

	let welcome;
	if (auth.name) {
		let profile_name;
		let page_avatar;

		welcome = html.node`
            <section class="page-header for-profile ${same_page ? 'same' : ''}">
                <div class="page-header-avatar-list">
                    ${page_avatar = page_header_avatar(auth.avatar!)}
                </div>
                <div class="page-header-info has-main-info">
                    <div class="main-info">
                        <div class="greeting">
                            ${tl(trans[`good_${time}_user`])}
                        </div>
                        <div class="title-container">
                            <span class="page-header-title profile-name" ref=${(
			el,
		) => profile_name = el}>
                                ${cache.username || auth.name}
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        `;

		if (settings.display_name_styles) {
			profile_name!.setAttribute('data-font', cache.font);
			profile_name!.setAttribute('data-font-style', cache.font_style);
		}

		header_colour(page_avatar.image, false, [page_avatar]);
	} else {
		welcome = html.node`
            <section class="page-header for-profile">
                <div class="page-header-avatar-list">
                    <div class="page-header-avatar">
                        <img class="missing-avatar">
                    </div>
                </div>
                <div class="page-header-info has-main-info">
                    <div class="main-info">
                        <div class="greeting">
                            ${tl(trans[`good_${time}_user`])}
                        </div>
                        <div class="title-container">
                            <h1 class="page-header-title">${
			tl(trans.not_logged_in)
		}</h1>
                        </div>
                    </div>
                </div>
            </section>
        `;
	}

	page.structure.container!.insertBefore(
		welcome,
		page.structure.container!.firstElementChild,
	);

	let nav;
	if (auth.name) {
		nav = html.node`
            <nav class="navlist secondary-nav navlist--more redesigned-navigation">
                <ul class="navlist-items">
                    <li class="navlist-item secondary-nav-item secondary-nav-item--home">
                        <a href="${root}music" class="secondary-nav-item-link ${
			(page.subpage == 'music' || page.type == 'events')
				? 'secondary-nav-item-link--active'
				: ''
		}">
                            ${tl(trans.home)}
                            ${beta_indicator()}
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--recommendations">
                        <a href="${root}music/+recommended" class="secondary-nav-item-link ${
			(page.type == 'recommended')
				? 'secondary-nav-item-link--active'
				: ''
		}">
                            ${tl(trans.recommendations)}
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--releases">
                        <a href="${root}music/+releases/out-now" class="secondary-nav-item-link ${
			(page.type == 'releases') ? 'secondary-nav-item-link--active' : ''
		}">
                            ${tl(trans.releases)}
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--bookmarks">
                        <a href="${root}music/+bookmarks" class="secondary-nav-item-link ${
			(page.type == 'bookmarks') ? 'secondary-nav-item-link--active' : ''
		}">
                            ${tl(trans.bookmarks)}
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--charts">
                        <a href="${root}charts" class="secondary-nav-item-link ${
			(page.type == 'charts') ? 'secondary-nav-item-link--active' : ''
		}">
                            ${tl(trans.charts)}
                            ${ff('aihara') ? new_indicator() : ''}
                        </a>
                    </li>
                    ${
			ff('minis')
				? html.node`
                    <li class="navlist-item secondary-nav-item secondary-nav-item--minis">
                        <a href="${root}bleh/minis" data-type="mini" class="secondary-nav-item-link ${
					(page.type == 'minis')
						? 'secondary-nav-item-link--active'
						: ''
				}">
                            ${tl(trans.minis)}
                        </a>
                    </li>
                    `
				: ''
		}
                    <li class="fill"></li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--bleh">
                        <a href="${root}bleh" class="secondary-nav-item-link ${
			(page.type == 'bleh_settings')
				? 'secondary-nav-item-link--active'
				: ''
		}">
                            ${version.brand}
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--settings">
                        <a href="${root}settings" class="secondary-nav-item-link ${
			(page.type == 'settings') ? 'secondary-nav-item-link--active' : ''
		}">
                            ${tl(trans.settings)}
                        </a>
                    </li>
                </ul>
            </nav>
        `;
	} else {
		nav = html.node`
            <nav class="navlist secondary-nav navlist--more redesigned-navigation">
                <ul class="navlist-items">
                    <li class="navlist-item secondary-nav-item secondary-nav-item--home">
                        <a href="${root}music" class="secondary-nav-item-link ${
			(page.subpage == 'music' || page.type == 'events')
				? 'secondary-nav-item-link--active'
				: ''
		}">
                            ${tl(trans.home)}
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--charts">
                        <a href="${root}charts" class="secondary-nav-item-link ${
			(page.type == 'charts') ? 'secondary-nav-item-link--active' : ''
		}">
                            ${tl(trans.charts)}
                        </a>
                    </li>
                    <li class="fill"></li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--bleh">
                        <a href="${root}bleh" class="secondary-nav-item-link ${
			(page.type == 'bleh_settings')
				? 'secondary-nav-item-link--active'
				: ''
		}">
                            ${tl(trans.settings)}
                        </a>
                    </li>
                </ul>
            </nav>
        `;
	}

	page.structure.nav = nav;
	welcome.after(nav);
	checkup_nav();

	if (page.type == 'charts') {
		if (is_url(urls.explore_charts)) {
			page.type = 'explore_charts';
		} else if (is_url(urls.geo_charts)) {
			page.type = 'geo_charts';
		}

		bleh_charts();

		return;
	}

	if (page.type == 'settings') {
		return bleh_native_settings();
	}

	if (page.subpage == 'music') {
		const music_sections = document.body.querySelectorAll('.music-section');
		music_sections.forEach((music_section) => {
			const link = music_section.querySelector('.music-more-link > a');
			if (link) {
				const href = link.getAttribute('href')!;
				if (href.endsWith('releases/out-now')) {
					music_section.classList.add('music-section-out-now');
				} else if (href.endsWith('releases/out-now/popular')) {
					music_section.classList.add(
						'music-section-out-now-popular',
					);
				} else if (href.endsWith('recommended/albums')) {
					music_section.classList.add(
						'music-section-recommended-albums',
					);
				} else if (href.endsWith('releases/coming-soon/popular')) {
					music_section.classList.add('music-section-coming-soon');
				}
			}

			page.structure.main!.appendChild(music_section);
		});
	}

	if (page.subpage == 'music' && auth.name) {
		if (ff('campfire')) {
			campfire();
		} else {
			const toolbar = html.node`
                <div class="toolbar">
                    <nav class="navlist secondary-nav navlist--more redesigned-navigation">
                        <ul class="navlist-items">
                            <li class="navlist-item secondary-nav-item">
                                <a href="${root}user/${auth.name}" data-type="mention" class="secondary-nav-item-link">
                                    ${tl(trans.profile)}
                                </a>
                            </li>
                            <li class="navlist-item secondary-nav-item">
                                <a href="${root}user/${auth.name}/library" data-type="library" class="secondary-nav-item-link">
                                    ${tl(trans.library)}
                                </a>
                            </li>
                            <li class="navlist-item secondary-nav-item">
                                <a href="${root}user/${auth.name}/following" data-type="profile" class="secondary-nav-item-link">
                                    ${tl(trans.friends)}
                                </a>
                            </li>
                            <li class="navlist-item secondary-nav-item">
                                <a href="${root}user/${auth.name}/shoutbox" data-type="shouts" class="secondary-nav-item-link">
                                    ${tl(trans.shouts)}
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            `;

			page.structure.row!.insertBefore(toolbar, page.structure.content);

			let track_list;
			page.structure.row!.insertBefore(
				html.node`
                <div class="content override">
                    <div class="col-main" ref=${(el) =>
					page.structure.main = el}>
                        <section>
                            <h2>${tl(trans.recent_tracks)}</h2>
                            <div class="recent-listening-container" ref=${(
					el,
				) => track_list = el}>
                                <div class="loading-data-container">
                                    <p class="loading-data-text">${
					tl(trans.finding_your_tracks)
				}</p>
                                </div>
                            </div>
                        </section>
                    </div>
                    <div class="col-sidebar" ref=${(el) =>
					page.structure.side = el}>
                        <section>
                            <h2>${tl(trans.activity)}</h2>
                            ${render_activity_list()}
                            <div class="more-link">
                                <a href="${root}bleh/profile?setting=activities">${
					tl(trans.activity_settings)
				}</a>
                            </div>
                        </section>
                    </div>
                </div>
            `,
				page.structure.content,
			);

			fetch(`${root}user/${auth.name}/partial/recenttracks?ajax=1`)
				.then(function (response) {
					console.log('returned', response, response.text);

					return response.text();
				})
				.then(function (html) {
					const doc = new DOMParser().parseFromString(
						html,
						'text/html',
					);
					console.log('DOC', doc);

					const tracklist_panel = doc.querySelector('.chartlist');

					if (tracklist_panel) {
						track_list.outerHTML = tracklist_panel.outerHTML;
					}
				});
		}
	} else if (page.type == 'releases') {
		const content = page.structure.main!.querySelectorAll(':scope > *');
		const panel = html.node`
            <section class="releases-panel" />
        `;

		content.forEach((element) => {
			panel.appendChild(element);
		});

		render(page.structure.main!, panel);
	} else if (page.type == 'recommended') {
		bleh_suggested();
	}
}

export function bleh_home_legacy() {
	const main_content = document.body.querySelector(
		'.adaptive-skin-container',
	);
	if (!main_content) return;

	render(main_content, html``);

	window.location.href = `${root}music`;
}

export function load_recent_tracks(name: string) {
	return new Promise((resolve, reject) => {
		fetch(`${root}user/${name}/partial/recenttracks?ajax=1`)
			.then(function (response) {
				console.log('returned', response, response.text);

				return response.text();
			})
			.then(function (dom) {
				const doc = new DOMParser().parseFromString(dom, 'text/html');
				console.log('DOC', doc);

				const tracks = [];
				const track_list = doc.querySelectorAll('.chartlist-row');
				if (track_list.length > 0) {
					track_list.forEach((track) => {
						const item = {};

						item.avatar = track.querySelector(
							'.chartlist-image img',
						);
						if (item.avatar) {
							item.avatar = item.avatar.src;
						}

						item.name = track.querySelector('.chartlist-name a')
							.textContent.trim();
						item.sister = track.querySelector('.chartlist-artist a')
							.textContent.trim();

						item.time = Number(
							track.getAttribute('data-timestamp'),
						);

						item.live = track.querySelector(
							'.chartlist-timestamp > .chartlist-now-scrobbling',
						) != null;

						tracks.push(item);
					});
				}

				resolve(tracks);
			})
			.catch(reject);
	});
}
