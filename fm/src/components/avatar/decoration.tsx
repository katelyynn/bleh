import { ReactNode } from 'jsx-dom';

export type AvatarDecorationType = 'anger' | 'crown' | 'question' | undefined;

interface AvatarDecorationProps {
	type?: AvatarDecorationType;
	children: ReactNode;
}

export function AvatarDecoration({
	type,
	children,
}: AvatarDecorationProps) {
	return (
		<div class='avatar-decoration-container'>
			{children}
			<div class='avatar-decoration' data-type={type} />
		</div>
	);
}
