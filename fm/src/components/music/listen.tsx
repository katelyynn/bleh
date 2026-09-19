import { createRef, ReactNode } from 'jsx-dom';
import { load_profile_cache_externally } from '@/pages/profile/profile.tsx';
import { SponsorUsername } from '@/components/user/name.tsx';
import { lang, tl, trans } from '@/build/trans.ts';
import { Icon, icons } from '@/components/shared/icon.tsx';
import { avatar } from '@/components/shared/avatar.ts';
import { header_colour } from '@/components/page/colour.ts';
import { SeeMore } from '@/components/text/see_more.tsx';
import { root } from '@/build/page.ts';
import { redirect } from '@/components/music/music.tsx';
import { clean_number } from '@/build/tools.ts';
import { parse_scrobbles_as_rank } from '@/components/music/colourful_counts.js';
import { Keybind } from '@/components/settings/clickables/keybind.tsx';

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
	let typing = false;

	const board = createRef();
	const input = createRef();
	const input_wrap = createRef();
	const custom = createRef();

	const elem = (
		<div class='listen-board-wrap'>
			<div class='listen-board' ref={board}>
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
									if (!typing) {
										typing = true;
										update();
									} else {
										typing = false;
										update();
									}
								}}
								ref={custom}
							>
								{tl(trans.custom)}
							</SeeMore>
						</div>
					)}
				</div>
			)}
			<div class='listen-board-input-wrap' ref={input_wrap}>
				<input
					class='listen-board-input'
					ref={input}
					onKeyDown={(e) => {
						if (e.key == 'Escape') {
							e.preventDefault();

							typing = false;
							update();
						}

						if (e.key != 'Enter') return;

						e.preventDefault();

						window.location.href =
							`${root}user/${input.current.value.trim()}/library/music/${redirect()}${url}`;
					}}
					onBlur={() => {
						if (typing) {
							typing = false;
							update();
						}
					}}
				/>
				<span class='listen-board-input-hint'>
					{tl(trans.value_to_close, {
						v: <Keybind value='Escape' />,
					})}
				</span>
			</div>
		</div>
	);

	function update() {
		custom.current?.setAttribute('aria-expanded', String(typing));
		board.current.setAttribute('data-typing', String(typing));
		input_wrap.current.setAttribute('data-typing', String(typing));

		if (typing) {
			input.current.focus();
		} else {
			input.current.blur();
		}
	}

	update();

	return elem;
}

interface ListenProps {
	image?: string;
	name: string;
	plays?: number;
	url?: string;
	artist?: boolean;
}

export function Listen({
	image,
	name,
	plays,
	url,
	artist,
}: ListenProps) {
	const bg = createRef();
	const item_name = createRef();
	const item_image = createRef();
	const item_plays = createRef();

	let last_image = '';
	let banner = '';
	let last_plays = -1;

	const elem = (
		<a
			class={['listen-board-item', 'colourful']}
			href={url &&
				`${root}user/${name}/library/music/${redirect()}${url}`}
		>
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

			if (last_plays != plays) {
				last_plays = plays;

				if (artist) {
					item_plays.current.classList.add('colourful', 'with-rank');

					const rank = parse_scrobbles_as_rank(plays);

					item_plays.current.setAttribute(
						'data-bleh--scrobble-milestone',
						String(rank.milestone),
					);
					item_plays.current.style.setProperty(
						'--hue-over',
						String(rank.hue),
					);
					item_plays.current.style.setProperty(
						'--sat-over',
						String(rank.sat),
					);
					item_plays.current.style.setProperty(
						'--lit-over',
						String(rank.lit),
					);
				}
			}
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
		fetch(`${root}user/${name}/library/music/${redirect()}${url}`)
			.then((res) => {
				return res.text();
			})
			.then((dom) => {
				const doc = new DOMParser().parseFromString(dom, 'text/html');

				const first_metadata_item = doc.querySelector(
					'.metadata-item .metadata-display',
				);

				// sometimes this fails even thou they do have plays, this is just a last.fm bug
				// i dont feel comfortable displaying 0 here as it may not be true
				// but i guess i should?
				if (first_metadata_item) {
					plays = clean_number(
						first_metadata_item.textContent.trim(),
					);
				} else {
					plays = 0;
				}

				update();
			});
	}

	return elem;
}

function view_others_library(url: string) {
}
