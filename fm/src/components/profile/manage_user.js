/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import tippy from 'tippy.js';
import { auth, page } from '@/build/page';
import { html } from 'lighterhtml';
import { tl, trans } from '@/build/trans';
import { copy } from '@/build/tools';
import { share } from '@/components/dialog/share';
import { ff } from '@/components/settings/sku';

export function manage_user(button) {
	const can_block = ff('can_block_in_menu');
	const can_report = ff('can_report_in_menu');
	const can_block_or_report = (can_block || can_report) &&
		page.name != auth.name;

	tippy(button, {
		theme: 'context-menu',
		content: html.node`
            <button class="dropdown-menu-clickable-item" data-type="copy" onclick=${() => {
			copy(page.name);
		}}>
                ${tl(trans.copy_username)}
            </button>
            <button class="dropdown-menu-clickable-item" data-type="share" onclick=${() => {
			share(window.location.href);
		}}>
                ${tl(trans.share)}
            </button>
            ${
			can_block_or_report
				? html.node`
                <div class="sep" />
                ${
					can_block
						? html.node`
                <button class="dropdown-menu-clickable-item more-item--report" data-type="block" onclick=${() => {
							block_user(page.name);
						}}>
                    ${tl(trans.block)}
                </button>
                `
						: ''
				}
                ${
					can_report
						? html.node`
                <button class="dropdown-menu-clickable-item more-item--report" data-type="report" onclick=${() => {
							report_user(page.name);
						}}>
                    <div class="auth-dropdown-item-row">
                        <span class="auth-dropdown-item-left">
                            ${tl(trans.report)}
                        </span>
                        <span class="auth-dropdown-item-right">
                            <div class="bleh-icon external" />
                        </span>
                    </div>
                </button>
                `
						: ''
				}
            `
				: ''
		}
        `,
		trigger: 'click',
		placement: 'bottom',
		interactive: true,
		interactiveBorder: 10,
		appendTo: document.body,

		onMount(instance) {
			instance.popper.addEventListener('click', (event) => {
				instance.hide();
			});
		},
	});
}

export function block_user(user = page.name) {
	// coming soon
}

export function report_user(user = page.name) {
	// coming soon
}
