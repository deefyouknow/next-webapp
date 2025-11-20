"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

// โหลด Leaflet แบบ client-side เท่านั้น
const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
});

export default function Page() {
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  const [elev, setElev] = useState<number | null>(null);

  return (
    <div style={{ padding: 20 }}>
      <h2>Leaflet Next.js + GPS + Elevation</h2>

      <MapView pos={pos} setPos={setPos} elev={elev} setElev={setElev} />

      <div style={{ marginTop: 20 }}>
        <div>Lat: {pos?.lat ?? "-"}</div>
        <div>Lng: {pos?.lng ?? "-"}</div>
        <div>Elevation (m): {elev ?? "-"}</div>
      </div>
    </div>
  );
}
