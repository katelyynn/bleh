import { useSettings } from "@/page";
import { createRef, ReactElement, ReactNode } from "jsx-dom";
import { correct_artist, correct_item_by_artist, name_includes } from "../music/lotus";
import { SmartArtist, SmartTitle } from "../music/smart_title";
import { auth, root } from "@/build/page";
import { redirect } from "../music/music";
import { romanise, sanitise } from "@/build/tools";
import { symbol } from "@/main";
import { context_menu_tooltip, hover_tooltip, menu_tooltip, Tooltip } from "../shared/tooltips";
import { TrackMenuPreview } from "./preview";
import { tl, trans } from "@/build/trans";
import { Button } from "../button/button";
import { Icon, icons } from "../shared/icon";
import { MenuContents } from "../menu/menu";
import { TrackElement, TrackMenu } from "../music/track";

interface TracklistProps {
	art?: boolean;
	children?: ReactNode;
}

export function Tracklist({
	art = true,
	children
}: TracklistProps) {
	return (
		<table class={[
			'chartlist',
			'chartlist--with-artist',
			art && 'chartlist--with-image'
		]}>
			<tbody>
				{children}
			</tbody>
		</table>
	)
}

interface TrackProps {
	name: string;
	artist: string;
	album?: string;
	art?: string;
	url: string;
	active?: boolean;
	margin?: boolean;
	requestClose?: () => void;
}

export function Track({
	name,
	artist,
	album,
	art,
	url,
	active,
	margin = true,
	requestClose
}: TrackProps) {
	const trackName = createRef();
	const artists = createRef();

	const coverArt = createRef();
	const more = createRef();
	const albumLink = createRef();

	const elem = (
		<tr class={[
			'chartlist-row',
			active && 'chartlist-row--now-scrobbling',
			!margin && 'no-side-margin'
		]} data-show-album-text={String(album && active)} data-album-name-location='column' data-has-bar='false'>
			<td class='chartlist-image'>
				<a href={url} class='cover-art' ref={coverArt}>
					{art ? (
						<img src={art} alt={name} loading='lazy' />
					) : (
						<img class='missing-track' />
					)}
				</a>
			</td>
			<div class='track-info' data-track-layout='column' data-album-name-location='column'>
				<td class='chartlist-name'>
					<a href={url} ref={trackName} data-name={name}>
						{romanise(correct_item_by_artist(name, artist))}
					</a>
				</td>
				<td class='chartlist-artist' ref={artists}>
					<a href={`${root}music/${redirect()}${sanitise(artist)}`}>
						{romanise(correct_artist(artist))}
					</a>
				</td>
				{album && (
					<td class={['chartlist-album', 'custom-album-text']}>
						<a href={`${root}music/${redirect()}${sanitise(artist)}/${sanitise(album)}`} ref={albumLink}>
							{romanise(correct_item_by_artist(album, artist))}
						</a>
					</td>
				)}
			</div>
			<td class='more-button-wrapper'>
				<Button
					className='track-more-button'
					tooltip={tl(trans.more)}
					ref={more}
				>
					<Icon name={icons.more} />
					{tl(trans.more)}
				</Button>
			</td>
		</tr>
	) as TrackElement;

	// avoids checking
	elem[symbol] = true;

	let preview: ReactElement;

	if (useSettings.get('format_guest_features')) {
		trackName.current.classList.add('smart-title');
		artists.current.classList.add('smart-artist');

		const formatted = name_includes(name, artist);

		trackName.current.replaceChildren(
			<SmartTitle title={formatted.song_title} tags={formatted.song_tags} />
		);
		artists.current.replaceChildren(
			<SmartArtist artist={formatted.song_artist} guests={formatted.song_guests} />
		);

		preview = (
			<TrackMenuPreview
				image={art}
				name={formatted.song_title}
				artist={artists.current.querySelector('a')
					?.textContent}
				tags={formatted.song_tags}
				album={album}
			/>
		);
	}

	const menu_contents = (
		<MenuContents>
			{preview}
			<TrackMenu
				track={elem}
				name={trackName.current as HTMLAnchorElement}
				artist={romanise(correct_artist(artist))}
				album={romanise(correct_item_by_artist(album, artist))} // this is incorrect
				albumArtist={romanise(correct_artist(artist))} // this is incorrect
				alt={romanise(correct_item_by_artist(album, artist))}
				timestamp={undefined}
				albumLink={albumLink.current as HTMLAnchorElement}
				isAlbum={false}
				canEdit={false}
				canCopyScrobble={false}
				canDelete={false}
				isOwnProfile={false}
				user={auth.name}
				playContainer={undefined}
				bulkEdit={undefined}
				requestClose={close_menus}
			/>
		</MenuContents>
	);

	const menu = menu_tooltip(
		more.current,
		menu_contents,
	);
	const ctx_menu = context_menu_tooltip(
		elem,
		menu_contents,
	);

	function close_menus() {
		if (menu.is_mounted) menu.hide();
		if (ctx_menu.is_mounted) ctx_menu.hide();

		requestClose?.();
	}

	if (art && album) {
		hover_tooltip(
			coverArt.current,
			<Tooltip>{romanise(correct_item_by_artist(album, artist))}</Tooltip>
		);
	}

	return elem;
}
