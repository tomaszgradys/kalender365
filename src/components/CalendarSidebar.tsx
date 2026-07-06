"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MENU, MENU_ICONS, resolveHref, type MenuItem } from "@/lib/menu";
import type { DateCtx } from "@/lib/calendars";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  const base = "/" + (href.split("/")[1] ?? "");
  return pathname === href || (base.length > 2 && pathname.startsWith(base));
}

// Duży, czytelny symbol bez ramki (bez białych kafelków).
function MenuIcon({ icon }: { icon: string }) {
  const meta = MENU_ICONS[icon];
  return (
    <span aria-hidden="true" className="flex w-6 shrink-0 items-center justify-center text-[19px] leading-none">
      {meta?.emoji ?? "•"}
    </span>
  );
}

export default function CalendarSidebar({
  ctx,
  className = "",
  mobile = false,
  showSearch = true,
  onNavigate,
}: {
  ctx: DateCtx;
  className?: string;
  mobile?: boolean;
  showSearch?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  // Href-y policzone z serwerowego ctx (stabilne między SSR a klientem).
  const sections = MENU.map((s) => ({
    ...s,
    items: s.items.map((it) => ({
      ...it,
      label: resolveHref(it.label, ctx), // podstaw rok w etykiecie „Kalendarz {y}"
      resolved: resolveHref(it.href, ctx),
    })),
  }));

  const activeCategory =
    sections.find((s) => !s.popular && s.items.some((it) => isActive(pathname, it.resolved)))?.title ?? null;

  const [toggles, setToggles] = useState<Record<string, boolean>>({});
  const isOpen = (title: string) => (title in toggles ? toggles[title] : title === activeCategory);

  const Row = ({ item, resolved }: { item: MenuItem; resolved: string }) => {
    const active = isActive(pathname, resolved);
    return (
      <li className="relative">
        {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-[#0e7afe]" />}
        <Link
          href={resolved}
          onClick={onNavigate}
          aria-current={active ? "page" : undefined}
          className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13.5px] transition ${
            active
              ? "bg-[#eaf4ff] font-semibold text-[#0b376d]"
              : "text-[#334155] hover:bg-[#f1f7ff] hover:text-[#0b376d]"
          }`}
        >
          <MenuIcon icon={item.icon} />
          <span className="truncate">{item.label}</span>
        </Link>
      </li>
    );
  };

  const popular = sections.find((s) => s.popular);
  const rest = sections.filter((s) => !s.popular);

  return (
    <aside aria-label="Kalendarze i narzędzia" className={`${mobile ? "w-full" : "w-64 shrink-0"} ${className}`}>
      <div className={mobile ? "" : "sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl bg-[#f8fafd] p-2.5"}>
        {mobile && showSearch && (
          <form action="/szukaj" role="search" className="mb-3">
            <input
              type="search"
              name="q"
              placeholder="Szukaj w kalendarzu…"
              aria-label="Szukaj w kalendarzu"
              className="w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0e7afe]"
            />
          </form>
        )}

        {/* Najpopularniejsze — subtelnie wyróżnione (jasne tło + złoty detal) */}
        {popular && (
          <div className="mb-4 rounded-xl bg-[#eef5ff]/60 p-2">
            <h2 className="mb-1 flex items-center gap-1.5 px-2 text-[11px] font-bold uppercase tracking-wide text-[#0b376d]">
              <span className="text-[#f5b800]">★</span> {popular.title}
            </h2>
            <ul className="space-y-0.5">
              {popular.items.map((it) => (
                <Row key={it.label} item={it} resolved={it.resolved} />
              ))}
            </ul>
          </div>
        )}

        {/* Kategorie — zwijane, z większym odstępem */}
        <nav className="space-y-1.5">
          {rest.map((s) => {
            const open = isOpen(s.title);
            return (
              <div key={s.title} className="border-t border-[#e2e8f0] pt-1.5">
                <button
                  type="button"
                  onClick={() => setToggles((t) => ({ ...t, [s.title]: !open }))}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#64748b] transition hover:bg-[#f1f7ff]"
                >
                  <span>{s.title}</span>
                  <span className={`text-[#94a3b8] transition-transform ${open ? "rotate-90" : ""}`}>›</span>
                </button>
                {open && (
                  <ul className="mt-0.5 space-y-0.5 pb-1.5">
                    {s.items.map((it) => (
                      <Row key={it.label} item={it} resolved={it.resolved} />
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
