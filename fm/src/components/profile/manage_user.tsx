/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import tippy from 'tippy.js';
import { auth, page } from '@/build/page';
import { html } from 'lighterhtml';
import { tl, trans } from '@/build/trans';
import { copy } from '@/build/tools';
import { share } from '@/components/dialog/share';
import { ff } from '@/components/settings/sku';
import { menu_tooltip } from '@/components/shared/tooltips.tsx';
import { MenuContents } from '@/components/menu/menu.tsx';
import { Button } from '@/components/button/button.tsx';
import { Icon, icons } from '@/components/shared/icon.tsx';

export function manage_user(button) {
	const can_block = ff('can_block_in_menu');
	const can_report = ff('can_report_in_menu');
	const can_block_or_report = (can_block || can_report) &&
		page.name != auth.name;

	menu_tooltip(
		button,
		<MenuContents>
			<Button
				menu
				onClick={() => {
					copy(page.name);
				}}
			>
				<Icon name={icons.copy} />
				{tl(trans.copy_username)}
			</Button>
			<Button
				menu
				onClick={() => {
					share(window.location.href);
				}}
			>
				<Icon name={icons.share} />
				{tl(trans.share)}
			</Button>
			{can_block_or_report && (
				<>
					<div class='sep' />
					{can_block && (
						<Button
							menu
							colourful
							accented
							className='delete'
							onClick={() => {
								block_user(page.name);
							}}
						>
							<Icon name={icons.block} />
							{tl(trans.block)}
						</Button>
					)}
					{can_report && (
						<Button
							menu
							colourful
							accented
							className='delete'
							onClick={() => {
								report_user(page.name);
							}}
						>
							<div class='auth-dropdown-item-row'>
								<span class='auth-dropdown-item-left'>
									<Icon name={icons.report} />
									{tl(trans.report)}
								</span>
								<span class='auth-dropdown-item-right'>
									<Icon name={icons.external} />
								</span>
							</div>
						</Button>
					)}
				</>
			)}
		</MenuContents>,
	);
}

export function block_user(user = page.name) {
	// coming soon
}

export function report_user(user = page.name) {
	open(
		'https://support.last.fm/u/lastfmsupport/summary',
		'targetWindow',
		'popup=true,width=1000,height=700',
	);
}
