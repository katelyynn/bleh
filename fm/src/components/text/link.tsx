import { Tooltip } from '@/components/shared/tooltips.tsx';

interface LinkTooltipProps {
	scheme: string;
	hostname?: string;
	path: string;
}

export function LinkTooltip({
	scheme,
	hostname,
	path,
}: LinkTooltipProps) {
	return (
		<Tooltip>
			<span class='link-tooltip'>
				{scheme != 'https:' && <span class='scheme'>{scheme}\//</span>}
				{hostname
					? <span class='hostname'>{hostname}</span>
					: <span class='hostname'>{path}</span>}
				{(path != '/' && hostname) && <span class='path'>{path}</span>}
			</span>
		</Tooltip>
	);
}
