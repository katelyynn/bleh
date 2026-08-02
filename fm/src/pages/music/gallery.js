//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { expand_avatar } from '@/components/shared/avatar';
import { log } from '@/build/log';
import { page, root } from '@/build/page';
import { tl, trans } from '@/build/trans';
import { register_menu } from '@/components/menu';
import { ff } from '@/components/settings/sku';
import { html, render } from 'lighterhtml';
import { share } from '@/components/dialog/share';
import tippy from 'tippy.js';
import {
	correct_artist,
	correct_item_by_artist,
} from '@/components/music/lotus';
import { set_storage } from '@/build/tools';

export function bleh_gallery() {
	if (page.subpage != 'image') return;

	log('focusing on image', 'gallery');

	gallery_arrows();

	let image_sidebar = page.structure.side.querySelector(
		'.js-gallery-image-details > div',
	);
	if (!image_sidebar) return;

	if (image_sidebar.hasAttribute('data-bleh-gallery')) return;
	image_sidebar.setAttribute('data-bleh-gallery', 'true');

	// move image to its own spot above
	let image_details;
	let gallery_section;
	let first = false;
	try {
		gallery_section = page.structure.main.querySelector('.gallery-section');
		if (gallery_section) {
			first = true;

			if (ff('short')) {
				page.structure.row.insertBefore(
					gallery_section,
					page.structure.content,
				);
			} else page.structure.nav.after(gallery_section);

			// move image details to main column
			image_details = html.node`
                <section class="image-details" />
            `;
		} else {
			image_details = page.structure.main.querySelector('.image-details');
			image_details.innerHTML = '';
		}
	} catch (e) {
		gallery_section = page.structure.container.querySelector(
			'.gallery-section',
		);

		image_details = page.structure.main.querySelector('.image-details');
		image_details.innerHTML = '';
	}
	image_details.appendChild(image_sidebar);

	// top title
	const image_title = image_details.querySelector('.gallery-image-title');
	const image_date = image_details.querySelector(
		'.gallery-image-uploaded-by',
	);

	if (image_title.textContent.trim() == '') {
		image_title.classList.add('gallery-image-title-empty');
		image_title.textContent = tl(trans.no_title);
	}

	const breadcrumbs = document.body.querySelector('.content-top-lower-row');
	const breadcrumb_root = breadcrumbs.querySelector('a');
	const breadcrumb_name = breadcrumbs.querySelector('.subpage-title');

	const image_title_container = document.createElement('div');
	image_title_container.classList.add('image-title-container');
	image_title_container.innerHTML = `
        <div class="sub-text">
            <div class="breadcrumb">
                ${breadcrumb_root.outerHTML}
                <div class="breadcrumb-name">
                    ${breadcrumb_name.textContent}
                </div>
            </div>
            ${image_date.outerHTML}
        </div>
        <div class="title-layer">
            ${image_title.outerHTML}
        </div>
    `;

	image_details.insertBefore(image_title_container, image_sidebar);
	breadcrumbs.style.setProperty('display', 'none');

	page.structure.main.insertBefore(
		image_details,
		page.structure.main.firstElementChild,
	);

	let description = image_details.querySelector('.gallery-image-description');
	if (!description) {
		description = document.createElement('p');
		description.classList.add(
			'gallery-image-description',
			'gallery-image-description-empty',
		);
		description.textContent = tl(trans.no_description);

		image_details
			.querySelector('[data-image-url]')
			.appendChild(description);
	}

	const buttons = image_details.querySelector('.gallery-image-buttons');

	buttons.querySelectorAll('button').forEach((btn) => {
		btn.classList.add('btn', 'colourful', 'gallery-btn');
		btn.removeAttribute('title');
	});

	// button container, to split into two
	const button_container = document.createElement('div');
	button_container.classList.add('button-container-wrapper');

	button_container.appendChild(buttons);

	// divider after vote btns
	const vote_buttons = buttons.querySelector('.gallery-image-vote-buttons');

	vote_buttons.after(create_divider());

	const vote_button_container = html.node`
        <div class="vote-button-container">
            ${vote_buttons}
        </div>
    `;
	buttons.insertBefore(vote_button_container, buttons.firstChild);

	// determine current vote number
	const positive_btn = vote_buttons
		.querySelector(
			':is([data-ajax-form-state=""] .gallery-image-vote-up-off, [data-ajax-form-state="up-voted"] .gallery-image-vote-up-on, [data-ajax-form-state="down-voted"] .gallery-image-vote-up-off)',
		)
		.cloneNode(true);
	const negative_btn = vote_buttons
		.querySelector(
			':is([data-ajax-form-state=""] .gallery-image-vote-down-off, [data-ajax-form-state="up-voted"] .gallery-image-vote-down-off, [data-ajax-form-state="down-voted"] .gallery-image-vote-down-on)',
		)
		.cloneNode(true);

	const positive = parseInt(
		positive_btn
			.querySelector('.gallery-image-votes')
			.lastChild.textContent.trim(),
	);
	const negative = parseInt(
		negative_btn
			.querySelector('.gallery-image-votes')
			.lastChild.textContent.trim(),
	);

	const number = positive + negative;
	const is_negative = (positive - negative) < 0;

	const upvote_percent = Math.round(positive / number * 100);
	const downvote_percent = Math.round(negative / number * 100);

	const vote_bar = html.node`
        <div class="vote-bar">
            <div class="vote-bar-fill colourful upvoted ${
		!is_negative ? 'primary-bar' : ''
	}" style="width: ${upvote_percent}%" />
            <div class="vote-bar-fill colourful downvoted ${
		is_negative ? 'primary-bar' : ''
	}" style="width: ${downvote_percent}%" />
        </div>
    `;
	vote_button_container.appendChild(vote_bar);

	vote_bar.after(html.node`
        <label class="vote-bar-number colourful ${
		is_negative ? 'downvoted' : 'upvoted'
	}">${is_negative ? '' : '+'}${positive - negative}</label>
    `);

	// 2nd side
	let buttons_extra = document.createElement('div');
	buttons_extra.classList.add(
		'gallery-image-buttons',
		'gallery-image-buttons-extra',
	);

	button_container.appendChild(buttons_extra);

	image_details.appendChild(button_container);

	// open in a new tab button
	const open_button = html.node`
        <button class="btn image-open-button icon gallery-btn gallery-btn-bland" onclick=${() =>
		expand_gallery_image()}>
            ${tl(trans.expand)}
        </button>
    `;
	tippy(open_button, {
		content: tl(trans.expand_to_full_resolution),
	});

	buttons_extra.appendChild(open_button);

	// share button
	const share_button = html.node`
        <button class="btn image-share-button icon gallery-btn gallery-btn-bland" onclick=${() =>
		share(window.location.href)}>
            ${tl(trans.share)}
        </button>
    `;

	buttons_extra.appendChild(share_button);
	share_button.after(create_divider());

	// delete
	const delete_button = image_details.querySelector('.gallery-image-delete');
	if (delete_button) {
		delete_button.querySelector('button').classList =
			'btn icon colourful gallery-btn';
		buttons_extra.appendChild(delete_button);
	}

	// report
	const report_form = image_details.querySelector(
		'.gallery-image-report-form',
	);

	const report = report_form.querySelector('button');
	report.classList.add('btn', 'icon', 'colourful', 'gallery-btn');
	tippy(report, {
		content: report.textContent,
	});
	report.textContent = tl(trans.report);

	const reported = report_form.querySelector(
		'.gallery-image-report--reported',
	);
	reported.classList.add('btn', 'icon', 'colourful', 'gallery-btn');

	buttons_extra.appendChild(report_form);

	// star
	const star_buttons = image_details.querySelectorAll(
		'.gallery-image-preferred-button :is(button, a)',
	);
	star_buttons.forEach((star_button) => {
		star_button.classList.add('btn');
		star_button.removeAttribute('title');

		const text = star_button.querySelector(
			'.gallery-image-preferred-states',
		);

		/*tippy(star_button, {
            content: star_button.textContent
        });*/
		text.textContent = tl(trans.star);
	});

	// view all artwork
	const view_all_container = page.structure.main.querySelector(
		'.more-link-fullwidth-right-flush-top',
	);
	if (view_all_container) {
		const side_actions = html.node`
            <section class="side-actions" />
        `;

		const view_all = view_all_container.querySelector('a');
		view_all.classList.add('btn', 'side-action', 'icon-mask');
		view_all.setAttribute('data-type', 'gallery');

		side_actions.appendChild(view_all);

		page.structure.main.removeChild(view_all_container);

		// saved button
		if (page.type == 'artist' || ff('display_album_bookmark')) {
			const view_saved = document.createElement('a');
			view_saved.classList.add('btn', 'side-action', 'icon-mask');
			view_saved.setAttribute(
				'href',
				`${view_all.getAttribute('href')}?tab=saved`,
			);
			view_saved.setAttribute('data-type', 'gallery-saved');
			view_saved.textContent = tl(trans.view_saved);

			side_actions.appendChild(view_saved);
		}

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

	// bookmark-related info
	if (page.type == 'artist' || ff('display_album_bookmark')) {
		patch_gallery_focused_image(image_sidebar, buttons);
	}
}

function gallery_arrows() {
	const container = page.structure.row.querySelector(
		'.gallery-image-container',
	);
	const next = container.querySelector('.gallery-next');
	const prev = container.querySelector('.gallery-previous');

	render(
		next,
		html`
			<button class="btn gallery-pagination icon-r" data-type="next">
			    ${tl(trans.next)}
			</button>
		`,
	);
	render(
		prev,
		html`
			<button class="btn gallery-pagination icon" data-type="prev">
			    ${tl(trans.prev)}
			</button>
		`,
	);
}

function expand_gallery_image() {
	const image_src = page.structure.container
		.querySelector('.active-slide .js-gallery-image')
		.getAttribute('src')
		.replace('770x0', 'ar0');
	expand_avatar(image_src);
}

export function create_divider() {
	const divider = document.createElement('div');
	divider.classList.add('listen-divider');

	return divider;
}

export function bleh_gallery_upload() {
	// remove content top
	const content_top = document.body.querySelector('.page-content');
	content_top.innerHTML = '';

	if (!ff('mesmerizer')) {
		page.structure.row.insertBefore(
			html.node`
            <section class="gallery-section gallery--initialised">
                <div class="gallery-image-container">
                    <div class="gallery-slides">
                        <div class="gallery-image gallery-slide image-preview active-slide">
                            <img class="image-preview-hook" ref=${(
				el,
			) => (page.state.image_preview = el)} />
                        </div>
                    </div>
                </div>
            </section>
        `,
			page.structure.row.firstElementChild,
		);

		// apply card style to form
		const form = page.structure.main.querySelector('.form-horizontal');
		form.classList.add('panel-form');

		// upload rules
		const upload_rules_group = form.querySelector(
			'.form-group--description + .form-group',
		);
		const rules = upload_rules_group.querySelector('.gallery-upload-rules');

		const rules_panel = document.createElement('section');
		rules_panel.classList.add('rules-panel');
		rules_panel.innerHTML = rules.innerHTML;

		page.structure.side.appendChild(rules_panel);

		form.removeChild(upload_rules_group);

		return;
	}

	const form = page.structure.main.querySelector(':scope > form');

	// upload rules
	const upload_rules_group = form.querySelector(
		'.form-group--description + .form-group',
	);
	const rules = upload_rules_group.querySelector('.gallery-upload-rules');

	page.structure.side.appendChild(html.node`
        <section class="rules-panel">
            ${{ html: rules.innerHTML }}
        </section>
    `);
	form.removeChild(upload_rules_group);

	const token = form.querySelector(':scope > [name="csrfmiddlewaretoken"]');

	const title = form.querySelector('[name="title"]');
	const description = form.querySelector('[name="description"]');
	const alert = form.querySelector('.alert');

	const file_input = form.querySelector('input[type="file"]');

	const formats = form.querySelector('.form-row-help-text');

	if (page.type == 'artist') {
		title.value = correct_artist(page.name);
	} else {
		title.value = correct_item_by_artist(page.name, page.sister);
	}

	const panel = html.node`
        <section class="gallery-upload-panel bleh--panel">
            <h4>${tl(trans.image_details)}</h4>
            ${alert}
            <form method="post" action=${form.getAttribute('action')} enctype=${
		form.getAttribute('enctype')
	}>
                ${token}
                <div class="hidden-file-input">
                    ${file_input}
                </div>
                <div class="setting-group">
                    <div class="setting" data-type="text">
                        <div class="heading">
                            <h5>${tl(trans.title)}</h5>
                        </div>
                        <div class="input-container content-form wide">
                            ${title}
                        </div>
                    </div>
                    <div class="setting" data-type="text">
                        <div class="heading">
                            <h5>${tl(trans.description)}</h5>
                        </div>
                        <div class="input-container content-form textarea">
                            ${description}
                        </div>
                    </div>
                </div>
                <div class="settings-footer end">
                    <button class="btn primary icon" data-type="upload" type="submit">
                        ${tl(trans.upload)}
                    </button>
                </div>
            </form>
        </section>
    `;

	page.structure.main.appendChild(panel);

	let dropzone;
	let container;

	page.structure.row.insertBefore(
		html.node`
        <section class="gallery-section gallery--initialised">
            <div class="dropzone" ref=${(
			el,
		) => (dropzone = el)} onclick=${() => {
			file_input.click();
		}}>
                <div class="dropzone-message">${tl(trans.dropzone)}</div>
                <div class="card-tip">${formats.textContent}</div>
            </div>
            <div class="gallery-image-container" ref=${(
			el,
		) => (container = el)}>
                <div class="gallery-slides">
                    <div class="gallery-image gallery-slide image-preview active-slide">
                        <img class="image-preview-hook" ref=${(
			el,
		) => (page.state.image_preview = el)} />
                    </div>
                </div>
            </div>
        </section>
    `,
		page.structure.row.firstElementChild,
	);

	['dragenter', 'dragover'].forEach((type) => {
		dropzone.addEventListener(type, (e) => {
			e.preventDefault();
			e.stopPropagation();

			container.setAttribute('data-dragging', true);
			dropzone.setAttribute('data-dragging', true);
		});
	});

	['dragleave', 'drop'].forEach((type) => {
		dropzone.addEventListener(type, (e) => {
			e.preventDefault();
			e.stopPropagation();

			container.setAttribute('data-dragging', false);
			dropzone.setAttribute('data-dragging', false);
		});
	});

	dropzone.addEventListener('drop', (e) => {
		const files = e.dataTransfer.files;
		if (files.length) file_input.files = files;

		file_input.dispatchEvent(new Event('change'));
	});

	file_input.addEventListener('change', () => {
		log('file input changed', 'gallery', 'info', {
			files: file_input.files,
		});
		if (!file_input.files.length) return;

		const file = file_input.files[0];
		const reader = new FileReader();

		dropzone.setAttribute('data-has-file', true);

		reader.onload = (event) => {
			page.state.image_preview.src = event.target.result;
		};

		reader.readAsDataURL(file);
	});

	form.style.setProperty('display', 'none');
}

export function bleh_gallery_upload_check() {
	if (page.subpage != 'images_image-upload' || !page.state.image_preview) {
		return;
	}

	if (ff('mesmerizer')) {
		const artwork_finder = page.structure.main.querySelector(
			'#lfmmaf-widget:not([data-bleh])',
		);

		if (artwork_finder) {
			artwork_finder.setAttribute('data-bleh', true);

			const group = page.structure.main.querySelector('.setting-group');
			const controls = artwork_finder.querySelectorAll(
				'.form-group-controls > *',
			);

			let info;

			group.insertBefore(
				html.node`
                <div class="setting" data-type="info">
                    <div class="heading">
                        <h5>${{
					html: artwork_finder.querySelector('label').innerHTML,
				}}</h5>
                    </div>
                    <div class="info artwork-finder-info" ref=${(
					el,
				) => (info = el)} />
                </div>
            `,
				group.firstElementChild,
			);

			controls.forEach((control) => {
				info.appendChild(control);
			});
		}

		return;
	}

	// update image preview
	const image_preview = page.structure.main.querySelector(
		'.form-image-preview',
	);
	if (!image_preview) return;

	page.state.image_preview.setAttribute(
		'src',
		image_preview.getAttribute('src'),
	);
}

export function bleh_gallery_list() {
	const upload_btn = page.structure.main.querySelector('.btn-add');
	if (upload_btn) {
		upload_btn.classList = 'btn view-all-button back upload-button';

		const upload_panel = document.createElement('section');
		upload_panel.classList.add('view-all-panel', 'upload-panel');

		upload_panel.appendChild(upload_btn);
		page.structure.side.insertBefore(
			upload_panel,
			page.structure.side.firstElementChild,
		);
	}

	page.structure.main.classList.add('bleh--gallery');

	if (page.type == 'artist') patch_gallery_image_listing();
}

// gallery main page
function patch_gallery_image_listing() {
	const bookmarked_images =
		JSON.parse(localStorage.getItem('bleh_bookmarked_images')) || {};

	if (page.requested.tab != 'saved' || page.requested.page != null) {
		page.structure.container.setAttribute('data-bleh--gallery-tab', 'all');
	} else {
		page.structure.container.setAttribute(
			'data-bleh--gallery-tab',
			'saved',
		);
	}

	// create nav
	const nav = html.node`
        <div class="toolbar">
            <nav class="navlist secondary-nav navlist--more redesigned-navigation">
                <ul class="navlist-items">
                    <li class="navlist-item secondary-nav-item secondary-nav-item--gallery-overview">
                        <a class="secondary-nav-item-link" onclick=${() =>
		gallery_tab('all')}>
                            ${tl(trans.photos)}
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--gallery-bookmarks">
                        <a class="secondary-nav-item-link" onclick=${() =>
		gallery_tab('saved')}>
                            ${tl(trans.saved)}
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    `;

	page.structure.row.insertBefore(nav, page.structure.content);

	// content
	let bookmarks_panel;
	page.structure.main.after(html.node`
        <div class="col-main bleh--bookmarks not-a-panel">
            <section class="bookmarks-panel" ref=${(
		el,
	) => (bookmarks_panel = el)}>
                <ul class="image-list" data-kate-processed="true"></ul>
            </section>
        </div>
    `);

	// append images
	if (bookmarked_images.hasOwnProperty(page.name)) {
		bookmarked_images[page.name].forEach((image) => {
			const image_element = document.createElement('li');
			image_element.classList.add('image-list-item-wrapper');
			image_element.setAttribute('data-image-id', image);
			image_element.innerHTML = `
                <a class="image-list-item" href="${root}music/+noredirect/${page.name}/+images/${image}">
                    <img src="https://lastfm.freetls.fastly.net/i/u/avatar170s/${image}" alt=${image} loading="lazy">
                </a>
            `;

			page.structure.container
				.querySelector('.bookmarks-panel .image-list')
				.appendChild(image_element);

			if (ff('remove_bookmark')) {
				const menu = tippy(image_element, {
					theme: 'context-menu',
					content: html.node`
                        <button class="dropdown-menu-clickable-item" onclick=${() =>
						update_image_bookmark(
							image_element,
							image,
							false,
						)} data-menu-item="remove-bookmark" data-bleh--image-is-bookmarked="true">
                            ${tl(trans.remove_save)}
                        </button>
                    `,
					placement: 'right-start',
					trigger: 'manual',
					interactive: true,
					interactiveBorder: 10,
					offset: [0, 0],

					onShow(instance) {
						instance.popper.addEventListener('click', (event) => {
							instance.hide();
						});
					},
				});

				register_menu(image_element, menu);
			}
		});

		// mark images as bookmarked
		const image_list = page.structure.main.querySelectorAll(
			'.image-list-item',
		);
		image_list.forEach((image_list_item) => {
			const image_id_split = image_list_item
				.getAttribute('href')
				.split('/');
			const image_id_length = image_id_split.length;
			const image_id = image_id_split[image_id_length - 1];

			if (bookmarked_images[page.name].includes(image_id)) {
				image_list_item.classList.add('image-list-item-bookmarked');
			}
		});
	} else {
		render(
			bookmarks_panel,
			html`
				<div class="loading-data-container">
					<div class="loading-data-text failed">
				        ${tl(trans.no_images_saved)}
				    </div>
				</div>
			`,
		);
	}
}

function gallery_tab(id) {
	page.structure.container.setAttribute('data-bleh--gallery-tab', id);

	// remove ?tab=saved
	/*if (page.requested.tab == 'saved') {
        let params = new URLSearchParams(document.location.search);
        params.delete('tab');
        // https://stackoverflow.com/a/43440356
        // location.hash preserves #
        history.replaceState(null, '', '?' + params + location.hash);
    }*/
}

// gallery focused image
function patch_gallery_focused_image(
	focused_image_details,
	gallery_interactions,
) {
	const focused_image_id_split = focused_image_details
		.getAttribute('data-image-url')
		.split('/');
	const focused_image_id_length = focused_image_id_split.length - 1;

	const focused_image_id = focused_image_id_split[focused_image_id_length];

	const bookmarked_images =
		JSON.parse(localStorage.getItem('bleh_bookmarked_images')) || {};
	let image_is_bookmarked = false;
	if (bookmarked_images.hasOwnProperty(page.name)) {
		if (bookmarked_images[page.name].includes(focused_image_id)) {
			image_is_bookmarked = true;
			log('focused is bookmarked', 'gallery');
		}
	}

	// append a bookmark button
	const save_btn = html.node`
        <button class="btn bleh--gallery-bookmark-image-btn icon gallery-btn ${
		image_is_bookmarked ? 'primary' : ''
	}" onclick=${() => update_image_bookmark(save_btn, focused_image_id)}>
            ${tl(trans.save)}
        </button>
    `;

	gallery_interactions.appendChild(save_btn);
}

function update_image_bookmark(button, id) {
	const bookmarked_images =
		JSON.parse(localStorage.getItem('bleh_bookmarked_images')) || {};

	const is_bookmarked = button.classList.contains('primary');

	if (!bookmarked_images.hasOwnProperty(page.name)) {
		bookmarked_images[page.name] = [];
	}

	if (is_bookmarked) {
		// remove from bookmarks

		button.classList.remove('primary');

		const new_artist_bookmarks = [];
		for (const image in bookmarked_images[page.name]) {
			if (bookmarked_images[page.name][image] != id) {
				new_artist_bookmarks.push(bookmarked_images[page.name][image]);
			}
		}
		bookmarked_images[page.name] = new_artist_bookmarks;

		log(`image ${id} from ${page.name} removed from bookmarks`, 'gallery');
	} else {
		// add to bookmarks

		button.classList.add('primary');
		bookmarked_images[page.name].push(id);
		log(`image ${id} from ${page.name} added to bookmarks`, 'gallery');
	}

	set_storage('bleh_bookmarked_images', JSON.stringify(bookmarked_images));
}
