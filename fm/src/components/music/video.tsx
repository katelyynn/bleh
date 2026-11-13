import { page } from "@/build/page";
import { PanelTop, ViewButtons } from "../text/see_more";
import { PanelHead } from "../text/head";
import { Icon, icons } from "../shared/icon";
import { tl, trans } from "@/build/trans";
import { IconLabel } from "../text/text";

export function trackVideo() {
	const video_col = document.body.querySelector(
		'.track-overview-video-column.col-sidebar',
	) as HTMLElement;

	if (!video_col) {
		page.structure.side!.appendChild(
			<section class='track-video'>
				<PanelTop>
					<PanelHead icon={icons.video} top>
						{tl(trans.watch)}
					</PanelHead>
				</PanelTop>
				<div class='video-placeholder'>
					<Icon name={icons.video_broken} />
					{tl(trans.video_removed)}
				</div>
			</section>
		);

		return;
	}

	const video = video_col.querySelector('.video-preview');

	video_col.classList.remove('col-sidebar');

	const replace = video_col.querySelector('.video-preview-replace a') as HTMLAnchorElement;

	if (replace) {
		replace.classList = 'blend-v2-btn left-icon';
		replace.replaceChildren(
			<IconLabel icon={icons.edit}>
				{tl(trans.edit)}
			</IconLabel>
		);
	}

	const panel = (
		<section class='track-video'>
			<PanelTop>
				<PanelHead icon={icons.video} top>
					{tl(trans.watch)}
				</PanelHead>
				{replace && (
					<ViewButtons>
						{replace}
					</ViewButtons>
				)}
			</PanelTop>
			{video_col}
		</section>
	);

	page.structure.side!.insertBefore(
		panel,
		page.structure.side!.firstElementChild,
	);

	if (video) {
		const playlink = video.querySelector('.video-preview-playlink a') as HTMLAnchorElement;
		playlink?.remove();

		video.appendChild(
			<a class={['link-block-cover-link', 'track-video-cover']} href={playlink.href} target='_blank'>
				<span class='track-video-play'>
					<Icon name={icons.play} />
				</span>
			</a>
		);
	}
}
