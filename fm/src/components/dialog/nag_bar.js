//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { settings } from '../build/config';
import { page } from '../build/page';
import { tl, trans } from '../build/trans';
import { notify } from './notify';

export function nag_bar() {
    /*if (!page.structure.nag_bar) {
        page.structure.nag_bar = document.body.querySelector('#redirect-bar');
        console.info('nag', page.structure.nag_bar);

        if (!page.structure.nag_bar)
            return;
    }*/

    let nags = page.structure.wrapper.querySelectorAll('.nag-bar');
    nags.forEach((active_nag) => {
        let type = active_nag.classList[1];

        if (type == 'nag-bar--corrections') {
            if (!settings.travis) {
                notify({
                    id: 'corrections',
                    title: tl(trans.redirected_from),
                    body: active_nag.querySelector('strong'),
                    icon: 'icon-16-refresh',
                    long: true
                });
            }
        } else {
            // TODO
            return;
        }

        active_nag.parentElement.removeChild(active_nag);
    });
}
