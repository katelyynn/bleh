export function age(date: string, compare?: string) {
	const today = compare ? new Date(compare) : new Date();
	const birth = new Date(date);

	let age = today.getFullYear() - birth.getFullYear();

	const had_birthday = today.getMonth() > birth.getMonth() ||
		(today.getMonth() == birth.getMonth() &&
			today.getDate() >= birth.getDate());

	if (!had_birthday) {
		age--;
	}

	return age;
}
