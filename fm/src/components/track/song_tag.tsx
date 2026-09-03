import { romanise } from '@/build/tools.ts';
import { useSettings } from '@/page.ts';

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
	features?: boolean;
}

export function SongTag({
	tag,
	features,
}: SongTagProps) {
	const elem = (
		<div class='feat' data-tag-type={tag.type} data-tag-group={tag.group}>
			{romanise(tag.text)}
		</div>
	);

	function update() {
		const show_features = features != null
			? features
			: useSettings.get('show_guest_features') as boolean;
		const show_remaster = useSettings.get('show_remaster_tags') as boolean;

		if (tag.group == 'guests') {
			elem.classList.toggle('hidden-feat', !show_features);
		} else if (tag.group == 'remasters') {
			elem.classList.toggle('hidden-feat', !show_remaster);
		}
	}

	if (tag.group == 'guests' || tag.group == 'remasters') {
		update();
	}

	if (tag.group == 'guests') {
		useSettings.on('show_guest_features', update);
	} else if (tag.group == 'remasters') {
		useSettings.on('show_remaster_tags', update);
	}

	return elem;
}
