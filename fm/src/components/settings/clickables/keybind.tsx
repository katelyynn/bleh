import { createRef } from 'jsx-dom';
import { page } from '@/build/page.ts';
import { Icon, icons } from '@/components/shared/icon.tsx';

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
			wrap.replaceChildren(
				<span class='key-bind-text'>{label(value)}</span>,
			);
			wrap.removeAttribute('data-entering');
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

	return wrap;
}
