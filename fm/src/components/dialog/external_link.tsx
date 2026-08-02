/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { dialog, dialog_rm } from '@/components/dialog/dialog.tsx';
import { log } from '@/build/log.js';
import { tl, trans } from '@/build/trans.ts';
import { save_setting } from '@/components/settings/settings.ts';
import { toggle } from '@/components/settings/toggle.js';
import { settings } from '@/build/config.ts';

export function external_url_prompt(url: string, dangerous = false) {
	log(
		`prompted warning for url ${url}, dangerous is ${dangerous}`,
		'markdown',
	);

	const link = new URL(url);
	const scheme = link.protocol;
	const hostname = link.hostname;
	const path = link.pathname + link.search + link.hash;

	let trust_site: HTMLElement;

	dialog({
		id: 'external_url',
		type: 'leaving_site',
		body: (
			<>
				<div class={['modal-vertical-inner', 'leaving-site-inner']}>
					{!dangerous
						? (
							<>
								<h1>{tl(trans.leaving_site.name)}</h1>
								<p>{tl(trans.leaving_site.body)}</p>
							</>
						)
						: (
							<>
								<h1>{tl(trans.leaving_site_dangerous.name)}</h1>
								<p>{tl(trans.leaving_site_dangerous.body)}</p>
							</>
						)}
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
					{hostname != ''
						? (
							trust_site = toggle({
								type: 'checkbox',
								title: tl(trans.leaving_site_checkbox, {
									v: hostname,
								}),
							})
						)
						: ''}
				</div>
				<div class='modal-footer'>
					<button
						type='button'
						class={['see-more', 'cancel', 'left-icon']}
						onClick={() => dialog_rm({ id: 'external_url' })}
					>
						{tl(trans.back)}
					</button>
					<button
						type='button'
						class={['btn', 'primary', 'continue']}
						onClick={() => {
							if (trust_site?.checked()) {
								save_setting('trusted_sites', [
									...settings.trusted_sites,
									hostname,
								]);
								log(
									`added ${hostname} to trusted sites`,
									'markdown',
								);
							}

							open(url, '_blank');
							dialog_rm({ id: 'external_url' });
						}}
					>
						{!dangerous ? tl(trans.visit) : tl(trans.open)}
					</button>
				</div>
			</>
		),
	});
}
