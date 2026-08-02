//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { auth, page, root } from '@/build/page';
import { tl, trans } from '@/build/trans';
import { html, render } from 'lighterhtml';

export function bleh_error() {
	page.state.error = false;
	const page_content = document.body.querySelector('.page-content');
	if (!page_content) return;

	const error_marvin = page_content.querySelector(
		'.error-page-marvin:not([data-bleh])',
	);
	if (!error_marvin) return;

	page.state.error = true;
	error_marvin.setAttribute('data-bleh', 'true');

	const error_content = page_content.querySelector('h1');

	const back_link = page_content.querySelector('a');

	const reason = page_content.querySelector('p');

	page_content.classList.add('has-error');
	render(
		page_content,
		html`
			<div class="row">
				<main class="content cards-view">
					<div class="col-main">
						<section class="error-panel sour">
							<div class="info">
								<h1>${tl(trans.erm)}</h1>
								<div class="subtle">${error_content
									.textContent}</div>
							</div>
							<div class="error-content">
			                    ${reason}
			                </div>
							<div class="subtle">${window.location
								.pathname}</div>
							<div class="error-footer">
								<a class="see-more cancel left-icon" href="${back_link
									.getAttribute('href')}">
			                        ${tl(trans.back)}
			                    </a>
								<a class="btn primary continue"
									href="${root}user/${auth.name}">
			                        ${tl(trans.profile)}
			                    </a>
							</div>
						</section>
					</div>
				</main>
			</div>
		`,
	);
}
