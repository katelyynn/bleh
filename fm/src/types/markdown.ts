import { profile_cache } from './profile';

export type markdown_options = {
	allow_headers?: boolean;
	starting_header?: number;
	allow_links?: boolean;
	line_breaks?: boolean;
	allow_banners?: boolean;
	in_dialog?: boolean;
	allow_icons?: boolean;
	allow_hue?: boolean;
	allow_fonts?: boolean;
	take_effect?: boolean;
	cache?: profile_cache;
	allow_socials?: boolean;
	allow_lists?: boolean;
	allow_alignment?: boolean;
	name?: string;
};

export interface social_link {
	host: string;
	path: string;
	url: string;
	name?: string;
}
