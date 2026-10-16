/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { CSSProperties, ReactNode } from 'jsx-dom';
import { Tooltip } from '@/components/shared/tooltips.tsx';
import { lang } from '@/build/trans';

interface HeatmapTooltipProps {
	date: ReactNode;
	value: ReactNode;
}

export function HeatmapTooltip({
	date,
	value,
}: HeatmapTooltipProps) {
	return (
		<Tooltip>
			<span class='tooltip-label'>{date}:</span> {value}
		</Tooltip>
	);
}

export function HeatmapDates() {
	let days = Array.from(
		{ length: 7 },
		(_, i) =>
			new Intl.DateTimeFormat(lang, { weekday: 'short' }).format(
				new Date(1970, 0, 4 + i),
			),
	);

	days = days.slice(1).concat(days[0]);

	return (
		<div class='heatmap-dates'>
			{days.map(day => (
				<HeatmapDate date={day} />
			))}
		</div>
	);
}

interface HeatmapDateProps {
	date: string;
}

function HeatmapDate({
	date
}: HeatmapDateProps) {
	return (
		<div class='heatmap-date'>
			{date}
		</div>
	);
}
