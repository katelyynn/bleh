import { page, root } from '@/build/page';
import { html } from 'lighterhtml';
import { avatar, expand_avatar } from '../shared/avatar';
import { settings } from '@/build/config';
import { sanitise } from '@/build/tools';
import { redirect } from './music';
import tippy from 'tippy.js';
import { tl, trans } from '@/build/trans';
import { register_menu } from '../menu';

export function page_header_avatar(url?: string) {
    const supports_gallery = ['artist', 'album'].includes(page.type);

    let link = sanitise(page.name);
    if (page.type != 'artist')
        link = `${sanitise(page.sister)}/${sanitise(page.name)}`;

    let action = 'expand';
    if (supports_gallery)
        action = settings.default_avatar_action as string;

    const elem = html.node`
        <div class="page-header-avatar" onclick=${() => {
            if (!url) return;

            if (action == 'expand') {
                expand_avatar(avatar(url, 'ar0'));
            } else if (action == 'gallery') {
                open(`${root}music/${redirect()}${link}/+images`);
            }
        }}>
            ${url ? html.node`
                <img src=${avatar(url, 'avatar300s')}>
            ` : html.node`
                <div class="missing-${page.type}" />
            `}
        </div>
    `;

    const menu = tippy(elem, {
        theme: 'context-menu',
        content: html.node`
            ${url ? html.node`
                <button class="dropdown-menu-clickable-item" data-type="expand" onclick=${() => expand_avatar(avatar(url, 'ar0'))}>
                    ${tl(trans.expand)}
                </button>
            ` : ''}
            ${supports_gallery ? html.node`
                <a class="dropdown-menu-clickable-item" data-type="gallery" href="${root}music/${redirect()}${link}/+images">
                    ${tl(trans.photos)}
                </a>
                <div class="sep"></div>
                <a class="dropdown-menu-clickable-item" href="${root}bleh/customise" data-menu-item="settings">
                    ${tl(trans.settings)}
                </a>
            ` : ''}
        `,
        placement: 'right-start',
        trigger: 'manual',
        interactive: true,
        interactiveBorder: 10,
        offset: [0, 0],

        onShow(instance) {
            instance.popper.addEventListener('click', (event) => {
                instance.hide();
            });
    }});

    register_menu(elem, menu);

    return elem;
}