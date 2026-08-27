import { Icon, icons } from '@/components/shared/icon.tsx';
import { tl, trans } from '@/build/trans.ts';

interface TranslatedHeaderProps {
	from: string;
}

export function TranslatedHeader({
	from,
}: TranslatedHeaderProps) {
	return (
		<div class='translated-notice'>
			<Icon name={icons.translate} className='translated-notice-icon' />
			<p class='translated-notice-text'>
				{tl(trans.translated_from_value, { v: from })}
			</p>
		</div>
	);
}
