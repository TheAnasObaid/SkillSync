"use client";

import { FieldError, useFormContext } from "react-hook-form";

interface FieldProps {
  name: string;
  label: string;
  helperText?: string;
  icon?: React.ReactNode;
}
interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name">,
    FieldProps {}
interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name">,
    FieldProps {}
interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "name">,
    FieldProps {
  children: React.ReactNode;
}
interface FileInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name">,
    Omit<FieldProps, "icon"> {}

export const TextInput = ({
  name,
  label,
  helperText,
  icon,
  ...props
}: TextInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name] as FieldError | undefined;

  return (
    <div className="grid w-full items-center gap-1">
      <label className="label p-0">
        <span className="label-text flex items-center gap-2 font-medium">
          {icon} {label}
        </span>
      </label>
      <input
        type="text"
        className={`input input-bordered w-full ${error ? "input-error" : ""}`}
        {...register(name)}
        {...props}
      />
      {error?.message && <p className="text-error text-xs">{error.message}</p>}
      {helperText && !error && (
        <p className="text-xs text-base-content/60">{helperText}</p>
      )}
    </div>
  );
};

export const Textarea = ({
  name,
  label,
  helperText,
  icon,
  ...props
}: TextareaProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name] as FieldError | undefined;
  return (
    <div className="grid w-full items-center gap-1">
      <label className="label p-0">
        <span className="label-text flex items-center gap-2 font-medium">
          {icon} {label}
        </span>
      </label>
      <textarea
        className={`textarea textarea-bordered w-full ${
          error ? "textarea-error" : ""
        }`}
        {...register(name)}
        {...props}
      />
      {error?.message && <p className="text-error text-xs">{error.message}</p>}
      {helperText && !error && (
        <p className="text-xs text-base-content/60">{helperText}</p>
      )}
    </div>
  );
};

export const Select = ({
  name,
  label,
  helperText,
  icon,
  children,
  ...props
}: SelectProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name] as FieldError | undefined;
  return (
    <div className="grid w-full items-center gap-1">
      <label className="label p-0">
        <span className="label-text flex items-center gap-2 font-medium">
          {icon} {label}
        </span>
      </label>
      <select
        className={`select select-bordered w-full ${
          error ? "select-error" : ""
        }`}
        {...register(name)}
        {...props}
      >
        {children}
      </select>
      {error?.message && <p className="text-error text-xs">{error.message}</p>}
      {helperText && !error && (
        <p className="text-xs text-base-content/60">{helperText}</p>
      )}
    </div>
  );
};

export const FileInput = ({
  name,
  label,
  helperText,
  ...props
}: FileInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name] as FieldError | undefined;
  return (
    <div className="grid w-full items-center gap-1">
      <label className="label p-0">
        <span className="label-text font-medium">{label}</span>
      </label>
      <input
        type="file"
        className={`file-input file-input-bordered w-full ${
          error ? "file-input-error" : ""
        }`}
        {...register(name)}
        {...props}
      />
      {error?.message && <p className="text-error text-xs">{error.message}</p>}
      {helperText && !error && (
        <p className="text-xs text-base-content/60">{helperText}</p>
      )}
    </div>
  );
};
