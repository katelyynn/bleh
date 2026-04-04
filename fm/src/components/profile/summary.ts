import { page } from '@/build/page';
import { lang, tl, trans } from '@/build/trans';
import { html } from 'lighterhtml';
import { icon, icons } from '../shared/icon';

export function profile_summary(recent_tracks: Element | undefined, top_artists: Element | undefined) {
    const panel = html.node`
        <section class="profile-summary">
            <div class="top-container">
                <h2>{v} scrobbles recently</h2>
            </div>
            <div class="summary-main">
                <div class="graph-blocks">
                    ${Array.from({ length: 30 }).map((_, i) => create_graph_block(i + 1))}
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

    return;

    if (top_artists) {
        page.structure.main!.insertBefore(panel, top_artists);
    } else if (recent_tracks) {
        recent_tracks.after(panel);
    } else {
        page.structure.main!.insertBefore(panel, page.structure.main!.firstChild);
    }
}

function create_graph_block(index) {
    return html.node`
        <div class="graph-block">
            ${index}
        </div>
    `;
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