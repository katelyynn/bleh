import { SettingGroup } from '@/components/settings/group.tsx';
import { ReactNode } from 'jsx-dom';
import { SettingLabel } from '@/components/settings/provider/main.tsx';
import { tl, trans } from '@/build/trans.ts';
import { theme, themes } from '@/build/theme.ts';

interface SettingThemeProps {
	theme: theme_response;
	onChange?: (val: theme_response) => void;
}

interface theme_response {
	id: string;
	adaptive: boolean;
	theme_day: string;
	theme_night: string;
}

export function SettingTheme({
	theme,
	onChange,
}: SettingThemeProps) {
	const wrap = <SettingGroup />;

	function update() {
		wrap.replaceChildren(
			<>
				<ThemeRow label={tl(trans.bright)}>
					{['light', 'ink'].map((id: string, i: number) => (
						<ThemeBubble
							id={id}
							active={is_active(id, theme)}
							onChange={set}
							key={i}
						/>
					))}
				</ThemeRow>
				<ThemeRow label={tl(trans.moody)}>
					{['dark', 'darker', 'oled', 'rose_pine'].map((
						id: string,
						i: number,
					) => (
						<ThemeBubble
							id={id}
							active={is_active(id, theme)}
							onChange={set}
							key={i}
						/>
					))}
				</ThemeRow>
			</>,
		);
	}

	update();

	return wrap;

	function set(id: string) {
		theme = {
			...theme,
			id,
		};
		update();

		if (onChange) onChange(theme);
	}
}

function is_active(id: string, state: theme_response) {
	return state.id == id && !state.adaptive;
}

interface ThemeRowProps {
	label: string;
	children: ReactNode;
}

export function ThemeRow({
	label,
	children,
}: ThemeRowProps) {
	return (
		<div class={['setting', 'theme-row']}>
			<SettingLabel name={label} />
			<div class='theme-bubbles'>
				{children}
			</div>
		</div>
	);
}

interface ThemeBubbleProps {
	active?: boolean;
	id: string;
	onChange?: (val: string) => void;
}

type ThemeBubbleElement = HTMLButtonElement & {
	active: boolean;
};

export function ThemeBubble({
	active,
	id,
	onChange,
}: ThemeBubbleProps) {
	const source: theme = themes[id];

	const bubble = (
		<button
			type='button'
			class={['btn', 'theme-bubble']}
			onClick={() => {
				active = true;

				if (onChange) onChange(id);

				update();
			}}
		>
			{tl(source.name)} ({id})
		</button>
	) as ThemeBubbleElement;

	Object.defineProperty(bubble, 'id', {
		get() {
			return id;
		},
	});

	Object.defineProperty(bubble, 'active', {
		get() {
			return active;
		},
		set(val: boolean) {
			active = val;
			update();
		},
	});

	function update() {
		bubble.setAttribute('aria-checked', String(active));
	}

	update();

	return bubble;
}
