"use client";

import { useMemo, useState } from "react";

const WEEKDAYS = ["poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota", "niedziela"];

function todayISO() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
}

export default function WeekdayFinder() {
  const [date, setDate] = useState(todayISO());

  const info = useMemo(() => {
    if (!date) return null;
    const [y, m, d] = date.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    if (Number.isNaN(dt.getTime())) return null;
    const weekday = WEEKDAYS[(dt.getUTCDay() + 6) % 7];
    const doy = Math.floor((Date.UTC(y, m - 1, d) - Date.UTC(y, 0, 0)) / 86400000);
    // ISO week
    const tmp = new Date(Date.UTC(y, m - 1, d));
    const dn = (tmp.getUTCDay() + 6) % 7;
    tmp.setUTCDate(tmp.getUTCDate() - dn + 3);
    const firstThu = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 4));
    const fdn = (firstThu.getUTCDay() + 6) % 7;
    firstThu.setUTCDate(firstThu.getUTCDate() - fdn + 3);
    const week = 1 + Math.round((tmp.getTime() - firstThu.getTime()) / (7 * 86400000));
    return { weekday, doy, week };
  }, [date]);

  return (
    <div className="mt-6">
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-600">Wybierz datę</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 focus:border-navy-400 focus:outline-none"
        />
      </label>

      {info && (
        <div className="mt-6 rounded-2xl bg-gradient-to-br from-navy-600 to-navy-800 p-6 text-center text-white">
          <div className="text-3xl font-black capitalize">{info.weekday}</div>
          <div className="mt-2 text-sm text-navy-100">
            {info.doy}. dzień roku · {info.week}. tydzień
          </div>
        </div>
      )}
    </div>
  );
}
