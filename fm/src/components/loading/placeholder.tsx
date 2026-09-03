import { ReactNode } from 'jsx-dom';

interface PlaceholderProps {
	face: string;
	children: ReactNode;
}

export function Placeholder({
	face,
	children,
}: PlaceholderProps) {
	return (
		<div class='placeholder-block'>
			<div class='placeholder-head'>{face}</div>
			<div class='placeholder-summary'>{children}</div>
		</div>
	);
}
