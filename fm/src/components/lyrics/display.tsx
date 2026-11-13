import { page } from "@/build/page";
import { LyricsSnippet, LyricsSnippetPlaceholder } from "./lyrics";
import { getLyrics, LrcLibResponse } from "./retrieve";
import { log } from "@/build/log";
import { createRef, ReactElement } from "jsx-dom";
import { PanelHead } from "../text/head";
import { Icon, icons } from "../shared/icon";
import { tl, trans } from "@/build/trans";
import { lazy } from "@/build/tools";

export async function showLyrics() {
	const saved = page.state.lyrics;

	const inner = createRef();
	const panel = (
		<section class='page-lyrics'>
			<PanelHead icon={icons.lyrics}>
				{tl(trans.lyrics)}
			</PanelHead>
			<LyricsSnippetPlaceholder ref={inner} />
		</section>
	);

	page.structure.side!.appendChild(panel);

	if (saved) {
		if (saved.name == page.name && saved.sister == page.sister) {
			return finishLyrics(inner.current, saved.res);
		}
	}

	lazy(panel, async () => {
		try {
			log('requesting', 'lyrics');
			const res = await getLyrics();

			finishLyrics(inner.current, res);

			page.state.lyrics = {
				name: page.name,
				sister: page.sister,
				res
			}
		} catch (e) {
			log('failed', 'lyrics', 'error');
			console.error(e);

			finishLyrics(inner.current, undefined);

			page.state.lyrics = {
				name: page.name,
				sister: page.sister,
				res: undefined
			}
		}
	});
}

function finishLyrics(panel: ReactElement, res: LrcLibResponse | undefined) {
	log('rendering', 'lyrics', 'info', { res });

	if (!res) {
		panel.replaceWith(
			<LyricsSnippetPlaceholder>
				<Icon name={icons.x} />
				{tl(trans.no_lyrics)}
			</LyricsSnippetPlaceholder>
		);
	}

	panel.replaceWith(
		<LyricsSnippet lyrics={res.plainLyrics} />
	);
}
