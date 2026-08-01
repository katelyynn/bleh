//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

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
import { markdown_options } from '@/types/markdown';
import { profile_cache_list } from '@/types/profile';
import { keys } from '../settings/storage';

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

	let ALLOWED_TAGS = [
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
	let ALLOWED_ATTR = [
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

	let links = [];

	let status_cafe_user: string | undefined;

	const banner = () => [
		{
			type: 'lang',
			regex: /\[banner=([^\]]+)\]/g,
			replace: (_, url) => {
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
			replace: (_, align, content, offset, text) => {
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
			replace: (_, icon) => {
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
			replace: (_, h, s, l) => {
				hue = Math.min(
					settings_store.hue.max,
					Math.max(settings_store.hue.min, parseInt(h, 10)),
				);
				sat = Math.min(
					settings_store.sat.max,
					Math.max(settings_store.sat.min, parseFloat(s)),
				);
				lit = Math.min(
					settings_store.lit.max,
					Math.max(settings_store.lit.min, parseFloat(l)),
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
			replace: (_, family) => {
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
			replace: (_, username) => {
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
			replace: (_, user) => {
				status_cafe_user = encodeURIComponent(user);
				return '<div class="status-cafe-host"></div>';
			},
		},
	];

	const timestamp = () => [
		{
			type: 'lang',
			regex: /<t:(\d{9,})(?::([FfDdTtR]))?>/g,
			replace: (_, time, flag) => {
				return `<t data-flag="${flag || 'F'}">${time}</t>`;
			},
		},
	];

	// retrieves social links if a user supplies them
	const social_links = () => [
		{
			type: 'lang',
			regex: /\[links\]([\s\S]*?)\[\/links\]/g,
			replace: (_, content) => {
				const lines = content.trim().split(/\n+/);

				lines.forEach((line) => {
					line = line.trim();
					if (!line) return;
					console.info('line', line, line.trim());

					const markdown_regex = line.match(/^\[(.+?)\]\((.+?)\)$/);

					let url;
					let name;

					if (markdown_regex) {
						url = markdown_regex[2].trim();
						name = markdown_regex[1].trim();
					} else {
						url = line;
					}

					try {
						const link = new URL(url, `https://www.last.fm${root}`);
						const host = link.hostname;
						const protocol = link.protocol;
						const path = link.pathname;

						console.info('proto', protocol, link);

						if (protocol != 'http:' && protocol != 'https:') return;

						let final = {
							host,
							path,
							url: link.href,
						};

						if (name) {
							final.name = DOMPurify.sanitize(name, {
								ALLOWED_TAGS: [],
							});
						}

						links.push(final);
					} catch (e) {
						return;
					}
				});

				return '';
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
			replace: (_, username) => {
				return `<a class="mention" href="${root}user/${username}" target="_blank">@${username}</a>`;
			},
		},
	];

	const blockquotes = () => [
		{
			type: 'lang',
			regex: /^ *>.*(?:\n *>.*)*/gm,
			replace: (m) => m.replace(/>/g, '&gt;'),
		},
	];

	let extensions = [];

	if (!line_breaks) allow_alignment = false;

	if (allow_alignment) extensions.push(aligner());
	if (!line_breaks) extensions.push(blockquotes());
	if (allow_banners) extensions.push(banner());
	if (allow_icons) extensions.push(icons());
	if (allow_hue) extensions.push(accent(), display_name(), status());
	if (allow_fonts) extensions.push(font());
	if (allow_socials) extensions.push(social_links());
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
			(match, artist: string) =>
				`[${artist}](${root}music/${redirect()}${
					encodeURIComponent(artist)
				})`,
		)
		.replace(
			/\[album artist=([^[\]]+)\]([^[\]]+)\[\/album\]/g,
			(match, artist: string, album: string) =>
				`[${album}](${root}music/` +
				`${encodeURIComponent(artist)}/${encodeURIComponent(album)})`,
		)
		.replace(
			/\[track artist=([^[\]]+)\]([^[\]]+)\[\/track\]/g,
			(match, artist: string, track: string) =>
				`[${track}](${root}music/` +
				`${encodeURIComponent(artist)}/_/${encodeURIComponent(track)})`,
		)
		.replace(
			/\[url=([^[\]]+)\]([^[\]]+)\[\/url\]/g,
			(match, url: string, text: string) =>
				`[${text}](${encodeURI(url)})`,
		)
		.replace(
			/\[url\]([^[\]]+)\[\/url\]/g,
			(match, url: string) => `[${url}](${encodeURI(url)})`,
		);

	const raw_html = converter.makeHtml(markdown);

	const parsed = DOMPurify.sanitize(raw_html, {
		ALLOWED_TAGS,
		ALLOWED_ATTR,
	});

	const body = html.node`
        <div class="parsed-markdown markdown-body">
            ${{ html: parsed }}
        </div>
    `;

	log('rendered', 'markdown', 'info', { body });

	const link_strings = {
		'open.spotify.com': 'Spotify',
		'spotify.com': 'Spotify',
		'youtube.com': 'YouTube',
		'x.com': 'Twitter (latterly X)',
		'twitter.com': 'Twitter',
		'github.com': 'GitHub',
		'discord.com': 'Discord',
		'discord.gg': 'Discord',
		'bandcamp.com': 'Bandcamp',
		'soundcloud.com': 'Soundcloud',
		'tiktok.com': 'TikTok',
		'www.tiktok.com': 'TikTok',
		'ko-fi.com': 'Ko-fi',
		'patreon.com': 'Patreon',
		'www.patreon.com': 'Patreon',
		'twitch.tv': 'Twitch',
		'www.twitch.tv': 'Twitch',
		'linktr.ee': 'Linktree',
		'carrd.co': 'Carrd',
		'music.apple.com': 'Apple Music',
		'music.youtube.com': 'YouTube Music',
		'facebook.com': 'Facebook',
		'www.discogs.com': 'Discogs',
		'discogs.com': 'Discogs',
		'tidal.com': 'Tidal',
		'record.club': 'Record Club',
		'rateyourmusic.com': 'RYM',
		'albumoftheyear.org': 'AOTY',
		'mastodon.social': 'Mastodon',
		'bsky.app': 'Bluesky',
		'reddit.com': 'Reddit',
	};

	const icons_not_supported = [
		'record.club',
		'reddit.com',
	];

	if (links.length > 0) {
		body.appendChild(html.node`
            <div class="social-links-container">
                <div class="sub-text music-small-header">
                    ${tl(trans.links)}
                </div>
                <div class="music-links social-links">
                    ${
			links.map((link) => {
				let label = link.host;

				if (link.name) {
					label = link.name;
				} else if (link_strings.hasOwnProperty(link.host)) {
					label = link_strings[link.host];
				}

				return html.node`
                            <a class="btn music-link social-link colourful icon" href=${link.url} target="_blank" data-host=${link.host} data-host-unknown=${
					!link_strings.hasOwnProperty(link.host) ||
					icons_not_supported.includes(link.host)
				} data-path=${link.path} style="--favi: url(https://icons.duckduckgo.com/ip3/${link.host}.ico)">
                                ${label}
                            </a>
                        `;
			})
		}
                </div>
            </div>
        `);
	}

	if (body.nodeName != '#text') patch_wiki_contents(body);

	// funny local restriction message
	if (line_breaks) {
		local_restriction(body);
		body.querySelectorAll('p').forEach((text) => {
			local_restriction(text);
		});
	}

	// this looks like a mess, but essentially profile colours are
	// a nice 'thank you' vanity reward for sponsors <3
	if (allow_hue) {
		if (!sponsor_list.users.hasOwnProperty(name)) {
			allow_hue = false;
		}
	}

	if (body.nodeName != '#text') {
		// add lazy-loading to images
		body.querySelectorAll('img').forEach((image) => {
			if (!line_breaks) {
				image.remove();
				return;
			}

			// for counter-like sites
			// did they really have to call their counter site loli
			const proxy_free = [
				'count.getloli.com',
				'i.imgur.com',
				'media1.tenor.com',
				'katelyynn.github.io',
				'i.pinimg.com',
				'i.ibb.co',
				'static.klipy.com',
				'static2.klipy.com',
			];

			try {
				const url = new URL(image.src);

				if (!proxy_free.includes(url.hostname)) {
					image.setAttribute(
						'data-unsafe-href',
						encodeURI(image.src),
					);
					image.src = `https://images.weserv.nl/?url=${
						encodeURIComponent(image.src)
					}&output=webp&n=-1`;
				}
			} catch (e) {
				image.setAttribute('data-unsafe-href', encodeURI(image.src));
				image.src = `https://images.weserv.nl/?url=${
					encodeURIComponent(image.src)
				}&output=webp&n=-1`;
			}

			image.setAttribute('loading', 'lazy');

			let func = () => expand_avatar(image.src, image.alt);
			if (in_dialog) func = () => open(image.src);

			const container = html.node`
                <div class="markdown-image" onclick=${func} />
            `;

			image.after(container);
			container.appendChild(image);
		});

		if (status_cafe_user) {
			const status_cafe_host = body.querySelector('.status-cafe-host');

			render(
				status_cafe_host,
				html`
					<div class="status-cafe">
						<div class="status-cafe-content is-loading">
							<span class="status-cafe-emoji">
								<span class="status-cafe-loading-spinner">
									<span class="bleh-icon" />
								</span>
							</span>
							<span class="status-cafe-text">${tl(
								trans.loading_status,
								{ u: status_cafe_user },
							)}</span>
						</div>
						<div class="status-cafe-top">
							<span class="status-cafe-time">...</span>
						</div>
					</div>
				`,
			);

			fetch_status(status_cafe_user).then((status_cafe) => {
				render(status_cafe_host, status_cafe);
			});
		}

		body.querySelectorAll('t').forEach((timestamp) => {
			const time = timestamp.textContent;
			const flag = timestamp.getAttribute('data-flag');

			const date = DateTime.fromSeconds(parseInt(time));

			let text = '';

			if (flag == 'F') {
				text = tl(trans.date_at_time, {
					d: date.toLocaleString(DateTime.DATE_HUGE),
					t: date.toLocaleString(DateTime.TIME_SIMPLE),
				});
			} else if (flag == 'f') {
				text = tl(trans.date_at_time, {
					d: date.toLocaleString(DateTime.DATE_FULL),
					t: date.toLocaleString(DateTime.TIME_SIMPLE),
				});
			} else if (flag == 'D') {
				text = date.toLocaleString(DateTime.DATE_FULL);
			} else if (flag == 'd') {
				text = date.toLocaleString(DateTime.DATE_SHORT);
			} else if (flag == 't') {
				text = date.toLocaleString(DateTime.TIME_SIMPLE);
			} else if (flag == 'T') {
				text = date.toLocaleString(DateTime.TIME_WITH_SECONDS);
			} else if (flag == 'R') {
				text = date.toRelative();
			}

			const new_timestamp = html.node`
                <t>${text}</t>
            `;

			tippy(new_timestamp, {
				theme: 'generic',
				content: html.node`
                    <span>${date.toLocaleString(DateTime.DATE_FULL)}</span>
                    <small>${date.toLocaleString(DateTime.TIME_SIMPLE)}</small>
                `,
			});

			timestamp.replaceWith(new_timestamp);
		});

		body.querySelectorAll('.hazelfae').forEach((hazel) => {
			tippy(hazel, {
				content: ':hazelfae:',
				delay: [500, 0],
			});
		});
	}

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

export function markdown_prompt({
	allow_headers = false,
	starting_header = 3,
	allow_links = true,
	line_breaks = true,
	allow_banners = false,
	allow_icons = false,
	allow_hue = false,
	allow_socials = false,
	allow_lists = true,
	allow_alignment = false,
} = {}) {
	if (!line_breaks) allow_alignment = false;

	const examples = [
		{
			name: tl(trans.supports_markdown.header.name),
			string: tl(trans.supports_markdown.header.string),
			hide_if: !allow_headers,
		},
		{
			name: tl(trans.supports_markdown.bold.name),
			string: tl(trans.supports_markdown.bold.string),
		},
		{
			name: tl(trans.supports_markdown.italics.name),
			string: tl(trans.supports_markdown.italics.string),
		},
		{
			name: tl(trans.supports_markdown.bold_italics.name),
			string: tl(trans.supports_markdown.bold_italics.string),
		},
		{
			name: tl(trans.supports_markdown.underlined.name),
			string: tl(trans.supports_markdown.underlined.string),
		},
		{
			name: 'Fancy link',
			string: '[example >~<](https://katelyn.moe)',
			hide_if: !allow_links,
		},
		{
			name: 'Simple link',
			string: `https://last.fm${root}user/${auth.name}`,
			hide_if: !allow_links,
		},
		{
			name: 'Mentioned user',
			string: `@${auth.name}`,
		},
		{
			name: 'Image',
			string: `![alt text](${auth.avatar})`,
			string_display: '![alt text](image url here)',
			hide_if: !line_breaks,
		},
		{
			name: 'Left-alignment',
			string: '[left]text[/left]',
			hide_if: !allow_alignment,
		},
		{
			name: 'Center-alignment',
			string: '[center]text[/center]',
			hide_if: !allow_alignment,
		},
		{
			name: 'Right-alignment',
			string: '[right]text[/right]',
			hide_if: !allow_alignment,
		},
		{
			name: 'Divider line',
			string: '---',
			hide_if: !allow_alignment,
		},
	];

	dialog({
		id: 'markdown',
		title: tl(trans.supports_markdown),
		body: html.node`
            <p>You can write fancy text here using Markdown, which lets you make your words pretty with simple shortcuts.</p>
            <table class="fancy-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>How</th>
                        <th>Result</th>
                    </tr>
                </thead>
                <tbody>
                    ${
			examples.map((example) => {
				if (example.hide_if) return html.node``;

				return html.node`
                            <tr>
                                <td>${example.name}</td>
                                <td class="subtle">${
					example.string_display
						? example.string_display
						: example.string
				}</td>
                                ${
					example.explain
						? html.node`
                                    <td>
                                        <div class="icon-combo">
                                            <div class="bleh-icon" data-type="info" style="--icon: var(--mask)" />
                                            ${example.explain}
                                        </div>
                                    </td>
                                `
						: html.node`
                                    <td class="markdown-body">${
							markdown(
								example.string,
								{
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
								},
							)
						}</td>
                                `
				}
                            </tr>
                        `;
			})
		}
                </tbody>
            </table>
        `,
	});
}

export function markdown_preview(
	text,
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

export function external_url_prompt(url, dangerous = false) {
	log(
		`prompted warning for url ${url}, dangerous is ${dangerous}`,
		'markdown',
	);

	const link = new URL(url);
	const scheme = link.protocol;
	const hostname = link.hostname;
	const path = link.pathname + link.search + link.hash;

	let trust_site;

	dialog({
		id: 'external_url',
		type: 'leaving_site',
		body: html.node`
            <div class="modal-vertical-inner leaving-site-inner">
                ${
			!dangerous
				? html.node`
                <h1>${tl(trans.leaving_site.name)}</h1>
                <p>${tl(trans.leaving_site.body)}</p>
                `
				: html.node`
                <h1>${tl(trans.leaving_site_dangerous.name)}</h1>
                <p>${tl(trans.leaving_site_dangerous.body)}</p>
                `
		}
                <div class="external-warn-input" data-dangerous=${dangerous}>
                    <span class="scheme">
                        ${scheme}//
                    </span>
                    ${
			hostname
				? html.node`
                    <span class="hostname">
                        ${hostname}
                    </span>
                    `
				: html.node`
                    <span class="hostname">
                        ${path}
                    </span>
                    `
		}
                    ${
			path != '/' && hostname
				? html.node`
                    <span class="path">
                        ${path}
                    </span>
                    `
				: ''
		}
                </div>
                ${
			hostname != ''
				? html.node`
                ${(trust_site = toggle({
					type: 'checkbox',
					title: tl(trans.leaving_site_checkbox).replace(
						'{v}',
						hostname,
					),
				}))}
                `
				: ''
		}
            </div>
            <div class="modal-footer">
                <button class="see-more cancel left-icon" onclick=${() =>
			dialog_rm({ id: 'external_url' })}>
                    ${tl(trans.back)}
                </button>
                <div class="fill"></div>
                <button class="btn primary continue" onclick=${() => {
			if (trust_site?.checked()) {
				save_setting('trusted_sites', [
					...settings.trusted_sites,
					hostname,
				]);
				log(`added ${hostname} to trusted sites`, 'markdown');
			}

			open(url, '_blank');
			dialog_rm({ id: 'external_url' });
		}}>
                    ${!dangerous ? tl(trans.visit) : tl(trans.open)}
                </button>
            </div>
        `,
	});
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
			val = val.replace(/\[(left|center|right|links)\]/gi, (text) => {
				if (!options.allow_alignment) return text;

				return `<span class="md-tag-wrap">${text}</span>`;
			});
			val = val.replace(/\[\/(left|center|right|links)\]/gi, (text) => {
				if (!options.allow_alignment) return text;

				return `<span class="md-tag-wrap">${text}</span>`;
			});

			val = val.replace(/\[([a-z]+)=([^\]]+)\]/gi, (match, tag, val) => {
				if (
					!['status', 'name', 'font', 'accent', 'banner'].includes(
						tag,
					)
				) return match;

				if (!options.allow_hue && tag == 'accent') return match;

				if (!options.allow_alignment) return match;

				if (tag == 'accent') {
					const split = val.split(',');
					if (
						split.length == 3 && parseFloat(split[0]) >= 0 &&
						parseFloat(split[1]) >= 0 && parseFloat(split[2]) >= 0
					) {
						return `<span class="md-tag">[${tag}=<span class="md-val md-accent colourful" style="--hue-over: ${
							parseFloat(split[0])
						}; --sat-over: ${parseFloat(split[1])}; --lit-over: ${
							parseFloat(split[2])
						}">${val}</span>]</span>`;
					} else {
						return match;
					}
				}

				return `<span class="md-tag">[${tag}=<span class="md-val">${val}</span>]</span>`;
			});

			val = val.replace(
				/!\[([^\]]*)\]\(([^)]+)\)/gi,
				(match, label, url) => {
					if (!options.allow_links) return match;

					return `<span class="md-link">![<span class="md-label">${label}</span>](<span class="md-url">${url}</span>)</span>`;
				},
			);

			val = val.replace(
				/\[([^\]]+)\]\(([^)]+)\)/gi,
				(match, label, url) => {
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
