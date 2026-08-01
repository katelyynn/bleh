//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { log } from '@/build/log';
import { auth, page, root } from '@/build/page';
import { tl, trans } from '@/build/trans';
import { checkup_page_structure } from '@/components/page/structure';
import { register_background, update_page } from '@/page';
import { html, render } from 'lighterhtml';
import { load_profile_cache_externally } from '@/pages/profile/profile';
import { avatar } from '@/components/shared/avatar';

export async function bleh_api() {
	if (page.subpage == 'docs') return;

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
	log('status is', 'page', 'info', page);
	update_page();

	const cache = await load_profile_cache_externally(auth.name);
	if (cache.banner) {
		register_background(cache.banner);
	} else if (!auth.avatar.endsWith('818148bf682d429dc215c1705eb27b98.png')) {
		register_background(avatar(auth.avatar, 'ar0'));
	} else {
		register_background(null);
	}

	if (page.subpage == 'create_account') return;

	page.structure.container.classList.add('has-cards-view');
	page.structure.content.classList.add('cards-view');

	let success = page.structure.container.querySelector('.alert-success');

	if (!success) {
		let old = page.structure.main.querySelector('section');
		// token expired
		if (!old) return;

		page.name = old.querySelector('.api-app-name').textContent;
		let description = old.querySelector('.api-app-description').textContent
			.trim();

		let token =
			old.querySelector('form [name="csrfmiddlewaretoken"]').value;
		let cancel = old.querySelector('.form-submit a').getAttribute('href');

		render(
			page.structure.main,
			html`
				<section class="api-connector sour">
					<div class="avatar">
						<img src="${avatar(
							auth.avatar,
							'avatar170s',
						)}" alt="${tl(trans.your_avatar)}">
					</div>
					<div class="info">
						<h1>${page.name}</h1>
						<div class="sub-text no-margin">${tl(
							trans.app_would_like_to_connect,
						)}</div>
						<div class="subtle">
				            ${{
					html: tl(trans.logged_in_as, {
						user:
							`<a class="mention" href="${root}user/${auth.name}">@${auth.name}</a>`,
					}),
				}}
				        </div>
					</div>
					<div class="sep"></div>
					<div class="description">${description}</div>
					<div class="small-label with-icon" data-type="lock">${tl(
						trans.ensure_you_trust,
					)}</div>
					<div class="connector-footer">
						<a class="see-more cancel left-icon" href="${cancel}">
				            ${tl(trans.cancel)}
				        </a>
						<form method="post" data-no-partial-refresh="">
							<input type="hidden" name="csrfmiddlewaretoken" value="${token}">
							<input type="hidden" name="confirmation" value="confirm">
							<button class="btn primary icon" data-type="plus" type="submit"
								name="confirm">
				                ${tl(trans.connect)}
				            </button>
						</form>
					</div>
				</section>
			`,
		);
	} else {
		page.name = success.querySelector('strong').textContent;

		render(
			page.structure.main,
			html`
				<section class="api-connector sour">
					<div class="avatar">
						<img src="${avatar(
							auth.avatar,
							'avatar170s',
						)}" alt="${tl(trans.your_avatar)}">
					</div>
					<div class="info">
						<h1>${page.name}</h1>
						<div class="sub-text no-margin">${tl(
							trans.has_been_connected,
						)}</div>
					</div>
					<div class="sep"></div>
					<div class="description">${tl(
						trans.you_can_now_close_this_tab,
					)}</div>
					<div class="connector-footer">
						<div class="btn-fill" />
						<a class="see-more" href="${root}settings/applications">
				            ${tl(trans.manage_applications)}
				        </a>
						<div class="btn-fill" />
					</div>
				</section>
			`,
		);
	}
}
