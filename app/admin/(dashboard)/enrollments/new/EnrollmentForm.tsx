"use client";

import { useActionState, useState } from "react";
import { createEnrollment } from "@/app/admin/actions/enrollments";
import { CheckIcon } from "@/app/admin/icons";

type FieldName = "studentName" | "rollNumber" | "nationalId" | "courseTitle" | "batch";

const FIELDS: {
  name: FieldName;
  label: string;
  placeholder?: string;
  minLength: number;
}[] = [
  { name: "studentName", label: "Student Name", minLength: 2 },
  { name: "rollNumber", label: "Roll Number", minLength: 2 },
  { name: "nationalId", label: "National ID Number", minLength: 5 },
  { name: "courseTitle", label: "Course Title", minLength: 2 },
  { name: "batch", label: "Batch", placeholder: "e.g. Batch 12", minLength: 1 },
];

function clientError(field: (typeof FIELDS)[number], value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) return `${field.label} is required.`;
  if (trimmed.length < field.minLength) {
    return `${field.label} must be at least ${field.minLength} characters.`;
  }
  return null;
}

function Field({
  field,
  value,
  touched,
  serverError,
  onChange,
  onBlur,
}: {
  field: (typeof FIELDS)[number];
  value: string;
  touched: boolean;
  serverError?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  const error = (touched ? clientError(field, value) : null) ?? serverError ?? null;
  const isValid = touched && !error && value.trim().length > 0;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {field.label} <span className="text-[#ef3444]">*</span>
      </label>
      <div className="relative">
        <input
          name={field.name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={field.placeholder}
          aria-invalid={Boolean(error)}
          className={`w-full rounded-lg border px-3.5 py-2.5 pr-9 text-sm outline-none transition ${
            error
              ? "border-[#ef3444] focus:ring-1 focus:ring-[#ef3444]"
              : isValid
                ? "border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                : "border-gray-300 focus:border-[#ef3444] focus:ring-1 focus:ring-[#ef3444]"
          }`}
        />
        {isValid && (
          <CheckIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-[#ef3444]">{error}</p>}
    </div>
  );
}

export default function EnrollmentForm() {
  const [state, formAction, pending] = useActionState(createEnrollment, undefined);
  const [values, setValues] = useState<Record<FieldName, string>>({
    studentName: "",
    rollNumber: "",
    nationalId: "",
    courseTitle: "",
    batch: "",
  });
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});

  function fieldProps(name: FieldName) {
    const field = FIELDS.find((f) => f.name === name)!;
    return {
      field,
      value: values[name],
      touched: Boolean(touched[name]),
      serverError: state?.fieldErrors?.[name],
      onChange: (value: string) => setValues((prev) => ({ ...prev, [name]: value })),
      onBlur: () => setTouched((prev) => ({ ...prev, [name]: true })),
    };
  }

  return (
    <form
      action={formAction}
      onSubmit={() =>
        setTouched({
          studentName: true,
          rollNumber: true,
          nationalId: true,
          courseTitle: true,
          batch: true,
        })
      }
      className="rounded-xl border border-gray-200 bg-white p-6 space-y-4"
      noValidate
    >
      <Field {...fieldProps("studentName")} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field {...fieldProps("rollNumber")} />
        <Field {...fieldProps("nationalId")} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field {...fieldProps("courseTitle")} />
        <Field {...fieldProps("batch")} />
      </div>

      {state?.error && (
        <p className="text-sm text-[#ef3444] bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[#ef3444] hover:bg-[#ff3b45] disabled:opacity-60 text-white font-semibold px-6 py-2.5 text-sm transition"
      >
        {pending ? "Creating..." : "Create Record"}
      </button>
    </form>
  );
}
