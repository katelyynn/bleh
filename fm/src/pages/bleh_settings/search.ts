import { settings_store } from '@/build/config';
import { tl, trans } from '@/build/trans';
import { input } from '@/components/settings/input';
import { html, render } from 'lighterhtml';
import { change_settings_page, scroll_to_setting } from './bleh_settings';
import { page } from '@/build/page';
import { icons } from '@/components/shared/icon';

export function settings_search(tabs) {
	return html.node`
        <section class="settings-search">
            ${
		input({
			placeholder: tl(trans.search_for_settings),
			func: (query: string) => {
				const results = make_search(tabs, query);
				change_settings_page('search');
				search_results(tabs, query, results);
			},
			icon: icons.search,
		})
	}
        </section>
    `;
}

function make_search(tabs, query: string) {
	query = query.toLowerCase().trim();
	const results: search_result[] = [];

	Object.entries(tabs).forEach(([key, tab]) => {
		if (!tab.settings) return;

		tab.settings.forEach((setting) => {
			const formal = settings_store[setting];
			if (!formal) return;

			let match = false;

			const name: string = tl(formal.title).toLowerCase() || '';
			const body: string = tl(formal.body).toLowerCase() || '';

			let tags = formal.tags;
			if (tags) {
				tags.forEach((tag) => {
					if (typeof tag == 'string') {
						if (tag.toLowerCase().includes(query)) match = true;
					} else if (typeof tag == 'object') {
						if (tl(tag).toLowerCase().includes(query)) match = true;
					}
				});
			}

			if (name.includes(query) || body.includes(query)) {
				match = true;
			}

			if (match) {
				results.push({
					id: setting,
					tab: key,
				});
			}
		});
	});

	return results;
}

interface search_result {
	id: string;
	tab: string;
}

function search_results(tabs, query: string, results: search_result[]) {
	render(
		page.structure.main,
		html`
			<section class="search-result-container">
				<p class="setting-search-results-count">${tl(
					trans.found_value_results,
					{ c: results.length },
				)}</p>
				<div class="setting-search-results">
			        ${results.map((result) => {
				const tab = tabs[result.tab];
				const formal = settings_store[result.id];

				return html.node`
                        <button class="btn setting-search-result" onclick=${() =>
					finalise_result(result)}>
                            <div class="bleh-icon" style="--icon: var(--mask)" data-bleh-page=${result.tab} data-type=${tab.icon} />
                            <div class="setting-search-result-info">
                                <strong class="setting-search-result-header">${
					tl(formal.title)
				}</strong>
                                ${
					formal.body
						? html.node`
                                    <p class="setting-search-result-body">${
							tl(formal.body)
						}</p>
                                `
						: ''
				}
                            </div>
                            <p class="setting-search-result-context">${tab.name}</p>
                        </button>
                    `;
			})}
			    </div>
			</section>
		`,
	);
}

function finalise_result(result: search_result) {
	change_settings_page(result.tab);
	scroll_to_setting(result.id);
}
