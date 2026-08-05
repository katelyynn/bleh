/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { applyCSP } from '@/csp';
applyCSP();

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
