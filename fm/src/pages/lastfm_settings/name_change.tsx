import { get_token } from '@/components/form/token.tsx';
import { page } from '@/build/page.ts';
import { PanelHead } from '@/components/text/head.tsx';
import { icons } from '@/components/shared/icon.tsx';

export function bleh_name_change() {
	const token = get_token(page.structure.row!);

	const head = page.structure.row!.querySelector('.content-top-header')!;
	const para = page.structure.row!.querySelector('p');

	const form = page.structure.row!.querySelector('form');

	page.structure.row!.firstElementChild!.remove();

	page.structure.main!.replaceChildren(
		<section class='name-change'>
			<PanelHead icon={icons.username}>
				{head.textContent.trim()}
			</PanelHead>
			{para}
			{form}
		</section>,
	);
}
