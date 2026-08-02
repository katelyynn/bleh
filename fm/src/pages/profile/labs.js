//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { auth, page, root } from '@/build/page';
import { register_background } from '@/page';

export function bleh_labs() {
	if (page.subpage != 'overview') return;

	register_background('');

	const quilt = document.body.querySelector(
		'[data-analytics-action="LaunchAlbumQuilt"]',
	);
	if (quilt) {
		page.avatar = auth.avatar;
		page.name = auth.name;

		quilt.setAttribute('href', `${root}bleh/minis/collage?redirect=true`);
		quilt.removeAttribute('target');
	}
}
