import { create } from "zustand";
import {
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialog as UIAlertDialog,
} from "@/components/ui/alert-dialog";

interface AlertState {
	isOpen: boolean;
	title: string;
	description: string;
	actionText: string;
	cancelText?: string;
	resolver: ((value: boolean) => void) | null;
}

interface AlertStore extends AlertState {
	show: (options: Omit<AlertState, "isOpen" | "resolver">) => Promise<boolean>;
	hide: () => void;
	confirm: () => void;
	cancel: () => void;
}

const USE_ALERT_STORE_DEFAULT_STATE: AlertState = {
	isOpen: false,
	title: "",
	description: "",
	actionText: "Continue",
	cancelText: "Cancel",
	resolver: null,
};

export const useAlertStore = create<AlertStore>((set, get) => ({
	...USE_ALERT_STORE_DEFAULT_STATE,
	show: (options) => {
		return new Promise<boolean>((resolve) => {
			set({
				isOpen: true,
				title: options.title,
				description: options.description,
				actionText: options.actionText || "Continue",
				cancelText: options.cancelText || "Cancel",
				resolver: resolve,
			});
		});
	},
	hide: () => {
		set({
			...USE_ALERT_STORE_DEFAULT_STATE,
		});
	},
	confirm: () => {
		const { resolver, hide } = get();

		if (resolver) {
			resolver(true);
		}

		hide();
	},
	cancel: () => {
		const { resolver, hide } = get();

		if (resolver) {
			resolver(false);
		}

		hide();
	},
}));

export function AlertDialog() {
	const {
		isOpen,
		title,
		description,
		actionText,
		cancelText,
		confirm,
		cancel,
	} = useAlertStore();

	function handleOpenChange(open: boolean) {
		if (!open) {
			cancel();
		}
	}

	return (
		<UIAlertDialog open={isOpen} onOpenChange={handleOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={cancel}>{cancelText}</AlertDialogCancel>
					<AlertDialogAction onClick={confirm}>{actionText}</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</UIAlertDialog>
	);
}
