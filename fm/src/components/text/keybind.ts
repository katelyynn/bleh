import { log } from '@/build/log.ts';

export function is_keybind_active(keybind: string[], e: KeyboardEvent) {
	const is_cmd_down = e.getModifierState('Control') ||
		e.getModifierState('Meta');
	const pressed_key = e.key.toLowerCase();

	let active = 0;
	for (const i in keybind) {
		const key = keybind[i].toLowerCase();

		if (key == '⌘' && is_cmd_down) {
			active++;
		} else if (key == pressed_key) {
			active++;
		}
	}

	log('checking..', 'keybind', 'info', {
		active,
		keybind,
		e,
		is_cmd_down,
		pressed_key,
	});
	return active == keybind.length;
}
