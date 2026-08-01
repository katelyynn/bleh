//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { html } from 'lighterhtml';
import tippy from 'tippy.js';
import { version } from '@/main';
import { season } from '@/components/seasonal';
import { DateTime } from 'luxon';
// require page reload
export let reload_pending = {
	state: false,
};

// lookup
export let last_lookup;
export let next_lookup;

export let dialogs = {};
export let notifications = {};

tippy.setDefaultProps({
	arrow: false,
	duration: [220, 220],
	offset: [0, 4],
	ignoreAttributes: true,
	animation: 'bleh',
});

/**
 * Current profile auth details
 * @param {string|null} name - Profile name if authorised
 * @param {boolean} pro - Last.fm Pro status
 * @param {boolean} sponsor - Sponsor of the project
 * @param {boolean} sponsor_full - Monthly sponsor of the project
 * @param {string|null} avatar - Profile avatar if present
 * @param {{hue: number, sat: number, lit: number}} sets - Set of colours based on avatar
 */
export let auth = {
	name: null,
	pro: null,
	sponsor: false,
	sponsor_full: false,
	avatar: null,
	sets: {
		hue: 255,
		sat: 1,
		lit: 1,
	},
};
export let auth_link = {
	state: null,
};

/**
 * Start of page URL based on language, examples:
 * en: / and jp: /jp/
 *
 * Build a language-aware URL like
 *
 * {root}user = /user or /jp/user
 * @type {string}
 */
export let root = '/';
export function setRoot(data) {
	root = data;
}
// recent activity
export let recent_activity_list = [];

/**
 * Represents the current page state, structure, and any elements
 *
 * @property {string} type - Page type (e.g., user, album, settings)
 * @property {string} subpage - Page type subsection (e.g., overview, library_artists, shoutbox_overview)
 * @property {string} name - Artist/album/track/profile name
 * @property {string} sister - Related artist for album or track
 * @property {Array} sister_others - Featured guests on a track
 * @property {string} avatar - URL for associated avatar
 * @property {boolean} multi - Whether this artist page is a shared profile
 * @property {boolean} corrected - Whether this page has been corrected via lotus
 * @property {string} token - Profile token for submitting forms
 * @property {boolean} mobile - Page is in a mobile state **on load**
 * @property {string} platform - Operating system - can be win32, darwin, ios, android, linux, or other
 * @property {Object} structure - Elements that make up the page structure
 * @property {boolean} structure.glacier.refresh - Whether this glacier library page is pending refresh
 * @property {Object|null} structure.logs - Logging host
 * @property {Object} requested - Any arguments requested in the page URL via ?this=syntax
 * @property {Object} state - Dynamic variables
 * @property {boolean} state.settings_reload - Whether the page is pending a reload due to user settings
 */
export let page: page = {
	initial: '',
	type: '',
	name: '',
	sister: '',
	sister_others: [],
	subpage: '',
	avatar: '',
	multi: false,
	corrected: false,
	token: '',
	mobile: false,
	platform: 'other',
	suggest: null,
	restricted: false,
	now: {
		next_fetch: null,
		name: null,
		artist: null,
		album: null,
		avatar: null,
		active: false,
	},
	notifications: {
		next_fetch: null,
		list: null,
	},
	messages: {
		next_fetch: null,
		list: null,
	},
	structure: {
		wrapper: null,
		container: null,
		row: null,
		main: null,
		side: null,
		nav: null,
		content_top: null,
		glacier: {
			refresh: true,
		},
		indicator: null,
		logs: null,
	},
	requested: {
		tab: null,
	},
	header: {},
	state: {
		settings_reload: false,
		glacier: {
			insights: {
				artist: {
					display: false,
					values: [],
					labels: [],
					highest: {
						value: 0,
						label: '',
						link: '',
						img: '',
					},
				},
				album: {
					display: false,
					values: [],
					labels: [],
					highest: {
						value: 0,
						label: '',
						link: '',
						img: '',
					},
				},
				track: {
					display: false,
					values: [],
					labels: [],
					highest: {
						value: 0,
						label: '',
						link: '',
						img: '',
					},
				},
			},
		},
	},
};

interface page {
	initial: string;
	type: string;
	name: string;
	sister: string;
	sister_others: Array<string>;
	subpage: string;
	avatar: string;
	multi: boolean;
	corrected: boolean;
	token: string;
	mobile: boolean;
	platform: string;
	suggest: any;
	restricted: boolean;
	now: {
		next_fetch: Date | null;
		name: HTMLElement | null;
		artist: HTMLElement | null;
		album: HTMLElement | null;
		avatar: string | null;
		active: boolean;
	};
	notifications: {
		next_fetch: Date | null;
		list: Array<any> | null;
	};
	messages: {
		next_fetch: Date | null;
		list: Array<any> | null;
	};
	structure: {
		wrapper: HTMLElement | null;
		container: HTMLElement | null;
		row: HTMLElement | null;
		main: HTMLElement | null;
		side: HTMLElement | null;
		nav: HTMLElement | null;
		content_top: HTMLElement | null;
		glacier: {
			refresh: boolean;
		};
		indicator: HTMLElement | null;
		logs: HTMLElement | null;
	};
	requested: {
		tab: string | null;
	};
	header: any;
	state: {
		replaced_accent?: boolean;
		settings_reload: boolean;
		glacier: {
			insights: {
				artist: glacier_insight;
				album: glacier_insight;
				track: glacier_insight;
			};
		};
		seasons: {
			now: DateTime;
			current: season | null;
			prev: season | null;
			next: season | null;
		};
	};
}

interface glacier_insight {
	display: boolean;
	values: Array<any>;
	labels: Array<string>;
	highest: {
		value: number;
		label: string;
		link: string;
		img: string;
	};
}

