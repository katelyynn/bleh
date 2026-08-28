/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { settings } from '@/build/config';
import { log } from '@/build/log';
import { auth, page, root } from '@/build/page';
import { romanise, sanitise, sanitise_text } from '@/build/tools';
import { tl, trans } from '@/build/trans';
import {
	correct_artist,
	correct_generic_combo_no_artist,
	correct_item_by_artist,
	name_includes,
	smart_title,
} from '@/components/music/lotus';
import {
	bleh_music_page_charts,
	bleh_top_listeners,
	convert_top_listener,
	redirect,
	show_your_scrobbles,
	similar_items,
} from '@/components/music/music';
import { checkup_page_structure } from '@/components/page/structure';
import { register_background, update_page } from '@/page';
import { ff } from '@/components/settings/sku';
import { bleh_gallery_list, bleh_gallery_upload } from '@/pages/music/gallery';
import { bleh_tags_mini } from '@/pages/tag';
import {
	bleh_wiki,
	bleh_wiki_editor,
	bleh_wiki_history,
} from '@/pages/music/wiki';
import { html, render } from 'lighterhtml';
import { other_listener } from '@/components/profile/profile_shortcut';
import { setting } from '@/components/settings/settings';
import { open_starred_friend_window } from '@/pages/profile/profile';
import { artist_title, page_header_avatar } from '@/components/music/header';
import { header_colour } from '@/components/page/colour';
import { oracle_process } from '@/components/music/oracle';
import {
	hover_tooltip,
	menu_tooltip,
	Tooltip,
} from '@/components/shared/tooltips.tsx';
import { useSettings } from '@/page.ts';
import { bleh_event_artist } from '@/pages/artist/event.tsx';
import { PageHeader, PageHeaderTitle } from '@/components/page/header.tsx';
import { SeeMore, ViewButtons } from '@/components/text/see_more.tsx';
import { createRef, ReactElement } from 'jsx-dom';
import { icons } from '@/components/shared/icon.tsx';
import { TopAlbum } from '@/components/album/top_album.tsx';
import { avatar } from '@/components/shared/avatar.tsx';
import { clean_streaming_titles } from '@/build/music.ts';
import { TrackStar } from '@/components/music/track.tsx';

