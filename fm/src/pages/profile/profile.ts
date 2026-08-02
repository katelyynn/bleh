//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { render_activity_list } from '@/components/shared/activity';
import { settings } from '@/build/config';
import { log } from '@/build/log.js';
import { auth, page, root } from '@/build/page';
import { sponsor_list } from '@/build/sponsor';
import { clean_number, copy, romanise, set_storage } from '@/build/tools';
import { tl, trans } from '@/build/trans';
import { load_chart_colours } from '@/components/music/chart';
import { create_badge, load_badges } from '@/components/shared/badge';
import { dialog } from '@/components/dialog/dialog';
import {
	correct_artist,
	correct_item_by_artist,
	name_includes,
	smart_artists,
	smart_title,
} from '@/components/music/lotus';
import { markdown } from '@/components/shared/markdown';
import { redesign_profile_header } from '@/components/profile/profile_header';
import {
	select,
	select_prepare,
	select_prepare_list,
} from '@/components/settings/select';
import {
	checkup_page_structure,
	convert_to_toolbar,
} from '@/components/page/structure.js';
import { is_same_page, register_background, update_page } from '@/page';
import { ff } from '@/components/settings/sku';
import { bleh_user_library } from '@/pages/profile/glacier';
import { bleh_obsession, obsession_list } from '@/pages/profile/obsession';
import { html, render } from 'lighterhtml';
import { save_setting, setting } from '@/components/settings/settings';
import { submit_scrobble } from '@/components/music/scrobble';
import tippy from 'tippy.js';
import { avatar, style_name_from_badge } from '@/components/shared/avatar';
import { status } from '@/components/dialog/status.js';
import { hoshino } from '@/components/music/hoshino.js';
import { find_pronouns } from '@/components/profile/pronouns';
import { queue_popup } from '@/components/dialog/popup';
import { bleh_playlist } from '@/pages/profile/playlist';
import { profile_reports } from './reports';
import { toggle } from '@/components/settings/toggle';
import { page_header_avatar } from '@/components/music/header';
import { profile_summary } from '@/components/profile/summary';
import { header_colour } from '@/components/page/colour';
import { keys } from '@/components/settings/storage';
import { beta_indicator } from '@/components/shared/indicator';
import { present_badge } from '@/components/dialog/badge';

