import BranchAtmResults from '@/components/find-branch/BranchAtmResults';
import BranchAtmSearch from '@/components/find-branch/BranchAtmSearch';
import HeaderTop from '@/components/global/HeaderTop';
import { useBranchAtmStore } from '@/store/useBranchAtmStore';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useState } from 'react';

const GoogleMapComponent = ({ branches, selectedBranch, onSelectBranch }) => {
  const center = selectedBranch
    ? { lat: selectedBranch.lat, lng: selectedBranch.lng }
    : branches.length > 0
    ? { lat: branches[0].lat, lng: branches[0].lng }
    : { lat: 23.8103, lng: 90.4125 };

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
  };

  return (
    <div className="w-full h-full overflow-hidden bg-gray-100 rounded-lg">
      <LoadScript
        googleMapsApiKey="AIzaSyBLsfAvQX6j_mF_ElU3oelgLFokalRnUxM"
        loadingElement={
          <div className="flex items-center justify-center w-full h-full">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 border-4 border-orange-200 rounded-full border-t-primary/50 animate-spin" />
              <p className="text-sm text-gray-600">Loading map...</p>
            </div>
          </div>
        }
      >
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={center}
          zoom={selectedBranch ? 15 : 11}
          options={mapOptions}
        >
          {branches.map((branch) => (
            <Marker
              key={branch.id}
              position={{ lat: branch.lat, lng: branch.lng }}
              onClick={() => onSelectBranch(branch)}
              icon={{
                path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                fillColor:
                  selectedBranch?.id === branch.id
                    ? '#dc2626'
                    : branch.type === 'Branch'
                    ? '#3b82f6'
                    : '#f97316',
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: '#fff',
                scale: selectedBranch?.id === branch.id ? 2.5 : 2,
                anchor: { x: 12, y: 22 },
              }}
              animation={
                selectedBranch?.id === branch.id ? window.google?.maps?.Animation?.BOUNCE : null
              }
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default function FindBranch({ isHideHeader }) {
  const [filters, setFilters] = useState({ branches: true, atms: true });

  const {
    locations,
    selectedLocation,
    loading,
    hasSearched,
    searchLocations,
    setSelectedLocation,
    clearSearch,
  } = useBranchAtmStore();

  const handleSearch = (query) => {
    if (!query) return;
    searchLocations(query, filters);
  };

  const handleClear = () => {
    clearSearch();
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Filter locations based on user filter preferences
  const filteredLocations = locations.filter(
    (loc) => (filters.branches && loc.type === 'Branch') || (filters.atms && loc.type === 'ATM'),
  );

  return (
    <div className="min-h-screen p-4 bg-gray-50 lg:p-6">
      <div className="mx-auto space-y-4 max-w-7xl lg:space-y-6">
        {/* Header */}
        {!isHideHeader && (
          <HeaderTop
            title="Find a Branch or ATM"
            text="Locate our branches and ATMs near you"
            link="/dashboard"
            linkText="Back to Dashboard"
          />
        )}

        {/* Main Content Card */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm lg:p-6">
          {/* Search */}
          <BranchAtmSearch
            onSearch={handleSearch}
            onClear={handleClear}
            loading={loading}
            filters={filters}
            onFilterChange={handleFilterChange}
            hasSearched={hasSearched}
          />

          {/* Results Grid - Only show after search */}
          {hasSearched && (
            <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
              {/* Map */}
              <div className="order-1 lg:order-2 h-[50vh] lg:h-[600px] lg:sticky lg:top-8">
                <GoogleMapComponent
                  branches={filteredLocations}
                  selectedBranch={selectedLocation}
                  onSelectBranch={setSelectedLocation}
                />
              </div>

              {/* Results */}
              <div className="order-2 lg:order-1">
                <BranchAtmResults
                  locations={filteredLocations}
                  loading={loading}
                  onSelectBranch={setSelectedLocation}
                  selectedBranch={selectedLocation}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
