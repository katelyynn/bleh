import { auth, page } from '@/build/page.ts';
import { createRef } from 'jsx-dom';
import { MessageContent, MessageSender } from '@/pages/inbox/message.tsx';
import { PanelHead } from '@/components/text/head.tsx';
import { tl, trans } from '@/build/trans.ts';
import { Icon, icons } from '@/components/shared/icon.tsx';
import { SettingGroup } from '@/components/settings/group.tsx';
import { SettingInput } from '@/components/settings/provider/input.tsx';
import { Button } from '@/components/button/button.tsx';

export function inbox_compose() {
	const inbox = page.structure.container!.querySelector(
		'.inbox-compose-view',
	);
	if (!inbox) return;

	inbox.classList = 'inbox-message-view';
	page.structure.main!.appendChild(inbox);

	const content_form = inbox.querySelector('.content-form');
	if (!content_form) return;

	const form = content_form.querySelector('form');
	if (!form) return;

	const token = form.querySelector(
		'[name="csrfmiddlewaretoken"]',
	) as HTMLInputElement;
	const recipient = form.querySelector(
		'[name=recipient_name]',
	) as HTMLInputElement;
	const subject = form.querySelector('[name=subject]') as HTMLInputElement;
	const contents = form.querySelector('[name=message]') as HTMLInputElement;

	content_form.classList = 'message-compose-section inbox-message';

	if (page.requested.subject) subject!.value = page.requested.subject;

	const alert = form.querySelector(':scope > .alert') as HTMLDivElement;
	const disclaimer = form.querySelector(
		'.form-disclaimer > .alert',
	) as HTMLDivElement;

	content_form.replaceChildren(
		<>
			<MessageSender image={auth.avatar!} name={auth.name!} />
			<MessageContent>
				<PanelHead icon={icons.compose}>
					{tl(trans.send_message)}
				</PanelHead>
				{alert}
				<form method='post' action={form.getAttribute('action')!}>
					{token}
					<SettingGroup>
						<div class='setting v' data-type='text'>
							<div class='heading'>
								<h5>{tl(trans.username.name)}</h5>
							</div>
							<div class='input-container content-form wide'>
								{recipient}
							</div>
						</div>
						<div class='setting v' data-type='text'>
							<div class='heading'>
								<h5>{tl(trans.subject)}</h5>
							</div>
							<div class='input-container content-form wide'>
								{subject}
							</div>
						</div>
						<div class='setting v' data-type='text'>
							<div class='heading'>
								<h5>{tl(trans.message)}</h5>
							</div>
							<div class='input-container content-form textarea'>
								{contents}
							</div>
						</div>
						{disclaimer}
					</SettingGroup>
					<div class='settings-footer end gap'>
						<Button type='submit'>
							<Icon name={icons.message} />
							{tl(trans.send)}
						</Button>
					</div>
				</form>
			</MessageContent>
		</>,
	);
}
