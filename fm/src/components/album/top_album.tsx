import { correct_generic_combo_no_artist_child } from '@/components/music/lotus.tsx';
import { ReactNode } from 'jsx-dom';

interface TopAlbumProps {
	image?: string;
	name: string;
	artist: string;
	listeners?: string | ReactNode;
	date?: string;
	tracks?: string;
	href: string;
}

export function TopAlbum({
	image,
	name,
	artist,
	listeners,
	date,
	tracks,
	href,
}: TopAlbumProps) {
	const elem = (
		<li class='artist-top-albums-item-wrap'>
			<div
				class={[
					'artist-top-albums-item',
					'js-link-block',
					'link-block',
				]}
				data-kate-processed='true'
			>
				<h3 class='artist-top-albums-item-name'>
					<a class={['link-block-target']} href={href}>
						{name}
					</a>
				</h3>
				<meta itemProp='byArtist' content={artist} />
				{listeners && (
					<p
						class={[
							'artist-top-albums-item-aux-text',
							'artist-top-albums-item-listeners',
						]}
					>
						{listeners}
					</p>
				)}
				{(date || tracks) && (
					<p class='artist-top-albums-item-aux-text'>
						{date}
						{tracks && ` · ${tracks}`}
					</p>
				)}
				<div class='media-item'>
					<span class={['artist-top-albums-item-image', 'cover-art']}>
						{image
							? <img src={image} alt={name} loading='lazy' />
							: <img class='missing-album' />}
					</span>
				</div>
				<a
					class={[
						'js-link-block-cover-link',
						'link-block-cover-link',
					]}
					href={href}
				/>
			</div>
		</li>
	);

	correct_generic_combo_no_artist_child(elem, 'artist-top-albums-item');

	return elem;
}
