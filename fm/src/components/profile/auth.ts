import { log } from "@/build/log";
import { auth } from "@/build/page";
import { clamp_lit, clamp_sat, rgb_to_oklch } from "@/build/tools";
import ColorThief from "color-thief-browser";

export function register_auth() {
    const handler = document.body.querySelector('.site-auth > .auth-link');
    if (handler) {
        log('found handler', 'auth', 'info', { handler });

        const image = handler.querySelector(':scope > .auth-avatar-desktop');
        if (!image) {
            log('no image found', 'auth', 'error', { handler });
            return;
        }

        const previous_avatar = auth.avatar;

        log('found image', 'auth', 'info', { image });

        auth.name = image.alt;
        auth.avatar = image.src;
        log(`registered avatar as ${auth.avatar}, name as ${auth.name}`, 'auth', 'info', { previous_avatar, handler });

        if (auth.avatar != previous_avatar) {
            image.setAttribute('crossorigin', 'anonymous');

            try {
                image.addEventListener('load', () => {
                    let thief = new ColorThief();
                    let colour = thief.getColor(image);

                    let hsl = rgb_to_oklch(colour[0], colour[1], colour[2]);

                    auth.sets.hue = hsl.h;
                    auth.sets.sat = clamp_sat((hsl.s / 100) * 3);
                    auth.sets.lit = clamp_lit(auth.sets.sat, hsl.l / 100 + 0.35, true);
                });
            } catch (e) {}
        }

        return;
    }

    log('no handler found', 'auth', 'error');
}
