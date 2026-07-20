"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/actions/auth";
import {
  HomeIcon,
  FileTextIcon,
  PlusIcon,
  AwardIcon,
  UsersIcon,
  CreditCardIcon,
  LogOutIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/app/admin/icons";

const NAV_ITEMS = [
  { href: "/admin", label: "Home", icon: HomeIcon, exact: true },
  { href: "/admin/tests", label: "Level Tests", icon: FileTextIcon },
  { href: "/admin/tests/new", label: "Create Test", icon: PlusIcon },
  { href: "/admin/certificates", label: "Certificates", icon: AwardIcon },
  { href: "/admin/users", label: "Users", icon: UsersIcon },
  { href: "/admin/payment-methods", label: "Payment Methods", icon: CreditCardIcon },
];

const STORAGE_KEY = "sunray_admin_sidebar_collapsed";

function Tooltip({ label }: { label: string }) {
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-[#1a2025] px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 z-50"
    >
      {label}
    </span>
  );
}

export default function Sidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "1") setCollapsed(true);
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  }

  return (
    <aside
      className={`${
        collapsed ? "w-17" : "w-64"
      } shrink-0 bg-white border-r border-gray-200 flex flex-col min-h-screen transition-all duration-200`}
    >
      <div className={`px-5 py-5 border-b border-gray-200 flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ef3444] text-white font-bold text-sm">
            SR
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#1a2025] leading-tight truncate">Sun Ray</p>
              <p className="text-xs text-gray-500 leading-tight truncate">Admin Panel</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <div className="group relative shrink-0">
            <button
              type="button"
              onClick={toggleCollapsed}
              className="flex items-center justify-center w-7 h-7 rounded-md text-gray-400 hover:text-[#ef3444] hover:bg-gray-50 transition"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <Tooltip label="Collapse sidebar" />
          </div>
        )}
      </div>

      {collapsed && (
        <div className="group relative mx-auto mt-3">
          <button
            type="button"
            onClick={toggleCollapsed}
            className="flex items-center justify-center w-7 h-7 rounded-md text-gray-400 hover:text-[#ef3444] hover:bg-gray-50 transition"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
          <Tooltip label="Expand sidebar" />
        </div>
      )}

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <div key={item.href} className="group relative">
              <Link
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  collapsed ? "justify-center" : ""
                } ${
                  isActive
                    ? "bg-red-50 text-[#ef3444]"
                    : "text-gray-600 hover:text-[#1a2025] hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && item.label}
              </Link>
              {collapsed && <Tooltip label={item.label} />}
            </div>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-200">
        {!collapsed && (
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-gray-500">Signed in as</p>
            <p className="text-sm text-[#1a2025] truncate">{adminName}</p>
          </div>
        )}
        <div className="group relative">
          <form action={logout}>
            <button
              type="submit"
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-[#ef3444] hover:bg-red-50 transition ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <LogOutIcon className="w-5 h-5 shrink-0" />
              {!collapsed && "Log out"}
            </button>
          </form>
          {collapsed && <Tooltip label="Log out" />}
        </div>
      </div>
    </aside>
  );
}
