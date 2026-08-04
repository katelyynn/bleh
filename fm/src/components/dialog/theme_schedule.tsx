import { dialog } from '@/components/dialog/dialog.tsx';
import { tl, trans } from '@/build/trans.ts';
import { SettingGroup } from '@/components/settings/group.tsx';
import { SettingSelect } from '@/components/settings/provider/select.tsx';
import { theme, themes } from '@/build/theme.ts';
import { SelectOption } from '@/components/select/select.tsx';
import { settings } from '@/build/config.ts';

export interface theme_min {
	theme_day: string;
	theme_night: string;
}

interface theme_schedule_props {
	onChange?: (val: theme_min) => void;
}

export function theme_schedule_dialog({
	onChange,
}: theme_schedule_props) {
	let theme_day = settings.theme_day as string;
	let theme_night = settings.theme_night as string;

	dialog({
		id: 'theme_schedule',
		title: tl(trans.themes.name),
		body: (
			<SettingGroup>
				<SettingSelect
					bind='theme_day'
					values={convert_list_to_select(themes, 'light')}
					onChange={(val: string) => {
						theme_day = val;

						if (onChange) onChange({ theme_day, theme_night });
					}}
				/>
				<SettingSelect
					bind='theme_night'
					values={convert_list_to_select(themes, 'dark')}
					onChange={(val: string) => {
						theme_night = val;

						if (onChange) onChange({ theme_day, theme_night });
					}}
				/>
			</SettingGroup>
		),
	});
}

function convert_list_to_select(
	list: Record<string, theme>,
	filter: 'light' | 'dark',
) {
	const values: SelectOption[] = [];

	Object.entries(list)
		.filter(([_, theme]) => theme.type == filter)
		.map(([key, val]) => {
			values.push({
				value: key,
				text: tl(val.name),
			});
		});

	return values;
}
