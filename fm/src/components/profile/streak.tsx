import { Button } from '@/components/button/button.tsx';
import { Icon, icons } from '@/components/shared/icon.tsx';
import { lang, tl, trans } from '@/build/trans.ts';
import { hover_tooltip, Tooltip } from '@/components/shared/tooltips.tsx';
import { dialog } from '@/components/dialog/dialog.tsx';
import { api_key, auth, page } from '@/build/page.ts';
import { SponsorUsername } from '@/components/user/name.tsx';
import { avatar } from '@/components/shared/avatar.tsx';
import { createRef } from 'jsx-dom';
import {
	return_artist_from_generic,
	return_artist_from_track,
} from '@/build/tools.ts';
import { log } from '@/build/log.ts';
import { correct_item_by_artist } from '@/components/music/lotus.tsx';
import { DateTime } from 'luxon';

interface streaks {
	artist?: StreakItem;
	album?: StreakItem;
	track?: StreakItem;
}

export function get_profile_streak(
	indicator: ReturnType<typeof createRef<HTMLButtonElement>>,
	panel: HTMLDivElement,
) {
	if (!assess_if_streak_exists(panel)) {
		if (page.name == auth.name) {
			indicator.current!.replaceWith(
				<ProfileStreak self={page.name == auth.name} ref={indicator} />,
			);
			return;
		}

		indicator.current!.setAttribute('data-hidden', 'true');
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

			indicator.current!.replaceWith(
				<ProfileStreak
					artist={streaks.artist}
					album={streaks.album}
					track={streaks.track}
					ref={indicator}
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
					count: 1,
				};

				streaks.artist.count++;
				streaks.artist.date = track.date;
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
					count: 1,
				};

				streaks.album.count++;
				streaks.album.date = track.date;
			} else {
				album_active = false;
			}
		}

		if (track_active) {
			if (
				track.artist == latest.artist &&
				track.name == latest.name
			) {
				streaks.track ??= {
					name: latest.name,
					count: 1,
				};

				streaks.track.count++;
				streaks.track.date = track.date;
			} else {
				track_active = false;
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
		date: '',
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
	date?: string;
}

interface ProfileStreakProps {
	ref?: ReturnType<typeof createRef<HTMLButtonElement>>;
	loading?: boolean;
	self?: boolean;
	artist?: StreakItem;
	album?: StreakItem;
	track?: StreakItem;
}

export function ProfileStreak({
	ref,
	loading,
	self = true,
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
					? <Icon name={icons.streak_empty} />
					: <Icon name={icons.spinner} />}
				<span class='streak-value'>
					{tl(trans.streak, {
						v: <span class='streak-count'>0</span>,
					})}
				</span>
			</Button>
		);

		if (!loading && self) {
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
									<div class='streak-big-icon'>
										<Icon name={icons.streak} />
									</div>
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
										<SponsorUsername vertical>
											{page.name}
										</SponsorUsername>
									</strong>
									<div class='streak-values'>
										{artist && (
											<StreakValue
												type='artist'
												label={artist.name}
												value={artist.count}
												max={highest}
											/>
										)}
										{album && (
											<StreakValue
												type='album'
												label={correct_item_by_artist(
													album.name,
													artist!.name,
												)}
												value={album.count}
												max={highest}
											/>
										)}
										{track && (
											<StreakValue
												type='track'
												label={correct_item_by_artist(
													track.name,
													artist!.name,
												)}
												value={track.count}
												max={highest}
											/>
										)}
									</div>
									{val.date && (
										<p class='streak-since'>
											{tl(trans.streak_started, {
												v: DateTime.fromSeconds(
													Number(val.date),
												).toRelative(),
											})}
										</p>
									)}
								</div>
							</hyper-card>
						</>
					),
					type: 'badge',
					colourful: true,
					colourful_bg: true,
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

	if (val.date) {
		hover_tooltip(
			elem,
			<Tooltip>
				{tl(trans.streak_started, {
					v: DateTime.fromSeconds(
						Number(val.date),
					).toRelative(),
				})}
			</Tooltip>,
		);
	}

	return elem;
}

interface StreakValueProps {
	type: 'artist' | 'album' | 'track';
	label: string;
	value: number;
	max: number;
}

function StreakValue({
	type,
	label,
	value,
	max,
}: StreakValueProps) {
	return (
		<div class='streak-value-container'>
			<div class='streak-value-top'>
				<div class='streak-value-label'>
					<Icon name={icons[type]} />
					{label}
				</div>
				<div class='streak-value-count'>
					{value}
				</div>
			</div>
			<StreakBar value={value} max={max} />
		</div>
	);
}

interface StreakBarProps {
	value: number;
	max: number;
}

function StreakBar({
	value,
	max,
}: StreakBarProps) {
	return (
		<div class='streak-bar'>
			<div
				class='streak-bar-fill'
				style={{ width: `${(value / max) * 100}%` }}
			/>
		</div>
	);
}
