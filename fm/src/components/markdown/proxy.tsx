/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ReactElement } from 'jsx-dom';
import { expand_avatar } from '@/components/shared/avatar.tsx';

export function proxy_images(
	body: ReactElement,
	line_breaks = true,
	in_dialog = false,
) {
	body.querySelectorAll('img').forEach((image) => {
		if (!line_breaks) {
			image.remove();
			return;
		}

		// for counter-like sites
		// did they really have to call their counter site loli
		const proxy_free = [
			'count.getloli.com',
			'i.imgur.com',
			'media1.tenor.com',
			'katelyynn.github.io',
			'i.pinimg.com',
			'i.ibb.co',
			'static.klipy.com',
			'static2.klipy.com',
		];

		try {
			const url = new URL(image.src);

			if (!proxy_free.includes(url.hostname)) {
				image.setAttribute(
					'data-unsafe-href',
					encodeURI(image.src),
				);
				image.src = `https://images.weserv.nl/?url=${
					encodeURIComponent(image.src)
				}&output=webp&n=-1`;
			}
		} catch (e) {
			image.setAttribute('data-unsafe-href', encodeURI(image.src));
			image.src = `https://images.weserv.nl/?url=${
				encodeURIComponent(image.src)
			}&output=webp&n=-1`;
		}

		image.setAttribute('loading', 'lazy');

		let func = () => expand_avatar(image.src, image.alt);
		if (in_dialog) func = () => open(image.src);

		const container = <div className='markdown-image' onClick={func} />;

		image.after(container);
		container.appendChild(image);
	});
}
