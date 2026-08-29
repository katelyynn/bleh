import { Button } from '@/components/button/button.tsx';
import { Icon, icons } from '@/components/shared/icon.tsx';
import { lang, tl, trans } from '@/build/trans.ts';
import { hover_tooltip, Tooltip } from '@/components/shared/tooltips.tsx';
import { dialog } from '@/components/dialog/dialog.tsx';
import { api_key, page } from '@/build/page.ts';
import { SponsorUsername } from '@/components/user/name.tsx';
import { avatar } from '@/components/shared/avatar.tsx';

interface streaks {
	artist?: StreakItem;
	album?: StreakItem;
	track?: StreakItem;
}

export function get_profile_streak() {
	const url =
		`https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${page.name}&api_key=${api_key}&format=json&limit=100`;

	const streaks: streaks = {};

	fetch(url)
		.then((res) => {
			if (!res.ok) {
				throw new Error();
			}

			return res.json();
		})
		.then((data) => {
			const tracks = data.recenttracks.track;
			if (!tracks) throw new Error();

			const latest = parse_recent_track(tracks[0]);

			let artist_active = true;
			let album_active = !!latest.album;
			let track_active = true;

			for (let i = 1; i < tracks.length; i++) {
				const track = parse_recent_track(tracks[i]);

				console.info('streaks', track, latest);

				if (artist_active) {
					if (track.artist == latest.artist) {
						streaks.artist ??= {
							name: latest.artist,
							count: 0,
						};

						streaks.artist.count++;
					} else {
						artist_active = false;
						break;
					}
				}

				if (album_active) {
					if (
						track.artist == latest.artist &&
						track.album == latest.album
					) {
						streaks.album ??= {
							name: latest.album!,
							count: 0,
						};

						streaks.album.count++;
					} else {
						album_active = false;
						delete streaks.album;
					}
				}

				if (track_active) {
					if (
						track.artist == latest.artist &&
						track.name == latest.name
					) {
						streaks.track ??= {
							name: latest.name,
							count: 0,
						};

						streaks.track.count++;
					} else {
						track_active = false;
						delete streaks.track;
					}
				}
			}

			console.info('streaks', streaks, tracks, latest);
		})
		.catch(() => {
			return;
		});
}

type LastfmRecentTrack = {
	artist: {
		mbid?: string;
		'#text': string;
	};
	streamable: string;
	image: {
		size: 'small' | 'medium' | 'large' | 'extralarge';
		'#text': string;
	}[];
	mbid?: string;
	album?: {
		mbid?: string;
		'#text': string;
	};
	name: string;
	url: string;
	'@attr'?: { nowplaying: string };
	date?: {
		uts: string;
		'#text': string;
	};
};

function parse_recent_track(track: LastfmRecentTrack) {
	return {
		artist: track.artist['#text'],
		album: track.album?.['#text'],
		name: track.name,
		date: track.date?.uts,
		url: track.url,
		image: track.image[0]['#text'],
	};
}

interface StreakItem {
	name: string;
	count: number;
}

interface ProfileStreakProps {
	artist?: StreakItem;
	album?: StreakItem;
	track?: StreakItem;
}

export function ProfileStreak({
	artist,
	album,
	track,
}: ProfileStreakProps) {
	const highest = Math.max(
		artist?.count || 0,
		album?.count || 0,
		track?.count || 0,
	);

	const val = artist?.count == highest
		? artist
		: album?.count == highest
		? album
		: track?.count
		? track
		: undefined;
	if (!val) {
		const elem = (
			<Button className='profile-streak profile-streak-empty'>
				<Icon name={icons.streak} identifier='streak-icon' />
				<span class='streak-value'>
					{tl(trans.streak, {
						v: <span class='streak-count'>0</span>,
					})}
				</span>
			</Button>
		);

		hover_tooltip(
			elem,
			<Tooltip>{tl(trans.start_streak)}</Tooltip>,
		);

		return elem;
	}

	const elem = (
		<Button
			className='profile-streak'
			colourful
			onClick={() => {
				dialog({
					id: 'streak',
					title: 'streak',
					body: (
						<>
							<hyper-card className='streak-hyper-card'>
								<div className='streak-window'>
									<Icon name={icons.streak} />
									<div class={['streak-avatar', 'avatar']}>
										<img
											src={avatar(
												page.avatar,
												'avatar300s',
											)}
											alt={page.name}
										/>
									</div>
									<strong class='streak-username'>
										<SponsorUsername>
											{page.name}
										</SponsorUsername>
									</strong>
								</div>
							</hyper-card>
						</>
					),
					type: 'badge',
				});
			}}
		>
			<Icon name={icons.streak} identifier='streak-icon' />
			<span class='streak-value'>
				{tl(highest >= 100 ? trans.streak_high : trans.streak, {
					v: (
						<span class='streak-count'>
							{highest.toLocaleString(lang)}
						</span>
					),
				})}
			</span>
		</Button>
	);

	hover_tooltip(
		elem,
		<Tooltip>
			{artist?.count} artist, {album?.count} album, {track?.count} track
		</Tooltip>,
	);

	return elem;
}
