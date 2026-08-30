import { useSettings } from '@/page.ts';
import { markdown_options } from '@/types/markdown.ts';
import { createRef, ReactNode } from 'jsx-dom';
import { Button } from '@/components/button/button.tsx';
import { Icon } from '@/components/shared/icon.tsx';
import { hover_tooltip, Tooltip } from '@/components/shared/tooltips.tsx';
import { tl, trans } from '@/build/trans.ts';
import { dialog, dialog_rm } from '@/components/dialog/dialog.tsx';
import { input } from '@/components/settings/input.ts';
import { html } from 'lighterhtml';

interface MarkdownFieldProps {
	elem: HTMLTextAreaElement;
	focus?: boolean;
	shoutbox?: boolean;
	options?: markdown_options;
}

type MarkdownFieldElement = HTMLDivElement & {
	editor: HTMLTextAreaElement;
	range: [start: number, end: number];
	value: string;
};

export function MarkdownField({
	elem,
	focus,
	shoutbox,
	options = {},
}: MarkdownFieldProps) {
	elem.classList.add('modern-input');
	let val = elem.value;

	const use_md = shoutbox
		? useSettings.get('shout_markdown')
		: useSettings.get('bio_markdown');

	options = {
		allow_headers: false,
		starting_header: 3,
		allow_links: true,
		line_breaks: true,
		allow_banners: false,
		in_dialog: false,
		allow_icons: true,
		allow_hue: false,
		allow_fonts: false,
		allow_socials: false,
		allow_lists: false,
		allow_alignment: false,
		...options,
	};

	const action_list: Action[][] = [
		[
			{
				type: 'header',
				name: tl(trans.header),
				start: '# ',
				end: '',
				hide: !options.allow_headers,
			},
			{
				type: 'bold',
				name: tl(trans.bold),
				start: '**',
			},
			{
				type: 'italic',
				name: tl(trans.italic),
				start: '*',
			},
			{
				type: 'strike',
				name: tl(trans.strikethrough),
				start: '~~',
			},
			{
				type: 'underline',
				name: tl(trans.underline),
				start: '__',
			},
		],
		[
			{
				type: 'link',
				name: tl(trans.link),
				func: () => {
					return new Promise((resolve) => {
						let link;
						let alt;

						dialog({
							id: 'link',
							title: tl(trans.create_link),
							body: html.node`
                                <div class="new-scrobble-form">
                                    <p class="generic-label">${
								tl(trans.link)
							}</p>
                                    ${link = input({
								type: 'text',
								placeholder: tl(trans.example, {
									v: 'https://katelyn.moe',
								}),
								func: () => {
									submit_link();
								},
								focus: true,
							})}
                                    <p class="generic-label">${
								tl(trans.text)
							}</p>
                                    ${alt = input({
								type: 'text',
								func: () => {
									submit_link();
								},
							})}
                                </div>
                                <div class="modal-footer">
                                <button class="see-more cancel left-icon" onclick=${() => {
								dialog_rm({ id: 'link' });
								resolve(null);
							}}>
                                    ${tl(trans.cancel)}
                                </button>
                                <div class="fill" />
                                <button class="btn primary continue" onclick=${() => {
								submit_link();
							}}>
                                    ${tl(trans.finish)}
                                </button>
                                </div>
                            `,
						});

						function submit_link() {
							let alt_text = alt.value;
							let link_text = link.value;

							if (!link_text) return;

							dialog_rm({ id: 'link' });

							let output;

							if (alt_text != link_text && alt_text) {
								output = `[${alt_text}](${link_text})`;
							} else {
								output = link_text;
							}

							resolve(output);
						}
					});
				},
				hide: !options.allow_links,
			},
			{
				type: 'mention',
				name: tl(trans.mention_user),
				start: '@',
				end: '',
				hide: true,
			},
			{
				type: 'quote',
				name: tl(trans.quote),
				start: '> ',
				end: '',
				hide: true,
			},
			{
				type: 'code',
				name: tl(trans.code_block),
				start: '`',
				end: '`',
			},
			{
				type: 'image',
				name: tl(trans.image),
				func: () => {
					return new Promise((resolve) => {
						let link;
						let alt;

						dialog({
							id: 'link',
							title: tl(trans.attach_image),
							body: html.node`
                                <div class="new-scrobble-form">
                                    <p class="generic-label">${
								tl(trans.link)
							}</p>
                                    ${link = input({
								type: 'text',
								placeholder: tl(trans.example, {
									v: 'https://link.to/an_image_here',
								}),
								func: () => {
									submit_link();
								},
								focus: true,
							})}
                                    <p class="generic-label">${
								tl(trans.text)
							}</p>
                                    ${alt = input({
								type: 'text',
								func: () => {
									submit_link();
								},
							})}
                                </div>
                                <div class="modal-footer">
                                <button class="see-more cancel left-icon" onclick=${() => {
								dialog_rm({ id: 'link' });
								resolve(null);
							}}>
                                    ${tl(trans.cancel)}
                                </button>
                                <div class="fill" />
                                <button class="btn primary continue" onclick=${() => {
								submit_link();
							}}>
                                    ${tl(trans.finish)}
                                </button>
                                </div>
                            `,
						});

						function submit_link() {
							let alt_text = alt.value;
							let link_text = link.value;

							if (!link_text) return;

							dialog_rm({ id: 'link' });

							let output;

							if (alt_text != link_text && alt_text) {
								output = `![${alt_text}](${link_text})`;
							} else {
								output = `![](${link_text})`;
							}

							resolve(output);
						}
					});
				},
				hide: !options.allow_links,
			},
		],
		[
			{
				type: 'ul',
				name: tl(trans.list),
				start: '- ',
				end: '',
				hide: !options.allow_lists,
			},
			{
				type: 'ol',
				name: tl(trans.numbered_list),
				start: '1. ',
				end: '',
				hide: !options.allow_lists,
			},
		],
		[
			{
				type: 'align-left',
				name: tl(trans.left_align),
				start: '[left]',
				end: '[/left]',
				hide: !options.allow_alignment,
			},
			{
				type: 'align-center',
				name: tl(trans.center_align),
				start: '[center]',
				end: '[/center]',
				hide: !options.allow_alignment,
			},
			{
				type: 'align-right',
				name: tl(trans.right_align),
				start: '[right]',
				end: '[/right]',
				hide: !options.allow_alignment,
			},
		],
	];

	const overlay = createRef();

	const action_lookup: Record<string, Action> = {};

	const wrap = (
		<div class={['markdown-field', shoutbox && 'mini']}>
			{use_md && (
				<div class='markdown-actions'>
					{action_list.map((group, index) => {
						const group_elem = (
							<div class='group'>
								{group.map((item) => {
									const button = (
										<MarkdownAction
											type={item.type}
											name={item.name}
											hide={item.hide}
											onClick={() => {
												const sel_start =
													elem.selectionStart;
												const sel_end =
													elem.selectionEnd;

												if (item.func) {
													item.func().then(
														(
															replacement: string,
														) => {
															if (!replacement) {
																return;
															}

															elem.value =
																val.slice(
																	0,
																	sel_start,
																) +
																replacement +
																val.slice(
																	sel_end,
																);
															val = elem.value;
															elem.focus();
															elem.setSelectionRange(
																sel_start,
																sel_start +
																	replacement
																		.length,
															);

															update();
														},
													);

													return;
												}

												item.end ??= item.start;

												if (
													item.start != null &&
													item.end != null
												) {
													const selected = val.slice(
														sel_start,
														sel_end,
													);
													let replacement: string;

													if (
														selected.startsWith(
															item.start,
														) &&
														selected.endsWith(
															item.end,
														)
													) {
														let replace_end = -1 *
															item.end.length;

														if (replace_end != 0) {
															replacement =
																selected.slice(
																	item.start
																		.length,
																	replace_end,
																);
														} else {
															replacement =
																selected.slice(
																	item.start
																		.length,
																);
														}
													} else {
														replacement =
															`${item.start}${selected}${item.end}`;
													}

													elem.value = val.slice(
														0,
														sel_start,
													) + replacement +
														val.slice(sel_end);
													val = elem.value;

													elem.focus();
													elem.setSelectionRange(
														sel_start,
														sel_start +
															replacement.length,
													);

													update();
												}
											}}
										/>
									) as MarkdownActionElement;

									action_lookup[item.type] = {
										...item,
										elem: button,
									};

									return button;
								})}
							</div>
						);

						if (group_elem.childElementCount == 0) return;

						return (
							<>
								{group_elem}
								{(index < action_list.length - 1) && (
									<div class='group-sep' />
								)}
							</>
						);
					})}
				</div>
			)}
			<div class='markdown-field-text'>
				<div class='markdown-field-overlay' ref={overlay} />
				<div class={['content-form', 'input-container', 'textarea']}>
					{elem}
				</div>
			</div>
		</div>
	) as MarkdownFieldElement;

	Object.defineProperty(wrap, 'editor', {
		get() {
			return elem;
		},
	});

	Object.defineProperty(wrap, 'value', {
		get() {
			return elem.value;
		},
		set(v: string) {
			elem.value = v;
			val = v;
			update();
		},
	});

	elem.addEventListener('scroll', () => {
		overlay.current.scrollTop = elem.scrollTop;
	});

	elem.addEventListener('input', () => {
		update();
	});

	setTimeout(() => {
		if (focus) elem.focus();
	}, 0);

	function update() {
		let val = elem.value.replace(/</g, '&lt;').replace(/>/g, '&gt;');

		if (use_md) {
			val = val.replace(
				/\[(left|center|right|links)\]/gi,
				(text: string) => {
					if (!options.allow_alignment) return text;

					return `<span class="md-tag-wrap">${text}</span>`;
				},
			);
			val = val.replace(
				/\[\/(left|center|right|links)\]/gi,
				(text: string) => {
					if (!options.allow_alignment) return text;

					return `<span class="md-tag-wrap">${text}</span>`;
				},
			);

			val = val.replace(
				/\[([a-z]+)=([^\]]+)\]/gi,
				(match: string, tag: string, val: string) => {
					if (
						!['status', 'name', 'font', 'accent', 'banner']
							.includes(
								tag,
							)
					) return match;

					if (!options.allow_hue && tag == 'accent') return match;

					if (!options.allow_alignment) return match;

					if (tag == 'accent') {
						const split = val.split(',');
						if (
							split.length == 3 && parseFloat(split[0]) >= 0 &&
							parseFloat(split[1]) >= 0 &&
							parseFloat(split[2]) >= 0
						) {
							return `<span class="md-tag">[${tag}=<span class="md-val md-accent colourful" style="--hue-over: ${
								parseFloat(split[0])
							}; --sat-over: ${
								parseFloat(split[1])
							}; --lit-over: ${
								parseFloat(split[2])
							}">${val}</span>]</span>`;
						} else {
							return match;
						}
					}

					return `<span class="md-tag">[${tag}=<span class="md-val">${val}</span>]</span>`;
				},
			);

			val = val.replace(
				/!\[([^\]]*)\]\(([^)]+)\)/gi,
				(match: string, label: string, url: string) => {
					if (!options.allow_links) return match;

					return `<span class="md-link">![<span class="md-label">${label}</span>](<span class="md-url">${url}</span>)</span>`;
				},
			);

			val = val.replace(
				/\[([^\]]+)\]\(([^)]+)\)/gi,
				(match: string, label: string, url: string) => {
					if (!options.allow_links) return match;

					return `<span class="md-link">[<span class="md-label">${label}</span>](<span class="md-url">${url}</span>)</span>`;
				},
			);
		}

		overlay.current.innerHTML = val;
	}

	const interval = setInterval(() => {
		if (!wrap.isConnected) {
			clearInterval(interval);
			return;
		}

		if (val == elem.value) return;

		val = elem.value;
		update();
	}, 150);

	update();

	return wrap;
}

interface Action {
	type: string;
	name: ReactNode;
	start?: string;
	end?: string;
	hide?: boolean;
	func?: () => Promise<string>;
	elem?: MarkdownActionElement;
}

interface MarkdownActionProps {
	type: string;
	name: ReactNode;
	onClick: () => void;
	hide?: boolean;
}

type MarkdownActionElement = HTMLButtonElement & {
	active: boolean;
};

function MarkdownAction({
	type,
	name,
	onClick,
	hide,
}: MarkdownActionProps) {
	if (hide) return;

	let active = false;

	const button = (
		<Button chibi className='markdown-action' onClick={onClick}>
			<Icon name={type} />
			{name}
		</Button>
	) as MarkdownActionElement;

	Object.defineProperty(button, 'active', {
		get() {
			return active;
		},
		set(v: boolean) {
			active = v;
			update();
		},
	});

	update();

	function update() {
		button.setAttribute('aria-checked', String(active));
	}

	hover_tooltip(
		button,
		<Tooltip>{name}</Tooltip>,
	);

	return button;
}
