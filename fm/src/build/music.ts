/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { name_includes } from '@/components/music/lotus';

export const artist_corrections: Record<string, string> = {};
export const album_track_corrections: album_track_corrections = {
	version: '',
};
export const combined_artists: Record<string, string> = {};

type album_track_corrections = {
	version: string;
	[k: string]: string | Record<string, string>;
};

export const ranks = [
	{
		start: 100_000,
		hue: 261,
		sat: 2.54,
		lit: 0,
	},
	{
		start: 60_000,
		hue: 261,
		sat: 2.54,
		lit: 0.42,
	},
	{
		start: 40_000,
		hue: 278,
		sat: 3.07,
		lit: 0.65,
	},
	{
		start: 32_000,
		hue: 279,
		sat: 1.91,
		lit: 0.71,
	},
	{
		start: 22_000,
		hue: 356,
		sat: 2.1,
		lit: 0.8,
	},
	{
		start: 13_000,
		hue: 18,
		sat: 2.06,
		lit: 0.85,
	},
	{
		start: 8_000,
		hue: 42,
		sat: 1.51,
		lit: 0.95,
	},
	{
		start: 5_500,
		hue: 105,
		sat: 1.42,
		lit: 1.1,
	},
	{
		start: 3_500,
		hue: 135,
		sat: 2.23,
		lit: 1.1,
	},
	{
		start: 2_000,
		hue: 161,
		sat: 1.8,
		lit: 1.04,
	},
	{
		start: 1_000,
		hue: 232,
		sat: 1.48,
		lit: 1.15,
	},
	{
		start: 0,
		hue: 258,
		sat: 1.91,
		lit: 1.15,
	},
];

