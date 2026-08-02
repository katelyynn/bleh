/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { auth, page, root } from '@/build/page';
import { html, render } from 'lighterhtml';
import { patch_wiki_contents } from '@/pages/music/wiki';
import { redirect } from '@/components/music/music';
import showdown from 'showdown';
import DOMPurify from 'dompurify';
import { expand_avatar } from '@/components/shared/avatar';
import { tl, trans } from '@/build/trans';
import { dialog, dialog_rm } from '@/components/dialog/dialog';
import { settings, settings_store } from '@/build/config';
import { log } from '@/build/log.js';
import { save_profile_cache } from '@/pages/profile/profile';
import { toggle } from '@/components/settings/toggle';
import { save_setting } from '@/components/settings/settings';
import { load_chart_colours } from '@/components/music/chart';
import { sponsor_list } from '@/build/sponsor';
import { fetch_status } from '@/components/profile/statuscafe';
import tippy from 'tippy.js';
import { DateTime } from 'luxon';
import { input } from '@/components/settings/input';
import { queue_popup } from '@/components/dialog/popup';
import { markdown_options, social_link } from '@/types/markdown';
import { profile_cache_list } from '@/types/profile';
import { keys } from '../settings/storage';
import { is_sponsor } from '@/components/sponsor';
import { proxy_images } from '@/components/markdown/proxy.tsx';
import { status_cafe } from '@/components/markdown/statuscafe.tsx';
import { time } from '@/components/markdown/time.tsx';
import {
	social_links,
	social_links_extension,
} from '@/components/markdown/links.tsx';

