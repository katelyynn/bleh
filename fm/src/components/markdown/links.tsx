import { ReactElement } from 'jsx-dom';
import { social_link } from '@/types/markdown.ts';
import { tl, trans } from '@/build/trans.ts';
import { root } from '@/build/page.ts';
import DOMPurify from 'dompurify';

// retrieves social links if a user supplies them
export const social_links_extension = (links: social_link[]) => [
	{
		type: 'lang',
		regex: /\[links\]([\s\S]*?)\[\/links\]/g,
		replace: (_: string, content: string) => {
			const lines = content.trim().split(/\n+/);

			lines.forEach((line) => {
				line = line.trim();
				if (!line) return;
				console.info('line', line, line.trim());

				const markdown_regex = line.match(/^\[(.+?)\]\((.+?)\)$/);

				let url;
				let name;

				if (markdown_regex) {
					url = markdown_regex[2].trim();
					name = markdown_regex[1].trim();
				} else {
					url = line;
				}

				try {
					const link = new URL(url, `https://www.last.fm${root}`);
					const host = link.hostname;
					const protocol = link.protocol;
					const path = link.pathname;

					console.info('proto', protocol, link);

					if (protocol != 'http:' && protocol != 'https:') return;

					const final: social_link = {
						host,
						path,
						url: link.href,
					};

					if (name) {
						final.name = DOMPurify.sanitize(name, {
							ALLOWED_TAGS: [],
						});
					}

					links.push(final);
				} catch (e) {
					return;
				}
			});

			return '';
		},
	},
];

export function social_links(body: ReactElement, links: social_link[]) {
	if (links.length == 0) return;

	const link_strings: Record<string, string> = {
		'open.spotify.com': 'Spotify',
		'spotify.com': 'Spotify',
		'youtube.com': 'YouTube',
		'x.com': 'Twitter (latterly X)',
		'twitter.com': 'Twitter',
		'github.com': 'GitHub',
		'discord.com': 'Discord',
		'discord.gg': 'Discord',
		'bandcamp.com': 'Bandcamp',
		'soundcloud.com': 'Soundcloud',
		'tiktok.com': 'TikTok',
		'www.tiktok.com': 'TikTok',
		'ko-fi.com': 'Ko-fi',
		'patreon.com': 'Patreon',
		'www.patreon.com': 'Patreon',
		'twitch.tv': 'Twitch',
		'www.twitch.tv': 'Twitch',
		'linktr.ee': 'Linktree',
		'carrd.co': 'Carrd',
		'music.apple.com': 'Apple Music',
		'music.youtube.com': 'YouTube Music',
		'facebook.com': 'Facebook',
		'www.discogs.com': 'Discogs',
		'discogs.com': 'Discogs',
		'tidal.com': 'Tidal',
		'record.club': 'Record Club',
		'rateyourmusic.com': 'RYM',
		'albumoftheyear.org': 'AOTY',
		'mastodon.social': 'Mastodon',
		'bsky.app': 'Bluesky',
		'reddit.com': 'Reddit',
	};

	const icons_not_supported = [
		'record.club',
		'reddit.com',
	];

	body.appendChild(
		<div class='social-links-container'>
			<div class='sub-text music-small-header'>
				{tl(trans.links)}
			</div>
			<div class='music-links social-links'>
				{links.map((link) => {
					let label = link.host;

					if (link.name) {
						label = link.name;
					} else if (link_strings[link.host]) {
						label = link_strings[link.host];
					}

					return (
						<a
							class={[
								'btn',
								'music-link',
								'social-link',
								'colourful',
								'icon',
							]}
							href={link.url}
							target='_blank'
							data-host={link.host}
							data-host-unknown={!Object.hasOwn(
								link_strings,
								link.host,
							) || icons_not_supported.includes(link.host)}
							data-path={link.path}
							style='--favi: url(https://icons.duckduckgo.com/ip3/${link.host}.ico)'
						>
							{label}
						</a>
					);
				})}
			</div>
		</div>,
	);
}
