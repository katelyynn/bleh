import { createRef, ReactNode } from 'jsx-dom';
import { SettingLabel } from '@/components/settings/provider/main.tsx';
import { settings } from '@/build/config.ts';
import { Switch } from '@/components/settings/clickables/switch.tsx';

interface SettingSwitchProps {
	bind?: string;
	id?: string;
	name: string;
	body?: string;
}

export function SettingSwitch({
	bind,
	id,
	name,
	body,
}: SettingSwitchProps) {
	let value = bind ? settings[bind] as boolean : true;
	const checkbox = createRef();

	return (
		<div
			class='setting'
			data-type='toggle'
			id={id}
			onClick={() => {
				value = !value;
				checkbox.current.checked = value;
			}}
		>
			<SettingLabel name={name} body={body} />
			<Switch checked={value} ref={checkbox} />
		</div>
	);
}
