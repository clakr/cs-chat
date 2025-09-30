import { useStore } from "@tanstack/react-form";
import { type ReactNode, useId } from "react";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useFieldContext } from "@/lib/form";
import type { Option } from "@/lib/types";

type Props = {
	label: string;
	description?: ReactNode;
	options: string[] | Option[];
	placeholder?: string;
} & Omit<React.ComponentProps<typeof Select>, "value" | "onValueChange">;

export default function Radio({
	label,
	description,
	options,
	placeholder,
	...props
}: Props) {
	const id = useId();
	const errorId = `${id}-error`;
	const field = useFieldContext<string>();

	const hasError = useStore(
		field.store,
		(state) => state.meta.isTouched && state.meta.errors.length > 0,
	);
	const errors = useStore(field.store, (state) => state.meta.errors);

	function isObjectOptions(opts: typeof options): opts is Option[] {
		return opts.length > 0 && typeof opts[0] === "object" && "label" in opts[0];
	}

	const selectOptions = isObjectOptions(options)
		? options
		: options.map((option) => ({ label: option, value: option }));

	return (
		<div className="grid gap-y-1.5">
			<div className="grid gap-y-0.5">
				<Label htmlFor={id}>{label}</Label>
				<span className="text-xs italic text-muted-foreground">
					{description}
				</span>
			</div>
			<Select
				{...props}
				value={field.state.value}
				onValueChange={(value) => field.handleChange(value)}
			>
				<SelectTrigger
					id={id}
					aria-invalid={hasError}
					aria-describedby={hasError ? errorId : undefined}
					className="w-full"
				>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{selectOptions.map(({ label: optionLabel, value }) => (
						<SelectItem key={value} value={value}>
							{optionLabel}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{hasError && (
				<span id={errorId} className="text-destructive text-xs">
					{errors.at(0).message}
				</span>
			)}
		</div>
	);
}
