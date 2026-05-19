import { tl, trans } from "@/build/trans";
import { html, render } from "lighterhtml";
import tippy from "tippy.js";
import { setting } from "../settings/settings";
import { settings } from "@/build/config";

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
        placement: 'top',
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
            `);
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
    }
}
