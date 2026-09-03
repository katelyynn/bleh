interface TokenProps {
	value: string;
}

export function Token({
	value,
}: TokenProps) {
	return <input type='hidden' name='csrfmiddlewaretoken' value={value} />;
}

export function get_token(form: HTMLFormElement | Element) {
	const token = form.querySelector(
		'[name="csrfmiddlewaretoken"]',
	) as HTMLInputElement;

	if (token) return token.getAttribute('value')!;

	return '';
}
