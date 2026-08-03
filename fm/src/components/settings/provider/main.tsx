import { setting_instance, settings, settings_store } from '@/build/config.ts';
import { tl, trans } from '@/build/trans.ts';

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
	const list: string[] = [];

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
				list.push(key);
			}
		} else {
			if (JSON.stringify(val) == JSON.stringify(settings[key])) {
				incompatible = true;
				list.push(key);
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
}: { list: string[] }) {
	return (
		<div class='setting-incompatible-with'>
			{tl(trans.incompatible_with_value, {
				v: list.map((v: string) => {
					if (settings_store[v]?.title) {
						return tl(settings_store[v].title);
					}

					return v;
				}).join(', '),
			})}
		</div>
	);
}