export function bleh_profiles() {
	// the obsessions page is a user subpage but works very differently
	if (page.subpage == 'obsessions_obsession') {
		bleh_obsession();
		return;
	} else if (
		page.subpage.startsWith('playlists') &&
		page.subpage != 'playlists_playlists'
	) {
		bleh_playlist();
		return;
	}

	const profile_header = document.body.querySelector('.header--user');
	if (!profile_header) return;

	let profile_name = profile_header.querySelector('.header-title > a');
	page.name = profile_name.textContent;

	// are we on the overview page?
	const is_subpage = page.subpage != 'overview';

	page.structure.container = document.body.querySelector(
		'.page-content:not(.profile-cards-container, .report-box-container .page-content)',
	);
	try {
		page.structure.row = page.structure.container.querySelector(
			'.row:not(._buffer)',
		);
		page.structure.main = page.structure.row.querySelector('.col-main');
		page.structure.side = page.structure.row.querySelector('.col-sidebar');
	} catch (e) {
		log('unable to find elements', 'page structure');
	}

	checkup_page_structure(is_subpage, profile_header);

	page.supports_shoutbox = page.structure.nav.querySelector(
		'.secondary-nav-item--shoutbox',
	);

	let new_account = false;

	const profile_cache =
		JSON.parse(localStorage.getItem(keys.profile_cache)) ||
		{};
	const cache = profile_cache[page.name] || {};

	let about_me_sidebar = page.structure.row.querySelector(
		'.about-me-sidebar',
	);

	const about_me_text = about_me_sidebar?.querySelector('p');

	if (page.subpage == 'overview') {
		delete cache.banner;
		delete cache.hue;
		delete cache.sat;
		delete cache.lit;
		delete cache.font;
		delete cache.font_style;
		delete cache.username;

		if (!about_me_sidebar) {
			about_me_sidebar = html.node`
                <section class="about-me-sidebar">
                    <h2>${tl(trans.about)}</h2>
                    <p class="subtle">${
				tl(trans.no_about).replace('{u}', page.name)
			}</p>
                </section>
            `;
			page.structure.side.insertBefore(
				about_me_sidebar,
				page.structure.side.firstElementChild,
			);
		} else {
			if (settings.bio_markdown) {
				// parse body
				const result = bio_parse(about_me_text, cache);
				result.classList.add('about-me-content');

				about_me_text.after(result);
				about_me_text.remove();

				const height = result.offsetHeight;
				result.style.setProperty('--height', `${height}px`);

				if (page.mobile && height > 100) {
					result.setAttribute('data-showing', 'false');
					let showing = false;

					let show_all_btn;
					const show_all = html.node`
                        <div class="see-more-cont">
                            <button class="see-more" data-see-more="true" data-type="down" ref=${(
						el,
					) => show_all_btn = el} onclick=${() => toggle_show_all()}>
                                ${tl(trans.read_more)}
                            </button>
                        </div>
                    `;

					result.after(show_all);

					function toggle_show_all() {
						showing = !showing;

						show_all_btn.setAttribute(
							'data-showing',
							showing.toString(),
						);
						result.setAttribute('data-showing', showing.toString());

						if (showing) {
							show_all_btn.classList.add('left-icon');
							show_all_btn.textContent = tl(trans.read_less);
							show_all_btn.setAttribute('data-type', 'up');
						} else {
							show_all_btn.classList.remove('left-icon');
							show_all_btn.textContent = tl(trans.read_more);
							show_all_btn.setAttribute('data-type', 'down');
						}
					}
				}
			}
		}

		if (page.mobile) {
			page.structure.main.insertBefore(
				about_me_sidebar,
				page.structure.main.firstElementChild,
			);
		}
	}

	let profile_avatar = profile_header.querySelector('.avatar > img');
	const title_wrap = profile_header.querySelector('.header-title-label-wrap');
	const sub_wrap = profile_header.querySelector('.header-title-secondary');

	// badges
	log(`querying badges for ${page.name}`, 'profile');

	page.state.follows_user = false;
	if (ff('badges')) {
		const stock_badges = title_wrap.querySelectorAll('.label');
		stock_badges.forEach((badge) => {
			const type = badge.classList[1];

			if (type == 'user-status-None') {
				badge.remove();
				return;
			}

			if (!page.mobile) badge.classList.add('expand');

			if (type == 'label--fade') {
				page.state.follows_user = true;

				badge.remove();
				return;
			}

			const trans_instance = trans.badges[type];

			if (trans_instance && trans_instance.name) {
				badge.textContent = tl(trans_instance.name);
			}

			let badge_name;
			tippy(badge, {
				theme: 'badge',
				placement: 'bottom',
				content: html.node`
                    <div class="badge-name" ref=${(el) =>
					badge_name = el}>${badge.textContent}</div>
                    <div class="badge-reason">${
					tl(trans.badges[type].reason)
				}</div>
                `,
			});

			style_name_from_badge(badge_name, {
				type,
				inbuilt: true,
			});

			badge.addEventListener('click', () => {
				present_badge({
					name: tl(trans_instance.name),
					reason: tl(trans.badges[type].reason),
					user: page.name,
					type,
					inbuilt: true,
				});
			});
		});
	}

	const badges = load_badges(page.name);

	if (badges) {
		badges.forEach((badge) => {
			title_wrap.appendChild(create_badge(badge, false, !page.mobile));
		});
	}

	const badge_elements = Array.from(title_wrap.querySelectorAll('.label'));

	profile_name = html.node`
        <h1 class="page-header-title profile-name">${
		cache.username || profile_name.textContent
	}</h1>
    `;

	if (ff('profile_fonts') && settings.display_name_styles) {
		profile_name.setAttribute('data-font', cache.font);
		profile_name.setAttribute('data-font-style', cache.font_style);

		if (cache.font || cache.font_style) {
			setTimeout(() => {
				queue_popup('profile_name_style', profile_name, 'bottom');
			}, 0);
		}
	}

	// new account
	if (!profile_avatar) {
		profile_avatar = profile_header.querySelector('.header-avatar-add');
		new_account = true;
	} else {
		const src = (profile_avatar as HTMLImageElement).src;

		cache.avatar = src;
		page.avatar = src;
	}

	let page_avatar;

	const same_page = is_same_page();

	const redesigned_profile_header = html.node`
        <section class="page-header for-profile ${same_page ? 'same' : ''}">
            <div class="page-header-avatar-list">
                ${
		!new_account
			? page_avatar = page_header_avatar(
				(profile_avatar as HTMLImageElement).src,
			)
			: profile_avatar
	}
            </div>
            <div class="page-header-info has-main-info">
                <div class="main-info">
                    <div class="sub-text">${tl(trans.profile)}</div>
                    <div class="title-container">${profile_name}</div>
                </div>
                ${
		sub_wrap ? sub_wrap : cache.created
			? () => {
				const elem = html.node`
                        <p class="header-title-secondary" />
                    `;

				render_sub_text(elem, cache.aka, cache.created, cache.username);

				return elem;
			}
			: ''
	}
                ${
		badge_elements.length > 0
			? html.node`
                <div class="badges profile-badges">
                    ${badge_elements.map((badge) => badge)}
                </div>
                `
			: ''
	}
            </div>
        </section>
    `;

	if (page.name == auth.name && !settings.profile_header_own) {
		register_background(null, 'hidden');
	} else if (page.name != auth.name && !settings.profile_header_others) {
		register_background(null, 'hidden');
	} else if (cache.banner) {
		register_background(cache.banner, 'bio');
	} else {
		if (settings.profile_avi_background) {
			if (!new_account) {
				register_background(avatar(page.avatar, 'ar0'));
			} else register_background(null, 'none');
		} else {
			let background = document.body.querySelector(
				'.header-background--has-image',
			);
			if (background) {
				register_background(
					background.style.backgroundImage
						.replace('url("', '')
						.replace('")', ''),
					'artist',
				);
			} else register_background(null, 'none');
		}
	}

	if (page_avatar) {
		header_colour(page_avatar.image, false, [page_avatar]);
	}

	page.structure.container.insertBefore(
		redesigned_profile_header,
		page.structure.container.firstElementChild,
	);
	profile_header.classList.add('legacy-header');

	// translations in other languages
	const library_tab = page.structure.nav.querySelector(
		'.secondary-nav-item--library a',
	);
	library_tab.textContent = tl(trans.library);

	const is_own_profile = page.name == auth.name;

	const loved_tab = page.structure.nav.querySelector(
		'.secondary-nav-item--loved a',
	);
	if (loved_tab) loved_tab.textContent = tl(trans.loved);

	if (!is_subpage) {
		const is_following = page.state.follows_user;

		//

		let recent_tracks = profile_recents();
		const top_artists = profile_artists();
		profile_albums();
		profile_tracks();

		if (page.name == sponsor_list.related.account_name && !is_own_profile) {
			page.structure.container!.removeChild(page.structure.nav!);
			page.structure.main!.innerHTML = '';
			page.structure.side!.innerHTML = '';

			page.structure.main!.appendChild(html.node`
                <section class="cta">
                    <strong>${tl(trans.sponsor_info)}</strong>
                </section>
            `);
		}

		// recent tracks
		if (!recent_tracks) {
			recent_tracks = page.structure.main!.querySelector(
				'.no-data-message',
			);
			if (recent_tracks) {
				const elem = html.node`
                    <section class="recent-tracks-section">
                        <h2>
                            <a class="text-colour-link" href="${window.location.href}/library">${
					tl(trans.recents)
				}</a>
                        </h2>
                        <div class="loading-data-container">
                            <div class="loading-data-text private">
                                ${recent_tracks.textContent}
                            </div>
                        </div>
                    </section>
                `;

				recent_tracks.replaceWith(elem);
				recent_tracks = elem;
			}
		}

		if (is_own_profile && settings.activities) {
			const recent_activity_section = html.node`
                <section class="recent-activity-section">
                    <h2>${tl(trans.activity)}</h2>
                    ${render_activity_list()}
                    <div class="more-link">
                        <a href="${root}bleh/profile">${
				tl(trans.activity_settings)
			}</a>
                    </div>
                </section>
            `;

			page.structure.side.appendChild(recent_activity_section);
		}

		// acquire info
		let scrobbles = 0;
		let average = 0;
		let artists = 0;
		let loved = 0;

		const metadata = profile_header.querySelectorAll(
			'.header-metadata-display',
		);
		metadata.forEach((item, index) => {
			if (index == 0) {
				const para = item.querySelector('p');

				scrobbles = clean_number(para.textContent.trim());
				average = para.getAttribute('title');
			} else if (index == 1) {
				artists = clean_number(item.textContent.trim());
			} else if (index == 2) {
				loved = clean_number(item.textContent.trim());
			}
		});

		page.state.scrobbles = scrobbles;
		page.state.artists = artists;
		page.state.loved = loved;
		page.state.average = average;

		if (page.name != sponsor_list.related.account_name || is_own_profile) {
			profile_summary(recent_tracks, top_artists);
		}

		// secondary text
		const profile_sub_text = redesigned_profile_header.querySelector(
			'.header-title-secondary',
		);
		if (profile_sub_text) {
			parse_sub_text(profile_sub_text, page.name, cache);
		}

		// featured track
		const featured_track_panel = profile_header.querySelector(
			'.header-featured-track',
		);
		if (featured_track_panel) {
			bleh_featured_profile_track(featured_track_panel);
		}

		const about_me_header = about_me_sidebar.querySelector('h2');
		about_me_header.remove();

		let profile_note;

		if (!is_own_profile) {
			const notes =
				JSON.parse(localStorage.getItem('bleh_profile_notes')) || {};
			profile_note = notes[page.name];
		}

		let settings_btn;
		let add_note;
		let info_tip;
		about_me_sidebar.insertBefore(
			html.node`
            <div class="top-container">
                <h2 class="about-me-title">
                    ${tl(trans.about)}
                    <span class="info-tip" ref=${(el) => (info_tip = el)}>
                        <span class="bleh-icon" data-type="info" style="--icon: var(--mask)" />
                    </span>
                </h2>
                <div class="view-buttons blend blend-v2">
                    ${
				is_own_profile
					? html.node`
                    <a class="left-icon blend-v2-btn" data-type="edit" href="${root}settings#id_about_me">
                        ${tl(trans.edit)}
                    </a>
                    `
					: !profile_note
					? html.node`
                    <button class="left-icon blend-v2-btn" data-type="add" ref=${(
						el,
					) => (add_note = el)} onclick=${() => {
						create_profile_note_panel(page.name, profile_note);
						add_note.remove();
					}}>
                        ${tl(trans.add_note)}
                    </button>
                    `
					: ''
			}
                    <button class="left-icon blend-v2-btn" data-type="more" ref=${(
				el,
			) => (settings_btn = el)}>
                        ${tl(trans.more)}
                    </button>
                </div>
            </div>
        `,
			about_me_sidebar.firstChild,
		);

		tippy(settings_btn, {
			theme: 'context-menu',
			content: html.node`
                ${setting({ id: 'bio_markdown', in_menu: true })}
                <button class="dropdown-menu-clickable-item" data-type="copy" onclick=${() => {
				copy(about_me_text.textContent.trim());
			}}>
                    ${tl(trans.copy_text)}
                </button>
            `,
			placement: 'bottom',
			interactive: true,
			interactiveBorder: 10,
			trigger: 'click',
			appendTo: document.body,
			hideOnClick: 'toggle',

			onClickOutside(instance) {
				if (instance.popper.querySelector('[aria-expanded="true"]')) {
					return;
				}

				instance.hide();
			},
		});

		if (cache.banner || cache.hue || cache.sat || cache.lit) {
			tippy(info_tip, {
				content: html.node`
                    <div class="profile-items">
                        ${
					cache.banner
						? html.node`
                            <div class="profile-item" data-type="banner">
                                <span class="bleh-icon" style="--icon: var(--mask)" />
                                <p class="profile-item-text">${
							tl(trans.profile_banner.name)
						}</p>
                            </div>
                        `
						: ''
				}
                        ${
					cache.hue > -1 && cache.sat > -1 && cache.lit > -1
						? html.node`
                            <div class="profile-item" data-type="accent">
                                <span class="bleh-icon" style="--icon: var(--mask)" />
                                <p class="profile-item-text">${
							tl(trans.profile_accent.name)
						}</p>
                                <p class="profile-item-text subtle">${cache.hue}, ${cache.sat}, ${cache.lit}</p>
                            </div>
                        `
						: ''
				}
                    </div>
                `,
			});
		} else {
			info_tip.remove();
		}

		if (ff('redesigned_profile_header')) {
			redesign_profile_header(is_own_profile, is_following);
		}

		if (!is_own_profile && profile_note) {
			create_profile_note_panel(page.name, profile_note);
		}
	} else {
		load_profile_cache(page.name, cache, profile_cache);

		const btn_add = page.structure.side.querySelector('.add-button');
		if (btn_add) btn_add.setAttribute('data-page-subpage', page.subpage);

		if (page.subpage.startsWith('library')) {
			bleh_user_library();
		} else if (page.subpage == 'events') {
			convert_to_toolbar();

			const no_events = page.structure.main.querySelector(
				':scope > .no-events',
			);

			bleh_profile_events(no_events);
		} else if (page.subpage.startsWith('listening-report')) {
			profile_reports();
		} else if (page.subpage == 'obsessions_overview') {
			obsession_list();
		} else if (page.subpage == 'playlists_playlists') {
			const section_controls = page.structure.container.querySelector(
				'.section-controls-full-width',
			);
			let buttons;
			if (section_controls) {
				section_controls.classList.add('legacy-section-controls');
				buttons = section_controls.querySelectorAll(':is(button, a)');

				const header = page.structure.container.querySelector(
					'.content-top-header',
				);
				page.structure.content_top.innerHTML = `
                    <div class="content-top-inner-wrap">
                        <div class="container content-top-lower">
                            <h1 class="content-top-header">${header.textContent.trim()}</h1>
                        </div>
                    </div>
                `;
			}

			const new_panel = document.createElement('section');
			new_panel.classList.add('obsessions-panel');

			page.structure.main.appendChild(new_panel);

			if (buttons.length > 0) {
				const wrap = document.createElement('div');
				wrap.classList.add('view-buttons-wrapper');
				wrap.innerHTML =
					`<div class="info"><div class="alert alert-info">Playlists are a work in progress</div></div>`;

				const button_header = html.node`
                    <div class="view-buttons playlist-home-buttons blend" />
                `;

				buttons.forEach((button) => {
					const action = button.getAttribute('data-analytics-action');

					if (action == 'create') {
						button.setAttribute('data-type', 'add');
						button.classList.add('primary');
						render(
							button,
							html`
								${tl(trans.new)}${beta_indicator()}
							`,
						);
					} else if (action == 'import') {
						button.setAttribute('data-type', 'import');
					}

					button.classList.add(
						'btn',
						'view-item',
						'interact-item',
						'playlist-home-top-item',
						'icon',
					);

					button_header.appendChild(button);
				});
				wrap.appendChild(button_header);
				new_panel.appendChild(wrap);
			}

			//

			const playlists = page.structure.container.querySelector(
				'.playlisting-playlists',
			);
			if (playlists) {
				page.structure.container.removeChild(playlists.parentElement);
				new_panel.appendChild(playlists);
			} else {
				const no_data = page.structure.container.querySelector(
					'.no-data-message--playlists',
				);
				page.structure.container.removeChild(no_data.parentElement);
				new_panel.appendChild(no_data);
			}
		} else if (page.subpage == 'loved') {
			const count_text = page.structure.content_top
				.querySelector('h1')
				.textContent.trim();
			const chr = count_text.indexOf('(');

			let count = 0;
			if (chr != -1) {
				count = count_text
					.substring(chr)
					.replace('(', '')
					.replace(')', '');
			}

			page.structure.nav.querySelector('.secondary-nav-item--loved a')
				.appendChild(html.node`
                <div class="new-badge count-badge">${count}</div>
            `);
		}
	}

	log('status is', 'page', 'info', page);
	update_page();

	patch_profile_following();

	save_profile_cache(cache, profile_cache, page.name);
}

