/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import {
	autoUpdate,
	computePosition,
	type ComputePositionConfig,
	shift as shiftMiddleware,
} from '@floating-ui/dom';
import { HTMLAttributes, ReactElement } from 'jsx-dom';

type TooltipConfig = Partial<ComputePositionConfig>;

export class TooltipInstance<
	H extends ReactElement,
	E extends ReactElement,
> {
	private host: H;
	public element: E;
	private config?: TooltipConfig;
	private cleanup: (() => void) | null = null;

	public constructor(
		host: H,
		element: E,
		config: TooltipConfig = {},
	) {
		this.host = host;
		this.element = element;
		this.config = {
			placement: 'bottom',
			strategy: 'fixed',
			middleware: [shiftMiddleware()],
			...config,
		};
	}

	public show() {
		this.hide();
		this.element = document.body.appendChild(this.element);
		this.cleanup = autoUpdate(
			this.host,
			this.element as HTMLElement,
			() => {
				this.update();
			},
			{
				animationFrame: true,
			},
		);
	}

	public hide() {
		if (this.cleanup && this.element.parentNode) {
			this.cleanup();
			this.element = this.element.parentNode.removeChild(this.element);
		}
	}

	private update() {
		computePosition(this.host, this.element as HTMLElement, this.config)
			.then(
				({ strategy, x, y }) => {
					Object.assign(this.element.style, {
						position: strategy,
						left: `${x}px`,
						top: `${y}px`,
					});
				},
			);
	}
}

/**
 * tooltip with hover behaviour
 */
export function hover_tooltip<
	H extends ReactElement,
	E extends ReactElement,
>(
	host: H,
	element: E,
	config: TooltipConfig = {},
) {
	const tooltip = new TooltipInstance(host, element, config);
	host.addEventListener('onmouseenter', () => {
		tooltip.show();
	});
	host.addEventListener('onmouseleave', () => {
		tooltip.hide();
	});
	return tooltip;
}

/**
 * tooltip with menu behaviour
 */
export function menu_tooltip<
	H extends ReactElement,
	E extends ReactElement,
>(
	host: H,
	element: E,
	config: TooltipConfig = {},
) {
	const tooltip = new TooltipInstance(host, element, config);
	host.addEventListener('click', () => {
		tooltip.show();
		const listener: EventListener = ({ target }) => {
			if (target != tooltip.element && target != host) {
				tooltip.hide();
				document.body.removeEventListener('click', listener);
			}
		};
		document.body.addEventListener('click', listener);
	});
	return tooltip;
}

export function Tooltip(
	{ class: className, theme = 'generic', ...props }:
		& { class?: string; theme?: string }
		& Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'class'>,
) {
	return (
		<div
			data-theme={theme}
			className={['tippy-box', className]}
			{...props}
		/>
	);
}
