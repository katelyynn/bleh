import { ReactNode } from 'jsx-dom';

interface SubTextProps {
	children: ReactNode;
}

export function SubText({
	children,
}: SubTextProps) {
	return (
		<label class='sub-text'>
			{children}
		</label>
	);
}