function create_profile_note_panel(username, has_note) {
	const about_me_sidebar = page.structure.row.querySelector(
		'.about-me-sidebar',
	);

	let note;

	about_me_sidebar.after(html.node`
        <section class="bleh--panel bleh--profile-note-panel">
            <div class="top-container">
                <h2>${tl(trans.notes)}</h2>
                <div class="view-buttons blend blend-v2">
                    <button class="see-more left-icon blend-v2-btn" data-type="delete" onclick=${() => {
		const notes = JSON.parse(
			localStorage.getItem('bleh_profile_notes'),
		) || {};
		delete notes[page.name];

		note.value = '';
		set_storage('bleh_profile_notes', JSON.stringify(notes));
		status({
			id: 'note',
			title: tl(trans.cleared_note_for_user, { u: page.name }),
		});
	}}>${tl(trans.clear)}</button>
                    <button class="see-more left-icon blend-v2-btn" data-type="save" onclick=${() => {
		const notes = JSON.parse(
			localStorage.getItem('bleh_profile_notes'),
		) || {};

		notes[page.name] = note.value;

		set_storage('bleh_profile_notes', JSON.stringify(notes));
		status({
			id: 'note',
			title: tl(trans.saved_note_for_user, { u: page.name }),
			body: note.value,
		});
	}}>${tl(trans.save)}</button>
                </div>
            </div>
            <div class="content-form">
                <textarea id="bleh--profile-note" placeholder=${
		tl(trans.anything_you_can_imagine)
	} ref=${(el) => (note = el)}>${has_note ?? has_note}</textarea>
            </div>
        </section>
    `);
}

