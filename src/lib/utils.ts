import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getAvatar(seed: string) {
	const url = new URL("https://api.dicebear.com/9.x/notionists/svg");

	url.searchParams.set("backgroundColor", "d87943");

	if (seed) url.searchParams.set("seed", seed);

	return url.toString();
}
