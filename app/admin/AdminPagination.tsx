import Link from "next/link";

export default function AdminPagination({
  page,
  totalPages,
  total,
  pageSize,
  basePath,
  searchParams,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}) {
  if (total === 0) return null;

  function hrefForPage(p: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value) params.set(key, value);
    }
    params.set("page", String(p));
    return `${basePath}?${params.toString()}`;
  }

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 text-sm">
      <p className="text-gray-500">
        Showing {start}–{end} of {total}
      </p>
      <div className="flex items-center gap-2">
        <Link
          href={hrefForPage(Math.max(1, page - 1))}
          aria-disabled={page <= 1}
          className={`rounded-md border border-gray-200 px-3 py-1.5 text-gray-600 transition ${
            page <= 1
              ? "opacity-40 pointer-events-none"
              : "hover:border-[#ef3444] hover:text-[#ef3444]"
          }`}
        >
          Previous
        </Link>
        <span className="text-gray-500 px-1">
          Page {page} of {totalPages}
        </span>
        <Link
          href={hrefForPage(Math.min(totalPages, page + 1))}
          aria-disabled={page >= totalPages}
          className={`rounded-md border border-gray-200 px-3 py-1.5 text-gray-600 transition ${
            page >= totalPages
              ? "opacity-40 pointer-events-none"
              : "hover:border-[#ef3444] hover:text-[#ef3444]"
          }`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
