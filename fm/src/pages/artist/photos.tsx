import { page } from "@/build/page";
import { tl, trans } from "@/build/trans";
import { icons } from "@/components/shared/icon";
import { PanelHead } from "@/components/text/head";

export function artist_photos_sidebar() {
	const list = page.structure.side!.querySelector('.sidebar-image-list') as HTMLElement;
	if (!list) return;

	const panel = list.parentElement!;

	const head = panel.querySelector('h2')!;

	head.replaceWith(
		<PanelHead icon={icons.gallery}>
			{tl(trans.photos)}
		</PanelHead>
	);
}
