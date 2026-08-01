//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { log } from '@/build/log';
import { ranks } from '@/build/music';
import { interpolate_hue } from '@/build/tools';

export function patch_artist_ranks_in_list_view(track) {
	let count_bar = track.querySelector('.chartlist-count-bar');
	if (!count_bar) return;

	let count_bar_link = count_bar.querySelector('.chartlist-count-bar-link');
	if (
		count_bar_link.getAttribute('href')
			.includes('?from=') ||
		(count_bar_link.getAttribute('href')
			.includes('?date_preset=') &&
			!count_bar_link.getAttribute('href').endsWith('?date_preset=ALL') &&
			!count_bar_link.getAttribute('href').endsWith('?date_preset=null'))
	) {
		return;
	}

	const slug = count_bar.querySelector('.chartlist-count-bar-slug');
	const val = count_bar.querySelector('.chartlist-count-bar-value');
	let count = slug.getAttribute('data-stat-value');

	if (!count_bar.hasAttribute('data-kate-processed')) {
		count_bar.setAttribute('data-kate-processed', 'true');

		let parsed_scrobble_as_rank = parse_scrobbles_as_rank(count);

		count_bar.setAttribute(
			'data-bleh--scrobble-milestone',
			parsed_scrobble_as_rank.milestone,
		);
		count_bar.style.setProperty('--hue-over', parsed_scrobble_as_rank.hue);
		count_bar.style.setProperty('--sat-over', parsed_scrobble_as_rank.sat);
		count_bar.style.setProperty('--lit-over', parsed_scrobble_as_rank.lit);

		if (parsed_scrobble_as_rank.contrast) {
			slug.classList.add('bar-contrast');
			val.classList.add('bar-contrast');
		}
	}
}

export function parse_scrobbles_as_rank(scrobbles) {
	let scrobble_milestone = 0;
	let scrobble_proximity = 0;
	let max_rank = ranks.length - 1;

	ranks.forEach((rank, index) => {
		if (scrobbles <= rank.start) {
			scrobble_milestone = index;
			return;
		}
	});

	// get current rank hsl
	let milestone_hue = ranks[scrobble_milestone].hue;
	let milestone_sat = ranks[scrobble_milestone].sat;
	let milestone_lit = ranks[scrobble_milestone].lit;

	// calculate proximity to next rank
	if (scrobble_milestone < max_rank) {
		let current_start = ranks[scrobble_milestone].start;
		let next_start = ranks[scrobble_milestone + 1].start;
		scrobble_proximity = (scrobbles - current_start) /
			(next_start - current_start);
	}

	// interpolate hsl to the next rank
	if (scrobble_milestone < max_rank) {
		let next_milestone_hue = ranks[scrobble_milestone + 1].hue;
		let next_milestone_sat = ranks[scrobble_milestone + 1].sat;
		let next_milestone_lit = ranks[scrobble_milestone + 1].lit;

		milestone_hue = interpolate_hue(
			milestone_hue,
			next_milestone_hue,
			scrobble_proximity,
		);

		milestone_sat += (next_milestone_sat - milestone_sat) *
			scrobble_proximity;
		milestone_lit += (next_milestone_lit - milestone_lit) *
			scrobble_proximity;
	}

	let contrast = false;
	if (scrobbles >= 50_000) {
		contrast = true;
	}

	log(
		`milestone for ${scrobbles} is ${scrobble_milestone} within ${scrobble_proximity} proximity`,
		'colourful counts',
		'info',
		{ hue: milestone_hue, sat: milestone_sat, lit: milestone_lit },
	);

	return {
		milestone: scrobble_milestone,
		proximity: scrobble_proximity,
		hue: milestone_hue,
		sat: milestone_sat,
		lit: milestone_lit,
		contrast,
	};
}
