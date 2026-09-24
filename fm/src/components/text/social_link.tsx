import { ReactNode } from 'jsx-dom';
import { page, root } from '@/build/page.ts';
import {
	icons_not_supported,
	link_strings,
} from '@/components/markdown/links.tsx';
import { Icon, icons } from '@/components/shared/icon.tsx';
import { external_url_prompt } from '@/components/dialog/external_link.tsx';
import { can_trust_link } from '@/pages/music/wiki.tsx';
import { dialog } from '@/components/dialog/dialog.tsx';
import { SettingGroup } from '@/components/settings/group.tsx';
import { SettingList } from '@/components/settings/provider/list.tsx';
import { tl, trans } from '@/build/trans.ts';

interface SocialLinkProps {
	className?: string;
	href: string;
	children?: ReactNode;
}

export function SocialLink({
	className,
	href,
	children,
}: SocialLinkProps) {
	const link = new URL(href, `https://www.last.fm${root}`);
	const host = link.hostname;
	const path = link.pathname;

	let label: ReactNode = host;

	if (children) {
		label = children;
	} else if (link_strings[host]) {
		label = link_strings[host];
	}

	const host_unknown = (!Object.hasOwn(
		link_strings,
		link.host,
	) || icons_not_supported.includes(link.host)) &&
		className != 'search-similar';

	return (
		<a
			class={[
				'btn',
				'music-link',
				'social-link',
				'colourful',
				'icon',
				className,
			]}
			href={href}
			target='_blank'
			data-host={link.host}
			data-host-unknown={String(host_unknown)}
			onClick={(e) => {
				const { trusted, dangerous } = can_trust_link(href);
				if (trusted) return;

				e.preventDefault();

				external_url_prompt(href!, dangerous);
			}}
			data-path={path}
			style={`--favi: url(https://icons.duckduckgo.com/ip3/${link.host}.ico)`}
		>
			{label}
			<Icon name={icons.external} />
		</a>
	);
}

export function music_links_edit() {
	dialog({
		id: 'music_links',
		icon: icons.album,
		title: tl(trans.overview),
		body: (
			<SettingGroup>
				<SettingList
					bind='music_links'
					values={page.state.music_links}
				/>
			</SettingGroup>
		),
	});
}
