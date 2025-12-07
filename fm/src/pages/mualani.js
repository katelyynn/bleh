//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { register_background, update_page } from '../page.js';
import { auth, page } from '../build/page.js';
import { log } from '../build/log.js';
import { checkup_page_structure } from '../components/structure.js';
import { html, render } from 'lighterhtml';
import { notify } from '../components/notify.js';
import { download_with_progress } from '../build/tools.js';
import { status } from '../components/status.js';
import { dialog } from '../components/dialog.js';
import { setting } from '../components/settings.js';
import { markdown, markdown_field } from '../components/markdown.js';

export function mualani() {
    page.structure.container = document.body.querySelector('.page-content');
    try {
        page.structure.row = page.structure.container.querySelector('.row');
        page.structure.main = page.structure.row.querySelector('.col-main');
        page.structure.side = page.structure.row.querySelector('.col-sidebar');
    } catch (e) {
        log('unable to find elements', 'page structure');
    }

    checkup_page_structure();

    register_background(auth.avatar.replace('/avatar42s/', '/ar0/'));

    page.type = 'bleh_mualani';
    page.subpage = '';

    log('status is', 'page', 'info', page);

    update_page();

    // remove error stuff cus we control this page
    page.structure.row.removeChild(page.structure.row.firstElementChild);
    page.structure.row.removeChild(page.structure.row.firstElementChild);

    let md_body;
    let md_options = {
        allow_headers: true,
        allow_banners: true,
        allow_icons: true,
        allow_hue: true,
        allow_fonts: true,
        allow_socials: true,
        allow_alignment: true,
        allow_lists: true
    };

    render(
        page.structure.main,
        html`
            <section class="flexy">
                <h2>Buttons</h2>
                <div class="flexy h">
                    <button>Button</button>
                    <button class="primary">Button</button>
                    <button disabled>Button</button>
                    <button class="primary" disabled>Button</button>
                </div>
                <div class="flexy h">
                    <button class="danger-subtle">Button</button>
                    <button class="primary danger">Button</button>
                    <button class="danger-subtle" disabled>Button</button>
                    <button class="primary danger" disabled>Button</button>
                </div>
            </section>
            <section class="flexy">
                <h2>Settings</h2>
                <div class="setting-group">
                    ${setting({ id: 'solarium' })} ${setting({ id: 'gloss' })}
                    ${setting({ id: 'expand_tracks' })}
                    ${setting({ id: 'romanise_jp' })}
                    ${setting({
                        id: 'navigation_items',
                        list: page.state.quick_access_items
                    })}
                </div>
            </section>
            <section class="flexy">
                <h2>Notifications</h2>
                <div class="flexy h">
                    <button
                        class="continue"
                        onclick=${() =>
                            notify({
                                id: 'test',
                                title: 'testing!',
                                body: 'haaaiaiii test bodyyy.......'
                            })}
                    >
                        Deliver notification
                    </button>
                    <button
                        class="continue"
                        onclick=${() =>
                            notify({
                                id: 'test',
                                title: 'testing!',
                                body: 'haaaiaiii test bodyyy.......',
                                persist: true
                            })}
                    >
                        Deliver persistent notification
                    </button>
                    <button
                        class="continue"
                        onclick=${() => {
                            let notification = notify({
                                id: 'async',
                                title: 'progress',
                                body: 'downloading...',
                                progress: true
                            });

                            download_with_progress(
                                `https://lastfm.freetls.fastly.net/i/u/ar0/6644c67eaa3669676252d3190f9b019f.jpg?a=${Math.random()}`,
                                (percent) => {
                                    notification.set_body(
                                        `downloading... ${percent}%`
                                    );
                                    notification.set(percent);
                                }
                            ).then(async (blob) => {
                                const text = await blob.text();

                                notification.set_body('download complete');
                                notification.set(100);

                                console.info(text);
                            });
                        }}
                    >
                        Deliver async progress notification
                    </button>
                </div>
            </section>
            <section class="flexy">
                <h2>Status alerts</h2>
                <button
                    class="continue"
                    onclick=${() =>
                        status({
                            title: 'test alert',
                            body: 'haiaiai nothing to worry about >_<'
                        })}
                >
                    Deliver status alert
                </button>
            </section>
            <section class="flexy">
                <h2>Modals</h2>
                <button class="continue" onclick=${() => dialog_loop()}>
                    Open dialog loop
                </button>
            </section>
            <section class="flexy">
                <h2>Markdown (with bio settings)</h2>
                ${markdown_field((val) => {
                    render(md_body, markdown(val, md_options));
                }, md_options)}
                <div class="sep" />
                <div class="markdown-body" ref=${el => md_body = el} />
            </section>
            <section class="flexy">
                <h2>Markdown (with defaults)</h2>
                ${markdown_field((val) => {
                    render(md_body_default, markdown(val));
                })}
                <div class="sep" />
                <div class="markdown-body" ref=${el => md_body_default = el} />
            </section>
        `
    );
}

function dialog_loop() {
    const num = Math.random();

    dialog({
        id: `loop_${num}`,
        title: num,
        body: html.node`
            <button onclick=${() => dialog_loop()}>Open a new dialog</button>
        `
    });
}
