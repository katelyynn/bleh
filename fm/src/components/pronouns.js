export function find_pronouns(string) {
    const regex = /\b[a-z]{1,6}\s*\/\s*[a-z]{1,6}(?:\s*\/\s*[a-z]{1,6})?\b/i;

    const start = string.match(new RegExp(`^(${regex.source})\\s*(.*)`, 'i'));
    if (start) {
        return {
            pronouns: start[1].trim(),
            text: start[2].trim() || null
        };
    }

    const end = string.match(new RegExp(`^(.*)\\s+(${regex.source})`, 'i'));
    if (end) {
        return {
            pronouns: end[1].trim(),
            text: end[2].trim() || null
        };
    }

    return {
        pronouns: null,
        text: string
    };
}
