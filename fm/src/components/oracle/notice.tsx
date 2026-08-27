import { Cta } from '@/components/cta/cta.tsx';
import { SeeMore } from '@/components/text/see_more.tsx';
import { oracle_debug } from '@/components/music/oracle.tsx';
import { tl, trans } from '@/build/trans.ts';
import { icons } from '@/components/shared/icon.tsx';

export function OracleNotice() {
	return (
		<Cta
			className='oracle'
			colourful
			icon={icons.oracle}
			label={tl(trans.oracle_notice)}
		>
			<SeeMore
				className='oracle-button'
				iconPlacement='left'
				icon={icons.debug}
				onClick={oracle_debug}
			>
				{tl(trans.debug)}
			</SeeMore>
			<SeeMore
				className='oracle-button'
				href='https://github.com/katelyynn/bleh/issues/new/choose'
				external
			>
				{tl(trans.send_feedback)}
			</SeeMore>
		</Cta>
	);
}
