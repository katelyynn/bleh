/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import {
	patch_avatar,
	style_name_from_badge,
} from '@/components/shared/avatar';
import { log } from '@/build/log';
import { auth, page, root } from '@/build/page';
import { clean_number } from '@/build/tools';
import { tl, trans } from '@/build/trans';
import {
	checkup_page_structure,
	convert_to_toolbar,
} from '@/components/page/structure';
import { is_same_page, register_background, update_page } from '../page';
import { bleh_home } from '@/pages/home';
import { html, render } from 'lighterhtml';
import { DateTime } from 'luxon';
import { icon, icons } from '@/components/shared/icon';
import { settings } from '@/build/config';
import { setting } from '@/components/settings/settings';

export function bleh_events() {
	if (page.subpage == 'overview') {
		// not an individual event
		bleh_events_home();
		return;
	}

	const is_subpage = page.subpage != 'event_overview';

	// without pro theres two containers
	if (auth.pro) {
		// pro

		page.structure.container = document.body.querySelector('.page-content');
	} else {
		// not pro

		if (!is_subpage) {
			page.structure.container = document.body.querySelector(
				'.page-content:not(header + .page-content)',
			);
		} else {
			page.structure.container = document.body.querySelector(
				'.page-content',
			);
		}
	}
	page.structure.row = page.structure.container.querySelector('.row');
	try {
		page.structure.main = page.structure.row.querySelector('.col-main');
		page.structure.side = page.structure.row.querySelector('.col-sidebar');
	} catch (e) {
		log('unable to find elements', 'page structure');
	}

	const event_header = document.body.querySelector('header');

	checkup_page_structure(is_subpage, event_header);

	if (page.subpage.startsWith('event_edit')) {
		bleh_events_edit();
		return;
	} else if (page.subpage.startsWith('add')) {
		bleh_events_create();
		return;
	}

	page.name = event_header.querySelector('.header-title').textContent.trim();
	page.sister = event_header.querySelector('.header-title').textContent
		.trim();

	const same_page = is_same_page();

	const redesigned_event_header = html.node`
        <section class="page-header for-generic ${same_page ? 'same' : ''}">
            <div class="page-header-icon">
                ${icon({ name: icons.events })}
            </div>
            <div class="page-header-info">
                <div class="sub-text">${tl(trans.event)}</div>
                <h1 class="page-header-title generic-page-title">${page.name}</h1>
            </div>
        </section>
    `;

	let background = document.body.querySelector(
		'.header-background--has-image',
	);
	if (background) {
		register_background(
			background.style.getPropertyValue('background-image').replace(
				'url("',
				'',
			).replace('")', ''),
		);
	} else {
		register_background(null);
	}

	page.structure.container.insertBefore(
		redesigned_event_header,
		page.structure.container.firstElementChild,
	);
	event_header.classList.add('legacy-header');

	if (!is_subpage) {
		let header_meta = document.body.querySelector('.header-metadata');
		header_meta.classList.add('profile-header-metadata-legacy');

		// acquire info
		let metadata = header_meta.querySelectorAll('.header-metadata-display');

		let going = 0;
		let maybe = 0;

		metadata.forEach((item, index) => {
			let para = item.querySelector('p');
			if (index == 0) {
				going = clean_number(para.textContent.trim());
			} else if (index == 1) {
				maybe = clean_number(item.textContent.trim());
			}
		});

		// create new
		let side_actions = document.createElement('section');
		side_actions.classList.add('side-actions');

		if (!page.mobile) {
			page.structure.side.insertBefore(
				side_actions,
				page.structure.side.firstElementChild,
			);
		} else {
			page.structure.main.appendChild(side_actions);
		}

		let form = document.body.querySelector('.attendance-control');
		let buttons = form.querySelectorAll('button');
		buttons.forEach((button) => {
			button.classList.add('btn', 'side-action', 'icon-mask');
		});

		side_actions.appendChild(form);

		let main_panel = page.structure.main.querySelector(
			'.event-summary-with-poster',
		);
		if (!main_panel) {
			main_panel = page.structure.main.querySelector('.event-details');
		}

		if (main_panel.parentElement != page.structure.main) {
			main_panel.parentElement.replaceWith(main_panel);
		}

		const date = main_panel.querySelector('[itemprop="startDate"]');
		const details = main_panel.querySelectorAll(
			'[itemprop="location"] > p',
		);

		let address;
		let tel;
		let web;
		let maps;

		details.forEach((detail) => {
			const type = detail.classList?.[0]?.replace('event-detail-', '') ||
				'';

			if (type == 'address') {
				address = {
					head: detail.querySelector('[itemprop="name"]')
						?.textContent,
					street: detail.querySelector('[itemprop="streetAddress"]')
						?.textContent,
					locality: detail.querySelector(
						'[itemprop="addressLocality"]',
					)?.textContent,
					postal: detail.querySelector('[itemprop="postalCode"]')
						?.textContent,
					country: detail.querySelector('[itemprop="addressCountry"]')
						?.textContent,
				};
			} else if (type == 'tel') {
				tel =
					detail.querySelector('[itemprop="telephone"]').textContent;
			} else if (type == 'web') {
				web = detail.querySelector('a').href;
			} else {
				maps = detail.querySelector('a').href;
			}
		});

		const added_by = main_panel.querySelector('.event-metadata a')
			?.textContent;

		const new_panel = html.node`
            <section class="events-panel">
                <div class="metadata-and-wiki-row full-w">
                    <div class="metadata-column">
                        <div class="metadata-group primary">
                            <dt class="catalogue-metadata-heading">${
			tl(trans.located)
		}</dt>
                            <dd class="catalogue-metadata-description address">
                                <strong>${address.head}</strong>
                                <p>${
			address.street ? `${address.street}, ` : ''
		}${address.locality}</p>
                                <p>${
			address.postal ? `${address.postal}, ` : ''
		}${address.country}</p>
                            </dd>
                        </div>
                        <div class="metadata-group">
                            <dt class="catalogue-metadata-heading">${
			tl(trans.date)
		}</dt>
                            <dd class="catalogue-metadata-description address">
                                ${() => {
			const date_object = DateTime.fromISO(date.getAttribute('content'));

			const values = date.querySelectorAll('strong');
			let hour;
			if (values.length > 1) {
				hour = values[1];
			}

			const elem = html.node`
                                        <strong>${
				date_object.toLocaleString(DateTime.DATE_FULL)
			}</strong>
                                        ${
				hour ? html.node`<p>${hour.textContent}</p>` : ''
			}
                                    `;

			return elem;
		}}
                            </dd>
                        </div>
                        ${
			tel
				? html.node`
                            <div class="metadata-group">
                                <dt class="catalogue-metadata-heading">${
					tl(trans.contact)
				}</dt>
                                <dd class="catalogue-metadata-description">${tel}</dd>
                            </div>
                        `
				: ''
		}
                    </div>
                </div>
                <div class="metadata-row">
                    <div class="metadata-group">
                        <div class="sub-text music-small-header">${
			tl(trans.find_on)
		}</div>
                        <div class="music-links">
                            ${
			web
				? html.node`
                                <a class="btn resource-external-link resource-external-link--homepage music-link colourful icon" href=${web} target="_blank">
                                    ${address.head}
                                </a>
                            `
				: ''
		}
                            ${
			maps
				? html.node`
                                <a class="btn music-link colourful social-link icon" data-host="maps.google.com" data-host-unknown="false" href=${maps} target="_blank">
                                    ${tl(trans.show_on_map)}
                                </a>
                            `
				: ''
		}
                        </div>
                    </div>
                </div>
            </section>
        `;
		main_panel.replaceWith(new_panel);

		if (added_by) {
			page.structure.side.appendChild(html.node`
                <section>
                    <p class="card-tip">${{
				html: tl(trans.added_by, {
					u: `<a class="mention" href="${root}user/${added_by}">@${added_by}</a>`,
				}),
			}}</p>
                </section>
            `);
		}

		// edit button
		let edit_button = main_panel.querySelector(
			'.event-metadata + .event-metadata a',
		);
		if (edit_button) {
			edit_button.classList.add('btn', 'side-action', 'icon-mask');
			edit_button.setAttribute('data-type', 'edit');
			side_actions.appendChild(edit_button);
		}

		// move poster
		let poster = main_panel.querySelector('.event-poster-preview');
		let poster_panel;
		if (poster) {
			poster_panel = document.createElement('section');
			poster_panel.classList.add('poster-panel');

			poster.setAttribute(
				'src',
				poster.getAttribute('src').replace('/arXL/', '/ar0/'),
			);

			poster_panel.innerHTML =
				`${poster.outerHTML}<a onclick="_expand_avatar('${
					poster.getAttribute('src')
				}')" class="bleh--avatar-clickable-link"></a>`;

			side_actions.after(poster_panel);
		}

		// attendees
		let users = page.structure.main.querySelectorAll(
			'.attendee-summary-user-inner-wrap',
		);
		users.forEach((user) => {
			let avatar = user.querySelector('.attendee-summary-user-avatar');
			let name = user.querySelector('.attendee-summary-user-link');

			let badge = patch_avatar(avatar, name.textContent, 'event');

			if (badge) {
				style_name_from_badge(name, badge);
			}
		});

		// cancelled
		let cancelled = page.structure.main.querySelector(
			'.event-status--cancelled',
		);
		if (cancelled) {
			page.structure.main.removeChild(cancelled);

			page.structure.main.insertBefore(
				html.node`
                <section class="cta first colourful error">
                    <strong>${tl(trans.event_cancelled)}</strong>
                </section>
            `,
				page.structure.main.firstElementChild,
			);
		}
	} else {
		if (
			page.subpage == 'event_attendance_going' ||
			page.subpage == 'event_attendance_interested'
		) {
			convert_to_toolbar();

			const no_data = page.structure.main.querySelector(
				'.no-data-message',
			);
			const pagination = page.structure.main.querySelector('.pagination');

			const user_list = page.structure.main.querySelector('.user-list');
			user_list?.setAttribute('data-list-view', settings.list_view);

			render(
				page.structure.main,
				html.node`
                <section class="users">
                    ${
					!no_data
						? setting({
							id: 'list_view',
							func: (val) => {
								user_list?.setAttribute('data-list-view', val);
							},
						})
						: ''
				}
                    ${no_data}
                    ${user_list}
                    ${pagination}
                </section>
            `,
			);
		}
	}

	log('status is', 'page', 'info', page);
	update_page();
}

