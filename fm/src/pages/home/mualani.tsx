/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { register_background, update_page } from '@/page';
import { auth, page } from '@/build/page';
import { log } from '@/build/log.js';
import { checkup_page_structure } from '@/components/page/structure.js';
import { html, render } from 'lighterhtml';
import { notify } from '@/components/dialog/notify';
import { download_with_progress } from '@/build/tools';
import { status } from '@/components/dialog/status.js';
import { dialog } from '@/components/dialog/dialog';
import { setting } from '@/components/settings/settings';
import { markdown, markdown_field } from '@/components/markdown/markdown';
import { sponsor_list } from '@/build/sponsor';
import { create_badge, load_badges } from '@/components/shared/badge';
import { clamp_lit, clamp_sat, rgb_to_oklch } from '@/build/tools';
import { chartlist_bar } from '@/components/music/bar';
import { avatar } from '@/components/shared/avatar';
import { click_indicator } from '@/components/shared/indicator';
import { ReactNode } from 'jsx-dom';
import { SettingGroup } from '@/components/settings/group.tsx';
import { SettingAction } from '@/components/settings/provider/action.tsx';
import { SettingInfo } from '@/components/settings/provider/info.tsx';
import { Switch } from '@/components/settings/clickables/switch.tsx';
import { Checkbox } from '@/components/settings/clickables/checkbox.tsx';
import { SettingSwitch } from '@/components/settings/provider/switch.tsx';

