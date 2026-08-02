import { ReactNode } from 'jsx-dom';
import { SettingLabel } from '@/components/settings/provider/main.tsx';

interface SettingActionProps {
	name: string;
	body?: string;
	children: ReactNode;
}

export function SettingAction({
	name,
	body,
	children,
}: SettingActionProps) {
	return (
		<div class='setting' data-type='action'>
			<SettingLabel name={name} body={body} />
			<div class='toggle-wrap'>
				{children}
			</div>
		</div>
	);
}
