import { page, root } from '@/build/page.ts';
import { createRef } from 'jsx-dom';
import { PanelTop, SeeMore, ViewButtons } from '@/components/text/see_more.tsx';
import { lang, tl, trans } from '@/build/trans.ts';
import { InfoTip } from '@/components/text/tip.tsx';
import { Icon, icons } from '@/components/shared/icon.tsx';
import { create_profile_note_panel } from '@/pages/profile/profile.tsx';
import { menu_tooltip } from '@/components/shared/tooltips.tsx';
import { MenuContents } from '@/components/menu/menu.tsx';
import { Button } from '@/components/button/button.tsx';
import { copy, get_language_name, sanitise, translate } from '@/build/tools.ts';
import { useSettings } from '@/page.ts';
import { markdown } from '@/components/markdown/markdown.tsx';
import { TranslatedHeader } from '@/components/shared/translate.tsx';

export type AboutElement = HTMLDivElement & {
	translated: boolean;
};

export const profile_bio_markdown_settings = {
	allow_headers: true,
	allow_banners: true,
	allow_icons: true,
	allow_hue: true,
	allow_fonts: true,
	allow_socials: true,
	allow_alignment: true,
	allow_lists: true,
};

export function profile_about(
	panel: AboutElement,
	text: string,
	own_profile: boolean,
) {
	const head = panel.querySelector('h2');
	if (head) head.remove();

	let profile_note = '';

	if (!own_profile) {
		const notes = JSON.parse(
			localStorage.getItem('bleh_profile_notes') || '{}',
		);
		profile_note = notes[page.name];
	}

	const open_settings = createRef();
	const add_note = createRef();
	const translator = createRef();

	panel.insertBefore(
		<PanelTop>
			<h2 class='about-me-title'>
				{tl(trans.about)}
				<InfoTip>
					test
				</InfoTip>
			</h2>
			<ViewButtons blend blendV2>
				{own_profile
					? (
						<SeeMore
							blend
							iconPlacement='left'
							icon={icons.edit}
							href={`${root}settings#id_about_me`}
						>
							{tl(trans.edit)}
						</SeeMore>
					)
					: !profile_note && (
						<SeeMore
							blend
							iconPlacement='left'
							icon={icons.plus}
							ref={add_note}
							onClick={() => {
								create_profile_note_panel(profile_note);
								add_note.current.remove();
							}}
						>
							{tl(trans.add_note)}
						</SeeMore>
					)}
				<SeeMore
					blend
					iconPlacement='left'
					icon={icons.more}
					ref={open_settings}
				>
					{tl(trans.more)}
				</SeeMore>
			</ViewButtons>
		</PanelTop>,
		panel.firstChild,
	);

	menu_tooltip(
		open_settings.current,
		<MenuContents>
			<Button
				menu
				ref={translator}
				onClick={() => {
					translator.current.setAttribute('disabled', '');

					if (panel.translated) return;

					translate(text, lang).then((res) => {
						panel.translated = true;

						if (useSettings.get('bio_markdown')) {
							res.translated = markdown(
								res.translated,
								profile_bio_markdown_settings,
							);
							res.translated.classList.add('about-me-content');
						}

						const detected = get_language_name(res.detected);

						panel.appendChild(
							<>
								<TranslatedHeader from={detected} />
								<div class='translated-body'>
									{res.translated}
								</div>
							</>,
						);
					});
				}}
			>
				<Icon name={icons.translate} />
				{tl(trans.translate)}
			</Button>
			<Button
				menu
				onClick={() => {
					copy(text);
				}}
			>
				<Icon name={icons.copy} />
				{tl(trans.copy_text)}
			</Button>
		</MenuContents>,
	);

	if (!own_profile && profile_note) {
		create_profile_note_panel(profile_note);
	}
}
