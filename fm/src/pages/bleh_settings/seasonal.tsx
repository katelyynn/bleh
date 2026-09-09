/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { html, render } from 'lighterhtml';
import { register_skip_to } from './bleh_settings';
import { trans } from '@/build/trans';
import { tl } from '@/build/trans';
import { page } from '@/build/page';
import { DateTime } from 'luxon';
import { setting } from '@/components/settings/settings';
import { settings } from '@/build/config';
import { season } from '@/components/seasonal';
import { log } from '@/build/log';
import { time_tooltip } from '@/components/date/time';
import { Icon, icons } from '@/components/shared/icon.tsx';
import { PanelHead } from '@/components/text/head.tsx';
import { SubText } from '@/components/text/sub.tsx';
import { SettingGroup } from '@/components/settings/group.tsx';
import { SettingSwitch } from '@/components/settings/provider/switch.tsx';
import { SettingInfo } from '@/components/settings/provider/info.tsx';
import { useSettings } from '@/page.ts';
import { SettingRadio } from '@/components/settings/provider/radio.tsx';
import { SettingCheckbox } from '@/components/settings/provider/checkbox.tsx';

export function seasonal() {
	register_skip_to([]);

	const state = page.state.seasons;

	page.structure.main!.replaceChildren(
		<>
			<section class='bleh--panel'>
				<PanelHead icon={icons.seasonal}>
					{tl(trans.seasonal_timeline)}
				</PanelHead>
				<SeasonalTimeline
					current={state.current}
					prev={state.prev}
					next={state.next}
					now={state.now}
				/>
				<SettingGroup>
					<SettingSwitch bind='seasonal' />
					<SettingInfo name={tl(trans.current_season)}>
						<div
							class={['icon-combo', 'colourful']}
							data-season={state.current
								? state.current.id
								: 'none'}
						>
							<Icon />
							<p>
								{tl(
									trans.seasonal.listing[
										state.current
											? state.current.id
											: 'none'
									],
								)}
							</p>
						</div>
					</SettingInfo>
					{state.current
						? (
							<>
								<SettingInfo name={tl(trans.started)}>
									{time_tooltip(
										<p>
											{state.current.start.toRelative({
												base: state.now,
											})}
										</p>,
										state.current.start,
									)}
								</SettingInfo>
								<SettingInfo name={tl(trans.ends_in)}>
									{time_tooltip(
										<p>
											{state.current.end.toRelative({
												base: state.now,
											})}
										</p>,
										state.current.end,
									)}
								</SettingInfo>
							</>
						)
						: useSettings.get('seasonal') && (
							<SettingInfo name={tl(trans.next_in)}>
								{time_tooltip(
									<p>
										{state.next!.start.toRelative({
											base: state.now,
										})}
									</p>,
									state.next!.start,
								)}
							</SettingInfo>
						)}
				</SettingGroup>
			</section>
			<section class='bleh--panel'>
				<PanelHead icon={icons.snow}>
					{tl(trans.particles)}
				</PanelHead>
				<SettingGroup>
					<SettingRadio bind='seasonal_particles' />
					<SettingCheckbox bind='seasonal_particles_fps' />
				</SettingGroup>
			</section>
			<section class='bleh--panel'>
				<PanelHead icon={icons.effects}>
					{tl(trans.effects)}
				</PanelHead>
				<SettingGroup>
					<SettingCheckbox bind='seasonal_overlays' />
				</SettingGroup>
			</section>
		</>,
	);
}

interface SeasonalTimelineProps {
	current: season | null;
	prev?: season;
	next?: season;
	now: DateTime;
}

export function SeasonalTimeline({
	current,
	prev,
	next,
	now,
}: SeasonalTimelineProps) {
	if (!settings.seasonal || !prev || !next) return;

	return (
		<div class='seasonal-timeline-wrap'>
			<div class='seasonal-timeline'>
				<SeasonalTimelineItem season={prev} type='prev' now={now} />
				{current
					? (
						<SeasonalTimelineItem
							season={current}
							type='current'
							now={now}
						/>
					)
					: (
						<div
							class={['seasonal-timeline-item']}
							data-season-type='current'
						>
							<div
								class={['seasonal-icon', 'colourful']}
								data-season='none'
							>
								<Icon data-season='none' />
							</div>
							<strong
								class={['seasonal-name', 'colourful']}
								data-season='none'
							>
								{tl(trans.seasonal.listing.none)}
							</strong>
							<p class='seasonal-desc'>
								{tl(trans.current)}
							</p>
						</div>
					)}
				<SeasonalTimelineItem season={next} type='next' now={now} />
			</div>
			<div class='seasonal-timeline-bar'>
				{current && (
					<div
						class={['seasonal-timeline-current', 'colourful']}
						data-season={current.id}
					/>
				)}
			</div>
		</div>
	);
}

interface SeasonalTimelineItemProps {
	season: season;
	type: 'current' | 'prev' | 'next';
	now: DateTime;
}

export function SeasonalTimelineItem({
	season,
	type,
	now,
}: SeasonalTimelineItemProps) {
	let time;

	log('creating timeline item', 'season', 'info', { season, type });

	if (type == 'prev') {
		time = time_tooltip(
			<p class='seasonal-desc'>
				{season.end.toRelative({ base: now })}
			</p>,
			season.end,
		);
	} else if (type == 'next') {
		time = time_tooltip(
			<p class='seasonal-desc'>
				{season.start.toRelative({ base: now })}
			</p>,
			season.start,
		);
	} else {
		time = (
			<p class='seasonal-desc'>
				{tl(trans.current)}
			</p>
		);
	}

	return (
		<div class={['seasonal-timeline-item']} data-season-type={type}>
			<div class={['seasonal-icon', 'colourful']} data-season={season.id}>
				<Icon data-season={season.id} />
			</div>
			<strong
				class={['seasonal-name', 'colourful']}
				data-season={season.id}
			>
				{tl(trans.seasonal.listing[season.id])}
			</strong>
			{time}
			<div
				class={['seasonal-timeline-bg', 'colourful']}
				data-season={season.id}
				data-season-type={type}
			/>
		</div>
	);
}
