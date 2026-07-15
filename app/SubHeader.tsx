import ThemeToggle from "./ThemeToggle";

export default function SubHeader() {
  return (
    <div className="flex items-center justify-end gap-5 bg-black px-6 py-2 sm:px-12">
      <a
        href="mailto:info@sunray-edu.com"
        className="text-sm font-medium text-white/90 transition-colors hover:text-primary-light"
      >
        info@sunray-edu.com
      </a>
      <ThemeToggle className="h-7 w-7 text-white/90" />
    </div>
  );
}
