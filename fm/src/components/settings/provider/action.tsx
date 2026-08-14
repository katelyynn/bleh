/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ReactNode } from 'jsx-dom';
import { SettingLabel } from '@/components/settings/provider/main.tsx';

interface SettingActionProps {
	id?: string;
	name: ReactNode;
	body?: ReactNode;
	children: ReactNode;
}

export function SettingAction({
	id,
	name,
	body,
	children,
}: SettingActionProps) {
	return (
		<div class='setting' data-type='action' id={id}>
			<SettingLabel name={name} body={body} />
			<div class='toggle-wrap'>
				{children}
			</div>
		</div>
	);
}
