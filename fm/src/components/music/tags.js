import { page } from '@/build/page';
import { romanise } from '@/build/tools';
import { correct_artist } from './lotus';

export function tag_page() {
	if (!page.structure.main) return;

	const tags = page.structure.main.querySelectorAll(
		'.big-tags-item:not([data-tagged])',
	);
	tags.forEach((tag) => {
		tag.setAttribute('data-tagged', true);
		const ctx = tag.querySelector('.big-tags-item-context');

		if (ctx) {
			const links = ctx.querySelectorAll('a');
			links.forEach((link) => {
				link.textContent = romanise(correct_artist(link.textContent));
			});
		}
	});
}
