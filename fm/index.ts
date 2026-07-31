//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2026 katelyn and contributors
// Licensed under GPLv3
//

import { serveDir } from '@std/http/file-server';

type BuildSchema = {
	brand: string;
	build: string;
	bio: string;
	author: string;
	url: string;
	built_on: string;
};
type BundleOptions = Deno.bundle.Options & {
	name: string;
	banners: { js: string; css: string };
};

function print_message(
	message: Deno.bundle.Message,
	severity: 'warning' | 'error',
) {
	const { text, location } = message;
	let output = `%c${severity}%c: ${text}`;
	if (location != null) {
		output +=
			`\n\tat file://${location.file}:${location.line}:${location.column}`;
	}
	if (severity == 'warning') {
		console.warn(output, 'color:yellow;font-weight:bold', 'color:white');
	} else if (severity == 'error') {
		console.error(output, 'color:red;font-weight:bold', 'color:white');
	}
}

async function bundle({ name, banners, ...options }: BundleOptions) {
	console.log(
		`\n%c📦 building %c${name}%c`,
		'color:grey',
		'color:grey;font-weight:bold',
		'font-weight:regular;color:white',
	);
	const result = await Deno.bundle(options);
	result.warnings.map((w) => print_message(w, 'warning'));
	if (result.success) {
		for (const file of result.outputFiles!) {
			const path = file.path;
			const extension = path.split('.').pop();
			if (extension == 'js') {
				await Deno.writeTextFile(path, banners.js + '\n' + file.text());
			} else if (extension == 'css') {
				await Deno.writeTextFile(
					path,
					banners.css + '\n\n' + file.text(),
				);
			}
		}
	} else {
		result.errors.map((e) => print_message(e, 'error'));
		console.error(
			`%c🚫 build failed%c\n`,
			'color:grey',
			'color:white',
		);
		Deno.exit(1);
	}
}

const build: BuildSchema = JSON.parse(
	await Deno.readTextFile('./src/build/build.json'),
);
build.built_on = new Date().toISOString();
await Deno.writeTextFile(
	'./src/build/build.json',
	JSON.stringify(build, null, '\t'),
);

const JS_BANNER = `// ==UserScript==
// @name         ${build.brand}
// @namespace    https://last.fm/
// @version      ${build.build}
// @description  ${build.bio}
// @author       ${build.author}
// @match        https://www.last.fm/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=last.fm
// @updateURL    ${build.url}
// @downloadURL  ${build.url}
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      musicbrainz.org
// @connect      raw.githubusercontent.com
// @connect      github.com
// ==/UserScript==`;

const CSS_BANNER = `/* ==UserStyle==
@name           ${build.brand} (re:dev)
@namespace      github.com/katelyynn/bleh
@version        ${build.build}
@license        GPL-3.0
@author         ${build.author}
==/UserStyle== */

@-moz-document domain("www.last.fm") {`;

const shared_opts: Omit<BundleOptions, 'name'> = {
	entrypoints: ['./src/main.js'],
	banners: { js: JS_BANNER, css: CSS_BANNER },
	minify: false,
	write: false,
	inlineImports: true,
	packages: 'bundle',
	platform: 'browser',
	format: 'iife',
};

const userscript: BundleOptions = {
	...shared_opts,
	name: 'userscript',
	outputPath: 'bleh.user.js',
};

const extension: BundleOptions = {
	...shared_opts,
	name: 'extension',
	outputPath: 'ext/bleh.js',
	minify: true,
};

if (Deno.args[0] == 'serve') {
	await bundle(userscript);
	Deno.serve((req) => serveDir(req));
} else {
	await bundle(userscript);
	const manifest = JSON.parse(
		await Deno.readTextFile('./ext/manifest.json'),
	);
	manifest.name = build.brand;
	manifest.version = build.build.split('.')
		.map((part) => parseInt(part, 10))
		.join('.');
	manifest.description = build.bio;
	await Deno.writeTextFile(
		'./ext/manifest.json',
		JSON.stringify(manifest, null, '\t'),
	);
	await bundle(extension);
}
