import { set_storage } from '@/build/tools';
import { keys } from '../settings/storage';
import { register_activity } from '../shared/activity';
import { version } from '@/main';
import { root } from '@/build/page';
import { notify } from '../dialog/notify';
import { request_changelog } from '../news';
import { tl, trans } from '@/build/trans';

export function reset_update_status() {
	set_storage(keys.update_required, 'false');
	set_storage(keys.update_checked_date, new Date().toString());
}

export function notify_if_new_update() {
	let last_version_used = localStorage.getItem(keys.last_version_used) || '';

	// enter first-time setup
	if (last_version_used == '') {
		window.location.href = `${root}bleh/setup`;
		set_storage(keys.last_version_used, version.build);
		register_activity('install_bleh', [], `${root}bleh`);
		return;
	}

	// otherwise, it's a usual update
	if (last_version_used != version.build) {
		notify({
			title: tl(trans.you_are_up_to_date),
			body: tl(trans.updated.notification, {
				v: `${version.build}.${version.sku}`,
			}),
			persist: true,
			icon: 'icon-16-update',
		});
		register_activity(
			'update_bleh',
			[{ name: version.build, type: 'bleh' }],
			`${root}bleh`,
		);
		set_storage(keys.last_version_used, version.build);

		reset_update_status();

		request_changelog();
	}
}
