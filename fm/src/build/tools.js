//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { log } from './log.js';
import { notify } from '../components/notify.js';
import { tl, trans } from './trans.js';
import { settings } from './config.js';
import { html } from 'lighterhtml';
import { root } from './page.js';
import * as wanakana from 'wanakana';
import * as hangulRomanization from 'hangul-romanization';
import { DateTime } from 'luxon';
import { status } from '../components/status.js';

// https://stackoverflow.com/questions/46432335/hex-to-hsl-convert-javascript
/**
 * Converts hex to {h, s, l}
 * @param {string} hex
 * @returns {{h: number, s: number, l: number}}
 */
export function hex_to_hsl(hex) {
    let result = new RegExp(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i).exec(
        hex
    );

    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);

    ((r /= 255), (g /= 255), (b /= 255));
    let max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h,
        s,
        l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    h = Math.round(h * 360);
    s = round_two(s * 100);
    l = round_two(l * 100);

    console.log('converted', hex, 'to', h, s, l);

    return {
        h: h,
        s: s,
        l: l
    };
}

/**
 * Converts (r, g, b) to {h, s, l}
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {{h: number, s: number, l: number}}
 */
export function rgb_to_hsl(r, g, b) {
    let hex = rgb_to_hex(r, g, b);
    return hex_to_hsl(hex);
}

/**
 * Converts (r, g, b) to hex
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {string}
 */
export function rgb_to_hex(r, g, b) {
    return '#' + comp_to_hex(r) + comp_to_hex(g) + comp_to_hex(b);
}
// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb#5624139
function comp_to_hex(comp) {
    let hex = comp.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
}

/**
 * Clamps maximum saturation to 1.5
 * @param {number} sat
 * @returns {number}
 */
export function clamp_sat(sat) {
    if (sat > 1.5) return 1.5;

    return round_two(sat);
}

export function clamp_lit(sat, lit) {
    if (sat >= 1.3 && lit < 0.8) return 0.8;

    return round_two(lit);
}

export function round_two(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Removes commas and dots from a string and returns the number
 * @param {string} string
 * @returns {number}
 */
export function clean_number(string) {
    if (!string) return 0;

    return int(string.replaceAll(',', '').replaceAll('.', ''));
}

/**
 * Sanitise text for use in URLs
 * @param {string} text - Text to sanitise
 * @param {string} method - String to replace spaces with, defaults to '+'
 * @returns {string}
 * @see desanitise
 */
export function sanitise(text, method = '+') {
    return encodeURIComponent(text)
        .replaceAll('%2B', '%252B')
        .replaceAll('%20', method);
}

/**
 * Aggressive text sanitisation to prevent XSS
 * @param {string} text - Text to sanitise
 * @returns {string}
 */
export function sanitise_text(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Desanitise text from URLs
 * @param {string} text - Sanitised text
 * @param {string} method - String spaces were replaced with, defaults to '+'
 * @returns {string}
 * @see sanitise
 */
export function desanitise(text, method = '+') {
    return decodeURIComponent(text.replaceAll(method, '%20')).replaceAll(
        '%252B',
        '+'
    );
}

/**
 * Return the artist from an album or track URL
 * @param {string} url - Link to an album or track
 * @param {boolean} is_album - Is this an album?
 * @returns {string}
 * @see return_artist_from_generic
 */
export function return_artist_from_track(url, is_album) {
    let split = url.split('/');
    let length = split.length - 1;

    let desanitised;

    if (is_album) desanitised = desanitise(split[length - 1]);
    else desanitised = desanitise(split[length - 2]);

    // for some reason last.fm double-encodes urls sometimes,
    // leading to the % being encoded as %25 (very stupid)
    let passes = 0;
    while (/%[0-9A-Fa-f]{2}/.test(desanitised) && passes < 5) {
        desanitised = desanitise(desanitised);
        passes++;
    }

    return desanitised;
}

/**
 * Returns the artist from a URL of an unknown type (album or track)
 * @param {string} url - Link to an album or track
 * @returns {string}
 * @see return_artist_from_track
 */
export function return_artist_from_generic(url) {
    let split = url.split('/');
    let length = split.length - 1;

    // artist/_/name in the url means it is a track
    if (split[length - 1] != '_') return desanitise(split[length - 1]);
    else return desanitise(split[length - 2]);
}

/**
 * Interpolates a hue value to transition smoothly around the hsl 360 scale
 * @param current
 * @param next
 * @param proximity
 * @returns {number}
 */
export function interpolate_hue(current, next, proximity) {
    // normalise
    current = ((current % 360) + 360) % 360;
    next = ((next % 360) + 360) % 360;

    let diff = next - current;

    // choose the shortest path
    if (diff > 180) {
        // go counter-clockwise instead
        diff -= 360;
    } else if (diff < -180) {
        // go clockwise instead
        diff += 360;
    }

    let interpolated = current + diff * proximity;

    // normalise once more
    return ((interpolated % 360) + 360) % 360;
}

/**
 * Lazy loads an element by waiting until the user scrolls into view
 * @param {HTMLElement} elem - Element
 * @param {Function} func - Function when the element is scrolled into view
 * @param {Object} options - Any options to pass
 */
export function lazy(elem, func, options = {}) {
    const { threshold = 0.1, rootMargin = '50px' } = options;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    log('now allowing load', 'lazy', 'info', {
                        elem: elem,
                        options: options
                    });
                    func(elem);
                    observer.unobserve(elem);
                }
            });
        },
        { threshold, rootMargin }
    );

    observer.observe(elem);
}

