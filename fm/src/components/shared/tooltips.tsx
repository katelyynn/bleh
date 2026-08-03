/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import {
	autoUpdate,
	computePosition,
	type ComputePositionConfig,
	offset as offsetMiddleware,
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
	public is_mounted = false;
	/**
	 * unique identifier for `element` that will be used for
	 * `host`'s `aria-describedby` attribute
	 */
	private uuid = crypto.randomUUID();

	public constructor(
		host: H,
		element: E,
		config: TooltipConfig = {},
	) {
		this.host = host;
		this.host.setAttribute('aria-expanded', 'false');
		this.element = element;
		this.config = {
			placement: 'bottom',
			strategy: 'absolute',
			middleware: [
				shiftMiddleware({
					crossAxis: true,
					padding: 8,
				}),
				offsetMiddleware(8),
			],
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

	public mount() {
		this.unmount();
		this.is_mounted = true;
		this.element = document.body.appendChild(this.element);
		this.element.id = this.uuid;
		this.host.setAttribute('aria-expanded', 'true');
		this.host.setAttribute('aria-describedby', this.uuid);
		this.cleanup = autoUpdate(
			this.host,
			this.element as HTMLElement,
			() => {
				this.update();
			},
			{ animationFrame: true },
		);
	}

	public unmount() {
		if (this.cleanup && this.element.parentNode) {
			this.cleanup();
			this.element = this.element.parentNode.removeChild(this.element);
			this.cleanup = null;
		}
		this.is_mounted = false;
		this.host.setAttribute('aria-expanded', 'false');
		this.host.removeAttribute('aria-describedby');
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
		// close when clicking again
		if (tooltip.is_mounted) {
			tooltip.hide();
			return;
		}
		tooltip.show();
		const listener: EventListener = ({ target: t }) => {
			const target = t as HTMLElement | null;
			if (
				target && target instanceof HTMLElement &&
				target != tooltip.element && target != host &&
				!tooltip.element.contains(target) &&
				!target.closest('.tippy-box')
			) {
				tooltip.hide();
				document.body.removeEventListener('click', listener);
			}
		};
		document.body.addEventListener('click', listener);
	});
	return tooltip;
}

/**
 * tooltip with context menu behaviour
 */
export function context_menu_tooltip<
	H extends ReactElement,
	E extends ReactElement,
>(
	host: H,
	element: E,
	config: TooltipConfig = {},
) {
	const tooltip = new TooltipInstance(host, element, config);
	host.addEventListener('contextmenu', (e) => {
		e.preventDefault();
		// close when clicking again
		if (tooltip.is_mounted) {
			tooltip.hide();
			return;
		}
		tooltip.show();
		const listener: EventListener = ({ target: t }) => {
			const target = t as HTMLElement | null;
			if (
				target && target instanceof HTMLElement &&
				target != tooltip.element && target != host &&
				!tooltip.element.contains(target) &&
				!target.closest('.tippy-box')
			) {
				tooltip.hide();
				document.body.removeEventListener('click', listener);
			}
		};
		document.body.addEventListener('click', listener);
	});
	return tooltip;
}

export function Tooltip(
	{ class: className, theme = 'generic', children, ...props }:
		& { class?: string; theme?: string }
		& Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'class'>,
) {
	return (
		<div
			data-theme={theme}
			className={['tippy-box', className]}
			{...props}
		>
			<div className='tippy-content'>
				{children}
			</div>
		</div>
	);
}
