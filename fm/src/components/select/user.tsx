import { Select, SelectOption } from '@/components/select/select.tsx';
import { useSettings } from '@/page.ts';
import { auth } from '@/build/page.ts';
import { Icon, icons } from '@/components/shared/icon.tsx';
import { createRef } from 'jsx-dom';

interface UserSelectProps {
	ref?: ReturnType<typeof createRef<UserSelectElement>>;
	value?: string;
	onChange?: (v: string) => void;
	showAuth?: boolean;
	inSettings?: boolean;
}

type UserSelectElement = HTMLDivElement & {
	value: string;
};

export function UserSelect({
	ref,
	value,
	onChange,
	showAuth = true,
	inSettings,
}: UserSelectProps) {
	let values: SelectOption[] = [];

	const elem = <div class='user-select' ref={ref} /> as UserSelectElement;

	function update() {
		const starred = useSettings.get('starred_friend') as string;
		const friends = (useSettings.get('friends') as string[]).filter((
			friend,
		) => friend != starred);

		values = [];

		if (showAuth) {
			values.push({
				text: auth.name,
				value: auth.name!,
			});
		}

		if (starred) {
			values.push({
				text: () => (
					<>
						{starred}
						<span class={['star-icon', 'colourful']}>
							<Icon name={icons.star} />
						</span>
					</>
				),
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
				inSettings={inSettings}
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
