import { CSSProperties, ReactNode } from 'jsx-dom';
import { Tooltip } from '@/components/shared/tooltips.tsx';

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

interface HeatmapBlockProps {
	index?: number;
}

export function HeatmapBlock({
	index = 0,
}: HeatmapBlockProps) {
	return (
		<div
			class={['graph-block', 'empty']}
			style={{ '--delay': `${index * 0.04}s` } as CSSProperties}
		/>
	);
}
