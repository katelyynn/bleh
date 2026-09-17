/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ReactNode } from 'jsx-dom';
import { tl, trans } from '@/build/trans.ts';
import { SubText } from '@/components/text/sub.tsx';
import { InfoTip } from '@/components/text/tip.tsx';
import { WithChildren } from '@/types/generic.tsx';
import { PageHeaderDisc } from '@/components/music/header.tsx';
import { Icon } from '@/components/shared/icon.tsx';

interface PageHeaderProps {
	icon?: string;
	type: 'artist' | 'album' | 'track' | 'profile' | 'search' | 'tag' | 'home';
	combined?: boolean;
	name?: ReactNode;
	avatar?: ReactNode;
	children?: ReactNode;
	extra?: ReactNode;
}

export function PageHeader({
	icon,
	type,
	combined,
	name,
	avatar,
	children,
	extra,
}: PageHeaderProps) {
	const generic = !!avatar;
	const label = tl(trans[type]);

	return (
		<section class={['page-header', `for-${type}`]}>
			{avatar && (
				<div class='page-header-avatar-list'>
					{avatar}
					{['album', 'track'].includes(type) && <PageHeaderDisc />}
				</div>
			)}
			{icon && <PageHeaderIcon name={icon} />}
			<div class={['page-header-info', 'has-main-info']}>
				<div class='main-info'>
					{type != 'home'
						? !combined ? <SubText>{label}</SubText> : (
							<SubText>
								{tl(trans.artists)}
								<InfoTip>
									{tl(trans.artists_tooltip)}
								</InfoTip>
							</SubText>
						)
						: ''}
					{generic
						? (
							<>
								{children}
							</>
						)
						: (
							<h1
								class={[
									'page-header-title',
									'generic-page-title',
								]}
							>
								{name}
							</h1>
						)}
				</div>
				{extra}
			</div>
		</section>
	);
}

interface PageHeaderTitleProps {
	combined?: boolean;
	children: ReactNode;
}

export function PageHeaderTitle({
	combined,
	children,
}: PageHeaderTitleProps) {
	return (
		<div class='title-container' data-multi={String(combined)}>
			{children}
		</div>
	);
}

interface PageHeaderArtistProps {
	type?: 'track' | 'album';
	children: ReactNode;
}

export function PageHeaderArtist({
	type = 'track',
	children,
}: PageHeaderArtistProps) {
	return (
		<h2 class={['page-header-artist', `artist-for-${type}`]}>
			{children}
		</h2>
	);
}

interface PageHeaderIconProps {
	name: string;
}

function PageHeaderIcon({
	name,
}: PageHeaderIconProps) {
	return (
		<div class='page-header-icon'>
			<Icon name={name} />
		</div>
	);
}
