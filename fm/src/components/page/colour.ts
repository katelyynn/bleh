import { log } from '@/build/log';
import { chart_reflow, load_chart_colours } from '../music/chart';
import { clamp_lit, clamp_sat, rgb_to_hsl, rgb_to_oklch } from '@/build/tools';
import ColorThief from 'color-thief-browser';
import { page } from '@/build/page';
import { FastAverageColor } from 'fast-average-color';

export async function header_colour(source: HTMLImageElement, apply_to_page = false, apply_to_elem?: Element) {
    log('applying header colour', 'accent', 'info', { source, apply_to_page, apply_to_elem });
    apply(0, 0, 0.5, true);

    try {
        const image = new Image();
        image.width = 300;
        image.height = 300;
        image.crossOrigin = 'anonymous';
        image.src = source.src;

        image.onload = () => {
            const fac = new FastAverageColor();
            fac.getColorAsync(image)
                .then(colour => {
                    const values = colour.value;
                    let hsl = rgb_to_hsl(values[0], values[1], values[2]);

                    let hue = hsl.h;
                    let sat = clamp_sat((hsl.s / 100) * 3);
                    let lit = clamp_lit(sat, hsl.l / 100 + 0.35, true);

                    apply(hue, sat, lit);

                    log(
                        `sourced rgb of (${colour[0]}, ${colour[1]}, ${colour[2]}), hsl of (${hsl.h}, ${hsl.s}, ${hsl.l}) - using final value of (${hue}, ${sat}, ${lit})`,
                        'accent'
                    );
                })
                .catch(e => {
                    log('received error', 'accent', 'error', { e });
                });
        }
    } catch (e) {
        log('received error', 'accent', 'error', { e });
    }

    function apply(hue: number, sat: number, lit: number, skip = false) {
        if (apply_to_page && !skip) {
            page.state.replaced_accent = true;

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
    }
}
