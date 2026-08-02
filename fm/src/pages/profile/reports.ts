import { page, root } from '@/build/page';
import { tl, trans } from '@/build/trans';
import { dialog } from '@/components/dialog/dialog';
import { convert_to_toolbar } from '@/components/page/structure';
import { version } from '@/main';
import { html } from 'lighterhtml';

export function profile_reports() {
	page.structure.content_top!.classList.add(
		'listening-report-navlist',
	);
	page.structure.row!.classList.add('listening-report');

	convert_to_toolbar();

	const report_box_container = document.body.querySelector(
		'.report-box-container--overview',
	);
	if (report_box_container) {
		// v3+ (2023)
		document.body.setAttribute(
			'data-bleh--theme',
			'oled',
		);
		document.body.setAttribute(
			'data-bleh--theme_type',
			'dark',
		);

		page.structure.row!.after(report_box_container);

		// 2025
		const share_row = document.body.querySelector('.share-button-row');
		if (share_row) {
			const title = document.body.querySelector('.report-headline-title')
				.textContent.trim();

			const split = window.location.pathname.split('/');
			const len = split.length - 1;
			const year = split[len] == 'year';

			const items = document.body.querySelectorAll(
				'.listening-report-top-item-wrap',
			);
			items.forEach((item) => {
				// id is null in the case of 'no albums'
				// being a widget
				const id = item.querySelector('.listening-report-top-item')
					.getAttribute('id');
				if (!id) return;

				const type = id.replace('listening-report-top-item-', '');

				const buttons = item.querySelector('.top-item-buttons');
				const album_grid = buttons.querySelector('.album-grid-button');
				if (album_grid) album_grid.remove();

				if (year) {
					buttons.insertBefore(
						html.node`
                        <a class="btn album-grid-button icon" data-type="collage" href="${root}bleh/minis/collage?type=${type}s&timeframe=from=${title}-01-01%26rangetype=year" target="_blank">
                            ${tl(trans.collage)} (${version.brand})
                        </a>
                    `,
						buttons.firstElementChild,
					);
				}
			});
		}
	} else {
		const dashboard = page.structure.container!.querySelector(
			'.user-dashboard',
		);
		if (dashboard) {
			// v2
			dialog({
				id: 'listening_report_v2',
				title: 'oh no :c',
				body: html.node`
                    <div class="alert alert-error">This listening report is too old</div>
                    <br>
                    <p>Legacy listening reports are not properly viewable yet in bleh for now. Sorry for the inconvenience.</p>
                `,
			});
		}
	}
}
