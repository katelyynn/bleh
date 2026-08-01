import { log } from '@/build/log';
import { auth } from '@/build/page';
import { header_colour } from '../page/colour';

export async function register_auth() {
	const handler = document.body.querySelector('.site-auth > .auth-link');
	if (handler) {
		log('found handler', 'auth', 'info', { handler });

		const image = handler.querySelector(
			':scope > .auth-avatar-desktop',
		) as HTMLImageElement;
		if (!image) {
			log('no image found', 'auth', 'error', { handler });
			return;
		}

		const previous_avatar = auth.avatar;

		log('found image', 'auth', 'info', { image });

		auth.name = image.alt;
		auth.avatar = image.src;
		log(
			`registered avatar as ${auth.avatar}, name as ${auth.name}`,
			'auth',
			'info',
			{ previous_avatar, handler },
		);

		if (auth.avatar != previous_avatar) {
			image.setAttribute('crossorigin', 'anonymous');

			image.onload = async () => {
				const { hue, sat, lit } = await header_colour(image);

				auth.sets.hue = hue;
				auth.sets.sat = sat;
				auth.sets.lit = lit;
			};
		}

		return;
	}

	log('no handler found', 'auth', 'error');
}
