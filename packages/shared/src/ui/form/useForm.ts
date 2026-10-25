"use client";

/**
 * Shared form hook.
 *
 * Consumers should import useForm from @super-app/shared/ui instead of
 * depending directly on react-hook-form. This keeps form infrastructure
 * behind the shared UI package.
 */
export { useForm } from "react-hook-form";
export type {
  FieldValues,
  UseFormReturn,
  SubmitHandler,
  UseFormProps,
} from "react-hook-form";
