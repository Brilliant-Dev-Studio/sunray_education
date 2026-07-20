import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Login | Sun Ray",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#ef3444] text-white font-bold text-xl mb-4">
            SR
          </div>
          <h1 className="text-2xl font-semibold text-[#1a2025]">Sun Ray Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to manage level tests</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
