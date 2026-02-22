"use client";

import type { ComponentType } from "react";
import { Circle, MapContainer, TileLayer } from "react-leaflet";

const CENTER: [number, number] = [50.1109, 8.6821];
const HOTSPOTS: [number, number][] = [
  [50.1118, 8.666],
  [50.1081, 8.6833],
  [50.1132, 8.697],
];

const MapContainerCompat = MapContainer as unknown as ComponentType<Record<string, unknown>>;
const TileLayerCompat = TileLayer as unknown as ComponentType<Record<string, unknown>>;
const CircleCompat = Circle as unknown as ComponentType<Record<string, unknown>>;

function Hotspot({ position }: { position: [number, number] }) {
  return (
    <>
      <CircleCompat
        center={position}
        radius={70}
        pathOptions={{ color: "#ffffff", weight: 3, fillColor: "#f29a1f", fillOpacity: 1 }}
      />
      <CircleCompat
        center={position}
        radius={18}
        pathOptions={{ color: "#ffffff", weight: 0, fillColor: "#ffffff", fillOpacity: 1 }}
      />
    </>
  );
}

export default function LocalIntelligenceMap() {
  return (
    <MapContainerCompat
      center={CENTER}
      zoom={13}
      zoomControl={false}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayerCompat
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {HOTSPOTS.map((position) => (
        <Hotspot key={`${position[0]}-${position[1]}`} position={position} />
      ))}
    </MapContainerCompat>
  );
}
