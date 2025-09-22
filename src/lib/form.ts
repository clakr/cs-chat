import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { lazy } from "react";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
	createFormHookContexts();

export const { useAppForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		Input: lazy(() => import("@/components/form/input")),
		Radio: lazy(() => import("@/components/form/radio")),
	},
	formComponents: {
		Button: lazy(() => import("@/components/form/button")),
	},
});
