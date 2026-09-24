import { useSettings } from '@/page.ts';
import { Icon, icons } from '@/components/shared/icon.tsx';
import {
	music_links_edit,
	SocialLink,
} from '@/components/text/social_link.tsx';
import { sanitise } from '@/build/tools.ts';
import { page, root } from '@/build/page.ts';
import { context_menu_tooltip } from '@/components/shared/tooltips.tsx';
import { MenuContents } from '@/components/menu/menu.tsx';
import { SubText } from '@/components/text/sub.tsx';
import { tl, trans } from '@/build/trans.ts';
import { SeeMore } from '@/components/text/see_more.tsx';
import { createRef } from 'jsx-dom';

export function create_music_links(col_main: HTMLElement) {
	let play_on;
	let play_links;

	const link_container = createRef();
	const link_group = (
		<div class='metadata-row'>
			<div class='metadata-group'>
				<SubText className='music-small-header'>
					{tl(trans.find_on)}
					<SeeMore
						className='wiki-lower'
						icon={icons.edit}
						onClick={music_links_edit}
					>
						{(tl(trans.edit_links) as string).toLowerCase()}
					</SeeMore>
				</SubText>
				<div class='music-links' ref={link_container} />
			</div>
		</div>
	);

	const link_types: Record<string, Element | null> = {};

	if (page.type == 'track') {
		play_on = page.structure.side!.querySelector(
			'.play-this-track-playlinks',
		) as HTMLDivElement;
		play_on.parentElement!.remove();

		play_links = play_on.querySelectorAll('li');

		play_links.forEach((item) => {
			const link = item.querySelector(
				'.play-this-track-playlink:not(.visible-xs)',
			) as HTMLAnchorElement;
			if (!link) return;

			link.classList.remove('play-this-track-playlink');
			link.classList.add(
				'btn',
				'music-link',
				'social-link',
				'colourful',
				'icon',
			);

			const replace = item.querySelector(
				'.replace-playlink',
			) as HTMLAnchorElement;

			if (link.classList.contains('play-this-track-playlink--youtube')) {
				link.textContent = 'YouTube';
				link.appendChild(<Icon name={icons.external} />);

				link_types.youtube = link;
			} else if (
				link.classList.contains('play-this-track-playlink--spotify')
			) {
				link.textContent = 'Spotify';
				link.appendChild(<Icon name={icons.external} />);

				link_types.spotify = link;
			} else if (
				link.classList.contains('play-this-track-playlink--itunes')
			) {
				link.textContent = 'Apple';
				link.appendChild(<Icon name={icons.external} />);

				link_types.itunes = link;
			}

			if (replace) {
				replace.classList.add('dropdown-menu-clickable-item');
				item.removeChild(replace);

				context_menu_tooltip(
					link,
					<MenuContents>
						{replace}
					</MenuContents>,
				);
			}
		});

		link_types.genius = (
			<SocialLink
				href={`https://genius.com/search?q=${sanitise(page.sister)}+${
					sanitise(page.name)
				}`}
			/>
		);
		link_types.tidal = (
			<SocialLink
				href={`https://listen.tidal.com/search?q=${
					sanitise(page.sister, ' ')
				}%20${sanitise(page.name, ' ')}`}
			/>
		);
		link_types.qobuz = (
			<SocialLink
				href={`https://www.qobuz.com/gb-en/search/albums/${
					sanitise(page.name, ' ')
				}?ssf[s]=main_catalog&ssf[f][an]=${sanitise(page.sister, ' ')}`}
			/>
		);
		link_types.deezer = (
			<SocialLink
				href={`https://www.deezer.com/search/${
					sanitise(page.sister, ' ')
				}%20${sanitise(page.name, ' ')}`}
			/>
		);
		link_types.record_club = (
			<SocialLink
				href={`https://record.club/search?query=${
					sanitise(page.sister, ' ')
				}%20${sanitise(page.name, ' ')}&facet=releases`}
			/>
		);
		link_types.search = (
			<SocialLink
				className='search-similar'
				href={`${root}search/${page.type}s?q=${sanitise(page.sister)}+${
					sanitise(page.name)
				}`}
			>
				{tl(trans.search)}
			</SocialLink>
		);
	} else {
		if (page.type == 'album') {
			link_types.genius = (
				<SocialLink
					href={`https://genius.com/search?q=${
						sanitise(page.sister)
					}+${sanitise(page.name)}`}
				/>
			);
			link_types.tidal = (
				<SocialLink
					href={`https://listen.tidal.com/search?q=${
						sanitise(page.sister, ' ')
					}%20${sanitise(page.name, ' ')}`}
				/>
			);
			link_types.qobuz = (
				<SocialLink
					href={`https://www.qobuz.com/gb-en/search/tracks/${
						sanitise(page.name, ' ')
					}?ssf[s]=main_catalog&ssf[f][an]=${
						sanitise(page.sister, ' ')
					}`}
				/>
			);
			link_types.deezer = (
				<SocialLink
					href={`https://www.deezer.com/search/${
						sanitise(page.sister, ' ')
					}%20${sanitise(page.name, ' ')}`}
				/>
			);

			link_types.spotify = (
				<SocialLink
					href={`https://open.spotify.com/search/${
						sanitise(page.sister, ' ')
					}%20${sanitise(page.name, ' ')}`}
				/>
			);
			link_types.itunes = (
				<SocialLink
					href={`https://music.apple.com/gb/search?term=${
						sanitise(page.sister, ' ')
					}%20${sanitise(page.name, ' ')}`}
				/>
			);
			link_types.youtube = (
				<SocialLink
					href={`https://music.youtube.com/search?q=${
						sanitise(page.sister, ' ')
					}%20${sanitise(page.name, ' ')}`}
				/>
			);
			link_types.discogs = (
				<SocialLink
					href={`https://www.discogs.com/search?q=${
						sanitise(page.sister)
					}+${sanitise(page.name)}`}
				/>
			);
			link_types.aoty = (
				<SocialLink
					href={`https://www.albumoftheyear.org/search/?q=${
						sanitise(page.sister)
					}+${sanitise(page.name)}`}
				/>
			);
			link_types.rym = (
				<SocialLink
					href={`https://rateyourmusic.com/search?searchterm=${
						sanitise(page.sister, ' ')
					}%20${sanitise(page.name, ' ')}`}
				/>
			);
			link_types.record_club = (
				<SocialLink
					href={`https://record.club/search?query=${
						sanitise(page.sister, ' ')
					}%20${sanitise(page.name, ' ')}&facet=releases`}
				/>
			);
			link_types.search = (
				<SocialLink
					className='search-similar'
					href={`${root}search/${page.type}s?q=${
						sanitise(page.sister)
					}+${sanitise(page.name)}`}
				>
					{tl(trans.search)}
				</SocialLink>
			);
		} else {
			link_types.genius = (
				<SocialLink
					href={`https://genius.com/search?q=${sanitise(page.name)}`}
				/>
			);
			link_types.tidal = (
				<SocialLink
					href={`https://listen.tidal.com/search?q=${
						sanitise(page.name, ' ')
					}`}
				/>
			);
			link_types.qobuz = (
				<SocialLink
					href={`https://www.qobuz.com/gb-en/search/artists/${
						sanitise(page.name, ' ')
					}`}
				/>
			);
			link_types.deezer = (
				<SocialLink
					href={`https://www.deezer.com/search/${
						sanitise(page.name, ' ')
					}`}
				/>
			);

			link_types.spotify = (
				<SocialLink
					href={`https://open.spotify.com/search/${
						sanitise(page.name, ' ')
					}`}
				/>
			);
			link_types.itunes = (
				<SocialLink
					href={`https://music.apple.com/gb/search?term=${
						sanitise(page.name, ' ')
					}`}
				/>
			);
			link_types.youtube = (
				<SocialLink
					href={`https://music.youtube.com/search?q=${
						sanitise(page.name, ' ')
					}`}
				/>
			);
			link_types.discogs = (
				<SocialLink
					href={`https://www.discogs.com/search?q=${
						sanitise(page.name)
					}`}
				/>
			);
			link_types.aoty = (
				<SocialLink
					href={`https://www.albumoftheyear.org/search/?q=${
						sanitise(page.name)
					}`}
				/>
			);
			link_types.rym = (
				<SocialLink
					href={`https://rateyourmusic.com/search?searchterm=${
						sanitise(page.name, ' ')
					}`}
				/>
			);
			link_types.record_club = (
				<SocialLink
					href={`https://record.club/search?query=${
						sanitise(page.sister, ' ')
					}%20${sanitise(page.name, ' ')}&facet=artists&entities=`}
				/>
			);
			link_types.search = (
				<SocialLink
					className='search-similar'
					href={`${root}search/${page.type}s?q=${
						sanitise(page.name)
					}`}
				>
					{tl(trans.search)}
				</SocialLink>
			);

			const externals = page.structure.side!.querySelector(
				'.resource-external-links',
			) as HTMLUListElement;
			if (externals) {
				externals.parentElement!.remove();

				const externals_links = externals.querySelectorAll(
					'.resource-external-link',
				);
				externals_links.forEach((link) => {
					link.classList.add(
						'btn',
						'music-link',
						'colourful',
						'icon',
					);

					let type = link.classList[1];

					if (type == 'resource-external-link--homepage') {
						link.textContent = tl(trans.website) as string;
						link.appendChild(<Icon name={icons.external} />);

						link_types.website = link;
					} else if (type == 'resource-external-link--twitter') {
						link.textContent = 'Twitter';
						link.appendChild(<Icon name={icons.external} />);

						link_types.twitter = link;
					} else if (type == 'resource-external-link--facebook') {
						link.textContent = 'Facebook';
						link.appendChild(<Icon name={icons.external} />);

						link_types.facebook = link;
					} else if (type == 'resource-external-link--instagram') {
						link.appendChild(<Icon name={icons.external} />);

						link_types.instagram = link;
					} else if (type == 'resource-external-link--soundcloud') {
						link.appendChild(<Icon name={icons.external} />);

						link_types.soundcloud = link;
					}
				});
			}
		}
	}

	function update_links() {
		const music_links = useSettings.get('music_links') as string[];

		link_container.current.replaceChildren(
			<>
				{music_links.map((link) => {
					if (link_types[link]) return link_types[link];
				})}
			</>,
		);
	}

	update_links();

	useSettings.on('music_links', update_links);

	col_main.appendChild(link_group);

	return link_group;
}
