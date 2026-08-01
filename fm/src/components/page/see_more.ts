import { page } from '@/build/page';

export function see_more() {
	if (!page.structure.container) return;

	const links = page.structure.container.querySelectorAll(
		':is(.more-link, .more-link-with-action, .more-link-fullwidth-right, .more-link-fullwidth-right-flush-top, .more-link-fullwidth, .show-more, .music-more-link, .pagination-next, .pagination-previous) > a:not([data-see-more])',
	);
	links.forEach((link: HTMLLinkElement) => {
		link.setAttribute('data-see-more', 'true');

		const parent = link.parentElement;
		const classes = String(parent.classList);

		link.classList.add('see-more');

		if (classes == 'pagination-previous') {
			link.classList.add('pagination-previous-link');
		}
	});

	const parents = page.structure.container.querySelectorAll(
		'.more-link-with-action',
	);
	parents.forEach((parent: Element) => {
		if (
			parent.nextElementSibling &&
			parent.nextElementSibling.classList.contains(
				'more-link-with-action',
			)
		) {
			parent.remove();
			return;
		}

		parent.classList = 'see-more-row';
	});

	const pagination = page.structure.container.querySelectorAll(
		'.pagination-page:not([data-pagination])',
	);
	pagination.forEach((page: Element) => {
		page.setAttribute('data-pagination', 'true');

		const current = page.hasAttribute('aria-current');

		const link = page.querySelector('a, span');
		link.classList.add('btn', 'pagination-page-link');

		if (current) link.setAttribute('aria-checked', 'true');
	});
}
