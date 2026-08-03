import { ReactNode } from 'jsx-dom';
import { SettingLabel } from '@/components/settings/provider/main.tsx';

interface SettingInfoProps {
	name: string;
	body?: string;
	children: ReactNode;
}

export function SettingInfo({
	name,
	body,
	children,
}: SettingInfoProps) {
	return (
		<div class='setting' data-type='info'>
			<SettingLabel name={name} body={body} />
			<div class='info'>
				{children}
			</div>
		</div>
	);
}
