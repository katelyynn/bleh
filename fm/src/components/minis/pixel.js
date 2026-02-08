//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import {html, render} from "lighterhtml";
import {api_key, auth, page} from "../build/page.js";
import {tl, trans} from "../build/trans.js";
import {input} from "./input.js";
import tippy from "tippy.js";
import { status } from './status.js';
import { notify } from './notify.js';
import { correct_artist, correct_item_by_artist } from './lotus.js';
import { keybind } from './rabbit.js';
import { log } from '../build/log.js';
import { settings } from '../build/config.js';

export function pixel({
    host,
    sidebar
}={}) {
    if (!host || !sidebar) return;

    let user_albums = [];

    render(sidebar, html`
        <h2>${tl(trans.settings)}</h2>
        <div class="setting-group">
            <div class="setting v" data-type="text">
                <div class="heading">
                    <h5>${tl(trans.profile)}</h5>
                </div>
                <div class="input-container content-form">
                    <input type="text" class="input" ref=${el => inputter = el} placeholder=${tl(trans.enter_a_profile)} value=${page.requested.profile} onchange=${e => {
                        page.requested.profile = e.target.value;
                        page.name = page.requested.profile;
                    }}>
                    ${() => {
                        let btn = html.node`
                            <button class="btn chibi icon" data-type="profile" onclick=${() => {
                                inputter.value = auth.name;
                                inputter.dispatchEvent(new Event('change'));
                            }}>${tl(trans.profile)}</button>
                        `;

                        tippy(btn, {
                            content: tl(trans.profile)
                        });

                        return btn;
                    }}
                    ${() => {
                        let btn = html.node`
                            <button class="btn chibi icon" data-type="starred_friend" data-is-shortcut=${settings.starred_friend != ''} onclick=${() => {
                                if (settings.starred_friend == '') return;

                                inputter.value = settings.starred_friend;
                                inputter.dispatchEvent(new Event('change'));
                            }}>${tl(trans.starred_friend.name)}</button>
                        `;

                        tippy(btn, {
                            content: tl(trans.starred_friend.name)
                        });

                        return btn;
                    }}
                </div>
            </div>
        </div>
        <button class="primary icon jumbo" data-type="pixel" onclick=${() => pixel_prepare()}>
            ${tl(trans.reset)}
        </button>
    `);

    pixel_home();

    function pixel_home() {
        render(host, html`
            <div class="pixel-home">
                <h1 class="pixel-logo">pixel</h1>
                <div class="pixel-guess center">
                    <button class="primary jumbo continue" onclick=${() => pixel_prepare()}>
                        ${tl(trans.begin)}
                    </button>
                </div>
            </div>
        `);
    }

    function pixel_prepare() {
        user_albums = [];

        render(host, html`
            <div class="pixel-home">
                <h1 class="pixel-logo">pixel</h1>
                <div class="loading-data-container">
                    <div class="loading-data-text">${tl(trans.loading_album_plays)}</div>
                </div>
            </div>
        `);

        if (user_albums.length == 0) {
            fetch(`http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${page.name}&api_key=${api_key}&format=json&limit=500`)
                .then(res => {
                    if (!res.ok) {
                        notify({
                            id: 'api-error',
                            type: 'error',
                            title: tl(trans.value_failed_to_load).replace('{v}', tl(trans.albums)),
                            body: res.statusText
                        });
                        throw new Error;
                    }

                    return res.json();
                })
                .then(data => {
                    const pre_parsed = data.topalbums.album;

                    pre_parsed.forEach(album => {
                        user_albums.push({
                            image: album.image[3]['#text'],
                            name: correct_item_by_artist(album.name, album.artist.name),
                            sister: correct_artist(album.artist.name),
                            type: 'album',
                            plays: album.playcount
                        });
                    });

                    pixel_random();
                })
                .catch(err => {
                    return;
                });
        } else {
            pixel_random();
        }
    }

    function pixel_random() {
        pixel_guess(user_albums[Math.floor(Math.random() * user_albums.length)]);
    }

    function pixel_guess({
        image,
        name,
        sister,
        type,
        plays
    }={
        image: '',
        name: 'Unknown Album',
        sister: 'Unknown Artist',
        type: 'album',
        plays: 0
    }) {
        let guess_input;

        const hints = [
            'artist',
            'country',
            'date'
        ];
        const pixelations = [
            0.02,
            0.05,
            0.1,
            0.2,
            0.3
        ];
        let pixelation = 0;
        let hint = 0;
        let canvas;
        let timer;
        let actions;
        let guess_btn;
        let interval;
        let image_interval;

        let title_elem;
        let hints_container;
        render(host, html``);
        render(host, html`
            <div class="pixel-artwork">
                <canvas ref=${el => canvas = el} />
            </div>
            <div class="pixel-info">
                <div class="pixel-album-name">
                    <h1 ref=${el => title_elem = el}>${jumble_string(name)}</h1>
                </div>
            </div>
            <div class="pixel-actions" ref=${el => actions = el}>
                <button class="icon" data-type="add" onclick=${() => pixel_hint()}>
                    ${tl(trans.add_hint)}
                </button>
                <button class="icon" data-type="jumble" onclick=${() => {
                    title_elem.textContent = jumble_string(name);
                    guess_input.focus();
                }}>
                    ${tl(trans.re_jumble)}
                </button>
                <button class="icon" data-type="minus" onclick=${() => pixel_give_up()}>
                    ${tl(trans.give_up)}
                    ${keybind(['ESC'])}
                </button>
            </div>
            <div class="pixel-time" ref=${el => timer = el} />
            <div class="pixel-guess">
                ${guess_input = input({
                    type: 'text',
                    placeholder: tl(trans.enter_a_guess),
                    func: (value) => {
                        pixel_make_a_guess(value);
                    },
                    func_esc: () => {
                        pixel_give_up();
                    }
                })}
                ${() => {
                    const btn = html.node`
                        <button class="primary icon guess" data-type="send" ref=${el => guess_btn = el} onclick=${() => guess_input.submit()}>
                            ${tl(trans.guess)}
                        </button>
                    `;

                    tippy(btn, {
                        content: btn.textContent
                    });

                    return btn;
                }}
            </div>
            <div class="pixel-info">
                <h2>${tl(trans.hints)}</h2>
                <div class="hints" ref=${el => hints_container = el}></div>
            </div>
        `);

        render(hints_container, html`
            sister: ${sister}<br>
            type: ${type}<br>
            plays: ${plays}
        `);

        guess_input.focus();

        const canvas_image = new Image();
        canvas_image.src = image;

        canvas_image.onload = () => {
            render_canvas();
        }

        render_timer();

        function render_timer() {
            const duration = 30 * 1000;
            const start = Date.now();

            interval = setInterval(() => {
                const elapsed = Date.now() - start;
                const remain = duration - elapsed;

                if (remain <= 0) {
                    timer_end();
                    pixel_end();
                    return;
                }

                const s = Math.floor(remain / 1000);
                const ms = remain % 1000;

                render(timer, html`
                    <span class="bleh-icon" />
                    <span class="s">
                        ${s}
                    </span>
                `);
            }, 10);
        }

        function timer_end(keep = false) {
            clearInterval(interval);

            if (keep) return;

            render(timer, html`
                <span class="bleh-icon" />
                <span class="s">
                    0
                </span>
            `);
        }

        function render_canvas(override = false) {
            let value = pixelation;

            if (!override) {
                const max = pixelations.length - 1;
                if (pixelation > max) pixelation = max;

                value = pixelations[pixelation];
            }

            log(`drawing canvas image with pixelation ${value} (${pixelation})`, 'pixel');

            const ctx = canvas.getContext('2d');

            canvas.width = canvas_image.width;
            canvas.height = canvas_image.height;

            const scaled_width = canvas_image.width * value;
            const scaled_height = canvas_image.height * value;

            ctx.drawImage(canvas_image, 0, 0, scaled_width, scaled_height);

            ctx.imageSmoothingEnabled = false;

            ctx.drawImage(canvas, 0, 0, scaled_width, scaled_height, 0, 0, canvas_image.width, canvas_image.height);
        }

        function pixel_make_a_guess(guess) {
            if (clean_pixel_name(guess) == clean_pixel_name(name)) {
                status({
                    title: tl(trans.you_guessed_correctly)
                });

                timer_end(true);
                pixel_end();
            }
        }

        function clean_pixel_name(name) {
            return name
                .toLowerCase()
                .replace(/[‘’]/g, `'`)
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .trim();
        }

        function pixel_hint() {
            guess_input.focus();

            pixelation++;
            render_canvas();
        }

        function pixel_give_up() {
            timer_end();
            pixel_end();
        }

        function pixel_end() {
            title_elem.textContent = name;

            guess_input.disabled(true);
            guess_btn.disabled = true;

            render(actions, html`
                <button class="icon" data-type="pixel" onclick=${() => pixel_random()}>
                    ${tl(trans.continue)}
                </button>
            `);

            let i = 0.1;

            image_interval = setInterval(() => {
                pixelation = i;
                render_canvas(true);
                i += 0.1;

                if (i >= 1) clearInterval(image_interval);
            }, 50);
        }
    }
}

function shuffle_array(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function jumble_string(input) {
    let output = input
        .split(' ')
        .map(word => {
            if (!word) return '';
            const letters = word.split('');
            return shuffle_array(letters).join('');
        })
        .join(' ');

    if (output == input) return jumble_string(input);

    return output;
}
