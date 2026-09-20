import { createRef } from 'jsx-dom';
import { useSettings } from '@/page.ts';

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
	let grid_title = useSettings.get('collage_title') as boolean;
	let grid_gap = useSettings.get('collage_grid_gap') as boolean;

	useSettings.on('collage_title', () => {
		grid_title = useSettings.get('collage_title') as boolean;
		update();
	});
	useSettings.on('collage_grid_gap', () => {
		grid_gap = useSettings.get('collage_grid_gap') as boolean;
		update();
	});

	const elem = (
		<div
			class='collage-grid-preview'
			ref={ref}
		/>
	) as CollageGridPreviewElement;

	function update() {
		elem.replaceChildren(
			<>
				{grid_title && (
					<div class='collage-grid-preview-title'>
						<div class='collage-grid-preview-title-stub' />
						<div class='collage-grid-preview-title-stub' />
						<div class='collage-grid-preview-title-stub' />
					</div>
				)}
				<div
					class={[
						'collage-grid-preview-inner',
						grid_gap && 'with-gap',
					]}
				>
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
