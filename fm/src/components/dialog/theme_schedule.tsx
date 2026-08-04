import { dialog } from '@/components/dialog/dialog.tsx';

interface theme_min {
	theme_day: string;
	theme_night: string;
}

interface theme_schedule_props {
	onChange?: (val: theme_min) => void;
}

export function theme_schedule_dialog({
	onChange,
}: theme_schedule_props) {
}
