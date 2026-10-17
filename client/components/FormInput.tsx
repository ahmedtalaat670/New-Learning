import type { InputHTMLAttributes } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  hint?: string;
}

export function FormInput({
  label,
  id,
  registration,
  error,
  hint,
  ...inputProps
}: FormInputProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        {...registration}
        {...inputProps}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      />

      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-slate-500">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
}