// patch following
function patch_profile_following() {
	const navlist = page.structure.nav.querySelector('.navlist-items');

	let following_tab = navlist.querySelector('.secondary-nav-item--following');
	const followers_tab = navlist.querySelector(
		'.secondary-nav-item--followers',
	);
	const neighbours_tab = navlist.querySelector(
		'.secondary-nav-item--neighbours',
	);

	const link = following_tab.querySelector('a');

	followers_tab.remove();
	neighbours_tab.remove();

	if (
		page.subpage != 'following' &&
		page.subpage != 'followers' &&
		page.subpage != 'neighbours'
	) {
		// if we're not on one of these tabs we don't need to preserve the 'Following' text
		following_tab.classList.remove('secondary-nav-item--following');
		following_tab.classList.add('secondary-nav-item--friends');

		link.href = `${root}user/${page.name}/friends`;
		link.textContent = tl(trans.friends);

		return;
	}

	if (page.subpage != 'following') {
		link.classList.add('secondary-nav-item-link--active');
	}

	// create nav
	const friends_nav = html.node`
        <div class="toolbar">
            <nav class="navlist secondary-nav redesigned-navigation">
                <ul class="navlist-items">
                    ${{ html: following_tab.outerHTML }}
                    ${{ html: followers_tab.outerHTML }}
                    ${{ html: neighbours_tab.outerHTML }}
                </ul>
            </nav>
        </div>
    `;

	// we do this later to preserve the 'Following' text
	following_tab.classList.remove('secondary-nav-item--following');
	following_tab.classList.add('secondary-nav-item--friends');

	link.href = `${root}user/${page.name}/friends`;
	link.textContent = tl(trans.friends);

	page.structure.row.insertBefore(
		friends_nav,
		page.structure.row.firstElementChild,
	);
	page.structure.row.classList.add('col-main-is-primary');

	following_tab = friends_nav.querySelector(
		'.secondary-nav-item--following a',
	);

	let highlighted_tab = following_tab;
	if (page.subpage == 'followers') {
		highlighted_tab = friends_nav.querySelector(
			'.secondary-nav-item--followers a',
		);
	} else if (page.subpage == 'neighbours') {
		highlighted_tab = friends_nav.querySelector(
			'.secondary-nav-item--neighbours a',
		);
	}

	if (page.subpage != 'following') {
		following_tab.classList.remove('secondary-nav-item-link--active');
	}

	if (ff('katsune') && page.subpage != 'neighbours') {
		const count_text = page.structure.content_top
			.querySelector('h1')
			.textContent.trim();
		const chr = count_text.indexOf('(');

		let count = 0;
		if (chr != -1) {
			count = count_text.substring(chr).replace('(', '').replace(')', '');
		}

		highlighted_tab.appendChild(html.node`
            <div class="new-badge count-badge">${count}</div>
        `);
	}

	const no_data = page.structure.main.querySelector('.no-data-message');
	const pagination = page.structure.main.querySelector('.pagination');

	let no_data_neighbours = page.structure.main.querySelector(':scope > p');
	if (no_data_neighbours) no_data_neighbours.classList.add('no-data-message');

	const user_list = page.structure.main.querySelector('.user-list');
	user_list?.setAttribute('data-list-view', settings.list_view);

	if (user_list) no_data_neighbours = null;

	render(
		page.structure.main,
		html.node`
        <section class="users">
            ${
			!no_data && !no_data_neighbours
				? setting({
					id: 'list_view',
					func: (val) => {
						user_list?.setAttribute('data-list-view', val);
					},
				})
				: ''
		}
            ${no_data}
            ${no_data_neighbours}
            ${user_list}
            ${pagination}
        </section>
    `,
	);
}

function refresh_tracks(button, { quiet = false }) {
	const panel = page.structure.main.querySelector('#recent-tracks-section');
	panel.classList.remove('has-refreshed');
	button.setAttribute('disabled', '');

	// we need to fetch the tracklist, this function presumes that
	// the user has a tracklist to begin with, as that is the only
	// way to call the function on the frontend
	fetch(`${root}user/${page.name}/partial/recenttracks?ajax=1`)
		.then(function (response) {
			console.log('returned', response, response.text);

			return response.text();
		})
		.then(function (html) {
			const doc = new DOMParser().parseFromString(html, 'text/html');
			console.log('DOC', doc);

			const tracklist_panel = doc.querySelector('.chartlist');

			button.removeAttribute('disabled');

			if (!tracklist_panel) {
				if (!quiet) {
					status({
						title: tl(trans.recents),
						body: tl(trans.value_failed_to_load).replace(
							'{v}',
							tl(trans.library),
						),
						type: 'error',
					});
				}
				return;
			}

			if (!quiet) {
				status({
					title: tl(trans.recents),
					body: tl(trans.refreshed),
				});
			}
			panel.classList.add('has-refreshed');

			panel.querySelector('.chartlist').outerHTML =
				tracklist_panel.outerHTML;
		});
}

function bleh_featured_profile_track(object) {
	const art = object.querySelector('.featured-item-art');
	const details = object.querySelector('.featured-item-details');
	const form = document.body.querySelector('.header-info-primary form');

	const heading = details.querySelector('.featured-item-heading');
	const link = heading.querySelector('a')?.getAttribute('href');
	details.removeChild(heading);

	const name_elem = details.querySelector('.featured-item-name');
	const artist_elem = details.querySelector('.featured-item-artist');

	name_elem.classList = '';
	artist_elem.classList = 'source-album-artist';

	let artist_elem_full = artist_elem;

	const img = art.querySelector('.cover-art');
	hoshino(
		img.querySelector(':scope > img'),
		name_elem.textContent.trim(),
		artist_elem.textContent.trim(),
	);

	if (settings.format_guest_features) {
		const song_title = name_elem.textContent;

		const formatted = name_includes(
			song_title,
			artist_elem.textContent,
		);

		// combine
		name_elem.classList.add('smart-title');
		render(
			name_elem,
			smart_title(formatted.song_title, formatted.song_tags),
		);

		artist_elem_full = html.node`
            <div class="source-album-artist">
                ${smart_artists(formatted.song_artist, formatted.song_guests)}
            </div>
        `;
	} else if (settings.corrections) {
		name_elem.textContent = romanise(
			correct_item_by_artist(
				name_elem.textContent.trim(),
				artist_elem.textContent.trim(),
			),
		);
		artist_elem.textContent = romanise(
			correct_artist(artist_elem.textContent.trim()),
		);
	}

	if (form) {
		const button = form.querySelector('button');
		button.classList = 'see-more featured-item-manage icon';
		button.setAttribute('data-type', 'delete');
		button.textContent = tl(trans.remove);
	}

	const panel = html.node`
        <section class="featured-item-panel">
            <div class="sub-text">
                ${
		form
			? html.node`
                <a class="has-icon" data-type="obsession" href=${link}>
                    <div class="bleh-icon" style="--icon: var(--mask)" />
                    ${tl(trans.obsession)}
                </a>
                ${form}
                `
			: html.node`
                <div class="has-icon" data-type="track">
                    <div class="bleh-icon" style="--icon: var(--mask)" />
                    ${tl(trans.top_track)}
                </div>
                `
	}
            </div>
            <div class="source-album js-link-block link-block featured-item">
                <div class="source-album-art small">
                    ${img}
                </div>
                <div class="source-album-details">
                    <h4 class="source-album-name">${name_elem}</h4>
                    ${artist_elem_full}
                </div>
                <a class="js-link-block-cover-link link-block-cover-link" href=${
		name_elem.getAttribute('href')
	} />
            </div>
        </section>
    `;

	page.structure.side.insertBefore(
		panel,
		page.structure.side.firstElementChild,
	);
}

