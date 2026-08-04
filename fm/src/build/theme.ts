import { trans, translation } from '@/build/trans.ts';
import { icons } from '@/components/shared/icon.tsx';

export interface theme {
	name: translation;
	type: 'light' | 'dark';
	icon?: string;
	external?: boolean;
	new_release?: boolean;
}

// use this to fill in theme info accessible with all modern
// bleh TSX components
export const themes: Record<string, theme> = {
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
		new_release: true,
	},
	rose_pine_dawn: {
		name: trans.themes.rose_pine_dawn,
		type: 'light',
		external: true,
		new_release: true
	}
};
