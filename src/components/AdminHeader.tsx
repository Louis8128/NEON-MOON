"use client";

import Link from "next/link";

type AdminHeaderLink = {
  href: string;
  label: string;
  muted?: boolean;
};

type AdminHeaderProps = {
  section: string;
  showDashboardLink?: boolean;
  links?: AdminHeaderLink[];
};

export default function AdminHeader({
  section,
  showDashboardLink = true,
  links = [],
}: AdminHeaderProps) {
  const dashboardLinks: AdminHeaderLink[] = showDashboardLink
    ? [
        {
          href: "/admin",
          label: "← Back to Admin Dashboard",
        },
      ]
    : [];
  const navigationLinks: AdminHeaderLink[] = [...dashboardLinks, ...links];

  return (
    <header className="border-b border-[#caf0f8]/20 pb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-[#caf0f8]/80">
            Admin Area
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-white">{section}</span>

            {navigationLinks.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className={
                  link.muted
                    ? "text-sm font-semibold text-[#caf0f8]/80 transition hover:text-white"
                    : "text-sm font-semibold text-[#caf0f8] transition hover:text-white"
                }
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <form action="/api/admin/logout" method="post">
          <button
            type="submit"
            className="rounded-full border border-[#caf0f8]/50 px-4 py-2 text-sm font-semibold text-[#f8fcff] transition hover:bg-[#caf0f8] hover:text-[#023e8a] focus:outline-none focus:ring-2 focus:ring-[#caf0f8] focus:ring-offset-2 focus:ring-offset-[#0077b6]"
          >
            Logout
          </button>
        </form>
      </div>
    </header>
  );
}
