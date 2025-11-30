import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Trip Manager Auth Store
 * Manages trip manager authentication state separately from other user types
 */
const useTripManagerAuthStore = create(
  persist(
    (set, get) => ({
      // State
      tripManager: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setTripManager: (tripManager) => set({ tripManager, isAuthenticated: !!tripManager }),

      setToken: (token) => {
        if (token) {
          localStorage.setItem('trip-manager-token', token);
        } else {
          localStorage.removeItem('trip-manager-token');
        }
        set({ token });
      },

      login: (tripManager, token) => {
        set({
          tripManager,
          token,
          isAuthenticated: true,
        });
        localStorage.setItem('trip-manager-token', token);
        localStorage.setItem('trip-manager', JSON.stringify(tripManager));
      },

      logout: () => {
        set({
          tripManager: null,
          token: null,
          isAuthenticated: false,
        });
        localStorage.removeItem('trip-manager-token');
        localStorage.removeItem('trip-manager');
      },

      updateTripManager: (tripManagerData) => {
        const currentTripManager = get().tripManager;
        const updatedTripManager = { ...currentTripManager, ...tripManagerData };
        set({ tripManager: updatedTripManager });
        localStorage.setItem('trip-manager', JSON.stringify(updatedTripManager));
      },

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'trip-manager-auth-storage', // Separate localStorage key for trip manager
      partialize: (state) => ({
        tripManager: state.tripManager,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useTripManagerAuthStore;
