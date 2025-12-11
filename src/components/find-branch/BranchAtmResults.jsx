import { Clock, Loader2, MapPin, Phone, Printer } from 'lucide-react';

const BranchAtmResults = ({ locations, loading, onSelectBranch, selectedBranch }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <Loader2 className="w-8 h-8 mb-3 text-primary animate-spin" />
        <p className="text-sm text-gray-600">Loading locations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-baseline gap-2">
        <h3 className="text-xl font-semibold text-gray-800">Branches</h3>
        <span className="text-sm text-gray-600">
          Showing {locations.length} location{locations.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Results */}
      {locations.length === 0 ? (
        <div className="p-10 text-center text-gray-500 bg-white border border-gray-200 rounded-lg">
          <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No locations found</p>
          <p className="mt-1 text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-0 border border-gray-200 rounded-lg overflow-hidden max-h-[calc(100vh-20rem)] overflow-y-auto">
          {locations.map((branch) => (
            <div
              key={branch.id}
              onClick={() => onSelectBranch(branch)}
              className={`p-4 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
                selectedBranch?.id === branch.id
                  ? 'bg-blue-50 border-l-4 border-l-blue-600'
                  : 'hover:bg-gray-50 border-l-4 border-l-transparent'
              }`}
            >
              {/* Branch Header */}
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    branch.type === 'Branch'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {branch.type}
                </span>
              </div>

              <div className="flex items-start gap-2">
                <MapPin
                  className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    branch.type === 'Branch' ? 'text-blue-600' : 'text-primary'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="mb-1 font-semibold text-gray-900">{branch.name}</h4>

                  <div className="space-y-1 text-sm text-gray-600">
                    {/* Address */}
                    <p>{branch.address}</p>

                    {/* Distance */}
                    {branch.distance && (
                      <p className="text-xs text-gray-500">
                        {branch.distance} ({branch.duration || '1 min'})
                      </p>
                    )}

                    {/* Hours */}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{branch.time}</span>
                    </div>

                    {/* Phone */}
                    {branch.phone && branch.phone !== 'N/A' && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>Phone Number: {branch.phone}</span>
                      </div>
                    )}

                    {/* Fax */}
                    {branch.fax && branch.fax !== 'N/A' && (
                      <div className="flex items-center gap-2">
                        <Printer className="w-4 h-4 text-gray-400" />
                        <span>Fax Number: {branch.fax}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BranchAtmResults;
