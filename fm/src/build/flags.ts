export interface flag {
	enabled: boolean;
	name: string;
	notice?: string;
	date: string;
}

export const flags: Record<string, flag> = {
	high_contrast: {
		enabled: false,
		name: 'Enable visibility of high contrast (experimental)',
		date: '2024-10-04',
	},
	'display_album_bookmark': {
		enabled: false,
		name: 'Display album bookmark button in gallery refresh',
		date: '2024-11-06',
	},
	'refreshed_music_nav': {
		enabled: true,
		name: 'Refreshed music nav structure',
		date: '2024-11-10',
	},
	'card_saturation': {
		enabled: true,
		name: 'Enable card saturation slider',
		date: '2024-11-10',
	},
	'unify_top_listeners': {
		enabled: true,
		name: 'Unify top listeners',
		date: '2024-11-15',
	},
	'glacier_library': {
		enabled: true,
		name: 'Glacier library (new library beta)',
		date: '2024-12-04',
	},
	'sponsor': {
		enabled: true,
		name: 'Sponsor link',
		date: '2024-12-24',
	},
	'skip_to_setting': {
		enabled: false,
		name: 'Skip to... in settings',
		date: '2024-12-24',
	},
	'remove_bookmark': {
		enabled: true,
		name: 'Context menu to remove inaccessible artist bookmark',
		date: '2024-12-28',
	},
	'badges': {
		enabled: true,
		name: 'New badge tooltip',
		date: '2024-12-28',
	},
	'colour_based_on_avatar': {
		enabled: true,
		name: 'Set colour based on avatar',
		date: '2025-01-23',
	},
	'beret': {
		enabled: true,
		name: 'beret redesign',
		date: '2025-04-03',
		'notice':
			'Removes individual card styles and instead styles the entire container, much like old bleh',
	},
	'colour_based_on_hex': {
		enabled: true,
		name: 'Set colour based on hex',
		date: '2025-04-26',
	},
	'compare': {
		enabled: true,
		name: 'Profile comparison',
		date: '2025-05-19',
	},
	'charts': {
		enabled: true,
		name: 'Profile chart creation',
		date: '2025-06-05',
	},
	'refreshed_auth_menu': {
		enabled: true,
		name: 'Refreshed auth menu',
		date: '2025-06-07',
	},
	'sweet': {
		enabled: true,
		name: 'Readable count bars',
		date: '2025-06-20',
	},
	'short': {
		enabled: true,
		name: 'Extends beret redesign to turn all content into a single card',
		date: '2025-06-24',
	},
	'auto_theme': {
		enabled: false,
		name: 'Support inheriting theme from system',
		date: '2025-06-25',
	},
	'update_center': {
		enabled: true,
		name: 'Update center',
		date: '2025-07-02',
	},
	'submit_scrobble': {
		enabled: true,
		name: 'Submit new scrobble from profile',
		date: '2025-07-08',
	},
	'jufufu': {
		enabled: true,
		name: 'Connect via the Last.fm API',
		date: '2025-07-08',
	},
	'minis': {
		enabled: true,
		name: 'Minis replacement for Labs',
		date: '2025-07-17',
	},
	'mualani': {
		enabled: true,
		name: 'Experimental redesigned tab toolbar',
		date: '2025-07-26',
	},
	unlock_minis: {
		enabled: false,
		name: 'Unlock work-in-progress minis',
		date: '2099-07-29',
	},
	'status_in_menu': {
		enabled: true,
		name: 'Show current listening status in profile menu',
		date: '2025-07-29',
	},
	'static_gifs': {
		enabled: false,
		name: 'Convert GIFs to static images',
		date: '2025-08-15',
	},
	'friends': {
		enabled: true,
		name: 'Friends system',
		date: '2025-08-18',
	},
	'adaptive_theme': {
		enabled: true,
		name: 'Adaptive theme controls',
		date: '2025-08-29',
	},
	'oracle': {
		enabled: true,
		name: 'Experimental new music page features',
		date: '2025-09-11',
	},
	'oracle_connect': {
		enabled: true,
		name: 'Experimental new album and track fetching via MusicBrainz',
		date: '2025-09-11',
	},
	'oracle_album_reordering': {
		enabled: true,
		name: 'Re-order listed albums on track pages based on listener count',
		date: '2025-09-11',
	},
	'oracle_fetch_artwork': {
		enabled: true,
		name: 'Allow oracle to fetch cover art from album tag pages',
		date: '2025-09-11',
	},
	'control_center': {
		enabled: false,
		name: 'Control center',
		date: '2025-09-20',
	},
	'mesmerizer': {
		enabled: true,
		name: 'Redesigned artwork uploader',
		date: '2025-09-25',
	},
	'refreshed_lotus': {
		enabled: true,
		name: 'Refreshed flow for submitting a lotus correction',
		date: '2025-09-26',
	},
	'inverse_compare': {
		enabled: false,
		name: 'Introduce new inverse comparison option',
		date: '2025-09-28',
	},
	'menus': {
		enabled: false,
		name: 'Replace browser menus with in-house',
		date: '2025-10-03',
	},
	'hoshino': {
		enabled: true,
		name: 'Leverage oracle cache to re-assign artwork to tracks',
		date: '2025-10-08',
	},
	'ruby': {
		enabled: true,
		name: 'Replace album/track artwork and metadata on dedicated pages',
		date: '2025-10-08',
	},
	'credits': {
		enabled: true,
		name: 'Present track credits via oracle',
		date: '2025-10-14',
	},
	'verified': {
		enabled: false,
		name: 'Verified replaces sponsor badge',
		date: '2025-10-22',
	},
	'profile_fonts': {
		enabled: true,
		name: 'Unlock profile name fonts for sponsors',
		date: '2025-10-31',
	},
	'campfire': {
		enabled: true,
		name: 'New home experience',
		date: '2025-11-05',
	},
	'non_pro_edit': {
		enabled: false,
		name: 'Non-pro editing',
		date: '2025-11-10',
	},
	'sandrone': {
		enabled: true,
		name: 'Enable a february exclusive feature',
		date: '2026-01-29',
	},
	'can_block_in_menu': {
		enabled: false,
		name: 'Can block user from menu',
		date: '2026-01-30',
	},
	'can_report_in_menu': {
		enabled: true,
		name: 'Can report user from menu',
		date: '2026-01-30',
	},
	'join_the_conversation': {
		enabled: true,
		name: "Replace 'Join the conversation' with an actual shoutbox",
		date: '2026-02-12',
	},
	'use_full_shoutbox': {
		enabled: false,
		name:
			"When 'Join the conversation' is replaced, use the full shoutbox instead of a preview",
		date: '2026-02-12',
	},
	'music_notes': {
		enabled: false,
		name: 'Display and write notes for music',
		date: '2026-02-25',
	},
	'lacrimosa': {
		enabled: false,
		name: 'Latest June idea board',
		date: '2026-06-05',
		'notice':
			"This is an attempt at bringing bleh closer to Last.fm's layout, in terms of a less floating page in the middle and more of a wide content style (no borders). THIS IS NOT FINAL!!! feedback is welcome",
	},
	'aihara': {
		enabled: false,
		name: 'Utilise Last.fm API to create new charts',
		date: '2026-07-01',
	},
	'hutao': {
		enabled: false,
		name: 'Remove Last.fm-provided stylesheets for performance',
		date: '2026-07-30',
	},
	'yuzu': {
		enabled: true,
		name: 'Keep track of track/album/artist streaks on profiles',
		date: '2026-08-29',
	},
	'collage_style': {
		enabled: false,
		name: 'Collage alternative styles',
		date: '2026-09-20',
	},
};
