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
        setInterval(get_position,300);
    }

    function get_position() {
        try {
            let names = document.querySelectorAll('.chartlist-name > a');

            for (let name in names) {
                let raw = names[name].innerHTML;

                if ((raw.includes('(feat') || raw.includes('(with') || raw.includes('[feat') || raw.includes('[with')) && names[name].getAttribute('data-kate') != 'true') {
                    let type = '(feat';
                    if (raw.includes('(with')) {
                        type = '(with';
                    } else if (raw.includes('[with')) {
                        type = '[with';
                    } else if (raw.includes('[feat')) {
                        type = '[feat';
                    }
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
            let name = document.querySelector('.header-new-title');
            let raw = name.innerHTML;
            console.log('raw',raw);

            if ((raw.includes('(feat') || raw.includes('(with') || raw.includes('[feat') || raw.includes('[with')) && name.getAttribute('data-kate') != 'true') {
                let type = '(feat';
                if (raw.includes('(with')) {
                    type = '(with';
                } else if (raw.includes('[with')) {
                    type = '[with';
                } else if (raw.includes('[feat')) {
                    type = '[feat';
                }
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