import { log } from '@/build/log';
import { load_chart_colours } from '../music/chart';
import { clamp_lit, clamp_sat, hex_to_oklch } from '@/build/tools';

export function header_colour(header: HTMLElement, apply_to_page = false, apply_to_elem?: HTMLElement) {
    const header_inner = header.querySelector('.header-new-inner');
    if (!header_inner) return;

    try {
        let bg = header_inner.getAttribute('style').replace('background: #', '');
        let hsl = hex_to_oklch(bg);

        let sat = clamp_sat((hsl.s / 100) * 3);
        let lit = clamp_lit(sat, hsl.l / 100 + 0.35, true);

        if (apply_to_page) {
            document.body.style.setProperty('--hue-album', hsl.h);
            document.body.style.setProperty('--sat-album', sat);
            document.body.style.setProperty('--lit-album', lit);

            load_chart_colours();
        }

        if (apply_to_elem instanceof HTMLElement) {
            apply_to_elem.style.setProperty('--hue-over', hsl.h);
            apply_to_elem.style.setProperty('--sat-over', sat);
            apply_to_elem.style.setProperty('--lit-over', lit);
        }

        log(
            `sourced hsl of (${hsl.h}, ${hsl.s}, ${hsl.l}) - using final value of (${hsl.h}, ${sat}, ${lit})`,
            'hue from album'
        );
    } catch (e) {
        log('no cover present', 'hue from album');
    }
}