import { page } from "@/build/page";

export function set_obsession() {
	page.structure.main!.appendChild(
		<section class='set-obsession'>
			{page.structure.main!.children}
		</section>
	);

	const search = page.structure.main!.querySelector('.search-submit');
	if (search) {
		search.classList.add('btn', 'chibi', 'icon-mask');
		search.setAttribute('data-type', 'search')
	}

	const reset = page.structure.main!.querySelector('.search-reset');
	if (reset) {
		reset.classList.add('btn', 'chibi', 'icon-mask');
		reset.setAttribute('data-type', 'x')
	}
}
