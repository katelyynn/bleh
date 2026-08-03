import { createRef, ReactNode } from 'jsx-dom';
import {
	get_from_store,
	is_incompatible,
	SettingIncompatibleWith,
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

	const store = get_from_store(bind);

	function update() {
		let incompatible = false;
		let incompatible_list: string[] = [];

		if (store) {
			({ incompatible, list: incompatible_list } = is_incompatible(
				store,
			));
		}

		if (incompatible) {
			disabled = true;
		}

		if (disabled) {
			elem.setAttribute('disabled', 'true');
		} else {
			elem.removeAttribute('disabled');
		}

		elem.replaceChildren(
			<>
				<SettingLabel name={name} body={body} store={store} />
				<Switch className='setting-inner' checked={value} ref={checkbox} />
				{incompatible_list.length > 0 && (
					<SettingIncompatibleWith list={incompatible_list} />
				)}
			</>,
		);
	}

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
		/>
	);

	update();

	Object.defineProperty(elem, 'value', {
		get() {
			return value;
		},
	});

	return elem;
}
