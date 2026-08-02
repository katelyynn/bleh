//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { set_storage } from '@/build/tools';
import { tl, trans } from '@/build/trans';
import { html } from 'lighterhtml';
import { DateTime } from 'luxon';
import { markdown } from '../markdown/markdown';
import { keys } from '../settings/storage';

interface notice {
	type: string;
	message: string;
	date: string;
}

export function notices() {
	const res = localStorage.getItem('bleh_notices');
	const expire = Number(localStorage.getItem('bleh_notices_expire'));
	const now = Date.now();

	if (!res || now >= expire) {
		fetch_notices();
		return;
	}

	let parse;

	try {
		parse = JSON.parse(res);
	} catch (e) {
		fetch_notices();
		return;
	}

	load_notices(parse);
}

function fetch_notices() {
	fetch(
		`https://katelyynn.github.io/bleh/dynamic/notices.json?${Math.random()}`,
	)
		.then((res) => {
			if (!res.ok) {
				throw new Error();
			}

			return res.json();
		})
		.then((res) => {
			set_storage('bleh_notices', JSON.stringify(res));
			set_storage(
				'bleh_notices_expire',
				`${Date.now() + 60 * 60 * 1000}`,
			); // 1 hour

			load_notices(res);
		})
		.catch((e) => {
			set_storage(
				'bleh_notices_expire',
				`${Date.now() + 30 * 60 * 1000}`,
			); // 30 minutes
		});
}

function load_notices(res: notice[]) {
	const seen: string[] =
		JSON.parse(localStorage.getItem(keys.notices_seen)) || [];

	document.body.appendChild(html.node`
      <div class="bleh-notices">
          ${
		res.map((notice) => {
			const date = DateTime.fromISO(notice.date);
			const id = `notice-${notice.type}-${notice.date}`;

			if (seen.includes(id)) return html.node``;

			const elem = html.node`
                  <div class="bleh-notice colourful">
                      <div class="notice-header" data-type=${notice.type}>
                          <span>${tl(trans.notice)}</span>
                          <span>${date.toRelative()}</span>
                      </div>
                      <div class="notice-content">
                          ${markdown(notice.message)}
                      </div>
                      <div class="notice-close" onclick=${() => {
				seen.push(id);
				set_storage(keys.notices_seen, JSON.stringify(seen));

				elem.remove();
			}}>
                        ${tl(trans.close)}
                      </div>
                  </div>
              `;

			return elem;
		})
	}
      </div>
  `);
}
