/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import tippy from 'tippy.js';
import { page } from '@/build/page.ts';

export function flag(code: string, classname?: string) {
	const url =
		`https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`;

	const elem = (
		<div
			className={`country-flag ${classname ? classname : ''}`}
			style={{ backgroundImage: `url(${url})` }}
		>
			{code} (flag)
		</div>
	);

	tippy(elem, {
		content: code,
		delay: [1000, 0],
	});

	return elem;
}

interface FlagProps {
	code: string;
	className?: string;
}

export function Flag({
	code,
	className,
}: FlagProps) {
	let url =
		`https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`;

	if (code == 'FAE' || page.state.hazelfae) {
		url = `https://images.weserv.nl/?url=${
			encodeURIComponent('https://katelyn.s-ul.eu/ENShSZsz')
		}&output=webp`;
	}

	const elem = (
		<div
			class={['country-flag', className && className]}
			style={{ backgroundImage: `url(${url})` }}
		>
			{code} (flag)
		</div>
	);

	tippy(elem, {
		content: code,
		delay: [1000, 0],
	});

	return elem;
}

export const convert_lang_to_country: Record<string, string> = {
	en: 'gb',
	sv: 'se',
	zh: 'cn',
	ja: 'jp',
	pt: 'br',
};

export function flag_url(code: string) {
	if (convert_lang_to_country[code]) code = convert_lang_to_country[code];

	if (code == 'fae' || page.state.hazelfae) {
		return `https://images.weserv.nl/?url=${
			encodeURIComponent('https://katelyn.s-ul.eu/ENShSZsz')
		}&output=webp`;
	}

	return `https://purecatamphetamine.github.io/country-flag-icons/3x2/${code.toUpperCase()}.svg`;
}

interface flag_candidate_data {
	'iso-3166-1-codes'?: string[];
	'iso-3166-2-codes'?: string[];
}

export function flag_candidates(country: string, data: flag_candidate_data) {
	let candidate = '';

	if (data['iso-3166-1-codes']) {
		candidate = data['iso-3166-1-codes'][0];
	} else if (data['iso-3166-2-codes']) {
		candidate = data['iso-3166-2-codes'][0];
	}

	// supports scotland, wales, northern ireland
	if (candidate.startsWith('GB-')) {
		return candidate;
	}

	return country;
}
