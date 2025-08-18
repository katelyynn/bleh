//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

export let artist_corrections = {};
export let album_track_corrections = {};

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
        'feat.', 'featuring',
        '- with', '(with', '[with', 'w/ ',
        'ft.',
        'ref.',
        '- feat'
    ],
    versions: [
        '(taylor', '- spotify singles', '[taylor',
        '(+',
        '- versão', '(versão', '[versão',
        ' - without dialogue', '(without dialogue', '[without dialogue',
        ' - no dialogue', '(no dialogue', '[no dialogue',
        '- pop version', '(pop version', '[pop version',
        '- rock version', '(rock version', '[rock version',
        '- pop mix', '(pop mix', '[pop mix'
    ],
    spotify: [
        '(spotify)'
    ],
    remasters: [
        '- remaster', '(remaster', '[remaster',
        '- remasterizado', '(remasterizado', '[remasterizado'
    ],
    mixes: [
        '- devonshire mix', '(devonshire mix',
        'mike dean master',
        '- remix', '(remix', '[remix',
        '- live', '(live',
        '- ao vivo', '(ao vivo', '[ao vivo',
        '- en vivo', '(en vivo', '[en vivo',
        '- multishow ao vivo', '(multishow ao vivo', '[multishow ao vivo',
        '- demo', '(demo',
        '- rehearsal', '(rehearsal',
        '- sample clearance', '(sample clearance', '[sample clearance',
        '- home demo', '(home demo',
        '- solo acoustic', '(solo acoustic',
        '- acoustic', '(acoustic',
        '- alternative', '(alternative',
        '(mix 1', '(mix 2', '(mix 3', '(mix 4', '(mix 5', '(mix 6', '(mix 7', '(mix 8', '(mix 9',
        '- chopped', '(chopped', '[chopped',
        '(kate',
        '(asmr',
        '(agressive', '(aggressive', 'brazilian phonk', // lol
        '- sped up', '(sped up', '[sped up', '- slow', '(slow', '[slow',
        'a. g. cook remix',
        '- offline', '- og mix',
        '- club edit', '(club edit',
        '- radio', '(radio',
        '- orchestral', '(orchestral',
        '- self-titled demo', '(self-titled demo',
        '- album version', '(album version', '[album version',
        '- us album version', '(us album version', '[us album version',
        '- uk album version', '(uk album version', '[uk album version',
        '- twilight soundtrack version',
        '- transformers soundtrack version',
        '- studio', '(studio', '[studio',
        '(fifty shades darker',
        '- j stax radio', // fearless international version
        '(10 minute',
        '- old timey', '(old timey', '[old timey',
        '- english version', '(english version', '[english version',
        '- japanese version', '(japanese version', '[japanese version',
        '- soundtrack', '(soundtrack', '[soundtrack',
        '- the ultimate mix', '(the ultimate mix', '[the ultimate mix',
        '- short edit', '(short edit', 'short edit',
        '- short version', '(short version', '[short version',
        '- long version', '(long version', '[long version',
        '- full length', '(full length', '[full length',
        '[over now', // billie eilish l'amour de ma vie
        '- the remix', '(the remix', '[the remix'
    ],
    mixes_numbers: [
        '(v1', '(v2', '(v3', '(v4', '(v5', '(v6', '(v7', '(v8', '(v9',
        '[v1', '[v2', '[v3', '[v4', '[v5', '[v6', '[v7', '[v8', '[v9',
        '- mix 1', '- mix 2', '- mix 3', '- mix 4', '- mix 5', '- mix 6', '- mix 7', '- mix 8', '- mix 9',
        '(mix 1', '(mix 2', '(mix 3', '(mix 4', '(mix 5', '(mix 6', '(mix 7', '(mix 8', '(mix 9'
    ],
    stems: [
        '- acapella', '(acapella', '[acapella', '- a cappella', '(a cappella', '[a cappella',
        '- instrumental', '(instrumental', '[instrumental',
        '- session', '(session', '[session',
        '- studio session', '(studio session', '[studio session',
        '- smart session', '(smart session', '[smart session',
        '- boombox', '(boombox',
        '- mtv unplugged', '(mtv unplugged',
        '- unplugged', '(unplugged',
        '- acústico', '- ácustico', '(acústico', '[acústico',
        '- the long pond studio', '(the long pond studio',
        '- recorded at long pond studio', '(recorded at long pond studio'
    ],
    bonus: [
        '- intro', '(intro', '[intro',
        '- outro', '(outro', '[outro', 'dean outro',
        '- interlude', '(interlude', '[interlude',
        '- bonus', '(bonus', '[bonus',
        '- edit', '(edit', '[edit',
        '- from', '(from', '[from',
        '- music from', '(music from',
        '- skit', '(skit',
        '- original', '(original', '[original',
        '[clean', '[explicit',
        '- deluxe', '(deluxe', '[deluxe',
        '- digital deluxe', '(digital deluxe', '[digital deluxe',
        '- complete edition', '(complete edition', '[complete edition',
        ': edição', '- edição', '(edição', '[edição',
        '- edicion', '- edición', '(edicion', '(edición',
        '- extended', '(extended', '[extended',
        '- the extended edition', // denzel
        '- expanded', '(expanded', '[expanded',
        '- anniversary', '(anniversary', '[anniversary',
        '- b-side', '- c-side', '(b-side', '(c-side',
        '- lp', '- ep', '(lp', '(ep', 'ep', // some albums just have EP on the end with no punctuation
        '- single', '(single',
        '- mixtape', '(mixtape',
        '- box set', '(box set',
        '- spilled', '(spilled', '[spilled', // olivia rodrigo
        '- slightly deluxe', '(slightly deluxe', '[slightly deluxe', // ariana grande
        ': self-titled deluxe', '(self-titled deluxe', '[self-titled deluxe', // paramore
        ': the anthology', '(the anthology', '[the anthology',
        '- 3am edition', '(3am edition', '[3am edition',
        '- the til dawn edition', '(the til dawn edition', '[the til dawn edition', 
        '- til dawn edition', '(til dawn edition', '[til dawn edition',
        '- late night edition', '(late night edition', '[late night edition',
        '- the late night edition', '(the late night edition', '[the late night edition',
        '- big machine radio release special', '(big machine radio release special', '[big machine radio release special',
        'platinum edition', ': platinum edition', '- platinum', '(platinum', '[platinum', 
        '- international', '(international', '[international', // taylor swift 
        '- uk deluxe', '(uk deluxe', '[uk deluxe',
        '- magic city edition', '(magic city edition', '[magic city edition',
        '- japan edition', '(japan edition', '[japan edition', // added edition to some for safety
        '- japan version', '(japan version', '[japan version',
        '- australian version', '(australian version', '[australian version',
        '- platinum blonde edition', '(platinum blonde edition', '[platinum blonde edition', // marina
        '- after school - deluxe', '(after school - deluxe', '[after school - deluxe', // melanie martinez
        '- revised', '(revised', '[revised',
        ': the complete', '(the complete', '[the complete',
        '- the moonlight', '(the moonlight', '[the moonlight',
        '- moonlight', '(moonlight', '[moonlight', // dua lipa
        '- tour', '(tour', '[tour',
        'music from and inspired by', // on the end of black panther the album
        '- magic city edition', '(magic city edition', '[magic city edition',
        '- music inspired', '(music inspired', '[music inspired',
        '- featured in', '(featured in', '[featured in',
        '- best weekend ever edition', '(best weekend ever edition', '[best weekend ever edition',
        '- double disc', '(double disc', '[double disc',
        '- reissue', '(reissue', '[reissue',
        '(12 reg. tracks', // confessions madonna
        '- special', '(special', '[special',
        '- highlights from', '(highlights from', '[highlights from',
        //,
        '- 19', '- 20', '(19', '(20', '[19', '[20',
        '- 10th', '- 25th', '- 30th', '- 35th', '- 40th', '- 50th', '- 60th',
        '(10th', '(25th', '(30th', '(35th', '(40th', '(50th', '(60th',
        '- tenth anniversary', 'fifth anniversary',
        '(tenth anniversary', '(fifth anniversary',
        ': the tenth anniversary', 'the tenth anniversary', // lady gaga born this way
        '- 10 year', '- 25 year', '-30 year', '-35 year', '- 40 year', '- 50 year', '- 60 year',
        '(10 year', '(25 year', '(30 year', '(35 year', '(40 year', '(50 year', '(60 year'
    ]
}
