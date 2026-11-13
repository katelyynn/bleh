import { tl, trans } from "@/build/trans";
import { modal } from "../dialog/dialog";

interface LyricsSnippetProps {
	lyrics: string;
	art?: string;
}

export function LyricsSnippet({
	lyrics,
	art
}: LyricsSnippetProps) {
	const segments = lyrics.split('\n\n').map(segment => segment.split('\n'));
	const lines = lyrics.split('\n\n').flatMap(segment => segment.split('\n'));

	const frequencies: Record<string, number[]> = {};

	lines.forEach((line, i) => {
		frequencies[line] ??= [];
		frequencies[line].push(i);
	});

	const repeated = Object.entries(frequencies)
		.filter(([line, i]) => i.length > 1)
		.sort((a, b) => b[1].length - a[1].length);

	const repeatedIndex = repeated[0]?.[1][0];

	const result = repeatedIndex == null
		? lines.slice(Math.floor(lines.length / 2) - 1, Math.floor(lines.length / 2) + 2)
		: lines.slice(
			Math.max(0, repeatedIndex - 1),
			repeatedIndex + 2
		);

	function open() {
		modal({
			id: 'lyrics',
			title: tl(trans.lyrics),
			body: (
				<div class='lyric-segments'>
					{segments.map(segment => (
						<LyricSegment lines={segment} />
					))}
				</div>
			)
		});
	}

	return (
		<div class='lyrics-snippet-btn' onClick={open}>
			<div class='lyric-segment-snippet'>
				{result.map(result => (
					<p class='lyric-line-snippet'>{result}</p>
				))}
			</div>
		</div>
	)
}

interface LyricSegmentProps {
	lines: string[];
}

function LyricSegment({
	lines
}: LyricSegmentProps) {
	return (
		<div class='lyric-segment'>
			{lines.map(line => (
				<p class='lyric-line'>
					{line}
				</p>
			))}
		</div>
	)
}
