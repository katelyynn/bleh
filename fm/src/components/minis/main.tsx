/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { WithChildren } from '@/types/generic.tsx';
import { createRef, ReactNode } from 'jsx-dom';

export function CompareHeader({
	children,
}: WithChildren) {
	return (
		<div class='compare-header'>
			{children}
		</div>
	);
}

export function CompareBody({
	ref,
	children,
}: WithChildren) {
	return (
		<div
			class='compare-body'
			ref={ref as ReturnType<typeof createRef<HTMLDivElement>>}
		>
			{children}
		</div>
	);
}

interface PlotBodyProps {
	ref?: ReturnType<typeof createRef>;
	empty?: boolean;
	loading?: boolean;
	freeform?: boolean;
	children?: ReactNode;
}

type PlotBodyElement = HTMLDivElement & {
	empty: boolean;
	loading: boolean;
};

export function PlotBody({
	ref,
	empty,
	loading,
	freeform,
	children,
}: PlotBodyProps) {
	const elem = (
		<div
			class={['plot-body', freeform && 'freeform']}
			ref={ref as ReturnType<typeof createRef<HTMLDivElement>>}
		>
			{children}
		</div>
	) as PlotBodyElement;

	function update() {
		elem.classList.toggle('empty', empty);
		elem.classList.toggle('loading', loading);
	}

	Object.defineProperty(elem, 'empty', {
		get() {
			return empty;
		},
		set(v: boolean) {
			empty = v;
			update();
		},
	});

	Object.defineProperty(elem, 'loading', {
		get() {
			return loading;
		},
		set(v: boolean) {
			loading = v;
			update();
		},
	});

	update();

	return elem;
}

export function PlotBodyMessage({
	children,
}: WithChildren) {
	return (
		<div class={['plot-body-empty-message']}>
			{children}
		</div>
	);
}
