import { page } from '@/build/page.ts';
import { log } from '@/build/log.ts';
import { checkup_page_structure } from '@/components/page/structure.tsx';
import { register_background, update_page } from '@/page.ts';
import { ReactNode } from 'jsx-dom';

export function auth_page() {
	page.structure.container = document.body.querySelector('.page-content')!;
	try {
		page.structure.row = page.structure.container!.querySelector('.row')!;
		page.structure.main = page.structure.row!.querySelector('.col-main')!;
		page.structure.side = page.structure.row!.querySelector(
			'.col-sidebar',
		)!;
	} catch {
		log('unable to find elements', 'page structure');
	}

	checkup_page_structure(false, undefined);
	log('status is', 'page', 'info', page);
	update_page();

	register_background('');

	let content = page.structure.row!.firstElementChild;

	if (!content || content.classList.contains('content')) {
		content = page.structure.container!.querySelector('.auth-container');
	}

	if (content && !content.classList.contains('content')) {
		content.classList.remove('col-sm-4', 'col-sm-offset-4');
		page.structure.main!.appendChild(
			<section class='auth-related'>
				{content as ReactNode}
			</section>,
		);

		const head = content.querySelector('h1');
		head?.classList.add('text-24');
	}
}
