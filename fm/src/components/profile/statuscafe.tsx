/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { log } from '@/build/log';
import { set_storage } from '@/build/tools';
import { tl, trans } from '@/build/trans';
import { can_trust_link } from '@/pages/music/wiki';
import { text_decode } from '../shared/text_decode';
import { external_url_prompt } from '@/components/dialog/external_link.tsx';

export async function fetch_status(username) {
	const current = new Date();
	const next_fetch =
		new Date(localStorage.getItem('next_status_cafe_fetch')) || current;

	if (current >= next_fetch) {
		return await fetch_status_api(username);
	} else {
		return (
			<div className='status-cafe'>
				<div className='status-cafe-content is-loading'>
					<span className='status-cafe-text'>
						{tl(trans.status_cafe_too_many_requests)}
					</span>
				</div>
			</div>
		);
	}
}

async function fetch_status_api(username: string) {
	log(`fetching for ${username}`, 'status.cafe');

	const new_date = new Date();
	new_date.setSeconds(new_date.getSeconds() + 1.5);
	set_storage('next_status_cafe_fetch', new_date.toString());

	return fetch(`https://status.cafe/users/${username}/status.json`)
		.then((res) => {
			if (!res.ok) {
				log(`error fetching for ${username}`, 'status.cafe', 'error', {
					res,
				});
				return {
					author: username,
					content: 'status.cafe is unavailable right now..',
					face: '',
					timeAgo: '',
				};
			}

			return res.json();
		})
		.then((data) => {
			if (data.face == null) data.face = '';
			if (data.content == null) data.content = '...';
			if (data.timeAgo == null) data.timeAgo = '...';

			const status_link = `https://status.cafe/users/${username}`;

			const { trusted } = can_trust_link(status_link);

			return (
				<div
					className='status-cafe has-hover'
					onClick={() => {
						if (trusted) {
							open(status_link);
							return;
						}

						external_url_prompt(status_link);
					}}
				>
					<div className='status-cafe-content'>
						<span className='status-cafe-emoji'>{data.face}</span>
						<span className='status-cafe-text'>
							{text_decode(data.content)}
							<span className='status-cafe-time'>
								{data.timeAgo}
							</span>
						</span>
					</div>
				</div>
			);
		})
		.catch((e) => {
			log(`error processing for ${username}`, 'status.cafe', 'error', {
				e,
			});

			let error = e && e.message ? e.message : '';

			if (e instanceof TypeError) {
				error = `${username} was not found on status.cafe`;
			}

			return (
				<div className='status-cafe'>
					<div className='status-cafe-content is-loading'>
						<span className='status-cafe-text'>
							{error}
						</span>
					</div>
				</div>
			);
		});
}
