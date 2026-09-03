import { song_tag, SongTag } from '@/components/track/song_tag.tsx';
import { useSettings } from '@/page.ts';
import { romanise } from '@/build/tools.ts';
import { page } from '@/build/page.ts';

interface SmartTitleProps {
	title: string;
	tags: song_tag[];
	features?: boolean;
	header?: boolean;
}

export function SmartTitle({
	title,
	tags,
	features,
	header = false,
}: SmartTitleProps) {
	return (
		<>
			<span class='title'>
				<FancyTitle title={romanise(title.trim())} header={header} />
			</span>
			{tags.map((tag) => <SongTag tag={tag} features={features} />)}
		</>
	);
}

interface FancyTitleProps {
	title: string;
	header?: boolean;
}

export function FancyTitle({
	title,
	header,
}: FancyTitleProps) {
	const dollar = page.name == 'WOR$T GIRL IN AMERICA' &&
		page.sister == 'Slayyyter';
	const brat = page.name.toLowerCase().startsWith('brat') &&
		page.sister.toLowerCase() == 'charli xcx';

	const elem = <span class='fancy-title'>{title}</span>;

	if (dollar) {
		elem.innerHTML = elem.innerHTML.replace(
			/\$/g,
			'<i class="dollar">$</i>',
		);
	}

	if (brat && header) {
		elem.replaceChildren(
			<span class='brat'>{title}</span>,
		);
	}

	return elem;
}
