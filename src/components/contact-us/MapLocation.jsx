import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Globe, MapPin, Navigation, Phone, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem',
};

const libraries = ['places'];

const MapLocation = ({ locationData }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [placeDetails, setPlaceDetails] = useState(null);
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCardExpanded, setIsCardExpanded] = useState(false); // Mobile: collapsed by default

  const center = {
    lat: locationData.lat || 12.1251623,
    lng: locationData.lng || -68.9033236,
  };

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: true,
    mapTypeControl: true,
    fullscreenControl: true,
    mapTypeControlOptions: {
      style: window.google?.maps?.MapTypeControlStyle?.HORIZONTAL_BAR,
      position: window.google?.maps?.ControlPosition?.TOP_RIGHT,
      mapTypeIds: ['roadmap', 'satellite', 'hybrid'],
    },
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }],
      },
    ],
  };

  // Fetch place details from Google Places API
  useEffect(() => {
    if (map && window.google) {
      const service = new window.google.maps.places.PlacesService(map);

      const request = {
        location: center,
        radius: '50',
        type: ['establishment'],
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results[0]) {
          const detailRequest = {
            placeId: results[0].place_id,
            fields: [
              'name',
              'formatted_address',
              'rating',
              'user_ratings_total',
              'geometry',
              'formatted_phone_number',
              'website',
              'opening_hours',
            ],
          };

          service.getDetails(detailRequest, (place, detailStatus) => {
            if (detailStatus === window.google.maps.places.PlacesServiceStatus.OK) {
              setPlaceDetails({
                name: place.name,
                address: place.formatted_address,
                rating: place.rating,
                reviewsCount: place.user_ratings_total,
                phone: place.formatted_phone_number,
                website: place.website,
                isOpen: place.opening_hours?.isOpen(),
              });
            }
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      });
    }
  }, [map, center.lat, center.lng]);

  const onMapLoad = (mapInstance) => {
    setMap(mapInstance);
    setMapLoaded(true);
  };

  const displayData = placeDetails || {
    name: locationData.name,
    address: locationData.address1,
    rating: null,
    reviewsCount: null,
    phone: null,
    website: null,
  };

  const openInGoogleMaps = (e) => {
    e.preventDefault();
    const url = `https://www.google.com/maps/search/?api=1&query=${center.lat},${center.lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openDirections = (e) => {
    e.preventDefault();
    const url = `https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-gray-200 rounded-lg">
      <LoadScript
        googleMapsApiKey={
          import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBLsfAvQX6j_mF_ElU3oelgLFokalRnUxM'
        }
        libraries={libraries}
        onLoad={() => setMapLoaded(true)}
        loadingElement={
          <div className="flex items-center justify-center w-full h-full">
            <div className="w-12 h-12 border-b-2 border-primary rounded-full animate-spin"></div>
          </div>
        }
      >
        <GoogleMap
          key={center.lat + '-' + center.lng}
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={15}
          options={mapOptions}
          onLoad={onMapLoad}
        >
          <Marker
            position={center}
            icon={{
              path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
              fillColor: '#f97316',
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#fff',
              scale: 2,
              anchor: { x: 12, y: 22 },
            }}
            animation={typeof window !== 'undefined' && window.google?.maps?.Animation?.BOUNCE}
          />
        </GoogleMap>
      </LoadScript>

      {/* Location Details Card */}
      <motion.div
        key={center.lat + '-' + center.lng}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="absolute bottom-4 left-4 right-4 md:top-4 md:left-4 md:right-auto h-auto inline-table bg-white rounded-xl shadow-2xl md:max-w-[340px] z-20 border-2 border-primary/10"
      >
        {/* Mobile: Collapsible Header */}
        <div className="md:hidden">
          <button
            onClick={() => setIsCardExpanded(!isCardExpanded)}
            className="flex items-center justify-between w-full p-3 transition-colors hover:bg-gray-50 rounded-t-xl"
          >
            <div className="flex items-center flex-1 min-w-0 gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 bg-linear-to-br from-primary/10 to-primary/20">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h4 className="text-sm font-bold text-gray-900 truncate">{displayData.name}</h4>
                <p className="text-xs text-gray-500 truncate">{displayData.address}</p>
              </div>
            </div>
            <div className="ml-2 shrink-0">
              {isCardExpanded ? (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              )}
            </div>
          </button>

          {/* Mobile: Expandable Content */}
          <AnimatePresence>
            {isCardExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-3 pt-0 border-t border-gray-100">
                  {/* Rating and Reviews */}
                  {displayData.rating && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-gray-900">
                          {displayData.rating.toFixed(1)}
                        </span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              className={`w-3.5 h-3.5 ${
                                index < Math.floor(displayData.rating)
                                  ? 'text-primary fill-primary/50'
                                  : 'text-gray-300 fill-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {displayData.reviewsCount && (
                        <span className="text-xs text-gray-500">
                          ({displayData.reviewsCount} reviews)
                        </span>
                      )}
                    </div>
                  )}

                  {/* Contact Information */}
                  {(displayData.phone || displayData.website) && (
                    <div className="flex flex-col gap-2 pb-3 mb-3 border-b border-gray-100">
                      {displayData.phone && (
                        <a
                          href={`tel:${displayData.phone}`}
                          className="flex items-center gap-2 text-xs text-gray-700 transition-colors hover:text-primary"
                        >
                          <Phone className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{displayData.phone}</span>
                        </a>
                      )}
                      {displayData.website && (
                        <a
                          href={displayData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs text-gray-700 transition-colors hover:text-primary"
                        >
                          <Globe className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Visit website</span>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={openInGoogleMaps}
                      className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>View map</span>
                    </button>
                    <button
                      onClick={openDirections}
                      className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-white transition-colors bg-primary rounded-lg hover:bg-orange-700"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Directions</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop: Always Visible Content */}
        <div className="hidden p-4 md:block">
          <div className="flex items-start gap-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full shrink-0 bg-linear-to-br from-primary/10 to-primary/20">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="text-sm font-bold text-gray-900 truncate">{displayData.name}</h4>
                {placeDetails?.isOpen !== undefined && (
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                      placeDetails.isOpen
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {placeDetails.isOpen ? 'Open' : 'Closed'}
                  </span>
                )}
              </div>
              <p className="text-xs leading-relaxed text-gray-600 line-clamp-2">
                {displayData.address}
              </p>

              {/* Rating and Reviews */}
              {displayData.rating && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-gray-900">
                      {displayData.rating.toFixed(1)}
                    </span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className={`w-3.5 h-3.5 ${
                            index < Math.floor(displayData.rating)
                              ? 'text-primary fill-primary/50'
                              : 'text-gray-300 fill-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {displayData.reviewsCount && (
                    <span className="text-xs text-gray-500">
                      ({displayData.reviewsCount} reviews)
                    </span>
                  )}
                </div>
              )}

              {/* Contact Information */}
              {(displayData.phone || displayData.website) && (
                <div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-gray-100">
                  {displayData.phone && (
                    <a
                      href={`tel:${displayData.phone}`}
                      className="flex items-center gap-2 text-xs text-gray-700 transition-colors hover:text-primary"
                    >
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{displayData.phone}</span>
                    </a>
                  )}
                  {displayData.website && (
                    <a
                      href={displayData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-gray-700 transition-colors hover:text-primary"
                    >
                      <Globe className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Visit website</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
            <button
              onClick={openInGoogleMaps}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>View larger map</span>
            </button>
            <button
              onClick={openDirections}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-orange-700 rounded-md transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Directions</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MapLocation;
