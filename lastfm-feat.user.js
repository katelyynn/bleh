// ==UserScript==
// @name         bleh (feat. addon)
// @namespace    http://last.fm/music/
// @version      1.0.2
// @description  bleh!!! ^-^
// @author       kate
// @match        https://www.last.fm/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=last.fm
// @grant        none
// @updateURL    https://github.com/katelmao/lastfm-bleh/raw/uwu/lastfm-feat.user.js
// @downloadURL  https://github.com/katelmao/lastfm-bleh/raw/uwu/lastfm-feat.user.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = setTimeout(start_fm,300);

    function start_fm() {
        get_position();
        setInterval(get_position,60);
    }

    let includes = [
        '(feat', '[feat',
        '(with', '[with',
        '(ft', '[ft', 'ft.',
        'w/ ',
        '(devonshire mix', '- devonshire mix',
        '(remaster', '- remaster',
        '(remix', '- remix',
        '(live', '- live',
        '(demo', '- demo',
        '(rehearsal demo', '- rehearsal demo',
        '(home demo', '- home demo',
        '(solo acoustic', '- solo acoustic',
        '(acoustic', '- acoustic',
        '(bonus', '- bonus',
        '- 1992/live', '(boombox', '- boombox', '(mtv unplugged', '- mtv unplugged',
        '(nevermind version', '- nevermind version', '(blew ep version', '- blew ep version',
        '(b-side', '(c-side', '- b-side', '- c-side'
    ]

    function name_includes(raw2, return_type = false) {
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
    }

    function get_position() {
        try {
            // in tracklist
            let names = document.querySelectorAll('.chartlist-name > a');

            for (let name in names) {
                let raw = names[name].innerHTML;
                let raw_lower = raw.toLowerCase();

                if (name_includes(raw) && names[name].getAttribute('data-kate') != 'true') {
                    let type = name_includes(raw, true);
                    let chr = raw_lower.indexOf(`${type}`);
                    let title = raw.slice(0, (chr - 1));
                    let feat = raw.replace(title,'').replaceAll('(','').replaceAll(')','').replaceAll('[','').replaceAll(']','').replace('Feat','feat').replace('Ft','ft').replace('With','with');

                    if (type.includes('- ')) feat = feat.replace('- ','');

                    console.log(title, 'featuring', feat);
                    names[name].innerHTML = `<div class="title">${title}</div><div class="feat">${feat}</div>`;
                    names[name].setAttribute('data-kate','true');
                }
            }
        } catch(e) {}
        try {
            // on music page
            let name = document.querySelector('.header-new-title');
            let raw = name.innerHTML;
            let raw_lower = raw.toLowerCase();

            if (name_includes(raw) && name.getAttribute('data-kate') != 'true') {
                let type = name_includes(raw, true);
                let chr = raw_lower.indexOf(`${type}`);
                let title = raw.slice(0, (chr - 1));
                let feat = raw.replace(title,'').replaceAll('(','').replaceAll(')','').replaceAll('[','').replaceAll(']','').replace('Feat','feat').replace('Ft','ft').replace('With','with');

                if (type.includes('-')) feat = feat.replace('-','');

                console.log(title, 'featuring', feat);
                name.innerHTML = `<div class="inner"><div class="title">${title}</div><div class="feat">${feat}</div></div>`;
                name.setAttribute('data-kate','true');
            }
        } catch(e) {}
    }
})();