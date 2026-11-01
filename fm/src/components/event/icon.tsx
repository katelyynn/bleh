interface EventSmallCalendarProps {
	month: string;
	day: string;
}

export function EventSmallCalendar({
	month,
	day
}: EventSmallCalendarProps) {
	return (
		<time class='events-list-item-date-icon'>
			<span class='events-list-item-date-icon-month'>
				{month}
			</span>
			<span class='events-list-item-date-icon-day'>
				{day}
			</span>
		</time>
	);
}
