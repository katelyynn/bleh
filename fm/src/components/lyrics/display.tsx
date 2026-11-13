import { page } from "@/build/page";
import { LyricsSnippet, LyricsSnippetPlaceholder } from "./lyrics";
import { getLyrics, LrcLibResponse } from "./retrieve";
import { log } from "@/build/log";
import { createRef, ReactElement } from "jsx-dom";
import { PanelHead } from "../text/head";
import { icons } from "../shared/icon";
import { tl, trans } from "@/build/trans";

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

	try {
		const res = await getLyrics();

		finishLyrics(inner.current, res);

		page.state.lyrics = {
			name: page.name,
			sister: page.sister,
			res
		}
	} catch {
		log('failed', 'lyrics', 'error');
	}
}

function finishLyrics(panel: ReactElement, res: LrcLibResponse) {
	log('rendering', 'lyrics', 'info', { res });

	panel.replaceWith(
		<LyricsSnippet lyrics={res.plainLyrics} />
	);
}
