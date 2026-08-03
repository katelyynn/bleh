import { setting_instance, settings_store } from '@/build/config.ts';
import { tl } from '@/build/trans.ts';

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
			<div class='heading'>
				<div class='alert alert-error no-margin'>
					No name provided
				</div>
			</div>
		);
	}

	return (
		<div class='heading'>
			<h5 class='setting-name'>{name}</h5>
			{body && <p class='setting-body'>{body}</p>}
		</div>
	);
}

export function get_from_store(id?: string) {
	if (!id) return undefined;

	return settings_store[id];
}
