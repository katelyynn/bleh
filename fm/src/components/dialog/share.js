/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { html } from 'lighterhtml';
import { notify } from '@/components/dialog/notify';
import { dialog } from '@/components/dialog/dialog';
import { tl, trans } from '@/build/trans';
import { log } from '@/build/log.js';
import { copy } from '@/build/tools';

export function share(url) {
	let is_url = false;
	let share_object = {
		text: url,
	};

	let scheme;
	let hostname;
	let path;

	try {
		const link = new URL(url);
		is_url = true;

		share_object = {
			url,
		};

		scheme = link.protocol;
		hostname = link.hostname;
		path = link.pathname + link.search + link.hash;
	} catch (e) {}

	let input;
	dialog({
		id: 'share',
		title: tl(trans.share),
		body: html.node`
            ${
			is_url
				? html.node`
                <div class="external-warn-input">
                    <span class="scheme">
                        ${scheme}//
                    </span>
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
                </div>
            `
				: html.node`
                <div class="external-warn-input">
                    <span class="hostname">
                        ${url}
                    </span>
                </div>
            `
		}
            <div class="modal-footer center">
                <button class="btn primary icon fill-btn" data-type="share" onclick=${() =>
			(navigator && navigator.share)
				? navigator.share(share_object)
				: log('share failed', 'share', 'error')}>
                    ${tl(trans.share_via_device)}
                </button>
                <button class="btn primary icon copy" onclick=${() => {
			copy(url);
		}}
                >${tl(is_url ? trans.copy_link : trans.copy_text)}</button>
            </div>
        `,
	});
}

export function download(url, filename = null) {
	log(`downloading ${filename}`, 'download');

	const link = html.node`
        <a href=${url} download />
    `;

	if (filename) {
		link.setAttribute('download', filename);
	}

	link.click();
	notify({
		id: 'downloaded',
		title: tl(trans.downloaded),
		body: filename,
		icon: 'icon-16-download',
	});
}
