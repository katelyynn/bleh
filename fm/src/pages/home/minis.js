//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { update_page } from '@/page';
import { auth, page, root } from '@/build/page';
import { html, render } from 'lighterhtml';
import { tl, trans } from '@/build/trans';
import { collage } from '@/components/minis/collage';
import { compare } from '@/components/minis/compare';
import { pixel } from '@/components/minis/pixel';
import { ff } from '@/components/settings/sku';
import { plot } from '@/components/minis/plot';
import { new_indicator } from '@/components/shared/indicator';
import { card } from '@/components/minis/card';
import { markdown } from '@/components/shared/markdown';

let valid_minis;

export function bleh_minis(skip = false) {
	if (!skip) {
		update_page();

		// remove error stuff cus we control this page
		page.structure.row.removeChild(page.structure.row.firstElementChild);
		page.structure.row.removeChild(page.structure.row.firstElementChild);
	}

	let params = new URLSearchParams(document.location.search);
	page.requested.profile = params.get('profile') || auth.name;
	page.requested.secondary = params.get('secondary');
	page.requested.redirect = params.get('redirect');
	page.requested.type = params.get('type');
	page.requested.timeframe = params.get('timeframe');

	let path = window.location.pathname.split('/');
	let mini = path[path.length - 1];

	if (mini == 'minis') mini = null;

	valid_minis = {
		collage: {
			name: tl(trans.collage),
			body: tl(trans.collage_description),
			func: bleh_minis_collage,
			by: ['dressupdarling'],
		},
		compare: {
			name: tl(trans.compare),
			body: tl(trans.compare_description),
			func: bleh_minis_compare,
			by: ['dressupdarling'],
		},
		plot: {
			name: tl(trans.plot.name),
			body: tl(trans.plot.body),
			func: bleh_minis_plot,
			by: ['dressupdarling'],
			new_release: true,
		},
		card: {
			name: tl(trans.card.name),
			body: tl(trans.card.body),
			func: bleh_minis_card,
			by: ['dressupdarling'],
			new_release: true,
			hide_if: !ff('unlock_minis'),
		},
		atlas: {
			name: tl(trans.atlas?.name),
			body: tl(trans.atlas?.body),
			func: bleh_minis_atlas,
			hide_if: !ff('unlock_minis'),
			new_release: true,
		},
		pixel: {
			name: tl(trans.pixel?.name),
			body: tl(trans.pixel?.body),
			func: bleh_minis_pixel,
			hide_if: !ff('unlock_minis'),
			by: ['dressupdarling'],
		},
		lyrics: {
			name: tl(trans.lyrics?.name),
			body: tl(trans.lyrics?.body),
			func: bleh_minis_lyrics,
			hide_if: !ff('unlock_minis'),
		},
		rainbow: {
			name: tl(trans.rainbow?.name),
			body: tl(trans.rainbow?.body),
			func: bleh_minis_rainbow,
			hide_if: !ff('unlock_minis'),
		},
		receipt: {
			name: tl(trans.receipt?.name),
			body: tl(trans.receipt?.body),
			func: bleh_minis_receipt,
			hide_if: !ff('unlock_minis'),
		},
	};

	if (mini && (!valid_minis[mini] || valid_minis[mini].hide_if)) {
		render(
			page.structure.main,
			html`
				<section class="minis">
				    ${return_to_minis()}
				    <div class="loading-data-container">
				        <div class="loading-data-text error">
				            ${tl(trans.no_mini_found).replace('{v}', mini)}
				        </div>
				    </div>
				</section>
			`,
		);
		return;
	}

	render(page.structure.side, html``);

	page.avatar = '';
	page.name = page.requested.profile;
	if (page.name == auth.name) page.avatar = auth.avatar;

	if (mini) {
		page.structure.container.setAttribute('data-mini', mini);
		page.mini = mini;

		valid_minis[mini].func();
		return;
	}

	render(
		page.structure.main,
		html`
			<section class="minis">
				<div class="minis-header main">
					<div class="minis-header-vertical">
						<h2 class="minis-header-text">${tl(trans.minis)}</h2>
						<p class="minis-header-body">${tl(
							trans.minis_description,
						)}</p>
					</div>
					<div class="minis-header-bg" />
				</div>
				<div class="mini-list">
			        ${Object.entries(valid_minis).map(([id, mini]) => {
				if (mini.hide_if) return html.node``;

				return html.node`
                            <button class="btn mini" data-type=${id} data-mini=${id} onclick=${() => {
					window.history.replaceState(
						id,
						'',
						`${root}bleh/minis/${id}`,
					);
					page.structure.container.setAttribute(
						'data-mini',
						id,
					);
					page.mini = id;
					render(page.structure.main, html``);
					valid_minis[id].func();
				}}>
                                <div class="mini-icon colourful">
                                    <div class="bleh-icon" />
                                </div>
                                <div class="mini-info">
                                    <h5>${mini.name}${
					mini.new_release ? new_indicator() : ''
				}</h5>
                                    <p>${mini.body}</p>
                                </div>
                                <div class="bleh-icon mini-arrow" style="--icon: var(--mask)" data-type="arrow-right" />
                            </button>
                        `;
			})}
			    </div>
				<p class="card-tip">
			        ${{
				html: tl(trans.labs_cta)
					.replace(
						'{a}',
						`<a class="see-more" href="${root}labs">`,
					)
					.replace('{/a}', '</a>'),
			}}
			    </p>
			</section>
		`,
	);
}

