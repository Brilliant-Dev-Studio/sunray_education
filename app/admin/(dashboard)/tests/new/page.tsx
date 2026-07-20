import TestBuilderForm from "./TestBuilderForm";

export default function NewTestPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1a2025]">Create Level Test</h1>
        <p className="text-gray-500 mt-1">
          Set a test name, define CEFR score bands, and add multiple-choice questions.
        </p>
      </header>
      <TestBuilderForm />
    </div>
  );
}
