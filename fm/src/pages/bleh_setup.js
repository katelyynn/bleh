//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { log } from '@/build/log';
import { auth, discord, page, root } from '@/build/page';
import { tl, trans } from '@/build/trans';
import { checkup_page_structure } from '@/components/page/structure';
import { update_colour_swatches } from '../config';
import { version } from '@/main';
import { register_background, update_page } from '@/page';
import { theme_bubbles } from '@/pages/bleh_settings/bleh_settings';
import { html, render } from 'lighterhtml';
import { setting } from '@/components/settings/settings';
import { ff } from '@/components/settings/sku';
import { sponsor } from '@/components/sponsor';
import { settings } from '@/build/config';
import { dialog } from '@/components/dialog/dialog';
import { match } from '@/components/settings/dynamic_theming';
import { display_colour_presets } from '@/components/settings/swatch';
import { avatar } from '@/components/shared/avatar';
import { sponsor_list } from '@/build/sponsor';

export function bleh_setup() {
	if (!auth.name) {
		window.location.href = `${root}login?next=bleh/setup`;
		return;
	}

	page.structure.container = document.body.querySelector('.page-content');
	try {
		page.structure.row = page.structure.container.querySelector('.row');
		page.structure.main = page.structure.row.querySelector('.col-main');
		page.structure.side = page.structure.row.querySelector('.col-sidebar');
	} catch (e) {
		log('unable to find elements', 'page structure');
	}

	let content_top = document.body.querySelector('.content-top');

	checkup_page_structure(false, content_top);

	page.type = 'bleh_setup';
	page.subpage = '';

	if (auth.avatar) {
		register_background(avatar(auth.avatar, 'ar0'));
	} else register_background(null);

	log('status is', 'page', 'info', page);

	update_page();

	page.state.trans = 0;

	// remove error stuff cus we control this page
	page.structure.row.removeChild(page.structure.row.firstElementChild);
	page.structure.row.removeChild(page.structure.row.firstElementChild);

	page.structure.container.classList.add('has-cards-view');
	page.structure.content.classList.add('cards-view');

	let masthead = document.body.querySelector('.masthead');
	masthead.classList.add('in-setup');

	page.state.setup_pages = 5;

	render(
		page.structure.main,
		html`
			<section class="setup sour" ref=${(
				el,
			) => (page.structure.setup = el)}>
				<div class="setup-top">
					<div class="avatar">
						<img src=${avatar(auth.avatar, 'avatar170s')} alt=${tl(
							trans.your_avatar,
						)}>
					</div>
					<div class="info">
						<h1 class="setup-head">${{
							html: tl(trans.welcome, {
								u: `<a class="mention" href="${root}user/${auth.name}"><span class="at">@</span>${auth.name}</a>`,
							}),
						}}</h1>
						<h2 class="setup-head-sub">${tl(
							trans.bleh_setup_guide,
						)}</h2>
					</div>
				</div>
				<div
					class="setup-content"
					ref=${(el) => (page.structure.setup_content = el)}
				></div>
				<div
					class="setup-footer"
					ref=${(el) => (page.structure.setup_footer = el)}
				></div>
			</section>
		`,
	);

	bleh_setup_start();
}

function show_page_count() {
	return html.node`
        <span class="new-badge count-badge">${
		page.state.setup_page - 1
	}/${page.state.setup_pages}</span>
    `;
}

function bleh_setup_start() {
	page.state.setup_page = 1;

	page.structure.setup.setAttribute('data-page', 'start');
	page.structure.setup.setAttribute('data-animating', 'true');
	setTimeout(function () {
		page.structure.setup.setAttribute('data-animating', 'false');
		render(
			page.structure.setup_content,
			html`
				<p>${{
					html: tl(trans.welcome_to_bleh, { b: version.brand }),
				}}</p>
			`,
		);
		render(
			page.structure.setup_footer,
			html`
				${auth.name
					? html.node`
            <a class="see-more cancel left-icon" href="${root}user/${auth.name}">
                ${tl(trans.skip)}
            </a>
            `
					: html.node`
            <a class="see-more cancel left-icon" href="${root}dashboard">
                ${tl(trans.skip)}
            </a>
            `}
				<div class="fill"></div>
				<button class="btn primary continue" onclick=${() =>
					setup_accessibility()}>
				    ${tl(trans.next)}${show_page_count()}
				</button>
			`,
		);
	}, page.state.trans);

	page.state.trans = 200;
}

