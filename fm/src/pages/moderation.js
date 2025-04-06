import { settings } from '../build/config';
import { log } from '../build/log';
import { page } from '../build/page';
import { custom_select } from '../components/select';
import { trans, tl } from '../build/trans';

export const blocklists = new Map();
unsafeWindow.blocklists = blocklists;

export function bleh_moderation() {
    let container = page.structure.main.querySelector('.block-list-selector');
    let selector = container.querySelector('select');

    custom_select(selector, container);

    reload();
}

export function load_moderation() {
    if (localStorage.getItem('bleh_moderation') == null) {
        // TODO: use github raw once this is live
        localStorage.setItem('bleh_moderation', JSON.stringify([
            {
                url: 'https://files.sad.ovh/public/bleh/b0_racist.txt',
                type: 'strings'
            },
            {
                url: 'https://files.sad.ovh/public/bleh/b4_sexual.txt',
                type: 'strings'
            }
        ]));
    }

    const blocklist = JSON.parse(localStorage.getItem('bleh_moderation'))
    blocklist.forEach(async z => {
        if (!blocklists.has(z.url)) {
            let body;

            try {
                const req = await fetch(z.url);
                body = await req.text();
                log('successfully loaded ' + z.url, 'moderation')

            } catch(e) {
                console.error(e)
                log('failed to load blocklist ' + z.url, 'moderation')
            }

            let parsed;
            if (z.type == 'strings') {
                parsed = body.split('\n');
            } else if (z.type == 'regex') {
                parsed = body.split('\n').map(z => new RegExp(z));
            }

            blocklists.set(z.url, {
                type: z.type,
                blocklist: parsed
            });
        }
    })
}

function reload() {
    const blocklists = document.getElementById('block-lists')
    blocklists.innerHTML = '';

    const blocklist = JSON.parse(localStorage.getItem('bleh_moderation'));
    blocklist.forEach(async (list, i) => {
        let entry = document.createElement('div');
        entry.classList.add('generic-table-list-entry');
        entry.innerHTML = (`
            <div class="text">
                <h5><a href="${list.url}" target="_blank">${list.url}</a></h5>
            </div>
            <div class="text-2">
                <p>${list.type}</p>
            </div>
            <div class="actions">
                <button class="delete icon delete-user-button danger-subtle" onclick="_remove_block_index(${i})">${tl(trans.remove)}</button>
            </div>
        `);

        blocklists.appendChild(entry);
    });

    load_moderation();
}

unsafeWindow._remove_block_index = (index) => {
    const blocklist = JSON.parse(localStorage.getItem('bleh_moderation'));

    const removed = blocklist.splice(index, 1)[0];

    localStorage.setItem('bleh_moderation', JSON.stringify(blocklist));
    blocklists.delete(removed.url);

    reload();
}

unsafeWindow._add_block = () => {
    const input = document.getElementById('block-list-input');
    const type = document.getElementById('block-list-type');

    if (!input.value) return;
    try {
        new URL(input.value.trim());
    } catch (_) {
        return;
    }

    const blocklist = JSON.parse(localStorage.getItem('bleh_moderation'));
    blocklist.push({
        url: input.value.trim(),
        type: type.value
    });
    localStorage.setItem('bleh_moderation', JSON.stringify(blocklist));

    reload();
    input.value = '';
}

export function clean_message(message, type) {
    if (!settings.enable_moderation) return message;

    const removal_method = settings.removal_method; // remove / censor
    const moderate_shouts = settings.moderate_shouts
    const moderate_bios = settings.moderate_bios;
    const moderate_artists = settings.moderate_artists;
    const moderate_albums = settings.moderate_albums;
    const moderate_tracks = settings.moderate_tracks;

    if (
        (type == 'shout' && !moderate_shouts) ||
        (type == 'bio' && !moderate_bios) ||
        (type == 'artist' && !moderate_artists) ||
        (type == 'album' && !moderate_albums) ||
        (type == 'track' && !moderate_tracks)
    ) {
        log(`type of ${type} is disabled`, 'moderation');
        return message;
    }

    let action = message.toLowerCase();

    blocklists.forEach((list) => {
        if (list.type == 'strings') {
            list.blocklist.forEach((word) => {
                if (action.includes(word)) {
                    if (removal_method == 'remove')
                        action = action.replace(word, '');
                    else if (removal_method == 'censor')
                        action = action.replace(word, '♡'.repeat(word.length));
                }
            })
        } else if (list.type == 'regex') {
            list.blocklist.forEach(regex => {
                if (regex.test(action)) {
                    if (removal_method == 'remove')
                        action = action.replace(regex, '');
                    else if (removal_method == 'censor')
                        action = action.replace(regex, '♡'.repeat(regex.length));
                }
            })
        }
    });

    return action;
}