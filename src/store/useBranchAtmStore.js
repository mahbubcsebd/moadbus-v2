// store/useBranchAtmStore.js
import { locateBankApi } from '@/api/endpoints'; // Ensure path is correct
import { parseBranchAtmResponse } from '@/utils/branchAtmHelpers';
import { create } from 'zustand';

export const useBranchAtmStore = create((set) => ({
  locations: [],
  selectedLocation: null,
  loading: false,
  error: null,
  hasSearched: false,

  searchLocations: async (searchQuery, filters = { branches: true, atms: true }) => {
    set({ loading: true, error: null });

    try {
      console.log('Searching for:', searchQuery);

      // API Call with Query
      // Note: Tumi chaile browser geolocation API use kore lat/lng pass korte paro
      const response = await locateBankApi({
        query: searchQuery,
        // lat: userLat, // Optional
        // lng: userLng  // Optional
      });

      // Parse Response
      const result = parseBranchAtmResponse(response);

      if (result.success && result.locations.length > 0) {
        // Filter Logic
        let filteredLocations = result.locations;

        if (!filters.branches) {
          filteredLocations = filteredLocations.filter((loc) => loc.type === 'ATM');
        }
        if (!filters.atms) {
          filteredLocations = filteredLocations.filter((loc) => loc.type === 'Branch');
        }

        set({
          locations: filteredLocations,
          selectedLocation: filteredLocations[0] || null,
          loading: false,
          hasSearched: true,
        });
      } else {
        set({
          locations: [],
          selectedLocation: null,
          loading: false,
          hasSearched: true,
          error: result.message || 'No locations found',
        });
      }
    } catch (error) {
      console.error('Search locations error:', error);
      set({
        locations: [],
        loading: false,
        hasSearched: true,
        error: error.message || 'Failed to search locations',
      });
    }
  },

  setSelectedLocation: (location) => set({ selectedLocation: location }),

  clearSearch: () =>
    set({
      locations: [],
      selectedLocation: null,
      hasSearched: false,
      error: null,
    }),
}));
