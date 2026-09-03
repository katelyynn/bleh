import { ReactNode } from 'jsx-dom';

interface LoadingDataProps {
	type?: 'loading' | 'failed' | 'private';
	children: ReactNode;
}

export function LoadingData({
	type = 'loading',
	children,
}: LoadingDataProps) {
	return (
		<div class='loading-data-container'>
			<div class={['loading-data-text', type != 'loading' && type]}>
				{children}
			</div>
		</div>
	);
}
