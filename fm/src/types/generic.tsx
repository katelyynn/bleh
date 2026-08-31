/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { createRef, ReactNode } from 'jsx-dom';

export type WithChildren = {
	ref?: ReturnType<typeof createRef>;
	children?: ReactNode;
};
