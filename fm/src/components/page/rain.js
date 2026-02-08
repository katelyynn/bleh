//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import {settings} from "./build/config";
import {html, render} from "lighterhtml";
import { page } from './build/page';

export function rain() {
    let rain_container = html.node`
        <div class="rain-container" />
    `;
    if (page.structure.rain) {
        rain_container = page.structure.rain;
        rain_container.remove();
    } else {
        page.structure.rain = rain_container;
    }

    let rain_main;
    let rain_back;
    render(rain_container, html`
        <div class="rain" ref=${el => rain_main = el} />
        <div class="rain rain-back" ref=${el => rain_back = el} />
    `);

    document.body.appendChild(rain_container);

    let increment = 0;
    let drops = '';
    let subtle_drops = '';

    while (increment < 60) {
        // random numbers
        let randoms = [
            (Math.floor(Math.random() * (98 - 1 + 1) + 1)),
            (Math.floor(Math.random() * (5 - 2 + 1) + 2))
        ];

        increment += randoms[1];

        drops += '<div class="drop" style="left: ' + increment + '%; bottom: ' + (randoms[1] + randoms[1] - 1 + 280) + '%; animation-delay: 0.' + randoms[0] + 's; animation-duration: 0.5' + randoms[0] + 's;"><div class="stem" style="animation-delay: 0.' + randoms[0] + 's; animation-duration: 0.5' + randoms[0] + 's;"></div><div class="splat" style="animation-delay: 0.' + randoms[0] + 's; animation-duration: 0.5' + randoms[0] + 's;"></div></div>';
        subtle_drops += '<div class="drop" style="right: ' + increment + '%; bottom: ' + (randoms[1] + randoms[1] - 1 + 280) + '%; animation-delay: 0.' + randoms[0] + 's; animation-duration: 0.5' + randoms[0] + 's;"><div class="stem" style="animation-delay: 0.' + randoms[0] + 's; animation-duration: 0.5' + randoms[0] + 's;"></div><div class="splat" style="animation-delay: 0.' + randoms[0] + 's; animation-duration: 0.5' + randoms[0] + 's;"></div></div>';

        rain_main.innerHTML = drops;
        rain_back.innerHTML = subtle_drops;
    }
}

export function start_rain() {
    if (settings.rain) rain();
}
