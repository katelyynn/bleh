import { createRef } from 'jsx-dom';

interface RangeProps {
	ref?: ReturnType<typeof createRef<HTMLDivElement>>;
	value?: number;
	suffix?: string;
	min?: number;
	max?: number;
	step?: number;
	onChange?: (val: number) => void;
}

type RangeElement = HTMLDivElement & {
	value: number;
};

export function Range({
	ref,
	value = 0,
	suffix,
	min = 0,
	max = 1,
	step = 0.1,
	onChange,
}: RangeProps) {
	const range = createRef();

	const track = createRef();

	const marker = createRef();

	const working_max = max - min;

	const wrap = (
		<div class='range' ref={ref}>
			<div class={['track', 'colourful']} ref={track}>
				<div class='fill' />
				<div class='nub' />
			</div>
			<p class='value-marker' ref={marker} />
			<input
				type='range'
				min={min}
				max={max}
				step={step}
				ref={range}
				onInput={() => {
					set(range.current.value);
				}}
			/>
		</div>
	) as RangeElement;

	Object.defineProperty(wrap, 'value', {
		get() {
			return value;
		},
		set(val: number) {
			set(val);
		},
	});

	function update() {
		range.current.value = value;
		marker.current.replaceChildren(
			<>
				{value}
				{suffix && <span class='suffix'>{suffix}</span>}
			</>,
		);

		track.current.style.setProperty(
			'--percent',
			`${((value - min) / working_max) * 100}%`,
		);
	}

	function set(val: number) {
		value = val;
		update();

		if (onChange) onChange(val);
	}

	update();

	return wrap;
}
