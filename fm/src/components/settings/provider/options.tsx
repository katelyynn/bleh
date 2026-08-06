/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ReactNode } from 'jsx-dom';
import { SettingLabel } from '@/components/settings/provider/main.tsx';

interface SettingOptionsProps {
	id?: string;
	name: string;
	body?: string;
	children: ReactNode;
}

export function SettingOptions({
	id,
	name,
	body,
	children,
}: SettingOptionsProps) {
	return (
		<div class='setting' data-type='options' id={id}>
			<SettingLabel name={name} body={body} />
			<div class='primary-selections'>
				{children}
			</div>
		</div>
	);
}

export function SettingOptionsSeparator() {
	return <div class='primary-selection-sep' />;
}
