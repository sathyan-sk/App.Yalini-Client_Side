import dayjs from "dayjs";

/** Formats a number with Indian digit grouping: 28450 -> "28,450". */
export function formatINR(amount: number): string {
  const sign = amount < 0 ? "-" : "";
  const digits = Math.round(Math.abs(amount)).toString();
  if (digits.length <= 3) return sign + digits;
  const last3 = digits.slice(-3);
  const rest = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${sign}${rest},${last3}`;
}

/** "2026-06-10" -> "10 Jun 2026" */
export function formatDisplayDate(isoDate: string): string {
  return dayjs(isoDate).format("DD MMM YYYY");
}

/** Today's date as ISO string (YYYY-MM-DD). */
export function todayISO(): string {
  return dayjs().format("YYYY-MM-DD");
}
