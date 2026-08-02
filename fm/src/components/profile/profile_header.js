//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { settings } from '@/build/config';
import { log } from '@/build/log';
import { auth, page, root } from '@/build/page';
import { sponsor_list } from '@/build/sponsor';
import { copy, romanise, sanitise } from '@/build/tools';
import { tl, trans } from '@/build/trans';
import { ff } from '@/components/settings/sku';
import { correct_artist } from '@/components/music/lotus';
import { html, render } from 'lighterhtml';
import { sponsor } from '@/components/sponsor';
import { redirect } from '@/components/music/music';
import tippy from 'tippy.js';
import { register_menu } from '@/components/menu';
import { notify } from '@/components/dialog/notify';
import { dialog, dialog_rm } from '@/components/dialog/dialog';
import { save_setting } from '@/components/settings/settings';
import { manage_user } from '@/components/profile/manage_user';
import { queue_popup } from '@/components/dialog/popup';
import { avatar } from '../shared/avatar';
import { taste_artist } from './taste';
import { beta_indicator, new_indicator } from '../shared/indicator';

export function redesign_profile_header(is_own_profile, is_following) {
	if (!auth.name) return;

	const is_sponsor_host = page.name == sponsor_list.related.account_name;

	const base_header = document.body.querySelector('.header-info-secondary');
	if (!base_header) return;

	// taste
	let taste = '';
	let taste_percentage = '';
	let taste_artists = [];
	let taste_formal = 'NONE';

	if (!is_own_profile && !is_sponsor_host) {
		const taste_meter = base_header.querySelector('.tasteometer');

		if (taste_meter) {
			taste = taste_meter.classList[1].replace('tasteometer-compat-', '');

			const artists = taste_meter.querySelectorAll('a');
			artists.forEach((artist) => {
				taste_artists.push(
					romanise(correct_artist(artist.getAttribute('title'))),
				);
			});

			taste_formal = taste_meter.querySelector(
				'span.tasteometer-compat-colour',
			)?.textContent;

			taste_percentage = taste_meter
				.querySelector('.tasteometer-viz')
				.getAttribute('title');
			if (taste_percentage == '99%') taste_percentage = '100%';
		}
	}

	// create new
	const profile_header = html.node`
        <section class="side-actions" />
    `;

	if (
		!is_own_profile &&
		page.name != sponsor_list.related.account_name &&
		auth.name
	) {
		// follow
		const follow_button = document.body.querySelector(
			'.header-follower-btn',
		);

		if (follow_button) {
			const follow_wrap = follow_button.parentElement;

			follow_button.classList.add('btn', 'side-action', 'icon-mask');
			//follow_button.classList.remove('toggle-button', 'header-follower-btn');
			follow_button.setAttribute('data-type', 'follow');
			profile_header.appendChild(follow_wrap.parentElement);

			if (is_following) {
				follow_button.setAttribute('data-followed', 'true');
			}

			follow_button.appendChild(html.node`
                <i>${tl(trans.following_mutuals)}</i>
            `);

			follow_wrap.classList.add('follow-combo');

			friends_button(follow_wrap);
		} else {
			// ignore list
			profile_header.appendChild(html.node`
                <button class="btn side-action icon-mask" data-type="follow" disabled="true" data-ignored="true">
                    ${tl(trans.blocked)}
                </button>
            `);
		}
	}

	if (!is_own_profile) {
		// message
		const msg_button = document.body.querySelector('.header-message-user');
		if (msg_button) {
			if (page.name != sponsor_list.related.account_name) {
				create_profile_top_item(profile_header, {
					name: page.name,
					type: 'message',
					link: msg_button.getAttribute('href'),
					text: tl(trans.send_message),
				});

				if (
					sponsor_list.related.special.length > 0 &&
					page.name == sponsor_list.related.special[0]
				) {
					create_profile_top_item(profile_header, {
						name: page.name,
						type: 'sponsor',
						link: () => sponsor(),
						action: 'button',
					});
				}
			} else {
				profile_header.appendChild(html.node`
                    <button class="btn side-action icon-mask sponsor colourful" onclick=${() =>
					sponsor()} data-type="sponsor">
                        ${tl(trans.sponsor)}
                    </button>
                `);
				profile_header.appendChild(html.node`
                    <a class="btn side-action icon-mask sponsor colourful" href=${
					msg_button.getAttribute('href')
				} data-type="message_sponsor">
                        ${tl(trans.message_sponsor)}
                    </a>
                `);
			}
		}

		if (page.name != sponsor_list.related.account_name) {
			if (ff('compare')) {
				create_profile_top_item(profile_header, {
					name: page.name,
					type: 'compare',
					link: `${root}bleh/minis/compare?profile=${page.name}`,
					text: tl(trans.compare_plays),
				});
			}
		}
	} else {
		// edit
		create_profile_top_item(profile_header, {
			name: page.name,
			type: 'edit',
			text: tl(trans.edit_profile),
			link: `${root}settings`,
		});
		create_profile_top_item(profile_header, {
			name: page.name,
			type: 'collage',
			link: `${root}bleh/minis/collage`,
			text: tl(trans.create_collage),
		});
		create_profile_top_item(profile_header, {
			name: page.name,
			type: 'obsession',
			text: tl(trans.set_obsession),
			link: `${root}user/${page.name}/obsessions/set`,
		});

		if (ff('minis')) {
			create_profile_top_item(profile_header, {
				name: page.name,
				type: 'minis',
				link: `${root}bleh/minis`,
				text: tl(trans.explore_minis),
			});
		} else {
			create_profile_top_item(profile_header, {
				name: page.name,
				type: 'labs',
				link: `${root}labs`,
				tooltip: `
                    <strong>${tl(trans.labs_by_last)}</strong>
                    <p>${tl(trans.labs_by_last.tagline)}</p>
                `,
				tooltip_style: 'stack',
			});
		}
	}

	if (!is_own_profile && !is_sponsor_host) {
		const manage = create_profile_top_item(profile_header, {
			name: page.name,
			type: 'manage',
			beta: true,
			action: 'button',
		});
		manage_user(manage);
	}

	if (!page.mobile) {
		page.structure.side.insertBefore(
			profile_header,
			page.structure.side.firstElementChild,
		);
	} else {
		page.structure.main.insertBefore(
			profile_header,
			page.structure.main.firstElementChild,
		);
	}

	const summary = page.structure.main.querySelector('.profile-summary');

	if (
		!is_own_profile &&
		page.name != sponsor_list.related.account_name &&
		auth.name
	) {
		if (taste == '') {
			summary.appendChild(html.node`
                <div class="loading-data-container">
                    <div class="loading-data-text error">${
				tl(trans.missing_component)
			}</div>
                </div>
            `);

			return;
		}

		let details_btn;

		const taste_wrap = html.node`
            <div class="taste ${
			taste != 'super' && taste != 'very_low' ? 'icon' : ''
		}">
                <div class="taste-pics">
                    <div class="taste-avatar avatar">
                        <img src=${
			avatar(auth.avatar, 'avatar300s')
		} alt=${auth.name}>
                    </div>
                    <div class="taste-avatar avatar">
                        <img src=${page.avatar} alt=${page.name}>
                    </div>
                </div>
                <div class="span">
                    <label class="taste-badge colourful" data-taste=${taste}>${taste_formal}</label>
                    <div class="listen-item-info">
                        <h3 class="listen-item-name">
                            ${{
			html: tl(trans.you_share_count_with, {
				c: `<span class="colourful" data-taste=${taste}>${taste_percentage}</span>`,
			}),
		}}
                        </h3>
                        <p class="listen-item-text">
                            ${
			taste_artists.length == 1
				? { html: taste_artist(taste_artists[0]) }
				: ''
		}
                            ${
			taste_artists.length == 2
				? {
					html: tl(trans.you_share_count_with.two, {
						artist1: taste_artist(taste_artists[0]),
						artist2: taste_artist(taste_artists[1]),
					}),
				}
				: ''
		}
                            ${
			taste_artists.length == 3
				? {
					html: tl(trans.you_share_count_with.three, {
						artist1: taste_artist(taste_artists[0]),
						artist2: taste_artist(taste_artists[1]),
						artist3: taste_artist(taste_artists[2]),
					}),
				}
				: ''
		}
                        </p>
                    </div>
                </div>
                <div class="taste-bar">
                    <div class="taste-bar-fill colourful" data-taste=${taste} style="width: ${taste_percentage}" />
                </div>
                <div class="taste-interactions">
                    <button class="btn icon select-button taste-details outline-btn" data-type="details" ref=${(
			el,
		) => details_btn = el}>${tl(trans.view_details)}</button>
                </div>
            </div>
        `;

		const other_avi = page.avatar.replace('/avatar300s/', '/avatar42s/');
		let taste_menu;

		if (taste_artists.length > 0) {
			taste_menu = html.node`
                <div class="taste-menu-header colourful" data-taste=${taste}>
                    ${taste_formal} (${taste_percentage})
                </div>
                <a class="dropdown-menu-clickable-item" href="${root}user/${page.name}/library/music/${redirect()}${
				sanitise(taste_artists[0])
			}" data-menu-item="shared-artist">
                    <span class="menu-avatar">
                        <img src=${other_avi} alt=${page.name}>
                    </span>
                    ${taste_artists[0]}
                </a>
                <a class="dropdown-menu-clickable-item" href="${root}user/${auth.name}/library/music/${redirect()}${
				sanitise(taste_artists[0])
			}" data-menu-item="shared-artist">
                    <span class="menu-avatar">
                        <img src=${auth.avatar} alt=${auth.name}>
                    </span>
                    ${taste_artists[0]}
                </a>
                ${
				taste_artists.length >= 2
					? html.node`
                <div class="sep"></div>
                <a class="dropdown-menu-clickable-item" href="${root}user/${page.name}/library/music/${redirect()}${
						sanitise(taste_artists[1])
					}" data-menu-item="shared-artist">
                    <span class="menu-avatar">
                        <img src=${other_avi} alt=${page.name}>
                    </span>
                    ${taste_artists[1]}
                </a>
                <a class="dropdown-menu-clickable-item" href="${root}user/${auth.name}/library/music/${redirect()}${
						sanitise(taste_artists[1])
					}" data-menu-item="shared-artist">
                    <span class="menu-avatar">
                        <img src=${auth.avatar} alt=${auth.name}>
                    </span>
                    ${taste_artists[1]}
                </a>
                `
					: ''
			}
                ${
				taste_artists.length >= 3
					? html.node`
                <div class="sep"></div>
                <a class="dropdown-menu-clickable-item" href="${root}user/${page.name}/library/music/${redirect()}${
						sanitise(taste_artists[2])
					}" data-menu-item="shared-artist">
                    <span class="menu-avatar">
                        <img src=${other_avi} alt=${page.name}>
                    </span>
                    ${taste_artists[2]}
                </a>
                <a class="dropdown-menu-clickable-item" href="${root}user/${auth.name}/library/music/${redirect()}${
						sanitise(taste_artists[2])
					}" data-menu-item="shared-artist">
                    <span class="menu-avatar">
                        <img src=${auth.avatar} alt=${auth.name}>
                    </span>
                    ${taste_artists[2]}
                </a>
                `
					: ''
			}
                <div class="sep"></div>
                <a class="dropdown-menu-clickable-item" data-type="compare" href="${root}bleh/minis/compare?profile=${page.name}">${
				tl(trans.compare)
			}</a>
                <button class="dropdown-menu-clickable-item" data-type="copy" onclick=${() => {
				copy(tl(trans.generic_lastfm_compatibility_message, {
					u: page.name,
					r: taste_formal,
					a: taste_artists.join(tl(trans.comma)),
				}));
			}}>
                    ${tl(trans.copy)}
                </button>
            `;
		}

		summary.appendChild(taste_wrap);

		const today = new Date();
		const february = today.getMonth() == 1 && today.getDate() == 14;

		if (
			ff('sandrone') && february &&
			settings.friends.includes(page.name) &&
			['super', 'very_high', 'high'].includes(taste)
		) {
			taste_wrap.classList.add('valentine');

			render(
				taste_wrap,
				html`
					<div class="taste-pics valentine-pics">
						<div class="taste-avatar avatar">
							<img src=${avatar(
								auth.avatar,
								'avatar300s',
							)} alt=${auth.name}>
						</div>
						<div class="taste-icon colourful valentine" data-taste=${taste}>
							<div class="bleh-icon" />
						</div>
						<div class="taste-avatar avatar">
							<img src=${page.avatar} alt=${page.name}>
						</div>
					</div>
					<div class="span">
					    <div class="listen-item-info">
					        <h3 class="listen-item-name">
					            ${{
						html: tl(trans.you_are_a_value_match, {
							u: page.name,
							v: `<span class="colourful" data-taste=${taste}>${taste_formal}</span>`,
						}),
					}}
					        </h3>
					        <p class="listen-item-text">
					            ${taste_artists.length == 1
						? { html: taste_artist(taste_artists[0]) }
						: ''}
					            ${taste_artists.length == 2
						? {
							html: tl(trans.you_share_count_with.two, {
								artist1: taste_artist(taste_artists[0]),
								artist2: taste_artist(taste_artists[1]),
							}),
						}
						: ''}
					            ${taste_artists.length == 3
						? {
							html: tl(trans.you_share_count_with.three, {
								artist1: taste_artist(taste_artists[0]),
								artist2: taste_artist(taste_artists[1]),
								artist3: taste_artist(taste_artists[2]),
							}),
						}
						: ''}
					        </p>
					    </div>
					    ${() => {
						const info_btn = html.node`
                            <div class="taste-hover-icon-mini">
                                <div class="bleh-icon" />
                            </div>
                        `;

						tippy(info_btn, {
							content: tl(trans.valentine_info, { u: page.name }),
						});

						return info_btn;
					}}
					</div>
					<div class="taste-bar">
						<div class="taste-bar-fill colourful" data-taste=${taste}
							style="width: ${taste_percentage}" />
					</div>
					<div class="taste-interactions">
						<button class="btn icon select-button taste-details outline-btn"
							data-type="details" ref=${(el) =>
								details_btn = el}>${tl(
									trans.view_details,
								)}</button>
						<button class="btn icon primary colourful" data-taste=${taste}
							data-type="valentine" onclick=${() => {
								open(
									`${root}inbox/compose?to=${page.name}&subject=${
										encodeURIComponent(
											tl(trans.valentine, {
												u: page.name,
											}),
										)
									}`,
								);
							}}>${tl(trans.send_valentine)}</button>
					</div>
				`,
			);
		}

		if (taste_artists.length > 0) {
			tippy(details_btn, {
				theme: 'context-menu',
				content: taste_menu,
				trigger: 'click',
				placement: 'bottom',
				interactive: true,
				interactiveBorder: 10,
				appendTo: document.body,
			});
		}
	}
}

