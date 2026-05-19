import { tl, trans } from "@/build/trans";
import { html, render } from "lighterhtml";
import tippy from "tippy.js";
import { setting } from "../settings/settings";
import { settings } from "@/build/config";
import { input } from "../settings/input";

interface hybrid_timeframe_picker {
    initial?: string
}

export function hybrid_timeframe_picker({
    initial
}: hybrid_timeframe_picker) {
    let value = 'date_preset=LAST_7_DAYS';
    if (initial) value = initial;

    const elem = html.node`
        <button class="select-button" type="button" />
    `;

    let menu = tippy(elem, {
        theme: 'window',
        content: html.node``,
        placement: 'bottom',
        interactive: true,
        interactiveBorder: 10,
        trigger: 'click',
        appendTo: document.body
    });

    Object.defineProperty(elem, 'value', {
        get() {
            return value;
        },
        set(val: string) {
            set_value(val);
        }
    });

    let content;

    let timeframe_valid = true;

    set_value(value);

    function set_value(val: string) {
        value = val;
        elem.textContent = timeframe_text(val);

        menu.setContent(html.node`
            <div class="timeframe-menu">
                ${setting({ id: 'date_selector', func: (val: string) => render_page(val) })}
                <div class="timeframe-menu-content" ref=${el => content = el} />
            </div>
        `);

        render_page(settings.date_selector);
    }

    function render_page(page: string) {
        if (!['preset', 'custom'].includes(page)) page = 'preset';

        if (page == 'preset') {
            const years = Array.from({ length: new Date().getFullYear() - 2002 }, (_, i) => 2003 + i).reverse();

            render(content, html`
                <div class="date-range-picker-presets-wrap">
                    <ul class="date-range-picker-presets">
                        ${render_timeframe_preset('date_preset=LAST_7_DAYS')}
                        ${render_timeframe_preset('date_preset=LAST_30_DAYS')}
                        ${render_timeframe_preset('date_preset=LAST_90_DAYS')}
                    </ul>
                    <ul class="date-range-picker-presets date-range-picker-presets--col-2">
                        ${render_timeframe_preset('date_preset=LAST_180_DAYS')}
                        ${render_timeframe_preset('date_preset=LAST_365_DAYS')}
                        ${render_timeframe_preset('date_preset=ALL')}
                    </ul>
                </div>
                <div class="date-range-picker-years">
                    ${years.map((year: number) => render_timeframe_preset(`from=${year}-01-01&rangetype=year`))}
                </div>
            `);
            return;
        }

        if (page == 'custom') {
            const now = new Date();
            now.setHours(23, 59, 59, 999);

            let from;
            let to;

            render(content, html`
                <div class="timeframe-picker-custom">
                    <div class="timeframe-picker-item">
                        <label class="timeframe-picker-label">From</label>
                        ${from = input({
                            type: 'date',
                            min: '2003-01-01',
                            max: now.toISOString(),
                            show_time: false,
                            func: () => check_timeframe_valid()
                        })}
                    </div>
                    <div class="timeframe-picker-item">
                        <label class="timeframe-picker-label">To</label>
                        ${to = input({
                            type: 'date',
                            min: '2003-01-01',
                            max: now.toISOString(),
                            value: now.toISOString(),
                            show_time: false,
                            func: () => check_timeframe_valid()
                        })}
                    </div>
                </div>
            `);

            function check_timeframe_valid() {
                timeframe_valid = true;

                if (new Date(from.value()) > new Date(to.value())) {
                    timeframe_valid = false;
                }
            }

            return;
        }

        render(content, html``);
    }

    function render_timeframe_preset(type: string) {
        const current = type == value;

        return html.node`
            <li class="date-range-picker-preset ${current ? 'date-range-picker-preset--selected' : ''}">
                <button class="btn date-picker-preset-item" onclick=${() => set_value(type)}>${timeframe_text(type)}</button>
            </li>
        `;
    }

    return elem;
}

function timeframe_text(value: string) {
    if (value.startsWith('date_preset=')) {
        if (value == 'date_preset=ALL') return tl(trans.all_time);

        return tl(trans.last_count_days, { c: value.match(/\d+/)[0] });
    } else if (value.startsWith('from=')) {
        return value.match(/\d{4}/)[0];
    }
}
