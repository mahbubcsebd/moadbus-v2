import GlobalInput from '@/components/global/GlobalInput';
import { useBranchAtmStore } from '@/store/useBranchAtmStore';
import { motion } from 'framer-motion';
import { Loader2, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';

const BranchItem = ({ branch, onSelect }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="border-b border-gray-100 py-4 hover:bg-gray-50 transition-colors cursor-pointer px-3 flex items-start gap-3"
    onClick={() => onSelect(branch)}
  >
    <div
      className={`mt-1 p-1.5 rounded-full ${
        branch.type === 'ATM' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-primary'
      }`}
    >
      <MapPin size={16} />
    </div>
    <div>
      <div
        className={`text-sm font-semibold ${
          branch.type === 'ATM' ? 'text-blue-700' : 'text-gray-900'
        }`}
      >
        {branch.name}
      </div>
      <div className="text-sm text-gray-600 mt-0.5">{branch.address}</div>
      {branch.distance && <div className="text-xs text-gray-400 mt-1">{branch.distance}</div>}
    </div>
  </motion.div>
);

const StepLocation = ({ onNext }) => {
  const [searchInput, setSearchInput] = useState('');

  const { locations, loading, searchLocations, setSelectedLocation } = useBranchAtmStore();

  const [hasTriggeredSearch, setHasTriggeredSearch] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setHasTriggeredSearch(true);
    await searchLocations(searchInput.trim());
  };

  const handleBranchSelect = (branch) => {
    setSelectedLocation(branch);
    onNext({ location: branch });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold text-gray-800">Location Selection</h3>

      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full max-w-sm">
          <GlobalInput
            label="City, State or Zip Code"
            required
            placeholder="Enter city, state or zip code"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <Button
          variant="primary"
          type="submit"
          loading={loading}
          size="default"
          className="w-full md:w-auto h-12 bg-primary hover:bg-primary text-white"
        >
          Search
        </Button>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-gray-500 mt-2">Searching locations...</p>
        </div>
      )}

      {/* Results List form Store */}
      {!loading && hasTriggeredSearch && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.5 }}
          className="border border-gray-200 rounded-lg overflow-hidden"
        >
          {locations.length > 0 ? (
            <div className="divide-y divide-gray-100 max-h-[50vh] overflow-y-auto bg-white">
              <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Select a location
              </div>
              {locations.map((branch) => (
                <BranchItem key={branch.id} branch={branch} onSelect={handleBranchSelect} />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              <MapPin className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p>No locations found matching "{searchInput}".</p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default StepLocation;
