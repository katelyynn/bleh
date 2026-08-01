import { root } from '@/build/page';
import { redirect } from '../music/music';
import { sanitise } from '@/build/tools';

export function taste_artist(artist: string) {
	return `<a class="taste-artist" href="${root}music/${redirect()}${
		sanitise(artist)
	}">${artist}</a>`;
}
