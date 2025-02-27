import React, { useState, useEffect } from 'react';
import { MapPin, Compass, Building2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Create custom icon for markers
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Court {
  id: string;
  name: string;
  type: string;
  distance: number;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const mockCourts: Court[] = [
  {
    id: '1',
    name: 'Supreme Court of Sri Lanka',
    type: 'Supreme Court',
    distance: 0.5,
    address: 'Hulftsdorp Street, Colombo 12',
    coordinates: { lat: 6.9357, lng: 79.8560 }
  },
  {
    id: '2',
    name: 'Court of Appeal',
    type: 'Appellate Court',
    distance: 0.6,
    address: 'Superior Courts Complex, Colombo',
    coordinates: { lat: 6.9359, lng: 79.8558 }
  },
  {
    id: '3',
    name: 'Colombo High Court',
    type: 'High Court',
    distance: 1.2,
    address: 'Hulftsdorp Street, Colombo',
    coordinates: { lat: 6.9355, lng: 79.8563 }
  },
  {
    id: '4',
    name: 'Colombo District Court',
    type: 'District Court',
    distance: 1.5,
    address: 'District Court Complex, Colombo',
    coordinates: { lat: 6.9352, lng: 79.8565 }
  },
  {
    id: '5',
    name: 'Colombo Magistrate Court',
    type: 'Magistrate Court',
    distance: 2.0,
    address: 'Hulftsdorp Street, Colombo',
    coordinates: { lat: 6.9350, lng: 79.8568 }
  }
];

export default function CourtLocator() {
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);

  useEffect(() => {
    // Simulate loading courts based on location
    if (location) {
      setCourts(mockCourts);
    }
  }, [location]);

  const getLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(position);
        setLoading(false);
      },
      (error) => {
        setError('Unable to retrieve your location');
        setLoading(false);
      }
    );
  };

  const filteredCourts = selectedType === 'all' 
    ? courts 
    : courts.filter(court => court.type === selectedType);

  // Colombo, Sri Lanka coordinates
  const defaultCenter = { lat: 6.9271, lng: 79.8612 };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            Sri Lanka Court Locator
          </h1>
          <button
            onClick={getLocation}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Compass className="h-5 w-5" />
            {loading ? 'Locating...' : 'Find Nearby Courts'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Court Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Courts</option>
                <option value="Supreme Court">Supreme Court</option>
                <option value="Appellate Court">Appellate Court</option>
                <option value="High Court">High Court</option>
                <option value="District Court">District Court</option>
                <option value="Magistrate Court">Magistrate Court</option>
              </select>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {filteredCourts.map((court) => (
                <div
                  key={court.id}
                  className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                    selectedCourt?.id === court.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-500'
                  }`}
                  onClick={() => setSelectedCourt(court)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{court.name}</h3>
                      <p className="text-gray-600">{court.type}</p>
                      <div className="flex items-center gap-1 text-gray-500 mt-2">
                        <MapPin className="h-4 w-4" />
                        <span>{court.address}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">{court.distance} km away</span>
                      <button className="block mt-2 text-blue-600 hover:text-blue-800">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredCourts.length === 0 && location && (
                <div className="text-center py-8 text-gray-500">
                  No courts found matching your criteria
                </div>
              )}

              {!location && !loading && (
                <div className="text-center py-8 text-gray-500">
                  Click "Find Nearby Courts" to locate courts in your area
                </div>
              )}
            </div>
          </div>

          <div className="h-[600px] rounded-lg overflow-hidden border border-gray-200">
            <MapContainer
              center={[defaultCenter.lat, defaultCenter.lng]}
              zoom={14}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredCourts.map((court) => (
                <Marker
                  key={court.id}
                  position={[court.coordinates.lat, court.coordinates.lng]}
                  icon={customIcon}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold">{court.name}</h3>
                      <p className="text-sm text-gray-600">{court.type}</p>
                      <p className="text-sm text-gray-500 mt-1">{court.address}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}