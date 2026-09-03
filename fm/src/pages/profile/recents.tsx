import { auth, page, root } from '@/build/page.ts';
import { ff } from '@/components/settings/sku.ts';
import { createRef } from 'jsx-dom';
import { PanelTop, SeeMore, ViewButtons } from '@/components/text/see_more.tsx';
import { PanelHead } from '@/components/text/head.tsx';
import { icons, SaveIcon } from '@/components/shared/icon.tsx';
import { tl, trans } from '@/build/trans.ts';
import {
	get_profile_streak,
	ProfileStreak,
} from '@/components/profile/streak.tsx';
import { submit_scrobble } from '@/components/music/scrobble.ts';
import {
	hover_tooltip,
	menu_tooltip,
	Tooltip,
} from '@/components/shared/tooltips.tsx';
import {
	FloatingWindow,
	FloatingWindowContents,
} from '@/components/menu/floating_window.tsx';
import { Tabbed, TabbedPage } from '@/components/tab/tabbed.tsx';
import { SettingsFooter } from '@/components/form/footer.tsx';
import { Button } from '@/components/button/button.tsx';
import { SettingSwitch } from '@/components/settings/provider/switch.tsx';
import { SettingSelect } from '@/components/settings/provider/select.tsx';
import { select_prepare } from '@/components/settings/select.ts';
import { SettingGroup } from '@/components/settings/group.tsx';
import { get_token, Token } from '@/components/form/token.tsx';
import { CardTip } from '@/components/text/tip.tsx';

