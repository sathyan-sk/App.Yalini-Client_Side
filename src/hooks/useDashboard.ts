import { useCallback, useEffect, useRef, useState } from "react";

import { fetchDashboardData } from "../../src/services/dashboardService";
import type { DashboardData } from "../../src/types/dashboard";

interface UseDashboardResult {
  data: DashboardData | null;
  /** True only for the first load of a given date (no data on screen). */
  loading: boolean;
  /** True while pull-to-refresh is in flight. */
  refreshing: boolean;
  error: string | null;
  refresh: () => void;
}

/** Loads dashboard data for the given ISO date and reloads when it changes. */
export function useDashboard(isoDate: string): UseDashboardResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const load = useCallback(
    async (mode: "initial" | "refresh") => {
      const id = ++requestId.current;
      if (mode === "initial") setLoading(true);
      else setRefreshing(true);
      setError(null);

      try {
        const result = await fetchDashboardData(isoDate);
        if (id !== requestId.current) return; // stale response, ignore
        setData(result);
      } catch (e) {
        if (id !== requestId.current) return;
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        if (id === requestId.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [isoDate],
  );

  useEffect(() => {
    load("initial");
  }, [load]);

  const refresh = useCallback(() => {
    load("refresh");
  }, [load]);

  return { data, loading, refreshing, error, refresh };
}
