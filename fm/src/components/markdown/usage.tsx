import { tl, trans } from '@/build/trans.ts';
import { Icon, icons } from '@/components/shared/icon.tsx';
import { WithChildren } from '@/types/generic.tsx';

export function MarkdownUsage({
	children,
}: WithChildren) {
	return (
		<div class='markdown-usage'>
			{children}
		</div>
	);
}

interface MarkdownUsageItemProps {
	type: 'banner' | 'accent' | 'font';
	value?: string;
}

export function MarkdownUsageItem({
	type,
	value,
}: MarkdownUsageItemProps) {
	let text = '';
	let icon = '';

	if (type == 'banner') {
		text = tl(trans.profile_banner.name) as string;
		icon = icons.banner;
	} else if (type == 'accent') {
		text = tl(trans.profile_accent.name) as string;
		icon = icons.accent;
	} else if (type == 'font') {
		text = tl(trans.display_name.name) as string;
		icon = icons.text;
	}

	return (
		<div class='markdown-usage-item'>
			<Icon name={icon} />
			<strong class='markdown-usage-type'>{text}</strong>
			<p class='markdown-usage-value'>{value}</p>
		</div>
	);
}
