// ==UserScript==
// @name         bleh (rank colours addon)
// @namespace    http://last.fm/music/
// @version      0.1.1
// @description  bleh!!! ^-^
// @author       kate
// @match        https://www.last.fm/music/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=last.fm
// @grant        none
// @updateURL    https://github.com/katelmao/lastfm-bleh/raw/uwu/lastfm-ranks.user.js
// @downloadURL  https://github.com/katelmao/lastfm-bleh/raw/uwu/lastfm-ranks.user.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = setTimeout(start_position,100);

    function start_position() {
        get_position();
        setInterval(get_position,500);
    }

    function get_position() {
        try {
            let em_rank = document.querySelector('div.header-new-content');
            let current_rank = document.getElementById('header-new-chart-position').textContent.replace('#','');

            em_rank.classList.remove('rank--5','rank--10','rank--15','rank--20','rank-25','rank-30');
            if (current_rank <= 5) {
                em_rank.classList.add('rank--gradient','rank--5');
            } else if (current_rank <= 10) {
                em_rank.classList.add('rank--gradient','rank--10');
            } else if (current_rank <= 15) {
                em_rank.classList.add('rank--gradient','rank--15');
            } else if (current_rank <= 20) {
                em_rank.classList.add('rank--gradient','rank--20');
            } else if (current_rank <= 25) {
                em_rank.classList.add('rank--gradient','rank--25');
            } else if (current_rank <= 30) {
                em_rank.classList.add('rank--gradient','rank--30');
            }
        } catch(e) {}
    }
})();