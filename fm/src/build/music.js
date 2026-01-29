//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { name_includes } from '../components/lotus';
import { trans } from './trans';

export let artist_corrections = {};
export let album_track_corrections = {};
export let combined_artists = {};

export let ranks = {
    15: {
        start: 60_000,
        hue: 240,
        sat: 1.15,
        lit: 1.1
    },
    14: {
        start: 44_000,
        hue: 260,
        sat: 1.2,
        lit: 1.15
    },
    13: {
        start: 32_000,
        hue: 280,
        sat: 1.25,
        lit: 1.17
    },
    12: {
        start: 26_000,
        hue: 300,
        sat: 1.2,
        lit: 1.2
    },
    11: {
        start: 17_000,
        hue: 320,
        sat: 1.15,
        lit: 1.22
    },
    10: {
        start: 12_000,
        hue: 0,
        sat: 1.25,
        lit: 1.2
    },
    9: {
        start: 8_000,
        hue: 15,
        sat: 1.25,
        lit: 1.22
    },
    8: {
        start: 5_300,
        hue: 30,
        sat: 1.2,
        lit: 1.23
    },
    7: {
        start: 4_000,
        hue: 45,
        sat: 1.15,
        lit: 1.25
    },
    6: {
        start: 2_250,
        hue: 60,
        sat: 1.1,
        lit: 1.25
    },
    5: {
        start: 1_500,
        hue: 80,
        sat: 1.05,
        lit: 1.23
    },
    4: {
        start: 1_000,
        hue: 100,
        sat: 1.0,
        lit: 1.2
    },
    3: {
        start: 500,
        hue: 120,
        sat: 0.95,
        lit: 1.17
    },
    2: {
        start: 300,
        hue: 150,
        sat: 1.0,
        lit: 1.15
    },
    1: {
        start: 100,
        hue: 180,
        sat: 1.05,
        lit: 1.13
    },
    0: {
        start: 0,
        hue: 200,
        sat: 1.1,
        lit: 1.17
    }
};

