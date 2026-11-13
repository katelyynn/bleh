import { page } from "@/build/page";
import { download_with_progress, sanitise } from "@/build/tools";

export interface LrcLibResponse {
	id: number;
	name: string;
	trackName: string;
	artistName: string;
	albumName: string;
	duration: number;
	instrumental: boolean;
	hasWordSync: boolean;
	plainLyrics: string;
	syncedLyrics: string;
	lyricsfile: string;
}

export async function getLyrics(): Promise<LrcLibResponse> {
	const url = `https://lrclib.net/api/get?artist_name=${sanitise(page.sister, '+')}&track_name=${sanitise(page.name, '+')}`;

	try {
		const res = await download_with_progress(url, 'text');

		return JSON.parse(res.responseText);
	} catch (e) {
		console.error(e);
		throw e;
	}
}
