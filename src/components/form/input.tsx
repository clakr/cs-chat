import { useStore } from "@tanstack/react-form";
import { type ComponentProps, type ReactNode, useId } from "react";
import { Input as UIInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFieldContext } from "@/lib/form";

type Props = {
	label: ReactNode;
	description?: ReactNode;
} & ComponentProps<"input">;

export default function Input({ label, description, type, ...props }: Props) {
	const id = useId();
	const errorId = `${id}-error`;
	const field = useFieldContext<string>();

	const hasError = useStore(
		field.store,
		(state) => state.meta.isTouched && state.meta.errors.length > 0,
	);
	const errors = useStore(field.store, (state) => state.meta.errors);

	if (type === "hidden")
		return (
			<UIInput
				id={id}
				value={field.state.value}
				onBlur={field.handleBlur}
				onChange={(event) => field.handleChange(event.target.value)}
				aria-invalid={hasError ? "true" : "false"}
				aria-describedby={hasError ? errorId : undefined}
				type={type}
				{...props}
			/>
		);

	return (
		<div className="grid gap-y-1.5">
			<div className="grid gap-y-0.5">
				<Label htmlFor={id}>{label}</Label>
				<span className="text-xs italic text-muted-foreground">
					{description}
				</span>
			</div>
			<UIInput
				id={id}
				value={field.state.value}
				onBlur={field.handleBlur}
				onChange={(event) => field.handleChange(event.target.value)}
				aria-invalid={hasError ? "true" : "false"}
				aria-describedby={hasError ? errorId : undefined}
				type={type}
				{...props}
			/>
			{hasError ? (
				<em
					id={errorId}
					role="alert"
					aria-live="assertive"
					className="text-destructive text-xs"
				>
					{errors.at(0).message}
				</em>
			) : null}
		</div>
	);
}