function setup_themes() {
	page.state.setup_page = 3;

	page.structure.setup.setAttribute('data-page', 'themes');
	page.structure.setup.setAttribute('data-animating', 'true');

	let adaptive_tip;
	let bubbles;

	let font_choice;
	let custom_font;

	function render_tip() {
		adaptive_tip.setAttribute('aria-hidden', !settings.theme_schedule);

		render(
			adaptive_tip,
			html`
				${tl(trans.adaptive_tip, {
					day: tl(trans.themes[settings.theme_day]),
					night: tl(trans.themes[settings.theme_night]),
				})}<a
				    onclick=${() => {
					dialog({
						id: 'auto_theme',
						title: tl(trans.themes.name),
						body: html.node`
                        <div class="setting-group">
                            ${(theme_day = setting({
							id: 'theme_day',
							list: [
								{
									value: 'light',
									text: tl(trans.themes.light),
								},
								{
									value: 'ink',
									text: tl(trans.themes.ink),
								},
								{
									value: 'dark',
									text: tl(trans.themes.dark),
								},
								{
									value: 'darker',
									text: tl(trans.themes.darker),
								},
								{
									value: 'oled',
									text: tl(trans.themes.oled),
								},
							],
							func: () => {
								render_tip();
								bubbles.re_render();
								match();
							},
						}))}
                            ${(theme_night = setting({
							id: 'theme_night',
							list: [
								{
									value: 'light',
									text: tl(trans.themes.light),
								},
								{
									value: 'ink',
									text: tl(trans.themes.ink),
								},
								{
									value: 'dark',
									text: tl(trans.themes.dark),
								},
								{
									value: 'darker',
									text: tl(trans.themes.darker),
								},
								{
									value: 'oled',
									text: tl(trans.themes.oled),
								},
							],
							func: () => {
								render_tip();
								bubbles.re_render();
								match();
							},
						}))}
                        </div>
                        <p class="card-tip">${tl(trans.theme_schedule)}</p>
                    `,
					});
				}}
				    >${tl(trans.change_schedule)}</a
				>
			`,
		);
	}

	setTimeout(function () {
		page.structure.setup.setAttribute('data-animating', 'false');
		render(
			page.structure.setup_content,
			html`
				<div class="setting-group">
				    <div class="setting" data-type="action">
				        <div class="heading">
				            <h5>${tl(trans.themes.name)}</h5>
				        </div>
				        <div class="info v">
				            ${(bubbles = theme_bubbles(() => {
					sat_bg.compat();

					render_tip();
					match();
				}))}
				            <p
				                class="card-tip"
				                ref=${(el) => (adaptive_tip = el)}
				            />
				        </div>
				    </div>
				    ${setting({ id: 'solarium' })}
				    <div class="setting" data-type="action">
				        <div class="heading">
				            <h5>${tl(trans.hue)}</h5>
				        </div>
				        <div class="info swatch-info">
				            <div
				                id="colour_custom"
				                class="swatch-group palette"
				            ></div>
				            <div class="sep swatch-sep" />
				            <div
				                id="colour_palette"
				                class="swatch-group palette"
				            ></div>
				        </div>
				    </div>
				    ${ff('card_saturation')
					? html.node`
                ${(sat_bg = setting({ id: 'sat_bg' }))}
                `
					: ''}
				</div>
				<div class="setting-group">
				    ${font_choice = setting({
					id: 'font_choice',
					func: () => {
						custom_font.compat();
					},
				})}
				    ${custom_font = setting({ id: 'font', text: false })}
				    ${setting({ id: 'font_serif' })}
				</div>
			`,
		);
		render(
			page.structure.setup_footer,
			html`
				<button class="see-more cancel left-icon" onclick=${() =>
					setup_accessibility()}>
				    ${tl(trans.back)}
				</button>
				<div class="fill"></div>
				<button class="btn primary continue" onclick=${() =>
					setup_music()}>
				    ${tl(trans.next)}${show_page_count()}
				</button>
			`,
		);

		render_tip();

		display_colour_presets();
		update_colour_swatches();
	}, page.state.trans);
}

function setup_accessibility() {
	page.state.setup_page = 2;

	page.structure.setup.setAttribute('data-page', 'accessibility');
	page.structure.setup.setAttribute('data-animating', 'true');
	setTimeout(function () {
		page.structure.setup.setAttribute('data-animating', 'false');
		render(
			page.structure.setup_content,
			html`
				<p>${tl(trans.accessibility_explain)}</p>
				<div class="settings">
					<div class="setting-group">
				        ${setting({
					id: 'reduced_motion',
					func: (val) => {
						if (val) {
							page.state.trans = 0;
						} else {
							page.state.trans = 200;
						}
					},
				})}
				        ${setting({ id: 'underline_links' })}
				    </div>
				</div>
			`,
		);
		render(
			page.structure.setup_footer,
			html`
				<button class="see-more cancel left-icon" onclick=${() =>
					bleh_setup_start()}>
				    ${tl(trans.back)}
				</button>
				<div class="fill"></div>
				<button class="btn primary continue" onclick=${() =>
					setup_themes()}>
				    ${tl(trans.next)}${show_page_count()}
				</button>
			`,
		);
	}, page.state.trans);
}

