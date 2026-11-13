interface LrcLibResponse {
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
