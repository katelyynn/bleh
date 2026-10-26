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
	if (name in validWordmarks) {
		return `https://katelyynn.github.io/artist-wordmarks/${validWordmarks[name]}.webp`;
	}
}
