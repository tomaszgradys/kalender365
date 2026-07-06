import { warsawNow } from "./now";

// Harmonogram auto-bloga dla panelu admina. Publikacja CO 2 DNI o stałej porze
// (cron dzienny + bramka: generuj tylko gdy najnowszy wpis ma >= 2 dni). Tematy
// dobiera automatycznie model wg sezonu/koniunktury — dlatego harmonogram pokazuje
// TERMINY (sloty), a nie z góry ustalone tytuły.

export const STEP_DAYS = 2;

export interface ScheduleSlot {
  date: string; // ISO YYYY-MM-DD (Europe/Warsaw)
  index: number; // 1 = najbliższy
}

function todayISO(): string {
  const { year, month0, day } = warsawNow();
  return `${year}-${String(month0 + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// Projekcja kolejnych slotów publikacji na podstawie daty ostatniego wpisu.
// Jeśli ostatni wpis jest starszy niż STEP_DAYS — najbliższy slot to dziś.
export function nextSlots(latestPublished: string | null, count: number, step = STEP_DAYS): ScheduleSlot[] {
  const today = todayISO();
  let base: string;
  if (!latestPublished) {
    base = today;
  } else {
    const due = addDays(latestPublished, step);
    base = due <= today ? today : due;
  }
  const slots: ScheduleSlot[] = [];
  for (let i = 0; i < count; i++) {
    slots.push({ date: addDays(base, i * step), index: i + 1 });
  }
  return slots;
}

// Czy dziś przypada termin publikacji (używane przez cron-bramkę).
export function isDueToday(latestPublished: string | null, step = STEP_DAYS): boolean {
  if (!latestPublished) return true;
  return addDays(latestPublished, step) <= todayISO();
}
