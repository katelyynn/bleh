import { ReactElement } from 'jsx-dom';
import { DateTime } from 'luxon';
import { tl, trans } from '@/build/trans.ts';
import tippy from 'tippy.js';

export function time(body: ReactElement) {
	body.querySelectorAll('t').forEach((timestamp) => {
		const time = timestamp.textContent;
		const flag = timestamp.getAttribute('data-flag');

		const date = DateTime.fromSeconds(parseInt(time));

		let text = '';

		if (flag == 'F') {
			text = tl(trans.date_at_time, {
				d: date.toLocaleString(DateTime.DATE_HUGE),
				t: date.toLocaleString(DateTime.TIME_SIMPLE),
			});
		} else if (flag == 'f') {
			text = tl(trans.date_at_time, {
				d: date.toLocaleString(DateTime.DATE_FULL),
				t: date.toLocaleString(DateTime.TIME_SIMPLE),
			});
		} else if (flag == 'D') {
			text = date.toLocaleString(DateTime.DATE_FULL);
		} else if (flag == 'd') {
			text = date.toLocaleString(DateTime.DATE_SHORT);
		} else if (flag == 't') {
			text = date.toLocaleString(DateTime.TIME_SIMPLE);
		} else if (flag == 'T') {
			text = date.toLocaleString(DateTime.TIME_WITH_SECONDS);
		} else if (flag == 'R') {
			text = date.toRelative();
		}

		const new_timestamp = <span>${text}</span>;

		tippy(new_timestamp, {
			theme: 'generic',
			content: (
				<>
					<span>{date.toLocaleString(DateTime.DATE_FULL)}</span>
					<small>{date.toLocaleString(DateTime.TIME_SIMPLE)}</small>
				</>
			),
		});

		timestamp.replaceWith(new_timestamp);
	});
}
