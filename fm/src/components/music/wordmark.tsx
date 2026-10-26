export const validWordmarks: Record<string, string> = {
	'ariana grande': 'ariana',
	'brakence': 'brakence',
	'camila cabello': 'camila',
	'charli xcx': 'charli',
	'denzel curry': 'denzel',
	'don toliver': 'don',
	'future': 'future',
	'j. cole': 'jcole',
	'juice wrld': 'juice',
	'nirvana': 'nirvana',
	'slayyyter': 'slayyyter',
	'taylor swift': 'taylor',
	'tiffany day': 'tiff'
}

export function retrieveWordmark(name: string) {
	if (name.toLowerCase() in validWordmarks) {
		return `https://katelyynn.github.io/artist-wordmarks/${validWordmarks[name.toLowerCase()]}.webp`;
	}
}

interface WordmarkProps {
	name: string;
}

export function Wordmark({
	name
}: WordmarkProps) {
	const wordmark = retrieveWordmark(name);

	if (!wordmark) return name;

	return (
		<div class='artist-wordmark'>
			<img class='artist-wordmark-image' src={wordmark} alt={name} />
		</div>
	);
}
