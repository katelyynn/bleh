/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ScreenSize } from '@/components/responsive/responsive';
import { createRef, ReactNode } from 'jsx-dom';

export type WithChildren<T extends keyof JSX.IntrinsicElements = 'div'> = {
	className?: string;
	ref?: ReturnType<typeof createRef<HTMLElement>>;
	children?: ReactNode;
	hideBelow?: ScreenSize;
	shrinkBelow?: ScreenSize;
	showAbove?: ScreenSize;
} & Omit<JSX.IntrinsicElements[T], 'ref'>;
