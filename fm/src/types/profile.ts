export type profile_cache = {
	avatar?: string;
	banner?: string;
	banner_orig?: string;
	hue?: number;
	sat?: number;
	lit?: number;
	font?: string;
	font_style?: string;
	username?: string;
	aka?: string;
	created?: string;
} | boolean;

export type profile_cache_list = Record<string, profile_cache>;
