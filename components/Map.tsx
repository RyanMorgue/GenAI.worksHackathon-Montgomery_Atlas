'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import react-leaflet components to prevent SSR 'window is not defined' errors
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

// We also need to dynamically import leaflet CSS in a useEffect, or global css.
// Leaflet CSS is handled typically via an import in the standard component tree, but Next.js
// might require standard import inside the dynamic block or _app.tsx

import 'leaflet/dist/leaflet.css'; // Usually fine here if client bounded

interface POI {
    id: string;
    name: string;
    type: string;
    lat: number;
    lng: number;
    priceRange?: string;
    openingStatus?: 'Open' | 'Closed' | 'Unknown';
    distance?: string;
}

interface MapProps {
    pois: POI[];
    centerLat?: number;
    centerLng?: number;
    zoom?: number;
}

export default function SmartCityMap({ pois, centerLat = 32.3792, centerLng = -86.3077, zoom = 14 }: MapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Fix Leaflet's default icon path issues in React
        import('leaflet').then(L => {
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: '/marker-icon-2x.png',
                iconUrl: '/marker-icon.png',
                shadowUrl: '/marker-shadow.png',
            });
        });
    }, []);

    if (!isMounted) return <div className="h-64 w-full bg-slate-100 animate-pulse rounded-lg">Loading Map...</div>;

    return (
        <div style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden' }} className="shadow-lg border border-slate-200">
            {/* The MapContainer component must be rendered client-side only */}
            <MapContainer
                center={[centerLat, centerLng]}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
                />

                {pois.map(poi => (
                    <Marker key={poi.id} position={[poi.lat, poi.lng]}>
                        <Popup>
                            <div className="p-2 min-w-[150px]">
                                <h3 className="font-bold text-lg">{poi.name}</h3>
                                <p className="text-sm text-slate-500 capitalize">{poi.type}</p>

                                <div className="mt-2 text-sm grid grid-cols-2 gap-1 text-slate-700">
                                    {poi.distance && <span>📍 {poi.distance} miles</span>}
                                    {poi.priceRange && <span>💰 {poi.priceRange}</span>}
                                    {poi.openingStatus && (
                                        <span className={`font-semibold ${poi.openingStatus === 'Open' ? 'text-green-600' : 'text-slate-600'}`}>
                                            ⏱ {poi.openingStatus}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