export function mualani() {
	page.structure.container = document.body.querySelector('.page-content');
	try {
		page.structure.row = page.structure.container.querySelector('.row');
		page.structure.main = page.structure.row.querySelector('.col-main');
		page.structure.side = page.structure.row.querySelector('.col-sidebar');
	} catch (e) {
		log('unable to find elements', 'page structure');
	}

	checkup_page_structure();

	register_background(avatar(auth.avatar, 'ar0'));

	page.type = 'bleh_mualani';
	page.subpage = '';

	log('status is', 'page', 'info', page);

	update_page();

	// remove error stuff cus we control this page
	page.structure.row.removeChild(page.structure.row.firstElementChild);
	page.structure.row.removeChild(page.structure.row.firstElementChild);

	page.structure.content?.classList.add('single-column');

	let md_body;
	const md_options = {
		allow_headers: true,
		allow_banners: true,
		allow_icons: true,
		allow_hue: true,
		allow_fonts: true,
		allow_socials: true,
		allow_alignment: true,
		allow_lists: true,
	};

	let md_body_links;

	const colours = [
		[0, 0, 0],
		[64, 64, 64],
		[128, 128, 128],
		[255, 255, 255],
		[137, 105, 128],
		[217, 85, 102],
		[243, 179, 134],
		[122, 68, 205],
		[86, 126, 81],
		[188, 243, 211],
		[195, 121, 82],
		[26, 99, 253],
		[255, 0, 220],
		[255, 216, 0],
		[0, 127, 70],
		[38, 127, 0],
		[0, 255, 255],
		[12, 7, 34],
	];

	let bars;

	page.structure.main!.replaceChildren(
		<>
			<section>
				<DemoGrid>
					<DemoItem label='SettingAction'>
						<SettingGroup>
							<SettingAction
								name='Setting name'
								body='Setting body'
							>
								action goes here!!
							</SettingAction>
						</SettingGroup>
					</DemoItem>
					<DemoItem label='SettingInfo'>
						<SettingGroup>
							<SettingInfo
								name='Setting name'
								body='Setting body'
							>
								info goes here!!
							</SettingInfo>
						</SettingGroup>
					</DemoItem>
					<DemoItem label='Switch'>
						<Switch />
						<Switch checked />
					</DemoItem>
					<DemoItem label='Checkbox'>
						<Checkbox />
						<Checkbox checked />
					</DemoItem>
					<DemoItem label='SettingSwitch'>
						<SettingGroup>
							<SettingSwitch
								name='Setting name'
								body='Setting body'
							/>
						</SettingGroup>
					</DemoItem>
				</DemoGrid>
			</section>
			<section>
				<DemoGrid>
					<DemoItem label='SettingSwitch (binded to underline_links)'>
						<SettingGroup>
							<SettingSwitch bind='underline_links' />
						</SettingGroup>
					</DemoItem>
				</DemoGrid>
			</section>
		</>,
	);

	return;

	render(
		page.structure.main,
		html`
			<section class="flexy">
				<h2>Buttons</h2>
				<div class="flexy h">
					<button class="btn">Button</button>
					<button class="btn primary">Button</button>
					<button class="btn" disabled>Button</button>
					<button class="btn primary" disabled>Button</button>
				</div>
				<div class="flexy h">
					<button class="btn danger-subtle">Button</button>
					<button class="btn primary danger">Button</button>
					<button class="btn danger-subtle" disabled>Button</button>
					<button class="btn primary danger" disabled>Button</button>
				</div>
				<div class="flexy h">
			        ${click_indicator()}
			    </div>
			</section>
			<section class="flexy">
				<h2>Settings</h2>
				<div class="setting-group">
			        ${setting({ id: 'solarium' })} ${setting({ id: 'gloss' })}
			        ${setting({ id: 'expand_tracks' })}
			        ${setting({ id: 'romanise_jp' })}
			        ${setting({
				id: 'navigation_items',
				list: page.state.quick_access_items,
			})}
			    </div>
				<div class="tippy-box" data-theme="context-menu" data-state="visible">
					<div class="tippy-content">
			            ${setting({ id: 'solarium', in_menu: true })}
			            ${setting({ id: 'romanise_jp', in_menu: true })}
			            ${setting({ id: 'expand_tracks', in_menu: true })}
			        </div>
				</div>
			</section>
			<section class="flexy">
				<h2>Notifications</h2>
				<div class="flexy h">
					<button
						class="btn continue"
						onclick=${() =>
							notify({
								id: 'test',
								title: 'testing!',
								body: 'haaaiaiii test bodyyy.......',
							})}
					>
			            Deliver notification
			        </button>
					<button
						class="btn continue"
						onclick=${() =>
							notify({
								id: 'test',
								title: 'testing!',
								body: 'haaaiaiii test bodyyy.......',
								persist: true,
							})}
					>
			            Deliver persistent notification
			        </button>
					<button
						class="btn continue"
						onclick=${() => {
							let notification = notify({
								id: 'async',
								title: 'progress',
								body: 'downloading...',
								progress: true,
							});

							download_with_progress(
								`https://lastfm.freetls.fastly.net/i/u/ar0/6644c67eaa3669676252d3190f9b019f.jpg?a=${Math.random()}`,
								(percent) => {
									notification.set_body(
										`downloading... ${percent}%`,
									);
									notification.set(percent);
								},
							).then(async (blob) => {
								const text = await blob.text();

								notification.set_body('download complete');
								notification.set(100);

								console.info(text);
							});
						}}
					>
			            Deliver async progress notification
			        </button>
				</div>
			</section>
			<section class="flexy">
				<h2>Status alerts</h2>
				<button
					class="btn continue"
					onclick=${() =>
						status({
							title: 'test alert',
							body: 'haiaiai nothing to worry about >_<',
						})}
				>
			        Deliver status alert
			    </button>
			</section>
			<section class="flexy">
				<h2>Modals</h2>
				<button class="btn continue" onclick=${() => dialog_loop()}>
			        Open dialog loop
			    </button>
			</section>
			<section class="flexy">
			    <h2>Markdown (with bio settings)</h2>
			    ${markdown_field((val) => {
				render(md_body, markdown(val, md_options));
			}, md_options)}
			    <div class="sep" />
			    <div class="markdown-body" ref=${(el) => md_body = el} />
			</section>
			<section class="flexy">
			    <h2>Markdown (with defaults)</h2>
			    ${markdown_field((val) => {
				render(md_body_default, markdown(val));
			})}
			    <div class="sep" />
			    <div class="markdown-body" ref=${(el) =>
				md_body_default = el} />
			</section>
			<section class="flexy">
				<h2>Graph colours</h2>
				<div style="display: flex; flex-wrap: wrap; gap: 8px">
			        ${Array.from({ length: 13 }, (_, i) => {
				return html.node`
                            <div style="display: flex; flex-direction: column; gap: 10px">
                                <div style="width: 40px; height: 40px; background-color: var(--graph-colour-${i})" />
                                <div style="width: 40px; height: 3px; background-color: var(--graph-colour-${i})" />
                            </div>
                        `;
			})}
			    </div>
			</section>
			<section class="flexy">
				<div class="inner-preview pad">
					<div class="bars" ref=${(el) => (bars = el)}>
			            ${() => {
				let max = 100_000;

				for (
					let value = 0;
					value <= max;
					value += 200
				) {
					bars.appendChild(chartlist_bar(value, max));
				}
			}}
			        </div>
				</div>
			</section>
			<section class="flexy">
				<h2>Colour conversions</h2>
				<div class="colour-list">
			            ${colours.map((colour) => {
				const hsl = rgb_to_oklch(colour[0], colour[1], colour[2]);

				hsl.s = clamp_sat((hsl.s / 100) * 3);

				const hue = {
					h: hsl.h,
					s: hsl.s,
					l: clamp_lit(hsl.s, hsl.l / 100 + 0.35),
				};

				return html.node`
                                <div class="colour-list-item">
                                    <div class="colour-tile colourful" style="background: rgb(${
					colour[0]
				}, ${colour[1]}, ${colour[2]})" />
                                    <div class="colour-text">rgb(${
					colour[0]
				}, ${colour[1]}, ${colour[2]})</div>
                                    <div class="bleh-icon" data-type="arrow-right" style="--icon: var(--mask)" />
                                    <div class="colour-tile colourful" style="--hue-over: ${hue.h}; --sat-over: ${hue.s}; --lit-over: ${hue.l}" />
                                    <div class="colour-text">hue ${hue.h}, sat ${hue.s}, lit ${hue.l}</div>
                                </div>
                            `;
			})}
			    </div>
			</section>
			<section class="flexy">
				<h2>Badges</h2>
				<div class="button-group">
			        ${sponsor_list.version
				? Object.entries(sponsor_list.users).map(([user, contents]) => {
					const badges = load_badges(user);

					return html.node`
                            ${
						badges.map((badge) => {
							if (
								badge.type == 'sponsor' && !badge.icon
							) return html.node``;

							return create_badge(badge, false, true);
						})
					}
                        `;
				})
				: ''}
			    </div>
				<div class="button-group">
			        ${sponsor_list.version
				? Object.entries(sponsor_list.users).map(([user, contents]) => {
					const badges = load_badges(user);

					return html.node`
                            ${
						badges.map((badge) => {
							if (
								badge.type == 'sponsor' && !badge.icon
							) return html.node``;

							return create_badge(badge, false, true, true);
						})
					}
                        `;
				})
				: ''}
			    </div>
			</section>
			<section class="flexy">
				<h2>Brand</h2>
				<div class="brand-container-demo">
					<div class="brand-demo" />
				</div>
				<div class="brand-container-demo">
					<div class="brand-demo brand-demo-mask" />
				</div>
				<div class="brand-container-demo empty">
					<div class="brand-demo" />
					<div class="brand-demo brand-demo-small" />
				</div>
			</section>
			<section class="flexy">
				<h2>Links</h2>
				<div class="markdown-body" ref=${(el) => md_body_links = el} />
			</section>
		`,
	);

	page.structure.main!.appendChild(
		<section>
			<p>jsx test (tsx)</p>
		</section>,
	);

	const link_text = `
        [links]
        https://x.com/ZZZ_EN
        https://twitter.com/ZZZ_EN
        https://open.spotify.com/album/4T7qu6MdxoGjzZPErRWgsO
        https://youtube.com
        https://github.com
        https://discord.com
        https://bandcamp.com
        https://soundcloud.com
        https://tiktok.com
        https://ko-fi.com
        https://patreon.com
        https://twitch.tv
        https://linktr.ee
        https://carrd.co
        https://music.apple.com
        https://music.youtube.com
        https://facebook.com
        https://discogs.com
        https://tidal.com
        https://record.club
        https://rateyourmusic.com
        https://albumoftheyear.org
        https://kyu.re
        https://katelyn.moe
        https://google.com
        https://mastodon.social
        https://bsky.app
        https://reddit.com
        [/links]
    `;

	render(
		md_body_links,
		markdown(link_text, {
			allow_socials: true,
		}),
	);
}

function dialog_loop() {
	const num = Math.random();

	dialog({
		id: `loop_${num}`,
		title: num,
		body: html.node`
            <button onclick=${() => dialog_loop()}>Open a new dialog</button>
        `,
	});
}

function DemoGrid({ children }: { children: ReactNode }) {
	return (
		<div class='demo-grid'>
			{children}
		</div>
	);
}

function DemoItem({ children, label }: { children: ReactNode; label: string }) {
	return (
		<div class='demo-item'>
			<h4 class='demo-label'>{label}</h4>
			{children}
		</div>
	);
}
