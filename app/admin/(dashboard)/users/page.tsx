import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import AdminPagination from "@/app/admin/AdminPagination";

const PAGE_SIZE = 10;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const where: Prisma.UserWhereInput = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { certificateRequests: true } } },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1a2025]">Users</h1>
        <p className="text-gray-500 mt-1">Everyone who has signed up to take level tests</p>
      </header>

      <form method="GET" className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by name or email..."
          className="flex-1 min-w-48 rounded-lg border border-gray-200 px-3.5 py-2 text-sm outline-none focus:border-[#ef3444] focus:ring-1 focus:ring-[#ef3444] transition"
        />
        <button
          type="submit"
          className="rounded-lg bg-[#ef3444] hover:bg-[#ff3b45] text-white font-semibold px-4 py-2 text-sm transition"
        >
          Search
        </button>
        {q && (
          <Link
            href="/admin/users"
            className="text-sm text-gray-500 hover:text-[#1a2025] underline"
          >
            Clear
          </Link>
        )}
      </form>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        {users.length === 0 ? (
          <p className="p-8 text-center text-gray-500 text-sm">
            {q ? "No users match your search." : "No users yet."}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Certificate Requests</th>
                <th className="px-5 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-5 py-3 font-medium text-[#1a2025]">{u.name}</td>
                  <td className="px-5 py-3 text-gray-700">{u.email}</td>
                  <td className="px-5 py-3 text-gray-500">{u._count.certificateRequests}</td>
                  <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
                    {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(u.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <AdminPagination
          page={page}
          totalPages={totalPages}
          total={total}
          pageSize={PAGE_SIZE}
          basePath="/admin/users"
          searchParams={{ q }}
        />
      </div>
    </div>
  );
}
