import { tl, trans } from "@/build/trans";
import { modal } from "../dialog/dialog";
import { Icon, icons } from "../shared/icon";
import { WithChildren } from "@/types/generic";
import { createRef, Ref } from "jsx-dom";
import { CardTip } from "../text/tip";
import { Input } from "../input/input";
import { copy, romanise, sanitise } from "@/build/tools";
import { SettingCheckbox } from "../settings/provider/checkbox";
import { useSettings } from "@/page";
import { log } from "@/build/log";
import { getLyrics } from "./retrieve";
import { Alert } from "../text/alert";
import { page } from "@/build/page";
import { correct_item_by_artist } from "../music/lotus";

interface LyricsSnippetProps {
	lyrics: string;
	id?: number;
	art?: string;
}

export function LyricsSnippetPlaceholder({
	children,
	ref
}: WithChildren) {
	return (
		<div class='lyrics-snippet-btn' ref={ref as Ref<HTMLDivElement>}>
			<div class='lyrics-snippet-placeholder'>
				{!children ? (
					<>
						<Icon name={icons.spinner} />
						{tl(trans.loading_lyrics)}
					</>
				) : children}
			</div>
		</div>
	);
}

function handleLyrics(lyrics: string) {
	lyrics = lyrics.replace(/^\[offset:-?\d+\]\s*/, '').trim();

	const segments = lyrics.split('\n\n').map(segment => segment.split('\n'));
	const lines = lyrics.split('\n\n').flatMap(segment => segment.split('\n'));

	return { segments, lines };
}

export function LyricsSnippet({
	lyrics,
	id,
	art
}: LyricsSnippetProps) {
	const { segments, lines } = handleLyrics(lyrics);

	const frequencies: Record<string, number[]> = {};

	lines.forEach((line, i) => {
		frequencies[line] ??= [];
		frequencies[line].push(i);
	});

	console.info('lyrics', segments, lines);

	const repeated = Object.entries(frequencies)
		.filter(([line, i]) => i.length > 1)
		.sort((a, b) => b[1].length - a[1].length);

	const repeatedIndex = repeated[0]?.[1][1] || repeated[0]?.[1][0];

	const result = repeatedIndex == null
		? lines.slice(Math.floor(lines.length / 2) - 1, Math.floor(lines.length / 2) + 2)
		: lines.slice(
			Math.max(0, repeatedIndex - 1),
			repeatedIndex + 2
		);

	function open() {
		lyricsModal(segments, page.name, page.sister, id);
	}

	const inner = createRef();
	const elem = (
		<div class='lyrics-snippet-btn' onClick={open}>
			<div class='lyric-segment-snippet' ref={inner} />
		</div>
	);

	function render() {
		inner.current.replaceChildren(
			<>
				{result.map(line => {
					if (useSettings.get('romanise_lyrics')) {
						line = romanise(line, true);
					}

					return (
						<p class='lyric-line-snippet'>
							<LyricLineInner line={line} />
						</p>
					);
				})}
			</>
		);
	}

	render();
	useSettings.on('romanise_lyrics', () => render());

	return elem;
}

export async function lyricsFromMenu(name: string, artist: string) {
	try {
		log('requesting', 'lyrics');
		const res = await getLyrics(name, artist);

		if (!res) {
			modal({
				id: 'lyrics',
				title: tl(trans.lyrics),
				body: (
					<Alert type='error'>{tl(trans.no_lyrics)}</Alert>
				)
			});
			return;
		}

		if (res.plainLyrics == 'x') {
			modal({
				id: 'lyrics',
				title: tl(trans.lyrics),
				body: (
					<Alert type='error'>{tl(trans.lyrics_instrumental)}</Alert>
				)
			});
			return;
		}

		const { segments } = handleLyrics(res.plainLyrics);

		lyricsModal(segments, name, artist, res.id);
	} catch (e) {
		log('failed', 'lyrics', 'error');
		console.error(e);

		modal({
			id: 'lyrics',
			title: tl(trans.lyrics),
			body: (
				<Alert type='error'>{tl(trans.no_lyrics)}</Alert>
			)
		});
	}
}

function lyricsModal(segments: string[][], name?: string, artist?: string, id?: number) {
	const container = createRef();

	modal({
		id: 'lyrics',
		title: tl(trans.lyrics_for_value, { v: <i>{romanise(correct_item_by_artist(name, artist))}</i> }),
		body: (
			<>
				<div class='lyric-search'>
					<Input className='lyrics-search-input' placeholder={tl(trans.search_lyrics) as string} search onSubmit={render} onChange={render} />
					<SettingCheckbox bind='romanise_lyrics' standalone />
				</div>
				<div class='lyric-segments' ref={container} />
				{id && (
					<CardTip gap={false}>
						{tl(trans.sourced_from, { v: <a href={`https://lrclib.net/tracks/${id}`}>LRCLIB</a> })}
					</CardTip>
				)}
			</>
		)
	});

	function render(query = '') {
		query = query.trim().toLowerCase();

		if (!query) {
			container.current.replaceChildren(
				<>
					{segments.map(segment => (
						<LyricSegment lines={segment} />
					))}
				</>
			);

			return;
		}

		const filtered = segments.filter(segment => (
			segment.some(line => (
				line.toLowerCase().includes(query)
			))
		));

		container.current.replaceChildren(
			<>
				{filtered.map(segment => (
					<LyricSegment lines={segment} />
				))}
			</>
		);
	}

	render();
	useSettings.on('romanise_lyrics', () => render());
}

interface LyricSegmentProps {
	lines: string[];
}

function LyricSegment({
	lines
}: LyricSegmentProps) {
	return (
		<div class='lyric-segment'>
			{lines.map(line => {
				if (useSettings.get('romanise_lyrics')) {
					line = romanise(line, true);
				}

				const elem = (
					<p class='lyric-line' onClick={() => {
						elem.scrollIntoView({
							behavior: 'smooth',
							block: 'center',
							container: 'nearest'
						});

						copy(line);
					}}>
						<LyricLineInner line={line} />
						<Icon name={icons.copy} className='lyric-line-copy' />
					</p>
				);

				return elem;
			})}
		</div>
	)
}

interface LyricLineInnerProps {
	line: string;
}

function LyricLineInner({
	line
}: LyricLineInnerProps) {
	const regex = /^(.*?)\s*\(([^()]*)\)(.*)$/;

	const match = line.match(regex);

	if (!match) return line;

	return (
		<>
			{match[1]}
			{match[2] && (
				<>
					{' '}<span class='lyric-line-adlib'>({match[2]})</span>
				</>
			)}
			{match[3] && (
				<>
					{' '}{match[3]}
				</>
			)}
		</>
	)
}
