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
	onAction?: () => void;
	onCancel?: () => void;
}

interface AlertStore extends AlertState {
	show: (options: Omit<AlertState, "isOpen">) => void;
	hide: () => void;
}

const USE_ALERT_STORE_DEFAULT_STATE: AlertState = {
	isOpen: false,
	title: "",
	description: "",
	actionText: "Continue",
	cancelText: "Cancel",
	onAction: undefined,
	onCancel: undefined,
};

export const useAlertStore = create<AlertStore>((set) => ({
	...USE_ALERT_STORE_DEFAULT_STATE,
	show: (options) =>
		set({
			isOpen: true,
			title: options.title,
			description: options.description,
			actionText: options.actionText,
			cancelText: options.cancelText || "Cancel",
			onAction: options.onAction,
			onCancel: options.onCancel,
		}),
	hide: () =>
		set({
			...USE_ALERT_STORE_DEFAULT_STATE,
		}),
}));

export function AlertDialog() {
	const {
		isOpen,
		title,
		description,
		actionText,
		cancelText,
		onAction,
		onCancel,
		hide,
	} = useAlertStore();

	function handleAction() {
		onAction?.();
		hide();
	}

	function handleCancel() {
		onCancel?.();
		hide();
	}

	return (
		<UIAlertDialog open={isOpen} onOpenChange={(open) => !open && hide()}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={handleCancel}>
						{cancelText}
					</AlertDialogCancel>
					<AlertDialogAction onClick={handleAction}>
						{actionText}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</UIAlertDialog>
	);
}
