//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { html, render } from 'lighterhtml';
import { lang, lang_info, tl, trans } from './build/trans.js';
import { sponsor_list } from './build/sponsor.js';
import { root } from './build/page.js';
import { sponsor } from './sponsor.js';

export function bleh_footer() {
    let footer = document.body.querySelector('footer.footer');

    let extras = html.node`
        <div class="footer-extras">
            ${footer.querySelector('.footer-top')}
            ${footer.querySelector('.footer-bottom')}
        </div>
    `;

    let kate = 'katelyn';
    if (sponsor_list && sponsor_list.special) kate = sponsor_list.special[0];

    render(
        footer,
        html`
            <div class="footer-credit">
                <p>
                    ${{
                        html: tl(trans.made_with_love, {
                            u: `<a href="${root}user/${kate}">${kate}</a>`,
                            c: '<a href="https://github.com/katelyynn/bleh/graphs/contributors" target="_blank">',
                            '/c': '</a>',
                            h: `<span class="bleh-icon heart sponsor-related colourful">${tl(trans.love_lower)}</span>`
                        })
                    }}
                </p>
                ${lang != 'en' && lang in lang_info ?
                    html.node`
                        <p>
                            ${{
                                html: tl(trans.translations, {
                                    l: lang_info[lang].name,
                                    u: lang_info[lang].by
                                        .map(
                                            (user) =>
                                                `<a href="${root}user/${user}">${user}</a>`
                                        )
                                        .join(', ')
                                })
                            }}
                        </p>
                    `
                :   ''}
            </div>
            <div class="footer-web music-links">
                <a
                    class="music-link"
                    data-type="source"
                    href="https://github.com/katelyynn/bleh"
                    target="_blank"
                    >${tl(trans.view_source)}</a
                >
                <a
                    class="music-link"
                    data-type="issue"
                    href="https://github.com/katelyynn/bleh/issues/new/choose"
                    target="_blank"
                    >${tl(trans.report_issue)}</a
                >
                <a
                    class="more"
                    onclick=${() => extras.toggleAttribute('aria-expanded')}
                    ><span class="bleh-icon"
                /></a>
            </div>
            ${extras}
        `
    );

    let heart = footer.querySelector('.heart');
    heart.addEventListener('click', () => sponsor());
}
