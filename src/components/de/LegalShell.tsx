import Link from "next/link";

export default function LegalShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span>
          <span className="text-navy-700">{title}</span>
        </nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">{title}</h1>
        <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-slate-700 [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-navy-800 [&_a]:text-navy-600 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
          {children}
        </div>
      </div>
    </main>
  );
}
