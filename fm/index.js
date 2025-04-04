import esbuild from "esbuild"
import build from "./src/build/build.json" with {type: "json"};

const banner = `// ==UserScript==
// @name         ${build.brand}
// @namespace    http://last.fm/
// @version      ${build.build}
// @description  ${build.bio}
// @author       ${build.author}
// @match        https://www.last.fm/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=last.fm
// @updateURL    ${build.url}
// @downloadURL  ${build.url}
// @run-at       document-start
// @require      https://cdnjs.cloudflare.com/ajax/libs/showdown/2.1.0/showdown.min.js
// @require      https://unpkg.com/@popperjs/core@2.11.8/dist/umd/popper.min.js
// @require      https://unpkg.com/tippy.js@6.3.7/dist/tippy.umd.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.0/color-thief.umd.js
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js
// @require      https://cdn.jsdelivr.net/npm/chartjs-adapter-moment@^1
// ==/UserScript==`;


(async () => {
    const buildOptions = {
        entryPoints: ["./src/main.js"],
        bundle: true,
        logLimit: 0,
        outfile: "bleh.user.js",
        minify: false,
        banner: {
            js: banner
        }
    };
    if (process.argv[2] == "dev") {
        const context = await esbuild.context(buildOptions);
        const serve = await context.serve()
        await context.watch()

        console.log("Serving on: ")
        for(const host of serve.hosts) {
            console.log(` \u001b[32mhttp://${host}:${serve.port}`)
        }
    } else {
        await esbuild.build(buildOptions);
    }
})();