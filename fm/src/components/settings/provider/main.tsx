import { setting_instance, settings, settings_store } from '@/build/config.ts';
import { tl, trans } from '@/build/trans.ts';
import { Icon, icons } from '@/components/shared/icon.tsx';

interface SettingLabelProps {
	name?: string;
	body?: string;
	store?: setting_instance;
}

export function SettingLabel({
	name,
	body,
	store,
}: SettingLabelProps) {
	if (store) {
		if (store.title) name = tl(store.title);
		if (store.body) body = tl(store.body);
	}

	if (!name) {
		return (
			<div class={['heading', 'setting-inner']}>
				<div class='alert alert-error no-margin'>
					No name provided
				</div>
			</div>
		);
	}

	return (
		<div class={['heading', 'setting-inner']}>
			<h5 class='setting-name'>{name}</h5>
			{body && <p class='setting-body'>{body}</p>}
		</div>
	);
}

export function get_from_store(id?: string) {
	if (!id) return undefined;

	return settings_store[id];
}

export function is_incompatible(store: setting_instance) {
	let incompatible = false;
	const list: Record<string, boolean> = {};

	if (!store.incompatible) {
		return {
			incompatible,
			list,
		};
	}

	Object.entries(store.incompatible).forEach(([key, val]) => {
		if (Array.isArray(val)) {
			if (val.includes(settings[key])) {
				incompatible = true;
				list[key] = val;
			}
		} else {
			if (JSON.stringify(val) == JSON.stringify(settings[key])) {
				incompatible = true;
				list[key] = val;
			}
		}
	});

	return {
		incompatible,
		list,
	};
}

export function SettingIncompatibleWith({
	list,
}: { list: Record<string, boolean> }) {
	return (
		<div class='setting-incompatible-with colourful'>
			<Icon name={icons.error} identifier='setting-incompatible-with' />
			<strong class='setting-incompatible-with-text'>
				{tl(trans.incompatible)}
			</strong>
			<p class='setting-incompatible-with-list'>
				{Object.entries(list).map(([key, val]) => {
					let title = key;

					if (settings_store[key]?.title) {
						title = tl(settings_store[key].title);
					}

					if (val == true) {
						return tl(trans.value_is_enabled, { v: title });
					}

					return tl(trans.value_is_disabled, { v: title });
				}).join(', ')}
			</p>
		</div>
	);
}
