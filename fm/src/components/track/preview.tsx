import { song_tag, SongTags } from '@/components/track/song_tag.tsx';

interface TrackMenuPreviewProps {
	type?: 'track' | 'album';
	image?: string;
	name: string;
	tags?: song_tag[];
	artist: string;
	album?: string;
	timestamp?: string;
}

export function TrackMenuPreview({
	type = 'track',
	image,
	name,
	tags,
	artist,
	album,
	timestamp,
}: TrackMenuPreviewProps) {
	return (
		<div class='track-preview'>
			<div class='track-preview-image'>
				<div class='inner-image'>
					{image
						? <img src={image} alt={name} />
						: <img class='missing-track' />}
				</div>
			</div>
			<div class='track-preview-info'>
				<h5 class={['track-preview-text', 'track-preview-title']}>
					{name}
				</h5>
				<p class={['track-preview-text', 'track-preview-title']}>
					{artist}
				</p>
				{tags && <SongTags tags={tags} />}
				{(type == 'track' && album) && (
					<p class={['track-preview-text', 'track-preview-album']}>
						{album}
					</p>
				)}
				{timestamp && (
					<p
						class={[
							'track-preview-text',
							'track-preview-timestamp',
						]}
					>
						{timestamp}
					</p>
				)}
			</div>
		</div>
	);
}