function profile_recents() {
	const panel = page.structure.main.querySelector('#recent-tracks-section');
	if (!panel) return;

	const more_link = panel.nextElementSibling;
	panel.appendChild(more_link);

	const form = panel.querySelector('#recent-tracks-settings');
	let tooltip;

	let submit_btn;
	let settings_btn;
	let refresh_btn;

	const can_scrobble = ff('submit_scrobble') && page.name == auth.name;

	const head = panel.querySelector(':scope > h2');
	if (head) head.remove();

	const can_api = localStorage.getItem('bleh_auth') &&
		localStorage.getItem('bleh_auth_valid') === 'true';

	panel.insertBefore(
		html.node`
        <div class="top-container">
            <h2>
                ${tl(trans.recents)}
            </h2>
            <div class="view-buttons blend blend-v2">
                ${
			can_scrobble
				? html.node`
                    <button class="left-icon blend-v2-btn" data-type="add" ref=${(
					el,
				) => submit_btn = el} onclick=${() =>
					submit_scrobble({
						refresh_btn,
						can_api,
						func: () => {
							setTimeout(() => {
								refresh_tracks(refresh_btn, { quiet: true });
							}, 200);
						},
					})}>
                        ${tl(trans.new)}
                    </button>
                `
				: ''
		}
                <button class="left-icon blend-v2-btn" data-type="refresh" ref=${(
			el,
		) => refresh_btn = el} onclick=${() => refresh_tracks(refresh_btn, {})}>
                    ${tl(trans.refresh)}
                </button>
                ${
			form
				? html.node`
                <button class="left-icon blend-v2-btn" data-type="settings" ref=${(
					el,
				) => (settings_btn = el)}>
                    ${tl(trans.settings)}
                </button>
                `
				: ''
		}
            </div>
        </div>
    `,
		panel.firstElementChild,
	);

	if (!can_api) {
		tippy(submit_btn, {
			content: tl(trans.requires_api_in_settings),
		});
	}

	if (!form) return panel;

	if (page.token == '') {
		page.token = form
			.querySelector('[name="csrfmiddlewaretoken"]')
			.getAttribute('value');
	}

	let original_chart_settings = {};

	const count = form.querySelector('[name="chart_length_recent_tracks"]');
	original_chart_settings = {
		recent_artwork: form.querySelector('#id_show_recent_tracks_artwork'),
		recent_realtime: form.querySelector('#id_auto_refresh_recent_tracks'),
	};

	form.classList = '';
	render(
		form,
		html`
			<input type="hidden" name="csrfmiddlewaretoken" value=${page
				.token} />
			<div class="setting-group blend">
			    <div class="setting" data-type="select">
			        <div class="heading">
			            <h5>${tl(trans.amount_to_display)}</h5>
			        </div>
			        ${select({
				values: select_prepare(count),
				initial: count.value,
				name: count.name,
				in_settings: true,
			})}
			    </div>
			    ${toggle({
				title: tl(trans.recent_artwork),
				value: original_chart_settings.recent_artwork.checked,
				name: original_chart_settings.recent_artwork.name,
				standalone: false,
			})}
			    ${toggle({
				title: tl(trans.recent_realtime.name),
				body: tl(trans.recent_realtime.body),
				value: original_chart_settings.recent_realtime.checked,
				name: original_chart_settings.recent_realtime.name,
				standalone: false,
			})}
			    ${setting({ id: 'format_guest_features' })}
			    <div class="settings-footer">
			        <button type="submit" class="btn-primary save" onclick=${() => {
				tooltip.hide();
			}}>
			            ${tl(trans.save)}
			        </button>
			    </div>
			</div>
		`,
	);

	tooltip = tippy(settings_btn, {
		theme: 'window',
		content: form,
		allowHTML: true,
		placement: 'bottom',
		interactive: true,
		interactiveBorder: 10,
		trigger: 'click',
		appendTo: document.body,
		hideOnClick: 'toggle',

		onClickOutside(instance) {
			if (instance.popper.querySelector('[aria-expanded="true"]')) {
				return;
			}

			instance.hide();
		},
	});

	return panel;
}

