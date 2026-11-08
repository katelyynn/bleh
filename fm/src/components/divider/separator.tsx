import { WithChildren } from "@/types/generic";
import { hideScreenSizeClasses, showScreenSizeClasses, shrinkScreenSizeClasses } from "../responsive/responsive";

export function Separator({
	hideBelow,
	shrinkBelow,
	showAbove
}: WithChildren) {
	return (
		<div class={[
			'sep',
			hideBelow && hideScreenSizeClasses[hideBelow],
			shrinkBelow && shrinkScreenSizeClasses[shrinkBelow],
			showAbove && showScreenSizeClasses[showAbove]
		]} />
	);
}
