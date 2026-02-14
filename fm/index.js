//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import esbuild from 'esbuild';
import fs from 'fs';
import build from './src/build/build.json' with { type: 'json' };

const js_banner = `// ==UserScript==
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

const css_banner = `/* ==UserStyle==
@name           ${build.brand} (re:dev)
@namespace      github.com/katelyynn/bleh
@version        ${build.build}
@license        GPL-3.0
@author         ${build.author}
==/UserStyle== */

@-moz-document domain("www.last.fm") {`;

const css_footer = `
}`;

function normalise_version(version) {
    return version
        .split('.')
        .map((part) => String(parseInt(part, 10)))
        .join('.');
}

(async () => {
    const userscript = {
        entryPoints: ['./src/main.js'],
        bundle: true,
        logLimit: 0,
        outfile: 'bleh.user.js',
        minify: false,
        banner: {
            js: js_banner
        },
        platform: 'browser',
        loader: {
            '.css': 'text'
        }
    };

    const extension = {
        entryPoints: ['./src/main.js'],
        bundle: true,
        logLimit: 0,
        outfile: 'ext/bleh.js',
        minify: true,
        banner: {
            js: js_banner
        },
        platform: 'browser',
        loader: {
            '.css': 'text'
        }
    };

    const manifest = {
        manifest_version: 3,
        name: build.brand,
        version: normalise_version(build.build),
        description: build.bio,
        icons: {
            16: 'icon-16.png',
            32: 'icon-32.png',
            48: 'icon-48.png',
            128: 'icon-128.png'
        },
        content_scripts: [
            {
                matches: ['https://www.last.fm/*'],
                js: ['bleh.js'],
                run_at: 'document_start'
            }
        ],
        host_permissions: ['https://katelyynn.github.io/*']
    };

    if (process.argv[2] == 'dev') {
        const js_context = await esbuild.context(userscript);
        const css_context = await esbuild.context({
            entryPoints: ['./src/styles/index.css'],
            bundle: true,
            outfile: 'bleh.user.css',
            banner: {
                css: css_banner
            },
            footer: {
                css: css_footer
            },
            loader: {
                '.css': 'css'
            }
        });

        const serve = await js_context.serve({
            servedir: '.'
        });

        await js_context.watch();
        await css_context.watch();

        console.log('serving on: ');
        for (const host of serve.hosts) {
            console.log(` \u001b[32mhttp://${host}:${serve.port}`);
        }
    } else {
        await esbuild.build(userscript);
        await esbuild.build({
            entryPoints: ['./src/styles/index.css'],
            bundle: true,
            minify: true,
            outfile: 'bleh.css',
            loader: {
                '.css': 'css'
            }
        });

        await esbuild.build(extension);
        fs.mkdirSync('ext/', { recursive: true });
        fs.writeFileSync('ext/manifest.json', JSON.stringify(manifest));
    }
})();