function return_to_minis(mini = '') {
	return html.node`
        <div class="minis-header">
            <button class="btn news-update-action chibi icon-mask" data-type="prev" onclick=${() => {
		window.history.replaceState(null, '', `${root}bleh/minis`);
		bleh_minis(true);
	}}>
                ${tl(trans.prev)}
            </button>
            <div class="minis-header-vertical">
                <h2 class="minis-header-text previous">${tl(trans.minis)}</h2>
                <h2 class="minis-header-text">${
		mini ? valid_minis[mini].name : tl(trans.error)
	}</h2>
            </div>
            <div class="minis-header-bg colourful" data-mini=${mini} />
        </div>
    `;
}

function bleh_minis_collage() {
	let content;
	let mini_settings;

	render(
		page.structure.main,
		html`
			<section class="minis">
			    ${return_to_minis('collage')}
			    <div class="minis-content" ref=${(el) => (content = el)} />
			</section>
		`,
	);

	render(
		page.structure.side,
		html`
			<section
				class="current-mini-settings"
				ref=${(el) => (mini_settings = el)}
			/>
			<section class="mini-faq">
				<p class="card-tip">
			        ${tl(trans.value_by_user, {
				v: valid_minis.collage.name,
				u: valid_minis.collage.by.join(','),
			})}
			    </p>
			</section>
		`,
	);

	collage({
		host: content,
		sidebar: mini_settings,
	});
}

function bleh_minis_compare() {
	let content;
	let mini_settings;

	render(
		page.structure.main,
		html`
			<section class="minis">
			    ${return_to_minis('compare')}
			    <div class="minis-content" ref=${(el) => (content = el)} />
			</section>
		`,
	);

	render(
		page.structure.side,
		html`
			<section
				class="current-mini-settings"
				ref=${(el) => (mini_settings = el)}
			/>
			<section class="mini-faq">
				<p class="card-tip">
			        ${tl(trans.value_by_user, {
				v: valid_minis.compare.name,
				u: valid_minis.compare.by.join(','),
			})}
			    </p>
			</section>
		`,
	);

	compare({
		host: content,
		sidebar: mini_settings,
	});
}

