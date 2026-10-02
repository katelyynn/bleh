/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { createRef, ReactNode } from 'jsx-dom';
import { WithChildren } from '@/types/generic.tsx';
import { useSettings } from '@/page.ts';

interface ProfileSummaryProps {
	music?: boolean;
	children: ReactNode;
}

export function ProfileSummary({
	music,
	children,
}: ProfileSummaryProps) {
	const elem = (
		<section class={['profile-summary', music && 'music-summary']}>
			{children}
		</section>
	);

	function update() {
		elem.setAttribute('data-theme', useSettings.get('theme') as string);
	}

	update();
	useSettings.on('theme', update);

	return elem;
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
	const elem = (
		<div class='summary-aside'>
			{children}
		</div>
	);

	function update() {
		elem.setAttribute('data-theme', useSettings.get('theme') as string);
	}

	update();
	useSettings.on('theme', update);

	return elem;
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
