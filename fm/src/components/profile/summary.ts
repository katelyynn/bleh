import { page, root } from '@/build/page';
import { lang, tl, trans } from '@/build/trans';
import { html } from 'lighterhtml';
import { icon, icons } from '../shared/icon';
import tippy from 'tippy.js';

export function profile_summary(recent_tracks: Element | undefined, top_artists: Element | undefined) {
    let graph_blocks: HTMLElement[] = [];

    const panel = html.node`
        <section class="profile-summary">
            <div class="top-container">
                <h2>{v} scrobbles recently</h2>
            </div>
            <div class="summary-main">
                <div class="graph-blocks">
                    ${Array.from({ length: 30 }).map((_, i) => {
                        const elem = create_graph_block(i + 1);

                        graph_blocks.push(elem);

                        return elem;
                    })}
                </div>
            </div>
            <div class="summary-blocks">
                ${summary_block('scrobbles', page.state.scrobbles)}
                ${summary_block('artists', page.state.artists)}
                ${summary_block('loved', page.state.loved)}
            </div>
        </section>
    `;

    page.structure.main!.insertBefore(panel, page.structure.main!.firstChild);

    fetch_30_day();

    function fetch_30_day() {
        fetch(`${root}user/${page.name}/library/artists/chart?date_preset=LAST_30_DAYS&page=1&ajax=1`)
            .then((res) => {
                if (!res.ok) throw new Error();

                return res.text();
            })
            .then((dom) => {
                const doc = new DOMParser().parseFromString(dom, 'text/html');

                const table = doc.querySelector('table');
                if (!table) throw new Error();

                const entries = table.querySelectorAll('tbody tr');
                entries.forEach((entry, i) => {
                    const period = entry.querySelector('.js-period a')?.textContent.trim();
                    const value = Number(entry.querySelector('.js-scrobbles')?.textContent.trim());

                    const elem = graph_blocks[i];

                    if (value > 0) {
                        elem.classList.remove('empty');

                        const level = graph_block_level(value);

                        elem.classList.add(`level-${level}`);
                        //elem.textContent = level;
                    }

                    tippy(elem, {
                        content: `${period}: ${value}`
                    });
                });
            });
    }

    return;

    if (top_artists) {
        page.structure.main!.insertBefore(panel, top_artists);
    } else if (recent_tracks) {
        recent_tracks.after(panel);
    } else {
        page.structure.main!.insertBefore(panel, page.structure.main!.firstChild);
    }
}

function create_graph_block(index: number) {
    return html.node`
        <div class="graph-block empty" style="--delay: ${index * 0.04 + 's'}" />
    `;
}

function graph_block_level(value: number) {
    if (value <= 8) return 0;
    if (value <= 16) return 1;
    if (value <= 25) return 2;
    if (value <= 34) return 3;
    if (value <= 50) return 4;
    if (value <= 80) return 5;
    if (value <= 150) return 6;
    if (value <= 240) return 7;
    if (value <= 360) return 8;

    return 9;
}

function summary_block(type: string, value: number) {
    let text;
    let icon_name;

    if (type == 'scrobbles') {
        text = tl(trans.scrobbles);
        icon_name = icons.track;
    } else if (type == 'artists') {
        text = tl(trans.artists);
        icon_name = icons.artist;
    } else if (type == 'loved') {
        text = tl(trans.loved);
        icon_name = icons.loved;
    }

    return html.node`
        <div class="summary-block">
            <div class="summary-icon">
                ${icon({ name: icon_name, identifier: 'summary' })}
            </div>
            <div class="summary-info">
                <h3 class="summary-label">${text}</h3>
                <p class="summary-value">${value.toLocaleString(lang)}</p>
            </div>
        </div>
    `;
}