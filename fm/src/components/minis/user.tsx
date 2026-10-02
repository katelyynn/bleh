/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { WithChildren } from '@/types/generic.tsx';
import { load_profile_cache_externally } from '@/pages/profile/profile.tsx';
import { profile_cache } from '@/types/profile.ts';
import { auth, page } from '@/build/page.ts';
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
	name?: string;
	focus?: boolean;
	avatarOnly?: boolean;
	replacePage?: boolean;
}

export function CompareUser({
	name,
	focus,
	avatarOnly = false,
	replacePage = false,
}: CompareUserProps) {
	const elem = (
		<div
			class={[
				'compare-user',
				focus && 'focus',
				avatarOnly && 'avatar-only',
			]}
		>
			<div class={['avatar', 'loading']} />
			<strong class='compare-user-name'>{name}</strong>
		</div>
	);

	if (!name) return elem;

	load_profile_cache_externally(name).then((cache: profile_cache) => {
		const avatar = name == auth.name ? auth.avatar! : cache.avatar;

		elem.replaceChildren(
			<>
				<div class={['avatar']}>
					<img src={avatar} />
				</div>
				<strong class='compare-user-name'>{name}</strong>
			</>,
		);

		if (replacePage) {
			page.avatar = avatar || '';
			page.name = name;
		}
	});

	return elem;
}
