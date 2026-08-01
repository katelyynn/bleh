import { log } from '@/build/log';

export const keys = {
	settings: 'bleh',
	auth: 'bleh_auth',
	auth_valid: 'bleh_auth_valid',
	bookmarked_images: 'bleh_bookmarked_images',
	news: 'bleh_changelog',
	news_expire: 'bleh_changelog_expire',
	hoshino: 'bleh_hoshino_cache',
	last_season_seen: 'bleh_last_season_seen',
	last_version_used: 'bleh_last_version_used',
	notices: 'bleh_notices',
	notices_expire: 'bleh_notices_expire',
	notices_seen: 'bleh_notices_seen',
	oracle: 'bleh_oracle_cache',
	profile_cache: 'bleh_profile_cache',
	profile_notes: 'bleh_profile_notes',
	update_checked_date: 'bleh_update_checked',
	update_next_check_date: 'bleh_update_next_check',
	update_required: 'bleh_update_required',
	update_to_version: 'bleh_update_to',
	sponsors: 'kat_sponsors',
	sponsors_expire: 'kat_sponsors_expire',
	sponsor_own_cache: 'kat_sponsor_cache',
	lotus_album_track: 'lotus_album_track',
	lotus_album_track_expire: 'lotus_album_track_expire',
	lotus_artist: 'lotus_artist',
	lotus_artist_expire: 'lotus_artist_expire',
	lotus_combined_artists: 'lotus_combined_artists',
	lotus_combined_artists_expire: 'lotus_combined_artists_expire',
	oracle_albums: 'oracle_albums',
	oracle_albums_expire: 'oracle_albums_expire',
	oracle_artists: 'oracle_artists',
	oracle_artists_expire: 'oracle_artists_expire',
	oracle_tracks: 'oracle_tracks',
	oracle_tracks_expire: 'oracle_tracks_expire',
	next_status_cafe_fetch: 'next_status_cafe_fetch',
	plot_data_history: 'bleh_plot_data_history',
};

// these are keys that were previously used,
// but can now be deleted to free space
const storage_keys_clean = [
	'bleh_profile_banners',
	'bleh_moderation',
	'bleh_update_paused',
	'bleh_update_paused_until',
	'bleh_cached_style',
	'bleh_cached_style_timeout',
];

export function clean_storage() {
	storage_keys_clean.forEach((key) => {
		const data = localStorage.getItem(key);

		if (data) {
			log(`removed ${key}`, 'storage', 'info', { data });
			localStorage.removeItem(key);
		}
	});
}
