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
	ref?: ReturnType<typeof createRef<HTMLDivElement>>;
	bind?: string;
	name?: string;
	body?: string;
	onChange?: (val: boolean) => void;
	disabled?: boolean;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
}

type SettingSwitchElement = HTMLDivElement & {
	update: () => void;
	value: boolean;
};

export function SettingSwitch({
	ref,
	bind,
	name,
	body,
	onChange,
	disabled,
	onMouseEnter,
	onMouseLeave,
}: SettingSwitchProps) {
	let value = bind ? settings[bind] as boolean : true;
	const checkbox = createRef();

	const store = get_from_store(bind);

	function update() {
		disabled = false;

		let incompatible = false;
		let incompatible_list: Record<string, boolean> = {};

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
				<Switch
					className='setting-inner'
					checked={value}
					ref={checkbox}
				/>
				{Object.keys(incompatible_list).length > 0 && (
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
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onClick={() => {
				value = !value;
				checkbox.current.checked = value;

				if (bind) save_setting(bind, value);
				if (onChange) onChange(value);
			}}
			ref={ref}
		/>
	) as SettingSwitchElement;

	update();

	Object.defineProperty(elem, 'value', {
		get() {
			return value;
		},
	});

	elem.update = update;

	return elem;
}
