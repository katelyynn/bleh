//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { settings } from '@/build/config';
import { page } from '@/build/page';
import { tl, trans } from '@/build/trans.ts';
import { correct_artist, correct_item_by_artist } from '@/components/music/lotus';
import { html } from 'lighterhtml';
import tippy from 'tippy.js';
import { DateTime } from 'luxon';
import { setting } from '@/components/settings/settings';

export function bleh_charts() {
    if (page.subpage != 'overview') return;

    let charts = page.structure.main.querySelector('.charts');
    charts.classList.add('legacy-charts');
    let chart_rows = charts.querySelectorAll(
        '.charts-col:not(.charts-col--mobile-ad)'
    );

    let new_panel = document.createElement('section');
    new_panel.classList.add('charts-panel');

    let out_now = page.structure.side.querySelector(
        '.more-link-fullwidth-right a'
    );
    if (out_now) out_now.classList.add('btn', 'out-now-btn', 'icon', 'icon-r');

    let header = html.node`
        <div class="charts-header top-header">
            <div class="left">

            </div>
            <div class="middle">
                <div class="sub-text">${DateTime.now().toLocaleString(DateTime.DATE_FULL)}</div>
                <h2>${tl(trans.charts)}</h2>
            </div>
            <div class="right">
                <div class="view-buttons">
                    <button class="btn view-item icon glacier-configure-button panel-settings-button">
                        ${tl(trans.settings)}
                    </button>
                </div>
            </div>
        </div>
    `;
    new_panel.appendChild(header);

    let settings_btn = header.querySelector('.panel-settings-button');

    tippy(settings_btn, {
        theme: 'window',
        content: html.node`
            <div class="dialog-settings">
                <div class="setting-group blend">
                    ${setting({ id: 'simulate_scroll' })}
                </div>
            </div>
        `,
        placement: 'bottom',
        interactive: true,
        interactiveBorder: 10,
        trigger: 'click'
    });

    chart_rows.forEach((row, index) => {
        let chart_row = html.node`
            <div class="charts-new-row" data-index=${index}>
                ${row.querySelector('h2')}
            </div>
        `;

        let list = html.node`
            <ol class="music-bookmarks-artists charts-list" />
        `;

        if (settings.simulate_scroll) {
            list.addEventListener('wheel', (e) => {
                e.preventDefault();

                if (e.deltaY > 0) {
                    list.scrollBy({
                        top: 0,
                        left: +600,
                        behavior: 'smooth'
                    });
                } else {
                    list.scrollBy({
                        top: 0,
                        left: -600,
                        behavior: 'smooth'
                    });
                }
            });
        }

        let items = row.querySelectorAll('.globalchart-item');
        items.forEach((item, item_index) => {
            let list_item;

            let image = item.querySelector('.globalchart-image img');
            let rank = item.querySelector('.globalchart-rank');
            let name = item.querySelector('.globalchart-name a');

            let link = name.getAttribute('href');

            image.setAttribute(
                'src',
                image.getAttribute('src').replace('/avatar70s/', '/avatar300s/')
            );

            if (index == 1) {
                name.textContent = correct_artist(name.textContent);

                list_item = html.node`
                    <li class="music-bookmarks-artists-item-wrap charts-list-item">
                        <div class="music-bookmarks-artists-item charts-list-item-inner">
                            <div class="charts-list-rank">${rank.textContent.trim()}</div>
                            <h3 class="music-bookmarks-artists-item-name">
                                ${name}
                            </h3>
                            <div class="media-item">
                                <span class="music-bookmarks-albums-item-image cover-art">
                                    ${image}
                                </span>
                                <div class="charts-list-rank-overlay-wrap">
                                    <div class="charts-list-rank-overlay">
                                        <span class="rank-overlay-text">${rank.textContent}</span>
                                        <span class="rank-overlay-back">${rank.textContent}</span>
                                    </div>
                                </div>
                            </div>
                            <a class="link-block-cover-link" href=${link}></a>
                        </div>
                    </li>
                `;
            } else {
                let artist = item.querySelector(
                    '.globalchart-track-artist-name a'
                );
                artist.textContent = correct_artist(artist.textContent);
                name.textContent = correct_item_by_artist(
                    name.textContent,
                    artist.textContent
                );

                list_item = html.node`
                    <li class="music-bookmarks-albums-item-wrap charts-list-item">
                        <div class="music-bookmarks-albums-item charts-list-item-inner">
                            <div class="charts-list-rank">${rank.textContent.trim()}</div>
                            <h3 class="music-bookmarks-albums-item-name">
                                ${name}
                            </h3>
                            <p class="music-bookmarks-albums-item-artist">
                                ${artist}
                            </p>
                            <div class="media-item">
                                <span class="music-bookmarks-albums-item-image cover-art">
                                    ${image}
                                </span>
                                <div class="charts-list-rank-overlay-wrap">
                                    <div class="charts-list-rank-overlay">
                                        <span class="rank-overlay-text">${rank.textContent}</span>
                                        <span class="rank-overlay-back">${rank.textContent}</span>
                                    </div>
                                </div>
                            </div>
                            <a class="link-block-cover-link" href=${link}></a>
                        </div>
                    </li>
                `;
            }

            list.appendChild(list_item);
        });

        chart_row.appendChild(list);

        new_panel.appendChild(chart_row);
    });

    page.structure.main.insertBefore(
        new_panel,
        page.structure.main.firstElementChild
    );
}