export function bleh_artists() {
	const artist_header = document.body.querySelector(
		'.header-new--artist',
	) as HTMLElement;

	page.name = artist_header.querySelector('.header-new-title')!.textContent;
	page.sister = '';

	artist_title(artist_header);

	const is_subpage = page.subpage != 'overview';

	// without pro theres two containers
	if (auth.pro) {
		// pro

		page.structure.container = document.body.querySelector(
			'.page-content:not(.visible-xs, :has(.content-top-lower-row, a + .js-gallery-heading))',
		)!;
	} else {
		// not pro

		if (!is_subpage) {
			// normal, is there an ad then a container?
			page.structure.container = document.body.querySelector(
				'.full-bleed-ad-container + .page-content:not(.visible-xs)',
			)!;

			// death grips for some reason
			if (!page.structure.container) {
				page.structure.container = document.body.querySelector(
					'.page-content',
				)!;
			}
		} else {
			page.structure.container = document.body.querySelector(
				'.page-content:not(.visible-xs, :has(.content-top-lower-row, a + .js-gallery-heading))',
			)!;
		}
	}
	try {
		page.structure.row = page.structure.container!.querySelector('.row')!;

		if (!is_subpage) {
			page.structure.main = page.structure.row!.querySelector(
				'.col-main.buffer-standard',
			)!;
		} else {
			page.structure.main = page.structure.row!.querySelector(
				'.col-main',
			)!;
		}

		if (auth.pro) {
			page.structure.side = page.structure.row!.querySelector(
				'.col-sidebar:not(.masonry-right)',
			)!;
		} else {
			page.structure.side = page.structure.row!.querySelector(
				'.col-sidebar:not(.section-with-separator--col)',
			)!;
		}
	} catch (e) {
		log('unable to find elements', 'page structure');
	}

	checkup_page_structure(is_subpage, artist_header);

	const katsune = ff('katsune');
	const featured_items = artist_header.querySelector(
		'.artist-header-featured-items',
	);

	if (ff('refreshed_music_nav')) {
		const avatar = artist_header.querySelector(
			'.header-new-background-image',
		) as HTMLElement;
		const title = artist_header.querySelector(
			'.header-new-title',
		) as HTMLDivElement;
		const on_tour = artist_header.querySelector('.header-new-on-tour');
		const position = artist_header.querySelector(
			'.header-new-chart-position-number',
		) as HTMLAnchorElement;

		if (on_tour) page.state.on_tour = true;

		// TODO: change to tsx
		const page_avatar = page_header_avatar(
			avatar?.getAttribute('content') || '',
		);

		//const same_page = is_same_page();

		const redesigned_artist_header = (
			<PageHeader
				type='artist'
				avatar={page_avatar}
				combined={page.multi}
			>
				<PageHeaderTitle>
					{title}
					{position}
				</PageHeaderTitle>
			</PageHeader>
		);

		log('settings hue accent', 'dfbdfb', 'info', {
			settings: JSON.stringify(settings),
		});
		header_colour(
			page_avatar.image,
			useSettings.get('hue_from_artist') as boolean,
			[
				page_avatar,
			],
		);

		if (position) {
			hover_tooltip(
				position,
				<Tooltip>{tl(trans.view_the_charts)}</Tooltip>,
			);
		}

		if (avatar) register_background(avatar.getAttribute('content'));
		else register_background(null);

		page.structure.container!.insertBefore(
			redesigned_artist_header,
			page.structure.container!.firstElementChild,
		);
		artist_header.classList.add('legacy-header');
	}

	if (!is_subpage) {
		show_your_scrobbles();

		bleh_music_page_charts();

		bleh_tags_mini();

		similar_items();

		const top_tracks = page.structure.main!.querySelector('#top-tracks');
		if (top_tracks) {
			const settings_btn = createRef();

			const top = top_tracks.querySelector('.section-controls')!;
			top.classList = 'top-container';

			const header = top.querySelector('h3')!;

			const select_btn = top.querySelector(
				'.dropdown-menu-clickable-button',
			) as HTMLButtonElement;
			if (select_btn) {
				select_btn.classList.add(
					'select-button',
					'link-select',
					'blend-v2-btn',
				);
				select_btn.classList.remove('dropdown-menu-clickable-button');
			}

			const play = top.querySelector(
				'.section-playlink',
			) as HTMLAnchorElement;
			if (play) {
				play.classList.add('blend-v2-btn', 'radio', 'left-icon');
				play.classList.remove(
					'section-playlink',
					'hover-section-control',
				);
				play.setAttribute('data-type', 'play');
			}

			header.after(
				<>
					<ViewButtons blend blendV2 accompany>
						{select_btn}
					</ViewButtons>
					<ViewButtons blend blendV2>
						{play}
						<SeeMore
							blend
							iconPlacement='left'
							icon={icons.settings}
							ref={settings_btn}
						>
							{tl(trans.settings)}
						</SeeMore>
					</ViewButtons>
				</>,
			);

			menu_tooltip(
				settings_btn.current,
				<Tooltip theme='window'>
					<div class='dialog-settings'>
						<div class='setting-group blend'>
							{setting({ id: 'format_guest_features' })}
							{setting({ id: 'show_guest_features' })}
							{setting({ id: 'count_bar_right' })}
						</div>
					</div>
				</Tooltip>,
			);
		}

		const top_albums = page.structure.main!.querySelector('#top-albums');
		if (top_albums) {
			const top = top_albums.querySelector('.section-controls')!;
			top.classList = 'top-container';

			const header = top.querySelector('h3')!;

			const select_btn = top.querySelector(
				'.dropdown-menu-clickable-button',
			);

			if (select_btn) {
				select_btn.classList.add(
					'select-button',
					'link-select',
					'blend-v2-btn',
				);
				select_btn.classList.remove('dropdown-menu-clickable-button');

				// TODO: if we ever add settings for this album view, move out of here
				header.after(html.node`
                    <div class="accompany view-buttons blend blend-v2">
                        ${select_btn}
                    </div>
                `);
			}

			const albums = top_albums.querySelector(
				'.buffer-standard',
			) as HTMLDivElement;
			albums.classList.remove('buffer-standard');
			albums.classList.add('top-albums-buffer');

			const ol = albums.firstElementChild;
			ol!.classList.add('in-carousel');

			const carousel = (
				<div class='top-albums-carousel'>
					{albums}
				</div>
			);
			top_albums.appendChild(carousel);

			const link = albums.querySelector('.more-link-fullwidth-right');
			if (link) carousel.after(link);

			const list = featured_items?.querySelectorAll('li');
			const new_album = list?.[0];

			if (new_album) {
				const name = new_album.querySelector(
					'.artist-header-featured-items-item-name',
				)?.textContent.trim() || '';
				const aux = new_album.querySelector(
					'.artist-header-featured-items-item-aux-text',
				)?.textContent.trim();
				const href = new_album.querySelector('.link-block-cover-link')
					?.getAttribute('href') || '';
				const image = new_album.querySelector('img')!.src;

				carousel.insertBefore(
					<TopAlbum
						name={clean_streaming_titles(name)}
						artist={page.name}
						listeners={tl(trans.latest_album)}
						date={aux}
						href={`${root}music/${sanitise(page.name)}/${
							sanitise(clean_streaming_titles(name))
						}`}
						image={avatar(image, '300x300')}
					/>,
					carousel.firstElementChild,
				);
			}

			if (useSettings.get('simulate_scroll')) {
				carousel.addEventListener('wheel', (e) => {
					e.preventDefault();

					if (e.deltaY > 0) {
						carousel.scrollBy({
							top: 0,
							left: +200,
							behavior: 'smooth',
						});
					} else {
						carousel.scrollBy({
							top: 0,
							left: -200,
							behavior: 'smooth',
						});
					}
				});
			} else {
				carousel.classList.add('scroll-manually');
			}
		}

		if (top_tracks && top_albums) top_albums.after(top_tracks);

		const tracks_seen = new Set();

		const listeners_section = page.structure.main!.querySelector(
			'.listeners-section',
		);
		if (listeners_section) {
			const listeners = listeners_section.querySelectorAll(
				'.listeners-section-item',
			);

			listeners_section.classList = 'user-list top-listeners-list small';
			listeners_section.setAttribute('data-list-view', 'grid');
			render(listeners_section, html``);

			listeners.forEach((listener, index) => {
				const link = listener.querySelector(
					'.listeners-section-track a',
				);

				if (link) {
					tracks_seen.add(link.textContent.trim().toLowerCase());
				}

				listeners_section.appendChild(
					convert_top_listener(listener, index, 'listeners-section'),
				);
			});
		}

		if (top_tracks) {
			const tracks = top_tracks.querySelectorAll('.chartlist-row');
			tracks.forEach((track) => {
				const name = track.querySelector('.chartlist-name a')
					?.getAttribute('title');
				if (!name) return;

				track.appendChild(
					<TrackStar active={tracks_seen.has(name.toLowerCase())} />,
				);
			});
		}
	} else {
		const btn_add = page.structure.side.querySelector('.add-button');
		if (btn_add) btn_add.setAttribute('data-page-subpage', page.subpage);

		if (page.subpage.startsWith('listeners_')) {
			const toolbar = page.structure.row.querySelector(
				':scope > .toolbar > .navlist > .navlist-items',
			);

			const overview = toolbar.querySelector(
				'.secondary-nav-item--overview',
			);
			overview.classList.remove('secondary-nav-item--overview');
			overview.classList.add('secondary-nav-item--global');
			overview.querySelector('a').textContent = tl(trans.global);

			let mutuals = toolbar.querySelector(
				'.secondary-nav-item--you-know a',
			);
			mutuals.textContent = tl(trans.mutuals);

			if (page.subpage == 'listeners_overview') bleh_top_listeners();
			else if (page.subpage == 'listeners_you-know') bleh_listeners();
		}

		if (page.subpage == 'events') {
			const tabs = page.structure.row.querySelectorAll(
				':scope > .toolbar .secondary-nav-item-link',
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

			bleh_event_artist();
		}

		if (page.subpage == 'images_image-upload') bleh_gallery_upload();
		else if (page.subpage == 'images_overview') bleh_gallery_list();
		else if (page.subpage == 'wiki_overview') bleh_wiki();
		else if (page.subpage == 'wiki_history') bleh_wiki_history();
		else if (page.subpage == 'wiki_edit') bleh_wiki_editor();
		else if (page.subpage == 'tracks') bleh_artist_tracks();
		else if (page.subpage == 'albums') bleh_artist_albums();
		else if (page.subpage == 'similar') bleh_artist_similar();
	}

	if (ff('oracle') && settings.oracle_beta) oracle_process();

	log('status is', 'page', 'info', page);
	update_page();
}

function bleh_artist_tracks() {
	const top_tracks = page.structure.main.querySelector('section');
	if (top_tracks) {
		let settings_btn;

		const top = top_tracks.querySelector('.section-controls');
		top.classList = 'top-container';

		const header = top.querySelector('h2');
		header.classList.remove('subpage-title');

		const select_btn = top.querySelector('.dropdown-menu-clickable-button');

		if (select_btn) {
			select_btn.classList.add(
				'select-button',
				'link-select',
				'blend-v2-btn',
			);
			select_btn.classList.remove('dropdown-menu-clickable-button');
		}

		header.after(html.node`
                <div class="accompany view-buttons blend blend-v2">
                    ${select_btn}
                </div>
                <div class="view-buttons blend blend-v2">
                    <button class="left-icon blend-v2-btn" data-type="settings" ref=${(
			el,
		) => (settings_btn = el)}>
                        ${tl(trans.settings)}
                    </button>
                </div>
            `);

		menu_tooltip(
			settings_btn,
			<Tooltip theme='window'>
				<div class='dialog-settings'>
					<div class='setting-group blend'>
						{setting({ id: 'format_guest_features' })}
						{setting({ id: 'show_guest_features' })}
					</div>
				</div>
			</Tooltip>,
		);
	}
}

function bleh_artist_albums() {
	const top_albums = page.structure.main.querySelector(
		'#artist-albums-section',
	);
	if (top_albums) {
		const top = top_albums.querySelector('.section-controls');
		top.classList = 'top-container';

		const header = top.querySelector('h3');

		const select_btn = top.querySelector('.dropdown-menu-clickable-button');

		if (select_btn) {
			select_btn.classList.add(
				'select-button',
				'link-select',
				'blend-v2-btn',
			);
			select_btn.classList.remove('dropdown-menu-clickable-button');
		}

		header.after(html.node`
            <div class="accompany view-buttons blend blend-v2">
                ${select_btn}
            </div>
        `);
	}

	correct_generic_combo_no_artist('resource-list--release-list-item');
}

function bleh_artist_similar() {
	const similar = page.structure.main!.querySelector(
		':scope > .similar-artists',
	);

	if (!similar) return;

	const artists = similar.querySelectorAll('.similar-artists-item-wrap');

	const pagination = page.structure.main!.querySelector('.pagination');

	render(
		page.structure.main!,
		html`
			<section class="similar-panel">
			    <h2 class="text-18">
			        ${{
				html: tl(trans.artists_similar_to_name, {
					n: `<i>${
						sanitise_text(romanise(correct_artist(page.name)))
					}</i>`,
				}),
			}}
			    </h2>
			    ${similar}
			    ${pagination}
			</section>
		`,
	);

	artists.forEach((artist) => {
		const name = artist.querySelector('.similar-artists-item-name a');
		if (name) name.textContent = romanise(correct_artist(name.textContent));

		bleh_tags_mini(artist);
	});
}

function bleh_listeners() {
	const buffer = page.structure.main!.querySelector(
		':scope > .buffer-standard',
	);

	const no_data = buffer.querySelector(':scope > .no-data-message');

	if (!no_data) {
		// there are listeners
		const p = buffer.querySelector(':scope > p');

		const match = p.textContent.match(/\d+/);
		const count = parseInt(match[0]);

		p.remove();

		buffer.insertBefore(
			html.node`
            <h2>${
				tl(trans.count_mutual_listeners).replace(
					'{c}',
					count.toString(),
				)
			}</h2>
        `,
			buffer.firstElementChild,
		);
	} else {
		// no listeners
		render(
			buffer,
			html`
				<h2>${tl(trans.no_mutual_listeners)}</h2>
				<div class="loading-data-container">
					<div class="loading-data-text info">
				        ${tl(trans.no_mutual_listeners_explain)}
				    </div>
				</div>
			`,
		);
	}

	// i could just render away the ad here but courtesy
	const friends_panel = html.node`
        <section class="side-actions" />
    `;

	render_friends();

	page.structure.side!.insertBefore(
		friends_panel,
		page.structure.side!.firstElementChild,
	);

	function render_friends() {
		const friends = settings.friends.filter((friend) =>
			friend != useSettings.get('starred_friend')
		);

		render(
			friends_panel,
			html`
				<a class="btn side-action icon-mask" data-type="profile" href="${root}user/${auth
					.name}/library/music/${redirect()}${sanitise(page.name)}">
				    <span><span class="at">@</span>${auth.name}</span>
				</a>
				${useSettings.get('starred_friend') != ''
					? html.node`
            <a class="btn side-action icon-mask" data-type="profile" href="${root}user/${
						useSettings.get('starred_friend')
					}/library/music/${redirect()}${sanitise(page.name)}">
                <span><span class="at">@</span>${
						useSettings.get('starred_friend')
					}</span>
                <span class="star-icon colourful">
                    <span class="bleh-icon" />
                </span>
            </a>
            `
					: ''}
				${friends.map((friend) =>
					html.node`
            <a class="btn side-action icon-mask" data-type="profile" href="${root}user/${friend}/library/music/${redirect()}${
						sanitise(page.name)
					}">
                <span><span class="at">@</span>${friend}</span>
            </a>
            `
				)}
				<button class="btn side-action icon-mask" data-type="edit" onclick=${() =>
					open_starred_friend_window(() => {
						render_friends();
					})}>
				    ${tl(trans.edit_close_friends)}
				</button>
				<button class="btn side-action icon-mask" data-type="add" onclick=${() =>
					other_listener(sanitise(page.name))}>
				    ${tl(trans.custom)}
				</button>
			`,
		);
	}
}
