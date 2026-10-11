/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { html } from 'lighterhtml';
import { log } from '@/build/log';
import { dialogs, page } from '@/build/page';
import { tl, trans } from '@/build/trans';
import { ReactElement, ReactNode } from 'jsx-dom';
import { PanelHead } from '@/components/text/head.tsx';
import { WithChildren } from '@/types/generic.tsx';
import { useSettings } from '@/page.tsx';
import { Button } from '@/components/button/button.tsx';
import { Icon, icons } from '@/components/shared/icon.tsx';

export function load_dialogs() {
	const elem = (
		<div
			class='bleh-modals'
			onClick={() => {
				const latest = Object.keys(dialogs).at(-1);
				if (!latest) return;

				if (
					dialogs[latest].dismiss &&
					!dialogs[latest].handle_escape_manually
				) {
					dialog_rm({ id: latest, modal_bg: true });
				}
			}}
		/>
	);

	document.addEventListener('keydown', (e) => {
		if (e.key != 'Escape') return;

		const latest = Object.keys(dialogs).at(-1);
		if (!latest) return;

		if (
			dialogs[latest].dismiss && !dialogs[latest].handle_escape_manually
		) {
			dialog_rm({ id: latest, modal_bg: true });
		}
	});

	document.body.appendChild(elem);
	page.structure.dialogs = elem;
}

type dialog = {
	id: string;
	icon?: string;
	title?: ReactNode;
	subtitle?: ReactNode;
	body: HTMLElement | ReactElement;
	dismiss?: boolean;
	type?: string;
	has_overlays?: boolean;
	replace?: boolean;
	replace_if_possible?: boolean;
	replace_id?: string;
	allow_scroll?: boolean;
	colourful?: boolean;
	colourful_bg?: boolean;
	handle_escape_manually?: boolean;
};

// Present a fullscreen dialog to the user
export function dialog({
	id = '',
	icon,
	title,
	subtitle,
	body = html.node``,
	dismiss = true,
	type = '',
	has_overlays = true,
	replace = false,
	replace_if_possible = false,
	replace_id = '',
	allow_scroll = false,
	colourful = false,
	colourful_bg = false,
	handle_escape_manually = false,
}: dialog): HTMLElement {
	log(`creating ${id}`, 'window', 'info', {
		id: id,
		title: title,
		subtitle: subtitle,
		body: body,
		dismiss: dismiss,
		type: type,
		has_overlays: has_overlays,
		replace: replace,
		replace_id: replace_id,
		allow_scroll: allow_scroll,
		colourful: colourful,
		colourful_bg: colourful_bg,
		handle_escape_manually: handle_escape_manually,
	});

	if (replace && replace_if_possible) replace_if_possible = false;

	if (replace_if_possible && Object.keys(dialogs).length > 0) {
		replace = true;

		for (let dialog in dialogs) {
			replace_id = dialog;
			break;
		}
	}

	const modal = (
		<div
			class={[
				'bleh-modal',
				colourful && 'colourful',
				colourful_bg && 'colourful-bg',
			]}
			role='dialog'
			data-modal-id={id}
			data-modal-has-overlays={has_overlays}
			data-modal-type={type}
		/>
	);

	if (title) {
		modal.setAttribute('aria-labelledby', 'modal_title');
		modal.appendChild(
			<div
				class='bleh-modal-title'
				id='modal_title'
				data-theme={useSettings.get('theme')}
			>
				<PanelHead top margin={false} icon={icon}>{title}</PanelHead>
				{subtitle && <p class='bleh-modal-subtitle'>{subtitle}</p>}
			</div>,
		);
	}

	if (dismiss) {
		modal.appendChild(
			<button
				type='button'
				class='modal-close-button'
				onClick={() => dialog_rm({ id })}
			>
				{tl(trans.close)}
			</button>,
		);
	}

	modal.appendChild(
		<div class='bleh-modal-body' data-allow-scroll={String(allow_scroll)}>
			{body}
		</div>,
	);

	dialogs[id] = {
		instance: modal,
		dismiss,
		handle_escape_manually,
	};

	if (replace || (!replace && dialogs.hasOwnProperty(replace_id))) {
		log(`window set to replace ${replace_id}`, 'window');

		dialog_rm({ id: replace_id });
	}

	page.structure.dialogs.appendChild(modal);
	page.structure.dialogs.classList.add('has-dialog');

	return modal;
}

