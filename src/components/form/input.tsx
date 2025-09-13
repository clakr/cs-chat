import { type ComponentProps, type ReactNode, useId } from "react";
import { Input as UIInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFieldContext } from "@/lib/form";

type Props = {
	label: ReactNode;
} & ComponentProps<"input">;

export default function Input({ label, ...props }: Props) {
	const id = useId();
	const errorId = `${id}-error`;
	const field = useFieldContext<string>();

	const hasError =
		field.state.meta.isTouched &&
		!field.state.meta.isValid &&
		field.state.meta.errors.at(0);

	const errorMessage = hasError
		? field.state.meta.errors.at(0)?.message
		: undefined;

	return (
		<div className="flex flex-col gap-y-1.5">
			<Label htmlFor={id}>{label}</Label>
			<UIInput
				id={id}
				value={field.state.value}
				onBlur={field.handleBlur}
				onChange={(event) => field.handleChange(event.target.value)}
				aria-invalid={hasError ? "true" : "false"}
				aria-describedby={hasError ? errorId : undefined}
				{...props}
			/>
			{hasError ? (
				<em
					id={errorId}
					role="alert"
					aria-live="assertive"
					className="text-destructive text-xs"
				>
					{errorMessage}
				</em>
			) : null}
		</div>
	);
}
