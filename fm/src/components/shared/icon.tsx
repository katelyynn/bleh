/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export const icons = {
	banner: 'banner',
	accent: 'accent',
	username: 'mention',
	pronouns: 'pronouns',
	aka: 'aka',
	created: 'created',
	manage: 'dots',
	share: 'share',
	overview: 'home',
	mention: 'mention',
	profile: 'user',
	global: 'globe',
	library: 'library',
	shoutbox: 'shoutbox',
	listening_report: 'listening-report',
	general: 'settings',
	visual: 'themes',
	layout: 'layout-manage',
	update: 'update',
	ignore: 'block',
	finish: 'refresh',
	advanced: 'advanced',
	follow: 'user-plus',
	save: 'check',
	done: 'check',
	command: 'command',
	option: 'option',
	backspace: 'backspace',
	shift: 'shift',
	submit: 'submit',
	home: 'home',
	edit: 'edit',
	bulk_edit: 'edit-bulk',
	more: 'dots',
	history: 'bio-history',
	latest_wiki: 'bio',
	labs: 'labs',
	compare: 'arrows',
	message: 'mail',
	shortcut: 'unlink',
	profile_shortcut: 'profile-shortcut',
	obsession: 'obsession',
	expand: 'expand',
	link: 'link',
	quote: 'quote',
	code: 'code',
	header: 'header',
	bold: 'bold',
	italic: 'italic',
	strike: 'strike',
	underline: 'underline',
	ul: 'ul',
	ol: 'ol',
	align_left: 'align-left',
	align_center: 'align-center',
	align_right: 'align-right',
	listeners: 'listener',
	support: 'support',
	import: 'import',
	export: 'export',
	reset: 'revert',
	gallery: 'gallery-vertical',
	gallery_saved: 'bookmark',
	cards: 'layout-manage',
	grid: 'grid',
	list: 'list',
	minus: 'minus',
	plus: 'plus',
	play: 'play',
	sponsor: 'sponsor',
	message_sponsor: 'sponsor-rewards',
	bookmark: 'bookmark',
	bookmark_fill: 'bookmark-fill',
	playlist: 'playlist',
	dev: 'settings',
	settings: 'settings',
	collage: 'collage',
	plot: 'plot',
	continue: 'arrow-right',
	bleh_settings: 'bleh',
	on_this_page: 'page',
	friends: 'users',
	close_friends: 'close-friend',
	following: 'following',
	followers: 'followers',
	neighbours: 'neighbours',
	loved: 'heart',
	obsessions: 'obsession',
	events: 'event',
	playlists: 'playlist',
	news: 'changelog',
	artists: 'artist',
	artist: 'artist',
	albums: 'album',
	album: 'album',
	tracks: 'track',
	track: 'track',
	user: 'user',
	users: 'users',
	starred_friend: 'starred-friend',
	star: 'star',
	star_fill: 'star-fill',
	tags: 'tag',
	tag: 'tag',
	search: 'search',
	wiki: 'bio',
	select_all: 'select-all',
	deselect_all: 'deselect-all',
	copy_scrobble: 'copy-scrobble',
	translate: 'language',
	language: 'language',
	inbox: 'inbox',
	notifications: 'notifications',
	messages: 'mail',
	theme: 'themes',
	line: 'chart-line',
	pie: 'chart-pie',
	bar: 'chart-bar',
	horizontal: 'chart-axis-x',
	vertical: 'chart-axis-y',
	undo: 'undo',
	redo: 'redo',
	cut: 'cut',
	copy: 'copy',
	paste: 'paste',
	report: 'report',
	trash: 'trash',
	delete: 'trash',
	theme_glass: 'sphere',
	theme_light: 'sun',
	theme_ink: 'pen',
	theme_dark: 'moon',
	theme_darker: 'moon-star',
	theme_adaptive: 'adaptive',
	theme_oled: 'moon-fill',
	issue: 'issues',
	debug: 'plaster',
	check: 'check',
	check_thick: 'check-thick',
	x: 'x',
	paused: 'paused',
	close: 'x',
	info: 'info',
	refresh: 'refresh',
	block: 'block',
	upload: 'upload',
	download: 'download',
	details: 'info',
	valentine: 'valentine',
	cmd: 'command',
	quick_access: 'quick-access',
	up: 'arrow-up',
	down: 'arrow-down',
	arrow_up: 'arrow-up',
	arrow_down: 'arrow-down',
	arrow_left: 'arrow-left',
	arrow_right: 'arrow-right',
	pixel: 'pixel',
	rainbow: 'rainbow',
	receipt: 'receipt',
	lyrics: 'lyrics',
	jumble: 'jumble',
	send: 'send',
	web: 'web',
	dislike: 'dislike',
	create_from_scratch: 'create-from-scratch',
	switch: 'arrows',
	lock: 'lock',
	now_playing: 'play',
	accessibility: 'accessibility',
	seasonal: 'season',
	sku: 'plaster',
	indent: 'indent',
	lotus: 'lotus',
	oracle: 'oracle',
	credits: 'credits',
	sparkle: 'sparkle',
	error: 'error',
	construction: 'construction',
	animated_dots: 'animated-dots',
	logout: 'logout',
	mouse: 'mouse',
	spinner: 'spinner',
	rabbit: 'rabbit',
	external: 'external',
	minis: 'mini',
	bright: 'bright',
	moody: 'moody',
	redirect: 'redirect',
	profile_info: 'profile-info',
	snow: 'snow',
	effects: 'effects',
	calendar: 'calendar',
	location: 'location',
	going: 'going',
	maybe: 'maybe',
	extension: 'extension',
	heart: 'heart',
	heart_fill: 'heart-solid',
	activity: 'activity',
	recent: 'recent',
	compose: 'compose',
	motion: 'motion',
	text: 'text',
};

interface icon {
	name?: string;
	identifier?: string;
	use_mask?: boolean;
}

export function icon({ name, identifier, use_mask = true }: icon) {
	return (
		<span
			className={`bleh-icon bleh-icon-${name} ${
				use_mask ? 'use-mask' : ''
			} ${identifier ? `bleh-icon-${identifier}` : ''}`}
			style={icon_mask({ name })}
		>
			{name} (icon)
		</span>
	);
}

type IconProps = {
	name?: string;
	identifier?: string;
	mask?: boolean;
	className?: string;
} & Omit<JSX.IntrinsicElements['span'], 'class' | 'style'>;

export function Icon({
	name = 'inherit',
	identifier,
	mask = true,
	className,
	...props
}: IconProps) {
	return (
		<span
			class={[
				'bleh-icon',
				name && `bleh-icon-${name}`,
				mask && 'use-mask',
				identifier && `bleh-icon-${identifier}`,
				className && className,
			]}
			style={icon_mask({ name })}
			{...props}
		>
			{name} (icon)
		</span>
	);
}

export function SaveIcon({
	identifier,
}: Partial<IconProps>) {
	return (
		<Icon
			name={icons.check_thick}
			identifier={identifier}
			className='bleh-icon-save'
		/>
	);
}

export function CancelIcon({
	identifier,
}: Partial<IconProps>) {
	return (
		<Icon
			name={icons.x}
			identifier={identifier}
			className='bleh-icon-cancel'
		/>
	);
}

export function icon_mask({ name }: { name?: string }) {
	if (name == 'inherit') return '';

	return `--icon: var(--icon-16-${name})`;
}
