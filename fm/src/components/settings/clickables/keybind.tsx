import { createRef } from 'jsx-dom';
import { page } from '@/build/page.ts';

interface KeybindProps {
	ref?: ReturnType<typeof createRef<HTMLElement>>;
	value: string;
	className?: string;
	interact?: boolean;
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

export function Keybind({
	ref,
	value,
	interact = false,
}: KeybindProps) {
	const darwin = ['darwin', 'ios'].includes(page.platform);

	let entering = false;

	const input = createRef();

	function update() {
		if (entering) {
			wrap.replaceChildren(
				<input
					class='key-bind-input'
					value={value}
					ref={input}
					onBlur={() => {
						entering = false;
						update();
					}}
					onSubmit={() => {
						entering = false;
						value = input.current.value;
						update();
					}}
				/>,
			);

			input.current.focus();
		} else {
			wrap.replaceChildren(
				<span class='key-bind-text'>{label(value)}</span>,
			);
		}
	}

	const wrap = (
		<kbd
			class={['key-bind']}
			ref={ref}
			onClick={() => {
				if (!interact) return;

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
			update();
		},
	});

	function label(value: string) {
		return (!darwin && keymap[value]) ? keymap[value] : value;
	}

	return wrap;
}
