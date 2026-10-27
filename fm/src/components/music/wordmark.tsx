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
	'julie': 'julie',
	'olivia rodrigo': 'olivia',
	'chappell roan': 'chappell',
	'tate mcrae': 'tate',
	'harry styles': 'harry',
	'jennie': 'jennie',
	'tame impala': 'impala',
	'bruno mars': 'bruno',
	'jhené aiko': 'jheneaiko',
	'justin bieber': 'justin',
	'katseye': 'katseye',
	'skepta': 'skepta',
	'gunna': 'gunna',
	'offset': 'offset',
	'eminem': 'eminem',
	'illit': 'illit',
	'le sserafim': 'sserafim',
	'bts': 'bts',
	'lisa': 'lisa',
	'ninajirachi': 'ninajirachi'
}

export const longWordmarks = [
	'ariana',
	'jcole',
	'sabrina',
	'carti',
	'denzel',
	'julie',
	'camila',
	'justin',
	'harry',
	'chappell',
	'olivia'
]

export function retrieveWordmark(name: string) {
	if (name.toLowerCase() in validWordmarks) {
		return `https://katelyynn.github.io/artist-wordmarks/${validWordmarks[name.toLowerCase()]}.webp?2`;
	}
}

interface WordmarkProps {
	name: string;
	small?: boolean;
	smallest?: boolean;
}

export function Wordmark({
	name,
	small,
	smallest
}: WordmarkProps) {
	const wordmark = retrieveWordmark(name);

	if (!wordmark) return name;

	const long = longWordmarks.includes(validWordmarks[name.toLowerCase()]);

	return (
		<span class='artist-wordmark'>
			<img class={['artist-wordmark-image', long && 'is-long', small && 'prefer-smaller', smallest && 'prefer-smallest']} src={wordmark} alt={name} />
		</span>
	);
}
