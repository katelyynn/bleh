/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { auth, page, root } from '@/build/page';
import { redirect } from '../music/music';
import { copy, sanitise } from '@/build/tools';
import { LoadingData } from '../loading/loading';
import { tl, trans } from '@/build/trans';
import { MenuContents } from '../menu/menu';
import { Button } from '../button/button';
import { Icon, icons } from '../shared/icon';
import { SubText } from '../text/sub';
import { SeeMore } from '../text/see_more';

export function taste_artist(artist: string) {
	return `<a class="taste-artist" href="${root}music/${redirect()}${sanitise(artist)
		}">${artist}</a>`;
}

interface TasteArtistProps {
	artist: string;
}

export function TasteArtist({
	artist,
}: TasteArtistProps) {
	return (
		<a
			class='taste-artist'
			href={`${root}music/${redirect()}${sanitise(artist)}`}
		>
			{artist}
		</a>
	);
}

export type profileTaste = 'super' | 'very_high' | 'high' | 'medium' | 'low' | 'very_low' | '';

interface ProfileTasteProps {
	tier: profileTaste,
	formal: string;
	percentage: string;
	artists: string[];
	valentine?: boolean;
}

export function ProfileTaste({
	tier,
	formal,
	percentage,
	artists,
	valentine
}: ProfileTasteProps) {
	if (tier == '') {
		return (
			<LoadingData type='failed'>
				{tl(trans.missing_component)}
			</LoadingData>
		);
	}

	const taste_menu = (
		<MenuContents>
			<Button
				menu
				href={`${root}user/${auth.name}/library/music/${redirect()}${sanitise(artists[0])
					}`}
			>
				<Icon name={icons.user} />
				{artists[0]}
				<SubText>({tl(trans.you)})</SubText>
			</Button>
			<Button
				menu
				href={`${root}user/${page.name}/library/music/${redirect()}${sanitise(artists[0])
					}`}
			>
				<Icon name={icons.users} />
				{artists[0]}
				<SubText>({tl(trans.other)})</SubText>
			</Button>
			{artists[1] && (
				<>
					<Button
						menu
						href={`${root}user/${auth.name}/library/music/${redirect()}${sanitise(artists[1])
							}`}
					>
						<Icon name={icons.user} />
						{artists[1]}
						<SubText>({tl(trans.you)})</SubText>
					</Button>
					<Button
						menu
						href={`${root}user/${page.name}/library/music/${redirect()}${sanitise(artists[1])
							}`}
					>
						<Icon name={icons.users} />
						{artists[1]}
						<SubText>({tl(trans.other)})</SubText>
					</Button>
				</>
			)}
			{artists[2] && (
				<>
					<Button
						menu
						href={`${root}user/${auth.name}/library/music/${redirect()}${sanitise(artists[2])
							}`}
					>
						<Icon name={icons.user} />
						{artists[2]}
						<SubText>({tl(trans.you)})</SubText>
					</Button>
					<Button
						menu
						href={`${root}user/${page.name}/library/music/${redirect()}${sanitise(artists[2])
							}`}
					>
						<Icon name={icons.users} />
						{artists[2]}
						<SubText>({tl(trans.other)})</SubText>
					</Button>
				</>
			)}
			<div class='sep' />
			<Button
				menu
				onClick={() => {
					copy(tl(trans.generic_lastfm_compatibility_message, {
						u: page.name,
						r: formal,
						a: artists.join(tl(trans.comma) as string),
					}));
				}}
			>
				<Icon name={icons.copy} />
				{tl(trans.copy)}
			</Button>
		</MenuContents>
	);

	const taste_wrap = (
		<section class={['profile-taste', 'colourful']} data-taste={tier}>
			<div class='profile-taste-texture'>
				<Icon />
				<Icon />
				<Icon />
			</div>
			<div class='profile-taste-top'>
				<div class={['profile-taste-top-badges']}>
					<div class='profile-taste-top-icon'>
						<Icon />
						{(!['super', 'very_low'].includes(tier) && (
							<Icon className='profile-taste-top-icon-back' />
						))}
					</div>
					<div class='profile-taste-top-badge-percent'>
						{percentage.slice(0, -1)}
						<span class='percent-marker'>%</span>
					</div>
					<div class='profile-taste-top-badge-formal'>
						{formal}
					</div>
				</div>
				<div class={['profile-taste-top-bar']}>
					<div
						class={['profile-taste-top-bar-fill']}
						style={{ width: percentage }}
					/>
				</div>
			</div>
			<div class='profile-taste-middle'>
				<div class='profile-taste-artists'>
					{tl(trans.you_share_artists_with, {
						artists: (
							<>
								{artists[0] && (
									<TasteArtist
										artist={artists[0]}
									/>
								)}
								{artists[1] && (
									<>
										{tl(trans.comma)}
										<TasteArtist
											artist={artists[1]}
										/>
									</>
								)}
								{artists[2] && (
									<>
										{tl(trans.and)}
										<TasteArtist
											artist={artists[2]}
										/>
									</>
								)}
							</>
						),
					})}
				</div>
			</div>
			{artists.length > 0 && (
				<div class='profile-taste-lower'>
					<SeeMore opens={taste_menu}>
						{tl(trans.view_details)}
					</SeeMore>
				</div>
			)}
		</section>
	);

	return taste_wrap;
}
