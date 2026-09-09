/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export const sponsor_list: sponsor_list = {
	version: '',
	related: {
		account_name: '',
		link: '',
		special: [],
	},
	users: {},
};

interface sponsor_list {
	version: string;
	related: {
		account_name: string;
		link: string;
		special: string[];
	};
	users: Record<string, sponsor_user>;
}

interface sponsor_user {
	sponsor?: boolean;
	contributor?: boolean;
	badges?: badge[];
}

interface badge {
	type?: string;
	name: string;
	reason?: string;
	icon?: string;
	hue?: number;
	sat?: number;
	lit?: number;
}
