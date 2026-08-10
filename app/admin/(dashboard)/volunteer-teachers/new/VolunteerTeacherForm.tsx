"use client";

import { useActionState, useRef, useState } from "react";
import { createVolunteerTeacher } from "@/app/admin/actions/volunteerTeachers";
import { UploadIcon } from "@/app/level-test/icons";

export default function VolunteerTeacherForm() {
  const [state, formAction, pending] = useActionState(createVolunteerTeacher, undefined);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <form action={formAction} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Teacher Name <span className="text-[#ef3444]">*</span>
        </label>
        <input
          name="teacherName"
          required
          className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:ring-1 transition ${
            state?.fieldErrors?.teacherName
              ? "border-[#ef3444] focus:ring-[#ef3444]"
              : "border-gray-300 focus:border-[#ef3444] focus:ring-[#ef3444]"
          }`}
        />
        {state?.fieldErrors?.teacherName && (
          <p className="mt-1.5 text-xs text-[#ef3444]">{state.fieldErrors.teacherName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Course Taught <span className="text-[#ef3444]">*</span>
        </label>
        <input
          name="courseTaught"
          required
          placeholder="e.g. Spoken English"
          className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:ring-1 transition ${
            state?.fieldErrors?.courseTaught
              ? "border-[#ef3444] focus:ring-[#ef3444]"
              : "border-gray-300 focus:border-[#ef3444] focus:ring-[#ef3444]"
          }`}
        />
        {state?.fieldErrors?.courseTaught && (
          <p className="mt-1.5 text-xs text-[#ef3444]">{state.fieldErrors.courseTaught}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Photo <span className="text-[#ef3444]">*</span>
        </label>
        <input
          ref={fileInputRef}
          type="file"
          name="photo"
          accept="image/*"
          required
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`w-full flex items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-2.5 text-sm transition ${
            state?.fieldErrors?.photo
              ? "border-[#ef3444] text-[#ef3444]"
              : "border-gray-300 text-gray-500 hover:border-[#ef3444]/50"
          }`}
        >
          <UploadIcon className="w-4 h-4" />
          {preview ? "Change photo" : "Upload photo"}
        </button>
        {state?.fieldErrors?.photo && (
          <p className="mt-1.5 text-xs text-[#ef3444]">{state.fieldErrors.photo}</p>
        )}
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Photo preview"
            className="mt-3 w-24 h-24 rounded-full object-cover border border-gray-200"
          />
        )}
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
        {pending ? "Creating..." : "Create Teacher Record"}
      </button>
    </form>
  );
}
