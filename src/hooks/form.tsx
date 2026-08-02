import { createFormHook } from "@tanstack/react-form";
import { lazy } from "react";
import { fieldContext, formContext, useFormContext } from "./form-context";

const FileInputField = lazy(
  () => import("@/components/forms/file-input-field.tsx"),
);
const NumberField = lazy(() => import("@/components/forms/number-field.tsx"));
const SelectField = lazy(() => import("@/components/forms/select-field.tsx"));
const TextField = lazy(() => import("@/components/forms/text-field.tsx"));

function SubmitButton({ label }: { label: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {label}
        </button>
      )}
    </form.Subscribe>
  );
}

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    FileInputField,
    NumberField,
    SelectField,
    TextField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