export let includes = {
	guests: [
		/\sfeat\s/i,
		/\sfeat\./i,
		/\sfeaturing\s/i,
		/(?:-\s?|\(|\[|\{)feat/i,
		/(?:-\s?|\(|\[|\{)with /i,
		/w\/\s/i,
		/ft\./i,
		/ref\./i,
		/\(hosted by/i,
		/\(re:/i, // re this is why paramore
	],
	versions: [
		/(?:-\s?|\(|\[)taylor/i,
		/[-\(]spotify singles/i,
		/\(\+/i,
		/(?:-\s?|\(|\[)versão/i,
		/(?:-\s?|\(|\[)without dialogue/i,
		/(?:-\s?|\(|\[)no dialogue/i,
		/(?:-\s?|\(|\[)new version/i,
		/(?:-\s?|\(|\[)pop version/i,
		/(?:-\s?|\(|\[)rock version/i,
		/(?:-\s?|\(|\[)pop mix/i,
		/(?:-\s?|\(|\[)emo version/i,
		/(?:-\s?|\(|\[)version/i,
		/\(s\.a\.d\. version/i,
		'- s.a.d.',
		/[-\(]vocoded/i,
		/(?:-\s?|\(|\[)pa version/i,
		/(?:-\s?|\(|\[)u\.s\. pa version/i,
		/(?:-\s?|\(|\[)jam-along version/i,
		/(?:-\s?|\(|\[)non-lp version/i,
		/(?:-\s?|\(|\[)main/i,
	],
	remasters: [
		/(?:-\s?|\(|\[)remaster/i,
		/:\s?high resolution remasters/i,
		/[-\(]high resolution remasters/i,
		/:\s?the high resolution remasters/i,
		/[-\(]the high resolution remasters/i, // Pink Floyd bootleg remaster boxsets
		/[-\(]2012 - remaster/i, // black sabbath
	],
	mixes: [
		/[-\(]devonshire mix/i,
		'mike dean master',
		/(?:-\s?|\(|\[)remix/i,
		'-reloaded-', // deco*27
		/(?:-\s?|\(|\[)reloaded/i,
		/\(best friend remix/i, // deco*27
		/(?:-\s?|\(|\[)live/i,
		/:\s?the live/i,
		/\(\s?the live/i,
		/[-\(]the live/i,
		/[-\(]online live/i,
		/\sonline live/i,
		/(?:-\s?|\(|\[)ao vivo/i,
		/(?:-\s?|\(|\[)en vivo/i,
		/(?:-\s?|\(|\[)multishow ao vivo/i,
		/(?:-\s?|\(|\[)demo/i,
		/(?:-\s?|\(|\[)early demo/i,
		/(?:-\s?|\(|\[)early version/i,
		/[-\(]rehearsal/i,
		/(?:-\s?|\(|\[)sample clearance/i,
		/[-\(]home demo/i,
		/[-\(]solo acoustic/i,
		/(?:-\s?|\(|\[)acoustic/i,
		/(?:-\s?|\(|\[)piano ver/i,
		/:\s?self-serenade/i,
		/[-\(]self-serenade/i,
		/(?:-\s?|\(|\[)alt/i,
		/(?:-\s?|\(|\[)chopped/i,
		'(kate',
		'(asmr',
		'(agressive',
		'(aggressive',
		'brazilian phonk', // lol
		/(?:-\s?|\(|\[)sped up/i,
		/(?:-\s?|\(|\[)slow/i,
		/(?:-\s?|\(|\[)nightcore/i,
		'a. g. cook remix',
		'- charli xcx & a.g. cook remix',
		'- rina sawayama & clarence clarity remix',
		'- bree runway & jimmy edgar remix',
		'- chester lockhart, mood killer & lil texas remix',
		'- shygirl & mura masa remix',
		'- coucou chloe remix', // https://www.last.fm/music/+noredirect/lady+gaga/dawn+of+chromatica
		'(george daniel & charli xcx remix',
		'- george daniel & charli xcx remix',
		/(?:-\s?|\(|\[)trippie mix/i,
		/(?:-\s?|\(|\[)single mix/i,
		/(?:-\s?|\(|\[)bunnsington mix/i, // MCR5 fan mix

		// simple remixes
		new RegExp(
			'(?:-\\s|[\\(\\[])(?:' +
				// artists
				'starsmith|gesaffelstein|elvira|bloodpop®?|r3hab|' +
				'sawyr and ryan tedder|seed|clean bandit|first dance|' +
				'digital dog|csi|fat max g|roosevelt|kungs|jayda g|' +
				'illenium|felix jaehn|tensnake|snakehips|jungle|' +
				'lp giobbi|blond:ish|cults|dombresky|astronomyy|' +
				'sofi tukker|troyboi|foster the people|dutch uncles|' +
				'kye kye|smash mode|blackbear|goldhouse|cautious clay|' +
				'jerry folk|aire atlantica|marian hill|the motion retrowave|' +
				'dj kk|kyle shearer|rostam|chromeo|flume|fffrrannno|' +
				'el-p|ryan hemsworth|end of the world|salute interstellar|' +
				'seiho|bree runway|chus & ceballos|axwell|archigram|' +
				'dance club|flying lotus|sports bar|doss|pabllo vittar|' +
				'ashnikko|arca|dorian electra|planningtorock|lsdxoxo|' +
				'coucou chloe|george daniel|jacques lu cont|sasha twilo|' +
				'flying lotus|chris lord-alge|cla|4b|sikdope|carnage|autolaser|' +
				// descriptors
				'club 69 speed|the color|meltdown|underground|ihs|' +
				'classic club|naughty main|' +
				'og|rough|sports bar|new|short|dance club|electronic|' +
				'tv|tvd|the ultimate|' +
				'the' +
				')\\s+(?:remix|mix)\\b',
			'i',
		),

		new RegExp(
			'(?:-\\s|[\\(\\[])(?:' +
				// album
				'album version|album edition|us album version|uk album version|' +
				'u\\.s\\. version|u\\.s\\. remix|' +
				// languages
				'english version|japanese version|spanish version|english cover|french ver|' +
				// media
				'soundtrack|the original movie soundtrack|twilight soundtrack version|' +
				'transformers soundtrack version|babygirl original soundtrack|' +
				// edits
				'tv size|cut ver|short version|short edit|long version|' +
				'full length|non-stop|old timey|' +
				'club edit|rain|' +
				// special
				'the witch collection|dancing witch version|lonely witch version|' +
				'moonlit witch version|cabin in candlelight version|' +
				'haus labs version|twerk version|' +
				// info
				'esher|first|hummed|second|songwriting|strings|widescreen|' +
				'take|unnumbered|vocal|without|' +
				// format
				'mono|stereo|' +
				// type
				'anime|game edit|' +
				// misc.
				'official|offline|radio|orchestra|self-titled demo|' +
				'j stax radio|triple j' +
				')\\b',
			'i',
		),

		/[-\(]quiet storm demo/i,
		/[-\(]allstar new single/i,
		'- bt & sasha’s bucklodge ashram new',
		'(bt & sasha’s bucklodge ashram new',
		"- bt & sasha's bucklodge ashram new", // different apostrophe
		"(bt & sasha's bucklodge ashram new",
		/[-\(]howie tee new/i,
		/\(sasho twilo mix/i,
		/[-\(](?:the )?collaboration remix/i,
		/[-\(]victor calderone future new/i,
		"- fabien's good god mix",
		"(fabien's good god mix",
		'- fabien’s good god mix',
		'(fabien’s good god mix',
		/[-\(]dj paulo & jackinsky full vocal/i,
		/[-\(]funk generation & h3drush dub/i,
		/[-\(]william orbit drum/i,
		/[-\(]victor calderone drum/i,
		/[-\(]thriller 25th anniversary/i,
		/[-\(]d\.m\. extended r&b mix/i,
		/[-\(]pressuri[sz]ed dub/i,
		`- dave "jam" hall's extended urban remix`,
		`(dave "jam" hall's extended urban remix`, // hope this is the correct way to escape a string with " and '
		/[-\(]kanye west rework/i,
		/[-\(]the white panda mash-up/i,
		'(fifty shades darker',
		/[-–:\(]twin ver/i,
		/[\(\[]12"/i, // 12 inch versions, mixes of songs
		/[\(\[][""]new[""] mix/i,
		'[over now', // billie eilish l'amour de ma vie
		/(?:-\s?|\(|\[)unfinished original recordings of de-loused in the comatorium/i, // the mars volta - landscape tantrums
		'(holiday ', // illit holiday party/night
		/(?:-\s?|\(|\[)mr\. dupri no rap radio mix/i,
	],
	mixes_numbers: [
		/[\(\[\{]v[1-9]/i,
		/(?:-\s?|\(|\[)mixed/i,
		/(?:-\s?|\(|\[)mix\s/i,
	],
	stems: [
		/(?:-\s?|\(|\[)\s*(?:a\s*cappella|acapella|accapella)/i,
		/(?:-\s?|\(|\[)instrumental/i,
		/(?:-\s?|\(|\[)karaoke/i,
		/(?:-\s?|\(|\[)session/i,
		/(?:-\s?|\(|\[)studio session/i,
		/(?:-\s?|\(|\[)smart session/i,
		/[-\(]boombox/i,
		/[-\(]mtv unplugged/i,
		/[-\(]unplugged/i,
		'-unplugged', // no space intentionally, soma saito tracks
		/[-\(]acústico/i,
		/[-\(]ácustico/i,
		/(?:-\s?|\(|\[)acústico/i,
		/[-\(:]the long pond studio/i,
		/(?:-\s?|\(|\[)recorded at/i,
		/(?:-\s?|\(|\[)recorded live at/i,
		/:\s?sad girl autumn version/i,
		/(?:-\s?|\(|\[)sad girl autumn/i,
	],
	bonus: [
		/(?:-\s?|\(|\[)intro/i,
		/(?:-\s?|\(|\[)outro/i,
		'dean outro',
		/(?:-\s?|\(|\[)intermission/i,
		/(?:-\s?|\(|\[)interlude/i,
		/(?:-\s?|\(|\[)bonus/i,
		'(whitearmor interlude',
		'(ripsquadd outro',
		'the bonus tracks', // beyonce i am sasha fierce
		/[-:\(]secret track/i, // track added for clarity
		/(?:-\s?|\(|\[)edit/i,
		/(?:-\s?|\(|\[)from/i,
		/[-\(]music from/i,
		/[-\(]theme from/i,
		/[-\(]skit/i,
		/(?:-\s?|\(|\[)original/i,
		/(?:-\s?|\(|\[)deluxe/i,
		/(?:-\s?|\(|\[)digital deluxe/i,
		'd.l.x.', // https://www.last.fm/music/taylor+swift/1989+d.l.x.
		/\s(?:super\s)?deluxe (?:edition|version)/i,
		/(?:super\s)?deluxe (?:edition|version)$/i,
		/(?:-\s?|\(|\[)complete edition/i,
		/(?:-\s?|\(|\[)nouvelle edition/i,
		/[-:\(\[]edi[cç][ãi]o/i,
		/[-\(]edicion/i,
		/[-\(]edición/i,
		/(?:-\s?|\(|\[)extended/i,
		/[-\(]the extended edition/i, // denzel
		/(?:-\s?|\(|\[)expanded/i,
		/(?:-\s?|\(|\[)anniversary/i,
		/[-\(]b-side/i,
		/[-\(]c-side/i,
		/[-\(]lp/i,
		/[-\(]ep/i,
		'remix ep',
		/[-\(]single/i,
		/[-\(]rough single/i, // bedtime stories untold chapter
		/[-\(]mixtape/i,
		/[-\(]box set/i,
		/(?:-\s?|\(|\[)spilled/i, // olivia rodrigo
		/(?:-\s?|\(|\[)slightly deluxe/i, // ariana grande
		/[-:\(\[]self-titled deluxe/i, // paramore
		/[-:\(\[]the anthology/i,
		/(?:-\s?|\(|\[)3am edition/i,
		/(?:-\s?|\(|\[)(?:the )?til dawn edition/i,
		/(?:-\s?|\(|\[)(?:the )?late night edition/i,
		/(?:-\s?|\(|\[)big machine radio release special/i,
		/[-:\(\[]platinum/i,
		/:\s?the platinum/i,
		/platinum (?:edition|version)/i, // added edition/version as 'platinum' can have false positives
		/(?:-\s?|\(|\[)international/i, // taylor swift
		"(int'l", // think i escaped this character correctly?
		/(?:-\s?|\(|\[)uk deluxe/i,
		/(?:-\s?|\(|\[)magic city edition/i,
		/(?:-\s?|\(|\[)japan (?:edition|version)/i, // added edition/version for safety
		/(?:-\s?|\(|\[)australian version/i,
		/(?:-\s?|\(|\[)after school - deluxe/i, // melanie martinez
		/(?:-\s?|\(|\[)revised/i,
		/[-:\(\[]the complete/i,
		/(?:-\s?|\(|\[)(?:the )?moonlight/i, // dua lipa
		/(?:-\s?|\(|\[)tour/i,
		'music from and inspired by', // on the end of black panther the album
		/(?:-\s?|\(|\[)music inspired/i,
		/(?:-\s?|\(|\[)featured in/i,
		/(?:-\s?|\(|\[)best weekend ever edition/i,
		/(?:-\s?|\(|\[)double disc/i,
		/(?:-\s?|\(|\[)re-?issue/i,
		/\(12 reg\. tracks/i, // confessions madonna
		/(?:-\s?|\(|\[)special/i,
		/(?:-\s?|\(|\[)limited/i,
		/(?:-\s?|\(|\[)store exclusive/i,
		/(?:-\s?|\(|\[)highlights from/i,
		/[-:\(]track by track/i,
		/(?:-\s?|\(|\[)disc\s/i,
		//
		/(?:-\s?|\(|\[)(?:19|20)\d{2}/i,
		/[-\(（](?:1st|2nd|3rd|4th|5th|10th|20th|25th|30th|35th|40th|50th|60th)/i,
		/(?:tenth|fifth|5th|10th|20th|25th)\s+anniversary/i,
		/[-\(]tenth anniversary/i,
		/:\s?(?:the tenth anniversary|25th anniversary expanded edition|30th anniversary edition)/i,
		'the tenth anniversary', // lady gaga born this way
		/(?:-\s?|\(|\[)twenty years edition/i,
		/[-\(](?:10|20|25|30|35|40|50|60)\s+year/i,
		/(?:-\s?|\(|\[)transition/i,
		/(?:-\s?|\(|\[)reprise/i,
		/\(director/i,
		"(soma saito's",
		"- soma saito's",
		/(?:-\s?|\(|\[)so punk on the internet ver/i, // taylor swift showgirl variants :(
		/[-\(]including/i,
		/(?:-\s?|\(|\[)poem/i,
		/(?:-\s?|\(|\[)hidden/i,
		/(?:-\s?|\(|\[)music from/i,
	],
	form: [/[\(\[]clean/i, /[\(\[]explicit/i, '(spotify)', '🅴'],
};

// converts titles like 'something [explicit]' to 'something'
// additionally removes featured artists from title
export function clean_title(title: string) {
	return name_includes(title).song_title;
}

export function clean_streaming_titles(title: string) {
	return title.replace(/\s*-\s*(?:ep|single)\s*$/i, '');
}

export function fix_title(title: string) {
	return title
		.replace(/[\u2010\u2011\u2012\u2013]/g, '-')
		.replace(/\u2026/g, '...');
}
