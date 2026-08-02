/**
 * @param {string} string
 */
export function find_pronouns(string) {
	const regex = /\b[a-z]{1,4}\s*\/\s*[a-z]{1,4}(?:\s*\/\s*[a-z]{1,4})?\b/i;

	const start = string.match(new RegExp(`^(${regex.source})\\s*(.*)$`, 'i'));
	if (start) {
		return {
			pronouns: start[1].trim(),
			text: fix_up_string(start[2].trim() || null),
		};
	}

	const end = string.match(new RegExp(`^(.*)\\s+(${regex.source})$`, 'i'));
	if (end) {
		return {
			pronouns: end[2].trim(),
			text: fix_up_string(end[1].trim() || null),
		};
	}

	return {
		pronouns: null,
		text: string,
	};
}

/**
 * @param {string | null} string
 */
function fix_up_string(string) {
	if (!string) return null;

	return string.replace(/^[,\-–—.;:|•·/]+\s*/, '').replace(
		/\s*[,\-–—.;:|•·/]+$/,
		'',
	).trim();
}
