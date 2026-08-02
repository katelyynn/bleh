/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ReactElement } from 'jsx-dom';
import { fetch_status } from '@/components/profile/statuscafe.tsx';
import { tl, trans } from '@/build/trans.ts';

export function status_cafe(body: ReactElement, user?: string) {
	if (!user) return;

	const status_cafe_host = body.querySelector('.status-cafe-host');
	status_cafe_host!.replaceChildren(
		<div className='status-cafe'>
			<div className='status-cafe-content is-loading'>
				<span className='status-cafe-emoji'>
					<span className='status-cafe-loading-spinner'>
						<span className='bleh-icon' />
					</span>
				</span>
				<span className='status-cafe-text'>
					${tl(trans.loading_status, { u: user })}
				</span>
			</div>
			<div className='status-cafe-top'>
				<span className='status-cafe-time'>...</span>
			</div>
		</div>,
	);

	fetch_status(user).then((status_cafe) => {
		status_cafe_host!.replaceChildren(status_cafe);
	});
}
