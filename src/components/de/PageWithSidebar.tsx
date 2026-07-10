import { berlinNow } from "@/lib/de/now";
import CalendarSidebar from "@/components/de/CalendarSidebar";

// Zweispaltiges Layout: linkes Menü mit Kalendern (Desktop) + Inhalt.
export default function PageWithSidebar({ children }: { children: React.ReactNode }) {
  const { year } = berlinNow();
  return (
    <div className="mx-auto flex w-full max-w-6xl gap-8 px-4 py-8">
      <CalendarSidebar year={year} className="hidden lg:block" />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
