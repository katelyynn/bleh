import { ReactNode } from 'jsx-dom';
import { Button } from '@/components/button/button.tsx';
import { tl, trans } from '@/build/trans.ts';
import { menu_tooltip } from '@/components/shared/tooltips.tsx';
import { MenuContents } from '@/components/menu/menu.tsx';
import { root } from '@/build/page.ts';
import { Icon, icons } from '@/components/shared/icon.tsx';

interface ShoutActionProps {
	name: string;
	wrap: Element;
	children: ReactNode;
}

export function ShoutAction({
	name,
	wrap,
	children,
}: ShoutActionProps) {
	const elem = (
		<div
			class='shout-avatar-action-opener'
			onMouseEnter={() => {
				wrap.classList.add('hovering-avatar');
			}}
			onMouseLeave={() => {
				if (menu.is_mounted) return;

				wrap.classList.remove('hovering-avatar');
			}}
		>
			{children}
			<Button chibi className='shout-avatar-action'>
				<Icon name={icons.more} />
				{tl(trans.more)}
			</Button>
		</div>
	);

	const menu = menu_tooltip(
		elem,
		<MenuContents>
			<Button menu href={`${root}user/${name}`}>
				<Icon name={icons.profile} />
				{tl(trans.profile)}
			</Button>
			<div class='sep' />
			<Button menu href={`${root}user/${name}/listening-report`}>
				<Icon name={icons.listening_report} />
				{tl(trans.reports)}
			</Button>
			<Button menu href={`${root}user/${name}/library`}>
				<Icon name={icons.library} />
				{tl(trans.library)}
			</Button>
			<Button menu href={`${root}user/${name}/friends`}>
				<Icon name={icons.friends} />
				{tl(trans.friends)}
			</Button>
			<Button menu href={`${root}user/${name}/shoutbox`}>
				<Icon name={icons.shoutbox} />
				{tl(trans.shouts)}
			</Button>
			<Button menu href={`${root}user/${name}/obsessions`}>
				<Icon name={icons.obsessions} />
				{tl(trans.obsessions)}
			</Button>
		</MenuContents>,
		{
			onShow: () => {
				wrap.classList.add('hovering-avatar');
			},
			onHide: () => {
				if (wrap.matches(':hover')) return;

				wrap.classList.remove('hovering-avatar');
			},
		},
	);

	return elem;
}
