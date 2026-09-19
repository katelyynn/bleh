import { WithChildren } from '@/types/generic.tsx';
import { createRef, ReactNode } from 'jsx-dom';
import { load_profile_cache_externally } from '@/pages/profile/profile.tsx';
import { GenericUsername, SponsorUsername } from '@/components/user/name.tsx';
import { is_sponsor } from '@/components/sponsor.ts';
import { lang, tl, trans } from '@/build/trans.ts';
import { Icon, icons } from '@/components/shared/icon.tsx';
import { avatar } from '@/components/shared/avatar.ts';
import { header_colour } from '@/components/page/colour.ts';
import { SeeMore } from '@/components/text/see_more.tsx';
import { page, root } from '@/build/page.ts';
import { redirect } from '@/components/music/music.tsx';
import { sanitise } from '@/build/tools.ts';

interface ListenBoardProps {
	url?: string;
	others?: number;
	children: ReactNode;
}

export function ListenBoard({
	url,
	others,
	children,
}: ListenBoardProps) {
	return (
		<div class='listen-board-wrap'>
			<div class='listen-board'>
				{children}
			</div>
			{(url || others) && (
				<div class='listen-board-row'>
					{(others && url) && (
						<div class='left-align-row'>
							<SeeMore
								href={`${root}music/${url}/+listeners/you-know`}
								iconPlacement='left'
								icon={icons.users}
							>
								{tl(trans.value_you_follow, { v: others })}
							</SeeMore>
						</div>
					)}
					{url && (
						<div class='right-align-row'>
							<SeeMore
								iconPlacement='left'
								icon={icons.plus}
								onClick={() => {
									view_others_library(url);
								}}
							>
								{tl(trans.custom)}
							</SeeMore>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

interface ListenProps {
	image?: string;
	name: string;
	plays?: number;
	url?: string;
}

export function Listen({
	image,
	name,
	plays,
	url,
}: ListenProps) {
	const bg = createRef();
	const item_name = createRef();
	const item_image = createRef();
	const item_plays = createRef();

	let last_image = '';
	let banner = '';

	const elem = (
		<a class={['listen-board-item', 'colourful']}>
			<span class='listen-board-item-bg' ref={bg} />
			<span
				class={['listen-board-item-image', 'avatar']}
				ref={item_image}
			/>
			<span class='listen-board-item-info'>
				<span
					class={['listen-board-item-name', 'colourful']}
					ref={item_name}
				>
					<SponsorUsername>{name}</SponsorUsername>
				</span>
				<span class='listen-board-item-plays' ref={item_plays}>
					<Icon name={icons.spinner} />
				</span>
			</span>
			<Icon name={icons.arrow_right} />
		</a>
	);

	function update() {
		if (image) {
			bg.current.style.setProperty(
				'background-image',
				`url(${banner || avatar(image, 'avatar300s')})`,
			);
			item_image.current.replaceChildren(
				<img src={avatar(image, 'avatar170s')} />,
			);

			if (last_image != image) {
				last_image = image;

				header_colour(
					(
						<img src={avatar(image, 'avatar300s')} />
					) as HTMLImageElement,
					false,
					[elem, item_name.current],
				);
			}
		} else {
			bg.current.style.removeProperty('background-image');
			item_image.current.replaceChildren(
				<img class='missing-image' />,
			);
		}

		if (plays != undefined) {
			item_plays.current.replaceChildren(
				<>
					<Icon name={icons.play} />
					{tl(trans.count_plays, { c: plays.toLocaleString(lang) })}
				</>,
			);
		}
	}

	update();

	if (!image) {
		load_profile_cache_externally(name).then((cache) => {
			image = cache.avatar;

			if (cache.banner) banner = cache.banner;

			update();
		});
	}

	if (!plays && url) {
		fetch(`${root}user/${name}/library/music/${redirect()}${url}`);
	}

	return elem;
}

function view_others_library(url: string) {
}
