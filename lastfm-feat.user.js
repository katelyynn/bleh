// ==UserScript==
// @name         bleh (feat. addon)
// @namespace    http://last.fm/music/
// @version      1.0.1
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
        setInterval(get_position,80);
    }

    function name_includes(raw2, return_type = false) {
        let raw = raw2.toLowerCase();
        if (
            raw.includes('(feat') ||
            raw.includes('[feat') ||
            raw.includes('(with') ||
            raw.includes('[with') ||
            raw.includes('(ft') ||
            raw.includes('[ft') ||
            raw.includes(' w/ ')
        ) {
            if (!return_type) {
                return true;
            } else {
                if (raw.includes('(feat'))
                    return '(feat';
                else if (raw.includes('[feat'))
                    return '[feat';
                else if (raw.includes('(with'))
                    return '(with';
                else if (raw.includes('[with'))
                    return '[with';
                else if (raw.includes('(ft'))
                    return '(ft';
                else if (raw.includes('[ft'))
                    return '[ft';
                else if (raw.includes(' w/ '))
                    return 'w/ ';
            }
        } else {
            return false;
        }
    }

    function get_position() {
        try {
            // in tracklist
            let names = document.querySelectorAll('.chartlist-name > a');

            for (let name in names) {
                let raw = names[name].innerHTML;

                if (name_includes(raw) && names[name].getAttribute('data-kate') != 'true') {
                    let type = name_includes(raw, true);
                    let chr = raw.indexOf(`${type}`);
                    let title = raw.slice(0, (chr - 1));
                    let feat = raw.replace(title,'').replaceAll('(','').replaceAll(')','').replaceAll('[','').replaceAll(']','');

                    console.log(title, 'featuring', feat);
                    names[name].innerHTML = `<div class="title">${title}</div><div class="feat">${feat}</div>`;
                    names[name].setAttribute('data-kate','true');
                }
            }
        } catch(e) {console.error(e)}
        try {
            // on music page
            let name = document.querySelector('.header-new-title');
            let raw = name.innerHTML;

            if (name_includes(raw) && name.getAttribute('data-kate') != 'true') {
                let type = name_includes(raw, true);
                let chr = raw.indexOf(`${type}`);
                let title = raw.slice(0, (chr - 1));
                let feat = raw.replace(title,'').replaceAll('(','').replaceAll(')','').replaceAll('[','').replaceAll(']','');

                console.log(title, 'featuring', feat);
                name.innerHTML = `<div class="inner"><div class="title">${title}</div><div class="feat">${feat}</div></div>`;
                name.setAttribute('data-kate','true');
            }
        } catch(e) {console.error(e)}
    }
})();