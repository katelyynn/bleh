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
	'tiffany day': 'tiff',
	'glaive': 'glaive',
	'sabrina carpenter': 'sabrina',
	'playboi carti': 'carti',
	'julie': 'julie'
}

export const longWordmarks = [
	'ariana',
	'jcole',
	'sabrina',
	'carti',
	'slayyyter',
	'denzel',
	'julie'
]

export function retrieveWordmark(name: string) {
	if (name.toLowerCase() in validWordmarks) {
		return `https://katelyynn.github.io/artist-wordmarks/${validWordmarks[name.toLowerCase()]}.webp?2`;
	}
}

interface WordmarkProps {
	name: string;
	small?: boolean;
}

export function Wordmark({
	name,
	small
}: WordmarkProps) {
	const wordmark = retrieveWordmark(name);

	if (!wordmark) return name;

	const long = longWordmarks.includes(validWordmarks[name.toLowerCase()]);

	return (
		<div class='artist-wordmark'>
			<img class={['artist-wordmark-image', long && 'is-long', small && 'prefer-smaller']} src={wordmark} alt={name} />
		</div>
	);
}
