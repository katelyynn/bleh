//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { html, render } from 'lighterhtml';
import { lang, lang_info, tl, trans } from '@/build/trans';
import { sponsor_list } from '@/build/sponsor.js';
import { root } from '@/build/page.js';
import { sponsor } from '@/components/sponsor';
import { version } from '@/main';

export function bleh_footer() {
    let footer = document.body.querySelector('footer.footer');

    let extras = html.node`
        <div class="footer-extras">
            ${footer.querySelector('.footer-top')}
            ${footer.querySelector('.footer-bottom')}
        </div>
    `;

    let kate = 'katelyn';
    let sponsoring = 0;

    if (sponsor_list) {
        if (sponsor_list.special)
            kate = sponsor_list.special[0];

        if (sponsor_list.sponsors && sponsor_list.sponsor_count_remove)
            sponsoring = sponsor_list.sponsors.length - sponsor_list.sponsor_count_remove;
    }

    render(
        footer,
        html`
            <div class="footer-bleh">
                <a class="bleh-logo-footer" href="https://bleh.katelyn.moe" target="_blank">
                    ${version.brand}
                </a>
            </div>
            <div class="footer-bleh-top">
                <div class="footer-credit">
                    <p>
                        ${{
                            html: tl(trans.made_with_love, {
                                u: `<a class="b" href="${root}user/${kate}">${kate}</a>`,
                                c: '<a class="b" href="https://github.com/katelyynn/bleh/graphs/contributors" target="_blank">',
                                '/c': '</a>',
                                h: `<span class="bleh-icon heart sponsor-related colourful">${tl(trans.love_lower)}</span>`
                            })
                        }}
                    </p>
                    <p>
                        <a onclick=${() => sponsor()}>${{ html: tl(trans.supported_by, { c: sponsoring, s: '<span class="b">', '/s': '</span>' }) }}</a>
                    </p>
                </div>
                <div class="footer-web">
                    <a
                        class="footer-link"
                        data-type="source"
                        href="https://github.com/katelyynn/bleh"
                        target="_blank"
                        >${tl(trans.view_source)}</a
                    >
                    <a
                        class="footer-link"
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
            </div>
            ${lang != 'en' && lang in lang_info ? html.node`
                <div class="footer-bleh-top">
                    <div class="footer-credit">
                        <p>
                            ${{
                                html: tl(trans.translations, {
                                    l: lang_info[lang].name,
                                    u: `<span class="b">${lang_info[lang].by.map(user => `<a href="${root}user/${user}">${user}</a>`).join(', ')}</span>`
                                })
                            }}
                        </p>
                    </div>
                </div>
            ` : ''}
            ${extras}
        `
    );

    let heart = footer.querySelector('.heart');
    heart.addEventListener('click', () => sponsor());
}