function bleh_minis_plot() {
	let content;
	let mini_settings;

	render(
		page.structure.main,
		html`
			<section class="minis">
			    ${return_to_minis('plot')}
			    <div class="minis-content" ref=${(el) => (content = el)} />
			</section>
		`,
	);

	render(
		page.structure.side,
		html`
			<section class="summary">
				<h2>${tl(trans.how_to_plot)}</h2>
				<div class="step-list">
			        ${Array.from({ length: 4 }, (_, i) => {
				return html.node`
                            <div class="step">
                                <div class="step-number">${i + 1}</div>
                                <div class="step-text">${
					tl(trans.plot_explain[i])
				}</div>
                            </div>
                        `;
			})}
			    </div>
			</section>
			<section
				class="current-mini-settings"
				ref=${(el) => (mini_settings = el)}
			/>
			<section class="mini-faq">
				<p class="card-tip">
			        ${tl(trans.value_by_user, {
				v: valid_minis.plot.name,
				u: valid_minis.plot.by.join(','),
			})}
			    </p>
			</section>
		`,
	);

	plot({
		host: content,
		sidebar: mini_settings,
	});
}

function bleh_minis_card() {
	let content;
	let mini_settings;

	render(
		page.structure.main,
		html`
			<section class="minis">
			    ${return_to_minis('card')}
			    <div class="minis-content" ref=${(el) => (content = el)} />
			</section>
		`,
	);

	render(
		page.structure.side,
		html`
			<section
				class="current-mini-settings"
				ref=${(el) => (mini_settings = el)}
			/>
			<section class="mini-faq">
				<p class="card-tip">
			        ${tl(trans.value_by_user, {
				v: valid_minis.card.name,
				u: valid_minis.card.by.join(','),
			})}
			    </p>
			</section>
		`,
	);

	card({
		host: content,
		sidebar: mini_settings,
	});
}

function bleh_minis_pixel() {
	let content;
	let mini_settings;

	render(
		page.structure.main,
		html`
			<section class="minis">
			    ${return_to_minis('pixel')}
			    <div
			        class="minis-content pixel-content"
			        ref=${(el) => (content = el)}
			    />
			</section>
		`,
	);

	render(
		page.structure.side,
		html`
			<section
				class="current-mini-settings"
				ref=${(el) => (mini_settings = el)}
			/>
			<section class="mini-faq">
				<p class="card-tip">
			        ${tl(trans.value_by_user, {
				v: valid_minis.pixel.name,
				u: valid_minis.pixel.by.join(','),
			})}
			    </p>
			</section>
		`,
	);

	pixel({
		host: content,
		sidebar: mini_settings,
	});
}

function bleh_minis_lyrics() {
	render(
		page.structure.main,
		html`
			<section class="minis">${return_to_minis('lyrics')}</section>
		`,
	);
}

function bleh_minis_rainbow() {
	render(
		page.structure.main,
		html`
			<section class="minis">${return_to_minis('rainbow')}</section>
		`,
	);
}

function bleh_minis_atlas() {
	render(
		page.structure.main,
		html`
			<section class="minis">${return_to_minis('atlas')}</section>
		`,
	);
}

function bleh_minis_receipt() {
	render(
		page.structure.main,
		html`
			<section class="minis">${return_to_minis('receipt')}</section>
		`,
	);
}

export function render_user(name, avatar, user, replace_page = false) {
	if (avatar == '' && name != '') {
		fetch(`${root}user/${name}/tags`)
			.then(function (response) {
				console.log('returned', response, response.text);

				return response.text();
			})
			.then(function (dom) {
				let doc = new DOMParser().parseFromString(dom, 'text/html');
				console.log('DOC', doc);

				try {
					avatar = doc
						.querySelector('.header-avatar-inner-wrap img')
						.getAttribute('src');
					name = doc
						.querySelector('.header-title')
						.textContent.trim();

					if (replace_page) {
						page.avatar = avatar;
						page.name = name;
					}

					if (!user) {
						user = page.structure.main.querySelector(
							'.compare-user.focus',
						);
					}
					render(user, render_user(name, avatar, user, replace_page));
				} catch (e) {
					console.error(e);
				}
			});

		return html`
			<div class="avatar loading" />
			<strong>${name}</strong>
		`;
	}

	return html`
		<div class="avatar">
			<img
				src=${avatar}
				alt=${tl(trans.avatar_for_user).replace('{u}', name)}
			/>
		</div>
		<strong>${name}</strong>
	`;
}
