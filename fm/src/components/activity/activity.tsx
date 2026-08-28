/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Icon, icons } from '@/components/shared/icon.tsx';
import { tl, trans } from '@/build/trans.ts';
import { DateTime } from 'luxon';
import { root } from '@/build/page.ts';
import { redirect } from '@/components/music/music.js';
import { romanise, sanitise } from '@/build/tools.ts';
import {
	correct_artist,
	correct_item_by_artist,
} from '@/components/music/lotus.tsx';
import { WithChildren } from '@/types/generic.tsx';

interface ActivityItemProps {
	type: activity_type;
	involved: party[];
	context: string;
	date: string;
}

type activity_type =
	| 'love'
	| 'unlove'
	| 'bookmark'
	| 'unbookmark'
	| 'obsess'
	| 'unobsess'
	| 'shout'
	| 'wiki'
	| 'image_upload'
	| 'image_star'
	| 'install_bwaa'
	| 'update_bwaa'
	| 'install_bleh'
	| 'update_bleh';

interface party {
	name: string;
	type: 'user' | 'artist' | 'album' | 'track' | 'tag' | 'bwaa' | 'bleh';
	sister?: string;
}

export function ActivityItem({
	type,
	involved,
	context,
	date,
}: ActivityItemProps) {
	let icon_name;

	switch (type) {
		case 'love':
			icon_name = icons.heart_fill;
			break;
		case 'unlove':
			icon_name = icons.heart;
			break;
		case 'bookmark':
			icon_name = icons.bookmark_fill;
			break;
		case 'unbookmark':
			icon_name = icons.bookmark;
			break;
		case 'obsess':
		case 'unobsess':
			icon_name = icons.obsession;
			break;
		case 'shout':
			icon_name = icons.shoutbox;
			break;
		case 'wiki':
			icon_name = icons.wiki;
			break;
		case 'image_upload':
			icon_name = icons.gallery;
			break;
		case 'image_star':
			icon_name = icons.star_fill;
			break;
		case 'update_bwaa':
		case 'update_bleh':
		case 'install_bwaa':
		case 'install_bleh':
			icon_name = icons.download;
			break;
	}

	return (
		<a class='activity-item' href={context}>
			<div class={['activity-icon', `activity-icon-${type}`]}>
				<Icon name={icon_name} />
			</div>
			<div class='activity-info'>
				<div class='activity-top'>
					<span class='activity-type'>
						{tl(trans.activity.listing[type])}
					</span>
					<span class='activity-date'>
						{DateTime.fromISO(date).toRelative({ style: 'short' })}
					</span>
				</div>
				<div class='activity-name'>
					{involved.map((party, i) => (
						<>
							<ActivityInvolved involved={party} />
							{i < involved.length - 1 && ', '}
						</>
					))}
				</div>
			</div>
		</a>
	);
}

export function ActivityList({
	children,
}: WithChildren) {
	return (
		<div class='activity-list'>
			{children}
		</div>
	);
}

interface ActivityInvolvedProps {
	involved: party;
}

export function ActivityInvolved({
	involved,
}: ActivityInvolvedProps) {
	let link;

	switch (involved.type) {
		case 'user':
			link = `${root}user/${involved.name}`;
			break;
		case 'artist':
			link = `${root}music/${redirect()}${sanitise(involved.name)}`;
			break;
		case 'album':
			link = `${root}music/${redirect()}${sanitise(involved.sister)}/${
				sanitise(involved.name)
			}`;
			break;
		case 'track':
			link = `${root}music/${redirect()}${sanitise(involved.sister)}/_/${
				sanitise(involved.name)
			}`;
			break;
		case 'tag':
			link = `${root}tag/${sanitise(involved.name)}`;
			break;
		case 'bwaa':
			link = `https://yuzu.pet/~bwaa`;
			break;
		case 'bleh':
			link = `${root}bleh`;
			break;
	}

	let name = involved.name;
	let sister = involved.sister;

	if (involved.type == 'artist') {
		name = romanise(correct_artist(involved.name));
	} else if (['album', 'track'].includes(involved.type)) {
		name = romanise(correct_item_by_artist(involved.name, involved.sister));
		sister = romanise(correct_artist(involved.sister));
	}

	return (
		<a class='wiki-link icon' data-link-type={involved.type} href={link}>
			{name}
		</a>
	);
}
