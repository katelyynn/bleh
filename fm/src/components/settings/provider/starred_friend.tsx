import { useSettings } from '@/page.ts';
import { SettingSelect } from '@/components/settings/provider/select.tsx';
import { select_prepare_list } from '@/components/settings/select.ts';
import { tl, trans } from '@/build/trans.ts';

export function StarredFriend() {
	const elem = (
		<SettingSelect
			bind='starred_friend'
			values={set_list()}
		/>
	);

	useSettings.on('friends', () => {
		elem.values = set_list();
	});

	function set_list() {
		const friends = useSettings.get('friends') as string[];
		if (!friends.includes(useSettings.get('starred_friend') as string)) {
			useSettings.set('starred_friend', '');
		}

		return select_prepare_list([{
			value: '',
			text: tl(trans.none.starred_friend),
		}, ...friends]);
	}

	return elem;
}
