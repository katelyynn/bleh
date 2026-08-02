import { log } from '@/build/log';
import { chart_reflow } from '../music/chart';
import { clamp_lit, clamp_sat, rgb_to_hsl } from '@/build/tools';
import { page } from '@/build/page';
import { fac } from '@/main';

export async function header_colour(
	source: HTMLImageElement,
	apply_to_page = false,
	apply_to_elem?: Element[],
) {
	if (!apply_to_elem) apply_to_elem = [];

	log('applying header colour', 'accent', 'info', {
		source,
		apply_to_page,
		apply_to_elem,
	});
	apply(0, 0, 0.5, true);

	try {
		const image = new Image();
		image.width = 300;
		image.height = 300;
		image.crossOrigin = 'anonymous';

		await new Promise<void>((resolve, reject) => {
			image.onload = () => resolve();
			image.onerror = reject;
			image.src = source.src;
		});

		const colour = await fac.getColorAsync(image);

		const values = colour.value;
		const hsl = rgb_to_hsl(values[0], values[1], values[2]);

		const hue = hsl.h;
		const sat = clamp_sat((hsl.s / 100) * 3);
		const lit = clamp_lit(sat, hsl.l / 100 + 0.35, true);

		apply(hue, sat, lit);

		log(
			`sourced rgb of (${colour[0]}, ${colour[1]}, ${
				colour[2]
			}), hsl of (${hsl.h}, ${hsl.s}, ${hsl.l}) - using final value of (${hue}, ${sat}, ${lit})`,
			'accent',
		);

		return { hue, sat, lit };
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

		if (apply_to_elem.length > 0) {
			apply_to_elem.forEach((elem) => {
				if (!(elem instanceof HTMLElement)) return;

				elem.style.setProperty('--hue-over', hue);
				elem.style.setProperty('--sat-over', sat);
				elem.style.setProperty('--lit-over', lit);
			});
		}
	}
}
