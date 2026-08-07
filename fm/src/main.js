/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import '@fontsource-variable/hanken-grotesk/wght-italic.css';
import '@fontsource/instrument-serif';
import '@fontsource-variable/atkinson-hyperlegible-next/wght-italic.css';
import '@fontsource-variable/funnel-sans/wght-italic.css';

import '@fontsource/balsamiq-sans';
import '@fontsource/cherry-bomb-one';
import '@fontsource/crimson-text/600-italic.css';
import '@fontsource/lilita-one';
import '@fontsource-variable/rokkitt/wght-italic.css';
import '@fontsource/rakkas';
import '@fontsource/single-day';
import '@fontsource/unifrakturcook';
import '@fontsource-variable/inconsolata/wdth.css';
import '@fontsource-variable/google-sans-code/wght-italic.css';

import '@fontsource-variable/bitcount-grid-single/slnt.css';
import '@fontsource/darumadrop-one';

import '@fontsource/noto-color-emoji';
import '@fontsource-variable/noto-sans-jp/wght.css';
import '@fontsource-variable/noto-sans-tc/wght.css';
import '@fontsource-variable/noto-sans-kr/wght.css';

import { log } from './build/log';
import { bleh } from './page';

import version2 from './build/build.json' with { type: 'json' };

import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-luxon';
import zoomPlugin from 'chartjs-plugin-zoom';
import { FastAverageColor } from 'fast-average-color';

Chart.register(...registerables);
Chart.register(zoomPlugin);

export { Chart };

export const fac = new FastAverageColor();

export const symbol = Symbol('generic');

export const version = version2;
export const theme_version = {
	state: '',
};

log(`starting ${version.build}.${version.sku}`, 'load');
bleh();
