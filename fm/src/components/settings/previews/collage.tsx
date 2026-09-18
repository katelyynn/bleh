import { createRef } from 'jsx-dom';

interface CollageGridPreviewProps {
	ref?: ReturnType<typeof createRef<CollageGridPreviewElement>>;
	row: number;
	col: number;
}

type CollageGridPreviewElement = HTMLDivElement & {
	row: number;
	col: number;
};

export function CollageGridPreview({
	ref,
	row,
	col,
}: CollageGridPreviewProps) {
	const elem = (
		<div
			class='collage-grid-preview'
			ref={ref}
		/>
	) as CollageGridPreviewElement;

	function update() {
		elem.replaceChildren(
			<>
				<div class='collage-grid-preview-inner'>
					{Array.from({ length: row }).map(() => (
						<>
							{Array.from({ length: col }).map(() => (
								<div class='collage-grid-preview-item' />
							))}
						</>
					))}
				</div>
			</>,
		);
		elem.style.setProperty('--row', String(row));
		elem.style.setProperty('--col', String(col));
	}

	update();

	Object.defineProperty(elem, 'row', {
		get() {
			return row;
		},
		set(v: number) {
			row = v;
			update();
		},
	});

	Object.defineProperty(elem, 'col', {
		get() {
			return col;
		},
		set(v: number) {
			col = v;
			update();
		},
	});

	return elem;
}
