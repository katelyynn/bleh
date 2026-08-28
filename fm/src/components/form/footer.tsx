import { ReactNode } from 'jsx-dom';

interface SettingsFooterProps {
	end?: boolean;
	gap?: boolean;
	children: ReactNode;
}

export function SettingsFooter({
	end = true,
	gap,
	children,
}: SettingsFooterProps) {
	return (
		<div class={['settings-footer', end && 'end', gap && 'gap']}>
			{children}
		</div>
	);
}
