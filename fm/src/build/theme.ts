import { trans, translation } from '@/build/trans.ts';
import { icons } from '@/components/shared/icon.tsx';

export interface theme {
	name: translation;
	type?: 'light' | 'dark';
	icon?: string;
	external?: boolean;
}

export const themes: Record<string, theme> = {
	adaptive: {
		name: trans.auto,
		icon: icons.theme_adaptive,
	},
	light: {
		name: trans.themes.light,
		type: 'light',
		icon: icons.theme_light,
	},
	ink: {
		name: trans.themes.ink,
		type: 'light',
		icon: icons.theme_ink,
	},
	dark: {
		name: trans.themes.dark,
		type: 'dark',
		icon: icons.theme_dark,
	},
	darker: {
		name: trans.themes.darker,
		type: 'dark',
		icon: icons.theme_darker,
	},
	oled: {
		name: trans.themes.oled,
		type: 'dark',
		icon: icons.theme_oled,
	},
	rose_pine: {
		name: trans.themes.rose_pine,
		type: 'dark',
		external: true,
	},
};
