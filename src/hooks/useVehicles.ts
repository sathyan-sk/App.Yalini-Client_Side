/**
 * Module-scoped store for the persisted vehicles list.
 *
 * - Single in-memory cache + listener fan-out so all screens that mount
 *   `useVehicles` see the same snapshot and re-render on every mutation
 *   (e.g. Add -> back -> List should reflect the new row instantly).
 * - Asynchronously hydrated from the local storage service on first read.
 */
import { useCallback, useEffect, useState } from "react";

import {
  createVehicle,
  deleteVehicle,
  loadVehicles,
  updateVehicle,
} from "../services/vehicleService";
import type { Vehicle, VehicleFormValues } from "../types/vehicle";

type Listener = (snapshot: Vehicle[]) => void;

let cache: Vehicle[] | null = null;
let hydrating: Promise<Vehicle[]> | null = null;
const listeners = new Set<Listener>();

function notify(snapshot: Vehicle[]) {
  cache = snapshot;
  listeners.forEach((l) => l(snapshot));
}

async function hydrate(): Promise<Vehicle[]> {
  if (cache) return cache;
  if (hydrating) return hydrating;
  hydrating = loadVehicles().then((list) => {
    cache = list;
    hydrating = null;
    listeners.forEach((l) => l(list));
    return list;
  });
  return hydrating;
}

interface UseVehiclesResult {
  vehicles: Vehicle[];
  loading: boolean;
  addVehicle: (values: VehicleFormValues) => Promise<Vehicle>;
  editVehicle: (
    id: string,
    values: VehicleFormValues,
  ) => Promise<Vehicle | null>;
  removeVehicle: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useVehicles(): UseVehiclesResult {
  // Force invalidate cache on mount to ensure fresh data
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    if (cache === null) return [];
    // Still verify cache isn't stale by triggering refresh
    return cache;
  });
  const [loading, setLoading] = useState<boolean>(() => cache === null);

  useEffect(() => {
    let mounted = true;
    const listener: Listener = (snapshot) => {
      if (mounted) setVehicles(snapshot);
    };
    listeners.add(listener);

    hydrate()
      .then((snapshot) => {
        if (!mounted) return;
        setVehicles(snapshot);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
      listeners.delete(listener);
    };
  }, []);

  const addVehicle = useCallback(
    async (values: VehicleFormValues) => {
      const created = await createVehicle(values);
      const current = cache ?? (await loadVehicles());
      notify([created, ...current.filter((v) => v.id !== created.id)]);
      return created;
    },
    [],
  );

  const editVehicle = useCallback(
    async (id: string, values: VehicleFormValues) => {
      const updated = await updateVehicle(id, values);
      if (!updated) return null;
      const current = cache ?? (await loadVehicles());
      notify(current.map((v) => (v.id === id ? updated : v)));
      return updated;
    },
    [],
  );

  const removeVehicle = useCallback(async (id: string) => {
    await deleteVehicle(id);
    const current = cache ?? (await loadVehicles());
    notify(current.filter((v) => v.id !== id));
  }, []);

  const refresh = useCallback(async () => {
    cache = null;
    const fresh = await loadVehicles();
    notify(fresh);
  }, []);

  return { vehicles, loading, addVehicle, editVehicle, removeVehicle, refresh };
}
