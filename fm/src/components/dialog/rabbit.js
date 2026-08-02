//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { auth, page, root } from '@/build/page';
import { dialog, dialog_rm } from '@/components/dialog/dialog';
import { html, render } from 'lighterhtml';
import { input } from '@/components/settings/input';
import { tl, trans } from '@/build/trans';
import { save_setting } from '@/components/settings/settings';
import { sanitise } from '@/build/tools';
import { compare } from '@/components/minis/compare';
import { collage } from '@/components/minis/collage';
import { settings } from '@/build/config';
import { news } from '@/components/news';
import { ff } from '@/components/settings/sku';
import { redirect } from '@/components/music/music';
import { open_starred_friend_window } from '@/pages/profile/profile';
import { match } from '@/components/settings/dynamic_theming';

export function register_rabbit() {
	let input_box;
	let selected = 0;
	let feed = 0;
	let matches = [];
	let rabbit_hole;

	let tip;

	let depth = 0;

	let searching;
	let selected_search;

	let fake;

	// whether going back is allowed
	let back;

	const allowed_pages = ['user', 'artist', 'album', 'track', 'tag'];

	document.addEventListener('keydown', (e) => {
		/*notify({
            id: 'key',
            title: e.key
        });*/

		const cmd = e.getModifierState('Control') || e.getModifierState('Meta');
		const key = e.key.toLowerCase();

		if (
			cmd &&
			[settings.rabbit_primary.toLowerCase(), ','].includes(key) &&
			!page.structure.dialogs.hasChildNodes()
		) {
			e.preventDefault();

			depth = 0;

			if (e.getModifierState('Shift')) {
				// ctrl + shift + k
				rabbit();
				use_page_as_ctx();
				back = false;
			} else {
				// ctrl + k
				rabbit();
			}
		} else if (
			page.structure.dialogs.hasChildNodes() &&
			page.structure.dialogs.querySelector(
				':scope > [data-modal-type="rabbit"]',
			)
		) {
			if (e.key == 'Escape') {
				if (
					(depth == 0 &&
						input_box.querySelector('input').value == '') ||
					!back
				) {
					dialog_rm({ id: 'rabbit' });
				} else {
					input_box.querySelector('input').value = '';
					depth = 0;
					rabbit_search();
				}
			}

			if (e.key == 'Tab') {
				e.preventDefault();
				rabbit_tab();
			}

			if (e.key == 'ArrowDown') {
				e.preventDefault();
				if (selected < matches.length - 1) selected++;
				else selected = 0;

				if (matches[selected].disabled) {
					if (selected + 1 < matches.length - 1) selected++;
					else selected = 0;
				}

				rabbit_select();
			} else if (e.key == 'ArrowUp') {
				e.preventDefault();
				if (selected > 0) selected--;
				else selected = matches.length - 1;

				if (matches[selected].disabled) {
					if (selected - 1 > 0) selected--;
					else selected = 0;
				}

				rabbit_select();
			} else if (e.key == 'Enter') {
				rabbit_enter();
			}
		}

		if (!page.structure.dialogs.hasChildNodes()) {
			if (cmd && [settings.rabbit_profile.toLowerCase()].includes(key)) {
				e.preventDefault();

				window.location.href = `${root}user/${auth.name}`;
			}

			if (cmd && [settings.rabbit_shortcut.toLowerCase()].includes(key)) {
				e.preventDefault();

				if (settings.starred_friend != '') {
					window.location.href =
						`${root}user/${settings.starred_friend}`;
				} else {
					open_starred_friend_window();
				}
			}

			if (
				cmd &&
				[settings.rabbit_bleh_settings.toLowerCase()].includes(key)
			) {
				e.preventDefault();

				window.location.href = `${root}bleh`;
			}

			if (cmd && [settings.rabbit_search.toLowerCase()].includes(key)) {
				e.preventDefault();

				rabbit();
				search();
				back = false;
			}
		}
	});

	function rabbit() {
		page.state.rabbit_modal = dialog({
			id: 'rabbit',
			title: 'rabbit',
			body: html.node`
                ${() => {
				input_box = input({
					maxlength: 100,
					placeholder: tl(trans.switch_placeholder),
					focus: true,
				});

				input_box.classList.add('rabbit-search');

				return input_box;
			}}
                <div class="rabbit-hole" ref=${(el) => (rabbit_hole = el)} />
                <div class="tip" ref=${(el) => (tip = el)} />
            `,
			type: 'rabbit',
			replace_if_possible: true,
			handle_escape_manually: true,
		});

		back = true;

		fake = html.node`
            <div class="fake-input" style="display: none;" />
        `;
		input_box.appendChild(fake);

		rabbit_search();
		rabbit_select();

		input_box.querySelector('input').addEventListener('input', (e) => {
			rabbit_search();
		});

		input_box.querySelector('input').focus();
	}

	page.state.rabbit = rabbit;

	function rabbit_tab() {
		input_box.querySelector('input').focus();
	}

	function rabbit_search(pre_selected = '', pre_matches = null) {
		if (depth < 2) {
			input_box.querySelector('input').style.removeProperty('display');
			fake.style.display = 'none';

			input_box.querySelector('input').placeholder = tl(
				trans.switch_placeholder,
			);

			input_box.setAttribute('data-showing-fake', false);
		}

		selected = 0;
		if (!pre_matches && depth == 0) {
			feed = [
				{
					type: 'search',
					text: tl(trans.search),
					body: tl(trans.search_for_music_or_user),
					keywords: ['user', 'music', 'tag', 'discover', 'explore'],
					action: () => search(),
					keybind: ['⌘', settings.rabbit_search.toUpperCase()],
				},
				{
					type: 'on_this_page',
					text: tl(trans.on_this_page),
					body: tl(trans.use_current_page_as_context),
					keywords: ['ctx', 'context'],
					action: () => use_page_as_ctx(),
					keybind: ['⌘', '⇧', settings.rabbit_primary.toUpperCase()],
					disabled: !allowed_pages.includes(page.type),
				},
				{
					type: 'profile',
					text: auth.name,
					body: tl(trans.opens_your_value).replace(
						'{v}',
						tl(trans.profile),
					),
					keywords: ['profile', 'user', 'me'],
					action:
						() => (window.location.href =
							`${root}user/${auth.name}`),
					keybind: ['⌘', settings.rabbit_profile.toUpperCase()],
				},
				{
					type: 'starred_friend',
					text: settings.starred_friend,
					body: tl(trans.opens_your_value).replace(
						'{v}',
						tl(trans.starred_friend.name),
					),
					keywords: [
						'profile',
						'user',
						'shortcut',
						'friends',
						'starred',
					],
					action:
						() => (window.location.href =
							`${root}user/${settings.starred_friend}`),
					hide: settings.starred_friend == '',
					keybind: ['⌘', settings.rabbit_shortcut.toUpperCase()],
				},
				{
					type: 'notifications',
					text: tl(trans.notifications),
					body: tl(trans.opens_your_value).replace(
						'{v}',
						tl(trans.notifications),
					),
					keywords: ['bell', 'updates'],
					action:
						() => (window.location.href =
							`${root}inbox/notifications`),
				},
				{
					type: 'messages',
					text: tl(trans.messages),
					body: tl(trans.opens_your_value).replace(
						'{v}',
						tl(trans.messages),
					),
					keywords: ['messages', 'direct', 'dms'],
					action: () => (window.location.href = `${root}inbox`),
				},
				{
					type: 'theme',
					text: tl(trans.themes.name),
					body: tl(trans.opens_the_value).replace(
						'{v}',
						tl(trans.theme_picker),
					),
					keywords: [
						'themes',
						'light',
						'dark',
						'ash',
						'darker',
						'oled',
						'amoled',
						'midnight',
						'void',
						'abyss',
						'dark reader',
						'adaptive',
						'auto',
						'system',
						'change theme',
					],
					action: () => bleh_theme_picker(),
				},
				{
					type: 'minis',
					text: tl(trans.minis),
					body: tl(trans.opens_your_value).replace(
						'{v}',
						tl(trans.minis),
					),
					keywords: [
						'bleh',
						'minis',
						'tools',
						'labs',
						'games',
						'collage',
						'compare',
					],
					action: () => (window.location.href = `${root}bleh/minis`),
				},
				{
					type: 'news',
					text: tl(trans.news),
					body: tl(trans.opens_the_value).replace(
						'{v}',
						tl(trans.news),
					),
					keywords: ['bleh', 'extension', 'changelog', 'feed'],
					action: () => news(),
				},
				{
					type: 'settings',
					text: tl(trans.settings),
					body: tl(trans.opens_your_value_settings).replace(
						'{v}',
						tl(trans.profile),
					),
					keywords: [
						'profile',
						'user',
						'pfp',
						'avi',
						'avatar',
						'config',
						'configuration',
						'configure',
						'picture',
						'photo',
					],
					action: () => (window.location.href = `${root}settings`),
				},
				{
					type: 'bleh_settings',
					text: tl(trans.settings),
					body: tl(trans.opens_the_value).replace(
						'{v}',
						tl(trans.bleh_settings),
					),
					keywords: [
						'bleh',
						'extension',
						'config',
						'configuration',
						'configure',
					],
					action: () => (window.location.href = `${root}bleh`),
					keybind: ['⌘', settings.rabbit_bleh_settings.toUpperCase()],
				},
			];
		} else if (pre_matches) {
			feed = pre_matches;
		}

		if (depth < 3) {
			let value = '';
			if (value == '') {
				value = input_box
					.querySelector('input')
					.value.trim()
					.toLowerCase();
			}

			matches = [];

			feed.forEach((item) => {
				const extended = `${item.text} ${item.body} ${
					item.keywords.join(' ')
				} ${
					item.keybind
						? item.keybind.join(' ').replace('⌘', 'Ctrl').replace(
							'⇧',
							'Shift',
						)
						: ''
				}`.toLowerCase();

				const words = value.split(' ');
				let match = false;
				words.forEach((word) => {
					if (extended.includes(word)) {
						match = true;
					}
				});

				if (item.hide) match = false;

				if (match) matches.push(item);
			});

			render(
				rabbit_hole,
				html`
					${matches.length > 0
						? matches.map((item, index) => () => {
							const button = html.node`
                        <button class="dropdown-menu-clickable-item rabbit-hole-item" data-type=${item.type} onclick=${item.action} disabled=${item.disabled}>
                            <div class="info">
                                <div class="text">${item.text}</div>
                            </div>
                            ${item.keybind ? keybind(item.keybind) : ''}
                        </button>
                    `;

							if (!item.disabled) {
								button.addEventListener('mouseover', () => {
									selected = index;
									rabbit_select(false, true);
								});
							}

							return button;
						})
						: html.node`
                    <div class="placeholder-block">
                        <div class="placeholder-head">₍ᐢ. .ᐢ₎</div>
                        <div class="placeholder-summary">${
							tl(trans.nothing_matches_your_search)
						}</div>
                    </div>
                `}
				`,
			);

			rabbit_select();
		} else {
			matches = feed;
		}
	}

	function rabbit_select(click = false, with_mouse = false) {
		rabbit_tip(tl(trans.select_an_option));

		if (depth == 3 && click) {
			searching[selected_search].name =
				input_box.querySelector('input').value;
			input_box.querySelector('input').value = '';
			depth = 2;

			search_fill();

			return;
		} else if (depth == 3) {
			return;
		}

		const buttons = rabbit_hole.querySelectorAll('button');
		buttons.forEach((button, index) => {
			if (index == selected) {
				button.setAttribute('aria-selected', 'true');
				if (!with_mouse) {
					button.scrollIntoView({
						behavior: 'smooth',
						block: 'center',
					});
				}

				if (click) {
					//input_box.querySelector('input').value = matches[index].text;
					input_box.querySelector('input').value = '';
					button.click();
				}

				rabbit_tip(matches[index].body);
			} else {
				button.setAttribute('aria-selected', 'false');
			}
		});

		input_box.querySelector('input').focus();
	}

	function rabbit_tip(text) {
		render(
			tip,
			html`
				<div class="left">
				    ${depth == 0
					? html.node`
            <kbd>Esc</kbd> ${tl(trans.close)}
            `
					: html.node`
            <kbd>Esc</kbd> ${tl(trans.back)}
            `}
				</div>
				<div class="right">${text}</div>
			`,
		);
	}

	function rabbit_enter() {
		rabbit_select(true);
	}

	function append_search(id) {
		if (id == 'artist' || id == 'user' || id == 'tag') {
			selected_search = 'primary';
		} else selected_search = 'secondary';

		let label = id;
		if (label == 'user') label = 'profile';

		input_box.querySelector('input').placeholder = tl(trans.rabbit_search, {
			v: tl(trans[label]),
		});

		depth = 3;
		searching[selected_search].type = id;
		input_box.querySelector('input').value = '';

		input_box.querySelector('input').style.removeProperty('display');
		fake.style.display = 'none';

		input_box.setAttribute('data-showing-fake', false);
	}

	function bleh_theme_picker() {
		// custom control
		depth = 1;
		rabbit_search('internal:theme_picker', [
			{
				type: 'theme_adaptive',
				text: tl(trans.auto),
				body: tl(trans.changes_your_theme),
				keywords: ['system'],
				action: () => {
					save_setting('theme_schedule', true);
					match();
				},
				hide: !ff('adaptive_theme'),
			},
			{
				type: 'theme_light',
				text: tl(trans.themes.light),
				body: tl(trans.changes_your_theme),
				keywords: ['sun', 'day'],
				action: () => {
					save_setting('theme_schedule', false);
					save_setting('theme', 'light');
				},
			},
			{
				type: 'theme_ink',
				text: tl(trans.themes.ink),
				body: tl(trans.changes_your_theme),
				keywords: ['sun', 'day', 'light', 'e-ink'],
				action: () => {
					save_setting('theme_schedule', false);
					save_setting('theme', 'ink');
				},
			},
			{
				type: 'theme_dark',
				text: tl(trans.themes.dark),
				body: tl(trans.changes_your_theme),
				keywords: ['dark', 'night', 'grey', 'gray'],
				action: () => {
					save_setting('theme_schedule', false);
					save_setting('theme', 'dark');
				},
			},
			{
				type: 'theme_darker',
				text: tl(trans.themes.darker),
				body: tl(trans.changes_your_theme),
				keywords: ['dark', 'night', 'grey', 'gray'],
				action: () => {
					save_setting('theme_schedule', false);
					save_setting('theme', 'darker');
				},
			},
			{
				type: 'theme_oled',
				text: tl(trans.themes.oled),
				body: tl(trans.changes_your_theme),
				keywords: ['dark', 'night', 'black'],
				action: () => {
					save_setting('theme_schedule', false);
					save_setting('theme', 'oled');
				},
			},
		]);
	}

	function use_page_as_ctx() {
		if (!allowed_pages.includes(page.type)) return;

		depth = 1;

		let url_start = root;

		if (page.type == 'user') url_start += 'user/';
		else if (
			page.type == 'album' ||
			page.type == 'artist' ||
			page.type == 'track'
		) {
			url_start += 'music/';
		}

		if (page.type == 'album') {
			url_start += `${sanitise(page.sister)}/${sanitise(page.name)}`;
		} else if (page.type == 'track') {
			url_start += `${sanitise(page.sister)}/_/${sanitise(page.name)}`;
		} else url_start += sanitise(page.name);

		// custom control
		if (page.type == 'user') {
			rabbit_search('internal:ctx', [
				{
					type: 'overview',
					text: tl(trans.home),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.home))
						.replace('{t}', page.name),
					keywords: ['home'],
					action: () => (window.location.href = url_start),
				},
				{
					type: 'reports',
					text: tl(trans.reports),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.reports))
						.replace('{t}', page.name),
					keywords: [
						'listening report',
						'reports',
						'wrapped',
						'playback',
						'spotify',
					],
					action: () => (window.location.href = url_start +
						'/listening-report'),
				},
				{
					type: 'library',
					text: tl(trans.library),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.library))
						.replace('{t}', page.name),
					keywords: [
						'library',
						'music',
						'artists',
						'albums',
						'tracks',
						'scrobbles',
						'history',
					],
					action:
						() => (window.location.href = url_start + '/library'),
				},
				{
					type: 'friends',
					text: tl(trans.friends),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.friends))
						.replace('{t}', page.name),
					keywords: [
						'friends',
						'following',
						'followers',
						'neighbours',
						'similar',
					],
					action:
						() => (window.location.href = url_start + '/following'),
				},
				{
					type: 'following',
					text: tl(trans.following),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.following))
						.replace('{t}', page.name),
					keywords: ['friends', 'following'],
					action:
						() => (window.location.href = url_start + '/following'),
				},
				{
					type: 'followers',
					text: tl(trans.followers),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.followers))
						.replace('{t}', page.name),
					keywords: ['friends', 'followers'],
					action:
						() => (window.location.href = url_start + '/followers'),
				},
				{
					type: 'neighbours',
					text: tl(trans.neighbours),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.neighbours))
						.replace('{t}', page.name),
					keywords: ['friends', 'neighbours', 'similar'],
					action: () => (window.location.href = url_start +
						'/neighbours'),
				},
				{
					type: 'shouts',
					text: tl(trans.shouts),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.shouts))
						.replace('{t}', page.name),
					keywords: ['shout', 'shoutbox', 'shouts', 'comments'],
					action:
						() => (window.location.href = url_start + '/shoutbox'),
				},
				{
					type: 'loved',
					text: tl(trans.loved),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.loved))
						.replace('{t}', page.name),
					keywords: [
						'loved',
						'hearted',
						'favourites',
						'favorites',
						'luved',
					],
					action: () => (window.location.href = url_start + '/loved'),
				},
				{
					type: 'obsessions',
					text: tl(trans.obsessions),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.obsessions))
						.replace('{t}', page.name),
					keywords: [
						'loved',
						'hearted',
						'favourites',
						'favorites',
						'obsessions',
						'looping',
					],
					action: () => (window.location.href = url_start +
						'/obsessions'),
				},
				{
					type: 'events',
					text: tl(trans.events),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.events))
						.replace('{t}', page.name),
					keywords: ['events', 'festivals', 'tour', 'live'],
					action:
						() => (window.location.href = url_start + '/events'),
				},
				{
					type: 'playlists',
					text: tl(trans.playlists),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.playlists))
						.replace('{t}', page.name),
					keywords: ['playlists', 'folders'],
					action:
						() => (window.location.href = url_start + '/playlists'),
				},
				{
					type: 'tags',
					text: tl(trans.tags),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.tags))
						.replace('{t}', page.name),
					keywords: [
						'tags',
						'tagged',
						'related',
						'groups',
						'grouped',
					],
					action: () => (window.location.href = url_start + '/tags'),
				},
				{
					type: 'compare',
					text: tl(trans.compare),
					body: tl(trans.compares_your_taste).replace(
						'{v}',
						page.name,
					),
					keywords: ['similar', 'taste', 'music', 'shared'],
					action: () => compare(),
					hide: page.name == auth.name,
				},
				{
					type: 'collage',
					text: tl(trans.collage),
					body: tl(trans.create_a_collage),
					keywords: ['taste', 'music', 'chart', '5x5', 'topster'],
					action: () => collage(),
				},
			]);
		} else if (page.type == 'artist') {
			rabbit_search('internal:ctx', [
				{
					type: 'overview',
					text: tl(trans.home),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.home))
						.replace('{t}', page.name),
					keywords: ['home'],
					action: () => (window.location.href = url_start),
				},
				{
					type: 'tracks',
					text: tl(trans.tracks),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.tracks))
						.replace('{t}', page.name),
					keywords: ['music', 'top'],
					action:
						() => (window.location.href = url_start + '/+tracks'),
				},
				{
					type: 'albums',
					text: tl(trans.albums),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.albums))
						.replace('{t}', page.name),
					keywords: ['music', 'top'],
					action:
						() => (window.location.href = url_start + '/+albums'),
				},
				{
					type: 'photos',
					text: tl(trans.photos),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.photos))
						.replace('{t}', page.name),
					keywords: [
						'gallery',
						'artwork',
						'image',
						'picture',
						'avatar',
					],
					action:
						() => (window.location.href = url_start + '/+images'),
				},
				{
					type: 'similar',
					text: tl(trans.similar_artists),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.similar_artists))
						.replace('{t}', page.name),
					keywords: ['music'],
					action:
						() => (window.location.href = url_start + '/+similar'),
				},
				{
					type: 'wiki',
					text: tl(trans.biography),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.biography))
						.replace('{t}', page.name),
					keywords: ['wiki', 'about', 'text'],
					action: () => (window.location.href = url_start + '/+wiki'),
				},
				{
					type: 'listeners',
					text: tl(trans.listeners),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.listeners))
						.replace('{t}', page.name),
					keywords: ['top'],
					action: () => (window.location.href = url_start +
						'/+listeners'),
				},
				{
					type: 'listeners_you_know',
					text: tl(trans.listeners_you_know),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.listeners_you_know))
						.replace('{t}', page.name),
					keywords: ['friends'],
					action: () => (window.location.href = url_start +
						'/+listeners/you-know'),
				},
				{
					type: 'shouts',
					text: tl(trans.shouts),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.shouts))
						.replace('{t}', page.name),
					keywords: ['shout', 'shoutbox', 'shouts', 'comments'],
					action:
						() => (window.location.href = url_start + '/+shoutbox'),
				},
				{
					type: 'events',
					text: tl(trans.events),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.events))
						.replace('{t}', page.name),
					keywords: ['events', 'festivals', 'tour', 'live'],
					action:
						() => (window.location.href = url_start + '/+events'),
				},
				{
					type: 'tags',
					text: tl(trans.tags),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.tags))
						.replace('{t}', page.name),
					keywords: [
						'tags',
						'tagged',
						'related',
						'groups',
						'grouped',
					],
					action: () => (window.location.href = url_start + '/+tags'),
				},
			]);
		} else if (page.type == 'album') {
			rabbit_search('internal:ctx', [
				{
					type: 'overview',
					text: tl(trans.home),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.home))
						.replace('{t}', page.name),
					keywords: ['home'],
					action: () => (window.location.href = url_start),
				},
				{
					type: 'wiki',
					text: tl(trans.wiki),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.wiki))
						.replace('{t}', page.name),
					keywords: ['wiki', 'about', 'text'],
					action: () => (window.location.href = url_start + '/+wiki'),
				},
				{
					type: 'photos',
					text: tl(trans.artwork),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.artwork))
						.replace('{t}', page.name),
					keywords: [
						'gallery',
						'artwork',
						'image',
						'picture',
						'avatar',
					],
					action:
						() => (window.location.href = url_start + '/+images'),
				},
				{
					type: 'shouts',
					text: tl(trans.shouts),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.shouts))
						.replace('{t}', page.name),
					keywords: ['shout', 'shoutbox', 'shouts', 'comments'],
					action:
						() => (window.location.href = url_start + '/+shoutbox'),
				},
				{
					type: 'tags',
					text: tl(trans.tags),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.tags))
						.replace('{t}', page.name),
					keywords: [
						'tags',
						'tagged',
						'related',
						'groups',
						'grouped',
					],
					action: () => (window.location.href = url_start + '/+tags'),
				},
			]);
		} else if (page.type == 'track') {
			rabbit_search('internal:ctx', [
				{
					type: 'overview',
					text: tl(trans.home),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.home))
						.replace('{t}', page.name),
					keywords: ['home'],
					action: () => (window.location.href = url_start),
				},
				{
					type: 'albums',
					text: tl(trans.albums),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.albums))
						.replace('{t}', page.name),
					keywords: ['music', 'top'],
					action:
						() => (window.location.href = url_start + '/+albums'),
				},
				{
					type: 'wiki',
					text: tl(trans.wiki),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.wiki))
						.replace('{t}', page.name),
					keywords: ['wiki', 'about', 'text'],
					action: () => (window.location.href = url_start + '/+wiki'),
				},
				{
					type: 'shouts',
					text: tl(trans.shouts),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.shouts))
						.replace('{t}', page.name),
					keywords: ['shout', 'shoutbox', 'shouts', 'comments'],
					action:
						() => (window.location.href = url_start + '/+shoutbox'),
				},
				{
					type: 'tags',
					text: tl(trans.tags),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.tags))
						.replace('{t}', page.name),
					keywords: [
						'tags',
						'tagged',
						'related',
						'groups',
						'grouped',
					],
					action: () => (window.location.href = url_start + '/+tags'),
				},
			]);
		} else if (page.type == 'tag') {
			rabbit_search('internal:ctx', [
				{
					type: 'overview',
					text: tl(trans.home),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.home))
						.replace('{t}', page.name),
					keywords: ['home'],
					action: () => (window.location.href = url_start),
				},
				{
					type: 'artists',
					text: tl(trans.artists),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.artists))
						.replace('{t}', page.name),
					keywords: ['music', 'top'],
					action:
						() => (window.location.href = url_start + '/artists'),
				},
				{
					type: 'albums',
					text: tl(trans.albums),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.albums))
						.replace('{t}', page.name),
					keywords: ['music', 'top'],
					action:
						() => (window.location.href = url_start + '/albums'),
				},
				{
					type: 'tracks',
					text: tl(trans.tracks),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.tracks))
						.replace('{t}', page.name),
					keywords: ['music', 'top'],
					action:
						() => (window.location.href = url_start + '/tracks'),
				},
				{
					type: 'wiki',
					text: tl(trans.wiki),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.wiki))
						.replace('{t}', page.name),
					keywords: ['wiki', 'about', 'text'],
					action: () => (window.location.href = url_start + '/wiki'),
				},
				{
					type: 'shouts',
					text: tl(trans.shouts),
					body: tl(trans.opens_the_value_for_type)
						.replace('{v}', tl(trans.shouts))
						.replace('{t}', page.name),
					keywords: ['shout', 'shoutbox', 'shouts', 'comments'],
					action:
						() => (window.location.href = url_start + '/shoutbox'),
				},
			]);
		}
	}

	function search() {
		// custom control
		depth = 2;
		if (!page.structure.dialogs.hasChildNodes()) rabbit();

		searching = {
			primary: {
				name: '',
				type: '',
			},
			secondary: {
				name: '',
				type: '',
			},
		};

		search_fill();
	}

	function search_fill() {
		depth = 2;
		input_box.querySelector('input').style.display = 'none';
		fake.style.removeProperty('display');

		input_box.setAttribute('data-showing-fake', true);

		if (searching.primary.type && searching.secondary.type) {
			render(
				fake,
				html`
					<label class="rabbit-label">${searching.primary
						.type}:</label>
					<p class="rabbit-text">${searching.primary.name}</p>
					<label>${searching.secondary.type}:</label>
					<p class="rabbit-text">${searching.secondary.name}</p>
				`,
			);
		} else if (searching.primary.type) {
			render(
				fake,
				html`
					<label class="rabbit-label">${searching.primary
						.type}:</label>
					<p class="rabbit-text">${searching.primary.name}</p>
				`,
			);
		} else {
			render(
				fake,
				html`
					<i class="rabbit-hint">${tl(trans.choose_a_search_type)}</i>
				`,
			);
		}

		if (searching.primary.type == 'artist') {
			rabbit_search('internal:search', [
				{
					type: 'finish',
					text: tl(trans.finish),
					body: tl(trans.finish_search),
					keywords: ['finish'],
					action: () => search_finish(),
				},
				{
					type: 'artist',
					text: tl(trans.artist),
					body: tl(trans.search_for_value).replace(
						'{v}',
						tl(trans.artist),
					),
					keywords: ['profile'],
					action: () => append_search('artist'),
				},
				{
					type: 'album',
					text: tl(trans.album),
					body: tl(trans.search_for_value).replace(
						'{v}',
						tl(trans.album),
					),
					keywords: ['record'],
					action: () => append_search('album'),
				},
				{
					type: 'track',
					text: tl(trans.track),
					body: tl(trans.search_for_value).replace(
						'{v}',
						tl(trans.track),
					),
					keywords: ['song'],
					action: () => append_search('track'),
				},
			]);
		} else if (searching.primary.type == 'user') {
			rabbit_search('internal:search', [
				{
					type: 'search',
					text: tl(trans.search),
					body: tl(trans.finish_search),
					keywords: ['finish'],
					action: () => search_finish(),
				},
				{
					type: 'user',
					text: tl(trans.profile),
					body: tl(trans.search_for_value).replace(
						'{v}',
						tl(trans.profile),
					),
					keywords: [],
					action: () => append_search('user'),
				},
			]);
		} else if (searching.primary.type == 'tag') {
			rabbit_search('internal:search', [
				{
					type: 'finish',
					text: tl(trans.finish),
					body: tl(trans.finish_search),
					keywords: ['finish'],
					action: () => search_finish(),
				},
				{
					type: 'tag',
					text: tl(trans.tag),
					body: tl(trans.search_for_value).replace(
						'{v}',
						tl(trans.tag),
					),
					keywords: ['genre'],
					action: () => append_search('tag'),
				},
			]);
		} else if (
			searching.secondary.type == 'album' ||
			searching.secondary.type == 'track'
		) {
			rabbit_search('internal:search', [
				{
					type: 'artist',
					text: tl(trans.artist),
					body: tl(trans.search_for_value).replace(
						'{v}',
						tl(trans.artist),
					),
					keywords: ['profile'],
					action: () => append_search('artist'),
				},
			]);
		} else {
			rabbit_search('internal:search', [
				{
					type: 'artist',
					text: tl(trans.artist),
					body: tl(trans.search_for_value).replace(
						'{v}',
						tl(trans.artist),
					),
					keywords: ['profile'],
					action: () => append_search('artist'),
				},
				{
					type: 'album',
					text: tl(trans.album),
					body: tl(trans.search_for_value).replace(
						'{v}',
						tl(trans.album),
					),
					keywords: ['record'],
					action: () => append_search('album'),
				},
				{
					type: 'track',
					text: tl(trans.track),
					body: tl(trans.search_for_value).replace(
						'{v}',
						tl(trans.track),
					),
					keywords: ['song'],
					action: () => append_search('track'),
				},
				{
					type: 'user',
					text: tl(trans.profile),
					body: tl(trans.search_for_value).replace(
						'{v}',
						tl(trans.profile),
					),
					keywords: [],
					action: () => append_search('user'),
				},
				{
					type: 'tag',
					text: tl(trans.tag),
					body: tl(trans.search_for_value).replace(
						'{v}',
						tl(trans.tag),
					),
					keywords: ['genre'],
					action: () => append_search('tag'),
				},
			]);
		}
	}

	function search_finish() {
		if (searching.primary.type == 'artist') {
			if (searching.secondary.type == 'album') {
				window.location.href = `${root}music/${redirect()}${
					sanitise(searching.primary.name)
				}/${sanitise(searching.secondary.name)}`;
			} else if (searching.secondary.type == 'track') {
				window.location.href = `${root}music/${redirect()}${
					sanitise(searching.primary.name)
				}/_/${sanitise(searching.secondary.name)}`;
			} else {
				window.location.href = `${root}music/${redirect()}${
					sanitise(searching.primary.name)
				}`;
			}
		} else if (searching.primary.type == 'user') {
			window.location.href = `${root}user/${
				sanitise(searching.primary.name)
			}`;
		} else if (searching.primary.type == 'tag') {
			window.location.href = `${root}tag/${
				sanitise(searching.primary.name)
			}`;
		}
	}
}

export function keybind(list) {
	const darwin = ['darwin', 'ios'].includes(page.platform);

	const keymap = {
		'⌘': 'Ctrl',
		'⇧': 'Shift',
		'⌥': 'Alt',
		'⌃': 'Ctrl',
		'⏎': 'Enter',
		'⎋': 'Esc',
		'⌫': 'Backspace',
	};

	return html.node`
        <div class="keybind">
            ${
		list.map((key, index) => {
			const label = darwin ? key : keymap[key] || key;

			return html.node`
                    <kbd>${label}</kbd>
                    ${
				!darwin && index < list.length - 1
					? html.node`<kbd class="kbd-sep">+</kbd>`
					: ''
			}
                `;
		})
	}
        </div>
    `;
}
