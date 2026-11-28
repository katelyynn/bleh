/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { dialog, dialog_rm, modal, ModalFooter } from '@/components/dialog/dialog.tsx';
import { log } from '@/build/log.ts';
import { tl, trans } from '@/build/trans.ts';
import { save_setting } from '@/components/settings/settings.tsx';
import { toggle } from '@/components/settings/toggle.js';
import { settings } from '@/build/config.ts';
import { useSettings } from '@/page.tsx';
import { SettingCheckbox } from '@/components/settings/provider/checkbox.tsx';
import { createRef } from 'jsx-dom';
import { SeeMore } from '@/components/text/see_more.tsx';
import { Icon, icons } from '@/components/shared/icon.tsx';
import { Button } from '@/components/button/button.tsx';
import { IconLabel } from '../text/text';

export function external_url_prompt(url: string, dangerous = false) {
	log(
		`prompted warning for url ${url}, dangerous is ${dangerous}`,
		'markdown',
	);

	const link = new URL(url);
	const scheme = link.protocol;
	const hostname = link.hostname;
	const path = link.pathname + link.search + link.hash;

	const trust_site = createRef();

	modal({
		id: 'external_url',
		title: !dangerous ? tl(trans.leaving_site.name) : tl(trans.leaving_site_dangerous.name),
		body: (
			<>
				<p>{tl(trans.leaving_site.body)}</p>
				<div
					class={['external-warn-input']}
					data-dangerous={String(dangerous)}
				>
					<span class='scheme'>
						{scheme}
						{'//'}
					</span>
					<span class='hostname'>
						{hostname || path}
					</span>
					{(path != '/' && hostname)
						? (
							<span class='path'>
								{path}
							</span>
						)
						: ''}
				</div>
				{hostname != '' && (
					<SettingCheckbox
						name={tl(trans.leaving_site_checkbox, {
							v: hostname,
						})}
						standalone
						ref={trust_site}
					/>
				)}
			</>
		),
		actions: [
			{
				primary: true,
				onClick: () => {
					if (trust_site.current.value) {
						useSettings.append('trusted_sites', hostname);
						log(
							`added ${hostname} to trusted sites`,
							'markdown',
						);
					}

					open(url, '_blank');
					dialog_rm({ id: 'external_url' });
				},
				children: (
					<>
						{!dangerous ? tl(trans.visit) : tl(trans.open)}
						<Icon name={icons.external} />
					</>
				)
			}
		]
	});
}
