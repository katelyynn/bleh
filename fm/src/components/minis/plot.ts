import { html, render } from "lighterhtml";
import { auth, dialogs, page, root } from "@/build/page";
import { render_user } from "@/pages/home/minis";
import { tl, trans } from "@/build/trans";
import { dialog, dialog_rm } from "@/components/dialog/dialog";
import { input } from "@/components/settings/input";
import { icon, icons } from "../shared/icon";
import { select } from "../settings/select";
import { hybrid_timeframe_picker } from "../date/timeframe";
import { romanise, sanitise } from "@/build/tools";
import JSON5 from 'json5';
import { log } from "@/build/log";
import { prep_chart_colours } from "../music/chart";
import { Chart } from "chart.js";
import { correct_artist, correct_item_by_artist } from "../music/lotus";

export function plot({ host, sidebar } = {}) {
    if (!host || !sidebar) return;

    let data_points = [];

    let temporary_data_source = {};

    let current_year = new Date().getFullYear();
    let previous_year = current_year - 1;

    let selected_data_source = '';

    let body;
    let timeframe;

    let from;
    let to;

    let data_source;
    let user;

    let add_data_point_btn;

    let allow_adding = true;

    let plot_header_options;

    render(host, html`
        <div class="plot-header">
            <div class="plot-header-side plot-header-side-main">
                <label class="plot-header-label">Add to graph</label>
                <div class="plot-header-options" ref=${el => plot_header_options = el} />
            </div>
            <div class="plot-header-side">
                <label class="plot-header-label">Graph options</label>
                <div class="plot-header-options">
                    ${timeframe = hybrid_timeframe_picker({
                        initial: 'date_preset=ALL',
                        time_from: from,
                        time_to: to,
                        func: ({ from: new_from, to: new_to }) => {
                            from = new_from;
                            to = new_to;
                        }
                    })}
                </div>
            </div>
        </div>
        <div class="plot-body" ref=${el => body = el} />
        <div class="plot-footer">

        </div>
    `);

    update_plot_options();

    function update_plot_options() {
        const data_source_history = JSON5.parse(localStorage.getItem('bleh_plot_data_history') || '[]');

        const unique_users = [...new Set(data_points.map(item => item.user))];

        const seen_media = new Set();
        const unique_media = [];

        data_points.forEach(point => {
            const media_string = JSON5.stringify(point.media);

            if (!seen_media.has(media_string)) {
                seen_media.add(media_string);
                unique_media.push(point.media);
            }
        });

        const media = [];
        unique_media.forEach(item => {
            media.push({
                value: JSON5.stringify(item),
                text: plot_media_title(item, true)
            });
        });

        const media_history = [];
        data_source_history.forEach(point => {
            const media_string = JSON5.stringify(point);

            if (!unique_media.includes(media_string)) {
                media_history.push({
                    value: media_string,
                    text: plot_media_title(point, true)
                })
            }
        });

        if (Object.keys(temporary_data_source).length > 0) {
            media.unshift({
                value: JSON5.stringify(temporary_data_source),
                text: plot_media_title(temporary_data_source, true)
            });
        }

        console.info('media', media, media_history);

        render(plot_header_options, html`
            ${data_source = select({
                values: [
                    {
                        text: 'Data source'
                    },
                    {
                        type: 'plus',
                        text: tl(trans.add),
                        action: add_new_data_source
                    },
                    {
                        text: 'sep'
                    },
                    ...media,
                    {
                        text: 'sep'
                    },
                    ...media_history
                ],
                func: (val: string) => {
                    selected_data_source = val;
                },
                initial: selected_data_source
            })}
            ${user = select({
                values: [
                    {
                        text: 'User'
                    },
                    {
                        value: auth.name,
                        text: auth.name
                    },
                    {
                        value: 'evangelicgirl',
                        text: 'evangelicgirl'
                    }
                ]
            })}
            <button class="btn primary icon" data-type="plus" onclick=${() => add_data_point()} ref=${el => add_data_point_btn = el}>
                ${tl(trans.add)}
            </button>
        `);
    }

    prep_chart_colours();

    let scrobble_canvas_container = document.createElement('div');
    scrobble_canvas_container.classList.add('plot-canvas-container');

    let scrobble_canvas = document.createElement('canvas');
    scrobble_canvas.classList.add('plot-canvas');

    let gradient = scrobble_canvas
        .getContext('2d')
        .createLinearGradient(0, 0, 0, 160);
    try {
        gradient.addColorStop(0, page.state.chart_colours.link_bg_col);
        gradient.addColorStop(1, page.state.chart_colours.link_bg_col_2);
    } catch (e) {
        gradient = page.state.chart_colours.link_bg_col;
    }

    Chart.defaults.color = page.state.chart_colours.text_col;
    Chart.defaults.font.family = page.state.chart_colours.font;
    const chart = new Chart(scrobble_canvas.getContext('2d'), {
        type: 'line',
        data: {
            datasets: data_points
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                },
                tooltip: {
                    backgroundColor: page.state.chart_colours.root_bg_col,
                    titleColor: page.state.chart_colours.text_primary_col,
                    bodyColor: page.state.chart_colours.text_primary_col,
                    multiKeyBackground: page.state.chart_colours.root_bg_col,
                    boxPadding: 6,
                    padding: 9,
                    cornerRadius: 9,
                    caretSize: 0,
                    callbacks: {
                        title: (context) => {
                            const point = context[0].dataset;
                            return point.user;
                        },
                        afterTitle: (context) => {
                            const point = context[0].dataset;
                            return plot_media_title(point.media);
                        },
                        label: (context) => {
                            const point = context.raw;
                            return point.y;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'month',
                        displayFormats: {
                            month: 'LLL'
                        },
                        tooltipFormat: 'EEEE, LLLL d yyyy'
                    },
                    grid: {
                        color: page.state.chart_colours.axis_col,
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    },
                    suggestedMax: 10
                }
            }
        }
    });

    scrobble_canvas_container.appendChild(scrobble_canvas);

    body.appendChild(scrobble_canvas_container);

    async function fetch_data_set(user: string, media: string) {
        console.info('user', user, 'media', media);
        const data_point = JSON5.parse(media);

        let media_url;
        let type;

        if (data_point.album && data_point.artist) {
            media_url = `${sanitise(data_point.artist)}/${sanitise(data_point.album)}`;
        } else if (data_point.track && data_point.artist) {
            media_url = `${sanitise(data_point.artist)}/${sanitise(data_point.album)}`;
        } else {
            media_url = sanitise(data_point.artist);
        }

        const url = `${root}user/${user}/library/music/${media_url}?${timeframe.value}`;
        console.info('timeframe url', url);

        const res = await fetch(url);
        if (!res.ok) {
            log('failed to fetch', 'plot', 'error', { res });
            return;
        }

        const dom = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(dom, 'text/html');

        const table = doc.querySelector('.scrobble-table');
        if (!table) {
            log('failed to find table', 'plot', 'error', { table });
            return;
        }

        const entries = table.querySelectorAll('tbody tr');
        console.info('table', table, entries);

        const point = {
            user,
            media: data_point,
            data: [],
            borderWidth: 2,
            fill: true,
            pointRadius: 0,
            pointHitRadius: 20,
            tension: 0.1
        };

        entries.forEach(entry => {
            const period = entry.querySelector('.js-period > a')?.getAttribute('href');
            const params = new URLSearchParams(period);

            const from = params.get('from');

            const scrobbles = Number(entry.querySelector('.js-scrobbles').textContent.trim());

            point.data.push({
                x: from,
                y: scrobbles
            });
        });

        console.info('point', point);

        data_points.push(point);
        update_chart();

        page.structure.main.appendChild(table);
    }

    function add_data_point() {
        allow_adding = false;

        add_data_point_btn.disabled = true;

        fetch_data_set(user.value, data_source.value);
    }

    page.state.update_plot_chart = update_chart;

    function update_chart() {
        const computed = getComputedStyle(document.body);

        const graph_colours = Array.from({ length: 13 }, (_, i) =>
            `${computed.getPropertyValue(`--graph-colour-${i}`)}`
        );

        graph_colours.forEach((colour, index) => {
            page.structure.side.appendChild(html.node`<div style="background-color: var(--graph-colour-${index}); display: block; width: 40px; height: 40px"></div>`);
        });

        data_points.forEach((point, index) => {
            point.backgroundColor = 'transparent';
            point.borderColor = graph_colours[index % graph_colours.length];
        });

        chart.update();

        allow_adding = true;

        add_data_point_btn.disabled = false;
    }

    function add_new_data_source() {
        let artist;
        let album;
        let track;

        dialog({
            id: 'add_new_data_source',
            title: 'Add new data source',
            body: html.node`
                ${artist = input({
                    warn_if_empty: true
                })}
                ${album = input({
                    placeholder: 'album'
                })}
                ${track = input({
                    placeholder: 'track'
                })}
                <button class="btn primary icon" data-type="plus" onclick=${complete_add}>
                    ${tl(trans.add)}
                </button>
            `
        });

        function complete_add() {
            temporary_data_source = {
                artist: artist.value
            }

            if (album.value) {
                temporary_data_source.album = album.value;
            } else if (track.value) {
                temporary_data_source.track = track.value;
            }

            dialog_rm({ id: 'add_new_data_source' });
            selected_data_source = JSON5.stringify(temporary_data_source);
            update_plot_options();
        }
    }
}

interface plot_media {
    artist: string,
    album?: string,
    track?: string
}

function plot_media_title(data: plot_media, fancy = false) {
    let text;
    let icon_name;

    if (data.album) {
        text = `${romanise(correct_artist(data.artist))} - ${romanise(correct_item_by_artist(data.album, data.artist))}`;
        icon_name = icons.album;
    } else if (data.track) {
        text = `${romanise(correct_artist(data.artist))} - ${romanise(correct_item_by_artist(data.track, data.artist))}`;
        icon_name = icons.track;
    } else {
        text = romanise(correct_artist(data.artist));
        icon_name = icons.artist;
    }

    if (fancy) {
        return html`<span class="bleh-icon" data-type=${icon_name} style="--icon: var(--mask)" />${text}`;
    }

    return text;
}
