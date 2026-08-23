import { page } from '@/build/page.ts';
import { useSettings } from '@/page.ts';
import { ReactElement } from 'jsx-dom';

export function count_bar(bar: HTMLDivElement | ReactElement) {
	const season = page.state.seasons.current?.id || 'none';
	const v2 = useSettings.get('count_bar_style') == 'minimal';

	const link = bar.querySelector(
		'.chartlist-count-bar-link',
	) as HTMLAnchorElement;
	if (!link) return;

	const slug = link.querySelector(
		'.chartlist-count-bar-slug',
	) as HTMLSpanElement;
	const value = link.querySelector(
		'.chartlist-count-bar-value',
	) as HTMLSpanElement;

	bar.setAttribute('data-season', season);

	bar.classList.toggle('v2', v2);
	link.classList.toggle('v2', v2);
	slug?.classList.toggle('v2', v2);
	value?.classList.toggle('v2', v2);
}
