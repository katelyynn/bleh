import { attr } from './api';

export interface chart_top_tracks {
	tracks: {
		track: chart_track[];
		'@attr': attr;
	};
}

export interface chart_track {
	name: string;
	duration: string;
	playcount: string;
	listeners: string;
	mbid: string;
	url: string;
	streamable: {
		'#text': string;
		fulltrack: string;
	};
	artist: {
		name: string;
		mbid: string;
		url: string;
	};
	image: [
		{
			'#text': string;
			size: string;
		},
		{
			'#text': string;
			size: string;
		},
		{
			'#text': string;
			size: string;
		},
		{
			'#text': string;
			size: string;
		},
	];
}
