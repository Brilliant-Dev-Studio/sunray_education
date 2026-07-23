import Link from "next/link";
import { ArrowLeftIcon } from "@/app/level-test/icons";
import EnrollmentForm from "./EnrollmentForm";

export default function NewEnrollmentPage() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link
        href="/admin/enrollments"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1a2025]"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Students
      </Link>
      <h1 className="text-2xl font-semibold text-[#1a2025] mt-2 mb-6">New Student Record</h1>
      <EnrollmentForm />
    </div>
  );
}
