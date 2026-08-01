export interface badge {
	user: string;
	name: string;
	reason: string;
	type?: string;
	hue?: number;
	sat?: number;
	lit?: number;
	icon?: string;
	inbuilt?: boolean;
	translation_code?: string;
	mask?: boolean;
}
