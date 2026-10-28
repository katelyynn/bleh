export function lastfm_generic_page() {
	document.body.classList.add('generic-lastfm-page');

	const page_content = document.body.querySelector('.container.page-content') as HTMLElement;
	if (page_content) {
		page_content.setAttribute('style', '');
	}

	const nav = document.body.querySelector('.adaptive-skin-container .navlist') as HTMLElement;
	if (nav) {
		nav.classList.add('ignore');

		const items = nav.querySelector('.navlist-items') as HTMLElement;
		if (items) {
			items.classList.add('ignore');
		}
	}
}
