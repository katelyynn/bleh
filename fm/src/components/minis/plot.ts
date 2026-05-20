import { html, render } from "lighterhtml";
import { auth, dialogs, page, root } from "@/build/page";
import { render_user } from "@/pages/home/minis";
import { tl, trans } from "@/build/trans";
import { dialog, dialog_rm } from "@/components/dialog/dialog";
import { input } from "@/components/settings/input";
import { icon, icons } from "../shared/icon";
import { select } from "../settings/select";
import { hybrid_timeframe_picker } from "../date/timeframe";
import { sanitise } from "@/build/tools";
import JSON5 from 'json5';
import { log } from "@/build/log";
import { prep_chart_colours } from "../music/chart";
import { Chart } from "chart.js";

export function plot({ host, sidebar } = {}) {
    if (!host || !sidebar) return;

    let data_points = [];

    let current_year = new Date().getFullYear();
    let previous_year = current_year - 1;

    let body;
    let timeframe;

    let from;
    let to;

    let data_source;
    let user;

    let add_data_point_btn;

    let allow_adding = true;

    render(host, html`
        <div class="plot-header">
            <div class="plot-header-side plot-header-side-main">
                <label class="plot-header-label">Add to graph</label>
                <div class="plot-header-options">
                    ${data_source = select({
                        values: [
                            {
                                text: 'Data source'
                            },
                            {
                                value: '{artist:"glaive",album:"God Save The Three"}',
                                text: 'glaive - God Save The Three'
                            }
                        ]
                    })}
                    ${user = select({
                        values: [
                            {
                                text: 'User'
                            },
                            {
                                value: auth.name,
                                text: auth.name
                            }
                        ]
                    })}
                    <button class="btn primary icon" data-type="plus" onclick=${() => add_data_point()} ref=${el => add_data_point_btn = el}>
                        ${tl(trans.add)}
                    </button>
                </div>
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

    prep_chart_colours();

    let scrobble_canvas_container = document.createElement('div');
    scrobble_canvas_container.classList.add('scrobble-canvas-container', 'icon-mask');

    let scrobble_canvas = document.createElement('canvas');
    scrobble_canvas.classList.add('scrobble-canvas');

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
                            return JSON.stringify(point.media);
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
            backgroundColor: gradient,
            borderColor: page.state.chart_colours.link_col,
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

    function update_chart() {
        chart.update();

        allow_adding = true;

        add_data_point_btn.disabled = false;
    }
}