export function markdown(
	text: string,
	{
		allow_headers = false,
		starting_header = 3,
		allow_links = true,
		line_breaks = true,
		allow_banners = false,
		in_dialog = false,
		allow_icons = true,
		allow_hue = false,
		allow_fonts = false,
		take_effect = false,
		cache = false,
		allow_socials = false,
		allow_lists = false,
		allow_alignment = false,
		name = page.name,
	}: markdown_options = {},
) {
	log('rendering', 'markdown', 'log', { text });

	const ALLOWED_TAGS = [
		'div',
		'p',
		'span',
		'em',
		'u',
		'strong',
		'a',
		'code',
		'pre',
		'img',
		'blockquote',
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		't',
		'del',
	];
	const ALLOWED_ATTR = [
		'href',
		'class',
		'target',
		'src',
		'alt',
		'title',
		'style',
		'data-hue',
		'data-sat',
		'data-lit',
		'data-flag',
	];

	if (allow_lists) {
		ALLOWED_TAGS.push('ul', 'ol', 'li');
	}

	if (line_breaks) {
		ALLOWED_TAGS.push('br');
	}

	if (allow_alignment) {
		ALLOWED_TAGS.push('hr');
	}

	let hue: number | undefined;
	let sat: number | undefined;
	let lit: number | undefined;

	const links: social_link[] = [];

	let status_cafe_user: string | undefined;

	const banner = () => [
		{
			type: 'lang',
			regex: /\[banner=([^\]]+)\]/g,
			replace: (_: string, url: string) => {
				delete cache.banner;
				delete cache.banner_orig;

				try {
					const safe = new URL(url);
					if (!['http:', 'https:'].includes(safe.protocol)) return '';

					cache.banner = `https://images.weserv.nl/?url=${
						encodeURIComponent(url)
					}&output=webp&n=-1`;
					if (name == auth.name) cache.banner_orig = url;
				} catch {
					cache.banner = 'accent';
				}

				return '';
			},
		},
	];

	// supports
	// ::: center
	// ::: left
	// ::: right
	const aligner = () => [
		{
			type: 'lang',
			regex: /\[(center|left|right)]\s*([\s\S]*?)\s*\[\/\1]/g,
			replace: (
				_: string,
				align: string,
				content: string,
				offset: string,
				text: string,
			) => {
				// dont replace in codeblocks
				let backticks = 0;
				for (let i = 0; i < offset; i++) {
					if (text[i] == '`') backticks++;
				}

				if (backticks % 2 == 1) return _;

				const inner = converter.makeHtml(content.trim());

				const clean = DOMPurify.sanitize(inner, {
					ALLOWED_TAGS,
					ALLOWED_ATTR,
				});
				return `<div class="text-${align}">${clean}</div>`;
			},
		},
	];

	// this should be like as safe as can be
	// you can't escape the boundaries due to the regex
	const icons = () => [
		{
			type: 'lang',
			regex: /\[icon=([a-zA-Z-]+)\]/g,
			replace: (_: string, icon: string) => {
				return `<span class="bleh-icon in-markdown" style="--icon: var(--icon-16-${icon})">A</span>`;
			},
		},
		{
			type: 'lang',
			regex: /🙏\s*BLESS\s*🙏/gi,
			replace: () => {
				return `<span class="overdose"><span class="bless"></span><span>BLESS</span><span class="bless"></span></span>`;
			},
		},
		{
			type: 'lang',
			regex: /\s*:hazelfae:\s*/gi,
			replace: () => {
				return `<a class="hazelfae" href="${root}user/evangelicgirl"></a>`;
			},
		},
	];

	// sets a profile's hsl values
	const accent = () => [
		{
			type: 'lang',
			regex:
				/\[accent=([0-9]{1,3}),([0-9]*\.?[0-9]+),([0-9]*\.?[0-9]+)\]/,
			replace: (_: string, h: string, s: string, l: string) => {
				hue = Math.min(
					settings_store.hue.max!,
					Math.max(settings_store.hue.min!, parseInt(h, 10)),
				);
				sat = Math.min(
					settings_store.sat.max!,
					Math.max(settings_store.sat.min!, parseFloat(s)),
				);
				lit = Math.min(
					settings_store.lit.max!,
					Math.max(settings_store.lit.min!, parseFloat(l)),
				);

				return '';
			},
		},
	];

	// sets a profile's font
	const font = () => [
		{
			type: 'lang',
			regex: /\[font=([^\]]+)\]/g,
			replace: (_: string, family: string) => {
				delete cache.font;
				delete cache.font_style;

				if (
					sponsor_list.version &&
					sponsor_list.users.hasOwnProperty(name)
				) {
					const split = family.split(',');

					cache.font = split[0];
					cache.font_style = split[1] || 'solid';
				}

				return '';
			},
		},
	];

	// sets a profile's display name
	const display_name = () => [
		{
			type: 'lang',
			regex: /\[name=([^\]]+)\]/g,
			replace: (_: string, username: string) => {
				delete cache.username;

				if (
					sponsor_list.version &&
					sponsor_list.users.hasOwnProperty(name)
				) {
					cache.username = username;
				}

				return '';
			},
		},
	];

	// display a status from status.cafe
	const status = () => [
		{
			type: 'lang',
			regex: /\[status=([^\]]+)\]/g,
			replace: (_: string, user: string) => {
				status_cafe_user = encodeURIComponent(user);
				return '<div class="status-cafe-host"></div>';
			},
		},
	];

	const timestamp = () => [
		{
			type: 'lang',
			regex: /<t:(\d{9,})(?::([FfDdTtR]))?>/g,
			replace: (_: string, time: string, flag: string) => {
				return `<t data-flag="${flag || 'F'}">${time}</t>`;
			},
		},
	];

	const header_minify = () => [
		{
			type: 'output',
			regex: /<(\/?)h[1-5]>/gi,
			replace: '<$1strong>',
		},
	];

	const mentions = () => [
		{
			type: 'lang',
			regex: /(?<=^|[\s([{.,])@([a-z0-9_]+?)(?!@)(?=$|[^a-z0-9_]|__)/gi,
			replace: (_: string, username: string) => {
				return `<a class="mention" href="${root}user/${username}" target="_blank">@${username}</a>`;
			},
		},
	];

	const blockquotes = () => [
		{
			type: 'lang',
			regex: /^ *>.*(?:\n *>.*)*/gm,
			replace: (m: string) => m.replace(/>/g, '&gt;'),
		},
	];

	const extensions = [];

	if (!line_breaks) allow_alignment = false;

	if (allow_alignment) extensions.push(aligner());
	if (!line_breaks) extensions.push(blockquotes());
	if (allow_banners) extensions.push(banner());
	if (allow_icons) extensions.push(icons());
	if (allow_hue) extensions.push(accent(), display_name(), status());
	if (allow_fonts) extensions.push(font());
	if (allow_socials) extensions.push(social_links_extension(links));
	if (!allow_headers) extensions.push(header_minify());
	extensions.push(mentions(), timestamp());

	let profile_cache: profile_cache_list;

	const will_cache = cache === true;
	const available = allow_banners || allow_hue;
	log(
		`prepare new cache is ${will_cache}, caching features available is ${available}`,
		'markdown',
		'log',
		{ cache },
	);

	if (available && will_cache) {
		profile_cache = JSON.parse(localStorage.getItem(keys.profile_cache)) ||
			{};
		cache = profile_cache[name] || {};
	}

	const converter = new showdown.Converter({
		extensions,
		emoji: true,
		excludeTrailingPunctuationFromURLs: true,
		headerLevelStart: allow_headers ? starting_header : 5,
		noHeaderId: true,
		openLinksInNewWindow: true,
		requireSpaceBeforeHeadingText: true,
		simpleLineBreaks: line_breaks,
		simplifiedAutoLink: allow_links,
		strikethrough: true,
		underline: true,
		ghCodeBlocks: false,
		smartIndentationFix: true,
		ellipsis: false,
	});
	const markdown = text
		.replace(
			/\[artist\]([^[\]]+)\[\/artist\]/g,
			(_match, artist: string) =>
				`[${artist}](${root}music/${redirect()}${
					encodeURIComponent(artist)
				})`,
		)
		.replace(
			/\[album artist=([^[\]]+)\]([^[\]]+)\[\/album\]/g,
			(_match, artist: string, album: string) =>
				`[${album}](${root}music/` +
				`${encodeURIComponent(artist)}/${encodeURIComponent(album)})`,
		)
		.replace(
			/\[track artist=([^[\]]+)\]([^[\]]+)\[\/track\]/g,
			(_match, artist: string, track: string) =>
				`[${track}](${root}music/` +
				`${encodeURIComponent(artist)}/_/${encodeURIComponent(track)})`,
		)
		.replace(
			/\[url=([^[\]]+)\]([^[\]]+)\[\/url\]/g,
			(_match, url: string, text: string) =>
				`[${text}](${encodeURI(url)})`,
		)
		.replace(
			/\[url\]([^[\]]+)\[\/url\]/g,
			(_match, url: string) => `[${url}](${encodeURI(url)})`,
		);

	const raw_html = converter.makeHtml(markdown);

	const parsed = DOMPurify.sanitize(raw_html, {
		ALLOWED_TAGS,
		ALLOWED_ATTR,
	});

	const body = (
		<div
			class={['parsed-markdown', 'markdown-body']}
			dangerouslySetInnerHTML={{ __html: parsed }}
		/>
	);

	log('rendered', 'markdown', 'info', { body });

	patch_wiki_contents(body);

	// funny local restriction message
	if (line_breaks) {
		local_restriction(body);
		body.querySelectorAll('p').forEach((text) => {
			local_restriction(text);
		});
	}

	// this looks like a mess, but essentially profile colours are
	// a nice 'thank you' vanity reward for sponsors <3
	if (allow_hue && is_sponsor(name)) {
		allow_hue = false;
	}

	// add lazy-loading to images
	proxy_images(body, line_breaks, in_dialog);

	status_cafe(body, status_cafe_user);

	time(body);

	social_links(body, links);

	body.querySelectorAll('.hazelfae').forEach((hazel) => {
		tippy(hazel, {
			content: ':hazelfae:',
			delay: [500, 0],
		});
	});

	if (allow_hue) {
		console.info(hue, sat, lit);

		if (hue !== undefined && sat !== undefined && lit !== undefined) {
			if (take_effect) {
				document.body.style.setProperty('--hue-album', hue);
				document.body.style.setProperty('--sat-album', sat);
				document.body.style.setProperty('--lit-album', lit);

				page.state.replaced_accent = true;

				load_chart_colours();
			}

			cache.hue = hue;
			cache.sat = sat;
			cache.lit = lit;

			log('custom accent settings present', 'profile', 'info', {
				hue,
				sat,
				lit,
			});
		} else {
			if (cache.hue) delete cache.hue;
			if (cache.sat) delete cache.sat;
			if (cache.lit) delete cache.lit;

			log('cleared custom accent settings', 'profile', 'log');
		}
	}

	if (cache && will_cache) {
		log('finalised cache from markdown parsing', 'markdown', 'info', {
			cache,
		});
		save_profile_cache(cache, profile_cache, name);
	}

	return body;
}

export function markdown_preview(
	text: string,
	{
		allow_headers = false,
		starting_header = 3,
		allow_links = true,
		line_breaks = true,
		allow_banners = false,
		allow_icons = true,
		allow_hue = false,
		allow_socials = false,
		allow_lists = true,
		allow_alignment = false,
	} = {},
) {
	if (!line_breaks) allow_alignment = false;

	dialog({
		id: 'markdown',
		title: tl(trans.preview),
		body: html.node`
            <div class="shout-container">
                <div class="shout" style="--delay: 0s">
                    <h3 class="shout-user">
                        <a href="${root}user/${auth.name}">${auth.name}</a>
                    </h3>
                    <span class="avatar shout-user-avatar">
                        <img src=${auth.avatar} alt=${
			tl(trans.your_avatar)
		} loading="lazy">
                    </span>
                    <a class="shout-user-avatar-link js-link-block-cover-link" href="${root}user/${auth.name}" tabindex="-1" />
                    <div class="shout-body">
                        <p class="markdown-body">
                            ${
			markdown(text, {
				allow_headers,
				starting_header,
				allow_links,
				line_breaks,
				allow_banners,
				allow_icons,
				allow_hue,
				allow_socials,
				allow_lists,
				allow_alignment,
				in_dialog: true,
			})
		}
                        </p>
                    </div>
                </div>
            </div>
        `,
	});
}

function local_restriction(text) {
	if (
		text.textContent
			.trim()
			.startsWith('Due to local laws, we are temporarily')
	) {
		text.classList.add('local-restriction');
	}
}

interface markdown_field_element extends HTMLElement {
	editor: HTMLTextAreaElement | HTMLInputElement;
	range: [start: number, end: number];
	value: string;
}

export function markdown_field(
	func,
	options,
	value,
	name,
	cols,
	rows,
	placeholder,
	maxlength,
	mini = false,
	autofocus = false,
	required = true,
): markdown_field_element {
	const use_md = mini ? settings.shout_markdown : settings.bio_markdown;

	options = {
		allow_headers: false,
		starting_header: 3,
		allow_links: true,
		line_breaks: true,
		allow_banners: false,
		in_dialog: false,
		allow_icons: true,
		allow_hue: false,
		allow_fonts: false,
		allow_socials: false,
		allow_lists: false,
		allow_alignment: false,
		...options,
	};

	const textarea = input({
		type: 'textarea',
		value,
		name,
		cols,
		rows,
		placeholder,
		func: () => {
			on_selection(null, null, false);
			if (func) func(textarea.value);
			render_overlay();
		},
		func_mouseup: () => {
			on_selection(null, null, false);
		},
		func_select: on_selection,
		required,
		maxlength,
		focus: autofocus,
	});
	let overlay;

	const md_editor = textarea.editor;

	md_editor.addEventListener('input', () => {
		on_selection(null, null, false);
		if (func) func(textarea.value);
		render_overlay();
	});

	let is_bold_selected;

	function on_selection(editor, val, has_selection = true) {
		overlay.scrollTop = md_editor.scrollTop;

		let sel_start;
		let sel_end;
		let selected = '';

		if (has_selection) {
			sel_start = editor.selectionStart;
			sel_end = editor.selectionEnd;

			selected = val.slice(sel_start, sel_end);
		}

		Object.values(action_lookup).forEach((item) => {
			if (item.start == null && item.end == null) return;

			if (item.end == null && item.start != null) item.end = item.start;

			let is_selected = selected.startsWith(item.start) &&
				selected.endsWith(item.end) &&
				selected.length >= item.start.length + item.end.length;
			if (item.type == 'bold') is_bold_selected = is_selected;

			if (item.type == 'italic' && is_bold_selected) is_selected = false;

			item.button.setAttribute('aria-checked', is_selected);
		});
	}

	const action_lookup = {};

	const action_list = [
		[
			{
				type: 'header',
				name: tl(trans.header),
				start: '# ',
				end: '',
				hide: !options.allow_headers,
			},
			{
				type: 'bold',
				name: tl(trans.bold),
				start: '**',
			},
			{
				type: 'italic',
				name: tl(trans.italic),
				start: '*',
			},
			{
				type: 'strike',
				name: tl(trans.strikethrough),
				start: '~~',
			},
			{
				type: 'underline',
				name: tl(trans.underline),
				start: '__',
			},
		],
		[
			{
				type: 'link',
				name: tl(trans.link),
				func: () => {
					return new Promise((resolve) => {
						let link;
						let alt;

						dialog({
							id: 'link',
							title: tl(trans.create_link),
							body: html.node`
                                <div class="new-scrobble-form">
                                    <p class="generic-label">${
								tl(trans.link)
							}</p>
                                    ${link = input({
								type: 'text',
								placeholder: tl(trans.example, {
									v: 'https://katelyn.moe',
								}),
								func: () => {
									submit_link();
								},
								focus: true,
							})}
                                    <p class="generic-label">${
								tl(trans.text)
							}</p>
                                    ${alt = input({
								type: 'text',
								func: () => {
									submit_link();
								},
							})}
                                </div>
                                <div class="modal-footer">
                                <button class="see-more cancel left-icon" onclick=${() => {
								dialog_rm({ id: 'link' });
								resolve(null);
							}}>
                                    ${tl(trans.cancel)}
                                </button>
                                <div class="fill" />
                                <button class="btn primary continue" onclick=${() => {
								submit_link();
							}}>
                                    ${tl(trans.finish)}
                                </button>
                                </div>
                            `,
						});

						function submit_link() {
							let alt_text = alt.value;
							let link_text = link.value;

							if (!link_text) return;

							dialog_rm({ id: 'link' });

							let output;

							if (alt_text != link_text && alt_text) {
								output = `[${alt_text}](${link_text})`;
							} else {
								output = link_text;
							}

							resolve(output);
						}
					});
				},
				hide: !options.allow_links,
			},
			{
				type: 'mention',
				name: tl(trans.mention_user),
				start: '@',
				end: '',
				hide: true,
			},
			{
				type: 'quote',
				name: tl(trans.quote),
				start: '> ',
				end: '',
				hide: true,
			},
			{
				type: 'code',
				name: tl(trans.code_block),
				start: '`',
				end: '`',
			},
			{
				type: 'image',
				name: tl(trans.image),
				func: () => {
					return new Promise((resolve) => {
						let link;
						let alt;

						dialog({
							id: 'link',
							title: tl(trans.attach_image),
							body: html.node`
                                <div class="new-scrobble-form">
                                    <p class="generic-label">${
								tl(trans.link)
							}</p>
                                    ${link = input({
								type: 'text',
								placeholder: tl(trans.example, {
									v: 'https://link.to/an_image_here',
								}),
								func: () => {
									submit_link();
								},
								focus: true,
							})}
                                    <p class="generic-label">${
								tl(trans.text)
							}</p>
                                    ${alt = input({
								type: 'text',
								func: () => {
									submit_link();
								},
							})}
                                </div>
                                <div class="modal-footer">
                                <button class="see-more cancel left-icon" onclick=${() => {
								dialog_rm({ id: 'link' });
								resolve(null);
							}}>
                                    ${tl(trans.cancel)}
                                </button>
                                <div class="fill" />
                                <button class="btn primary continue" onclick=${() => {
								submit_link();
							}}>
                                    ${tl(trans.finish)}
                                </button>
                                </div>
                            `,
						});

						function submit_link() {
							let alt_text = alt.value;
							let link_text = link.value;

							if (!link_text) return;

							dialog_rm({ id: 'link' });

							let output;

							if (alt_text != link_text && alt_text) {
								output = `![${alt_text}](${link_text})`;
							} else {
								output = `![](${link_text})`;
							}

							resolve(output);
						}
					});
				},
				hide: !options.allow_links,
			},
		],
		[
			{
				type: 'ul',
				name: tl(trans.list),
				start: '- ',
				end: '',
				hide: !options.allow_lists,
			},
			{
				type: 'ol',
				name: tl(trans.numbered_list),
				start: '1. ',
				end: '',
				hide: !options.allow_lists,
			},
		],
		[
			{
				type: 'align-left',
				name: tl(trans.left_align),
				start: '[left]',
				end: '[/left]',
				hide: !options.allow_alignment,
			},
			{
				type: 'align-center',
				name: tl(trans.center_align),
				start: '[center]',
				end: '[/center]',
				hide: !options.allow_alignment,
			},
			{
				type: 'align-right',
				name: tl(trans.right_align),
				start: '[right]',
				end: '[/right]',
				hide: !options.allow_alignment,
			},
		],
	];

	const actions = html.node`
        <div class="markdown-actions">
            ${
		action_list.map((group, index) => {
			const elem = html.node`
                    <div class="group">
                        ${
				group.map((item) => {
					if (item.hide) return html.node``;

					const button = html.node`
                                <button class="btn markdown-action chibi icon" data-type=${item.type} aria-checked="false" type="button" onclick=${() => {
						const sel_start = md_editor.selectionStart;
						const sel_end = md_editor.selectionEnd;

						const val = textarea.value;

						if (item.func) {
							item.func().then((replacement) => {
								if (!replacement) return;

								textarea.value = val.slice(0, sel_start) +
									replacement + val.slice(sel_end);

								textarea.focus();
								textarea.range = [
									sel_start,
									sel_start + replacement.length,
								];

								if (func) func(textarea.value);

								render_overlay();
							});

							return;
						}

						if (item.end == null && item.start != null) {
							item.end = item.start;
						}

						if (item.start != null && item.end != null) {
							const selected = val.slice(sel_start, sel_end);
							let replacement;

							if (
								selected.startsWith(item.start) &&
								selected.endsWith(item.end)
							) {
								let replace_end = -1 * item.end.length;

								if (replace_end != 0) {
									replacement = selected.slice(
										item.start.length,
										replace_end,
									);
								} else {
									replacement = selected.slice(
										item.start.length,
									);
								}
							} else {
								replacement =
									`${item.start}${selected}${item.end}`;
							}

							textarea.value = val.slice(0, sel_start) +
								replacement + val.slice(sel_end);

							textarea.focus();
							textarea.range = [
								sel_start,
								sel_start + replacement.length,
							];

							if (func) func(textarea.value);

							render_overlay();

							log('action', 'markdown', 'info', {
								sel_start,
								sel_end,
								selected,
								val,
								item,
								replacement,
							});
						}
					}}>
                                    ${item.name}
                                </button>
                            `;

					action_lookup[item.type] = {
						type: item.type,
						button,
						start: item.start,
						end: item.end,
					};
					console.info(
						'markdown added to lookup',
						action_lookup,
						action_lookup[item.type],
					);

					tippy(button, {
						content: item.name,
					});

					return button;
				})
			}
                    </div>
                `;

			if (elem.childElementCount == 0) {
				return html.node``;
			}

			return html.node`
                    ${elem}
                    ${
				index < action_list.length - 1
					? html.node`
                        <div class="group-sep" />
                    `
					: ''
			}
                `;
		})
	}
        </div>
    `;

	const field = html.node`
        <div class="markdown-field ${mini ? 'mini' : ''}">
            ${use_md ? actions : ''}
            <div class="markdown-field-text">
                <div class="markdown-field-overlay" ref=${(el) =>
		overlay = el} />
                ${textarea}
            </div>
        </div>
    `;

	render_overlay();

	md_editor.addEventListener('scroll', () => {
		overlay.scrollTop = md_editor.scrollTop;
	});

	Object.defineProperty(field, 'value', {
		get() {
			return textarea.value;
		},
		set(val: string) {
			textarea.value = val;
			if (func) func(val);

			render_overlay(val);
		},
	});

	function render_overlay(val = textarea.value) {
		val = val.replace(/</g, '&lt;').replace(/>/g, '&gt;');

		if (use_md) {
			val = val.replace(
				/\[(left|center|right|links)\]/gi,
				(text: string) => {
					if (!options.allow_alignment) return text;

					return `<span class="md-tag-wrap">${text}</span>`;
				},
			);
			val = val.replace(
				/\[\/(left|center|right|links)\]/gi,
				(text: string) => {
					if (!options.allow_alignment) return text;

					return `<span class="md-tag-wrap">${text}</span>`;
				},
			);

			val = val.replace(
				/\[([a-z]+)=([^\]]+)\]/gi,
				(match: string, tag: string, val: string) => {
					if (
						!['status', 'name', 'font', 'accent', 'banner']
							.includes(
								tag,
							)
					) return match;

					if (!options.allow_hue && tag == 'accent') return match;

					if (!options.allow_alignment) return match;

					if (tag == 'accent') {
						const split = val.split(',');
						if (
							split.length == 3 && parseFloat(split[0]) >= 0 &&
							parseFloat(split[1]) >= 0 &&
							parseFloat(split[2]) >= 0
						) {
							return `<span class="md-tag">[${tag}=<span class="md-val md-accent colourful" style="--hue-over: ${
								parseFloat(split[0])
							}; --sat-over: ${
								parseFloat(split[1])
							}; --lit-over: ${
								parseFloat(split[2])
							}">${val}</span>]</span>`;
						} else {
							return match;
						}
					}

					return `<span class="md-tag">[${tag}=<span class="md-val">${val}</span>]</span>`;
				},
			);

			val = val.replace(
				/!\[([^\]]*)\]\(([^)]+)\)/gi,
				(match: string, label: string, url: string) => {
					if (!options.allow_links) return match;

					return `<span class="md-link">![<span class="md-label">${label}</span>](<span class="md-url">${url}</span>)</span>`;
				},
			);

			val = val.replace(
				/\[([^\]]+)\]\(([^)]+)\)/gi,
				(match: string, label: string, url: string) => {
					if (!options.allow_links) return match;

					return `<span class="md-link">[<span class="md-label">${label}</span>](<span class="md-url">${url}</span>)</span>`;
				},
			);
		}

		render(
			overlay,
			html`
				${{ html: val }}
			`,
		);
	}

	setTimeout(() => {
		queue_popup('markdown', actions, 'top');
	}, 0);

	return field;
}
