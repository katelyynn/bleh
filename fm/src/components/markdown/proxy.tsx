/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ReactElement } from 'jsx-dom';
import { expand_avatar } from '@/components/shared/avatar.tsx';

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
	'cdn.discordapp.com',
	'lastfm.freetls.fastly.net',
	'lastfm-img.freetls.fastly.net',
	'last.fm',
];

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

		try {
			const url = new URL(image.src);

			if (!proxy_free.includes(url.hostname)) {
				image.setAttribute(
					'data-unsafe-href',
					encodeURI(image.src),
				);
				image.src = proxy_image(image.src);
			}
		} catch (e) {
			image.setAttribute('data-unsafe-href', encodeURI(image.src));
			image.src = proxy_image(image.src);
		}

		image.setAttribute('loading', 'lazy');

		let func = () => expand_avatar(image.src, image.alt);
		if (in_dialog) func = () => open(image.src);

		const container = <div className='markdown-image' onClick={func} />;

		image.after(container);
		container.appendChild(image);
	});
}

export function proxy_image(url: string) {
	try {
		const instance = new URL(url);

		if (proxy_free.includes(instance.hostname)) return url;
	} catch {}

	return `https://images.weserv.nl/?url=${
		encodeURIComponent(url)
	}&output=webp&n=-1`;
}
