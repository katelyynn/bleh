import { CSSProperties } from "jsx-dom";

interface CampfireItemProps {
	art: string;
	name: string;
	onClick: () => void;
	index: number;
}

export function CampfireItem({
	art,
	name,
	onClick,
	index
}: CampfireItemProps) {
	return (
		<div class='campfire-item' style={{ '--index': index } as CSSProperties} onClick={onClick}>
			<div class='campfire-item-cover'>
				<div class='campfire-item-cover-backing'>
					<img src={art} alt={name} />
				</div>
				<div class='campfire-item-cover-reflection' style={{ backgroundImage: `url(${art})` }} />
			</div>
		</div>
	);
}
