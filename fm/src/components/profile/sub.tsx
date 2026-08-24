import { Icon, icons } from '@/components/shared/icon.tsx';
import { hover_tooltip, Tooltip } from '@/components/shared/tooltips.tsx';
import { ReactNode } from 'jsx-dom';

interface SubTextPairProps {
	type: string;
	label: ReactNode;
	isText?: boolean;
	value: ReactNode;
}

export function SubTextPair({
	type,
	label,
	isText = true,
	value,
}: SubTextPairProps) {
	let icon = '';

	switch (type) {
		case 'username':
			icon = icons.username;
			break;
		case 'pronouns':
			icon = icons.pronouns;
			break;
		case 'aka':
			icon = icons.aka;
			break;
		case 'created':
			icon = icons.created;
			break;
		case 'follow':
			icon = icons.follow;
			break;
	}

	return (
		<dl class={['sub-text-pair', `sub-text-${type}`]}>
			<SubTextLabel icon={icon} text={label} />
			<dd class={['sub-text-item', !isText && 'not-text']}>
				{value}
			</dd>
		</dl>
	);
}

interface SubTextLabelProps {
	icon: string;
	text: ReactNode;
}

function SubTextLabel({
	icon,
	text,
}: SubTextLabelProps) {
	const elem = (
		<dt class='sub-text-label'>
			<Icon name={icon} />
			<span class='sub-text-label-sr'>{text}</span>
		</dt>
	);

	hover_tooltip(
		elem,
		<Tooltip>{text}</Tooltip>,
	);

	return elem;
}
