import { Select, SelectOption } from '@/components/select/select.tsx';
import { useSettings } from '@/page.ts';
import { auth } from '@/build/page.ts';

interface UserSelectProps {
	value?: string;
	onChange?: (v: string) => void;
}

type UserSelectElement = HTMLDivElement & {
	value: string;
};

export function UserSelect({
	value,
	onChange,
}: UserSelectProps) {
	let values: SelectOption[] = [];

	const elem = <div class='user-select' />;

	function update() {
		const starred = useSettings.get('starred_friend') as string;
		const friends = (useSettings.get('friends') as string[]).filter((
			friend,
		) => friend != starred);

		values = [
			{
				text: auth.name,
				value: auth.name!,
			},
		];

		if (starred) {
			values.push({
				text: starred,
				value: starred,
			});
		}

		friends.forEach((friend) => {
			values.push({
				text: friend,
				value: friend,
			});
		});

		elem.replaceChildren(
			<Select
				value={value}
				values={values}
				allowArbitrary
				onChange={set}
			/>,
		);
	}

	update();

	function set(v: string) {
		value = v;

		if (onChange) onChange(v);

		update();
	}

	Object.defineProperty(elem, 'value', {
		get() {
			return value;
		},
		set(v: string) {
			set(v);
		},
	});

	useSettings.on('friends', update);
	useSettings.on('starred_friend', update);

	return elem;
}
