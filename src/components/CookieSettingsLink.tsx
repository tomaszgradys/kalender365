"use client";

export default function CookieSettingsLink({ label = "Zmień ustawienia cookies" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}
      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-navy-700 hover:border-navy-300"
    >
      {label}
    </button>
  );
}
