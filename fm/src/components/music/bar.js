import { html } from 'lighterhtml';
import { parse_scrobbles_as_rank } from './colourful_counts';
import { DateTime } from 'luxon';

export function chartlist_bar(value, max) {
	let slug;
	let val;

	const count_bar = html.node`
        <div class="chartlist-count-bar">
            <a class="chartlist-count-bar-link">
                <span class="chartlist-count-bar-slug" data-max-stat-value="${max}" data-stat-value="${value}" style="width: ${
		(max / max) * 100
	}%" ref=${(el) => slug = el} />
                <span class="chartlist-count-bar-value" ref=${(el) =>
		val = el}>${value.toLocaleString(DateTime.DATE_MED)}</span>
            </a>
        </div>
    `;

	const parsed_scrobble_as_rank = parse_scrobbles_as_rank(value);

	count_bar.setAttribute(
		'data-bleh--scrobble-milestone',
		parsed_scrobble_as_rank.milestone,
	);
	count_bar.style.setProperty(
		'--hue-over',
		parsed_scrobble_as_rank.hue,
	);
	count_bar.style.setProperty(
		'--sat-over',
		parsed_scrobble_as_rank.sat,
	);
	count_bar.style.setProperty(
		'--lit-over',
		parsed_scrobble_as_rank.lit,
	);

	if (parsed_scrobble_as_rank.contrast) {
		slug.classList.add('bar-contrast');
		val.classList.add('bar-contrast');
	}

	return count_bar;
}