function profile_artists() {
	const panel = page.structure.main.querySelector('#top-artists');
	if (!panel) return;

	panel.classList.remove('section-with-settings');

	const form = panel.querySelector('#artist-chart-settings');
	const list = panel.querySelector('#artists_range');

	let collage_btn;
	const select_btn = panel.querySelector('.dropdown-menu-clickable-button');
	let settings_btn;

	const head = panel.querySelector(':scope > h2');
	if (head) head.remove();

	panel.insertBefore(
		html.node`
        <div class="top-container">
            <h2>
                ${tl(trans.artists)}
            </h2>
            <div class="accompany view-buttons blend blend-v2">
                ${() => {
			select_btn.classList.add(
				'select-button',
				'link-select',
				'blend-v2-btn',
			);
			select_btn.classList.remove(
				'section-control',
				'dropdown-menu-clickable-button',
			);
			return select_btn;
		}}
            </div>
            <div class="view-buttons blend blend-v2">
                <button class="left-icon blend-v2-btn" data-type="collage" ref=${(
			el,
		) => (collage_btn = el)} onclick=${() => {
			let btn = list.querySelector(
				'.dropdown-menu-clickable-item--selected',
			);
			let link = new URL(
				'https://www.last.fm' + btn.getAttribute('href'),
			);
			let selected = link.searchParams.get('artists_date_preset');

			window.location.href =
				`${root}bleh/minis/collage?type=artists&timeframe=date_preset=${selected}`;
		}}>${tl(trans.collage)}</button>
                ${
			form
				? html.node`
                <button class="left-icon blend-v2-btn" data-type="settings" ref=${(
					el,
				) => (settings_btn = el)}>
                    ${tl(trans.settings)}
                </button>
                `
				: ''
		}
            </div>
        </div>
    `,
		panel.firstElementChild,
	);

	// own profile only

	if (!form) return panel;
	if (page.token == '') {
		page.token = form
			.querySelector('[name="csrfmiddlewaretoken"]')
			.getAttribute('value');
	}

	const timeframe = form.querySelector('[name="chart_range_top_artists"]');
	const style = form.querySelector('[name="chart_style_top_artists"]');
	const grid_length = form.querySelector(
		'[name="artists_image_grid_length"]',
	);
	const chartlist_length = form.querySelector(
		'[name="artists_chartlist_length"]',
	);

	let tooltip;

	form.classList = '';
	render(
		form,
		html`
			<input
				type="hidden"
				name="csrfmiddlewaretoken"
				value="${page.token}"
			/>
			<div class="setting-group blend">
				<div class="setting" data-type="select">
			        <div class="heading">
			            <h5>${tl(trans.default_timeframe)}</h5>
			        </div>
			        ${select({
				values: select_prepare(timeframe),
				initial: timeframe.value,
				name: timeframe.name,
				in_settings: true,
			})}
			    </div>
				<div class="setting" data-type="select">
			        <div class="heading">
			            <h5>${tl(trans.chart_style)}</h5>
			        </div>
			        ${select({
				values: select_prepare(style),
				initial: style.value,
				name: style.name,
				in_settings: true,
			})}
			    </div>
				<div class="setting hide-if-artist-list" data-type="select">
			        <div class="heading">
			            <h5>${tl(trans.chart_size)}</h5>
			        </div>
			        ${select({
				values: select_prepare(grid_length),
				initial: grid_length.value,
				name: grid_length.name,
				in_settings: true,
			})}
			    </div>
				<div class="setting hide-if-artist-grid" data-type="select">
			        <div class="heading">
			            <h5>${tl(trans.chart_size)}</h5>
			        </div>
			        ${select({
				values: select_prepare(chartlist_length),
				initial: chartlist_length.value,
				name: chartlist_length.name,
				in_settings: true,
			})}
			    </div>
				<div class="settings-footer">
					<button type="submit" class="btn-primary save" onclick=${() => {
						tooltip.hide();
					}}>
			            ${tl(trans.save)}
			        </button>
				</div>
			</div>
		`,
	);

	tooltip = tippy(settings_btn, {
		theme: 'window',
		content: form,
		placement: 'bottom',
		interactive: true,
		interactiveBorder: 10,
		trigger: 'click',
		appendTo: document.body,
		hideOnClick: 'toggle',

		onClickOutside(instance) {
			if (instance.popper.querySelector('[aria-expanded="true"]')) {
				return;
			}

			instance.hide();
		},
	});

	return panel;
}

function profile_albums() {
	const panel = page.structure.main.querySelector('#top-albums');
	if (!panel) return;

	panel.classList.remove('section-with-settings');

	const form = panel.querySelector('#albums-chart-settings');
	const list = panel.querySelector('#albums_range');

	let collage_btn;
	const select_btn = panel.querySelector('.dropdown-menu-clickable-button');
	let settings_btn;

	const head = panel.querySelector(':scope > h2');
	if (head) head.remove();

	panel.insertBefore(
		html.node`
        <div class="top-container">
            <h2>
                ${tl(trans.albums)}
            </h2>
            <div class="accompany view-buttons blend blend-v2">
                ${() => {
			select_btn.classList.add(
				'select-button',
				'link-select',
				'blend-v2-btn',
			);
			select_btn.classList.remove(
				'section-control',
				'dropdown-menu-clickable-button',
			);
			return select_btn;
		}}
            </div>
            <div class="view-buttons blend blend-v2">
                <button class="left-icon blend-v2-btn" data-type="collage" ref=${(
			el,
		) => (collage_btn = el)} onclick=${() => {
			const btn = list.querySelector(
				'.dropdown-menu-clickable-item--selected',
			);
			const link = new URL(
				'https://www.last.fm' + btn.getAttribute('href'),
			);
			const selected = link.searchParams.get('albums_date_preset');

			window.location.href =
				`${root}bleh/minis/collage?type=albums&timeframe=date_preset=${selected}`;
		}}>${tl(trans.collage)}</button>
                ${
			form
				? html.node`
                <button class="left-icon blend-v2-btn" data-type="settings" ref=${(
					el,
				) => (settings_btn = el)}>
                    ${tl(trans.settings)}
                </button>
                `
				: ''
		}
            </div>
        </div>
    `,
		panel.firstElementChild,
	);

	// own profile only

	if (!form) return;
	if (page.token == '') {
		page.token = form
			.querySelector('[name="csrfmiddlewaretoken"]')
			.getAttribute('value');
	}

	const timeframe = form.querySelector('[name="chart_range_top_albums"]');
	const style = form.querySelector('[name="chart_style_top_albums"]');
	const grid_length = form.querySelector('[name="albums_image_grid_length"]');
	const chartlist_length = form.querySelector(
		'[name="albums_chartlist_length"]',
	);

	let tooltip;

	form.classList = '';
	render(
		form,
		html`
			<input
				type="hidden"
				name="csrfmiddlewaretoken"
				value="${page.token}"
			/>
			<div class="setting-group blend">
				<div class="setting" data-type="select">
			        <div class="heading">
			            <h5>${tl(trans.default_timeframe)}</h5>
			        </div>
			        ${select({
				values: select_prepare(timeframe),
				initial: timeframe.value,
				name: timeframe.name,
				in_settings: true,
			})}
			    </div>
				<div class="setting" data-type="select">
			        <div class="heading">
			            <h5>${tl(trans.chart_style)}</h5>
			        </div>
			        ${select({
				values: select_prepare(style),
				initial: style.value,
				name: style.name,
				in_settings: true,
			})}
			    </div>
				<div class="setting hide-if-album-list" data-type="select">
			        <div class="heading">
			            <h5>${tl(trans.chart_size)}</h5>
			        </div>
			        ${select({
				values: select_prepare(grid_length),
				initial: grid_length.value,
				name: grid_length.name,
				in_settings: true,
			})}
			    </div>
				<div class="setting hide-if-album-grid" data-type="select">
			        <div class="heading">
			            <h5>${tl(trans.chart_size)}</h5>
			        </div>
			        ${select({
				values: select_prepare(chartlist_length),
				initial: chartlist_length.value,
				name: chartlist_length.name,
				in_settings: true,
			})}
			    </div>
				<div class="settings-footer">
					<button type="submit" class="btn-primary save" onclick=${() => {
						tooltip.hide();
					}}>
			            ${tl(trans.save)}
			        </button>
				</div>
			</div>
		`,
	);

	tooltip = tippy(settings_btn, {
		theme: 'window',
		content: form,
		placement: 'bottom',
		interactive: true,
		interactiveBorder: 10,
		trigger: 'click',
		appendTo: document.body,
		hideOnClick: 'toggle',

		onClickOutside(instance) {
			if (instance.popper.querySelector('[aria-expanded="true"]')) {
				return;
			}

			instance.hide();
		},
	});
}

