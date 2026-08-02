//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

// seasonal
export const seasonal_timer = {
	state: undefined,
};
export const stored_season = {
	id: 'none',
	new_years_eve: false,
};
export const seasonal_events = [
	{
		id: 'new_years',
		start: {
			month: 1,
			day: 1,
		},
		end: {
			month: 1,
			day: 14,
		},
		snowflakes: {
			state: true,
			count: 90,
		},
	},
	{
		id: 'easter',
		start: {
			month: 4,
			day: 2,
		},
		end: {
			month: 4,
			day: 30,
		},
		snowflakes: {
			state: false,
		},
	},
	{
		id: 'pride',
		start: {
			month: 6,
			day: 1,
		},
		end: {
			month: 6,
			day: 30,
		},
		snowflakes: {
			state: false,
		},
	},
	{
		id: 'summer',
		start: {
			month: 7,
			day: 1,
		},
		end: {
			month: 9,
			day: 27,
		},
		snowflakes: {
			state: false,
		},
	},
	{
		id: 'halloween',
		start: {
			month: 9,
			day: 28,
		},
		end: {
			month: 11,
			day: 1,
		},
		snowflakes: {
			state: false,
		},
	},
	{
		id: 'pre_fall',
		start: {
			month: 11,
			day: 1,
			hour: 12,
		},
		end: {
			month: 11,
			day: 12,
		},
		snowflakes: {
			state: true,
			count: 12,
		},
	},
	{
		id: 'fall',
		start: {
			month: 11,
			day: 13,
		},
		end: {
			month: 11,
			day: 22,
		},
		snowflakes: {
			state: true,
			count: 80,
		},
	},
	{
		id: 'christmas',
		start: {
			month: 11,
			day: 23,
		},
		end: {
			month: 12,
			day: 31,
		},
		snowflakes: {
			state: true,
			count: 160,
		},
	},
];
