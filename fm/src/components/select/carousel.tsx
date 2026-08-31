import { createRef, ReactNode } from 'jsx-dom';
import { Button } from '@/components/button/button.tsx';
import { Icon, icons } from '@/components/shared/icon.tsx';
import { tl, trans } from '@/build/trans.ts';

interface CarouselItem {
	value: string;
	display: ReactNode;
}

interface CarouselProps {
	values: CarouselItem[];
	value?: string;
	onChange?: (v: string) => void;
}

type CarouselElement = HTMLDivElement & {
	value: string;
};

export function Carousel({
	values,
	value,
	onChange,
}: CarouselProps) {
	let i = 0;
	let direction = 'center';
	if (value && value in values) {
		i = values.indexOf(values.find((v) => v.value == value)!);
	} else {
		value = values[i].value;
	}

	const inner = createRef();

	const elem = (
		<div class='select-carousel'>
			<CarouselArrow
				onClick={() => {
					let new_val = i - 1;
					direction = 'right';
					if (new_val < 0) {
						new_val = values.length - 1;
					}

					i = new_val;
					value = values[i].value;
					update();

					if (onChange) onChange(value);
				}}
			>
				<Icon name={icons.arrow_left} />
				{tl(trans.prev)}
			</CarouselArrow>
			<div class='carousel-inner' ref={inner} />
			<CarouselArrow
				onClick={() => {
					let new_val = i + 1;
					direction = 'left';
					if (new_val >= values.length) {
						new_val = 0;
					}

					i = new_val;
					value = values[i].value;
					update();

					if (onChange) onChange(value);
				}}
			>
				<Icon name={icons.arrow_right} />
				{tl(trans.next)}
			</CarouselArrow>
		</div>
	);

	function update() {
		inner.current.replaceChildren(
			<div class='carousel-inner-value' data-direction={direction}>
				{values[i].display}
			</div>,
		);
	}

	update();

	Object.defineProperty(elem, 'value', {
		set(v: string) {
			value = v;
		},
	});

	return elem;
}

interface CarouselArrowProps {
	onClick?: () => void;
	children: ReactNode;
}

function CarouselArrow({
	onClick,
	children,
}: CarouselArrowProps) {
	const elem = (
		<Button chibi className='carousel-arrow' onClick={onClick}>
			{children}
		</Button>
	);

	return elem;
}
