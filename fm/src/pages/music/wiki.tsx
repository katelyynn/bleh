/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { patch_avatar } from '@/components/shared/avatar';
import { auth, page, root } from '@/build/page';
import { copy, desanitise, is_link_external } from '@/build/tools';
import { tl, trans } from '@/build/trans';
import { ff } from '@/components/settings/sku';
import { html } from 'lighterhtml';
import tippy from 'tippy.js';
import { settings } from '@/build/config';
import { ReactElement } from 'jsx-dom';
import { external_url_prompt } from '@/components/dialog/external_link.tsx';
import { SymbolPresets } from '@/pages/music/presets.tsx';

export function bleh_wiki() {
	// make a new panel
	let wiki_panel = document.createElement('section');
	wiki_panel.classList.add('wiki-panel');
	wiki_panel.innerHTML = page.structure.main.innerHTML;

	page.structure.main.innerHTML = '';
	page.structure.main.appendChild(wiki_panel);
	page.structure.main.classList.add('not-a-panel');

	let original_edit_button = page.structure.main.querySelector(
		'.qa-wiki-edit',
	);
	let original_version_history = page.structure.main.querySelector(
		'.wiki-history-link--desktop a',
	);

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

	if (original_edit_button) {
		let side_edit = document.createElement('a');
		side_edit.classList.add('btn', 'side-action', 'icon-mask');
		side_edit.setAttribute(
			'href',
			original_edit_button.getAttribute('href'),
		);
		side_edit.setAttribute('data-type', 'edit');
		side_edit.textContent = tl(trans.edit);
		side_actions.appendChild(side_edit);
	}

	if (original_version_history) {
		let side_history = document.createElement('a');
		side_history.classList.add('btn', 'side-action', 'icon-mask');
		side_history.setAttribute(
			'href',
			original_version_history.getAttribute('href'),
		);
		side_history.setAttribute('data-type', 'history');
		side_history.textContent = tl(trans.timeline);
		side_actions.appendChild(side_history);
	}

	// author
	let wiki_author = wiki_panel.querySelector('.wiki-author');
	// this cant be null i believe but still
	if (wiki_author) {
		let h2 = wiki_panel.querySelector('h2.text-18');

		let sub_text = document.createElement('div');
		sub_text.classList.add('sub-text', 'space-below', 'header-style');
		sub_text.innerHTML = `
            <div class="breadcrumb-origin prominent">
                ${
			h2
				? h2.innerHTML
				: page.structure.container.querySelector('.content-top-header')
					.textContent
		}
            </div>
            <div class="wiki-author-side">
                ${wiki_author.innerHTML}
            </div>
        `;

		wiki_panel.insertBefore(sub_text, wiki_panel.firstElementChild);
		if (h2) {
			wiki_panel.removeChild(h2);
		}
	}

	let wiki = wiki_panel.querySelector('.wiki');
	if (!wiki) return;

	patch_wiki_contents(wiki);

	let factbox = wiki_panel.querySelector('.factbox');
	if (factbox) {
		let facts = html.node`
            <section class="facts">
                ${factbox}
            </section>
        `;

		side_actions.after(facts);
	}
}

