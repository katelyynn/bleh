/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { html } from 'lighterhtml';
import { lang, lang_info, tl, trans } from '@/build/trans';
import { sponsor_list } from '@/build/sponsor';
import { root } from '@/build/page';
import { sponsor } from '@/components/sponsor';
import { version } from '@/main';
import { settings } from '@/build/config';
import { Icon, icon, icons } from '../shared/icon';
import { useSettings } from '@/page.ts';

export function bleh_footer() {
	const footer = document.body.querySelector('footer.footer');
	if (!footer) return;

	let kate = 'katelyn';
	let sponsoring = 0;

	if (sponsor_list.version) {
		if (sponsor_list.related.special.length > 0) {
			kate = sponsor_list.related.special[0];
		}

		sponsoring = Object.keys(sponsor_list.users).length - 2;
	}

	const bleh_website = 'https://bleh.katelyn.moe';
	const contributors =
		'https://github.com/katelyynn/bleh/graphs/contributors';
	const source = 'https://github.com/katelyynn/bleh';
	const issue = 'https://github.com/katelyynn/bleh/issues/new/choose';

	footer.appendChild(
		<>
			<div class='footer-bleh'>
				<a
					class={['bleh-logo-footer', 'b']}
					href={bleh_website}
					target='_blank'
				>
					{version.brand}
				</a>
				<span class='footer-version'>
					{version.build}
				</span>
				<div class={['new-badge', 'sku', 'spacing']}>
					{version.sku}
					{useSettings.get('dev') && (
						<span class='bleh-icon-container'>
							<Icon name={icons.dev} />
						</span>
					)}
				</div>
				<FooterDot />
				<div class='footer-credit'>
					<p class='footer-credit-text'>
						{tl(trans.made_with_love, {
							u: (
								<a class='b' href={`${root}user/${kate}`}>
									{kate}
								</a>
							),
							c: (
								<a class='b' href={contributors}>
									{tl(trans.made_with_love.contributors)}
								</a>
							),
							h: (
								<span
									class={[
										'bleh-icon',
										'heart',
										'sponsor-related',
										'colourful',
									]}
									onClick={() => sponsor()}
								>
									{tl(trans.love_lower)}
								</span>
							),
						})}
					</p>
				</div>
				<FooterDot />
				<div class='footer-web'>
					<a
						class={['btn', 'music-link', 'icon']}
						data-type='source'
						href={source}
						target='_blank'
					>
						{tl(trans.view_source)}
					</a>
					<FooterDot />
					<a
						class={['btn', 'music-link', 'icon']}
						data-type='issue'
						href={issue}
						target='_blank'
					>
						{tl(trans.report_issue)}
					</a>
				</div>
			</div>
			{(lang != 'en' && lang in lang_info) && (
				<div class='footer-bleh-top'>
					<div class='footer-credit'>
						<p>
							{tl(trans.translations, {
								l: lang_info[lang].name,
								u: (
									<span class='b'>
										{lang_info[lang].by.map((user, i) => (
											<a
												href={`${root}user/${user}`}
												key={i}
											>
												{user}
											</a>
										)).join(', ')}
									</span>
								),
							})}
						</p>
					</div>
				</div>
			)}
		</>,
	);
}

function FooterDot() {
	return <div class='footer-dot' />;
}