/**
 * Copies text to the clipboard
 * @param {string} text
 */
export function copy(text, silent = false) {
    if (text.trim().length == 0) return;

    navigator.clipboard.writeText(text).then(() => {
        log('copied', 'copy', 'info', { text });
        status({
            id: 'copy',
            title: tl(trans.copied_to_clipboard),
            body: text
        });
    });
}

export function undo() {
    document.execCommand('undo');
}

export function redo() {
    document.execCommand('redo');
}

export function cut() {
    document.execCommand('cut');
}

export async function paste(elem = null, silent = false) {
    try {
        const text = await navigator.clipboard.readText();
        if (!elem) elem = document.activeElement;

        if (!elem) return log('no element', 'paste', 'error');

        if (elem.isContentEditable) {
            document.execCommand('insertText', false, text);
            log('pasted', 'paste', 'info', { text });

            if (!silent) {
                status({
                    id: 'paste',
                    title: tl(trans.pasted_text),
                    body: text
                });
            }

            return;
        }

        if (['INPUT', 'TEXTAREA'].includes(elem.tagName)) {
            const start = elem.selectionStart;
            const end = elem.selectionEnd;

            elem.setRangeText(text, start, end, 'end');
            log('pasted', 'paste', 'info', { text });

            if (!silent) {
                status({
                    id: 'paste',
                    title: tl(trans.pasted_text),
                    body: text
                });
            }
        }
    } catch(e) {
        log('failed', 'paste', 'info', { text, e });

        if (!silent) {
            status({
                id: 'paste',
                title: tl(trans.failed),
                body: e.message ? e.message : e
            });
        }
    }
}

export function download_with_progress(url, func) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';

        xhr.onprogress = (event) => {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                func(percent);
                log(`downloading ${percent}%`, 'download', 'info', {
                    url: url
                });
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.response);
                log(`downloaded ${url}`, 'download');
            } else {
                reject(new Error(`download failed: ${xhr.status}`));
                log(`download failed: ${xhr.status}`, 'download', 'error', {
                    url: url
                });
            }
        };

        xhr.onerror = () => {
            reject(new Error('network error'));
            log('network error', 'download', 'error', { url: url });
        };
        xhr.send();
    });
}

export function pad2(num) {
    return String(num).padStart(2, '0');
}

export function convert_gif_to_png(url) {
    const available_hosts = ['www.last.fm', 'lastfm.freetls.fastly.net'];

    const link = new URL(url, `https://www.last.fm${root}`);

    if (!available_hosts.includes(link.hostname))
        return Promise.reject(
            new Error('url is not in valid hosts list: ' + link.hostname)
        );

    return new Promise((resolve, reject) => {
        const image = html.node`
            <img crossorigin="anonymous" src=${url}>
        `;
        console.info('image', image);

        image.onload = () => {
            const canvas = html.node`
                <canvas width=${image.width} height=${image.height} />
            `;
            console.info('image canvas', canvas);

            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };

        image.onerror = reject;
    });
}

export function control_gif_pause(image, override = false) {
    if (!image) return;

    let processed = image.getAttribute('data-gif-pause');
    if (processed) return;
    image.setAttribute('data-gif-pause', 'true');

    let setting = settings.static_gifs;
    if (override) setting = 'never';

    if (setting == 'always') return;

    const original = image.src;

    convert_gif_to_png(original)
        .then((paused) => {
            if (setting == 'never') {
                image.src = paused;
                return;
            }

            image.addEventListener('mouseenter', () => {
                image.src = original;
            });

            image.addEventListener('mouseleave', () => {
                image.src = paused;
            });

            image.src = paused;
            log('processed url', 'image', 'log', { original, paused });
        })
        .catch((e) => {
            log('failed to process url', 'image', 'error', { original });
            console.error(e);
        });
}

export function is_link_external(url) {
    try {
        const link = new URL(url, window.location.origin);
        return link.hostname != window.location.hostname;
    } catch {
        return false;
    }
}

export function romanise(text) {
    // japanese
    if (/[\u30A0-\u30FF\u3040-\u309F]/.test(text) && settings.romanise_jp)
        return title_case(wanakana.toRomaji(text));

    // korean
    if (/[\uAC00-\uD7AF]/.test(text) && settings.romanise_ko)
        return title_case(hangulRomanization.convert(text));

    return text;
}

export function title_case(text) {
    return text
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export function int(num) {
    return parseInt(num.replace(/\u00A0/g, ''));
}

export function time(string = '') {
    if (string == '') string = new Date().toString();

    const date = DateTime.fromJSDate(new Date(string));

    return date.toFormat('HH:mm:ss Z');
}

export function int_from_string(string) {
    const match = string.match(/[\d.,\s\u00A0\u202F]+/);
    if (match) return clean_number(match[0]);

    return string;
}

export function set_storage(key, val) {
    try {
        localStorage.setItem(key, val);
        log(`set ${key}`, 'storage', 'info', { key, val });
    } catch (e) {
        log(`failed to set ${key}`, 'storage', 'error', { key, val, e });
        console.error(e);
        notify({
            id: 'storage',
            title: `Failed to set ${key}`,
            body: e.message ? e.message : e,
            type: 'error',
            persist: true
        });
    }
}

export function year_from_date(string) {
    const match = string.match(/\b(\d{4})\b/);

    return match ? match[1] : 0;
}
