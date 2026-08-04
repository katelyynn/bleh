/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { trans, translation } from '@/build/trans';
import { icons } from '@/components/shared/icon.tsx';
import { saturation_themes_unsupported } from '@/build/theme.ts';

export type setting_value = string | boolean | number | [] | string[] | {};

export interface setting_instance {
	css?: string;
	default: setting_value;
	type?:
		| 'toggle'
		| 'checkbox'
		| 'range'
		| 'select'
		| 'radio'
		| 'list'
		| 'tabs'
		| 'text'
		| 'keybind'
		| 'other';
	title?: translation;
	body?: translation;
	incompatible?: Record<string, setting_value>;
	incompatible_strings?: string[];
	requires?: Record<string, setting_value>;
	hide_if_incompatible?: boolean;
	require_reload?: boolean | 'partial';
	tags?: (translation | string)[];
	bubble?: boolean;
	beta?: boolean;
	new_release?: boolean;
	values?: Record<string, radio_item>;
	min?: number;
	max?: number;
	step?: number;
	platforms?: string[];
	icon?: string;
	horizontal?: boolean;
	vertical?: boolean;
	placeholder?: translation | string;
	keybind?: string[];
	warn_if_empty?: boolean;
	predefined?: boolean;
	warn_if_matches_auth?: boolean;
	avatar?: boolean;
	suffix?: string;
	wait?: boolean;
}

interface radio_item {
	name: translation | string;
}

export let settings: Record<string, setting_value> = {};
export let inbuilt_settings = {
	recent_artwork: {
		css: 'recent_artwork',
		unit: '',
		value: true,
		values: [true, false],
		type: 'toggle',
	},
	recent_realtime: {
		css: 'recent_realtime',
		unit: '',
		value: true,
		values: [true, false],
		type: 'toggle',
	},
	recent_listening: {
		css: 'recent_listening',
		unit: '',
		value: true,
		values: [true, false],
		type: 'toggle',
	},
	disable_shoutbox: {
		css: 'disable_shoutbox',
		unit: '',
		value: true,
		values: [true, false],
		type: 'toggle',
	},
	edit_all: {
		css: 'edit_all',
		unit: '',
		value: true,
		values: [true, false],
		type: 'toggle',
	},
	create_automatic_edit_rule: {
		css: 'create_automatic_edit_rule',
		unit: '',
		value: true,
		values: [true, false],
		type: 'toggle',
	},
	marketing_emails: {
		css: 'marketing_emails',
		unit: '',
		value: true,
		values: [true, false],
		type: 'toggle',
	},
};

export const other_setting_types = ['list'];

