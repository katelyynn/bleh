/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { denoPlugin } from '@deno/esbuild-plugin';
import { serveDir } from '@std/http/file-server';
import esbuild from 'esbuild';

type BuildSchema = {
	brand: string;
	build: string;
	bio: string;
	author: string;
	url: string;
	built_on: string;
};
type BundleOptions = esbuild.BuildOptions & {
	name: string;
};

async function bundle({ name, ...options }: BundleOptions) {
	const start = Date.now();
	console.log(
		`%c📦 building %c${name}%c`,
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
				loader: { '.css': 'css' },
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

const shared_opts: Omit<BundleOptions, 'name'> = {
	entryPoints: ['./src/main.js'],
	banner: { js: JS_BANNER, css: CSS_BANNER },
	bundle: true,
	minify: false,
	write: true,
	packages: 'bundle',
	platform: 'browser',
	format: 'iife',
	loader: { '.svg': 'text' },
	plugins: [bundle_css, denoPlugin()],
	minifyWhitespace: true,
	minifyIdentifiers: false,
	minifySyntax: false,
	globalName: 'bleh',
};

const userscript: BundleOptions = {
	...shared_opts,
	name: 'userscript',
	outfile: 'bleh.user.js',
};

const usercss: BundleOptions = {
	entryPoints: ['./src/styles/index.css'],
	banner: {
		css: CSS_BANNER,
	},
	footer: {
		css: CSS_FOOTER,
	},
	bundle: true,
	name: 'usercss',
	outfile: 'bleh.user.css',
	loader: { '.css': 'css' },
	minify: true,
};

const extension: BundleOptions = {
	...shared_opts,
	name: 'extension',
	outfile: 'ext/bleh.js',
	minify: true,
};

if (Deno.args[0] == 'serve') {
	await bundle(userscript);
	await bundle(usercss);
	Deno.serve((req) =>
		serveDir(req, {
			showDirListing: true,
		})
	);
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
