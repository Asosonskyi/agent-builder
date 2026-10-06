import { useId } from "react"
import type { FieldError } from "react-hook-form"
import { useTranslation } from "react-i18next"

interface FormFieldProps {
  label: string
  error?: FieldError
  children: (props: {
    id: string
    placeholder: string
    "aria-invalid": boolean
    "aria-describedby": string | undefined
    className: string
  }) => React.ReactNode
}

/** Placeholder-only field per the design, with a visually hidden label for assistive tech. */
export function FormField({ label, error, children }: FormFieldProps) {
  const { t } = useTranslation()
  const id = useId()
  const errorId = `${id}-error`
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      {children({
        id,
        placeholder: label,
        "aria-invalid": Boolean(error),
        "aria-describedby": error ? errorId : undefined,
        className: "form-field",
      })}
      {error?.message && (
        <p id={errorId} className="text-sm text-danger">
          {/* Zod messages are i18n keys (see api/schemas.ts) */}
          {t(error.message as "validation.nameRequired")}
        </p>
      )}
    </div>
  )
}
