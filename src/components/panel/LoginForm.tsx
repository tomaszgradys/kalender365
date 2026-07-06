"use client";

import { useState } from "react";

// Formularz logowania do panelu: komunikat o błędnym haśle, informacja o pozostałych
// próbach, komunikat o blokadzie oraz auto-przejście do panelu po sukcesie.
export default function LoginForm() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<{ kind: "err" | "lock"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/panel/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.ok) {
        window.location.href = "/panel";
        return;
      }
      if (data.error === "locked") {
        const min = Math.ceil((data.retryAfter ?? 900) / 60);
        setMsg({ kind: "lock", text: `Zbyt wiele nieudanych prób. Konto zablokowane na ~${min} min.` });
      } else {
        const left = typeof data.remaining === "number" ? ` Pozostałe próby: ${data.remaining}.` : "";
        setMsg({ kind: "err", text: `Nieprawidłowy login lub hasło.${left}` });
      }
    } catch {
      setMsg({ kind: "err", text: "Błąd połączenia. Spróbuj ponownie." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-black text-navy-800">Panel kalendarz.pro</h1>
      <p className="mt-1 text-sm text-slate-500">Zaloguj się, aby zarządzać blogiem.</p>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <input
          type="text"
          autoComplete="username"
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-navy-400"
        />
        <input
          type="password"
          autoComplete="current-password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-navy-400"
        />
        {msg && (
          <p
            className={`rounded-xl px-3 py-2 text-sm ${
              msg.kind === "lock" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
            }`}
          >
            {msg.text}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-navy-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60"
        >
          {busy ? "Logowanie…" : "Zaloguj się"}
        </button>
      </form>
    </div>
  );
}
