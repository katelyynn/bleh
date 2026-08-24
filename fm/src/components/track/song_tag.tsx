export type song_tag = {
	type: string;
	group: string;
	text: string;
};

interface SongTagsProps {
	tags: song_tag[];
}

export function SongTags({
	tags,
}: SongTagsProps) {
	return (
		<div class='track-preview-tags'>
			{tags.map((tag) => <SongTag tag={tag} />)}
		</div>
	);
}

interface SongTagProps {
	tag: song_tag;
}

export function SongTag({
	tag,
}: SongTagProps) {
	return (
		<div class='feat' data-tag-type={tag.type} data-tag-group={tag.group}>
			{tag.text}
		</div>
	);
}
