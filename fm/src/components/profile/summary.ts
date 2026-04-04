import { page } from '@/build/page';
import { html } from 'lighterhtml';

export function profile_summary(recent_tracks: Element | undefined, top_artists: Element | undefined) {
    const panel = html.node`
        <p>${page.name} summary</p>
    `;

    if (top_artists) {
        page.structure.main!.insertBefore(panel, top_artists);
    } else if (recent_tracks) {
        recent_tracks.after(panel);
    } else {
        page.structure.main!.insertBefore(panel, page.structure.main!.firstChild);
    }
}