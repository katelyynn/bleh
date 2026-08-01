import { DateTime } from 'luxon';
import tippy from 'tippy.js';

export function time_tooltip(elem: Element, time: DateTime) {
	tippy(elem, {
		content: time.toLocaleString(DateTime.DATE_MED),
	});

	return elem;
}
