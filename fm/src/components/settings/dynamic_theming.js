//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { settings } from '../build/config';
import { log } from '../build/log';
import { page } from '../build/page';
import { save_setting } from './settings';

export function dynamic_theming() {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    page.state.media = media;

    match(media);

    media.addEventListener('change', match);
}

export function match(media = page.state.media) {
    if (!settings.theme_schedule) return;

    if (media.matches) apply_theme('night');
    else apply_theme('day');
}

function apply_theme(time) {
    if (settings.theme == settings[`theme_${time}`]) return;

    log(`applying theme for time ${time}`, 'dynamic theming');
    save_setting('theme', settings[`theme_${time}`]);
}
