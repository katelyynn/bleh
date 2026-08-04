interface SettingThemeProps {
	onChange?: (val: theme_response) => void;
}

interface theme_response {
	theme: string;
	adaptive: boolean;
	theme_day: string;
	theme_night: string;
}

export function SettingTheme({
	onChange,
}: SettingThemeProps) {
}

interface ThemeBubbleProps {
	active?: boolean;
	id: string;
	icon: string;
	name: string;
	onChange?: (val: string) => void;
}

type ThemeBubbleElement = HTMLButtonElement & {
	active: boolean;
};

export function ThemeBubble({
	active,
	id,
	icon,
	name,
	onChange,
}: ThemeBubbleProps) {
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
			{name} ({id})
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