export let shout_parse_queue = [];

export const urls = {
	settings: 'bleh',
	setup: 'bleh/setup',
	sponsor: 'bleh/sponsor',
	api: 'bleh/api',
	minis: 'bleh/minis',
	mualani: 'bleh/mualani',
	now: 'bleh/now',
	explore_charts: 'charts/explore',
	geo_charts: 'charts/geo',
};

// WARN: please provide your own if hosting a fork
export const api_key = '85c118b69b1437844fe75fcd2bf27261';

export const discord = 'xU9KxGQpVw';

export let oracle_artists = {};
export let oracle_albums = {};
export let oracle_tracks = {};

export let has_prompted_for_update = {
	state: false,
};

export const random_list = [
	{
		track: 'DIFFERENT DAY',
		album: 'MUSIC - SORRY 4 DA WAIT',
		artist: 'Playboi Carti',
		album_artist: 'Playboi Carti',
	},
	{
		track: 'LUNCH',
		album: 'HIT ME HARD AND SOFT',
		artist: 'Billie Eilish',
		album_artist: 'Billie Eilish',
	},
	{
		track: 'If I Die 2Nite',
		album: 'Me Against The World',
		artist: '2Pac',
		album_artist: '2Pac',
	},
	{
		track: 'Like Him (feat. Lola Young)',
		album: 'CHROMAKOPIA',
		artist: 'Tyler, The Creator',
		album_artist: 'Tyler, The Creator',
	},
	{
		track: 'HYAENA',
		album: 'UTOPIA',
		artist: 'Travis Scott',
		album_artist: 'Travis Scott',
	},
	{
		track: 'Abandon Me',
		album: 'Blush',
		artist: 'Kevin Abstract',
		album_artist: 'Kevin Abstract',
	},
	{
		track: 'Evangelic Girl is a Gun',
		album: 'Evangelic Girl is a Gun',
		artist: 'yeule',
		album_artist: 'yeule',
	},
	{
		track: 'Apple',
		album: 'BRAT',
		artist: 'Charli xcx',
		album_artist: 'Charli xcx',
	},
	{
		track: 'OLYMPIAN',
		album: 'MUSIC',
		artist: 'Playboi Carti',
		album_artist: 'Playboi Carti',
	},
	{
		track: 'SOUTH ATLANTA BABY',
		album: 'MUSIC',
		artist: 'Playboi Carti',
		album_artist: 'Playboi Carti',
	},
	{
		track: 'BLUE',
		album: 'HIT ME HARD AND SOFT',
		artist: 'Billie Eilish',
		album_artist: 'Billie Eilish',
	},
	{
		track: 'THE GREATEST',
		album: 'HIT ME HARD AND SOFT',
		artist: 'Billie Eilish',
		album_artist: 'Billie Eilish',
	},
	{
		track: 'SKELETONS',
		album: 'ASTROWORLD',
		artist: 'Travis Scott',
		album_artist: 'Travis Scott',
	},
	{
		track: 'BUTTERFLY EFFECT',
		album: 'ASTROWORLD',
		artist: 'Travis Scott',
		album_artist: 'Travis Scott',
	},
	{
		track: 'Barbarian',
		album: 'The Party Never Ends 2.0',
		artist: 'Juice WRLD',
		album_artist: 'Juice WRLD',
	},
	{
		track: "Wouldn't Leave",
		album: 'ye',
		artist: 'Kanye West',
		album_artist: 'Kanye West',
	},
	{
		track: 'Bloodhail',
		album: 'Deathconsciousness',
		artist: 'Have A Nice Life',
		album_artist: 'Have A Nice Life',
	},
	{
		track: 'BOOGIE',
		album: 'SATURATION III',
		artist: 'BROCKHAMPTON',
		album_artist: 'BROCKHAMPTON',
	},
	{
		track: 'sdp interlude',
		album: 'Birds In The Trap Sing McKnight',
		artist: 'Travis Scott',
		album_artist: 'Travis Scott',
	},
	{
		track: 'Be Quiet and Drive (Far Away)',
		album: 'Around the Fur',
		artist: 'Deftones',
		album_artist: 'Deftones',
	},
	{
		track: 'Better Times',
		album: 'Teen Dream',
		artist: 'Beach House',
		album_artist: 'Beach House',
	},
	{
		track: 'love hurts',
		album: 'agony',
		artist: 'ilykimchi',
		album_artist: 'ilykimchi',
	},
	{
		track: 'M3 N MIN3',
		album: 'M3 N MIN3',
		artist: 'femtanyl',
		album_artist: 'femtanyl',
	},
	{
		track: 'y.w.d.t.',
		album: 'burger world peace & the endless mediocrity',
		artist: 'ilysm',
		album_artist: 'ilysm',
	},
	{
		track: 'Illegal',
		album: 'Fancy That',
		artist: 'PinkPantheress',
		album_artist: 'PinkPantheress',
	},
	{
		track: 'Ace Trumpets',
		album: 'Ace Trumpets',
		artist: 'Clipse',
		album_artist: 'Clipse',
	},
	{
		track: 'Timeless (feat Playboi Carti)',
		album: 'Hurry Up Tomorrow',
		artist: 'The Weeknd',
		album_artist: 'The Weeknd',
	},
	{
		track: 'tv off (feat. lefty gunplay)',
		album: 'GNX',
		artist: 'Kendrick Lamar',
		album_artist: 'Kendrick Lamar',
	},
	{
		track: 'jeans',
		album: 'jeans',
		artist: '2hollis',
		album_artist: '2hollis',
	},
	{
		track: 'either on or off the drugs',
		album: 'I LAY DOWN MY LIFE FOR YOU',
		artist: 'JPEGMAFIA',
		album_artist: 'JPEGMAFIA',
	},
	{
		track: 'drive ME crazy!',
		album: 'Let’s Start Here.',
		artist: 'Lil Yachty',
		album_artist: 'Lil Yachty',
	},
	{
		track: 'Drugs You Should Try It',
		album: 'DAYS BEFORE RODEO',
		artist: 'Travis Scott',
		album_artist: 'Travis Scott',
	},
	{
		track: 'Fighting My Demons',
		album: 'A Great Chaos',
		artist: 'Ken Carson',
		album_artist: 'Ken Carson',
	},
	{
		track: 'Don’t Smile',
		album: "Short n' Sweet (Deluxe)",
		artist: 'Sabrina Carpenter',
		album_artist: 'Sabrina Carpenter',
	},
	{
		track: 'Espresso',
		album: "Short n' Sweet (Deluxe)",
		artist: 'Sabrina Carpenter',
		album_artist: 'Sabrina Carpenter',
	},
	{
		track: 'only shallow',
		album: 'loveless',
		artist: 'my bloody valentine',
		album_artist: 'my bloody valentine',
	},
	{
		track: 'STILL IN THE PAINT (with LAZER DIM 700 & Bktherula)',
		album: 'KING OF THE MISCHIEVOUS SOUTH',
		artist: 'Denzel Curry',
		album_artist: 'Denzel Curry',
	},
	{
		track: '90210 (feat. Kacy Hill)',
		album: 'Rodeo',
		artist: 'Travis Scott',
		album_artist: 'Travis Scott',
	},
	{
		track: '4X4',
		album: '4X4',
		artist: 'Travis Scott',
		album_artist: 'Travis Scott',
	},
	{
		track: 'Luv (sic)',
		album: 'Luv(sic) Hexalogy',
		artist: 'Nujabes',
		album_artist: 'Nujabes',
	},
	{
		track: 'buy me presents',
		album: 'fruitcake',
		artist: 'Sabrina Carpenter',
		album_artist: 'Sabrina Carpenter',
	},
	{
		track: 'Come into the Water',
		album: 'Be the Cowboy',
		artist: 'Mitski',
		album_artist: 'Mitski',
	},
	{
		track: 'positions',
		album: 'Positions',
		artist: 'Ariana Grande',
		album_artist: 'Ariana Grande',
	},
	{
		track: 'Lie To Girls',
		album: "Short n' Sweet (Deluxe)",
		artist: 'Sabrina Carpenter',
		album_artist: 'Sabrina Carpenter',
	},
	{
		track: 'Loneliness',
		album: 'Dehumanizing Loneliness',
		artist: 'Decalius',
		album_artist: 'Decalius',
	},
	{
		track: 'Till The Angels Come (feat. Freddie Gibbs & Prodigy)',
		album: 'No Idols',
		artist: 'Domo Genesis',
		album_artist: 'Domo Genesis',
	},
	{
		track: 'A Quick One Before the Eternal Worm Devours Connecticut',
		album: 'Deathconsciousness',
		artist: 'Have A Nice Life',
		album_artist: 'Have A Nice Life',
	},
	{
		track: 'Earthmover',
		album: 'Deathconsciousness',
		artist: 'Have A Nice Life',
		album_artist: 'Have A Nice Life',
	},
	{
		track: 'Psychoboost',
		album: 'Revengeseekerz',
		artist: 'Jane Remover',
		album_artist: 'Jane Remover',
	},
	{
		track: 'MOMENTUM (feat. Ilykimchi)',
		album: 'F*CK U SKRILLEX YOU THINK UR ANDY WARHOL BUT UR NOT!! <3',
		artist: 'Skrillex',
		album_artist: 'Skrillex',
	},
	{
		track: 'Gnarly',
		album: 'Gnarly',
		artist: 'KATSEYE',
		album_artist: 'KATSEYE',
	},
	{
		track: 'Knees',
		album: 'By the Time I Get to Phoenix',
		artist: 'Injury Reserve',
		album_artist: 'Injury Reserve',
	},
	{
		track: 'Fear, Sex',
		album: 'Imaginal Disk',
		artist: 'Magdalena Bay',
		album_artist: 'Magdalena Bay',
	},
	{
		track: 'Wildflower',
		album: 'Depression Cherry',
		artist: 'Beach House',
		album_artist: 'Beach House',
	},
	{
		track: 'JRJRJR',
		album: 'Revengeseekerz',
		artist: 'Jane Remover',
		album_artist: 'Jane Remover',
	},
	{
		track: 'ha',
		album: 'burger world peace & the endless mediocrity',
		artist: 'ilysm',
		album_artist: 'ilysm',
	},
	{
		track: 'Red Light',
		album: 'Blush',
		artist: 'Kevin Abstract',
		album_artist: 'Kevin Abstract',
	},
	{
		track: 'Alive',
		album: 'Alive',
		artist: 'Ari Abdul',
		album_artist: 'Ari Abdul',
	},
	{
		track: 'WHILE YOU WERE SLEEPING VIP',
		album: 'F*CK U SKRILLEX YOU THINK UR ANDY WARHOL BUT UR NOT!! <3',
		artist: 'Skrillex',
		album_artist: 'Skrillex',
	},
	{
		track: 'BURN',
		album: 'BURN',
		artist: 'Starr Adara',
		album_artist: 'Starr Adara',
	},
	{
		track: '100 Bad (feat. Charli XCX) (Charli XCX Remix)',
		album: 'Tommy Genesis',
		artist: 'Tommy Genesis',
		album_artist: 'Tommy Genesis',
	},
	{
		track: 'DISCO (FT. TOMMY GENESIS)',
		album: 'AFTERCARE',
		artist: 'Nessa Barrett',
		album_artist: 'Nessa Barrett',
	},
	{
		track: 'SOMEBODY LOVES ME',
		album: '$ome $exy $ongs 4 U',
		artist: 'PARTYNEXTDOOR',
		album_artist: 'PARTYNEXTDOOR',
	},
	{
		track: 'phobie d’impulsion',
		album: 'a bit of a mad one',
		artist: 'glaive',
		album_artist: 'glaive',
	},
	{
		track: 'GODSTAINED',
		album: 'GODSTAINED',
		artist: 'Quadeca',
		album_artist: 'Quadeca',
	},
	{
		track: 'ゆきこさん',
		album: 'あらためまして、はじめまして、ミドリです。',
		artist: 'ミドリ',
		album_artist: 'ミドリ',
	},
	{
		track: 'Dsco',
		album: 'Velocity: Design: Comfort.',
		artist: 'Sweet Trip',
		album_artist: 'Sweet Trip',
	},
	{
		track: 'Everything is romantic',
		album: 'BRAT',
		artist: 'Charli xcx',
		album_artist: 'Charli xcx',
	},
	{
		track: 'White Ceiling',
		album: 'To See the Next Part of the Dream',
		artist: 'Parannoul',
		album_artist: 'Parannoul',
	},
	{
		track: 'SEX',
		album: 'ROADRUNNER: NEW LIGHT, NEW MACHINE PLUS PACK',
		artist: 'BROCKHAMPTON',
		album_artist: 'BROCKHAMPTON',
	},
	{
		track: 'all-american bitch',
		album: 'GUTS',
		artist: 'Olivia Rodrigo',
		album_artist: 'Olivia Rodrigo',
	},
	{
		track: 'The Ballad of Matt & Mica',
		album: 'Imaginal Disk',
		artist: 'Magdalena Bay',
		album_artist: 'Magdalena Bay',
	},
	{
		track: 'Real Man',
		album: 'This Is How Tomorrow Moves',
		artist: 'beabadoobee',
		album_artist: 'beabadoobee',
	},
	{
		track: 'cyber meat',
		album: 'softscars',
		artist: 'yeule',
		album_artist: 'yeule',
	},
	{
		track: 'From The Start',
		album: 'Bewitched',
		artist: 'Laufey',
		album_artist: 'Laufey',
	},
	{
		track: 'SUGAR (Remix) [feat. Dua Lipa]',
		album: 'SUGAR (Remix) [feat. Dua Lipa]',
		artist: 'BROCKHAMPTON',
		album_artist: 'BROCKHAMPTON',
	},
	{
		track: 'PROM/KING',
		album: 'CARE FOR ME',
		artist: 'Saba',
		album_artist: 'Saba',
	},
	{
		track: 'BUSY/SIRENS',
		album: 'CARE FOR ME',
		artist: 'Saba',
		album_artist: 'Saba',
	},
	{
		track: 'Peppers (feat. Tommy Genesis)',
		album: "Did you know that there's a tunnel under Ocean Blvd",
		artist: 'Lana Del Rey',
		album_artist: 'Lana Del Rey',
	},
	{
		track: 'make you mine',
		album: 'make you mine',
		artist: 'Madison Beer',
		album_artist: 'Madison Beer',
	},
	{
		track: 'Duvet',
		album: 'Twilight',
		artist: 'bôa',
		album_artist: 'bôa',
	},
	{
		track: 'Brand New City',
		album: 'Lush',
		artist: 'Mitski',
		album_artist: 'Mitski',
	},
	{
		track: 'Two Girls Kissing',
		album:
			'They Spent Their Wild Youthful Days In The Glittering World Of The Salons',
		artist: 'Swirlies',
		album_artist: 'Swirlies',
	},
	{
		track: 'Geyser',
		album: 'Be the Cowboy',
		artist: 'Mitski',
		album_artist: 'Mitski',
	},
	{
		track: 'My Love Mine All Mine',
		album: 'The Land Is Inhospitable and So Are We',
		artist: 'Mitski',
		album_artist: 'Mitski',
	},
	{
		track: 'PHANTASM',
		album: 'AND THEY MINE FOR OUR BODIES',
		artist: 'Gao the Arsonist',
		album_artist: 'Gao the Arsonist',
	},
	{
		track: 'DO AS I SAY',
		album: 'AND THEY MINE FOR OUR BODIES',
		artist: 'Gao the Arsonist',
		album_artist: 'Gao the Arsonist',
	},
	{
		track: 'the prom',
		album: 'i care so much that i dont care at all',
		artist: 'glaive',
		album_artist: 'glaive',
	},
	{
		track: 'On Sight',
		album: 'Yeezus',
		artist: 'Kanye West',
		album_artist: 'Kanye West',
	},
	{
		track: 'If I Let Him In',
		album: '...Is Doomed',
		artist: 'Black Wing',
		album_artist: 'Black Wing',
	},
	{
		track: 'x w x',
		album: 'softscars',
		artist: 'yeule',
		album_artist: 'yeule',
	},
	{
		track: 'Natural Habitat (feat. Ken Carson)',
		album: 'Natural Habitat',
		artist: '070 Shake',
		album_artist: '070 Shake',
	},
	{
		track: 'cbd',
		album: 'hypochondriac',
		artist: 'brakence',
		album_artist: 'brakence',
	},
	{
		track: '(March 19th 1983) It Was Probably Green',
		album: 'Songs About Leaving',
		artist: "Carissa's Wierd",
		album_artist: "Carissa's Wierd",
	},
	{
		track: 'clairbourne practice',
		album: 'clairbourne practice',
		artist: 'julie',
		album_artist: 'julie',
	},
	{
		track: 'feminine adornments',
		album: 'my anti-aircraft friend',
		artist: 'julie',
		album_artist: 'julie',
	},
	{
		track: 'Image',
		album: 'Imaginal Disk',
		artist: 'Magdalena Bay',
		album_artist: 'Magdalena Bay',
	},
	{
		track: 'Spectral Bride',
		album: 'Giles Corey',
		artist: 'Giles Corey',
		album_artist: 'Giles Corey',
	},
	{
		track: 'if u love me now then shoot to kill',
		album: 'ovine hall',
		artist: 'ovine hall',
		album_artist: 'ovine hall',
	},
	{
		track: 'Blackest Bile',
		album: 'Giles Corey',
		artist: 'Giles Corey',
		album_artist: 'Giles Corey',
	},
	{
		track: 'very little effort',
		album: 'my anti-aircraft friend',
		artist: 'julie',
		album_artist: 'julie',
	},
	{
		track: 'skipping tiles',
		album: 'pushing daisies',
		artist: 'julie',
		album_artist: 'julie',
	},
	{
		track: 'through your window',
		album: 'pg.4 a picture of three hedges/through your window',
		artist: 'julie',
		album_artist: 'julie',
	},
	{
		track: 'COLE PIMP (with Ty Dolla $ign & Juicy J)',
		album: 'KING OF THE MISCHIEVOUS SOUTH',
		artist: 'Denzel Curry',
		album_artist: 'Denzel Curry',
	},
	{
		track: 'I THINK',
		album: 'IGOR',
		artist: 'Tyler, The Creator',
		album_artist: 'Tyler, The Creator',
	},
	{
		track: 'Only',
		album: 'Lahai',
		artist: 'Sampha',
		album_artist: 'Sampha',
	},
	{
		track: 'Together',
		album: 'Fake It Flowers',
		artist: 'beabadoobee',
		album_artist: 'beabadoobee',
	},
	{
		track: 'Old money bitch',
		album: 'Wallsocket',
		artist: 'underscores',
		album_artist: 'underscores',
	},
	{
		track: 'Pandora',
		album: 'Pandora',
		artist: 'Wisp',
		album_artist: 'Wisp',
	},
	{
		track: 'Novacane',
		album: 'Novacane',
		artist: 'Frank Ocean',
		album_artist: 'Frank Ocean',
	},
	{
		track: 'Bulls on Parade - triple j Like A Version',
		album: 'Bulls on Parade (triple j Like A Version)',
		artist: 'Denzel Curry',
		album_artist: 'Denzel Curry',
	},
	{
		track: 'runway talk',
		album: 'DOG',
		artist: 'Kahlil Blu',
		album_artist: 'Kahlil Blu',
	},
	{
		track: "01'beigecamry",
		album: 'Farley',
		artist: 'Sideshow',
		album_artist: 'Sideshow',
	},
	{
		track: 'Puff Daddy',
		album: 'Puff Daddy',
		artist: 'JPEGMAFIA',
		album_artist: 'JPEGMAFIA',
	},
	{
		track: 'wonder 2',
		album: 'm b v',
		artist: 'my bloody valentine',
		album_artist: 'my bloody valentine',
	},
	{
		track: 'Second hand embarrassment',
		album: 'fishmonger',
		artist: 'underscores',
		album_artist: 'underscores',
	},
	{
		track: 'Let It Happen',
		album: 'Currents',
		artist: 'Tame Impala',
		album_artist: 'Tame Impala',
	},
	{
		track: 'TERRIBLE EXCELLENCE (feat. Yung Lean)',
		album: 'Cold Visions',
		artist: 'Bladee',
		album_artist: 'Bladee',
	},
	{
		track: 'Christmas In Harlem',
		album: 'Christmas In Harlem',
		artist: 'Kanye West',
		album_artist: 'Kanye West',
	},
	{
		track: 'E. Coli (feat. Earl Sweatshirt)',
		album: 'Bread',
		artist: 'The Alchemist',
		album_artist: 'The Alchemist',
	},
	{
		track: 'How To Build A Relationship',
		album: 'Hi This Is Flume (Mixtape)',
		artist: 'Flume',
		album_artist: 'Flume',
	},
	{
		track: 'Never Catch Me',
		album: "You're Dead!",
		artist: 'Flying Lotus',
		album_artist: 'Flying Lotus',
	},
	{
		track: 'Take A Bite',
		album: 'This Is How Tomorrow Moves',
		artist: 'beabadoobee',
		album_artist: 'beabadoobee',
	},
	{
		track: 'Slow Dance',
		album: 'Charm',
		artist: 'Clairo',
		album_artist: 'Clairo',
	},
	{
		track: 'BALD!',
		album: 'EP!',
		artist: 'JPEGMAFIA',
		album_artist: 'JPEGMAFIA',
	},
	{
		track: 'Seigfried',
		album: 'Blonde',
		artist: 'Frank Ocean',
		album_artist: 'Frank Ocean',
	},
	{
		track: 'Girls Just Want to Have Fun',
		album: 'Crest',
		artist: 'Bladee',
		album_artist: 'Bladee',
	},
	{
		track: "Wesley's Theory",
		album: 'To Pimp A Butterfly',
		artist: 'Kendrick Lamar',
		album_artist: 'Kendrick Lamar',
	},
	{
		track: 'Talk',
		album: 'Beatopia',
		artist: 'beabadoobee',
		album_artist: 'beabadoobee',
	},
	{
		track: 'I Used to Love Him (feat. Mary J. Blige)',
		album: 'The Miseducation of Lauryn Hill',
		artist: 'Ms. Lauryn Hill',
		album_artist: 'Ms. Lauryn Hill',
	},
	{
		track: 'vpn',
		album: 'volcanic bird enemy and the voiced concern',
		artist: 'Lil Ugly Mane',
		album_artist: 'Lil Ugly Mane',
	},
	{
		track: 'only tomorrow',
		album: 'm b v',
		artist: 'my bloody valentine',
		album_artist: 'my bloody valentine',
	},
	{
		track: 'WHAT A DAY',
		album: 'CALL ME IF YOU GET LOST: The Estate Sale',
		artist: 'Tyler, The Creator',
		album_artist: 'Tyler, The Creator',
	},
	{
		track: 'untitled 08 | 09.06.2014.',
		album: 'untitled unmastered.',
		artist: 'Kendrick Lamar',
		album_artist: 'Kendrick Lamar',
	},
	{
		track: 'Beautiful World',
		album: 'To See the Next Part of the Dream',
		artist: 'Parannoul',
		album_artist: 'Parannoul',
	},
	{
		track: 'Excuse',
		album: 'To See the Next Part of the Dream',
		artist: 'Parannoul',
		album_artist: 'Parannoul',
	},
	{
		track: 'Chanel',
		album: 'Chanel',
		artist: 'Frank Ocean',
		album_artist: 'Frank Ocean',
	},
	{
		track: 'Punk Weight',
		album: 'The Money Store',
		artist: 'Death Grips',
		album_artist: 'Death Grips',
	},
	{
		track: 'Maybe Somewhere',
		album: 'Sky Hundred',
		artist: 'Parannoul',
		album_artist: 'Parannoul',
	},
	{
		track: 'i will follow you into the dark - Spotify Singles',
		album: 'Spotify Singles',
		artist: 'glaive',
		album_artist: 'glaive',
	},
	{
		track: 'DUSTCUTTER',
		album: 'SCRAPYARD',
		artist: 'Quadeca',
		album_artist: 'Quadeca',
	},
	{
		track: 'HIGHJACK',
		album: 'HIGHJACK',
		artist: 'A$AP Rocky',
		album_artist: 'A$AP Rocky',
	},
	{
		track: 'You Got Me',
		album: 'Things Fall Apart',
		artist: 'The Roots',
		album_artist: 'The Roots',
	},
	{
		track: "Gotta Touch 'Em - (Pt. 2)",
		album: 'Mystic Stylez',
		artist: 'Three 6 Mafia',
		album_artist: 'Three 6 Mafia',
	},
	{
		track: "J'OUVERT",
		album: 'iridescence',
		artist: 'BROCKHAMPTON',
		album_artist: 'BROCKHAMPTON',
	},
	{
		track: 'Upper Echelon (feat. T.I. & 2 Chainz)',
		album: 'Upper Echelon (feat. T.I. & 2 Chainz)',
		artist: 'Travis Scott',
		album_artist: 'Travis Scott',
	},
	{
		track: 'Outta Control',
		album: 'Outta Control',
		artist: 'Fat Joe',
		album_artist: 'Fat Joe',
	},
	{
		track: 'TEXAS BLUE',
		album: 'SCRAPYARD',
		artist: 'Quadeca',
		album_artist: 'Quadeca',
	},
	{
		track: 'Luv (sic.) pt3 (feat. Shing02)',
		album: 'Luv(sic) Hexalogy',
		artist: 'Nujabes',
		album_artist: 'Nujabes',
	},
	{
		track: 'Luv (sic) pt5 (feat. Shing02)',
		album: 'Luv(sic) Hexalogy',
		artist: 'Nujabes',
		album_artist: 'Nujabes',
	},
	{
		track: 'Me And My Bitch',
		album: 'No Idols',
		artist: 'Domo Genesis',
		album_artist: 'Domo Genesis',
	},
	{
		track: 'Lean Beef Patty',
		album: 'SCARING THE HOES',
		artist: 'JPEGMAFIA',
		album_artist: 'JPEGMAFIA',
	},
	{
		track: 'Blue Suede',
		album: 'Hell Can Wait',
		artist: 'Vince Staples',
		album_artist: 'Vince Staples',
	},
	{
		track: 'u',
		album: 'To Pimp A Butterfly',
		artist: 'Kendrick Lamar',
		album_artist: 'Kendrick Lamar',
	},
	{
		track: 'Sandman',
		album: 'LIVE.LOVE.A$AP',
		artist: 'A$AP Rocky',
		album_artist: 'A$AP Rocky',
	},
	{
		track: 'Love Is Everywhere',
		album: 'Imaginal Disk',
		artist: 'Magdalena Bay',
		album_artist: 'Magdalena Bay',
	},
	{
		track: 'Give You the World',
		album: 'Gemini Rights',
		artist: 'Steve Lacy',
		album_artist: 'Steve Lacy',
	},
	{
		track: 'Stoned',
		album: 'Balloonerism',
		artist: 'Mac Miller',
		album_artist: 'Mac Miller',
	},
	{
		track: 'Blow Out',
		album: 'Pablo Honey',
		artist: 'Radiohead',
		album_artist: 'Radiohead',
	},
	{
		track: 'Motion Picture Soundtrack',
		album: 'Kid A',
		artist: 'Radiohead',
		album_artist: 'Radiohead',
	},
	{
		track: 'March Madness',
		album: '56 Nights',
		artist: 'Future',
		album_artist: 'Future',
	},
	{
		track: 'FORCE OF HABIT',
		album: 'BOY ANONYMOUS',
		artist: 'Paris Texas',
		album_artist: 'Paris Texas',
	},
	{
		track: 'the BLACK seminole.',
		album: 'Let’s Start Here.',
		artist: 'Lil Yachty',
		album_artist: 'Lil Yachty',
	},
	{
		track: 'No More Parties In LA',
		album: 'The Life Of Pablo',
		artist: 'Kanye West',
		album_artist: 'Kanye West',
	},
	{
		track: 'Devil In A New Dress',
		album: 'My Beautiful Dark Twisted Fantasy',
		artist: 'Kanye West',
		album_artist: 'Kanye West',
	},
	{
		track: 'Life Of The Party (with André 3000)',
		album: 'Donda (Deluxe)',
		artist: 'Kanye West',
		album_artist: 'Kanye West',
	},
	{
		track: 'Location',
		album: 'Playboi Carti',
		artist: 'Playboi Carti',
		album_artist: 'Playboi Carti',
	},
	{
		track: 'Long Time - Intro',
		album: 'Die Lit',
		artist: 'Playboi Carti',
		album_artist: 'Playboi Carti',
	},
	{
		track: 'Doves In The Wind (feat. Kendrick Lamar)',
		album: 'Ctrl',
		artist: 'SZA',
		album_artist: 'SZA',
	},
	{
		track: 'Low Life (feat. The Weeknd)',
		album: 'EVOL',
		artist: 'Future',
		album_artist: 'Future',
	},
	{
		track: 'Samurai',
		album: 'Samurai',
		artist: 'Lupe Fiasco',
		album_artist: 'Lupe Fiasco',
	},
	{
		track: 'Cake',
		album: 'Samurai',
		artist: 'Lupe Fiasco',
		album_artist: 'Lupe Fiasco',
	},
	{
		track: '745',
		album: 'Big Fish Theory',
		artist: 'Vince Staples',
		album_artist: 'Vince Staples',
	},
	{
		track: 'Stories In Pyjamas',
		album: 'Stories In Pyjamas',
		artist: 'Kofi Stone',
		album_artist: 'Kofi Stone',
	},
	{
		track: 'Prophecy',
		album: 'No Idols',
		artist: 'Domo Genesis',
		album_artist: 'Domo Genesis',
	},
	{
		track: 'the ride-',
		album: 'Let’s Start Here.',
		artist: 'Lil Yachty',
		album_artist: 'Lil Yachty',
	},
	{
		track: 'Same Old',
		album: 'Nobody Cares Till Everybody Does',
		artist: 'Kofi Stone',
		album_artist: 'Kofi Stone',
	},
	{
		track: 'BURN',
		album: 'VULTURES 1',
		artist: '¥$',
		album_artist: '¥$',
	},
	{
		track: 'BLACK METAL TERRORIST | 13 M T',
		album: 'TA13OO',
		artist: 'Denzel Curry',
		album_artist: 'Denzel Curry',
	},
	{
		track: 'Bruuuh (with Denzel Curry) - Remix',
		album: 'Bruuuh (with Denzel Curry) [Remix]',
		artist: 'JID',
		album_artist: 'JID',
	},
	{
		track: 'Addiction',
		album: 'Late Registration',
		artist: 'Kanye West',
		album_artist: 'Kanye West',
	},
	{
		track: 'Fell In Luv (feat. Bryson Tiller)',
		album: 'Die Lit',
		artist: 'Playboi Carti',
		album_artist: 'Playboi Carti',
	},
	{
		track: 'Runaway',
		album: 'My Beautiful Dark Twisted Fantasy',
		artist: 'Kanye West',
		album_artist: 'Kanye West',
	},
	{
		track: 'Stateside',
		album: 'Fancy That',
		artist: 'PinkPantheress',
		album_artist: 'PinkPantheress',
	},
	{
		track: 'Raindrops (Insane) [with Travis Scott]',
		album: 'HEROES & VILLAINS',
		artist: 'Metro Boomin',
		album_artist: 'Metro Boomin',
	},
	{
		track: 'Niagara Falls (Foot or 2) [with Travis Scott & 21 Savage]',
		album: 'HEROES & VILLAINS',
		artist: 'Metro Boomin',
		album_artist: 'Metro Boomin',
	},
	{
		track: 'オレンジ',
		album: 'オレンジ',
		artist:
			'逢坂大河・櫛枝実乃梨・川嶋亜美(釘宮理恵、堀江由衣、喜多村英梨)',
		album_artist:
			'逢坂大河・櫛枝実乃梨・川嶋亜美（CV：釘宮理恵・堀江由衣・喜多村英梨）',
	},
	{
		track: 'Just Wanna Rock',
		album: 'Pink Tape',
		artist: 'Lil Uzi Vert',
		album_artist: 'Lil Uzi Vert',
	},
	{
		track: 'OVERLY',
		album: 'MUSIC',
		artist: 'Playboi Carti',
		album_artist: 'Playboi Carti',
	},
	{
		track: 'Add Up My Love',
		album: 'Charm',
		artist: 'Clairo',
		album_artist: 'Clairo',
	},
	{
		track: '60.000 ISK',
		album: 'May It Never Falter',
		artist: 'glaive',
		album_artist: 'glaive',
	},
	{
		track: '7 rings',
		album: 'thank u, next',
		artist: 'Ariana Grande',
		album_artist: 'Ariana Grande',
	},
	{
		track: 'yes, and?',
		album: 'eternal sunshine',
		artist: 'Ariana Grande',
		album_artist: 'Ariana Grande',
	},
	{
		track: '34+35',
		album: 'Positions',
		artist: 'Ariana Grande',
		album_artist: 'Ariana Grande',
	},
	{
		track: 'bugging!',
		album: 'hypochondriac',
		artist: 'brakence',
		album_artist: 'brakence',
	},
	{
		track: 'Dancing With Our Hands Tied',
		album: 'reputation',
		artist: 'Taylor Swift',
		album_artist: 'Taylor Swift',
	},
	{
		track: 'Sexy to Someone',
		album: 'Charm',
		artist: 'Clairo',
		album_artist: 'Clairo',
	},
	{
		track: 'WAY TOO MANY FRIENDS',
		album: 'SCRAPYARD',
		artist: 'Quadeca',
		album_artist: 'Quadeca',
	},
	{
		track: 'Thunder',
		album: 'Evolve',
		artist: 'Imagine Dragons',
		album_artist: 'Imagine Dragons',
	},
	{
		track: 'Pagan Poetry',
		album: 'Vespertine',
		artist: 'Björk',
		album_artist: 'Björk',
	},
	{
		track: 'Guide light',
		album: 'If Not Winter',
		artist: 'Wisp',
		album_artist: 'Wisp',
	},
	{
		track: 'Mesmerized',
		album: 'If Not Winter',
		artist: 'Wisp',
		album_artist: 'Wisp',
	},
	{
		track: 'Serpentine',
		album: 'If Not Winter',
		artist: 'Wisp',
		album_artist: 'Wisp',
	},
	{
		track: 'WHERE WAS YOU',
		album: 'JACKBOYS 2',
		artist: 'Travis Scott',
		album_artist: 'JACKBOYS',
	},
	{
		track: 'SHYNE',
		album: 'JACKBOYS 2',
		artist: 'Travis Scott',
		album_artist: 'JACKBOYS',
	},
	{
		track: 'Terrapin',
		album: 'Charm',
		artist: 'Clairo',
		album_artist: 'Clairo',
	},
	{
		track: 'Juna',
		album: 'Charm',
		artist: 'Clairo',
		album_artist: 'Clairo',
	},
	{
		track: 'Pier 4',
		album: 'Charm',
		artist: 'Clairo',
		album_artist: 'Clairo',
	},
	{
		track: "EVERYTHING I'VE EVER WANTED",
		album: 'HALO',
		artist: 'Tiffany Day',
		album_artist: 'Tiffany Day',
	},
	{
		track: 'PRETTY4U',
		album: 'HALO',
		artist: 'Tiffany Day',
		album_artist: 'Tiffany Day',
	},
	{
		track: 'LOOK UP',
		album: 'HALO',
		artist: 'Tiffany Day',
		album_artist: 'Tiffany Day',
	},
	{
		track: 'AMERICAN GIRL',
		album: 'HALO',
		artist: 'Tiffany Day',
		album_artist: 'Tiffany Day',
	},
	{
		track: 'São Paulo (feat. Anitta)',
		album: 'Hurry Up Tomorrow',
		artist: 'The Weeknd',
		album_artist: 'The Weeknd',
	},
	{
		track: 'The Abyss (feat. Lana Del Rey)',
		album: 'Hurry Up Tomorrow',
		artist: 'The Weeknd',
		album_artist: 'The Weeknd',
	},
	{
		track: 'switch my swag',
		album: 'AVANT NOVA',
		artist: 'slayr',
		album_artist: 'slayr',
	},
	{
		track: 'CONSTANTLY',
		album: 'CONSTANTLY',
		artist: 'Tiffany Day',
		album_artist: 'Tiffany Day',
	},
	{
		track: 'Sloppy Joe',
		album: 'Half Blood',
		artist: 'slayr',
		album_artist: 'slayr',
	},
	{
		track: 'Power 4',
		album: 'Half Blood',
		artist: 'slayr',
		album_artist: 'slayr',
	},
	{
		track: 'Asheville',
		album: 'Y’all',
		artist: 'glaive',
		album_artist: 'glaive',
	},
	{
		track: 'Modafinil',
		album: 'Y’all',
		artist: 'glaive',
		album_artist: 'glaive',
	},
	{
		track: 'Nouveau Riche',
		album: 'Y’all',
		artist: 'glaive',
		album_artist: 'glaive',
	},
	{
		track: "Let's Link Up and Die",
		album: 'God Save The Three',
		artist: 'glaive',
		album_artist: 'glaive',
	},
	{
		track: 'The Troubles',
		album: 'God Save The Three',
		artist: 'glaive',
		album_artist: 'glaive',
	},
	{
		track: 'UNCA / Composure',
		album: 'God Save The Three',
		artist: 'glaive',
		album_artist: 'glaive',
	},
	{
		track: 'Yaya Touré',
		album: 'God Save The Three',
		artist: 'glaive',
		album_artist: 'glaive',
	},
	{
		track: '505',
		album: 'Favourite Worst Nightmare',
		artist: 'Arctic Monkeys',
		album_artist: 'Arctic Monkeys',
	},
	{
		track: 'Only Ones Who Know',
		album: 'Favourite Worst Nightmare',
		artist: 'Arctic Monkeys',
		album_artist: 'Arctic Monkeys',
	},
	{
		track: 'Balaclava',
		album: 'Favourite Worst Nightmare',
		artist: 'Arctic Monkeys',
		album_artist: 'Arctic Monkeys',
	},
	{
		track: 'Innuendo (I Get U)',
		album: 'U',
		artist: 'underscores',
		album_artist: 'underscores',
	},
	{
		track: 'Hollywood Forever',
		album: 'U',
		artist: 'underscores',
		album_artist: 'underscores',
	},
	{
		track: 'when you sleep',
		album: 'loveless',
		artist: 'my bloody valentine',
		album_artist: 'my bloody valentine',
	},
	{
		track: 'i only said',
		album: 'loveless',
		artist: 'my bloody valentine',
		album_artist: 'my bloody valentine',
	},
];

export const gendered_pattern = /^(female|male|nonbinary) vocalists?$/i;
