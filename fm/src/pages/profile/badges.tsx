import { WithChildren } from '@/types/generic.tsx';
import { useSettings } from '@/page.tsx';

export function ProfileBadges({
	children,
}: WithChildren) {
	const elem = (
		<div class='profile-badges-scroller'>
			<div class={['badges', 'profile-badges']}>
				{children}
			</div>
		</div>
	);

	if (useSettings.get('simulate_scroll')) {
		elem.addEventListener('wheel', (e) => {
			e.preventDefault();

			if (e.deltaY > 0) {
				elem.scrollBy({
					top: 0,
					left: +200,
					behavior: 'smooth',
				});
			} else {
				elem.scrollBy({
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
