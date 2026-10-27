/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ReactElement, ReactNode } from 'jsx-dom';
import { tl, trans } from '@/build/trans.ts';
import { SubText } from '@/components/text/sub.tsx';
import { InfoTip } from '@/components/text/tip.tsx';
import { WithChildren } from '@/types/generic.tsx';
import { PageHeaderDisc } from '@/components/music/header.tsx';
import { Icon } from '@/components/shared/icon.tsx';
import { useSettings } from '@/page.tsx';
import { ff } from '@/components/settings/sku.ts';
import { page, root } from '@/build/page.ts';
import { hover_tooltip, Tooltip } from '../shared/tooltips';

interface PageHeaderProps {
	icon?: string;
	type: 'artist' | 'album' | 'track' | 'profile' | 'search' | 'tag' | 'home' | 'event';
	combined?: boolean;
	name?: ReactNode;
	avatar?: ReactNode;
	position?: string;
	children?: ReactNode;
	extra?: ReactNode;
}

type PageHeaderElement = HTMLDivElement & {
	stub: ReactElement;
};

export function PageHeader({
	icon,
	type,
	combined,
	name,
	avatar,
	position,
	children,
	extra,
}: PageHeaderProps) {
	const generic = !!avatar;
	const label = tl(trans[type]);

	const refresh = ff('header_refresh');

	const elem = (
		<section
			class={['page-header', `for-${type}`, refresh && 'header-refresh']}
		>
			{avatar && (
				<div
					class={[
						'page-header-avatar-list',
						refresh && 'header-refresh',
					]}
				>
					{avatar}
					{['album', 'track'].includes(type) && <PageHeaderDisc />}
					{position && (
						<PageHeaderPosition text={position} />
					)}
				</div>
			)}
			{icon && <PageHeaderIcon name={icon} />}
			<div
				class={[
					'page-header-info',
					'has-main-info',
					refresh && 'header-refresh',
				]}
			>
				<div class={['main-info', refresh && 'header-refresh']}>
					{type != 'home'
						? !combined
							? (
								<SubText
									className={`header-label ${refresh && 'header-refresh'
										}`}
								>
									{label}
								</SubText>
							)
							: (
								<SubText
									className={`header-label ${refresh && 'header-refresh'
										}`}
								>
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
									refresh && 'header-refresh',
								]}
							>
								{name}
							</h1>
						)}
				</div>
				{extra}
			</div>
		</section>
	) as PageHeaderElement;

	function update() {
		elem.setAttribute('data-theme', useSettings.get('theme') as string);
	}

	update();
	useSettings.on('theme', update);

	Object.defineProperty(elem, 'stub', {
		get() {
			return (
				<div
					class={[
						'page-header-stub',
						`for-${type}`,
						'page-header',
						refresh && 'header-refresh',
					]}
				/>
			);
		},
	});

	return elem;
}

export function append_header(head: PageHeaderElement) {
	const refresh = ff('header_refresh');

	if (refresh) {
		page.structure.side!.insertBefore(
			head,
			page.structure.side!.firstElementChild,
		);
		page.structure.container!.insertBefore(
			head.stub,
			page.structure.container!.firstElementChild,
		);
	} else {
		page.structure.container!.insertBefore(
			head,
			page.structure.container!.firstElementChild,
		);
	}
}

interface PageHeaderTitleProps {
	combined?: boolean;
	children: ReactNode;
}

export function PageHeaderTitle({
	combined,
	children,
}: PageHeaderTitleProps) {
	const refresh = ff('header_refresh');

	const elem = (
		<div
			class={['title-container', refresh && 'header-refresh']}
			data-multi={String(combined)}
		>
			{children}
		</div>
	);

	function update() {
		elem.setAttribute('data-theme', useSettings.get('theme') as string);
	}

	update();
	useSettings.on('theme', update);

	return elem;
}

interface PageHeaderPositionProps {
	text: string;
}

export function PageHeaderPosition({
	text
}: PageHeaderPositionProps) {
	const val = text.trim().replace('#', '');

	const elem = (
		<a class='chart-position' href={`${root}charts`}>
			<span class='chart-position-hash'>
				#
			</span>
			<span class='chart-position-number'>
				{val.split('').map(num => (
					<PositionNumber number={Number(num)} />
				))}
			</span>
		</a>
	);

	hover_tooltip(
		elem,
		<Tooltip>{tl(trans.chart_position, { v: `#${val}` })}</Tooltip>
	);


	return elem;
}

interface PositionNumberProps {
	number: number;
}

export function PositionNumber({
	number
}: PositionNumberProps) {
	return (
		<span class={['position-number', 'colourful']} data-number={String(number)}>
			{number}
		</span>
	)
}

interface PageHeaderArtistProps {
	type?: 'track' | 'album';
	children: ReactNode;
}

export function PageHeaderArtist({
	type = 'track',
	children,
}: PageHeaderArtistProps) {
	const refresh = ff('header_refresh');

	const elem = (
		<h2
			class={[
				'page-header-artist',
				`artist-for-${type}`,
				refresh && 'header-refresh',
			]}
		>
			{children}
		</h2>
	);

	function update() {
		elem.setAttribute('data-theme', useSettings.get('theme') as string);
	}

	update();
	useSettings.on('theme', update);

	return elem;
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
