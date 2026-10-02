/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { createRef, ReactNode } from 'jsx-dom';
import { SettingLabel } from '@/components/settings/provider/main.tsx';

interface SettingInfoProps {
	ref?: ReturnType<typeof createRef<SettingInfoElement>>;
	name: ReactNode;
	body?: ReactNode;
	hidden?: boolean;
	children?: ReactNode;
}

type SettingInfoElement = HTMLDivElement & {
	children: ReactNode;
	hidden: boolean;
};

export function SettingInfo({
	ref,
	name,
	body,
	hidden,
	children,
}: SettingInfoProps) {
	const info = createRef();

	const elem = (
		<div class='setting' data-type='info' ref={ref}>
			<SettingLabel name={name} body={body} />
			<div class='info' ref={info} />
		</div>
	) as SettingInfoElement;

	function update() {
		elem.setAttribute('data-hidden', String(hidden));
		info.current.replaceChildren(
			<>
				{children}
			</>,
		);
	}

	update();

	Object.defineProperty(elem, 'children', {
		set(v: ReactNode) {
			children = v;
			update();
		},
	});

	Object.defineProperty(elem, 'hidden', {
		get() {
			return hidden;
		},
		set(v: boolean) {
			hidden = v;
			update();
		},
	});

	return elem;
}
