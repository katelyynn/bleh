import { useSettings } from "@/page";
import { createRef, ReactNode } from "jsx-dom";
import { correct_artist, correct_item_by_artist, name_includes } from "../music/lotus";
import { SmartArtist, SmartTitle } from "../music/smart_title";
import { root } from "@/build/page";
import { redirect } from "../music/music";
import { romanise, sanitise } from "@/build/tools";
import { symbol } from "@/main";

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
}

export function Track({
	name,
	artist,
	album,
	art,
	url,
	active,
	margin = true
}: TrackProps) {
	const track_name = createRef();
	const artists = createRef();

	const elem = (
		<tr class={[
			'chartlist-row',
			active && 'chartlist-row--now-scrobbling',
			!margin && 'no-side-margin'
		]} data-show-album-text='true' data-album-name-location='column' data-has-bar='false'>
			<td class='chartlist-image'>
				<a href={url} class='cover-art'>
					{art ? (
						<img src={art} alt={name} loading='lazy' />
					) : (
						<img class='missing-track' />
					)}
				</a>
			</td>
			<div class='track-info' data-track-layout='column' data-album-name-location='column'>
				<td class='chartlist-name'>
					<a href={url} ref={track_name}>
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
						<a href={`${root}music/${redirect()}${sanitise(artist)}/${sanitise(album)}`}>
							{romanise(correct_item_by_artist(album, artist))}
						</a>
					</td>
				)}
			</div>
		</tr>
	);

	// avoids checking
	elem[symbol] = true;

	if (useSettings.get('format_guest_features')) {
		track_name.current.classList.add('smart-title');
		artists.current.classList.add('smart-artist');

		const formatted = name_includes(name, artist);

		track_name.current.replaceChildren(
			<SmartTitle title={formatted.song_title} tags={formatted.song_tags} />
		);
		artists.current.replaceChildren(
			<SmartArtist artist={formatted.song_artist} guests={formatted.song_guests} />
		);
	}

	return elem;
}
