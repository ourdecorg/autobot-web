'use client';
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Booking } from '@/types';
import { TEL_AVIV_CENTER } from '@/utils/mockData';

// Fix Leaflet default icons in webpack
if (typeof window !== 'undefined') {
  // @ts-expect-error - Leaflet internal property
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

function makeIcon(emoji: string, extraClass: string) {
  return L.divIcon({
    html: `<div class="map-marker ${extraClass}">${emoji}</div>`,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
}

function MapCenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], map.getZoom(), { duration: 1 });
  }, [lat, lng, map]);
  return null;
}

interface Props {
  booking: Booking;
}

export default function TrackingMapInner({ booking }: Props) {
  const center = booking.vehicleLocation ?? TEL_AVIV_CENTER;
  const showInspector = ['inspector_assigned', 'inspector_en_route', 'inspection_in_progress'].includes(booking.status);
  const showVehicleMoving = ['transport_en_route', 'at_institute'].includes(booking.status);

  const routePoints: [number, number][] = [];
  if (booking.inspectorLocation && showInspector) {
    routePoints.push([booking.inspectorLocation.latitude, booking.inspectorLocation.longitude]);
  }
  if (booking.vehicleLocation) {
    routePoints.push([booking.vehicleLocation.latitude, booking.vehicleLocation.longitude]);
  }

  return (
    <MapContainer
      center={[center.latitude, center.longitude]}
      zoom={14}
      scrollWheelZoom={false}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {/* Home marker (booking address) */}
      <Marker
        position={[TEL_AVIV_CENTER.latitude, TEL_AVIV_CENTER.longitude]}
        icon={makeIcon('🏠', 'map-marker--home')}
      >
        <Popup>כתובת הלקוח</Popup>
      </Marker>

      {/* Institute marker */}
      <Marker
        position={[32.0500, 34.7600]}
        icon={makeIcon('🏢', 'map-marker--institute')}
      >
        <Popup>מכון רישוי תל אביב</Popup>
      </Marker>

      {/* Inspector marker */}
      {showInspector && booking.inspectorLocation && (
        <Marker
          position={[booking.inspectorLocation.latitude, booking.inspectorLocation.longitude]}
          icon={makeIcon('👷', 'map-marker--inspector')}
        >
          <Popup>{booking.inspectorName ?? 'בוחן'}</Popup>
        </Marker>
      )}

      {/* Vehicle marker (when being transported) */}
      {showVehicleMoving && booking.vehicleLocation && (
        <Marker
          position={[booking.vehicleLocation.latitude, booking.vehicleLocation.longitude]}
          icon={makeIcon('🚗', 'map-marker--vehicle')}
        >
          <Popup>הרכב שלך</Popup>
        </Marker>
      )}

      {/* Route line */}
      {routePoints.length >= 2 && (
        <Polyline positions={routePoints} color="#3B82F6" weight={3} dashArray="6 4" opacity={0.7} />
      )}

      {/* Auto-center on active marker */}
      {showInspector && booking.inspectorLocation && (
        <MapCenter lat={booking.inspectorLocation.latitude} lng={booking.inspectorLocation.longitude} />
      )}
      {showVehicleMoving && booking.vehicleLocation && (
        <MapCenter lat={booking.vehicleLocation.latitude} lng={booking.vehicleLocation.longitude} />
      )}
    </MapContainer>
  );
}
