/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { page, root } from '@/build/page.ts';
import { createRef } from 'jsx-dom';
import { convert_to_select } from '@/components/select/select.tsx';
import { PanelTop, SeeMore, ViewButtons } from '@/components/text/see_more.tsx';
import { PanelHead } from '@/components/text/head.tsx';
import { icons, SaveIcon } from '@/components/shared/icon.tsx';
import { tl, trans } from '@/build/trans.ts';
import { Tabbed, TabbedPage } from '@/components/tab/tabbed.tsx';
import { SettingGroup } from '@/components/settings/group.tsx';
import { SettingSwitch } from '@/components/settings/provider/switch.tsx';
import { SettingRange } from '@/components/settings/provider/range.tsx';
import { CardTip } from '@/components/text/tip.tsx';
import { menu_tooltip } from '@/components/shared/tooltips.tsx';
import {
	FloatingWindow,
	FloatingWindowContents,
} from '@/components/menu/floating_window.tsx';
import { SettingsFooter } from '@/components/form/footer.tsx';
import { Button } from '@/components/button/button.tsx';
import { get_token, Token } from '@/components/form/token.tsx';
import { SettingSelect } from '@/components/settings/provider/select.tsx';
import { select_prepare } from '@/components/settings/select.ts';

export function profile_artists() {
	const panel = page.structure.main!.querySelector('#top-artists');
	if (!panel) return;

	panel.classList.remove('section-with-settings');

	const form = panel.querySelector('#artist-chart-settings');
	const list = panel.querySelector('#artists_range')!;

	const collage_btn = createRef();
	const settings_btn = createRef();

	const select_btn = panel.querySelector(
		'.dropdown-menu-clickable-button',
	) as HTMLButtonElement;

	if (select_btn) {
		convert_to_select(select_btn);
		select_btn.classList.remove(
			'section-control',
			'dropdown-menu-clickable-button',
		);
	}

	const head = panel.querySelector(':scope > h2');
	head?.remove();

	panel.insertBefore(
		<PanelTop>
			<PanelHead top icon={icons.artists}>
				{tl(trans.artists)}
			</PanelHead>
			<ViewButtons accompany>
				{select_btn}
			</ViewButtons>
			<ViewButtons>
				<SeeMore
					blend
					iconPlacement='left'
					icon={icons.collage}
					ref={collage_btn}
					onClick={() => {
						const btn = list.querySelector(
							'.dropdown-menu-clickable-item--selected',
						);
						if (!btn) return;

						const link = new URL(
							'https://www.last.fm' + btn.getAttribute('href'),
						);
						const selected = link.searchParams.get(
							'artists_date_preset',
						);

						window.location.href =
							`${root}bleh/minis/collage?type=artists&timeframe=date_preset=${selected}`;
					}}
				>
					{tl(trans.collage)}
				</SeeMore>
				<SeeMore
					blend
					iconPlacement='left'
					icon={icons.settings}
					ref={settings_btn}
				>
					{tl(trans.settings)}
				</SeeMore>
			</ViewButtons>
		</PanelTop>,
		panel.firstElementChild,
	);

	let pages: Record<string, TabbedPage> = {
		visual: {
			icon: icons.visual,
			label: tl(trans.visual),
			content: () => (
				<>
					<SettingGroup minWidth>
						<SettingSwitch bind='format_guest_features' />
						<SettingSwitch bind='grid_glow' />
						<SettingRange bind='gloss' />
					</SettingGroup>
					<CardTip minWidth>{tl(trans.bleh_settings_notice)}</CardTip>
				</>
			),
		},
	};

	if (form) {
		if (page.token == '') {
			page.token = get_token(form);
		}

		const timeframe = form.querySelector(
			'[name="chart_range_top_artists"]',
		) as HTMLSelectElement;
		const style = form.querySelector(
			'[name="chart_style_top_artists"]',
		) as HTMLSelectElement;
		const grid_length = form.querySelector(
			'[name="artists_image_grid_length"]',
		) as HTMLSelectElement;
		const chartlist_length = form.querySelector(
			'[name="artists_chartlist_length"]',
		) as HTMLSelectElement;

		const grid = createRef();
		const chart = createRef();

		form.classList = '';
		form.replaceChildren(
			<>
				<Token value={page.token} />
				<SettingGroup minWidth>
					<SettingSelect
						name={tl(trans.default_timeframe)}
						values={select_prepare(timeframe)}
						value={timeframe.value}
						id={timeframe.name}
					/>
					<SettingSelect
						name={tl(trans.chart_style)}
						values={select_prepare(style)}
						value={style.value}
						id={style.name}
						onChange={update}
					/>
					<SettingSelect
						name={tl(trans.chart_size)}
						values={select_prepare(grid_length)}
						value={grid_length.value}
						id={grid_length.name}
						ref={grid}
					/>
					<SettingSelect
						name={tl(trans.chart_size)}
						values={select_prepare(chartlist_length)}
						value={chartlist_length.value}
						id={chartlist_length.name}
						ref={chart}
					/>
				</SettingGroup>
				<SettingsFooter gap>
					<Button
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

		function update(v: string) {
			grid.current.setAttribute('data-hidden', String(v != 'grid'));
			chart.current.setAttribute('data-hidden', String(v != 'list'));
		}

		update(style.value);
	}

	menu_tooltip(
		settings_btn.current,
		<FloatingWindow>
			<FloatingWindowContents>
				<Tabbed pages={pages} />
			</FloatingWindowContents>
		</FloatingWindow>,
	);

	return panel;
}
