import { WithChildren } from '@/types/generic.tsx';

export function FormInner({
	children,
}: WithChildren) {
	return (
		<div class='form-inner'>
			{children}
		</div>
	);
}

export function GenericLabel({
	children,
}: WithChildren) {
	return (
		<p class='generic-label'>
			{children}
		</p>
	);
}
