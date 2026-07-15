"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import Link from "next/link";
import { Star } from "lucide-react";

export interface Shop {
  id: number;
  name: string;
  lat: number;
  lng: number;
  status: "open" | "busy" | "closed";
  pricePerSheet: number;
  distance: string;
  rating: number;
  reviews: number;
  waitTime: string;
  address: string;
}

const statusDot: Record<Shop["status"], string> = {
  open: "#2563eb", // blue-600
  busy: "#93c5fd", // blue-300
  closed: "#94a3b8", // slate-400
};

const statusBadge: Record<Shop["status"], string> = {
  open: "bg-blue-100 text-blue-700",
  busy: "bg-blue-50 text-blue-500",
  closed: "bg-slate-100 text-slate-500",
};

const statusText: Record<Shop["status"], string> = {
  open: "Open",
  busy: "Busy",
  closed: "Closed",
};

// Build a colored pin icon per shop status without needing external image assets.
function buildIcon(status: Shop["status"]) {
  const color = statusDot[status];
  return L.divIcon({
    className: "shop-marker",
    html: `
      <div style="
        width: 32px; height: 32px; border-radius: 9999px;
        background: ${color}; display:flex; align-items:center; justify-content:center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.25); border: 2px solid white;
      ">
        <div style="width:8px;height:8px;border-radius:9999px;background:white;"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

// Recenters the map if the shop list changes (e.g. after a search/filter).
function FitBounds({ shops }: { shops: Shop[] }) {
  const map = useMap();
  useEffect(() => {
    if (shops.length === 0) return;
    const bounds = L.latLngBounds(shops.map((s) => [s.lat, s.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
  }, [shops, map]);
  return null;
}

export default function ShopMap({ shops }: { shops: Shop[] }) {
  const center: [number, number] =
    shops.length > 0
      ? [shops[0].lat, shops[0].lng]
      : [5.1035, -1.2872]; // University of Cape Coast, fallback center

  return (
    <MapContainer
      center={center}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds shops={shops} />
      {shops.map((shop) => (
        <Marker key={shop.id} position={[shop.lat, shop.lng]} icon={buildIcon(shop.status)}>
          <Popup minWidth={220}>
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-gray-900 leading-tight">{shop.name}</p>
                  <p className="text-xs text-gray-500">{shop.address}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${statusBadge[shop.status]}`}>
                  {statusText[shop.status]}
                </span>
              </div>

              <div className="text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Distance</span>
                  <span className="font-medium text-gray-900">{shop.distance}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Price/sheet</span>
                  <span className="font-medium text-gray-900">GHS {shop.pricePerSheet.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Est. time</span>
                  <span className="font-medium text-gray-900">{shop.waitTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Rating</span>
                  <span className="font-medium text-gray-900 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-blue-500 fill-current" />
                    {shop.rating} ({shop.reviews})
                  </span>
                </div>
              </div>

              <Link
                href="/order/new/shops"
                className="mt-1 w-full py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors block text-center"
              >
                Order Here
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}