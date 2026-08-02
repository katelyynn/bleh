//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { html } from 'lighterhtml';
import { dialog } from '@/components/dialog/dialog';
import { tl, trans } from '@/build/trans';
import { input } from '../settings/input';

export function report_issue() {
	let summary;

	dialog({
		id: 'report_issue',
		title: tl(trans.report_issue),
		body: html.node`
            <div class="new-scrobble-form">
                <p class="generic-label">${tl(trans.title)}</p>
                ${summary = input({
			type: 'text',
		})}
            </div>
        `,
	});
}
