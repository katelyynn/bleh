import { log } from '@/build/log.ts';

export function non_pro_edit({
	pre_track,
	pre_artist,
	pre_album,
	pre_album_artist,
	timestamp,
}: {
	pre_track: string;
	pre_artist: string;
	pre_album?: string;
	pre_album_artist?: string;
	timestamp: number;
}) {
	log('opening non-pro edit dialog', 'scrobble', 'info', {
		pre_track,
		pre_artist,
		pre_album,
		pre_album_artist,
		timestamp,
	});
}
