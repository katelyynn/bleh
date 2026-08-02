//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { log } from '@/build/log';
import { page, root } from '@/build/page';
import { chart_reflow } from '@/components/music/chart';
import { ff } from '@/components/settings/sku';
import { html, render } from 'lighterhtml';
import { tl, trans } from '@/build/trans';

export function basic_page_structure() {
	page.structure.container = document.body.querySelector('.page-content');
	try {
		page.structure.row = page.structure.container.querySelector('.row');
		page.structure.main = page.structure.row.querySelector('.col-main');
		page.structure.side = page.structure.row.querySelector('.col-sidebar');
	} catch (e) {
		log('unable to find elements', 'page structure');
	}

	checkup_page_structure();
}

/**
 * ensures general health of the page structure, fills in the global page object
 * @param {boolean} is_subpage controls if the checker should identify content_top's etc.
 * @param {Element|null} header legacy header from last.fm to extract data from
 */
export function checkup_page_structure(is_subpage = false, header = null) {
	if (document.body.style.getPropertyValue('--hue-album')) {
		page.state.replaced_accent = false;

		setTimeout(() => {
			if (!page.state.replaced_accent) {
				document.body.style.removeProperty('--hue-album');
				document.body.style.removeProperty('--sat-album');
				document.body.style.removeProperty('--lit-album');
				chart_reflow();

				log(
					'removed previous colours as accent hasnt been refreshed',
					'page structure',
				);
			}
		}, 100);
	}

	const params = new URLSearchParams(document.location.search);
	page.requested = {
		tab: params.get('tab'),
		page: params.get('page'),
		token: params.get('token'),
		collage: params.get('collage'),
		subject: params.get('subject'),
	};

	if (
		!page.structure.container ||
		!document.body.contains(page.structure.container)
	) {
		log('page missing container, creating', 'page structure');
		page.structure.container = document.createElement('div');
		page.structure.container.classList.add('page-content', 'container');

		// listening report error
		const container_full_width = document.body.querySelector(
			'.container--full-width',
		);
		if (container_full_width) {
			container_full_width.insertBefore(
				page.structure.container,
				container_full_width.firstElementChild,
			);
		} else {
			document.body
				.querySelector('.adaptive-skin-container')
				.appendChild(page.structure.container);
		}
	}

	page.structure.container.setAttribute('data-assigned', 'true');

	const other_container = document.body.querySelector(
		'.page-content.container:not([data-assigned])',
	);
	if (other_container) other_container.style.setProperty('display', 'none');

	if (!page.structure.row || !document.body.contains(page.structure.row)) {
		log('page missing row, creating', 'page structure');
		page.structure.row = html.node`
            <div class="row" />
        `;

		page.structure.container.insertBefore(
			page.structure.row,
			page.structure.container.firstElementChild,
		);
	}
	if (page.structure.row.classList.contains('buffer-4')) {
		page.structure.row.classList = 'row col-main-is-primary';
	}

	page.structure.row.setAttribute('data-assigned', 'true');

	if (!page.structure.main || !document.body.contains(page.structure.main)) {
		log('page missing main, creating', 'page structure');
		page.structure.main = html.node`
            <div class="col-main" />
        `;

		page.structure.row.appendChild(page.structure.main);
	}

	page.structure.main.setAttribute('data-assigned', 'true');

	const other_main = page.structure.row.querySelector(
		'.col-main.hidden-xs:not([data-assigned])',
	);
	if (other_main) {
		other_main.remove();
	}

	if (!page.structure.side || !document.body.contains(page.structure.side)) {
		log('page missing side', 'page structure');
		// check first if another sidebar exists
		page.structure.side = page.structure.row.querySelector('.col-sidebar');

		if (!page.structure.side) {
			log('page missing side, creating', 'page structure');

			// otherwise, make anew
			page.structure.side = html.node`
                <div class="col-sidebar" />
            `;

			page.structure.row.appendChild(page.structure.side);
		}
	}

	if (ff('short')) {
		page.structure.content = html.node`
            <main class="content" data-lacrimosa=${ff('lacrimosa')}>
                <div class="content-main">
                    ${page.structure.main}
                </div>
                <div class="content-side">
                    ${page.structure.side}
                </div>
            </main>
        `;
		page.structure.row.appendChild(page.structure.content);

		page.structure.main?.classList.add('in-content-view');
		page.structure.side?.classList.add('in-content-view');

		page.structure.main?.setAttribute('data-lacrimosa', ff('lacrimosa'));
		page.structure.side?.setAttribute('data-lacrimosa', ff('lacrimosa'));

		single_column();
	}

	log('finished', 'page structure');

	if (ff('refreshed_music_nav') && header) {
		let navlist = header.querySelector('.navlist');

		if (navlist) {
			navlist.classList.add('redesigned-navigation');
			page.structure.container.insertBefore(
				navlist,
				page.structure.container.firstElementChild,
			);
			page.structure.nav = navlist;

			let overview = page.structure.nav.querySelector(
				'.secondary-nav-item--overview a',
			);

			if (overview) {
				const href = overview.getAttribute('href').replace(root, '');

				// we only want to replace the 'Overview' text
				// which is not present on these pages
				if (href == 'settings' || href == 'inbox' || href == 'charts') {
					overview = null;
				}
			}

			if (overview) overview.textContent = tl(trans.home);
		}

		if (is_subpage) {
			let content_top = document.body.querySelector('.content-top');

			if (content_top) {
				content_top.classList.add('redesigned-content-top');
				page.structure.content_top = content_top;

				// should be covered by bleh
				if (content_top.querySelector('.content-top-back-link')) {
					content_top.style.setProperty('display', 'none');
				}

				const content_top_nav = content_top.querySelector('.navlist');
				if (!content_top_nav && ff('beret')) {
					content_top.style.setProperty('display', 'none');
				}

				if (content_top.style.length > 0) {
					page.structure.content.after(content_top);
				} else {
					page.structure.row.insertBefore(
						content_top,
						page.structure.content,
					);
				}
			} else {
				let subpage_title = page.structure.main.querySelector(
					':scope > .subpage-title',
				);
				if (!subpage_title) {
					subpage_title = page.structure.main.querySelector(
						':scope > .section-controls > .subpage-title',
					);
				}
				if (!subpage_title) {
					subpage_title = page.structure.main.querySelector(
						':scope > section:first-child .section-controls > .subpage-title',
					);
				}

				if (subpage_title) {
					content_top = html.node`
                        <div class="content-top redesigned-content-top">
                            <div class="content-top-inner-wrap">
                                <div class="container content-top-lower">
                                    <h1 class="content-top-header">${subpage_title.textContent.trim()}</h1>
                                </div>
                            </div>
                        </div>
                    `;

					page.structure.content_top = content_top;
					content_top.style.setProperty('display', 'none');

					if (ff('short')) {
						page.structure.row.appendChild(content_top);
					} else navlist.after(content_top);

					try {
						page.structure.main.removeChild(subpage_title);
					} catch (e) {}
				}

				// is there another navlist?
				navlist = page.structure.main.querySelector('.navlist');

				if (navlist) {
					navlist.classList.add('redesigned-navigation');

					if (ff('mualani')) {
						let toolbar = html.node`
                            <div class="toolbar">
                                ${navlist}
                            </div>
                        `;

						page.structure.row.insertBefore(
							toolbar,
							page.structure.row.firstElementChild,
						);
					} else {
						page.structure.row.insertBefore(
							navlist,
							page.structure.content,
						);
					}
				}

				// is there a btn-add?
				let btn_add = page.structure.main.querySelector(
					':scope > .btn-add',
				);
				if (!btn_add) {
					btn_add = page.structure.main.querySelector(
						':scope > section:first-child .btn-add',
					);
				}

				if (btn_add) {
					const side_actions = html.node`
                        <section class="side-actions">
                            ${btn_add}
                        </section>
                    `;

					btn_add.classList = 'btn side-action icon-mask';
					btn_add.setAttribute('data-type', 'add');
					btn_add.textContent = tl(trans.add);

					if (!page.mobile) {
						page.structure.side.insertBefore(
							side_actions,
							page.structure.side.firstElementChild,
						);
					} else {page.structure.main.insertBefore(
							side_actions,
							page.structure.main.firstElementChild,
						);}
				}

				// is there a playlink?
				const radio = page.structure.main.querySelector(
					':scope > .section-controls > .section-playlink',
				);

				if (radio) {
					const side_actions = html.node`
                        <section class="side-actions">
                            ${radio}
                        </section>
                    `;

					radio.classList =
						'btn stationlink js-playlink-station radio-button side-action icon-mask';

					const type = radio.getAttribute('data-analytics-label');

					render(
						radio,
						html`
							<h3 class="sub-text">${tl(trans.radio)}</h3>
							<h4>${tl(trans[type])}</h4>
						`,
					);

					radio.removeAttribute('title');

					if (!page.mobile) {
						page.structure.side.insertBefore(
							side_actions,
							page.structure.side.firstElementChild,
						);
					} else {page.structure.main.insertBefore(
							side_actions,
							page.structure.main.firstElementChild,
						);}
				}
			}

			const similar_artists = page.structure.side.querySelector(
				'.similar-items-sidebar',
			);
			if (similar_artists) {
				similar_artists.parentElement.classList.add(
					'similar-artists-panel',
				);
				page.structure.side.removeChild(similar_artists.parentElement);
			}
		} else {
			const content_top = document.body.querySelector('.content-top');

			if (content_top) content_top.classList.add('legacy-content-top');
		}
	}
}