function profile_tracks() {
	const panel = page.structure.main.querySelector('#top-tracks');
	if (!panel) return;

	panel.classList.remove('section-with-settings');

	const form = panel.querySelector('#track-chart-settings');
	const list = panel.querySelector('#tracks_range');

	let collage_btn;
	const select_btn = panel.querySelector('.dropdown-menu-clickable-button');
	let settings_btn;

	const head = panel.querySelector(':scope > h2');
	if (head) head.remove();

	panel.insertBefore(
		html.node`
        <div class="top-container">
            <h2>
                ${tl(trans.tracks)}
            </h2>
            <div class="accompany view-buttons blend blend-v2">
                ${() => {
			select_btn.classList.add(
				'select-button',
				'link-select',
				'blend-v2-btn',
			);
			select_btn.classList.remove(
				'section-control',
				'dropdown-menu-clickable-button',
			);
			return select_btn;
		}}
            </div>
            <div class="view-buttons blend blend-v2">
                <button class="left-icon blend-v2-btn" data-type="collage" ref=${(
			el,
		) => (collage_btn = el)} onclick=${() => {
			let btn = list.querySelector(
				'.dropdown-menu-clickable-item--selected',
			);
			let link = new URL(
				'https://www.last.fm' + btn.getAttribute('href'),
			);
			let selected = link.searchParams.get('tracks_date_preset');

			window.location.href =
				`${root}bleh/minis/collage?type=tracks&timeframe=date_preset=${selected}`;
		}}>${tl(trans.collage)}</button>
                ${
			form
				? html.node`
                <button class="left-icon blend-v2-btn" data-type="settings" ref=${(
					el,
				) => (settings_btn = el)}>
                    ${tl(trans.settings)}
                </button>
                `
				: ''
		}
            </div>
        </div>
    `,
		panel.firstElementChild,
	);

	// own profile only

	if (!form) return;
	if (page.token == '') {
		page.token = form
			.querySelector('[name="csrfmiddlewaretoken"]')
			.getAttribute('value');
	}

	const timeframe = form.querySelector('[name="chart_range_top_tracks"]');
	const chartlist_length = form.querySelector(
		'[name="chart_length_top_tracks"]',
	);

	let tooltip;

	form.classList = '';
	render(
		form,
		html`
			<input
				type="hidden"
				name="csrfmiddlewaretoken"
				value="${page.token}"
			/>
			<div class="setting-group blend">
			    <div class="setting" data-type="select">
			        <div class="heading">
			            <h5>${tl(trans.default_timeframe)}</h5>
			        </div>
			        ${select({
				values: select_prepare(timeframe),
				initial: timeframe.value,
				name: timeframe.name,
				in_settings: true,
			})}
			    </div>
			    <div class="setting hide-if-track-grid" data-type="select">
			        <div class="heading">
			            <h5>${tl(trans.chart_size)}</h5>
			        </div>
			        ${select({
				values: select_prepare(chartlist_length),
				initial: chartlist_length.value,
				name: chartlist_length.name,
				in_settings: true,
			})}
			    </div>
			    <div class="sep" />
			    ${setting({ id: 'format_guest_features' })}
			    ${setting({ id: 'show_guest_features' })}
			    ${setting({ id: 'count_bar_right' })}
			    <div class="settings-footer">
			        <button type="submit" class="btn-primary save" onclick=${() => {
				tooltip.hide();
			}}>
			            ${tl(trans.save)}
			        </button>
			    </div>
			</div>
		`,
	);

	tooltip = tippy(settings_btn, {
		theme: 'window',
		content: form,
		placement: 'bottom',
		interactive: true,
		interactiveBorder: 10,
		trigger: 'click',
		appendTo: document.body,
		hideOnClick: 'toggle',

		onClickOutside(instance) {
			if (instance.popper.querySelector('[aria-expanded="true"]')) {
				return;
			}

			instance.hide();
		},
	});
}

function bio_parse(text, cache = true, take_effect = true) {
	const body = markdown(text.textContent, {
		allow_headers: true,
		allow_banners: true,
		allow_icons: true,
		allow_hue: true,
		allow_fonts: true,
		cache,
		take_effect,
		allow_socials: true,
		allow_alignment: true,
		allow_lists: true,
	});

	if (body.childElementCount == 0) {
		render(
			body,
			html`
				<p class="subtle">${tl(trans.no_about).replace(
					'{u}',
					page.name,
				)}</p>
			`,
		);
	}

	return body;
}

export function save_profile_cache(
	{
		avatar,
		banner,
		banner_orig,
		hue,
		sat,
		lit,
		aka,
		created,
		font,
		font_style,
		username,
	} = {},
	profile_cache = JSON.parse(localStorage.getItem(keys.profile_cache)) ||
		{},
	name = page.name,
) {
	const profile_cache_o = Object.keys(profile_cache);

	if (profile_cache_o.length > 400) {
		// remove first available item of object
		const keys = Reflect.ownKeys(profile_cache);

		// we dont delete logged in user or users on local friends list
		const protected_users = new Set([auth.name, ...settings.friends]);
		const key_to_delete = keys.find(
			(key) => !protected_users.has(profile_cache[key]),
		);

		if (key_to_delete) delete profile_cache[key_to_delete];

		// them move this to the bottom
		delete profile_cache[name];
	}

	profile_cache[name] = {
		avatar,
		banner,
		banner_orig,
		hue,
		sat,
		lit,
		aka,
		created,
		font,
		font_style,
		username,
	};

	log('saved to cache', 'profile', 'info', {
		name,
		cache: profile_cache[name],
	});
	set_storage(keys.profile_cache, JSON.stringify(profile_cache));
}

export async function checkup_friend_cache(list = settings.friends) {
	for (const friend of list) {
		const cache = await load_profile_cache_externally(friend);
		log(`finalised cache for friend ${friend}`, 'profile', 'info', {
			cache: cache,
		});
	}
}

export function open_starred_friend_window(friend_func = null) {
	dialog({
		id: 'starred_friend',
		title: tl(trans.close_friends),
		body: html.node`
            <div class="setting-group">
                ${friends = setting({
			id: 'friends',
			list: settings.friends,
			func: (val) => {
				if (!val.includes(settings.starred_friend)) {
					save_setting('starred_friend', '');
				}

				checkup_friend_cache(val);

				starred.update(
					select_prepare_list([
						{ value: '', text: tl(trans.none) },
						...val,
					]),
				);

				if (friend_func) friend_func();
			},
		})}
                ${starred = setting({
			id: 'starred_friend',
			list: select_prepare_list([
				{ value: '', text: tl(trans.none) },
				...settings.friends,
			]),
			func: () => {
				if (friend_func) friend_func();
			},
		})}
            </div>
            <p class="card-tip">${tl(trans.friend_difference)}</p>
        `,
	});
}

export async function load_profile_cache_externally(name = page.name) {
	if (!name) return {};

	log(`requested profile cache for ${name}`, 'cache');

	const profile_cache =
		JSON.parse(localStorage.getItem(keys.profile_cache)) ||
		{};
	const cache = profile_cache[name];

	if (cache) {
		if (cache.hue || cache.sat || cache.lit) {
			if (
				!sponsor_list.version ||
				(sponsor_list.version &&
					!sponsor_list.users.hasOwnProperty(name))
			) {
				delete cache.hue;
				delete cache.sat;
				delete cache.lit;
			}
		}

		log(`returning pre-cached result for ${name}`, 'cache', 'info', {
			cache,
		});
		return cache;
	}

	return await request_profile_cache(name);
}

