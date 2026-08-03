import { createRef } from 'jsx-dom';

interface InputProps {
	ref?: ReturnType<typeof createRef<HTMLDivElement>>;
	value?: string | number;
	disabled?: boolean;
	type?: 'text' | 'number' | 'date' | 'password' | 'textarea';
	onChange?: (val: string | number) => void;
}

type InputElement = HTMLDivElement & {
	disabled: boolean;
};

export function Input({
	ref,
	value = '',
	disabled,
	type = 'text',
	onChange,
}: InputProps) {
	const input = createRef();

	const wrap = (
		<div
			class={[
				'content-form',
				'input-container',
				'colourful',
				type == 'textarea' && 'textarea',
			]}
			ref={ref}
		>
			{type != 'textarea'
				? (
					<input
						class='modern-input'
						type={type}
						value={value}
						ref={input}
						onChange={() => {
							value = input.current.value;
							update(true);
						}}
					/>
				)
				: (
					<textarea
						class='modern-input'
						value={value}
						ref={input}
						onChange={() => {
							value = input.current.value;
							update(true);
						}}
					/>
				)}
		</div>
	);

	function update(from_input = false) {
		if (disabled) {
			input.current.setAttribute('disabled', 'true');
		} else {
			input.current.removeAttribute('disabled');
		}

		if (!from_input) {
			input.current.value = value;
		}

		if (onChange) onChange(input.current.value);
	}

	Object.defineProperty(wrap, 'value', {
		get() {
			return value;
		},
		set(val: string | number) {
			value = val;
			update();
		},
	});

	Object.defineProperty(wrap, 'disabled', {
		get() {
			return disabled;
		},
		set(val: boolean) {
			disabled = val;
			update();
		},
	});

	update();

	return wrap;
}
