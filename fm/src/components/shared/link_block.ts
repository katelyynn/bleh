// mimics the default last.fm link block
export function bind_link_block(
	link_block: HTMLAnchorElement,
	binder: Element,
) {
	link_block.addEventListener('mouseenter', () => {
		binder.classList.add('link-block--hover');
	});

	link_block.addEventListener('mouseleave', () => {
		binder.classList.remove('link-block--hover');
	});
}
