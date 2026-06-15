/**
 * Module-scoped store for the persisted businesses list.
 *
 * - Single in-memory cache + listener fan-out so all screens that mount
 *   `useBusinesses` see the same snapshot and re-render on every mutation
 *   (e.g. Add -> back -> List should reflect the new row instantly).
 * - Asynchronously hydrated from the local storage service on first read.
 */
import { useCallback, useEffect, useState } from "react";

import {
  createBusiness,
  deleteBusiness,
  loadBusinesses,
  updateBusiness,
} from "../services/businessService";
import type {
  Business,
  BusinessFormValues,
} from "../screens/adminScreens/MyBusiness/types";

type Listener = (snapshot: Business[]) => void;

let cache: Business[] | null = null;
let hydrating: Promise<Business[]> | null = null;
const listeners = new Set<Listener>();

function notify(snapshot: Business[]) {
  cache = snapshot;
  listeners.forEach((l) => l(snapshot));
}

async function hydrate(): Promise<Business[]> {
  if (cache) return cache;
  if (hydrating) return hydrating;
  hydrating = loadBusinesses().then((list) => {
    cache = list;
    hydrating = null;
    listeners.forEach((l) => l(list));
    return list;
  });
  return hydrating;
}

interface UseBusinessesResult {
  businesses: Business[];
  loading: boolean;
  addBusiness: (values: BusinessFormValues) => Promise<Business>;
  editBusiness: (
    id: string,
    values: BusinessFormValues,
  ) => Promise<Business | null>;
  removeBusiness: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useBusinesses(): UseBusinessesResult {
  const [businesses, setBusinesses] = useState<Business[]>(() => cache ?? []);
  const [loading, setLoading] = useState<boolean>(() => cache === null);

  useEffect(() => {
    let mounted = true;
    const listener: Listener = (snapshot) => {
      if (mounted) setBusinesses(snapshot);
    };
    listeners.add(listener);

    hydrate()
      .then((snapshot) => {
        if (!mounted) return;
        setBusinesses(snapshot);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
      listeners.delete(listener);
    };
  }, []);

  const addBusiness = useCallback(
    async (values: BusinessFormValues) => {
      const created = await createBusiness(values);
      const current = cache ?? (await loadBusinesses());
      notify([created, ...current.filter((b) => b.id !== created.id)]);
      return created;
    },
    [],
  );

  const editBusiness = useCallback(
    async (id: string, values: BusinessFormValues) => {
      const updated = await updateBusiness(id, values);
      if (!updated) return null;
      const current = cache ?? (await loadBusinesses());
      notify(current.map((b) => (b.id === id ? updated : b)));
      return updated;
    },
    [],
  );

  const removeBusiness = useCallback(async (id: string) => {
    await deleteBusiness(id);
    const current = cache ?? (await loadBusinesses());
    notify(current.filter((b) => b.id !== id));
  }, []);

  const refresh = useCallback(async () => {
    cache = null;
    const fresh = await loadBusinesses();
    notify(fresh);
  }, []);

  return { businesses, loading, addBusiness, editBusiness, removeBusiness, refresh };
}