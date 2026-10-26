import { createRef } from 'jsx-dom';
import { useSeasons } from '@/page.tsx';

interface BrandProps {
	className?: string;
}

export function Brand({
	className,
}: BrandProps) {
	const inner = createRef();

	const elem = (
		<div
			class={[
				'bleh-logo',
				className,
			]}
		>
			<div
				class={['brand-inner']}
				ref={inner}
			/>
		</div>
	);

	function update() {
		const season = useSeasons.get().current?.id || '';

		elem.setAttribute('data-season', season);
		inner.current.setAttribute(
			'data-season',
			season,
		);
	}

	update();
	useSeasons.on(update);

	return elem;
}
