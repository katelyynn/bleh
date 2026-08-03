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

type AnimationPreset = 'slide-down' | 'slide-up';
type TooltipConfig = Partial<
	ComputePositionConfig & {
		enterAnimation: AnimationPreset;
		exitAnimation: AnimationPreset;
	}
>;

function animation_for_preset(
	preset: AnimationPreset,
): { keyframes: Keyframe[]; options: KeyframeAnimationOptions } {
	let keyframes: Keyframe[];
	switch (preset) {
		case 'slide-down':
			keyframes = [
				{ opacity: 0, transform: 'translateY(-4px)' },
				{ opacity: 1, transform: 'translateY(0px)' },
			];
			break;
		case 'slide-up':
			keyframes = [
				{ opacity: 1, transform: 'translateY(0px)' },
				{ opacity: 0, transform: 'translateY(-4px)' },
			];
			break;
	}
	return {
		keyframes,
		options: {
			duration: 150,
			easing: 'ease-out',
			fill: 'forwards',
		},
	};
}

export class TooltipInstance<
	H extends ReactElement,
	E extends ReactElement,
> {
	private host: H;
	public element: E;
	private config: TooltipConfig;
	private cleanup: (() => void) | null = null;
	private current_animation: Animation | null = null;
	private is_mounted = false;

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
			enterAnimation: 'slide-down',
			exitAnimation: 'slide-up',
			...config,
		};
	}

	public show() {
		this.cancel_animation();

		if (!this.is_mounted) this.mount();

		const { keyframes, options } = animation_for_preset(
			this.config.enterAnimation!,
		);
		const animation = this.element.animate(keyframes, options);

		this.current_animation = animation;
	}

	public hide() {
		if (!this.is_mounted) return;

		this.cancel_animation();

		const { keyframes, options } = animation_for_preset(
			this.config.exitAnimation!,
		);
		const animation = this.element.animate(keyframes, options);

		this.current_animation = animation;

		// delay unmount until exit animation finishes
		animation.finished.then(() => {
			if (this.current_animation === animation) {
				this.unmount();
				this.current_animation = null;
			}
		}).catch(() => {});
	}

	private cancel_animation() {
		if (this.current_animation) {
			this.current_animation.cancel();
			this.current_animation = null;
		}
	}

	private mount() {
		this.unmount();
		this.element = document.body.appendChild(this.element);
		this.is_mounted = true;
		this.cleanup = autoUpdate(
			this.host,
			this.element as HTMLElement,
			() => {
				this.update();
			},
			{ animationFrame: true },
		);
	}

	private unmount() {
		if (this.cleanup && this.element.parentNode) {
			this.cleanup();
			this.element = this.element.parentNode.removeChild(this.element);
			this.cleanup = null;
		}
		this.is_mounted = false;
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
	host.addEventListener('mouseenter', () => {
		tooltip.show();
	});
	host.addEventListener('mouseleave', () => {
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
