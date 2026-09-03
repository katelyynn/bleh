/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ReactNode } from 'jsx-dom';

export interface badge {
	user: string;
	name: ReactNode;
	reason: ReactNode;
	type?: string;
	hue?: number;
	sat?: number;
	lit?: number;
	icon?: string;
	inbuilt?: boolean;
	translation_code?: string;
	mask?: boolean;
}
