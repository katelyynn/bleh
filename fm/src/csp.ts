/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

type PolicyMap = {
	'default-src': string[];
	'script-src': string[];
	'style-src': string[];
	'style-src-elem': string[];
	'img-src': string[];
	'connect-src': string[];
	'font-src': string[];
};

// https:// is prepended to all entries
// to fix collage loading specifically
// (it was defaulting to about:// ????)
const CspPolicies: PolicyMap = {
	'default-src': [
		"'self'",

		// stuff that last.fm uses
		'https://youtube.com',
		'https://youtube-nocookie.com',
		'https://*.youtube.com',
		'https://*.youtube-nocookie.com',
		'https://ws.audioscrobbler.com',
		'https://translate.googleapis.com',
	],
	'script-src': [
		"'self'",
		"'unsafe-inline'",
		"'unsafe-eval'",

		// stuff that last.fm uses
		'https://cdn.jsdelivr.net',
		'https://cdnjs.cloudflare.com',
		'https://cdn.cookielaw.org',
		'https://google.com',
		'https://youtube.com',
		'https://youtube-nocookie.com',
		'https://*.youtube.com',
		'https://*.youtube-nocookie.com',
		'https://*.githack.com',
		'https://*.newrelic.com',
		'https://a.pub.network',
		'https://tags.tiqcdn.com',
		'https://html-load.cc',
		'https://srv.tunefindforfans.com',
		'https://ws.audioscrobbler.com',
		'https://translate.googleapis.com',
	],
	'style-src': [
		"'self'",
		"'unsafe-inline'",

		'https://fonts.googleapis.com',

		// stuff that last.fm uses
		'https://static.cheftoondiligord.site',
		'https://a.pub.network',
	],
	'style-src-elem': [
		"'self'",
		"'unsafe-inline'",

		'https://fonts.googleapis.com',
	],
	'img-src': [
		"'self'",
		'data:',

		// stuff that last.fm uses
		'https://*.last.fm',
		'https://lastfm-img.freetls.fastly.net',
		'https://*.fastly.net',
		'https://cdn.cookielaw.org',
		'https://img.youtube.com',

		// various image hosts
		'https://files.catbox.moe',
		'https://*.klipy.com',
		'https://*.tenor.com',
		'https://*.tenor.co',
		'https://images.weserv.nl',
		'https://icons.duckduckgo.com',
		'https://count.getloli.com',

		// various git sites
		'https://github.com',
		'https://gitlab.com',
		'https://codeberg.org',
		'https://*.github.io',
		'https://*.gitlab.io',
		'https://*.codeberg.page',
		'https://raw.githubusercontent.com',

		'https://katelyn.moe',
		'https://katelyynn.github.io',
		'https://*.discordapp.com',
		'https://*.discord.com',
	],
	'connect-src': [
		"'self'",
		'https://cdn.cookielaw.org',
		'https://geolocation.onetrust.com',
		'https://wss://html-load.cc',
		'https://*.newrelic.com',
		'https://status.cafe',
		'https://*.github.io',
		'https://ws.audioscrobbler.com',
		'https://*.katelyn.moe',
		'https://translate.googleapis.com',
	],
	'font-src': [
		"'self'",
		'https://fonts.gstatic.com',
		'https://*.github.io',
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
