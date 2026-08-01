//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { html } from 'lighterhtml';
import { pad2 } from '@/build/tools';
import tippy from 'tippy.js';
import { lang, tl, trans } from '@/build/trans';
import { register_menu } from '@/components/menu';
import { input } from '@/components/settings/input';
import { DateTime } from 'luxon';

export function calendar({
	value,
	min,
	max,
	disabled,
	show_time = true,
	name,
	value_in_iso = false,
	func,
	hide_on_change = false,
}) {
	let date_button;
	let manual_button;
	let up_button;
	let down_button;

	if (value_in_iso && value) value *= 1000;

	let now = new Date();

	const min_date = min
		? new Date(min)
		: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
	min_date.setHours(0, 0, 0, 0);

	console.info('calendar', value, new Date(value), min_date);
	if (value && new Date(value) >= min_date) now = new Date(value);

	const max_date = max ? new Date(max) : new Date();
	max_date.setHours(23, 59, 59, 999);

	let last_action;
	const state = {
		year: now.getFullYear(),
		month: now.getMonth() + 1,
		day: now.getDate(),
		hours: now.getHours(),
		mins: now.getMinutes(),
		secs: now.getSeconds(),
	};
	let view = {
		level: 'day',
		year: state.year,
		month: state.month,
	};

	let legacy_date;
	let date_display;
	let time_input;
	let popup_inner = html.node`<div class="calendar" />`;

	const locale = lang;
	const months = Array.from(
		{ length: 12 },
		(_, i) =>
			new Intl.DateTimeFormat(locale, { month: 'short' }).format(
				new Date(2000, i, 1),
			),
	);
	const raw_weekdays = Array.from(
		{ length: 7 },
		(_, i) =>
			new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(
				new Date(1970, 0, 4 + i),
			),
	);
	const weekdays = raw_weekdays.slice(1).concat(raw_weekdays[0]);

	function months_between(a, b) {
		return (
			(b.getFullYear() - a.getFullYear()) * 12 +
			(b.getMonth() - a.getMonth())
		);
	}

	function can_nav_month_view() {
		return months_between(min_date, max_date) >= 1;
	}

	function can_nav_year_view() {
		return max_date.getFullYear() - min_date.getFullYear() >= 1;
	}

	function on_month_year_click() {
		last_action = '';
		if (view.level === 'day' && can_nav_month_view()) {
			view.level = 'month';
		} else if (view.level === 'month' && can_nav_year_view()) {
			view.level = 'year';
		} else if (view.level === 'year') {
			view.level = 'month';
		} else if (view.level === 'manual') {
			view.level = 'day';
		} else {
			return;
		}
		render_popup();
	}

	const container = html.node`
        <div class="input-group">
            <div class="content-form input-container" data-type="date">
                <input class="legacy-input" type="date" ref=${(
		el,
	) => (legacy_date = el)} name=${name} value="${state.year}-${
		pad2(state.month)
	}-${pad2(state.day)}">
                <div class="date-input modern-input" ref=${(
		el,
	) => (date_display = el)}>${format_date(state)}</div>
            </div>
            ${
		show_time
			? html.node`
            <div class="content-form input-container" data-type="time">
                <input class="modern-input" type="time" step="1" ref=${(
				el,
			) => (time_input = el)} value="${pad2(state.hours)}:${
				pad2(state.mins)
			}:${pad2(state.secs)}">
            </div>
            `
			: ''
	}
        </div>
    `;

	if (disabled) {
		date_display.setAttribute('disabled', true);
		time_input.disabled = true;
	}

	if (time_input) {
		time_input.addEventListener('input', () => {
			const parts = time_input.value
				.split(':')
				.map((n) => parseInt(n, 10));
			state.hours = parts[0] || 0;
			state.mins = parts[1] || 0;
			state.secs = parts[2] || 0;
			emit();
		});
	}

	function can_prev() {
		const py = view.month === 1 ? view.year - 1 : view.year;
		const pm = view.month === 1 ? 12 : view.month - 1;
		return (
			py > min_date.getFullYear() ||
			(py == min_date.getFullYear() && pm >= min_date.getMonth() + 1)
		);
	}

	function can_next() {
		const ny = view.month === 12 ? view.year + 1 : view.year;
		const nm = view.month === 12 ? 1 : view.month + 1;
		return (
			ny < max_date.getFullYear() ||
			(ny == max_date.getFullYear() && nm <= max_date.getMonth() + 1)
		);
	}

	let tooltip = tippy(date_display, {
		theme: 'window',
		content: '',
		placement: 'top',
		interactive: true,
		interactiveBorder: 10,
		trigger: 'click',
		appendTo: document.body,

		onShow() {
			last_action = '';
			render_popup();
		},
	});

	let menu = tippy(date_display, {
		theme: 'context-menu',
		content: html.node`
            <button class="dropdown-menu-clickable-item" data-type="manual" onclick=${() => {
			view.level = 'manual';
			tooltip.show();
		}}>
                ${tl(trans.manual_date)}
            </button>
        `,
		placement: 'right-start',
		trigger: 'manual',
		interactive: true,
		interactiveBorder: 10,
		offset: [0, 0],
		appendTo: document.body,

		onShow(instance) {
			instance.popper.addEventListener('click', (event) => {
				instance.hide();
			});
		},
	});

	register_menu(date_display, menu);

	function render_popup() {
		let inner;
		if (view.level === 'year') {
			inner = render_year_view();
		} else if (view.level === 'month') {
			inner = render_month_view();
		} else if (view.level === 'manual') {
			inner = render_manual_view();
		} else {
			inner = render_day_view();
		}
		tooltip.setContent(html.node`<div class="calendar">${inner}</div>`);

		if (date_button) tippy(date_button, { content: tl(trans.change_zoom) });
		if (manual_button) {
			tippy(manual_button, { content: manual_button.textContent });
		}
		if (up_button) tippy(up_button, { content: up_button.textContent });
		if (down_button) {
			tippy(down_button, { content: down_button.textContent });
		}
	}

	function render_day_view() {
		return html.node`
            <div class="calendar-header">
                <button class="btn month-year calendar-top-button" type="button" ref=${(
			el,
		) => (date_button =
			el)} onclick=${on_month_year_click} disabled=${!can_nav_month_view()}>
                    ${months[view.month - 1]} ${view.year}
                </button>
                <div class="fill" />
                <button class="btn chibi icon calendar-top-button" data-type="manual" ref=${(
			el,
		) => (manual_button = el)} type="button" onclick=${() => {
			view.level = 'manual';
			render_popup();
		}}>
                    ${tl(trans.manual)}
                </button>
                <button class="btn chibi icon calendar-top-button" data-type="up" ref=${(
			el,
		) => (up_button =
			el)} disabled=${!can_prev()} type="button" onclick=${() => {
			if (!can_prev()) return;

			view.month--;

			if (view.month < 1) {
				view.month = 12;
				view.year--;
			}

			last_action = 'prev';
			render_popup();
		}}>
                    ${tl(trans.back)}
                </button>
                <button class="btn chibi icon calendar-top-button" data-type="down" ref=${(
			el,
		) => (down_button =
			el)} disabled=${!can_next()} type="button" onclick=${() => {
			if (!can_next()) return;

			view.month++;

			if (view.month > 12) {
				view.month = 1;
				view.year++;
			}

			last_action = 'next';
			render_popup();
		}}>
                    ${tl(trans.next)}
                </button>
            </div>
            <div class="date-header">
                ${
			weekdays.map((day) => html.node`<div class="date">${day}</div>`)
		}
            </div>
            <div class="days calendar-view" data-last-action=${last_action}>
                ${
			days(view.year, view.month).map((cell) =>
				cell.type == 'empty'
					? html
						.node`<button class="btn day empty calendar-entry" type="button" disabled />`
					: html.node`
                            <button class="btn day calendar-entry" type="button" aria-selected=${
						cell.day == state.day && cell.date >= min_date &&
							cell.date <= max_date && cell.month == view.month
							? 'true'
							: 'false'
					} disabled=${
						cell.date < min_date || cell.date > max_date
					} onclick=${() => {
						state.day = cell.day;
						state.year = view.year;
						state.month = view.month;
						update_display();
						emit();
						last_action = '';
						render_popup();
					}}>${cell.day}</button>
                        `
			)
		}
            </div>
        `;
	}

	function render_month_view() {
		const min_year = min_date.getFullYear();
		const max_year = max_date.getFullYear();

		return html.node`
            <div class="calendar-header">
                <button class="btn month-year calendar-top-button" type="button" ref=${(
			el,
		) => (date_button =
			el)} onclick=${on_month_year_click} disabled=${!can_nav_year_view()}>
                    ${view.year}
                </button>
                <div class="fill" />
                <button class="btn chibi icon calendar-top-button" data-type="manual" ref=${(
			el,
		) => (manual_button = el)} type="button" onclick=${() => {
			view.level = 'manual';
			render_popup();
		}}>
                    ${tl(trans.manual)}
                </button>
                <button class="btn chibi icon calendar-top-button" data-type="up" ref=${(
			el,
		) => (up_button = el)} type="button" disabled=${
			view.year <= min_year
		} onclick=${() => {
			if (view.year < min_year) return;

			view.year--;

			last_action = 'prev';
			render_popup();
		}}>
                    ${tl(trans.back)}
                </button>
                <button class="btn chibi icon calendar-top-button" data-type="down" ref=${(
			el,
		) => (down_button = el)} type="button" disabled=${
			view.year >= max_year
		} onclick=${() => {
			if (view.year > max_year) return;

			view.year++;

			last_action = 'next';
			render_popup();
		}}>
                    ${tl(trans.next)}
                </button>
            </div>
            <div class="months calendar-view" data-last-action=${last_action}>
                ${
			months.map((label, i) => {
				const month_start = new Date(view.year, i, 1);
				const month_end = new Date(
					view.year,
					i + 1,
					0,
					23,
					59,
					59,
					999,
				);
				return html.node`
                        <button class="btn month calendar-entry" aria-selected=${
					view.year === state.year && i + 1 === state.month
				} disabled=${
					month_end < min_date || month_start > max_date
				} onclick=${() => {
					view.month = i + 1;
					view.level = 'day';

					last_action = '';
					update_display();
					render_popup();
				}}>
                            ${label}
                        </button>
                    `;
			})
		}
            </div>
        `;
	}

	function render_year_view() {
		const min_year = min_date.getFullYear();
		const max_year = max_date.getFullYear();
		const decade_start = Math.floor(view.year / 10) * 10;
		return html.node`
            <div class="calendar-header">
                <button class="btn month-year calendar-top-button" ref=${(
			el,
		) => (date_button = el)} onclick=${on_month_year_click}>
                    ${decade_start} – ${decade_start + 9}
                </button>
                <div class="fill" />
                <button class="btn chibi icon calendar-top-button" data-type="manual" ref=${(
			el,
		) => (manual_button = el)} type="button" onclick=${() => {
			view.level = 'manual';
			render_popup();
		}}>
                    ${tl(trans.manual)}
                </button>
                <button class="btn chibi icon calendar-top-button" data-type="up" ref=${(
			el,
		) => (up_button = el)} disabled=${
			decade_start - 10 < min_year
		} onclick=${() => {
			if (decade_start - 10 < min_year) return;

			view.year -= 10;
			render_popup();
		}}>
                    ${tl(trans.back)}
                </button>
                <button class="btn chibi icon calendar-top-button" data-type="down" ref=${(
			el,
		) => (down_button = el)} disabled=${
			decade_start + 10 > max_year
		} onclick=${() => {
			if (decade_start + 10 > max_year) return;

			view.year += 10;
			render_popup();
		}}>
                    ${tl(trans.next)}
                </button>
            </div>
            <div class="years calendar-view">
                ${
			Array.from({ length: 10 }, (_, i) => decade_start + i).map(
				(yr) => {
					return html.node`
                        <button class="btn year calendar-entry" aria-selected=${
						yr === state.year
					} disabled=${
						yr < min_date.getFullYear() ||
						yr > max_date.getFullYear()
					} onclick=${() => {
						view.year = yr;
						view.level = 'month';
						render_popup();
					}}>
                            ${yr}
                        </button>
                    `;
				},
			)
		}
            </div>
        `;
	}

	function validate_text_date(value) {
		const m = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
		if (!m) return null;
		const [_, ys, ms, ds] = m;
		const date = new Date(`${ys}-${ms}-${ds}T00:00:00`);
		if (
			date.getFullYear() !== +ys ||
			date.getMonth() + 1 !== +ms ||
			date.getDate() !== +ds
		) {
			return null;
		}
		if (date < min_date || date > max_date) return null;
		return date;
	}

	function render_manual_view() {
		let manual_date;

		let elem = html.node`
            <div class="calendar-header">
                <button class="btn month-year calendar-top-button" ref=${(
			el,
		) => (date_button = el)} onclick=${on_month_year_click}>
                    ${tl(trans.manual)}
                </button>
                <div class="fill" />
                <button class="btn chibi icon calendar-top-button" data-type="manual" ref=${(
			el,
		) => (manual_button = el)} type="button" disabled>
                    ${tl(trans.manual)}
                </button>
                <button class="btn chibi icon calendar-top-button" data-type="up" ref=${(
			el,
		) => (up_button = el)} disabled>
                    ${tl(trans.back)}
                </button>
                <button class="btn chibi icon calendar-top-button" data-type="down" ref=${(
			el,
		) => (down_button = el)} disabled>
                    ${tl(trans.next)}
                </button>
            </div>
            <div class="manual">
                ${(manual_date = input({
			type: 'text',
			value: `${state.year}-${pad2(state.month)}-${pad2(state.day)}`,
			func: (value) => {
				const parsed = validate_text_date(value);

				if (!parsed) {
					manual_date.value = `${state.year}-${pad2(state.month)}-${
						pad2(state.day)
					}`;
					return;
				}

				state.year = parsed.getFullYear();
				state.month = parsed.getMonth() + 1;
				state.day = parsed.getDate();
				view.level = 'day';
				view.year = state.year;
				view.month = state.month;
				update_display();
				emit();
				render_popup();
			},
		}))}
                <p>${tl(trans.enter_a_manual_date)}</p>
                <p>${
			tl(trans.minimum_value).replace(
				'{v}',
				`${min_date.getFullYear()}-${pad2(min_date.getMonth() + 1)}-${
					pad2(min_date.getDate())
				}`,
			)
		}</p>
                <p>${
			tl(trans.maximum_value).replace(
				'{v}',
				`${max_date.getFullYear()}-${pad2(max_date.getMonth() + 1)}-${
					pad2(max_date.getDate())
				}`,
			)
		}</p>
            </div>
        `;

		manual_date.focus();

		return elem;
	}

	function days(year, month) {
		const raw_first = new Date(year, month - 1, 1).getDay();
		const offset = (raw_first + 6) % 7; // monday comes first
		const days_in_month = new Date(year, month, 0).getDate();

		const cells = [];
		for (let i = 0; i < offset; i++) cells.push({ type: 'empty' });
		for (let day = 1; day <= days_in_month; day++) {
			cells.push({
				type: 'day',
				day,
				month: state.month,
				date: new Date(year, month - 1, day),
			});
		}

		const rem = (7 - (cells.length % 7)) % 7;
		for (let i = 0; i < rem; i++) cells.push({ type: 'empty' });
		console.info('cells', cells, state.month, view.month);

		return cells;
	}

	function update_display() {
		date_display.textContent = format_date(state);
	}

	function emit() {
		const date_object = new Date(
			state.year,
			state.month - 1,
			state.day,
			state.hours,
			state.mins,
			state.secs,
		);
		legacy_date.value = `${state.year}-${pad2(state.month)}-${
			pad2(state.day)
		}`;
		container.dispatchEvent(new CustomEvent('change'), {
			detail: date_object,
		});

		if (hide_on_change) {
			tooltip.hide();
		}

		if (func) func(`${state.year}-${pad2(state.month)}-${pad2(state.day)}`);
	}

	function format_date({ year, month, day }) {
		const date_object = new Date(year, month - 1, day);
		return DateTime.fromJSDate(date_object).toLocaleString(
			DateTime.DATE_MED,
		);
	}

	Object.defineProperty(container, 'value', {
		get() {
			return new Date(
				state.year,
				state.month - 1,
				state.day,
				state.hours,
				state.mins,
				state.secs,
			);
		},
		set(val: string) {
			const date_object = new Date(val);
			state.year = date_object.getFullYear();
			state.month = date_object.getMonth() + 1;
			state.day = date_object.getDate();
			state.hours = date_object.getHours();
			state.mins = date_object.getMinutes();
			state.secs = date_object.getSeconds();

			view.year = state.year;
			view.month = state.month;

			render_popup();
			update_display();

			if (time_input) {
				time_input.value = `${pad2(state.hours)}:${pad2(state.mins)}:${
					pad2(state.secs)
				}`;
			}
			return date_object;
		},
	});

	container.disabled = (val = null) => {
		if (val === null) return time_input.disabled;

		if (!val) date_display.removeAttribute('disabled');
		else date_display.setAttribute('disabled', 'true');

		if (time_input) time_input.disabled = val;
		return val;
	};

	return container;
}
