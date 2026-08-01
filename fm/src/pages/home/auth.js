//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { auth, page, root } from '@/build/page';
import { register_background, update_page } from '@/page';
import { log } from '@/build/log.js';
import { checkup_page_structure } from '@/components/page/structure.js';
import { html, render } from 'lighterhtml';
import { tl, trans } from '@/build/trans';
import { load_profile_cache_externally } from '@/pages/profile/profile';
import { set_storage } from '@/build/tools';
import { avatar } from '@/components/shared/avatar';

export async function bleh_auth() {
	page.structure.container = document.body.querySelector('.page-content');
	try {
		page.structure.row = page.structure.container.querySelector('.row');
		page.structure.main = page.structure.row.querySelector('.col-main');
		page.structure.side = page.structure.row.querySelector('.col-sidebar');
	} catch (e) {
		log('unable to find elements', 'page structure');
	}

	checkup_page_structure();

	const cache = await load_profile_cache_externally(auth.name);
	if (cache.banner) register_background(cache.banner);
	else if (!auth.avatar.endsWith('818148bf682d429dc215c1705eb27b98.png')) {
		register_background(avatar(auth.avatar, 'ar0'));
	} else register_background(null);

	page.type = 'bleh_auth';
	page.subpage = '';

	log('status is', 'page', 'info', page);

	update_page();

	// remove error stuff cus we control this page
	page.structure.row.removeChild(page.structure.row.firstElementChild);
	page.structure.row.removeChild(page.structure.row.firstElementChild);

	page.structure.container.classList.add('has-cards-view');
	page.structure.content.classList.add('cards-view');

	if (!page.requested.token) {
		render(
			page.structure.main,
			html`
				<section class="api-connector sour">
					<div class="loading-data-container">
						<div class="loading-data-text error">
				            ${tl(trans.no_token_provided)}
				        </div>
					</div>
				</section>
			`,
		);
		return;
	}

	render(
		page.structure.main,
		html`
			<section class="api-connector sour">
				<div class="loading-data-container">
					<div class="loading-data-text">${tl(trans.loading)}</div>
				</div>
			</section>
		`,
	);

	const res = await fetch('https://jufufu.katelyn.moe/api/lastfm', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({
			method: 'auth.getSession',
			params: { token: page.requested.token },
		}),
	});

	const json = await res.json();
	if (json.error) {
		log('error', 'auth', 'error', json);

		render(
			page.structure.main,
			html`
				<section class="api-connector sour">
					<div class="loading-data-container">
						<div class="loading-data-text error">
				            ${json.message}
				        </div>
					</div>
				</section>
			`,
		);

		return;
	}

	const { name, key } = json.session;
	log(`authorised as ${name}`, 'auth', 'info', json.session);

	set_storage('bleh_auth', key);
	set_storage('bleh_auth_valid', 'true');

	render(
		page.structure.main,
		html`
			<section class="api-connector sour">
				<div class="avatar">
					<img
						src="${avatar(auth.avatar, 'avatar170s')}"
						alt="${tl(trans.your_avatar)}"
					/>
				</div>
				<div class="info">
					<h1>bleh</h1>
					<div class="sub-text no-margin">
			            ${tl(trans.has_been_connected)}
			        </div>
				</div>
				<div class="sep"></div>
				<div class="description">
			        ${tl(trans.you_can_now_close_this_tab)}
			    </div>
				<div class="connector-footer">
					<div class="btn-fill" />
					<a class="btn primary continue" href="${root}bleh">
			            ${tl(trans.continue)}
			        </a>
					<div class="btn-fill" />
				</div>
			</section>
		`,
	);
}
