/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { createRef } from 'jsx-dom';
import { page } from '@/build/page.ts';
import { Icon, icons } from '@/components/shared/icon.tsx';
import tippy from 'tippy.js';

interface KeybindProps {
	ref?: ReturnType<typeof createRef<HTMLElement>>;
	value: string;
	interact?: boolean;
	onChange?: (value: string) => void;
}

// only used on non-apple
const keymap: Record<string, string> = {
	'⌘': 'Ctrl',
	'⇧': 'Shift',
	'⌥': 'Alt',
	'⌃': 'Ctrl',
	'⏎': 'Enter',
	'⎋': 'Esc',
	'⌫': 'Backspace',
};

const iconmap: Record<string, string> = {
	'⌘': icons.command,
	'⇧': icons.arrow_up,
	'⌥': icons.option,
	'⌫': icons.backspace,
	'⌃': icons.arrow_up,
	'⏎': icons.submit,
};

export function Keybind({
	ref,
	value,
	interact = false,
	onChange,
}: KeybindProps) {
	const darwin = ['darwin', 'ios'].includes(page.platform);

	let entering = false;

	const input = createRef();

	function update() {
		if (entering) {
			tip.disable();
			wrap.replaceChildren(
				<>
					<span class='key-bind-text'>...</span>
					<input
						class='key-bind-input'
						value={value}
						ref={input}
						onBlur={() => {
							entering = false;
							update();
						}}
						onKeyDown={(e: KeyboardEvent) => {
							entering = false;

							// https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
							if (
								[
									'Escape',
									'Backspace',
									'Enter',
									'Unidentified',
									'Alt',
									'AltGraph',
									'CapsLock',
									'Control',
									'Fn',
									'FnLock',
									'Hyper',
									'Meta',
									'NumLock',
									'ScrollLock',
									'Shift',
									'Super',
									'Symbol',
									'SymbolLock',
									'Tab',
									' ',
								]
									.includes(e.key)
							) {
								update();

								return;
							}

							value = e.key;
							if (onChange) onChange(value);
							update();
						}}
					/>
				</>,
			);

			input.current.focus();
			wrap.setAttribute('data-entering', 'true');
		} else {
			if (keymap[value]) {
				tip.enable();
			} else {
				tip.disable();
			}

			wrap.replaceChildren(
				<span class='key-bind-text'>{label(value)}</span>,
			);
			wrap.removeAttribute('data-entering');

			tip.setContent(tooltip(value));
		}
	}

	const wrap = (
		<kbd
			class={['key-bind', interact && 'key-bind-interactable']}
			ref={ref}
			onClick={() => {
				if (!interact || entering) return;

				entering = true;
				update();
			}}
		>
			<span class='key-bind-text'>{label(value)}</span>
		</kbd>
	);

	const tip = tippy(wrap, {
		content: tooltip(value),
		delay: [1200, 0],
	});

	update();

	Object.defineProperty(wrap, 'key', {
		get() {
			return value;
		},
		set(val: string) {
			value = val;
			if (onChange) onChange(value);
			update();
		},
	});

	function label(value: string) {
		if (iconmap[value]) {
			return <Icon name={iconmap[value]} identifier='key-bind' />;
		}

		return value;
	}

	function tooltip(value: string) {
		if (keymap[value]) return keymap[value];

		return value.toUpperCase();
	}

	return wrap;
}
