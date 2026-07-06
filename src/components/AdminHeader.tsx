"use client";

import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";
import {
  resolveLocalizedText,
  type LocalizedText,
} from "@/lib/i18n";

type AdminHeaderLink = {
  href: string;
  label: LocalizedText;
  muted?: boolean;
};

type AdminHeaderProps = {
  section: LocalizedText;
  showDashboardLink?: boolean;
  links?: AdminHeaderLink[];
};

export default function AdminHeader({
  section,
  showDashboardLink = true,
  links = [],
}: AdminHeaderProps) {
  const { locale, t } = useI18n();
  const dashboardLinks: AdminHeaderLink[] = showDashboardLink
    ? [
        {
          href: "/admin",
          label: t.adminHeader.backToDashboard,
        },
      ]
    : [];
  const navigationLinks: AdminHeaderLink[] = [...dashboardLinks, ...links];
  const sectionLabel = resolveLocalizedText(section, locale);

  return (
    <header className="border-b border-[#caf0f8]/20 pb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-[#caf0f8]/80">
            {t.adminHeader.adminArea}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-white">
              {sectionLabel}
            </span>

            {navigationLinks.map((link, index) => (
              <Link
                key={`${link.href}-${index}`}
                href={link.href}
                className={
                  link.muted
                    ? "text-sm font-semibold text-[#caf0f8]/80 transition hover:text-white"
                    : "text-sm font-semibold text-[#caf0f8] transition hover:text-white"
                  }
              >
                {resolveLocalizedText(link.label, locale)}
              </Link>
            ))}
          </div>
        </div>

        <form action="/api/admin/logout" method="post">
          <button
            type="submit"
            className="rounded-full border border-[#caf0f8]/50 px-4 py-2 text-sm font-semibold text-[#f8fcff] transition hover:bg-[#caf0f8] hover:text-[#023e8a] focus:outline-none focus:ring-2 focus:ring-[#caf0f8] focus:ring-offset-2 focus:ring-offset-[#0077b6]"
          >
            {t.adminHeader.logout}
          </button>
        </form>
      </div>
    </header>
  );
}
