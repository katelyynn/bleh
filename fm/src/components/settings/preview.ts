/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { html } from 'lighterhtml';

export function render_track_preview(
	val: boolean,
	bar = false,
	art = true,
	has_realtime = false,
) {
	let bar_width = 100;

	return html.node`
        <div class="tracks recent_listening ${val ? 'blur' : ''}">
            ${track_preview(has_realtime)}
            ${Array.from({ length: 4 }).map(() => track_preview())}
        </div>
    `;

	function track_preview(realtime = false) {
		return html.node`
            <div class="track ${realtime ? 'realtime' : ''}">
                ${
			art
				? html.node`
                    <div class="cover" />
                `
				: ''
		}
                <div class="title" />
                <div class="artist" />
                ${
			!bar
				? html.node`
                    <div class="time" />
                `
				: () => {
					const elem = html.node`
                        <div class="bar">
                            <div class="fill" style="width: ${bar_width}%" />
                        </div>
                    `;

					bar_width *= 0.75;

					return elem;
				}
		}
            </div>
        `;
	}
}

export function render_shoutbox_preview(val: boolean) {
	return html.node`
        <div class="shouts ${val ? 'blur' : ''}">
            ${Array.from({ length: 3 }).map(() => shout_preview())}
        </div>
    `;

	function shout_preview() {
		return html.node`
            <div class="shout-preview">
                <div class="shout-preview-avatar">
                    <div class="shout-avatar-placeholder"></div>
                </div>
                <div class="shout-preview-info">
                    <div class="shout-preview-header">
                        <div class="shout-preview-username"></div>
                        <div class="shout-preview-time"></div>
                    </div>
                    <div class="shout-preview-contents"></div>
                    <div class="shout-preview-contents second"></div>
                </div>
            </div>
        `;
	}
}

export function render_chart_preview(
	type: 'album' | 'artist',
	second_row = true,
	primary = false,
) {
	if (primary) {
		return html.node`
            <div class="grid-items-preview">
                <div class="grid-primary">
                    ${grid_preview()}
                </div>
                <div class="grid-mains">
                    <div class="grid-main">
                        ${Array.from({ length: 2 }).map(() => grid_preview())}
                    </div>
                    ${
			second_row
				? html.node`
                        <div class="grid-main">
                            ${
					Array.from({ length: 2 }).map(() => grid_preview())
				}
                        </div>
                    `
				: ''
		}
                </div>
            </div>
        `;
	}

	return html.node`
        <div class="grid-items-preview">
            <div class="grid-mains">
                <div class="grid-main">
                    ${Array.from({ length: 4 }).map(() => grid_preview())}
                </div>
                ${
		second_row
			? html.node`
                    <div class="grid-main">
                        ${Array.from({ length: 4 }).map(() => grid_preview())}
                    </div>
                `
			: ''
	}
            </div>
        </div>
    `;

	function grid_preview() {
		return html.node`
            <div class="grid-item-preview grid-item-${type} icon-mask" />
        `;
	}
}