function setup_music() {
	page.state.setup_page = 4;

	page.structure.setup.setAttribute('data-page', 'music');
	page.structure.setup.setAttribute('data-animating', 'true');
	setTimeout(function () {
		page.structure.setup.setAttribute('data-animating', 'false');

		let header_preview;

		function render_header_preview() {
			const format = settings.format_guest_features;
			const show_artist_tag = settings.show_guest_features;

			render(
				header_preview,
				html`
					<div class="page-header-info">
						<div class="title-container">
							<h1 class="header-new-title page-header-title"
								data-kate-processed="true">
					            <div class="title">
					                THE END${!format
						? ' (feat. will.i.am & Jessica Pratt)'
						: ''}
					            </div>
					            ${format && show_artist_tag
						? html
							.node`<div class="feat" data-tag-group="guests">feat. will.i.am & Jessica Pratt</div>`
						: ''}
					        </h1>
						</div>
						<h2 class="page-header-artist artist-for-track">
							<span itemprop="byArtist" style="display: flex">
					            <a class="header-new-crumb" itemprop="url" href="/music/+noredirect/A%24AP+Rocky">
					                <span itemprop="name">A$AP Rocky</span>
					            </a>
					            ${format
						? html.node`
                            ,
                            <a class="header-new-crumb" href="/music/+noredirect/will.i.am">
                                will.i.am
                            </a>,
                            <a class="header-new-crumb" href="/music/+noredirect/Jessica+Pratt">
                                Jessica Pratt
                            </a>
                            `
						: ''}
					        </span>
						</h2>
					</div>
				`,
			);
		}

		render(
			page.structure.setup_content,
			html`
				<p>${tl(trans.music_explain)}</p>
				<div class="settings">
					<div class="inner-preview pad flex" ref=${(el) =>
						header_preview = el} />
					<div class="setting-group">
				        ${setting({ id: 'corrections' })}
				        ${setting({
					id: 'format_guest_features',
					func: () => {
						render_header_preview();
					},
				})}
				    </div>
				</div>
			`,
		);

		render_header_preview();

		render(
			page.structure.setup_footer,
			html`
				<button class="see-more cancel left-icon" onclick=${() =>
					setup_themes()}>
				    ${tl(trans.back)}
				</button>
				<div class="fill"></div>
				<button class="btn primary continue" onclick=${() =>
					setup_layout()}>
				    ${tl(trans.next)}${show_page_count()}
				</button>
			`,
		);
	}, page.state.trans);
}

function setup_layout() {
	page.state.setup_page = 5;

	page.structure.setup.setAttribute('data-page', 'music');
	page.structure.setup.setAttribute('data-animating', 'true');
	setTimeout(function () {
		page.structure.setup.setAttribute('data-animating', 'false');

		let track_layout;
		let expand_tracks;
		let track_album_name_location;

		let preview;

		function render_track_preview() {
			const avi = auth.avatar.replace('/avatar42s/', '/avatar170s/');

			render(
				preview,
				html`
					<table
						class="chartlist chartlist--with-image chartlist--with-loved chartlist--with-artist chartlist--with-more">
						<tbody>
							<tr
								class="chartlist-row chartlist-row--with-artist chartlist-row--now-scrobbling"
								data-has-bar="false"
								data-show-album-text=${settings.expand_tracks !=
										'never' &&
									settings.track_layout == 'column'}
								data-album-name-location=${settings
									.track_album_name_location}
							>
								<td class="chartlist-image">
									<a class="cover-art">
										<img src=${avi} loading="lazy" />
									</a>
								</td>
								<td class="kate-placeholder" />
								<td class="track-info" data-has-bar="false"
									data-track-layout=${settings.track_layout}
									data-album-name-location=${settings
										.track_album_name_location}>
					                <span class="chartlist-name">
					                    <a>${tl(trans.track_name)}</a>
					                </span>
					                <span class="chartlist-artist">
					                    <a>${tl(trans.artist_name)}</a>
					                </span>
					                ${settings.expand_tracks != 'never' &&
							settings.track_layout == 'column'
						? html.node`
                                    <span class="chartlist-album custom-album-text">
                                        <a>${tl(trans.album_name)}</a>
                                    </span>
                                `
						: ''}
					            </td>
							</tr>
							<tr
								class="chartlist-row chartlist-row--with-artist"
								data-has-bar="false"
								data-show-album-text=${settings.expand_tracks ==
										'always' &&
									settings.expand_tracks != 'never' &&
									settings.track_layout == 'column'}
								data-album-name-location=${settings
									.track_album_name_location}
							>
								<td class="chartlist-image">
									<a class="cover-art">
										<img src=${avi} loading="lazy" />
									</a>
								</td>
								<td class="kate-placeholder" />
								<td class="track-info" data-has-bar="false"
									data-track-layout=${settings.track_layout}
									data-album-name-location=${settings
										.track_album_name_location}>
					                <span class="chartlist-name">
					                    <a>${tl(trans.track_name)}</a>
					                </span>
					                <span class="chartlist-artist">
					                    <a>${tl(trans.artist_name)}</a>
					                </span>
					                ${settings.expand_tracks == 'always' &&
							settings.expand_tracks != 'never' &&
							settings.track_layout == 'column'
						? html.node`
                                    <span class="chartlist-album custom-album-text">
                                        <a>${tl(trans.album_name)}</a>
                                    </span>
                                `
						: ''}
					            </td>
							</tr>
						</tbody>
					</table>
				`,
			);
		}

		render(
			page.structure.setup_content,
			html`
				<p>${tl(trans.music_explain)}</p>
				<div class="settings">
					<div class="inner-preview pad" ref=${(
						el,
					) => (preview = el)} />
					<div class="setting-group">
				        ${(track_layout = setting({
					id: 'track_layout',
					func: () => {
						expand_tracks.compat();
						track_album_name_location.compat();
						render_track_preview();
					},
				}))}
				        ${(expand_tracks = setting({
					id: 'expand_tracks',
					func: () => {
						render_track_preview();
					},
				}))}
				        ${(track_album_name_location = setting({
					id: 'track_album_name_location',
					func: () => {
						render_track_preview();
					},
				}))}
				    </div>
				</div>
			`,
		);
		render(
			page.structure.setup_footer,
			html`
				<button class="see-more cancel left-icon" onclick=${() =>
					setup_music()}>
				    ${tl(trans.back)}
				</button>
				<div class="fill"></div>
				<button class="btn primary continue" onclick=${() =>
					setup_end()}>
				    ${tl(trans.next)}${show_page_count()}
				</button>
			`,
		);

		render_track_preview();
	}, page.state.trans);
}

