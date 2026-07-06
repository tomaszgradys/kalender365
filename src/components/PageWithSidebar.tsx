import { nowCtx } from "@/lib/calendars";
import CalendarSidebar from "@/components/CalendarSidebar";
import RelatedCalendars from "@/components/RelatedCalendars";

// Układ dwukolumnowy: lewe menu z kalendarzami (desktop) + treść.
// Na dole treści zawsze sekcja „Przydatne również" (linkowanie wewnętrzne).
export default function PageWithSidebar({
  children,
  related = true,
  relatedExclude = [],
}: {
  children: React.ReactNode;
  related?: boolean;
  relatedExclude?: string[];
}) {
  return (
    <div className="mx-auto flex w-full max-w-6xl gap-8 px-4 py-8">
      <CalendarSidebar ctx={nowCtx()} className="hidden lg:block" />
      <main className="pdf-capture min-w-0 flex-1">
        {children}
        {related && <RelatedCalendars exclude={relatedExclude} />}
      </main>
    </div>
  );
}
