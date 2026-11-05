import { root } from "@/build/page";
import { Button } from "./button";
import { Icon, icons } from "../shared/icon";

interface InboxButtonProps {
	notifications: number;
	messages: number;
}

type InboxButtonElement = HTMLButtonElement & {
	notifications: number;
	messages: number;
}

export function InboxButton({
	notifications,
	messages
}: InboxButtonProps) {
	const button = (
		<Button className='masthead-nav-control' href={`${root}inbox/notifications`} />
	) as InboxButtonElement;

	button.addEventListener('click', (e) => {
		const cmd = e.getModifierState('Control') ||
			e.getModifierState('Meta');
		const new_tab = e.button === 1 || cmd;

		// only allow clicking link if new tab action
		if (!new_tab) e.preventDefault();
	});

	function update() {
		button.replaceChildren(
			<>
				<span class='inbox-button-side' data-count={notifications}>
					<Icon name={icons.notifications} />
					<span class='inbox-button-counter' data-count={notifications}>
						{notifications}
					</span>
				</span>
				<span class='inbox-button-dot' />
				<span class='inbox-button-side' data-count={messages}>
					<Icon name={icons.messages} />
					<span class='inbox-button-counter' data-count={messages}>
						{messages}
					</span>
				</span>
			</>
		);
	}

	update();

	Object.defineProperty(button, 'notifications', {
		set(val: number) {
			notifications = val;
			update();
		},
	});

	Object.defineProperty(button, 'messages', {
		set(val: number) {
			messages = val;
			update();
		},
	});

	return button;
}
