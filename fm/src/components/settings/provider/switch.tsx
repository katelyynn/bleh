import { createRef, ReactNode } from 'jsx-dom';
import {
	get_from_store,
	SettingLabel,
} from '@/components/settings/provider/main.tsx';
import { settings } from '@/build/config.ts';
import { Switch } from '@/components/settings/clickables/switch.tsx';
import { tl } from '@/build/trans.ts';
import { save_setting } from '@/components/settings/settings.tsx';

interface SettingSwitchProps {
	bind?: string;
	name?: string;
	body?: string;
	disabled?: boolean;
}

export function SettingSwitch({
	bind,
	name,
	body,
	disabled,
}: SettingSwitchProps) {
	let value = bind ? settings[bind] as boolean : true;
	const checkbox = createRef();

	function update() {
		if (disabled) {
			elem.setAttribute('disabled', 'true');
		} else {
			elem.removeAttribute('disabled');
		}
	}

	const store = get_from_store(bind);

	const elem = (
		<div
			class='setting'
			data-type='toggle'
			id={bind}
			onClick={() => {
				value = !value;
				checkbox.current.checked = value;

				if (bind) save_setting(bind, value);
			}}
		>
			<SettingLabel name={name} body={body} store={store} />
			<Switch checked={value} ref={checkbox} />
		</div>
	);

	update();

	Object.defineProperty(elem, 'value', {
		get() {
			return value;
		},
	});

	return elem;
}
