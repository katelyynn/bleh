// ==UserScript==
// @name         bleh (feat. addon)
// @namespace    http://last.fm/music/
// @version      1.1.0
// @description  bleh!!! ^-^
// @author       kate
// @match        https://www.last.fm/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=last.fm
// @grant        none
// @updateURL    https://github.com/katelyynn/bleh/raw/uwu/lastfm-feat.user.js
// @downloadURL  https://github.com/katelyynn/bleh/raw/uwu/lastfm-feat.user.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = setTimeout(start_fm,300);

    function start_fm() {
        get_position();
        setInterval(get_position,30);
    }

    let includes = [
        // featuring
        '(feat', '[feat',
        '(with', '[with',
        '(ft', '[ft', 'ft.',
        'w/ ',
        // mixes / demos
        '(devonshire mix', '- devonshire mix',
        '(remaster', '- remaster',
        '(remix', '- remix',
        '(live', '- live',
        '(demo', '- demo', '[demo', '[sample clearance demo',
        '(rehearsal demo', '- rehearsal demo',
        '(home demo', '- home demo',
        '(solo acoustic', '- solo acoustic',
        '(acoustic', '- acoustic',
        '(alternative', '- alternative',
        '(mix 1', '(mix 2', '(mix 3', '(mix 4', '(mix 5', '(mix 6', '(mix 7', '(mix 8', '(mix 9',
        '- spotify singles',
        '(acapella', '(instrumental', '- acapella', '- instrumental',
        '(choppednotslopped', '- choppednotslopped',
        '(skit', '- skit',
        '(extended', '- extended',
        '- 1992/live', '(boombox', '- boombox', '(mtv unplugged', '- mtv unplugged',
        // bonus!
        '(bonus', '- bonus',
        '(nevermind version', '- nevermind version', '(blew ep version', '- blew ep version',
        '(b-side', '(c-side', '- b-side', '- c-side',
        '(deluxe', '- deluxe', '(digital deluxe', '(complete edition', '(extended edition',
        '(anniversary',
        '(sessions', '(studio session',
        '(taylor',
        '(lp', '(ep', '- lp', '- ep',
        '(19', '- 19', '(20', '- 20',
        '(original', '- original',
        '(kate', // :3
        '(smart session', '- smart session', '[smart session',
        '- ep','- single',
        '[clean]',
        '(outro', '- outro'
    ]

    /*function name_includes(raw2, return_type = false) {
        let raw = raw2.toLowerCase();
        let does_include = false;
        let include_type = '';

        for (let include in includes)
            if (raw.includes(includes[include])) {
                does_include = true;
                include_type = includes[include];
                break;
            }

        if (does_include)
            if (!return_type)
                return true;
            else
                return include_type;
        else
            return false;
    }*/

    function name_includes(raw2, return_types = false) {
        let raw = raw2.toLowerCase();
        let text = raw2;
        let extras = [];
        let extras_count = 0;

        for (let include in includes)
            if (raw.includes(includes[include])) {
                let chr = raw.indexOf(`${includes[include]}`);

                extras.push({
                    type: includes[include],
                    chr: chr
                });
                extras_count += 1;
            }

        extras.sort((a, b) => a.chr - b.chr);

        for (let extra in extras) {
            text = raw2.slice(0, (extras[extra].chr - 1));
            break;
        }

        for (let extra in extras) {
            if ((parseInt(extra) + 1) < extras_count) {
                let chr = extras[extra].chr;
                let next_chr = extras[parseInt(extra) + 1].chr;

                extras[extra].text = raw2.slice(chr, (next_chr - 1)).replaceAll('(','').replaceAll(')','').replaceAll('[','').replaceAll(']','').replaceAll('- ','').replaceAll(' eminem',' Eminem');
            } else {
                let chr = extras[extra].chr;
                extras[extra].text = raw2.slice(chr).replaceAll('(','').replaceAll(')','').replaceAll('[','').replaceAll(']','').replaceAll('- ','').replaceAll(' eminem',' Eminem');
            }
        }

        console.log('Raw input: ', raw,'  ->  ',text,extras);

        /*for (let i = (extras_count - 1); i > 0; i--) {
            let chr = raw.indexOf(`${extras[i].type}`);
        }*/

        if (extras_count > 0)
            if (!return_types)
                return true;
            else
                return [text, extras];
        else
            return [text,[]];
    }

    function get_position() {
        try {
            // in tracklist
            let names = document.querySelectorAll('.chartlist-name > a');

            for (let name in names) {
                if (names[name].getAttribute('data-kate') != 'true') {
                    let raw = names[name].textContent;
                    let name_include = name_includes(raw, true);

                    let text = name_include[0];
                    let extras = name_include[1];

                    let draft = '';

                    for (let extra in extras)
                        draft = `${draft}<div class="feat" data-type="${extras[extra].type}">${extras[extra].text}</div>`;

                    //console.log(title, 'featuring', feat);
                    names[name].innerHTML = `<div class="title">${text}</div>${draft}`;
                    names[name].setAttribute('data-kate','true');
                }
            }
        } catch(e) {}
        try {
            // on music page
            let name = document.querySelector('.header-new-title');

            if (name.getAttribute('data-kate') != 'true') {
                let raw = name.textContent;
                let name_include = name_includes(raw, true);

                let text = name_include[0];
                let extras = name_include[1];

                let draft = '';

                for (let extra in extras)
                    draft = `${draft}<div class="feat" data-type="${extras[extra].type}">${extras[extra].text}</div>`;

                //console.log(title, 'featuring', feat);
                name.innerHTML = `<div class="inner"><div class="title">${text}</div>${draft}</div>`;
                name.setAttribute('data-kate','true');
            }
        } catch(e) {}
        try {
            // album lists
            let names = document.querySelectorAll('.resource-list--release-list-item-name > a');

            for (let name in names) {
                if (names[name].getAttribute('data-kate') != 'true') {
                    let raw = names[name].textContent;
                    let name_include = name_includes(raw, true);

                    let text = name_include[0];
                    let extras = name_include[1];

                    let draft = '';

                    for (let extra in extras)
                        draft = `${draft}<div class="feat" data-type="${extras[extra].type}">${extras[extra].text}</div>`;

                    //console.log(title, 'featuring', feat);
                    names[name].innerHTML = `<div class="title">${text}</div>${draft}`;
                    names[name].setAttribute('data-kate','true');
                }
            }
        } catch(e) {}
        try {
            // artist top albums
            let names = document.querySelectorAll('.artist-top-albums-item-name > a');

            for (let name in names) {
                if (names[name].getAttribute('data-kate') != 'true') {
                    let raw = names[name].textContent;
                    let name_include = name_includes(raw, true);

                    let text = name_include[0];
                    let extras = name_include[1];

                    let draft = '';

                    for (let extra in extras)
                        draft = `${draft}<div class="feat" data-type="${extras[extra].type}">${extras[extra].text}</div>`;

                    //console.log(title, 'featuring', feat);
                    names[name].innerHTML = `<div class="title">${text}</div>${draft}`;
                    names[name].setAttribute('data-kate','true');
                }
            }
        } catch(e) {}
    }
})();