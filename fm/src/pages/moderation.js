import { settings } from "../build/config";
import { log } from "../build/log";

export const blocklists = new Map();
unsafeWindow.blocklists = blocklists;

export function bleh_moderation() {
    reload();
}

export function load_moderation() {
    if(localStorage.getItem("bleh_moderation") == null) {
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
        if(!blocklists.has(z.url)) {
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
            if(z.type == "strings") {
                parsed = body.split("\n").map(z => new RegExp(z, "ig"));
            } else if(z.type == "regex") {
                parsed = body.split("\n").map(z => new RegExp(z));
            }

            blocklists.set(z.url, {
                type: z.type,
                blocklist: parsed
            })
        }
    })
}

function reload() {
    const blocklistElement = document.getElementById("block-lists")
    blocklistElement.innerHTML = "";
    const blocklist = JSON.parse(localStorage.getItem("bleh_moderation"));
    blocklist.forEach(async (z,i) => {
        const elem = document.createElement("div")
        elem.className = "language-row";
        elem.innerHTML = `
                <div class="name">
          <h5>${z.url}</h5>
        </div>
        <div class="badges">
        <div class="new-badge">${z.type.substring(0,1).toUpperCase()+z.type.slice(1)}</div>
        </div>
        <div class="date">
          <button class="btn danger" onclick="_remove_block_index(${i})">Remove</button>
        </div>
        `
        blocklistElement.appendChild(elem)
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
unsafeWindow.clean_mesage = clean_message;
export function clean_message(message, type) {
    if(!settings.enable_moderation) return;
    const removal_method = settings.removal_method; // remove / censor
    const moderate_shouts = settings.moderate_shouts
    const censor_bios = settings.censor_bios;
    const censor_artist_names = settings.censor_artist_names;
    const censor_album_titles = settings.censor_album_titles;
    const censor_track_titles = settings.censor_track_titles;
    if(type == "shout" && !moderate_shouts) return;
    if(type == "bio" && !censor_bios) return;
    if(type == "artist_name" && !censor_artist_names) return;
    if(type == "album_title" && !censor_album_titles) return;
    if(type == "track_title" && !censor_track_titles) return;

    if(!["shout", "bio", "artist_name", "album_title", "track_title"].includes(type)) {
        console.error(`clean_message called with an invalid type: ${type}`);
        return;
    }

    let action = message;

    blocklists.forEach((v,k) => {
        if(v.type == "strings") {
            if(removal_method == "remove") {
                v.blocklist.forEach(z => {
                    action = action.replace(z, "");
                })
            } else if(removal_method == "censor") {
                v.blocklist.forEach(z => {
                    action = action.replace(z, "*".repeat(z.length));
                })
            }
        } else if(v.type == "regex") {
            if(removal_method == "remove") {
                v.blocklist.forEach(z => {
                    action = action.replace(z, "");
                })
            } else if(removal_method == "censor") {
                v.blocklist.forEach(z => {
                    action = action.replace(z, "*".repeat(z.length));
                })
            }
        }
    })
    return action;
}