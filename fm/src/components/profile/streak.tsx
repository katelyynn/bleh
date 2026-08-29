import { Button } from '@/components/button/button.tsx';
import { Icon, icons } from '@/components/shared/icon.tsx';
import { lang, tl, trans } from '@/build/trans.ts';
import { hover_tooltip, Tooltip } from '@/components/shared/tooltips.tsx';
import { dialog } from '@/components/dialog/dialog.tsx';
import { api_key, page } from '@/build/page.ts';
import { SponsorUsername } from '@/components/user/name.tsx';
import { avatar } from '@/components/shared/avatar.tsx';
import { createRef } from 'jsx-dom';
import {
	return_artist_from_generic,
	return_artist_from_track,
} from '@/build/tools.ts';
import { log } from '@/build/log.ts';

interface streaks {
	artist?: StreakItem;
	album?: StreakItem;
	track?: StreakItem;
}

export function get_profile_streak(
	indicator: HTMLButtonElement,
	panel: HTMLDivElement,
) {
	if (!assess_if_streak_exists(panel)) {
		indicator.replaceWith(
			<ProfileStreak />,
		);
		return;
	}

	const url =
		`https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${page.name}&api_key=${api_key}&format=json&limit=100`;

	let streaks: streaks = {};

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

			streaks = calculate_streak(streaks, tracks);

			console.info('streaks', streaks, tracks);

			indicator.replaceWith(
				<ProfileStreak
					artist={streaks.artist}
					album={streaks.album}
					track={streaks.track}
				/>,
			);
		})
		.catch(() => {
			return;
		});
}

function assess_if_streak_exists(panel: HTMLDivElement) {
	const tracks = Array.from(panel.querySelectorAll(
		'.chartlist-row:not(.chartlist__placeholder-row, .chartlist-row--interlist-ad)',
	)) as HTMLDivElement[];

	const streaks = calculate_streak({}, tracks, true);

	if (!streaks.artist) {
		log('assessed no streak on page, will not continue', 'streak');
		return false;
	}

	log('assessed valid streak on page, will not continue', 'streak');
	return true;
}

function calculate_streak(
	streaks: streaks,
	tracks: LastfmRecentTrack[] | HTMLDivElement[],
	elements = false,
) {
	const latest = parse_track(tracks[0], elements);

	let artist_active = true;
	let album_active = !!latest.album;
	let track_active = true;

	for (let i = 1; i < tracks.length; i++) {
		const track = parse_track(tracks[i], elements);

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

	return streaks;
}

function parse_track(
	track: LastfmRecentTrack | HTMLDivElement,
	element = false,
) {
	if (element) return parse_recent_track_element(track as HTMLDivElement);

	return parse_recent_track(track as LastfmRecentTrack);
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

function parse_recent_track_element(track: HTMLDivElement) {
	const name = track.querySelector(
		'.chartlist-name a:not(.offset-section-anchor)',
	)!;
	const artist = return_artist_from_track(name!.getAttribute('href'), false);
	const album = track.querySelector('.chartlist-album a');

	return {
		artist,
		album: album ? album.textContent.trim() : undefined,
		name: name.textContent.trim(),
	};
}

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
	ref?: ReturnType<typeof createRef<HTMLButtonElement>>;
	loading?: boolean;
	artist?: StreakItem;
	album?: StreakItem;
	track?: StreakItem;
}

export function ProfileStreak({
	ref,
	loading,
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
			<Button className='profile-streak profile-streak-empty' ref={ref}>
				{!loading
					? <Icon name={icons.streak} />
					: <Icon name={icons.spinner} />}
				<span class='streak-value'>
					{tl(trans.streak, {
						v: <span class='streak-count'>0</span>,
					})}
				</span>
			</Button>
		);

		if (!loading) {
			hover_tooltip(
				elem,
				<Tooltip>{tl(trans.start_streak)}</Tooltip>,
			);
		}

		return elem;
	}

	const elem = (
		<Button
			className='profile-streak'
			colourful
			ref={ref}
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
			<div class='streak-icon'>
				<Icon name={icons.streak} identifier='streak-icon' />
			</div>
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
