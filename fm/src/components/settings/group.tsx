import { ReactNode } from 'jsx-dom';

interface SettingGroupProps {
	blend?: boolean;
	children: ReactNode;
}

export function SettingGroup({
	blend = false,
	children,
}: SettingGroupProps) {
	return (
		<div class={['setting-group', blend && 'blend']}>
			{children}
		</div>
	);
}
