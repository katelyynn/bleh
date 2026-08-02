interface SettingLabelProps {
	name: string;
	body?: string;
}

export function SettingLabel({
	name,
	body,
}: SettingLabelProps) {
	return (
		<div class='heading'>
			<h5 class='setting-name'>{name}</h5>
			{body && <p class='setting-body'>{body}</p>}
		</div>
	);
}
