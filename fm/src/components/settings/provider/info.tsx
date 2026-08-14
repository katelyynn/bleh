/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ReactNode } from 'jsx-dom';
import { SettingLabel } from '@/components/settings/provider/main.tsx';

interface SettingInfoProps {
	name: ReactNode;
	body?: ReactNode;
	children: ReactNode;
}

export function SettingInfo({
	name,
	body,
	children,
}: SettingInfoProps) {
	return (
		<div class='setting' data-type='info'>
			<SettingLabel name={name} body={body} />
			<div class='info'>
				{children}
			</div>
		</div>
	);
}
