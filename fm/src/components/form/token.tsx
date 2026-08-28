interface TokenProps {
	value: string;
}

export function Token({
	value,
}: TokenProps) {
	return <input type='hidden' name='csrfmiddlewaretoken' value={value} />;
}
