import { useAlertStore } from "@/components/alert-dialog";

export function useAlert() {
	const show = useAlertStore((state) => state.show);

	return { show };
}