export function create_profile_top_item(
	parent,
	{
		name,
		link,
		text = '',
		type,
		new_release = false,
		updated = false,
		action = '',
		tooltip = '',
		allow_html = false,
		tooltip_theme = '',
		beta = false,
	},
) {
	log(`creating top item of ${name}, ${link}, ${text}`, 'profile');

	let side_action;
	if (action == 'button') {
		side_action = html.node`
            <button
                class="btn side-action icon-mask"
                data-type=${type}
                onclick=${link}
            >
                ${text || tl(trans[type])}
                ${new_release ? new_indicator() : ''}
                ${
			updated
				? html.node`<div class="new-badge">${tl(trans.updated)}</div>`
				: ''
		}
                ${beta ? beta_indicator() : ''}
            </button>
        `;
	} else {
		side_action = html.node`
            <a
                class="btn side-action icon-mask"
                data-type=${type}
                href=${link}
            >
                ${text || tl(trans[type])}
                ${new_release ? new_indicator() : ''}
                ${
			updated
				? html.node`<div class="new-badge">${tl(trans.updated)}</div>`
				: ''
		}
                ${beta ? beta_indicator() : ''}
            </a>
        `;
	}

	parent.appendChild(side_action);
	return side_action;
}

function friends_button(parent) {
	let friend_state = settings.friends.includes(page.name);
	let star_state = settings.starred_friend == page.name;

	if (!friend_state && star_state) {
		star_state = false;
		save_setting('starred_friend', '');
	}

	const elem = html.node`
        <button class="btn side-action colourful icon-mask side-action-small" data-type="close_friends" type="button" onclick=${() => {
		if (friend_state) {
			dialog({
				id: 'remove_friend',
				title: tl(trans.remove_friend.name),
				body: html.node`
                        <p>${{
					html: tl(trans.remove_friend.body, {
						u: `<strong>${page.name}</strong>`,
					}),
				}}</p>
                        <div class="modal-footer">
                            <button class="see-more cancel left-icon" onclick=${() =>
					dialog_rm({ id: 'remove_friend' })}>
                                ${tl(trans.cancel)}
                            </button>
                            <div class="fill" />
                            <button class="btn primary icon danger" data-type="minus" onclick=${() => {
					friend_state = false;
					star_state = false;

					const new_list = settings.friends.filter(
						(item) => item != page.name,
					);

					save_setting('friends', new_list);
					if (page.name == settings.starred_friend) {
						save_setting('starred_friend', '');
					}

					dialog_rm({ id: 'remove_friend' });
					update_visual();

					notify({
						id: 'friends',
						title: tl(trans.removed_friend),
						body: page.name,
						icon: 'icon-16-minus',
						type: 'error',
					});
				}}>
                                ${tl(trans.remove)}
                            </button>
                        </div>
                    `,
			});
		} else {
			friend_state = true;

			const new_list = [...settings.friends, page.name];

			save_setting('friends', new_list);
			update_visual();

			notify({
				id: 'friends',
				title: tl(trans.added_as_friend),
				body: page.name,
				icon: 'icon-16-users',
				type: 'success',
			});
		}
	}} />
    `;

	const tip = tippy(elem, {
		theme: 'stack',
		content: html.node`
            <span></span>
            <div class="hint">${tl(trans.friend_difference_min)}</div>
        `,
	});

	const menu = tippy(elem, {
		theme: 'context-menu',
		content: html.node``,
		placement: 'right-start',
		trigger: 'manual',
		interactive: true,
		interactiveBorder: 10,
		offset: [0, 0],
		appendTo: document.body,

		onShow(instance) {
			instance.popper.addEventListener('click', (event) => {
				instance.hide();
			});

			instance.setContent(html.node`
                <button class="dropdown-menu-clickable-item colourful" data-type="starred_friend" data-starred="true" onclick=${() => {
				if (star_state) {
					star_state = false;
					save_setting('starred_friend', '');
					update_visual();

					notify({
						id: 'friends',
						title: tl(trans.removed_star),
						body: page.name,
						icon: 'icon-16-minus',
						type: 'error',
					});
				} else {
					star_state = true;
					save_setting('starred_friend', page.name);
					update_visual();

					notify({
						id: 'friends',
						title: tl(trans.added_star),
						body: page.name,
						icon: 'icon-16-starred-friend',
					});
				}
			}}>
                    ${
				star_state
					? tl(trans.remove_as_star_friend)
					: tl(trans.add_as_starred_friend)
			}
                </button>
            `);
		},
	});

	register_menu(elem, menu);

	update_visual();

	function update_visual() {
		elem.setAttribute('data-friends', friend_state);
		elem.setAttribute('data-starred', star_state);

		if (star_state) {
			elem.textContent = tl(trans.starred_friend.name);
		} else if (friend_state) {
			elem.textContent = tl(trans.close_friends);
		} else {
			elem.textContent = tl(trans.add_as_friend);
		}

		tip.setContent(html.node`
            <span>${elem.textContent} (${
			tl(trans.friend_difference_min)
		})</span>
            <div class="hint">${tl(trans.right_click_for_more_options)}</div>
        `);
	}

	parent.appendChild(elem);

	setTimeout(() => {
		queue_popup('close_friends', elem);
	}, 0);
}
