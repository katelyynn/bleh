import { createRef, ReactNode } from 'jsx-dom';
import { WithChildren } from '@/types/generic.tsx';

interface ProfileSummaryProps {
	music?: boolean;
	children: ReactNode;
}

export function ProfileSummary({
	music,
	children,
}: ProfileSummaryProps) {
	return (
		<section class={['profile-summary', music && 'music-summary']}>
			{children}
		</section>
	);
}

export function ProfileSummaryMain({
	children,
}: WithChildren) {
	return (
		<div class='summary-main'>
			{children}
		</div>
	);
}

export function ProfileSummaryContent({
	children,
}: WithChildren) {
	return (
		<div class='summary-content'>
			{children}
		</div>
	);
}

export function ProfileSummarySeparator() {
	return <div class='summary-sep' />;
}

export function ProfileSummaryAside({
	children,
}: WithChildren) {
	return (
		<div class='summary-aside'>
			{children}
		</div>
	);
}

export function ProfileSummaryTitle({
	ref,
	children,
}: WithChildren) {
	return (
		<h2
			class='summary-title'
			ref={ref as ReturnType<typeof createRef<HTMLHeadingElement>>}
		>
			{children}
		</h2>
	);
}
