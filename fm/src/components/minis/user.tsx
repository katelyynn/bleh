import { WithChildren } from '@/types/generic.tsx';
import { load_profile_cache_externally } from '@/pages/profile/profile.tsx';
import { profile_cache } from '@/types/profile.ts';
import { page } from '@/build/page.ts';
import { createRef } from 'jsx-dom';

export function CompareUsers({
	ref,
	children,
}: WithChildren) {
	return (
		<div
			class='compare-users'
			ref={ref as ReturnType<typeof createRef<HTMLDivElement>>}
		>
			{children}
		</div>
	);
}

export function CompareSelection({
	ref,
	children,
}: WithChildren) {
	return (
		<div
			class='compare-selection'
			ref={ref as ReturnType<typeof createRef<HTMLDivElement>>}
		>
			{children}
		</div>
	);
}

interface CompareUserProps {
	name: string;
	focus?: boolean;
	replacePage?: boolean;
}

export function CompareUser({
	name,
	focus,
	replacePage = false,
}: CompareUserProps) {
	const elem = (
		<div class={['compare-user', focus && 'focus']}>
			<div class={['avatar', 'loading']} />
			<strong class='compare-user-name'>{name}</strong>
		</div>
	);

	load_profile_cache_externally().then((cache: profile_cache) => {
		elem.replaceChildren(
			<>
				<div class={['avatar']}>
					<img src={cache.avatar} />
				</div>
				<strong class='compare-user-name'>{name}</strong>
			</>,
		);

		if (replacePage) {
			page.avatar = cache.avatar || '';
			page.name = name;
		}
	});

	return elem;
}
