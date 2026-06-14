import type {
  BusinessOverview,
  DashboardData,
  Submission,
} from "../../src/types/dashboard";

/**
 * Mock dashboard dataset. Mirrors the reference design exactly for today's
 * date and produces deterministic variations for past dates so the date
 * picker visibly drives the UI.
 *
 * Delete this file once the real backend is wired in dashboardService.ts.
 */

const AVATAR_COLORS = ["#7C3AED", "#2563EB", "#059669", "#F97316", "#EC4899"];

/** Deterministic pseudo-random factor derived from a date string. */
function seedFactor(isoDate: string): number {
  let hash = 0;
  for (let i = 0; i < isoDate.length; i += 1) {
    hash = (hash * 31 + isoDate.charCodeAt(i)) % 997;
  }
  return hash / 997; // 0..1
}

function buildBusinesses(factor: number): BusinessOverview[] {
  const scale = 0.7 + factor * 0.6;
  const round50 = (n: number) => Math.round(n / 50) * 50;

  return [
    {
      id: "biz-yalini-taxi",
      name: "Yalini Cars",
      category: "Taxi",
      tone: "purple",
      icon: { family: "ion", name: "car-outline" },
      metrics: [
        { label: "Total Income", amount: round50(28450 * scale), color: "info" },

        {

          label: "Total Expense's",
          amount: round50(9650 * scale),
          color: "error",
        },
                {
          label: "Net Profit",
          amount: round50(19200 * scale),
          color: "success",
        },
      ],
    },
    {
      id: "biz-yalini-minerals",
      name: "Yalini Minerals",
      category: "Delivery",
      tone: "blue",
      icon: { family: "feather", name: "droplet" },
      metrics: [
        { 
          label: "Total Income",
          amount: round50(12000 * scale),
          color: "info" },
          {
          label: "Total Expense's",
          amount: round50(3000 * scale),
          color: "error",
        },
        {
          label: "Net Profit",
          amount: round50(9000 * scale),
          color: "success",
        },
      ],
    },
  ];
}

function buildSubmissions(isoDate: string, factor: number): Submission[] {
  const people: {
    name: string;
    business: string;
    time: string;
    status: Submission["status"];
  }[] = [
    { name: "Ramesh Kumar", business: "City Taxi", time: "08:35 PM", status: "submitted" },
    { name: "Suresh Kumar", business: "Yalini Minerals (Water)", time: "07:45 PM", status: "submitted" },
    { name: "Mani Kumar", business: "Yalini Minerals (Water)", time: "05:15 PM", status: "pending" },
    { name: "Amit Kumar", business: "City Taxi", time: "06:30 PM", status: "submitted" },
    { name: "Vijay Kumar", business: "City Taxi", time: "04:20 PM", status: "pending" },
  ];

  // Past dates: flip a couple of statuses so data visibly changes.
  const flip = Math.floor(factor * people.length);

  return people.map((p, index) => ({
    id: `sub-${isoDate}-${index}`,
    employeeName: p.name,
    businessName: p.business,
    date: isoDate,
    time: p.time,
    status:
      index === flip && factor > 0.05
        ? p.status === "submitted"
          ? "pending"
          : "submitted"
        : p.status,
    avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
  }));
}

export function getMockDashboardData(isoDate: string, isToday: boolean): DashboardData {
  const factor = isToday ? 0.5 : seedFactor(isoDate);
  const scale = isToday ? 1 : 0.7 + factor * 0.6;

  const submissions = buildSubmissions(isoDate, isToday ? 0 : factor);
  const submitted = submissions.filter((s) => s.status === "submitted").length;

  return {
    stats: {
      activeEmployees: 12,
      submittedToday: isToday ? 10 : Math.round(10 * scale),
      pendingToday: isToday ? 2 : submissions.length - submitted,
      businesses: 2,
    },
    businesses: buildBusinesses(isToday ? 0.5 : factor),
    submissions,
  };
}
