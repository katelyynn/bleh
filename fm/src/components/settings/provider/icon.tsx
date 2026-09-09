/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Icon } from '@/components/shared/icon.tsx';

interface SettingIconProps {
	name: string;
}

export function SettingIcon({
	name,
}: SettingIconProps) {
	return (
		<div class='setting-icon'>
			<Icon name={name} />
		</div>
	);
}
