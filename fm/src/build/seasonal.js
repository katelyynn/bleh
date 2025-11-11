//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

// seasonal
export let seasonal_timer = {
    state: undefined
};
export let stored_season = {
    id: 'none',
    new_years_eve: false
};
export let seasonal_events = [
    {
        id: 'new_years',
        start: 'y0-01-01T00:00:00{offset}',
        end: 'y0-01-14T23:59:59{offset}',

        snowflakes: {
            state: true,
            count: 90
        }
    },
    {
        id: 'easter',
        start: 'y0-04-02T00:00:00{offset}',
        end: 'y0-04-30T23:59:59{offset}',

        snowflakes: {
            state: false
        }
    },
    {
        id: 'pride',
        start: 'y0-05-31T00:00:00{offset}',
        end: 'y0-07-07T23:59:59{offset}',

        snowflakes: {
            state: false
        }
    },
    {
        id: 'halloween',
        start: 'y0-09-22T00:00:00{offset}',
        end: 'y0-11-01T11:59:59{offset}',

        snowflakes: {
            state: false
        }
    },
    {
        id: 'pre_fall',
        start: 'y0-11-01T12:00:00{offset}',
        end: 'y0-11-12T23:59:59{offset}',

        snowflakes: {
            state: true,
            count: 12
        }
    },
    {
        id: 'fall',
        start: 'y0-11-13T00:00:00{offset}',
        end: 'y0-11-22T23:59:59{offset}',

        snowflakes: {
            state: true,
            count: 80
        }
    },
    {
        id: 'christmas',
        start: 'y0-11-23T00:00:00{offset}',
        end: 'y0-12-31T23:59:59{offset}',

        snowflakes: {
            state: true,
            count: 160
        }
    }
];