export function bleh_wiki_history() {
	let breadcrumb_root = page.structure.container.querySelector(
		'.subpage-breadcrumb',
	);
	let breadcrumb_name = page.structure.container.querySelector(
		'.subpage-title',
	);

	// tags
	if (!breadcrumb_root) {
		breadcrumb_root = page.structure.container.querySelector(
			'.content-top-back-link',
		);
		breadcrumb_name = page.structure.container.querySelector(
			'.content-top-header',
		);
	}

	let sub_text = document.createElement('div');
	sub_text.classList.add('sub-text', 'space-below', 'header-style');
	sub_text.innerHTML = `
        <div class="breadcrumb">
            ${breadcrumb_root.querySelector('a').outerHTML}
            <div class="breadcrumb-name prominent">
                ${breadcrumb_name.textContent}
            </div>
        </div>
    `;

	breadcrumb_root.style.setProperty('display', 'none');
	breadcrumb_name.style.setProperty('display', 'none');

	let buffer_container = page.structure.container.querySelector(
		'.row ~ .buffer-4',
	);

	// tags
	if (!buffer_container) {
		buffer_container = page.structure.container.querySelector(
			'.wiki-history',
		);
	}

	let wiki_history_table = buffer_container.querySelector(
		'.wiki-history-table',
	);

	// nav
	let pagination = buffer_container.querySelector('.pagination');

	// put this in col-main
	let wiki_panel = document.createElement('section');
	wiki_panel.classList.add('wiki-history-panel');

	wiki_panel.appendChild(sub_text);
	wiki_panel.appendChild(wiki_history_table);

	page.structure.main.appendChild(wiki_panel);
	buffer_container.style.setProperty('display', 'none');

	if (pagination) {
		wiki_panel.appendChild(pagination);
	}

	// latest
	let side_actions = html.node`
        <section class="side-actions">
            <a class="btn side-action icon-mask" data-type="latest-wiki" href="${
		sub_text.querySelector('a').getAttribute('href')
	}">
                ${tl(trans.view_latest)}
            </a>
        </section>
    `;

	if (!page.mobile) {
		page.structure.side.appendChild(side_actions);
	} else {
		page.structure.main.appendChild(side_actions);
	}

	// entries
	let entries = page.structure.main.querySelectorAll('.wiki-history-entry');
	entries.forEach((entry) => {
		let author = entry.querySelector('.wiki-history-author');
		let avatar = author.querySelector('.wiki-history-author-avatar');
		let name = author.querySelector('.link-block-target');

		if (name && avatar) {
			let badge = patch_avatar(avatar, name.textContent, 'wiki');

			if (badge && badge.type) {
				if (badge.hue > -1 && badge.sat > -1 && badge.lit > -1) {
					name.style.setProperty('--hue-over', badge.hue);
					name.style.setProperty('--sat-over', badge.sat);
					name.style.setProperty('--lit-over', badge.lit);
				} else {
					name.classList.add(
						`user-status--bleh-${badge.type}`,
						`user-status--bleh-user-${badge.user}`,
					);
				}
			} else if (badge) {
				name.classList.add(badge.type);
			}
		}
	});
}

