import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = { heading: ReactNode } & React.ComponentProps<"section">;

export function Header({ children, className, heading, ...props }: Props) {
	return (
		<section
			className={cn("flex items-center justify-between", className)}
			{...props}
		>
			<h1 className="text-4xl font-bold">{heading}</h1>
			{children}
		</section>
	);
}
