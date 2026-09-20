/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ReactNode } from 'jsx-dom';
import { SettingLabel } from '@/components/settings/provider/main.tsx';

interface SettingStubProps {
	name: ReactNode;
	body?: ReactNode;
	type?: 'select' | 'input';
	children: ReactNode;
}

export function SettingStub({
	name,
	body,
	type,
	children,
}: SettingStubProps) {
	return (
		<div class='setting' data-type={type}>
			<SettingLabel name={name} body={body} />
			{children}
		</div>
	);
}