export const settings_store: Record<string, setting_instance> = {
	theme: {
		default: 'darker',
		type: 'radio',
		title: trans.themes.name,
		tags: [
			trans.themes.light,
			trans.themes.ink,
			trans.themes.dark,
			trans.themes.darker,
			trans.themes.oled,
			'oled',
			trans.appearance,
			trans.visual,
		],
		bubble: true,
	},
	theme_type: {
		default: 'dark',
		type: 'radio',
		bubble: true,
	},
	theme_schedule: {
		default: false,
		title: trans.adapt_theme,
	},
	theme_day: {
		default: 'light',
		type: 'select',
		title: trans.theme_day.name,
		body: trans.theme_day.body,
		incompatible: { theme_schedule: false },
		hide_if_incompatible: true,
	},
	theme_night: {
		default: 'darker',
		type: 'select',
		title: trans.theme_night.name,
		body: trans.theme_night.body,
		incompatible: { theme_schedule: false },
		hide_if_incompatible: true,
	},
	high_contrast: {
		default: false,
		type: 'checkbox',
		title: trans.high_contrast,
	},
	accent_type: {
		default: 'colour',
		type: 'radio',
	},
	hue: {
		css: 'hue-user',
		default: 298,
		type: 'range',
		min: 0,
		max: 360,
		step: 1,
		title: trans.hue,
		vertical: true,
	},
	sat: {
		css: 'sat-user',
		default: 1.28,
		type: 'range',
		min: 0,
		max: 4,
		step: 0.01,
		title: trans.sat,
		vertical: true,
	},
	sat_bg: {
		css: 'sat-bg',
		default: 1,
		type: 'range',
		min: 0,
		max: 5,
		step: 0.2,
		title: trans.card_background_saturation.name,
		body: trans.card_background_saturation.body,
		incompatible: { theme: saturation_themes_unsupported },
		incompatible_strings: [trans.theme_no_saturation_support],
	},
	lit: {
		css: 'lit-user',
		default: 0.9,
		type: 'range',
		min: 0,
		max: 1.5,
		step: 0.01,
		title: trans.lit,
		vertical: true,
	},
	solarium: {
		default: true,
		title: trans.solarium.name,
		body: trans.solarium.body,
		bubble: true,
	},
	noise: {
		css: 'noise-opacity',
		default: 0.35,
		type: 'range',
		min: 0,
		max: 1,
		step: 0.05,
		title: trans.noise.name,
		body: trans.noise.body,
	},
	gloss: {
		css: 'gloss',
		default: 0,
		type: 'range',
		min: 0,
		max: 1,
		step: 0.05,
		title: trans.gloss.name,
		body: trans.gloss.body,
	},
	gendered_tags: {
		default: true,
		title: trans.gendered_tags.name,
		body: trans.gendered_tags.body,
		bubble: true,
	},
	dev: {
		default: false,
		title: trans.theme_loading.name,
		body: trans.theme_loading.body,
	},
	developer: {
		default: false,
		title: trans.developer_mode.name,
		body: trans.developer_mode.body,
		require_reload: true,
	},
	developer_setting_names: {
		default: false,
		title: trans.developer_setting_names,
		require_reload: true,
	},
	accessible_name_colours: {
		default: false,
		title: trans.accessible_name_colours.name,
		body: trans.accessible_name_colours.body,
		bubble: true,
	},
	display_name_styles: {
		default: true,
		title: trans.display_name_styles.name,
		body: trans.display_name_styles.body,
		require_reload: true,
	},
	reduced_motion: {
		default: false,
		title: trans.reduced_motion.name,
		body: trans.reduced_motion.body,
		bubble: true,
	},
	underline_links: {
		default: false,
		title: trans.underline_links.name,
		body: trans.underline_links.body,
		bubble: true,
	},
	format_guest_features: {
		default: true,
		title: trans.format_guest_features.name,
		body: trans.format_guest_features.body,
		require_reload: 'partial',
		tags: [
			'music',
			'tracklist',
			'title',
			'tag',
		],
		bubble: true,
	},
	show_guest_features: {
		default: false,
		title: trans.show_guest_features.name,
		body: trans.show_guest_features.body,
		tags: [
			'music',
			'tracklist',
			'title',
			'tag',
		],
		bubble: true,
		incompatible: { format_guest_features: false },
	},
	track_layout: {
		default: 'column',
		type: 'radio',
		title: trans.track_layout.name,
		body: trans.track_layout.body,
		values: {
			column: {
				name: trans.track_layout.column,
			},
			row: {
				name: trans.track_layout.row,
			},
		},
		tags: [
			'music',
			'tracklist',
			trans.track_layout.column,
			trans.track_layout.row,
		],
		bubble: true,
	},
	expand_tracks: {
		default: 'active',
		type: 'radio',
		title: trans.expand_tracks.name,
		body: trans.expand_tracks.body,
		values: {
			always: {
				name: trans.expand_tracks_always,
			},
			active: {
				name: trans.expand_tracks_when_active,
			},
			never: {
				name: trans.never,
			},
		},
		incompatible: { track_layout: 'row' },
		tags: [
			'music',
			'tracklist',
			trans.expand_tracks_always,
			trans.expand_tracks_when_active,
		],
		bubble: true,
	},
	track_album_name_location: {
		default: 'column',
		type: 'radio',
		title: trans.track_album_name_location.name,
		body: trans.track_album_name_location.body,
		values: {
			column: {
				name: trans.track_album_name_location.column,
			},
			row: {
				name: trans.track_album_name_location.row,
			},
		},
		incompatible: { track_layout: 'row' },
		tags: [
			'music',
			'tracklist',
			trans.track_album_name_location.column,
			trans.track_album_name_location.row,
		],
	},
	glacier_library_graphs: {
		default: true,
		title: trans.glacier_graphs.name,
		body: trans.glacier_graphs.body,
		tags: [
			'music',
		],
	},
	show_remaster_tags: {
		default: true,
		title: trans.show_remaster_tags,
		beta: true,
		bubble: true,
		incompatible: { format_guest_features: false },
	},
	corrections: {
		default: true,
		title: trans.correct_titles_with_lotus.name,
		body: trans.correct_titles_with_lotus.body,
		require_reload: true,
		tags: [
			'music',
		],
	},
	colourful_counts: {
		default: true,
		title: trans.colourful_counts.name,
		body: trans.colourful_counts.body,
	},
	colourful_tracks: {
		default: true,
		type: 'checkbox',
		title: trans.colourful_active,
		incompatible: { colourful_tracks_all: true },
	},
	colourful_tracks_all: {
		default: false,
		type: 'checkbox',
		title: trans.colourful_all,
	},
	feature_flags: {
		default: {},
		type: 'other',
	},
	show_your_progress: {
		default: true,
		title: trans.show_your_progress.name,
		body: trans.show_your_progress.body,
		bubble: true,
	},
	travis: {
		default: true,
		title: trans.redirect_messages.name,
		body: trans.redirect_messages.body,
		bubble: true,
	},
	list_view: {
		default: 'cards',
		type: 'tabs',
		values: {
			cards: {
				name: trans.cards,
			},
			grid: {
				name: trans.grid,
			},
			list: {
				name: trans.list,
			},
		},
	},
	chart_view: {
		default: 'line',
		type: 'tabs',
		values: {
			line: {
				name: trans.line,
			},
			pie: {
				name: trans.pie,
			},
			bar: {
				name: trans.bar,
			},
		},
		bubble: true,
	},
	chart_bar_axis: {
		default: 'horizontal',
		type: 'tabs',
		values: {
			horizontal: {
				name: trans.horizontal,
			},
			vertical: {
				name: trans.vertical,
			},
		},
		bubble: true,
	},
	chart_insights_view: {
		default: 'pie',
		type: 'radio',
	},
	shout_markdown: {
		default: true,
		require_reload: 'partial',
		title: trans.markdown_shouts.name,
		body: trans.markdown_shouts.body,
		bubble: true,
	},
	bio_markdown: {
		default: true,
		require_reload: 'partial',
		title: trans.markdown_profiles.name,
		body: trans.markdown_profiles.body,
		bubble: true,
	},
	avatar_radius: {
		default: 'circle',
		type: 'radio',
		title: trans.avatar_radius.name,
		body: trans.avatar_radius.body,
		values: {
			circle: {
				name: trans.circle,
			},
			squircle: {
				name: trans.squircle,
			},
			square: {
				name: trans.square,
			},
		},
		bubble: true,
	},
	hue_from_album: {
		default: true,
		type: 'checkbox',
		title: trans.viewing_albums,
	},
	hue_from_track: {
		default: true,
		type: 'checkbox',
		title: trans.viewing_tracks,
	},
	hue_from_artist: {
		default: true,
		type: 'checkbox',
		title: trans.viewing_artists,
	},
	seasonal: {
		default: true,
		title: trans.enable_seasons.name,
		body: trans.enable_seasons.body,
		require_reload: true,
	},
	seasonal_particles: {
		default: 'all',
		type: 'radio',
		title: trans.seasonal_particles.name,
		body: trans.seasonal_particles.body,
		values: {
			all: {
				name: trans.all_particles,
			},
			less: {
				name: trans.less_particles,
			},
			none: {
				name: trans.no_particles,
			},
		},
		require_reload: true,
	},
	seasonal_particles_fps: {
		default: false,
		type: 'checkbox',
		title: trans.seasonal_particles_fps.name,
		body: trans.seasonal_particles_fps.body,
	},
	seasonal_overlays: {
		default: true,
		type: 'checkbox',
		title: trans.seasonal_overlays.name,
		body: trans.seasonal_overlays.body,
		bubble: true,
	},
	profile_header_own: {
		default: true,
		type: 'checkbox',
		title: trans.own_profile,
		tags: [
			trans.profile,
			trans.username.name,
			trans.profile_banner.name,
		],
	},
	profile_header_others: {
		default: true,
		type: 'checkbox',
		title: trans.other_profiles,
		tags: [
			trans.profile,
			trans.username.name,
			trans.profile_banner.name,
		],
	},
	profile_avi_background: {
		default: false,
		title: trans.profile_avi_background.name,
		body: trans.profile_avi_background.body,
		tags: [
			trans.profile,
			trans.username.name,
			trans.profile_banner.name,
		],
	},
	profile_shortcut: {
		default: '',
		type: 'text',
		avatar: true,
		wait: true,
		max: 40,
		title: trans.profile_shortcut.name,
		body: trans.profile_shortcut.body,
		placeholder: trans.enter_username,
		warn_if_matches_auth: true,
	},
	font: {
		css: 'custom_font',
		default: '',
		type: 'text',
		max: 120,
		title: trans.font.name,
		body: trans.font.body,
		placeholder: trans.enter_font_names,
		requires: { font_choice: 'custom' },
	},
	font_choice: {
		default: 'font_2026',
		type: 'radio',
		title: trans.font_choice.name,
		body: trans.font_choice.body,
		values: {
			font_2026: {
				name: trans.font_choice.stylised,
			},
			font_2025: {
				name: trans.font_choice.simple,
			},
			hyperlegible: {
				name: trans.font_choice.hyperlegible,
			},
			custom: {
				name: trans.font_choice.custom,
			},
		},
		bubble: true,
		tags: [
			trans.text,
		],
	},
	font_serif: {
		default: true,
		type: 'checkbox',
		title: trans.font_serif,
		bubble: true,
		tags: [
			trans.text,
		],
	},
	font_weight: {
		css: 'custom_font_weight',
		default: 400,
		min: 100,
		max: 600,
		step: 10,
		type: 'range',
		title: trans.font_weight.name,
		body: trans.font_weight.body,
	},
	font_weight_medium: {
		css: 'custom_font_weight_medium',
		default: 500,
		min: 400,
		max: 750,
		step: 10,
		type: 'range',
		title: trans.font_weight_medium.name,
		body: trans.font_weight_medium.body,
	},
	font_weight_bold: {
		css: 'custom_font_weight_bold',
		default: 600,
		min: 500,
		max: 900,
		step: 10,
		type: 'range',
		title: trans.font_weight_bold.name,
		body: trans.font_weight_bold.body,
	},
	font_emoji: {
		default: true,
		title: trans.font_emoji.name,
		body: trans.font_emoji.body,
		platforms: ['win32', 'linux', 'android', 'other'],
		bubble: true,
	},
	grid_glow: {
		default: true,
		title: trans.grid_glow.name,
		body: trans.grid_glow.body,
		bubble: true,
	},
	default_avatar_action: {
		default: 'expand',
		type: 'radio',
		title: trans.default_avatar_action.name,
		body: trans.default_avatar_action.body,
		values: {
			expand: {
				name: trans.expand,
			},
			gallery: {
				name: trans.photos,
			},
		},
	},
	collage_title: {
		default: true,
		title: trans.collage_title.name,
		body: trans.collage_title.body,
	},
	collage_grid_text: {
		default: true,
		title: trans.collage_grid_text,
	},
	collage_grid_plays: {
		default: true,
		title: trans.collage_grid_plays,
	},
	collage_grid_gap: {
		default: true,
		title: trans.collage_grid_gap.name,
		body: trans.collage_grid_gap.body,
	},
	hu_tao: {
		default: '',
		type: 'text',
		max: 40,
		placeholder: trans.enter_password,
	},
	activities: {
		default: true,
		title: trans.activity_tracking.name,
		body: trans.activity_tracking.body,
	},
	activity_shout: {
		default: true,
		title: trans.shouts,
		body: trans.activity.types.shout,
		type: 'checkbox',
		icon: 'icon-16-shoutbox',
	},
	activity_image: {
		default: true,
		title: trans.photos,
		body: trans.activity.types.image,
		type: 'checkbox',
		icon: 'icon-16-gallery-vertical',
	},
	activity_obsess: {
		default: true,
		title: trans.obsessions,
		body: trans.activity.types.obsess,
		type: 'checkbox',
		icon: 'icon-16-obsession',
	},
	activity_love: {
		default: true,
		title: trans.loved,
		body: trans.activity.types.love,
		type: 'checkbox',
		icon: 'icon-16-heart',
	},
	activity_bookmark: {
		default: true,
		title: trans.bookmarks,
		body: trans.activity.types.bookmark,
		type: 'checkbox',
		icon: 'icon-16-bookmark',
	},
	activity_wiki: {
		default: true,
		title: trans.wiki,
		body: trans.activity.types.wiki,
		type: 'checkbox',
		icon: 'icon-16-bio',
	},
	activity_install: {
		default: true,
		title: trans.installation,
		body: trans.activity.types.install,
		type: 'checkbox',
		icon: 'icon-16-download',
	},
	simulate_scroll: {
		default: true,
		title: trans.simulate_scroll.name,
		body: trans.simulate_scroll.body,
		require_reload: 'partial',
		bubble: true,
	},
	rabbit: {
		default: true,
		title: trans.use_quick_switcher.name,
		body: trans.use_quick_switcher.body,
	},
	rabbit_search: {
		default: ['⌘', 'D'],
		title: trans.search,
		type: 'keybind',
		icon: icons.search,
		keybind: ['⌘', 'D'],
	},
	rabbit_primary: {
		default: ['⌘', 'K'],
		title: trans.open,
		type: 'keybind',
		icon: icons.rabbit,
		keybind: ['⌘', 'K'],
	},
	rabbit_profile: {
		default: ['⌘', 'P'],
		title: trans.profile,
		type: 'keybind',
		icon: icons.user,
		keybind: ['⌘', 'P'],
	},
	rabbit_shortcut: {
		default: ['⌘', 'S'],
		title: trans.starred_friend.name,
		type: 'keybind',
		icon: icons.starred_friend,
		keybind: ['⌘', 'S'],
	},
	rabbit_bleh_settings: {
		default: ['⌘', 'B'],
		title: trans.settings,
		type: 'keybind',
		icon: icons.bleh_settings,
		keybind: ['⌘', 'B'],
	},
	prefer_no_redirect: {
		default: true,
		title: trans.prefer_no_redirect.name,
		body: trans.prefer_no_redirect.body,
	},
	inbox_view: {
		default: 'notifications',
		type: 'tabs',
		values: {
			notifications: {
				name: trans.notifications,
			},
			messages: {
				name: trans.messages,
			},
		},
	},
	navigation_items: {
		default: ['home', 'library', 'shouts'],
		type: 'list',
		title: trans.navigation_items.name,
		body: trans.navigation_items.body,
		predefined: true,
		tags: [
			trans.profile,
			trans.username.name,
			'menu',
		],
	},
	navigation_language: {
		default: true,
		type: 'checkbox',
		title: trans.navigation_language,
		tags: [
			trans.language,
			trans.profile,
			trans.username.name,
			'menu',
		],
	},
	branding_type: {
		default: 'bleh',
		type: 'radio',
		title: trans.branding_type.name,
		body: trans.branding_type.body,
		values: {
			bleh: {
				name: 'bleh',
			},
			lastfm: {
				name: 'Last.fm',
			},
		},
	},
	rain: {
		default: false,
		title: trans.rain.name,
		body: trans.rain.body,
		require_reload: true,
	},
	collage_centered: {
		default: true,
		title: trans.collage_centered.name,
		body: trans.collage_centered.body,
	},
	static_gifs: {
		default: 'always',
		type: 'radio',
		title: trans.static_gifs,
		values: {
			always: {
				name: trans.always_animate,
			},
			hover: {
				name: trans.only_on_hover,
			},
			never: {
				name: trans.never,
			},
		},
		new_release: true,
		beta: true,
	},
	static_avatars: {
		default: false,
		type: 'checkbox',
		title: trans.static_avatars,
	},
	static_music: {
		default: true,
		type: 'checkbox',
		title: trans.static_music,
	},
	static_banners: {
		default: true,
		type: 'checkbox',
		title: trans.static_banners,
		new_release: true,
	},
	trusted_sites: {
		default: [],
		type: 'list',
	},
	profile_hue: {
		default: 255,
		type: 'range',
		min: 0,
		max: 360,
		step: 1,
		title: trans.hue,
		vertical: true,
	},
	profile_sat: {
		default: 1,
		type: 'range',
		min: 0,
		max: 2,
		step: 0.01,
		title: trans.sat,
		vertical: true,
	},
	profile_lit: {
		default: 1,
		type: 'range',
		min: 0,
		max: 1.5,
		step: 0.01,
		title: trans.lit,
		vertical: true,
	},
	friends: {
		default: [],
		type: 'list',
		title: trans.close_friends,
		body: trans.friends_setting,
		warn_if_matches_auth: true,
		beta: true,
	},
	starred_friend: {
		default: '',
		type: 'select',
		title: trans.starred_friend.name,
		body: trans.starred_friend.body,
		tags: [
			trans.close_friends,
			trans.friends_setting,
		],
	},
	dismissed: {
		default: [],
		type: 'list',
	},
	oracle_beta: {
		default: false,
		title: trans.oracle_beta.name,
		body: trans.oracle_beta.body,
		beta: true,
	},
	romanise_jp: {
		default: false,
		type: 'checkbox',
		title: trans.romanise_jp,
		incompatible: { format_guest_features: false, corrections: false },
	},
	romanise_ko: {
		default: false,
		type: 'checkbox',
		title: trans.romanise_ko,
		incompatible: { format_guest_features: false, corrections: false },
	},
	music_links: {
		default: [
			'spotify',
			'itunes',
			'youtube',
			'tidal',
			'rym',
			'genius',
			'website',
			'twitter',
			'soundcloud',
			'instagram',
		],
		type: 'list',
		title: trans.music_links.name,
		body: trans.music_links.body,
		predefined: true,
	},
	inverse_compare: {
		default: false,
		title: trans.inverse_compare.name,
		body: trans.inverse_compare.body,
		new_release: true,
	},
	branch: {
		default: 'uwu',
		type: 'text',
		max: 20,
		title: trans.branch.name,
		body: trans.branch.body,
		warn_if_empty: true,
	},
	tracklist_source: {
		default: 'oracle',
		type: 'select',
		title: trans.tracklist_source.name,
		body: trans.tracklist_source.body,
		incompatible: { oracle_beta: false },
	},
	menu_replacement: {
		default: true,
		title: trans.menu_replacement.name,
		body: trans.menu_replacement.body,
		new_release: true,
		require_reload: true,
	},
	translator: {
		default: false,
		title: trans.translator.name,
		body: trans.translator.body,
		require_reload: true,
	},
	translator_view: {
		default: 'en',
		type: 'select',
	},
	popups_seen: {
		default: [],
		type: 'list',
	},
	auto_close_scrobble_modal: {
		default: true,
		type: 'checkbox',
		title: trans.auto_close,
	},
	crop_image_before_uploading: {
		default: true,
		type: 'checkbox',
		title: trans.crop_before_uploading,
	},
	show_disc_image: {
		default: true,
		title: trans.show_disc_image.name,
		body: trans.show_disc_image.body,
	},
	count_bar_right: {
		default: true,
		title: trans.count_bar_right.name,
		body: trans.count_bar_right.body,
		bubble: true,
	},
	date_selector: {
		default: 'preset',
		type: 'tabs',
		values: {
			preset: {
				name: trans.presets,
				icon: 'calendar',
			},
			custom: {
				name: trans.custom,
				icon: 'edit',
			},
		},
	},
	hybrid_inbox: {
		default: true,
		type: 'checkbox',
		title: trans.hybrid_inbox.name,
		body: trans.hybrid_inbox.body,
		require_reload: true,
	},
	skip_patching_lastfm_settings: {
		default: false,
		type: 'checkbox',
		title: trans.skip_patching_lastfm_settings,
		require_reload: 'partial',
	},
	hide_unused_settings: {
		default: true,
		type: 'checkbox',
		title: trans.hide_unused_settings,
	},
	show_scroller: {
		default: false,
		title: trans.show_scroller,
		bubble: true,
	},
};
