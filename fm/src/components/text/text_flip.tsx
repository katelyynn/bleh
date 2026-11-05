import { ReactElement, ReactNode } from "jsx-dom";

interface TextFlipProps {
	items: ReactNode[];
	interval?: number;
}

export function TextFlip({
	items,
	interval = 2000
}: TextFlipProps) {
	let index = 0;
	const references: ReactElement[] = [];

	const wrapper = (
		<span class='text-flipper'>
			{items.map((item) => {
				const elem = (
					<span class='text-flipper-inner'>
						{item}
					</span>
				);

				references.push(elem);

				return elem;
			})}
		</span>
	);

	function flip() {
		references.forEach((item, i) => {
			item.setAttribute('data-visible', String(i == index));
		});
	}

	flip();

	setInterval(() => {
		index++;

		if (index > items.length - 1) {
			index = 0;
		}

		flip();
	}, interval);

	return wrapper;
}
