import { settings } from "../build/config";
import { log } from "../build/log";
import { page } from "../build/page";
import { custom_select } from "../components/select";
import { trans, tl } from "../build/trans";

export const blocklists = new Map();
unsafeWindow.blocklists = blocklists;

export function bleh_moderation() {
    let container = page.structure.main.querySelector('.block-list-selector');
    let selector = container.querySelector('select');

    custom_select(selector, container);

    reload();
}

export function load_moderation() {
    if (localStorage.getItem("bleh_moderation") == null) {
        // TODO: use github raw once this is live
        localStorage.setItem("bleh_moderation", JSON.stringify([
            {
                url: "https://files.sad.ovh/public/bleh/b0_racist.txt",
                type: "strings"
            },
            {
                url: "https://files.sad.ovh/public/bleh/b4_sexual.txt",
                type: "strings"
            }
        ]));
    }

    const blocklist = JSON.parse(localStorage.getItem("bleh_moderation"))
    blocklist.forEach(async z => {
        if (!blocklists.has(z.url)) {
            let body;

            try {
                const req = await fetch(z.url);
                body = await req.text();
                log("successfully loaded " + z.url, "moderation")

            } catch(e) {
                console.error(e)
                log("failed to load blocklist " + z.url, "moderation")
            }

            let parsed;
            if (z.type == "strings") {
                parsed = body.split("\n");
            } else if (z.type == "regex") {
                parsed = body.split("\n").map(z => new RegExp(z));
            }

            blocklists.set(z.url, {
                type: z.type,
                blocklist: parsed
            });
        }
    })
}

function reload() {
    const blocklistElement = document.getElementById("block-lists")
    blocklistElement.innerHTML = "";
    const blocklist = JSON.parse(localStorage.getItem("bleh_moderation"));
    blocklist.forEach(async (z,i) => {
        const elem = document.createElement('div');
        elem.className = 'generic-table-list-entry';
        elem.innerHTML = `
        <div class="text">
            <h5><a href="${z.url}" target="_blank">${z.url}</a></h5>
        </div>
        <div class="text-2">
            <p>${z.type.substring(0,1).toUpperCase()+z.type.slice(1)}</p>
        </div>
        <div class="actions">
            <button class="delete icon delete-user-button danger-subtle" onclick="_remove_block_index(${i})">${tl(trans.remove)}</button>
        </div>
        `;
        blocklistElement.appendChild(elem);
    })
    load_moderation();
}

unsafeWindow._remove_block_index = (i) => {
    const blocklist = JSON.parse(localStorage.getItem("bleh_moderation"));
    const removed = blocklist.splice(i, 1)[0];
    localStorage.setItem("bleh_moderation", JSON.stringify(blocklist));
    blocklists.delete(removed.url);
    reload();
}

unsafeWindow._add_block = () => {
    const input = document.getElementById("block-list-input");
    const type = document.getElementById("block-list-type");
    if(!input.value.trim()) return;
    try {
        new URL(input.value.trim());
    } catch (_) {
        return;
    }

    const blocklist = JSON.parse(localStorage.getItem("bleh_moderation"));
    blocklist.push({ url: input.value.trim(), type: type.value });
    localStorage.setItem("bleh_moderation", JSON.stringify(blocklist));
    reload();
    input.value = "";
}

export function clean_message(message, type) {
    if(!settings.enable_moderation) return;
    const removal_method = settings.removal_method; // remove / censor
    const moderate_shouts = settings.moderate_shouts
    const censor_bios = settings.censor_bios;
    const censor_artist_names = settings.censor_artist_names;
    const censor_album_titles = settings.censor_album_titles;
    const censor_track_titles = settings.censor_track_titles;

    if(type == "shout" && !moderate_shouts) return;
    else if(type == "bio" && !censor_bios) return;
    else if(type == "artist_name" && !censor_artist_names) return;
    else if(type == "album_title" && !censor_album_titles) return;
    else if(type == "track_title" && !censor_track_titles) return;
    else log("clean_message being called with incorrect type of" + type, "moderation")
    let action = message.toLowerCase();

    blocklists.forEach((v,k) => {
        if(v.type == "strings") {
            v.blocklist.forEach(z => {
                if(action.includes(z)) {
                    if(removal_method == "remove") {
                        action = action.replace(z, "");
                    } else if(removal_method == "censor") {
                        action = action.replace(z, "*".repeat(z.length));
                    }
                }
            })
        } else if(v.type == "regex") {
            v.blocklist.forEach(z => {
                if(z.test(action)) {
                    if(removal_method == "remove") {
                        action = action.replace(z, "");
                    } else if(removal_method == "censor") {
                        action = action.replace(z, "*".repeat(z.length));
                    }
                }
            })
        }
    })
    return action;
}