export function bleh_wiki_editor() {
	const editor = page.structure.main.querySelector('.wiki-edit-container');
	if (editor) {
		const form = editor.querySelector(':scope > form');

		const body = form?.querySelector('#id_body');
		body?.classList.add('wiki-editor-body');
	}

	// make a new panel
	let wiki_edit_panel = document.createElement('section');
	wiki_edit_panel.classList.add('wiki-edit-panel');
	wiki_edit_panel.innerHTML = page.structure.main.innerHTML;

	page.structure.main.innerHTML = '';
	page.structure.main.appendChild(wiki_edit_panel);
	page.structure.main.classList.add('not-a-panel');

	let breadcrumb_root = page.structure.container.querySelector(
		'.subpage-breadcrumb',
	);
	let breadcrumb_name = page.structure.container.querySelector(
		'.subpage-title',
	);

	// probably moved to a content-top by bleh prior
	if (!breadcrumb_name) {
		breadcrumb_name = page.structure.content_top.querySelector(
			'.content-top-header',
		);

		if (breadcrumb_name) {
			page.structure.content_top.style.setProperty('display', 'none');
		}
	}

	// tags
	if (!breadcrumb_root) {
		breadcrumb_root = page.structure.container.querySelector(
			'.content-top-back-link',
		);
		breadcrumb_name = page.structure.container.querySelector(
			'.content-top-header',
		);
	}

	let sub_text = document.createElement('div');
	sub_text.classList.add('sub-text', 'space-below', 'header-style');
	sub_text.innerHTML = `
        <div class="breadcrumb">
            ${breadcrumb_root.querySelector('a').outerHTML}
            <div class="breadcrumb-name prominent">
                ${breadcrumb_name.textContent}
            </div>
        </div>
    `;

	breadcrumb_root.style.setProperty('display', 'none');
	breadcrumb_name.style.setProperty('display', 'none');

	wiki_edit_panel.insertBefore(sub_text, wiki_edit_panel.firstElementChild);

	page.structure.side.innerHTML = '';

	// latest
	const side_actions = html.node`
        <section class="side-actions">
            <a class="btn side-action icon-mask" data-type="latest-wiki" href="${
		sub_text.querySelector('a').getAttribute('href')
	}">
                ${tl(trans.view_latest)}
            </a>
        </section>
    `;

	if (!page.mobile) {
		page.structure.side.appendChild(side_actions);
	} else {
		page.structure.main.appendChild(side_actions);
	}

	// presets
	page.structure.side!.appendChild(
		<SymbolPresets />,
	);

	page.structure.side.appendChild(html.node`
        <section class="wiki-syntax-panel bleh--blank-panel">
            <h3 class="text-18">${tl(trans.fancy_syntax)}</h3>
            <div class="syntax-listing">
                <div class="syntax-listing-item">
                    <div class="code-side">[artist]julie[/artist]</div>
                    <div class="detail-side">${{
		html: tl(trans.links_to).replace(
			'{link}',
			`<a href="${root}music/julie" data-link-type="artist" target="_blank">julie</a>`,
		),
	}}</div>
                </div>
                <div class="syntax-listing-item">
                    <div class="code-side">[album artist=julie]pushing daisies[/album]</div>
                    <div class="detail-side">${{
		html: tl(trans.links_to).replace(
			'{link}',
			`<a href="${root}music/julie/pushing+daisies" data-link-type="album" target="_blank">pushing daisies</a>`,
		),
	}}</div>
                </div>
                <div class="syntax-listing-item">
                    <div class="code-side">[track artist=julie]very little effort[/track]</div>
                    <div class="detail-side">${{
		html: tl(trans.links_to).replace(
			'{link}',
			`<a href="${root}music/julie/_/very+little+effort" data-link-type="track" target="_blank">very little effort</a>`,
		),
	}}</div>
                </div>
            </div>
            <div class="sep"></div>
            <div class="syntax-listing">
                <div class="syntax-listing-item">
                    <div class="code-side">[url]https://katelyn.moe/bleh[/url]</div>
                    <div class="detail-side">${{
		html: tl(trans.links_to).replace(
			'{link}',
			`<a href="https://katelyn.moe/bleh" target="_blank">https://katelyn.moe/bleh</a>`,
		),
	}}</div>
                </div>
                <div class="syntax-listing-item">
                    <div class="code-side">[url=https://katelyn.moe/bleh]blehhh[/url]</div>
                    <div class="detail-side">${{
		html: tl(trans.links_to).replace(
			'{link}',
			`<a href="https://katelyn.moe/bleh" target="_blank">blehhh</a>`,
		),
	}}</div>
                </div>
            </div>
            <div class="sep"></div>
            <div class="syntax-listing">
                <div class="syntax-listing-item">
                    <div class="code-side">[tag]grunge[/tag]</div>
                    <div class="detail-side">${{
		html: tl(trans.links_to).replace(
			'{link}',
			`<a href="${root}tag/grunge" data-link-type="tag" target="_blank">grunge</a>`,
		),
	}}</div>
                </div>
                <div class="syntax-listing-item">
                    <div class="code-side">[user]${auth.name}[/user]</div>
                    <div class="detail-side">${{
		html: tl(trans.links_to).replace(
			'{link}',
			`<a class="mention" href="${root}user/${auth.name}" target="_blank">@${auth.name}</a>`,
		),
	}}</div>
                </div>
            </div>
        </section>
    `);

	// rules
	let rules = page.structure.main.querySelector('.wiki-style-rules');
	rules.removeAttribute('id');

	let rules_panel = document.createElement('section');
	rules_panel.classList.add('rules-panel');
	rules_panel.setAttribute('id', 'stylerules');
	rules_panel.innerHTML = rules.innerHTML;

	page.structure.side.appendChild(rules_panel);
}

// fix wiki on some devices
export function patch_wiki() {
	// add info notes to things
	if (ff('show_wiki_label')) {
		let wiki_col = page.structure.main.querySelector('.wiki-column');
		let wiki_empty = false;

		if (!wiki_col) {
			wiki_col = page.structure.main.querySelector('.wiki-section');
		}
		if (!wiki_col) return;

		let wiki_block = wiki_col.querySelector(
			'.wiki-block.visible-lg .wiki-block-inner-2',
		);

		if (!wiki_block) {
			wiki_block = wiki_col.querySelector('.wiki-block-cta');
			wiki_empty = true;
		}

		let read_more = wiki_block.querySelector('a:last-child');
		if (read_more) {
			read_more.classList.add('read-more', 'icon');
			read_more.textContent = tl(trans.read_more).toLowerCase();
		}

		wiki_col.appendChild(html.node`
            <div class="sub-text wiki-sub-text">
                <span class="right-links">
                    <p><a class="wiki-edit-small icon" href="${document.location.href}/+wiki/edit">${
			tl(trans.edit_wiki).toLowerCase()
		}</a></p>
                    ${
			(!wiki_empty && read_more) ? html.node`<p>${read_more}</p>` : ''
		}
                </span>
            </div>
        `);

		if (!wiki_empty) {
			patch_wiki_contents(wiki_block);
		}
	}
}

export function can_trust_link(href) {
	const url = new URL(href);
	const scheme = url.protocol;
	const hostname = url.hostname;

	let dangerous = false;

	if (!scheme || !scheme.startsWith('http')) dangerous = true;

	if (settings.trusted_sites.includes(hostname)) {
		return { trusted: true, dangerous };
	}

	return { trusted: false, dangerous };
}

export function patch_wiki_contents(wiki_block: ReactElement) {
	const links = wiki_block.querySelectorAll('a');
	links.forEach((link) => {
		let href = link.getAttribute('href');
		if (!href) return;

		let type;
		let name = link.textContent.trim();
		let sister;

		if (!href.startsWith(root)) {
			if (href && is_link_external(href)) {
				const url = new URL(href);
				const scheme = url.protocol;
				const hostname = url.hostname;
				const path = url.pathname + url.search + url.hash;

				let dangerous = false;

				if (!scheme || !scheme.startsWith('http')) dangerous = true;

				link.addEventListener('click', (e) => {
					if (settings.trusted_sites.includes(hostname)) return;

					e.preventDefault();

					external_url_prompt(href, dangerous);
				});

				if (link.textContent != href) {
					tippy(link, {
						theme: 'name-sister-combo',
						content: html.node`
                            <span class="name">
                                <span class="link">
                                    ${
							scheme != 'https:'
								? html.node`
                                    <span class="scheme">
                                        ${scheme}//
                                    </span>
                                    `
								: ''
						}
                                    ${
							hostname
								? html.node`
                                    <span class="hostname">
                                        ${hostname}
                                    </span>
                                    `
								: html.node`
                                    <span class="hostname">
                                        ${path}
                                    </span>
                                    `
						}
                                    ${
							path != '/' && hostname
								? html.node`
                                    <span class="path">
                                        ${path}
                                    </span>
                                    `
								: ''
						}
                                </span>
                            </span>
                            <span class="sister">${tl(trans.external)}</span>
                        `,
					});
				}

				return;
			}
		}

		if (href.endsWith('/+wiki')) return;

		href = href.replace(root, '').replace('music/+noredirect/', 'music/')
			.replace('music/', '');

		if (href.startsWith('user/')) return;

		if (href.startsWith('tag/')) {
			type = 'tag';
		} else {
			let split = href.split('/');
			//console.info(href, split.length);

			if (split.length == 1) {
				type = 'artist';
			} else if (split.length == 2) {
				type = 'album';
				name = desanitise(split[1]);
				sister = desanitise(split[0]);
			} else if (split.length == 3) {
				type = 'track';
				name = desanitise(split[2]);
				sister = desanitise(split[0]);
			}
		}

		if (sister) {
			tippy(link, {
				theme: 'name-sister-combo',
				content: html.node`
                    <span class="name">${name}</span>
                    <span class="sister">${sister}</span>
                `,
			});
		}

		if (type) {
			link.classList.add('wiki-link', 'icon');
			link.setAttribute('data-link-type', type);
		}
	});
}
