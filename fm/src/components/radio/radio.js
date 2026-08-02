/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { html, render } from 'lighterhtml';
import { page } from '@/build/page';
import { tl, trans } from '@/build/trans';

export function bleh_radio() {
	const radios = page.structure.side.querySelectorAll('.stationlink');
	radios.forEach((radio) => {
		const type = radio.getAttribute('data-analytics-label');
		radio.classList.add('btn', 'radio-button', 'side-action', 'icon-mask');

		let text = tl(trans[type]);

		if (type == 'tag') {
			text = page.name;
		} else if (type == 'event') {
			text = tl(trans.artists);
		}

		render(
			radio,
			html`
				<h3 class="sub-text">${tl(trans.radio)}</h3>
				<h4>${text}</h4>
			`,
		);

		radio.removeAttribute('title');

		radio.parentElement.replaceWith(radio);
	});

	const list = page.structure.side.querySelector('.stationlink-list');
	if (list) {
		list.classList.add('side-actions');
	}

	if (page.type == 'user') {
		const promo_v3 = page.structure.side.querySelector('.promo-v3');
		if (!promo_v3) return;

		const header = promo_v3.querySelector('h2');
		header.textContent = tl(trans.listening);

		const promos = promo_v3.querySelectorAll('.listening-report-promo');
		const container = document.createElement('div');
		container.classList.add('listening-report-promos', 'side-actions');
		promos.forEach((promo) => {
			promo.classList.add('btn', 'side-action', 'icon-mask');
			container.appendChild(promo);
		});
		promo_v3.appendChild(container);

		if (radios.length == 0) return;

		const sep = document.createElement('div');
		sep.classList.add('sep', 'listen-sep');
		promo_v3.appendChild(sep);

		if (list) list.parentElement.remove();
		promo_v3.appendChild(list);
	} else {
		const header = page.structure.side.querySelector(
			'.stationlinks-header',
		);
		header.textContent = tl(trans.listening);
	}
}