function setup_end() {
	page.state.setup_page = 6;

	const katelyn = sponsor_list.related.special[0] || 'dressupdarlin3434g';

	page.structure.setup.setAttribute('data-page', 'end');
	page.structure.setup.setAttribute('data-animating', 'true');
	setTimeout(() => {
		page.structure.setup.setAttribute('data-animating', 'false');
		render(
			page.structure.setup_content,
			html`
				<p>${{
					html: tl(trans.setup_end, {
						a: `<a href="${root}bleh">`,
						'/a': '</a>',
						b: version.brand,
					}),
				}}</p>
				<div class="mini-list">
					<a class="btn mini" href="https://discord.gg/${discord}" target="_blank">
						<div class="mini-icon colourful" data-type="discord">
							<div class="bleh-icon" />
						</div>
						<div class="mini-info">
							<h5>${tl(trans.join_discord)}</h5>
						</div>
						<div class="bleh-icon mini-arrow" style="--icon: var(--mask)"
							data-type="arrow-right" />
					</a>
					<button class="btn mini" onclick=${() => sponsor()}>
						<div class="mini-icon colourful" data-type="sponsor">
							<div class="bleh-icon" />
						</div>
						<div class="mini-info">
							<h5>${tl(trans.sponsor)}</h5>
						</div>
						<div class="bleh-icon mini-arrow" style="--icon: var(--mask)"
							data-type="arrow-right" />
					</button>
					<a class="btn mini" href="${root}user/${katelyn}" target="_blank">
						<div class="mini-icon colourful" data-type="follow">
							<div class="bleh-icon" />
						</div>
						<div class="mini-info">
							<h5>${{
								html: tl(trans.follow_user, {
									u: `<a class="mention">@${katelyn}</a>`,
								}),
							}}</h5>
						</div>
						<div class="bleh-icon mini-arrow" style="--icon: var(--mask)"
							data-type="arrow-right" />
					</a>
				</div>
			`,
		);

		if (auth.name) {
			render(
				page.structure.setup_footer,
				html`
					<button class="see-more cancel left-icon" onclick=${() =>
						setup_layout()}>
					    ${tl(trans.back)}
					</button>
					<div class="fill"></div>
					<a class="btn primary continue" href="${root}user/${auth
						.name}">
					    ${tl(trans.finish)}${show_page_count()}
					</a>
				`,
			);
		} else {
			render(
				page.structure.setup_footer,
				html`
					<button class="see-more cancel left-icon" onclick=${() =>
						setup_layout()}>
					    ${tl(trans.back)}
					</button>
					<div class="fill"></div>
					<a class="btn primary continue" href="${root}dashboard">
					    ${tl(trans.finish)}
					</a>
				`,
			);
		}
	}, page.state.trans);
}