function bleh_events_manage() {
	page.structure.container = document.body.querySelector('.page-content');
	try {
		page.structure.row = page.structure.container.querySelector('.row');
		page.structure.main = page.structure.row.querySelector('.col-main');
		page.structure.side = page.structure.row.querySelector('.col-sidebar');
	} catch (e) {
		log('unable to find elements', 'page structure');
	}

	let content_top = document.body.querySelector('.content-top');
	let header_text =
		content_top.querySelector('.content-top-header').textContent;

	checkup_page_structure(false, content_top);
	log('status is', 'page', 'info', page);
	update_page();

	register_background(auth.avatar);

	page.structure.nav.classList.add('navlist--more');

	let edit_header = document.createElement('section');
	edit_header.classList.add(
		'redesigned-header',
		'event-manage-header',
		'no-background',
	);
	edit_header.innerHTML = `
        <div class="tag-side">
            <div class="tag-icon event-icon"></div>
        </div>
        <div class="info-side">
            <div class="sub-text">${tl(trans.event)}</div>
            <h1>${header_text}</h1>
        </div>
    `;

	page.structure.container.insertBefore(
		edit_header,
		page.structure.container.firstElementChild,
	);
}

function bleh_events_create() {
	bleh_events_manage();
}

function bleh_events_edit() {
	bleh_events_manage();

	let back = document.body.querySelector('.content-top-back-link a');
	let nav = page.structure.nav.querySelector('ul');

	nav.insertBefore(
		html.node`
        <li class="navlist-item secondary-nav-item secondary-nav-item--back">
            <a class="secondary-nav-item-link" href="${
			back.getAttribute('href')
		}">
                ${tl(trans.back)}
            </a>
        </li>
    `,
		nav.firstElementChild,
	);
}

function bleh_events_home() {
	page.subpage = 'home';

	bleh_home();

	let filters = page.structure.container.querySelector('.events-filters');
	let panel = page.structure.main.querySelector('section');

	filters.classList = 'view-buttons';

	let buttons = filters.querySelectorAll('.events-filter > button');
	buttons.forEach((button) => {
		button.classList.add('btn', 'view-item');

		if (button.classList.contains('disclose-trigger')) {
			button.classList.remove('disclose-trigger');
			button.classList.add('select-button');
		}
	});

	panel.insertBefore(filters, panel.firstElementChild);

	page.structure.side.innerHTML = `
        <section class="side-actions">
            <a class="btn side-action add-button icon-mask" href="${root}events/add?reset=true">
                ${tl(trans.create_new_event)}
            </a>
        </section>
    `;
}
