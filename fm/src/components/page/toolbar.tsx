import { WithChildren } from "@/types/generic";
import { ff } from "../settings/sku";
import { useSettings } from "@/page";

export function PageToolbar({
	children
}: WithChildren) {
	const elem = (
		<div class='toolbar' data-lacrimosa={ff('lacrimosa')} data-roxy={ff('roxy')}>
			{children}
		</div>
	);

	function update() {
		elem.setAttribute(
			'data-theme',
			useSettings.get('theme') as string,
		);
	}

	update();
	useSettings.on('theme', update);

	return elem;
}
