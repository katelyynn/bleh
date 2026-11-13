interface LyricsSnippetProps {
	lyrics: string;
	art?: string;
}

export function LyricsSnippet({
	lyrics,
	art
}: LyricsSnippetProps) {
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

	return (
		<div class='lyrics-snippet'>
			{result.map(result => (
				<p>{result}</p>
			))}
		</div>
	)
}
