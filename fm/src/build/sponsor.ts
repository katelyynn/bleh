//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

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
