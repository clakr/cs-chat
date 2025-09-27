import { cn } from "@/lib/utils";

type Props = {} & React.ComponentProps<"main">;

export function Container({ children, className, ...props }: Props) {
	return (
		<main
			className={cn("mx-auto w-full max-w-7xl p-8 grid gap-y-4", className)}
			{...props}
		>
			{children}
		</main>
	);
}