function load_profile_cache(
	name = page.name,
	cache = null,
	profile_cache = null,
) {
	if (!name) return;

	if (!profile_cache) {
		profile_cache = JSON.parse(localStorage.getItem(keys.profile_cache)) ||
			{};
	}
	if (!cache) cache = profile_cache[name] || {};

	if (cache) {
		if (cache.hue || cache.sat || cache.lit) {
			if (
				!sponsor_list.version ||
				(sponsor_list.version &&
					!sponsor_list.users.hasOwnProperty(name))
			) {
				delete cache.hue;
				delete cache.sat;
				delete cache.lit;
			}
		}

		const hue = cache.hue;
		const sat = cache.sat;
		const lit = cache.lit;
		const banner = cache.banner;

		if (hue) document.body.style.setProperty('--hue-album', hue);
		if (sat) document.body.style.setProperty('--sat-album', sat);
		if (lit) document.body.style.setProperty('--lit-album', lit);
		if (banner) register_background(banner, 'bio');

		if (hue || sat || lit) {
			page.state.replaced_accent = true;
			load_chart_colours();
		}

		return;
	}

	return request_profile_cache(name, cache, profile_cache);
}

function request_profile_cache(
	name = page.name,
	cache = null,
	profile_cache = null,
) {
	log(`requesting fetch of profile cache for ${name}`, 'cache');

	const will_cache = !cache || !profile_cache;

	if (!profile_cache) {
		profile_cache = JSON.parse(localStorage.getItem(keys.profile_cache)) ||
			{};
	}
	if (!cache) cache = profile_cache[name] || {};

	return new Promise((resolve, reject) => {
		fetch(`${root}user/${name}`)
			.then(function (response) {
				console.log('returned', response, response.text);

				return response.text();
			})
			.then(function (dom) {
				const doc = new DOMParser().parseFromString(dom, 'text/html');
				console.log('DOC', doc);

				const about_me_sidebar = doc.querySelector('.about-me-sidebar');
				if (about_me_sidebar) {
					const about_me_text = about_me_sidebar.querySelector('p');
					bio_parse(about_me_text, cache ? cache : true, false);
				} else {
					delete cache.username;
					delete cache.font;
					delete cache.font_style;
					delete cache.banner;
					delete cache.hue;
					delete cache.sat;
					delete cache.lit;
				}

				const avatar = doc.querySelector('.header-avatar .avatar img');
				if (avatar) cache.avatar = avatar.src;

				const secondary = doc.querySelector('.header-title-secondary');
				parse_sub_text(secondary, name, cache);

				if (will_cache) save_profile_cache(cache, profile_cache, name);

				resolve(cache || {});
			})
			.catch(reject);
	});
}

function parse_sub_text(profile_sub_text, name = page.name, cache) {
	delete cache.aka;
	delete cache.created;

	const display_name = profile_sub_text.querySelector(
		'.header-title-display-name',
	);
	const scrobble_since = profile_sub_text.querySelector(
		'.header-scrobble-since',
	);

	if (display_name) cache.aka = display_name.textContent.trim();

	if (scrobble_since) {
		scrobble_since.textContent = scrobble_since.textContent
			.slice(2)
			.replace(tl(trans.account_scrobbling_since_replace), '');
		cache.created = scrobble_since.textContent.trim();
	}

	render_sub_text(profile_sub_text, cache.aka, cache.created, cache.username);
}

function render_sub_text(parent, aka, created, display_name) {
	render(parent, html``);

	if (display_name) {
		parent.appendChild(html.node`
            <dl class="sub-text-pair">
                ${sub_text_label('username', tl(trans.username.name))}
                <dd class="sub-text-item not-text">${page.name}</dd>
            </dl>
        `);
	}

	if (aka) {
		const result = find_pronouns(aka);

		if (result.pronouns) {
			parent.appendChild(html.node`
                <dl class="sub-text-pair">
                    ${sub_text_label('pronouns', tl(trans.account_pronouns))}
                    <dd class="sub-text-item">${result.pronouns}</dd>
                </dl>
            `);
		}

		if (result.text && result.text != page.name) {
			parent.appendChild(html.node`
                <dl class="sub-text-pair">
                    ${sub_text_label('aka', tl(trans.profile_title))}
                    <dd class="sub-text-item">${result.text}</dd>
                </dl>
            `);
		}
	}

	if (created) {
		parent.appendChild(html.node`
            <dl class="sub-text-pair">
                ${sub_text_label('created', tl(trans.account_creation))}
                <dd class="sub-text-item not-text">${created}</dd>
            </dl>
        `);
	}

	if (page.state.follows_user) {
		parent.appendChild(html.node`
            <dl class="sub-text-pair sub-text-follow">
                ${sub_text_label('follow', tl(trans.following))}
                <dd class="sub-text-item not-text">${tl(trans.follows_you)}</dd>
            </dl>
        `);
	}
}

function sub_text_label(type, text) {
	const elem = html.node`
        <dt class="sub-text-label" data-type=${type}>
            <span class="bleh-icon" style="--icon: var(--mask)" />
            <span class="sub-text-label-sr">${text}</span>
        </dt>
    `;

	tippy(elem, {
		content: text,
	});

	return elem;
}

function bleh_profile_events(no_events) {
	const selected_tab = page.structure.toolbar?.querySelector(
		'.secondary-nav-item-link--active',
	);

	const value_panel = html.node`
        <section class="value-panel">
            <h2 class="text-18">${
		selected_tab ? selected_tab.firstChild.textContent : tl(trans.events)
	}</h2>
        </section>
    `;

	if (page.structure.toolbar) {
		const tabs = page.structure.toolbar.querySelectorAll(
			'.secondary-nav-item-link',
		);
		tabs.forEach((tab, index) => {
			if (index < 1) return;

			tab.classList.add('has-tab-num');

			const num = tab.firstChild.textContent.trim().slice(-2);
			tab.appendChild(html.node`
                <span class="tab-num">
                    ${num}
                </span>
            `);
		});
	}

	const values = page.structure.main!.querySelectorAll('.metadata-display');

	const value_header = html.node`
        <div class="glacier-library-metadata" />
    `;

	values.forEach((value, index) => {
		let text = tl(trans.going);
		if (index == 1) text = tl(trans.interested);

		value_header.appendChild(html.node`
            <div class="glacier-library-metadata-item">
                <div class="sub-text">${text}</div>
                <div class="glacier-library-metadata-item-value">${value.textContent}</div>
            </div>
        `);
	});

	value_panel.appendChild(value_header);

	const total_value = page.structure.side!.querySelector('.metadata-display');
	if (total_value) {
		value_panel.appendChild(html.node`
            <h2 class="text-18">${tl(trans.all_time)}</h2>
            <div class="glacier-library-metadata">
                <div class="glacier-library-metadata-item">
                    <div class="sub-text">${tl(trans.total)}</div>
                    <div class="glacier-library-metadata-item-value">${total_value.textContent}</div>
                </div>
            </div>
        `);
	}

	const legacy_metadata = page.structure.main!.querySelector(
		'.metadata-list',
	);
	if (legacy_metadata) page.structure.main!.removeChild(legacy_metadata);

	page.structure.side!.innerHTML = '';
	page.structure.side!.appendChild(value_panel);
}
