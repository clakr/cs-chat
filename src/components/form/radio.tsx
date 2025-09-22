import { useStore } from "@tanstack/react-form";
import { type ReactNode, useId } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFieldContext } from "@/lib/form";
import type { Option } from "@/lib/types";

type Props = {
	label: string;
	description?: ReactNode;
	options: string[] | Option[];
} & Omit<React.ComponentProps<typeof RadioGroup>, "value" | "onValueChange">;

export default function Radio({
	label,
	description,
	options,
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

	const radioOptions = isObjectOptions(options)
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
			<RadioGroup
				{...props}
				value={field.state.value}
				onValueChange={(value) => field.handleChange(value)}
				aria-invalid={hasError}
				aria-describedby={hasError ? errorId : undefined}
			>
				{radioOptions.map(({ label: optionLabel, value }) => {
					const optionId = `${id}-${value}`;

					return (
						<div key={value} className="flex items-center gap-x-1.5">
							<RadioGroupItem value={value} id={optionId} />
							<Label htmlFor={optionId} className="capitalize">
								{optionLabel}
							</Label>
						</div>
					);
				})}
			</RadioGroup>
			{hasError && (
				<span id={errorId} className="text-destructive text-xs">
					{errors.at(0).message}
				</span>
			)}
		</div>
	);
}
