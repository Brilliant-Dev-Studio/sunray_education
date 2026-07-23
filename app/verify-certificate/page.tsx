import type { Metadata } from "next";
import Header from "@/app/Header";
import { verifyCertificateCode } from "@/app/actions/verify-certificate";
import VerifyCertificateClient from "./VerifyCertificateClient";

export const metadata: Metadata = {
  title: "Verify Certificate",
};

export default async function VerifyCertificatePage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  const initialResult = code ? await verifyCertificateCode(code) : undefined;

  return (
    <>
      <Header />
      <div className="relative min-h-[70vh] overflow-hidden bg-[#FFF9F2] dark:bg-background">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4] dark:opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            color: "var(--primary-light)",
            maskImage: "radial-gradient(ellipse 55% 45% at 50% 0%, black 0%, transparent 70%)",
          }}
        />
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-lg h-128 rounded-full bg-primary-light/10 blur-3xl" />

        <div className="relative px-6">
          <VerifyCertificateClient initialResult={initialResult} />
        </div>
      </div>
    </>
  );
}
