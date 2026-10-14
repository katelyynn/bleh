/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import esbuild from 'esbuild';
import * as fs from 'fs';

type BuildSchema = {
	brand: string;
	build: string;
	bio: string;
	author: string;
	url: string;
	built_on: string;
};

const build: BuildSchema = JSON.parse(
	fs.readFileSync('./src/build/build.json'),
);

async function bundle({ ...options }: esbuild.BuildOptions) {
	const start = Date.now();
	console.log(
		`%c📦 building`,
		'color:grey',
		'color:grey;font-weight:bold',
		'font-weight:regular;color:white',
	);

	await esbuild.build(options);

	console.log(
		`%c📦 build finished in %c${Date.now() - start}ms`,
		'color:grey',
		'color:grey;font-weight:bold;',
	);
}

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
// @grant        GM.xmlHttpRequest
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

const CSS_FOOTER = `
}`;

const bundle_css: esbuild.Plugin = {
	name: 'bundle_css',
	setup(build) {
		build.onLoad({ filter: /\.css$/ }, async (args) => {
			const result = await esbuild.build({
				entryPoints: [args.path],
				bundle: true,
				minify: true,
				write: false,
				loader: {
					'.css': 'css',
				},
			});

			return {
				contents: `export default ${
					JSON.stringify(result.outputFiles[0].text)
				}`,
				loader: 'js',
			};
		});
	},
};

const shared_opts: Omit<esbuild.BuildOptions, 'name'> = {
	entryPoints: ['./src/main.ts'],
	banner: { js: JS_BANNER, css: CSS_BANNER },
	bundle: true,
	minify: false,
	packages: 'bundle',
	platform: 'browser',
	format: 'iife',
	loader: { '.svg': 'text' },
	plugins: [bundle_css],
	minifyWhitespace: false,
	minifyIdentifiers: false,
	minifySyntax: false,
	globalName: 'bleh',
};

const userscript: esbuild.BuildOptions = {
	...shared_opts,
	outfile: 'bleh.user.js',
};

const usercss: esbuild.BuildOptions = {
	entryPoints: ['./src/styles/index.css'],
	banner: {
		css: CSS_BANNER,
	},
	footer: {
		css: CSS_FOOTER,
	},
	bundle: true,
	outfile: 'bleh.user.css',
	loader: { '.css': 'css' },
	minify: true,
};

const extension: esbuild.BuildOptions = {
	...shared_opts,
	outfile: 'ext/bleh.js',
	minify: true,
};

if (process.argv[2] == 'serve') {
	const js_context = await esbuild.context(userscript);
	const css_context = await esbuild.context(usercss);

	const serve = await js_context.serve({
		servedir: '',
	});

	await js_context.watch();
	await css_context.watch();

	for (const host of serve.hosts) {
		console.log(`http://${host}:${serve.port}`);
	}
} else {
	build.built_on = new Date().toISOString();
	await fs.writeFile(
		'./src/build/build.json',
		JSON.stringify(build, null, '\t'),
	);

	await bundle(userscript);
	const manifest = JSON.parse(
		await fs.readFile('./ext/manifest.json'),
	);
	manifest.name = build.brand;
	manifest.version = build.build.split('.')
		.map(part => parseInt(part, 10))
		.join('.');
	manifest.description = build.bio;
	await fs.readFile(
		'./ext/manifest.json',
		JSON.stringify(manifest, null, '\t'),
	);
	await bundle(extension);
}
