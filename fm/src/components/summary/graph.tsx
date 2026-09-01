import { CSSProperties } from 'jsx-dom';
import { WithChildren } from '@/types/generic.tsx';

export function GraphBlocks({
	children,
}: WithChildren) {
	return (
		<div class='graph-blocks'>
			{children}
		</div>
	);
}

interface GraphBlockProps {
	index: number;
	level?: number;
}

export type GraphBlockElement = HTMLAnchorElement & {
	level: number;
};

export function GraphBlock({
	index,
	level = -1,
}: GraphBlockProps) {
	const elem = (
		<a
			class={['graph-block']}
			style={{ '--delay': `${index * 0.04}s` } as CSSProperties}
		/>
	) as GraphBlockElement;

	function update() {
		elem.classList = 'graph-block';

		if (level == -1) {
			elem.classList.add('empty');
		} else {
			elem.classList.add(`level-${level}`);
		}
	}

	Object.defineProperty(elem, 'level', {
		get() {
			return level;
		},
		set(v: number) {
			level = v;
			update();
		},
	});

	update();

	return elem;
}
