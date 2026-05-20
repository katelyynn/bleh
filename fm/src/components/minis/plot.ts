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

    function fetch_data_set(user: string, media: string) {
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
    }

    function add_data_point() {
        allow_adding = false;

        add_data_point_btn.disabled = true;

        fetch_data_set(user.value, data_source.value);
    }
}
