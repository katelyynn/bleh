import { settings_store } from "@/build/config";
import { tl, trans } from "@/build/trans";
import { input } from "@/components/settings/input";
import { html, render } from "lighterhtml";
import { change_settings_page } from "./bleh_settings";
import { page } from "@/build/page";

export function settings_search(tabs) {
    return html.node`
        <section class="settings-search">
            ${input({
                placeholder: tl(trans.search_for_settings),
                func: (query: string) => {
                    const results = make_search(tabs, query);
                    change_settings_page('search');
                    search_results(tabs, query, results);
                }
            })}
        </section>
    `;
}

function make_search(tabs, query: string) {
    query = query.toLowerCase().trim();
    const results: search_result[] = [];

    Object.entries(tabs).forEach(([key, tab]) => {
        if (!tab.settings) return;

        tab.settings.forEach(setting => {
            const formal = settings_store[setting];
            if (!formal) return;

            let match = false;

            const name: string = tl(formal.title).toLowerCase() || '';
            const body: string = tl(formal.body).toLowerCase() || '';

            let tags = formal.tags;
            if (tags) {
                tags.forEach(tag => {
                    if (typeof tag == 'string') {
                        if (tag.toLowerCase().includes(query)) match = true;
                    } else if (typeof tag == 'object') {
                        if (tl(tag).toLowerCase().includes(query)) match = true;
                    }
                });
            }

            if (name.includes(query) || body.includes(query))
                match = true;

            if (match) {
                results.push({
                    id: setting,
                    tab: key
                });
            }
        });
    });

    return results;
}

interface search_result {
    id: string,
    tab: string
}

function search_results(tabs, query: string, results: search_result[]) {
    render(page.structure.main, html`
        <p>found ${results.length} result(s)</p>
        ${results.map(result => html.node`
            <div>${result.id} - ${result.tab}</div>
        `)}
    `);
}
