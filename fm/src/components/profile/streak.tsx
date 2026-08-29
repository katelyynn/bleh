import { Button } from '@/components/button/button.tsx';
import { Icon, icons } from '@/components/shared/icon.tsx';
import { lang, tl, trans } from '@/build/trans.ts';
import { hover_tooltip, Tooltip } from '@/components/shared/tooltips.tsx';
import { dialog } from '@/components/dialog/dialog.tsx';
import { page } from '@/build/page.ts';
import { SponsorUsername } from '@/components/user/name.tsx';
import { avatar } from '@/components/shared/avatar.tsx';

export function get_profile_streak() {
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
					0
					<span class='streak-x'>x</span>
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
				{highest.toLocaleString(lang)}
				<span class='streak-x'>{highest >= 100 ? '+' : 'x'}</span>
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
