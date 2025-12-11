import { MapPin } from 'lucide-react';
import { useState } from 'react';

const BranchAtmSearch = ({ onSearch, onClear, loading, filters, onFilterChange, hasSearched }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  const handleFilterToggle = (filterType) => {
    onFilterChange({
      ...filters,
      [filterType]: !filters[filterType],
    });
  };

  return (
    <div className="space-y-4">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="flex flex-col items-stretch gap-4 md:flex-row">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter Zip Code or City, State"
          className="w-full h-12 px-4 text-gray-900 placeholder-gray-400 transition-colors bg-white border border-gray-300 rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="flex-1 h-12 px-6 font-semibold text-white transition-colors bg-primary rounded-lg sm:flex-none sm:px-8 hover:bg-primary disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>

          {hasSearched && (
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 h-12 px-4 font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg sm:flex-none sm:px-6 hover:border-gray-400 whitespace-nowrap"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Simple Filters */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.branches}
            onChange={() => handleFilterToggle('branches')}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
          />
          <MapPin className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">Branches</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.atms}
            onChange={() => handleFilterToggle('atms')}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
          />
          <MapPin className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">ATMs</span>
        </label>
      </div>
    </div>
  );
};

export default BranchAtmSearch;
