import { Icon } from '@/components/shared/icon.tsx';

interface SettingIconProps {
	name: string;
}

export function SettingIcon({
	name,
}: SettingIconProps) {
	return (
		<div class='setting-icon'>
			<Icon name={name} />
		</div>
	);
}
