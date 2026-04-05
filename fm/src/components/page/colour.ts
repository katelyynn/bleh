import { log } from '@/build/log';
import { chart_reflow, load_chart_colours } from '../music/chart';
import { clamp_lit, clamp_sat, rgb_to_hsl, rgb_to_oklch } from '@/build/tools';
import ColorThief from 'color-thief-browser';

export function header_colour(source: HTMLImageElement, apply_to_page = false, apply_to_elem?: HTMLElement) {
    try {
        source.onload = () => {
            let thief = new ColorThief();
            let colour = thief.getColor(source);

            let hsl = rgb_to_oklch(colour[0], colour[1], colour[2]);

            let hue = hsl.h;
            let sat = clamp_sat((hsl.s / 100) * 3);
            let lit = clamp_lit(sat, hsl.l / 100 + 0.35, true);

            if (apply_to_page) {
                document.body.style.setProperty('--hue-album', hue);
                document.body.style.setProperty('--sat-album', sat);
                document.body.style.setProperty('--lit-album', lit);

                chart_reflow();
            }

            if (apply_to_elem instanceof HTMLElement) {
                apply_to_elem.style.setProperty('--hue-over', hue);
                apply_to_elem.style.setProperty('--sat-over', sat);
                apply_to_elem.style.setProperty('--lit-over', lit);
            }

            log(
                `sourced hsl of (${hsl.h}, ${hsl.s}, ${hsl.l}) - using final value of (${hue}, ${sat}, ${lit})`,
                'hue from album'
            );
        }
    } catch (e) {
        log('received error', 'hue from album', 'error', { e });
    }
}