export function dialog_rm({
	id = '',
	all = false,
	modal_bg = false,
}) {
	// prevents clicks inside modal being broken
	if (modal_bg) {
		// @ts-ignore
		if (event.target.classList[0] != 'bleh-modals') return;
	}

	if (all) {
		log('requested kill all', 'window', 'info', { dialogs });

		for (let dialog in dialogs) {
			dialog_rm({
				id: dialog,
			});
		}

		return;
	}

	if (!id) return;

	if (!page.structure.dialogs) return;

	if (dialogs.hasOwnProperty(id)) {
		let dialog = dialogs[id];

		if (!page.structure.dialogs.contains(dialog.instance)) return;

		log(`queuing ${id} to kill`, 'window');

		dialog.instance.classList.add('to-remove');

		setTimeout(function () {
			page.structure.dialogs.removeChild(dialog.instance);
		}, 400);

		delete dialogs[id];

		if (JSON.stringify(dialogs) == '{}') {
			page.structure.dialogs.classList.remove('has-dialog');
		}
	}
}

export function ModalFooter({
	children,
}: WithChildren) {
	return (
		<div class='modal-footer'>
			{children}
		</div>
	);
}

export function FooterFill() {
	return <div class='fill' />;
}

interface modal {
	id: string;
	title: ReactNode;
	body?: ReactNode;
	close?: ReactNode;
	canClose?: boolean;
	actions?: ModalAction[];
}

export function modal({
	id,
	title,
	body,
	close,
	canClose = true,
	actions = [],
}: modal) {
	const elem = (
		<Modal
			title={title}
			close={close}
			canClose={canClose}
			actions={actions}
			onClose={() => {
				dialog_rm({ id });
			}}
		>
			{body}
		</Modal>
	);

	dialogs[id] = {
		instance: elem,
		dismiss: canClose,
	};

	page.structure.dialogs.appendChild(elem);
	page.structure.dialogs.classList.add('has-dialog');

	return elem;
}

interface ModalAction {
	onClick?: () => void;
	className?: string;
	colourful?: boolean;
	children: ReactNode;
}

interface ModalProps {
	title: ReactNode;
	close?: ReactNode;
	canClose?: boolean;
	actions?: ModalAction[];
	onClose?: () => void;
	children?: ReactNode;
}

export function Modal({
	title,
	close,
	canClose = true,
	actions = [],
	onClose,
	children,
}: ModalProps) {
	if (close == 'back') {
		close = (
			<>
				<Icon name={icons.arrow_left} />
				{tl(trans.back)}
			</>
		);
	} else if (!close) {
		close = (
			<>
				<Icon name={icons.x} />
				{tl(trans.cancel)}
			</>
		);
	}

	return (
		<div
			className={['bleh-modal-v2']}
			data-reduced-motion={useSettings.get('reduced_motion')}
		>
			<div class='bleh-modal-v2-content'>
				<h1 className='bleh-modal-v2-title'>{title}</h1>
				{children && (
					<div class='bleh-modal-v2-body'>
						{children}
					</div>
				)}
			</div>
			<div class='bleh-modal-v2-actions'>
				{canClose && (
					<Button className='bleh-modal-v2-action' onClick={onClose}>
						{close}
					</Button>
				)}
				{actions.map((action, i) => {
					if (canClose) i++;

					return (
						<>
							{i > 0 && <ModalActionSeparator />}
							<Button
								className={`bleh-modal-v2-action ${action.className} ${
									action.colourful && 'colourful'
								}`}
								onClick={action.onClick}
							>
								{action.children}
							</Button>
						</>
					);
				})}
			</div>
		</div>
	);
}

function ModalActionSeparator() {
	return <div class='modal-action-separator' />;
}
