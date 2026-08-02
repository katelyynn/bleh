/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { html } from 'lighterhtml';
import { lang, lang_info, tl, trans } from '@/build/trans';
import { sponsor_list } from '@/build/sponsor';
import { root } from '@/build/page';
import { sponsor } from '@/components/sponsor';
import { version } from '@/main';
import { settings } from '@/build/config';
import { icon, icons } from '../shared/icon';

export function bleh_footer() {
	const footer = document.body.querySelector('footer.footer');
	if (!footer) return;

	let kate = 'katelyn';
	let sponsoring = 0;

	if (sponsor_list.version) {
		if (sponsor_list.related.special.length > 0) {
			kate = sponsor_list.related.special[0];
		}

		sponsoring = Object.keys(sponsor_list.users).length - 2;
	}

	footer.appendChild(html.node`
        <div class="footer-bleh">
            <a class="bleh-logo-footer b" href="https://bleh.katelyn.moe" target="_blank">
                ${version.brand}
            </a>
            <span class="footer-version">
                ${version.build}
            </span>
            <div class="new-badge sku spacing">
                ${version.sku}
                ${
		settings.dev
			? html.node`
                    <span class="bleh-icon-container">
                        ${icon({ name: icons.dev })}
                    </span>
                `
			: ''
	}
            </div>
            <div class="footer-dot" />
            <div class="footer-credit">
                <p class="footer-credit-text">
                    ${{
		html: tl(trans.made_with_love, {
			u: `<a class="b" href="${root}user/${kate}">${kate}</a>`,
			c: '<a class="b" href="https://github.com/katelyynn/bleh/graphs/contributors" target="_blank">',
			'/c': '</a>',
			h: `<span class="bleh-icon heart sponsor-related colourful">${
				tl(trans.love_lower)
			}</span>`,
		}),
	}}
                </p>
            </div>
            <div class="footer-dot" />
            <div class="footer-web">
                <a class="footer-link" data-type="source" href="https://github.com/katelyynn/bleh" target="_blank">
                    ${tl(trans.view_source)}
                </a>
                <div class="footer-dot" />
                <a class="footer-link" data-type="issue" href="https://github.com/katelyynn/bleh/issues/new/choose" target="_blank">
                    ${tl(trans.report_issue)}
                </a>
            </div>
        </div>
        ${
		lang != 'en' && lang in lang_info
			? html.node`
	            <div class="footer-bleh-top">
	                <div class="footer-credit">
	                    <p>
	                        ${{
				html: tl(trans.translations, {
					l: lang_info[lang].name,
					u: `<span class="b">${
						lang_info[lang].by.map((user) =>
							`<a href="${root}user/${user}">${user}</a>`
						).join(', ')
					}</span>`,
				}),
			}}
	                    </p>
	                </div>
	            </div>
	        `
			: ''
	}
    `);

	const heart = footer.querySelector('.heart');
	if (heart) heart.addEventListener('click', () => sponsor());
}
