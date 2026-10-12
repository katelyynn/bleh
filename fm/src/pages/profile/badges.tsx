import { WithChildren } from '@/types/generic.tsx';
import { useSettings } from '@/page.tsx';
import { createRef } from 'jsx-dom';
import { ff } from '@/components/settings/sku.ts';

export function ProfileBadges({
	children,
}: WithChildren) {
	const list = createRef();
	const refresh = ff('header_refresh');

	const elem = (
		<div
			class={[
				'profile-badges-scroller-container',
				refresh && 'header-refresh',
			]}
		>
			<div
				class={['profile-badges-scroller', refresh && 'header-refresh']}
				ref={list}
			>
				<div
					class={[
						'badges',
						'profile-badges',
						refresh && 'header-refresh',
					]}
				>
					{children}
				</div>
			</div>
		</div>
	);

	if (useSettings.get('simulate_scroll')) {
		elem.addEventListener('wheel', (e) => {
			e.preventDefault();

			if (e.deltaY > 0) {
				list.current.scrollBy({
					top: 0,
					left: +200,
					behavior: 'smooth',
				});
			} else {
				list.current.scrollBy({
					top: 0,
					left: -200,
					behavior: 'smooth',
				});
			}
		});
	} else {
		elem.classList.add('scroll-manually');
	}

	return elem;
}
