export function is_keybind_active(keybind: string[], e: KeyboardEvent) {
	const is_cmd_down = e.getModifierState('Control') ||
		e.getModifierState('Meta');
	const pressed_key = e.key.toLowerCase();

	let active = 0;
	for (let key in keybind) {
		key = key.toLowerCase();

		if (key == '⌘' && is_cmd_down) {
			active++;
		} else if (key == pressed_key) {
			active++;
		}
	}

	return active = keybind.length;
}
