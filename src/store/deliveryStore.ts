/**
 * Delivery Store - State management for Staff delivery module.
 *
 * Uses Zustand for lightweight, TypeScript-first state management.
 * Manages delivery session state, form data, and delivery records.
 * 
 * FIXED: Types are now consistent with AddDelivery/types.ts
 */
import { create } from 'zustand';
import type {
  SessionStatus,
  HotelOption,
  DeliverySessionData,
  DeliveryRecord,
} from '../screens/staffScreens/AddDelivery/types';

// Re-export types for convenience
export type { SessionStatus, HotelOption, DeliverySessionData, DeliveryRecord };

/**
 * Delivery store state shape.
 */
interface DeliveryState {
  /** Current session data */
  session: DeliverySessionData;
  /** List of deliveries made in current session */
  deliveries: DeliveryRecord[];
  /** Available hotels for selection - now includes ratePerCan */
  hotels: HotelOption[];
  /** Loading state */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
}

/**
 * Delivery store actions.
 */
interface DeliveryActions {
  /** Sets the session data */
  setSession: (session: DeliverySessionData) => void;
  /** Updates session status */
  updateSessionStatus: (status: SessionStatus) => void;
  /** Sets available hotels */
  setHotels: (hotels: HotelOption[]) => void;
  /** Adds a delivery record */
  addDelivery: (delivery: DeliveryRecord) => void;
  /** Updates an existing delivery record */
  updateDelivery: (id: string, updates: Partial<DeliveryRecord>) => void;
  /** Gets a delivery record by ID */
  getDeliveryById: (id: string) => DeliveryRecord | undefined;
  /** Removes a delivery record */
  removeDelivery: (id: string) => void;
  /** Sets loading state */
  setLoading: (loading: boolean) => void;
  /** Sets error message */
  setError: (error: string | null) => void;
  /** Resets the store to initial state */
  reset: () => void;
}

/** Default session data for initial state */
const DEFAULT_SESSION: DeliverySessionData = {
  id: '',
  staffName: 'Staff Member',
  serviceName: 'Yalini Minerals',
  sessionDate: new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }),
  sessionTime: new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  }),
  sessionStatus: 'ACTIVE',
};

/** Initial state */
const initialState: DeliveryState = {
  session: DEFAULT_SESSION,
  deliveries: [],
  hotels: [],
  isLoading: false,
  error: null,
};

/**
 * Zustand store for delivery state management.
 * Provides centralized state for the Staff delivery module.
 */
export const useDeliveryStore = create<DeliveryState & DeliveryActions>(
  (set, get) => ({
    ...initialState,

    /**
     * Sets the session data.
     * @param session - New session data
     */
    setSession: (session) => set({ session }),

    /**
     * Updates the session status.
     * @param status - New status value
     */
    updateSessionStatus: (status) =>
      set((state) => ({
        session: { ...state.session, sessionStatus: status },
      })),

    /**
     * Sets available hotels for selection.
     * @param hotels - Array of hotel options
     */
    setHotels: (hotels) => set({ hotels }),

    /**
     * Adds a new delivery record to the list.
     * @param delivery - The delivery record to add
     */
    addDelivery: (delivery) =>
      set((state) => ({
        deliveries: [delivery, ...state.deliveries],
      })),

    /**
     * Updates an existing delivery record by ID.
     * @param id - The delivery ID to update
     * @param updates - Partial delivery data to update
     */
    updateDelivery: (id, updates) =>
      set((state) => ({
        deliveries: state.deliveries.map((d) =>
          d.id === id ? { ...d, ...updates } : d
        ),
      })),

    /**
     * Gets a delivery record by ID.
     * @param id - The delivery ID to find
     * @returns The delivery record or undefined
     */
    getDeliveryById: (id) => get().deliveries.find((d) => d.id === id),

    /**
     * Removes a delivery record by ID.
     * @param id - The delivery ID to remove
     */
    removeDelivery: (id) =>
      set((state) => ({
        deliveries: state.deliveries.filter((d) => d.id !== id),
      })),

    /**
     * Sets the loading state.
     * @param loading - Loading flag
     */
    setLoading: (loading) => set({ isLoading: loading }),

    /**
     * Sets an error message.
     * @param error - Error message or null to clear
     */
    setError: (error) => set({ error }),

    /**
     * Resets the store to initial state.
     */
    reset: () => set(initialState),
  })
);
