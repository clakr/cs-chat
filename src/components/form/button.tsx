import { Loader } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { Button as UIButton } from "@/components/ui/button";
import { useFormContext } from "@/lib/form";

type Props = { icon: ReactNode } & ComponentProps<typeof UIButton>;

export default function Button({ children, className, icon, ...props }: Props) {
	const form = useFormContext();

	return (
		<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
			{([canSubmit, isSubmitting]) => (
				<UIButton type="submit" disabled={!canSubmit} {...props}>
					{isSubmitting ? <Loader className="animate-spin" /> : icon}
					{children}
				</UIButton>
			)}
		</form.Subscribe>
	);
}
