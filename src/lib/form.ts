import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import Button from "@/components/form/button";
import Input from "@/components/form/input";
import Radio from "@/components/form/radio";
import Select from "@/components/form/select";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
	createFormHookContexts();

export const { useAppForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		Input,
		Radio,
		Select,
	},
	formComponents: {
		Button,
	},
});
