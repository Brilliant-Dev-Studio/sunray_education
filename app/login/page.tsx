import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/app/Header";
import LoginForm from "./LoginForm";
import { UserIcon } from "@/app/AuthIcons";

export const metadata: Metadata = {
  title: "Log In",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  const redirectTo = redirect && redirect.startsWith("/") ? redirect : "/level-test";

  return (
    <>
      <Header />
      <div className="relative flex items-center justify-center overflow-hidden px-4 py-16 sm:py-24">
        <Image
          src="/HeroImages/photo3.avif"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/65" />

        <div className="relative w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-white">
              <UserIcon className="w-6 h-6" />
            </div>
            <h1 className="mt-4 font-sans text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-sm text-white/75 mt-1">Log in to take your CEFR level test</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-background p-6 shadow-2xl">
            <LoginForm redirectTo={redirectTo} />
          </div>
        </div>
      </div>
    </>
  );
}
