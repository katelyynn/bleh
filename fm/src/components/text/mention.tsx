import { root } from "@/build/page";

interface MentionProps {
	user: string;
}

export function Mention({
	user
}: MentionProps) {
	return (
		<a class='mention' href={`${root}user/${user}`}>
			<span class='at'>@</span>{user}
		</a>
	);
}
