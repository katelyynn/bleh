import { createRef, ReactNode } from 'jsx-dom';
import { Button } from '@/components/button/button.tsx';
import { Icon, icons } from '@/components/shared/icon.tsx';
import { tl, trans } from '@/build/trans.ts';
import { menu_tooltip } from '@/components/shared/tooltips.tsx';
import {
	FloatingWindow,
	FloatingWindowContents,
} from '@/components/menu/floating_window.tsx';

export interface CarouselItem {
	value: string;
	display: () => ReactNode;
}

interface CarouselProps {
	values: CarouselItem[];
	value?: string;
	className?: string;
	onChange?: (v: string) => void;
}

type CarouselElement = HTMLDivElement & {
	value: string;
};

export function Carousel({
	values,
	value,
	className,
	onChange,
}: CarouselProps) {
	let i = 0;
	let direction = 'center';
	if (value) {
		i = values.indexOf(values.find((v) => v.value == value)!);
	} else {
		value = values[i].value;
	}

	const inner = createRef();
	const modal = createRef();

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
			<div class={['carousel-inner', className]} ref={inner} />
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
	) as CarouselElement;

	const popup = menu_tooltip(
		inner.current,
		<FloatingWindow>
			<FloatingWindowContents ref={modal} />
		</FloatingWindow>,
	);

	function update() {
		inner.current.replaceChildren(
			<div class='carousel-inner-value' data-direction={direction}>
				{values[i].display()}
			</div>,
		);

		modal.current.replaceChildren(
			<div class='carousel-dialog'>
				{values.map((val, index) => (
					<Button
						className='carousel-dialog-item'
						aria-checked={val.value == value}
						onClick={() => {
							i = index;
							value = val.value;
							direction = 'center';
							update();

							if (onChange) onChange(value);
						}}
					>
						{val.display()}
					</Button>
				))}
			</div>,
		);
		popup.hide();
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
		<Button className='carousel-arrow' onClick={onClick}>
			{children}
		</Button>
	);

	return elem;
}
