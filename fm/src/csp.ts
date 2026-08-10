/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

type PolicyMap = {
	'default-src': string[];
	'script-src': string[];
	'style-src': string[];
	'img-src': string[];
	'connect-src': string[];
	'font-src': string[];
};

const CspPolicies: PolicyMap = {
	'default-src': [
		"'self'",

		// stuff that last.fm uses
		'youtube.com',
		'youtube-nocookie.com',
		'*.youtube.com',
		'*.youtube-nocookie.com',
		'ws.audioscrobbler.com',
	],
	'script-src': [
		"'self'",
		"'unsafe-inline'",
		"'unsafe-eval'",

		// stuff that last.fm uses
		'cdn.jsdelivr.net',
		'cdnjs.cloudflare.com',
		'cdn.cookielaw.org',
		'google.com',
		'youtube.com',
		'youtube-nocookie.com',
		'*.youtube.com',
		'*.youtube-nocookie.com',
		'*.githack.com',
		'*.newrelic.com',
		'a.pub.network',
		'tags.tiqcdn.com',
		'html-load.cc',
		'srv.tunefindforfans.com',
		'ws.audioscrobbler.com',
	],
	'style-src': [
		"'self'",
		"'unsafe-inline'",

		'fonts.googleapis.com',

		// stuff that last.fm uses
		'static.cheftoondiligord.site',
		'a.pub.network',
	],
	'img-src': [
		"'self'",
		'data:',

		// stuff that last.fm uses
		'*.fastly.net',
		'cdn.cookielaw.org',
		'img.youtube.com',

		// various image hosts
		'files.catbox.moe',
		'*.klipy.com',
		'*.tenor.com',
		'*.tenor.co',
		'images.weserv.nl',
		'icons.duckduckgo.com',
		'count.getloli.com',

		// various git sites
		'github.com',
		'gitlab.com',
		'codeberg.org',
		'*.github.io',
		'*.gitlab.io',
		'*.codeberg.page',
		'raw.githubusercontent.com',

		'katelyn.moe',
	],
	'connect-src': [
		"'self'",
		'cdn.cookielaw.org',
		'geolocation.onetrust.com',
		'wss://html-load.cc',
		'*.newrelic.com',
		'status.cafe',
		'*.github.io',
		'ws.audioscrobbler.com',
	],
	'font-src': [
		"'self'",
		'fonts.gstatic.com',
		'*.github.io',
	],
};

function buildCSP(policies: PolicyMap) {
	return Object.entries(policies)
		.map(([policy, sources]) => `${policy} ${sources.join(' ')}`)
		.join('; ');
}

export function applyCSP() {
	const elem = document.createElement('meta');
	elem.setAttribute('http-equiv', 'Content-Security-Policy');
	elem.setAttribute('content', buildCSP(CspPolicies));
	document.head.prepend(elem);
}
