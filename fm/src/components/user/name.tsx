import { WithChildren } from '@/types/generic.tsx';
import { is_sponsor } from '@/components/sponsor.ts';
import { profile_cache } from '@/types/profile.ts';
import { ReactNode } from 'jsx-dom';
import { keys } from '@/components/settings/storage.ts';

/**
 * a simple @username element
 */
export function GenericUsername({
	children,
}: WithChildren) {
	return (
		<span class='generic-username'>
			<span class='at'>@</span>
			{children}
		</span>
	);
}

interface SponsorUsernameProps {
	cache?: Record<string, profile_cache>;
	children: ReactNode;
}

/**
 * fetches and displays either a sponsor username or generic username.
 * does not cause network lookups if not found, handle that yourself.
 */
export function SponsorUsername({
	cache,
	children,
}: SponsorUsernameProps) {
	if (!children) return;

	const name = String(children);

	if (cache == undefined) {
		cache = JSON.parse(localStorage.getItem(keys.profile_cache) || '{}');
	}

	const valid = is_sponsor(name);

	if (!cache?.[name]?.username || !valid) {
		return <GenericUsername>{name}</GenericUsername>;
	}

	return (
		<span class='username-combo'>
			<span class='username-custom'>
				{cache[name].username}
			</span>
			<span class='username-original'>
				<span class='at'>@</span>
				{name}
			</span>
		</span>
	);
}
