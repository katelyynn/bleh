import { profile_cache } from '@/types/profile';

export function delete_cache(cache: profile_cache) {
	if (typeof cache != 'object') return;

	delete cache.avatar;
	delete cache.banner;
	delete cache.banner_orig;
	delete cache.hue;
	delete cache.sat;
	delete cache.lit;
	delete cache.font;
	delete cache.font_style;
	delete cache.username;
	//delete cache.aka;
	//delete cache.created;

	return cache;
}
