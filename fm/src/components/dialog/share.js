//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import {html} from "lighterhtml";
import {notify} from "./notify";
import {dialog} from "./dialog.js";
import {tl, trans} from "../build/trans.js";
import {log} from "../build/log.js";

export function share(url) {
    let input;
    dialog({
        id: 'share',
        title: tl(trans.share),
        body: html.node`
            <div class="share-top content-form">
                <input
                    type="text"
                    readonly
                    value=${url}
                    class="share-input"
                    ref=${el => input = el}
                />
                <button 
                    class="btn primary icon copy"
                    onclick=${() => {
                        input.select();
                        document.execCommand('copy');
                        notify({
                            title: tl(trans.copied_to_clipboard),
                            icon: 'icon-16-copy'
                        });
                    }}
                >${tl(trans.copy)}</button>
            </div>
            <div class="share-links">
                <a 
                    href=${`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`}
                    target="_blank"
                    class="share-link share-link-twitter"
                >Twitter</a>
                <a 
                    href=${`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
                    target="_blank"
                    class="share-link share-link-facebook"
                >Facebook</a>
            </div>
        `,
        replace_if_possible: true
    });
}

export function download(url, filename=null) {
    log(`downloading ${filename}`, 'download');

    let link = html.node`
        <a href=${url} download />
    `;

    if (filename)
        link.setAttribute('download', filename);

    link.click();
    notify({
        id: 'downloaded',
        title: tl(trans.downloaded),
        body: filename,
        icon: 'icon-16-download'
    });
}