export function checkup_nav() {
	if (!ff('short')) return;

	if (page.structure.nav) {
		page.structure.nav.setAttribute('data-assigned', 'true');
	}

	const navlists = page.structure.container.querySelectorAll(
		':scope > .navlist',
	);
	navlists.forEach((nav, index) => {
		console.info(index);
		if (index < 1) return;

		if (ff('mualani')) {
			const toolbar = html.node`
                <div class="toolbar">
                    ${nav}
                </div>
            `;

			page.structure.row.insertBefore(toolbar, page.structure.content);
			page.structure.toolbar = toolbar;
		} else {
			page.structure.row.insertBefore(nav, page.structure.content);
		}
	});
}

export function convert_to_toolbar() {
	const nav = page.structure.content_top.querySelector('.navlist');
	if (!nav) return;

	nav.classList.add('redesigned-navigation');

	page.structure.toolbar = html.node`
        <div class="toolbar">
            ${nav}
        </div>
    `;

	page.structure.row.insertBefore(
		page.structure.toolbar,
		page.structure.row.firstChild,
	);
	page.structure.content_top.style.display = 'none';
}

function single_column() {
	if (
		[
			'following',
			'followers',
			'neighbours',
			'obsessions_set',
			'obsessions_overview',
			'obsessions_obsession',
			'loved',
			'subscription_automatic-edits_tracks',
			'subscription_automatic-edits_albums',
			'playlists_playlists',
			'listeners_overview',
			'auth',
		].includes(page.subpage) || [
			'charts',
			'inbox',
			'overview',
			'releases',
			'recommended',
			'bookmarks',
		].includes(page.type) || page.subpage.startsWith('event_attendance_')
	) {
		page.structure.content.classList.add('single-column');
	}
}