export let includes = {
    guests: [
        /\sfeat\s/i,
        /\sfeat\./i,
        /\sfeaturing\s/i,
        /[-\(\[]feat/i,
        /[-\(\[]with /i,
        /w\/\s/i,
        /ft\./i,
        /ref\./i,
        /\(hosted by/i,
        /\(re:/i // re this is why paramore
    ],
    versions: [
        /[-\(\[]taylor/i,
        /[-\(]spotify singles/i,
        /\(\+/i,
        /[-\(\[]versão/i,
        /[-\(\[]without dialogue/i,
        /[-\(\[]no dialogue/i,
        /[-\(\[]pop version/i,
        /[-\(\[]rock version/i,
        /[-\(\[]pop mix/i,
        /[-\(\[]emo version/i,
        /[-\(\[]version/i,
        /\(s\.a\.d\. version/i,
        '- s.a.d.',
        /[-\(]vocoded/i,
        /[-\(\[]pa version/i,
        /[-\(\[]u\.s\. pa version/i,
        /[-\(\[]main/i
    ],
    remasters: [
        /[-\(\[]remaster/i,
        /:\s?high resolution remasters/i,
        /[-\(]high resolution remasters/i,
        /:\s?the high resolution remasters/i,
        /[-\(]the high resolution remasters/i, // Pink Floyd bootleg remaster boxsets
        /[-\(]2012 - remaster/i // black sabbath
    ],
    mixes: [
        /[-\(]devonshire mix/i,
        'mike dean master',
        /[-\(\[]remix/i,
        '-reloaded-', // deco*27
        /[-\(\[]reloaded/i,
        /\(best friend remix/i, // deco*27
        /[-\(]live/i,
        /:\s?the live/i,
        /\(\s?the live/i,
        /[-\(]the live/i,
        /[-\(]online live/i,
        /\sonline live/i,
        /[-\(\[]ao vivo/i,
        /[-\(\[]en vivo/i,
        /[-\(\[]multishow ao vivo/i,
        /[-\(\[]demo/i,
        /[-\(\[]early demo/i,
        /[-\(\[]early version/i,
        /[-\(]rehearsal/i,
        /[-\(\[]sample clearance/i,
        /[-\(]home demo/i,
        /[-\(]solo acoustic/i,
        /[-\(\[]acoustic/i,
        /[-\(\[]piano ver/i,
        /:\s?self-serenade/i,
        /[-\(]self-serenade/i,
        /[-\(\[]alt/i,
        /[-\(\[]chopped/i,
        '(kate',
        '(asmr',
        '(agressive',
        '(aggressive',
        'brazilian phonk', // lol
        /[-\(\[]sped up/i,
        /[-\(\[]slow/i,
        /[-\(\[]nightcore/i,
        'a. g. cook remix',
        '- charli xcx & a.g. cook remix',
        '- rina sawayama & clarence clarity remix',
        '- bree runway & jimmy edgar remix',
        '- chester lockhart, mood killer & lil texas remix',
        '- shygirl & mura masa remix',
        '- coucou chloe remix', // https://www.last.fm/music/+noredirect/lady+gaga/dawn+of+chromatica
        '(george daniel & charli xcx remix',
        '- george daniel & charli xcx remix',

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
            'flying lotus|chris lord-alge|cla|' +
            // descriptors
            'club 69 speed|the color|meltdown|underground|ihs|' +
            'classic club|naughty main|' +
            'og|rough|sports bar|new|short|dance club|electronic|' +
            'tv|tvd|the ultimate|' +
            'the' +
            ')\\s+(?:remix|mix)\\b',
            'i'
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
            'club edit|' +
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
            'i'
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
        /[-\(\[]unfinished original recordings of de-loused in the comatorium/i, // landscape tantrums
        '(holiday ', // illit holiday party/night
        /[-\(\[]mr\. dupri no rap radio mix/i
    ],
    mixes_numbers: [
        /[\(\[]v[1-9]/i,
        /[-\(]mixed/i,
        /[-\(]mix\s/i
    ],
    stems: [
        /[-\(\[]\s*(?:a\s*cappella|acapella|accapella)/i,
        /[-\(\[]instrumental/i,
        /[-\(\[]karaoke/i,
        /[-\(\[]session/i,
        /[-\(\[]studio session/i,
        /[-\(\[]smart session/i,
        /[-\(]boombox/i,
        /[-\(]mtv unplugged/i,
        /[-\(]unplugged/i,
        '-unplugged', // no space intentionally, soma saito tracks
        /[-\(]acústico/i,
        /[-\(]ácustico/i,
        /[-\(\[]acústico/i,
        /[-\(:]the long pond studio/i,
        /[-\(\[]recorded at/i,
        /[-\(\[]recorded live at/i,
        /:\s?sad girl autumn version/i,
        /[-\(\[]sad girl autumn/i
    ],
    bonus: [
        /[-\(\[]intro/i,
        /[-\(\[]outro/i,
        'dean outro',
        /[-\(\[]interlude/i,
        /[-\(\[]bonus/i,
        'the bonus tracks', // beyonce i am sasha fierce
        /[-:\(]secret track/i, // track added for clarity
        /[-\(\[]edit/i,
        /[-\(\[]from/i,
        /[-\(]music from/i,
        /[-\(]theme from/i,
        /[-\(]skit/i,
        /[-\(\[]original/i,
        /[-\(\[]deluxe/i,
        /[-\(\[]digital deluxe/i,
        'd.l.x.', // https://www.last.fm/music/taylor+swift/1989+d.l.x.
        /\s(?:super\s)?deluxe (?:edition|version)/i,
        /(?:super\s)?deluxe (?:edition|version)$/i,
        /[-\(\[]complete edition/i,
        /[-:\(\[]edi[cç][ãi]o/i,
        /[-\(]edicion/i,
        /[-\(]edición/i,
        /[-\(\[]extended/i,
        /[-\(]the extended edition/i, // denzel
        /[-\(\[]expanded/i,
        /[-\(\[]anniversary/i,
        /[-\(]b-side/i,
        /[-\(]c-side/i,
        /[-\(]lp/i,
        /[-\(]ep/i,
        'remix ep',
        /[-\(]single/i,
        /[-\(]rough single/i, // bedtime stories untold chapter
        /[-\(]mixtape/i,
        /[-\(]box set/i,
        /[-\(\[]spilled/i, // olivia rodrigo
        /[-\(\[]slightly deluxe/i, // ariana grande
        /[-:\(\[]self-titled deluxe/i, // paramore
        /[-:\(\[]the anthology/i,
        /[-\(\[]3am edition/i,
        /[-\(\[](?:the )?til dawn edition/i,
        /[-\(\[](?:the )?late night edition/i,
        /[-\(\[]big machine radio release special/i,
        /[-:\(\[]platinum/i,
        /:\s?the platinum/i,
        /platinum (?:edition|version)/i, // added edition/version as 'platinum' can have false positives
        /[-\(\[]international/i, // taylor swift
        "(int'l", // think i escaped this character correctly?
        /[-\(\[]uk deluxe/i,
        /[-\(\[]magic city edition/i,
        /[-\(\[]japan (?:edition|version)/i, // added edition/version for safety
        /[-\(\[]australian version/i,
        /[-\(\[]after school - deluxe/i, // melanie martinez
        /[-\(\[]revised/i,
        /[-:\(\[]the complete/i,
        /[-\(\[](?:the )?moonlight/i, // dua lipa
        /[-\(\[]tour/i,
        'music from and inspired by', // on the end of black panther the album
        /[-\(\[]music inspired/i,
        /[-\(\[]featured in/i,
        /[-\(\[]best weekend ever edition/i,
        /[-\(\[]double disc/i,
        /[-\(\[]re-?issue/i,
        /\(12 reg\. tracks/i, // confessions madonna
        /[-\(\[]special/i,
        /[-\(\[]limited/i,
        /[-\(\[]store exclusive/i,
        /[-\(\[]highlights from/i,
        /[-:\(]track by track/i,
        /[-\(\[]disc\s/i,
        //
        /[-\(\[](?:19|20)\d{2}/i,
        /[-\(（](?:1st|2nd|3rd|4th|5th|10th|20th|25th|30th|35th|40th|50th|60th)/i,
        /(?:tenth|fifth|5th|10th|20th|25th)\s+anniversary/i,
        /[-\(]tenth anniversary/i,
        /:\s?(?:the tenth anniversary|25th anniversary expanded edition|30th anniversary edition)/i,
        'the tenth anniversary', // lady gaga born this way
        /[-\(\[]twenty years edition/i,
        /[-\(](?:10|20|25|30|35|40|50|60)\s+year/i,
        /[-\(\[]transition/i,
        /[-\(\[]reprise/i,
        /\(director/i,
        "(soma saito's",
        "- soma saito's",
        /[-\(\[]so punk on the internet ver/i, // taylor swift showgirl variants :(
        /[-\(]including/i,
        /[-\(\[]poem/i,
        /[-\(\[]hidden/i
    ],
    form: [/[\(\[]clean/i, /[\(\[]explicit/i, '(spotify)', '🅴']
};

// converts titles like 'something [explicit]' to 'something'
// additionally removes featured artists from title
export function clean_title(title) {
    return name_includes(title)[0];
}

export function fix_title(title) {
    return title
        .replace(/[\u2010\u2011\u2012\u2013]/g, '-')
        .replace(/\u2026/g, '...');
}