export function profile_recents() {
	const panel = page.structure.main!.querySelector('#recent-tracks-section');
	if (!panel) return;

	const more_link = panel.nextElementSibling;
	if (more_link) panel.appendChild(more_link);

	const form = panel.querySelector('#recent-tracks-settings');

	const can_scrobble = ff('submit_scrobble') && page.name == auth.name;

	const head = panel.querySelector(':scope > h2');
	if (head) head.remove();

	const can_api = localStorage.getItem('bleh_auth') &&
		localStorage.getItem('bleh_auth_valid') === 'true';

	const submit_btn = createRef();
	const settings_btn = createRef();
	const refresh_btn = createRef();
	const streak = createRef();

	//const modal_id = 'profile_settings';

	panel.insertBefore(
		<PanelTop>
			<PanelHead icon={icons.recent}>
				{tl(trans.recents)}
			</PanelHead>
			{ff('yuzu') && (
				<ViewButtons accompany>
					<ProfileStreak loading ref={streak} />
				</ViewButtons>
			)}
			<ViewButtons>
				{can_scrobble && (
					<SeeMore
						blend
						iconPlacement='left'
						icon={icons.plus}
						ref={submit_btn}
						onClick={() => {
							submit_scrobble({
								can_api,
								func: () => {
									setTimeout(() => {
										refresh_tracks(refresh_btn.current, {
											quiet: true,
										});
									}, 200);
								},
							});
						}}
					>
						{tl(trans.scrobble)}
					</SeeMore>
				)}
				<SeeMore
					blend
					iconPlacement='left'
					icon={icons.refresh}
					ref={refresh_btn}
					onClick={() => {
						refresh_tracks(refresh_btn.current, {}, () => {
							streak.current.replaceWith(
								<ProfileStreak loading ref={streak} />,
							);

							if (ff('yuzu')) {
								get_profile_streak(
									streak,
									panel as HTMLDivElement,
								);
							}
						});
					}}
				>
					{tl(trans.refresh)}
				</SeeMore>
				<SeeMore
					blend
					iconPlacement='left'
					icon={icons.settings}
					onClick={() => {
						/*dialog({
							id: modal_id,
							icon: icons.recent,
							title: tl(trans.recents),
							body: <Tabbed pages={pages} />,
						});*/
					}}
					ref={settings_btn}
				>
					{tl(trans.settings)}
				</SeeMore>
			</ViewButtons>
		</PanelTop>,
		panel.firstElementChild,
	);

	if (!can_api && submit_btn.current) {
		hover_tooltip(
			submit_btn.current,
			<Tooltip>{tl(trans.requires_api_in_settings)}</Tooltip>,
		);
	}

	let pages: Record<string, TabbedPage> = {
		visual: {
			icon: icons.visual,
			label: tl(trans.visual),
			content: () => (
				<>
					<SettingGroup minWidth>
						<SettingSwitch bind='format_guest_features' />
						<SettingSwitch bind='show_guest_features' />
					</SettingGroup>
					<CardTip>{tl(trans.bleh_settings_notice)}</CardTip>
				</>
			),
		},
	};

	if (form) {
		if (page.token == '') {
			page.token = get_token(form);
		}

		const count = form.querySelector(
			'[name="chart_length_recent_tracks"]',
		) as HTMLSelectElement;
		const artwork = form.querySelector(
			'#id_show_recent_tracks_artwork',
		) as HTMLInputElement;
		const realtime = form.querySelector(
			'#id_auto_refresh_recent_tracks',
		) as HTMLInputElement;

		form.classList = '';
		form.replaceChildren(
			<>
				<Token value={page.token} />
				<SettingGroup minWidth>
					<SettingSelect
						name={tl(trans.amount_to_display)}
						values={select_prepare(count)}
						value={count.value}
						id={count.name}
					/>
					<SettingSwitch
						name={tl(trans.recent_artwork)}
						value={artwork.checked}
						id={artwork.name}
					/>
					<SettingSwitch
						name={tl(trans.recent_realtime.name)}
						body={tl(trans.recent_realtime.body)}
						value={realtime.checked}
						id={realtime.name}
					/>
				</SettingGroup>
				<SettingsFooter gap>
					<Button
						onClick={() => {
							//dialog_rm({ id: modal_id });
						}}
						primary
						type='submit'
					>
						<SaveIcon />
						{tl(trans.save)}
					</Button>
				</SettingsFooter>
			</>,
		);

		pages = {
			behaviour: {
				icon: icons.global,
				label: tl(trans.behaviour),
				content: form,
			},
			...pages,
		};

		form.remove();
	}

	menu_tooltip(
		settings_btn.current,
		<FloatingWindow>
			<FloatingWindowContents>
				<Tabbed pages={pages} />
			</FloatingWindowContents>
		</FloatingWindow>,
	);

	if (ff('yuzu')) {
		get_profile_streak(streak, panel as HTMLDivElement);
	}

	return panel;
}

function refresh_tracks(
	button: HTMLButtonElement,
	{ quiet = false },
	func?: () => void,
) {
	const panel = page.structure.main!.querySelector('#recent-tracks-section');
	panel!.classList.remove('has-refreshed');
	button.setAttribute('disabled', '');

	// we need to fetch the tracklist, this function presumes that
	// the user has a tracklist to begin with, as that is the only
	// way to call the function on the frontend
	fetch(`${root}user/${page.name}/partial/recenttracks?ajax=1`)
		.then(function (response) {
			console.log('returned', response, response.text);

			return response.text();
		})
		.then(function (html) {
			const doc = new DOMParser().parseFromString(html, 'text/html');
			console.log('DOC', doc);

			const tracklist_panel = doc.querySelector('.chartlist');

			button.removeAttribute('disabled');

			if (!tracklist_panel) {
				if (!quiet) {
					status({
						title: tl(trans.recents),
						body: tl(trans.value_failed_to_load).replace(
							'{v}',
							tl(trans.library),
						),
						type: 'error',
					});
				}
				return;
			}

			if (!quiet) {
				status({
					title: tl(trans.recents),
					body: tl(trans.refreshed),
				});
			}
			panel!.classList.add('has-refreshed');

			panel.querySelector('.chartlist')!.outerHTML =
				tracklist_panel.outerHTML;

			if (func) func();
		});
}
