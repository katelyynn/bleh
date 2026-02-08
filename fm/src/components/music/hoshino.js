import { html } from 'lighterhtml';
import { log } from '../build/log';
import { ff } from '../sku';
import { set_storage } from '../build/tools';

export function hoshino(artwork, name, sister, link = null) {
    if (!ff('hoshino')) return;

    let oracle_cache =
        JSON.parse(localStorage.getItem('bleh_oracle_cache')) || {};

    const name_lower = name.toLowerCase();
    const sister_lower = sister.toLowerCase();

    const album_name = oracle_cache[sister_lower]?.[name_lower]?.track?.name;
    const album_sister =
        oracle_cache[sister_lower]?.[name_lower]?.track?.sister;
    const href = oracle_cache[sister_lower]?.[name_lower]?.track?.link;

    if (!album_name || !album_sister) {
        log('no cache to be used', 'hoshino', 'info', {
            artwork,
            name,
            sister,
            album: {
                album_name,
                album_sister,
                href
            }
        });
        return;
    }

    const art = load_hoshino_artwork(album_name, album_sister)?.artwork;

    artwork.src = art;
    log(`loaded cover art ${art}`, 'hoshino', 'info', {
        art,
        artwork,
        name,
        sister
    });

    artwork.setAttribute('data-hoshino', true);
    artwork.alt = album_name;

    if (link && href) {
        if (link.nodeName != 'A') {
            const new_link = html.node`
                <a href=${href} class=${link.classList} data-hoshino-recreated="true">
                    ${artwork}
                </a>
            `;
            link.parentElement.insertBefore(new_link, link);
            link.remove();
            return;
        }

        link.setAttribute('href', href);
    }
}

export function hoshino_return(name, sister) {
    if (!ff('hoshino')) return;

    let oracle_cache =
        JSON.parse(localStorage.getItem('bleh_oracle_cache')) || {};

    const name_lower = name.toLowerCase();
    const sister_lower = sister.toLowerCase();

    const album_name = oracle_cache[sister_lower]?.[name_lower]?.track?.name;
    const album_sister =
        oracle_cache[sister_lower]?.[name_lower]?.track?.sister;

    if (!album_name || !album_sister) {
        log('no cache to be used', 'hoshino', 'info', {
            name,
            sister,
            album: {
                album_name,
                album_sister
            }
        });
        return;
    }

    const art = load_hoshino_artwork(album_name, album_sister)?.artwork;

    return art;
}

export function load_hoshino_artwork(name, sister) {
    let hoshino_cache =
        JSON.parse(localStorage.getItem('bleh_hoshino_cache')) || {};

    const name_lower = name.toLowerCase();
    const sister_lower = sister.toLowerCase();

    const entry = hoshino_cache[sister_lower]?.[name_lower];

    log(`loaded artwork ${entry?.artwork} from cache`, 'hoshino', 'info', {
        entry,
        name,
        sister
    });
    return entry;
}

export function save_hoshino_artwork(artwork, name, sister, listeners = null) {
    let hoshino_cache =
        JSON.parse(localStorage.getItem('bleh_hoshino_cache')) || {};

    const name_lower = name.toLowerCase();
    const sister_lower = sister.toLowerCase();

    if (!hoshino_cache[sister_lower]) hoshino_cache[sister_lower] = {};
    if (!hoshino_cache[sister_lower][name_lower])
        hoshino_cache[sister_lower][name_lower] = {};

    if (!artwork || artwork.endsWith('c6f59c1e5e7240a4c0d427abd71f3dbb.jpg')) {
        if (artwork) delete hoshino_cache[sister_lower][name_lower].artwork;

        set_storage('bleh_hoshino_cache', JSON.stringify(hoshino_cache));
    } else {
        hoshino_cache[sister_lower][name_lower].artwork = artwork;
    }

    if (listeners)
        hoshino_cache[sister_lower][name_lower].listeners = listeners;

    log(`saved artwork ${artwork} to cache`, 'hoshino', 'info', {
        artwork,
        name,
        sister,
        listeners
    });
    set_storage('bleh_hoshino_cache', JSON.stringify(hoshino_cache));
}
